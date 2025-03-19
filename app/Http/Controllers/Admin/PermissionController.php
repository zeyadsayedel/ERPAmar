<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Permission\StorePermissionRequest;
use App\Http\Requests\Permission\UpdatePermissionRequest;
use App\Services\RolePermissionService;
use App\Traits\AuthorizesModuleActions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    use AuthorizesModuleActions;

    

    public function __construct(
        protected RolePermissionService $rolePermissionService
    ) {
        // Middleware now handled in routes
        $this->module = 'permission';
    }

    /**
     * Display a listing of the permissions.
     */
    public function index(): Response
    {
        // Get permissions grouped by module
        $permissionsByModule = $this->rolePermissionService->getPermissionsByModule();

        return Inertia::render('Admin/Permission/Index', [
            'permissionsByModule' => $permissionsByModule,
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    /**
     * Show the form for creating a new permission.
     */
    public function create(Request $request): Response
    {
        // Allow pre-selecting a module from the query string
        $moduleParam = $request->query('module');
        
        return Inertia::render('Admin/Permission/Create', [
            'moduleParam' => $moduleParam,
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    /**
     * Store a newly created permission in storage.
     */
    public function store(StorePermissionRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();
            
            // Handle module registration
            if ($request->has('module') && $request->has('actions')) {
                $this->rolePermissionService->registerModulePermissions(
                    $validated['module'],
                    $validated['actions']
                );
                
                return redirect()->route('admin.permissions.index')
                    ->with('success', 'Module permissions registered successfully.');
            }
            
            // Handle single permission creation
            $permission = $this->rolePermissionService->createPermission($validated['name']);
            
            return redirect()->route('admin.permissions.index')
                ->with('success', 'Permission created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create permission: ' . $e->getMessage(), ['exception' => $e]);
            
            return redirect()->back()
                ->with('error', 'Failed to create permission: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified permission.
     */
    public function show(Permission $permission): Response
    {
        return Inertia::render('Admin/Permission/Show', [
            'permission' => $permission,
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    /**
     * Show the form for editing the specified permission.
     */
    public function edit(Permission $permission): Response
    {
        return Inertia::render('Admin/Permission/Edit', [
            'permission' => $permission,
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    /**
     * Update the specified permission in storage.
     */
    public function update(UpdatePermissionRequest $request, Permission $permission): RedirectResponse
    {
        try {
            $validated = $request->validated();
            
            $permission->update(['name' => $validated['name']]);
            
            // Handle redirect based on where the edit came from
            $redirectRoute = $request->query('redirect', 'admin.permissions.index');
            $redirectParam = [];
            
            // If redirecting back to a module permissions page
            if ($redirectRoute === 'admin.permissions.module') {
                // Extract module from permission name
                $parts = explode(':', $permission->name);
                $module = $parts[0] ?? 'general';
                $redirectParam = [$module];
            }
            
            return redirect()->route($redirectRoute, $redirectParam)
                ->with('success', 'Permission updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update permission: ' . $e->getMessage(), ['exception' => $e]);
            
            return redirect()->back()
                ->with('error', 'Failed to update permission: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified permission from storage.
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        try {
            // Extract module from permission name for potential redirect
            $parts = explode(':', $permission->name);
            $module = $parts[0] ?? null;
            
            $permission->delete();
            
            // If a referer header is set and it contains "module", redirect back to module
            $referer = request()->header('referer');
            if ($referer && $module && strpos($referer, 'module/' . $module) !== false) {
                return redirect()->route('admin.permissions.module', $module)
                    ->with('success', 'Permission deleted successfully.');
            }
            
            return redirect()->route('admin.permissions.index')
                ->with('success', 'Permission deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete permission: ' . $e->getMessage(), ['exception' => $e]);
            
            return redirect()->back()
                ->with('error', 'Failed to delete permission: ' . $e->getMessage());
        }
    }

    /**
     * Register standard permissions for a module
     */
    public function registerModule(StorePermissionRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();
            
            $this->rolePermissionService->registerModulePermissions(
                $validated['module'],
                $validated['actions'] ?? []
            );
            
            return redirect()->route('admin.permissions.index')
                ->with('success', 'Module permissions registered successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to register module permissions: ' . $e->getMessage(), ['exception' => $e]);
            
            return redirect()->back()
                ->with('error', 'Failed to register module permissions: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the permissions for a specific module.
     */
    public function modulePermissions(string $module): Response
    {
        try {
            $permissions = $this->rolePermissionService->getModulePermissions($module);
            $standardActions = ['view', 'list', 'create', 'update', 'delete'];
            
            return Inertia::render('Admin/Permission/ModulePermissions', [
                'module' => $module,
                'permissions' => $permissions,
                'availableActions' => $standardActions,
                'userPermissions' => $this->getUserModulePermissions(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get module permissions: ' . $e->getMessage(), ['exception' => $e]);
            
            return Inertia::render('Admin/Permission/Index', [
                'error' => 'Failed to get module permissions: ' . $e->getMessage(),
                'userPermissions' => $this->getUserModulePermissions(),
            ]);
        }
    }

    /**
     * Add individual permissions to a module.
     */
    public function addPermission(StorePermissionRequest $request, string $module): RedirectResponse
    {
        try {
            $validated = $request->validated();
            
            // The name is already constructed in the StorePermissionRequest
            $permissionName = $validated['name'];
            
            // Check if permission already exists
            if (Permission::where('name', $permissionName)->exists()) {
                return redirect()->back()
                    ->with('error', "Permission '{$permissionName}' already exists.");
            }
            
            // Create the permission
            $this->rolePermissionService->createPermission($permissionName);
            
            return redirect()->route('admin.permissions.module', $module)
                ->with('success', "Permission '{$permissionName}' created successfully.");
        } catch (\Exception $e) {
            Log::error('Failed to add permission: ' . $e->getMessage(), ['exception' => $e]);
            
            return redirect()->back()
                ->with('error', 'Failed to add permission: ' . $e->getMessage())
                ->withInput();
        }
    }
}
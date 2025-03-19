<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Services\RolePermissionService;
use App\Traits\AuthorizesModuleActions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    use AuthorizesModuleActions;
    
    public function __construct(
        protected RolePermissionService $rolePermissionService
    ) {
        // Middleware now handled in routes
        $this->module = 'role';
    }

    /**
     * Display a listing of the roles.
     */
    public function index(): Response
    {
        $roles = $this->rolePermissionService->getAllRoles();
        
        return Inertia::render('Admin/Role/Index', [
            'roles' => $roles,
            'userPermissions' => $this->getUserModulePermissions(), // Renamed for clarity
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create(): Response
    {
        $allPermissions = $this->rolePermissionService->getStandardizedPermissionList();
        
        return Inertia::render('Admin/Role/Create', [
            'allPermissions' => $allPermissions, // Renamed for clarity
            'userPermissions' => $this->getUserModulePermissions(), // Renamed for clarity
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(StoreRoleRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();
            
            $role = $this->rolePermissionService->createRole(
                $validated['name'],
                $validated['permissions'] ?? []
            );
            
            return redirect()->route('admin.roles.index')
                ->with('success', 'Role created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create role: ' . $e->getMessage(), ['exception' => $e]);
            
            return redirect()->back()
                ->with('error', 'Failed to create role: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified role.
     */
    public function show(Role $role): Response
    {
        return Inertia::render('Admin/Role/Show', [
            'role' => $role->load('permissions'),
            'userPermissions' => $this->getUserModulePermissions(), // Renamed for clarity
        ]);
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role): Response
    {
        $allPermissions = $this->rolePermissionService->getStandardizedPermissionList();
        $rolePermissions = $role->permissions->pluck('id')->toArray();
        
        return Inertia::render('Admin/Role/Edit', [
            'role' => $role,
            'allPermissions' => $allPermissions, // Renamed for clarity
            'rolePermissions' => $rolePermissions,
            'userPermissions' => $this->getUserModulePermissions(), // Renamed for clarity
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        try {
            $validated = $request->validated();
            
            $this->rolePermissionService->updateRole(
                $role->id,
                $validated['name'],
                $validated['permissions'] ?? []
            );
            
            return redirect()->route('admin.roles.index')
                ->with('success', 'Role updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update role: ' . $e->getMessage(), ['exception' => $e]);
            
            return redirect()->back()
                ->with('error', 'Failed to update role: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        try {
            $deleted = $this->rolePermissionService->deleteRole($role->id);
            
            if (!$deleted) {
                throw new \Exception('Unable to delete role');
            }
            
            return redirect()->route('admin.roles.index')
                ->with('success', 'Role deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete role: ' . $e->getMessage(), ['exception' => $e]);
            
            return redirect()->back()
                ->with('error', 'Failed to delete role: ' . $e->getMessage());
        }
    }
}
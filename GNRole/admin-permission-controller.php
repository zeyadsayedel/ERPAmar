<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Permission\StorePermissionRequest;
use App\Http\Requests\Permission\UpdatePermissionRequest;
use App\Services\RolePermissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    protected RolePermissionService $rolePermissionService;
    
    public function __construct(RolePermissionService $rolePermissionService)
    {
        $this->rolePermissionService = $rolePermissionService;
        $this->middleware('permission:permission:list')->only('index', 'show');
        $this->middleware('permission:permission:create')->only('create', 'store');
        $this->middleware('permission:permission:update')->only('edit', 'update');
        $this->middleware('permission:permission:delete')->only('destroy');
    }

    /**
     * Display a listing of the permissions.
     */
    public function index(): Response
    {
        $permissionsByModule = $this->rolePermissionService->getPermissionsByModule();
        
        return Inertia::render('Admin/Permission/Index', [
            'permissionsByModule' => $permissionsByModule,
        ]);
    }

    /**
     * Show the form for creating a new permission.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Permission/Create');
    }

    /**
     * Store a newly created permission in storage.
     */
    public function store(StorePermissionRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        
        $permission = $this->rolePermissionService->createPermission($validated['name']);
        
        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission created successfully.');
    }

    /**
     * Display the specified permission.
     */
    public function show(string $id): Response
    {
        $permission = Permission::findOrFail($id);
        
        return Inertia::render('Admin/Permission/Show', [
            'permission' => $permission,
        ]);
    }

    /**
     * Show the form for editing the specified permission.
     */
    public function edit(string $id): Response
    {
        $permission = Permission::findOrFail($id);
        
        return Inertia::render('Admin/Permission/Edit', [
            'permission' => $permission,
        ]);
    }

    /**
     * Update the specified permission in storage.
     */
    public function update(UpdatePermissionRequest $request, string $id): RedirectResponse
    {
        $validated = $request->validated();
        
        $permission = Permission::findOrFail($id);
        $permission->update(['name' => $validated['name']]);
        
        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission updated successfully.');
    }

    /**
     * Remove the specified permission from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();
        
        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission deleted successfully.');
    }
    
    /**
     * Register standard permissions for a module
     */
    public function registerModule(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'module' => 'required|string|max:50',
            'actions' => 'sometimes|array',
            'actions.*' => 'string|max:50',
        ]);
        
        $this->rolePermissionService->registerModulePermissions(
            $validated['module'],
            $validated['actions'] ?? []
        );
        
        return redirect()->route('admin.permissions.index')
            ->with('success', 'Module permissions registered successfully.');
    }
}

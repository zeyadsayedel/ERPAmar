<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Services\RolePermissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    protected RolePermissionService $rolePermissionService;
    
    public function __construct(RolePermissionService $rolePermissionService)
    {
        $this->rolePermissionService = $rolePermissionService;
        $this->middleware('permission:role:list')->only('index', 'show');
        $this->middleware('permission:role:create')->only('create', 'store');
        $this->middleware('permission:role:update')->only('edit', 'update');
        $this->middleware('permission:role:delete')->only('destroy');
    }

    /**
     * Display a listing of the roles.
     */
    public function index(): Response
    {
        $roles = $this->rolePermissionService->getAllRoles();
        
        return Inertia::render('Admin/Role/Index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create(): Response
    {
        $permissions = $this->rolePermissionService->getStandardizedPermissionList();
        
        return Inertia::render('Admin/Role/Create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        
        $role = $this->rolePermissionService->createRole(
            $validated['name'],
            $validated['permissions'] ?? []
        );
        
        return redirect()->route('admin.roles.index')
            ->with('success', 'Role created successfully.');
    }

    /**
     * Display the specified role.
     */
    public function show(string $id): Response
    {
        $role = $this->rolePermissionService->getRoleById($id);
        
        if (!$role) {
            abort(404, 'Role not found');
        }
        
        return Inertia::render('Admin/Role/Show', [
            'role' => $role,
        ]);
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(string $id): Response
    {
        $role = $this->rolePermissionService->getRoleById($id);
        
        if (!$role) {
            abort(404, 'Role not found');
        }
        
        $permissions = $this->rolePermissionService->getStandardizedPermissionList();
        $rolePermissions = $role->permissions->pluck('id')->toArray();
        
        return Inertia::render('Admin/Role/Edit', [
            'role' => $role,
            'permissions' => $permissions,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(UpdateRoleRequest $request, string $id): RedirectResponse
    {
        $validated = $request->validated();
        
        $role = $this->rolePermissionService->updateRole(
            $id,
            $validated['name'],
            $validated['permissions'] ?? []
        );
        
        if (!$role) {
            abort(404, 'Role not found');
        }
        
        return redirect()->route('admin.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        $deleted = $this->rolePermissionService->deleteRole($id);
        
        if (!$deleted) {
            abort(404, 'Role not found');
        }
        
        return redirect()->route('admin.roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}

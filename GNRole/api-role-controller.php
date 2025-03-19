<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Services\RolePermissionService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Spatie\Permission\Models\Role;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;

class RoleController extends Controller
{
    protected RolePermissionService $rolePermissionService;
    
    public function __construct(RolePermissionService $rolePermissionService)
    {
        $this->rolePermissionService = $rolePermissionService;
        $this->middleware('permission:role:list')->only('index', 'show');
        $this->middleware('permission:role:create')->only('store');
        $this->middleware('permission:role:update')->only('update');
        $this->middleware('permission:role:delete')->only('destroy');
    }

    /**
     * Display a listing of roles.
     */
    public function index(): AnonymousResourceCollection
    {
        $roles = $this->rolePermissionService->getAllRoles();
        return RoleResource::collection($roles);
    }

    /**
     * Store a newly created role.
     */
    public function store(StoreRoleRequest $request): RoleResource
    {
        $validated = $request->validated();
        
        $role = $this->rolePermissionService->createRole(
            $validated['name'],
            $validated['permissions'] ?? []
        );
        
        return new RoleResource($role->load('permissions'));
    }

    /**
     * Display the specified role.
     */
    public function show(string $id): RoleResource
    {
        $role = $this->rolePermissionService->getRoleById($id);
        
        if (!$role) {
            abort(404, 'Role not found');
        }
        
        return new RoleResource($role);
    }

    /**
     * Update the specified role.
     */
    public function update(UpdateRoleRequest $request, string $id): RoleResource
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
        
        return new RoleResource($role->load('permissions'));
    }

    /**
     * Remove the specified role.
     */
    public function destroy(string $id): Response
    {
        $deleted = $this->rolePermissionService->deleteRole($id);
        
        if (!$deleted) {
            abort(404, 'Role not found');
        }
        
        return response()->noContent();
    }
}

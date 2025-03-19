<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Services\RolePermissionService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Spatie\Permission\Models\Role;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\JsonResponse;

class RoleController extends Controller
{
    public function __construct(
        protected RolePermissionService $rolePermissionService
    ) {
        // Middleware now handled in routes
    }
    
    /**
     * Display a listing of roles.
     */
    public function index(): AnonymousResourceCollection|JsonResponse
    {
        try {
            $roles = $this->rolePermissionService->getAllRoles();
            return RoleResource::collection($roles);
        } catch (\Exception $e) {
            Log::error('Failed to fetch roles: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to fetch roles: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    
    /**
     * Store a newly created role.
     */
    public function store(StoreRoleRequest $request): RoleResource|JsonResponse
    {
        try {
            $validated = $request->validated();
            
            $role = $this->rolePermissionService->createRole(
                $validated['name'],
                $validated['permissions'] ?? []
            );
            
            return new RoleResource($role->load('permissions'));
        } catch (\Exception $e) {
            Log::error('Failed to create role: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to create role: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    
    /**
     * Display the specified role.
     */
    public function show(Role $role): RoleResource|JsonResponse
    {
        try {
            return new RoleResource($role->load('permissions'));
        } catch (\Exception $e) {
            Log::error('Failed to fetch role: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to fetch role: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    
    /**
     * Update the specified role.
     */
    public function update(UpdateRoleRequest $request, Role $role): RoleResource|JsonResponse
    {
        try {
            $validated = $request->validated();
            
            $updatedRole = $this->rolePermissionService->updateRole(
                $role->id,
                $validated['name'],
                $validated['permissions'] ?? []
            );
            
            return new RoleResource($updatedRole->load('permissions'));
        } catch (\Exception $e) {
            Log::error('Failed to update role: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to update role: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    
    /**
     * Remove the specified role.
     */
    public function destroy(Role $role): Response|JsonResponse
    {
        try {
            $deleted = $this->rolePermissionService->deleteRole($role->id);
            
            if (!$deleted) {
                throw new \Exception('Unable to delete role');
            }
            
            return response()->noContent();
        } catch (\Exception $e) {
            Log::error('Failed to delete role: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to delete role: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}

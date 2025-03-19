<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PermissionResource;
use App\Services\RolePermissionService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\Permission\StorePermissionRequest;
use App\Http\Requests\Permission\UpdatePermissionRequest;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\JsonResponse;

class PermissionController extends Controller
{
    public function __construct(
        protected RolePermissionService $rolePermissionService
    ) {
        // Middleware now handled in routes
    }
    
    /**
     * Display a listing of permissions.
     */
    public function index(Request $request): AnonymousResourceCollection|JsonResponse
    {
        try {
            if ($request->has('grouped') && $request->boolean('grouped')) {
                return response()->json([
                    'data' => $this->rolePermissionService->getPermissionsByModule()
                ]);
            }
            
            $permissions = $this->rolePermissionService->getAllPermissions();
            return PermissionResource::collection($permissions);
        } catch (\Exception $e) {
            Log::error('Failed to fetch permissions: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to fetch permissions: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    
    /**
     * Store a newly created permission.
     */
    public function store(StorePermissionRequest $request): PermissionResource|JsonResponse
    {
        try {
            $validated = $request->validated();
            
            $permission = $this->rolePermissionService->createPermission($validated['name']);
            
            return new PermissionResource($permission);
        } catch (\Exception $e) {
            Log::error('Failed to create permission: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to create permission: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    
    /**
     * Display the specified permission.
     */
    public function show(Permission $permission): PermissionResource|JsonResponse
    {
        try {
            return new PermissionResource($permission);
        } catch (\Exception $e) {
            Log::error('Failed to fetch permission: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to fetch permission: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    
    /**
     * Update the specified permission.
     */
    public function update(UpdatePermissionRequest $request, Permission $permission): PermissionResource|JsonResponse
    {
        try {
            $validated = $request->validated();
            
            $permission->update(['name' => $validated['name']]);
            
            return new PermissionResource($permission);
        } catch (\Exception $e) {
            Log::error('Failed to update permission: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to update permission: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    
    /**
     * Remove the specified permission.
     */
    public function destroy(Permission $permission): Response|JsonResponse
    {
        try {
            $permission->delete();
            
            return response()->noContent();
        } catch (\Exception $e) {
            Log::error('Failed to delete permission: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to delete permission: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    
    /**
     * Register standard permissions for a module
     */
    public function registerModulePermissions(Request $request): AnonymousResourceCollection|JsonResponse
    {
        try {
            $validated = $request->validate([
                'module' => 'required|string|max:50',
                'actions' => 'sometimes|array',
                'actions.*' => 'string|max:50',
            ]);
            
            $permissions = $this->rolePermissionService->registerModulePermissions(
                $validated['module'],
                $validated['actions'] ?? []
            );
            
            return PermissionResource::collection(collect($permissions));
        } catch (\Exception $e) {
            Log::error('Failed to register module permissions: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to register module permissions: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}

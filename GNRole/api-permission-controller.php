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

class PermissionController extends Controller
{
    protected RolePermissionService $rolePermissionService;
    
    public function __construct(RolePermissionService $rolePermissionService)
    {
        $this->rolePermissionService = $rolePermissionService;
        $this->middleware('permission:permission:list')->only('index', 'show');
        $this->middleware('permission:permission:create')->only('store');
        $this->middleware('permission:permission:update')->only('update');
        $this->middleware('permission:permission:delete')->only('destroy');
    }

    /**
     * Display a listing of permissions.
     */
    public function index(Request $request): AnonymousResourceCollection|Response
    {
        if ($request->has('grouped') && $request->boolean('grouped')) {
            return response()->json([
                'data' => $this->rolePermissionService->getPermissionsByModule()
            ]);
        }
        
        $permissions = $this->rolePermissionService->getAllPermissions();
        return PermissionResource::collection($permissions);
    }

    /**
     * Store a newly created permission.
     */
    public function store(StorePermissionRequest $request): PermissionResource
    {
        $validated = $request->validated();
        
        $permission = $this->rolePermissionService->createPermission($validated['name']);
        
        return new PermissionResource($permission);
    }

    /**
     * Display the specified permission.
     */
    public function show(string $id): PermissionResource
    {
        $permission = Permission::findOrFail($id);
        
        return new PermissionResource($permission);
    }

    /**
     * Update the specified permission.
     */
    public function update(UpdatePermissionRequest $request, string $id): PermissionResource
    {
        $validated = $request->validated();
        
        $permission = Permission::findOrFail($id);
        $permission->update(['name' => $validated['name']]);
        
        return new PermissionResource($permission);
    }

    /**
     * Remove the specified permission.
     */
    public function destroy(string $id): Response
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();
        
        return response()->noContent();
    }
    
    /**
     * Register standard permissions for a module
     */
    public function registerModulePermissions(Request $request): AnonymousResourceCollection
    {
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
    }
}

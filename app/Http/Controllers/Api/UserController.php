<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserRoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    protected UserRoleService $userRoleService;

    public function __construct(UserRoleService $userRoleService)
    {
        $this->userRoleService = $userRoleService;
        // Middleware is handled in routes
    }

    /**
     * Display a listing of users.
     */
    public function index(Request $request): AnonymousResourceCollection|JsonResponse
    {
        try {
            // Add filtering options
            $search = $request->input('search');
            $role = $request->input('role');
            $perPage = $request->input('per_page', 15);
            $sortField = $request->input('sort_field', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            
            // Build query with filters
            $query = User::query()
                ->when($search, function ($query, $search) {
                    return $query->where(function ($subquery) use ($search) {
                        $subquery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                })
                ->when($role, function ($query, $role) {
                    return $query->role($role);
                })
                ->orderBy($sortField, $sortDirection);

            // Decide whether to paginate or get all
            if ($request->has('all') && $request->boolean('all')) {
                $users = $query->get();
            } else {
                $users = $query->paginate($perPage);
            }
            
            return UserResource::collection($users);
        } catch (\Exception $e) {
            Log::error('Failed to fetch users: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to fetch users: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request): UserResource|JsonResponse
    {
        try {
            $validated = $request->validated();
            
            // Create user
            $user = new User();
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->password = Hash::make($validated['password']);
            
            // Optional fields
            if (isset($validated['first_name'])) $user->first_name = $validated['first_name'];
            if (isset($validated['last_name'])) $user->last_name = $validated['last_name'];
            if (isset($validated['nickname'])) $user->nickname = $validated['nickname'];
            
            $user->save();
            
            // Assign roles if provided
            if (isset($validated['roles']) && is_array($validated['roles'])) {
                $user->syncRoles($validated['roles']);
            }
            
            // Assign direct permissions if provided
            if (isset($validated['permissions']) && is_array($validated['permissions'])) {
                $user->syncPermissions($validated['permissions']);
            }
            
            return new UserResource($user->load(['roles', 'permissions']));
        } catch (\Exception $e) {
            Log::error('Failed to create user: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to create user: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): UserResource|JsonResponse
    {
        try {
            // Load relationships
            $user->load(['roles.permissions', 'permissions']);
            
            return new UserResource($user);
        } catch (\Exception $e) {
            Log::error('Failed to fetch user: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to fetch user: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateUserRequest $request, User $user): UserResource|JsonResponse
    {
        try {
            $validated = $request->validated();
            
            // Update basic information
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            
            // Update optional fields
            if (isset($validated['first_name'])) $user->first_name = $validated['first_name'];
            if (isset($validated['last_name'])) $user->last_name = $validated['last_name'];
            if (isset($validated['nickname'])) $user->nickname = $validated['nickname'];
            
            // Update password if provided
            if (isset($validated['password']) && !empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }
            
            $user->save();
            
            // Update roles if provided
            if (isset($validated['roles'])) {
                $user->syncRoles($validated['roles']);
            }
            
            // Update direct permissions if provided
            if (isset($validated['permissions'])) {
                $user->syncPermissions($validated['permissions']);
            }
            
            // Reload relationships
            $user->load(['roles', 'permissions']);
            
            return new UserResource($user);
        } catch (\Exception $e) {
            Log::error('Failed to update user: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to update user: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user): Response|JsonResponse
    {
        try {
            // Prevent deleting yourself
            if ($user->id === Auth::user()->id) {
                return response()->json(
                    ['error' => 'You cannot delete your own account.'],
                    Response::HTTP_BAD_REQUEST
                );
            }
            
            $user->delete();
            
            return response()->noContent();
        } catch (\Exception $e) {
            Log::error('Failed to delete user: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to delete user: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get all roles for role assignment.
     */
    public function getRoles(): JsonResponse
    {
        try {
            $roles = Role::all();
            
            return response()->json(['data' => $roles]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch roles: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to fetch roles: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Update user roles.
     */
    public function updateRoles(Request $request, User $user): UserResource|JsonResponse
    {
        try {
            $validated = $request->validate([
                'roles' => 'required|array',
                'roles.*' => 'exists:roles,id',
            ]);
            
            $this->userRoleService->assignRolesToUser($user, $validated['roles']);
            
            // Reload user with roles
            $user->load('roles');
            
            return new UserResource($user);
        } catch (\Exception $e) {
            Log::error('Failed to update user roles: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to update user roles: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Update user permissions.
     */
    public function updatePermissions(Request $request, User $user): UserResource|JsonResponse
    {
        try {
            $validated = $request->validate([
                'permissions' => 'required|array',
                'permissions.*' => 'exists:permissions,id',
            ]);
            
            $this->userRoleService->assignPermissionsToUser($user, $validated['permissions']);
            
            // Reload user with permissions
            $user->load('permissions');
            
            return new UserResource($user);
        } catch (\Exception $e) {
            Log::error('Failed to update user permissions: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(
                ['error' => 'Failed to update user permissions: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
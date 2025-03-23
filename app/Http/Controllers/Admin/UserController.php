<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use App\Services\RolePermissionService;
use App\Services\UserRoleService;
use App\Traits\AuthorizesModuleActions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

class UserController extends Controller
{
    use AuthorizesModuleActions;

    public function __construct(
        protected RolePermissionService $rolePermissionService,
        protected UserRoleService $userRoleService
    ) {
        // Middleware now handled in routes
        $this->module = 'user';
        $this->customActions = ['impersonate', 'export', 'import'];
    }

    /**
     * Display a listing of the users.
     */
    public function index(Request $request): Response
    {
        // Add filtering and searching options
        $search = $request->input('search');
        $role = $request->input('role');
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        // Log the role parameter for debugging
        Log::info('Role parameter received: ' . ($role ?: 'null'));

        // Build base query
        $query = User::with('roles');
        
        // Apply search filter if provided
        if ($search) {
            $query->where(function ($subquery) use ($search) {
                $subquery->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        // Apply role filter if provided and not 'all'
        if ($role && $role !== 'all') {
            // Use the role() relationship directly from Spatie
            $roleName = trim($role);
            $query->role($roleName);
        }
        
        // Apply sorting
        $query->orderBy($sortField, $sortDirection);

        // Paginate results
        $users = $query->paginate(10)->withQueryString();

        // Get available roles for filter
        $roles = Role::all();

        return Inertia::render('Admin/User/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $role,
                'sortField' => $sortField,
                'sortDirection' => $sortDirection,
            ],
            'roles' => $roles,
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        // Load roles for the form
        $roles = Role::with('permissions')->get();

        

        return Inertia::render('Admin/User/Create', [
            'roles' => $roles,
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();

            // Create the user
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

            return redirect()->route('admin.users.index')
                ->with('success', 'User created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create user: ' . $e->getMessage(), ['exception' => $e]);

            return redirect()->back()
                ->with('error', 'Failed to create user: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        // Load relationships
        $user->load(['roles.permissions', 'permissions']);

        // Get user-specific permissions summary
        $userRolesSummary = $this->userRoleService->getUserRolesSummary($user);

        return Inertia::render('Admin/User/Show', [
            'user' => $user,
            'userRolesSummary' => $userRolesSummary,
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        // Load roles and permissions for editing
        $user->load(['roles', 'permissions']);
        $roles = Role::with('permissions')->get();
        $modulePermissions = $this->rolePermissionService->getPermissionsByModule();

        return Inertia::render('Admin/User/Edit', [
            'user' => $user,
            'roles' => $roles,
            'modulePermissions' => $modulePermissions,
            'userRoles' => $user->roles->pluck('id')->toArray(),
            'userDirectPermissions' => $user->permissions->pluck('id')->toArray(),
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
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

            return redirect()->route('admin.users.index')
                ->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update user: ' . $e->getMessage(), ['exception' => $e]);

            return redirect()->back()
                ->with('error', 'Failed to update user: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        try {
            // Prevent deleting yourself
            if ($user->id === Auth::user()->id) {
                return redirect()->back()
                    ->with('error', 'You cannot delete your own account.');
            }

            $user->delete();

            return redirect()->route('admin.users.index')
                ->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete user: ' . $e->getMessage(), ['exception' => $e]);

            return redirect()->back()
                ->with('error', 'Failed to delete user: ' . $e->getMessage());
        }
    }

    /**
     * Update user roles.
     */
    public function updateRoles(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        try {
            $this->userRoleService->assignRolesToUser($user, $validated['roles']);

            return redirect()->back()
                ->with('success', 'User roles updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update user roles: ' . $e->getMessage(), ['exception' => $e]);

            return redirect()->back()
                ->with('error', 'Failed to update user roles: ' . $e->getMessage());
        }
    }

    /**
     * Update user permissions.
     */
    public function updatePermissions(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        try {
            $this->userRoleService->assignPermissionsToUser($user, $validated['permissions']);

            return redirect()->back()
                ->with('success', 'User permissions updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update user permissions: ' . $e->getMessage(), ['exception' => $e]);

            return redirect()->back()
                ->with('error', 'Failed to update user permissions: ' . $e->getMessage());
        }
    }

    /**
     * Export users to CSV.
     */
    public function export(): \Symfony\Component\HttpFoundation\Response
    {
        try {
            $users = User::with('roles')->get();
            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="users.csv"',
            ];

            $callback = function () use ($users) {
                $file = fopen('php://output', 'w');

                // Add headers
                fputcsv($file, ['ID', 'Name', 'Email', 'Roles', 'Created At']);

                // Add rows
                foreach ($users as $user) {
                    $roles = $user->roles->pluck('name')->implode(', ');
                    fputcsv($file, [
                        $user->id,
                        $user->name,
                        $user->email,
                        $roles,
                        $user->created_at->format('Y-m-d H:i:s'),
                    ]);
                }

                fclose($file);
            };

            return response()->stream($callback, 200, $headers);
        } catch (\Exception $e) {
            Log::error('Failed to export users: ' . $e->getMessage(), ['exception' => $e]);

            return redirect()->back()
                ->with('error', 'Failed to export users: ' . $e->getMessage());
        }
    }

    /**
     * Import users from CSV.
     */
    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240',
        ]);

        try {
            $file = $request->file('file');
            $path = $file->getRealPath();

            $data = array_map('str_getcsv', file($path));

            // Remove headers row
            $headers = array_shift($data);

            // Process data
            $importedCount = 0;
            $skippedCount = 0;
            $errorCount = 0;

            foreach ($data as $row) {
                try {
                    $rowData = array_combine($headers, $row);

                    // Check if user already exists
                    $existingUser = User::where('email', $rowData['Email'])->first();

                    if ($existingUser) {
                        $skippedCount++;
                        continue;
                    }

                    // Create new user
                    $user = new User();
                    $user->name = $rowData['Name'];
                    $user->email = $rowData['Email'];
                    $user->password = Hash::make(Str::random(16)); // Generate random password
                    $user->save();

                    // Assign roles if provided
                    if (!empty($rowData['Roles'])) {
                        $roleNames = explode(',', $rowData['Roles']);
                        $user->assignRole($roleNames);
                    }

                    $importedCount++;
                } catch (\Exception $e) {
                    $errorCount++;
                    Log::error('Failed to import user row: ' . json_encode($row), ['exception' => $e]);
                }
            }

            return redirect()->route('admin.users.index')
                ->with('success', "Import completed: {$importedCount} users added, {$skippedCount} skipped, {$errorCount} errors.");
        } catch (\Exception $e) {
            Log::error('Failed to import users: ' . $e->getMessage(), ['exception' => $e]);

            return redirect()->back()
                ->with('error', 'Failed to import users: ' . $e->getMessage());
        }
    }
}

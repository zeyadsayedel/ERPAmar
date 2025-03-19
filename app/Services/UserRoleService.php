<?php

namespace App\Services;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Collection;

class UserRoleService
{
    /**
     * Assign roles to a user
     * 
     * @param User $user
     * @param array $roleIds
     * @return User
     */
    public function assignRolesToUser(User $user, array $roleIds): User
    {
        $roles = Role::whereIn('id', $roleIds)->get();
        $user->syncRoles($roles);
        
        return $user;
    }
    
    /**
     * Assign specific permissions to a user
     * 
     * @param User $user
     * @param array $permissionIds
     * @return User
     */
    public function assignPermissionsToUser(User $user, array $permissionIds): User
    {
        $permissions = Permission::whereIn('id', $permissionIds)->get();
        $user->syncPermissions($permissions);
        
        return $user;
    }
    
    /**
     * Get all permissions assigned to a user (including via roles)
     * 
     * @param User $user
     * @return Collection
     */
    public function getUserAllPermissions(User $user): Collection
    {
        return $user->getAllPermissions();
    }
    
    /**
     * Check if a user has a specific permission
     * 
     * @param User $user
     * @param string $permission
     * @return bool
     */
    public function userHasPermission(User $user, string $permission): bool
    {
        return $user->hasPermissionTo($permission);
    }
    
    /**
     * Get users by role
     * 
     * @param string $roleName
     * @return Collection
     */
    public function getUsersByRole(string $roleName): Collection
    {
        return User::role($roleName)->get();
    }
    
    /**
     * Get users by permission
     * 
     * @param string $permission
     * @return Collection
     */
    public function getUsersByPermission(string $permission): Collection
    {
        return User::permission($permission)->get();
    }
    
    /**
     * Convert WordPress user meta capabilities to Laravel roles and permissions
     * 
     * @param User $user
     * @param array $wpUserData
     * @return User
     */
    public function migrateWordPressUserRoles(User $user, array $wpUserData): User
    {
        // WordPress stores user roles in the wp_capabilities meta
        // Format: a:1:{s:13:"administrator";b:1;}
        if (isset($wpUserData['wp_capabilities'])) {
            $capabilities = unserialize($wpUserData['wp_capabilities']);
            
            if (is_array($capabilities)) {
                foreach ($capabilities as $role => $active) {
                    if ($active && Role::where('name', $role)->exists()) {
                        $user->assignRole($role);
                    }
                }
            }
        }
        
        // WordPress sometimes stores additional capabilities directly
        // Format: a:1:{s:12:"custom_capability";b:1;}
        if (isset($wpUserData['wp_user_level'])) {
            // Map WordPress user levels to permissions if needed
            $level = (int)$wpUserData['wp_user_level'];
            
            // Example mapping of WP user levels to permissions
            $levelPermissions = [
                10 => ['admin_access'],
                7 => ['editor_access'],
                2 => ['author_access'],
                1 => ['contributor_access'],
                0 => ['subscriber_access'],
            ];
            
            // Assign permissions based on user level
            foreach ($levelPermissions as $reqLevel => $perms) {
                if ($level >= $reqLevel) {
                    foreach ($perms as $perm) {
                        if (Permission::where('name', $perm)->exists()) {
                            $user->givePermissionTo($perm);
                        }
                    }
                }
            }
        }
        
        return $user;
    }
    
    /**
     * Get a summary of the user's roles and permissions
     * 
     * @param User $user
     * @return array
     */
    public function getUserRolesSummary(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                ];
            }),
            'direct_permissions' => $user->getDirectPermissions()->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                ];
            }),
            'all_permissions' => $user->getAllPermissions()->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                ];
            }),
        ];
    }
    
    /**
     * Get a list of domain modules and their user-specific access
     * For UI navigation and feature toggling
     * 
     * @param User $user
     * @return array
     */
    public function getUserModuleAccess(User $user): array
    {
        // Get all permissions the user has
        $userPermissions = $user->getAllPermissions()->pluck('name')->toArray();
        
        // Define modules and their required permissions
        $modules = [
            'dashboard' => [
                'label' => 'Dashboard',
                'required_permission' => 'dashboard:view',
                'route' => 'dashboard',
                'icon' => 'home',
            ],
            'users' => [
                'label' => 'Users',
                'required_permission' => 'user:list',
                'route' => 'users.index',
                'icon' => 'users',
            ],
            'roles' => [
                'label' => 'Roles & Permissions',
                'required_permission' => 'role:list',
                'route' => 'roles.index',
                'icon' => 'shield',
            ],
            'cars' => [
                'label' => 'Cars',
                'required_permission' => 'car:list',
                'route' => 'cars.index',
                'icon' => 'car',
            ],
            'quarries' => [
                'label' => 'Quarries',
                'required_permission' => 'quarry:list',
                'route' => 'quarries.index',
                'icon' => 'tool',
            ],
            // Add more modules as needed
        ];
        
        // Check access for each module
        $moduleAccess = [];
        
        foreach ($modules as $key => $module) {
            $hasAccess = false;
            
            if (isset($module['required_permission'])) {
                $hasAccess = $user->hasPermissionTo($module['required_permission']);
            }
            
            $moduleAccess[$key] = array_merge($module, ['has_access' => $hasAccess]);
        }
        
        return $moduleAccess;
    }
}

<?php

namespace App\Services;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class RolePermissionService
{
    /**
     * Get all roles with their permissions
     * 
     * @return Collection
     */
    public function getAllRoles(): Collection
    {
        return Role::with('permissions')->get();
    }

    /**
     * Get role by ID with permissions
     * 
     * @param int $id
     * @return Role|null
     */
    public function getRoleById(int $id): ?Role
    {
        return Role::with('permissions')->find($id);
    }

    /**
     * Create a new role with permissions
     * 
     * @param string $name
     * @param array $permissions
     * @return Role
     */
    public function createRole(string $name, array $permissions = []): Role
    {
        $role = Role::create(['name' => $name, 'guard_name' => 'web']);
        
        if (!empty($permissions)) {
            $role->syncPermissions($permissions);
        }
        
        $this->clearCache();
        
        return $role;
    }

    /**
     * Update a role and its permissions
     * 
     * @param int $id
     * @param string $name
     * @param array $permissions
     * @return Role|null
     */
    public function updateRole(int $id, string $name, array $permissions = []): ?Role
    {
        $role = Role::find($id);
        
        if (!$role) {
            return null;
        }
        
        $role->update(['name' => $name]);
        $role->syncPermissions($permissions);
        
        $this->clearCache();
        
        return $role;
    }

    /**
     * Delete a role
     * 
     * @param int $id
     * @return bool
     */
    public function deleteRole(int $id): bool
    {
        $role = Role::find($id);
        
        if (!$role) {
            return false;
        }
        
        $role->delete();
        $this->clearCache();
        
        return true;
    }

    /**
     * Get all permissions
     * 
     * @return Collection
     */
    public function getAllPermissions(): Collection
    {
        return Permission::all();
    }

    /**
     * Get permissions grouped by module
     * This uses the prefix structure like 'user:create', 'post:edit'
     * 
     * @return array
     */
    public function getPermissionsByModule(): array
    {
        $permissions = Permission::all();
        $grouped = [];
        
        foreach ($permissions as $permission) {
            $parts = explode(':', $permission->name);
            $module = $parts[0] ?? 'general';
            
            if (!isset($grouped[$module])) {
                $grouped[$module] = [];
            }
            
            $grouped[$module][] = $permission;
        }
        
        return $grouped;
    }

    /**
     * Create a new permission
     * 
     * @param string $name
     * @return Permission
     */
    public function createPermission(string $name): Permission
    {
        // Convert to standardized format (resource:action)
        $standardName = $this->standardizePermissionName($name);
        
        $permission = Permission::create([
            'name' => $standardName,
            'guard_name' => 'web'
        ]);
        
        $this->clearCache();
        
        return $permission;
    }

    /**
     * Standardize a permission name to follow resource:action pattern
     * 
     * @param string $name
     * @return string
     */
    private function standardizePermissionName(string $name): string
    {
        $name = Str::lower(trim($name));
        
        // If it already has a colon, assume it's formatted correctly
        if (Str::contains($name, ':')) {
            return $name;
        }
        
        // Try to extract resource and action
        $commonActions = ['view', 'create', 'edit', 'update', 'delete', 'list', 'manage'];
        
        foreach ($commonActions as $action) {
            if (Str::startsWith($name, $action)) {
                // Format: action_resource -> resource:action
                $resource = Str::after($name, $action . '_');
                return "{$resource}:{$action}";
            }
            
            if (Str::endsWith($name, $action)) {
                // Format: resource_action -> resource:action
                $resource = Str::before($name, '_' . $action);
                return "{$resource}:{$action}";
            }
        }
        
        // Default: assume it's a general permission
        return "general:{$name}";
    }

    /**
     * Clear permission cache
     */
    private function clearCache(): void
    {
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }

    /**
     * Register module permissions using standard naming conventions
     * 
     * @param string $module Module name (e.g., 'user', 'car', 'quarry')
     * @param array $actions Custom actions beyond CRUD (view, create, update, delete)
     * @return array Created permissions
     */
    public function registerModulePermissions(string $module, array $actions = []): array
    {
        $module = Str::lower($module);
        $standardActions = ['view', 'list', 'create', 'update', 'delete'];
        $allActions = array_unique(array_merge($standardActions, $actions));
        
        $permissions = [];
        
        foreach ($allActions as $action) {
            $permissionName = "{$module}:{$action}";
            $permissions[] = Permission::firstOrCreate([
                'name' => $permissionName,
                'guard_name' => 'web'
            ]);
        }
        
        $this->clearCache();
        
        return $permissions;
    }

    /**
     * Check if a permission exists and create it if it doesn't
     * 
     * @param string $permission
     * @return Permission
     */
    public function ensurePermissionExists(string $permission): Permission
    {
        $standardName = $this->standardizePermissionName($permission);
        
        return Permission::firstOrCreate([
            'name' => $standardName,
            'guard_name' => 'web'
        ]);
    }

    /**
     * Migrate WordPress capability names to Laravel permission format
     * 
     * @param array $wpCapabilities
     * @return array
     */
    public function migrateWordPressCapabilities(array $wpCapabilities): array
    {
        $mapping = [
            // WordPress capability => Laravel permission format
            'edit_posts' => 'post:edit',
            'publish_posts' => 'post:publish',
            'delete_posts' => 'post:delete',
            'edit_pages' => 'page:edit',
            'publish_pages' => 'page:publish',
            'delete_pages' => 'page:delete',
            // Add more mappings as needed
        ];
        
        $permissions = [];
        
        foreach ($wpCapabilities as $wpCapability) {
            if (isset($mapping[$wpCapability])) {
                $permissions[] = $mapping[$wpCapability];
            } else {
                // Use a default transformation if no explicit mapping
                $permissions[] = $this->standardizePermissionName($wpCapability);
            }
        }
        
        return $permissions;
    }

    /**
     * Get a standardized list of all permissions in the system
     * 
     * @return array
     */
    public function getStandardizedPermissionList(): array
    {
        $permissions = Permission::all();
        $list = [];
        
        foreach ($permissions as $permission) {
            $parts = explode(':', $permission->name);
            
            if (count($parts) === 2) {
                [$resource, $action] = $parts;
                
                if (!isset($list[$resource])) {
                    $list[$resource] = [];
                }
                
                $list[$resource][] = [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'action' => $action
                ];
            } else {
                // Handle non-standard format
                if (!isset($list['other'])) {
                    $list['other'] = [];
                }
                
                $list['other'][] = [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'action' => $permission->name
                ];
            }
        }
        
        return $list;
    }
}

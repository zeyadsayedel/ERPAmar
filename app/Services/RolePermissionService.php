<?php

namespace App\Services;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class RolePermissionService
{
    protected ModulePermissionRegistrar $moduleRegistrar;

    public function __construct(ModulePermissionRegistrar $moduleRegistrar)
    {
        $this->moduleRegistrar = $moduleRegistrar;
    }

    public function getAllRoles(): Collection
    {
        return Role::with('permissions')->get();
    }

    public function getRoleById(int $id): ?Role
    {
        return Role::with('permissions')->find($id);
    }

    public function createRole(string $name, array $permissions = []): Role
    {
        $role = Role::create(['name' => $name, 'guard_name' => 'web']);

        if (!empty($permissions)) {
            $role->syncPermissions($permissions);
        }

        $this->clearCache();

        return $role;
    }

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

        // If there are no permissions, return an empty array
        if (empty($grouped)) {
            return [];
        }

        return $grouped;
    }

    public function registerModulePermissions(string $module, array $customActions = []): Collection
    {
        return $this->moduleRegistrar->registerModule($module, $customActions);
    }

    /**
     * Get all permissions for a specific module
     * 
     * @param string $module
     * @return array
     */
    public function getModulePermissions(string $module): array
    {
        $permissions = Permission::where('name', 'like', $module . ':%')->get();

        return $permissions->toArray();
    }

    public function isModuleRegistered(string $module): bool
    {
        return $this->moduleRegistrar->isModuleRegistered($module);
    }

    public function getStandardActions(): array
    {
        return $this->moduleRegistrar->getStandardActions();
    }

    private function clearCache(): void
    {
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
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

    /**
     * Get a human-readable display name for the permission
     */
    private function getDisplayName(string $permissionName): string
    {
        $parts = explode(':', $permissionName);

        if (count($parts) === 2) {
            [$module, $action] = $parts;

            // Convert to title case
            $module = Str::title($module);
            $action = Str::title($action);

            return "{$action} {$module}";
        }

        // Fallback for non-standard names
        return Str::title(str_replace(['_', '-', ':'], ' ', $permissionName));
    }

    /**
     * Create a new permission
     * 
     * @param string $name
     * @return Permission
     */
    public function createPermission(string $name): Permission
    {
        // Standardize the permission name using the existing method
        $standardName = $this->standardizePermissionName($name);

        $permission = Permission::create([
            'name' => $standardName,
            'guard_name' => 'web',
            'display_name' => $this->getDisplayName($standardName)
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
}

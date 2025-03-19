<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Str;

class ModulePermissionRegistrar
{
    protected array $standardActions = [
        'list',
        'view',
        'create',
        'update',
        'delete'
    ];

    protected array $registeredModules = [];

    /**
     * Register permissions for a module
     */
    public function registerModule(string $module, array $customActions = []): Collection
    {
        $module = Str::lower($module);
        
        if (in_array($module, $this->registeredModules)) {
            return $this->getModulePermissions($module);
        }

        $actions = array_unique(array_merge($this->standardActions, $customActions));
        $permissions = collect();

        foreach ($actions as $action) {
            $permissions->push(
                Permission::firstOrCreate([
                    'name' => "{$module}:{$action}",
                    'guard_name' => 'web'
                ])
            );
        }

        $this->registeredModules[] = $module;
        
        return $permissions;
    }

    /**
     * Get all permissions for a module
     */
    public function getModulePermissions(string $module): Collection
    {
        return Permission::where('name', 'like', $module . ':%')->get();
    }

    /**
     * Get all registered modules
     */
    public function getRegisteredModules(): array
    {
        return $this->registeredModules;
    }

    /**
     * Check if a module is registered
     */
    public function isModuleRegistered(string $module): bool
    {
        return in_array(Str::lower($module), $this->registeredModules);
    }

    /**
     * Get standard actions
     */
    public function getStandardActions(): array
    {
        return $this->standardActions;
    }

    /**
     * Get all permissions
     */
    public function getAllPermissions(): Collection
    {
        return Permission::all();
    }

    /**
     * Get all modules that have permissions
     */
    public function getAllModules(): array
    {
        $modules = [];
        $permissions = $this->getAllPermissions();
        
        foreach ($permissions as $permission) {
            $parts = explode(':', $permission->name);
            if (count($parts) === 2) {
                $module = $parts[0];
                if (!in_array($module, $modules)) {
                    $modules[] = $module;
                }
            }
        }
        
        return $modules;
    }

    /**
     * Get a standardized list of all permissions in the system
     * 
     * @return array
     */
    public function getStandardizedPermissionList(): array
    {
        // Get all permissions
        $permissions = $this->getAllPermissions();
        $list = [];
        
        // Group permissions by module
        foreach ($permissions as $permission) {
            $parts = explode(':', $permission->name);
            
            if (count($parts) === 2) {
                [$module, $action] = $parts;
                
                if (!isset($list[$module])) {
                    $list[$module] = [];
                }
                
                $list[$module][] = [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'action' => $action,
                    'display_name' => $this->formatPermissionDisplayName($permission->name)
                ];
            } else {
                // Handle non-standard format
                if (!isset($list['other'])) {
                    $list['other'] = [];
                }
                
                $list['other'][] = [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'action' => $permission->name,
                    'display_name' => $this->formatPermissionDisplayName($permission->name)
                ];
            }
        }
        
        // Sort modules alphabetically, with 'other' at the end
        $sortedList = [];
        
        // First add registered modules in their registration order
        foreach ($this->getRegisteredModules() as $module) {
            if (isset($list[$module])) {
                $sortedList[$module] = $list[$module];
                unset($list[$module]);
            }
        }
        
        // Then add any remaining modules alphabetically
        ksort($list);
        $sortedList = array_merge($sortedList, $list);
        
        return $sortedList;
    }

    /**
     * Format a permission name into a human-readable display name
     */
    private function formatPermissionDisplayName(string $permissionName): string
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
}
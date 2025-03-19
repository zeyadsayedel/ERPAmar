<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

trait InertiaPermissions
{
    /**
     * Share module permission data for Inertia views
     *
     * @param string $module Module name (e.g. 'user', 'car', 'quarry')
     * @return array Permission data for Inertia props
     */
    protected function shareModulePermissions(string $module): array
    {
        $user = Auth::user();
        $standardActions = ['view', 'list', 'create', 'update', 'delete'];
        $customActions = $this->getModuleCustomActions($module);
        
        $allActions = array_merge($standardActions, $customActions);
        $permissions = [];
        
        // Check permissions for each action
        foreach ($allActions as $action) {
            $permissionName = "{$module}:{$action}";
            $permissions[$action] = $user->hasPermissionTo($permissionName);
        }
        
        return [
            'module' => $module,
            'permissions' => $permissions,
        ];
    }
    
    /**
     * Get custom actions for a module beyond standard CRUD
     *
     * @param string $module
     * @return array
     */
    protected function getModuleCustomActions(string $module): array
    {
        // Define custom actions for each module 
        $moduleCustomActions = [
            'user' => ['impersonate', 'export', 'import'],
            'role' => ['assign', 'sync'],
            'permission' => ['assign', 'sync'],
            'car' => ['assign', 'export', 'import'],
            'quarry' => ['assign', 'export', 'import'],
        ];
        
        return $moduleCustomActions[$module] ?? [];
    }
    
    /**
     * Share user roles and permissions with Inertia views
     *
     * @return array
     */
    protected function shareUserRolesAndPermissions(): array
    {
        $user = Auth::user();
        
        return [
            'user' => [
                'roles' => $user->roles->pluck('name'),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ];
    }
}

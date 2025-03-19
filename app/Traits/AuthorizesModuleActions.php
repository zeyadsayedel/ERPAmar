<?php

namespace App\Traits;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Auth;

trait AuthorizesModuleActions
{
    /**
     * The module name (e.g., 'user', 'role', 'car')
     * Should be overridden in the controller
     */
    protected string $module = '';
    
    /**
     * Custom actions beyond standard CRUD operations
     * Can be overridden in the controller
     */
    protected array $customActions = [];
    
    /**
     * Construct a permission string in the format 'module:action'
     */
    protected function permission(string $action): string
    {
        return $this->module . ':' . $action;
    }
    
    /**
     * Authorize a module action (or throw an exception)
     * 
     * @param string $action The action name (e.g., 'view', 'create', 'update', 'delete')
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    protected function authorizeModule(string $action): void
    {
        $permission = $this->permission($action);
        $user = Auth::user();
        
        if (!$user || !$user->hasPermissionTo($permission)) {
            throw new AuthorizationException("You do not have permission to {$action} this {$this->module}.");
        }
    }
    
    /**
     * Check if the user can perform a module action
     * 
     * @param string $action The action name
     * @return bool
     */
    protected function canPerformAction(string $action): bool
    {
        $user = Auth::user();
        return $user && $user->hasPermissionTo($this->permission($action));
    }
    
    /**
     * Get an array of permissions the user has for this module
     * 
     * @return array<string, bool>
     */
    protected function getUserModulePermissions(): array
    {
        $user = Auth::user();
        if (!$user) {
            return [];
        }
        
        $permissions = [];
        $standardActions = ['view', 'list', 'create', 'update', 'delete'];
        
        foreach ($standardActions as $action) {
            $permissions[$action] = $user->hasPermissionTo($this->permission($action));
        }
        
        // Add custom actions if defined
        foreach ($this->customActions as $action) {
            $permissions[$action] = $user->hasPermissionTo($this->permission($action));
        }
        
        return $permissions;
    }
    
    /**
     * Share module permissions with the Inertia view
     * 
     * @return array<string, mixed>
     */
    protected function shareModulePermissions(): array
    {
        return [
            'permissions' => $this->getUserModulePermissions(),
            'module' => $this->module,
        ];
    }
}

<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Access\AuthorizationException;
use App\Services\RolePermissionService;
use App\Services\UserRoleService;

trait ModulePermissionTrait
{
    protected string $module = '';
    protected array $customActions = [];
    protected ?RolePermissionService $rolePermissionService = null;
    protected ?UserRoleService $userRoleService = null;

    protected function getRolePermissionService(): RolePermissionService
    {
        if (!$this->rolePermissionService) {
            $this->rolePermissionService = app(RolePermissionService::class);
        }
        return $this->rolePermissionService;
    }
    
    protected function getUserRoleService(): UserRoleService
    {
        if (!$this->userRoleService) {
            $this->userRoleService = app(UserRoleService::class);
        }
        return $this->userRoleService;
    }

    protected function setupModulePermissions(): void
    {
        if (empty($this->module)) {
            throw new \RuntimeException('Module name must be set in controller using ModulePermissionTrait');
        }

        // Setup middleware for standard actions
        $this->middleware("permission:{$this->module}:list")->only(['index']);
        $this->middleware("permission:{$this->module}:view")->only(['show']);
        $this->middleware("permission:{$this->module}:create")->only(['create', 'store']);
        $this->middleware("permission:{$this->module}:update")->only(['edit', 'update']);
        $this->middleware("permission:{$this->module}:delete")->only(['destroy']);
    }

    protected function authorizeModule(string $action): void
    {
        $permission = "{$this->module}:{$action}";
        $user = Auth::user();
        
        if (!$user || !$this->getUserRoleService()->userHasPermission($user, $permission)) {
            throw new AuthorizationException("You do not have permission to {$action} this {$this->module}.");
        }
    }

    protected function canPerformAction(string $action): bool
    {
        $user = Auth::user();
        if (!$user) {
            return false;
        }
        return $this->getUserRoleService()->userHasPermission($user, "{$this->module}:{$action}");
    }

    protected function getUserModulePermissions(): array
    {
        $user = Auth::user();
        $standardActions = ['view', 'list', 'create', 'update', 'delete'];
        $customActions = $this->customActions;
        $allActions = array_merge($standardActions, $customActions);
        
        $permissions = [];
        foreach ($allActions as $action) {
            $permissionName = "{$this->module}:{$action}";
            $permissions[$action] = $user && $this->getUserRoleService()->userHasPermission($user, $permissionName);
        }
        
        return $permissions;
    }

    protected function shareModulePermissions(): array
    {
        return [
            'module' => $this->module,
            'permissions' => $this->getUserModulePermissions(),
        ];
    }
}
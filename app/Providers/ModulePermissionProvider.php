<?php

namespace App\Providers;

use App\Services\RolePermissionService;
use Illuminate\Support\ServiceProvider;

class ModulePermissionProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(RolePermissionService $permissionService): void
    {
        // Only run in console commands to avoid doing this on every request
        if ($this->app->runningInConsole()) {
            // Define the core modules and their custom actions
            $modules = [
                'dashboard' => [],
                'user' => ['impersonate', 'export', 'import'],
                'role' => ['assign', 'sync'],
                'permission' => ['assign', 'sync'],
                'car' => ['assign', 'export', 'import'],
                'quarry' => ['assign', 'export', 'import'],
                'setting' => ['view', 'update'],
                'notification' => ['read', 'mark-read', 'mark-all-read'],
                'activity-log' => ['view', 'export', 'clear'],
            ];
            
            // Register permissions for each module
            foreach ($modules as $module => $customActions) {
                $permissionService->registerModulePermissions($module, $customActions);
            }
        }
    }
}

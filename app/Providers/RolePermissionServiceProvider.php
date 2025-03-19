<?php

namespace App\Providers;

use App\Services\RolePermissionService;
use App\Services\UserRoleService;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Blade;
use Spatie\Permission\Models\Role;
use App\Observers\RolePermissionObserver;

class RolePermissionServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(RolePermissionService::class);
        $this->app->singleton(UserRoleService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Register observers
        Role::observe(RolePermissionObserver::class);

        // Register Blade directives
        $this->registerBladeDirectives();

        // Register module permissions during development
        if ($this->app->environment('local')) {
            $this->registerDefaultModulePermissions();
        }
    }

    /**
     * Register Blade directives for permission checks
     */
    protected function registerBladeDirectives(): void
    {
        // @hasrole directive
        Blade::directive('hasrole', function ($role) {
            return "<?php if(auth()->check() && auth()->user()->hasRole({$role})): ?>";
        });

        Blade::directive('endhasrole', function () {
            return "<?php endif; ?>";
        });

        // @hasanyrole directive
        Blade::directive('hasanyrole', function ($roles) {
            return "<?php if(auth()->check() && auth()->user()->hasAnyRole({$roles})): ?>";
        });

        Blade::directive('endhasanyrole', function () {
            return "<?php endif; ?>";
        });

        // @can directive (already exists in Laravel but overridden for clarity)
        Blade::directive('permission', function ($permission) {
            return "<?php if(auth()->check() && auth()->user()->hasPermissionTo({$permission})): ?>";
        });

        Blade::directive('endpermission', function () {
            return "<?php endif; ?>";
        });
    }

    /**
     * Register default module permissions during development
     */
    protected function registerDefaultModulePermissions(): void
    {
        // Only register in console to avoid execution on every web request
        if ($this->app->runningInConsole()) {
            $this->app->booted(function () {
                /** @var RolePermissionService $service */
                $service = $this->app->make(RolePermissionService::class);

                // Main modules from the application
                $modules = [
                    'dashboard',
                    'user',
                    'role',
                    'permission',
                    'car',
                    'quarry',
                ];

                // Admin modules
                $adminModules = [
                    'setting',
                    'log',
                    'backup',
                ];

                // Register standard CRUD permissions for each module
                foreach (array_merge($modules, $adminModules) as $module) {
                    $service->registerModulePermissions($module);
                }

                // Register special administrative permissions
                $service->registerModulePermissions('system', [
                    'backup',
                    'restore',
                    'maintenance',
                    'cache-clear',
                    'migrate'
                ]);
            });
        }
    }

    /**
     * Get all permissions for a specific module
     * 
     * @param string $module
     * @return \Illuminate\Support\Collection
     */
    public function getModulePermissions(string $module): \Illuminate\Support\Collection
    {
        return \Spatie\Permission\Models\Permission::where('name', 'like', $module . ':%')->get();
    }

    /**
     * Check if a module is already registered (has permissions)
     * 
     * @param string $module
     * @return bool
     */
    public function isModuleRegistered(string $module): bool
    {
        return \Spatie\Permission\Models\Permission::where('name', 'like', $module . ':%')->exists();
    }
}

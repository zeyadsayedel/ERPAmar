<?php

namespace App\Providers;

use App\Services\CarImportExportService;
use App\Services\QuarryImportExportService;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(CarImportExportService::class);
        $this->app->singleton(QuarryImportExportService::class);
        
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        // Add this to ensure permissions are available in auth payload
        Inertia::share('auth.user', function () {
            if (!Auth::user()) return null;
            
            return [
                'id' => Auth::user()->id,
                'name' => Auth::user()->name,
                'email' => Auth::user()->email,
                // Array of permission strings like ["user:create", "user:update"]
                'permissions' => Auth::user()->getAllPermissions()->pluck('name')->toArray(),
                'roles' => Auth::user()->roles->pluck('name')->toArray(),
            ];
        });
    }
}

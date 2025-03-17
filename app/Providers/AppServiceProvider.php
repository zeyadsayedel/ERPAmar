<?php

namespace App\Providers;

use App\Services\CarImportExportService;
use App\Services\QuarryImportExportService;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

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
    }
}

<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Services\RolePermissionService;
use Illuminate\Routing\Events\RouteMatched;

class EventServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        parent::boot();

        Event::listen(RouteMatched::class, function ($event) {
            $controller = $event->route->getController();
            
            // Check if controller uses ModulePermissionTrait
            if (method_exists($controller, 'setupModulePermissions')) {
                $controller->setupModulePermissions();
            }
        });
    }
}
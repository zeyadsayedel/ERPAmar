<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\RolePermissionService;
use App\Services\ModulePermissionRegistrar;
use Symfony\Component\Finder\Finder;

class SyncModulePermissions extends Command
{
    protected $signature = 'permissions:sync-modules';
    protected $description = 'Synchronize permissions for all modules by scanning controllers';

    public function handle(RolePermissionService $rolePermissionService, ModulePermissionRegistrar $registrar): void
    {
        $this->info('Scanning controllers for modules...');
        
        $finder = new Finder();
        $finder->files()->in(app_path('Http/Controllers'))->name('*Controller.php');
        
        $modules = [];
        
        foreach ($finder as $file) {
            $contents = $file->getContents();
            
            // Check if file uses ModulePermissionTrait
            if (str_contains($contents, 'ModulePermissionTrait')) {
                // Extract module name from protected $module property
                if (preg_match('/protected\s+string\s+\$module\s*=\s*[\'"]([^\'"]+)[\'"]/', $contents, $matches)) {
                    $modules[] = $matches[1];
                }
                
                // Extract custom actions
                if (preg_match('/protected\s+array\s+\$customActions\s*=\s*\[(.*?)\]/', $contents, $matches)) {
                    $actions = array_map('trim', explode(',', $matches[1]));
                    $actions = array_filter(array_map(function($action) {
                        return trim($action, '\'" ');
                    }, $actions));
                    
                    if (!empty($actions)) {
                        $this->info("Found custom actions for module {$matches[1]}: " . implode(', ', $actions));
                        $rolePermissionService->registerModulePermissions($matches[1], $actions);
                    }
                }
            }
        }
        
        $modules = array_unique($modules);
        
        $this->info('Found modules: ' . implode(', ', $modules));
        
        foreach ($modules as $module) {
            $permissions = $rolePermissionService->registerModulePermissions($module);
            $this->info("Synchronized permissions for module '{$module}': " . $permissions->pluck('name')->implode(', '));
        }
        
        $this->info('Module permissions synchronization completed successfully.');
    }
}
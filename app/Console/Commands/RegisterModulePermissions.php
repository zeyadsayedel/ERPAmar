<?php

namespace App\Console\Commands;

use App\Services\RolePermissionService;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;

class RegisterModulePermissions extends Command
{
    protected $signature = 'permissions:register-module 
                            {module : The module name (e.g., post, product, etc.)}
                            {--actions=* : Additional actions beyond the standard CRUD operations}
                            {--role= : Assign the new permissions to a specific role}
                            {--admin : Also assign permissions to the administrator role}';

    protected $description = 'Register standardized permissions for a module';

    protected RolePermissionService $rolePermissionService;

    public function __construct(RolePermissionService $rolePermissionService)
    {
        parent::__construct();
        $this->rolePermissionService = $rolePermissionService;
    }

    public function handle(): int
    {
        $module = $this->argument('module');
        $actions = $this->option('actions') ?: [];
        
        $this->info("Registering permissions for module: {$module}");
        
        try {
            // Register the module permissions
            $permissions = $this->rolePermissionService->registerModulePermissions($module, $actions);
            
            $this->info(count($permissions) . " permissions created successfully:");
            
            foreach ($permissions as $permission) {
                $this->line("- {$permission->name}");
            }
            
            // Assign to role if specified
            if ($roleName = $this->option('role')) {
                $role = Role::where('name', $roleName)->first();
                
                if ($role) {
                    $permissionNames = collect($permissions)->pluck('name')->toArray();
                    $role->givePermissionTo($permissionNames);
                    $this->info("Permissions assigned to role: {$roleName}");
                } else {
                    $this->warn("Role not found: {$roleName}");
                }
            }
            
            // Assign to administrator role if --admin flag is used
            if ($this->option('admin')) {
                $adminRole = Role::where('name', 'administrator')->first();
                
                if ($adminRole) {
                    $permissionNames = collect($permissions)->pluck('name')->toArray();
                    $adminRole->givePermissionTo($permissionNames);
                    $this->info("Permissions assigned to role: administrator");
                } else {
                    $this->warn("Administrator role not found");
                }
            }
            
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error("Error registering permissions: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}

<?php

namespace Database\Seeders;

use App\Services\RolePermissionService;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DefaultRolesSeeder extends Seeder
{
    protected RolePermissionService $rolePermissionService;
    
    public function __construct(RolePermissionService $rolePermissionService)
    {
        $this->rolePermissionService = $rolePermissionService;
    }
    
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default system roles with modern names
        $roles = [
            'super-admin' => 'Super Administrator with full system access',
            'admin' => 'Administrator with management access',
            'manager' => 'Manager with operational access',
            'editor' => 'Content editor with publishing rights',
            'user' => 'Standard user with basic access',
        ];
        
        foreach ($roles as $name => $description) {
            Role::firstOrCreate([
                'name' => $name,
                'guard_name' => 'web',
            ]);
        }
        
        // Register core modules
        $modules = [
            'dashboard' => [],
            'user' => ['impersonate', 'export', 'import'],
            'role' => ['assign', 'sync'],
            'permission' => ['assign', 'sync'],
            'car' => ['assign', 'export', 'import'],
            'quarry' => ['assign', 'export', 'import'],
            'setting' => ['view', 'update'],
        ];
        
        // Create permissions for all modules
        $modulePermissions = [];
        foreach ($modules as $module => $extraActions) {
            $permissions = $this->rolePermissionService->registerModulePermissions($module, $extraActions);
            $modulePermissions[$module] = collect($permissions)->pluck('name')->toArray();
        }
        
        // Create system-wide special permissions
        $systemPermissions = [
            'system:access',
            'system:backup',
            'system:restore',
            'system:update',
            'system:maintenance',
            'system:logs',
        ];
        
        foreach ($systemPermissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }
        
        // Assign permissions to roles
        $this->assignRolePermissions($modulePermissions, $systemPermissions);
        
        $this->command->info('Default roles and permissions created successfully');
    }
    
    /**
     * Assign permissions to each role based on access level
     */
    private function assignRolePermissions(array $modulePermissions, array $systemPermissions): void
    {
        // Super admin gets everything
        $superAdmin = Role::where('name', 'super-admin')->first();
        $superAdmin->givePermissionTo(Permission::all());
        
        // Admin gets all module permissions but limited system permissions
        $admin = Role::where('name', 'admin')->first();
        foreach ($modulePermissions as $permissions) {
            $admin->givePermissionTo($permissions);
        }
        $admin->givePermissionTo([
            'system:access',
            'system:logs',
        ]);
        
        // Manager gets operational permissions
        $manager = Role::where('name', 'manager')->first();
        $managerPermissions = [];
        
        foreach ($modulePermissions as $module => $permissions) {
            foreach ($permissions as $permission) {
                // Managers should not be able to delete content
                if (!str_contains($permission, ':delete') && 
                    !str_contains($permission, 'role:') &&
                    !str_contains($permission, 'permission:')) {
                    $managerPermissions[] = $permission;
                }
            }
        }
        
        $manager->givePermissionTo($managerPermissions);
        
        // Editor gets content-related permissions
        $editor = Role::where('name', 'editor')->first();
        $editorPermissions = array_merge(
            $modulePermissions['dashboard'],
            $modulePermissions['car'],
            $modulePermissions['quarry']
        );
        
        // Filter out delete permissions from editor
        $editorPermissions = array_filter($editorPermissions, function ($permission) {
            return !str_contains($permission, ':delete');
        });
        
        $editor->givePermissionTo($editorPermissions);
        
        // Standard user gets only basic view permissions
        $user = Role::where('name', 'user')->first();
        $userPermissions = [
            'dashboard:view',
            'dashboard:list',
            'car:view',
            'car:list',
            'quarry:view',
            'quarry:list',
        ];
        
        $user->givePermissionTo($userPermissions);
    }
}

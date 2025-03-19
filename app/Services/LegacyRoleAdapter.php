<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class LegacyRoleAdapter
{
    /**
     * The mapping of legacy capabilities to modern permission format
     */
    protected array $capabilityMapping = [
        // Content management capabilities
        'edit_post' => 'content:edit',
        'read_post' => 'content:view',
        'delete_post' => 'content:delete',
        'edit_posts' => 'content:edit',
        'edit_others_posts' => 'content:edit-others',
        'publish_posts' => 'content:publish',
        'read_private_posts' => 'content:view-private',
        
        // Page management capabilities
        'edit_page' => 'page:edit',
        'read_page' => 'page:view',
        'delete_page' => 'page:delete',
        'edit_pages' => 'page:edit',
        'edit_others_pages' => 'page:edit-others',
        'publish_pages' => 'page:publish',
        'read_private_pages' => 'page:view-private',
        
        // User management
        'list_users' => 'user:list',
        'create_users' => 'user:create',
        'edit_users' => 'user:edit',
        'delete_users' => 'user:delete',
        'promote_users' => 'user:promote',
        
        // Admin capabilities
        'manage_options' => ['setting:view', 'setting:update'],
        'activate_plugins' => 'extension:activate',
        'install_plugins' => 'extension:install',
        'update_plugins' => 'extension:update',
        'delete_plugins' => 'extension:delete',
        
        // Core system capabilities
        'update_core' => 'system:update',
        'export' => 'system:export',
        'import' => 'system:import',
        'manage_categories' => 'category:manage',
        'moderate_comments' => 'comment:moderate',
        'upload_files' => 'media:upload',
        
        // Additional capabilities
        'edit_dashboard' => 'dashboard:edit',
        'edit_theme_options' => 'theme:edit',
        'manage_links' => 'link:manage',
    ];

    /**
     * Map legacy roles to modern roles
     */
    protected array $roleMapping = [
        'administrator' => 'super-admin',
        'editor' => 'editor',
        'author' => 'author',
        'contributor' => 'contributor',
        'subscriber' => 'user',
    ];

    /**
     * Convert a legacy capability to modern permission format
     */
    public function convertCapabilityToPermission(string $capability): array
    {
        // If there's a direct mapping, use it
        if (isset($this->capabilityMapping[$capability])) {
            $mappedPermissions = $this->capabilityMapping[$capability];
            return is_array($mappedPermissions) ? $mappedPermissions : [$mappedPermissions];
        }

        // Otherwise, convert the capability to the new format (module:action)
        $capability = Str::lower($capability);
        
        // Common patterns in legacy capabilities
        if (Str::contains($capability, '_')) {
            $parts = explode('_', $capability);
            
            // Handle patterns like "edit_posts", "delete_users", etc.
            if (count($parts) === 2) {
                $action = $parts[0];
                $module = Str::singular($parts[1]);
                
                return ["{$module}:{$action}"];
            }
            
            // Handle patterns like "edit_others_posts"
            if (count($parts) === 3 && $parts[1] === 'others') {
                $action = $parts[0] . '-others';
                $module = Str::singular($parts[2]);
                
                return ["{$module}:{$action}"];
            }
        }
        
        // If no specific pattern is matched, use a general format
        return ["general:{$capability}"];
    }
    
    /**
     * Convert a legacy role to modern role
     */
    public function convertRoleName(string $legacyRole): string
    {
        return $this->roleMapping[$legacyRole] ?? 'user';
    }
    
    /**
     * Import roles and capabilities from the legacy system
     */
    public function importLegacyRoles(array $legacyRoles): void
    {
        foreach ($legacyRoles as $roleName => $capabilities) {
            // Create or get the role
            $newRoleName = $this->convertRoleName($roleName);
            $role = Role::firstOrCreate(['name' => $newRoleName, 'guard_name' => 'web']);
            
            // Convert and register all capabilities as permissions
            foreach ($capabilities as $capability) {
                $permissionNames = $this->convertCapabilityToPermission($capability);
                
                foreach ($permissionNames as $permissionName) {
                    // Create the permission if it doesn't exist
                    $permission = Permission::firstOrCreate([
                        'name' => $permissionName,
                        'guard_name' => 'web'
                    ]);
                    
                    // Assign the permission to the role
                    if (!$role->hasPermissionTo($permission)) {
                        $role->givePermissionTo($permission);
                    }
                }
            }
        }
    }
    
    /**
     * Import a user's legacy capabilities and roles
     */
    public function importUserCapabilities(User $user, array $legacyData): void
    {
        // Handle legacy roles
        if (isset($legacyData['roles']) && is_array($legacyData['roles'])) {
            foreach ($legacyData['roles'] as $legacyRole) {
                $newRoleName = $this->convertRoleName($legacyRole);
                if (!$user->hasRole($newRoleName)) {
                    $user->assignRole($newRoleName);
                }
            }
        }
        
        // Handle direct capabilities
        if (isset($legacyData['capabilities']) && is_array($legacyData['capabilities'])) {
            foreach ($legacyData['capabilities'] as $capability => $granted) {
                if ($granted) {
                    $permissionNames = $this->convertCapabilityToPermission($capability);
                    
                    foreach ($permissionNames as $permissionName) {
                        // Create the permission if it doesn't exist
                        Permission::firstOrCreate([
                            'name' => $permissionName,
                            'guard_name' => 'web'
                        ]);
                        
                        // Give the permission to the user
                        if (!$user->hasPermissionTo($permissionName)) {
                            $user->givePermissionTo($permissionName);
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Create a migration console command to simplify full system migration
     */
    public function generateMigrationCommand(): string
    {
        $command = "<?php\n\n";
        $command .= "namespace App\\Console\\Commands;\n\n";
        $command .= "use App\\Models\\User;\n";
        $command .= "use App\\Services\\LegacyRoleAdapter;\n";
        $command .= "use Illuminate\\Console\\Command;\n\n";
        $command .= "class MigrateLegacyRoles extends Command\n";
        $command .= "{\n";
        $command .= "    protected \$signature = 'roles:migrate-legacy';\n";
        $command .= "    protected \$description = 'Migrate legacy roles and capabilities to new permission system';\n\n";
        $command .= "    public function handle(LegacyRoleAdapter \$adapter): int\n";
        $command .= "    {\n";
        $command .= "        \$this->info('Starting migration of legacy roles and capabilities...');\n";
        $command .= "        \n";
        $command .= "        // Define legacy roles with their capabilities\n";
        $command .= "        \$legacyRoles = [\n";
        $command .= "            'administrator' => [\n";
        $command .= "                'edit_posts', 'publish_posts', 'delete_posts', 'manage_options',\n";
        $command .= "                // Add more capabilities here\n";
        $command .= "            ],\n";
        $command .= "            'editor' => [\n";
        $command .= "                'edit_posts', 'publish_posts', 'delete_posts',\n";
        $command .= "                // Add more capabilities here\n";
        $command .= "            ],\n";
        $command .= "            // Define more roles as needed\n";
        $command .= "        ];\n\n";
        $command .= "        \$adapter->importLegacyRoles(\$legacyRoles);\n";
        $command .= "        \$this->info('Legacy roles imported successfully!');\n\n";
        $command .= "        // Optional: migrate user capabilities\n";
        $command .= "        \$users = User::all();\n";
        $command .= "        \$bar = \$this->output->createProgressBar(count(\$users));\n";
        $command .= "        \n";
        $command .= "        foreach (\$users as \$user) {\n";
        $command .= "            // This would typically come from your legacy database\n";
        $command .= "            \$legacyData = [\n";
        $command .= "                'roles' => ['editor'], // Example role\n";
        $command .= "                'capabilities' => [\n";
        $command .= "                    'edit_posts' => true,\n";
        $command .= "                    'publish_posts' => true,\n";
        $command .= "                    // Add more capabilities here\n";
        $command .= "                ],\n";
        $command .= "            ];\n";
        $command .= "            \n";
        $command .= "            \$adapter->importUserCapabilities(\$user, \$legacyData);\n";
        $command .= "            \$bar->advance();\n";
        $command .= "        }\n\n";
        $command .= "        \$bar->finish();\n";
        $command .= "        \$this->newLine();\n";
        $command .= "        \$this->info('User capabilities migrated successfully!');\n";
        $command .= "        \n";
        $command .= "        return Command::SUCCESS;\n";
        $command .= "    }\n";
        $command .= "}\n";
        
        return $command;
    }
}

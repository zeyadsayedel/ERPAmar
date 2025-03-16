<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define roles and their capabilities (based on WordPress roles)
        $roles = [
            'administrator' => [
                'activate_plugins', 'delete_others_pages', 'delete_others_posts', 'delete_pages', 
                'delete_posts', 'delete_private_pages', 'delete_private_posts', 
                'delete_published_pages', 'delete_published_posts', 'edit_dashboard', 
                'edit_others_pages', 'edit_others_posts', 'edit_pages', 'edit_posts', 
                'edit_private_pages', 'edit_private_posts', 'edit_published_pages', 
                'edit_published_posts', 'edit_theme_options', 'export', 'import', 
                'list_users', 'manage_categories', 'manage_links', 'manage_options', 
                'moderate_comments', 'promote_users', 'publish_pages', 'publish_posts', 
                'read_private_pages', 'read_private_posts', 'read', 'remove_users', 
                'switch_themes', 'upload_files', 'customize', 'delete_site',
                'update_core', 'update_plugins', 'update_themes', 'install_plugins', 
                'install_themes', 'delete_themes', 'delete_plugins', 'edit_plugins', 
                'edit_themes', 'edit_files', 'edit_users', 'add_users', 'create_users', 
                'delete_users', 'unfiltered_html',
            ],
            'editor' => [
                'delete_others_pages', 'delete_others_posts', 'delete_pages', 'delete_posts', 
                'delete_private_pages', 'delete_private_posts', 'delete_published_pages', 
                'delete_published_posts', 'edit_others_pages', 'edit_others_posts', 
                'edit_pages', 'edit_posts', 'edit_private_pages', 'edit_private_posts', 
                'edit_published_pages', 'edit_published_posts', 'manage_categories', 
                'manage_links', 'moderate_comments', 'publish_pages', 'publish_posts', 
                'read', 'read_private_pages', 'read_private_posts', 'unfiltered_html', 
                'upload_files',
            ],
            'author' => [
                'delete_posts', 'delete_published_posts', 'edit_posts', 
                'edit_published_posts', 'publish_posts', 'read', 'upload_files',
            ],
            'contributor' => [
                'delete_posts', 'edit_posts', 'read',
            ],
            'subscriber' => [
                'read',
            ],
        ];

        // Create permissions for each capability
        foreach ($roles as $role => $capabilities) {
            foreach ($capabilities as $capability) {
                Permission::firstOrCreate(['name' => $capability, 'guard_name' => 'web']);
            }
        }

        // Create roles and assign permissions
        foreach ($roles as $roleName => $capabilities) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($capabilities);
        }

        $this->command->info('Roles and permissions have been created successfully');
    }

    /**
     * Import user capabilities from serialized data
     * This method can be used to migrate existing WordPress users
     * 
     * @param array $data Array of user data with serialized capabilities
     */
    public function migrateUserCapabilities(array $data)
    {
        foreach ($data as $userData) {
            if (!isset($userData['email']) || !isset($userData['capabilities'])) {
                continue;
            }
            
            // Find or create user
            $user = User::firstOrCreate(['email' => $userData['email']], [
                'name' => $userData['name'] ?? '',
                'password' => bcrypt($userData['password'] ?? \Illuminate\Support\Str::random(16))
            ]);

            // Parse capabilities
            $capabilities = is_string($userData['capabilities']) ? 
                unserialize($userData['capabilities']) : $userData['capabilities'];
            
            if (!is_array($capabilities)) {
                continue;
            }

            // Assign roles based on capabilities
            foreach ($capabilities as $role => $enabled) {
                if ($enabled && Role::where('name', $role)->exists()) {
                    $user->assignRole($role);
                }
            }
        }
    }
}

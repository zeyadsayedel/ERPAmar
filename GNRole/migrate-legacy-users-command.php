<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\LegacyRoleAdapter;
use App\Services\RolePermissionService;
use App\Services\UserRoleService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MigrateLegacyUsers extends Command
{
    protected $signature = 'users:migrate-legacy 
                           {--connection=legacy : Database connection for legacy data}
                           {--users-table=users : Legacy users table name}
                           {--meta-table=usermeta : Legacy user meta table name}
                           {--reset : Remove existing migrated users before migration}
                           {--dry-run : Show what would be migrated without making changes}';

    protected $description = 'Migrate users from a legacy system to the new system';

    protected LegacyRoleAdapter $legacyRoleAdapter;
    protected UserRoleService $userRoleService;
    protected RolePermissionService $rolePermissionService;

    public function __construct(
        LegacyRoleAdapter $legacyRoleAdapter,
        UserRoleService $userRoleService,
        RolePermissionService $rolePermissionService
    ) {
        parent::__construct();
        $this->legacyRoleAdapter = $legacyRoleAdapter;
        $this->userRoleService = $userRoleService;
        $this->rolePermissionService = $rolePermissionService;
    }

    public function handle(): int
    {
        $connection = $this->option('connection');
        $usersTable = $this->option('users-table');
        $metaTable = $this->option('meta-table');
        $isDryRun = $this->option('dry-run');
        
        if ($isDryRun) {
            $this->info('Running in dry-run mode - no changes will be made');
        }
        
        // Check if legacy connection exists
        try {
            DB::connection($connection)->getPdo();
        } catch (\Exception $e) {
            $this->error("Could not connect to legacy database: {$e->getMessage()}");
            return Command::FAILURE;
        }
        
        // Reset existing users if requested
        if ($this->option('reset') && !$isDryRun) {
            if ($this->confirm('This will delete ALL existing users! Are you sure?', false)) {
                $this->info('Removing existing users...');
                User::query()->delete();
            } else {
                $this->info('Reset cancelled.');
            }
        }
        
        // Get legacy users
        $legacyUsers = DB::connection($connection)
            ->table($usersTable)
            ->get();
            
        if ($legacyUsers->isEmpty()) {
            $this->error('No legacy users found');
            return Command::FAILURE;
        }
        
        $this->info("Found {$legacyUsers->count()} legacy users to migrate");
        
        // Set up progress bar
        $progressBar = $this->output->createProgressBar($legacyUsers->count());
        $progressBar->start();
        
        $migratedCount = 0;
        $skippedCount = 0;
        $errorCount = 0;
        
        foreach ($legacyUsers as $legacyUser) {
            try {
                // Get user meta data
                $userMeta = DB::connection($connection)
                    ->table($metaTable)
                    ->where('user_id', $legacyUser->ID)
                    ->get()
                    ->mapWithKeys(function ($item) {
                        return [$item->meta_key => $item->meta_value];
                    })
                    ->toArray();
                
                // Check if user already exists
                $existingUser = User::where('email', $legacyUser->user_email)->first();
                
                if ($existingUser) {
                    if (!$isDryRun) {
                        $this->updateExistingUser($existingUser, $legacyUser, $userMeta);
                    }
                    $skippedCount++;
                } else {
                    if (!$isDryRun) {
                        $this->createNewUser($legacyUser, $userMeta);
                    }
                    $migratedCount++;
                }
            } catch (\Exception $e) {
                $this->newLine();
                $this->error("Error migrating user {$legacyUser->ID}: {$e->getMessage()}");
                $errorCount++;
            }
            
            $progressBar->advance();
        }
        
        $progressBar->finish();
        $this->newLine(2);
        
        $this->info("Migration completed:");
        $this->info("- Migrated: {$migratedCount}");
        $this->info("- Updated: {$skippedCount}");
        $this->info("- Errors: {$errorCount}");
        
        if ($isDryRun) {
            $this->info("Dry run completed. No changes were made.");
        }
        
        return Command::SUCCESS;
    }
    
    /**
     * Create a new user from legacy data
     */
    protected function createNewUser($legacyUser, array $userMeta): User
    {
        // Create user with basic fields
        $user = new User();
        $user->name = $legacyUser->display_name ?? $legacyUser->user_login;
        $user->email = $legacyUser->user_email;
        
        // Use original hash or set a new password
        if (str_starts_with($legacyUser->user_pass, '$P$') || str_starts_with($legacyUser->user_pass, '$2y$')) {
            $user->password = $legacyUser->user_pass;
        } else {
            $user->password = Hash::make(Str::random(16));
        }
        
        // Map legacy fields to new model
        $user->user_login = $legacyUser->user_login;
        $user->user_nicename = $legacyUser->user_nicename;
        $user->user_url = $legacyUser->user_url;
        $user->display_name = $legacyUser->display_name;
        
        // Fill additional fields from user meta
        $user->first_name = $userMeta['first_name'] ?? '';
        $user->last_name = $userMeta['last_name'] ?? '';
        $user->nickname = $userMeta['nickname'] ?? '';
        $user->description = $userMeta['description'] ?? '';
        
        // Boolean fields
        $user->rich_editing = $userMeta['rich_editing'] === 'true';
        $user->syntax_highlighting = $userMeta['syntax_highlighting'] === 'true';
        $user->comment_shortcuts = $userMeta['comment_shortcuts'] === 'true';
        $user->use_ssl = $userMeta['use_ssl'] === '1';
        $user->show_admin_bar_front = $userMeta['show_admin_bar_front'] === 'true';
        
        // Preferences 
        $user->admin_color = $userMeta['admin_color'] ?? 'fresh';
        
        $user->save();
        
        // Handle roles and capabilities
        $roles = [];
        $capabilities = [];
        
        // Extract legacy capabilities
        if (isset($userMeta['capabilities'])) {
            $capabilities = @unserialize($userMeta['capabilities']);
        }
        
        // Create legacy data structure
        $legacyData = [
            'roles' => array_keys(array_filter($capabilities ?: [])),
            'capabilities' => $capabilities ?: [],
        ];
        
        // Import capabilities and roles using adapter
        $this->legacyRoleAdapter->importUserCapabilities($user, $legacyData);
        
        return $user;
    }
    
    /**
     * Update existing user with legacy data
     */
    protected function updateExistingUser(User $user, $legacyUser, array $userMeta): User
    {
        // Only update additional fields from legacy that might not be in current system
        $user->user_login = $legacyUser->user_login;
        $user->user_nicename = $legacyUser->user_nicename;
        $user->user_url = $legacyUser->user_url;
        $user->display_name = $legacyUser->display_name;
        
        // Only update these if they're empty in our system
        if (empty($user->first_name)) $user->first_name = $userMeta['first_name'] ?? '';
        if (empty($user->last_name)) $user->last_name = $userMeta['last_name'] ?? '';
        if (empty($user->nickname)) $user->nickname = $userMeta['nickname'] ?? '';
        if (empty($user->description)) $user->description = $userMeta['description'] ?? '';
        
        $user->save();
        
        // Handle roles and capabilities
        $capabilities = [];
        
        // Extract legacy capabilities
        if (isset($userMeta['capabilities'])) {
            $capabilities = @unserialize($userMeta['capabilities']);
        }
        
        // Create legacy data structure
        $legacyData = [
            'roles' => array_keys(array_filter($capabilities ?: [])),
            'capabilities' => $capabilities ?: [],
        ];
        
        // Import capabilities and roles using adapter
        $this->legacyRoleAdapter->importUserCapabilities($user, $legacyData);
        
        return $user;
    }
}

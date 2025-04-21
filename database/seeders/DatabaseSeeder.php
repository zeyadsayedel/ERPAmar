<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        /* User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Find the user by email
        $user = User::where('email', 'test@example.com')->first();
        
        if (!$user) {
            $this->command->info('User not found. Skipping role assignment.');
            return;
        }
        
        // Find or create the admin role
        $adminRole = Role::firstOrCreate(['name' => 'super-admin']);
        
        // Assign the role to the user
        $user->assignRole($adminRole);
        
        $this->command->info('Admin role assigned to user: ' . $user->name); */
        
        // Call the dummy data seeder to generate test data
        $this->call([
            DummyDataSeeder::class,
        ]);
    }
}

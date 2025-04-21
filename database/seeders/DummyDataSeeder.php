<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\CarContractor;
use App\Models\CustomerAccount;
use App\Models\Invoice;
use App\Models\Quarry;
use App\Models\SupplyClient;
use App\Models\User;
use Illuminate\Database\Seeder;

class DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Ensure we have at least one user for invoices
        if (User::count() == 0) {
            User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
            ]);
            
            User::factory(4)->create(); // Create 4 additional users
        }
        
        // Create SupplyClients (these don't depend on anything else)
        $supplyClients = SupplyClient::factory(10)->create();
        
        // Create Quarries (these don't depend on anything else)
        $quarries = Quarry::factory(5)->create();
        
        // Create CarContractors
        $carContractors = CarContractor::factory(8)->create();
        
        // Create Cars
        $cars = Car::factory(15)->create();
        
        // Create CustomerAccounts
        $customerAccounts = CustomerAccount::factory(20)->create();
        
        // Set up relationships between models
        
        // Link CarContractors with SupplyClients
        $carContractors->each(function ($contractor) use ($supplyClients) {
            $contractor->supplyClients()->attach(
                $supplyClients->random(rand(1, 3))->pluck('id')->toArray()
            );
        });
        
        // Link Cars with Contractors
        $cars->each(function ($car) use ($carContractors) {
            $car->contractors()->attach(
                $carContractors->random(rand(1, 2))->pluck('id')->toArray()
            );
        });
        
        // Link CustomerAccounts with Quarries
        $customerAccounts->each(function ($customer) use ($quarries) {
            $customer->quarries()->attach(
                $quarries->random(rand(1, 3))->pluck('id')->toArray()
            );
        });
        
        // Link CustomerAccounts with CarContractors
        $customerAccounts->each(function ($customer) use ($carContractors) {
            $customer->contractors()->attach(
                $carContractors->random(rand(1, 2))->pluck('id')->toArray()
            );
        });
        
        // Link Quarries with CarContractors
        $quarries->each(function ($quarry) use ($carContractors) {
            $quarry->contractors()->attach(
                $carContractors->random(rand(1, 4))->pluck('id')->toArray()
            );
        });
        
        // Finally, create invoices that depend on all the other models
        Invoice::factory(30)->create();
    }
}

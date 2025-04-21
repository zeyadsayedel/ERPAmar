<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\User;
use App\Models\Quarry;
use App\Models\CustomerAccount;
use App\Models\Car;
use App\Models\CarContractor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Invoice::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */    public function definition(): array
    {
        // Using the correct enum values from the migration file
        $itemTypes = ['رمال', 'تربه', 'زلط', 'رديم'];
        $units = ['move', 'car'];
        $invoiceTypes = ['postpaid', 'cash'];
        $quantity = $this->faker->randomFloat(2, 1, 100);
        $itemPrice = $this->faker->randomFloat(2, 50, 500);
        
        return [
            'cashier_id' => User::inRandomOrder()->first()->id ?? User::factory()->create()->id,
            'quarry_id' => Quarry::inRandomOrder()->first()->id ?? Quarry::factory()->create()->id,
            'invoice_type' => $this->faker->randomElement($invoiceTypes),
            'customer_id' => CustomerAccount::inRandomOrder()->first()->id ?? CustomerAccount::factory()->create()->id,
            'customer_car_id' => Car::inRandomOrder()->first()->id ?? Car::factory()->create()->id,
            'unit' => $this->faker->randomElement($units),
            'contractor_id' => CarContractor::inRandomOrder()->first()->id ?? CarContractor::factory()->create()->id,
            'custody' => $this->faker->randomFloat(2, 100, 10000),
            'the_items' => $this->faker->randomElement($itemTypes),
            'item_price' => $itemPrice,
            'quantity' => $quantity,
            'total' => $quantity * $itemPrice,
            'flag' => $this->faker->numberBetween(0, 3),
            'supply' => $this->faker->boolean(),
            'start_day' => $this->faker->boolean(),
        ];
    }
}

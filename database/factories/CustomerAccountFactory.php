<?php

namespace Database\Factories;

use App\Models\CustomerAccount;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CustomerAccount>
 */
class CustomerAccountFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CustomerAccount::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */    public function definition(): array
    {
        $clientTypes = ['cash', 'postpaid'];
        
        return [
            'name' => $this->faker->company(),
            'client_type' => $this->faker->randomElement($clientTypes),
            'walk_in_customer' => $this->faker->boolean(20), // 20% chance to be true
            'sand_price' => $this->faker->randomFloat(2, 50, 200),
            'soil_price' => $this->faker->randomFloat(2, 40, 180),
            'zalat_price' => $this->faker->randomFloat(2, 60, 220),
            'rubble_price' => $this->faker->randomFloat(2, 45, 190),
            'tractor_sand_price' => $this->faker->randomFloat(2, 100, 300),
            'trilla_sand_price' => $this->faker->randomFloat(2, 150, 350),
            'faradani_sand_price' => $this->faker->randomFloat(2, 200, 400),
            'faradani_double_sand_price' => $this->faker->randomFloat(2, 250, 450),
            'farm_tractor_sand_price' => $this->faker->randomFloat(2, 120, 320),
            'tractor_soil_price' => $this->faker->randomFloat(2, 90, 290),
            'trilla_soil_price' => $this->faker->randomFloat(2, 140, 340),
            'faradani_soil_price' => $this->faker->randomFloat(2, 190, 390),
            'faradani_double_soil_price' => $this->faker->randomFloat(2, 240, 440),
            'farm_tractor_soil_price' => $this->faker->randomFloat(2, 110, 310),
            'tractor_zalat_price' => $this->faker->randomFloat(2, 95, 295),
            'trilla_zalat_price' => $this->faker->randomFloat(2, 145, 345),
            'faradani_zalat_price' => $this->faker->randomFloat(2, 195, 395),
            'faradani_double_zalat_price' => $this->faker->randomFloat(2, 245, 445),
            'farm_tractor_zalat_price' => $this->faker->randomFloat(2, 115, 315),
            'tractor_rubble_price' => $this->faker->randomFloat(2, 100, 300),
            'trilla_rubble_price' => $this->faker->randomFloat(2, 150, 350),
            'faradani_rubble_price' => $this->faker->randomFloat(2, 200, 400),
            'faradani_double_rubble_price' => $this->faker->randomFloat(2, 250, 450),
            'farm_tractor_rubble_price' => $this->faker->randomFloat(2, 120, 320),
        ];
    }
}

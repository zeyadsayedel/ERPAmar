<?php

namespace Database\Factories;

use App\Models\Quarry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quarry>
 */
class QuarryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Quarry::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company() . ' Quarry',
            'army_account' => $this->faker->randomFloat(2, 1000, 5000),
            'royalty_account' => $this->faker->randomFloat(2, 500, 3000),
            'loader_account' => $this->faker->randomFloat(2, 200, 1000),
            'army_status' => $this->faker->boolean(),
            'calculate_loader_hours' => $this->faker->randomFloat(2, 10, 100),
            'quarry_case' => $this->faker->boolean(),
            'company_smoke_account_for_tractor' => $this->faker->randomFloat(2, 100, 500),
            'tractor_loaders_smoke' => $this->faker->randomFloat(2, 50, 300),
            'tractor_sand_transfer_price' => $this->faker->randomFloat(2, 100, 500),
            'trilla_sand_transfer_price' => $this->faker->randomFloat(2, 150, 600),
            'faradani_sand_transfer_price' => $this->faker->randomFloat(2, 200, 700),
            'faradani_double_sand_transfer_price' => $this->faker->randomFloat(2, 250, 800),
            'farm_tractor_sand_transfer_price' => $this->faker->randomFloat(2, 120, 550),
            'trilla_loaders_smoke' => $this->faker->randomFloat(2, 60, 320),
            'faradani_loaders_smoke' => $this->faker->randomFloat(2, 70, 340),
            'faradani_double_loaders_smoke' => $this->faker->randomFloat(2, 80, 360),
            'farm_tractor_loaders_smoke' => $this->faker->randomFloat(2, 65, 330),
            'company_smoke_account_for_trilla' => $this->faker->randomFloat(2, 110, 510),
            'company_smoke_account_for_faradani' => $this->faker->randomFloat(2, 120, 520),
            'company_smoke_account_for_faradani_double' => $this->faker->randomFloat(2, 130, 530),
            'company_smoke_account_for_farm_tractor' => $this->faker->randomFloat(2, 105, 505),
            'tractor_soil_transfer_price' => $this->faker->randomFloat(2, 90, 450),
            'trilla_soil_transfer_price' => $this->faker->randomFloat(2, 140, 550),
            'faradani_soil_transfer_price' => $this->faker->randomFloat(2, 190, 650),
            'faradani_double_soil_transfer_price' => $this->faker->randomFloat(2, 240, 750),
            'farm_tractor_soil_transfer_price' => $this->faker->randomFloat(2, 110, 500),
            'tractor_zalat_transfer_price' => $this->faker->randomFloat(2, 95, 460),
            'trilla_zalat_transfer_price' => $this->faker->randomFloat(2, 145, 560),
            'faradani_zalat_transfer_price' => $this->faker->randomFloat(2, 195, 660),
            'faradani_double_zalat_transfer_price' => $this->faker->randomFloat(2, 245, 760),
            'farm_tractor_zalat_transfer_price' => $this->faker->randomFloat(2, 115, 510),
            'tractor_rubble_transfer_price' => $this->faker->randomFloat(2, 100, 470),
            'trilla_rubble_transfer_price' => $this->faker->randomFloat(2, 150, 570),
            'faradani_rubble_transfer_price' => $this->faker->randomFloat(2, 200, 670),
            'faradani_double_rubble_transfer_price' => $this->faker->randomFloat(2, 250, 770),
            'farm_tractor_rubble_transfer_price' => $this->faker->randomFloat(2, 120, 520),
            'royalty_status' => $this->faker->boolean(),
            'loader_hours_status' => $this->faker->boolean(),
            'printed' => $this->faker->numberBetween(0, 5),
            'unit' => $this->faker->randomElement(['ton', 'kg', 'lb']),
            'code' => $this->faker->unique()->numerify('QRY-####'),
        ];
    }
}

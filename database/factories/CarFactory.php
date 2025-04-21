<?php

namespace Database\Factories;

use App\Models\Car;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Car>
 */
class CarFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Car::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $carTypes = ['Tractor', 'Trilla', 'Faradani', 'Faradani Double', 'Farm Tractor'];
        
        return [
            'name' => $this->faker->randomElement(['CAT', 'Volvo', 'Komatsu', 'Hitachi', 'JCB']) . ' ' . $this->faker->bothify('##??'),
            'car_load' => $this->faker->randomFloat(2, 5, 50),
            'type_of_car' => $this->faker->randomElement($carTypes),
            'car_load_supply' => $this->faker->randomFloat(2, 5, 50),
        ];
    }
}

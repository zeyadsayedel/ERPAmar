<?php

namespace App\Services\Invoice\Calculators;

use App\Models\Car;
use App\Models\CustomerAccount;
use App\Models\Quarry;

class CarUnitCalculator
{
    /**
     * Calculate price, quantity and total for car unit type
     * 
     * @param Quarry $quarry
     * @param Car $car
     * @param CustomerAccount $customer
     * @param string $item The item type (رمال, تربه, زلط, رديم)
     * @param bool $supply Whether this is a supply invoice
     * @return array
     */
    public function calculate(
        Quarry $quarry, 
        Car $car, 
        CustomerAccount $customer, 
        string $item, 
        bool $supply
    ): array {
        $itemPrice = 0;
        $quantity = 0;
        
        // Determine quantity based on supply flag
        if ($supply) {
            $quantity = floatval($car->car_load_supply);
        } else {
            $quantity = floatval($car->car_load);
        }
        
        // Set price based on item type
        switch ($item) {
            case 'رمال':
                $itemPrice = floatval($customer->sand_price);
                break;
            case 'تربه':
                $itemPrice = floatval($customer->soil_price);
                break;
            case 'زلط':
                $itemPrice = floatval($customer->zalat_price);
                break;
            case 'رديم':
                $itemPrice = floatval($customer->rubble_price);
                break;
            default:
                $itemPrice = 0;
        }
        
        // Calculate total
        $total = $itemPrice * $quantity;
        
        return [
            'item_price' => $itemPrice,
            'quantity' => $quantity,
            'total' => $total
        ];
    }
}
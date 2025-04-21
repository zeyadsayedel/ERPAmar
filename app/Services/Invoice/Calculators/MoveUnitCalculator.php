<?php

namespace App\Services\Invoice\Calculators;

use App\Models\Car;
use App\Models\CustomerAccount;
use App\Models\Quarry;

class MoveUnitCalculator
{
    /**
     * Calculate price, quantity and total for move unit type
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
        $quantity = $supply ? floatval($car->car_load_supply) : floatval($car->car_load);
        
        // Get the correct price based on car type and customer status
        if ($customer->walk_in_customer) {
            // For walk-in customers, use the quarry's transfer price
            $itemPrice = $this->getQuarryTransferPrice($quarry, $car->type_of_car, $item);
        } else {
            // For regular customers, use the customer's specific price
            $itemPrice = $this->getCustomerTransferPrice($customer, $car->type_of_car, $item);
        }
        
        // For move unit type, the total equals the fixed price (not multiplied by quantity)
        $total = $itemPrice;
        
        return [
            'item_price' => $itemPrice,
            'quantity' => $quantity,
            'total' => $total
        ];
    }
    
    /**
     * Get the transfer price from the quarry for a walk-in customer
     */
    protected function getQuarryTransferPrice(Quarry $quarry, string $carType, string $item): float
    {
        $prefix = $this->getCarTypePrefix($carType);
        $itemSuffix = $this->getItemSuffix($item);
        
        $priceField = "{$prefix}_{$itemSuffix}_transfer_price";
        return floatval($quarry->$priceField ?? 0);
    }
    
    /**
     * Get the transfer price from the customer's specific pricing
     */
    protected function getCustomerTransferPrice(CustomerAccount $customer, string $carType, string $item): float
    {
        $prefix = $this->getCarTypePrefix($carType);
        $itemSuffix = $this->getItemSuffix($item);
        
        $priceField = "{$prefix}_{$itemSuffix}_price";
        return floatval($customer->$priceField ?? 0);
    }
    
    /**
     * Map car type to field prefix
     */
    protected function getCarTypePrefix(string $carType): string
    {
        switch ($carType) {
            case 'جرار/مقطورة':
                return 'tractor';
            case 'تريلا':
                return 'trilla';
            case 'فرداني':
                return 'faradani';
            case 'فرداني دوبل':
                return 'faradani_double';
            case 'جرار زراعي':
                return 'farm_tractor';
            default:
                return 'tractor'; // Default fallback
        }
    }
    
    /**
     * Map item name to field suffix
     */
    protected function getItemSuffix(string $item): string
    {
        switch ($item) {
            case 'رمال':
                return 'sand';
            case 'تربه':
                return 'soil';
            case 'زلط':
                return 'zalat';
            case 'رديم':
                return 'rubble';
            default:
                return 'sand'; // Default fallback
        }
    }
}
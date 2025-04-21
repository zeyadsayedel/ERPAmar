<?php

namespace App\Services\Invoice;

use App\Models\Car;
use App\Models\CustomerAccount;
use App\Models\Invoice;
use App\Models\Quarry;
use App\Models\User;
use App\Services\Invoice\Calculators\CarUnitCalculator;
use App\Services\Invoice\Calculators\MoveUnitCalculator;
use Illuminate\Support\Facades\Auth;

class InvoicePricingService
{
    protected CarUnitCalculator $carUnitCalculator;
    protected MoveUnitCalculator $moveUnitCalculator;

    /**
     * Create a new service instance.
     */
    public function __construct(
        CarUnitCalculator $carUnitCalculator,
        MoveUnitCalculator $moveUnitCalculator
    ) {
        $this->carUnitCalculator = $carUnitCalculator;
        $this->moveUnitCalculator = $moveUnitCalculator;
    }

    /**
     * Create a new invoice with calculated prices
     * 
     * @param array $data The validated input data
     * @return Invoice
     */
    public function createInvoice(array $data): Invoice
    {
        // Load all required related models
        $quarry = Quarry::findOrFail($data['quarry_id']);
        $customer = CustomerAccount::findOrFail($data['customer_id']);
        $car = null;
        
        if (isset($data['customer_car_id'])) {
            $car = Car::findOrFail($data['customer_car_id']);
        }

        // Set default values
        $data['cashier_id'] = $data['cashier_id'] ?? Auth::id();
        
        // Set invoice type based on customer's client_type
        $data['invoice_type'] = $customer->client_type === 'cash' ? 'cash' : 'postpaid';
        
        // Generate invoice number
        $data['invoice_number'] = $quarry->code . '-' . now()->format('YmdHis');
        
        // Calculate price, quantity and total based on unit type
        $calculatedValues = $this->calculateValues(
            $quarry,
            $car,
            $customer,
            $data['the_items'],
            $data['supply'] ?? false
        );
        
        // Merge calculated values with input data
        $data = array_merge($data, $calculatedValues);
        
        // Create and return the invoice
        return Invoice::create($data);
    }

    /**
     * Update an existing invoice with recalculated prices
     * 
     * @param Invoice $invoice The invoice to update
     * @param array $data The validated input data
     * @return Invoice
     */
    public function updateInvoice(Invoice $invoice, array $data): Invoice
    {
        // Load all required related models
        $quarry = Quarry::findOrFail($data['quarry_id'] ?? $invoice->quarry_id);
        $customer = CustomerAccount::findOrFail($data['customer_id'] ?? $invoice->customer_id);
        
        $carId = $data['customer_car_id'] ?? $invoice->customer_car_id;
        $car = $carId ? Car::findOrFail($carId) : null;
        
        // Set invoice type based on customer's client_type
        $data['invoice_type'] = $customer->client_type === 'cash' ? 'cash' : 'postpaid';
        
        // Calculate price, quantity and total based on unit type if necessary values are changing
        if (isset($data['the_items']) || isset($data['supply']) || isset($data['quarry_id']) || 
            isset($data['customer_id']) || isset($data['customer_car_id'])) {
            
            $items = $data['the_items'] ?? $invoice->the_items;
            $supply = $data['supply'] ?? $invoice->supply;
            
            $calculatedValues = $this->calculateValues(
                $quarry,
                $car,
                $customer,
                $items,
                $supply
            );
            
            // Merge calculated values with input data
            $data = array_merge($data, $calculatedValues);
        }
        
        // Update and return the invoice
        $invoice->update($data);
        return $invoice->fresh();
    }

    /**
     * Calculate invoice values based on quarry unit type
     */
    protected function calculateValues(
        Quarry $quarry, 
        ?Car $car, 
        CustomerAccount $customer, 
        string $items,
        bool $supply
    ): array {
        if (!$car) {
            return [
                'item_price' => 0,
                'quantity' => 0,
                'total' => 0
            ];
        }
        
        // Use appropriate calculator based on unit type
        if ($quarry->unit === 'car') {
            return $this->carUnitCalculator->calculate($quarry, $car, $customer, $items, $supply);
        } else { // 'move' unit type
            return $this->moveUnitCalculator->calculate($quarry, $car, $customer, $items, $supply);
        }
    }
}
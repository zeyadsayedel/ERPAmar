<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'cashier_id' => $this->cashier_id,
            'cashier' => $this->whenLoaded('cashier', function() {
                return [
                    'id' => $this->cashier->id,
                    'name' => $this->cashier->name,
                ];
            }),
            'quarry_id' => $this->quarry_id,
            'quarry' => $this->whenLoaded('quarry', function() {
                return [
                    'id' => $this->quarry->id,
                    'name' => $this->quarry->name,
                ];
            }),
            'invoice_type' => $this->invoice_type,
            'customer_id' => $this->customer_id,
            'customer' => $this->whenLoaded('customer', function() {
                return [
                    'id' => $this->customer->id,
                    'name' => $this->customer->name,
                ];
            }),
            'customer_car_id' => $this->customer_car_id,
            'customerCar' => $this->whenLoaded('customerCar', function() {
                return [
                    'id' => $this->customerCar->id,
                    'name' => $this->customerCar->name,
                ];
            }),
            'unit' => $this->unit,
            'contractor_id' => $this->contractor_id,
            'contractor' => $this->whenLoaded('contractor', function() {
                return [
                    'id' => $this->contractor->id,
                    'name' => $this->contractor->name,
                ];
            }),
            'custody' => (float) $this->custody,
            'the_items' => $this->the_items,
            'item_price' => (float) $this->item_price,
            'total' => (float) $this->total,
            'quantity' => (float) $this->quantity,
            'flag' => (int) $this->flag,
            'supply' => (bool) $this->supply,
            'start_day' => (bool) $this->start_day,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
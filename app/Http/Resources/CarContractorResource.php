<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarContractorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'contact_person' => $this->contact_person,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'tax_number' => $this->tax_number,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            // Only include relationships when they are loaded
            'cars' => $this->whenLoaded('cars', function () {
                return $this->cars->map(function ($car) {
                    return [
                        'id' => $car->id,
                        'name' => $car->name,
                        'car_load' => $car->car_load,
                    ];
                });
            }),
            'quarries' => $this->whenLoaded('quarries', function () {
                return $this->quarries->map(function ($quarry) {
                    return [
                        'id' => $quarry->id,
                        'name' => $quarry->name,
                    ];
                });
            }),
            'customers' => $this->whenLoaded('customers', function () {
                return $this->customers->map(function ($customer) {
                    return [
                        'id' => $customer->id,
                        'name' => $customer->name,
                    ];
                });
            }),
            'supplyClients' => $this->whenLoaded('supplyClients', function () {
                return $this->supplyClients->map(function ($client) {
                    return [
                        'id' => $client->id,
                        'name' => $client->name,
                    ];
                });
            }),
            'invoices' => $this->whenLoaded('invoices', function () {
                return $this->invoices->map(function ($invoice) {
                    return [
                        'id' => $invoice->id,
                        'invoice_number' => $invoice->invoice_number,
                        'contractor_id' => $invoice->contractor_id,
                    ];
                });
            }),
        ];
    }
}

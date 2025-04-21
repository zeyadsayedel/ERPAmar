<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerAccountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'client_type' => $this->client_type,
            'walk_in_customer' => (bool) $this->walk_in_customer,
            'sand_price' => (float) $this->sand_price,
            'soil_price' => (float) $this->soil_price,
            'zalat_price' => (float) $this->zalat_price,
            'rubble_price' => (float) $this->rubble_price,
            'tractor_sand_price' => (float) $this->tractor_sand_price,
            'trilla_sand_price' => (float) $this->trilla_sand_price,
            'faradani_sand_price' => (float) $this->faradani_sand_price,
            'faradani_double_sand_price' => (float) $this->faradani_double_sand_price,
            'farm_tractor_sand_price' => (float) $this->farm_tractor_sand_price,
            'tractor_soil_price' => (float) $this->tractor_soil_price,
            'trilla_soil_price' => (float) $this->trilla_soil_price,
            'faradani_soil_price' => (float) $this->faradani_soil_price,
            'faradani_double_soil_price' => (float) $this->faradani_double_soil_price,
            'farm_tractor_soil_price' => (float) $this->farm_tractor_soil_price,
            'tractor_zalat_price' => (float) $this->tractor_zalat_price,
            'trilla_zalat_price' => (float) $this->trilla_zalat_price,
            'faradani_zalat_price' => (float) $this->faradani_zalat_price,
            'faradani_double_zalat_price' => (float) $this->faradani_double_zalat_price,
            'farm_tractor_zalat_price' => (float) $this->farm_tractor_zalat_price,
            'tractor_rubble_price' => (float) $this->tractor_rubble_price,
            'trilla_rubble_price' => (float) $this->trilla_rubble_price,
            'faradani_rubble_price' => (float) $this->faradani_rubble_price,
            'faradani_double_rubble_price' => (float) $this->faradani_double_rubble_price,
            'farm_tractor_rubble_price' => (float) $this->farm_tractor_rubble_price,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'quarries' => $this->whenLoaded('quarries', function() {
                return QuarryResource::collection($this->quarries);
            }),
            'contractors' => $this->whenLoaded('contractors', function() {
                return CarContractorResource::collection($this->contractors);
            }),
        ];
    }
}
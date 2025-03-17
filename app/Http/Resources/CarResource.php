<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'car_load' => (float) $this->car_load,
            'type_of_car' => $this->type_of_car,
            'car_load_supply' => (float) $this->car_load_supply,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuarryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'army_account' => (float) $this->army_account,
            'royalty_account' => (float) $this->royalty_account,
            'loader_account' => (float) $this->loader_account,
            'army_status' => (bool) $this->army_status,
            'calculate_loader_hours' => (float) $this->calculate_loader_hours,
            'quarry_case' => (bool) $this->quarry_case,
            'company_smoke_account_for_tractor' => (float) $this->company_smoke_account_for_tractor,
            'tractor_loaders_smoke' => (float) $this->tractor_loaders_smoke,
            'tractor_sand_transfer_price' => (float) $this->tractor_sand_transfer_price,
            'trilla_sand_transfer_price' => (float) $this->trilla_sand_transfer_price,
            'faradani_sand_transfer_price' => (float) $this->faradani_sand_transfer_price,
            'faradani_double_sand_transfer_price' => (float) $this->faradani_double_sand_transfer_price,
            'farm_tractor_sand_transfer_price' => (float) $this->farm_tractor_sand_transfer_price,
            'royalty_status' => (bool) $this->royalty_status,
            'loader_hours_status' => (bool) $this->loader_hours_status,
            'printed' => (float) $this->printed,
            'unit' => $this->unit,
            'code' => $this->code,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

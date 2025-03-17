<?php

namespace App\Http\Requests\Quarry;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuarryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'army_account' => 'nullable|numeric',
            'royalty_account' => 'nullable|numeric',
            'loader_account' => 'nullable|numeric',
            'army_status' => 'nullable|boolean',
            'calculate_loader_hours' => 'nullable|numeric',
            'quarry_case' => 'nullable|boolean',
            'company_smoke_account_for_tractor' => 'nullable|numeric',
            'tractor_loaders_smoke' => 'nullable|numeric',
            'tractor_sand_transfer_price' => 'nullable|numeric',
            'trilla_sand_transfer_price' => 'nullable|numeric',
            'faradani_sand_transfer_price' => 'nullable|numeric',
            'faradani_double_sand_transfer_price' => 'nullable|numeric',
            'farm_tractor_sand_transfer_price' => 'nullable|numeric',
            'royalty_status' => 'nullable|boolean',
            'loader_hours_status' => 'nullable|boolean',
            'printed' => 'nullable|numeric',
            'unit' => 'nullable|string',
            'code' => 'nullable|string',
        ];
    }
}

<?php

namespace App\Http\Requests\CustomerAccount;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'client_type' => 'nullable|string|max:255',
            'walk_in_customer' => 'nullable|boolean',
            'sand_price' => 'nullable|numeric',
            'soil_price' => 'nullable|numeric',
            'zalat_price' => 'nullable|numeric',
            'rubble_price' => 'nullable|numeric',
            'tractor_sand_price' => 'nullable|numeric',
            'trilla_sand_price' => 'nullable|numeric',
            'faradani_sand_price' => 'nullable|numeric',
            'faradani_double_sand_price' => 'nullable|numeric',
            'farm_tractor_sand_price' => 'nullable|numeric',
            'tractor_soil_price' => 'nullable|numeric',
            'trilla_soil_price' => 'nullable|numeric',
            'faradani_soil_price' => 'nullable|numeric',
            'faradani_double_soil_price' => 'nullable|numeric',
            'farm_tractor_soil_price' => 'nullable|numeric',
            'tractor_zalat_price' => 'nullable|numeric',
            'trilla_zalat_price' => 'nullable|numeric',
            'faradani_zalat_price' => 'nullable|numeric',
            'faradani_double_zalat_price' => 'nullable|numeric',
            'farm_tractor_zalat_price' => 'nullable|numeric',
            'tractor_rubble_price' => 'nullable|numeric',
            'trilla_rubble_price' => 'nullable|numeric',
            'faradani_rubble_price' => 'nullable|numeric',
            'faradani_double_rubble_price' => 'nullable|numeric',
            'farm_tractor_rubble_price' => 'nullable|numeric',
            'quarry_ids' => 'nullable|array',
            'quarry_ids.*' => 'exists:quarries,id',
            'contractor_ids' => 'nullable|array',
            'contractor_ids.*' => 'exists:car_contractors,id',
        ];
    }
}
<?php

namespace App\Http\Requests\CarContractor;

use Illuminate\Foundation\Http\FormRequest;

class StoreCarContractorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'tax_number' => ['nullable', 'string', 'max:50'],
            'car_ids' => ['nullable', 'array'],
            'car_ids.*' => ['exists:car,id'],
            'quarry_ids' => ['nullable', 'array'],
            'quarry_ids.*' => ['exists:quarry,id'],
            'customer_ids' => ['nullable', 'array'],
            'customer_ids.*' => ['exists:customer_accounts,id'],
            'supply_client_ids' => ['nullable', 'array'],
            'supply_client_ids.*' => ['exists:supply_clients,id'],
        ];
    }
}

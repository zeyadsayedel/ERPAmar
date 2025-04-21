<?php

namespace App\Http\Requests\Invoice;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cashier_id' => 'nullable|exists:users,id',
            'quarry_id' => 'nullable|exists:quarries,id',
            'invoice_type' => 'nullable|in:postpaid,cash',
            'customer_id' => 'nullable|exists:customer_accounts,id',
            'customer_car_id' => 'nullable|exists:cars,id',
            'unit' => 'nullable|in:move,car',
            'contractor_id' => 'nullable|exists:car_contractors,id',
            'custody' => 'nullable|numeric',
            'the_items' => 'nullable|in:رمال,تربه,زلط,رديم',
            'item_price' => 'nullable|numeric',
            'total' => 'nullable|numeric',
            'quantity' => 'nullable|numeric',
            'flag' => 'nullable|integer|min:0',
            'supply' => 'nullable|boolean',
            'start_day' => 'nullable|boolean',
        ];
    }
}

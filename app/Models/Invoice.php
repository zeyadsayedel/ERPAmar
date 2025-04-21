<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'cashier_id',
        'quarry_id',
        'invoice_type',
        'customer_id',
        'customer_car_id',
        'unit',
        'contractor_id',
        'custody',
        'the_items',
        'item_price',
        'total',
        'quantity',
        'flag',
        'supply',
        'start_day',
    ];

    protected $casts = [
        'supply' => 'boolean',
        'start_day' => 'boolean',
        'flag' => 'integer',
        'invoice_type' => 'string',
        'unit' => 'string',
        'the_items' => 'string',
    ];

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function quarry(): BelongsTo
    {
        return $this->belongsTo(Quarry::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(CustomerAccount::class, 'customer_id');
    }

    public function customerCar(): BelongsTo
    {
        return $this->belongsTo(Car::class, 'customer_car_id');
    }

    public function contractor(): BelongsTo
    {
        return $this->belongsTo(CarContractor::class, 'contractor_id');
    }
}

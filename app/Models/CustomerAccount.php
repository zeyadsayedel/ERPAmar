<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomerAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'client_type',
        'walk_in_customer',
        'sand_price',
        'soil_price',
        'zalat_price',
        'rubble_price',
        'tractor_sand_price',
        'trilla_sand_price',
        'faradani_sand_price',
        'faradani_double_sand_price',
        'farm_tractor_sand_price',
        'tractor_soil_price',
        'trilla_soil_price',
        'faradani_soil_price',
        'faradani_double_soil_price',
        'farm_tractor_soil_price',
        'tractor_zalat_price',
        'trilla_zalat_price',
        'faradani_zalat_price',
        'faradani_double_zalat_price',
        'farm_tractor_zalat_price',
        'tractor_rubble_price',
        'trilla_rubble_price',
        'faradani_rubble_price',
        'faradani_double_rubble_price',
        'farm_tractor_rubble_price',
    ];

    protected $casts = [
        'walk_in_customer' => 'boolean',
        'client_type' => 'string',
    ];

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'customer_id');
    }

    public function quarries(): BelongsToMany
    {
        return $this->belongsToMany(Quarry::class, 'customer_quarry');
    }

    public function contractors(): BelongsToMany
    {
        return $this->belongsToMany(CarContractor::class, 'car_contractor_customer_account');
    }
}


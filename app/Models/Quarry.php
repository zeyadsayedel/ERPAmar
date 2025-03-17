<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quarry extends Model
{
    protected $table = 'quarry';

    protected $fillable = [
        'name',
        'army_account',
        'royalty_account',
        'loader_account',
        'army_status',
        'calculate_loader_hours',
        'quarry_case',
        'company_smoke_account_for_tractor',
        'tractor_loaders_smoke',
        'tractor_sand_transfer_price',
        'trilla_sand_transfer_price',
        'faradani_sand_transfer_price',
        'faradani_double_sand_transfer_price',
        'farm_tractor_sand_transfer_price',
        'trilla_loaders_smoke',
        'faradani_loaders_smoke',
        'faradani_double_loaders_smoke',
        'farm_tractor_loaders_smoke',
        'company_smoke_account_for_trilla',
        'company_smoke_account_for_faradani',
        'company_smoke_account_for_faradani_double',
        'company_smoke_account_for_farm_tractor',
        'tractor_soil_transfer_price',
        'trilla_soil_transfer_price',
        'faradani_soil_transfer_price',
        'faradani_double_soil_transfer_price',
        'farm_tractor_soil_transfer_price',
        'tractor_zalat_transfer_price',
        'trilla_zalat_transfer_price',
        'faradani_zalat_transfer_price',
        'faradani_double_zalat_transfer_price',
        'farm_tractor_zalat_transfer_price',
        'tractor_rubble_transfer_price',
        'trilla_rubble_transfer_price',
        'faradani_rubble_transfer_price',
        'faradani_double_rubble_transfer_price',
        'farm_tractor_rubble_transfer_price',
        'royalty_status',
        'loader_hours_status',
        'printed',
        'unit',
        'code',
    ];

    protected $casts = [
        'army_account' => 'decimal:2',
        'royalty_account' => 'decimal:2',
        'loader_account' => 'decimal:2',
        'army_status' => 'boolean',
        'calculate_loader_hours' => 'decimal:2',
        'quarry_case' => 'boolean',
        'printed' => 'decimal:0',
        'unit' => 'string',
        'royalty_status' => 'boolean',
        'loader_hours_status' => 'boolean',
    ];

    public function cars()
    {
        return $this->hasMany(Car::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}

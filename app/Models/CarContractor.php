<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CarContractor extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'contractor_id');
    }

    public function cars(): BelongsToMany
    {
        return $this->belongsToMany(Car::class, 'car_contractor_car');
    }

    public function quarries(): BelongsToMany
    {
        return $this->belongsToMany(Quarry::class, 'car_contractor_quarry');
    }

    public function customers(): BelongsToMany
    {
        return $this->belongsToMany(CustomerAccount::class, 'car_contractor_customer_account');
    }

    public function supplyClients(): BelongsToMany
    {
        return $this->belongsToMany(SupplyClient::class, 'car_contractor_supply_client');
    }
}

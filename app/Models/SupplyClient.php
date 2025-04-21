<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class SupplyClient extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'company_name',
        'address',
        'email',
        'phone_number',
    ];

    public function contractors(): BelongsToMany
    {
        return $this->belongsToMany(CarContractor::class, 'car_contractor_supply_client');
    }
}

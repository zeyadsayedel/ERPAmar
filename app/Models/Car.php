<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Car extends Model
{
    use HasFactory;
    
    protected $table = 'car'; // Custom table name

    protected $fillable = [
        'name',
        'car_load',
        'type_of_car',
        'car_load_supply',
    ];

    protected $casts = [
        'car_load' => 'decimal:2',
        'car_load_supply' => 'decimal:2',
        'type_of_car' => 'string',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'customer_car_id');
    }

    public function contractors(): BelongsToMany
    {
        return $this->belongsToMany(CarContractor::class, 'car_contractor_car');
    }
}

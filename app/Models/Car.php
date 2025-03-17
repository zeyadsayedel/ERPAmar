<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
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
}

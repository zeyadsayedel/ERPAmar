<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Cars to contractors pivot
        Schema::create('car_contractor_car', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_contractor_id')->constrained()->onDelete('cascade');
            $table->foreignId('car_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // Quarries to contractors pivot
        Schema::create('car_contractor_quarry', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_contractor_id')->constrained()->onDelete('cascade');
            $table->foreignId('quarry_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // Customers to contractors pivot
        Schema::create('car_contractor_customer_account', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_contractor_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_account_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // Supply clients to contractors pivot
        Schema::create('car_contractor_supply_client', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_contractor_id')->constrained()->onDelete('cascade');
            $table->foreignId('supply_client_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_contractor_supply_client');
        Schema::dropIfExists('car_contractor_customer_account');
        Schema::dropIfExists('car_contractor_quarry');
        Schema::dropIfExists('car_contractor_car');
    }
};

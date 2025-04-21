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
        Schema::create('customer_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('client_type', ['cash', 'postpaid']);
            $table->boolean('walk_in_customer')->default(false);

            // Material pricing
            $table->decimal('sand_price', 12, 2)->nullable();
            $table->decimal('soil_price', 12, 2)->nullable();
            $table->decimal('zalat_price', 12, 2)->nullable();
            $table->decimal('rubble_price', 12, 2)->nullable();

            // Vehicle-specific sand pricing
            $table->decimal('tractor_sand_price', 12, 2)->nullable();
            $table->decimal('trilla_sand_price', 12, 2)->nullable();
            $table->decimal('faradani_sand_price', 12, 2)->nullable();
            $table->decimal('faradani_double_sand_price', 12, 2)->nullable();
            $table->decimal('farm_tractor_sand_price', 12, 2)->nullable();

            // Vehicle-specific soil pricing
            $table->decimal('tractor_soil_price', 12, 2)->nullable();
            $table->decimal('trilla_soil_price', 12, 2)->nullable();
            $table->decimal('faradani_soil_price', 12, 2)->nullable();
            $table->decimal('faradani_double_soil_price', 12, 2)->nullable();
            $table->decimal('farm_tractor_soil_price', 12, 2)->nullable();

            // Vehicle-specific zalat pricing
            $table->decimal('tractor_zalat_price', 12, 2)->nullable();
            $table->decimal('trilla_zalat_price', 12, 2)->nullable();
            $table->decimal('faradani_zalat_price', 12, 2)->nullable();
            $table->decimal('faradani_double_zalat_price', 12, 2)->nullable();
            $table->decimal('farm_tractor_zalat_price', 12, 2)->nullable();

            // Vehicle-specific rubble pricing
            $table->decimal('tractor_rubble_price', 12, 2)->nullable();
            $table->decimal('trilla_rubble_price', 12, 2)->nullable();
            $table->decimal('faradani_rubble_price', 12, 2)->nullable();
            $table->decimal('faradani_double_rubble_price', 12, 2)->nullable();
            $table->decimal('farm_tractor_rubble_price', 12, 2)->nullable();

            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_accounts');
    }
};

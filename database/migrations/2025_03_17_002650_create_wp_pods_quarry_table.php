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
        Schema::create('quarry', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable();
            $table->decimal('army_account', 12)->nullable();
            $table->decimal('royalty_account', 12)->nullable();
            $table->decimal('loader_account', 12)->nullable();
            $table->boolean('army_status')->nullable()->default(false);
            $table->decimal('calculate_loader_hours', 12)->nullable();
            $table->boolean('quarry_case')->nullable()->default(false);
            $table->decimal('company_smoke_account_for_tractor', 12)->nullable();
            $table->decimal('tractor_loaders_smoke', 12)->nullable();
            $table->decimal('tractor_sand_transfer_price', 12)->nullable();
            $table->decimal('trilla_sand_transfer_price', 12)->nullable();
            $table->decimal('faradani_sand_transfer_price', 12)->nullable();
            $table->decimal('faradani_double_sand_transfer_price', 12)->nullable();
            $table->decimal('farm_tractor_sand_transfer_price', 12, 0)->nullable();
            $table->decimal('trilla_loaders_smoke', 12)->nullable();
            $table->decimal('faradani_loaders_smoke', 12)->nullable();
            $table->decimal('faradani_double_loaders_smoke', 12)->nullable();
            $table->decimal('farm_tractor_loaders_smoke', 12)->nullable();
            $table->decimal('company_smoke_account_for_trilla', 12)->nullable();
            $table->decimal('company_smoke_account_for_faradani', 12)->nullable();
            $table->decimal('company_smoke_account_for_faradani_double', 12)->nullable();
            $table->decimal('company_smoke_account_for_farm_tractor', 12)->nullable();
            $table->decimal('tractor_soil_transfer_price', 12)->nullable();
            $table->decimal('trilla_soil_transfer_price', 12)->nullable();
            $table->decimal('faradani_soil_transfer_price', 12)->nullable();
            $table->decimal('faradani_double_soil_transfer_price', 12)->nullable();
            $table->decimal('farm_tractor_soil_transfer_price', 12)->nullable();
            $table->decimal('tractor_zalat_transfer_price', 12)->nullable();
            $table->decimal('trilla_zalat_transfer_price', 12)->nullable();
            $table->decimal('faradani_zalat_transfer_price', 12)->nullable();
            $table->decimal('faradani_double_zalat_transfer_price', 12)->nullable();
            $table->decimal('farm_tractor_zalat_transfer_price', 12)->nullable();
            $table->decimal('tractor_rubble_transfer_price', 12)->nullable();
            $table->decimal('trilla_rubble_transfer_price', 12)->nullable();
            $table->decimal('faradani_rubble_transfer_price', 12)->nullable();
            $table->decimal('faradani_double_rubble_transfer_price', 12)->nullable();
            $table->decimal('farm_tractor_rubble_transfer_price', 12)->nullable();
            $table->boolean('royalty_status')->nullable()->default(false);
            $table->boolean('loader_hours_status')->nullable()->default(false);
            $table->decimal('printed', 12, 0)->nullable();
            $table->longText('unit')->nullable();
            $table->string('code')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quarry');
    }
};

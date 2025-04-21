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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cashier_id')->constrained('users');
            $table->foreignId('quarry_id')->constrained();
            $table->enum('invoice_type', ['postpaid', 'cash']);
            $table->foreignId('customer_id')->constrained('customer_accounts');
            $table->foreignId('customer_car_id')->constrained('cars');
            $table->enum('unit', ['move', 'car'])->default('car');
            $table->foreignId('contractor_id')->nullable()->constrained('car_contractors');
            $table->decimal('custody', 12, 2)->nullable();
            $table->enum('the_items', ['رمال', 'تربه', 'زلط', 'رديم']);
            $table->decimal('item_price', 12, 2)->nullable();
            $table->decimal('total', 12, 2)->nullable();
            $table->decimal('quantity', 12, 2)->nullable();
            $table->tinyInteger('flag')->default(1);
            $table->boolean('supply')->default(false);
            $table->boolean('start_day')->default(false);
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};

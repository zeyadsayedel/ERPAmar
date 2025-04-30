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
        Schema::create('paper_invoices', function (Blueprint $table) {
            $table->id();
            // --- contextual header fields ---
            $table->foreignId('quarry_id')        // quarry that owns the day-sheet
                ->constrained()
                ->cascadeOnDelete();
            $table->date('invoice_date');         // day this sheet represents
            $table->unsignedBigInteger('user_id')  //  “user” ≈ cashier or administrator
                ->nullable()
                ->index();

            // --- aggregate totals (calculated once on save) ---
            $table->unsignedInteger('total_count')->default(0);
            $table->decimal('total_meters',   12, 2)->default(0);
            $table->decimal('total_revenue',  12, 2)->default(0);
            $table->decimal('total_expenses', 12, 2)->default(0);
            $table->decimal('total_net',      12, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paper_invoices');
    }
};

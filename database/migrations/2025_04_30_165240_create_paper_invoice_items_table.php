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
        Schema::create('paper_invoice_items', function (Blueprint $table) {
            $table->id();
            // parent link
            $table->foreignId('paper_invoice_id')
                ->constrained()
                ->cascadeOnDelete();

            // per-row fields
            $table->unsignedInteger('number')->comment('Sequential trip number');
            $table->string('from')->nullable();
            $table->string('to')->nullable();
            $table->decimal('meters', 10, 2)->default(0);

            $table->string('client_type')->nullable();

            $table->decimal('revenue',  12, 2)->default(0);
            $table->decimal('expenses', 12, 2)->default(0);

            $table->string('statement')->nullable();   // expense description

            // quick look-up optimisation
            $table->index(['paper_invoice_id', 'number']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paper_invoice_items');
    }
};

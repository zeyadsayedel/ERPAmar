<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaperInvoice extends Model
{
    protected $fillable = [
        'quarry_id',
        'invoice_date',
        'user_id',
        'total_count',
        'total_meters',
        'total_revenue',
        'total_expenses',
        'total_net',
    ];

    protected $casts = [
        'invoice_date' => 'date',
        'total_count' => 'integer',
        'total_meters' => 'decimal:2',
        'total_revenue' => 'decimal:2',
        'total_expenses' => 'decimal:2',
        'total_net' => 'decimal:2',
    ];

    /**
     * Get the items for the invoice.
     */
    public function items(): HasMany
    {
        return $this->hasMany(PaperInvoiceItem::class);
    }

    /**
     * Get the quarry that owns the invoice.
     */
    public function quarry(): BelongsTo
    {
        return $this->belongsTo(Quarry::class);
    }

    /**
     * Get the user (cashier) that created the invoice.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Calculate totals based on invoice items.
     */
    public function calculateTotals(): void
    {
        $items = $this->items;
        
        $this->total_count = $items->count();
        $this->total_meters = $items->sum('meters');
        $this->total_revenue = $items->sum('revenue');
        $this->total_expenses = $items->sum('expenses');
        $this->total_net = $this->total_revenue - $this->total_expenses;
        
        $this->save();
    }
}

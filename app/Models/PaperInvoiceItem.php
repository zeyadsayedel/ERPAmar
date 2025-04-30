<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaperInvoiceItem extends Model
{
    protected $fillable = [
        'paper_invoice_id',
        'number',
        'from',
        'to',
        'meters',
        'client_type',
        'revenue',
        'expenses',
        'statement',
    ];

    protected $casts = [
        'number' => 'integer',
        'meters' => 'decimal:2',
        'revenue' => 'decimal:2',
        'expenses' => 'decimal:2',
    ];

    /**
     * Get the invoice that owns the item.
     */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(PaperInvoice::class, 'paper_invoice_id');
    }
}

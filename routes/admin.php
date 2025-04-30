<?php

use App\Http\Controllers\Admin\PaperInvoiceController;
use Illuminate\Support\Facades\Route;

// Paper Invoices Routes
Route::resource('paper-invoices', PaperInvoiceController::class);
Route::get('paper-invoices/{paperInvoice}/print', [PaperInvoiceController::class, 'printView'])
    ->name('paper-invoices.print');
Route::get('paper-invoices/{paperInvoice}/pdf', [PaperInvoiceController::class, 'exportPdf'])
    ->name('paper-invoices.pdf');

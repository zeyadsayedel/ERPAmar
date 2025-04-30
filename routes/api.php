<?php

use App\Http\Controllers\Api\PaperInvoiceController;
use Illuminate\Support\Facades\Route;

// API Routes for Paper Invoices
Route::apiResource('paper-invoices', PaperInvoiceController::class);

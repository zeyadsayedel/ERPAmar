<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Invoice\StoreInvoiceRequest;
use App\Http\Requests\Invoice\UpdateInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use App\Services\Invoice\InvoicePricingService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class InvoiceController extends Controller
{
    protected InvoicePricingService $invoicePricingService;
    
    public function __construct(InvoicePricingService $invoicePricingService)
    {
        $this->invoicePricingService = $invoicePricingService;
    }

    /**
     * Display a listing of the invoices.
     */    
    public function index(): AnonymousResourceCollection
    {
        $invoices = Invoice::with(['quarry', 'customer', 'customerCar', 'contractor', 'cashier'])->get();
        return InvoiceResource::collection($invoices);
    }

    /**
     * Store a newly created invoice in storage.
     */
    public function store(StoreInvoiceRequest $request): InvoiceResource
    {
        // Use the invoice service to create the invoice with calculated prices
        $invoice = $this->invoicePricingService->createInvoice($request->validated());
        
        return new InvoiceResource($invoice->load(['quarry', 'customer', 'customerCar', 'contractor', 'cashier']));
    }

    /**
     * Display the specified invoice.
     */
    public function show(Invoice $invoice): InvoiceResource
    {
        $invoice->load(['quarry', 'customer', 'customerCar', 'contractor', 'cashier']);
        return new InvoiceResource($invoice);
    }

    /**
     * Update the specified invoice in storage.
     */
    public function update(UpdateInvoiceRequest $request, Invoice $invoice): InvoiceResource
    {
        // Use the invoice service to update the invoice with recalculated prices
        $this->invoicePricingService->updateInvoice($invoice, $request->validated());
        
        return new InvoiceResource($invoice->fresh(['quarry', 'customer', 'customerCar', 'contractor', 'cashier']));
    }

    /**
     * Remove the specified invoice from storage.
     */
    public function destroy(Invoice $invoice): Response
    {
        $invoice->delete();
        return response()->noContent();
    }
}
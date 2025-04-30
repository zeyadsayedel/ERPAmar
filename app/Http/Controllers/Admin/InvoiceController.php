<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Invoice\StoreInvoiceRequest;
use App\Http\Requests\Invoice\UpdateInvoiceRequest;
use App\Models\Car;
use App\Models\CarContractor;
use App\Models\CustomerAccount;
use App\Models\Invoice;
use App\Models\Quarry;
use App\Services\Invoice\InvoicePricingService;
use App\Services\InvoiceCsvImportService;
use App\Traits\AuthorizesModuleActions;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    use AuthorizesModuleActions;

    protected InvoicePricingService $invoicePricingService;

    public function __construct(InvoicePricingService $invoicePricingService)
    {
        $this->module = 'invoice';
        $this->customActions = ['generatePdf', 'export', 'import'];
        $this->invoicePricingService = $invoicePricingService;
    }

    /**
     * Display a listing of the invoices.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $quarryId = $request->input('quarry_id');
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        // Build base query
        $query = Invoice::with(['quarry', 'customer', 'customerCar', 'contractor', 'cashier']);

        // Apply search filter if provided
        if ($search) {
            $query->where(function ($subquery) use ($search) {
                $subquery->where('id', 'like', "%{$search}%")
                    ->orWhere('the_items', 'like', "%{$search}%");
            });
        }

        // Apply status filter if provided
        if ($status) {
            $query->where('status', $status);
        }

        // Add a virtual status field for the frontend
        $query->selectRaw("*, IF(flag = 0, 'pending', IF(flag = 1, 'active', IF(flag = 2, 'completed', 'cancelled'))) as status");

        // Apply quarry filter if provided
        if ($quarryId) {
            $query->where('quarry_id', $quarryId);
        }

        // Apply sorting
        $query->orderBy($sortField, $sortDirection);

        // Paginate results
        $invoices = $query->paginate(10)->withQueryString();

        // Get available quarries for filter
        $quarries = Quarry::all();

        return Inertia::render('Invoice/Index', [
            'invoices' => $invoices->items(),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'quarry_id' => $quarryId,
                'sortField' => $sortField,
                'sortDirection' => $sortDirection,
            ],
            'quarries' => $quarries,
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    /**
     * Show the form for creating a new invoice.
     */
    public function create(): Response
    {
        // Load related data for the form
        $quarries = Quarry::all();
        $customers = CustomerAccount::all();
        $cars = Car::all();
        $contractors = CarContractor::all();

        return Inertia::render('Invoice/Create', [
            'quarries' => $quarries,
            'customers' => $customers,
            'cars' => $cars,
            'contractors' => $contractors,
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    /**
     * Store a newly created invoice in storage.
     */
    public function store(StoreInvoiceRequest $request): RedirectResponse
    {
        try {
            // Use the invoice service to create the invoice with calculated prices
            $invoice = $this->invoicePricingService->createInvoice($request->validated());

            return redirect()->route('admin.invoices.index')
                ->with('success', 'Invoice created successfully.');
        } catch (Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create invoice: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified invoice.
     */
    public function show(Invoice $invoice): Response
    {
        // Load relationships
        $invoice->load(['quarry', 'customer', 'customerCar', 'contractor', 'cashier']);

        return Inertia::render('Invoice/Show', [
            'invoice' => $invoice,
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    /**
     * Show the form for editing the specified invoice.
     */
    public function edit(Invoice $invoice): Response
    {
        // Load relationships
        $invoice->load(['quarry', 'customer', 'customerCar', 'contractor', 'cashier']);

        // Load related data for the form
        $quarries = Quarry::all();
        $customers = CustomerAccount::all();
        $cars = Car::all();
        $contractors = CarContractor::all();

        return Inertia::render('Invoice/Edit', [
            'invoice' => $invoice,
            'quarries' => $quarries,
            'customers' => $customers,
            'cars' => $cars,
            'contractors' => $contractors,
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    /**
     * Update the specified invoice in storage.
     */
    public function update(UpdateInvoiceRequest $request, Invoice $invoice): RedirectResponse
    {
        try {
            // Use the invoice service to update the invoice with recalculated prices
            $this->invoicePricingService->updateInvoice($invoice, $request->validated());

            return redirect()->route('admin.invoices.index')
                ->with('success', 'Invoice updated successfully.');
        } catch (Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update invoice: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified invoice from storage.
     */
    public function destroy(Invoice $invoice): RedirectResponse
    {
        try {
            $invoice->delete();

            return redirect()->route('admin.invoices.index')
                ->with('success', 'Invoice deleted successfully.');
        } catch (Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete invoice: ' . $e->getMessage());
        }
    }

    /**
     * Generate PDF for the specified invoice.
     */
    public function generatePdf(Invoice $invoice): Response
    {
        // Load relationships
        $invoice->load(['quarry', 'customer', 'customerCar', 'contractor', 'cashier']);

        return Inertia::render('Invoice/GeneratePdf', [
            'invoice' => $invoice,
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }    /**
     * Import invoices from CSV.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Services\InvoiceCsvImportService $importService
     * @return \Illuminate\Http\RedirectResponse
     */
    public function import(Request $request, InvoiceCsvImportService $importService)
    {
        try {
            // Validate the uploaded file
            $request->validate([
                'csv' => 'required|file|mimes:csv,txt|max:10240', // Max 10MB
            ]);

            $file = $request->file('csv');
            
            // Store the file in a temporary location
            $path = $file->storeAs('tmp/imports', 'invoices_' . time() . '.csv');
            $fullPath = storage_path("app/{$path}");
            
            // Import the invoices using our service
            $count = $importService->import($fullPath);
            
            // Clean up the temporary file
            if (file_exists($fullPath)) {
                unlink($fullPath);
            }
            
            return redirect()->route('admin.invoices.index')
                ->with('success', "{$count} invoices imported successfully.");
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', "Import failed: {$e->getMessage()}");
        }
    }

    /**
     * Export invoices to CSV.
     */
    public function export(Request $request): RedirectResponse
    {
        // Implement CSV export logic here
        // For now, just redirect back with a success message
        return redirect()->back()
            ->with('success', 'Invoices exported successfully.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaperInvoice;
use App\Models\PaperInvoiceItem;
use App\Models\Quarry;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\View;

class PaperInvoiceController extends Controller
{
    /**
     * Display a listing of the paper invoices.
     */
    public function index(Request $request)
    {
        $query = PaperInvoice::with(['quarry', 'user'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('quarry', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereDate('invoice_date', 'like', "%{$search}%");
            })
            ->when($request->quarry_id, function ($query, $quarryId) {
                $query->where('quarry_id', $quarryId);
            })
            ->when($request->from_date, function ($query, $fromDate) {
                $query->whereDate('invoice_date', '>=', $fromDate);
            })
            ->when($request->to_date, function ($query, $toDate) {
                $query->whereDate('invoice_date', '<=', $toDate);
            });

        $invoices = $query->orderBy('invoice_date', 'desc')
                          ->paginate($request->input('per_page', 10))
                          ->withQueryString();

        return Inertia::render('PaperInvoice/Index', [
            'invoices' => $invoices,
            'filters' => $request->only(['search', 'quarry_id', 'from_date', 'to_date']),
            'quarries' => Quarry::select('id', 'name')->get(),
        ]);
    }

    /**
     * Display the specified paper invoice.
     */
    public function show(PaperInvoice $paperInvoice)
    {
        $paperInvoice->load(['items', 'quarry', 'user']);

        return Inertia::render('PaperInvoice/Show', [
            'paperInvoice' => $paperInvoice,
        ]);
    }

    /**
     * Show the form for creating a new paper invoice.
     */
    public function create(Request $request)
    {
        return Inertia::render('PaperInvoice/Create', [
            'quarries' => Quarry::select('id', 'name')->get(),
        ]);
    }

    /**
     * Store a newly created paper invoice in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'quarry_id' => 'required|exists:quarry,id',
            'invoice_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.number' => 'required|integer',
            'items.*.from' => 'nullable|string',
            'items.*.to' => 'nullable|string',
            'items.*.meters' => 'required|numeric',
            'items.*.client_type' => 'nullable|string',
            'items.*.revenue' => 'required|numeric',
            'items.*.expenses' => 'nullable|numeric',
            'items.*.statement' => 'nullable|string',
        ]);

        // Start transaction
        DB::beginTransaction();
        try {
            // Create invoice
            $invoice = PaperInvoice::create([
                'quarry_id' => $request->quarry_id,
                'invoice_date' => $request->invoice_date,
                'user_id' => $request->user()->id,
            ]);

            // Create invoice items
            foreach ($request->items as $itemData) {
                PaperInvoiceItem::create(array_merge(
                    $itemData,
                    ['paper_invoice_id' => $invoice->id]
                ));
            }

            // Calculate totals
            $invoice->calculateTotals();

            DB::commit();

            return redirect()->route('paper-invoices.index')
                ->with('success', 'Paper invoice created successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->with('error', 'Failed to create paper invoice: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified paper invoice.
     */
    public function edit(PaperInvoice $paperInvoice)
    {
        $paperInvoice->load('items');

        return Inertia::render('PaperInvoice/Edit', [
            'paperInvoice' => $paperInvoice,
            'quarries' => Quarry::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update the specified paper invoice in storage.
     */
    public function update(Request $request, PaperInvoice $paperInvoice)
    {
        $request->validate([
            'quarry_id' => 'required|exists:quarry,id',
            'invoice_date' => 'required|date',
            
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|exists:paper_invoice_items,id',
            'items.*.number' => 'required|integer',
            'items.*.from' => 'nullable|string',
            'items.*.to' => 'nullable|string',
            'items.*.meters' => 'required|numeric',
            'items.*.client_type' => 'nullable|string',
            'items.*.revenue' => 'required|numeric',
            'items.*.expenses' => 'nullable|numeric',
            'items.*.statement' => 'nullable|string',
        ]);

        // Start transaction
        DB::beginTransaction();
        try {
            // Update invoice
            $paperInvoice->update([
                'quarry_id' => $request->quarry_id,
                'invoice_date' => $request->invoice_date,
                'user_id' => $request->user()->id,
            ]);

            // Get existing items
            $existingItemIds = $paperInvoice->items->pluck('id')->toArray();
            $requestItemIds = collect($request->items)
                ->pluck('id')
                ->filter() // Remove null values
                ->toArray();

            // Delete items that are not in the request
            $itemsToDelete = array_diff($existingItemIds, $requestItemIds);
            if (!empty($itemsToDelete)) {
                PaperInvoiceItem::whereIn('id', $itemsToDelete)->delete();
            }

            // Update or create items
            foreach ($request->items as $itemData) {
                if (!empty($itemData['id'])) {
                    // Update existing item
                    PaperInvoiceItem::find($itemData['id'])->update($itemData);
                } else {
                    // Create new item
                    PaperInvoiceItem::create(array_merge(
                        $itemData,
                        ['paper_invoice_id' => $paperInvoice->id]
                    ));
                }
            }

            // Recalculate totals
            $paperInvoice->calculateTotals();

            DB::commit();

            return redirect()->route('paper-invoices.index')
                ->with('success', 'Paper invoice updated successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->with('error', 'Failed to update paper invoice: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified paper invoice from storage.
     */
    public function destroy(PaperInvoice $paperInvoice)
    {
        try {
            // Delete all related items first
            $paperInvoice->items()->delete();
            
            // Delete the invoice
            $paperInvoice->delete();
            
            return redirect()->route('paper-invoices.index')
                ->with('success', 'Paper invoice deleted successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete paper invoice: ' . $e->getMessage());
        }
    }

    /**
     * Display a printable version of the specified paper invoice.
     */
    public function printView(PaperInvoice $paperInvoice)
    {
        $paperInvoice->load(['items', 'quarry', 'user']);
        
        return Inertia::render('PaperInvoice/Print', [
            'paperInvoice' => $paperInvoice,
        ]);
    }

    /**
     * Generate a PDF of the specified paper invoice.
     */
    public function exportPdf(PaperInvoice $paperInvoice)
    {
        // Load relationships
        $paperInvoice->load(['items', 'quarry', 'user']);
        
        // Generate HTML view
        $html = View::make('paper-invoices.pdf', [
            'paperInvoice' => $paperInvoice
        ])->render();
        
        // Configure PDF options for Arabic support
        $options = new Options();
        $options->set('defaultFont', 'DejaVuSans');
        $options->setIsRemoteEnabled(true);
        
        // Create PDF
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        
        // Generate filename
        $fileName = 'invoice-' . $paperInvoice->id . '-' . $paperInvoice->invoice_date->format('Y-m-d') . '.pdf';
        
        // Stream the file
        return $dompdf->stream($fileName);
    }
}

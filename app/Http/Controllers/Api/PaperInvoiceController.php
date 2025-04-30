<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaperInvoice;
use App\Models\PaperInvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Resources\Json\JsonResource;

class PaperInvoiceController extends Controller
{
    /**
     * Display a listing of the paper invoices.
     */
    public function index(Request $request)
    {
        $query = PaperInvoice::with(['quarry:id,name', 'user:id,name'])
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
                          ->paginate($request->input('per_page', 10));
                          
        return JsonResource::collection($invoices);
    }

    /**
     * Display the specified paper invoice.
     */
    public function show(PaperInvoice $paperInvoice)
    {
        $paperInvoice->load(['items', 'quarry:id,name', 'user:id,name']);
        
        return new JsonResource($paperInvoice);
    }

    /**
     * Store a newly created paper invoice in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'quarry_id' => 'required|exists:quarry,id',
            'invoice_date' => 'required|date',
            'user_id' => 'nullable|exists:users,id',
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
                'user_id' => $request->user_id,
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
            
            // Load relationships
            $invoice->load(['items', 'quarry:id,name', 'user:id,name']);

            DB::commit();

            return new JsonResource($invoice);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to create paper invoice',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified paper invoice in storage.
     */
    public function update(Request $request, PaperInvoice $paperInvoice)
    {
        $request->validate([
            'quarry_id' => 'required|exists:quarry,id',
            'invoice_date' => 'required|date',
            'user_id' => 'nullable|exists:users,id',
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
                'user_id' => $request->user_id,
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
            
            // Load relationships
            $paperInvoice->load(['items', 'quarry:id,name', 'user:id,name']);

            DB::commit();

            return new JsonResource($paperInvoice);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to update paper invoice',
                'error' => $e->getMessage()
            ], 500);
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
            
            return response()->json([
                'message' => 'Paper invoice deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete paper invoice',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

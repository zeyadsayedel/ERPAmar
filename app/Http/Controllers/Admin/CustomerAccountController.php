<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomerAccount\StoreCustomerAccountRequest;
use App\Http\Requests\CustomerAccount\UpdateCustomerAccountRequest;
use App\Models\CustomerAccount;
use App\Traits\AuthorizesModuleActions;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerAccountController extends Controller
{
    use AuthorizesModuleActions;

    public function __construct()
    {
        $this->module = 'customer_account';
        $this->customActions = ['export', 'import'];
    }    public function index(): Response
    {
        return Inertia::render('CustomerAccount/Index', [
            'customers' => CustomerAccount::all(),
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }    public function create(): Response
    {
        return Inertia::render('CustomerAccount/Create', [
            'quarries' => \App\Models\Quarry::select('id', 'name')->get(),
            'contractors' => \App\Models\CarContractor::select('id', 'name')->get(),
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }    public function store(StoreCustomerAccountRequest $request)
    {
        $validated = $request->validated();
        
        // Extract relationship IDs
        $quarryIds = $validated['quarry_ids'] ?? [];
        $contractorIds = $validated['contractor_ids'] ?? [];
        
        // Remove relationship fields from the validated data before creating the model
        unset($validated['quarry_ids'], $validated['contractor_ids']);
        
        // Create the customer account
        $customerAccount = CustomerAccount::create($validated);
        
        // Sync relationships
        if (!empty($quarryIds)) {
            $customerAccount->quarries()->sync($quarryIds);
        }
        
        if (!empty($contractorIds)) {
            $customerAccount->contractors()->sync($contractorIds);
        }
        
        return redirect()->route('customer-accounts.index')
            ->with('message', 'Customer account created successfully.');
    }public function show(CustomerAccount $customerAccount): Response
    {
        return Inertia::render('CustomerAccount/Show', [
            'customer' => $customerAccount->load(['quarries', 'contractors', 'invoices']),
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }    public function edit(CustomerAccount $customerAccount): Response
    {
        return Inertia::render('CustomerAccount/Edit', [
            'customerAccount' => $customerAccount->load(['quarries', 'contractors']),
            'quarries' => \App\Models\Quarry::select('id', 'name')->get(),
            'contractors' => \App\Models\CarContractor::select('id', 'name')->get(),
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }    public function update(UpdateCustomerAccountRequest $request, CustomerAccount $customerAccount)
    {
        $validated = $request->validated();
        
        // Extract relationship IDs
        $quarryIds = $validated['quarry_ids'] ?? [];
        $contractorIds = $validated['contractor_ids'] ?? [];
        
        // Remove relationship fields from the validated data before updating the model
        unset($validated['quarry_ids'], $validated['contractor_ids']);
        
        // Update the customer account
        $customerAccount->update($validated);
        
        // Sync relationships
        if (isset($validated['quarry_ids'])) {
            $customerAccount->quarries()->sync($quarryIds);
        }
        
        if (isset($validated['contractor_ids'])) {
            $customerAccount->contractors()->sync($contractorIds);
        }
        
        return redirect()->route('customer-accounts.index')
            ->with('message', 'Customer account updated successfully.');
    }

    public function destroy(CustomerAccount $customerAccount)
    {
        $customerAccount->delete();
        return redirect()->route('customer-accounts.index')
            ->with('message', 'Customer account deleted successfully.');
    }
}
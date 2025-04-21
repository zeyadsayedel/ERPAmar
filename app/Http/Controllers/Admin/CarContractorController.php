<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CarContractor\StoreCarContractorRequest;
use App\Http\Requests\CarContractor\UpdateCarContractorRequest;
use App\Http\Resources\CarContractorResource;
use App\Models\Car;
use App\Models\CarContractor;
use App\Models\CustomerAccount;
use App\Models\Quarry;
use App\Models\SupplyClient;
use App\Traits\AuthorizesModuleActions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class CarContractorController extends Controller
{
    use AuthorizesModuleActions;

    public function __construct()
    {
        $this->module = 'car_contractor';
        $this->customActions = ['export', 'import'];
    }

    public function index(): Response
    {
        $contractors = CarContractor::all();
        
        return Inertia::render('CarContractor/Index', [
            'contractors' => CarContractorResource::collection($contractors)->toArray(request()),
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('CarContractor/Create', [
            'cars' => Car::all(['id', 'name', 'car_load']),
            'quarries' => Quarry::all(['id', 'name']),
            'customers' => CustomerAccount::all(['id', 'name']),
            'supplyClients' => SupplyClient::all(['id', 'name']),
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    public function store(StoreCarContractorRequest $request): RedirectResponse
    {
        $contractor = CarContractor::create($request->validated());
        
        // Sync relationships
        if ($request->has('car_ids')) {
            $contractor->cars()->sync($request->car_ids);
        }
        
        if ($request->has('quarry_ids')) {
            $contractor->quarries()->sync($request->quarry_ids);
        }
        
        if ($request->has('customer_ids')) {
            $contractor->customers()->sync($request->customer_ids);
        }
        
        if ($request->has('supply_client_ids')) {
            $contractor->supplyClients()->sync($request->supply_client_ids);
        }
        
        return Redirect::route('car-contractors.index')
            ->with('message', 'Car contractor created successfully.');
    }

    public function show(CarContractor $carContractor): Response
    {
        // Load relationships
        $carContractor->load(['cars', 'quarries', 'customers', 'supplyClients', 'invoices']);
        
        return Inertia::render('CarContractor/Show', [
            'contractor' => new CarContractorResource($carContractor),
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    public function edit(CarContractor $carContractor): Response
    {
        // Load existing relationships
        $carContractor->load(['cars', 'quarries', 'customers', 'supplyClients']);
        
        return Inertia::render('CarContractor/Edit', [
            'contractor' => new CarContractorResource($carContractor),
            'cars' => Car::all(['id', 'name', 'car_load']),
            'quarries' => Quarry::all(['id', 'name']),
            'customers' => CustomerAccount::all(['id', 'name']),
            'supplyClients' => SupplyClient::all(['id', 'name']),
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    public function update(UpdateCarContractorRequest $request, CarContractor $carContractor): RedirectResponse
    {
        $carContractor->update($request->validated());
        
        // Ensure the model is saved and has an ID before syncing relationships
        $carContractor->refresh();
        
        // Sync relationships
        if ($request->has('car_ids')) {
            $carContractor->cars()->sync($request->car_ids);
        }
        
        if ($request->has('quarry_ids')) {
            $carContractor->quarries()->sync($request->quarry_ids);
        }
        
        if ($request->has('customer_ids')) {
            $carContractor->customers()->sync($request->customer_ids);
        }
        
        if ($request->has('supply_client_ids')) {
            $carContractor->supplyClients()->sync($request->supply_client_ids);
        }
        
        return Redirect::route('car-contractors.index')
            ->with('message', 'Car contractor updated successfully.');
    }

    public function destroy(CarContractor $carContractor): RedirectResponse
    {
        $carContractor->delete();
        
        return Redirect::route('car-contractors.index')
            ->with('message', 'Car contractor deleted successfully.');
    }
}
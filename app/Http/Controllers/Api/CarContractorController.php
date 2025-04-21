<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CarContractor\StoreCarContractorRequest;
use App\Http\Requests\CarContractor\UpdateCarContractorRequest;
use App\Http\Resources\CarContractorResource;
use App\Models\CarContractor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CarContractorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): ResourceCollection
    {
        $this->authorize('viewAny', CarContractor::class);
        
        $carContractors = CarContractor::all();
        return CarContractorResource::collection($carContractors);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCarContractorRequest $request): JsonResource
    {
        $this->authorize('create', CarContractor::class);
        
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
        
        return new CarContractorResource($contractor->load(['cars', 'quarries', 'customers', 'supplyClients']));
    }

    /**
     * Display the specified resource.
     */
    public function show(CarContractor $carContractor): JsonResource
    {
        $this->authorize('view', $carContractor);
        
        return new CarContractorResource(
            $carContractor->load(['cars', 'quarries', 'customers', 'supplyClients', 'invoices'])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCarContractorRequest $request, CarContractor $carContractor): JsonResource
    {
        $this->authorize('update', $carContractor);
        
        $carContractor->update($request->validated());
        
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
        
        return new CarContractorResource($carContractor->load(['cars', 'quarries', 'customers', 'supplyClients']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CarContractor $carContractor): JsonResponse
    {
        $this->authorize('delete', $carContractor);
        
        $carContractor->delete();
        
        return response()->json([
            'message' => 'Car contractor deleted successfully'
        ]);
    }
}

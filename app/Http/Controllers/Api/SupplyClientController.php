<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SupplyClient\StoreSupplyClientRequest;
use App\Http\Requests\SupplyClient\UpdateSupplyClientRequest;
use App\Http\Resources\SupplyClientResource;
use App\Models\SupplyClient;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class SupplyClientController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return SupplyClientResource::collection(SupplyClient::all());
    }

    public function store(StoreSupplyClientRequest $request): SupplyClientResource
    {
        $supplyClient = SupplyClient::create($request->validated());
        return new SupplyClientResource($supplyClient);
    }

    public function show(SupplyClient $supplyClient): SupplyClientResource
    {
        return new SupplyClientResource($supplyClient->load('contractors'));
    }

    public function update(UpdateSupplyClientRequest $request, SupplyClient $supplyClient): SupplyClientResource
    {
        $supplyClient->update($request->validated());
        return new SupplyClientResource($supplyClient);
    }

    public function destroy(SupplyClient $supplyClient): Response
    {
        $supplyClient->delete();
        return response()->noContent();
    }
}
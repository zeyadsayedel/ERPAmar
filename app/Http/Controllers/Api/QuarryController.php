<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Quarry\StoreQuarryRequest;
use App\Http\Requests\Quarry\UpdateQuarryRequest;
use App\Http\Resources\QuarryResource;
use App\Models\Quarry;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class QuarryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return QuarryResource::collection(Quarry::all());
    }

    public function store(StoreQuarryRequest $request): QuarryResource
    {
        $quarry = Quarry::create($request->validated());
        return new QuarryResource($quarry);
    }

    public function show(Quarry $quarry): QuarryResource
    {
        return new QuarryResource($quarry);
    }

    public function update(UpdateQuarryRequest $request, Quarry $quarry): QuarryResource
    {
        $quarry->update($request->validated());
        return new QuarryResource($quarry);
    }

    public function destroy(Quarry $quarry): Response
    {
        $quarry->delete();
        return response()->noContent();
    }
}

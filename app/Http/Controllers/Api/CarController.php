<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Car\StoreCarRequest;
use App\Http\Requests\Car\UpdateCarRequest;
use App\Http\Resources\CarResource;
use App\Models\Car;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class CarController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return CarResource::collection(Car::all());
    }

    public function store(StoreCarRequest $request): CarResource
    {
        $car = Car::create($request->validated());
        return new CarResource($car);
    }

    public function show(Car $car): CarResource
    {
        return new CarResource($car);
    }

    public function update(UpdateCarRequest $request, Car $car): CarResource
    {
        $car->update($request->validated());
        return new CarResource($car);
    }

    public function destroy(Car $car): Response
    {
        $car->delete();
        return response()->noContent();
    }
}

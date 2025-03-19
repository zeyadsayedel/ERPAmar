<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Car\StoreCarRequest;
use App\Http\Requests\Car\UpdateCarRequest;
use App\Http\Resources\CarResource;
use App\Models\Car;
use App\Traits\AuthorizesModuleActions;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class CarController extends Controller
{
    use AuthorizesModuleActions;
    
    protected string $module = 'car';
    
    public function __construct()
    {
        $this->setupPermissionMiddleware();
    }

    /**
     * Display a listing of cars.
     */
    public function index(): AnonymousResourceCollection
    {
        $cars = Car::all();
        
        return CarResource::collection($cars);
    }

    /**
     * Store a newly created car in storage.
     */
    public function store(StoreCarRequest $request): CarResource
    {
        $car = Car::create($request->validated());
        
        // If the authenticated user has the ability to assign cars to users
        if ($this->canPerformAction('assign')) {
            // Also assign the car to the current user if they have permissions
            if ($request->has('assign_to_me') && $request->boolean('assign_to_me')) {
                $car->users()->attach(auth()->id());
            }
            
            // Assign to specific users if provided
            if ($request->has('user_ids') && is_array($request->user_ids)) {
                $car->users()->attach($request->user_ids);
            }
        }
        
        return new CarResource($car);
    }

    /**
     * Display the specified car.
     */
    public function show(Car $car): CarResource
    {
        return new CarResource($car);
    }

    /**
     * Update the specified car in storage.
     */
    public function update(UpdateCarRequest $request, Car $car): CarResource
    {
        $car->update($request->validated());
        
        return new CarResource($car);
    }

    /**
     * Remove the specified car from storage.
     */
    public function destroy(Car $car): Response
    {
        $car->delete();
        
        return response()->noContent();
    }
    
    /**
     * Assign users to a car
     */
    public function assignUsers(Request $request, Car $car): CarResource
    {
        $this->authorizeModule('assign');
        
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);
        
        $car->users()->sync($validated['user_ids']);
        
        return new CarResource($car->load('users'));
    }
    
    /**
     * Get users assigned to a car
     */
    public function getAssignedUsers(Car $car): AnonymousResourceCollection
    {
        $this->authorizeModule('view');
        
        return \App\Http\Resources\UserResource::collection($car->users);
    }
}

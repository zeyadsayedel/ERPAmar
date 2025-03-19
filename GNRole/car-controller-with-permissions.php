<?php

namespace App\Http\Controllers;

use App\Http\Requests\Car\StoreCarRequest;
use App\Http\Requests\Car\UpdateCarRequest;
use App\Models\Car;
use App\Services\CarImportExportService;
use App\Traits\AuthorizesModuleActions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CarController extends Controller
{
    use AuthorizesModuleActions;
    
    protected string $module = 'car';
    protected CarImportExportService $importExportService;
    
    public function __construct(CarImportExportService $importExportService)
    {
        $this->importExportService = $importExportService;
        $this->setupPermissionMiddleware();
    }

    /**
     * Display a listing of cars.
     */
    public function index(): Response
    {
        $cars = Car::all();
        
        return Inertia::render('Car/Index', [
            'cars' => $cars,
            ...$this->shareModulePermissions(),
        ]);
    }

    /**
     * Show the form for creating a new car.
     */
    public function create(): Response
    {
        return Inertia::render('Car/Create', [
            ...$this->shareModulePermissions(),
        ]);
    }

    /**
     * Store a newly created car in storage.
     */
    public function store(StoreCarRequest $request): RedirectResponse
    {
        $car = Car::create($request->validated());
        
        return redirect()->route('cars.show', $car)->with('success', 'Car created successfully');
    }

    /**
     * Display the specified car.
     */
    public function show(Car $car): Response
    {
        return Inertia::render('Car/Show', [
            'car' => $car,
            ...$this->shareModulePermissions(),
        ]);
    }

    /**
     * Show the form for editing the specified car.
     */
    public function edit(Car $car): Response
    {
        return Inertia::render('Car/Edit', [
            'car' => $car,
            ...$this->shareModulePermissions(),
        ]);
    }

    /**
     * Update the specified car in storage.
     */
    public function update(UpdateCarRequest $request, Car $car): RedirectResponse
    {
        $car->update($request->validated());
        
        return redirect()->route('cars.show', $car)->with('success', 'Car updated successfully');
    }

    /**
     * Remove the specified car from storage.
     */
    public function destroy(Car $car): RedirectResponse
    {
        $car->delete();
        
        return redirect()->route('cars.index')->with('success', 'Car deleted successfully');
    }
    
    /**
     * Import cars from CSV file.
     */
    public function import(Request $request): RedirectResponse
    {
        $this->authorizeModule('create');
        
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240',
        ]);
        
        try {
            $this->importExportService->import($request->file('file'));
            return redirect()->route('cars.index')->with('success', 'Cars imported successfully');
        } catch (\Exception $e) {
            return redirect()->route('cars.index')->with('error', 'Error importing cars: ' . $e->getMessage());
        }
    }
    
    /**
     * Export cars to CSV file.
     */
    public function export(): \Symfony\Component\HttpFoundation\Response
    {
        $this->authorizeModule('list');
        
        $csv = $this->importExportService->export();
        
        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="cars.csv"');
    }
}

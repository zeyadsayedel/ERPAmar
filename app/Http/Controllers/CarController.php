<?php

namespace App\Http\Controllers;

use App\Http\Requests\Car\StoreCarRequest;
use App\Http\Requests\Car\UpdateCarRequest;
use App\Models\Car;
use App\Services\CarImportExportService;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CarController extends Controller
{
    private CarImportExportService $importExportService;

    public function __construct(CarImportExportService $importExportService) 
    {
        $this->importExportService = $importExportService;
    }

    public function index(): Response
    {
        return Inertia::render('Car/Index', [
            'cars' => Car::all()
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Car/Create');
    }

    public function store(StoreCarRequest $request)
    {
        Car::create($request->validated());
        return redirect()->route('cars.index')
            ->with('message', 'Car created successfully.');
    }

    public function edit(Car $car): Response
    {
        return Inertia::render('Car/Edit', [
            'car' => $car
        ]);
    }

    public function update(UpdateCarRequest $request, Car $car)
    {
        $car->update($request->validated());
        return redirect()->route('cars.index')
            ->with('message', 'Car updated successfully.');
    }

    public function destroy(Car $car)
    {
        $car->delete();
        return redirect()->route('cars.index')
            ->with('message', 'Car deleted successfully.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,xlsx']
        ]);

        try {
            $this->importExportService->import($request->file('file'));
            return redirect()->route('cars.index')
                ->with('message', 'Cars imported successfully.');
        } catch (Exception $e) {
            return redirect()->route('cars.index')
                ->with('error', 'Import failed: ' . $e->getMessage());
        }
    }

    public function export()
    {
        $content = $this->importExportService->export();
        
        return response()->streamDownload(function () use ($content) {
            echo $content;
        }, 'cars.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
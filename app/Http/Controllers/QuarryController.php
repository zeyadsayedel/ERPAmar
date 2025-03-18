<?php

namespace App\Http\Controllers;

use App\Http\Requests\Quarry\StoreQuarryRequest;
use App\Http\Requests\Quarry\UpdateQuarryRequest;
use App\Models\Quarry;
use App\Services\QuarryImportExportService;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuarryController extends Controller
{
    private QuarryImportExportService $importExportService;

    public function __construct(QuarryImportExportService $importExportService) 
    {
        $this->importExportService = $importExportService;
    }

    public function index(): Response
    {
        return Inertia::render('Quarry/Index', [
            'quarries' => Quarry::all()
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Quarry/Create');
    }

    public function store(StoreQuarryRequest $request)
    {
        Quarry::create($request->validated());
        return redirect()->route('quarries.index')
            ->with('message', 'Quarry created successfully.');
    }


    // show method is missing
    public function show(Quarry $quarry): Response
    {
        return Inertia::render('Quarry/Show', [
            'quarry' => $quarry
        ]);
    }

    public function edit(Quarry $quarry): Response
    {
        return Inertia::render('Quarry/Edit', [
            'quarry' => $quarry
        ]);
    }

    public function update(UpdateQuarryRequest $request, Quarry $quarry)
    {
        $quarry->update($request->validated());
        return redirect()->route('quarries.index')
            ->with('message', 'Quarry updated successfully.');
    }

    public function destroy(Quarry $quarry)
    {
        $quarry->delete();
        return redirect()->route('quarries.index')
            ->with('message', 'Quarry deleted successfully.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,xlsx']
        ]);

        try {
            $this->importExportService->import($request->file('file'));
            return redirect()->route('quarries.index')
                ->with('message', 'Quarries imported successfully.');
        } catch (Exception $e) {
            return redirect()->route('quarries.index')
                ->with('error', 'Import failed: ' . $e->getMessage());
        }
    }

    public function export()
    {
        $content = $this->importExportService->export();
        
        return response()->streamDownload(function () use ($content) {
            echo $content;
        }, 'quarries.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
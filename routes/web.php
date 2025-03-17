<?php

use App\Http\Controllers\CarController;
use App\Http\Controllers\QuarryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Cars
    Route::resource('cars', CarController::class);
    Route::post('cars/import', [CarController::class, 'import'])->name('cars.import');
    Route::get('cars/export', [CarController::class, 'export'])->name('cars.export');

    // Quarries
    Route::resource('quarries', QuarryController::class);
    Route::post('quarries/import', [QuarryController::class, 'import'])->name('quarries.import');
    Route::get('quarries/export', [QuarryController::class, 'export'])->name('quarries.export');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

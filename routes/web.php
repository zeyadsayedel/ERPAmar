<?php

use App\Http\Controllers\Admin\CarContractorController;
use App\Http\Controllers\Admin\CustomerAccountController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\SupplyClientController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\QuarryController;
use App\Http\Controllers\Admin\UserController;
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
    Route::resource('cars', CarController::class)->names('cars');
    Route::post('cars/import', [CarController::class, 'import'])->name('cars.import');
    Route::get('cars/export', [CarController::class, 'export'])->name('cars.export');

    // Quarries
    Route::resource('quarries', QuarryController::class)->names('quarries');
    Route::post('quarries/import', [QuarryController::class, 'import'])->name('quarries.import');
    Route::get('quarries/export', [QuarryController::class, 'export'])->name('quarries.export');

    // Car Contractors
    Route::resource('car-contractors', CarContractorController::class)->names('car-contractors');
    Route::post('car-contractors/import', [CarContractorController::class, 'import'])->name('car-contractors.import');
    Route::get('car-contractors/export', [CarContractorController::class, 'export'])->name('car-contractors.export');

    // Customer Accounts
    Route::resource('customer-accounts', CustomerAccountController::class)->names('customer-accounts');
    Route::post('customer-accounts/import', [CustomerAccountController::class, 'import'])->name('customer-accounts.import');
    Route::get('customer-accounts/export', [CustomerAccountController::class, 'export'])->name('customer-accounts.export');

    // Invoices
    Route::resource('invoices', InvoiceController::class)->names('invoices');
    Route::post('invoices/import', [InvoiceController::class, 'import'])->name('invoices.import');
    Route::get('invoices/export', [InvoiceController::class, 'export'])->name('invoices.export');

    // Supply Clients
    Route::resource('supply-clients', SupplyClientController::class)->names('supply-clients');
    Route::post('supply-clients/import', [SupplyClientController::class, 'import'])->name('supply-clients.import');
    Route::get('supply-clients/export', [SupplyClientController::class, 'export'])->name('supply-clients.export');
});

// In a routes file
Route::get('/debug/permissions', function () {
    $permissionService = app(App\Services\RolePermissionService::class);
    return response()->json([
        'permissions' => $permissionService->getStandardizedPermissionList(),
        'type' => gettype($permissionService->getStandardizedPermissionList()),
    ]);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';

<?php

use App\Http\Controllers\CarController;
use App\Http\Controllers\QuarryController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;
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
    Route::prefix('cars')->group(function () {
        Route::post('/import', [CarController::class, 'import'])->name('cars.import');
        Route::get('/export', [CarController::class, 'export'])->name('cars.export');
        Route::resource('/', CarController::class);
    });

    // Quarries
    Route::prefix('quarries')->group(function () {
        Route::post('/import', [QuarryController::class, 'import'])->name('quarries.import');
        Route::get('/export', [QuarryController::class, 'export'])->name('quarries.export');
        Route::resource('/', QuarryController::class);
    });

    // Admin
   /*  Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);
        Route::get('permissions/module/{module}', [PermissionController::class, 'modulePermissions'])
            ->name('permissions.module');
        Route::post('permissions/register-module', [PermissionController::class, 'registerModule'])
            ->name('permissions.register-module');
    }); */
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

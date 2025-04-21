<?php

use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\QuarryController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\CarContractorController;
use App\Http\Controllers\Api\CustomerAccountController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\SupplyClientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Auth routes - no permission middleware needed
Route::prefix('auth')->group(function () {
    Route::post('/register', RegisterController::class);
    Route::post('/login', LoginController::class);
    Route::post('/forgot-password', ForgotPasswordController::class);
    Route::post('/reset-password', ResetPasswordController::class);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', LogoutController::class);
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
    });
});

// Protected API routes with granular permissions
Route::middleware('auth:sanctum')->group(function () {
    // Car routes
    Route::apiResource('cars', CarController::class);
    
    // Quarry routes
    Route::apiResource('quarries', QuarryController::class);
    
    // Car Contractor routes
    Route::apiResource('car-contractors', CarContractorController::class);

    // Customer Account routes
    Route::apiResource('customer-accounts', CustomerAccountController::class);

    // Invoice routes
    Route::apiResource('invoices', InvoiceController::class);

    // Supply Client routes
    Route::apiResource('supply-clients', SupplyClientController::class);
    
    // Role routes with granular permissions
    Route::prefix('roles')->name('roles.')->group(function () {
        // List and view operations
        Route::middleware(['permission:role:list'])->group(function () {
            Route::get('/', [RoleController::class, 'index'])->name('index');
            Route::get('/{role}', [RoleController::class, 'show'])->name('show');
        });
        
        // Create operations
        Route::middleware(['permission:role:create'])->post('/', [RoleController::class, 'store'])->name('store');
        
        // Update operations
        Route::middleware(['permission:role:update'])->put('/{role}', [RoleController::class, 'update'])->name('update');
        
        // Delete operations
        Route::middleware(['permission:role:delete'])->delete('/{role}', [RoleController::class, 'destroy'])->name('destroy');
    });
    
    // Permission routes with granular permissions
    Route::prefix('permissions')->name('permissions.')->group(function () {
        // List and view operations
        Route::middleware(['permission:permission:list'])->group(function () {
            Route::get('/', [PermissionController::class, 'index'])->name('index');
            Route::get('/{permission}', [PermissionController::class, 'show'])->name('show');
        });
        
        // Create operations
        Route::middleware(['permission:permission:create'])->post('/', [PermissionController::class, 'store'])->name('store');
        
        // Register module permissions
        Route::middleware(['permission:permission:create'])->post('/register-module', [PermissionController::class, 'registerModulePermissions'])->name('register-module');
        
        // Update operations
        Route::middleware(['permission:permission:update'])->put('/{permission}', [PermissionController::class, 'update'])->name('update');
        
        // Delete operations
        Route::middleware(['permission:permission:delete'])->delete('/{permission}', [PermissionController::class, 'destroy'])->name('destroy');
    });
});

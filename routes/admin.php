<?php

use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    // Roles Resource with granular permissions
    Route::prefix('roles')->name('roles.')->group(function () {
        // List and view (read operations)
        Route::middleware(['permission:role:list'])->group(function () {
            Route::get('/', [RoleController::class, 'index'])->name('index');
        });

        // Create operations - MUST come before the show route to avoid conflicts
        Route::middleware(['permission:role:create'])->group(function () {
            Route::get('/create', [RoleController::class, 'create'])->name('create');
            Route::post('/', [RoleController::class, 'store'])->name('store');
        });

        Route::middleware(['permission:role:view'])->group(function () {
            Route::get('/{role}', [RoleController::class, 'show'])->name('show')
                ->where('role', '[0-9]+'); // Add constraint to only match numeric IDs
        });

        // Update operations
        Route::middleware(['permission:role:update'])->group(function () {
            Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('edit')
                ->where('role', '[0-9]+');
            Route::put('/{role}', [RoleController::class, 'update'])->name('update')
                ->where('role', '[0-9]+');
            Route::patch('/{role}', [RoleController::class, 'update'])
                ->where('role', '[0-9]+');
        });

        // Delete operations
        Route::middleware(['permission:role:delete'])->delete('/{role}', [RoleController::class, 'destroy'])
            ->name('destroy')
            ->where('role', '[0-9]+');
    });

    // Permissions Resource with similar granular permissions
    Route::prefix('permissions')->name('permissions.')->group(function () {
        // List and view (read operations)
        Route::middleware(['permission:permission:list'])->group(function () {
            Route::get('/', [PermissionController::class, 'index'])->name('index');

            // Module-specific permissions listing
            Route::get('/module/{module}', [PermissionController::class, 'modulePermissions'])
                ->name('module')
                ->where('module', '[a-zA-Z0-9_-]+');
        });

        // Create operations - MUST come before the show route with wildcard
        Route::middleware(['permission:permission:create'])->group(function () {
            Route::get('/create', [PermissionController::class, 'create'])->name('create');
            Route::post('/', [PermissionController::class, 'store'])->name('store');

            // Register a module
            Route::post('/register-module', [PermissionController::class, 'registerModule'])
                ->name('register-module');

            // Add permission to module
            Route::post('/module/{module}/add', [PermissionController::class, 'addPermission'])
                ->name('module.add')
                ->where('module', '[a-zA-Z0-9_-]+');
        });

        Route::middleware(['permission:permission:view'])->group(function () {
            Route::get('/{permission}', [PermissionController::class, 'show'])
                ->name('show')
                ->where('permission', '[0-9]+'); // Add constraint to only match numeric IDs
        });

        // Update operations
        Route::middleware(['permission:permission:update'])->group(function () {
            Route::get('/{permission}/edit', [PermissionController::class, 'edit'])
                ->name('edit')
                ->where('permission', '[0-9]+');
            Route::put('/{permission}', [PermissionController::class, 'update'])
                ->name('update')
                ->where('permission', '[0-9]+');
            Route::patch('/{permission}', [PermissionController::class, 'update'])
                ->where('permission', '[0-9]+');
        });

        // Delete operations
        Route::middleware(['permission:permission:delete'])->delete('/{permission}', [PermissionController::class, 'destroy'])
            ->name('destroy')
            ->where('permission', '[0-9]+');
    });

    // User management routes
    Route::prefix('users')->name('users.')->group(function () {
        // List and view (read operations)
        Route::middleware(['permission:user:list'])->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');
        });

        // Create operations
        Route::middleware(['permission:user:create'])->group(function () {
            Route::get('/create', [UserController::class, 'create'])->name('create');
            Route::post('/', [UserController::class, 'store'])->name('store');
        });

        // View operations
        Route::middleware(['permission:user:view'])->group(function () {
            Route::get('/{user}', [UserController::class, 'show'])->name('show')
                ->where('user', '[0-9]+');
        });

        // Update operations
        Route::middleware(['permission:user:update'])->group(function () {
            Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit')
                ->where('user', '[0-9]+');
            Route::put('/{user}', [UserController::class, 'update'])->name('update')
                ->where('user', '[0-9]+');
            Route::patch('/{user}', [UserController::class, 'update'])
                ->where('user', '[0-9]+');
        });

        // Delete operations
        Route::middleware(['permission:user:delete'])->delete('/{user}', [UserController::class, 'destroy'])
            ->name('destroy')
            ->where('user', '[0-9]+');

        // Import/Export operations
        Route::middleware(['permission:user:export'])->get('/export', [UserController::class, 'export'])->name('export');
        Route::middleware(['permission:user:import'])->post('/import', [UserController::class, 'import'])->name('import');
    });
});

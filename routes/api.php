<?php

use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\QuarryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('cars', CarController::class);
    Route::apiResource('quarries', QuarryController::class);
});

<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\Access\AuthorizationException;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Throwable;
use Inertia\Inertia;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->renderable(function (AuthorizationException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'error' => 'permission_denied'
                ], 403);
            }

            return Inertia::render('Error/Forbidden', [
                'status' => 403,
                'message' => $e->getMessage()
            ])->toResponse($request);
        });

        $this->renderable(function (UnauthorizedException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'error' => 'permission_denied'
                ], 403);
            }

            return Inertia::render('Error/Forbidden', [
                'status' => 403,
                'message' => $e->getMessage()
            ])->toResponse($request);
        });
    }
}
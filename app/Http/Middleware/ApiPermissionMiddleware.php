<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\AuthorizationException;

class ApiPermissionMiddleware
{
    public function handle(Request $request, Closure $next, string $permission)
    {
        if (!$request->user() || !$request->user()->can($permission)) {
            return response()->json([
                'message' => 'You do not have the required permission: ' . $permission,
                'error' => 'permission_denied',
            ], 403);
        }

        return $next($request);
    }
}
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (Auth::guest()) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $user = Auth::user();

        // Check if user has the permission
        if (!$user->hasPermissionTo($permission)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'You do not have the required permissions.',
                ], 403);
            }
            
            return redirect()->route('dashboard')
                ->with('error', 'You do not have the required permissions.');
        }

        return $next($request);
    }
}

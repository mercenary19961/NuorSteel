<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * If the authenticated user has must_change_password=true, redirect every
 * admin request to the change-password screen until they pick a new one.
 *
 * The change-password routes themselves are registered OUTSIDE this middleware
 * (just under 'auth') so they remain reachable; logout is similarly excepted.
 */
class ForcePasswordChange
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && $user->must_change_password) {
            return redirect()->route('admin.change-password.show')->with(
                'error',
                'You must change your password before continuing.'
            );
        }

        return $next($request);
    }
}

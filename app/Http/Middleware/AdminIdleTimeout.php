<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Idle timeout for the admin route group: if the authenticated user has been
 * inactive for more than IDLE_MINUTES, log them out + redirect to login with
 * a "Your session expired" notice.
 *
 * Distinct from Laravel's session.lifetime (cookie expiry, global). This
 * tracks last-activity per-request and is scoped to admin routes only.
 */
class AdminIdleTimeout
{
    private const IDLE_MINUTES = 30;
    private const SESSION_KEY = 'admin_last_activity_at';

    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return $next($request);
        }

        $now = now()->timestamp;
        $last = $request->session()->get(self::SESSION_KEY);

        if ($last !== null && ($now - $last) > self::IDLE_MINUTES * 60) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()
                ->route('login')
                ->with('status', 'Your session expired after ' . self::IDLE_MINUTES . ' minutes of inactivity. Please sign in again.');
        }

        $request->session()->put(self::SESSION_KEY, $now);

        return $next($request);
    }
}

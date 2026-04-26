<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\TurnstileVerifier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    private const MAX_ATTEMPTS = 5;
    private const DECAY_SECONDS = 900; // 15 minutes

    public function __construct(private TurnstileVerifier $turnstile)
    {
    }

    public function showLoginForm(): Response
    {
        return Inertia::render('Admin/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'cf-turnstile-response' => 'nullable|string',
        ]);

        $key = $this->throttleKey($request);

        if (RateLimiter::tooManyAttempts($key, self::MAX_ATTEMPTS)) {
            $seconds = RateLimiter::availableIn($key);
            $minutes = max(1, (int) ceil($seconds / 60));
            throw ValidationException::withMessages([
                'email' => ["Too many login attempts for this email. Please try again in {$minutes} minute(s)."],
            ])->status(429);
        }

        // Verify Turnstile BEFORE Auth::attempt so bots can't burn the per-email
        // throttle budget (5 attempts / 15 min) with random passwords.
        if (!$this->turnstile->verify($request->input('cf-turnstile-response'), $request->ip())) {
            throw ValidationException::withMessages([
                'cf-turnstile-response' => ['Bot check failed. Please reload the page and try again.'],
            ]);
        }

        // Per client request: distinguish wrong-email vs wrong-password in the
        // error message. This is a deliberate trade-off — it enables user
        // enumeration (an attacker can confirm whether a given email is a
        // registered admin). Mitigated by: invite-only admin accounts (no public
        // signup), per-email + per-IP throttles, Turnstile, and 750ms delay on
        // every failed attempt.
        $existingUser = User::where('email', $request->input('email'))->first();

        if (!$existingUser) {
            RateLimiter::hit($key, self::DECAY_SECONDS);
            usleep(750_000);

            throw ValidationException::withMessages([
                'email' => ['No account found with this email address.'],
            ]);
        }

        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            RateLimiter::hit($key, self::DECAY_SECONDS);
            // 750ms delay on failed login — slows down brute force without being
            // annoyingly slow for a real user who mistyped their password once.
            usleep(750_000);

            throw ValidationException::withMessages([
                'password' => ['Incorrect password. Please try again.'],
            ]);
        }

        $user = Auth::user();

        if (!$user->is_active) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            RateLimiter::hit($key, self::DECAY_SECONDS);
            usleep(750_000);

            throw ValidationException::withMessages([
                'email' => ['This account has been deactivated. Please contact your administrator.'],
            ]);
        }

        RateLimiter::clear($key);
        $request->session()->regenerate();

        // Stamp last-login audit fields (slice 8 surface in admin users list).
        $user->forceFill([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ])->save();

        return redirect()->intended('/admin');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/admin/login');
    }

    /**
     * Per-email throttle key. Stops an attacker rotating IPs against a single
     * known admin email — IP-keyed throttling (route middleware throttle:5,1)
     * alone can be bypassed with a residential proxy pool.
     */
    private function throttleKey(Request $request): string
    {
        return 'login:'.sha1(Str::lower((string) $request->input('email')));
    }
}

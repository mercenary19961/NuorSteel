<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetController extends Controller
{
    /**
     * GET /forgot-password — show the email-entry form.
     */
    public function showLinkRequestForm(): Response
    {
        return Inertia::render('Admin/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * POST /forgot-password — send the reset link.
     *
     * Throttled to 3 per email per hour to prevent inbox spam (in addition to
     * the route-level per-IP throttle). Always responds with the same generic
     * status so we don't leak which emails are registered.
     */
    public function sendResetLink(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $key = 'password-reset:' . Str::lower($request->input('email'));
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'email' => "Too many reset requests for this address. Try again in " . ceil($seconds / 60) . " minutes.",
            ]);
        }
        RateLimiter::hit($key, 3600);

        // Password::sendResetLink returns a status code; we ignore the specific
        // result and always show the same neutral message to the user.
        Password::sendResetLink($request->only('email'));

        return back()->with('status', 'If an account exists for that email, a reset link has been sent.');
    }

    /**
     * GET /reset-password/{token} — show the new-password form.
     */
    public function showResetForm(Request $request, string $token): Response
    {
        return Inertia::render('Admin/ResetPassword', [
            'token' => $token,
            'email' => $request->query('email', ''),
        ]);
    }

    /**
     * POST /reset-password — validate the token and persist the new password.
     */
    public function reset(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'password_changed_at' => now(),
                    'must_change_password' => false,
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return redirect()->route('login')->with('status', 'Your password has been reset. You can now log in.');
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}

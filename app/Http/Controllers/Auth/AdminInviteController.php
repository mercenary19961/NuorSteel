<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\AdminInviteEmail;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Inertia\Inertia;
use Inertia\Response;

class AdminInviteController extends Controller
{
    public const EXPIRY_HOURS = 48;

    /**
     * Build a signed URL valid for EXPIRY_HOURS hours that the invitee follows
     * to set their initial password. The URL carries the user_id; signature
     * binds it to the expiry timestamp so the link can't be tampered with.
     */
    public static function buildAcceptUrl(User $user): string
    {
        return URL::temporarySignedRoute(
            'admin.invite.accept',
            now()->addHours(self::EXPIRY_HOURS),
            ['user' => $user->id],
        );
    }

    /**
     * Send (or resend) an invite email for a user. Stamps invited_at so the
     * UI can show a "Pending invite" pill until the user accepts.
     */
    public static function sendInvite(User $user, User $invitedBy): void
    {
        $user->forceFill(['invited_at' => now()])->save();

        $acceptUrl = self::buildAcceptUrl($user);

        Mail::to($user->email)->send(new AdminInviteEmail(
            userName: $user->name,
            invitedBy: $invitedBy->name,
            role: $user->role,
            acceptUrl: $acceptUrl,
            expiryHours: self::EXPIRY_HOURS,
        ));
    }

    /**
     * GET /admin/invite/{user}/accept — show the "set your password" form.
     * Protected by the 'signed' middleware so only the link in the email works.
     */
    public function showAcceptForm(Request $request, User $user): Response
    {
        return Inertia::render('Admin/AcceptInvite', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            // Re-pass the signed query params so the POST can carry them.
            'signedQuery' => $request->getQueryString() ?? '',
        ]);
    }

    /**
     * POST /admin/invite/{user}/accept — set the password, activate the account,
     * log the user in, redirect to admin dashboard.
     */
    public function accept(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
        ]);

        $user->forceFill([
            'password' => Hash::make($request->input('password')),
            'password_changed_at' => now(),
            'must_change_password' => false,
            'is_active' => true,
        ])->save();

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('admin.dashboard')->with('success', 'Welcome to Nuor Steel. Your account is set up.');
    }
}

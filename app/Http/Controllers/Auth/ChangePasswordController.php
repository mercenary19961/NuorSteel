<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ChangePasswordController extends Controller
{
    public function show(Request $request): Response
    {
        return Inertia::render('Admin/ChangePassword', [
            // When true, the page renders the "you must change your password" notice
            // and hides the back link — slice 5's force-change gate landed the user here.
            'forced' => (bool) $request->user()?->must_change_password,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            // 'different' prevents picking the same password — meaningless for a forced change.
            'password' => ['required', 'confirmed', 'different:current_password', Password::defaults()],
        ]);

        $user = $request->user();
        $user->forceFill([
            'password' => Hash::make($request->input('password')),
            'password_changed_at' => now(),
            'must_change_password' => false,
        ])->save();

        return redirect()->route('admin.dashboard')->with('success', 'Password updated successfully.');
    }
}

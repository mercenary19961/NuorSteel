<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Auth\AdminInviteController;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::orderBy('name')->get()->map(fn($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_active' => $user->is_active,
            'must_change_password' => $user->must_change_password,
            'last_login_at' => $user->last_login_at?->toIso8601String(),
            'last_login_ip' => $user->last_login_ip,
            'invited_at' => $user->invited_at?->toIso8601String(),
            // "Pending invite" = was invited and has never logged in.
            'is_pending_invite' => $user->invited_at !== null && $user->last_login_at === null,
            'created_at' => $user->created_at->format('Y-m-d'),
        ]);

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'currentUserId' => $request->user()->id,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // password_method drives the branching: 'invite' = email a signed accept URL,
        // 'manual' = admin types a password now. Default is 'invite' (the safer path).
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:admin,editor',
            'is_active' => 'boolean',
            'password_method' => 'required|in:invite,manual',
            'password' => ['required_if:password_method,manual', 'confirmed', Password::defaults()],
        ]);

        if ($request->input('password_method') === 'invite') {
            // Random unguessable password placeholder — invitee replaces it via
            // /admin/invite/{user}/accept. must_change_password=true is defensive
            // (cleared by the accept flow); is_active stays true so the moment they
            // accept they can use the account.
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make(Str::random(64)),
                'role' => $request->role,
                'is_active' => $request->boolean('is_active', true),
                'must_change_password' => true,
            ]);

            AdminInviteController::sendInvite($user, $request->user());

            return redirect()->back()->with('success', "Invite sent to {$user->email}. The link expires in " . AdminInviteController::EXPIRY_HOURS . " hours.");
        }

        // Manual path — admin types a password. Force first-login change so the
        // admin's chosen password isn't permanent.
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_active' => $request->boolean('is_active', true),
            'must_change_password' => true,
            'password_changed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'User created successfully. They will be asked to change their password on first login.');
    }

    /**
     * POST /admin/users/{id}/resend-invite — regenerate the signed invite URL
     * and re-email it. Useful when the original 48h window expires.
     */
    public function resendInvite(Request $request, int $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        // Only "pending invite" users qualify — must be invited and never logged in.
        if ($user->invited_at === null || $user->last_login_at !== null) {
            return redirect()->back()->with('error', 'This user is not pending an invite.');
        }

        AdminInviteController::sendInvite($user, $request->user());

        return redirect()->back()->with('success', "Invite re-sent to {$user->email}.");
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'role' => 'required|in:admin,editor',
            'is_active' => 'boolean',
        ]);

        $user = User::findOrFail($id);

        // Admins are self-managed: only the admin themselves can edit their own row.
        // Another admin cannot touch this account — they must demote to editor first.
        if ($user->role === 'admin' && $user->id !== $request->user()->id) {
            return redirect()->back()->with('error', 'Admin accounts are self-managed. You cannot edit another admin.');
        }

        // Prevent deactivating yourself
        if ($user->id === $request->user()->id && !$request->boolean('is_active', true)) {
            return redirect()->back()->with('error', 'You cannot deactivate your own account.');
        }

        // Prevent demoting yourself from admin
        if ($user->id === $request->user()->id && $user->role === 'admin' && $request->role !== 'admin') {
            return redirect()->back()->with('error', 'You cannot change your own role from admin.');
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->is_active = $request->boolean('is_active', true);

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
            $user->password_changed_at = now();
            // If admin set the password for someone else, force them to change it on first login.
            if ($user->id !== $request->user()->id) {
                $user->must_change_password = true;
            }
        }

        $user->save();

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        if ($user->role === 'admin') {
            return redirect()->back()->with('error', 'Admin accounts are self-managed and cannot be deleted by another admin.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully.');
    }

    public function toggleStatus(Request $request, int $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return redirect()->back()->with('error', 'You cannot change your own status.');
        }

        if ($user->role === 'admin') {
            return redirect()->back()->with('error', 'Admin accounts are self-managed. You cannot change another admin\'s status.');
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return redirect()->back()->with('success', $user->is_active ? 'User activated.' : 'User deactivated.');
    }
}

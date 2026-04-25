<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
            'created_at' => $user->created_at->format('Y-m-d'),
        ]);

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'currentUserId' => $request->user()->id,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|in:admin,editor',
            'is_active' => 'boolean',
        ]);

        // When admin sets the password manually, force the new user to change it
        // on their first login (slice 5 enforces the gate). Cleared if/when slice 4's
        // invite flow lands and the admin instead sends an invite email.
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_active' => $request->boolean('is_active', true),
            'must_change_password' => true,
            'password_changed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'User created successfully.');
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

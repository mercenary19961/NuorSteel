<?php

namespace App\Models;

use App\Mail\PasswordResetEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'avatar_path',
        'must_change_password',
        'password_changed_at',
        'last_login_at',
        'last_login_ip',
        'invited_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'must_change_password' => 'boolean',
            'password_changed_at' => 'datetime',
            'last_login_at' => 'datetime',
            'invited_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isEditor(): bool
    {
        return $this->role === 'editor';
    }

    public function createdProducts(): HasMany
    {
        return $this->hasMany(Product::class, 'created_by');
    }

    public function createdCertificates(): HasMany
    {
        return $this->hasMany(Certificate::class, 'created_by');
    }

    public function createdCareerListings(): HasMany
    {
        return $this->hasMany(CareerListing::class, 'created_by');
    }

    /**
     * Override Laravel's default password-reset notification to send our themed Mailable
     * instead of the generic Notifiable email. Called by Password::sendResetLink().
     */
    public function sendPasswordResetNotification($token): void
    {
        $expiryMinutes = (int) config('auth.passwords.users.expire', 60);
        $resetUrl = url(route('password.reset', [
            'token' => $token,
            'email' => $this->email,
        ], false));

        Mail::to($this->email)->send(new PasswordResetEmail(
            userName: $this->name,
            resetUrl: $resetUrl,
            expiryMinutes: $expiryMinutes,
        ));
    }
}

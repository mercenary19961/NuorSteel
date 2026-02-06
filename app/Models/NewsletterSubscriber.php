<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class NewsletterSubscriber extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'email',
        'is_active',
        'source',
        'subscribed_at',
        'unsubscribed_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'subscribed_at' => 'datetime',
            'unsubscribed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (NewsletterSubscriber $subscriber) {
            $subscriber->subscribed_at = now();
        });
    }

    public function unsubscribe(): void
    {
        $this->update([
            'is_active' => false,
            'unsubscribed_at' => now(),
        ]);
    }

    public function resubscribe(): void
    {
        $this->update([
            'is_active' => true,
            'subscribed_at' => now(),
            'unsubscribed_at' => null,
        ]);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('is_active', false);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('subscribed_at');
    }

    public static function subscribe(string $email, string $source = 'website'): static
    {
        $subscriber = static::where('email', $email)->first();

        if ($subscriber) {
            if (!$subscriber->is_active) {
                $subscriber->resubscribe();
            }
            return $subscriber;
        }

        return static::create([
            'email' => $email,
            'source' => $source,
            'is_active' => true,
        ]);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Setting extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'updated_by',
    ];

    protected static function booted(): void
    {
        static::saving(function (Setting $setting) {
            $setting->updated_at = now();
        });
    }

    public function updatedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public static function set(string $key, mixed $value, ?int $userId = null): static
    {
        return static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'updated_by' => $userId]
        );
    }

    public static function getGroup(string $group): array
    {
        return static::where('group', $group)
            ->pluck('value', 'key')
            ->toArray();
    }
}

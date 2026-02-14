<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;

class CareerListing extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title_en',
        'title_ar',
        'slug',
        'description_en',
        'description_ar',
        'requirements_en',
        'requirements_ar',
        'location',
        'employment_type',
        'status',
        'expires_at',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
        ];
    }

    public function applications(): HasMany
    {
        return $this->hasMany(CareerApplication::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function getTitleAttribute(): string
    {
        $locale = app()->getLocale();
        return $locale === 'ar' ? ($this->title_ar ?: $this->title_en) : $this->title_en;
    }

    public function getDescriptionAttribute(): string
    {
        $locale = app()->getLocale();
        return $locale === 'ar'
            ? ($this->description_ar ?: $this->description_en)
            : $this->description_en;
    }

    public function getRequirementsAttribute(): ?string
    {
        $locale = app()->getLocale();
        return $locale === 'ar'
            ? ($this->requirements_ar ?: $this->requirements_en)
            : $this->requirements_en;
    }

    public function isOpen(): bool
    {
        return $this->status === 'open' && !$this->isExpired();
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function scopeOpen(Builder $query): Builder
    {
        return $query->where('status', 'open')
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('created_at');
    }

    public function getApplicationsCount(): int
    {
        return $this->applications()->count();
    }

    public function getNewApplicationsCount(): int
    {
        return $this->applications()->where('status', 'new')->count();
    }
}

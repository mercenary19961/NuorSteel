<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Certificate extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title_en',
        'title_ar',
        'category',
        'description_en',
        'description_ar',
        'file_path',
        'thumbnail_id',
        'issue_date',
        'expiry_date',
        'is_active',
        'sort_order',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'issue_date' => 'date',
            'expiry_date' => 'date',
        ];
    }

    public function thumbnail(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'thumbnail_id');
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
            ? ($this->description_ar ?: $this->description_en ?: '')
            : ($this->description_en ?: '');
    }

    public function getFileUrlAttribute(): string
    {
        return Storage::url($this->file_path);
    }

    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    public function isExpiringSoon(int $days = 30): bool
    {
        return $this->expiry_date && $this->expiry_date->isBetween(now(), now()->addDays($days));
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('title_en');
    }

    public function scopeEsg(Builder $query): Builder
    {
        return $query->where('category', 'esg');
    }

    public function scopeQuality(Builder $query): Builder
    {
        return $query->where('category', 'quality');
    }

    public function scopeGovernance(Builder $query): Builder
    {
        return $query->where('category', 'governance');
    }
}

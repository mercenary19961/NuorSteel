<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Product extends Model
{
    protected $fillable = [
        'name_en',
        'name_ar',
        'slug',
        'short_description_en',
        'short_description_ar',
        'description_en',
        'description_ar',
        'category',
        'featured_image_id',
        'is_active',
        'is_featured',
        'sort_order',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    public function featuredImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'featured_image_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function specifications(): HasMany
    {
        return $this->hasMany(ProductSpecification::class)->orderBy('sort_order');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function getNameAttribute(): string
    {
        $locale = app()->getLocale();
        return $locale === 'ar' ? ($this->name_ar ?: $this->name_en) : $this->name_en;
    }

    public function getShortDescriptionAttribute(): string
    {
        $locale = app()->getLocale();
        return $locale === 'ar'
            ? ($this->short_description_ar ?: $this->short_description_en ?: '')
            : ($this->short_description_en ?: '');
    }

    public function getDescriptionAttribute(): string
    {
        $locale = app()->getLocale();
        return $locale === 'ar'
            ? ($this->description_ar ?: $this->description_en ?: '')
            : ($this->description_en ?: '');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name_en');
    }

    public function getChemicalSpecifications()
    {
        return $this->specifications()->where('spec_type', 'chemical')->get();
    }

    public function getMechanicalSpecifications()
    {
        return $this->specifications()->where('spec_type', 'mechanical')->get();
    }

    public function getDimensionalSpecifications()
    {
        return $this->specifications()->where('spec_type', 'dimensional')->get();
    }
}

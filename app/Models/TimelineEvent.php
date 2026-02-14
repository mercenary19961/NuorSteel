<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;

class TimelineEvent extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'year',
        'title_en',
        'title_ar',
        'description_en',
        'description_ar',
        'image_id',
        'sort_order',
        'created_by',
        'updated_by',
    ];

    public function image(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'image_id');
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

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('year');
    }
}

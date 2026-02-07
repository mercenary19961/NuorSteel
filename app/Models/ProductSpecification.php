<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductSpecification extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'property_en',
        'property_ar',
        'min_value',
        'max_value',
        'value',
        'unit',
        'spec_type',
        'sort_order',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getPropertyAttribute(): string
    {
        $locale = app()->getLocale();
        return $locale === 'ar' ? ($this->property_ar ?: $this->property_en) : $this->property_en;
    }

    public function getDisplayValueAttribute(): string
    {
        if ($this->value) {
            return $this->value . ($this->unit ? ' ' . $this->unit : '');
        }

        if ($this->min_value && $this->max_value) {
            return $this->min_value . ' - ' . $this->max_value . ($this->unit ? ' ' . $this->unit : '');
        }

        if ($this->min_value) {
            return '≥ ' . $this->min_value . ($this->unit ? ' ' . $this->unit : '');
        }

        if ($this->max_value) {
            return '≤ ' . $this->max_value . ($this->unit ? ' ' . $this->unit : '');
        }

        return '-';
    }
}

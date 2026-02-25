<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class LinkedinCache extends Model
{
    public $timestamps = false;

    protected $table = 'linkedin_cache';

    protected $fillable = [
        'post_id',
        'content',
        'image_url',
        'post_url',
        'posted_at',
        'synced_at',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'posted_at' => 'datetime',
            'synced_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderByDesc('posted_at');
    }

    public static function getLatestPosts(int $limit = 5)
    {
        return static::active()->ordered()->limit($limit)->get();
    }
}

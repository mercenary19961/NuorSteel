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
    ];

    protected function casts(): array
    {
        return [
            'posted_at' => 'datetime',
            'synced_at' => 'datetime',
        ];
    }

    public function scopeRecentPosts(Builder $query, int $limit = 5): Builder
    {
        return $query->orderByDesc('posted_at')->limit($limit);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('posted_at');
    }

    public static function syncPost(array $data): static
    {
        return static::updateOrCreate(
            ['post_id' => $data['post_id']],
            [
                'content' => $data['content'],
                'image_url' => $data['image_url'] ?? null,
                'post_url' => $data['post_url'],
                'posted_at' => $data['posted_at'],
                'synced_at' => now(),
            ]
        );
    }

    public static function getLatestPosts(int $limit = 5)
    {
        return static::recentPosts($limit)->get();
    }

    public static function needsSync(int $hoursThreshold = 6): bool
    {
        $lastSync = static::max('synced_at');

        if (!$lastSync) {
            return true;
        }

        return now()->diffInHours($lastSync) >= $hoursThreshold;
    }
}

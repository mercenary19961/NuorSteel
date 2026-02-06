<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteContent extends Model
{
    public $timestamps = false;

    protected $table = 'site_content';

    protected $fillable = [
        'page',
        'section',
        'key',
        'content_en',
        'content_ar',
        'type',
        'updated_by',
    ];

    protected static function booted(): void
    {
        static::saving(function (SiteContent $content) {
            $content->updated_at = now();
        });
    }

    public function updatedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function getContentAttribute(): string
    {
        $locale = app()->getLocale();
        return $locale === 'ar' ? ($this->content_ar ?: $this->content_en) : $this->content_en;
    }

    public static function getContent(string $page, string $section, string $key, string $locale = 'en'): ?string
    {
        $content = static::where('page', $page)
            ->where('section', $section)
            ->where('key', $key)
            ->first();

        if (!$content) {
            return null;
        }

        return $locale === 'ar' ? ($content->content_ar ?: $content->content_en) : $content->content_en;
    }

    public static function getSection(string $page, string $section, string $locale = 'en'): array
    {
        $contents = static::where('page', $page)
            ->where('section', $section)
            ->get();

        $result = [];
        foreach ($contents as $content) {
            $result[$content->key] = $locale === 'ar'
                ? ($content->content_ar ?: $content->content_en)
                : $content->content_en;
        }

        return $result;
    }

    public static function getPage(string $page, string $locale = 'en'): array
    {
        $contents = static::where('page', $page)->get();

        $result = [];
        foreach ($contents as $content) {
            if (!isset($result[$content->section])) {
                $result[$content->section] = [];
            }
            $result[$content->section][$content->key] = $locale === 'ar'
                ? ($content->content_ar ?: $content->content_en)
                : $content->content_en;
        }

        return $result;
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

/**
 * @property string $path
 * @property string $alt_text_en
 * @property string|null $alt_text_ar
 */
class Media extends Model
{
    public $timestamps = false;

    protected $table = 'media';

    protected $fillable = [
        'filename',
        'original_filename',
        'path',
        'mime_type',
        'size',
        'alt_text_en',
        'alt_text_ar',
        'folder',
        'uploaded_by',
    ];

    protected $appends = ['url'];

    protected static function booted(): void
    {
        static::creating(function (Media $media) {
            $media->created_at = now();
        });

        static::deleting(function (Media $media) {
            Storage::delete($media->path);
        });
    }

    public function uploadedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function productImages(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function getUrlAttribute(): string
    {
        return url("/media/{$this->id}");
    }

    public function getAltTextAttribute(): string
    {
        $locale = app()->getLocale();
        return $locale === 'ar' ? ($this->alt_text_ar ?: $this->alt_text_en ?: '') : ($this->alt_text_en ?: '');
    }

    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    public function isPdf(): bool
    {
        return $this->mime_type === 'application/pdf';
    }

    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $index = 0;

        while ($bytes >= 1024 && $index < count($units) - 1) {
            $bytes /= 1024;
            $index++;
        }

        return round($bytes, 2) . ' ' . $units[$index];
    }
}

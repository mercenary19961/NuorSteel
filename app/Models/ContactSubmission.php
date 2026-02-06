<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int $id
 * @property string|null $file_path
 */
class ContactSubmission extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'company',
        'email',
        'phone',
        'country',
        'request_type',
        'subject',
        'message',
        'file_path',
        'is_read',
        'is_archived',
        'read_by',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'is_archived' => 'boolean',
            'created_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (ContactSubmission $submission) {
            $submission->created_at = now();
        });
    }

    public function readByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'read_by');
    }

    public function getFileUrlAttribute(): ?string
    {
        return $this->file_path ? url('/api/v1/admin/contacts/' . $this->id . '/download-attachment') : null;
    }

    public function hasFile(): bool
    {
        return !empty($this->file_path);
    }

    public function markAsRead(int $userId): void
    {
        $this->update([
            'is_read' => true,
            'read_by' => $userId,
        ]);
    }

    public function archive(): void
    {
        $this->update(['is_archived' => true]);
    }

    public function unarchive(): void
    {
        $this->update(['is_archived' => false]);
    }

    public function scopeUnread(Builder $query): Builder
    {
        return $query->where('is_read', false);
    }

    public function scopeRead(Builder $query): Builder
    {
        return $query->where('is_read', true);
    }

    public function scopeArchived(Builder $query): Builder
    {
        return $query->where('is_archived', true);
    }

    public function scopeNotArchived(Builder $query): Builder
    {
        return $query->where('is_archived', false);
    }

    public function scopeRequestType(Builder $query, string $type): Builder
    {
        return $query->where('request_type', $type);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('created_at');
    }

    public static function getRequestTypeLabel(string $type): string
    {
        return match ($type) {
            'vendor' => 'Vendor Registration',
            'partnership' => 'Partnerships',
            'careers' => 'Careers',
            'sustainability' => 'Sustainability',
            'general' => 'General Enquiry',
            'quotation' => 'Quotation',
            default => ucfirst($type),
        };
    }
}

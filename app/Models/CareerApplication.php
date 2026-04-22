<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $cv_path
 * @property int|null $career_listing_id
 */
class CareerApplication extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'career_listing_id',
        'name',
        'email',
        'phone',
        'job_title',
        'cv_path',
    ];

    public function careerListing(): BelongsTo
    {
        return $this->belongsTo(CareerListing::class);
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function isOpenApplication(): bool
    {
        return $this->career_listing_id === null;
    }

    public function markAsReviewed(int $userId): void
    {
        $this->status = 'reviewed';
        $this->reviewed_by = $userId;
        $this->save();
    }

    public function markAsShortlisted(int $userId): void
    {
        $this->status = 'shortlisted';
        $this->reviewed_by = $userId;
        $this->save();
    }

    public function markAsRejected(int $userId): void
    {
        $this->status = 'rejected';
        $this->reviewed_by = $userId;
        $this->save();
    }

    public function scopeNew(Builder $query): Builder
    {
        return $query->where('status', 'new');
    }

    public function scopeReviewed(Builder $query): Builder
    {
        return $query->where('status', 'reviewed');
    }

    public function scopeShortlisted(Builder $query): Builder
    {
        return $query->where('status', 'shortlisted');
    }

    public function scopeRejected(Builder $query): Builder
    {
        return $query->where('status', 'rejected');
    }

    public function scopeOpenApplications(Builder $query): Builder
    {
        return $query->whereNull('career_listing_id');
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query
            ->orderByRaw("CASE WHEN status = 'new' THEN 0 ELSE 1 END")
            ->orderByDesc('created_at');
    }
}

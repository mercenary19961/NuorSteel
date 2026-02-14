<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChangeLog extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        'model_type',
        'model_id',
        'changes',
        'old_data',
        'new_data',
        'changed_by',
    ];

    protected $casts = [
        'changes' => 'array',
        'old_data' => 'array',
        'new_data' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    public function scopeForSection($query, string $modelType)
    {
        return $query->where('model_type', $modelType);
    }
}

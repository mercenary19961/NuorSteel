<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class UndoService
{
    /**
     * Save the current state of a model (or a batch of key-value records)
     * into the session so it can be restored later.
     *
     * @param  string  $modelType  e.g. 'settings', 'product', 'certificate'
     * @param  string|int  $id     model ID or a group key like 'all'
     * @param  array  $oldData     snapshot of the current state before changes
     * @param  array  $newData     the incoming new values (used to compute changes)
     * @return bool  whether there are actual differences
     */
    public function saveState(string $modelType, string|int $id, array $oldData, array $newData): bool
    {
        $changes = $this->computeChanges($modelType, $oldData, $newData);

        if (empty($changes)) {
            return false;
        }

        $sessionKey = "undo_{$modelType}_{$id}";
        session()->put($sessionKey, [
            'old_data' => $oldData,
            'changes' => $changes,
            'saved_at' => now()->toIso8601String(),
            'saved_by' => Auth::id(),
        ]);

        return true;
    }

    /**
     * Retrieve undo metadata to pass to the frontend.
     */
    public function getUndoMeta(string $modelType, string|int $id): ?array
    {
        $sessionKey = "undo_{$modelType}_{$id}";
        $state = session($sessionKey);

        if (!$state) {
            return null;
        }

        return [
            'available' => true,
            'saved_at' => $state['saved_at'],
            'saved_by' => $state['saved_by'],
            'changes' => $state['changes'],
        ];
    }

    /**
     * Retrieve the saved old data for restoration.
     */
    public function getOldData(string $modelType, string|int $id): ?array
    {
        $sessionKey = "undo_{$modelType}_{$id}";
        $state = session($sessionKey);

        return $state['old_data'] ?? null;
    }

    /**
     * Clear the undo state from the session.
     */
    public function clear(string $modelType, string|int $id): void
    {
        session()->forget("undo_{$modelType}_{$id}");
    }

    /**
     * Compute field-level changes between old and new data.
     *
     * @return array<int, array{field: string, label: string, old: string, new: string}>
     */
    public function computeChanges(string $modelType, array $oldData, array $newData): array
    {
        return match ($modelType) {
            'site_content' => $this->computeBilingualChanges($oldData, $newData),
            default => $this->computeKeyValueChanges($modelType, $oldData, $newData),
        };
    }

    /**
     * Compare flat key-value maps (e.g. settings).
     */
    protected function computeKeyValueChanges(string $modelType, array $oldData, array $newData): array
    {
        $changes = [];
        $fieldConfig = $this->getFieldConfig($modelType);

        foreach ($newData as $field => $newValue) {
            $oldValue = $oldData[$field] ?? '';
            $newValue = (string) ($newValue ?? '');
            $oldValue = (string) ($oldValue ?? '');

            if ($oldValue === $newValue) {
                continue;
            }

            $config = $fieldConfig[$field] ?? null;
            $label = $config['label'] ?? $this->formatFieldLabel($field);

            $changes[] = [
                'field' => $field,
                'label' => $label,
                'old' => $this->truncate($oldValue, 80),
                'new' => $this->truncate($newValue, 80),
            ];
        }

        return $changes;
    }

    /**
     * Compare bilingual records keyed by ID, each having content_en, content_ar, and label.
     * Used for site_content where each item has EN/AR fields.
     */
    protected function computeBilingualChanges(array $oldData, array $newData): array
    {
        $changes = [];

        foreach ($newData as $id => $fields) {
            $old = $oldData[$id] ?? [];
            $label = $fields['label'] ?? "Content #{$id}";

            $oldEn = (string) ($old['content_en'] ?? '');
            $newEn = (string) ($fields['content_en'] ?? '');
            if ($oldEn !== $newEn) {
                $changes[] = [
                    'field' => "{$id}_content_en",
                    'label' => "{$label} (EN)",
                    'old' => $this->truncate($oldEn, 80),
                    'new' => $this->truncate($newEn, 80),
                ];
            }

            $oldAr = (string) ($old['content_ar'] ?? '');
            $newAr = (string) ($fields['content_ar'] ?? '');
            if ($oldAr !== $newAr) {
                $changes[] = [
                    'field' => "{$id}_content_ar",
                    'label' => "{$label} (AR)",
                    'old' => $this->truncate($oldAr, 80),
                    'new' => $this->truncate($newAr, 80),
                ];
            }
        }

        return $changes;
    }

    /**
     * Field display config per model type.
     * Extend this as you add undo support to more models.
     */
    protected function getFieldConfig(string $modelType): array
    {
        return match ($modelType) {
            'settings' => [
                'site_name' => ['label' => 'Site Name'],
                'site_description' => ['label' => 'Site Description'],
                'contact_email' => ['label' => 'Contact Email'],
                'contact_phone' => ['label' => 'Contact Phone'],
                'contact_address' => ['label' => 'Contact Address'],
                'contact_recipients' => ['label' => 'Contact Recipients'],
                'career_recipients' => ['label' => 'Career Recipients'],
                'linkedin_url' => ['label' => 'LinkedIn URL'],
                'media_custom_folders' => ['label' => 'Media Custom Folders'],
            ],
            default => [],
        };
    }

    /**
     * Auto-format a field key into a readable label.
     */
    protected function formatFieldLabel(string $key): string
    {
        return ucwords(str_replace('_', ' ', $key));
    }

    protected function truncate(string $value, int $length): string
    {
        if (mb_strlen($value) <= $length) {
            return $value;
        }
        return mb_substr($value, 0, $length) . '…';
    }
}

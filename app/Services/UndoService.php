<?php

namespace App\Services;

use App\Models\ChangeLog;
use App\Models\Setting;
use App\Models\SiteContent;
use App\Models\Product;
use App\Models\Media;
use App\Models\Certificate;
use App\Models\CareerListing;
use App\Models\CareerApplication;
use App\Models\TimelineEvent;
use App\Models\ContactSubmission;
use App\Models\NewsletterSubscriber;
use Illuminate\Support\Facades\Auth;

class UndoService
{
    /**
     * Save the current state of a model (or a batch of key-value records)
     * into the session so it can be restored later.
     * Also persists to the change_logs table for permanent history.
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

        // Session-based undo (quick undo for last change)
        $sessionKey = "undo_{$modelType}_{$id}";
        session()->put($sessionKey, [
            'old_data' => $oldData,
            'changes' => $changes,
            'saved_at' => now()->toIso8601String(),
            'saved_by' => Auth::id(),
        ]);

        // Persistent change log
        ChangeLog::create([
            'model_type' => $modelType,
            'model_id' => (string) $id,
            'changes' => $changes,
            'old_data' => $oldData,
            'new_data' => $newData,
            'changed_by' => Auth::id(),
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
     * Save delete action to session and change log for soft-delete undo.
     */
    public function saveDeleteState(string $modelType, string|int $id): void
    {
        $sessionKey = "undo_{$modelType}_{$id}";
        session()->put($sessionKey, [
            'action' => 'delete',
            'changes' => [['field' => 'status', 'label' => 'Record', 'old' => 'Active', 'new' => 'Deleted']],
            'saved_at' => now()->toIso8601String(),
            'saved_by' => Auth::id(),
        ]);

        ChangeLog::create([
            'model_type' => $modelType,
            'model_id' => (string) $id,
            'changes' => [['field' => 'status', 'label' => 'Record', 'old' => 'Active', 'new' => 'Deleted']],
            'old_data' => [],
            'new_data' => [],
            'changed_by' => Auth::id(),
        ]);
    }

    /**
     * Check if the undo state is a delete action.
     */
    public function isDeleteAction(string $modelType, string|int $id): bool
    {
        $state = session("undo_{$modelType}_{$id}");
        return isset($state['action']) && $state['action'] === 'delete';
    }

    /**
     * Restore a soft-deleted model.
     *
     * @return string|null  Redirect URL on success, null on unknown model type
     */
    public function restoreDeleted(string $modelType, string|int $id): ?string
    {
        $modelClass = match ($modelType) {
            'product' => Product::class,
            'certificate' => Certificate::class,
            'career' => CareerListing::class,
            'application' => CareerApplication::class,
            'media' => Media::class,
            'timeline' => TimelineEvent::class,
            'contact' => ContactSubmission::class,
            'newsletter' => NewsletterSubscriber::class,
            default => null,
        };

        if (!$modelClass) {
            return null;
        }

        $model = $modelClass::withTrashed()->find($id);
        if ($model && $model->trashed()) {
            $model->restore();
        }

        return match ($modelType) {
            'product' => '/admin/products',
            'certificate' => '/admin/certificates',
            'career' => '/admin/careers',
            'application' => '/admin/applications',
            'media' => '/admin/media',
            'timeline' => '/admin/timeline',
            'contact' => '/admin/contacts',
            'newsletter' => '/admin/newsletter',
            default => null,
        };
    }

    /**
     * Clear the undo state from the session.
     */
    public function clear(string $modelType, string|int $id): void
    {
        session()->forget("undo_{$modelType}_{$id}");
    }

    /**
     * Restore a model to a previous state from a snapshot.
     * Shared by UndoController (session undo) and ChangeLogController (history revert).
     *
     * @return string|null  Redirect URL on success, null on unknown model type
     */
    public function restoreFromSnapshot(string $modelType, array $oldData): ?string
    {
        $userId = Auth::id();

        return match ($modelType) {
            'settings' => $this->restoreSettings($oldData, $userId),
            'site_content' => $this->restoreSiteContent($oldData, $userId),
            'product' => $this->restoreProduct($oldData, $userId),
            'media' => $this->restoreMedia($oldData, $userId),
            'certificate' => $this->restoreCertificate($oldData, $userId),
            'career' => $this->restoreCareer($oldData, $userId),
            'application' => $this->restoreApplication($oldData, $userId),
            default => null,
        };
    }

    // ──────────────────────────────────────────────
    // Restore methods
    // ──────────────────────────────────────────────

    protected function restoreSettings(array $oldData, ?int $userId): string
    {
        foreach ($oldData as $key => $value) {
            Setting::set($key, $value, $userId);
        }

        return '/admin/settings';
    }

    protected function restoreSiteContent(array $oldData, ?int $userId): string
    {
        foreach ($oldData as $id => $fields) {
            SiteContent::where('id', $id)->update([
                'content_en' => $fields['content_en'] ?? null,
                'content_ar' => $fields['content_ar'] ?? null,
                'updated_by' => $userId,
            ]);
        }

        return '/admin/content';
    }

    protected function restoreProduct(array $oldData, ?int $userId): string
    {
        $productId = $oldData['id'] ?? null;
        if ($productId) {
            Product::where('id', $productId)->update([
                'name_en' => $oldData['name_en'] ?? null,
                'name_ar' => $oldData['name_ar'] ?? null,
                'short_description_en' => $oldData['short_description_en'] ?? null,
                'short_description_ar' => $oldData['short_description_ar'] ?? null,
                'description_en' => $oldData['description_en'] ?? null,
                'description_ar' => $oldData['description_ar'] ?? null,
                'category' => $oldData['category'] ?? null,
                'featured_image_id' => $oldData['featured_image_id'] ?? null,
                'is_active' => $oldData['is_active'] ?? false,
                'is_featured' => $oldData['is_featured'] ?? false,
                'sort_order' => $oldData['sort_order'] ?? 0,
                'updated_by' => $userId,
            ]);
        }

        return '/admin/products';
    }

    protected function restoreMedia(array $oldData, ?int $userId): string
    {
        $mediaId = $oldData['id'] ?? null;
        if ($mediaId) {
            Media::where('id', $mediaId)->update([
                'alt_text_en' => $oldData['alt_text_en'] ?? null,
                'alt_text_ar' => $oldData['alt_text_ar'] ?? null,
                'folder' => $oldData['folder'] ?? 'general',
            ]);
        }

        return '/admin/media';
    }

    protected function restoreCertificate(array $oldData, ?int $userId): string
    {
        $certId = $oldData['id'] ?? null;
        if ($certId) {
            Certificate::where('id', $certId)->update([
                'title_en' => $oldData['title_en'] ?? null,
                'title_ar' => $oldData['title_ar'] ?? null,
                'category' => $oldData['category'] ?? null,
                'description_en' => $oldData['description_en'] ?? null,
                'description_ar' => $oldData['description_ar'] ?? null,
                'thumbnail_id' => $oldData['thumbnail_id'] ?? null,
                'issue_date' => $oldData['issue_date'] ?? null,
                'expiry_date' => $oldData['expiry_date'] ?? null,
                'is_active' => $oldData['is_active'] ?? false,
                'sort_order' => $oldData['sort_order'] ?? 0,
                'updated_by' => $userId,
            ]);
        }

        return '/admin/certificates';
    }

    protected function restoreCareer(array $oldData, ?int $userId): string
    {
        $careerId = $oldData['id'] ?? null;
        if ($careerId) {
            CareerListing::where('id', $careerId)->update([
                'title_en' => $oldData['title_en'] ?? null,
                'title_ar' => $oldData['title_ar'] ?? null,
                'description_en' => $oldData['description_en'] ?? null,
                'description_ar' => $oldData['description_ar'] ?? null,
                'requirements_en' => $oldData['requirements_en'] ?? null,
                'requirements_ar' => $oldData['requirements_ar'] ?? null,
                'location' => $oldData['location'] ?? null,
                'employment_type' => $oldData['employment_type'] ?? 'full-time',
                'status' => $oldData['status'] ?? 'draft',
                'expires_at' => $oldData['expires_at'] ?? null,
                'updated_by' => $userId,
            ]);
        }

        return '/admin/careers';
    }

    protected function restoreApplication(array $oldData, ?int $userId): string
    {
        $appId = $oldData['id'] ?? null;
        if ($appId) {
            CareerApplication::where('id', $appId)->update([
                'status' => $oldData['status'] ?? 'new',
                'admin_notes' => $oldData['admin_notes'] ?? null,
                'reviewed_by' => $userId,
            ]);
        }

        return '/admin/applications';
    }

    // ──────────────────────────────────────────────
    // Change computation
    // ──────────────────────────────────────────────

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
     * Compare flat key-value maps (e.g. settings, products, certificates).
     */
    protected function computeKeyValueChanges(string $modelType, array $oldData, array $newData): array
    {
        $changes = [];
        $fieldConfig = $this->getFieldConfig($modelType);

        foreach ($newData as $field => $newValue) {
            // Skip ID and label fields — they're metadata, not content
            if ($field === 'id' || $field === 'label') {
                continue;
            }

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
            'product' => [
                'name_en' => ['label' => 'Name (EN)'],
                'name_ar' => ['label' => 'Name (AR)'],
                'short_description_en' => ['label' => 'Short Description (EN)'],
                'short_description_ar' => ['label' => 'Short Description (AR)'],
                'description_en' => ['label' => 'Description (EN)'],
                'description_ar' => ['label' => 'Description (AR)'],
                'category' => ['label' => 'Category'],
                'featured_image_id' => ['label' => 'Featured Image'],
                'is_active' => ['label' => 'Active'],
                'is_featured' => ['label' => 'Featured'],
                'sort_order' => ['label' => 'Sort Order'],
            ],
            'media' => [
                'alt_text_en' => ['label' => 'Alt Text (EN)'],
                'alt_text_ar' => ['label' => 'Alt Text (AR)'],
                'folder' => ['label' => 'Folder'],
            ],
            'certificate' => [
                'title_en' => ['label' => 'Title (EN)'],
                'title_ar' => ['label' => 'Title (AR)'],
                'category' => ['label' => 'Category'],
                'description_en' => ['label' => 'Description (EN)'],
                'description_ar' => ['label' => 'Description (AR)'],
                'thumbnail_id' => ['label' => 'Thumbnail'],
                'issue_date' => ['label' => 'Issue Date'],
                'expiry_date' => ['label' => 'Expiry Date'],
                'is_active' => ['label' => 'Active'],
                'sort_order' => ['label' => 'Sort Order'],
            ],
            'career' => [
                'title_en' => ['label' => 'Title (EN)'],
                'title_ar' => ['label' => 'Title (AR)'],
                'description_en' => ['label' => 'Description (EN)'],
                'description_ar' => ['label' => 'Description (AR)'],
                'requirements_en' => ['label' => 'Requirements (EN)'],
                'requirements_ar' => ['label' => 'Requirements (AR)'],
                'location' => ['label' => 'Location'],
                'employment_type' => ['label' => 'Employment Type'],
                'status' => ['label' => 'Status'],
                'expires_at' => ['label' => 'Expiry Date'],
            ],
            'application' => [
                'status' => ['label' => 'Status'],
                'admin_notes' => ['label' => 'Admin Notes'],
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

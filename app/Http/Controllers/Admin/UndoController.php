<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\SiteContent;
use App\Services\UndoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UndoController extends Controller
{
    public function __construct(
        protected UndoService $undoService,
    ) {}

    /**
     * GET  /admin/undo/{model}/{id}
     * Return undo metadata (JSON).
     */
    public function status(string $model, string $id): JsonResponse
    {
        $meta = $this->undoService->getUndoMeta($model, $id);

        return response()->json([
            'undoMeta' => $meta,
        ]);
    }

    /**
     * POST  /admin/undo/{model}/{id}
     * Restore the model to the saved state.
     */
    public function restore(string $model, string $id): RedirectResponse
    {
        $oldData = $this->undoService->getOldData($model, $id);

        if (!$oldData) {
            return redirect()->back()->with('error', 'No undo state available.');
        }

        $redirectUrl = match ($model) {
            'settings' => $this->restoreSettings($oldData),
            'site_content' => $this->restoreSiteContent($oldData),
            default => null,
        };

        if ($redirectUrl === null) {
            return redirect()->back()->with('error', 'Unknown model type.');
        }

        if (!is_string($redirectUrl) || trim($redirectUrl) === '') {
            return redirect()->back()->with('error', 'Restore failed: invalid redirect URL.');
        }

        $this->undoService->clear($model, $id);

        return redirect($redirectUrl)->with('success', ucfirst($model) . ' restored to previous state.');
    }

    /**
     * DELETE  /admin/undo/{model}/{id}
     * Clear the undo state without restoring.
     */
    public function clear(string $model, string $id): JsonResponse
    {
        $this->undoService->clear($model, $id);

        return response()->json(['cleared' => true]);
    }

    /**
     * Restore settings from saved state.
     */
    protected function restoreSettings(array $oldData): string
    {
        $userId = Auth::id();
        foreach ($oldData as $key => $value) {
            Setting::set($key, $value, $userId);
        }

        return '/admin/settings';
    }

    protected function restoreSiteContent(array $oldData): string
    {
        $userId = Auth::id();
        foreach ($oldData as $id => $fields) {
            SiteContent::where('id', $id)->update([
                'content_en' => $fields['content_en'] ?? null,
                'content_ar' => $fields['content_ar'] ?? null,
                'updated_by' => $userId,
            ]);
        }

        return '/admin/content';
    }
}

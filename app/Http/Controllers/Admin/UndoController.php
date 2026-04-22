<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\UndoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UndoController extends Controller
{
    private const ALLOWED_MODELS = [
        'settings', 'site_content', 'product', 'media', 'certificate',
        'career', 'application', 'contact', 'newsletter', 'linkedin',
    ];

    private const ADMIN_ONLY_MODELS = [
        'settings', 'newsletter',
    ];

    public function __construct(
        protected UndoService $undoService,
    ) {}

    /**
     * GET  /admin/undo/{model}/{id}
     * Return undo metadata (JSON).
     */
    public function status(Request $request, string $model, string $id): JsonResponse
    {
        if (!$this->isAllowedModel($model)) {
            return response()->json(['undoMeta' => null]);
        }

        if ($this->requiresAdmin($model) && !$request->user()?->isAdmin()) {
            return response()->json(['undoMeta' => null]);
        }

        $meta = $this->undoService->getUndoMeta($model, $id);

        return response()->json([
            'undoMeta' => $meta,
        ]);
    }

    /**
     * POST  /admin/undo/{model}/{id}
     * Restore the model to the saved state.
     */
    public function restore(Request $request, string $model, string $id): RedirectResponse
    {
        if (!$this->isAllowedModel($model)) {
            return redirect()->back()->with('error', 'Unknown model type.');
        }

        if ($this->requiresAdmin($model) && !$request->user()?->isAdmin()) {
            abort(403, 'Unauthorized.');
        }

        // Check if this is a soft-delete undo
        if ($this->undoService->isDeleteAction($model, $id)) {
            $redirectUrl = $this->undoService->restoreDeleted($model, $id);

            if ($redirectUrl === null) {
                return redirect()->back()->with('error', 'Unknown model type.');
            }

            $this->undoService->clear($model, $id);

            return redirect($redirectUrl)->with('success', ucfirst($model) . ' restored successfully.');
        }

        $oldData = $this->undoService->getOldData($model, $id);

        if (!$oldData) {
            return redirect()->back()->with('error', 'No undo state available.');
        }

        $redirectUrl = $this->undoService->restoreFromSnapshot($model, $oldData);

        if ($redirectUrl === null) {
            return redirect()->back()->with('error', 'Unknown model type.');
        }

        if (trim($redirectUrl) === '') {
            return redirect()->back()->with('error', 'Restore failed: invalid redirect URL.');
        }

        $this->undoService->clear($model, $id);

        return redirect($redirectUrl)->with('success', ucfirst($model) . ' restored to previous state.');
    }

    /**
     * DELETE  /admin/undo/{model}/{id}
     * Clear the undo state without restoring.
     */
    public function clear(Request $request, string $model, string $id): RedirectResponse
    {
        if (!$this->isAllowedModel($model)) {
            return redirect()->back();
        }

        if ($this->requiresAdmin($model) && !$request->user()?->isAdmin()) {
            abort(403, 'Unauthorized.');
        }

        $this->undoService->clear($model, $id);

        return redirect()->back();
    }

    private function isAllowedModel(string $model): bool
    {
        return in_array($model, self::ALLOWED_MODELS, true);
    }

    private function requiresAdmin(string $model): bool
    {
        return in_array($model, self::ADMIN_ONLY_MODELS, true);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\UndoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

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
    public function clear(string $model, string $id): JsonResponse
    {
        $this->undoService->clear($model, $id);

        return response()->json(['cleared' => true]);
    }
}

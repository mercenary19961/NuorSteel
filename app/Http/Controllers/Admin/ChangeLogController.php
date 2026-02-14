<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChangeLog;
use App\Models\User;
use App\Services\UndoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ChangeLogController extends Controller
{
    private const SECTION_LABELS = [
        'settings' => 'Settings',
        'site_content' => 'Site Content',
        'product' => 'Products',
        'media' => 'Media',
        'certificate' => 'Certificates',
        'career' => 'Job Listings',
        'application' => 'Applications',
    ];

    public function __construct(
        protected UndoService $undoService,
    ) {}

    public function index(Request $request): Response
    {
        $query = ChangeLog::with(['user:id,name', 'reverter:id,name']);

        if ($request->filled('model_type')) {
            $query->where('model_type', $request->model_type);
        }

        if ($request->filled('changed_by')) {
            $query->where('changed_by', $request->changed_by);
        }

        $logs = $query->orderByDesc('created_at')->paginate(20)->withQueryString();

        $users = User::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/ChangeLog', [
            'logs' => $logs,
            'users' => $users,
            'sectionLabels' => self::SECTION_LABELS,
            'filters' => $request->only(['model_type', 'changed_by']),
        ]);
    }

    public function revert(int $id): RedirectResponse
    {
        $log = ChangeLog::findOrFail($id);

        if ($log->reverted_at) {
            return redirect()->back()->with('error', 'This change has already been reverted.');
        }

        $redirectUrl = $this->undoService->restoreFromSnapshot($log->model_type, $log->old_data);

        if ($redirectUrl === null) {
            return redirect()->back()->with('error', 'Unknown model type.');
        }

        // Mark the original entry as reverted (no new entry created)
        $log->update([
            'reverted_at' => now(),
            'reverted_by' => Auth::id(),
        ]);

        // Clear session-based undo for this section so the UndoButton
        // doesn't show stale state after a change-log revert
        $this->undoService->clear($log->model_type, $log->model_id);

        $sectionName = self::SECTION_LABELS[$log->model_type] ?? $log->model_type;

        return redirect('/admin/change-log')->with('success', $sectionName . ' reverted successfully.');
    }
}

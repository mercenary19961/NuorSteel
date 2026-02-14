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
        $query = ChangeLog::with('user:id,name');

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

        $redirectUrl = $this->undoService->restoreFromSnapshot($log->model_type, $log->old_data);

        if ($redirectUrl === null) {
            return redirect()->back()->with('error', 'Unknown model type.');
        }

        // Log the revert itself as a new change log entry
        $currentNewData = $log->old_data;
        $currentOldData = $log->new_data;
        $changes = $this->undoService->computeChanges($log->model_type, $currentOldData, $currentNewData);

        if (!empty($changes)) {
            ChangeLog::create([
                'model_type' => $log->model_type,
                'model_id' => $log->model_id,
                'changes' => $changes,
                'old_data' => $currentOldData,
                'new_data' => $currentNewData,
                'changed_by' => Auth::id(),
            ]);
        }

        return redirect('/admin/change-log')->with('success', self::SECTION_LABELS[$log->model_type] ?? $log->model_type . ' reverted successfully.');
    }
}

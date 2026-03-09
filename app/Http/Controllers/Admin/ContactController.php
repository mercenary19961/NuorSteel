<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use App\Services\UndoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function __construct(
        protected UndoService $undoService,
    ) {}

    public function index(Request $request): Response
    {
        $query = ContactSubmission::query();

        if ($request->has('request_type')) {
            $query->where('request_type', $request->request_type);
        }

        if ($request->has('is_read')) {
            $query->where('is_read', $request->boolean('is_read'));
        }

        if ($request->boolean('archived')) {
            $query->archived();
        } else {
            $query->notArchived();
        }

        $lastId = session('undo_contact_last_id');
        $undoMeta = $lastId ? $this->undoService->getUndoMeta('contact', $lastId) : null;

        return Inertia::render('Admin/Contacts', [
            'submissions' => $query->ordered()->paginate(15)->withQueryString(),
            'stats' => $this->getStats(),
            'filters' => $request->only(['request_type', 'is_read', 'archived']),
            'undoMeta' => $undoMeta,
            'undoModelId' => $undoMeta ? (string) $lastId : null,
        ]);
    }

    public function markAsRead(Request $request, int $id): RedirectResponse
    {
        $submission = ContactSubmission::findOrFail($id);
        $submission->markAsRead($request->user()->id);

        return redirect()->back()->with('success', 'Marked as read.');
    }

    public function archive(int $id): RedirectResponse
    {
        ContactSubmission::findOrFail($id)->archive();

        return redirect()->back()->with('success', 'Submission archived.');
    }

    public function unarchive(int $id): RedirectResponse
    {
        ContactSubmission::findOrFail($id)->unarchive();

        return redirect()->back()->with('success', 'Submission unarchived.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $submission = ContactSubmission::findOrFail($id);

        $this->undoService->saveDeleteState('contact', $submission->id);
        session()->put('undo_contact_last_id', $submission->id);

        $submission->delete();

        return redirect()->back()->with('success', 'Submission deleted.');
    }

    private function getStats(): array
    {
        $row = ContactSubmission::query()
            ->selectRaw('count(*) as total')
            ->selectRaw('sum(case when is_read = 0 and is_archived = 0 then 1 else 0 end) as unread')
            ->first();

        $byType = ContactSubmission::notArchived()
            ->selectRaw('request_type, count(*) as count')
            ->groupBy('request_type')
            ->pluck('count', 'request_type');

        return [
            'total' => (int) $row->total,
            'unread' => (int) $row->unread,
            'by_type' => $byType,
        ];
    }

    public function downloadFile(int $id): mixed
    {
        $submission = ContactSubmission::findOrFail($id);

        if (!$submission->file_path) {
            abort(404, 'No file attached.');
        }

        $extension = pathinfo($submission->file_path, PATHINFO_EXTENSION) ?: 'pdf';
        return Storage::download($submission->file_path, $submission->name . '_attachment.' . $extension);
    }
}

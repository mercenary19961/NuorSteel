<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
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

        return Inertia::render('Admin/Contacts', [
            'submissions' => $query->ordered()->paginate(15)->withQueryString(),
            'stats' => [
                'total' => ContactSubmission::count(),
                'unread' => ContactSubmission::unread()->notArchived()->count(),
                'by_type' => ContactSubmission::notArchived()
                    ->selectRaw('request_type, count(*) as count')
                    ->groupBy('request_type')
                    ->pluck('count', 'request_type'),
            ],
            'filters' => $request->only(['request_type', 'is_read', 'archived']),
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

        if ($submission->file_path) {
            Storage::delete($submission->file_path);
        }

        $submission->delete();

        return redirect()->back()->with('success', 'Submission deleted.');
    }

    public function downloadFile(int $id): mixed
    {
        $submission = ContactSubmission::findOrFail($id);

        if (!$submission->file_path) {
            abort(404, 'No file attached.');
        }

        return Storage::download($submission->file_path, $submission->name . '_attachment.pdf');
    }
}

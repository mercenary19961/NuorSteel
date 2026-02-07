<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContactController extends Controller
{
    public function index(Request $request): JsonResponse
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

        $submissions = $query->ordered()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $submissions->items(),
            'meta' => [
                'current_page' => $submissions->currentPage(),
                'last_page' => $submissions->lastPage(),
                'per_page' => $submissions->perPage(),
                'total' => $submissions->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $submission = ContactSubmission::with('readByUser')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $submission,
        ]);
    }

    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $submission = ContactSubmission::findOrFail($id);
        $submission->markAsRead($request->user()->id);

        return response()->json([
            'success' => true,
            'message' => 'Marked as read.',
            'data' => $submission,
        ]);
    }

    public function archive(int $id): JsonResponse
    {
        $submission = ContactSubmission::findOrFail($id);
        $submission->archive();

        return response()->json([
            'success' => true,
            'message' => 'Submission archived.',
        ]);
    }

    public function unarchive(int $id): JsonResponse
    {
        $submission = ContactSubmission::findOrFail($id);
        $submission->unarchive();

        return response()->json([
            'success' => true,
            'message' => 'Submission unarchived.',
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $submission = ContactSubmission::findOrFail($id);

        if ($submission->file_path) {
            Storage::disk('local')->delete($submission->file_path);
        }

        $submission->delete();

        return response()->json([
            'success' => true,
            'message' => 'Submission deleted.',
        ]);
    }

    public function downloadFile(int $id): mixed
    {
        $submission = ContactSubmission::findOrFail($id);

        if (!$submission->file_path) {
            return response()->json([
                'success' => false,
                'message' => 'No file attached.',
            ], 404);
        }

        return response()->download(
            storage_path('app/' . $submission->file_path),
            $submission->name . '_attachment.pdf'
        );
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total' => ContactSubmission::count(),
                'unread' => ContactSubmission::unread()->notArchived()->count(),
                'by_type' => ContactSubmission::notArchived()
                    ->selectRaw('request_type, count(*) as count')
                    ->groupBy('request_type')
                    ->pluck('count', 'request_type'),
            ],
        ]);
    }
}

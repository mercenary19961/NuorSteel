<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = NewsletterSubscriber::query();

        if ($request->has('active')) {
            if ($request->boolean('active')) {
                $query->active();
            } else {
                $query->inactive();
            }
        }

        $subscribers = $query->ordered()->paginate(25);

        return response()->json([
            'success' => true,
            'data' => $subscribers->items(),
            'meta' => [
                'current_page' => $subscribers->currentPage(),
                'last_page' => $subscribers->lastPage(),
                'per_page' => $subscribers->perPage(),
                'total' => $subscribers->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|unique:newsletter_subscribers,email',
            'source' => 'nullable|string|max:50',
        ]);

        $subscriber = NewsletterSubscriber::create([
            'email' => $request->email,
            'source' => $request->input('source', 'admin'),
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subscriber added successfully.',
            'data' => $subscriber,
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $subscriber = NewsletterSubscriber::findOrFail($id);
        $subscriber->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subscriber removed.',
        ]);
    }

    public function toggleStatus(int $id): JsonResponse
    {
        $subscriber = NewsletterSubscriber::findOrFail($id);

        if ($subscriber->is_active) {
            $subscriber->unsubscribe();
        } else {
            $subscriber->resubscribe();
        }

        return response()->json([
            'success' => true,
            'message' => $subscriber->is_active ? 'Subscriber activated.' : 'Subscriber deactivated.',
            'data' => $subscriber,
        ]);
    }

    public function export(): JsonResponse
    {
        $subscribers = NewsletterSubscriber::active()
            ->ordered()
            ->pluck('email');

        return response()->json([
            'success' => true,
            'data' => $subscribers,
        ]);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total' => NewsletterSubscriber::count(),
                'active' => NewsletterSubscriber::active()->count(),
                'inactive' => NewsletterSubscriber::inactive()->count(),
                'by_source' => NewsletterSubscriber::active()
                    ->selectRaw('source, count(*) as count')
                    ->groupBy('source')
                    ->pluck('count', 'source'),
            ],
        ]);
    }
}

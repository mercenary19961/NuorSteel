<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterController extends Controller
{
    public function index(Request $request): Response
    {
        $query = NewsletterSubscriber::query();

        if ($request->has('active')) {
            if ($request->boolean('active')) {
                $query->active();
            } else {
                $query->inactive();
            }
        }

        return Inertia::render('Admin/Newsletter', [
            'subscribers' => $query->ordered()->paginate(25)->withQueryString(),
            'stats' => [
                'total' => NewsletterSubscriber::count(),
                'active' => NewsletterSubscriber::active()->count(),
                'inactive' => NewsletterSubscriber::inactive()->count(),
                'by_source' => NewsletterSubscriber::active()
                    ->selectRaw('source, count(*) as count')
                    ->groupBy('source')
                    ->pluck('count', 'source'),
            ],
            'filters' => $request->only(['active']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|unique:newsletter_subscribers,email',
            'source' => 'nullable|string|max:50',
        ]);

        NewsletterSubscriber::create([
            'email' => $request->email,
            'source' => $request->input('source', 'admin'),
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Subscriber added successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        NewsletterSubscriber::findOrFail($id)->delete();

        return redirect()->back()->with('success', 'Subscriber removed.');
    }

    public function toggleStatus(int $id): RedirectResponse
    {
        $subscriber = NewsletterSubscriber::findOrFail($id);

        if ($subscriber->is_active) {
            $subscriber->unsubscribe();
        } else {
            $subscriber->resubscribe();
        }

        return redirect()->back()->with('success', $subscriber->is_active ? 'Subscriber activated.' : 'Subscriber deactivated.');
    }

    public function export()
    {
        $subscribers = NewsletterSubscriber::active()
            ->ordered()
            ->pluck('email');

        return response()->json([
            'success' => true,
            'data' => $subscribers,
        ]);
    }
}

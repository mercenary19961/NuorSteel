<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use App\Services\UndoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterController extends Controller
{
    public function __construct(
        protected UndoService $undoService,
    ) {}

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

        $lastId = session('undo_newsletter_last_id');
        $undoMeta = $lastId ? $this->undoService->getUndoMeta('newsletter', $lastId) : null;

        return Inertia::render('Admin/Newsletter', [
            'subscribers' => $query->ordered()->paginate(25)->withQueryString(),
            'stats' => $this->getStats(),
            'filters' => $request->only(['active']),
            'undoMeta' => $undoMeta,
            'undoModelId' => $undoMeta ? (string) $lastId : null,
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
        $subscriber = NewsletterSubscriber::findOrFail($id);

        $this->undoService->saveDeleteState('newsletter', $subscriber->id);
        session()->put('undo_newsletter_last_id', $subscriber->id);

        $subscriber->delete();

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

    private function getStats(): array
    {
        $row = NewsletterSubscriber::query()
            ->selectRaw('count(*) as total')
            ->selectRaw('sum(case when is_active = 1 then 1 else 0 end) as active')
            ->selectRaw('sum(case when is_active = 0 then 1 else 0 end) as inactive')
            ->first();

        $bySource = NewsletterSubscriber::active()
            ->selectRaw('source, count(*) as count')
            ->groupBy('source')
            ->pluck('count', 'source');

        return [
            'total' => (int) $row->total,
            'active' => (int) $row->active,
            'inactive' => (int) $row->inactive,
            'by_source' => $bySource,
        ];
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

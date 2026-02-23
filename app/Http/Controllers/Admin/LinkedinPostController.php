<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LinkedinCache;
use App\Services\UndoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LinkedinPostController extends Controller
{
    public function __construct(
        protected UndoService $undoService,
    ) {}

    public function index(Request $request): Response
    {
        $query = LinkedinCache::query();

        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $lastId = session('undo_linkedin_last_id');
        $undoMeta = $lastId ? $this->undoService->getUndoMeta('linkedin', $lastId) : null;

        return Inertia::render('Admin/LinkedinPosts', [
            'posts' => $query->orderByDesc('posted_at')->paginate(20)->withQueryString(),
            'stats' => [
                'total' => LinkedinCache::count(),
                'active' => LinkedinCache::active()->count(),
                'hidden' => LinkedinCache::where('is_active', false)->count(),
            ],
            'filters' => $request->only(['active']),
            'undoMeta' => $undoMeta,
            'undoModelId' => $undoMeta ? (string) $lastId : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'post_input' => ['required', 'string'],
            'content' => 'nullable|string|max:500',
        ]);

        $raw = $request->post_input;

        // Extract src URL from iframe embed code if pasted
        $url = $this->extractUrlFromInput($raw);

        if (!$url) {
            return redirect()->back()->withErrors([
                'post_input' => 'Could not find a valid LinkedIn URL. Paste the embed code or a LinkedIn post URL.',
            ]);
        }

        $postId = $this->extractPostId($url);

        if (!$postId) {
            return redirect()->back()->withErrors([
                'post_input' => 'Could not extract a LinkedIn post ID. Please use the "Embed this post" code from LinkedIn.',
            ]);
        }

        $existing = LinkedinCache::where('post_id', $postId)->first();
        if ($existing) {
            return redirect()->back()->withErrors([
                'post_input' => 'This LinkedIn post has already been added.',
            ]);
        }

        $maxOrder = LinkedinCache::max('sort_order') ?? 0;

        LinkedinCache::create([
            'post_id' => $postId,
            'content' => strip_tags($request->input('content')) ?: now()->format('M d, Y h:i A'),
            'post_url' => $url,
            'posted_at' => now(),
            'synced_at' => now(),
            'is_active' => true,
            'sort_order' => $maxOrder + 1,
        ]);

        return redirect()->back()->with('success', 'LinkedIn post added successfully.');
    }

    public function update(int $id, Request $request): RedirectResponse
    {
        $post = LinkedinCache::findOrFail($id);

        $request->validate([
            'content' => 'nullable|string|max:500',
        ]);

        $post->update([
            'content' => strip_tags($request->input('content', '')),
        ]);

        return redirect()->back()->with('success', 'Post updated.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $post = LinkedinCache::findOrFail($id);

        $this->undoService->saveDeleteState('linkedin', $post->id);
        session()->put('undo_linkedin_last_id', $post->id);

        $post->delete();

        return redirect()->back()->with('success', 'Post removed.');
    }

    public function toggleVisibility(int $id): RedirectResponse
    {
        $post = LinkedinCache::findOrFail($id);

        $post->update(['is_active' => !$post->is_active]);

        $status = $post->is_active ? 'visible' : 'hidden';

        return redirect()->back()->with('success', "Post is now {$status}.");
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:linkedin_cache,id',
        ]);

        foreach ($request->ids as $index => $id) {
            LinkedinCache::where('id', $id)->update(['sort_order' => $index]);
        }

        return redirect()->back()->with('success', 'Order updated.');
    }

    /**
     * Extract a LinkedIn URL from raw input (iframe embed code or plain URL).
     */
    private function extractUrlFromInput(string $input): ?string
    {
        $input = trim($input);

        // If it's an iframe embed code, extract the src attribute
        if (preg_match('/src=["\']([^"\']+linkedin\.com[^"\']+)["\']/i', $input, $matches)) {
            // Strip query params like ?collapsed=1
            return strtok($matches[1], '?');
        }

        // If it's already a LinkedIn URL
        if (preg_match('/https?:\/\/[^\s]*linkedin\.com[^\s]*/i', $input, $matches)) {
            return strtok($matches[0], '?');
        }

        return null;
    }

    /**
     * Extract the LinkedIn post activity ID from various URL formats.
     */
    private function extractPostId(string $url): ?string
    {
        // Format: https://www.linkedin.com/feed/update/urn:li:activity:1234567890
        if (preg_match('/urn:li:activity:(\d+)/', $url, $matches)) {
            return 'urn:li:activity:' . $matches[1];
        }

        // Format: https://www.linkedin.com/feed/update/urn:li:ugcPost:1234567890
        if (preg_match('/urn:li:ugcPost:(\d+)/', $url, $matches)) {
            return 'urn:li:ugcPost:' . $matches[1];
        }

        // Format: https://www.linkedin.com/posts/username_activity-1234567890-xxxx
        if (preg_match('/activity-(\d+)/', $url, $matches)) {
            return 'urn:li:activity:' . $matches[1];
        }

        // Format: https://www.linkedin.com/embed/feed/update/urn:li:share:1234567890
        if (preg_match('/urn:li:share:(\d+)/', $url, $matches)) {
            return 'urn:li:share:' . $matches[1];
        }

        return null;
    }
}

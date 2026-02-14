<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use App\Services\UndoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteContentController extends Controller
{
    public function __construct(
        protected UndoService $undoService,
    ) {}

    public function index(): Response
    {
        $content = SiteContent::all()->groupBy('page');

        return Inertia::render('Admin/Content', [
            'content' => $content,
            'undoMeta' => $this->undoService->getUndoMeta('site_content', 'all'),
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'content_en' => 'nullable|string',
            'content_ar' => 'nullable|string',
        ]);

        $content = SiteContent::findOrFail($id);
        $content->update([
            'content_en' => $request->content_en,
            'content_ar' => $request->content_ar,
            'updated_by' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', 'Content updated successfully.');
    }

    public function bulkUpdate(Request $request): RedirectResponse
    {
        $request->validate([
            'contents' => 'required|array',
            'contents.*.id' => 'required|exists:site_content,id',
            'contents.*.content_en' => 'nullable|string',
            'contents.*.content_ar' => 'nullable|string',
        ]);

        // Snapshot current state before applying changes
        $ids = collect($request->contents)->pluck('id')->all();
        $currentItems = SiteContent::whereIn('id', $ids)->get()->keyBy('id');

        $oldData = [];
        $newData = [];
        foreach ($request->contents as $contentData) {
            $id = $contentData['id'];
            $current = $currentItems[$id] ?? null;
            if (!$current) {
                continue;
            }

            $label = ucfirst($current->page) . ' > ' . ucfirst($current->section) . ' > ' . ucfirst(str_replace('_', ' ', $current->key));

            $oldData[$id] = [
                'content_en' => $current->content_en ?? '',
                'content_ar' => $current->content_ar ?? '',
                'label' => $label,
            ];
            $newData[$id] = [
                'content_en' => $contentData['content_en'] ?? '',
                'content_ar' => $contentData['content_ar'] ?? '',
                'label' => $label,
            ];
        }

        $hasChanges = $this->undoService->saveState('site_content', 'all', $oldData, $newData);

        if (!$hasChanges) {
            return redirect()->back()->with('success', 'No changes detected.');
        }

        // Apply changes
        $userId = $request->user()->id;
        foreach ($request->contents as $contentData) {
            SiteContent::where('id', $contentData['id'])->update([
                'content_en' => $contentData['content_en'] ?? null,
                'content_ar' => $contentData['content_ar'] ?? null,
                'updated_by' => $userId,
            ]);
        }

        return redirect()->back()->with('success', 'Content updated successfully.');
    }
}

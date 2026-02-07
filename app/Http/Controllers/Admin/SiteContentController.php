<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteContentController extends Controller
{
    public function index(): Response
    {
        $content = SiteContent::all()->groupBy('page');

        return Inertia::render('Admin/Content', [
            'content' => $content,
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

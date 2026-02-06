<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteContentController extends Controller
{
    public function index(): JsonResponse
    {
        $content = SiteContent::all()->groupBy('page');

        return response()->json([
            'success' => true,
            'data' => $content,
        ]);
    }

    public function show(string $page): JsonResponse
    {
        $content = SiteContent::where('page', $page)
            ->get()
            ->groupBy('section');

        return response()->json([
            'success' => true,
            'data' => $content,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
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

        return response()->json([
            'success' => true,
            'message' => 'Content updated successfully.',
            'data' => $content,
        ]);
    }

    public function bulkUpdate(Request $request): JsonResponse
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

        return response()->json([
            'success' => true,
            'message' => 'Content updated successfully.',
        ]);
    }
}

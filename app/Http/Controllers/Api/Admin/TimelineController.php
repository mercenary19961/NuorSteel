<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TimelineEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TimelineController extends Controller
{
    public function index(): JsonResponse
    {
        $events = TimelineEvent::with('image')->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'year' => 'required|string|max:20',
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'image_id' => 'nullable|exists:media,id',
            'sort_order' => 'integer',
        ]);

        $event = TimelineEvent::create([
            ...$request->all(),
            'created_by' => $request->user()->id,
            'updated_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Timeline event created successfully.',
            'data' => $event,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $event = TimelineEvent::with('image')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $event,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'year' => 'required|string|max:20',
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'image_id' => 'nullable|exists:media,id',
            'sort_order' => 'integer',
        ]);

        $event = TimelineEvent::findOrFail($id);
        $event->update([
            ...$request->all(),
            'updated_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Timeline event updated successfully.',
            'data' => $event,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $event = TimelineEvent::findOrFail($id);
        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Timeline event deleted successfully.',
        ]);
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer|exists:timeline_events,id',
        ]);

        foreach ($request->order as $index => $id) {
            TimelineEvent::where('id', $id)->update(['sort_order' => $index]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Timeline events reordered successfully.',
        ]);
    }
}

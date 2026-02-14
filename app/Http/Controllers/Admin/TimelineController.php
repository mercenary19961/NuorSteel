<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TimelineEvent;
use App\Services\UndoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TimelineController extends Controller
{
    public function __construct(
        protected UndoService $undoService,
    ) {}

    public function index(): Response
    {
        $events = TimelineEvent::with('image')->ordered()->get();

        $lastId = session('undo_timeline_last_id');
        $undoMeta = $lastId ? $this->undoService->getUndoMeta('timeline', $lastId) : null;

        return Inertia::render('Admin/Timeline', [
            'events' => $events,
            'undoMeta' => $undoMeta,
            'undoModelId' => $undoMeta ? (string) $lastId : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
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

        TimelineEvent::create([
            ...$request->all(),
            'created_by' => $request->user()->id,
            'updated_by' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', 'Timeline event created successfully.');
    }

    public function update(Request $request, int $id): RedirectResponse
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

        return redirect()->back()->with('success', 'Timeline event updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $event = TimelineEvent::findOrFail($id);

        $this->undoService->saveDeleteState('timeline', $event->id);
        session()->put('undo_timeline_last_id', $event->id);

        $event->delete();

        return redirect()->back()->with('success', 'Timeline event deleted successfully.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer|exists:timeline_events,id',
        ]);

        foreach ($request->order as $index => $id) {
            TimelineEvent::where('id', $id)->update(['sort_order' => $index]);
        }

        return redirect()->back()->with('success', 'Timeline events reordered successfully.');
    }
}

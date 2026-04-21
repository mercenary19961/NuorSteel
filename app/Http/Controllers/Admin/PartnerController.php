<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Partner;
use App\Services\UndoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PartnerController extends Controller
{
    public function __construct(
        protected UndoService $undoService,
    ) {}

    public function index(): Response
    {
        $partners = Partner::with('logoMedia')->ordered()->get();

        $lastId = session('undo_partner_last_id');
        $undoMeta = $lastId ? $this->undoService->getUndoMeta('partner', $lastId) : null;

        return Inertia::render('Admin/Partners', [
            'partners' => $partners,
            'undoMeta' => $undoMeta,
            'undoModelId' => $undoMeta ? (string) $lastId : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate($this->rules());

        $logoPath = $this->resolveLogoPath($data['logo_media_id']);

        Partner::create([
            'name_en' => $data['name_en'],
            'name_ar' => $data['name_ar'],
            'logo_media_id' => $data['logo_media_id'],
            'logo_path' => $logoPath,
            'size_tier' => $data['size_tier'] ?? 'md',
            'sort_order' => $data['sort_order'] ?? (Partner::max('sort_order') + 1 ?? 0),
            'is_visible' => $data['is_visible'] ?? true,
        ]);

        return redirect()->back()->with('success', 'Partner added.');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $data = $request->validate($this->rules());

        $partner = Partner::findOrFail($id);
        $logoPath = $this->resolveLogoPath($data['logo_media_id']);

        $partner->update([
            'name_en' => $data['name_en'],
            'name_ar' => $data['name_ar'],
            'logo_media_id' => $data['logo_media_id'],
            'logo_path' => $logoPath,
            'size_tier' => $data['size_tier'] ?? 'md',
            'sort_order' => $data['sort_order'] ?? $partner->sort_order,
            'is_visible' => $data['is_visible'] ?? $partner->is_visible,
        ]);

        return redirect()->back()->with('success', 'Partner updated.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $partner = Partner::findOrFail($id);

        $this->undoService->saveDeleteState('partner', $partner->id);
        session()->put('undo_partner_last_id', $partner->id);

        $partner->delete();

        return redirect()->back()->with('success', 'Partner removed.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:partners,id',
        ]);

        foreach ($request->ids as $index => $id) {
            Partner::where('id', $id)->update(['sort_order' => $index]);
        }

        return redirect()->back()->with('success', 'Order updated.');
    }

    protected function rules(): array
    {
        return [
            'name_en' => 'required|string|max:120',
            'name_ar' => 'required|string|max:120',
            'logo_media_id' => 'required|exists:media,id',
            'size_tier' => 'nullable|in:sm,md,lg,xl',
            'sort_order' => 'nullable|integer',
            'is_visible' => 'boolean',
        ];
    }

    protected function resolveLogoPath(int $mediaId): string
    {
        $media = Media::findOrFail($mediaId);
        return $media->path;
    }
}

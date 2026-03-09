<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Media;
use App\Services\UndoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function __construct(
        protected UndoService $undoService,
    ) {}
    public function index(Request $request): Response
    {
        $query = Certificate::with(['thumbnail', 'fileMedia']);

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $certificates = $query->ordered()->paginate(15);

        $categoryCounts = Certificate::selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category')
            ->toArray();

        $lastId = session('undo_certificate_last_id');
        $undoMeta = $lastId ? $this->undoService->getUndoMeta('certificate', $lastId) : null;

        return Inertia::render('Admin/Certificates/Index', [
            'certificates' => $certificates,
            'filters' => $request->only(['category', 'active']),
            'categoryCounts' => $categoryCounts,
            'undoMeta' => $undoMeta,
            'undoModelId' => $undoMeta ? (string) $lastId : null,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Certificates/Form', [
            'item' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'category' => 'required|in:esg,quality,governance',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'file' => 'required|file|mimes:pdf|mimetypes:application/pdf|max:10240',
            'thumbnail_id' => 'nullable|exists:media,id',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after:issue_date',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $uploadedFile = $request->file('file');
        $filename = Str::random(20) . '.pdf';
        $storagePath = 'media/' . $filename;

        Storage::put($storagePath, file_get_contents($uploadedFile->getRealPath()));

        $media = Media::create([
            'filename' => $filename,
            'original_filename' => $uploadedFile->getClientOriginalName(),
            'path' => $storagePath,
            'mime_type' => 'application/pdf',
            'size' => $uploadedFile->getSize(),
            'alt_text_en' => $request->title_en,
            'folder' => 'certificates',
            'uploaded_by' => Auth::id(),
        ]);

        Certificate::create([
            'title_en' => $request->title_en,
            'title_ar' => $request->title_ar,
            'category' => $request->category,
            'description_en' => $request->description_en,
            'description_ar' => $request->description_ar,
            'file_path' => $storagePath,
            'file_media_id' => $media->id,
            'thumbnail_id' => $request->thumbnail_id,
            'issue_date' => $request->issue_date,
            'expiry_date' => $request->expiry_date,
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $request->input('sort_order', 0),
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
        ]);

        return redirect()->route('admin.certificates.index')->with('success', 'Certificate created successfully.');
    }

    public function edit(int $id): Response
    {
        $certificate = Certificate::with(['thumbnail', 'fileMedia'])->findOrFail($id);

        return Inertia::render('Admin/Certificates/Form', [
            'item' => $certificate,
            'undoMeta' => $this->undoService->getUndoMeta('certificate', $id),
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'category' => 'required|in:esg,quality,governance',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf|mimetypes:application/pdf|max:10240',
            'thumbnail_id' => 'nullable|exists:media,id',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after:issue_date',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $certificate = Certificate::findOrFail($id);

        // Track metadata changes (file_path excluded — old file is deleted on replace)
        $trackedFields = [
            'title_en', 'title_ar', 'category', 'description_en', 'description_ar',
            'thumbnail_id', 'issue_date', 'expiry_date', 'is_active', 'sort_order',
        ];

        $oldData = ['id' => $certificate->id];
        $newData = ['id' => $certificate->id];
        foreach ($trackedFields as $field) {
            $oldData[$field] = (string) ($certificate->$field ?? '');
            $newData[$field] = (string) ($request->input($field) ?? '');
        }

        $this->undoService->saveState('certificate', $certificate->id, $oldData, $newData);

        $data = $request->only([
            'title_en', 'title_ar', 'category', 'description_en', 'description_ar',
            'thumbnail_id', 'issue_date', 'expiry_date', 'is_active', 'sort_order',
        ]);
        $data['updated_by'] = $request->user()->id;

        if ($request->hasFile('file')) {
            // Delete old media record (cascades file deletion via Media::deleting)
            if ($certificate->file_media_id) {
                Media::find($certificate->file_media_id)?->forceDelete();
            } else {
                Storage::delete($certificate->file_path);
            }

            // Create new media record
            $uploadedFile = $request->file('file');
            $filename = Str::random(20) . '.pdf';
            $storagePath = 'media/' . $filename;

            Storage::put($storagePath, file_get_contents($uploadedFile->getRealPath()));

            $media = Media::create([
                'filename' => $filename,
                'original_filename' => $uploadedFile->getClientOriginalName(),
                'path' => $storagePath,
                'mime_type' => 'application/pdf',
                'size' => $uploadedFile->getSize(),
                'alt_text_en' => $request->title_en,
                'folder' => 'certificates',
                'uploaded_by' => Auth::id(),
            ]);

            $data['file_media_id'] = $media->id;
            $data['file_path'] = $storagePath;
        }

        $certificate->update($data);

        return redirect()->back()->with('success', 'Certificate updated successfully.');
    }

    public function viewFile(int $id): mixed
    {
        $certificate = Certificate::findOrFail($id);

        // Prefer media path, fallback to legacy file_path
        $path = $certificate->file_media_id
            ? Media::findOrFail($certificate->file_media_id)->path
            : $certificate->file_path;

        return Storage::response($path, $certificate->title_en . '.pdf', [
            'Content-Type' => 'application/pdf',
        ]);
    }

    public function destroy(int $id): RedirectResponse
    {
        $certificate = Certificate::findOrFail($id);

        $this->undoService->saveDeleteState('certificate', $certificate->id);
        session()->put('undo_certificate_last_id', $certificate->id);

        $certificate->delete();

        return redirect()->route('admin.certificates.index')->with('success', 'Certificate deleted successfully.');
    }
}

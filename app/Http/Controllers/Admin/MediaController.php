<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Media::query();

        if ($request->has('folder')) {
            $query->where('folder', $request->folder);
        }

        if ($request->has('type')) {
            if ($request->type === 'image') {
                $query->where('mime_type', 'like', 'image/%');
            } elseif ($request->type === 'pdf') {
                $query->where('mime_type', 'application/pdf');
            }
        }

        $media = $query->orderByDesc('created_at')->paginate(24);
        $folders = Media::distinct()->pluck('folder');

        return Inertia::render('Admin/Media', [
            'media' => $media,
            'folders' => $folders,
            'filters' => $request->only(['folder', 'type']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,jpg,png,webp,pdf|mimetypes:image/jpeg,image/png,image/webp,application/pdf|max:10240',
            'folder' => ['nullable', 'string', 'max:50', 'regex:/^[a-zA-Z0-9_-]+$/'],
            'alt_text_en' => 'nullable|string|max:255',
            'alt_text_ar' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        $folder = $request->input('folder', 'general');

        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs("media/{$folder}", $filename, 'public');

        Media::create([
            'filename' => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'alt_text_en' => $request->alt_text_en,
            'alt_text_ar' => $request->alt_text_ar,
            'folder' => $folder,
            'uploaded_by' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', 'File uploaded successfully.');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'alt_text_en' => 'nullable|string|max:255',
            'alt_text_ar' => 'nullable|string|max:255',
            'folder' => 'nullable|string|max:50',
        ]);

        $media = Media::findOrFail($id);
        $media->update($request->only(['alt_text_en', 'alt_text_ar', 'folder']));

        return redirect()->back()->with('success', 'Media updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $media = Media::findOrFail($id);
        $media->delete();

        return redirect()->back()->with('success', 'Media deleted successfully.');
    }
}

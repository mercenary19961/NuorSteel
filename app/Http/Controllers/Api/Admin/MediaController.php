<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index(Request $request): JsonResponse
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

        return response()->json([
            'success' => true,
            'data' => $media->items(),
            'meta' => [
                'current_page' => $media->currentPage(),
                'last_page' => $media->lastPage(),
                'per_page' => $media->perPage(),
                'total' => $media->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
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

        $media = Media::create([
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

        return response()->json([
            'success' => true,
            'message' => 'File uploaded successfully.',
            'data' => [
                'id' => $media->id,
                'url' => $media->url,
                'filename' => $media->original_filename,
            ],
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $media = Media::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $media,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'alt_text_en' => 'nullable|string|max:255',
            'alt_text_ar' => 'nullable|string|max:255',
            'folder' => 'nullable|string|max:50',
        ]);

        $media = Media::findOrFail($id);
        $media->update($request->only(['alt_text_en', 'alt_text_ar', 'folder']));

        return response()->json([
            'success' => true,
            'message' => 'Media updated successfully.',
            'data' => $media,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $media = Media::findOrFail($id);
        $media->delete();

        return response()->json([
            'success' => true,
            'message' => 'Media deleted successfully.',
        ]);
    }

    public function folders(): JsonResponse
    {
        $folders = Media::distinct()->pluck('folder');

        return response()->json([
            'success' => true,
            'data' => $folders,
        ]);
    }
}

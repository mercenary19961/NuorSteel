<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Media;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Setting;
use App\Services\UndoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function __construct(
        protected UndoService $undoService,
    ) {}
    public function index(Request $request): Response
    {
        $query = Media::query();

        if ($request->filled('folder')) {
            $query->where('folder', $request->folder);
        }

        if ($request->filled('type')) {
            if ($request->type === 'image') {
                $query->where('mime_type', 'like', 'image/%');
            } elseif ($request->type === 'pdf') {
                $query->where('mime_type', 'application/pdf');
            }
        }

        $media = $query->orderByDesc('created_at')->paginate(24);

        // Single query: folder names + counts
        $folderCounts = Media::selectRaw('folder, count(*) as count')
            ->groupBy('folder')
            ->pluck('count', 'folder');

        $dbFolders = $folderCounts->keys()->toArray();
        $customFolders = $this->getCustomFolders();
        $allFolders = collect(array_unique(array_merge($dbFolders, $customFolders)))
            ->sort()
            ->values()
            ->sortBy(fn ($f) => $f === 'general' ? 0 : 1)
            ->values();

        // Build usage map for the current page of media items
        $mediaIds = $media->pluck('id');

        $usageMap = [];

        // Products using these media as featured image
        $featuredProducts = Product::whereIn('featured_image_id', $mediaIds)
            ->get(['id', 'name_en', 'featured_image_id']);
        foreach ($featuredProducts as $product) {
            $usageMap[$product->featured_image_id][] = [
                'type' => 'Product Featured Image',
                'name' => $product->name_en,
                'url' => "/admin/products/{$product->id}/edit",
            ];
        }

        // Product gallery images using these media
        $galleryImages = ProductImage::whereIn('media_id', $mediaIds)
            ->with('product:id,name_en')
            ->get();
        foreach ($galleryImages as $pi) {
            if ($pi->product) {
                $usageMap[$pi->media_id][] = [
                    'type' => 'Product Gallery',
                    'name' => $pi->product->name_en,
                    'url' => "/admin/products/{$pi->product->id}/edit",
                ];
            }
        }

        // Certificates using these media as file (PDF)
        $certByFile = Certificate::whereIn('file_media_id', $mediaIds)
            ->get(['id', 'title_en', 'file_media_id']);
        foreach ($certByFile as $cert) {
            $usageMap[$cert->file_media_id][] = [
                'type' => 'Certificate PDF',
                'name' => $cert->title_en,
                'url' => "/admin/certificates/{$cert->id}/edit",
            ];
        }

        // Certificates using these media as thumbnail
        $certByThumb = Certificate::whereIn('thumbnail_id', $mediaIds)
            ->get(['id', 'title_en', 'thumbnail_id']);
        foreach ($certByThumb as $cert) {
            $usageMap[$cert->thumbnail_id][] = [
                'type' => 'Certificate Thumbnail',
                'name' => $cert->title_en,
                'url' => "/admin/certificates/{$cert->id}/edit",
            ];
        }

        // Build folder preview map (first media item per folder for thumbnail)
        $folderPreviews = [];
        if (!$request->filled('folder')) {
            $previewItems = Media::selectRaw('MIN(id) as id, folder')
                ->groupBy('folder')
                ->pluck('id', 'folder');

            $previewMedia = Media::whereIn('id', $previewItems->values())
                ->get(['id', 'folder', 'mime_type', 'path'])
                ->keyBy('folder');

            foreach ($previewMedia as $folder => $m) {
                $folderPreviews[$folder] = [
                    'mime_type' => $m->mime_type,
                    'url' => $m->url,
                ];
            }
        }

        // Undo support: check if a media item was recently edited
        $lastEditedId = session('undo_media_last_id');
        $undoMeta = $lastEditedId ? $this->undoService->getUndoMeta('media', $lastEditedId) : null;

        return Inertia::render('Admin/Media', [
            'media' => $media,
            'folders' => $allFolders,
            'folderCounts' => $folderCounts,
            'folderPreviews' => $folderPreviews,
            'filters' => $request->only(['folder', 'type']),
            'mediaUsage' => $usageMap,
            'undoMeta' => $undoMeta,
            'undoModelId' => $undoMeta ? (string) $lastEditedId : null,
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

        $filename = Str::uuid() . '.' . ($file->extension() ?: $file->getClientOriginalExtension());
        $path = $file->storeAs("media/{$folder}", $filename);

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
        $oldFolder = $media->folder;

        $trackedFields = ['alt_text_en', 'alt_text_ar', 'folder'];

        $oldData = ['id' => $media->id];
        $newData = ['id' => $media->id];
        foreach ($trackedFields as $field) {
            $oldData[$field] = (string) ($media->$field ?? '');
            $newData[$field] = (string) ($request->input($field) ?? '');
        }

        $this->undoService->saveState('media', $media->id, $oldData, $newData);
        session()->put('undo_media_last_id', $media->id);

        $media->update($request->only(['alt_text_en', 'alt_text_ar', 'folder']));

        // If the folder changed and the old folder is now empty, preserve it in custom folders
        if ($request->filled('folder') && $request->folder !== $oldFolder) {
            $remaining = Media::where('folder', $oldFolder)->count();
            if ($remaining === 0) {
                $customFolders = $this->getCustomFolders();
                if (!in_array($oldFolder, $customFolders)) {
                    $customFolders[] = $oldFolder;
                    $this->saveCustomFolders($customFolders);
                }
            }
        }

        return redirect()->back()->with('success', 'Media updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $media = Media::findOrFail($id);

        $this->undoService->saveDeleteState('media', $media->id);
        session()->put('undo_media_last_id', $media->id);

        $media->delete();

        return redirect()->back()->with('success', 'Media deleted successfully.');
    }

    /**
     * Soft-delete multiple media items in one shot.
     *
     * Undo intentionally not supported here — the modal confirmation IS the
     * safety net for an explicit bulk action. Items remain soft-deleted in the
     * media table and can be restored from there if needed.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids'   => ['required', 'array', 'min:1', 'max:200'],
            'ids.*' => ['integer'],
        ]);

        $deleted = Media::whereIn('id', $request->input('ids'))->get();
        foreach ($deleted as $media) {
            $media->delete();
        }

        $count = $deleted->count();

        return redirect()->back()->with(
            'success',
            "{$count} " . ($count === 1 ? 'file' : 'files') . ' deleted.',
        );
    }

    public function jsonIndex(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = Media::query();

        if ($request->filled('folder')) {
            $query->where('folder', $request->folder);
        }

        if ($request->filled('type')) {
            if ($request->type === 'image') {
                $query->where('mime_type', 'like', 'image/%');
            } elseif ($request->type === 'pdf') {
                $query->where('mime_type', 'application/pdf');
            }
        }

        if ($request->filled('search')) {
            $search = str_replace(['%', '_'], ['\\%', '\\_'], $request->search);
            $query->where('original_filename', 'like', '%' . $search . '%');
        }

        $media = $query->orderByDesc('created_at')->paginate(24);

        return response()->json([
            'media' => $media,
            'folders' => Media::distinct()->pluck('folder'),
        ]);
    }

    public function storeJson(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,jpg,png,webp,pdf|mimetypes:image/jpeg,image/png,image/webp,application/pdf|max:10240',
            'folder' => ['nullable', 'string', 'max:50', 'regex:/^[a-zA-Z0-9_-]+$/'],
        ]);

        $file = $request->file('file');
        $folder = $request->input('folder', 'general');

        $filename = Str::uuid() . '.' . ($file->extension() ?: $file->getClientOriginalExtension());
        $path = $file->storeAs("media/{$folder}", $filename);

        $media = Media::create([
            'filename' => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'folder' => $folder,
            'uploaded_by' => $request->user()->id,
        ]);

        return response()->json(['media' => $media]);
    }

    public function createFolder(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z0-9_-]+$/'],
        ]);

        $name = $request->input('name');
        $customFolders = $this->getCustomFolders();

        if (!in_array($name, $customFolders)) {
            $customFolders[] = $name;
            $this->saveCustomFolders($customFolders);
        }

        return redirect()->route('admin.media.index', ['folder' => $name])
            ->with('success', "Folder \"{$name}\" created.");
    }

    public function renameFolder(Request $request): RedirectResponse
    {
        $request->validate([
            'old_name' => ['required', 'string', 'max:50'],
            'new_name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z0-9_-]+$/'],
        ]);

        $oldName = $request->input('old_name');
        $newName = $request->input('new_name');

        if ($oldName === 'general') {
            return redirect()->back()->with('error', 'The "general" folder cannot be renamed.');
        }

        if ($oldName === $newName) {
            return redirect()->back();
        }

        // Update all media records in this folder
        Media::where('folder', $oldName)->update(['folder' => $newName]);

        // Update custom folders list
        $customFolders = $this->getCustomFolders();
        $customFolders = array_map(fn ($f) => $f === $oldName ? $newName : $f, $customFolders);
        // Also add new name if old wasn't in custom list (was DB-derived)
        if (!in_array($newName, $customFolders)) {
            $customFolders[] = $newName;
        }
        $this->saveCustomFolders($customFolders);

        return redirect()->route('admin.media.index', ['folder' => $newName])
            ->with('success', "Folder renamed to \"{$newName}\".");
    }

    public function deleteFolder(Request $request): RedirectResponse
    {
        $request->validate([
            'name'         => ['required', 'string'],
            'delete_files' => ['nullable', 'boolean'],
        ]);

        $name = $request->input('name');
        $deleteFiles = $request->boolean('delete_files');

        if ($name === 'general') {
            return redirect()->back()->with('error', 'The "general" folder cannot be deleted.');
        }

        if ($deleteFiles) {
            // Soft-delete every file in this folder. Caller has already
            // type-confirmed the folder name in the UI, so this is opt-in.
            $files = Media::where('folder', $name)->get();
            $deletedCount = $files->count();
            foreach ($files as $media) {
                $media->delete();
            }
            $message = "Folder \"{$name}\" deleted along with {$deletedCount} "
                . ($deletedCount === 1 ? 'file' : 'files') . '.';
        } else {
            // Default behaviour: move files to "general" so they aren't lost.
            Media::where('folder', $name)->update(['folder' => 'general']);
            $message = "Folder \"{$name}\" deleted. Files moved to \"general\".";
        }

        // Remove from custom folders list
        $customFolders = array_filter($this->getCustomFolders(), fn ($f) => $f !== $name);
        $this->saveCustomFolders(array_values($customFolders));

        return redirect()->route('admin.media.index')->with('success', $message);
    }

    /**
     * @return string[]
     */
    private function getCustomFolders(): array
    {
        $setting = Setting::where('key', 'media_custom_folders')->first();
        if (!$setting || !$setting->value) {
            return [];
        }

        $decoded = json_decode($setting->value, true);
        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @param string[] $folders
     */
    private function saveCustomFolders(array $folders): void
    {
        Setting::updateOrCreate(
            ['key' => 'media_custom_folders'],
            [
                'value' => json_encode(array_values(array_unique($folders))),
                'type' => 'text',
                'group' => 'media',
            ]
        );
    }
}

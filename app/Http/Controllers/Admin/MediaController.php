<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Setting;
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

        // Merge DB-derived folders with custom (empty) folders from settings
        $dbFolders = Media::distinct()->pluck('folder')->toArray();
        $customFolders = $this->getCustomFolders();
        $allFolders = collect(array_unique(array_merge($dbFolders, $customFolders)))
            ->sort()
            ->values()
            ->sortBy(fn ($f) => $f === 'general' ? 0 : 1)
            ->values();

        $folderCounts = Media::selectRaw('folder, count(*) as count')
            ->groupBy('folder')
            ->pluck('count', 'folder');

        return Inertia::render('Admin/Media', [
            'media' => $media,
            'folders' => $allFolders,
            'folderCounts' => $folderCounts,
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
        $media->delete();

        return redirect()->back()->with('success', 'Media deleted successfully.');
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
            $query->where('original_filename', 'like', '%' . $request->search . '%');
        }

        $media = $query->orderByDesc('created_at')->paginate(24);
        $folders = Media::distinct()->pluck('folder');

        return response()->json([
            'media' => $media,
            'folders' => $folders,
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

        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
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
            'name' => ['required', 'string'],
        ]);

        $name = $request->input('name');

        if ($name === 'general') {
            return redirect()->back()->with('error', 'The "general" folder cannot be deleted.');
        }

        // Move any files in this folder to "general"
        Media::where('folder', $name)->update(['folder' => 'general']);

        // Remove from custom folders list
        $customFolders = array_filter($this->getCustomFolders(), fn ($f) => $f !== $name);
        $this->saveCustomFolders(array_values($customFolders));

        return redirect()->route('admin.media.index')
            ->with('success', "Folder \"{$name}\" deleted. Files moved to \"general\".");
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

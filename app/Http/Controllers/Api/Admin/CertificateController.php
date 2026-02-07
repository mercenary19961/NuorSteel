<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Certificate::with('thumbnail');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $certificates = $query->ordered()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $certificates->items(),
            'meta' => [
                'current_page' => $certificates->currentPage(),
                'last_page' => $certificates->lastPage(),
                'per_page' => $certificates->perPage(),
                'total' => $certificates->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
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

        $filePath = $request->file('file')->store('certificates', 'public');

        $certificate = Certificate::create([
            'title_en' => $request->title_en,
            'title_ar' => $request->title_ar,
            'category' => $request->category,
            'description_en' => $request->description_en,
            'description_ar' => $request->description_ar,
            'file_path' => $filePath,
            'thumbnail_id' => $request->thumbnail_id,
            'issue_date' => $request->issue_date,
            'expiry_date' => $request->expiry_date,
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $request->input('sort_order', 0),
            'created_by' => $request->user()->id,
            'updated_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Certificate created successfully.',
            'data' => $certificate,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $certificate = Certificate::with('thumbnail')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $certificate,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
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

        $data = $request->except('file');
        $data['updated_by'] = $request->user()->id;

        if ($request->hasFile('file')) {
            // Delete old file
            Storage::disk('public')->delete($certificate->file_path);
            // Store new file
            $data['file_path'] = $request->file('file')->store('certificates', 'public');
        }

        $certificate->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Certificate updated successfully.',
            'data' => $certificate,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $certificate = Certificate::findOrFail($id);

        // Delete the file
        Storage::disk('public')->delete($certificate->file_path);

        $certificate->delete();

        return response()->json([
            'success' => true,
            'message' => 'Certificate deleted successfully.',
        ]);
    }
}

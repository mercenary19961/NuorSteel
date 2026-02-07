<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Certificate::with('thumbnail');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $certificates = $query->ordered()->paginate(15);

        return Inertia::render('Admin/Certificates/Index', [
            'certificates' => $certificates,
            'filters' => $request->only(['category', 'active']),
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

        $filePath = $request->file('file')->store('certificates', 'public');

        Certificate::create([
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

        return redirect()->route('admin.certificates.index')->with('success', 'Certificate created successfully.');
    }

    public function edit(int $id): Response
    {
        $certificate = Certificate::with('thumbnail')->findOrFail($id);

        return Inertia::render('Admin/Certificates/Form', [
            'item' => $certificate,
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

        $data = $request->except('file');
        $data['updated_by'] = $request->user()->id;

        if ($request->hasFile('file')) {
            // Delete old file
            Storage::disk('public')->delete($certificate->file_path);
            // Store new file
            $data['file_path'] = $request->file('file')->store('certificates', 'public');
        }

        $certificate->update($data);

        return redirect()->back()->with('success', 'Certificate updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $certificate = Certificate::findOrFail($id);

        // Delete the file
        Storage::disk('public')->delete($certificate->file_path);

        $certificate->delete();

        return redirect()->route('admin.certificates.index')->with('success', 'Certificate deleted successfully.');
    }
}

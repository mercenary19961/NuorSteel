<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CareerListing;
use App\Models\CareerApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class CareerController extends Controller
{
    // Career Listings
    public function index(Request $request): JsonResponse
    {
        $query = CareerListing::withCount('applications');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $listings = $query->ordered()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $listings->items(),
            'meta' => [
                'current_page' => $listings->currentPage(),
                'last_page' => $listings->lastPage(),
                'per_page' => $listings->perPage(),
                'total' => $listings->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:career_listings,slug',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'requirements_en' => 'nullable|string',
            'requirements_ar' => 'nullable|string',
            'location' => 'nullable|string|max:100',
            'employment_type' => 'required|in:full-time,part-time,contract',
            'status' => 'required|in:draft,open,closed',
            'expires_at' => 'nullable|date',
        ]);

        $data = $request->only([
            'title_en', 'title_ar', 'slug', 'description_en', 'description_ar',
            'requirements_en', 'requirements_ar', 'location', 'employment_type',
            'status', 'expires_at',
        ]);
        $data['slug'] = $data['slug'] ?? Str::slug($data['title_en']);
        $data['created_by'] = $request->user()->id;
        $data['updated_by'] = $request->user()->id;

        $listing = CareerListing::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Job listing created successfully.',
            'data' => $listing,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $listing = CareerListing::withCount('applications')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $listing,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:career_listings,slug,' . $id,
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'requirements_en' => 'nullable|string',
            'requirements_ar' => 'nullable|string',
            'location' => 'nullable|string|max:100',
            'employment_type' => 'required|in:full-time,part-time,contract',
            'status' => 'required|in:draft,open,closed',
            'expires_at' => 'nullable|date',
        ]);

        $listing = CareerListing::findOrFail($id);

        $data = $request->only([
            'title_en', 'title_ar', 'slug', 'description_en', 'description_ar',
            'requirements_en', 'requirements_ar', 'location', 'employment_type',
            'status', 'expires_at',
        ]);
        $data['updated_by'] = $request->user()->id;

        $listing->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Job listing updated successfully.',
            'data' => $listing,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $listing = CareerListing::findOrFail($id);
        $listing->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job listing deleted successfully.',
        ]);
    }

    // Applications
    public function applications(Request $request): JsonResponse
    {
        $query = CareerApplication::with('careerListing');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('listing_id')) {
            $query->where('career_listing_id', $request->listing_id);
        }

        if ($request->boolean('open_only')) {
            $query->openApplications();
        }

        $applications = $query->ordered()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $applications->items(),
            'meta' => [
                'current_page' => $applications->currentPage(),
                'last_page' => $applications->lastPage(),
                'per_page' => $applications->perPage(),
                'total' => $applications->total(),
            ],
        ]);
    }

    public function showApplication(int $id): JsonResponse
    {
        $application = CareerApplication::with(['careerListing', 'reviewedBy'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $application,
        ]);
    }

    public function updateApplication(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:new,reviewed,shortlisted,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        $application = CareerApplication::findOrFail($id);
        $application->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
            'reviewed_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application updated successfully.',
            'data' => $application,
        ]);
    }

    public function downloadCv(int $id): mixed
    {
        $application = CareerApplication::findOrFail($id);

        return response()->download(
            storage_path('app/' . $application->cv_path),
            $application->name . '_CV.pdf'
        );
    }

    public function deleteApplication(int $id): JsonResponse
    {
        $application = CareerApplication::findOrFail($id);

        // Delete CV file
        Storage::disk('local')->delete($application->cv_path);

        $application->delete();

        return response()->json([
            'success' => true,
            'message' => 'Application deleted successfully.',
        ]);
    }
}

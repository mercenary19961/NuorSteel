<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CareerListing;
use App\Models\CareerApplication;
use App\Services\UndoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CareerController extends Controller
{
    public function __construct(
        protected UndoService $undoService,
    ) {}
    public function index(Request $request): Response
    {
        $query = CareerListing::withCount('applications');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $lastId = session('undo_career_last_id');
        $undoMeta = $lastId ? $this->undoService->getUndoMeta('career', $lastId) : null;

        return Inertia::render('Admin/Careers/Index', [
            'listings' => $query->ordered()->paginate(15)->withQueryString(),
            'filters' => $request->only(['status']),
            'undoMeta' => $undoMeta,
            'undoModelId' => $undoMeta ? (string) $lastId : null,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Careers/Form', [
            'item' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
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

        CareerListing::create($data);

        return redirect()->route('admin.careers.index')->with('success', 'Job listing created successfully.');
    }

    public function edit(int $id): Response
    {
        $listing = CareerListing::withCount('applications')->findOrFail($id);

        return Inertia::render('Admin/Careers/Form', [
            'item' => $listing,
            'undoMeta' => $this->undoService->getUndoMeta('career', $id),
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
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

        $trackedFields = [
            'title_en', 'title_ar', 'description_en', 'description_ar',
            'requirements_en', 'requirements_ar', 'location', 'employment_type',
            'status', 'expires_at',
        ];

        $oldData = ['id' => $listing->id];
        $newData = ['id' => $listing->id];
        foreach ($trackedFields as $field) {
            $oldData[$field] = (string) ($listing->$field ?? '');
            $newData[$field] = (string) ($request->input($field) ?? '');
        }

        $data = $request->only(array_merge($trackedFields, ['slug']));
        $data['updated_by'] = $request->user()->id;

        $hasChanges = $this->undoService->saveState('career', $listing->id, $oldData, $newData);

        if (!$hasChanges) {
            return redirect()->back()->with('success', 'No changes detected.');
        }

        $listing->update($data);

        return redirect()->back()->with('success', 'Job listing updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $listing = CareerListing::findOrFail($id);

        $this->undoService->saveDeleteState('career', $listing->id);
        session()->put('undo_career_last_id', $listing->id);

        $listing->delete();

        return redirect()->route('admin.careers.index')->with('success', 'Job listing deleted successfully.');
    }

    // Applications
    public function applications(Request $request): Response
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

        // Undo support: check if an application was recently updated
        $lastEditedId = session('undo_application_last_id');
        $undoMeta = $lastEditedId ? $this->undoService->getUndoMeta('application', $lastEditedId) : null;

        return Inertia::render('Admin/Applications', [
            'applications' => $query->ordered()->paginate(15)->withQueryString(),
            'filters' => $request->only(['status', 'listing_id', 'open_only']),
            'undoMeta' => $undoMeta,
            'undoModelId' => $undoMeta ? (string) $lastEditedId : null,
        ]);
    }

    public function updateApplication(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:new,reviewed,shortlisted,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        $application = CareerApplication::findOrFail($id);

        $oldData = [
            'id' => $application->id,
            'status' => (string) ($application->status ?? ''),
            'admin_notes' => (string) ($application->admin_notes ?? ''),
        ];
        $newData = [
            'id' => $application->id,
            'status' => (string) ($request->status ?? ''),
            'admin_notes' => (string) ($request->admin_notes ?? ''),
        ];

        $this->undoService->saveState('application', $application->id, $oldData, $newData);
        session()->put('undo_application_last_id', $application->id);

        $application->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
            'reviewed_by' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', 'Application updated successfully.');
    }

    public function downloadCv(int $id): mixed
    {
        $application = CareerApplication::findOrFail($id);

        return Storage::download($application->cv_path, $application->name . '_CV.pdf');
    }

    public function deleteApplication(int $id): RedirectResponse
    {
        $application = CareerApplication::findOrFail($id);

        $this->undoService->saveDeleteState('application', $application->id);
        session()->put('undo_application_last_id', $application->id);

        $application->delete();

        return redirect()->back()->with('success', 'Application deleted successfully.');
    }
}

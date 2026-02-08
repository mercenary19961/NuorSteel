<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\CareerListing;
use App\Models\CareerApplication;
use App\Models\SiteContent;
use App\Models\Setting;
use App\Mail\CareerApplicationReceived;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class CareerController extends Controller
{
    public function index(): Response
    {
        $locale = session('locale', 'en');

        $listings = CareerListing::open()
            ->ordered()
            ->get()
            ->map(fn($listing) => [
                'id' => $listing->id,
                'title' => $listing->title,
                'slug' => $listing->slug,
                'location' => $listing->location,
                'employment_type' => $listing->employment_type,
                'expires_at' => $listing->expires_at?->format('Y-m-d'),
                'created_at' => $listing->created_at->format('Y-m-d'),
            ]);

        return Inertia::render('Public/Career', [
            'content' => SiteContent::getPage('career', $locale),
            'listings' => $listings,
        ]);
    }

    public function show(string $slug): Response
    {
        $listing = CareerListing::where('slug', $slug)
            ->open()
            ->firstOrFail();

        return Inertia::render('Public/JobDetail', [
            'job' => [
                'id' => $listing->id,
                'title' => $listing->title,
                'title_en' => $listing->title_en,
                'title_ar' => $listing->title_ar,
                'slug' => $listing->slug,
                'description' => $listing->description,
                'requirements' => $listing->requirements,
                'location' => $listing->location,
                'employment_type' => $listing->employment_type,
                'expires_at' => $listing->expires_at?->format('Y-m-d'),
                'created_at' => $listing->created_at->format('Y-m-d'),
            ],
        ]);
    }

    public function apply(Request $request, ?string $slug = null)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'job_title' => 'required|string|max:255',
            'cv' => 'required|file|mimes:pdf|mimetypes:application/pdf|max:5120',
        ]);

        $listing = null;
        if ($slug) {
            $listing = CareerListing::where('slug', $slug)->open()->first();
            if (!$listing) {
                return back()->with('error', 'Job listing not found or no longer accepting applications.');
            }
        }

        $cvPath = $request->file('cv')->store('cvs');

        $application = CareerApplication::create([
            'career_listing_id' => $listing?->id,
            'name' => trim(strip_tags($request->name)),
            'email' => trim($request->email),
            'phone' => trim(strip_tags($request->phone)),
            'job_title' => trim(strip_tags($request->job_title)),
            'cv_path' => $cvPath,
        ]);

        $this->sendApplicationNotification($application, $listing);

        return back()->with('success', 'Your application has been submitted successfully.');
    }

    private function sendApplicationNotification(CareerApplication $application, ?CareerListing $listing): void
    {
        try {
            $recipients = Setting::get('career_recipients', 'careers@nuorsteel.com,hr@nuorsteel.com');
            $emails = array_map('trim', explode(',', $recipients));

            Mail::to($emails)->send(new CareerApplicationReceived($application, $listing));
        } catch (\Throwable $e) {
            Log::error('Failed to send career application notification email', [
                'application_id' => $application->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}

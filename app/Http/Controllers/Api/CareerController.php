<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CareerListing;
use App\Models\CareerApplication;
use App\Models\SiteContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Models\Setting;

class CareerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $locale = $request->header('Accept-Language', 'en');

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

        return response()->json([
            'success' => true,
            'data' => [
                'content' => SiteContent::getPage('career', $locale),
                'listings' => $listings,
            ],
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $listing = CareerListing::where('slug', $slug)
            ->open()
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
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

    public function apply(Request $request, ?string $slug = null): JsonResponse
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
                return response()->json([
                    'success' => false,
                    'message' => 'Job listing not found or no longer accepting applications.',
                ], 404);
            }
        }

        $cvPath = $request->file('cv')->store('cvs', 'local');

        $application = CareerApplication::create([
            'career_listing_id' => $listing?->id,
            'name' => trim(strip_tags($request->name)),
            'email' => trim($request->email),
            'phone' => trim(strip_tags($request->phone)),
            'job_title' => trim(strip_tags($request->job_title)),
            'cv_path' => $cvPath,
        ]);

        // Send notification email
        $this->sendApplicationNotification($application, $listing);

        return response()->json([
            'success' => true,
            'message' => 'Your application has been submitted successfully.',
            'data' => [
                'id' => $application->id,
            ],
        ], 201);
    }

    private function sendApplicationNotification(CareerApplication $application, ?CareerListing $listing): void
    {
        $recipients = Setting::get('career_recipients', 'careers@nuorsteel.com,hr@nuorsteel.com');
        $emails = array_map('trim', explode(',', $recipients));

        // In production, you would send an actual email here
        // Mail::to($emails)->send(new CareerApplicationReceived($application, $listing));
    }
}

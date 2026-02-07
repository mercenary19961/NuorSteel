<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CareerApplication;
use App\Models\ContactSubmission;
use App\Models\NewsletterSubscriber;
use App\Models\Product;
use App\Models\CareerListing;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'products' => Product::count(),
                    'active_products' => Product::active()->count(),
                    'open_jobs' => CareerListing::open()->count(),
                    'new_applications' => CareerApplication::new()->count(),
                    'unread_contacts' => ContactSubmission::unread()->notArchived()->count(),
                    'newsletter_subscribers' => NewsletterSubscriber::active()->count(),
                ],
                'recent_applications' => CareerApplication::with('careerListing')
                    ->ordered()
                    ->limit(5)
                    ->get()
                    ->map(fn($a) => [
                        'id' => $a->id,
                        'name' => $a->name,
                        'email' => $a->email,
                        'job_title' => $a->job_title,
                        'listing_title' => $a->careerListing?->title_en,
                        'status' => $a->status,
                        'created_at' => $a->created_at->format('Y-m-d H:i'),
                    ]),
                'recent_contacts' => ContactSubmission::notArchived()
                    ->ordered()
                    ->limit(5)
                    ->get()
                    ->map(fn($c) => [
                        'id' => $c->id,
                        'name' => $c->name,
                        'company' => $c->company,
                        'subject' => $c->subject,
                        'request_type' => $c->request_type,
                        'is_read' => $c->is_read,
                        'created_at' => $c->created_at->format('Y-m-d H:i'),
                    ]),
            ],
        ]);
    }
}

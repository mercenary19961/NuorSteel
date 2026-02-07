<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use App\Models\Setting;
use App\Models\Product;
use App\Models\Certificate;
use App\Models\TimelineEvent;
use App\Models\CareerListing;
use App\Models\LinkedinCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function home(Request $request): JsonResponse
    {
        $locale = $request->header('Accept-Language', 'en');

        return response()->json([
            'success' => true,
            'data' => [
                'content' => SiteContent::getPage('home', $locale),
                'featured_products' => Product::active()
                    ->featured()
                    ->ordered()
                    ->with('featuredImage')
                    ->limit(4)
                    ->get()
                    ->map(fn($p) => [
                        'id' => $p->id,
                        'name' => $p->name,
                        'slug' => $p->slug,
                        'short_description' => $p->short_description,
                        'image' => $p->featuredImage?->url,
                    ]),
                'certificates' => Certificate::active()
                    ->ordered()
                    ->with('thumbnail')
                    ->limit(8)
                    ->get()
                    ->map(fn($c) => [
                        'id' => $c->id,
                        'title' => $c->title,
                        'category' => $c->category,
                        'thumbnail' => $c->thumbnail?->url,
                    ]),
                'linkedin_posts' => LinkedinCache::getLatestPosts(5),
            ],
        ]);
    }

    public function about(Request $request): JsonResponse
    {
        $locale = $request->header('Accept-Language', 'en');

        return response()->json([
            'success' => true,
            'data' => [
                'content' => SiteContent::getPage('about', $locale),
                'timeline' => TimelineEvent::ordered()
                    ->with('image')
                    ->get()
                    ->map(fn($t) => [
                        'id' => $t->id,
                        'year' => $t->year,
                        'title' => $t->title,
                        'description' => $t->description,
                        'image' => $t->image?->url,
                    ]),
                'governance' => Certificate::active()
                    ->governance()
                    ->ordered()
                    ->get()
                    ->map(fn($c) => [
                        'id' => $c->id,
                        'title' => $c->title,
                        'file_url' => $c->file_url,
                    ]),
            ],
        ]);
    }

    public function recycling(Request $request): JsonResponse
    {
        $locale = $request->header('Accept-Language', 'en');

        return response()->json([
            'success' => true,
            'data' => [
                'content' => SiteContent::getPage('recycling', $locale),
            ],
        ]);
    }

    public function quality(Request $request): JsonResponse
    {
        $locale = $request->header('Accept-Language', 'en');

        return response()->json([
            'success' => true,
            'data' => [
                'content' => SiteContent::getPage('quality', $locale),
                'certificates' => Certificate::active()
                    ->quality()
                    ->ordered()
                    ->with('thumbnail')
                    ->get()
                    ->map(fn($c) => [
                        'id' => $c->id,
                        'title' => $c->title,
                        'description' => $c->description,
                        'file_url' => $c->file_url,
                        'thumbnail' => $c->thumbnail?->url,
                        'issue_date' => $c->issue_date?->format('Y-m-d'),
                        'expiry_date' => $c->expiry_date?->format('Y-m-d'),
                    ]),
            ],
        ]);
    }

    public function certificates(Request $request): JsonResponse
    {
        $locale = $request->header('Accept-Language', 'en');

        return response()->json([
            'success' => true,
            'data' => [
                'content' => SiteContent::getPage('certificates', $locale),
                'esg' => Certificate::active()
                    ->esg()
                    ->ordered()
                    ->with('thumbnail')
                    ->get()
                    ->map(fn($c) => $this->formatCertificate($c)),
                'quality' => Certificate::active()
                    ->quality()
                    ->ordered()
                    ->with('thumbnail')
                    ->get()
                    ->map(fn($c) => $this->formatCertificate($c)),
                'governance' => Certificate::active()
                    ->governance()
                    ->ordered()
                    ->with('thumbnail')
                    ->get()
                    ->map(fn($c) => $this->formatCertificate($c)),
            ],
        ]);
    }

    public function contact(Request $request): JsonResponse
    {
        $locale = $request->header('Accept-Language', 'en');

        return response()->json([
            'success' => true,
            'data' => [
                'content' => SiteContent::getPage('contact', $locale),
                'settings' => [
                    'phone' => Setting::get('company_phone'),
                    'email' => Setting::get('company_email'),
                    'address' => Setting::get($locale === 'ar' ? 'company_address_ar' : 'company_address_en'),
                ],
            ],
        ]);
    }

    public function settings(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'company_name_en' => Setting::get('company_name_en'),
                'company_name_ar' => Setting::get('company_name_ar'),
                'company_phone' => Setting::get('company_phone'),
                'company_email' => Setting::get('company_email'),
                'linkedin_url' => Setting::get('linkedin_url'),
            ],
        ]);
    }

    private function formatCertificate(Certificate $certificate): array
    {
        return [
            'id' => $certificate->id,
            'title' => $certificate->title,
            'description' => $certificate->description,
            'file_url' => $certificate->file_url,
            'thumbnail' => $certificate->thumbnail?->url,
            'issue_date' => $certificate->issue_date?->format('Y-m-d'),
            'expiry_date' => $certificate->expiry_date?->format('Y-m-d'),
        ];
    }
}

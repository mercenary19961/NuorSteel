<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use App\Models\Product;
use App\Models\Certificate;
use App\Models\LinkedinCache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/Home', [
            'content_en' => SiteContent::getPage('home', 'en'),
            'content_ar' => SiteContent::getPage('home', 'ar'),
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
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\CareerListing;
use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $now = now()->toAtomString();

        $urls = [
            ['loc' => route('home'),          'lastmod' => $now, 'changefreq' => 'weekly',  'priority' => '1.0'],
            ['loc' => route('about'),         'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => route('products.index'),'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.9'],
            ['loc' => route('quality'),       'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => route('sustainability'),'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => route('career.index'),  'lastmod' => $now, 'changefreq' => 'weekly',  'priority' => '0.8'],
            ['loc' => route('contact'),       'lastmod' => $now, 'changefreq' => 'yearly',  'priority' => '0.6'],
        ];

        Product::active()->ordered()->get(['slug', 'updated_at'])->each(function ($product) use (&$urls) {
            $urls[] = [
                'loc' => route('products.show', ['slug' => $product->slug]),
                'lastmod' => $product->updated_at?->toAtomString() ?? now()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ];
        });

        CareerListing::open()->ordered()->get(['slug', 'updated_at'])->each(function ($listing) use (&$urls) {
            $urls[] = [
                'loc' => route('career.show', ['slug' => $listing->slug]),
                'lastmod' => $listing->updated_at?->toAtomString() ?? now()->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.6',
            ];
        });

        return response()
            ->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml; charset=utf-8');
    }
}

<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use App\Models\Certificate;
use Inertia\Inertia;
use Inertia\Response;

class QualityController extends Controller
{
    public function index(): Response
    {
        $locale = session('locale', 'en');

        return Inertia::render('Public/Quality', [
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
        ]);
    }
}

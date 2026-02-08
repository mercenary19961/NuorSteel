<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use App\Models\Certificate;
use App\Models\TimelineEvent;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function index(): Response
    {
        $locale = session('locale', 'en');

        return Inertia::render('Public/About', [
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
        ]);
    }

    public function recycling(): Response
    {
        $locale = session('locale', 'en');

        return Inertia::render('Public/Recycling', [
            'content' => SiteContent::getPage('recycling', $locale),
        ]);
    }
}

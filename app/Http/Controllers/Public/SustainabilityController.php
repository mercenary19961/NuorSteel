<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Inertia\Inertia;
use Inertia\Response;

class SustainabilityController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/Sustainability', [
            'content_en' => SiteContent::getPage('sustainability', 'en'),
            'content_ar' => SiteContent::getPage('sustainability', 'ar'),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class SustainabilityController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/Sustainability');
    }
}

<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    public function switch(Request $request, string $locale)
    {
        if (!in_array($locale, ['en', 'ar'])) {
            $locale = 'en';
        }

        session(['locale' => $locale]);
        app()->setLocale($locale);

        if ($request->wantsJson()) {
            return response()->json(['locale' => $locale]);
        }

        return back();
    }
}

<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        NewsletterSubscriber::subscribe(
            $request->email,
            $request->input('source', 'website')
        );

        return back()->with('success', 'Thank you for subscribing to our newsletter!');
    }
}

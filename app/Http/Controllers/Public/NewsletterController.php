<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use App\Services\TurnstileVerifier;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class NewsletterController extends Controller
{
    public function __construct(private TurnstileVerifier $turnstile)
    {
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
            'cf-turnstile-response' => 'nullable|string',
        ]);

        if (!$this->turnstile->verify($request->input('cf-turnstile-response'), $request->ip())) {
            throw ValidationException::withMessages([
                'cf-turnstile-response' => ['Bot check failed. Please reload the page and try again.'],
            ]);
        }

        NewsletterSubscriber::subscribe(
            trim($request->email),
            'website'
        );

        return back()->with('success', 'Thank you for subscribing to our newsletter!');
    }
}

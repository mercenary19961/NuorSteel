<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $subscriber = NewsletterSubscriber::subscribe(
            $request->email,
            $request->input('source', 'website')
        );

        return response()->json([
            'success' => true,
            'message' => 'Thank you for subscribing to our newsletter!',
        ], 201);
    }

    public function unsubscribe(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:newsletter_subscribers,email',
        ]);

        $subscriber = NewsletterSubscriber::where('email', $request->email)->first();
        $subscriber?->unsubscribe();

        return response()->json([
            'success' => true,
            'message' => 'You have been unsubscribed successfully.',
        ]);
    }
}

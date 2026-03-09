<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class MediaServeController extends Controller
{
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
        'application/pdf',
    ];

    public function show(int $id): Response
    {
        $media = Media::findOrFail($id);

        if (!in_array($media->mime_type, self::ALLOWED_MIME_TYPES, true)) {
            abort(403);
        }

        if (!Storage::exists($media->path)) {
            abort(404);
        }

        return response()->file(
            Storage::path($media->path),
            [
                'Content-Type' => $media->mime_type,
                'Cache-Control' => 'public, max-age=86400',
                'X-Content-Type-Options' => 'nosniff',
            ]
        );
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class MediaServeController extends Controller
{
    public function show(int $id): Response
    {
        $media = Media::findOrFail($id);

        if (!Storage::exists($media->path)) {
            abort(404);
        }

        return response()->file(
            Storage::path($media->path),
            [
                'Content-Type' => $media->mime_type,
                'Cache-Control' => 'public, max-age=31536000, immutable',
            ]
        );
    }
}

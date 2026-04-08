<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Railway's filesystem is ephemeral — files created by previous migrations
 * (random-named copies in media/) are lost on each deploy. This migration
 * rewrites media paths to point to git-tracked files that always exist:
 *
 * - Product images  → media/tmt-bars-product.png, media/billets-product.png
 * - Certificate PDFs → certificates/{original-filename}.pdf
 */
return new class extends Migration
{
    public function up(): void
    {
        // ============================================================
        // 1. Fix product media → deterministic filenames (git-tracked)
        // ============================================================
        $productMedia = [
            'tmt-bars.png'  => ['filename' => 'tmt-bars-product.png',  'path' => 'media/tmt-bars-product.png'],
            'billets.png'   => ['filename' => 'billets-product.png',   'path' => 'media/billets-product.png'],
        ];

        foreach ($productMedia as $originalFilename => $newData) {
            DB::table('media')
                ->where('original_filename', $originalFilename)
                ->where('folder', 'products')
                ->whereNull('deleted_at')
                ->update([
                    'filename' => $newData['filename'],
                    'path'     => $newData['path'],
                ]);
        }

        // ============================================================
        // 2. Fix certificate media → point to git-tracked PDFs
        // ============================================================
        $certMedia = DB::table('media')
            ->where('folder', 'certificates')
            ->where('mime_type', 'application/pdf')
            ->whereNull('deleted_at')
            ->get();

        foreach ($certMedia as $media) {
            // original_filename is e.g. "saudi-made-certificate.pdf"
            $gitTrackedPath = 'certificates/' . $media->original_filename;

            DB::table('media')
                ->where('id', $media->id)
                ->update([
                    'filename' => $media->original_filename,
                    'path'     => $gitTrackedPath,
                ]);
        }
    }

    public function down(): void
    {
        // No-op: paths will remain updated
    }
};

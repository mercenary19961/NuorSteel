<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Storage::makeDirectory('media');

        $certificates = DB::table('certificates')->whereNull('file_media_id')->get();

        foreach ($certificates as $cert) {
            $originalFilename = basename($cert->file_path);

            // Check if a media record already exists (e.g., from DemoContentSeeder)
            $media = DB::table('media')
                ->where('original_filename', $originalFilename)
                ->where('folder', 'certificates')
                ->whereNull('deleted_at')
                ->first();

            $mediaId = $media?->id;

            if (!$mediaId && Storage::exists($cert->file_path)) {
                // Create media record + copy file to media/ folder
                $newFilename = Str::random(20) . '.pdf';
                $newPath = 'media/' . $newFilename;

                Storage::copy($cert->file_path, $newPath);

                $mediaId = DB::table('media')->insertGetId([
                    'filename' => $newFilename,
                    'original_filename' => $originalFilename,
                    'path' => $newPath,
                    'mime_type' => 'application/pdf',
                    'size' => Storage::size($cert->file_path),
                    'alt_text_en' => $cert->title_en,
                    'alt_text_ar' => $cert->title_ar,
                    'folder' => 'certificates',
                    'created_at' => now(),
                ]);
            }

            if ($mediaId) {
                DB::table('certificates')
                    ->where('id', $cert->id)
                    ->update(['file_media_id' => $mediaId]);
            }
        }
    }

    public function down(): void
    {
        // Reverse: clear file_media_id on all certificates
        DB::table('certificates')->update(['file_media_id' => null]);
    }
};

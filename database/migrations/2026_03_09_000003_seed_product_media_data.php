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

        $products = [
            ['slug' => 'tmt-bars', 'source' => 'products/tmt-bars-desktop.png', 'original' => 'tmt-bars.png', 'alt_en' => 'TMT reinforcement steel bars', 'alt_ar' => 'قضبان حديد التسليح'],
            ['slug' => 'billets', 'source' => 'products/billets-desktop.png', 'original' => 'billets.png', 'alt_en' => 'Steel billets', 'alt_ar' => 'كتل الصلب'],
        ];

        foreach ($products as $product) {
            // Skip if product already has a valid featured image
            $existing = DB::table('products')
                ->where('slug', $product['slug'])
                ->first();

            if (!$existing) {
                continue;
            }

            if ($existing->featured_image_id) {
                $mediaExists = DB::table('media')
                    ->where('id', $existing->featured_image_id)
                    ->whereNull('deleted_at')
                    ->exists();

                if ($mediaExists) {
                    continue; // Already has a valid featured image
                }
            }

            // Create media record from public image
            $sourcePath = public_path('images/' . $product['source']);
            if (!file_exists($sourcePath)) {
                continue;
            }

            $filename = Str::random(20) . '.png';
            $storagePath = 'media/' . $filename;

            Storage::put($storagePath, file_get_contents($sourcePath));

            $mediaId = DB::table('media')->insertGetId([
                'filename' => $filename,
                'original_filename' => $product['original'],
                'path' => $storagePath,
                'mime_type' => 'image/png',
                'size' => filesize($sourcePath),
                'alt_text_en' => $product['alt_en'],
                'alt_text_ar' => $product['alt_ar'],
                'folder' => 'products',
                'created_at' => now(),
            ]);

            DB::table('products')
                ->where('slug', $product['slug'])
                ->update(['featured_image_id' => $mediaId]);
        }
    }

    public function down(): void
    {
        // No-op: media records will remain
    }
};

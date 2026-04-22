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
            ['slug' => 'tmt-bars', 'source' => 'home/products/tmt-bars-desktop.png', 'original' => 'tmt-bars.png', 'alt_en' => 'TMT reinforcement steel bars', 'alt_ar' => 'حديد التسليح'],
            ['slug' => 'billets',  'source' => 'home/products/billets-desktop.png',  'original' => 'billets.png',  'alt_en' => 'Steel billets',                'alt_ar' => 'ستيل بِليت'],
        ];

        $now = now();

        foreach ($products as $product) {
            $existing = DB::table('products')->where('slug', $product['slug'])->first();
            if (!$existing) {
                continue;
            }

            if ($existing->featured_image_id) {
                $valid = DB::table('media')
                    ->where('id', $existing->featured_image_id)
                    ->whereNull('deleted_at')
                    ->exists();

                if ($valid) {
                    continue;
                }
            }

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
                'created_at' => $now,
            ]);

            DB::table('products')
                ->where('slug', $product['slug'])
                ->update([
                    'featured_image_id' => $mediaId,
                    'updated_at' => $now,
                ]);
        }
    }

    public function down(): void
    {
        // No-op: keep linked media intact on rollback
    }
};

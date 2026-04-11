<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        // --- Seed admin users ---
        $users = [
            ['name' => 'Admin', 'email' => 'admin@nuorsteel.com', 'password' => Hash::make('password'), 'role' => 'admin', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Editor', 'email' => 'editor@nuorsteel.com', 'password' => Hash::make('password'), 'role' => 'editor', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ];

        foreach ($users as $user) {
            DB::table('users')->updateOrInsert(
                ['email' => $user['email']],
                $user
            );
        }

        // --- Fix product images (paths moved from images/products/ to images/home/products/) ---
        Storage::makeDirectory('media');

        $products = [
            ['slug' => 'tmt-bars', 'source' => 'home/products/tmt-bars-desktop.png', 'original' => 'tmt-bars.png', 'alt_en' => 'TMT reinforcement steel bars', 'alt_ar' => 'حديد التسليح'],
            ['slug' => 'billets', 'source' => 'home/products/billets-desktop.png', 'original' => 'billets.png', 'alt_en' => 'Steel billets', 'alt_ar' => 'ستيل بِليت'],
        ];

        foreach ($products as $product) {
            $existing = DB::table('products')
                ->where('slug', $product['slug'])
                ->first();

            if (!$existing) {
                continue;
            }

            // Skip if product already has a valid featured image
            if ($existing->featured_image_id) {
                $mediaExists = DB::table('media')
                    ->where('id', $existing->featured_image_id)
                    ->whereNull('deleted_at')
                    ->exists();

                if ($mediaExists) {
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
                'created_at' => now(),
            ]);

            DB::table('products')
                ->where('slug', $product['slug'])
                ->update(['featured_image_id' => $mediaId]);
        }
    }

    public function down(): void
    {
        DB::table('users')->whereIn('email', ['admin@nuorsteel.com', 'editor@nuorsteel.com'])->delete();
    }
};

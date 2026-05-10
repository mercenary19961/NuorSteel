<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('media')
            ->where('path', 'media/billets-product.png')
            ->update([
                'path' => 'media/billets-product.webp',
                'filename' => 'billets-product.webp',
                'original_filename' => 'billets.webp',
                'mime_type' => 'image/webp',
            ]);
    }

    public function down(): void
    {
        DB::table('media')
            ->where('path', 'media/billets-product.webp')
            ->update([
                'path' => 'media/billets-product.png',
                'filename' => 'billets-product.png',
                'original_filename' => 'billets.png',
                'mime_type' => 'image/png',
            ]);
    }
};

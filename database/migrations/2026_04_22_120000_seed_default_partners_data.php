<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        // Skip if partners already exist — this migration only seeds defaults onto a fresh install
        if (DB::table('partners')->exists()) {
            return;
        }

        Storage::makeDirectory('media');

        $now = now();

        $partners = [
            ['source' => 'aramco.webp',            'name_en' => 'Aramco',                 'name_ar' => 'أرامكو',                    'size_tier' => 'md'],
            ['source' => 'vision 2030.webp',       'name_en' => 'Vision 2030',            'name_ar' => 'رؤية 2030',                 'size_tier' => 'lg'],
            ['source' => 'SAUDI MADE.webp',        'name_en' => 'Saudi Made',             'name_ar' => 'صنع في السعودية',           'size_tier' => 'md'],
            ['source' => 'modon.webp',             'name_en' => 'MODON',                  'name_ar' => 'مدن',                       'size_tier' => 'xl'],
            ['source' => 'nhc.webp',               'name_en' => 'NHC',                    'name_ar' => 'الوطنية للإسكان',           'size_tier' => 'lg'],
            ['source' => 'roshen.webp',            'name_en' => 'Roshn',                  'name_ar' => 'روشن',                      'size_tier' => 'lg'],
            ['source' => 'ASTM.webp',              'name_en' => 'ASTM',                   'name_ar' => 'ASTM',                      'size_tier' => 'lg'],
            ['source' => 'ISO.webp',               'name_en' => 'ISO',                    'name_ar' => 'ISO',                       'size_tier' => 'lg'],
            ['source' => 'SASO LOGO.webp',         'name_en' => 'SASO',                   'name_ar' => 'المواصفات السعودية',        'size_tier' => 'md'],
            ['source' => 'epd.webp',               'name_en' => 'EPD',                    'name_ar' => 'EPD',                       'size_tier' => 'md'],
            ['source' => 'HPD.webp',               'name_en' => 'HPD',                    'name_ar' => 'HPD',                       'size_tier' => 'xl'],
            ['source' => 'qarya.webp',             'name_en' => 'Qiddiya',                'name_ar' => 'القدية',                    'size_tier' => 'lg'],
            ['source' => 'tasnee3.webp',           'name_en' => 'Tasnee3',                'name_ar' => 'تصنيع',                     'size_tier' => 'md'],
            ['source' => 'WATER CO.webp',          'name_en' => 'National Water Company', 'name_ar' => 'شركة المياه الوطنية',       'size_tier' => 'md'],
            ['source' => 'industry ministry.webp', 'name_en' => 'Ministry of Industry',   'name_ar' => 'وزارة الصناعة',             'size_tier' => 'md'],
            ['source' => 'TRANSFER MINISTRY.webp', 'name_en' => 'Ministry of Transport',  'name_ar' => 'وزارة النقل',               'size_tier' => 'md'],
        ];

        $sortOrder = 0;
        foreach ($partners as $partner) {
            $sourcePath = public_path('images/home/partners/' . $partner['source']);

            if (!file_exists($sourcePath)) {
                continue;
            }

            $filename = Str::random(20) . '.webp';
            $storagePath = 'media/' . $filename;

            Storage::put($storagePath, file_get_contents($sourcePath));

            $mediaId = DB::table('media')->insertGetId([
                'filename' => $filename,
                'original_filename' => $partner['source'],
                'path' => $storagePath,
                'mime_type' => 'image/webp',
                'size' => filesize($sourcePath),
                'alt_text_en' => $partner['name_en'] . ' logo',
                'alt_text_ar' => $partner['name_ar'] . ' شعار',
                'folder' => 'partners',
                'created_at' => $now,
            ]);

            DB::table('partners')->insert([
                'name_en' => $partner['name_en'],
                'name_ar' => $partner['name_ar'],
                'logo_media_id' => $mediaId,
                'logo_path' => $storagePath,
                'size_tier' => $partner['size_tier'],
                'sort_order' => $sortOrder++,
                'is_visible' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        // No-op: keep seeded data intact on rollback
    }
};

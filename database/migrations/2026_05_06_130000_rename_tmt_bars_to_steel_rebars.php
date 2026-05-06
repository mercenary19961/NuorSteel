<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        // 1. Rename the product: slug + category + names + descriptions
        DB::table('products')
            ->where('slug', 'tmt-bars')
            ->update([
                'slug' => 'steel-rebars',
                'category' => 'steel-rebars',
                'name_en' => 'Steel Rebars',
                'short_description_en' => 'Thermo-Mechanically Treated Steel Rebars for concrete construction.',
                'short_description_ar' => 'حديد تسليح معالج حرارياً وميكانيكياً للبناء الخرساني.',
                'description_en' => 'Thermo-Mechanically Treated Steel Rebars manufactured to ASTM A615 standards. Available in 8mm to 32mm diameters for residential, commercial, and infrastructure projects. Our Steel Rebars offer superior strength, ductility, and weldability, making them ideal for seismic zones and demanding structural applications.',
                'description_ar' => 'حديد تسليح معالج حرارياً وميكانيكياً مصنع وفق معايير ASTM A615. متوفر بأقطار من 8 مم إلى 32 مم للمشاريع السكنية والتجارية والبنية التحتية. يوفر حديد التسليح لدينا قوة فائقة ومرونة وقابلية لحام ممتازة، مما يجعله مثالياً للمناطق الزلزالية والتطبيقات الإنشائية الصعبة.',
                'updated_at' => $now,
            ]);

        // 2. Update site_content rows that still reference "TMT" terminology
        $rows = [
            // Home — about description
            [
                'page' => 'home', 'section' => 'about', 'key' => 'description',
                'content_en' => 'Nuor Steel Industry Company is a leading Saudi steel manufacturer founded in 2010 in Al Kharj Industrial City. As a fully integrated producer of Steel Rebars and Steel Billets, it supports national infrastructure and industrial growth aligned with Saudi Vision 2030.',
            ],
            // Home — mission description
            [
                'page' => 'home', 'section' => 'vision_mission', 'key' => 'mission_description',
                'content_en' => 'To be the most trusted provider of construction materials in Saudi Arabia and the leading Steel Rebar brand in the Middle East, powered by innovation, uncompromising quality, and continuous improvement.',
            ],
            // About — mission description
            [
                'page' => 'about', 'section' => 'mission', 'key' => 'description',
                'content_en' => 'To deliver high-quality steel products that meet international standards while contributing to sustainable development and customer satisfaction.',
            ],
        ];

        foreach ($rows as $row) {
            DB::table('site_content')
                ->where('page', $row['page'])
                ->where('section', $row['section'])
                ->where('key', $row['key'])
                ->update([
                    'content_en' => $row['content_en'],
                    'updated_at' => $now,
                ]);
        }

        // 3. Update media path for the renamed storage file (StorageReconciler now sources from steel-rebars-desktop.png)
        // (media table has no updated_at column by design)
        DB::table('media')
            ->where('path', 'media/tmt-bars-product.png')
            ->update([
                'path' => 'media/steel-rebars-product.png',
                'filename' => 'steel-rebars-product.png',
                'original_filename' => 'steel-rebars.png',
                'alt_text_en' => 'Steel Rebars',
            ]);
    }

    public function down(): void
    {
        $now = now();

        DB::table('products')
            ->where('slug', 'steel-rebars')
            ->update([
                'slug' => 'tmt-bars',
                'category' => 'tmt-bars',
                'name_en' => 'TMT Bars',
                'short_description_en' => 'Thermo-Mechanically Treated reinforcement steel bars for concrete construction.',
                'short_description_ar' => 'قضبان حديد تسليح معالجة حرارياً وميكانيكياً للبناء الخرساني.',
                'description_en' => 'Thermo-Mechanically Treated reinforcement steel bars manufactured to ASTM A615 standards. Available in 8mm to 32mm diameters for residential, commercial, and infrastructure projects. Our TMT bars offer superior strength, ductility, and weldability, making them ideal for seismic zones and demanding structural applications.',
                'description_ar' => 'يتم تصنيع قضبان التسليح لدينا باستخدام تقنية المعالجة الحرارية الميكانيكية المتقدمة، مما يضمن قوة فائقة ومرونة وقابلية للحام. متوافقة مع معايير ساسو والمعايير الدولية، متوفرة بأقطار من 8 مم إلى 32 مم. مثالية للمشاريع السكنية والتجارية والبنية التحتية في جميع أنحاء المملكة.',
                'updated_at' => $now,
            ]);

        $rows = [
            [
                'page' => 'home', 'section' => 'about', 'key' => 'description',
                'content_en' => 'Nuor Steel Industry Company is a leading Saudi steel manufacturer founded in 2010 in Al Kharj Industrial City. As a fully integrated producer of TMT rebars and steel billets, it supports national infrastructure and industrial growth aligned with Saudi Vision 2030.',
            ],
            [
                'page' => 'home', 'section' => 'vision_mission', 'key' => 'mission_description',
                'content_en' => 'To be the most trusted provider of construction materials in Saudi Arabia and the leading TMT bar brand in the Middle East, powered by innovation, uncompromising quality, and continuous improvement.',
            ],
        ];

        foreach ($rows as $row) {
            DB::table('site_content')
                ->where('page', $row['page'])
                ->where('section', $row['section'])
                ->where('key', $row['key'])
                ->update([
                    'content_en' => $row['content_en'],
                    'updated_at' => $now,
                ]);
        }

        DB::table('media')
            ->where('path', 'media/steel-rebars-product.png')
            ->update([
                'path' => 'media/tmt-bars-product.png',
                'filename' => 'tmt-bars-product.png',
                'original_filename' => 'tmt-bars.png',
                'alt_text_en' => 'TMT reinforcement steel bars',
            ]);
    }
};

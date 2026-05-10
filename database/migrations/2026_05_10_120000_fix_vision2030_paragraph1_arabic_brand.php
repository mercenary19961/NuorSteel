<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $newAr = 'تدعم شركة حديد نور للصناعة رؤية السعودية 2030 عبر تعزيز القدرات الصناعية المحلية وتسريع توطين مواد البناء الحيوية. وبصفتها مصنعًا متكاملًا للحديد، تمكّن حديد نور المشاريع الكبرى من خلال إمداد موثوق، وجودة ثابتة، وإنتاج وطني بمعايير عالية.';

        DB::table('site_content')
            ->where('page', 'home')
            ->where('section', 'vision2030')
            ->where('key', 'paragraph1')
            ->update([
                'content_ar' => $newAr,
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        $oldAr = 'تدعم شركة حديد نور للصناعة رؤية السعودية 2030 عبر تعزيز القدرات الصناعية المحلية وتسريع توطين مواد البناء الحيوية. وبصفتها مصنعًا متكاملًا للحديد، تمكّن نور ستيل المشاريع الكبرى من خلال إمداد موثوق، وجودة ثابتة، وإنتاج وطني بمعايير عالية.';

        DB::table('site_content')
            ->where('page', 'home')
            ->where('section', 'vision2030')
            ->where('key', 'paragraph1')
            ->update([
                'content_ar' => $oldAr,
                'updated_at' => now(),
            ]);
    }
};

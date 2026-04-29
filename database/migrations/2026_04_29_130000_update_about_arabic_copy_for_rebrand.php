<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $rows = [
            [
                'page' => 'home',
                'section' => 'about',
                'key' => 'title',
                'content_ar' => 'عن شركة حديد نور',
            ],
            [
                'page' => 'home',
                'section' => 'about',
                'key' => 'description',
                'content_ar' => 'شركة حديد نور للصناعة هي شركة سعودية رائدة في صناعة الحديد تأسست عام 2010 في المدينة الصناعية بالخرج. بصفتها منتجاً متكاملاً لستيل بِليت وحديد التسليح، تدعم البنية التحتية الوطنية والنمو الصناعي بما يتماشى مع رؤية السعودية 2030.',
            ],
            [
                'page' => 'about',
                'section' => 'overview',
                'key' => 'description',
                'content_ar' => 'شركة حديد نور للصناعة هي شركة رائدة في صناعة الحديد في المملكة العربية السعودية، تأسست عام 2010 ويقع مقرها الرئيسي في المدينة الصناعية بالخرج. تأسست في الأصل كشركة تجارة حديد، وتطورت شركة نور للحديد لتصبح منتجاً متكاملاً للحديد بمرافق تصنيع متقدمة متخصصة في إنتاج كتل الحديد عالية الجودة وحديد التسليح.',
            ],
        ];

        $now = now();
        foreach ($rows as $row) {
            DB::table('site_content')
                ->where('page', $row['page'])
                ->where('section', $row['section'])
                ->where('key', $row['key'])
                ->update([
                    'content_ar' => $row['content_ar'],
                    'updated_at' => $now,
                ]);
        }
    }

    public function down(): void
    {
        $rows = [
            [
                'page' => 'home',
                'section' => 'about',
                'key' => 'title',
                'content_ar' => 'عن شركة نور للحديد',
            ],
            [
                'page' => 'home',
                'section' => 'about',
                'key' => 'description',
                'content_ar' => 'شركة نور للصناعات الحديدية هي شركة سعودية رائدة في صناعة الحديد تأسست عام 2010 في المدينة الصناعية بالخرج. بصفتها منتجاً متكاملاً لستيل بِليت وحديد التسليح، تدعم البنية التحتية الوطنية والنمو الصناعي بما يتماشى مع رؤية السعودية 2030.',
            ],
            [
                'page' => 'about',
                'section' => 'overview',
                'key' => 'description',
                'content_ar' => 'شركة نور للصناعات الحديدية مكرسة لتصنيع منتجات الحديد عالية الجودة مع الحفاظ على أعلى معايير المسؤولية البيئية وسلامة مكان العمل.',
            ],
        ];

        $now = now();
        foreach ($rows as $row) {
            DB::table('site_content')
                ->where('page', $row['page'])
                ->where('section', $row['section'])
                ->where('key', $row['key'])
                ->update([
                    'content_ar' => $row['content_ar'],
                    'updated_at' => $now,
                ]);
        }
    }
};

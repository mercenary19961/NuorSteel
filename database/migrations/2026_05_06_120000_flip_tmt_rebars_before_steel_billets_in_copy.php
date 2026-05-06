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
                'key' => 'description',
                'content_en' => 'Nuor Steel Industry Company is a leading Saudi steel manufacturer founded in 2010 in Al Kharj Industrial City. As a fully integrated producer of TMT rebars and steel billets, it supports national infrastructure and industrial growth aligned with Saudi Vision 2030.',
                'content_ar' => 'شركة حديد نور للصناعة هي شركة سعودية رائدة في صناعة الحديد تأسست عام 2010 في المدينة الصناعية بالخرج. بصفتها منتجاً متكاملاً لحديد التسليح وستيل بِليت، تدعم البنية التحتية الوطنية والنمو الصناعي بما يتماشى مع رؤية السعودية 2030.',
            ],
            [
                'page' => 'about',
                'section' => 'overview',
                'key' => 'description',
                'content_ar' => 'شركة حديد نور للصناعة هي شركة رائدة في صناعة الحديد في المملكة العربية السعودية، تأسست عام 2010 ويقع مقرها الرئيسي في المدينة الصناعية بالخرج. تأسست في الأصل كشركة تجارة حديد، وتطورت شركة حديد نور لتصبح منتجاً متكاملاً للحديد بمرافق تصنيع متقدمة متخصصة في إنتاج حديد التسليح وكتل الحديد عالية الجودة.',
            ],
        ];

        $now = now();
        foreach ($rows as $row) {
            $payload = ['updated_at' => $now];
            if (isset($row['content_en'])) {
                $payload['content_en'] = $row['content_en'];
            }
            if (isset($row['content_ar'])) {
                $payload['content_ar'] = $row['content_ar'];
            }

            DB::table('site_content')
                ->where('page', $row['page'])
                ->where('section', $row['section'])
                ->where('key', $row['key'])
                ->update($payload);
        }
    }

    public function down(): void
    {
        $rows = [
            [
                'page' => 'home',
                'section' => 'about',
                'key' => 'description',
                'content_en' => 'Nuor Steel Industry Company is a leading Saudi steel manufacturer founded in 2010 in Al Kharj Industrial City. As a fully integrated producer of steel billets and TMT rebars, it supports national infrastructure and industrial growth aligned with Saudi Vision 2030.',
                'content_ar' => 'شركة حديد نور للصناعة هي شركة سعودية رائدة في صناعة الحديد تأسست عام 2010 في المدينة الصناعية بالخرج. بصفتها منتجاً متكاملاً لستيل بِليت وحديد التسليح، تدعم البنية التحتية الوطنية والنمو الصناعي بما يتماشى مع رؤية السعودية 2030.',
            ],
            [
                'page' => 'about',
                'section' => 'overview',
                'key' => 'description',
                'content_ar' => 'شركة حديد نور للصناعة هي شركة رائدة في صناعة الحديد في المملكة العربية السعودية، تأسست عام 2010 ويقع مقرها الرئيسي في المدينة الصناعية بالخرج. تأسست في الأصل كشركة تجارة حديد، وتطورت شركة حديد نور لتصبح منتجاً متكاملاً للحديد بمرافق تصنيع متقدمة متخصصة في إنتاج كتل الحديد عالية الجودة وحديد التسليح.',
            ],
        ];

        $now = now();
        foreach ($rows as $row) {
            $payload = ['updated_at' => $now];
            if (isset($row['content_en'])) {
                $payload['content_en'] = $row['content_en'];
            }
            if (isset($row['content_ar'])) {
                $payload['content_ar'] = $row['content_ar'];
            }

            DB::table('site_content')
                ->where('page', $row['page'])
                ->where('section', $row['section'])
                ->where('key', $row['key'])
                ->update($payload);
        }
    }
};

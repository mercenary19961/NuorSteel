<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $rows = [
            // Sustainability hero
            ['page' => 'sustainability', 'section' => 'hero', 'key' => 'label',
                'content_en' => 'Sustainability',
                'content_ar' => 'الاستدامة',
                'type' => 'text'],
            ['page' => 'sustainability', 'section' => 'hero', 'key' => 'title',
                'content_en' => 'Our Commitment to People, Planet & Principles',
                'content_ar' => 'التزامنا تجاه الإنسان والكوكب والمبادئ',
                'type' => 'text'],
            ['page' => 'sustainability', 'section' => 'hero', 'key' => 'subtitle',
                'content_en' => 'From environmental performance to workplace safety and corporate governance, our responsibility extends beyond the mill floor.',
                'content_ar' => 'من الأداء البيئي إلى السلامة المهنية والحوكمة المؤسسية، مسؤوليتنا تمتد إلى ما هو أبعد من أرضية المصنع.',
                'type' => 'textarea'],

            // Career hero label + listings strip
            ['page' => 'career', 'section' => 'hero', 'key' => 'label',
                'content_en' => 'Careers',
                'content_ar' => 'الوظائف',
                'type' => 'text'],
            ['page' => 'career', 'section' => 'listings', 'key' => 'title',
                'content_en' => 'Open Positions',
                'content_ar' => 'الوظائف المتاحة',
                'type' => 'text'],
            ['page' => 'career', 'section' => 'listings', 'key' => 'subtitle',
                'content_en' => 'Explore current opportunities and find your place at Nuor Steel.',
                'content_ar' => 'استكشف الفرص المتاحة وابحث عن مكانك في شركة حديد نور للصناعة.',
                'type' => 'textarea'],
        ];

        foreach ($rows as $row) {
            DB::table('site_content')->updateOrInsert(
                ['page' => $row['page'], 'section' => $row['section'], 'key' => $row['key']],
                array_merge($row, ['updated_at' => $now])
            );
        }
    }

    public function down(): void
    {
        DB::table('site_content')->where('page', 'sustainability')->where('section', 'hero')->delete();
        DB::table('site_content')->where('page', 'career')->where('section', 'hero')->where('key', 'label')->delete();
        DB::table('site_content')->where('page', 'career')->where('section', 'listings')->delete();
    }
};

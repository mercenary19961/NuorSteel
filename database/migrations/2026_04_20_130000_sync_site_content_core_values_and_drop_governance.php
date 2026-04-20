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
                'section' => 'core_values',
                'key' => 'people_teamwork_title',
                'content_en' => 'People & Teamwork',
                'content_ar' => 'الأفراد والعمل الجماعي',
                'type' => 'text',
            ],
            [
                'page' => 'home',
                'section' => 'core_values',
                'key' => 'people_teamwork_description',
                'content_en' => 'Empowering our people and fostering a culture of collaboration to achieve shared success. We believe that strong teams, aligned goals, and continuous development are the foundation of sustainable growth.',
                'content_ar' => 'تمكين موظفينا وتعزيز ثقافة التعاون لتحقيق النجاح المشترك. نؤمن بأن الفرق القوية والأهداف المتوافقة والتطوير المستمر هي أساس النمو المستدام.',
                'type' => 'textarea',
            ],
            [
                'page' => 'home',
                'section' => 'core_values',
                'key' => 'trust_integrity_title',
                'content_en' => 'Trust & Integrity',
                'content_ar' => 'الثقة والنزاهة',
                'type' => 'text',
            ],
            [
                'page' => 'home',
                'section' => 'core_values',
                'key' => 'trust_integrity_description',
                'content_en' => 'Building long-term relationships through transparency, accountability, and ethical business practices. We are committed to acting with honesty in every interaction, ensuring reliability and confidence in everything we deliver.',
                'content_ar' => 'بناء علاقات طويلة الأمد من خلال الشفافية والمساءلة والممارسات التجارية الأخلاقية. نلتزم بالتصرف بأمانة في كل تعامل، لضمان الموثوقية والثقة في كل ما نقدمه.',
                'type' => 'textarea',
            ],
        ];

        $now = now();
        foreach ($rows as $row) {
            DB::table('site_content')->updateOrInsert(
                ['page' => $row['page'], 'section' => $row['section'], 'key' => $row['key']],
                array_merge($row, ['updated_at' => $now, 'created_at' => $now]),
            );
        }

        DB::table('site_content')
            ->where('page', 'about')
            ->where('section', 'governance')
            ->delete();
    }

    public function down(): void
    {
        DB::table('site_content')
            ->where('page', 'home')
            ->where('section', 'core_values')
            ->whereIn('key', [
                'people_teamwork_title',
                'people_teamwork_description',
                'trust_integrity_title',
                'trust_integrity_description',
            ])
            ->delete();
    }
};

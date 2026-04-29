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
                'section' => 'vision_mission',
                'key' => 'vision_description',
                'content_ar' => 'أن نكون الخيار الأول في الشرق الأوسط لإنتاج وتسويق الحديد عالي الجودة، مع ترسيخ أعلى معايير الجودة والموثوقية والاستدامة.',
            ],
            [
                'page' => 'home',
                'section' => 'vision_mission',
                'key' => 'mission_description',
                'content_ar' => 'أن نقود قطاع مواد البناء في المملكة، ونرسّخ ريادتنا كأبرز علامة لحديد التسليح في الشرق الأوسط، من خلال الابتكار والجودة والتحسين المستمر.',
            ],
            [
                'page' => 'home',
                'section' => 'vision2030',
                'key' => 'paragraph1',
                'content_ar' => 'تدعم شركة حديد نور للصناعة رؤية السعودية 2030 عبر تعزيز القدرات الصناعية المحلية وتسريع توطين مواد البناء الحيوية. وبصفتها مصنعًا متكاملًا للحديد، تمكّن نور ستيل المشاريع الكبرى من خلال إمداد موثوق، وجودة ثابتة، وإنتاج وطني بمعايير عالية.',
            ],
            [
                'page' => 'home',
                'section' => 'vision2030',
                'key' => 'paragraph2',
                'content_ar' => 'كعضو فاعل في برنامج "صنع في السعودية"، تقود شركة حديد نور للصناعة تعزيز القيمة المحلية وترسّخ حضور قطاع صناعي سعودي تنافسي على الساحة العالمية.',
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
                'section' => 'vision_mission',
                'key' => 'vision_description',
                'content_ar' => 'أن نكون المنتج والمسوّق الرائد لمنتجات الحديد عالية الجودة في الشرق الأوسط، ونضع معايير الجودة والموثوقية والاستدامة.',
            ],
            [
                'page' => 'home',
                'section' => 'vision_mission',
                'key' => 'mission_description',
                'content_ar' => 'أن نكون المزوّد الأكثر ثقة لمواد البناء في المملكة العربية السعودية والعلامة التجارية الرائدة لحديد التسليح في الشرق الأوسط، بدعم من الابتكار والجودة المتميزة والتحسين المستمر.',
            ],
            [
                'page' => 'home',
                'section' => 'vision2030',
                'key' => 'paragraph1',
                'content_ar' => 'تدعم شركة نور للصناعات الحديدية رؤية السعودية 2030 من خلال تعزيز القدرات الصناعية المحلية والنهوض بتوطين مواد البناء الحيوية. بصفتها مصنعاً متكاملاً للحديد، تتمتع نور ستيل بالقدرة على دعم المشاريع العملاقة والكبرى من خلال إمداد موثوق وجودة ثابتة وإنتاج على المستوى الوطني.',
            ],
            [
                'page' => 'home',
                'section' => 'vision2030',
                'key' => 'paragraph2',
                'content_ar' => 'بصفتها عضواً فخوراً في برنامج "صنع في السعودية"، تساهم نور ستيل في خلق القيمة المحلية ونمو قطاع صناعي سعودي تنافسي ومحترم عالمياً.',
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

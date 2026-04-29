<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $tmtBars = [
            'highlights' => json_encode([
                ['text_en' => 'Manufactured to ASTM A615 standards', 'text_ar' => 'مصنع وفق معايير ASTM A615'],
                ['text_en' => 'Available in diameters from 8mm to 32mm', 'text_ar' => 'متوفر بأقطار من 8 مم إلى 32 مم'],
                ['text_en' => 'SASO compliant for Saudi construction projects', 'text_ar' => 'متوافق مع معايير ساسو لمشاريع البناء السعودية'],
                ['text_en' => 'Superior strength, ductility, and weldability', 'text_ar' => 'قوة فائقة ومرونة وقابلية لحام ممتازة'],
            ], JSON_UNESCAPED_UNICODE),
            'spec_icons' => json_encode([
                ['icon' => 'ruler', 'title_en' => 'Diameter Range', 'title_ar' => 'نطاق الأقطار', 'value_en' => '8mm - 32mm', 'value_ar' => '8 مم - 32 مم'],
                ['icon' => 'shield', 'title_en' => 'Standards', 'title_ar' => 'المعايير', 'value_en' => 'ASTM A615', 'value_ar' => 'ASTM A615 الدرجة 60/420'],
                ['icon' => 'package', 'title_en' => 'Bar Length', 'title_ar' => 'طول القضيب', 'value_en' => '12m standard', 'value_ar' => '12 متر قياسي'],
            ], JSON_UNESCAPED_UNICODE),
            'spec_table' => json_encode([
                'title_en' => 'Linear Mass and Number of Bars in Bundles',
                'title_ar' => 'الكتلة الخطية وعدد القضبان في الحزم',
                'headers_en' => ['Diameter (mm)', 'Nominal Linear Mass Kg/m', 'Tolerance in Linear Mass', 'Number of 12 m Long Bars in a bundle of nominal weight of 2 Tons'],
                'headers_ar' => ['القطر (مم)', 'الكتلة الخطية الاسمية كجم/م', 'التفاوت في الكتلة الخطية', 'عدد القضبان بطول 12 م في حزمة بوزن اسمي 2 طن'],
                'rows' => [
                    ['08', '0.395', '-5%', '422'],
                    ['10', '0.617', '-5%', '270'],
                    ['12', '0.888', '-5%', '188'],
                    ['14', '1.208', '-5%', '138'],
                    ['16', '1.578', '-5%', '106'],
                    ['18', '1.998', '-5%', '83'],
                    ['20', '2.466', '-5%', '68'],
                    ['25', '3.853', '-5%', '43'],
                    ['32', '6.313', '-5%', '26'],
                ],
            ], JSON_UNESCAPED_UNICODE),
            'features' => json_encode([
                ['icon' => 'flame', 'title_en' => 'Thermo-Mechanical Treatment', 'title_ar' => 'المعالجة الحرارية الميكانيكية', 'description_en' => 'Advanced TMT process ensures optimal balance of strength and ductility through controlled cooling.', 'description_ar' => 'عملية TMT المتقدمة تضمن التوازن الأمثل بين القوة والمرونة من خلال التبريد المحكم.'],
                ['icon' => 'zap', 'title_en' => 'Superior Ductility', 'title_ar' => 'مرونة فائقة', 'description_en' => 'High elongation values ensure safe performance in seismic zones and under dynamic loading.', 'description_ar' => 'قيم استطالة عالية تضمن أداءً آمناً في المناطق الزلزالية وتحت الأحمال الديناميكية.'],
                ['icon' => 'target', 'title_en' => 'Excellent Weldability', 'title_ar' => 'قابلية لحام ممتازة', 'description_en' => 'Low carbon equivalent enables reliable on-site welding without pre-heating.', 'description_ar' => 'مكافئ كربون منخفض يتيح لحاماً موثوقاً في الموقع دون تسخين مسبق.'],
                ['icon' => 'shield', 'title_en' => 'Corrosion Resistance', 'title_ar' => 'مقاومةُ التآكلِ:', 'description_en' => 'Tempered martensite outer layer provides enhanced resistance to environmental degradation.', 'description_ar' => 'طبقةٌ خارجيةٌ من المارتنسيتِ المُقسّى توفّرُ مقاومةً مُعزَّزةً للتدهورِ البيئيّ.'],
            ], JSON_UNESCAPED_UNICODE),
            'show_quote_tab' => true,
        ];

        $billets = [
            'highlights' => json_encode([
                ['text_en' => 'Produced through Electric Arc Furnace (EAF) steelmaking', 'text_ar' => 'إنتاج عبر فرن القوس الكهربائي (EAF)'],
                ['text_en' => 'Continuous casting for uniform quality', 'text_ar' => 'صب مستمر لجودة موحدة'],
                ['text_en' => 'Available in 100x100mm and 130x130mm cross-sections', 'text_ar' => 'متوفر بمقاطع 100×100 مم و 130×130 مم'],
                ['text_en' => 'Strict chemical and dimensional specifications', 'text_ar' => 'مواصفات كيميائية وأبعاد صارمة'],
            ], JSON_UNESCAPED_UNICODE),
            'spec_icons' => json_encode([
                ['icon' => 'ruler', 'title_en' => 'Cross-section', 'title_ar' => 'المقطع العرضي', 'value_en' => '100x100 & 130x130 mm', 'value_ar' => '100×100 و 130×130 مم'],
                ['icon' => 'microscope', 'title_en' => 'Chemical Control', 'title_ar' => 'التحكم الكيميائي', 'value_en' => 'In-process spectroscopy', 'value_ar' => 'تحليل طيفي أثناء العملية'],
                ['icon' => 'target', 'title_en' => 'Applications', 'title_ar' => 'التطبيقات', 'value_en' => 'Rolling mills & forging', 'value_ar' => 'مصانع الدرفلة والتشكيل'],
            ], JSON_UNESCAPED_UNICODE),
            'spec_table' => json_encode([
                'title_en' => 'Chemical Composition % (max)',
                'title_ar' => 'التركيب الكيميائي % (الحد الأقصى)',
                'headers_en' => ['Billet Size (mm)', 'C', 'SI', 'Mn', 'P Max', 'S Max'],
                'headers_ar' => ['حجم الكتلة (مم)', 'C', 'SI', 'Mn', 'P الحد الأقصى', 'S الحد الأقصى'],
                'rows' => [
                    ['100x100', '0.18-0.40', '0.20-0.40', '0.50-1.20', '0.05', '0.05'],
                    ['130x130', '0.18-0.40', '0.20-0.40', '0.50-1.20', '0.05', '0.05'],
                ],
            ], JSON_UNESCAPED_UNICODE),
            'features' => json_encode([
                ['icon' => 'flame', 'title_en' => 'EAF Steelmaking', 'title_ar' => 'صناعة الصلب بفرن القوس الكهربائي', 'description_en' => 'Electric Arc Furnace technology for efficient melting and precise chemical control.', 'description_ar' => 'تقنية فرن القوس الكهربائي للصهر الفعال والتحكم الكيميائي الدقيق.'],
                ['icon' => 'box', 'title_en' => 'Continuous Casting', 'title_ar' => 'الصب المستمر', 'description_en' => 'Automated continuous casting process ensures uniform internal structure and surface quality.', 'description_ar' => 'عملية صب مستمر آلية تضمن بنية داخلية موحدة وجودة سطح ممتازة.'],
                ['icon' => 'microscope', 'title_en' => 'Chemical Control', 'title_ar' => 'التحكم الكيميائي', 'description_en' => 'In-process spectroscopy analysis ensures every heat meets target chemical composition.', 'description_ar' => 'تحليل طيفي أثناء العملية يضمن أن كل صهر يلبي التركيب الكيميائي المستهدف.'],
                ['icon' => 'ruler', 'title_en' => 'Dimensional Consistency', 'title_ar' => 'اتساق الأبعاد', 'description_en' => 'Tight tolerances on cross-section dimensions for reliable downstream rolling performance.', 'description_ar' => 'تفاوتات دقيقة في أبعاد المقطع العرضي لأداء درفلة موثوق.'],
            ], JSON_UNESCAPED_UNICODE),
            'show_quote_tab' => false,
        ];

        DB::table('products')->where('slug', 'tmt-bars')->update($tmtBars);
        DB::table('products')->where('slug', 'billets')->update($billets);
    }

    public function down(): void
    {
        DB::table('products')->update([
            'highlights' => null,
            'spec_icons' => null,
            'spec_table' => null,
            'features' => null,
            'show_quote_tab' => true,
        ]);
    }
};

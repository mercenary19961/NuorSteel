<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $physical = [
            'tab_label_en' => 'Physical Properties',
            'tab_label_ar' => 'الخصائص الفيزيائية',
            'title_en' => 'Physical Properties Reference',
            'title_ar' => 'مرجع الخصائص الفيزيائية',
            'headers_en' => ['Property', 'Acceptance Limit (Max)'],
            'headers_ar' => ['الخاصية', 'حد القبول (الحد الأقصى)'],
            'rows' => [
                ['Length', '5% Max'],
                ['Sections', 'H1 ± 2 mm, H2 ± 2 mm'],
                ['Rhomboidity', '5% Max. Formula: (d1 − d2) × 100 ÷ [0.5 × (d1 + d2)]'],
                ['Concavity / Convexity', 'Max 2% of nominal section size. Formula: (b/h) × 100 ≤ 2%'],
                ['Straightness', '5 mm / meter. Max 60 mm in full length'],
                ['Angular Twist', 'Max 5° in 12 m'],
                ['Longitudinal Cracks', 'Without any crack'],
                ['Transverse Cracks', 'Without any crack'],
                ['Corner Cracks', 'Without any crack'],
                ['Casting Arrest', 'Without any casting arrest'],
                ['Oscillation Marks', 'Less than 2 mm depth'],
                ['Crack in Section', 'Without any crack'],
                ['Pinholes & Blowholes', 'Pinhole less than 2 mm depth, without any blow hole or piping'],
                ['Shrinkage Porosity', 'Without any shrinkage porosity'],
            ],
            'rows_ar' => [
                ['الطول', '5% حد أقصى'],
                ['المقاطع', 'H1 ± 2 مم، H2 ± 2 مم'],
                ['معامل المعين', '5% حد أقصى. المعادلة: (d1 − d2) × 100 ÷ [0.5 × (d1 + d2)]'],
                ['التقعر / التحدب', 'حد أقصى 2% من المقطع الاسمي. المعادلة: (b/h) × 100 ≤ 2%'],
                ['الاستقامة', '5 مم / متر. حد أقصى 60 مم على كامل الطول'],
                ['الالتواء الزاوي', 'حد أقصى 5° على طول 12 م'],
                ['الشقوق الطولية', 'بدون أي شقوق'],
                ['الشقوق العرضية', 'بدون أي شقوق'],
                ['شقوق الأركان', 'بدون أي شقوق'],
                ['توقف الصب', 'بدون أي توقف صب'],
                ['علامات التذبذب', 'أقل من 2 مم عمقًا'],
                ['شقوق في المقطع', 'بدون أي شقوق'],
                ['الثقوب والفقاعات الهوائية', 'ثقب أقل من 2 مم عمقًا، بدون أي فقاعات هوائية أو تجاويف'],
                ['مسامية الانكماش', 'بدون أي مسامية انكماش'],
            ],
        ];

        // The spec_table row format is a single rows array — first column is language-switched at render time
        // via tableData lookup. Since only headers + title + tab_label have `_ar` variants today, we store
        // property names for both locales by using an array-of-arrays for rows and letting the frontend
        // pick the right one via the headers length. Simpler: keep a single `rows` using EN property names
        // and a parallel rows_ar. Controller will pick rows_ar when language === 'ar'.
        // Falling back to the existing simple shape: store EN rows in `rows`; AR rows as separate field.

        $specTablePhysical = [
            'tab_label_en' => $physical['tab_label_en'],
            'tab_label_ar' => $physical['tab_label_ar'],
            'title_en' => $physical['title_en'],
            'title_ar' => $physical['title_ar'],
            'headers_en' => $physical['headers_en'],
            'headers_ar' => $physical['headers_ar'],
            'rows' => $physical['rows'],
            'rows_ar' => $physical['rows_ar'],
        ];

        $specTableChemical = [
            'tab_label_en' => 'Chemical Composition',
            'tab_label_ar' => 'التركيب الكيميائي',
            'title_en' => 'Chemical Composition % (max)',
            'title_ar' => 'التركيب الكيميائي % (الحد الأقصى)',
            'headers_en' => ['Billet Size (mm)', 'C', 'SI', 'Mn', 'P Max', 'S Max'],
            'headers_ar' => ['حجم الكتلة (مم)', 'C', 'SI', 'Mn', 'P الحد الأقصى', 'S الحد الأقصى'],
            'rows' => [
                ['100x100', '0.18-0.40', '0.20-0.40', '0.50-1.20', '0.05', '0.05'],
                ['130x130', '0.18-0.40', '0.20-0.40', '0.50-1.20', '0.05', '0.05'],
            ],
        ];

        DB::table('products')->where('slug', 'billets')->update([
            'spec_table' => json_encode($specTablePhysical, JSON_UNESCAPED_UNICODE),
            'spec_table_2' => json_encode($specTableChemical, JSON_UNESCAPED_UNICODE),
        ]);
    }

    public function down(): void
    {
        // Revert billets to the previous single chemical-composition table
        $specTableChemical = [
            'title_en' => 'Chemical Composition % (max)',
            'title_ar' => 'التركيب الكيميائي % (الحد الأقصى)',
            'headers_en' => ['Billet Size (mm)', 'C', 'SI', 'Mn', 'P Max', 'S Max'],
            'headers_ar' => ['حجم الكتلة (مم)', 'C', 'SI', 'Mn', 'P الحد الأقصى', 'S الحد الأقصى'],
            'rows' => [
                ['100x100', '0.18-0.40', '0.20-0.40', '0.50-1.20', '0.05', '0.05'],
                ['130x130', '0.18-0.40', '0.20-0.40', '0.50-1.20', '0.05', '0.05'],
            ],
        ];

        DB::table('products')->where('slug', 'billets')->update([
            'spec_table' => json_encode($specTableChemical, JSON_UNESCAPED_UNICODE),
            'spec_table_2' => null,
        ]);
    }
};

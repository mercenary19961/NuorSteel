<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Chemical composition by bar diameter, sourced from Nuor Steel MTC 2026 Mill Test Certificates
        // (ASTM E415/2021 chemical analysis). ASTM A615+A1/21 specifies Phosphorus max = 0.06%.
        $chemical = [
            'tab_label_en' => 'Chemical Composition',
            'tab_label_ar' => 'التركيب الكيميائي',
            'title_en' => 'Typical Chemical Composition (% by mass)',
            'title_ar' => 'التركيب الكيميائي النموذجي (٪ بالكتلة)',
            'headers_en' => ['Diameter (mm)', 'C %', 'S %', 'P % (Max 0.06)', 'Mn %'],
            'headers_ar' => ['القطر (مم)', 'الكربون %', 'الكبريت %', 'الفسفور % (الحد الأقصى 0.06)', 'المنغنيز %'],
            'rows' => [
                ['Ø10', '0.23', '0.030', '0.021', '0.59'],
                ['Ø12', '0.22', '0.030', '0.020', '0.66'],
                ['Ø14', '0.24', '0.023', '0.021', '0.65'],
                ['Ø16', '0.23', '0.028', '0.017', '0.65'],
                ['Ø18', '0.21', '0.034', '0.020', '0.68'],
                ['Ø20', '0.21', '0.032', '0.020', '0.65'],
            ],
        ];

        DB::table('products')->where('slug', 'tmt-bars')->update([
            'spec_table_2' => json_encode($chemical, JSON_UNESCAPED_UNICODE),
        ]);
    }

    public function down(): void
    {
        DB::table('products')->where('slug', 'tmt-bars')->update([
            'spec_table_2' => null,
        ]);
    }
};

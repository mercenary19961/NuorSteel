<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        // --- TMT Bars ---
        DB::table('products')->updateOrInsert(
            ['slug' => 'tmt-bars'],
            [
                'name_en' => 'TMT Bars',
                'name_ar' => 'قضبان حديد التسليح',
                'slug' => 'tmt-bars',
                'short_description_en' => 'Thermo-Mechanically Treated reinforcement steel bars manufactured to BS 4449:2005, Grade B500B standards.',
                'short_description_ar' => 'قضبان حديد تسليح معالجة حرارياً وميكانيكياً مصنعة وفق معايير BS 4449:2005، الدرجة B500B.',
                'description_en' => 'Thermo-Mechanically Treated reinforcement steel bars manufactured to BS 4449:2005, Grade B500B standards. Available in 8mm to 32mm diameters for residential, commercial, and infrastructure projects. Our TMT bars offer superior strength, ductility, and weldability, making them ideal for seismic zones and demanding structural applications.',
                'description_ar' => 'قضبان حديد تسليح معالجة حرارياً وميكانيكياً مصنعة وفق معايير BS 4449:2005، الدرجة B500B. متوفرة بأقطار من 8 مم إلى 32 مم للمشاريع السكنية والتجارية ومشاريع البنية التحتية. توفر قضبان التسليح لدينا قوة فائقة ومرونة وقابلية لحام ممتازة.',
                'category' => 'finished',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );

        // --- Billets ---
        DB::table('products')->updateOrInsert(
            ['slug' => 'billets'],
            [
                'name_en' => 'Billets',
                'name_ar' => 'البيليت',
                'slug' => 'billets',
                'short_description_en' => 'High-quality steel billets produced through Electric Arc Furnace steelmaking and continuous casting.',
                'short_description_ar' => 'بيليت فولاذي عالي الجودة منتج عبر أفران القوس الكهربائي والصب المستمر.',
                'description_en' => 'High-quality steel billets produced through Electric Arc Furnace steelmaking and continuous casting. The essential semi-finished feedstock for rolling mills, manufactured to strict chemical and dimensional specifications. Our billets serve as the foundation for producing premium TMT bars and other long steel products.',
                'description_ar' => 'بيليت فولاذي عالي الجودة منتج عبر أفران القوس الكهربائي والصب المستمر. المادة الخام شبه المصنعة الأساسية لمصانع الدرفلة، مصنعة وفق مواصفات كيميائية وأبعاد صارمة.',
                'category' => 'semi-finished',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 2,
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );

        // --- Specifications ---
        $tmtId = DB::table('products')->where('slug', 'tmt-bars')->value('id');
        $billetId = DB::table('products')->where('slug', 'billets')->value('id');

        // TMT Bars - Dimensional specs (Linear Mass per BS 4449)
        if ($tmtId && DB::table('product_specifications')->where('product_id', $tmtId)->count() === 0) {
            DB::table('product_specifications')->insert([
                ['product_id' => $tmtId, 'property_en' => '8mm', 'property_ar' => '8 مم', 'value' => '0.395', 'min_value' => null, 'max_value' => null, 'unit' => 'kg/m', 'spec_type' => 'dimensional', 'sort_order' => 1],
                ['product_id' => $tmtId, 'property_en' => '10mm', 'property_ar' => '10 مم', 'value' => '0.617', 'min_value' => null, 'max_value' => null, 'unit' => 'kg/m', 'spec_type' => 'dimensional', 'sort_order' => 2],
                ['product_id' => $tmtId, 'property_en' => '12mm', 'property_ar' => '12 مم', 'value' => '0.888', 'min_value' => null, 'max_value' => null, 'unit' => 'kg/m', 'spec_type' => 'dimensional', 'sort_order' => 3],
                ['product_id' => $tmtId, 'property_en' => '14mm', 'property_ar' => '14 مم', 'value' => '1.210', 'min_value' => null, 'max_value' => null, 'unit' => 'kg/m', 'spec_type' => 'dimensional', 'sort_order' => 4],
                ['product_id' => $tmtId, 'property_en' => '16mm', 'property_ar' => '16 مم', 'value' => '1.580', 'min_value' => null, 'max_value' => null, 'unit' => 'kg/m', 'spec_type' => 'dimensional', 'sort_order' => 5],
                ['product_id' => $tmtId, 'property_en' => '18mm', 'property_ar' => '18 مم', 'value' => '2.000', 'min_value' => null, 'max_value' => null, 'unit' => 'kg/m', 'spec_type' => 'dimensional', 'sort_order' => 6],
                ['product_id' => $tmtId, 'property_en' => '20mm', 'property_ar' => '20 مم', 'value' => '2.470', 'min_value' => null, 'max_value' => null, 'unit' => 'kg/m', 'spec_type' => 'dimensional', 'sort_order' => 7],
                ['product_id' => $tmtId, 'property_en' => '25mm', 'property_ar' => '25 مم', 'value' => '3.850', 'min_value' => null, 'max_value' => null, 'unit' => 'kg/m', 'spec_type' => 'dimensional', 'sort_order' => 8],
                ['product_id' => $tmtId, 'property_en' => '32mm', 'property_ar' => '32 مم', 'value' => '6.310', 'min_value' => null, 'max_value' => null, 'unit' => 'kg/m', 'spec_type' => 'dimensional', 'sort_order' => 9],
            ]);
        }

        // Billets - Chemical + Dimensional specs
        if ($billetId && DB::table('product_specifications')->where('product_id', $billetId)->count() === 0) {
            DB::table('product_specifications')->insert([
                ['product_id' => $billetId, 'property_en' => 'Carbon (C)', 'property_ar' => 'الكربون (C)', 'value' => null, 'min_value' => null, 'max_value' => '0.22', 'unit' => '%', 'spec_type' => 'chemical', 'sort_order' => 1],
                ['product_id' => $billetId, 'property_en' => 'Manganese (Mn)', 'property_ar' => 'المنغنيز (Mn)', 'value' => null, 'min_value' => null, 'max_value' => '0.60', 'unit' => '%', 'spec_type' => 'chemical', 'sort_order' => 2],
                ['product_id' => $billetId, 'property_en' => 'Silicon (Si)', 'property_ar' => 'السيليكون (Si)', 'value' => null, 'min_value' => null, 'max_value' => '0.35', 'unit' => '%', 'spec_type' => 'chemical', 'sort_order' => 3],
                ['product_id' => $billetId, 'property_en' => 'Phosphorus (P)', 'property_ar' => 'الفوسفور (P)', 'value' => null, 'min_value' => null, 'max_value' => '0.045', 'unit' => '%', 'spec_type' => 'chemical', 'sort_order' => 4],
                ['product_id' => $billetId, 'property_en' => 'Sulphur (S)', 'property_ar' => 'الكبريت (S)', 'value' => null, 'min_value' => null, 'max_value' => '0.045', 'unit' => '%', 'spec_type' => 'chemical', 'sort_order' => 5],
                ['product_id' => $billetId, 'property_en' => 'Cross Section', 'property_ar' => 'المقطع العرضي', 'value' => '130 x 130', 'min_value' => null, 'max_value' => null, 'unit' => 'mm', 'spec_type' => 'dimensional', 'sort_order' => 1],
                ['product_id' => $billetId, 'property_en' => 'Length', 'property_ar' => 'الطول', 'value' => '6 - 12', 'min_value' => '6', 'max_value' => '12', 'unit' => 'm', 'spec_type' => 'dimensional', 'sort_order' => 2],
            ]);
        }
    }

    public function down(): void
    {
        $tmtId = DB::table('products')->where('slug', 'tmt-bars')->value('id');
        $billetId = DB::table('products')->where('slug', 'billets')->value('id');

        if ($tmtId) {
            DB::table('product_specifications')->where('product_id', $tmtId)->delete();
        }
        if ($billetId) {
            DB::table('product_specifications')->where('product_id', $billetId)->delete();
        }

        DB::table('products')->whereIn('slug', ['tmt-bars', 'billets'])->delete();
    }
};

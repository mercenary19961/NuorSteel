<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('products')->where('slug', 'tmt-bars')->update([
            'short_description_en' => 'Thermo-Mechanically Treated reinforcement steel bars manufactured to ASTM A615 standards.',
            'short_description_ar' => 'قضبان حديد تسليح معالجة حرارياً وميكانيكياً مصنعة وفق معايير ASTM A615.',
            'description_en' => 'Thermo-Mechanically Treated reinforcement steel bars manufactured to ASTM A615 standards. Available in 8mm to 32mm diameters for residential, commercial, and infrastructure projects. Our TMT bars offer superior strength, ductility, and weldability, making them ideal for seismic zones and demanding structural applications.',
            'description_ar' => 'قضبان حديد تسليح معالجة حرارياً وميكانيكياً مصنعة وفق معايير ASTM A615. متوفرة بأقطار من 8 مم إلى 32 مم للمشاريع السكنية والتجارية ومشاريع البنية التحتية. توفر قضبان التسليح لدينا قوة فائقة ومرونة وقابلية لحام ممتازة.',
        ]);
    }

    public function down(): void
    {
        DB::table('products')->where('slug', 'tmt-bars')->update([
            'short_description_en' => 'Thermo-Mechanically Treated reinforcement steel bars manufactured to BS 4449:2005, Grade B500B standards.',
            'short_description_ar' => 'قضبان حديد تسليح معالجة حرارياً وميكانيكياً مصنعة وفق معايير BS 4449:2005، الدرجة B500B.',
            'description_en' => 'Thermo-Mechanically Treated reinforcement steel bars manufactured to BS 4449:2005, Grade B500B standards. Available in 8mm to 32mm diameters for residential, commercial, and infrastructure projects. Our TMT bars offer superior strength, ductility, and weldability, making them ideal for seismic zones and demanding structural applications.',
            'description_ar' => 'قضبان حديد تسليح معالجة حرارياً وميكانيكياً مصنعة وفق معايير BS 4449:2005، الدرجة B500B. متوفرة بأقطار من 8 مم إلى 32 مم للمشاريع السكنية والتجارية ومشاريع البنية التحتية. توفر قضبان التسليح لدينا قوة فائقة ومرونة وقابلية لحام ممتازة.',
        ]);
    }
};

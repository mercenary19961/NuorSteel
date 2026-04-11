<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('products')->where('slug', 'tmt-bars')->update(['name_ar' => 'حديد التسليح']);
        DB::table('products')->where('slug', 'billets')->update(['name_ar' => 'ستيل بِليت']);
    }

    public function down(): void
    {
        DB::table('products')->where('slug', 'tmt-bars')->update(['name_ar' => 'قضبان حديد التسليح']);
        DB::table('products')->where('slug', 'billets')->update(['name_ar' => 'كتل الصلب']);
    }
};

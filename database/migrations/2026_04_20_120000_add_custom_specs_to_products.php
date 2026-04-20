<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('highlights')->nullable()->after('description_ar');
            $table->json('spec_icons')->nullable()->after('highlights');
            $table->json('spec_table')->nullable()->after('spec_icons');
            $table->json('features')->nullable()->after('spec_table');
            $table->boolean('show_quote_tab')->default(true)->after('features');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['highlights', 'spec_icons', 'spec_table', 'features', 'show_quote_tab']);
        });
    }
};

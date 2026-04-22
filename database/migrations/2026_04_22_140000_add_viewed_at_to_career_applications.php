<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('career_applications', function (Blueprint $table) {
            $table->timestamp('viewed_at')->nullable()->after('admin_notes');
        });
    }

    public function down(): void
    {
        Schema::table('career_applications', function (Blueprint $table) {
            $table->dropColumn('viewed_at');
        });
    }
};

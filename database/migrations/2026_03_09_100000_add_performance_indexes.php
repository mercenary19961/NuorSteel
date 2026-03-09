<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('media', function (Blueprint $table) {
            $table->index('folder');
            $table->index('mime_type');
        });

        Schema::table('contact_submissions', function (Blueprint $table) {
            $table->index('is_read');
            $table->index('is_archived');
            $table->index('request_type');
        });

        Schema::table('settings', function (Blueprint $table) {
            $table->index('group');
        });
    }

    public function down(): void
    {
        Schema::table('media', function (Blueprint $table) {
            $table->dropIndex(['folder']);
            $table->dropIndex(['mime_type']);
        });

        Schema::table('contact_submissions', function (Blueprint $table) {
            $table->dropIndex(['is_read']);
            $table->dropIndex(['is_archived']);
            $table->dropIndex(['request_type']);
        });

        Schema::table('settings', function (Blueprint $table) {
            $table->dropIndex(['group']);
        });
    }
};

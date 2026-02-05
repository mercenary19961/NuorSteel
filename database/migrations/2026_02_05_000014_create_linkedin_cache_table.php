<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('linkedin_cache', function (Blueprint $table) {
            $table->id();
            $table->string('post_id', 100)->unique();
            $table->text('content');
            $table->string('image_url', 500)->nullable();
            $table->string('post_url', 500);
            $table->timestamp('posted_at')->nullable();
            $table->timestamp('synced_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('linkedin_cache');
    }
};

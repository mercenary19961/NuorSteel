<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');
            $table->string('name_ar');
            $table->string('logo_path');
            $table->foreignId('logo_media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->enum('size_tier', ['sm', 'md', 'lg', 'xl'])->default('md');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_visible', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};

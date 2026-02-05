<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_content', function (Blueprint $table) {
            $table->id();
            $table->string('page', 50);
            $table->string('section', 50);
            $table->string('key', 50);
            $table->text('content_en')->nullable();
            $table->text('content_ar')->nullable();
            $table->enum('type', ['text', 'textarea', 'html'])->default('text');
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('updated_at')->nullable();

            $table->unique(['page', 'section', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_content');
    }
};

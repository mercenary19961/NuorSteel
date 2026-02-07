<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('title_en');
            $table->string('title_ar');
            $table->enum('category', ['esg', 'quality', 'governance']);
            $table->text('description_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->string('file_path');
            $table->foreignId('thumbnail_id')->nullable()->constrained('media')->nullOnDelete();
            $table->date('issue_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};

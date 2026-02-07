<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('career_listings', function (Blueprint $table) {
            $table->id();
            $table->string('title_en');
            $table->string('title_ar');
            $table->string('slug')->unique();
            $table->text('description_en');
            $table->text('description_ar');
            $table->text('requirements_en')->nullable();
            $table->text('requirements_ar')->nullable();
            $table->string('location', 100)->nullable();
            $table->enum('employment_type', ['full-time', 'part-time', 'contract'])->default('full-time');
            $table->enum('status', ['draft', 'open', 'closed'])->default('draft');
            $table->timestamp('expires_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('career_listings');
    }
};

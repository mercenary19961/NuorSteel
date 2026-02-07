<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_specifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('property_en', 100);
            $table->string('property_ar', 100);
            $table->string('min_value', 50)->nullable();
            $table->string('max_value', 50)->nullable();
            $table->string('value', 100)->nullable();
            $table->string('unit', 20)->nullable();
            $table->enum('spec_type', ['chemical', 'mechanical', 'dimensional']);
            $table->integer('sort_order')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_specifications');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $newAr = 'شركة حديد نور للصناعة هي شركة رائدة في صناعة الحديد في المملكة العربية السعودية، تأسست عام 2010 ويقع مقرها الرئيسي في المدينة الصناعية بالخرج. تأسست في الأصل كشركة تجارة حديد، وتطورت شركة حديد نور لتصبح منتجاً متكاملاً للحديد بمرافق تصنيع متقدمة متخصصة في إنتاج كتل الحديد عالية الجودة وحديد التسليح.';

        DB::table('site_content')
            ->where('page', 'about')
            ->where('section', 'overview')
            ->where('key', 'description')
            ->update([
                'content_ar' => $newAr,
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        $oldAr = 'شركة حديد نور للصناعة هي شركة رائدة في صناعة الحديد في المملكة العربية السعودية، تأسست عام 2010 ويقع مقرها الرئيسي في المدينة الصناعية بالخرج. تأسست في الأصل كشركة تجارة حديد، وتطورت شركة نور للحديد لتصبح منتجاً متكاملاً للحديد بمرافق تصنيع متقدمة متخصصة في إنتاج كتل الحديد عالية الجودة وحديد التسليح.';

        DB::table('site_content')
            ->where('page', 'about')
            ->where('section', 'overview')
            ->where('key', 'description')
            ->update([
                'content_ar' => $oldAr,
                'updated_at' => now(),
            ]);
    }
};

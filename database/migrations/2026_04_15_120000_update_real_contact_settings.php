<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $settings = [
            ['key' => 'company_phone',      'value' => '+966543781868,+966545198760'],
            ['key' => 'company_email',      'value' => 'info@nuorsteel.com,Nuorsteel@hotmail.com'],
            ['key' => 'company_address_en', 'value' => '59, Al Kharj Industrial City (Modon), Riyadh 16416'],
            ['key' => 'company_address_ar', 'value' => '٥٩، مدينة الخرج الصناعية (مدن)، الرياض 16416'],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->where('key', $setting['key'])->update(['value' => $setting['value']]);
        }
    }

    public function down(): void
    {
        $settings = [
            ['key' => 'company_phone',      'value' => '+966 XX XXX XXXX'],
            ['key' => 'company_email',      'value' => 'info@nuorsteel.com'],
            ['key' => 'company_address_en', 'value' => 'Riyadh, Saudi Arabia'],
            ['key' => 'company_address_ar', 'value' => 'الرياض، المملكة العربية السعودية'],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->where('key', $setting['key'])->update(['value' => $setting['value']]);
        }
    }
};

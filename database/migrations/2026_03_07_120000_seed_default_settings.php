<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $settings = [
            ['key' => 'company_phone', 'value' => '+966 XX XXX XXXX', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'company_email', 'value' => 'info@nuorsteel.com', 'type' => 'email', 'group' => 'contact'],
            ['key' => 'company_address_en', 'value' => 'Riyadh, Saudi Arabia', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'company_address_ar', 'value' => 'الرياض، المملكة العربية السعودية', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'linkedin_url', 'value' => 'https://linkedin.com/company/nuorsteel', 'type' => 'url', 'group' => 'contact'],
            ['key' => 'contact_recipients', 'value' => 'info@nuorsteel.com,it@nuorsteel.com', 'type' => 'text', 'group' => 'email'],
            ['key' => 'career_recipients', 'value' => 'careers@nuorsteel.com,hr@nuorsteel.com', 'type' => 'text', 'group' => 'email'],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->updateOrInsert(
                ['key' => $setting['key']],
                $setting
            );
        }
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'company_phone',
            'company_email',
            'company_address_en',
            'company_address_ar',
            'linkedin_url',
            'contact_recipients',
            'career_recipients',
        ])->delete();
    }
};

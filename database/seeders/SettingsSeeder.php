<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General
            ['key' => 'company_name_en', 'value' => 'Nuor Steel Industry Company', 'type' => 'text', 'group' => 'general'],
            ['key' => 'company_name_ar', 'value' => 'شركة نور للصناعات الحديدية', 'type' => 'text', 'group' => 'general'],

            // Contact
            ['key' => 'company_phone', 'value' => '+966 XX XXX XXXX', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'company_email', 'value' => 'info@nuorsteel.com', 'type' => 'email', 'group' => 'contact'],
            ['key' => 'company_address_en', 'value' => 'Riyadh, Saudi Arabia', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'company_address_ar', 'value' => 'الرياض، المملكة العربية السعودية', 'type' => 'text', 'group' => 'contact'],

            // Social / LinkedIn
            ['key' => 'linkedin_url', 'value' => 'https://linkedin.com/company/nuorsteel', 'type' => 'url', 'group' => 'social'],
            ['key' => 'linkedin_organization_id', 'value' => '', 'type' => 'text', 'group' => 'social'],
            ['key' => 'linkedin_access_token', 'value' => '', 'type' => 'text', 'group' => 'social'],

            // Email Recipients
            ['key' => 'contact_recipients', 'value' => 'info@nuorsteel.com,it@nuorsteel.com', 'type' => 'text', 'group' => 'email'],
            ['key' => 'career_recipients', 'value' => 'careers@nuorsteel.com,hr@nuorsteel.com', 'type' => 'text', 'group' => 'email'],

            // Media
            ['key' => 'media_custom_folders', 'value' => '["general"]', 'type' => 'text', 'group' => 'media'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Contact
            ['key' => 'company_phone', 'value' => '+966 XX XXX XXXX', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'company_email', 'value' => 'info@nuorsteel.com', 'type' => 'email', 'group' => 'contact'],
            ['key' => 'company_address_en', 'value' => 'Riyadh, Saudi Arabia', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'company_address_ar', 'value' => 'الرياض، المملكة العربية السعودية', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'linkedin_url', 'value' => 'https://linkedin.com/company/nuorsteel', 'type' => 'url', 'group' => 'contact'],

            // Email Recipients
            ['key' => 'contact_recipients', 'value' => 'info@nuorsteel.com,it@nuorsteel.com', 'type' => 'text', 'group' => 'email'],
            ['key' => 'career_recipients', 'value' => 'careers@nuorsteel.com,hr@nuorsteel.com', 'type' => 'text', 'group' => 'email'],
        ];

        // Remove deprecated settings from previous versions
        Setting::whereIn('key', [
            'company_name_en', 'company_name_ar',
            'linkedin_organization_id', 'linkedin_access_token',
            'media_custom_folders',
        ])->delete();

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}

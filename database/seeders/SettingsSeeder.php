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
            ['key' => 'company_phone', 'value' => '+966543781868,+966545198760', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'company_email', 'value' => 'info@nuorsteel.com,Nuorsteel@hotmail.com', 'type' => 'email', 'group' => 'contact'],
            ['key' => 'company_address_en', 'value' => '59, Al Kharj Industrial City (Modon), Riyadh 16416', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'company_address_ar', 'value' => '٥٩، مدينة الخرج الصناعية (مدن)، الرياض 16416', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'linkedin_url', 'value' => 'https://www.linkedin.com/company/nuor-steel/', 'type' => 'url', 'group' => 'contact'],

            // Email Recipients
            ['key' => 'contact_recipients', 'value' => 'info@nuorsteel.com,it@nuorsteel.com', 'type' => 'text', 'group' => 'email'],
            ['key' => 'career_recipients', 'value' => 'careers@nuorsteel.com,hr@nuorsteel.com', 'type' => 'text', 'group' => 'email'],

            // Location (Google Maps)
            ['key' => 'google_maps_embed_url', 'value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3647.8916501143544!2d47.2764315!3d23.893460500000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e253be3c6810079%3A0xeb1ab68ffa1213e1!2zTnVvciBTdGVlbCBJbmR1c3RyeSBDb21wYW55ICjYtNix2YPYqSDYrdiv2YrYryDZhtmI2LEg2YTZhNi12YbYp9i52Kkp!5e0!3m2!1sen!2sjo!4v1776668791340!5m2!1sen!2sjo', 'type' => 'url', 'group' => 'location'],
            ['key' => 'google_maps_place_url', 'value' => 'https://www.google.com/maps/place/Nuor+Steel+Industry+Company/@23.8934605,47.2764315,17z', 'type' => 'url', 'group' => 'location'],
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

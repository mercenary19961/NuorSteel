<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $settings = [
            [
                'key' => 'google_maps_embed_url',
                'value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3647.8916501143544!2d47.2764315!3d23.893460500000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e253be3c6810079%3A0xeb1ab68ffa1213e1!2zTnVvciBTdGVlbCBJbmR1c3RyeSBDb21wYW55ICjYtNix2YPYqSDYrdiv2YrYryDZhtmI2LEg2YTZhNi12YbYp9i52Kkp!5e0!3m2!1sen!2sjo!4v1776668791340!5m2!1sen!2sjo',
                'type' => 'url',
                'group' => 'location',
            ],
            [
                'key' => 'google_maps_place_url',
                'value' => 'https://www.google.com/maps/place/Nuor+Steel+Industry+Company/@23.8934605,47.2764315,17z',
                'type' => 'url',
                'group' => 'location',
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->updateOrInsert(
                ['key' => $setting['key']],
                array_merge($setting, ['updated_at' => $now])
            );
        }
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'google_maps_embed_url',
            'google_maps_place_url',
        ])->delete();
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $settings = [
            ['key' => 'facebook_url',  'value' => 'https://web.facebook.com/nuorsteelco', 'type' => 'url', 'group' => 'contact'],
            ['key' => 'instagram_url', 'value' => 'https://www.instagram.com/nuorsteelco', 'type' => 'url', 'group' => 'contact'],
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
            'facebook_url',
            'instagram_url',
        ])->delete();
    }
};

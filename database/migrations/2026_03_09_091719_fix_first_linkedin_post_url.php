<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('linkedin_cache')
            ->where('post_id', 'urn:li:ugcPost:7301318483181522944')
            ->update([
                'post_url' => 'https://www.linkedin.com/feed/update/urn:li:ugcPost:7301318483181522944',
            ]);
    }

    public function down(): void
    {
        DB::table('linkedin_cache')
            ->where('post_id', 'urn:li:ugcPost:7301318483181522944')
            ->update([
                'post_url' => 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7301318483181522944',
            ]);
    }
};

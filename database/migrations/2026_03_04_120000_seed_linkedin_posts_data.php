<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $posts = [
            [
                'post_id' => 'urn:li:ugcPost:7301318483181522944',
                'content' => 'first',
                'post_url' => 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7301318483181522944',
                'posted_at' => '2026-02-23 07:59:31',
                'sort_order' => 0,
            ],
            [
                'post_id' => 'urn:li:activity:7375903792640466944',
                'content' => 'Saudi National Day',
                'post_url' => 'https://www.linkedin.com/posts/nuor-steel_saudinationalday95-vision2030-saudiarabia-activity-7375903792640466944-yw1F',
                'posted_at' => '2026-02-23 08:01:28',
                'sort_order' => 1,
            ],
            [
                'post_id' => 'urn:li:activity:7429817806403031040',
                'content' => 'Ramadan',
                'post_url' => 'https://www.linkedin.com/posts/nuor-steel_aezaetaeeaepaeuabraeraezaeyaet-ramadan-activity-7429817806403031040-Z5o-',
                'posted_at' => '2026-02-23 08:02:06',
                'sort_order' => 2,
            ],
            [
                'post_id' => 'urn:li:activity:7429809736721784832',
                'content' => 'Nuor Steel Industry',
                'post_url' => 'https://www.linkedin.com/posts/nuor-steel_aezaetaeeaepaeuabraeraezaeyaet-aezaetaeeaepaeu-activity-7429809736721784832-VAWy',
                'posted_at' => '2026-02-23 08:04:31',
                'sort_order' => 3,
            ],
            [
                'post_id' => 'urn:li:activity:7431262410188980224',
                'content' => 'Last',
                'post_url' => 'https://www.linkedin.com/posts/nuor-steel_aeyaewaetabraepaesaesaelaebaeyaeb-aeyaewaetabraeqaexaeyaeuaep-activity-7431262410188980224-Gczj',
                'posted_at' => '2026-02-23 08:05:47',
                'sort_order' => 4,
            ],
        ];

        $now = now();

        foreach ($posts as $post) {
            DB::table('linkedin_cache')->updateOrInsert(
                ['post_id' => $post['post_id']],
                array_merge($post, [
                    'is_active' => true,
                    'synced_at' => $now,
                ])
            );
        }
    }

    public function down(): void
    {
        DB::table('linkedin_cache')->whereIn('post_id', [
            'urn:li:ugcPost:7301318483181522944',
            'urn:li:activity:7375903792640466944',
            'urn:li:activity:7429817806403031040',
            'urn:li:activity:7429809736721784832',
            'urn:li:activity:7431262410188980224',
        ])->delete();
    }
};

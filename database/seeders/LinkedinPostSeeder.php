<?php

namespace Database\Seeders;

use App\Models\LinkedinCache;
use Illuminate\Database\Seeder;

class LinkedinPostSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            [
                'post_id' => 'urn:li:ugcPost:7301318483181522944',
                'content' => 'first',
                'post_url' => 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7301318483181522944',
                'posted_at' => '2026-02-23 07:59:31',
            ],
            [
                'post_id' => 'urn:li:activity:7375903792640466944',
                'content' => 'Saudi National Day',
                'post_url' => 'https://www.linkedin.com/posts/nuor-steel_saudinationalday95-vision2030-saudiarabia-activity-7375903792640466944-yw1F',
                'posted_at' => '2026-02-23 08:01:28',
            ],
            [
                'post_id' => 'urn:li:activity:7429817806403031040',
                'content' => 'Ramadan',
                'post_url' => 'https://www.linkedin.com/posts/nuor-steel_aezaetaeeaepaeuabraeraezaeyaet-ramadan-activity-7429817806403031040-Z5o-',
                'posted_at' => '2026-02-23 08:02:06',
            ],
            [
                'post_id' => 'urn:li:activity:7429809736721784832',
                'content' => 'Nuor Steel Industry',
                'post_url' => 'https://www.linkedin.com/posts/nuor-steel_aezaetaeeaepaeuabraeraezaeyaet-aezaetaeeaepaeu-activity-7429809736721784832-VAWy',
                'posted_at' => '2026-02-23 08:04:31',
            ],
            [
                'post_id' => 'urn:li:activity:7431262410188980224',
                'content' => 'Last',
                'post_url' => 'https://www.linkedin.com/posts/nuor-steel_aeyaewaetabraepaesaesaelaebaeyaeb-aeyaewaetabraeqaexaeyaeuaep-activity-7431262410188980224-Gczj',
                'posted_at' => '2026-02-23 08:05:47',
            ],
        ];

        foreach ($posts as $index => $post) {
            LinkedinCache::updateOrCreate(
                ['post_id' => $post['post_id']],
                [
                    'content' => $post['content'],
                    'post_url' => $post['post_url'],
                    'posted_at' => $post['posted_at'],
                    'synced_at' => now(),
                    'is_active' => true,
                    'sort_order' => $index,
                ]
            );
        }
    }
}

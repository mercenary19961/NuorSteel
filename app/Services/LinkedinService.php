<?php

namespace App\Services;

use App\Models\LinkedinCache;
use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LinkedinService
{
    private string $baseUrl = 'https://api.linkedin.com/v2';

    public function syncPosts(): int
    {
        $accessToken = $this->getSetting('linkedin_access_token');
        $organizationId = $this->getSetting('linkedin_organization_id');

        if (!$accessToken || !$organizationId) {
            Log::warning('LinkedIn sync skipped: missing access_token or organization_id in settings.');
            return 0;
        }

        try {
            $posts = $this->fetchOrganizationPosts($accessToken, $organizationId);

            $synced = 0;
            foreach ($posts as $post) {
                LinkedinCache::syncPost($post);
                $synced++;
            }

            Log::info("LinkedIn sync completed: {$synced} posts synced.");
            return $synced;
        } catch (\Exception $e) {
            Log::error('LinkedIn sync failed: ' . $e->getMessage());
            return 0;
        }
    }

    private function fetchOrganizationPosts(string $accessToken, string $organizationId): array
    {
        $response = Http::withToken($accessToken)
            ->withHeaders([
                'LinkedIn-Version' => '202401',
                'X-Restli-Protocol-Version' => '2.0.0',
            ])
            ->get("{$this->baseUrl}/posts", [
                'author' => "urn:li:organization:{$organizationId}",
                'q' => 'author',
                'count' => 10,
                'sortBy' => 'LAST_MODIFIED',
            ]);

        if ($response->failed()) {
            throw new \RuntimeException(
                "LinkedIn API error ({$response->status()}): " . $response->body()
            );
        }

        $elements = $response->json('elements', []);

        return array_map(function ($element) use ($organizationId) {
            $postId = $element['id'] ?? ($element['urn'] ?? '');
            $content = $element['commentary'] ?? '';
            $imageUrl = $this->extractImageUrl($element);
            $postedAt = isset($element['createdAt'])
                ? date('Y-m-d H:i:s', $element['createdAt'] / 1000)
                : now()->toDateTimeString();

            $postUrn = str_replace('urn:li:share:', '', $postId);
            $postUrl = "https://www.linkedin.com/feed/update/{$postId}";

            return [
                'post_id' => $postId,
                'content' => strip_tags($content),
                'image_url' => $imageUrl,
                'post_url' => $postUrl,
                'posted_at' => $postedAt,
            ];
        }, $elements);
    }

    private function extractImageUrl(array $element): ?string
    {
        $content = $element['content'] ?? [];

        if (isset($content['media']['id'])) {
            return $content['media']['id'];
        }

        if (isset($content['multiImage']['images'][0]['id'])) {
            return $content['multiImage']['images'][0]['id'];
        }

        return null;
    }

    private function getSetting(string $key): ?string
    {
        return Setting::where('key', $key)->value('value');
    }
}

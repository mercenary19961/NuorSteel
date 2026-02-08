<?php

namespace App\Console\Commands;

use App\Models\LinkedinCache;
use App\Services\LinkedinService;
use Illuminate\Console\Command;

class SyncLinkedinPosts extends Command
{
    protected $signature = 'linkedin:sync {--force : Force sync even if within threshold}';
    protected $description = 'Sync latest LinkedIn posts from the company page';

    public function handle(LinkedinService $service): int
    {
        if (!$this->option('force') && !LinkedinCache::needsSync()) {
            $this->info('LinkedIn posts are up to date. Use --force to sync anyway.');
            return self::SUCCESS;
        }

        $this->info('Syncing LinkedIn posts...');

        $count = $service->syncPosts();

        if ($count > 0) {
            $this->info("Successfully synced {$count} posts.");
        } else {
            $this->warn('No posts were synced. Check logs for details.');
        }

        return self::SUCCESS;
    }
}

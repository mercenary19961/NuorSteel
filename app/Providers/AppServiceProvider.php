<?php

namespace App\Providers;

use App\Services\StorageReconciler;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Throwable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Skip during console commands (build-time config:cache, artisan, tests, migrations).
        // Reason: the reconciler needs files on disk only for HTTP request serving. Running
        // it during Railpack's build-container `config:cache` step ALSO fails because the
        // build container cannot reach mysql.railway.internal (private network is runtime-only),
        // and our Cache store is database-backed — so Cache::has() would blow up the build.
        if ($this->app->runningInConsole()) {
            return;
        }

        $this->reconcileStorageOncePerDeploy();
    }

    /**
     * Ensures baseline seed files (certificates, product images, partner logos) exist on the
     * Railway persistent volume. Runs once per deploy — the cache flag is wiped by
     * `php artisan optimize:clear` during Railpack startup, so the reconciler re-runs after
     * every deploy and whenever the volume is recreated.
     *
     * Everything (including the Cache::has check) is wrapped in try/catch so a transient
     * cache/DB failure never takes down the app boot.
     */
    private function reconcileStorageOncePerDeploy(): void
    {
        try {
            if (Cache::has('storage.reconciled')) {
                return;
            }

            $copied = $this->app->make(StorageReconciler::class)->reconcile();
            Cache::forever('storage.reconciled', true);

            if ($copied > 0) {
                Log::info("StorageReconciler: restored {$copied} baseline file(s) to the volume");
            }
        } catch (Throwable $e) {
            Log::error('StorageReconciler failed: ' . $e->getMessage());
        }
    }
}

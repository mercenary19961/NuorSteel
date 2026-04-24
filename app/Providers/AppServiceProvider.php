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
        $this->reconcileStorageOncePerDeploy();
    }

    /**
     * Ensures baseline seed files (certificates, product images, partner logos) exist on the
     * Railway persistent volume. Runs once per deploy — the cache flag is wiped by
     * `php artisan optimize:clear` during Railpack startup, so the reconciler re-runs after
     * every deploy and whenever the volume is recreated.
     *
     * Wrapped in try/catch so a misconfigured source file never takes down the app.
     */
    private function reconcileStorageOncePerDeploy(): void
    {
        if (Cache::has('storage.reconciled')) {
            return;
        }

        try {
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

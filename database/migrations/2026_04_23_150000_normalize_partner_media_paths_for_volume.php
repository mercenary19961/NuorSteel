<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Rewrites partner media rows from random filenames (e.g. media/xR7dFg82mKlP9vB1AzQc.webp,
 * created by the seed migration on an ephemeral filesystem) to deterministic paths
 * (media/partners/<slug>.webp) that StorageReconciler can repopulate from public/images/.
 *
 * Safe to run against fresh databases — it just updates whatever partner rows exist.
 */
return new class extends Migration
{
    public function up(): void
    {
        // original_filename (set by the seed migration) → deterministic path on volume
        $map = [
            'aramco.webp'             => 'media/partners/aramco.webp',
            'vision 2030.webp'        => 'media/partners/vision-2030.webp',
            'SAUDI MADE.webp'         => 'media/partners/saudi-made.webp',
            'modon.webp'              => 'media/partners/modon.webp',
            'nhc.webp'                => 'media/partners/nhc.webp',
            'roshen.webp'             => 'media/partners/roshen.webp',
            'ASTM.webp'               => 'media/partners/astm.webp',
            'ISO.webp'                => 'media/partners/iso.webp',
            'SASO LOGO.webp'          => 'media/partners/saso.webp',
            'epd.webp'                => 'media/partners/epd.webp',
            'HPD.webp'                => 'media/partners/hpd.webp',
            'qarya.webp'              => 'media/partners/qarya.webp',
            'tasnee3.webp'            => 'media/partners/tasnee3.webp',
            'WATER CO.webp'           => 'media/partners/water-co.webp',
            'industry ministry.webp'  => 'media/partners/industry-ministry.webp',
            'TRANSFER MINISTRY.webp'  => 'media/partners/transport-ministry.webp',
        ];

        $partnerRows = DB::table('partners')
            ->whereNotNull('logo_media_id')
            ->get();

        foreach ($partnerRows as $partner) {
            $media = DB::table('media')
                ->where('id', $partner->logo_media_id)
                ->whereNull('deleted_at')
                ->first();

            if (!$media) {
                continue;
            }

            $deterministic = $map[$media->original_filename] ?? null;
            if (!$deterministic) {
                continue;
            }

            $filename = basename($deterministic);

            DB::table('media')
                ->where('id', $media->id)
                ->update([
                    'path' => $deterministic,
                    'filename' => $filename,
                    'folder' => 'partners',
                ]);

            DB::table('partners')
                ->where('id', $partner->id)
                ->update([
                    'logo_path' => $deterministic,
                    'updated_at' => now(),
                ]);
        }
    }

    public function down(): void
    {
        // No-op: path normalization is idempotent and doesn't need to be reversed.
    }
};

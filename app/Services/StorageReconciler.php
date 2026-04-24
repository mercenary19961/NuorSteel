<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * Copies baseline seed files into the private storage disk (Railway volume) when missing.
 *
 * Why this exists:
 *   storage/app/private/ is a persistent Railway volume. On first mount the volume is empty,
 *   and files baked into the Docker image at that path are shadowed by the volume. This
 *   service restores the baseline by copying from locations that ARE visible at runtime
 *   (storage/seeds/ and public/images/...) into the volume. Admin-uploaded files on the
 *   volume are never touched — they sit alongside the reconciled seed files untouched.
 *
 * Safe to run on every boot: each step short-circuits when the target file already exists.
 */
class StorageReconciler
{
    /**
     * [source (relative to base_path), target (relative to private storage disk)]
     *
     * Source paths live OUTSIDE the volume mount so they remain readable at runtime.
     * Target paths match the DB rows inserted by the seed migrations + the partner/product
     * path-normalization migrations.
     */
    private const MAPPINGS = [
        // Certificates — baked into image at storage/seeds/, restored to the volume at certificates/
        ['storage/seeds/certificates/saudi-made-certificate.pdf',       'certificates/saudi-made-certificate.pdf'],
        ['storage/seeds/certificates/iso-9001-certificate.pdf',         'certificates/iso-9001-certificate.pdf'],
        ['storage/seeds/certificates/nuor-steel-rebar-hpd.pdf',         'certificates/nuor-steel-rebar-hpd.pdf'],
        ['storage/seeds/certificates/nuor-steel-duns-certification.pdf','certificates/nuor-steel-duns-certification.pdf'],
        ['storage/seeds/certificates/ncec-2026.pdf',                    'certificates/ncec-2026.pdf'],
        ['storage/seeds/certificates/epd-hub-3476.pdf',                 'certificates/epd-hub-3476.pdf'],
        ['storage/seeds/certificates/iso-45001-certificate.pdf',        'certificates/iso-45001-certificate.pdf'],
        ['storage/seeds/certificates/iso-14001-certificate.pdf',        'certificates/iso-14001-certificate.pdf'],
        ['storage/seeds/certificates/aramco-registration-letter.pdf',   'certificates/aramco-registration-letter.pdf'],

        // Products — sourced from public/ renders, restored to media/<slug>-product.png
        ['public/images/home/products/tmt-bars-desktop.png',            'media/tmt-bars-product.png'],
        ['public/images/home/products/billets-desktop.png',             'media/billets-product.png'],

        // Partners — sourced from public/ logos, restored to media/partners/<slug>.webp
        ['public/images/home/partners/aramco.webp',                     'media/partners/aramco.webp'],
        ['public/images/home/partners/vision 2030.webp',                'media/partners/vision-2030.webp'],
        ['public/images/home/partners/SAUDI MADE.webp',                 'media/partners/saudi-made.webp'],
        ['public/images/home/partners/modon.webp',                      'media/partners/modon.webp'],
        ['public/images/home/partners/nhc.webp',                        'media/partners/nhc.webp'],
        ['public/images/home/partners/roshen.webp',                     'media/partners/roshen.webp'],
        ['public/images/home/partners/ASTM.webp',                       'media/partners/astm.webp'],
        ['public/images/home/partners/ISO.webp',                        'media/partners/iso.webp'],
        ['public/images/home/partners/SASO LOGO.webp',                  'media/partners/saso.webp'],
        ['public/images/home/partners/epd.webp',                        'media/partners/epd.webp'],
        ['public/images/home/partners/HPD.webp',                        'media/partners/hpd.webp'],
        ['public/images/home/partners/qarya.webp',                      'media/partners/qarya.webp'],
        ['public/images/home/partners/tasnee3.webp',                    'media/partners/tasnee3.webp'],
        ['public/images/home/partners/WATER CO.webp',                   'media/partners/water-co.webp'],
        ['public/images/home/partners/industry ministry.webp',          'media/partners/industry-ministry.webp'],
        ['public/images/home/partners/TRANSFER MINISTRY.webp',          'media/partners/transport-ministry.webp'],
    ];

    public function reconcile(): int
    {
        $copied = 0;

        foreach (self::MAPPINGS as [$source, $target]) {
            if (Storage::exists($target)) {
                continue;
            }

            $sourcePath = base_path($source);
            if (!file_exists($sourcePath)) {
                Log::warning("StorageReconciler: source missing {$sourcePath}");
                continue;
            }

            Storage::put($target, file_get_contents($sourcePath));
            $copied++;
        }

        return $copied;
    }
}

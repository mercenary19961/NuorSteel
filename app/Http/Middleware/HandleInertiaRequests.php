<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    private ?array $cachedSettings = null;
    /**
     * The root template that is loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'avatar_path' => $request->user()->avatar_path,
                ] : null,
            ],
            'locale' => session('locale', 'en'),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'siteSettings' => fn () => $this->getSiteSettings(),
            'turnstileSiteKey' => fn () => config('services.turnstile.site_key'),
            'ziggy' => function () use ($request) {
                $ziggy = new Ziggy;

                if (!$request->user()) {
                    $ziggy = $ziggy->filter(['!admin.*', '!logout']);
                }

                return [
                    ...$ziggy->toArray(),
                    'location' => $request->url(),
                ];
            },
        ]);
    }

    private function getSiteSettings(): array
    {
        if ($this->cachedSettings === null) {
            $this->cachedSettings = Setting::whereIn('key', [
                'company_phone', 'company_email',
                'company_address_en', 'company_address_ar',
                'linkedin_url', 'facebook_url', 'instagram_url',
                'google_maps_embed_url', 'google_maps_place_url',
            ])->pluck('value', 'key')->toArray();
        }

        $addressKey = session('locale', 'en') === 'ar' ? 'company_address_ar' : 'company_address_en';

        return [
            'phone' => $this->cachedSettings['company_phone'] ?? '',
            'email' => $this->cachedSettings['company_email'] ?? '',
            'address' => $this->cachedSettings[$addressKey] ?? '',
            'linkedin_url' => $this->cachedSettings['linkedin_url'] ?? '',
            'facebook_url' => $this->cachedSettings['facebook_url'] ?? '',
            'instagram_url' => $this->cachedSettings['instagram_url'] ?? '',
            'google_maps_embed_url' => $this->cachedSettings['google_maps_embed_url'] ?? '',
            'google_maps_place_url' => $this->cachedSettings['google_maps_place_url'] ?? '',
        ];
    }
}

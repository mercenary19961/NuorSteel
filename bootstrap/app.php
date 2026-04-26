<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Trust only Cloudflare's published IP ranges (production hops through CF)
        // plus RFC 1918 / Railway internal ranges (the FrankenPHP container
        // sees the Railway router as the immediate upstream). This prevents
        // X-Forwarded-For spoofing from arbitrary internet clients.
        //
        // Note: this is one layer. To fully prevent spoofing, also enforce
        // Cloudflare-only origin access (Authenticated Origin Pulls or a secret
        // header verified at the app edge) so the Railway URL is unreachable
        // outside of CF. Without that, an attacker who hits the Railway origin
        // directly could still spoof X-Forwarded-For via the Railway proxy hop.
        //
        // Cloudflare list refreshed from https://www.cloudflare.com/ips/ — keep
        // an eye on that page; CF rarely changes it but does occasionally add ranges.
        $middleware->trustProxies(at: [
            // RFC 1918 + Railway internal (immediate upstream proxy hop)
            '10.0.0.0/8',
            '172.16.0.0/12',
            '192.168.0.0/16',
            '127.0.0.1',
            '100.64.0.0/10',
            // Cloudflare IPv4
            '173.245.48.0/20',
            '103.21.244.0/22',
            '103.22.200.0/22',
            '103.31.4.0/22',
            '141.101.64.0/18',
            '108.162.192.0/18',
            '190.93.240.0/20',
            '188.114.96.0/20',
            '197.234.240.0/22',
            '198.41.128.0/17',
            '162.158.0.0/15',
            '104.16.0.0/13',
            '104.24.0.0/14',
            '172.64.0.0/13',
            '131.0.72.0/22',
            // Cloudflare IPv6
            '2400:cb00::/32',
            '2606:4700::/32',
            '2803:f800::/32',
            '2405:b500::/32',
            '2405:8100::/32',
            '2a06:98c0::/29',
            '2c0f:f248::/32',
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\SecurityHeaders::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \App\Http\Middleware\SetLocale::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'locale' => \App\Http\Middleware\SetLocale::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Per-IP throttle on POST /admin/login (throttle:10,15) hits the user with
        // a default 429 page that boots them off the login form. Catch it and
        // redirect back so they see the same inline error the per-email throttle
        // already shows, with their email preserved.
        $exceptions->render(function (\Illuminate\Http\Exceptions\ThrottleRequestsException $e, \Illuminate\Http\Request $request) {
            if ($request->isMethod('POST') && $request->is('admin/login')) {
                $retryAfter = (int) ($e->getHeaders()['Retry-After'] ?? 60);
                $minutes = max(1, (int) ceil($retryAfter / 60));

                return redirect()->route('login')
                    ->withErrors([
                        'email' => "Too many login attempts from this network. Please try again in {$minutes} minute(s).",
                    ])
                    ->withInput($request->only('email'));
            }
        });
    })->create();

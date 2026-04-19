<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        if (!app()->isLocal()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            $response->headers->set('Content-Security-Policy', $this->buildCsp());
        }

        return $response;
    }

    private function buildCsp(): string
    {
        // 'unsafe-inline' on script-src is required for the inline JSON-LD blocks in
        // resources/views/partials/structured-data.blade.php and any Vite runtime hooks.
        // The codebase has no dangerouslySetInnerHTML and React escapes all dynamic
        // content, so the realistic XSS surface that 'unsafe-inline' would expose
        // is essentially nil. Tighten further by adopting nonces if a stricter
        // policy is needed later.
        //
        // CSP is intentionally not sent in local dev — Vite's HMR origin
        // (http://[::1]:5173) uses bracketed IPv6 syntax that Chrome rejects
        // as an invalid CSP source.
        return implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https:",
            "font-src 'self' data: https://fonts.gstatic.com",
            // LinkedIn post embeds + Turnstile challenge widget.
            "frame-src 'self' https://www.linkedin.com https://challenges.cloudflare.com",
            // Inertia XHRs target self; Turnstile siteverify runs server-side.
            "connect-src 'self'",
            "media-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'",
        ]);
    }
}

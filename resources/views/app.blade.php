<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ session('locale', 'en') === 'ar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name', 'Nuor Steel') }}</title>

    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap" rel="stylesheet" />

    {{-- Preload hero LCP image so the browser starts fetching it in parallel with JS/CSS
         instead of waiting for React to render the <img>. Uses the session locale so
         hard-reloads while in Arabic still preload the correct (Arabic) hero. --}}
    @php($heroLocale = session('locale', 'en'))
    @if (Route::currentRouteName() === 'home')
        <link rel="preload" as="image" href="/images/home/hero/hero-mobile-{{ $heroLocale }}.webp" media="(max-width: 639px)" fetchpriority="high">
        <link rel="preload" as="image" href="/images/home/hero/hero-desktop-{{ $heroLocale }}.webp" media="(min-width: 640px)" fetchpriority="high">
    @elseif (Route::currentRouteName() === 'quality')
        <link rel="preload" as="image" href="/images/quality/hero/hero-mobile-{{ $heroLocale }}.webp" media="(max-width: 639px)" fetchpriority="high">
        <link rel="preload" as="image" href="/images/quality/hero/hero-desktop-{{ $heroLocale }}.webp" media="(min-width: 640px)" fetchpriority="high">
    @endif

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead

    @include('partials.structured-data')
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>

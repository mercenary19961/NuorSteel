# Nuor Steel - Project Context

> Quick reference for AI assistants and developers

---

## Project Overview

**Company:** Nuor Steel Industry Company (شركة نور للصناعات الحديدية)
**Type:** Corporate industrial website with admin CMS
**Stack:** Laravel 12 + Inertia.js + React 19 + TypeScript
**Database:** MySQL
**Architecture:** Single-service monolith (Laravel serves everything via Inertia) with SSR
**Branch:** `construction_phase`

---

## Build Progress

### Backend (DONE)
- [x] Database migrations (14 tables)
- [x] Eloquent models with relationships
- [x] Public Inertia controllers (pages + form submissions)
- [x] Admin Inertia controllers (CRUD for all resources)
- [x] Session-based auth (login, logout)
- [x] Admin middleware (role guard)
- [x] Rate limiting on login and public POST endpoints
- [x] File storage in private directory
- [x] Database seeders
- [x] HandleInertiaRequests middleware (shares auth, locale, flash, ziggy, siteSettings)
- [x] UndoService + ChangeLog service (soft-delete, undo, persistent change tracking)
- [x] Demo data seeders (contacts, newsletter, career applications)

### Admin Panel Frontend (DONE)
- [x] Login page with Inertia form
- [x] Admin layout with responsive sidebar (mobile overlay + hamburger toggle)
- [x] Dashboard with stats
- [x] Content editor (bilingual side-by-side EN/AR)
- [x] Timeline events CRUD (drag-and-drop reorder)
- [x] Media library (upload, grid, folder/type filter, folder management, usage tracking, folder previews, PDF viewer)
- [x] Products CRUD (half-width card grid, featured image picker, CustomSelect dropdowns)
- [x] Certificates CRUD (category-folder navigation, PDF viewer modal, PDF preview cards, media library linkage)
- [x] Careers CRUD (card grid with detail modal) + Applications inbox (card grid with time filters)
- [x] Contact submissions inbox (read/archive/filters, archived rows highlighted)
- [x] Newsletter management (admin-only, stats, export, demo data)
- [x] Settings page (admin-only, contact + email groups, two-column layout, email tag UI)
- [x] Users page (admin-only, CRUD with self-protection)
- [x] Change Log page (persistent change tracking, card layout, time filters, revert/delete)
- [x] Undo system (soft-delete with undo across all admin sections via UndoService)
- [x] Form UX: update buttons disabled until changes detected, placeholders and helper hints

### Public Pages Frontend (DONE)
- [x] PublicLayout (Header + Footer + children)
- [x] Home page (full-viewport hero, framer-motion animations, bottom nav links, interactive core values, products, CTA)
- [x] About page (animated intro with highlighted keywords, vision, mission, capabilities scroll-stack, timeline, no governance)
- [x] Recycling page (sub-page under About)
- [x] Products listing (ISL-style angled split layout) + Product detail page
- [x] Quality page (hero section + magic card assurance cards)
- [x] Career page (hero section, magic card job listings, job detail modal, open application modal)
- [x] Job detail page (standalone route kept as direct-link fallback; Career page uses modals)
- [x] Certificates page (category MagicCards → certificate grid → PDF viewer modal)
- [x] Contact page (dark-theme form with file upload, custom RequestTypeSelect dropdown, bilingual content)

### Homepage Redesign (DONE)
- [x] Header: transparent overlay on all pages, fixed positioning
- [x] Header: always visible at top of page (except Products page), hides only after 6s idle when scrolled (shows on mouse move or scroll up), compact height when scrolled, gradient bg when not at top
- [x] Hero: full-viewport (`h-screen`), looping background video (`/videos/hero-bg.mp4`, 3MB, autoPlay muted loop playsInline) with image poster fallback, staggered entrance animations
- [x] Hero: H1 with multi-line typewriter effect — types lines simultaneously, then cycles keywords with delete/retype animation, longer first-cycle delay (`resources/js/Components/ui/typewriter.tsx`)
- [x] Hero: "Contact Us" outline button fades in after typewriter completes, links directly to `/contact` page
- [x] Hero bottom links: 3 interactive links (About Us, Core Values, News) with hover image-reveal (image reveal hidden on mobile)
- [x] framer-motion for all hero animations + mobile menu `AnimatePresence`
- [x] `useScrollDirection` custom hook with idle state detection (`resources/js/hooks/useScrollDirection.ts`)
- [x] `HeroBottomLinks` component (`resources/js/Components/Public/HeroBottomLinks.tsx`)
- [x] Homepage sections: About Us (combined with Vision & Mission), Vision 2030, interactive Core Values, Products, News (LinkedIn feed), CTA — each with `id` for scroll navigation
- [x] Core Values V2: RadialOrbitalTimeline component with orbital animation, rotating value cards, responsive node sizes (72px desktop, 40px mobile), enlarged center logo (128px), detail panel on lg+ screens, and traveling dot auto-cycle with pause on hover (`resources/js/Components/ui/radial-orbital-timeline.tsx`)
- [x] Core Values V3: scroll-driven stepping on desktop — sticky section in `400vh` wrapper, scroll position maps to 5 stages (idle + 4 values), `scrollStep` prop drives RadialOrbitalTimeline node selection
- [x] Core Values detail panel: glass card UI (`bg-white/5 backdrop-blur-lg border-white/10 shadow-2xl`), `detailSlideUp` CSS animation, icon moved to top-right, title enlarged
- [x] Core Values detail panel: traveling dot grows + pulses on detail hover, enhanced center node ping rings (larger, stronger opacity)
- [x] Products section on homepage links to `/products` page (ISL-style redesign lives on dedicated Products page)
- [x] All sections use unified left-to-right gradient (`bg-linear-to-r from-gray-900 to-gray-800`)
- [x] News (LinkedIn feed): auto-rotating carousel with dot indicators, single active iframe (destroyed/recreated on switch, preloaded 2s before), Intersection Observer to unmount iframes when section is off-screen, RTL-aware chevron arrows, section titled "News" (not "LinkedIn"), "View Post on LinkedIn" button per post
- [x] News section uses CSS logical properties (`text-start`, `ms-0`/`me-auto`) for RTL support
- [x] About Us section: merged with Vision & Mission into single full-screen section, responsive background image (`bg-desktop.png`/`bg-mobile.png`), left-aligned text with orange CTA button, Vision & Mission cards pushed to bottom with `mt-auto`
- [x] Vision 2030 section: Nuor Steel logo removed, Vision 2030 logo enlarged (`h-72` desktop, `h-36` mobile), background image at 85% opacity, content top-aligned on mobile (`pt-20`), vertically centered on desktop
- [x] UI primitive components: Badge, Button, Card (`resources/js/Components/ui/`)
- [x] MagicCard + MagicCardGrid: animated border glow bento effect (`resources/js/Components/ui/magic-card.tsx` + `magic-card.css`)
- [x] ScrollToTop: fixed-position button with SVG progress ring, appears at 70% scroll (`resources/js/Components/ui/scroll-to-top.tsx`)
- [x] ScrollStack component: scroll-triggered stacking card animation (`resources/js/Components/ui/scroll-stack.tsx`)
- [x] Language defaults to English always (no localStorage persistence)
- [x] Magic card glow applied to: Home (Vision & Mission, Core Values, Core Values detail panel), About (Vision & Mission, Capabilities), Quality (assurance cards), Career (job listings)
- [x] Products section: `bg-black` background with section title heading above product cards
- [x] News section: LinkedIn embed max width increased to `max-w-150`

### About Page Enhancements (DONE)
- [x] Hero section redesigned: scroll-driven text shift + logo slide-in animation on desktop, time-based animation on mobile (logo drops in, text slides up)
- [x] Hero background: language-aware construction site images (`/images/about/hero/bg-desktop-en.webp` etc.), dark overlay for readability
- [x] Hero logo: single combined NS logo image (`/images/about/hero/logo.webp`), slides in from side on scroll (desktop), drops in on load (mobile)
- [x] Green shifting letter effect on "Saudi Arabia" / "المملكة العربية السعودية" text (3 letters, 150ms interval, `#00A651` KSA flag color)
- [x] SEO-safe visually hidden `<h1>` using `sr-only` class
- [x] Capabilities section redesigned: scroll-driven horizontal reveal on desktop (cards slide in from right, line up side by side), RTL-aware (slides from left in Arabic)
- [x] Capabilities mobile: 3D flip-in animation (rotateX) with staggered delays as cards enter viewport, perspective container
- [x] Capabilities heading always visible (no fade-out)
- [x] i18n translations for all capabilities (EN + AR)
- [x] Vision & Mission: 4-card grid with cascading character-by-character color sweep animation (cycles through all cards continuously)
- [x] Timeline desktop: scroll-driven vertical rail + content panel, auto-advance every 10s with gradual orange fill line, IntersectionObserver to start/stop auto when section enters/exits viewport, programmatic scroll sync during auto-advance
- [x] Timeline mobile: swipeable card carousel with glass cards (`bg-white/5 backdrop-blur`), touch swipe navigation (RTL-aware), arrow buttons + counter, dot indicators (active = orange pill), auto-advance every 10s, `AnimatePresence` slide transitions
- [x] Timeline: 3 input modes (auto/scroll/manual) with refs for closure-safe state, `isAutoScrollingRef` guard for programmatic scrolls
- [x] Timeline: language-aware background images (`/images/about/journey/bg-desktop-en.webp` etc.), full bilingual titles + body text for 6 milestones
- [x] Governance section removed from About page
- [x] Unified horizontal (left-to-right) gradients across all About sections for seamless transitions (`from-gray-900 to-gray-800`)

### Quality Page Redesign (DONE)
- [x] Full-viewport hero section with decorative diagonal clip-path shape, label + title + subtitle
- [x] Quality assurance section with MagicCard grid (4 cards: Rigorous Testing, Industry Standards, Continuous Improvement, Traceability)
- [x] Consistent left-to-right gradient background

### Career Page Redesign (DONE)
- [x] Full-viewport hero section matching Quality page design pattern
- [x] Job listings as MagicCard bento grid (icon, title, location/type badges, truncated description)
- [x] Job detail modal (replaces separate page navigation) with sticky header, description, requirements, application form
- [x] Open application modal for users without matching job listings
- [x] Reusable `ApplicationForm` component (shared between job-specific and open application)
- [x] Job title field auto-filled and read-only when opened from a specific job card
- [x] Dark-themed thin scrollbar styling on modals (`scrollbar-thin` class)
- [x] CareerController updated to pass bilingual data (content_en/ar, title_en/ar, description_en/ar, requirements_en/ar)
- [x] i18n keys added: `career.hero.label`, `career.listingsSubtitle` (EN + AR)

### Products Page Redesign — ISL-Style (DONE)
- [x] Full-viewport single section with angled diagonal divider (SVG bezier `clip-path: path()`)
- [x] 60/40 split (default) → 80/20 split (expanded "Explore More" view) with animated flex transition
- [x] Left panel: featured product hero (name, description, "Explore More" CTA, large product image near diagonal)
- [x] Left panel expanded: tabbed details — Overview, Specifications, Features, Request Quote
- [x] Right panel default: stacked product thumbnails with navigation button (fixed `w-44`, directional arrows)
- [x] Right panel expanded: product image + "Back to Products" button (no thumbnails)
- [x] Curved diagonal via `clip-path: path()` with SVG quadratic bezier curves (Q commands)
- [x] Drop-shadow along diagonal edge via wrapper div with `filter: drop-shadow()` (can't apply on same element as clip-path)
- [x] `useLayoutEffect` (isomorphic SSR-safe) for panel measurement to prevent flash on load
- [x] `background-size: 100vw 100%` to align gradients across panels and eliminate seam at clip-path curve
- [x] Right panel overlap (`lg:-ms-120`) to hide seam at diagonal bottom
- [x] Responsive thumbnail sizes (`w-24 xl:w-40 2xl:w-56`)
- [x] SpecDataTable component: `line-clamp-2` truncated headers, click-to-expand tooltip (fixed position, viewport-clamped), subtle orange glow pulse animation on truncated headers (`animate-pulse-subtle` in `app.css`)
- [x] Spec tables hardcoded in i18n: TMT Bars (Linear Mass, 9 rows) + Billets (Chemical Composition, 2 rows)
- [x] framer-motion `AnimatePresence mode="wait"` for content transitions (hero ↔ detail, tab switching, product switching)
- [x] Tab underline: `motion.div` with `layoutId="tab-underline"`
- [x] Mobile: stacked layout without clip-path, panels stack vertically
- [x] RTL: clip-path mirrors via `language === 'ar'` conditional, CSS logical properties throughout
- [x] ProductController `index()` updated to pass full bilingual data (both locales)
- [x] i18n keys added for all product page content (EN + AR): tabs, specs, features, highlights

### Certificates Page Redesign (DONE)
- [x] Two-level navigation: 3 category MagicCards (ESG, Quality, Governance) → certificate grid (4 per row desktop)
- [x] PDF viewer modal with iframe (browser-native PDF rendering), download button, dark overlay
- [x] Public file serving route: `GET /certificates/{id}/file` (serves active certificates only)
- [x] CertificateController updated for bilingual data (`content_en`/`content_ar`) + `file_view_url`
- [x] Dark theme matching site design (`bg-linear-to-r from-gray-900 to-gray-800`)
- [x] AnimatePresence transitions between category view and certificate list
- [x] i18n keys added for category descriptions, navigation, and modal (EN + AR)
- [x] Empty state handling for categories with no certificates
- [x] Products page empty state guard (prevents crash when products table is empty)

### Data Migrations for Production Seeding (DONE)
- [x] Certificate data migration (`2026_03_03_102243_seed_certificates_data.php`) — seeds 9 PDFs via `DB::table()->updateOrInsert()`
- [x] Products data migration (`2026_03_03_103058_seed_products_data.php`) — seeds TMT Bars + Billets with 16 specifications
- [x] LinkedIn posts data migration (`2026_03_04_120000_seed_linkedin_posts_data.php`) — seeds 5 real Nuor Steel LinkedIn posts
- [x] Settings data migration (`2026_03_07_120000_seed_default_settings.php`) — seeds phone, email, LinkedIn URL so footer works on fresh deploy
- [x] Data migrations run automatically via Railpack's `php artisan migrate --force` (no custom start command needed)
- [x] Certificate PDFs tracked in git (`storage/app/private/certificates/`) via `.gitignore` exceptions
- [x] CertificateSeeder updated: `created_by`/`updated_by` set to null (avoids FK violation on fresh DB)

### Misc Fixes & Enhancements (post-2026-03-01)
- [x] Header: burger menu background color fix on mobile view
- [x] Header: improved scroll behavior — always visible at top of page (except Products page), hides only after 6s idle when scrolled, shows on mouse move or scroll up, compact height when scrolled
- [x] Header: conditional Contact CTA button — visible in desktop nav (hidden on homepage hero when at top, shows when scrolled or on other pages), also added to mobile menu
- [x] Header: stays visible at bottom of page (`isAtBottom` check in scroll direction hook)
- [x] Career page: multilingual support enhancements (bilingual i18n keys)
- [x] Quality page: minor content/translation updates
- [x] Typewriter: first cycle delay longer than subsequent cycles (3s first, 1.5s after)
- [x] RadialOrbitalTimeline: responsive node sizes (larger on desktop), detail panel slides in on lg+ when node selected, orbit shrinks in detail view, center node clickable (opens top node / closes detail view)
- [x] RadialOrbitalTimeline: traveling dot auto-cycles between nodes (8s per travel, eased with `easeInOutCubic`, fades in/out), pauses on detail panel hover, cancels on manual node click
- [x] RadialOrbitalTimeline: `scrollStep` prop for external scroll-driven control (0 = idle/auto-rotate, 1–N = activate Nth value)
- [x] RadialOrbitalTimeline: responsive orbit radius and container height per breakpoint (`sm:140, md:200, lg:180, xl:240, 2xl:320`), dynamic `containerHeight` state
- [x] RadialOrbitalTimeline: detail panel redesigned with MagicCard glow effect + `detailSlideUp` keyframe animation, icon repositioned to top-right
- [x] RadialOrbitalTimeline: traveling dot grows (`0.75rem → 1rem`) and pulses when detail panel is hovered, enhanced glow box-shadow
- [x] RadialOrbitalTimeline: center node ping rings enlarged (`w-36/w-44`) with stronger opacity and staggered timing
- [x] Core Values section: scroll-driven stepping on desktop — sticky section in `400vh` wrapper, scroll progress maps to 5 stages (idle + 4 values)
- [x] About section: responsive background image added (`bg-desktop.png`/`bg-mobile.png`), left-aligned text layout with orange CTA button (`bg-primary`)
- [x] Core values subtitle removed from homepage (cleaner layout)
- [x] `useScrollDirection` hook: added `isIdle` state with configurable timeout (default 3s), added `isAtBottom` state, idle timer starts on load, mouse movement resets idle
- [x] Contact page: full dark-theme redesign — unified gradient bg, dark form inputs (`bg-white/5`, `border-white/10`), clickable phone/email links, custom `RequestTypeSelect` dropdown with keyboard navigation
- [x] Contact page: bilingual content support (controller passes `content_en` + `content_ar`, client picks via `useLanguage()`)
- [x] Contact form: company field changed from required to optional; file upload now accepts PDF, JPG, PNG (was PDF-only)
- [x] Hero: "Contact Us" link changed from scroll-to-footer anchor to direct `/contact` page link with outline button style (`border border-primary`)
- [x] Hero bottom links: "Sustainability" renamed to "News" (links to `section-linkedin` instead of `section-sustainability`)
- [x] Hero bottom links: image reveal hidden on mobile (`hidden sm:block`), text-only cards on small screens
- [x] Hero: responsive mobile layout — `min-h-[87svh] lg:h-screen`, content aligned to bottom (`items-end pb-8`) on mobile, centered on desktop
- [x] Home: product cards link to `/products` (generic listing page) instead of product-specific routes
- [x] Home: LinkedIn section renamed to "News" (removed LinkedIn icon, uses `t('home.hero.bottomLinks.news')` title)
- [x] Contact submissions: `company` column made nullable via migration (matches optional form field)
- [x] Admin contact detail: file download uses dynamic extension instead of hardcoded `.pdf`; removed stale `file_url` accessor
- [x] Admin contact detail: company field conditionally rendered (only shown when present)
- [x] Contact email template: company field conditionally rendered
- [x] Settings data migration (`2026_03_07_120000_seed_default_settings.php`) — seeds phone, email, LinkedIn URL for production footer
- [x] Admin Site Content tab: synced `SECTION_ORDER` with actual CMS-editable homepage sections; replaced Recycling page entry with Products page
- [x] Admin Site Content tab: added missing section/key labels (vision_mission, vision2030, core_values); pages sorted by config order
- [x] SiteContentSeeder: cleaned up deprecated entries (hero, cta, newsletter, certificates, recycling sections)
- [x] Product spec icons: fixed vertical stacking on mobile (now side by side)
- [x] Admin Site Content: adjusted "click to interact with preview" text color for better visibility
- [x] Real images added: logo, hero background, bottom link hover panels, core values icons, Vision 2030, product panels
- [x] HeroBottomLinks: increased image heights (`h-32 lg:h-44`), responsive sizing
- [x] Vision 2030: text left, Vision 2030 logo right (Nuor logo removed), vertically centered, image `object-top`
- [x] Core values: reduced padding, removed borders from orbital circle nodes and center node, enlarged node sizes (72px) and center logo (128px)
- [x] Section backgrounds: Core Values, News changed to solid `bg-black`; About uses background image
- [x] About & Vision/Mission merged into single full-screen section with responsive background image (`/images/home/about/bg-desktop-en.webp`, `/images/home/about/bg-mobile-en.webp`)
- [x] News section: "View Post on LinkedIn" button linking to actual LinkedIn post per carousel item
- [x] News section: "Follow us on LinkedIn" URL corrected to `https://www.linkedin.com/company/nuor-steel/`
- [x] First LinkedIn post URL fixed (was embed URL, now direct link); data migration added
- [x] Products section: reduced overlay opacity (0.4), product names in orange (`text-primary`)
- [x] Admin products: real product images from media library, increased card image height to `h-64`
- [x] Certificates linked to media library: `file_media_id` (PDF) and `thumbnail_id` (thumbnail) FK columns
- [x] Media library: "Used in" indicator for PDFs (certificates usage), folder preview thumbnails (first image/PDF per folder)
- [x] Media library: soft delete preserves physical files (`forceDeleting` hook), PDF viewer modal on cards
- [x] Admin certificates: redesigned card layout — PDF preview on top (scaled iframe), 3-column grid, status/expiry badge overlays
- [x] Header: gradient background always visible (`from-black/80 to-black/50`), no longer transparent at top
- [x] Header: reduced height (`h-14 lg:h-16` at top, `h-12 lg:h-14` when scrolled), reduced nav gap (`gap-6`), responsive nav text size (`text-base` at top, `text-sm` when scrolled)
- [x] `useScrollDirection` hook: idle timer starts on page load (header auto-hides at top too), mouse movement resets idle and restores header visibility
- [x] Vision 2030: mobile logo enlarged (`h-36`), text sizes reduced (`text-sm`), spacing tightened
- [x] Vision & Mission cards: compact sizing (smaller padding `p-5 lg:p-6`, smaller text `text-base lg:text-lg` titles, `text-sm` body, reduced gaps `gap-4 lg:gap-6`)
- [x] Vision & Mission cards: equalized heights via `auto-rows-fr` + `h-full`, content top-aligned (removed `mt-auto` on description)
- [x] About section description and CTA button: reduced sizes for balanced layout
- [x] Favicon assets added: `favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png`, `favicon.ico` with `<link>` tags in `app.blade.php`
- [x] Container max-width raised to **1800px** from `xl` upward, fills 100% between `lg`–`xl` (1024–1280px) to eliminate side gap (`app.css` media query)
- [x] About page: black grid texture background applied to all sections (Intro, Capabilities, Timeline, Vision & Mission) — replaces `bg-linear-to-r from-gray-900 to-gray-800` with `bg-black` + subtle 60px CSS grid overlay (`rgba(255,255,255,.1)`)
- [x] Capabilities ScrollStack cards: `bg-zinc-800/90 backdrop-blur-sm` (was `bg-gray-800`) for glass effect over grid texture
- [x] Career page: black grid texture background applied to hero and Open Positions sections
- [x] Quality page: black grid texture background applied to hero and Quality & Manufacturing Assurance sections
- [x] Products page: black grid texture applied to right panel background
- [x] Certificates page: black grid texture background (already done previously)
- [x] Public images reorganized into page-based folder structure: `images/home/` (hero, about, core-values, vision2030, page-links, products) and `images/shared/` (logo)
- [x] About section background images renamed to `-en.webp` suffix (prep for Arabic versions), old PNGs deleted
- [x] LinkedIn iframes: only active post rendered (destroyed/recreated on switch), next post preloaded 2s before auto-switch, Intersection Observer unmounts all iframes when section is off-screen
- [x] Hero H1 position: pinned at `pt-[25vh]` on desktop (consistent across screen sizes) instead of flex-center
- [x] `useScrollDirection` hook: idle timeout increased from 3s to 6s, header no longer hides on scroll down
- [x] Products page: text aligned with navbar container, max-width increased to 1536px (`app.css` container cap)
- [x] Production seeders: admin users seeded via data migration (`2026_04_08_120000_seed_users_and_fix_product_images.php`) — fixes empty users table FK issues
- [x] Production seeders: site_content data migration (`2026_04_08_130000_seed_site_content_and_fix_certificate_media.php`) seeds editable CMS content + fixes certificate media links on fresh deploy
- [x] Media on Railway ephemeral filesystem: product images (TMT bars, billets) tracked in git at `storage/app/private/media/` via `.gitignore` exception; data migration (`2026_04_08_140000_fix_media_paths_for_ephemeral_storage.php`) normalizes media paths
- [x] CSRF 419 handling: `app.tsx` listens to Inertia `error` event and auto-reloads on 419 (expired CSRF token during language toggle) instead of showing a broken state
- [x] Unified icon styling across public pages: Certificates, Career, and Quality card icons changed to `text-white` with `bg-white/5` containers (consistent look)
- [x] Arabic product names updated: "قضبان حديد التسليح" → "حديد التسليح", "كتل الصلب" → "ستيل بِليت" (data migration `2026_04_11_120000_update_product_arabic_names.php`)
- [x] Products page: new render images for TMT Bars and Billets in `public/images/products/renders/` (language-aware: `tmt-bars-en/ar.webp`, `billets-en/ar.webp`)
- [x] Products page: right panel changed from warehouse image to black grid texture background
- [x] Products page: faint warehouse overlay on orange left panel (only in Explore More expanded view, `opacity-10`)
- [x] Products page: mobile redesign — orange bg, white buttons with orange text, clean thumbnails, product image inside orange panel, nav button below thumbnails
- [x] Products page: RTL clip-path diagonal properly mirrored (fixed SVG path math for Arabic)
- [x] Products page: tab button border flash fix (`border-transparent` on active state)
- [x] Products page: hero image and mobile image clickable to trigger Explore More
- [x] Products page: hero product image repositioned left-aligned using same `ps` formula as title; `translate-y-12` on billets to lower it
- [x] Products page: thumbnails — removed `aspect-4/3` constraint (hugs natural image height for wide billets image), bumped sizes (`w-48 xl:w-64 2xl:w-80`), `font-black` labels, `gap-20` between products, `mt-6` between image and label
- [x] Products page: thumbnail alignment — `lg:pe-4` at laptop width, `xl:pe-[max(...)]` uses 1800px container formula
- [x] Products page: mobile hero text padding uses container-matching formula at `sm`/`md` breakpoints to align with navbar
- [x] Products page: mobile Explore More detail — "Back to Products" moved to top-right of title row, title bumped to `text-4xl`
- [x] Products page: spec table scrollable — `max-h-72 overflow-y-auto` with sticky `thead` (shows ~5 rows)
- [x] Products page: expanded billets image constrained by `max-h` + `max-w` (wide aspect ratio fix) and `translate-y-10` down; per-product sizing in both hero and expanded views
- [x] Homepage hero: background replaced with looping video (`/videos/hero-bg.mp4`, 3MB), poster image fallback for loading state
- [x] Homepage Vision 2030: background switched from PNG to WebP, `object-center` instead of `object-top`
- [x] About hero: scroll-driven text + logo animation on desktop, time-based on mobile (logo drops in + text slides up on page load)
- [x] About hero: language-aware background images (desktop + mobile, EN + AR variants) with dark overlay
- [x] About hero: green shifting letter effect on "Saudi Arabia" text (KSA flag color `#00A651`)
- [x] About capabilities: redesigned from vertical ScrollStack to horizontal scroll-driven reveal (cards slide in side by side), RTL-aware direction
- [x] About capabilities: mobile flip-in animation (3D rotateX with staggered delays via IntersectionObserver)
- [x] About timeline: auto-advance only starts when section is in viewport (IntersectionObserver)
- [x] About section homepage background images updated to gray variant (`bg-desktop-en/ar.webp`, `bg-mobile-en/ar.webp`)
- [x] About timeline mobile: swipeable card carousel with glass cards, dot indicators, touch navigation, auto-advance
- [x] Timeline: per-year background images (`{year}-desktop/mobile-en/ar.webp`) crossfade as active event changes (AnimatePresence); "Present" uses original bg images; 20 images total in `public/images/about/journey/`

### Partners Section (DONE)
- [x] `PartnersSection` component (`resources/js/Components/Public/PartnersSection.tsx`) — 3-column auto-scrolling logo carousel inserted above News section on homepage
- [x] 16 partner logos in `public/images/home/partners/` with per-logo size tiers (LG/XL/XXL/XXXL constants)
- [x] Per-column hover pause (each ScrollColumn manages its own `paused` state independently)
- [x] Desktop: absolute-positioned columns fill full section height (600px) with text panel on the left (2/5 width)
- [x] Mobile: stacked layout — header + paragraph on top, 3 scrolling columns below (420px height)
- [x] Scroll animations via CSS keyframes (`animate-scroll-up` / `animate-scroll-down`) in `app.css`
- [x] Per-logo size classes scoped to `lg:` so mobile uses unified smaller constraints (`max-h-24 max-w-24` base, larger per-tier)

### Core Values Expansion (DONE)
- [x] Core values expanded from 4 to 6: added "People & Teamwork" and "Trust & Integrity"
- [x] New icons in `public/images/home/core-values/people-teamwork.webp` + `trust-integrity.webp`
- [x] `imageBg: true` prop on new values triggers programmatic orange (`bg-primary`) background on orbital node (no separate image required)
- [x] Scroll-step wrapper updated to `600vh` (7 stages: idle + 6 values); `Math.min(6, step)` drives selection
- [x] i18n keys added for both new values (EN + AR) in `en.ts` + `ar.ts`

### Site-Wide Visual Consistency (DONE)
- [x] Unified `bg-linear-to-r from-gray-900 to-gray-800` gradient across all public page sections (Home, About, Quality, Career)
- [x] Footer gradient updated to match (`bg-linear-to-r from-gray-900 to-gray-800`)
- [x] ScrollToTop component added to PublicLayout (all public pages)

### Inertia Migration (DONE)
- [x] Inertia.js infrastructure (packages, Vite config, root template, entry point)
- [x] Shared code (types, utils, i18n, contexts, components, layouts)
- [x] All public pages converted from React Query to Inertia page props
- [x] Auth converted from Sanctum API tokens to session-based
- [x] All admin pages converted from React Query/Router to Inertia
- [x] Old frontend/ SPA directory removed
- [x] Old API controllers removed

### Email Notifications (DONE)
- [x] ContactFormSubmitted Mailable + HTML template
- [x] CareerApplicationReceived Mailable + HTML template
- [x] Controllers wired with try/catch (failures logged, don't break submissions)
- [x] Recipients configurable via admin Settings (contact_recipients, career_recipients)

### SEO / Structured Data (PARTIAL)
- [x] JSON-LD schema markup added (`resources/views/partials/structured-data.blade.php`)
- [x] Schemas: Organization, WebSite, SiteNavigationElement, FAQPage
- [x] Included in `app.blade.php` via `@include('partials.structured-data')`
- [x] Phone, email, LinkedIn URL driven by `Setting::get()` (editable from admin Settings)
- [ ] **TODO: Replace remaining PLACEHOLDER values** before going live:
  - Address (street, city, region, postal code)
  - Number of employees
  - FAQ answers (city name)
  - OG image path

### Settings Wired to Site (DONE)
- [x] Contact settings (phone, email, address EN/AR, LinkedIn URL) drive Footer, Contact page, and SEO structured data
- [x] `siteSettings` shared globally via Inertia middleware (`HandleInertiaRequests.php`)
- [x] Locale-aware address (switches between `company_address_en` and `company_address_ar`)
- [x] Email recipients (contact + career) configurable with tag/chip UI in admin Settings
- [x] Unused settings groups removed (general, social, media) — only contact + email remain
- [x] Seeder cleans up deprecated settings rows on re-run

### Demo Data (DONE)
- [x] Contact submissions demo seeder
- [x] Newsletter subscribers demo seeder
- [x] Career applications demo content seeder

### SSR — Server-Side Rendering (DONE)
- [x] SSR entry point (`resources/js/ssr.tsx`) using `@inertiajs/react/server`
- [x] Client entry (`app.tsx`) uses conditional hydration (`hydrateRoot` when SSR content exists, `createRoot` in dev)
- [x] Vite config updated with SSR entry (`ssr: 'resources/js/ssr.tsx'`)
- [x] Published `config/inertia.php` with SSR toggle (`INERTIA_SSR_ENABLED` env var)
- [x] Build script updated: `vite build && vite build --ssr` (outputs to `bootstrap/ssr/`)
- [x] Browser API guards added (`typeof window !== 'undefined'`) in bootstrap.ts, i18n/index.ts, LanguageContext.tsx
- [x] `/bootstrap/ssr` added to `.gitignore`

### Deployment Infrastructure (IN PROGRESS)
- [x] Railway project set up (PHP 8.2 + Node 22 via Railpack)
- [x] MySQL service provisioned on Railway
- [x] `trustProxies` middleware configured for Railway HTTPS (`bootstrap/app.php`)
- [x] Railway environment variables (DB credentials, APP_KEY, APP_URL)
- [x] Data migrations for production seeding (certificates, products, LinkedIn posts) — no custom start command needed
- [x] Railpack default startup: migrate → storage:link → optimize:clear → optimize → FrankenPHP/Caddy
- [ ] Enable SSR on Railway (start Node SSR server alongside PHP)

### LinkedIn Admin Management (DONE)
- [x] Manual CMS for LinkedIn posts (replaces API-based sync)
- [x] Admin page at `/admin/linkedin-posts` — add posts by pasting embed code or URL
- [x] Toggle visibility, reorder, delete with undo support
- [x] Removed `SyncLinkedinPosts` command and `LinkedinService` (API approach dropped)
- [x] Added `is_visible` column to `linkedin_cache` table via migration
- [x] `LinkedinPostSeeder` seeds real Nuor Steel LinkedIn posts
- [x] Admin sidebar updated with LinkedIn Posts link

### Performance Optimizations (DONE)
- [x] Batch site settings into single query (4 `Setting::get()` → 1 `whereIn` per request) in `HandleInertiaRequests` middleware
- [x] Per-request cache on `SiteContent::getPage()` — eliminates duplicate EN/AR queries on bilingual pages
- [x] Fix Product N+1: filter eager-loaded specs collection instead of 3 extra queries in `ProductController::show()`
- [x] Consolidate admin stats queries: Contact (3→1), Newsletter (4→2), Media folders (3→1)
- [x] Database indexes added: `media` (folder, mime_type), `contact_submissions` (is_read, is_archived, request_type), `settings` (group)
- [x] RadialOrbitalTimeline: `setInterval` → `requestAnimationFrame` for smoother animation (eliminates 20 re-renders/sec)
- [x] Home page images: `loading="lazy"`, `decoding="async"`, `fetchPriority="high"` on hero LCP image
- [x] SSR-safe `isDesktop` state with resize listener (replaces per-render `typeof window` checks)

### Remaining
- [x] Real images for hero background, bottom link hover panels, core values section, and product panels
- [x] Logo image for header
- [ ] Code splitting (chunk >500kB)
- [ ] Structured data remaining placeholders (see above)
- [ ] Final testing & go-live

---

## Key Decisions Made

### Branding & Language
- Default language: **English**
- Secondary: **Arabic** (manual toggle, no auto-detect)
- Header text: "Nuor Steel Industry Company"
- Browser title format: "Nuor Steel | {Page Name}"

### Navigation (5 items in navbar + Contact CTA)
```
About Us | Products | Quality | Career | Certificates | [Contact Us]
```
- Contact CTA button appears in desktop nav (hidden on homepage hero when at top, visible when scrolled or on other pages)
- Contact also in mobile menu as nav item

### CMS Approach
- **Hybrid model**: Fixed page structure + editable content + CRUD for data
- Admins edit content, not page structure
- Side-by-side EN/AR editor for bilingual content

### Admin Roles
- **Admin**: Full access (users, settings, newsletter)
- **Editor**: Content management only (no users/settings)

### Content Features
- Image upload with **cropping tool**
- **Simple active/inactive** toggle (no draft workflow)
- **Basic audit logging** (created_by, updated_by fields)
- Products have **image gallery** (multiple images) + **featured image** picker
- **Undo system**: Soft-delete with undo button across all admin sections (`UndoService`)
- **Change Log**: Persistent change tracking with time filters, card layout, revert/delete (`/admin/change-log`)

### Recycling Page
- Lives at `/about/recycling` (sub-page under About Us)
- Not in main navigation

---

## Company Contact Info (Real / Production)

| Field | Value |
|-------|-------|
| Phone | +966543781868 / +966545198760 |
| Email | info@nuorsteel.com / Nuorsteel@hotmail.com |
| Address (EN) | 59, Al Kharj Industrial City (Modon), Riyadh 16416 |
| Address (AR) | ٥٩، مدينة الخرج الصناعية (مدن)، الرياض 16416 |

These values are seeded via `2026_04_15_120000_update_real_contact_settings.php` and stored in the `settings` table (`company_phone`, `company_email`, `company_address_en/ar`). Displayed in footer and contact page — both support comma-separated multi-value.

---

## Email Routing

| Form | Recipients |
|------|------------|
| Contact (all types) | info@nuorsteel.com, it@nuorsteel.com |
| Career applications | careers@nuorsteel.com, hr@nuorsteel.com |

---

## Contact Form Fields

1. Name (required)
2. Company (optional)
3. Email (required)
4. Phone (required)
5. Country (required, dropdown)
6. Type of Request (required, custom RequestTypeSelect dropdown with keyboard navigation)
7. Subject (required)
8. Message (required, max 2000 chars)
9. File Upload (optional, PDF/JPG/PNG, max 5MB)

**Request Types:**
- Vendor Registration
- Partnerships
- Careers
- Sustainability
- General Enquiry
- Quotation

---

## Career Application Fields

1. Name (required)
2. Email (required)
3. Phone (required)
4. Job Title (required)
5. CV Upload (required, PDF only, max 5MB)

**Features:**
- Full admin portal (add/edit/close jobs, set expiry dates)
- Open application button (apply even if no job listed)

---

## Database Tables (14 total)

### Core System
- `users` - Extended with role (admin/editor), is_active, avatar_path
- `settings` - Key-value store for site config
- `site_content` - Editable text blocks (page/section/key structure)
- `media` - Uploaded files with alt text

### Business Data
- `products` - Product catalog
- `product_images` - Gallery pivot table (multiple images per product)
- `product_specifications` - Chemical/mechanical/dimensional specs
- `certificates` - ESG, quality, governance documents
- `timeline_events` - Company history milestones

### Career System
- `career_listings` - Job postings with expiry
- `career_applications` - Applications with status workflow

### Contact & Marketing
- `contact_submissions` - Form entries
- `newsletter_subscribers` - Email list
- `linkedin_cache` - Cached LinkedIn posts

---

## Page Structure

### Public Pages
```
/                       → Home
/about                  → About Us
/about/recycling        → Recycling (sub-page)
/products               → Product listing
/products/{slug}        → Product detail
/quality                → Quality & certifications
/career                 → Job listings + open application
/career/{slug}          → Job detail
/certificates           → Supplier approvals & certificates (category → grid → PDF modal)
/certificates/{id}/file → Public PDF file serving (inline, active only)
/contact                → Get in Touch form
```

### Admin Pages
```
/admin/login            → Login
/admin                  → Dashboard
/admin/content          → Site content editor
/admin/timeline         → Timeline events CRUD
/admin/media            → Media library
/admin/products         → Products CRUD
/admin/certificates     → Certificates CRUD
/admin/careers          → Job listings CRUD
/admin/applications     → Career applications
/admin/contacts         → Contact submissions
/admin/newsletter       → Subscriber management (admin only)
/admin/settings         → Site settings (admin only)
/admin/users            → User management (admin only)
/admin/change-log       → Change log with revert/delete (admin only)
/admin/linkedin-posts   → LinkedIn posts management
```

---

## Certificates Categories

### ESG (Sustainability) — 7 certificates
- EPD (Environmental Product Declaration)
- HPD (Health Product Declaration)
- NCEC Certificate
- ISO 14001 (Environmental Management)
- ISO 45001 (Occupational Health & Safety)
- SASO Quality Mark
- ISO 50001 (Energy Management)

### Quality — 1 certificate
- ISO 9001 (Quality Management System)

### Governance — 1 certificate
- Saudi Made Certificate

---

## Code Quality Checklist

After writing or modifying any controller, service, or model method, verify these before finishing:

### Data Access Consistency

- If a model has a dedicated method (e.g. `Setting::set()`, `Media::storeFile()`), **always use it** — never bypass with raw `::update()` or `::create()` queries. This includes undo/restore flows, seeders, and tests.
- When the same data is written in multiple places (create, update, restore, import), all paths must go through the same model method.
- **Never use `auth()` helper** — always use `Auth::id()` / `Auth::user()` via `use Illuminate\Support\Facades\Auth`. The `auth()` helper triggers Intelephense errors.

### Return Values & Guard Clauses

- If a service method returns a meaningful value (bool, count, status), **always use it**. Don't call-and-ignore.
- Guard against no-op operations — if nothing changed, short-circuit early with appropriate feedback instead of running writes and reporting success.

### Query Efficiency

- Never query inside a loop (`foreach` + `::where()->first()`). Batch-fetch with `whereIn()` or `pluck()` before the loop.
- For paginated views, only query related data for the current page's IDs, not the entire table.

### Undo/Restore Flows

- Restore operations must use the same model methods as normal updates (to preserve `updated_by`, events, cache invalidation, etc.).
- Always verify undo state exists before attempting restore. Clear undo state after successful restore.

### CMS Content vs i18n (Bilingual Pattern)

- **CMS content always wins over i18n fallbacks.** The pattern `content?.section?.key || t('fallback.key')` means the database value overrides the translation file. If you change text in `en.ts`/`ar.ts` but the `site_content` table has the old value, **the old value still shows**.
- **When changing display text:** update BOTH the i18n files (`resources/js/i18n/en.ts`, `ar.ts`) AND the `SiteContentSeeder.php`, then re-run the seeder (`php artisan db:seed --class=SiteContentSeeder`). The admin CMS editor at `/admin/content` also writes to the same table.
- **Bilingual content for instant language switching:** To avoid a flash of stale content when toggling language, pass BOTH locales from the controller (`content_en` + `content_ar`) and let the client pick using `useLanguage()`. This avoids waiting for a server round-trip. See `HomeController` + `Home.tsx` for the pattern:
  ```php
  // Controller: pass both
  'content_en' => SiteContent::getPage('home', 'en'),
  'content_ar' => SiteContent::getPage('home', 'ar'),
  ```
  ```tsx
  // Component: pick based on client language
  const { language } = useLanguage();
  const content = language === 'ar' ? content_ar : content_en;
  ```
- **Apply this pattern to ALL public page controllers** that pass CMS content, not just Home.

---

## Security (CRITICAL)

Security is extremely important for this project. Every code change must consider security implications. Follow these rules strictly:

### Authentication & Authorization
- All admin routes MUST be behind `auth` middleware (session-based)
- Admin-only routes (users, settings, newsletter) MUST use `admin` middleware
- Login endpoint MUST be rate-limited to prevent brute force — currently 5/minute
- Server middleware handles protection — no client-side auth guards needed

### Input & Output
- Server-side validation on ALL endpoints (never trust client input)
- Client-side validation for UX only (not as a security layer)
- Sanitize all user-generated content before storage (strip_tags on text fields)
- Use parameterized queries / Eloquent (SQL injection prevention)
- Validate file types server-side using BOTH extension AND MIME type (`mimes:pdf|mime_types:application/pdf`)
- Render user content with React (auto-escapes by default) — never use `dangerouslySetInnerHTML` with unsanitized data

### File Uploads
- Validate file types, sizes, and MIME types server-side
- Store uploads outside public directory (local disk in `storage/app/private/`)
- Generate random filenames (never use original filename for storage path)
- Scan/validate PDF files before storing

### Security Notes
- Never expose sensitive data in responses (passwords, tokens, internal paths)
- Return consistent error shapes (don't leak stack traces in production)
- Rate-limit ALL public POST endpoints (contact, career apply, newsletter subscribe)

### Frontend Security
- Sanitize any HTML content before rendering (use DOMPurify for rich text)
- Validate file types client-side for UX, but NEVER rely on it for security
- Use `rel="noopener noreferrer"` on external links
- All form submissions must handle errors gracefully without exposing internals

---

## Technical Notes

### File Storage
- CVs: `storage/app/private/cvs/`
- Attachments: `storage/app/private/attachments/`
- Certificates: `storage/app/private/certificates/`
- Media: `storage/app/private/media/`

### File Limits
| Type | Max Size | Formats |
|------|----------|---------|
| Images | 5MB | JPEG, PNG, WebP |
| CVs | 5MB | PDF only |
| Attachments | 5MB | PDF, JPG, PNG |
| Certificates | 10MB | PDF |

### Local Development
- **Start**: `php artisan serve` + `npm run dev` (both from project root)
- **URL**: `http://localhost:8000` (Laravel serves everything)
- **Database**: MySQL on port 3307, database `nour_steel`, root user
- **Seeded accounts**:
  - Admin: `admin@nuorsteel.com` / `password`
  - Editor: `editor@nuorsteel.com` / `password`
- **Admin dashboard**: `http://localhost:8000/admin/login`
- **Build**: `npm run build` (outputs client to `public/build/` + SSR to `bootstrap/ssr/`)
- **SSR in dev**: Not active — `npm run dev` uses CSR only. SSR applies to production builds
- **SSR toggle**: Set `INERTIA_SSR_ENABLED=false` in `.env` to disable SSR even in production

### Frontend Architecture
- **Framework**: Inertia.js — bridges Laravel controllers to React page components
- **Rendering**: SSR via `@inertiajs/react/server` + `hydrateRoot` on client
- **Data flow**: Controllers pass data as props via `Inertia::render('Page/Name', [...props])`
- **Mutations**: `router.post/put/delete()` with `preserveScroll`, `onSuccess`, `onFinish`
- **Forms with files**: Use native `FormData` + `forceFormData: true`
- **Routing**: Server-driven via `routes/web.php` — no client-side router
- **Auth state**: `usePage<PageProps>().props.auth.user` (shared by middleware)
- **Site settings**: `usePage<PageProps>().props.siteSettings` (phone, email, address, LinkedIn — shared by middleware)
- **Styling**: TailwindCSS v4 with custom `primary` color, Inter font
- **Icons**: Lucide React
- **Animations**: framer-motion (isolated in `vendor-motion` Vite chunk), ScrollStack (sticky viewport + progress-based, isolated in `vendor-lenis` chunk)
- **Smooth scroll**: Lenis library for ScrollStack container mode (window scroll mode uses native scroll events to avoid hijacking page scroll)
- **UI primitives**: Badge, Button, Card, ScrollStack, TimelineContent, HeroTypewriter, MagicCard/MagicCardGrid, ScrollToTop components in `resources/js/Components/ui/` (uses `@radix-ui/react-slot` for polymorphic `asChild`)
- **i18n**: react-i18next with EN/AR translation files (bundled, not HTTP-loaded)
- **Flash messages**: Server redirects with `->with('success', '...')`, rendered by FlashMessages component via toast
- **SSR safety**: All `window`/`document`/`localStorage` access guarded with `typeof window !== 'undefined'`

### Key File Locations
```
resources/js/Pages/Public/     → Public page components (10 pages)
resources/js/Pages/Admin/      → Admin page components (17 pages)
resources/js/Layouts/          → PublicLayout, AdminLayout
resources/js/Components/       → Shared components (Layout/, Admin/, Public/, ui/)
resources/js/hooks/            → Custom hooks (useScrollDirection)
resources/css/scroll-stack.css → ScrollStack GPU-accelerated card CSS
resources/css/magic-card.css   → MagicCard border glow CSS
resources/css/app.css          → Global styles (pulse-subtle glow animation)
resources/js/types/            → TypeScript interfaces
resources/js/i18n/             → Translation files (en.ts, ar.ts)
resources/js/contexts/         → LanguageContext
resources/js/app.tsx           → Client entry point (hydrateRoot / createRoot)
resources/js/ssr.tsx           → SSR entry point (createServer)
resources/views/app.blade.php  → Root Blade template (@inertia)
config/inertia.php             → Inertia SSR config
bootstrap/app.php              → Middleware config (trustProxies, web stack)
app/Http/Controllers/Public/   → Public Inertia controllers
app/Http/Controllers/Admin/    → Admin Inertia controllers
app/Http/Controllers/Auth/     → Login/logout controller
app/Services/                  → UndoService, ChangeLogService
routes/web.php                 → All routes (public + admin)
public/images/home/            → Homepage images (hero/, about/, core-values/, vision2030/, page-links/, products/)
public/images/shared/          → Shared images (logo/)
```

### Deployment (Railway)
- Single service — Railpack builder with PHP 8.2 + Node 22
- Build: `composer install && npm install && npm run build && php artisan migrate --force`
- `npm run build` outputs client to `public/build/` + SSR bundle to `bootstrap/ssr/ssr.js`
- **Web server**: FrankenPHP + Caddy (Railpack default)
- **Startup sequence** (Railpack-generated, do NOT override with Custom Start Command):
  `migrate --force` → `storage:link` → `optimize:clear` → `optimize` → `frankenphp run`
- **Essential data**: Seeded via data migrations (certificates, products, LinkedIn posts) — runs automatically during `migrate --force`
- **Pre-deploy limitation**: Railway pre-deploy containers cannot access private network (`mysql.railway.internal`) — use data migrations instead
- **SSR in production**: Requires running `node bootstrap/ssr/ssr.js` alongside PHP (port 13714)
- **Proxy**: Railway terminates SSL — `trustProxies(at: '*')` in `bootstrap/app.php` ensures HTTPS URLs
- **SSR toggle**: `INERTIA_SSR_ENABLED=true/false` env var controls whether Laravel calls the SSR server
- **Client staging URL**: `https://nuorsteel-website-production.up.railway.app`
- **Demo URL**: `https://nuorsteel.hardrock-co.com` (separate Railway project on Hardrock domain, Cloudflare DNS with CNAME + TXT verification)
- **Certificate PDFs**: Stored in `storage/app/private/certificates/`, tracked in git via `.gitignore` exceptions

### LinkedIn Integration
- Method: **Manual CMS** (admin pastes embed code or URL — no API needed)
- Admin page: `/admin/linkedin-posts` (CRUD with visibility toggle, reorder, undo)
- Display: Auto-rotating carousel on homepage with dot indicators
- Controller: `Admin/LinkedinPostController.php`
- Seeder: `LinkedinPostSeeder` (real Nuor Steel posts)

### Image Processing
- Client-side cropping on upload
- Server-side resizing via Intervention Image

---

## What's NOT Included

- ~~Management section~~ (removed per client request)
- ~~Separate vendor registration page~~ (handled via Contact form)
- ~~Projects section~~ (replaced with Certificates)
- ~~Auto language detection~~ (manual toggle only)
- ~~Draft/publish workflow~~ (simple active/inactive)
- ~~Full audit log~~ (replaced by Change Log system with revert support)
- ~~Standalone React SPA~~ (migrated to Inertia.js)
- ~~API routes / Sanctum tokens~~ (replaced with session auth)

---

## Files Reference

- Full specification: [docs/WEBSITE_SPECIFICATION.md](docs/WEBSITE_SPECIFICATION.md)
- This context file: [CLAUDE.md](CLAUDE.md)
- Core Values V1 backup: [docs/core-values-v1-backup.md](docs/core-values-v1-backup.md) — original two-column layout with overlaid icon buttons

---

> **Last updated:** 2026-04-15 — Partners section (3-column scrolling logos, mobile stacked), core values expanded to 6, per-year timeline backgrounds, products page hero/thumbnail/explore-more refinements, container max-width 1800px

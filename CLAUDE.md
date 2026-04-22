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
- [x] Contact page: full dark-theme redesign — `bg-black`, dark form inputs (`bg-white/5`, `border-white/10`), clickable phone/email links (stacked when multiple), custom `RequestTypeSelect` dropdown with keyboard navigation and brand-orange styling (`border-primary/40`, `hover:bg-primary/10`, `bg-primary/15` selected)
- [x] Contact page: bilingual content support (controller passes `content_en` + `content_ar`, client picks via `useLanguage()`)
- [x] Contact page: structural adjustment — label + h1 + description live in the left column alongside contact info cards; form starts at the same row level as the header. Orange label `contact.hero.title` changed from "Get in Touch" → "Contact Us" to avoid duplication with h1 (which is CMS-driven, still "Get in Touch")
- [x] Footer + Contact info cards: render multiple phones/emails stacked — settings store comma-separated values (`+966543781868,+966545198760` and `info@nuorsteel.com,Nuorsteel@hotmail.com`), split in UI
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
- [x] About timeline mobile: swipeable card carousel (transparent card — no glass/blur/border), dot indicators, touch navigation, auto-advance
- [x] Timeline: per-year background images (`{year}-desktop/mobile-en/ar.webp`) crossfade as active event changes (AnimatePresence); "Present" uses original bg images; 20 images total in `public/images/about/journey/`

### Grey Theme Media Swaps (DONE, 2026-04-18)
- [x] Navbar logo replaced with new variants in `public/images/shared/logo/logo-{lg,sm}.{webp,png}` (filenames unchanged, no code edit needed)
- [x] Homepage hero: looping background video swapped to grey variant (`/videos/hero-bg.mp4` = LOW 3.2MB; optional `/videos/hero-bg-hd.mp4` HD 10.2MB)
- [x] Homepage Vision 2030 background swapped to grey desktop/mobile WebP + PNG fallback, anchored to bottom (`object-bottom` in [Home.tsx:445](resources/js/Pages/Public/Home.tsx#L445))
- [x] About hero background swapped to grey (`public/images/about/hero/bg-{desktop,mobile}-{en,ar}.webp`)
- [x] About timeline "Present" background swapped to grey (`public/images/about/journey/bg-{desktop,mobile}-{en,ar}.webp`)
- [x] Quality hero background swapped to grey (`public/images/quality/hero/hero-{desktop,mobile}-{en,ar}.webp`)
- [x] Cloudflare cache note: static assets are keyed WITHOUT query strings, so `?nocache=X` does NOT bust edge cache — use Cloudflare dashboard's Custom Purge by URL (paste the full asset URL) or browser hard refresh to verify new content

### Hero CTA + Bottom Links Tint (DONE, 2026-04-18)
- [x] Homepage hero "Contact Us" CTA: fill-on-hover orange sweep (`absolute bg-primary` sibling span with `ltr:-translate-x-full rtl:translate-x-full group-hover:translate-x-0`) + continuous diagonal shimmer via `animate-cta-shimmer::after` pseudo-element (new keyframe in [app.css:182-196](resources/css/app.css#L182-L196))
- [x] Hero bottom-link images (About Us / Core Values / News) tinted with `grayscale-50 brightness-110` on the `<img>` to match grey theme while keeping the hover-reveal animation ([HeroBottomLinks.tsx:39](resources/js/Components/Public/HeroBottomLinks.tsx#L39))

### Quality + Career Hero Alignment (DONE, 2026-04-18)
- [x] Quality and Career hero text containers use asymmetric padding (`pb-32 lg:pb-44`) on the flex-centered column to nudge text upward from center (matches visual weight of other pages)
- [x] Files: [Quality.tsx:54](resources/js/Pages/Public/Quality.tsx#L54), [Career.tsx](resources/js/Pages/Public/Career.tsx)

### Footer Refresh (DONE, 2026-04-18)
- [x] Newsletter input: `bg-gray-800 border-gray-700 focus:border-blue-500` → `bg-white/5 border-white/10 focus:border-primary` (matches dark card surfaces used elsewhere, orange focus)
- [x] Subscribe button: `bg-blue-600 hover:bg-blue-700` → `bg-primary hover:bg-primary-dark` (brand orange)
- [x] Copyright divider: `border-gray-800` (Tailwind `#1f2937` has a blue tint — read as a dark blue line on the dark footer) → `border-white/10` (neutral translucent white)
- [x] File: [Footer.tsx](resources/js/Components/Layout/Footer.tsx)

### Security Hardening — Public Surface (DONE, 2026-04-19)
- [x] Cloudflare Turnstile fully wired into all public POST forms (Footer newsletter, Contact, Career, JobDetail) — server-side verification via [TurnstileVerifier](app/Services/TurnstileVerifier.php), client widget in [Components/Public/Turnstile.tsx](resources/js/Components/Public/Turnstile.tsx)
- [x] Turnstile component refactored to `forwardRef<TurnstileHandle>` exposing `reset()` so parents can clear the single-use token after a backend error (`onError: () => turnstileRef.current?.reset()`) — single-use semantics meant the previous token was already burned
- [x] Turnstile `expired-callback` clears parent token state + resets the widget when the 5-min token expires (re-disables the submit button until re-verification)
- [x] Turnstile `error-callback` removes the widget after first failure (stops Cloudflare's internal retry loop spamming siteverify) and surfaces the error code inline
- [x] Submit buttons gated on token presence — `disabled={processing || !token}` across Footer, Contact, Career, JobDetail (defense-in-depth + clearer UX, server verification still authoritative)
- [x] CSP rebuilt in [SecurityHeaders middleware](app/Http/Middleware/SecurityHeaders.php) — explicit allowlist for Turnstile (`challenges.cloudflare.com` script + frame), Cloudflare Insights (`static.cloudflareinsights.com` script + `cloudflareinsights.com` connect), LinkedIn iframes, Google Fonts
- [x] CSP intentionally skipped in local dev (`if (!app()->isLocal())`) — Vite HMR origin uses bracketed IPv6 (`http://[::1]:5173`) which Chrome rejects as invalid CSP source
- [x] Permissions-Policy: added `xr-spatial-tracking=()` to suppress violation logs from third-party iframes (LinkedIn, Turnstile) probing the API
- [x] `trustProxies` in [bootstrap/app.php](bootstrap/app.php) locked to Cloudflare published CIDRs (IPv4 + IPv6) + RFC 1918 (Railway internal hop) — replaces wildcard `'*'` to prevent X-Forwarded-For spoofing from arbitrary clients
- [x] Login throttle in [LoginController](app/Http/Controllers/Auth/LoginController.php): per-email rate limit (5 attempts / 15 min) layered on top of route-level per-IP `throttle:5,1` — covers IP rotation against known admin email + IP fanning across many emails
- [x] LinkedIn URL validation in [Admin/LinkedinPostController](app/Http/Controllers/Admin/LinkedinPostController.php): parses URL host + scheme instead of substring-matching `linkedin.com`, rejects spoofs like `evil.com/?x=linkedin.com` or `linkedin.com.evil.com`, requires `https://` + host equal to `linkedin.com` or `*.linkedin.com`
- [x] SVG uploads explicitly excluded from public media-serving allowlist in [MediaServeController](app/Http/Controllers/MediaServeController.php) — SVGs can carry inline scripts that execute on top-level navigation
- [x] `.env.example` documents Cloudflare's official Turnstile test keys (always-pass / always-fail / force-challenge) — local dev shouldn't pollute prod widget analytics

### Misc (2026-04-19)
- [x] Quality hero image: `object-cover object-bottom` so the portrait crop anchors to the bottom on all viewports (was top-anchored, cutting off subject's torso on narrow viewports) — [Quality.tsx](resources/js/Pages/Public/Quality.tsx)
- [x] Code splitting verified — `manualChunks` already splits all vendor bundles (largest is `vendor-react` at 217kB / 70kB gzipped, well under 500kB Vite warning threshold)

### Header Redesign — Dropdowns + Transparent-to-Glass (DONE, 2026-04-20)
- [x] Navbar visual: transparent on top of page, morphs to glass (`bg-surface/70` + `backdrop-blur`) once user scrolls — replaces the previous always-visible gradient background
- [x] Nav link typography: uppercase + tracked (`uppercase tracking-wider`) with a center-growing orange underline on hover (pseudo-element that scales from `scale-x-0` → `scale-x-100` originating at `origin-center`)
- [x] Three dropdown menus on desktop:
  - **About** — simple dropdown linking to in-page anchors (`#vision-mission`, `#capabilities`, `#journey`)
  - **Products** — mega menu with product thumbnails + names + short taglines (TMT Bars, Billets)
  - **Certificates** — simple dropdown linking to the three categories, deep-link via `?category=esg|quality|governance`
- [x] Desktop dropdown UX: opens on hover, closes with a **150ms delay** on mouse-leave so the cursor can travel from trigger to panel without closing mid-transit
- [x] Mobile: Option A accordion — dropdown headers expand inline, sub-links appear beneath (no off-canvas sub-sheets)
- [x] About page: wrapped sub-sections in `scroll-mt-20` anchor divs (`#vision-mission`, `#capabilities`, `#journey`) so header links land below the fixed navbar — [About.tsx:12](resources/js/Pages/Public/About.tsx#L12)
- [x] Certificates page: reads `?category=` URL param on mount to pre-select the category view (supports deep-linking from header dropdown) — [Certificates.tsx:11](resources/js/Pages/Public/Certificates.tsx#L11)
- [x] `welcome.blade.php`: replaced arbitrary Tailwind values with canonical classes (minor cleanup)
- [x] File: [Header.tsx](resources/js/Components/Layout/Header.tsx)

### Products Page — Billets Tab Fix (DONE, 2026-04-19)
- [x] `ProductTabs` accepts `showQuote` prop — when `false`, the **Request Quote** tab is filtered out of the tab list (billets don't support quote requests)
- [x] Applied via `<ProductTabs ... showQuote={selectedSlug !== 'billets'} />` in [Products.tsx:564](resources/js/Pages/Public/Products.tsx#L564)
- [x] Safety `useEffect`: if user has **Request Quote** active on TMT bars and switches to billets, snap `activeTab` back to `overview` (prevents rendering a hidden tab's content)
- [x] DemoContentSeeder: replaced em-dash with period in billets short description (EN + AR) — avoids typographic inconsistency

### Products Page — TMT Bar Hero Sizing + Marking Dots (DONE, 2026-04-21)
- [x] TMT bar hero render swapped to the **tagged** variant (`tmt-bars-hero-{en,ar}.webp`) in the default (non-expanded) hero slot, while the Explore More + thumbnails use the plain tagged rebar (`tmt-bars-{en,ar}.webp`) — both read from `public/images/products/renders/`
- [x] `getProductHeroImage()` helper in [Products.tsx](resources/js/Pages/Public/Products.tsx) selects the `-hero-` variant only for slugs in `heroVariantSlugs` (currently just `tmt-bars`); everything else falls through to `getProductImage()`
- [x] Per-product hero image sizing restored (billets smaller, tmt-bars larger) after the Apr 14 unified sizing proved too large for TMT bars on 1536px laptops:
  - **Billets** (default hero): `max-h-44 xl:max-h-52 2xl:max-h-64 max-w-75 xl:max-w-100` (explicit max-w for the wide-aspect billets image)
  - **TMT bars** (default hero): `max-h-64 xl:max-h-80 2xl:max-h-82 min-[1800px]:max-h-96` — stays small on 1536px laptops, bumps up only on 1800px+ monitors
- [x] **Used arbitrary variant `min-[1800px]:` instead of a registered `3xl:` breakpoint** — Tailwind v4 `@theme { --breakpoint-3xl: 112.5rem; }` is correct syntax but Vite's HMR doesn't reliably pick up new `@theme` tokens without a full restart. `min-[1800px]:` compiles inline and always works. Both are registered, but the inline form is preferred for breakpoints that only appear in one place
- [x] `translate-y-52` applied only to tmt-bars hero wrapper (and `translate-y-12` to billets) to pull each image into visual alignment with the diagonal clip-path ([Products.tsx:665](resources/js/Pages/Public/Products.tsx#L665))
- [x] TMT bar Explore More image now shows **6 interactive orange pulsing dots** (`TmtMarkingDots` component) aligned to each stamped marking on the bar: KSA → Country of Origin, NUOR → EN Brand Name, نور → AR Brand Name, [size] → Rebar Diameter, S → SASO/ASTM A615M, 4 → Grade 60 (420 MPa)
- [x] Dot positions driven by `leftPct` percentages in a `TMT_MARKINGS` array — tune per new image swap. Default values: `15, 32, 48, 64, 78, 92`
- [x] Dot styling: `bg-primary` core + `animate-ping` outer ring + `ring-2 ring-white/70` highlight. Tooltip uses framer-motion `AnimatePresence`, `bg-surface-dark` with `border-primary/40` and an upward-pointing CSS-border triangle
- [x] Overlay wrapper has `pointer-events-none` + `pointer-events-auto` on each dot so the image area still passes clicks through to the panel below but dots themselves are hoverable
- [x] Bilingual label + value strings inlined in `TMT_MARKINGS` (not promoted to i18n yet — move to `en.ts`/`ar.ts` if the list grows or if the admin CMS needs to edit them)

### Admin UX Hardening (DONE, 2026-04-22)
- [x] **Partners admin**: bumped logo preview area to `aspect-square ... p-6` with `max-h-full max-w-full object-contain` so logos fill the card (was `max-h-24 max-w-24`). Delete flow replaced with inline type-to-confirm modal requiring the user to type the partner's English name (mirrors the name-in-URL pattern used elsewhere) — deletes remain fully reversible via session UndoButton + persistent Change Log revert. File: [resources/js/Pages/Admin/Partners.tsx](resources/js/Pages/Admin/Partners.tsx)
- [x] **Products admin missing images**: listing page now eager-loads `['featuredImage', 'images.media']` (was featuredImage only) and the card falls back to `featured_image?.url ?? images?.[0]?.media?.url ?? null`. Also added idempotent data migration [2026_04_22_130000_reseed_product_featured_images.php](database/migrations/2026_04_22_130000_reseed_product_featured_images.php) which re-seeds `featured_image_id` for tmt-bars + billets by copying from `public/images/home/products/` to `storage/app/private/media/` if the FK is null. Root cause: an earlier seed ran, media rows were cleared, and the old seeder's existence guard prevented re-seeding
- [x] **Settings dirty-state indicators**: `originalValues` snapshot + derived `hasChanges` + `isDirty(key)` helper drives a per-field `Pencil` **Modified** badge, amber ring on the input, "Was: <value>" helper text, and a Revert link that restores the original value. Also a `dirtyCount` pill in the page header. Prevents editors from silently committing a typo (e.g. stray character in LinkedIn URL). Snapshot resets to the new values on `onSuccess`
- [x] **Settings email chips — delete protection**: email recipient X button now opens an inline type-to-confirm modal requiring the literal word `delete`. Section also gets an amber "Admin-only" banner. Backend route was already under `Route::middleware('admin')` — only the UI affordance needed surfacing
- [x] **Change Log delete protection**: replaced the shared `ConfirmDialog` on the delete action with an inline type-`delete`-to-confirm modal. The Revert action keeps `ConfirmDialog` (safe operation — restores old state rather than destroying it). File: [resources/js/Pages/Admin/ChangeLog.tsx](resources/js/Pages/Admin/ChangeLog.tsx)
- [x] **Applications sorting + "new" highlight**: `CareerApplication::scopeOrdered` now runs `CASE WHEN status='new' AND viewed_at IS NULL THEN 0 WHEN status='new' THEN 1 ELSE 2 END` then `created_at DESC` — unviewed new at the top, viewed new below them, everything else after. Colored top borders (red/yellow/green/blue) removed from reviewed/shortlisted/rejected cards — only the status badge carries the color. Unviewed-new cards get a brand-orange top border (`border-t-primary`), an orange dot (`bg-primary shadow-[0_0_0_4px_rgba(255,122,0,0.2)]`), and the `animate-new-pulse` keyframe (rgba switched from blue `59,130,246` to orange `255,122,0` in [app.css](resources/css/app.css))
- [x] **Applications viewed_at**: migration [2026_04_22_140000_add_viewed_at_to_career_applications.php](database/migrations/2026_04_22_140000_add_viewed_at_to_career_applications.php) adds a nullable `viewed_at` timestamp. `openView` POSTs to `/admin/applications/{id}/viewed` (new route, admin-group) which stamps `viewed_at = now()` only if still `status='new'` and unseen (so a later status revert-to-new doesn't re-stamp). The card then loses the glow/dot and demotes within the new block
- [x] **CLAUDE.md commit-message convention**: new `## Collaboration — Commit Message Suggestions` section codifies the end-of-turn `type(scope): summary` one-liner for completed code tasks (suggestion only — never runs the commit)

### Migration Fix (DONE, 2026-04-21)
- [x] `2026_04_20_130000_sync_site_content_core_values_and_drop_governance.php` was inserting a non-existent `created_at` column on `site_content` (the table has only `updated_at` by design — see [create_site_content_table migration](database/migrations/2026_02_05_000003_create_site_content_table.php)). Removed the stray `'created_at' => $now` from the `updateOrInsert` payload. This was blocking local migrations and cascading to the pending `create_partners_table` migration, which caused a 500 on `/` (`nour_steel.partners doesn't exist`)
- [x] Pattern to watch: any future data-seed migration that writes to `site_content` via `DB::table()` must NOT include `created_at`. Use `['updated_at' => $now]` only

### Partners Section (DONE, temporarily hidden)
- [x] `PartnersSection` component (`resources/js/Components/Public/PartnersSection.tsx`) — 3-column auto-scrolling logo carousel inserted above News section on homepage
- [x] 16 partner logos in `public/images/home/partners/` with per-logo size tiers (LG/XL/XXL/XXXL constants)
- [x] Per-column hover pause (each ScrollColumn manages its own `paused` state independently)
- [x] Desktop: absolute-positioned columns fill full section height (600px) with text panel on the left (2/5 width)
- [x] Mobile: stacked layout — header + paragraph on top, 3 scrolling columns below (420px height)
- [x] Scroll animations via CSS keyframes (`animate-scroll-up` / `animate-scroll-down`) in `app.css`
- [x] Per-logo size classes scoped to `lg:` so mobile uses unified smaller constraints (`max-h-24 max-w-24` base, larger per-tier)
- [x] `desktopLogoClass` prop on `Partner` interface — allows per-logo desktop size override independent of mobile tier (skips `lg:max-h-none lg:max-w-none` base for those logos)
- [x] **Section currently commented out in [Home.tsx](resources/js/Pages/Public/Home.tsx) — client will request to re-enable later**

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
- [ ] **TODO: Cookie consent banner** — when SEO/analytics work begins OR any ad/tracking API is integrated (Google Analytics, Google Ads, Meta Pixel, LinkedIn Insight Tag, etc.), add a consent service that captures user approval BEFORE loading the tracking scripts. Use the same approach as Hardrock (reference implementation). GDPR + Saudi PDPL compliance — no trackers should fire until consent is granted. Applies to: gtag.js, fbq, LinkedIn partner script, anything setting non-essential cookies.

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
- [x] Code splitting — `manualChunks` in [vite.config.ts](vite.config.ts) splits vendor bundles (react, inertia, motion, i18n, icons, lenis); largest chunk is `vendor-react` at 217kB / 70kB gzipped (well under 500kB threshold)
- [x] Local dev Turnstile test keys documented in `.env.example` (Cloudflare's official always-pass / always-fail / force-challenge keys — no account/hostname config needed)
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

## Collaboration — Commit Message Suggestions

After completing any task that touches code, end the reply with a one-line suggested commit message in the project's conventional style (`type(scope): summary`, lowercase subject, imperative mood — e.g. `feat(admin/applications): mark new applications viewed on open`). Do NOT run the commit — just suggest the message so the user can copy/paste it. Skip this when the task was purely exploratory (reading, answering questions) or when no files changed.

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

### Bot Protection (Cloudflare Turnstile)
- All public POST forms (contact, career apply, newsletter) verify a Turnstile token server-side via [TurnstileVerifier](app/Services/TurnstileVerifier.php).
- **Feature-flagged**: with no `TURNSTILE_SECRET_KEY` set, verification is a no-op and the widget is hidden — keeps local dev + pre-launch deploys working.
- **Local dev**: `.env.example` documents Cloudflare's official test keys (always-pass `1x...`, always-fail `2x...`, force-challenge `3x...`) — use these instead of real keys to avoid polluting prod widget analytics + skip hostname allowlist setup.
- **To enable in production**:
  1. Create a Turnstile site at https://dash.cloudflare.com → Turnstile → Add site (domain + invisible/managed mode).
  2. Set `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Railway env vars.
  3. CSP already allows the Turnstile domain (`challenges.cloudflare.com`).
- The widget is rendered by [Components/Public/Turnstile.tsx](resources/js/Components/Public/Turnstile.tsx); the site key is shared via [HandleInertiaRequests](app/Http/Middleware/HandleInertiaRequests.php) (`turnstileSiteKey`).
- **Component is `forwardRef<TurnstileHandle>`** — exposes `reset()` so parent forms can clear the single-use token after a backend error and force a new challenge. Used by Footer (newsletter), Contact, Career, and JobDetail forms via `turnstileRef.current?.reset()` in `onError` handlers.
- **Submit button gating**: every form sets `disabled={processing || !token}` so users cannot POST without a valid Turnstile token (defense-in-depth + clearer UX). Server-side verification is still authoritative.
- **Token expiry**: tokens expire after ~5 min. The `expired-callback` clears parent state + resets the widget, re-disabling the submit button until the user re-verifies.
- **Error handling**: the `error-callback` removes the widget after the first failure (instead of letting Cloudflare's internal retry loop spam siteverify) and surfaces the error code inline.

### CSP, trustProxies, login throttle
- **CSP** is defined in [SecurityHeaders middleware](app/Http/Middleware/SecurityHeaders.php). If you add a third-party script/iframe/font, update the directive. Current allowlist:
  - `script-src`: self + `'unsafe-inline'` (JSON-LD blocks) + `challenges.cloudflare.com` (Turnstile) + `static.cloudflareinsights.com` (CF Insights/RUM)
  - `style-src`: self + `'unsafe-inline'` + `fonts.googleapis.com`
  - `frame-src`: self + `www.linkedin.com` (post embeds) + `challenges.cloudflare.com` (Turnstile widget)
  - `connect-src`: self + `cloudflareinsights.com` (RUM beacon POSTs)
  - `font-src`: self + `data:` + `fonts.gstatic.com`
- **CSP is intentionally NOT sent in local dev** (`if (!app()->isLocal())`) — Vite's HMR origin uses bracketed IPv6 syntax (`http://[::1]:5173`) that Chrome rejects as an invalid CSP source. Production hardening only.
- **Permissions-Policy** suppresses `xr-spatial-tracking=()` to silence violation logs from third-party iframes (LinkedIn, Turnstile) probing the API.
- **`trustProxies`** in [bootstrap/app.php](bootstrap/app.php) is locked to Cloudflare CIDRs + RFC 1918 (Railway internal hop). Refresh the CF list from https://www.cloudflare.com/ips/ if rate-limit logs show wrong client IPs. **Defense-in-depth TODO**: enforce CF-only origin access (Authenticated Origin Pulls or a secret header) so the Railway URL can't be hit directly with a spoofed `X-Forwarded-For`.
- **Login throttle** in [LoginController](app/Http/Controllers/Auth/LoginController.php) keys per-email (5 attempts / 15 min) — covers IP rotation against a known admin email. Route-level `throttle:5,1` keys per-IP — covers an IP fanning out across many emails. Both layers run. **TODO**: add Turnstile to login form for additional bot protection (currently throttle-only).
- **LinkedIn URL validation** in [Admin/LinkedinPostController](app/Http/Controllers/Admin/LinkedinPostController.php) parses URL host + scheme rather than substring-matching `linkedin.com`. Rejects spoofs like `evil.com/?x=linkedin.com` or `linkedin.com.evil.com`. Requires `https://` + host equal to `linkedin.com` or a `*.linkedin.com` subdomain.

### SVG uploads
- The public media-serving endpoint ([MediaServeController](app/Http/Controllers/MediaServeController.php)) **explicitly excludes** `image/svg+xml` from the allowlist. SVGs can carry inline scripts that execute when loaded as a top-level navigation, regardless of `X-Content-Type-Options`. If admin upload starts accepting SVG in the future, sanitize them server-side (DOMPurify-in-PHP equivalent) before storage and force `Content-Disposition: attachment` on serving.

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
- **Theme tokens** (in `@theme` block at `resources/css/app.css`): `bg-surface` (`#414042`, main page/section bg) and `bg-surface-dark` (`#2D2D2F`, footer / detail panels). Use these on public pages instead of `bg-black` — the public site is unified on grey, not pure black. `bg-black/40|50|70` transparency overlays are intentional and should stay.
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

> **Last updated:** 2026-04-22 — Admin UX hardening across six areas: (1) Partners admin logos now fill their preview area + type-the-partner-name delete confirmation; (2) Products admin missing images fixed with idempotent `featured_image_id` reseed migration + gallery fallback; (3) Settings page gets dirty-state indicators (Modified badges, amber rings, Was/Revert) so editors can't silently commit typos in URLs; (4) Settings email chips + Change Log delete actions now require typing `delete` to confirm, admin-only; (5) Applications cards — colored top borders stripped from reviewed/shortlisted/rejected (status badges only); unviewed-new cards get brand-orange border + pulse + dot (rgba switched from blue to orange in `new-application-pulse` keyframe); (6) new `viewed_at` column on `career_applications` — `scopeOrdered` sorts unviewed-new → viewed-new → others, openView POSTs to `/admin/applications/{id}/viewed` stamping the timestamp once, which clears the glow + demotes the card within the new block. Also added a `## Collaboration — Commit Message Suggestions` section documenting the end-of-turn `type(scope): summary` one-liner convention. Prior (2026-04-21): Products page TMT bar hero render swapped to the tagged variant with 6 interactive orange pulsing dots (`TmtMarkingDots` in [Products.tsx](resources/js/Pages/Public/Products.tsx)) in Explore More — each dot hovers to reveal a bilingual tooltip explaining one of the stamped markings (KSA, NUOR, نور, size, S, 4). Per-product hero sizing restored (billets smaller, TMT bars larger) via arbitrary `min-[1800px]:max-h-96` variant instead of a registered `3xl:` breakpoint — Vite's HMR doesn't reliably pick up new `@theme` breakpoint tokens, so inline arbitrary variants are preferred for one-off breakpoints. Also fixed [2026_04_20_130000_sync_site_content_core_values_and_drop_governance migration](database/migrations/2026_04_20_130000_sync_site_content_core_values_and_drop_governance.php) — was inserting a non-existent `created_at` column into `site_content` (table has only `updated_at` by design), which blocked all pending migrations including `create_partners_table` and caused a 500 on `/`. Prior (2026-04-20): Header redesign — transparent-to-glass navbar, three dropdowns (About / Products mega / Certificates), 150ms close delay on desktop, mobile accordion. Prior (2026-04-19): public-surface security hardening — Turnstile on all public POST forms, CSP rebuilt, `trustProxies` locked to Cloudflare CIDRs, login throttle layered, LinkedIn URL host/scheme validation, SVG uploads blocked from public serving.

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
- [x] Media library (upload, grid, folder/type filter, folder management)
- [x] Products CRUD (half-width card grid, featured image picker, CustomSelect dropdowns)
- [x] Certificates CRUD (category-folder navigation, PDF viewer modal)
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
- [x] About page (overview, vision, mission, timeline)
- [x] Recycling page (sub-page under About)
- [x] Products listing + Product detail page
- [x] Quality page
- [x] Career page (listings + open application form)
- [x] Job detail page (job info + application form)
- [x] Certificates page
- [x] Contact page (form with file upload)

### Homepage Redesign (DONE)
- [x] Header: transparent overlay on homepage, solid white on other pages, fixed positioning
- [x] Header: smart scroll behavior (hides on scroll down, shows on scroll up)
- [x] Hero: full-viewport (`h-screen`), gradient placeholder bg, staggered entrance animations
- [x] Hero: H1 left-aligned, "Contact Us" link scrolls to footer, RTL-aware arrow
- [x] Hero bottom links: 3 interactive links (About Us, Core Values, Sustainability) with hover image-reveal
- [x] framer-motion for all hero animations + mobile menu `AnimatePresence`
- [x] `useScrollDirection` custom hook (`resources/js/hooks/useScrollDirection.ts`)
- [x] `HeroBottomLinks` component (`resources/js/Components/Public/HeroBottomLinks.tsx`)
- [x] Homepage sections: About Us, Vision & Mission, Vision 2030, interactive Core Values, Products, LinkedIn, CTA
- [x] Core Values: interactive tabbed section with overlaid icon buttons on image placeholder
- [x] Products: two interactive panels (TMT Bars / Billets) with hover expand, color overlay fade, and angled clip-path divider (lg+)
- [x] All sections dark-themed (gray-800 → gray-950 gradient flow)
- [x] Language defaults to English always (no localStorage persistence)

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
- [ ] Railway environment variables (DB credentials, APP_KEY, APP_URL)
- [ ] Run migrations + seeders on Railway
- [ ] Enable SSR on Railway (start Node SSR server alongside PHP)

### Remaining
- [ ] LinkedIn API integration (homepage feed)
- [ ] Real images for hero background, bottom link hover panels, core values section, and product panels (currently gradient placeholders)
- [ ] Logo image for header (currently text-only)
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

### Navigation (5 items in navbar)
```
About Us | Products | Quality | Career | Certificates
```
- "Contact" was removed from the navbar — contact info lives in the footer

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

## Email Routing

| Form | Recipients |
|------|------------|
| Contact (all types) | info@nuorsteel.com, it@nuorsteel.com |
| Career applications | careers@nuorsteel.com, hr@nuorsteel.com |

---

## Contact Form Fields

1. Name (required)
2. Company (required)
3. Email (required)
4. Phone (required)
5. Country (required, dropdown)
6. Type of Request (required, dropdown)
7. Subject (required)
8. Message (required, max 2000 chars)
9. File Upload (optional, PDF, max 5MB)

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
/certificates           → Supplier approvals & certificates
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
```

---

## Certificates Categories

### ESG (Sustainability)
- EPD
- HPD
- NCEC
- ISO 14001
- ISO 45001

### Quality
- ISO 9001
- MTC file
- SASO test
- Al Hoty calibration

### Governance
- Integrated Policy
- Code of Conduct

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
| Attachments | 5MB | PDF only |
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
- **Animations**: framer-motion (isolated in `vendor-motion` Vite chunk)
- **i18n**: react-i18next with EN/AR translation files (bundled, not HTTP-loaded)
- **Flash messages**: Server redirects with `->with('success', '...')`, rendered by FlashMessages component via toast
- **SSR safety**: All `window`/`document`/`localStorage` access guarded with `typeof window !== 'undefined'`

### Key File Locations
```
resources/js/Pages/Public/     → Public page components (10 pages)
resources/js/Pages/Admin/      → Admin page components (16 pages)
resources/js/Layouts/          → PublicLayout, AdminLayout
resources/js/Components/       → Shared components (Layout/, Admin/, Public/)
resources/js/hooks/            → Custom hooks (useScrollDirection)
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
```

### Deployment (Railway)
- Single service — Railpack builder with PHP 8.2 + Node 22
- Build: `composer install && npm install && npm run build && php artisan migrate --force`
- `npm run build` outputs client to `public/build/` + SSR bundle to `bootstrap/ssr/ssr.js`
- **SSR in production**: Requires running `node bootstrap/ssr/ssr.js` alongside PHP (port 13714)
- **Proxy**: Railway terminates SSL — `trustProxies(at: '*')` in `bootstrap/app.php` ensures HTTPS URLs
- **SSR toggle**: `INERTIA_SSR_ENABLED=true/false` env var controls whether Laravel calls the SSR server
- **Staging URL**: `https://nuorsteel-website-production.up.railway.app`

### LinkedIn Integration
- Method: LinkedIn API (requires Developer App approval)
- Sync: Every 6 hours via scheduled task
- Display: 5 latest posts on homepage
- Fallback: "Follow us on LinkedIn" link

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

> **Last updated:** 2026-02-22 — based on commit `513d3e3` (*feat: redesign products section with interactive hover panels and update product data*)

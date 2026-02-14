# Nuor Steel - Project Context

> Quick reference for AI assistants and developers

---

## Project Overview

**Company:** Nuor Steel Industry Company (شركة نور للصناعات الحديدية)
**Type:** Corporate industrial website with admin CMS
**Stack:** Laravel 12 + Inertia.js + React 19 + TypeScript
**Database:** MySQL
**Architecture:** Single-service monolith (Laravel serves everything via Inertia)
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
- [x] HandleInertiaRequests middleware (shares auth, locale, flash, ziggy)

### Admin Panel Frontend (DONE)
- [x] Login page with Inertia form
- [x] Admin layout with sidebar (active state via `usePage().url`)
- [x] Dashboard with stats
- [x] Content editor (bilingual side-by-side EN/AR)
- [x] Timeline events CRUD (drag-and-drop reorder)
- [x] Media library (upload, grid, folder/type filter)
- [x] Products CRUD (3-tab form: details/images/specs)
- [x] Certificates CRUD (PDF upload)
- [x] Careers CRUD + Applications inbox (status workflow)
- [x] Contact submissions inbox (read/archive/filters)
- [x] Newsletter management (admin-only, stats, export)
- [x] Settings page (admin-only, grouped key-value editor)
- [x] Users page (admin-only, CRUD with self-protection)

### Public Pages Frontend (DONE)
- [x] PublicLayout (Header + Footer + children)
- [x] Home page (hero, features, products, CTA)
- [x] About page (overview, vision, mission, timeline)
- [x] Recycling page (sub-page under About)
- [x] Products listing + Product detail page
- [x] Quality page
- [x] Career page (listings + open application form)
- [x] Job detail page (job info + application form)
- [x] Certificates page
- [x] Contact page (form with file upload)

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
- [ ] **TODO: Replace PLACEHOLDER values** with real company details before going live:
  - Address (street, city, region, postal code)
  - Phone number
  - LinkedIn URL
  - Number of employees
  - FAQ answers (city name)
  - OG image path

### Remaining
- [ ] LinkedIn API integration (homepage feed)
- [ ] Code splitting (chunk >500kB)
- [ ] Structured data placeholders (see above)
- [ ] Testing & deployment

---

## Key Decisions Made

### Branding & Language
- Default language: **English**
- Secondary: **Arabic** (manual toggle, no auto-detect)
- Header text: "Nuor Steel Industry Company"
- Browser title format: "Nuor Steel | {Page Name}"

### Navigation (6 items)
```
About Us | Products | Quality | Career | Certificates | Contact
```

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
- Products have **image gallery** (multiple images)

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
- **Build**: `npm run build` (outputs to `public/build/`)

### Frontend Architecture
- **Framework**: Inertia.js — bridges Laravel controllers to React page components
- **Data flow**: Controllers pass data as props via `Inertia::render('Page/Name', [...props])`
- **Mutations**: `router.post/put/delete()` with `preserveScroll`, `onSuccess`, `onFinish`
- **Forms with files**: Use native `FormData` + `forceFormData: true`
- **Routing**: Server-driven via `routes/web.php` — no client-side router
- **Auth state**: `usePage<PageProps>().props.auth.user` (shared by middleware)
- **Styling**: TailwindCSS v4 with custom `primary` color
- **Icons**: Lucide React
- **i18n**: react-i18next with EN/AR translation files (bundled, not HTTP-loaded)
- **Flash messages**: Server redirects with `->with('success', '...')`, rendered by FlashMessages component via toast

### Key File Locations
```
resources/js/Pages/Public/     → Public page components (10 pages)
resources/js/Pages/Admin/      → Admin page components (16 pages)
resources/js/Layouts/          → PublicLayout, AdminLayout
resources/js/Components/       → Shared components (Layout/, Admin/)
resources/js/types/            → TypeScript interfaces
resources/js/i18n/             → Translation files (en.ts, ar.ts)
resources/js/contexts/         → LanguageContext
resources/js/app.tsx           → Inertia entry point
resources/views/app.blade.php  → Root Blade template (@inertia)
app/Http/Controllers/Public/   → Public Inertia controllers
app/Http/Controllers/Admin/    → Admin Inertia controllers
app/Http/Controllers/Auth/     → Login/logout controller
routes/web.php                 → All routes (public + admin)
```

### Deployment (Railway)
- Single service — Nixpacks auto-detects Laravel + Node.js
- Build: `composer install && npm install && npm run build && php artisan migrate --force`
- `npm run build` outputs to `public/build/` (laravel-vite-plugin default)

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
- ~~Full audit log~~ (basic created_by/updated_by only)
- ~~Standalone React SPA~~ (migrated to Inertia.js)
- ~~API routes / Sanctum tokens~~ (replaced with session auth)

---

## Files Reference

- Full specification: [docs/WEBSITE_SPECIFICATION.md](docs/WEBSITE_SPECIFICATION.md)
- This context file: [CLAUDE.md](CLAUDE.md)

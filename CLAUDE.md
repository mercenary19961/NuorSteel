# Nuor Steel - Project Context

> Quick reference for AI assistants and developers

---

## Project Overview

**Company:** Nuor Steel Industry Company (شركة نور للصناعات الحديدية)
**Type:** Corporate industrial website with admin CMS
**Stack:** Laravel 12 + React 19 + TypeScript
**Database:** MySQL
**Branch:** `construction_phase`

---

## Build Progress

### Backend (DONE)
- [x] Database migrations (14 tables)
- [x] Eloquent models with relationships
- [x] Admin API controllers (CRUD for all resources)
- [x] Public API controllers (read-only + form submissions)
- [x] Auth with Sanctum (login, logout, token expiry)
- [x] Admin middleware (role guard)
- [x] Rate limiting on login
- [x] File storage in private directory
- [x] Database seeders

### Admin Panel Frontend (DONE)
- [x] Auth context + login page + admin layout with sidebar
- [x] Dashboard with stats
- [x] Content editor (bilingual side-by-side EN/AR)
- [x] Timeline events CRUD
- [x] Media library (upload, grid, folder/type filter)
- [x] Products CRUD (3-tab form: details/images/specs)
- [x] Certificates CRUD (PDF upload)
- [x] Careers CRUD + Applications inbox (status workflow)
- [x] Contact submissions inbox (read/archive)
- [x] Newsletter management (admin-only, stats, export)
- [x] Settings page (admin-only, grouped key-value editor)
- [x] Users page (admin-only, CRUD with self-protection)
- [x] RequireAdmin guard on admin-only routes

### Public Pages Frontend (DONE)
- [x] PublicLayout (Header + Footer + Outlet)
- [x] Home page (hero, features, CTA — wired to API)
- [x] About page (overview, vision, mission, timeline — wired to API)
- [x] Products listing (wired to API)
- [x] Product detail page (`/products/:slug`)
- [x] Quality page (wired to API)
- [x] Career page (listings + application form — wired to API)
- [x] Certificates page (wired to API)
- [x] Contact page (form wired to API)

### Local Dev Environment (DONE)
- [x] TailwindCSS v4 Vite plugin configured (`@tailwindcss/vite`)
- [x] Vite proxy `/api` → Laravel backend
- [x] CORS configured for `localhost:3000`

### Email Notifications (DONE)
- [x] ContactFormSubmitted Mailable + HTML template
- [x] CareerApplicationReceived Mailable + HTML template
- [x] Controllers wired with try/catch (failures logged, don't break submissions)
- [x] Recipients configurable via admin Settings (contact_recipients, career_recipients)

### Remaining
- [ ] LinkedIn API integration (homepage feed)
- [ ] Code splitting (chunk >500kB)
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
/products/:slug         → Product detail
/quality                → Quality & certifications
/career                 → Job listings + open application
/career/:slug           → Job detail
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

## Security (CRITICAL)

Security is extremely important for this project. Every code change must consider security implications. Follow these rules strictly:

### Authentication & Authorization
- All admin routes MUST be behind `auth:sanctum` middleware
- Admin-only routes (users, settings, newsletter) MUST use `admin` middleware
- Tokens MUST have expiration (not infinite) — currently 8 hours via Sanctum config
- Login endpoint MUST be rate-limited to prevent brute force — currently 5/minute
- Frontend MUST enforce auth guards (redirect unauthenticated users) and role guards (block editors from admin-only pages)

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

### API Security
- CORS must be configured for the SPA domain only (explicit allowed_origins in .env)
- Never expose sensitive data in API responses (passwords, tokens, internal paths)
- Return consistent error shapes (don't leak stack traces in production)
- Rate-limit ALL public POST endpoints (contact, career apply, newsletter subscribe)

### Frontend Security
- Never store sensitive data in localStorage beyond auth token
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
- **Backend**: `php artisan serve` (runs on `http://localhost:8000`)
- **Frontend**: `cd frontend && npm run dev` (runs on `http://localhost:3000`)
- **Both servers must run simultaneously** — frontend proxies `/api` to backend
- **Database**: MySQL on port 3307, database `nour_steel`, root user
- **Seeded accounts**:
  - Admin: `admin@nuorsteel.com` / `password`
  - Editor: `editor@nuorsteel.com` / `password`
- **Admin dashboard**: `http://localhost:3000/admin/login`
- **IMPORTANT**: Run `npm install` from `frontend/` directory, NOT the project root

### Frontend Architecture
- **API client**: Axios instance at `/api/v1` with auth token interceptor
- **Data fetching**: React Query v5 (useQuery/useMutation with query invalidation)
- **Routing**: React Router v7 with nested layouts
- **State**: React Context for auth + language; React Query for server state
- **Styling**: TailwindCSS v4 with custom `primary` color
- **Icons**: Lucide React
- **i18n**: react-i18next with EN/AR translation files
- **Admin pattern**: Each resource has a custom hook (useProducts, useCareers, etc.) wrapping API calls

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

---

## Files Reference

- Full specification: [docs/WEBSITE_SPECIFICATION.md](docs/WEBSITE_SPECIFICATION.md)
- This context file: [CLAUDE.md](CLAUDE.md)

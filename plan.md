# Admin Panel Implementation Plan

## Overview
Build the full admin panel frontend for Nuor Steel. The backend API is already complete with all endpoints defined in `routes/api.php`. The frontend needs: admin layout, login, dashboard, and 11 CRUD/management pages.

## File Structure

```
frontend/src/
├── components/
│   ├── layout/
│   │   ├── AdminLayout.tsx      ← Sidebar + header shell
│   │   └── AdminSidebar.tsx     ← Collapsible nav sidebar
│   ├── admin/
│   │   ├── DataTable.tsx        ← Reusable table with sort/search/pagination
│   │   ├── StatsCard.tsx        ← Dashboard stat widget
│   │   ├── StatusBadge.tsx      ← Colored status pills
│   │   ├── BilingualEditor.tsx  ← Side-by-side EN/AR text inputs
│   │   ├── ConfirmDialog.tsx    ← Delete/action confirmation modal
│   │   ├── Pagination.tsx       ← Page controls
│   │   ├── FileUpload.tsx       ← Drag & drop file upload
│   │   └── Toast.tsx            ← Success/error notifications
│   └── ui/                      ← (existing utils.ts)
├── hooks/
│   ├── useDashboard.ts
│   ├── useProducts.ts
│   ├── useCertificates.ts
│   ├── useCareers.ts
│   ├── useContacts.ts
│   ├── useNewsletter.ts
│   ├── useMedia.ts
│   ├── useContent.ts
│   ├── useTimeline.ts
│   ├── useSettings.ts
│   └── useUsers.ts
├── pages/
│   └── admin/
│       ├── LoginPage.tsx
│       ├── DashboardPage.tsx
│       ├── ContentPage.tsx
│       ├── TimelinePage.tsx
│       ├── MediaPage.tsx
│       ├── ProductsPage.tsx
│       ├── ProductFormPage.tsx
│       ├── CertificatesPage.tsx
│       ├── CertificateFormPage.tsx
│       ├── CareersPage.tsx
│       ├── CareerFormPage.tsx
│       ├── ApplicationsPage.tsx
│       ├── ContactsPage.tsx
│       ├── NewsletterPage.tsx
│       ├── SettingsPage.tsx
│       └── UsersPage.tsx
└── types/index.ts               ← Add admin-specific types
```

## Phase 0: Backend Security Hardening

**Goal:** Lock down the API before building the frontend.

1. **Rate limit login** — Add `throttle:5,1` middleware to `POST /v1/auth/login` (5 attempts per minute)
2. **Token expiration** — Set `sanctum.expiration` to `480` (8 hours) so tokens auto-expire
3. **CORS config** — Verify `config/cors.php` allows only the SPA origin (`localhost:5173` in dev)
4. **Sanitize file uploads** — Validate MIME types server-side (not just extension) in all upload controllers
5. **Strip sensitive data** — Ensure no API response leaks password hashes, internal paths, or tokens

## Implementation Phases

### Phase 1: Foundation (Admin Layout + Login + Dashboard + Shared Components)

**Goal:** Get the admin shell working with auth-protected routing, login, and a dashboard.

1. **Types** — Add types to `types/index.ts`:
   - Product, ProductImage, ProductSpecification
   - Certificate, TimelineEvent, CareerListing, CareerApplication
   - ContactSubmission, NewsletterSubscriber, Media, Setting, SiteContent
   - DashboardData

2. **Shared Components** (build once, reuse everywhere):
   - `AdminSidebar.tsx` — Collapsible sidebar with nav grouped by section, role-aware (hide Users/Settings/Newsletter for editors)
   - `AdminLayout.tsx` — Sidebar + top bar (user info, logout) + `<Outlet />`, wraps with auth guard (redirect to /admin/login if not authenticated)
   - `DataTable.tsx` — Props: columns, data, searchable, sortable, actions. Renders table with header/rows/empty state
   - `StatsCard.tsx` — Icon + label + value + optional trend
   - `StatusBadge.tsx` — Colored pill based on status string
   - `ConfirmDialog.tsx` — Modal overlay with title/message/confirm/cancel
   - `Pagination.tsx` — Previous/Next + page numbers from PaginatedResponse meta
   - `Toast.tsx` — Simple toast context/provider for notifications

3. **Login Page** (`LoginPage.tsx`):
   - Email + password form with react-hook-form + zod validation
   - Uses existing `useAuth().login()`
   - Redirects to `/admin` on success
   - Error display for invalid credentials

4. **Dashboard Page** (`DashboardPage.tsx`):
   - `useDashboard` hook — fetches `/admin/dashboard`
   - 6 stats cards (products, active products, open jobs, new apps, unread contacts, subscribers)
   - Recent applications table (last 5)
   - Recent contacts table (last 5)

5. **Update App.tsx routing**:
   - Import AdminLayout and admin pages
   - Nest admin routes under `<Route element={<AdminLayout />}>`
   - Keep `/admin/login` outside admin layout

### Phase 2: Content Management (Content Editor + Timeline + Media)

1. **useContent hook** — CRUD for site_content (`/admin/content`)
2. **ContentPage.tsx** — Grouped by page, expandable sections, side-by-side EN/AR editor using `BilingualEditor.tsx`
3. **BilingualEditor.tsx** — Two textarea/input fields side by side (EN left LTR, AR right RTL), synced save
4. **useTimeline hook** — CRUD for timeline events (`/admin/timeline`)
5. **TimelinePage.tsx** — List with drag-to-reorder, add/edit modal form
6. **useMedia hook** — Upload, list, delete for media (`/admin/media`)
7. **MediaPage.tsx** — Grid view with folder filter, upload button, edit alt text modal
8. **FileUpload.tsx** — Drag & drop zone, progress indicator, file type validation

### Phase 3: Business Data (Products + Certificates)

1. **useProducts hook** — CRUD + image management + specs (`/admin/products`)
2. **ProductsPage.tsx** — Data table with category filter, active/inactive toggle, search
3. **ProductFormPage.tsx** — Create/edit form with bilingual fields, image gallery upload, specifications table
4. **useCertificates hook** — CRUD (`/admin/certificates`)
5. **CertificatesPage.tsx** — Data table grouped by category (ESG/Quality/Governance)
6. **CertificateFormPage.tsx** — Create/edit with PDF upload, category picker, bilingual name/description

### Phase 4: Careers + Submissions (Careers + Applications + Contacts)

1. **useCareers hook** — CRUD for listings (`/admin/careers`)
2. **CareersPage.tsx** — Data table with status filter (draft/open/closed), expiry dates
3. **CareerFormPage.tsx** — Create/edit job listing with bilingual fields, requirements, expiry date
4. **ApplicationsPage.tsx** — Inbox-style list, status workflow (new → reviewed → shortlisted/rejected), CV download link
5. **useContacts hook** — List, mark read, archive (`/admin/contacts`)
6. **ContactsPage.tsx** — Inbox-style list, filter by type/read/archived, detail expand, attachment download

### Phase 5: System (Newsletter + Settings + Users)

1. **useNewsletter hook** — List, toggle, delete, export (`/admin/newsletter`)
2. **NewsletterPage.tsx** — Subscriber list with stats, export CSV button, toggle active (admin-only page)
3. **useSettings hook** — Get/update settings (`/admin/settings`)
4. **SettingsPage.tsx** — Grouped form (company info, contact info, social links, email recipients) (admin-only page)
5. **useUsers hook** — CRUD for users (`/admin/users`)
6. **UsersPage.tsx** — User list, create/edit modal, role assignment, activate/deactivate (admin-only page)

## Key Patterns

- **Auth Guard:** `AdminLayout` checks `useAuth().isAuthenticated` and redirects to login if false. Shows loading spinner while checking auth state.
- **Role Guard:** `RequireAdmin` wrapper component checks `user.role === 'admin'`, redirects editors to `/admin` dashboard with an unauthorized toast
- **API Hooks:** Each `use*.ts` hook uses React Query (`useQuery`, `useMutation`) with `apiClient` from `axios.ts`
- **Forms:** React Hook Form + Zod schemas for all create/edit forms. Zod validates on client, server validates again.
- **Tables:** All list pages use `DataTable` with column definitions, search, and pagination
- **Toast:** Success/error notifications after mutations via toast context
- **Bilingual:** All content forms use `BilingualEditor` for EN/AR fields
- **Security:** Never trust client-side validation alone. All file uploads validated both client and server. No sensitive data in API responses. Rate limiting on login. Token expiration enforced.

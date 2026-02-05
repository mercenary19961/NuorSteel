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
/admin/newsletter       → Subscriber management
/admin/settings         → Site settings
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

## Technical Notes

### File Storage
- CVs: `storage/app/cvs/`
- Attachments: `storage/app/attachments/`
- Certificates: `storage/app/certificates/`
- Media: `storage/app/media/`

### File Limits
| Type | Max Size | Formats |
|------|----------|---------|
| Images | 5MB | JPEG, PNG, WebP |
| CVs | 5MB | PDF only |
| Attachments | 5MB | PDF only |
| Certificates | 10MB | PDF |

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

---

## Next Steps

1. Create database migrations (14 tables)
2. Build Laravel API endpoints
3. Implement React frontend pages
4. Build admin panel
5. Set up email notifications
6. LinkedIn API integration
7. Testing & deployment

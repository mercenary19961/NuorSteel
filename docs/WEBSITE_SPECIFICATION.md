# Nuor Steel Website Specification

> Version 1.0 | February 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Branding & Language](#branding--language)
3. [Navigation & Sitemap](#navigation--sitemap)
4. [Page Specifications](#page-specifications)
5. [Database Schema](#database-schema)
6. [Admin Panel](#admin-panel)
7. [Forms & Email Routing](#forms--email-routing)
8. [Technical Stack](#technical-stack)

---

## Overview

Corporate website for **Nuor Steel Industry Company**, featuring:

- Bilingual support (English default, Arabic manual switch)
- Product catalog with technical specifications
- Career portal with admin management
- Certificate/ESG showcase
- Contact form with file uploads
- Newsletter subscription
- LinkedIn feed integration
- Full admin panel for content management

---

## Branding & Language

### Naming

| Context | Text |
|---------|------|
| Header (visible on page) | Nuor Steel Industry Company |
| Browser Tab Title | Nuor Steel \| {Page Name} |

### Language Settings

- **Default language:** English
- **Secondary language:** Arabic
- **Switching:** Manual toggle button (no auto-detect)
- **Arabic font:** Clean, readable Arabic typography
- **Content storage:** Side-by-side EN/AR fields in database

### Brand Guidelines (To Be Developed)

- Primary/Secondary colors
- Typography hierarchy
- Icon style (Lucide icons recommended)
- Spacing system (8px grid)
- Component styles

---

## Navigation & Sitemap

### Main Navigation

```
About Us | Products | Quality | Career | Certificates | Contact
```

### Complete Sitemap

```
PUBLIC PAGES
─────────────────────────────────────────────────────────────
/                           Home
├── Hero Section
├── About Snippet
├── Products Overview
├── Certificates Preview
├── LinkedIn Feed (5 latest posts via API)
├── Newsletter Signup
└── Call to Action

/about                      About Us
├── Company Overview
├── Timeline / Our Story
├── Vision & Mission
└── Governance (Integrated Policy, Code of Conduct)

/about/recycling            Recycling (Sub-page)
├── Process Overview
├── Process Flow Diagram
└── Media (images/videos)

/products                   Products
└── Product Grid (simple listing)

/products/:slug             Product Detail
├── Description
├── Image Gallery
├── Chemical Composition Table
├── Mechanical Properties Table
└── Dimensional Specifications

/quality                    Quality
├── ISO 9001 Overview
├── Testing & Calibration (MTC, SASO, Al Hoty)
└── Certificate Downloads

/career                     Career
├── Open Positions List
├── Job Detail (/career/:slug)
└── Open Application Form (always visible)

/certificates               Supplier Approvals & Certificates
├── ESG Section (EPD, HPD, NCEC, ISO 14001, ISO 45001)
├── Quality Certificates
├── Governance Documents
└── Downloadable Gallery

/contact                    Get in Touch
└── Contact Form (full fields + file upload)


ADMIN PAGES
─────────────────────────────────────────────────────────────
/admin/login                Admin Login

/admin                      Dashboard
├── Quick Stats
├── Recent Activity
└── Pending Alerts

/admin/content              Site Content
├── Grouped by Page
└── Side-by-side EN/AR Editor

/admin/timeline             Timeline Events (CRUD)

/admin/media                Media Library
├── Upload with Cropper
├── Folder Organization
└── Alt Text Management

/admin/products             Products (CRUD)
├── Product List
├── Add/Edit with Gallery
└── Specifications Builder

/admin/certificates         Certificates (CRUD)
├── ESG Category
├── Quality Category
└── Governance Category

/admin/careers              Careers
├── Job Listings (CRUD)
└── Status Management

/admin/applications         Career Applications
├── Inbox View
├── Status Workflow
└── Admin Notes

/admin/contacts             Contact Submissions
├── Filterable by Type
├── Read/Unread Status
└── Archive

/admin/newsletter           Newsletter
├── Subscriber List
└── Export

/admin/settings             Settings
├── General
├── Contact Info
├── Social Links
└── Email Recipients

/admin/users                User Management (Admin only)
├── User List
└── Add/Edit User
```

---

## Page Specifications

### Home Page

| Section | Content | Editable Via |
|---------|---------|--------------|
| Hero | Title, subtitle, CTA button | site_content |
| About Snippet | Short intro text | site_content |
| Products | 3-4 featured products | products (featured flag) |
| Certificates | Logo grid of certifications | certificates |
| LinkedIn Feed | 5 latest posts | linkedin_cache (API) |
| Newsletter | Email signup form | - |
| Footer | Contact info, nav links, social | settings |

### About Page

| Section | Content | Editable Via |
|---------|---------|--------------|
| Overview | Company description | site_content |
| Timeline | Year-by-year milestones | timeline_events |
| Vision & Mission | Statement text | site_content |
| Governance | Policy documents | certificates (governance) |

### Products Page

| Section | Content | Editable Via |
|---------|---------|--------------|
| Product Grid | All active products | products |
| Category Filter | Optional | product categories |

### Product Detail Page

| Section | Content | Editable Via |
|---------|---------|--------------|
| Gallery | Multiple images | product_images |
| Description | Full product info | products |
| Chemical Composition | Table of elements | product_specifications |
| Mechanical Properties | Strength, elongation | product_specifications |
| Dimensional Specs | Sizes available | product_specifications |

### Career Page

| Section | Content | Editable Via |
|---------|---------|--------------|
| Job Listings | Open positions with expiry | career_listings |
| Open Application | Form for general applications | - |

### Certificates Page

| Section | Content | Editable Via |
|---------|---------|--------------|
| ESG | Environmental certs | certificates (esg) |
| Quality | ISO, testing certs | certificates (quality) |
| Governance | Policies | certificates (governance) |

### Contact Page

See [Forms & Email Routing](#forms--email-routing) section.

---

## Database Schema

### Users Table

```sql
users
├── id: bigint unsigned (PK)
├── name: varchar(255)
├── email: varchar(255) UNIQUE
├── password: varchar(255)
├── role: enum('admin', 'editor') DEFAULT 'editor'
├── is_active: boolean DEFAULT true
├── avatar_path: varchar(255) NULLABLE
├── remember_token: varchar(100) NULLABLE
├── email_verified_at: timestamp NULLABLE
├── created_at: timestamp
├── updated_at: timestamp
```

### Settings Table

```sql
settings
├── id: bigint unsigned (PK)
├── key: varchar(255) UNIQUE
├── value: text
├── type: enum('text', 'email', 'url', 'number', 'boolean') DEFAULT 'text'
├── group: varchar(50) DEFAULT 'general'
├── updated_by: bigint unsigned NULLABLE (FK → users.id)
├── updated_at: timestamp
```

**Default Settings:**

| Key | Group | Description |
|-----|-------|-------------|
| company_name_en | general | English company name |
| company_name_ar | general | Arabic company name |
| company_phone | contact | Main phone number |
| company_email | contact | Main email |
| company_address_en | contact | English address |
| company_address_ar | contact | Arabic address |
| linkedin_url | social | LinkedIn company page |
| contact_recipients | email | Comma-separated emails for contact form |
| career_recipients | email | Comma-separated emails for career applications |

### Site Content Table

```sql
site_content
├── id: bigint unsigned (PK)
├── page: varchar(50)
├── section: varchar(50)
├── key: varchar(50)
├── content_en: text
├── content_ar: text
├── type: enum('text', 'textarea', 'html') DEFAULT 'text'
├── updated_by: bigint unsigned NULLABLE (FK → users.id)
├── updated_at: timestamp
├── UNIQUE INDEX (page, section, key)
```

### Media Table

```sql
media
├── id: bigint unsigned (PK)
├── filename: varchar(255)
├── original_filename: varchar(255)
├── path: varchar(255)
├── mime_type: varchar(100)
├── size: bigint unsigned (bytes)
├── alt_text_en: varchar(255) NULLABLE
├── alt_text_ar: varchar(255) NULLABLE
├── folder: varchar(50) DEFAULT 'general'
├── uploaded_by: bigint unsigned NULLABLE (FK → users.id)
├── created_at: timestamp
```

### Products Table

```sql
products
├── id: bigint unsigned (PK)
├── name_en: varchar(255)
├── name_ar: varchar(255)
├── slug: varchar(255) UNIQUE
├── short_description_en: text NULLABLE
├── short_description_ar: text NULLABLE
├── description_en: text NULLABLE
├── description_ar: text NULLABLE
├── category: varchar(100) NULLABLE
├── featured_image_id: bigint unsigned NULLABLE (FK → media.id)
├── is_active: boolean DEFAULT true
├── is_featured: boolean DEFAULT false
├── sort_order: int DEFAULT 0
├── created_by: bigint unsigned NULLABLE (FK → users.id)
├── updated_by: bigint unsigned NULLABLE (FK → users.id)
├── created_at: timestamp
├── updated_at: timestamp
```

### Product Images Table (Gallery)

```sql
product_images
├── id: bigint unsigned (PK)
├── product_id: bigint unsigned (FK → products.id) CASCADE
├── media_id: bigint unsigned (FK → media.id) CASCADE
├── is_primary: boolean DEFAULT false
├── sort_order: int DEFAULT 0
├── created_at: timestamp
```

### Product Specifications Table

```sql
product_specifications
├── id: bigint unsigned (PK)
├── product_id: bigint unsigned (FK → products.id) CASCADE
├── property_en: varchar(100)
├── property_ar: varchar(100)
├── min_value: varchar(50) NULLABLE
├── max_value: varchar(50) NULLABLE
├── value: varchar(100) NULLABLE (for single values)
├── unit: varchar(20) NULLABLE
├── spec_type: enum('chemical', 'mechanical', 'dimensional')
├── sort_order: int DEFAULT 0
```

### Certificates Table

```sql
certificates
├── id: bigint unsigned (PK)
├── title_en: varchar(255)
├── title_ar: varchar(255)
├── category: enum('esg', 'quality', 'governance')
├── description_en: text NULLABLE
├── description_ar: text NULLABLE
├── file_path: varchar(255)
├── thumbnail_id: bigint unsigned NULLABLE (FK → media.id)
├── issue_date: date NULLABLE
├── expiry_date: date NULLABLE
├── is_active: boolean DEFAULT true
├── sort_order: int DEFAULT 0
├── created_by: bigint unsigned NULLABLE (FK → users.id)
├── updated_by: bigint unsigned NULLABLE (FK → users.id)
├── created_at: timestamp
├── updated_at: timestamp
```

### Timeline Events Table

```sql
timeline_events
├── id: bigint unsigned (PK)
├── year: varchar(20)
├── title_en: varchar(255)
├── title_ar: varchar(255)
├── description_en: text
├── description_ar: text
├── image_id: bigint unsigned NULLABLE (FK → media.id)
├── sort_order: int DEFAULT 0
├── created_by: bigint unsigned NULLABLE (FK → users.id)
├── updated_by: bigint unsigned NULLABLE (FK → users.id)
├── created_at: timestamp
├── updated_at: timestamp
```

### Career Listings Table

```sql
career_listings
├── id: bigint unsigned (PK)
├── title_en: varchar(255)
├── title_ar: varchar(255)
├── slug: varchar(255) UNIQUE
├── description_en: text
├── description_ar: text
├── requirements_en: text NULLABLE
├── requirements_ar: text NULLABLE
├── location: varchar(100) NULLABLE
├── employment_type: enum('full-time', 'part-time', 'contract') DEFAULT 'full-time'
├── status: enum('draft', 'open', 'closed') DEFAULT 'draft'
├── expires_at: timestamp NULLABLE
├── created_by: bigint unsigned NULLABLE (FK → users.id)
├── updated_by: bigint unsigned NULLABLE (FK → users.id)
├── created_at: timestamp
├── updated_at: timestamp
```

### Career Applications Table

```sql
career_applications
├── id: bigint unsigned (PK)
├── career_listing_id: bigint unsigned NULLABLE (FK → career_listings.id) SET NULL
├── name: varchar(255)
├── email: varchar(255)
├── phone: varchar(50)
├── job_title: varchar(255)
├── cv_path: varchar(255)
├── status: enum('new', 'reviewed', 'shortlisted', 'rejected') DEFAULT 'new'
├── admin_notes: text NULLABLE
├── reviewed_by: bigint unsigned NULLABLE (FK → users.id)
├── created_at: timestamp
├── updated_at: timestamp
```

### Contact Submissions Table

```sql
contact_submissions
├── id: bigint unsigned (PK)
├── name: varchar(255)
├── company: varchar(255)
├── email: varchar(255)
├── phone: varchar(50)
├── country: varchar(100)
├── request_type: enum('vendor', 'partnership', 'careers', 'sustainability', 'general', 'quotation')
├── subject: varchar(255)
├── message: text
├── file_path: varchar(255) NULLABLE
├── is_read: boolean DEFAULT false
├── is_archived: boolean DEFAULT false
├── read_by: bigint unsigned NULLABLE (FK → users.id)
├── created_at: timestamp
```

### Newsletter Subscribers Table

```sql
newsletter_subscribers
├── id: bigint unsigned (PK)
├── email: varchar(255) UNIQUE
├── is_active: boolean DEFAULT true
├── source: varchar(50) DEFAULT 'website'
├── subscribed_at: timestamp
├── unsubscribed_at: timestamp NULLABLE
```

### LinkedIn Cache Table

```sql
linkedin_cache
├── id: bigint unsigned (PK)
├── post_id: varchar(100) UNIQUE
├── content: text
├── image_url: varchar(500) NULLABLE
├── post_url: varchar(500)
├── posted_at: timestamp
├── synced_at: timestamp
```

---

## Admin Panel

### Role Permissions

| Feature | Admin | Editor |
|---------|:-----:|:------:|
| View dashboard | ✓ | ✓ |
| Edit site content | ✓ | ✓ |
| Manage products | ✓ | ✓ |
| Manage certificates | ✓ | ✓ |
| Manage careers | ✓ | ✓ |
| View applications | ✓ | ✓ |
| View contacts | ✓ | ✓ |
| Manage newsletter | ✓ | ✗ |
| Edit settings | ✓ | ✗ |
| Manage users | ✓ | ✗ |

### Content Editor UI

Side-by-side bilingual editor:

```
┌─────────────────────────────────────────────────────────────┐
│  Edit: Home > Hero > Title                                  │
├────────────────────────────┬────────────────────────────────┤
│  English                   │  Arabic (RTL)                  │
├────────────────────────────┼────────────────────────────────┤
│  ┌──────────────────────┐  │  ┌──────────────────────┐      │
│  │ Leading Steel        │  │  │ شركة رائدة في صناعة  │      │
│  │ Manufacturing        │  │  │ الحديد والصلب        │      │
│  └──────────────────────┘  │  └──────────────────────┘      │
├────────────────────────────┴────────────────────────────────┤
│                      [Cancel]  [Save Changes]               │
└─────────────────────────────────────────────────────────────┘
```

### Media Library Features

- Grid view with thumbnails
- Folder organization
- Image cropping on upload
- Alt text for EN/AR
- File type icons for documents
- Drag-and-drop upload

---

## Forms & Email Routing

### Contact Form (Get in Touch)

| Field | Type | Required | Validation |
|-------|------|:--------:|------------|
| Name | text | ✓ | min:2, max:100 |
| Company | text | ✓ | min:2, max:100 |
| Email | email | ✓ | valid email |
| Phone | tel | ✓ | valid phone |
| Country | select | ✓ | from country list |
| Type of Request | select | ✓ | enum values |
| Subject | text | ✓ | min:5, max:200 |
| Message | textarea | ✓ | min:10, max:2000 |
| File Upload | file | ✗ | PDF, max 5MB |

**Request Types:**
- Vendor Registration
- Partnerships
- Careers
- Sustainability
- General Enquiry
- Quotation

**Email Recipients:** info@nuorsteel.com, it@nuorsteel.com

### Career Application Form

| Field | Type | Required | Validation |
|-------|------|:--------:|------------|
| Name | text | ✓ | min:2, max:100 |
| Email | email | ✓ | valid email |
| Phone | tel | ✓ | valid phone |
| Job Title | text | ✓ | min:2, max:100 |
| CV Upload | file | ✓ | PDF only, max 5MB |

**Email Recipients:** careers@nuorsteel.com, hr@nuorsteel.com

### Newsletter Signup

| Field | Type | Required | Validation |
|-------|------|:--------:|------------|
| Email | email | ✓ | valid email, unique |

---

## Technical Stack

### Backend

- **Framework:** Laravel 12
- **PHP Version:** 8.2+
- **Database:** MySQL
- **Authentication:** Laravel Sanctum
- **File Storage:** Local (storage/app)
- **Queue:** Database driver
- **Cache:** Database driver

### Frontend

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **State Management:** React Query
- **Routing:** React Router DOM
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **i18n:** i18next
- **Icons:** Lucide React

### Image Processing

- **Cropping:** Client-side cropper (react-image-crop or similar)
- **Resizing:** Server-side via Intervention Image
- **Formats:** JPEG, PNG, WebP output

### LinkedIn Integration

- **Method:** LinkedIn API (requires Developer App approval)
- **Sync Frequency:** Every 6 hours via scheduled task
- **Fallback:** "Follow us on LinkedIn" link if API unavailable
- **Cache:** Store posts locally in linkedin_cache table

### File Upload Limits

| Type | Max Size | Allowed Formats |
|------|----------|-----------------|
| Images | 5MB | JPEG, PNG, WebP |
| CVs | 5MB | PDF only |
| Contact attachments | 5MB | PDF only |
| Certificates | 10MB | PDF |

---

## Implementation Notes

### Status Workflow

Simple active/inactive toggle (no draft workflow):
- Products: `is_active` boolean
- Certificates: `is_active` boolean
- Career Listings: `status` enum (draft/open/closed)

### Audit Trail

Basic logging via `created_by` and `updated_by` fields on relevant tables.

### URL Structure

All public pages use clean URLs:
- `/products/steel-rebar` (not `/products?id=1`)
- `/career/senior-engineer` (not `/career?id=1`)

### SEO

Each page should have:
- Unique title: "Nuor Steel | {Page Name}"
- Meta description (editable via site_content)
- Open Graph tags
- Canonical URLs
- Sitemap.xml
- Robots.txt

---

## Appendix: Migration Order

1. Extend users table (add role, is_active, avatar_path)
2. Create settings table
3. Create site_content table
4. Create media table
5. Create products table
6. Create product_images table
7. Create product_specifications table
8. Create certificates table
9. Create timeline_events table
10. Create career_listings table
11. Create career_applications table
12. Create contact_submissions table
13. Create newsletter_subscribers table
14. Create linkedin_cache table
15. Seed default settings
16. Seed default site_content structure

# Nuor Steel — Admin Panel Guide

A practical walk-through of the Nuor Steel admin panel. Use this document as a reference after your live walkthrough — every section below matches a page in the sidebar.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Dashboard](#2-dashboard)
3. [Site Content](#3-site-content)
4. [Media Library](#4-media-library)
5. [Products](#5-products)
6. [Certificates](#6-certificates)
7. [Careers — Job Listings](#7-careers--job-listings)
8. [Applications](#8-applications)
9. [Contacts](#9-contacts)
10. [LinkedIn Posts](#10-linkedin-posts)
11. [Partners](#11-partners)
12. [Newsletter (Admin-only)](#12-newsletter-admin-only)
13. [Settings (Admin-only)](#13-settings-admin-only)
14. [Users (Admin-only)](#14-users-admin-only)
15. [Change Log (Admin-only)](#15-change-log-admin-only)
16. [Safety Features — Undo & Change Log](#16-safety-features--undo--change-log)
17. [Common Workflows](#17-common-workflows)
18. [Tips & Best Practices](#18-tips--best-practices)

---

## 1. Getting Started

### Logging In

- **URL:** `https://nuorsteel.com/admin/login` (replace with your live domain)
- Enter your email and password, then click **Sign In**.
- For security, the login page blocks repeated failed attempts. If you mistype your password 5 times, wait 15 minutes and try again.

### User Roles

There are two roles — the sidebar shows different items depending on your role.

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| **Admin** | Everything | — |
| **Editor** | Manage all content (products, certificates, jobs, media, contacts, content editor) | Cannot access Users, Settings, Newsletter, or Change Log |

### Language Toggle

The top-right corner has a language switch (**EN / AR**). This changes the admin panel's own interface language. It does **not** change the public website's default language.

### Sidebar Navigation

- On **desktop**, the sidebar is always visible on the left.
- On **mobile/tablet**, tap the hamburger icon (top-left) to open the sidebar.

### Logging Out

Click your name/avatar in the bottom-left of the sidebar and choose **Sign out**.

---

## 2. Dashboard

The dashboard is the first page you see after login. It shows at-a-glance numbers:

- **Total Products** — how many products are live on the site
- **Total Certificates** — how many certificates are active
- **Active Jobs** — job listings currently open for applications
- **New Applications** — unread career applications waiting for review
- **Unread Contacts** — contact form submissions you haven't opened yet
- **Newsletter Subscribers** — (admin only) total active subscribers

Clicking a card takes you to the corresponding section.

---

## 3. Site Content

**Purpose:** Edit the text that appears on public pages (homepage, About, Quality, Career page intro, etc.).

**Path:** Sidebar → **Site Content**

### How It Works

- Content is organized by **page** (Home, About, Quality, Career, Contact, Products) and **section** within that page.
- Each text field has **two inputs side-by-side**: English on the left, Arabic on the right. Fill both so the public site reads correctly when users toggle language.
- Click **Save** to publish changes. The public site updates immediately.

### Tips

- If you change text in the Site Content editor, those changes **override** the defaults baked into the website code. You can always come back and edit again.
- Use the page tabs at the top to jump between Home, About, etc.
- The preview text on the left ("click to interact with preview") is a hint — the actual live preview is the public website.

---

## 4. Media Library

**Purpose:** Upload and manage all images and PDF files used across the site (product photos, certificate PDFs, partner logos, etc.).

**Path:** Sidebar → **Media**

### Uploading

1. Click **Upload** (top-right).
2. Select one or more files — JPEG, PNG, WebP for images; PDF for documents.
3. Images are limited to **5 MB**, PDFs to **10 MB**.
4. Files appear as cards in the grid.

### Organizing

- **Folders** — create folders (e.g. "Products", "Certificates") and move files into them. Click a folder to open it.
- **Type filter** — filter by Image or PDF using the dropdown.
- **Usage indicator** — PDFs linked to certificates show a "Used in: [certificate name]" badge. This protects you from accidentally deleting a file that's live on the site.

### Deleting

- Click the trash icon on a file card.
- Deleted files are **soft-deleted** — an undo button appears for 30 seconds.
- Physical files are preserved on disk even after deletion (safe to restore).

---

## 5. Products

**Purpose:** Manage the product catalog shown at `/products` on the public site.

**Path:** Sidebar → **Products**

### Adding a Product

1. Click **Add Product**.
2. Fill in:
   - **Name (English & Arabic)** — required
   - **Slug** — auto-generated from the English name (URL-safe identifier)
   - **Short description** (EN/AR) — appears on product cards
   - **Full description** (EN/AR) — appears on the product detail view
3. **Featured Image** — click the picker to choose from the Media Library. This is the main product photo shown on the homepage and product grid.
4. **Gallery Images** — optional — add multiple images for a product image carousel.
5. **Specifications** — optional — add chemical/mechanical/dimensional data rows. These appear in the Specifications tab on the product detail page.
6. **Active** — toggle on to make the product visible on the public site.
7. Click **Save**.

### Editing / Deleting

- Click the pencil icon on any product card to edit.
- Click the trash icon to delete — an undo button appears for 30 seconds.

### Notes

- The order of products on the public site matches the order shown here.
- Product specifications for **TMT Bars** and **Billets** are currently hardcoded in the public product page (for rich layout). Changes to specifications in the admin panel affect the data only — the layout is fixed.

---

## 6. Certificates

**Purpose:** Manage the certificates shown at `/certificates` on the public site.

**Path:** Sidebar → **Certificates**

### Categories

Certificates are grouped into three categories (these categories are fixed):

- **ESG** — Sustainability certificates (EPD, HPD, ISO 14001, ISO 45001, etc.)
- **Quality** — ISO 9001 and similar
- **Governance** — Saudi Made and similar

### Adding a Certificate

1. Click **Add Certificate**.
2. Fill in:
   - **Name (EN/AR)** — required
   - **Description (EN/AR)** — shown on the public certificate card
   - **Category** — ESG / Quality / Governance
   - **PDF file** — choose from Media Library (must be a PDF uploaded to the Media Library first)
   - **Thumbnail** — optional preview image (shown on the public certificate grid). If not provided, a PDF preview is shown.
   - **Expiry date** — optional. If set, a badge appears when near expiry.
   - **Active** — toggle on to publish to the public site.
3. Click **Save**.

### Viewing Certificates

- Click a certificate card to open the built-in PDF viewer.
- The public site uses the same viewer for visitors.

---

## 7. Careers — Job Listings

**Purpose:** Manage job openings shown at `/career`.

**Path:** Sidebar → **Careers**

### Adding a Job

1. Click **Add Job**.
2. Fill in:
   - **Title (EN/AR)**
   - **Location** (e.g. "Riyadh, Saudi Arabia")
   - **Job type** (Full-time, Part-time, Contract)
   - **Description (EN/AR)** — what the role is about
   - **Requirements (EN/AR)** — bullet points separated by new lines
   - **Expiry date** — the job automatically hides from the public site after this date.
   - **Active** — toggle on to publish.
3. Click **Save**.

### Managing

- Edit or delete via the icons on each job card.
- Expired jobs are hidden from the public site but kept in the admin panel for record.

### Applications

Click **View Applications** on a job to see all candidates who applied for that specific role. Or use the Applications tab in the sidebar to see everything.

---

## 8. Applications

**Purpose:** Review candidates who applied through the career page (either for a specific job or through the "Open Application" form).

**Path:** Sidebar → **Applications**

### Card Layout

Each application is a card showing:

- Candidate name, email, phone
- Job title they applied for ("Open Application" if they didn't pick a specific job)
- Status badge (see below)
- Submission date

### Sorting & Highlighting

- **Unviewed new applications** appear at the top with an **orange pulsing dot** and an **orange border**. This makes it obvious what's waiting for your review.
- Once you open (view) a new application, the glow disappears and the card moves to the bottom of the "new" group.
- Applications with other statuses (Reviewed, Shortlisted, Rejected) show only a status badge — no border color — to reduce visual noise.

### Status Workflow

Click an application card to open the detail view. You can set the status to:

- **New** — default on submission
- **Reviewed** — you've looked at the CV
- **Shortlisted** — candidate looks promising
- **Rejected** — not moving forward

### Notes

- Each application has a **notes** field — add internal notes visible only to admins/editors.
- Click **Download CV** to get the candidate's resume as a PDF.
- Candidates are automatically emailed a confirmation when they apply (configured in Settings).

### Filters

Use the filter bar at the top to narrow by:

- **Status** (New / Reviewed / Shortlisted / Rejected)
- **Time period** (Last week / Last month / Last year)

---

## 9. Contacts

**Purpose:** Inbox for the contact form submissions from `/contact`.

**Path:** Sidebar → **Contacts**

### How It Works

- Every submission from the public contact form appears here as a row.
- Unread rows are highlighted; click to open the detail view and mark as read.
- You can **archive** a submission to remove it from the active inbox without deleting it.

### Filters

- **Read status** (All / Unread / Read)
- **Archived** toggle
- **Request type** (Vendor Registration, Partnerships, Careers, Sustainability, General Enquiry, Quotation)

### Notes

- If the sender uploaded a file (PDF/JPG/PNG), a **Download** button appears in the detail view.
- The sender is automatically emailed a confirmation when they submit the form.
- Your team also receives an email notification at the recipients configured in Settings → Email.

---

## 10. LinkedIn Posts

**Purpose:** Manage the posts shown in the "News" section on the homepage.

**Path:** Sidebar → **LinkedIn Posts**

### Adding a Post

1. On LinkedIn, open the post you want to feature.
2. Click the **three dots** on the post → **Embed this post**.
3. Copy the embed code (or just the post URL — both work).
4. In the admin panel, click **Add Post** and paste it.
5. Click **Save**.

### Managing

- **Visibility toggle** — hide a post without deleting it.
- **Reorder** — drag posts to change their order on the homepage carousel.
- **Delete** — removes the post (undoable for 30 seconds).

### Notes

- The homepage carousel auto-rotates between visible posts.
- Only `linkedin.com` URLs are accepted (security measure to prevent spoofed links).

---

## 11. Partners

**Purpose:** Manage partner logos. Currently this section is built but the public display is hidden on the homepage (can be re-enabled when the client is ready).

**Path:** Sidebar → **Partners**

### Adding a Partner

1. Click **Add Partner**.
2. Fill in:
   - **Name (EN/AR)**
   - **Logo** — upload via Media Library (PNG with transparent background works best)
   - **Website URL** — optional
3. Click **Save**.

### Deleting

- Deletes require typing the partner's English name as confirmation. This prevents accidental deletion of a logo used on the site.
- A 30-second undo button also appears after deletion.

---

## 12. Newsletter (Admin-only)

**Purpose:** Manage newsletter subscribers collected through the footer signup form.

**Path:** Sidebar → **Newsletter**

### Subscribers List

Each row shows:

- Email address
- Subscribed date
- Active status (active subscribers vs those who unsubscribed)

### What You Can Do

- **Export CSV** — download the full subscriber list for use in an external email tool.
- **Filter** by status (Active / Unsubscribed).
- **Stats** — at the top: total subscribers, active, unsubscribed, new this month.

### Sending Campaigns

The admin panel **does not send emails directly**. The recommended workflow is:

1. Click **Export CSV**.
2. Import the file into an external email service (Mailchimp, Brevo, MailerLite, or similar — all have free tiers).
3. Compose and send your campaign from that tool.

This approach gives you professional email templates, spam filtering, open/click tracking, and automatic unsubscribe handling — all free or very low cost.

---

## 13. Settings (Admin-only)

**Purpose:** Edit site-wide settings shown in the public footer and used for email notifications.

**Path:** Sidebar → **Settings**

### Contact Group

- **Company phone** — comma-separated if multiple (e.g. `+966543781868,+966545198760`)
- **Company email** — comma-separated if multiple
- **Company address (EN/AR)**
- **LinkedIn URL**

These values are used in:

- The public site footer
- The Contact page contact cards
- SEO structured data (helps Google display correct info)

### Email Group

- **Contact form recipients** — emails that receive contact form submissions
- **Career application recipients** — emails that receive job applications

Both fields use a **tag/chip UI** — type an email and press Enter to add, click the **X** to remove.

> **Note:** Removing an email recipient requires typing `delete` to confirm. This prevents accidental removal of a critical notification address.

### Dirty-State Indicators

- Any field you've modified shows a **Modified badge**, an **amber ring** around the input, and a **"Was: [previous value]"** helper text.
- A **Revert** link lets you restore the original value for any changed field.
- The page header shows a count of how many fields have unsaved changes.
- This prevents silent typos — for example, a stray character in the LinkedIn URL would be visually flagged until you save or revert.

### Saving

Click **Save Changes** at the top or bottom. Changes apply to the public site immediately.

---

## 14. Users (Admin-only)

**Purpose:** Manage admin and editor accounts.

**Path:** Sidebar → **Users**

### Creating a User

1. Click **Add User**.
2. Fill in:
   - **Name**
   - **Email**
   - **Password** (and confirmation)
   - **Role** — Admin or Editor
   - **Active** — toggle on to allow login
3. Click **Create**.

### Editing a User

- Click the pencil icon.
- You can update name, email, password (leave blank to keep current), role, and active status.
- **You cannot change your own role or deactivate yourself** (the role dropdown and active toggle are disabled on your own account).

### Activating / Deactivating

- The toggle icon (green/red) switches a user's active status.
- Deactivated users cannot log in but their account is preserved.
- **You cannot deactivate yourself.**

### Deleting Users

- Only **Editor** accounts can be deleted via the trash icon.
- **Admin accounts cannot be deleted from the UI.** To remove an admin:
  1. Edit the admin and change their role to **Editor**.
  2. Save.
  3. The trash icon now appears — click to delete.
- This two-step protection prevents accidentally removing the only admin on the system.
- **You cannot delete yourself.**

### The "(you)" badge

Your own row shows a small "(you)" label next to your name so you always know which account is yours.

---

## 15. Change Log (Admin-only)

**Purpose:** See every change made in the admin panel — who made it, when, and what changed. Revert changes if needed.

**Path:** Sidebar → **Change Log**

### What's Tracked

Every create, update, and delete across all admin sections is logged:

- Who made the change (user name)
- What section (Products, Certificates, Settings, etc.)
- What fields changed (before / after values)
- When (timestamp)

### Filters

- **Section** — narrow to a specific area (Products, Media, etc.)
- **Who** — filter by user
- **Time period** — last week / month / year

### Reverting a Change

Each log entry has a **Revert** button:

- For an **update**: restores the fields to their previous values.
- For a **delete**: restores the deleted record.
- Already-reverted entries are marked and cannot be reverted again.

Reverts are safe — they create a new state, not a destructive operation.

### Deleting Log Entries

Rare — you might want to clear very old logs. Delete requires typing `delete` as confirmation. This is admin-only and irreversible.

---

## 16. Safety Features — Undo & Change Log

Nuor Steel's admin panel has **two layers of safety** for accidental changes:

### Layer 1 — Session Undo (30 seconds)

- After any create, update, or delete action, a small **Undo** button appears for 30 seconds in the corner of the screen.
- Click it to instantly revert the last action.
- This works across all sections: Products, Certificates, Jobs, Media, Users, Settings, etc.
- After 30 seconds the button disappears — use Layer 2 below.

### Layer 2 — Change Log (Permanent)

- The Change Log (admin-only) records every change permanently.
- You can revert any change from the Change Log, even days or weeks later.
- If you accidentally delete something and notice a week later, you can still restore it via the Change Log.

### Self-Protection Rules

To prevent you from locking yourself out of the system:

- You cannot **delete your own account**.
- You cannot **deactivate your own account**.
- You cannot **change your own role**.
- You cannot **delete admin accounts directly** — they must be demoted to Editor first.
- You cannot **remove email recipients** without typing `delete` as confirmation.
- You cannot **delete Change Log entries** without typing `delete` as confirmation.
- You cannot **delete partners** without typing the partner's name as confirmation.

---

## 17. Common Workflows

### Workflow 1 — Adding a new product

1. Go to **Media Library** → upload the product photo (and any gallery photos).
2. Go to **Products** → click **Add Product**.
3. Fill in name, descriptions (EN + AR), pick the featured image from the Media Library.
4. Add gallery images and specifications if needed.
5. Toggle **Active** on.
6. Click **Save**.
7. Open the public site in a new tab and verify the product appears at `/products`.

### Workflow 2 — Publishing a new certificate

1. Go to **Media Library** → upload the certificate PDF.
2. (Optional) Upload a thumbnail image for the certificate card.
3. Go to **Certificates** → click **Add Certificate**.
4. Fill in name and description (EN + AR), choose the category.
5. Pick the PDF and thumbnail from the Media Library.
6. Set expiry date if applicable.
7. Toggle **Active** on → **Save**.

### Workflow 3 — Opening a job position & reviewing applicants

1. Go to **Careers** → click **Add Job**.
2. Fill in title, location, type, description, requirements (all in EN + AR).
3. Set expiry date and toggle **Active** on → **Save**.
4. Share the public URL with job boards or your network.
5. As applications arrive, they appear in **Applications** with an orange pulse.
6. Click each application to review the CV and set status (Reviewed / Shortlisted / Rejected).
7. Add internal notes in the notes field for your team.

### Workflow 4 — Responding to a contact form submission

1. Go to **Contacts** — unread rows are highlighted.
2. Click a row to open the detail view.
3. Reply directly from your email client to the sender's email address.
4. Optional — archive the submission when handled.

### Workflow 5 — Updating site-wide contact info (phone, email, address)

1. Go to **Settings** → **Contact** tab.
2. Edit the fields — note the amber ring and "Modified" badges on changed fields.
3. Use **Revert** on any field to restore the original value if you change your mind.
4. Click **Save Changes**.
5. Refresh the public site — the footer and Contact page update immediately.

### Workflow 6 — Adding a new team member to the admin panel

1. Go to **Users** → click **Add User**.
2. Fill in name, email, a temporary password, and choose role (usually **Editor** unless they need access to Users/Settings/Newsletter).
3. Toggle **Active** on → **Create**.
4. Share the login URL, email, and temporary password with the new user.
5. Ask them to log in and change their password (via the edit user form or a future profile page).

### Workflow 7 — Recovering from an accidental deletion

**If it was in the last 30 seconds:** Click the **Undo** button that appeared after the deletion.

**If it was earlier:**

1. Go to **Change Log**.
2. Filter by section and time period to find the deletion entry.
3. Click **Revert** on that entry.
4. The deleted item reappears in its section with all its data intact.

---

## 18. Tips & Best Practices

### Content

- **Always fill both EN and AR fields** — visitors can toggle language on the public site. Missing translations show blank content.
- **Keep product descriptions concise** — short description on cards, longer on detail pages.
- **Use high-quality images** — at least 1200px wide for product photos.

### Workflow

- **Upload media first, then reference it** — it's much faster to upload everything to the Media Library in one batch before creating products/certificates.
- **Use folders in the Media Library** — keeps things organized as the library grows.
- **Review the Change Log weekly** — especially if multiple people manage the site, to see what's been updated.

### Security

- **Use strong passwords** for all admin accounts.
- **Don't share accounts** — create a separate user for each team member so the Change Log shows who made each change.
- **Deactivate accounts** when someone leaves — don't delete, in case their change history is needed later.
- **Editor role is enough** for most content work — only give **Admin** to people who need Users/Settings/Newsletter access.

### Emergencies

- If you accidentally deleted something and Undo has expired — use the **Change Log** to revert.
- If you locked yourself out by changing your email — contact the developer to reset via database directly.
- If the public site shows wrong info — check **Site Content** first, then **Settings**.

---

## Support

For technical issues, please contact the development team.

For content guidance, this document is your reference. Revisit any section anytime — the admin panel is designed to be safe (everything is undoable), so feel free to experiment.

---

*Last updated: April 2026*

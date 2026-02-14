# Plan: Change Log + Extended Change Tracking

## Overview

Two parts:
1. **Change Log page** — Persistent history of all changes, shown under System in the sidebar
2. **Extend change tracking** — Add undo/snapshot support to Products, Media, Certificates, Job Listings, and Applications (currently only Settings and Site Content have it)

Every tracked section automatically feeds into the Change Log page.

---

## Part A: Change Log Infrastructure

### Step 1: Database Migration — `change_logs` table

Create `database/migrations/2026_02_14_000001_create_change_logs_table.php`:

| Column | Type | Purpose |
|--------|------|---------|
| id | bigint PK | Auto-increment |
| model_type | string, indexed | 'settings', 'site_content', 'product', etc. |
| model_id | string | 'all' (batch) or specific record ID |
| changes | JSON | `[{field, label, old, new}]` |
| old_data | JSON | Full snapshot for reverting |
| new_data | JSON | What was applied |
| changed_by | FK → users | Who made the change |
| created_at | timestamp | When (no updated_at — immutable) |

### Step 2: Eloquent Model — `ChangeLog`

Create `app/Models/ChangeLog.php`:
- `belongsTo(User::class, 'changed_by')`, JSON casts, no `updated_at`

### Step 3: Modify `UndoService` — Persist + Shared Restore

Modify `app/Services/UndoService.php`:

**A) Auto-persist** — After saving to session, also `ChangeLog::create(...)`. Any section using `saveState()` automatically gets persistent history.

**B) Extract restore logic** — Move restore methods from `UndoController` into `UndoService::restoreFromSnapshot($modelType, $oldData): string`. This shared method is called by both `UndoController` (session undo) and `ChangeLogController` (history revert).

**C) Add field configs** — Extend `getFieldConfig()` with labels for products, media, certificates, careers, applications.

### Step 4: Refactor `UndoController`

Remove `restoreSettings()` and `restoreSiteContent()` — call `$this->undoService->restoreFromSnapshot()` instead.

### Step 5: New `ChangeLogController`

Create `app/Http/Controllers/Admin/ChangeLogController.php`:
- **`index()`** — Paginated (20/page), eager-loads user, filters (model_type, changed_by), passes users list + section labels
- **`revert($id)`** — Restore from snapshot, log the revert as a new entry, redirect with flash

### Step 6: Routes

Add under admin-only group in `routes/web.php`:
```
GET  /admin/change-log          → index
POST /admin/change-log/{id}/revert → revert
```

### Step 7: TypeScript Type

Add `ChangeLog` interface to `resources/js/types/index.ts`.

### Step 8: Frontend Page — `ChangeLog.tsx`

Create `resources/js/Pages/Admin/ChangeLog.tsx`:
- Filters: Section dropdown + User dropdown
- DataTable: Section badge, User name, Date, Change count, Actions (View + Revert)
- Detail modal: field-level diff (old → new)
- Revert confirmation dialog
- Pagination

### Step 9: Sidebar

Add `{ label: 'Change Log', path: '/admin/change-log', icon: <History />, adminOnly: true }` to System group in `AdminSidebar.tsx`.

---

## Part B: Extend Change Tracking to More Sections

For each section below, the pattern is the same:
1. Inject `UndoService` in the controller constructor
2. Snapshot current values before update
3. Call `saveState()` (auto-persists to DB + session)
4. Guard: return early if no changes
5. Apply the actual update

### B1: Products (`ProductController::update`)

**Tracked fields:** `name_en`, `name_ar`, `short_description_en`, `short_description_ar`, `description_en`, `description_ar`, `category`, `is_active`, `is_featured`, `sort_order`, `featured_image_id`

**Restore:** Update product with old values + `updated_by`.

### B2: Media (`MediaController::update`)

**Tracked fields:** `alt_text_en`, `alt_text_ar`, `folder`

**Restore:** Update media with old values. Folder change restore should work the same as a normal folder move.

### B3: Certificates (`CertificateController::update`)

**Tracked fields:** `title_en`, `title_ar`, `category`, `description_en`, `description_ar`, `thumbnail_id`, `issue_date`, `expiry_date`, `is_active`, `sort_order`

**NOT tracked:** `file_path` — old file is deleted from disk when replaced, so it can't be restored.

**Restore:** Update certificate metadata with old values + `updated_by`.

### B4: Job Listings (`CareerController::update`)

**Tracked fields:** `title_en`, `title_ar`, `description_en`, `description_ar`, `requirements_en`, `requirements_ar`, `location`, `employment_type`, `status`, `expires_at`

**Restore:** Update listing with old values + `updated_by`.

### B5: Applications (`CareerController::updateApplication`)

**Tracked fields:** `status`, `admin_notes`

**Restore:** Update application with old values + `reviewed_by`.

---

## UndoService Restore Methods (all in `restoreFromSnapshot`)

```php
match ($modelType) {
    'settings'     => restoreSettings($oldData),
    'site_content' => restoreSiteContent($oldData),
    'product'      => restoreProduct($oldData),
    'media'        => restoreMedia($oldData),
    'certificate'  => restoreCertificate($oldData),
    'career'       => restoreCareer($oldData),
    'application'  => restoreApplication($oldData),
};
```

Each returns the redirect URL for that section.

---

## Files Summary

| File | Action |
|------|--------|
| `database/migrations/..._create_change_logs_table.php` | **Create** |
| `app/Models/ChangeLog.php` | **Create** |
| `app/Services/UndoService.php` | **Modify** (DB persist, shared restore, field configs) |
| `app/Http/Controllers/Admin/UndoController.php` | **Modify** (use shared restore) |
| `app/Http/Controllers/Admin/ChangeLogController.php` | **Create** |
| `app/Http/Controllers/Admin/ProductController.php` | **Modify** (add snapshot) |
| `app/Http/Controllers/Admin/MediaController.php` | **Modify** (add snapshot) |
| `app/Http/Controllers/Admin/CertificateController.php` | **Modify** (add snapshot) |
| `app/Http/Controllers/Admin/CareerController.php` | **Modify** (add snapshot to update + updateApplication) |
| `routes/web.php` | **Modify** (add 2 routes) |
| `resources/js/types/index.ts` | **Modify** (add ChangeLog type) |
| `resources/js/Pages/Admin/ChangeLog.tsx` | **Create** |
| `resources/js/Components/Layout/AdminSidebar.tsx` | **Modify** (add nav item) |

// User types
export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor";
  is_active: boolean;
  avatar_path: string | null;
  created_at: string;
}

// Inertia shared page props
export interface PageProps {
  auth: {
    user: Pick<User, 'id' | 'name' | 'email' | 'role' | 'avatar_path'> | null;
  };
  locale: 'en' | 'ar';
  flash: {
    success?: string;
    error?: string;
  };
  ziggy: {
    url: string;
    port: number | null;
    defaults: Record<string, unknown>;
    routes: Record<string, unknown>;
    location: string;
  };
  [key: string]: unknown;
}

// Laravel Paginator shape (auto-serialized by Inertia)
export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

// Legacy API response types (kept for reference during migration)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

// Media
export interface Media {
  id: number;
  filename: string;
  original_filename: string;
  path: string;
  mime_type: string;
  size: number;
  alt_text_en: string | null;
  alt_text_ar: string | null;
  folder: string;
  url: string;
  uploaded_by: number;
  created_at: string;
}

export interface MediaUsage {
  type: string;
  name: string;
  url: string;
}

// Undo
export interface UndoFieldChange {
  field: string;
  label: string;
  old: string;
  new: string;
}

export interface UndoMeta {
  available: boolean;
  saved_at: string;
  saved_by: number;
  changes: UndoFieldChange[];
}

// Products
export interface Product {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  short_description_en: string | null;
  short_description_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  category: string | null;
  featured_image_id: number | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  featured_image?: Media;
  images?: ProductImage[];
  specifications?: ProductSpecification[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  media_id: number;
  is_primary: boolean;
  sort_order: number;
  media?: Media;
}

export interface ProductSpecification {
  id: number;
  product_id: number;
  property_en: string;
  property_ar: string;
  spec_type: "chemical" | "mechanical" | "dimensional";
  min_value: string | null;
  max_value: string | null;
  value: string | null;
  unit: string | null;
  sort_order: number;
}

// Certificates
export interface Certificate {
  id: number;
  title_en: string;
  title_ar: string;
  category: "esg" | "quality" | "governance";
  description_en: string | null;
  description_ar: string | null;
  file_path: string;
  file_url: string;
  thumbnail_id: number | null;
  issue_date: string | null;
  expiry_date: string | null;
  is_active: boolean;
  sort_order: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  thumbnail?: Media;
}

// Timeline
export interface TimelineEvent {
  id: number;
  year: string;
  title_en: string;
  title_ar: string;
  description_en: string | null;
  description_ar: string | null;
  image_id: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  image?: Media;
}

// Career
export interface CareerListing {
  id: number;
  title_en: string;
  title_ar: string;
  slug: string;
  description_en: string;
  description_ar: string;
  requirements_en: string | null;
  requirements_ar: string | null;
  location: string | null;
  employment_type: "full-time" | "part-time" | "contract";
  status: "draft" | "open" | "closed";
  expires_at: string | null;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  applications_count?: number;
}

export interface CareerApplication {
  id: number;
  career_listing_id: number | null;
  name: string;
  email: string;
  phone: string;
  job_title: string;
  cv_path: string;
  cv_url: string;
  status: "new" | "reviewed" | "shortlisted" | "rejected";
  admin_notes: string | null;
  reviewed_by: number | null;
  created_at: string;
  updated_at: string;
  career_listing?: CareerListing;
}

// Contact
export interface ContactSubmission {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  request_type: "vendor" | "partnership" | "careers" | "sustainability" | "general" | "quotation";
  subject: string;
  message: string;
  file_path: string | null;
  file_url: string | null;
  is_read: boolean;
  is_archived: boolean;
  read_by: number | null;
  created_at: string;
}

// Newsletter
export interface NewsletterSubscriber {
  id: number;
  email: string;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

// Site Content
export interface SiteContent {
  id: number;
  page: string;
  section: string;
  key: string;
  content_en: string;
  content_ar: string;
  type: "text" | "textarea" | "html";
}

// Settings
export interface Setting {
  id: number;
  key: string;
  value: string;
  group: string;
}

// Dashboard
export interface DashboardStats {
  products: number;
  active_products: number;
  open_jobs: number;
  new_applications: number;
  unread_contacts: number;
  newsletter_subscribers: number;
}

export interface DashboardRecentApplication {
  id: number;
  name: string;
  email: string;
  job_title: string;
  listing_title: string | null;
  status: string;
  created_at: string;
}

export interface DashboardRecentContact {
  id: number;
  name: string;
  company: string;
  subject: string;
  request_type: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_applications: DashboardRecentApplication[];
  recent_contacts: DashboardRecentContact[];
}

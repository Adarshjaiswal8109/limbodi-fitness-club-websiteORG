// ============================================================
// CMS Database Types — Limbodi Fitness Club
// All types mirror the Supabase database schema
// ============================================================

// --- Admin & Auth ---
export interface Admin {
  id: string;
  email: string;
  full_name?: string;
  role: 'super_admin' | 'admin' | 'editor';
  avatar_url?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

// --- Activity Logs ---
export interface ActivityLog {
  id: string;
  admin_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

// --- Notifications ---
export interface Notification {
  id: string;
  admin_id?: string;
  type: string;
  title: string;
  message?: string;
  data?: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

// --- Media Library ---
export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  thumbnail_url?: string;
  bucket: string;
  folder: string;
  mime_type?: string;
  size_bytes?: number;
  width?: number;
  height?: number;
  alt_text?: string;
  uploaded_by?: string;
  created_at: string;
}

// --- SEO Settings ---
export interface SEOSetting {
  id: string;
  route: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  canonical_url?: string;
  keywords?: string[];
  schema_markup?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// --- Site Settings ---
export interface SiteSettings {
  id: number;
  business_name: string;
  phone: string;
  email: string;
  address: string;
  business_hours: Record<string, string>;
  social_links: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    twitter?: string;
  };
  google_maps_link: string;
  whatsapp_number?: string;
  hero_stats: {
    members: string;
    trainers: string;
    classes: string;
    years: string;
  };
  google_rating: string;
  google_review_count: string;
  announcement_banner?: string;
  promotional_banner?: string;
  logo_url?: string;
  favicon_url?: string;
  homepage_banner_image?: string;
  brand_tagline?: string;
  brand_description?: string;
  copyright_text: string;
  privacy_policy?: string;
  terms_conditions?: string;
  maintenance_mode: boolean;
  maintenance_message?: string;
  announcement_bar_enabled: boolean;
  announcement_bar_text?: string;
  announcement_bar_link?: string;
  promotional_banner_enabled: boolean;
  promotional_banner_text?: string;
  promotional_banner_link?: string;
  seo_meta_title: string;
  seo_meta_description: string;
  created_at: string;
  updated_at: string;
}

// --- Content Types ---
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  created_at: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface TrainerCertification {
  id: string;
  trainer_id: string;
  name: string;
  issued_by?: string;
  year?: number;
  created_at: string;
}

export interface TrainerSpecialization {
  id: string;
  trainer_id: string;
  name: string;
  created_at: string;
}

export interface ClassEntry {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  trainer_id?: string;
  day_of_week?: string;
  start_time?: string;
  end_time?: string;
  capacity?: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  published: boolean;
  sort_order: number;
  created_at: string;
}

export interface Facility {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon: string;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  slug: string;
  url: string;
  thumbnail?: string;
  category?: string;
  duration?: string;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export interface NutritionArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category: string;
  image?: string;
  read_time?: string;
  published: boolean;
  created_at: string;
}

// --- Form Submissions ---
export interface MembershipEnquiry {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  age?: number;
  gender?: string;
  fitness_goal?: string;
  preferred_plan?: string;
  preferred_time?: string;
  message?: string;
  status: string;
  created_at: string;
}

export interface TrialBooking {
  id: string;
  name: string;
  mobile: string;
  email: string;
  preferred_date?: string;
  preferred_time?: string;
  fitness_goal?: string;
  status: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

// --- Existing CMS Content ---
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category: string;
  category_id?: string;
  image?: string;
  read_time?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  image?: string;
  rating: number;
  quote: string;
  transformation?: string;
  published: boolean;
  created_at: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  experience?: string;
  certifications?: string[];
  expertise?: string[];
  achievements?: string[];
  schedule?: string;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  label: string;
  image: string;
  category: string;
  category_id?: string;
  span?: string;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  period?: string;
  description?: string;
  features?: string[];
  icon: string;
  highlighted: boolean;
  sort_order: number;
  created_at: string;
}

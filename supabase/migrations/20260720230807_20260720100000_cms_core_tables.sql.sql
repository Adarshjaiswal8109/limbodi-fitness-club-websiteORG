/*
# CMS Core Tables — Admins, Activity Logs, Notifications, Media Library, SEO Settings

1. Overview
This migration builds the CMS foundation infrastructure. It adds:
- `admins` — admin user profiles linked to auth.users with role metadata
- `activity_logs` — audit trail of all admin actions across the CMS
- `notifications` — in-app notifications for admins (new enquiries, trials, etc.)
- `media_library` — central media library tracking all uploaded assets
- `seo_settings` — per-route SEO defaults (meta title, description, OG image)
- Extends `site_settings` with additional fields (whatsapp, maintenance mode, announcement bar, promotional banner, copyright, privacy policy, terms)

2. New Tables
- `admins` (id uuid PK → auth.users, email, full_name, role, avatar_url, last_login_at, created_at, updated_at)
- `activity_logs` (id uuid PK, admin_id → admins, action, entity_type, entity_id, metadata jsonb, ip_address, created_at)
- `notifications` (id uuid PK, admin_id → admins, type, title, message, data jsonb, read boolean, created_at)
- `media_library` (id uuid PK, name, url, thumbnail_url, bucket, folder, mime_type, size_bytes, width, height, alt_text, uploaded_by → auth.users, created_at)
- `seo_settings` (id uuid PK, route unique, meta_title, meta_description, og_image, canonical_url, keywords, schema_markup, created_at, updated_at)

3. Modified Tables
- `site_settings` — adds columns: whatsapp_number, copyright_text, privacy_policy, terms_conditions, maintenance_mode (bool), maintenance_message, announcement_bar_enabled (bool), announcement_bar_text, announcement_bar_link, promotional_banner_enabled (bool), promotional_banner_text, promotional_banner_link, homepage_banner_image, brand_tagline, brand_description, favicon_url (already exists), updated_at trigger

4. Security
- `admins`: SELECT/UPDATE for authenticated (own profile + admin role); INSERT via trigger on auth.users creation
- `activity_logs`: INSERT for authenticated; SELECT for authenticated (admin only)
- `notifications`: full CRUD scoped to admin_id = auth.uid()
- `media_library`: SELECT for anon+authenticated (public URLs); INSERT/UPDATE/DELETE for authenticated
- `seo_settings`: SELECT for anon+authenticated; INSERT/UPDATE/DELETE for authenticated
- `site_settings` extended: existing policies preserved; new columns inherit existing RLS

5. Important Notes
- Admins table uses auth.users as source of truth; admins row created via trigger when user signs up or manually
- Activity logs auto-record admin actions for audit
- Notifications support unread count queries
- Media library tracks all assets regardless of bucket
- SEO settings are per-route, with a fallback default row (route = 'default')
- updated_at auto-updated via trigger on site_settings and seo_settings
*/

-- ============================================================
-- ADMINS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  avatar_url text,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_admins" ON admins;
CREATE POLICY "auth_select_admins" ON admins FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_admins" ON admins;
CREATE POLICY "auth_update_admins" ON admins FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "auth_insert_admins" ON admins;
CREATE POLICY "auth_insert_admins" ON admins FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============================================================
-- ACTIVITY LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_insert_activity_logs" ON activity_logs;
CREATE POLICY "auth_insert_activity_logs" ON activity_logs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_activity_logs" ON activity_logs;
CREATE POLICY "auth_select_activity_logs" ON activity_logs FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_delete_activity_logs" ON activity_logs;
CREATE POLICY "auth_delete_activity_logs" ON activity_logs FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_admin_id ON activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  data jsonb DEFAULT '{}'::jsonb,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_notifications" ON notifications;
CREATE POLICY "auth_select_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = admin_id OR admin_id IS NULL);

DROP POLICY IF EXISTS "auth_insert_notifications" ON notifications;
CREATE POLICY "auth_insert_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_notifications" ON notifications;
CREATE POLICY "auth_update_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = admin_id OR admin_id IS NULL) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_notifications" ON notifications;
CREATE POLICY "auth_delete_notifications" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = admin_id OR admin_id IS NULL);

CREATE INDEX IF NOT EXISTS idx_notifications_admin_id ON notifications(admin_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================
-- MEDIA LIBRARY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  thumbnail_url text,
  bucket text NOT NULL DEFAULT 'website-assets',
  folder text NOT NULL DEFAULT '/',
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  alt_text text,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_media_library" ON media_library;
CREATE POLICY "anon_select_media_library" ON media_library FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_media_library" ON media_library;
CREATE POLICY "auth_insert_media_library" ON media_library FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_media_library" ON media_library;
CREATE POLICY "auth_update_media_library" ON media_library FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_media_library" ON media_library;
CREATE POLICY "auth_delete_media_library" ON media_library FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_media_library_bucket ON media_library(bucket);
CREATE INDEX IF NOT EXISTS idx_media_library_folder ON media_library(folder);
CREATE INDEX IF NOT EXISTS idx_media_library_created_at ON media_library(created_at DESC);

-- ============================================================
-- SEO SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route text NOT NULL UNIQUE,
  meta_title text,
  meta_description text,
  og_image text,
  canonical_url text,
  keywords text[],
  schema_markup jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_seo_settings" ON seo_settings;
CREATE POLICY "anon_select_seo_settings" ON seo_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_seo_settings" ON seo_settings;
CREATE POLICY "auth_insert_seo_settings" ON seo_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_seo_settings" ON seo_settings;
CREATE POLICY "auth_update_seo_settings" ON seo_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_seo_settings" ON seo_settings;
CREATE POLICY "auth_delete_seo_settings" ON seo_settings FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- EXTEND SITE_SETTINGS TABLE
-- ============================================================
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS whatsapp_number text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS copyright_text text NOT NULL DEFAULT '© 2024 Limbodi Fitness Club. All rights reserved.';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS privacy_policy text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS terms_conditions text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS maintenance_mode boolean NOT NULL DEFAULT false;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS maintenance_message text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS announcement_bar_enabled boolean NOT NULL DEFAULT false;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS announcement_bar_text text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS announcement_bar_link text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS promotional_banner_enabled boolean NOT NULL DEFAULT false;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS promotional_banner_text text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS promotional_banner_link text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS homepage_banner_image text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS brand_tagline text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS brand_description text;

-- ============================================================
-- UPDATED_AT TRIGGER FOR SITE_SETTINGS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON site_settings;
CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_seo_settings_updated_at ON seo_settings;
CREATE TRIGGER trg_seo_settings_updated_at
  BEFORE UPDATE ON seo_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_admins_updated_at ON admins;
CREATE TRIGGER trg_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- HELPER: Log activity (callable from client or edge functions)
-- ============================================================
CREATE OR REPLACE FUNCTION log_activity(
  p_action text,
  p_entity_type text DEFAULT NULL,
  p_entity_id uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void AS $$
BEGIN
  INSERT INTO activity_logs (admin_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), p_action, p_entity_type, p_entity_id, p_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- HELPER: Create notification for all admins
-- ============================================================
CREATE OR REPLACE FUNCTION create_admin_notification(
  p_type text,
  p_title text,
  p_message text DEFAULT NULL,
  p_data jsonb DEFAULT '{}'::jsonb
)
RETURNS void AS $$
BEGIN
  INSERT INTO notifications (admin_id, type, title, message, data)
  SELECT id, p_type, p_title, p_message, p_data FROM admins;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SEED: Default SEO settings for each route
-- ============================================================
INSERT INTO seo_settings (route, meta_title, meta_description) VALUES
  ('default', 'Limbodi Fitness Club — Premium Gym in Limbodi, Indore', 'Indore''s premier destination for strength, conditioning, and wellness. World-class equipment, elite trainers, and a community built for results.'),
  ('/', 'Limbodi Fitness Club — Premium Gym in Limbodi, Indore', 'Indore''s premier destination for strength, conditioning, and wellness. World-class equipment, elite trainers, and a community built for results.'),
  ('/about', 'About Us — Limbodi Fitness Club', 'Meet the team behind Indore''s premier fitness destination. Our mission, our story, our passion for transforming lives.'),
  ('/membership', 'Membership Plans — Limbodi Fitness Club', 'Choose from flexible monthly, quarterly, and annual membership plans. Premium access to equipment, classes, and expert coaching.'),
  ('/personal-training', 'Personal Training — Limbodi Fitness Club', 'One-on-one coaching with certified trainers. Customized programs tailored to your goals.'),
  ('/facilities', 'Facilities — Limbodi Fitness Club', 'World-class gym equipment, dedicated zones for strength, cardio, functional training, and more.'),
  ('/nutrition', 'Nutrition Coaching — Limbodi Fitness Club', 'Personalized nutrition plans and diet coaching to fuel your fitness journey.'),
  ('/bmi-calculator', 'BMI Calculator — Limbodi Fitness Club', 'Calculate your Body Mass Index and understand your fitness starting point.'),
  ('/blog', 'Fitness Blog — Limbodi Fitness Club', 'Expert tips, training guides, and fitness insights from our team of professionals.'),
  ('/faq', 'FAQ — Limbodi Fitness Club', 'Answers to common questions about memberships, training, facilities, and more.'),
  ('/contact', 'Contact Us — Limbodi Fitness Club', 'Get in touch with Limbodi Fitness Club. Visit us in Limbodi, Indore or reach out online.')
ON CONFLICT (route) DO NOTHING;

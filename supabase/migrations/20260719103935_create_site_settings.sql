/*
# Create site_settings table for CMS-managed content

1. New Tables
- `site_settings` — single-row table storing all editable business information as JSONB
  - business_name, phone, email, address, business_hours
  - social_links (instagram, facebook, youtube, linkedin, twitter)
  - google_maps_link
  - hero_stats (members, trainers, classes, years)
  - google_rating, google_review_count
  - announcement_banner, promotional_banner
  - logo_url, favicon_url
  - seo defaults (meta_title, meta_description)

2. Security
- RLS enabled
- SELECT: anon + authenticated (public site needs to read settings)
- INSERT/UPDATE/DELETE: authenticated only (admin)

3. Notes
- Single-row design enforced by CHECK constraint on id
- All fields are JSONB for flexible schema evolution
- Pre-seeded with placeholder values matching the current hardcoded content
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  business_name text NOT NULL DEFAULT 'Limbodi Fitness Club',
  phone text NOT NULL DEFAULT '+91 98260 00000',
  email text NOT NULL DEFAULT 'hello@limbodifitness.in',
  address text NOT NULL DEFAULT 'Limbodi Main Road, Near Sapphire Square, Limbodi, Indore, Madhya Pradesh 452010',
  business_hours jsonb NOT NULL DEFAULT '{"mon_sat": "5:00 AM - 11:00 PM", "sunday": "7:00 AM - 9:00 PM"}'::jsonb,
  social_links jsonb NOT NULL DEFAULT '{"instagram": "https://instagram.com", "facebook": "https://facebook.com", "youtube": "https://youtube.com", "linkedin": "https://linkedin.com", "twitter": "https://twitter.com"}'::jsonb,
  google_maps_link text NOT NULL DEFAULT 'https://maps.google.com/?q=Limbodi+Indore',
  hero_stats jsonb NOT NULL DEFAULT '{"members": "1,200+", "trainers": "15+", "classes": "40+", "years": "8"}'::jsonb,
  google_rating text NOT NULL DEFAULT '4.9',
  google_review_count text NOT NULL DEFAULT '300',
  announcement_banner text,
  promotional_banner text,
  logo_url text,
  favicon_url text,
  seo_meta_title text NOT NULL DEFAULT 'Limbodi Fitness Club — Premium Gym in Limbodi, Indore',
  seo_meta_description text NOT NULL DEFAULT 'Indore''s premier destination for strength, conditioning, and wellness. World-class equipment, elite trainers, and a community built for results.',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_site_settings" ON site_settings;
CREATE POLICY "anon_select_site_settings" ON site_settings FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_site_settings" ON site_settings;
CREATE POLICY "auth_insert_site_settings" ON site_settings FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_site_settings" ON site_settings;
CREATE POLICY "auth_delete_site_settings" ON site_settings FOR DELETE
TO authenticated USING (true);

-- Seed the single row
INSERT INTO site_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

/*
# CMS Content Tables — Classes, Facilities, Categories, Videos, Nutrition, Trainer Relations

1. Overview
This migration builds the content tables for the CMS with normalized relationships:
- `blog_categories` — categories for blog posts (replaces text column on blog_posts)
- `gallery_categories` — categories for gallery images (replaces text column on gallery_items)
- `trainer_certifications` — certifications for trainers (normalized from text[] column)
- `trainer_specializations` — specializations for trainers (normalized from text[] column)
- `classes` — fitness classes (name, description, schedule, trainer, capacity)
- `facilities` — gym facilities/amenities (name, description, image, icon)
- `videos` — video content (title, url, thumbnail, category, duration)
- `nutrition_articles` — nutrition blog content (title, slug, content, category, image)

2. New Tables
- `blog_categories` (id uuid PK, name, slug unique, description, sort_order, created_at)
- `gallery_categories` (id uuid PK, name, slug unique, sort_order, created_at)
- `trainer_certifications` (id uuid PK, trainer_id → trainers, name, issued_by, year, created_at)
- `trainer_specializations` (id uuid PK, trainer_id → trainers, name, created_at)
- `classes` (id uuid PK, name, slug, description, image, trainer_id → trainers, day_of_week, start_time, end_time, capacity, difficulty, published, sort_order, created_at)
- `facilities` (id uuid PK, name, slug, description, image, icon, sort_order, published, created_at)
- `videos` (id uuid PK, title, slug, url, thumbnail, category, duration, published, sort_order, created_at)
- `nutrition_articles` (id uuid PK, title, slug unique, excerpt, content, category, image, read_time, published, created_at)

3. Modified Tables
- `blog_posts` — adds `category_id` FK to blog_categories (keeps existing `category` text column for backward compat)
- `gallery_items` — adds `category_id` FK to gallery_categories (keeps existing `category` text column)

4. Security
- All category tables: SELECT for anon+authenticated; INSERT/UPDATE/DELETE for authenticated
- All content tables (classes, facilities, videos, nutrition_articles): SELECT for anon+authenticated; INSERT/UPDATE/DELETE for authenticated
- Trainer relation tables: SELECT for anon+authenticated; INSERT/UPDATE/DELETE for authenticated

5. Important Notes
- Foreign keys use ON DELETE CASCADE for child tables (certifications/specializations deleted with trainer)
- Foreign keys use ON DELETE SET NULL for optional relations (trainer_id on classes)
- Slugs are unique for SEO-friendly URLs
- All content tables have published boolean for draft/published state
- sort_order for manual ordering in the CMS
*/

-- ============================================================
-- BLOG CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_blog_categories" ON blog_categories;
CREATE POLICY "anon_select_blog_categories" ON blog_categories FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_blog_categories" ON blog_categories;
CREATE POLICY "auth_insert_blog_categories" ON blog_categories FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_blog_categories" ON blog_categories;
CREATE POLICY "auth_update_blog_categories" ON blog_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_blog_categories" ON blog_categories;
CREATE POLICY "auth_delete_blog_categories" ON blog_categories FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- GALLERY CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gallery_categories" ON gallery_categories;
CREATE POLICY "anon_select_gallery_categories" ON gallery_categories FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_gallery_categories" ON gallery_categories;
CREATE POLICY "auth_insert_gallery_categories" ON gallery_categories FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_gallery_categories" ON gallery_categories;
CREATE POLICY "auth_update_gallery_categories" ON gallery_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_gallery_categories" ON gallery_categories;
CREATE POLICY "auth_delete_gallery_categories" ON gallery_categories FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- TRAINER CERTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS trainer_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  name text NOT NULL,
  issued_by text,
  year integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE trainer_certifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_trainer_certifications" ON trainer_certifications;
CREATE POLICY "anon_select_trainer_certifications" ON trainer_certifications FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_trainer_certifications" ON trainer_certifications;
CREATE POLICY "auth_insert_trainer_certifications" ON trainer_certifications FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_trainer_certifications" ON trainer_certifications;
CREATE POLICY "auth_update_trainer_certifications" ON trainer_certifications FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_trainer_certifications" ON trainer_certifications;
CREATE POLICY "auth_delete_trainer_certifications" ON trainer_certifications FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_trainer_certifications_trainer_id ON trainer_certifications(trainer_id);

-- ============================================================
-- TRAINER SPECIALIZATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS trainer_specializations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE trainer_specializations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_trainer_specializations" ON trainer_specializations;
CREATE POLICY "anon_select_trainer_specializations" ON trainer_specializations FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_trainer_specializations" ON trainer_specializations;
CREATE POLICY "auth_insert_trainer_specializations" ON trainer_specializations FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_trainer_specializations" ON trainer_specializations;
CREATE POLICY "auth_update_trainer_specializations" ON trainer_specializations FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_trainer_specializations" ON trainer_specializations;
CREATE POLICY "auth_delete_trainer_specializations" ON trainer_specializations FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_trainer_specializations_trainer_id ON trainer_specializations(trainer_id);

-- ============================================================
-- CLASSES
-- ============================================================
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image text,
  trainer_id uuid REFERENCES trainers(id) ON DELETE SET NULL,
  day_of_week text,
  start_time text,
  end_time text,
  capacity integer DEFAULT 20,
  difficulty text DEFAULT 'All Levels' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_classes" ON classes;
CREATE POLICY "anon_select_classes" ON classes FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_classes" ON classes;
CREATE POLICY "auth_insert_classes" ON classes FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_classes" ON classes;
CREATE POLICY "auth_update_classes" ON classes FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_classes" ON classes;
CREATE POLICY "auth_delete_classes" ON classes FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_classes_published ON classes(published);
CREATE INDEX IF NOT EXISTS idx_classes_trainer_id ON classes(trainer_id);

-- ============================================================
-- FACILITIES
-- ============================================================
CREATE TABLE IF NOT EXISTS facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image text,
  icon text NOT NULL DEFAULT 'Dumbbell',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_facilities" ON facilities;
CREATE POLICY "anon_select_facilities" ON facilities FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_facilities" ON facilities;
CREATE POLICY "auth_insert_facilities" ON facilities FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_facilities" ON facilities;
CREATE POLICY "auth_update_facilities" ON facilities FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_facilities" ON facilities;
CREATE POLICY "auth_delete_facilities" ON facilities FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_facilities_published ON facilities(published);

-- ============================================================
-- VIDEOS
-- ============================================================
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  url text NOT NULL,
  thumbnail text,
  category text,
  duration text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_videos" ON videos;
CREATE POLICY "anon_select_videos" ON videos FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_videos" ON videos;
CREATE POLICY "auth_insert_videos" ON videos FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_videos" ON videos;
CREATE POLICY "auth_update_videos" ON videos FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_videos" ON videos;
CREATE POLICY "auth_delete_videos" ON videos FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_videos_published ON videos(published);

-- ============================================================
-- NUTRITION ARTICLES
-- ============================================================
CREATE TABLE IF NOT EXISTS nutrition_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  category text NOT NULL DEFAULT 'Nutrition',
  image text,
  read_time text DEFAULT '5 min read',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE nutrition_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_nutrition_articles" ON nutrition_articles;
CREATE POLICY "anon_select_nutrition_articles" ON nutrition_articles FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_nutrition_articles" ON nutrition_articles;
CREATE POLICY "auth_insert_nutrition_articles" ON nutrition_articles FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_nutrition_articles" ON nutrition_articles;
CREATE POLICY "auth_update_nutrition_articles" ON nutrition_articles FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_nutrition_articles" ON nutrition_articles;
CREATE POLICY "auth_delete_nutrition_articles" ON nutrition_articles FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_nutrition_articles_published ON nutrition_articles(published);

-- ============================================================
-- ADD FK COLUMNS TO EXISTING TABLES
-- ============================================================
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL;
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES gallery_categories(id) ON DELETE SET NULL;

-- Add updated_at to blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
DROP TRIGGER IF EXISTS trg_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED: Default categories
-- ============================================================
INSERT INTO blog_categories (name, slug, description, sort_order) VALUES
  ('Fitness', 'fitness', 'General fitness tips and guides', 0),
  ('Nutrition', 'nutrition', 'Diet and nutrition advice', 1),
  ('Lifestyle', 'lifestyle', 'Healthy lifestyle content', 2),
  ('Training', 'training', 'Workout and training guides', 3),
  ('Wellness', 'wellness', 'Mental and physical wellness', 4)
ON CONFLICT (name) DO NOTHING;

INSERT INTO gallery_categories (name, slug, sort_order) VALUES
  ('All', 'all', 0),
  ('Gym', 'gym', 1),
  ('Classes', 'classes', 2),
  ('Events', 'events', 3),
  ('Trainers', 'trainers', 4),
  ('Facilities', 'facilities', 5)
ON CONFLICT (name) DO NOTHING;

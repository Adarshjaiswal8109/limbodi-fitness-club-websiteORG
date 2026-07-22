/*
# Create business tables for Limbodi Fitness Club

1. New Tables
- `membership_enquiries` — stores membership enquiry form submissions (name, phone, email, age, gender, goal, plan, preferred time, message)
- `trial_bookings` — stores free trial booking submissions (name, mobile, email, date, time, goal)
- `contact_messages` — stores contact form submissions (name, email, phone, subject, message)
- `newsletter_subscribers` — stores newsletter email subscriptions (email, subscribed_at)
- `blog_posts` — CMS-ready blog content (title, slug, excerpt, content, category, image, published, created_at)
- `testimonials` — CMS-ready testimonials (name, role, image, rating, quote, transformation, published, created_at)
- `trainers` — CMS-ready trainer profiles (name, role, bio, image, experience, certifications, expertise, schedule, published)
- `gallery_items` — CMS-ready gallery images (label, image, category, span, published, sort_order)
- `faqs` — CMS-ready FAQ entries (question, answer, category, sort_order, published)
- `membership_plans` — CMS-ready membership plans (name, price, period, description, features, highlighted, sort_order)

2. Security
- All tables have RLS enabled.
- All tables allow anon + authenticated INSERT (public forms need to submit).
- All tables allow anon + authenticated SELECT (public content needs to be readable).
- UPDATE/DELETE restricted to authenticated (admin only) — admin dashboard will use service role or authenticated access.

3. Notes
- This is a single-tenant app (no user sign-in for the public site).
- Public forms write as anon; admin reads/writes as authenticated.
- CMS tables (blog_posts, testimonials, trainers, gallery_items, faqs, membership_plans) are readable by anon but only writable by authenticated.
- All tables use gen_random_uuid() for primary keys.
- created_at defaults to now().
*/

-- Membership enquiries
CREATE TABLE IF NOT EXISTS membership_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  age integer,
  gender text,
  fitness_goal text,
  preferred_plan text,
  preferred_time text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE membership_enquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_membership_enquiries" ON membership_enquiries;
CREATE POLICY "anon_insert_membership_enquiries" ON membership_enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_select_membership_enquiries" ON membership_enquiries;
CREATE POLICY "auth_select_membership_enquiries" ON membership_enquiries FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_membership_enquiries" ON membership_enquiries;
CREATE POLICY "auth_update_membership_enquiries" ON membership_enquiries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_membership_enquiries" ON membership_enquiries;
CREATE POLICY "auth_delete_membership_enquiries" ON membership_enquiries FOR DELETE TO authenticated USING (true);

-- Trial bookings
CREATE TABLE IF NOT EXISTS trial_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mobile text NOT NULL,
  email text NOT NULL,
  preferred_date date,
  preferred_time text,
  fitness_goal text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE trial_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_trial_bookings" ON trial_bookings;
CREATE POLICY "anon_insert_trial_bookings" ON trial_bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_select_trial_bookings" ON trial_bookings;
CREATE POLICY "auth_select_trial_bookings" ON trial_bookings FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_trial_bookings" ON trial_bookings;
CREATE POLICY "auth_update_trial_bookings" ON trial_bookings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_trial_bookings" ON trial_bookings;
CREATE POLICY "auth_delete_trial_bookings" ON trial_bookings FOR DELETE TO authenticated USING (true);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_select_contact_messages" ON contact_messages;
CREATE POLICY "auth_select_contact_messages" ON contact_messages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_contact_messages" ON contact_messages;
CREATE POLICY "auth_update_contact_messages" ON contact_messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_contact_messages" ON contact_messages;
CREATE POLICY "auth_delete_contact_messages" ON contact_messages FOR DELETE TO authenticated USING (true);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  subscribed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter_subscribers;
CREATE POLICY "anon_insert_newsletter" ON newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_select_newsletter" ON newsletter_subscribers;
CREATE POLICY "anon_select_newsletter" ON newsletter_subscribers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_delete_newsletter" ON newsletter_subscribers;
CREATE POLICY "auth_delete_newsletter" ON newsletter_subscribers FOR DELETE TO authenticated USING (true);

-- Blog posts (CMS)
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  category text NOT NULL DEFAULT 'Fitness',
  image text,
  read_time text DEFAULT '5 min read',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_blog_posts" ON blog_posts;
CREATE POLICY "anon_select_blog_posts" ON blog_posts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_blog_posts" ON blog_posts;
CREATE POLICY "auth_insert_blog_posts" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_blog_posts" ON blog_posts;
CREATE POLICY "auth_update_blog_posts" ON blog_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_blog_posts" ON blog_posts;
CREATE POLICY "auth_delete_blog_posts" ON blog_posts FOR DELETE TO authenticated USING (true);

-- Testimonials (CMS)
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  image text,
  rating integer NOT NULL DEFAULT 5,
  quote text NOT NULL,
  transformation text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_testimonials" ON testimonials;
CREATE POLICY "anon_select_testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
CREATE POLICY "auth_insert_testimonials" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE TO authenticated USING (true);

-- Trainers (CMS)
CREATE TABLE IF NOT EXISTS trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  image text,
  experience text,
  certifications text[],
  expertise text[],
  achievements text[],
  schedule text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_trainers" ON trainers;
CREATE POLICY "anon_select_trainers" ON trainers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_trainers" ON trainers;
CREATE POLICY "auth_insert_trainers" ON trainers FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_trainers" ON trainers;
CREATE POLICY "auth_update_trainers" ON trainers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_trainers" ON trainers;
CREATE POLICY "auth_delete_trainers" ON trainers FOR DELETE TO authenticated USING (true);

-- Gallery items (CMS)
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  image text NOT NULL,
  category text NOT NULL DEFAULT 'All',
  span text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_gallery_items" ON gallery_items;
CREATE POLICY "anon_select_gallery_items" ON gallery_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_gallery_items" ON gallery_items;
CREATE POLICY "auth_insert_gallery_items" ON gallery_items FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_gallery_items" ON gallery_items;
CREATE POLICY "auth_update_gallery_items" ON gallery_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_gallery_items" ON gallery_items;
CREATE POLICY "auth_delete_gallery_items" ON gallery_items FOR DELETE TO authenticated USING (true);

-- FAQs (CMS)
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_faqs" ON faqs;
CREATE POLICY "anon_select_faqs" ON faqs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_faqs" ON faqs;
CREATE POLICY "auth_insert_faqs" ON faqs FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_faqs" ON faqs;
CREATE POLICY "auth_update_faqs" ON faqs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_faqs" ON faqs;
CREATE POLICY "auth_delete_faqs" ON faqs FOR DELETE TO authenticated USING (true);

-- Membership plans (CMS)
CREATE TABLE IF NOT EXISTS membership_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL,
  period text,
  description text,
  features text[],
  icon text NOT NULL DEFAULT 'Calendar',
  highlighted boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_membership_plans" ON membership_plans;
CREATE POLICY "anon_select_membership_plans" ON membership_plans FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_membership_plans" ON membership_plans;
CREATE POLICY "auth_insert_membership_plans" ON membership_plans FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_membership_plans" ON membership_plans;
CREATE POLICY "auth_update_membership_plans" ON membership_plans FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_membership_plans" ON membership_plans;
CREATE POLICY "auth_delete_membership_plans" ON membership_plans FOR DELETE TO authenticated USING (true);

-- Indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_membership_enquiries_created_at ON membership_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trial_bookings_created_at ON trial_bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(published);
CREATE INDEX IF NOT EXISTS idx_trainers_published ON trainers(published);
CREATE INDEX IF NOT EXISTS idx_gallery_items_published ON gallery_items(published);
CREATE INDEX IF NOT EXISTS idx_faqs_published ON faqs(published);
CREATE INDEX IF NOT EXISTS idx_membership_plans_published ON membership_plans(sort_order);

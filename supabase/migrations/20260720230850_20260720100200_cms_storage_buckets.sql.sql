/*
# CMS Storage Buckets and Policies

1. Overview
This migration creates storage buckets for all CMS media types and sets public read policies.

2. New Storage Buckets
- `trainer-images` — trainer profile photos
- `gallery-images` — gallery photos
- `blog-images` — blog post featured images
- `facility-images` — facility photos
- `website-assets` — logos, favicons, banners, brand assets
- `videos` — video content
- `documents` — PDFs, terms, privacy policy docs

3. Security
- All buckets are PUBLIC (public read access for the website to display images)
- Upload/replace/delete restricted to authenticated users (admin only)
- Storage policies use (bucket_id = '<bucket_name>') for per-bucket scoping

4. Important Notes
- Buckets created via `storage.buckets` table insert (idempotent with ON CONFLICT)
- Public buckets allow anonymous reads — no RLS needed for SELECT
- Authenticated users get full CRUD within each bucket
- File size limits: 50MB for images, 500MB for videos
*/

-- ============================================================
-- CREATE STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('trainer-images', 'trainer-images', true, 52428800, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('gallery-images', 'gallery-images', true, 52428800, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('blog-images', 'blog-images', true, 52428800, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('facility-images', 'facility-images', true, 52428800, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('website-assets', 'website-assets', true, 52428800, ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','image/x-icon']),
  ('videos', 'videos', true, 524288000, ARRAY['video/mp4','video/webm','video/ogg']),
  ('documents', 'documents', true, 52428800, ARRAY['application/pdf','text/plain','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE POLICIES — Public Read for All Buckets
-- ============================================================
CREATE POLICY "public_read_trainer_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'trainer-images');

CREATE POLICY "public_read_gallery_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'gallery-images');

CREATE POLICY "public_read_blog_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'blog-images');

CREATE POLICY "public_read_facility_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'facility-images');

CREATE POLICY "public_read_website_assets" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'website-assets');

CREATE POLICY "public_read_videos" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'videos');

CREATE POLICY "public_read_documents" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'documents');

-- ============================================================
-- STORAGE POLICIES — Authenticated Upload/Update/Delete
-- ============================================================
CREATE POLICY "auth_insert_trainer_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'trainer-images');
CREATE POLICY "auth_update_trainer_images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'trainer-images') WITH CHECK (bucket_id = 'trainer-images');
CREATE POLICY "auth_delete_trainer_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'trainer-images');

CREATE POLICY "auth_insert_gallery_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'gallery-images');
CREATE POLICY "auth_update_gallery_images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'gallery-images') WITH CHECK (bucket_id = 'gallery-images');
CREATE POLICY "auth_delete_gallery_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'gallery-images');

CREATE POLICY "auth_insert_blog_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'blog-images');
CREATE POLICY "auth_update_blog_images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'blog-images') WITH CHECK (bucket_id = 'blog-images');
CREATE POLICY "auth_delete_blog_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'blog-images');

CREATE POLICY "auth_insert_facility_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'facility-images');
CREATE POLICY "auth_update_facility_images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'facility-images') WITH CHECK (bucket_id = 'facility-images');
CREATE POLICY "auth_delete_facility_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'facility-images');

CREATE POLICY "auth_insert_website_assets" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'website-assets');
CREATE POLICY "auth_update_website_assets" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'website-assets') WITH CHECK (bucket_id = 'website-assets');
CREATE POLICY "auth_delete_website_assets" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'website-assets');

CREATE POLICY "auth_insert_videos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'videos');
CREATE POLICY "auth_update_videos" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'videos') WITH CHECK (bucket_id = 'videos');
CREATE POLICY "auth_delete_videos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'videos');

CREATE POLICY "auth_insert_documents" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'documents');
CREATE POLICY "auth_update_documents" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'documents') WITH CHECK (bucket_id = 'documents');
CREATE POLICY "auth_delete_documents" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'documents');

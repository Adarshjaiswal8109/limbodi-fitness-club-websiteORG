/*
# Fix missing sort_order columns on blog_posts and testimonials

1. Modified Tables
- `blog_posts` — adds `sort_order` integer column (default 0) so the CMS can order blog posts
- `testimonials` — adds `sort_order` integer column (default 0) so the CMS can order testimonials

2. Security
- No policy changes; new columns inherit existing RLS policies on their tables.

3. Notes
- Both columns default to 0 so existing rows are unaffected.
- Indexes added on sort_order for efficient ordering.
*/

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_blog_posts_sort_order ON blog_posts(sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort_order ON testimonials(sort_order);

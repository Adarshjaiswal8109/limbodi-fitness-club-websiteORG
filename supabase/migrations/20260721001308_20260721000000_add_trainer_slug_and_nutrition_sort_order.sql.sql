/*
# Add slug column to trainers and sort_order to nutrition_articles

1. Schema changes
- `trainers.slug` (text) — unique slug for trainer URLs, auto-generated from name on insert if omitted.
- `nutrition_articles.sort_order` (integer) — explicit ordering column to match other CMS tables.
2. Backfill
- Populate `trainers.slug` from `name` for existing rows where slug is null.
- Set `nutrition_articles.sort_order` default to 0 for existing rows.
3. Security
- No RLS policy changes; existing policies already cover the new columns.
*/

ALTER TABLE trainers ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE nutrition_articles ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

UPDATE trainers
SET slug = lower(regexp_replace(name, '[^\w\s-]', '', 'g'))
WHERE slug IS NULL;
UPDATE trainers
SET slug = replace(slug, ' ', '-')
WHERE slug IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS trainers_slug_key ON trainers (slug);

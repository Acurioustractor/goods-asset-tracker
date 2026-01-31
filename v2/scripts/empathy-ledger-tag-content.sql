-- Empathy Ledger Content Tagging for Goods on Country
-- Run these queries in the Empathy Ledger Supabase dashboard to tag content
--
-- Date: 2026-01-21
-- Purpose: Tag existing content with Goods project code and set up syndication
--
-- IMPORTANT: Review audit results first before running tag operations!
-- Run empathy-ledger-content-audit.sql to identify content before tagging.

-- ============================================
-- 1. TAG MEDIA ASSETS FOR GOODS
-- ============================================

-- Preview: Show media that will be tagged
SELECT id, title, project_code, visibility
FROM media_assets
WHERE project_code IS NULL
AND (
    title ILIKE '%bed%'
    OR title ILIKE '%delivery%'
    OR alt_text ILIKE '%bed%'
    OR alt_text ILIKE '%goods%'
);

-- EXECUTE: Tag media assets with 'goods' project code
-- Uncomment to run:
/*
UPDATE media_assets
SET
    project_code = 'goods',
    updated_at = NOW()
WHERE project_code IS NULL
AND (
    title ILIKE '%bed%'
    OR title ILIKE '%delivery%'
    OR alt_text ILIKE '%bed%'
    OR alt_text ILIKE '%goods%'
);
*/

-- ============================================
-- 2. TAG VIDEO LINKS FOR GOODS
-- ============================================

-- Preview: Show videos that will be tagged
SELECT id, title, project_code, visibility
FROM video_links
WHERE project_code IS NULL
AND (
    title ILIKE '%bed%'
    OR title ILIKE '%delivery%'
    OR title ILIKE '%goods%'
);

-- EXECUTE: Tag video links with 'goods' project code
-- Uncomment to run:
/*
UPDATE video_links
SET
    project_code = 'goods',
    updated_at = NOW()
WHERE project_code IS NULL
AND (
    title ILIKE '%bed%'
    OR title ILIKE '%delivery%'
    OR title ILIKE '%goods%'
);
*/

-- ============================================
-- 3. ADD GOODS THEMES TO STORIES
-- ============================================

-- Preview: Show stories that need Goods themes
SELECT
    id,
    title,
    themes,
    SUBSTRING(content, 1, 100) as preview
FROM stories
WHERE
    (content ILIKE '%bed%' OR content ILIKE '%delivery%')
    AND NOT (themes::text ILIKE '%goods%');

-- EXECUTE: Add 'goods' theme to relevant stories
-- Uncomment to run:
/*
UPDATE stories
SET
    themes = themes || '["goods", "impact"]'::jsonb,
    cultural_themes = array_append(cultural_themes, 'goods'),
    updated_at = NOW()
WHERE
    (content ILIKE '%bed%' OR content ILIKE '%delivery%')
    AND NOT (themes::text ILIKE '%goods%');
*/

-- ============================================
-- 4. CREATE SYNDICATION CONSENT FOR GOODS
-- ============================================

-- Get the Goods site ID
-- SELECT id FROM syndication_sites WHERE slug = 'goods-on-country';

-- Create syndication consent for public stories
-- This allows Goods to display stories via the Content Hub API
-- Uncomment to run (replace {GOODS_SITE_ID} with actual ID):
/*
INSERT INTO syndication_consent (
    story_id,
    site_id,
    storyteller_id,
    status,
    approved_at,
    allow_full_content,
    allow_photos,
    allow_videos,
    cultural_permission_level
)
SELECT
    s.id as story_id,
    '{GOODS_SITE_ID}'::uuid as site_id,
    s.storyteller_id,
    'approved' as status,
    NOW() as approved_at,
    true as allow_full_content,
    true as allow_photos,
    true as allow_videos,
    'public' as cultural_permission_level
FROM stories s
WHERE
    s.is_public = true
    AND (s.content ILIKE '%bed%' OR s.content ILIKE '%delivery%')
    AND NOT EXISTS (
        SELECT 1 FROM syndication_consent sc
        WHERE sc.story_id = s.id
        AND sc.site_id = '{GOODS_SITE_ID}'::uuid
    );
*/

-- ============================================
-- 5. LINK MEDIA TO GOODS GALLERY
-- ============================================

-- Get the Goods gallery ID
-- SELECT id FROM galleries WHERE slug = 'goods-on-country-gallery';

-- Link media assets to Goods gallery
-- Uncomment to run (replace {GOODS_GALLERY_ID} with actual ID):
/*
INSERT INTO gallery_media (
    gallery_id,
    media_asset_id,
    display_order,
    created_at
)
SELECT
    '{GOODS_GALLERY_ID}'::uuid as gallery_id,
    ma.id as media_asset_id,
    ROW_NUMBER() OVER (ORDER BY ma.created_at DESC) as display_order,
    NOW() as created_at
FROM media_assets ma
WHERE
    ma.project_code = 'goods'
    AND ma.visibility = 'public'
    AND NOT EXISTS (
        SELECT 1 FROM gallery_media gm
        WHERE gm.gallery_id = '{GOODS_GALLERY_ID}'::uuid
        AND gm.media_asset_id = ma.id
    );
*/

-- ============================================
-- 6. VERIFICATION QUERIES
-- ============================================

-- Verify media tagging
SELECT
    project_code,
    COUNT(*) as count
FROM media_assets
WHERE project_code = 'goods'
GROUP BY project_code;

-- Verify video tagging
SELECT
    project_code,
    COUNT(*) as count
FROM video_links
WHERE project_code = 'goods'
GROUP BY project_code;

-- Verify story themes
SELECT
    themes,
    COUNT(*) as count
FROM stories
WHERE themes::text ILIKE '%goods%'
GROUP BY themes;

-- Verify syndication consent
SELECT
    ss.slug as site,
    COUNT(sc.id) as consent_count
FROM syndication_consent sc
JOIN syndication_sites ss ON sc.site_id = ss.id
WHERE ss.slug = 'goods-on-country'
GROUP BY ss.slug;

-- Verify gallery media
SELECT
    g.title as gallery,
    COUNT(gm.id) as media_count
FROM galleries g
LEFT JOIN gallery_media gm ON g.id = gm.gallery_id
WHERE g.slug = 'goods-on-country-gallery'
GROUP BY g.title;

-- ============================================
-- 7. TAG BY SPECIFIC STORY IDS
-- ============================================

-- If you've identified specific stories to tag, use this pattern:
-- Replace the UUIDs with actual story IDs from the audit
/*
UPDATE stories
SET
    themes = themes || '["goods", "testimonial", "impact"]'::jsonb,
    updated_at = NOW()
WHERE id IN (
    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
);
*/

-- ============================================
-- 8. TAG BY SPECIFIC MEDIA IDS
-- ============================================

-- If you've identified specific media to tag, use this pattern:
/*
UPDATE media_assets
SET
    project_code = 'goods',
    updated_at = NOW()
WHERE id IN (
    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
);
*/

-- Empathy Ledger Content Audit for Goods on Country
-- Run these queries in the Empathy Ledger Supabase dashboard to find and tag content
--
-- Date: 2026-01-21
-- Purpose: Identify existing content relevant to Goods and set up syndication

-- ============================================
-- 1. AUDIT: Find Stories Relevant to Goods
-- ============================================

-- Stories that mention beds, deliveries, or community themes
SELECT
    id,
    title,
    SUBSTRING(content, 1, 200) as content_preview,
    story_type,
    privacy_level,
    is_public,
    themes,
    cultural_themes,
    created_at
FROM stories
WHERE
    -- Search for Goods-relevant keywords
    content ILIKE '%bed%'
    OR content ILIKE '%delivery%'
    OR content ILIKE '%goods%'
    OR content ILIKE '%sleeping%'
    OR content ILIKE '%furniture%'
    OR content ILIKE '%washing machine%'
    OR content ILIKE '%laundry%'
    -- Or stories tagged with relevant themes
    OR themes::text ILIKE '%delivery%'
    OR themes::text ILIKE '%impact%'
    OR themes::text ILIKE '%community%'
ORDER BY created_at DESC;

-- Count of potential Goods stories
SELECT COUNT(*) as potential_goods_stories
FROM stories
WHERE
    content ILIKE '%bed%'
    OR content ILIKE '%delivery%'
    OR content ILIKE '%goods%'
    OR content ILIKE '%sleeping%'
    OR themes::text ILIKE '%delivery%'
    OR themes::text ILIKE '%impact%';

-- ============================================
-- 2. AUDIT: Find Media Relevant to Goods
-- ============================================

-- Photos/videos tagged with beds, communities, or deliveries
SELECT
    id,
    title,
    media_type,
    project_code,
    visibility,
    elder_approved,
    alt_text,
    url,
    created_at
FROM media_assets
WHERE
    -- Already tagged for Goods
    project_code = 'goods'
    -- Or has relevant keywords
    OR title ILIKE '%bed%'
    OR title ILIKE '%delivery%'
    OR alt_text ILIKE '%bed%'
    OR alt_text ILIKE '%delivery%'
    OR alt_text ILIKE '%community%'
ORDER BY created_at DESC;

-- Count media by project_code
SELECT
    project_code,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE elder_approved = true) as elder_approved
FROM media_assets
WHERE project_code IS NOT NULL
GROUP BY project_code
ORDER BY count DESC;

-- ============================================
-- 3. AUDIT: Find Video Links
-- ============================================

SELECT
    id,
    title,
    video_type,
    platform,
    project_code,
    visibility,
    elder_approved,
    created_at
FROM video_links
WHERE
    project_code = 'goods'
    OR title ILIKE '%bed%'
    OR title ILIKE '%delivery%'
    OR title ILIKE '%goods%'
ORDER BY created_at DESC;

-- ============================================
-- 4. AUDIT: Check Goods Site Status
-- ============================================

-- Verify Goods is registered as syndication site
SELECT
    id,
    slug,
    name,
    status,
    features,
    allowed_domains,
    created_at
FROM syndication_sites
WHERE slug = 'goods-on-country';

-- Check Goods gallery exists
SELECT
    id,
    title,
    slug,
    description,
    is_public,
    visibility,
    cultural_context
FROM galleries
WHERE slug = 'goods-on-country-gallery';

-- ============================================
-- 5. AUDIT: Storytellers with Goods Content
-- ============================================

-- Find storytellers who have created Goods-relevant content
SELECT DISTINCT
    st.id,
    st.name,
    st.bio,
    st.community,
    st.is_public,
    COUNT(s.id) as story_count
FROM storytellers st
LEFT JOIN stories s ON st.id = s.storyteller_id
WHERE
    s.content ILIKE '%bed%'
    OR s.content ILIKE '%delivery%'
    OR s.content ILIKE '%goods%'
GROUP BY st.id, st.name, st.bio, st.community, st.is_public
ORDER BY story_count DESC;

-- ============================================
-- 6. SUMMARY COUNTS
-- ============================================

SELECT
    'Stories' as content_type,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE is_public = true) as public_count,
    COUNT(*) FILTER (WHERE
        content ILIKE '%bed%' OR content ILIKE '%delivery%'
    ) as goods_relevant
FROM stories

UNION ALL

SELECT
    'Media Assets' as content_type,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE visibility = 'public') as public_count,
    COUNT(*) FILTER (WHERE project_code = 'goods') as goods_relevant
FROM media_assets

UNION ALL

SELECT
    'Video Links' as content_type,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE visibility = 'public') as public_count,
    COUNT(*) FILTER (WHERE project_code = 'goods') as goods_relevant
FROM video_links;

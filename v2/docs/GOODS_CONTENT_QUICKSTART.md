# Goods Content Quick Start

**The easiest ways to add photos, videos, and stories for Goods on Country.**

---

## Option 1: Empathy Ledger Admin UI (Easiest)

### Access
Go to: **https://empathy-ledger.vercel.app/admin**

### Add Photos

1. **Go to Galleries** → `/admin/galleries`
2. **Find "Goods on Country Gallery"** (or create one)
3. **Click into the gallery** → `/admin/galleries/[id]`
4. **Upload photos** - Drag & drop or click to select
5. **For each photo, click Edit** and go to the **Project** tab
6. **Select "Goods on Country"** from the dropdown
7. **Save**

### Add Videos

1. **Go to Videos** → `/admin/videos`
2. **Click "Add Video"**
3. **Paste video URL** (YouTube, Vimeo, Descript, Loom)
4. **Fill in title and description**
5. **In the Project section**, select **"Goods on Country"**
6. **Save**

### Add Stories

1. **Go to Stories** → `/admin/stories`
2. **Click "New Story"**
3. **Write content** using the story templates
4. **Add themes**: `goods`, `delivery`, `impact`, `testimonial`, etc.
5. **Set visibility**: `public`
6. **Publish**

---

## Option 2: Supabase SQL (Bulk Operations)

### Access
Go to: **Empathy Ledger Supabase** → **SQL Editor**

### Tag All Existing Media for Goods

```sql
-- See what will be tagged
SELECT id, title, project_code
FROM media_assets
WHERE project_code IS NULL
AND (title ILIKE '%bed%' OR title ILIKE '%delivery%' OR title ILIKE '%goods%');

-- Tag them (uncomment to run)
-- UPDATE media_assets SET project_code = 'goods' WHERE id IN ('id1', 'id2', 'id3');
```

### Tag Videos for Goods

```sql
-- See videos to tag
SELECT id, title, project_code
FROM video_links
WHERE project_code IS NULL
AND (title ILIKE '%bed%' OR title ILIKE '%delivery%');

-- Tag them (uncomment to run)
-- UPDATE video_links SET project_code = 'goods' WHERE id IN ('id1', 'id2');
```

### Add Media to Goods Gallery

```sql
-- Find the Goods gallery ID
SELECT id FROM galleries WHERE slug = 'goods-on-country-gallery';

-- Link media to gallery (replace IDs)
-- INSERT INTO gallery_media (gallery_id, media_asset_id)
-- VALUES ('gallery-uuid', 'media-uuid');
```

---

## Option 3: Direct Upload (Fastest for New Content)

### Upload Photos Directly to Supabase Storage

1. **Supabase Dashboard** → **Storage** → **media** bucket
2. **Upload files** to a folder like `goods/`
3. **Get public URL** for each file
4. **Insert into media_assets** table with `project_code = 'goods'`

### Example SQL for New Media

```sql
INSERT INTO media_assets (
    title,
    url,
    media_type,
    project_code,
    visibility,
    status,
    uploader_id,
    tenant_id
) VALUES (
    'Palm Island Delivery January 2026',
    'https://your-supabase.storage.../goods/palm-island-delivery.jpg',
    'image',
    'goods',
    'public',
    'active',
    (SELECT id FROM storytellers LIMIT 1),  -- Replace with actual uploader
    (SELECT id FROM tenants LIMIT 1)
);
```

---

## Project Code Values

When tagging for Goods, use:

| Field | Value |
|-------|-------|
| `project_code` | `'goods'` |
| Syndication site slug | `'goods-on-country'` |
| Gallery slug | `'goods-on-country-gallery'` |

---

## Theme Tags for Goods

Use these themes to control where content appears:

| Theme | Appears On |
|-------|-----------|
| `featured` | Homepage |
| `testimonial` | /shop, /stories |
| `delivery` | /stories, /impact |
| `impact` | /impact |
| `sponsor-impact` | /sponsor |
| `artisan` | /about, /shop |
| `milestone` | /stories, homepage |

### Community Tags
- `palm-island`
- `tennant-creek`
- `alice-homelands`
- `maningrida`
- `kalgoorlie`

---

## How It All Links Together

```
Empathy Ledger (Source)
    ↓
media_assets.project_code = 'goods'
video_links.project_code = 'goods'
stories → themes includes 'goods'
    ↓
Goods Gallery (goods-on-country-gallery)
    ↓
Content Hub API filters by project_code
    ↓
Goods Website displays content
```

---

## Quick Checklist

- [ ] Photo/video has `project_code = 'goods'`
- [ ] Content is `visibility = 'public'`
- [ ] Linked to Goods gallery (for photos)
- [ ] Has appropriate theme tags
- [ ] Elder approved (if culturally sensitive)
- [ ] Content appears on Goods site within 5 minutes (API cache)

---

## Troubleshooting

### Content not appearing on Goods?

1. **Check project_code** - Must be `'goods'`
2. **Check visibility** - Must be `'public'`
3. **Check status** - Must be `'active'`
4. **Wait for cache** - API caches for 5 minutes

### Need to see what's tagged?

```sql
-- Count content by project_code
SELECT project_code, COUNT(*)
FROM media_assets
WHERE project_code IS NOT NULL
GROUP BY project_code;

-- See Goods content
SELECT * FROM media_assets WHERE project_code = 'goods';
SELECT * FROM video_links WHERE project_code = 'goods';
```

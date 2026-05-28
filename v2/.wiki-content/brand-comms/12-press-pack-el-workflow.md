# 12. Press pack — EL workflow

The `/press` page on goodsoncountry.com pulls photos and videos directly from the Empathy Ledger. Refreshes every 5 minutes. No code change needed to update what shows up — just upload to EL with the right settings.

This doc is the SOP for: getting an asset onto `/press`, making it look polished, and pulling it back if needed.

## Where the page reads from

| Source | Where it pulls from | What surfaces |
|---|---|---|
| **Photos** | `media_assets` table where `project_id = Goods`, `media_type = image`, `visibility = public` | Up to 36, newest first |
| **Videos** | `media_assets` table where `project_id = Goods`, `media_type = video`, `visibility = public` | Up to 24, newest first |
| **Stories videos** | `stories` table where `project_id = Goods`, `media_url is not null`, `is_public = true`, `consent_withdrawn_at is null`, `is_archived != true`, `syndication_enabled != false` | Same dedup |

Consent filtering is applied automatically. If `syndication_enabled = false` or `consent_withdrawn_at` is set, the asset is removed within 5 minutes.

## Three things to do on every upload

When you upload a photo or video to EL:

### 1. Set visibility to public

If `visibility != 'public'`, the asset stays inside EL. It will not appear on `/press`.

### 2. Add a caption

The caption is what shows on the press page. If blank, the page falls back to a cleaned-up filename — which is rarely what you want a journalist to read.

**Good captions are specific:**
- "Karen Liddle, Oonchiumpa Board Chair, with the Stretch Bed prototype at Mbantua, March 2026."
- "Stretch Bed assembly at the Alice Springs production facility, drying canvas in the morning sun."

**Bad captions:**
- "Bed photo"
- "IMG_4521"
- Anything generic enough to fit any photo

### 3. Apply the right tags

| Tag | What it does |
|---|---|
| `press-featured` | Surfaces this asset at the top of `/press` in the Featured row |
| `press-vertical` | Tells the page this video is vertical (use when EL doesn't have `aspect_ratio` set) |

Tags live in the `cultural_tags` field. You can add multiple, comma-separated.

## How to feature a photo

1. Upload as normal to EL.
2. Set `visibility = public` and write a real caption.
3. Add `press-featured` to `cultural_tags`.
4. Wait up to 5 minutes. Hard-refresh `/press`.

To un-feature: remove the tag. To remove entirely: set `visibility = private` or `syndication_enabled = false`.

## How to mark a video as vertical

EL doesn't always store `aspect_ratio`. When that's missing, the page assumes landscape and the video lands in the press / editorial bucket. If you uploaded a 9:16 social cut:

1. Add `press-vertical` to `cultural_tags`.
2. Wait up to 5 minutes.

The video moves to the Vertical bucket. Plays correctly in a 9:16 frame.

## How to withdraw an asset

Any one of these removes the asset from `/press` within 5 minutes:

- Set `visibility = private` (or anything other than `public`)
- Set `consent_withdrawn_at` to any timestamp (this is the canonical consent-withdrawal flag)
- Set `is_archived = true`
- Set `syndication_enabled = false`

For a full audit trail, prefer `consent_withdrawn_at` over `is_archived`. The withdrawal reason should be logged in the EL `consent_audit_log` table.

## Bulk operations

To caption a large backlog (we have one as of 25 May 2026: roughly 50 photos and 22 videos with blank captions), run a Supabase update against `media_assets`:

```sql
update media_assets
set caption = '...'
where id = '...';
```

Or upload via the EL admin one-by-one if you want richer context per asset.

## Why this matters

The press page is the first place a journalist, funder, or partner lands when they need assets to write or pitch with. Filenames like "Screenshot 2026-05-25 at 8.59.38 am" or "Charley Utpoia" (typo intentional, that's what's in EL right now) make us look careless. Two minutes per upload to write a real caption changes how the work reads.

## When to bypass this and ask for code

99% of curation should happen in EL. You shouldn't need a dev for:

- Featuring a photo (use the tag)
- Re-ordering (newest wins, plus featured-first)
- Removing an asset (toggle consent or visibility)
- Captioning (edit the row)

You DO need a dev for:

- Adding a new section to `/press` (e.g. external press coverage links)
- Changing the consent-filter rules
- Adding a new tag to the schema
- Changing the page's overall shape or copy

For those, see `v2/src/app/press/page.tsx` and `v2/src/lib/empathy-ledger/press-pack.ts`.

## Related

- [01-voice-and-tone](./01-voice-and-tone.md) — the writing voice the page applies
- [10-el-goods-sync](./10-el-goods-sync.md) — how Goods syncs from EL more broadly
- [11-el-video-taxonomy](./11-el-video-taxonomy.md) — the tag system, fuller picture
- [CONSENT_PROCESS](./CONSENT_PROCESS.md) — what consent means in EL and how it's recorded

# Admin sweep: what we SEE, what we DO, what the public gets

**Date:** 2026-07-20 · **Status:** alignment doc for the admin redesign, pairs with `design/goods-admin-frames.pen` (7 frames) · **Ben's directive:** "we don't need 55 routes — review, then work only the ones we need."

## Ben's three asks, mapped to what exists

### 1. Tag photos and video, add new ones, tag to communities, storytellers, products

| Piece | State today |
|---|---|
| Tag / star / rate / archive in the media library | EXISTS (`/admin/media-library`) |
| Typed links media ↔ community / person / story | STAGED, not applied (`media_links` migration + backfill, dry-run 105 links) |
| Tag media to a PRODUCT | MISSING — `media_links` needs a `product` entity type |
| Upload new media into the library | MISSING as a general action (upload exists only in `install-bulk` and the stale `compassion` page) |
| Canon slot picking (the approved image per deck slot) | EXISTS (`/admin/canon`) |

Design now encodes: Media Room frame has an Add-media button and "+ Link community · storyteller · product" verbs in the inspector.

### 2. Add to sections (production facility etc.), more photos and context as needed

Today `/admin/facility` is **hardcoded** and product knowledge is scattered (products.ts, shop page, system-visuals, compendium, Notion). To make sections editable without a deploy, pages need a **section content model** (content_items-backed sections: heading, text, media refs, order). The Product-wiki frame (06) is the pattern: jump-bar sections, each with admin add/edit affordances, drawing from products.ts, cost engine, wiki articles, Notion numbers DB, media_links, EL stories. Same template serves the Stretch Bed, Pakkimjalki Kari, Basket Bed, and the plant.

### 3. Sync all data and numbers · all pipelines in one place with filters · filter media easily

| Piece | State today |
|---|---|
| Drift checks (register ↔ canon ↔ copy) | EXIST (`check-asset-drift.mjs`, `check-canon-drift.mjs`, CI) |
| Source freshness view | EXISTS (`/admin/operating-systems`) — folds into the new Pipeline frame's freshness panel |
| One pipeline view | MISSING — spread across `/admin/deals`, `/admin/loi-tracker`, `/admin/requests` |
| Notion ↔ Supabase ↔ GHL sync jobs | OPEN ledger item, not built |
| Media filtering | EXISTS (library filters) — carried into the Media Room design |

Design now encodes: Frame 07 **Pipeline** — every opportunity in one table (REAL Fund $2.4M, Groote $1.7M, match stack target asks SEFA/Snow/Centrecorp, QBE $400K contingent, honesty chips), filter chips, the-gap band, data-freshness panel with Run-sync, LOI ladder at 0 signed.

## The line: three doors

- **PUBLIC** sees: register aggregates, /impact, cleared stories and field notes, an open-data Atlas cut (map + counts, no names or contacts), product marketing pages. Never: people's names/contacts, demand dollars, holds, consent internals, pipeline.
- **GATED (funder door, one password)** sees: the data room grown from /investors — Cost Story, facility story, cleared-only Voice Impact, gated Atlas, cleared product-wiki cuts.
- **TEAM (admin)** sees everything and holds every DO verb: tag/link/star/archive/upload media, edit page sections, clear or hold quotes, register writes, pipeline stage moves, sync runs, report generation. DO verbs never leave the team door.

## Route consolidation: 55 → what we need

**The 7 surfaces (the admin):**

| Surface | Absorbs |
|---|---|
| 01 The Map (home) | /admin, /admin/atlas |
| 02 Communities | communities, community detail pages, community-stories |
| 03 Media Room | media-library, canon, system-visuals, media-gaps, dashboard-images, quote-cards; compassion's upload folds in before it retires |
| 04 Money | cost-model (+ gated /investors), xero-reconciliation, orders, trip-receipts, funders, reports, reports/impact |
| 05 Products & Plant + product wikis | facility, production; products (stale) retires |
| 06 Pipeline | deals, loi-tracker, requests; people stays as the person drill-down |
| 07 Voices (consent wing, already strong) | voices, voice-impact, storytellers; quotes + story-atlas + stories + el-stories + el-storytellers fold into tabs; field-notes stays as authoring index |

**Field tools (phone-first, keep lean):** today, assets, bed-preflight, install-bulk, install-checklist, bed-signals, scans, fleet.

**Utilities kept:** consent (the protection mechanism), pitch-cockpit (absorbs deck-builder, deck, site-content, library), roadmap (partner-facing), reach-out (or fold into people).

**Retire (redirect + archive):** photos, messages, announcements, compassion (after upload folds), products, brand, team, alice-fill.

End state: roughly **7 fronts + 8 field tools + 4 utilities ≈ 19 routes with real jobs**; everything else redirects. Nothing is deleted until its job provably lives elsewhere (absorb-by-navigation, per the standing decision).

## Proposed build order (after Ben signs off the frames)

1. Apply `media_links` + add `product` entity type → Media Room v1 (tag, link, add).
2. The Map home + new sidebar + fold/redirect pass (the 55→19 cut).
3. Pipeline v1 (crm_deals + GHL live, freshness panel wired to the drift scripts).
4. Section content model → Product wiki (Stretch Bed, the plant), then washer + basket.
5. Community walkthrough v2 with present mode.
6. Gated funder-room cuts (data room).

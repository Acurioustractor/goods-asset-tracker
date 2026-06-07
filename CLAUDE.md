# Goods on Country

## CRITICAL — Read First

### Supabase MCP can reach EVERY project — always target Goods
The org has 9 Supabase projects and the Supabase MCP can reach all of them; it takes an explicit `project_id`, so a stray or wrong id silently queries someone else's database. The v2 app DB is the **Goods** project, `cwsyhpiuepvdjtxaozwf`. The one easiest to hit by mistake is `bhwyqqbovcjoefezgfnq` ("ACT Farmhand"), a different project. **NEVER use the Supabase MCP for v2 database operations.** Use `curl` with the service role key from `.env.local`, or `psql` with the connection string. If you catch yourself running `mcp__supabase__execute_sql` for v2 data, STOP — you are likely on the wrong database. Full project map: `wiki/canon/SOURCES.md`.

### Build, Don't Plan
Do NOT enter extended planning modes unless explicitly asked. When given a task, start implementing immediately. If clarification is needed, ask a focused question — do not write multi-phase plan documents. If a plan IS requested, keep it to bullet points and ask for approval before continuing.

### Verify Approach Before Implementing
Before writing code for a non-trivial task, state your approach in 2-3 bullets: (1) what you'll do, (2) what tools/APIs you'll use, (3) what could go wrong. Then proceed unless redirected. This is NOT a plan — it's a 3-line sanity check.

## What This Is
A social enterprise delivering quality furniture to remote Indigenous communities across Australia. The flagship product is the **Stretch Bed** — a washable, flat-packable bed made from recycled plastic, heavy-duty canvas, and galvanised steel.

## Project Structure

```
v2/                          <- THE ACTIVE CODEBASE (Next.js 16 + React 19)
  src/app/                   <- App Router pages
  src/components/            <- auth, cart, empathy-ledger, layout, marketing, shop, ui
  src/lib/                   <- cart, data, empathy-ledger, ghl, stripe, supabase, types
  public/video/              <- Background videos (hero, stretch-bed, community)
wiki/                        <- LLM knowledge base (Karpathy pattern) — see wiki/AGENTS.md
  raw/                       <- source material (emails, clippings) — never hand-edited
  articles/                  <- LLM-compiled wiki articles, INDEX.md is the map
  outputs/                   <- generated briefings/reports
deploy/                      <- OLD static HTML site (legacy, do not modify)
tools/                       <- FFmpeg video processing scripts
media/                       <- Raw video footage and analysis
```

**Goods Wiki:** lightweight LLM knowledge base at `wiki/`. Follows the Karpathy pattern: raw
sources in `wiki/raw/`, LLM-compiled articles in `wiki/articles/`, rules in `wiki/AGENTS.md`.
For deep ACT ecosystem knowledge, cross-reference the ACT Tractorpedia at
`/Users/benknight/Code/act-global-infrastructure/wiki/` (124 articles) — don't duplicate.

**Always work in `v2/`.** The `deploy/` folder is the old site and should not be modified.

## Tech Stack (v2)
- **Framework:** Next.js 16.1.4 with App Router, Turbopack
- **UI:** React 19, Tailwind CSS 4, Radix UI, shadcn/ui components
- **Backend:** Supabase (PostgreSQL, Auth, Storage) — project `cwsyhpiuepvdjtxaozwf`
- **Payments:** Stripe (only for Stretch Bed purchases)
- **Deployment:** Vercel
- **Fonts:** Georgia (display), system sans-serif (body)

## Products — THE TRUTH

### 1. The Stretch Bed (FLAGSHIP — for sale)
- **What it is:** A flat-packable, washable bed
- **Materials:** Recycled HDPE plastic X-trestle legs (two crossed-plank "X" assemblies), 2x galvanised steel poles (26.9mm OD × 2.6mm wall), heavy-duty Australian canvas (sleeping surface)
- **How it works:** **X-trestle tension design.** The two steel poles thread through the canvas long-edge sleeves AND the top holes of the two recycled-HDPE X-legs. Tensioning the assembly pulls the poles deep into the leg holes; the canvas is *structural* and braces the frame (it won't stand without it). No tools, ~5 mins. (NOT clip-on legs — that was an earlier description.)
- **Specs:** 26kg, 200kg capacity, 188×92×25cm, assembles in ~5 mins, no tools, 10+ year design lifespan, 5-year warranty
- **Plastic:** 20kg of HDPE diverted per bed
- **Manufacturing:** On-country plant — collect plastic, shred, melt, press into bed components. This plant can move to community ownership.
- **Canonical data:** `v2/src/lib/data/products.ts` is the single source of truth for all product specs
- **Supabase slug:** `stretch-bed` (canonical). Shop page URL is still `/shop/stretch-bed-single`.
- **Ecommerce:** Buy now with Stripe. This is the ONLY product for direct sale.

### 2. Washing Machines (PROTOTYPE — register interest)
- **What it is:** Pakkimjalki Kari — named in Warumungu language by Elder Dianne Stokes
- **Base:** Commercial-grade Speed Queen
- **Status:** Prototype stage, deployed in several communities, collecting feedback
- **Goal:** Reduce price point while maintaining reliability for remote conditions
- **Context:** One Alice Springs provider sells $3M/yr of washing machines into remote communities — most end up in dumps within months
- **Ecommerce:** Register Interest form only. Not for direct sale yet.

### 3. Basket Bed (ARCHIVED — open source)
- **What it is:** The first prototype bed — collapsible baskets with zip ties and toppers
- **Variants:** Single, double, stackable
- **Status:** Discontinuing sales. Open-sourcing the design documentation.
- **Ecommerce:** Download Plans link. Not for sale.

### 4. Weave Bed (DISCONTINUED — remove all references)
- **What it was:** A test design that was never produced at scale
- **Action:** Remove any remaining references when found. The Supabase `product_type: weave_bed` and slugs like `weave-bed-*` are WRONG — these should be `stretch_bed` and `stretch-bed-*`.

## Key Patterns

### Component Organisation
```
src/components/
  ui/          -> shadcn/ui primitives (Button, Card, Dialog, etc.)
  marketing/   -> Hero, ImpactStats, ProductCard
  layout/      -> SiteHeader, SiteFooter
  shop/        -> ProductDetail, AddToCart
  empathy-ledger/ -> FeaturedStories, CommunityGallery
```

### Data Layer
- `src/lib/data/content.ts` — Brand copy, product categories, community partnerships (static)
- `src/lib/data/media.ts` — Image/video URLs with Empathy Ledger fallback
- `src/lib/supabase/` — Server and client Supabase helpers
- `src/lib/types/database.ts` — TypeScript types for Supabase tables

### Video System
Background videos in `v2/public/video/` with desktop (1080p), mobile (720p), and poster variants:
- `hero-desktop.mp4` / `hero-mobile.mp4` / `hero-poster.jpg`
- `stretch-bed-desktop.mp4` / `stretch-bed-mobile.mp4` / `stretch-bed-poster.jpg`
- `community-desktop.mp4` / `community-mobile.mp4` / `community-poster.jpg`

The Hero component accepts a `videoSrc` prop:
```tsx
<Hero videoSrc={{ desktop: '/video/hero-desktop.mp4', mobile: '/video/hero-mobile.mp4', poster: '/video/hero-poster.jpg' }} />
```

FFmpeg tools in `tools/`:
- `analyze-video.sh` — Generate thumbnail previews from raw footage
- `extract-segments.sh` — Extract timestamp ranges into web-ready video
- `make-background-video.sh` — Concatenate clips with crossfades

### Empathy Ledger
- API at `https://empathy-ledger-v2.vercel.app`
- Project code: `goods-on-country`
- Has 240 storytellers but 0 published stories — FeaturedStories component falls back to local `journeyStories` from content.ts
- When EL stories get published, they automatically take over from local fallbacks

## Commands
```bash
cd v2 && npm run dev      # Start dev server (localhost:3000 or next available)
cd v2 && npm run build    # Production build
cd v2 && npm run lint     # ESLint
```

## Brand Voice
- Warm, grounded, community-first
- Lead with impact, not charity
- Use real community language ("deadly" = excellent)
- Always centre Indigenous voices and agency

## Database Operations
- **DDL (CREATE, ALTER, DROP):** Use `psql` directly — the Supabase `exec_sql` RPC does not support DDL.
- **Always check actual schema** before writing queries — do not assume column names or primary keys from memory. Read `v2/src/lib/types/database.ts` or query `information_schema.columns`.
- **When batch operations hit rate limits or API errors**, switch providers/approaches quickly rather than retrying the same failing method.
- **For v2 database work**, use `curl` with the service role key from `.env.local` or `psql` — NOT the Supabase MCP.

## TypeScript Conventions
- Always ensure clean `npm run build` before considering work complete.
- Fix Recharts and other library type errors immediately — don't leave them.
- Use existing patterns in the codebase for imports, API routes, and component structure.
- When editing files, read them first to understand existing patterns.

## Mistakes to Avoid
- Do NOT modify files in `deploy/` — that's the old static site
- Do NOT use `weave-bed` slugs or `weave_bed` product types — the Weave Bed is discontinued. The canonical Stretch Bed slug is `stretch-bed`.
- Do NOT hardcode product specs — import from `v2/src/lib/data/products.ts` (the single source of truth)
- Do NOT describe Stretch Bed as "woven cord" or "hardwood frame" — it's recycled HDPE plastic + galvanised steel poles + canvas
- Do NOT describe the legs as "clip-on" or "click onto the poles" — the legs are two crossed-plank **X-trestles** and the bed is an **X-trestle tension design** (poles thread through the leg holes; the canvas is structural). See Products §1.
- Do NOT hardcode Supabase URLs — use env vars via `createClient()`
- Do NOT add `use client` to pages unless necessary — prefer Server Components
- Do NOT put washing machines or basket beds as "for sale" — only the Stretch Bed is purchasable
- Large videos go in `public/video/`, not Supabase Storage (too big for API)
- Do NOT use Supabase MCP for v2 data — it can reach all 9 org projects and needs an explicit project_id; target Goods `cwsyhpiuepvdjtxaozwf` only (see "CRITICAL" section above + `wiki/canon/SOURCES.md`)
- When user says "open" or "show me", they want to see the running app — open browser URLs or launch dev servers, don't continue code walkthroughs

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

## Where to work

**Always work in `v2/`** (Next.js App Router). `deploy/` is the old static site — never modify it.
`wiki/` is an LLM knowledge base on the Karpathy pattern; its rules live in `wiki/AGENTS.md`.
For ACT ecosystem knowledge, cross-reference the Tractorpedia at
`/Users/benknight/Code/act-global-infrastructure/wiki/` (124 articles) rather than duplicating it.

Supabase project for v2 is `cwsyhpiuepvdjtxaozwf` (see CRITICAL above). Fonts are the one
stack fact worth stating because it is NOT what the code implies: CLAUDE.md and
`design/brand/tokens.css` both say Georgia is the display face, but the app actually loads
Playfair Display, and `--goods-font-logo` names Archivo, which is never loaded at all.

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

### Data Layer
- `src/lib/data/content.ts` — Brand copy, product categories, community partnerships (static)
- `src/lib/data/media.ts` — Image/video URLs with Empathy Ledger fallback
- `src/lib/supabase/` — Server and client Supabase helpers
- `src/lib/types/database.ts` — TypeScript types for Supabase tables

### Video System
Background video conventions, the Hero `videoSrc` contract and the FFmpeg tools now live in
the `video-pipeline` skill — it loads on demand instead of every session.

### Empathy Ledger
- API at `https://empathy-ledger-v2.vercel.app`
- Project code: `goods-on-country`
- Has 240 storytellers but 0 published stories — FeaturedStories component falls back to local `journeyStories` from content.ts
- When EL stories get published, they automatically take over from local fallbacks

## Brand Voice
- Warm, grounded, community-first
- Lead with impact, not charity
- Use real community language ("deadly" = excellent)
- Always centre Indigenous voices and agency
- NEVER "co-design" / "co-designed" — the products are **designed in community / designed with community** (Ben, 2026-07-11). Co-design implies a facilitated joint process; the truth is the design happens in community, led by community. (Data keys like `theme: 'co-design'` in content.ts are pending a separate migration — don't add new ones.)
- Ownership is a **pathway** — "moving closer to community ownership", never claimed complete
- scabies→RHD is the **why**, never a claimed health outcome

## Database Operations
- **DDL (CREATE, ALTER, DROP):** Use `psql` directly — the Supabase `exec_sql` RPC does not support DDL.
- **Always check actual schema** before writing queries — do not assume column names or primary keys from memory. Read `v2/src/lib/types/database.ts` or query `information_schema.columns`.
- **When batch operations hit rate limits or API errors**, switch providers/approaches quickly rather than retrying the same failing method.
- **For v2 database work**, use `curl` with the service role key from `.env.local` or `psql` — NOT the Supabase MCP.

## TypeScript Conventions
- Always ensure clean `npm run build` before considering work complete.
- Fix Recharts and other library type errors immediately — don't leave them.

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

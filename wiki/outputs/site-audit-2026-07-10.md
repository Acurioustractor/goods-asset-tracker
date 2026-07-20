# Site audit — all pages, 10 July 2026

Full review of v2 (~150 pages: public, admin, portal/pitch/sites/wiki). Three severity levels: P0 = wrong or unsafe, P1 = best-practice violation, P2 = polish.

## Fixed today

| Fix | Where |
|---|---|
| Wiki assembly instructions rewritten to X-trestle tension canon (was "slot-together T section / click together / four legs") | `wiki/products/stretch-bed` |
| Proxy matcher hole closed: `/admin/*` now always matched, incl. crafted `.png`-suffixed URLs that previously bypassed auth redirect | `src/proxy.ts` |
| `robots: noindex` on all `/pitch/**` (funding asks + consent working views were indexable) | `src/app/pitch/layout.tsx` (new) |
| `robots: noindex` + metadata on `/checkout` + `/checkout/success` | `src/app/checkout/layout.tsx` (new) |
| Community pages rebuilt: hero images, photo galleries, consent-gated storytellers + quotes, film on index, funding section (both directions) | `/communities`, `/communities/[slug]` |

## Needs your decision (behavior changes — didn't touch)

1. **Four public /pitch pages expose consent working data** — `photo-review`, `community-narrative`, `investor-lab`, `miro-board` render uncleared/blocked storyteller names, photos, and the reasons voices are on hold. Now noindexed, but still reachable by URL. Recommend gating behind the INSIDERS password in `proxy.ts`. One-line-ish change; blocks anyone holding the links.
2. **`/pitch` + `/pitch/document` are public** with total ask, funding-line amounts, founder email. Same fix: gate them.
3. **Funder passwords hardcoded in `funder-pages.ts`** (`minderoo2026` etc.) with deal terms ($840K/$500K/$300K/$1.5M) in the same file. Move to env vars; the file ships in the client bundle risk-zone.
4. **Insiders fallback password `goods2026`** in `api/insiders/auth/route.ts` when env unset. Should fail closed — but confirm `INSIDERS_PASSWORD` is set in Vercel before removing.
5. **Supplier names public** on `wiki/products/stretch-bed` (DNA Steel, Centre Canvas, Defy Design) + full manufacturing recipe in `wiki/manufacturing/*`. Fine if the open-source posture is deliberate; together they're a complete playbook.
6. **`/portal/**` fully open** incl. `ask-goods` AI endpoint. Intentional?

## Systemic P0 — hardcoded product specs (~18 files)

Specs (26kg / 200kg / 20kg / 26.9mm / 10+ yr) are retyped page-by-page instead of imported from `products.ts` — currently accurate, guaranteed to drift. Worst: `shop/stretch-bed-single` imports `STRETCH_BED` yet still hardcodes the numbers in prose; `press` marks a hardcoded stat `verified:true`. Recommend one sweep replacing literals with `STRETCH_BED.specs.*` / `PLASTIC_KG_PER_BED`. Files: home, story, the-work, process, basket-bed-plans, canberra, about, get-involved, cost-story, press, shop/*, stretch-bed, sponsor, partners/centrecorp, bed/[id] parts-diagram, pitch/*, wiki/products/stretch-bed.

## P1 backlog (ranked)

1. `/dashboard` runs 5 financial server-actions before the auth gate; `ProtectedRoute` uses the service-role client for `auth.getUser()`.
2. `kit/page.tsx` hardcodes a foreign-project Supabase URL (`yvnuayzslukamizrlhwb` — not Goods). Re-host the Mykel video and confirm consent provenance.
3. Zero `error.tsx` / `loading.tsx` across all 65 admin pages — one boundary at `admin/` root protects everything.
4. Admin `dashboard-images` + `roadmap` feed externally-linkable partner dashboards on human judgment only — enforce cleared/public in the query.
5. `/sites/*` gating is a hand-maintained allowlist — new sibling routes default open.
6. `sponsor/page.tsx` (conversion page) has no metadata — add a `layout.tsx` like contact's.
7. Raw `<img>` → `next/image` in `cost-story`, `funders/[slug]`.
8. `fleet/page.tsx` serial fetch waterfall → `Promise.all`; `announcements` needless `'use client'`.

## P2 / housekeeping

Duplicate-`<h1>` on checkout, contact, partner, stories/[id]; `design/page.tsx` dead link to `/design/woven-stories`; retired photo-tool folders (photos, photos-browser, photo-review incl. residual `05-weave.jpg`, photo-align) can be archived; `stories` admin page overlaps el-stories/community-stories; placeholder `tel:+61400000000` on portal; admin orphans (roadmap, dashboard-images) out of nav.

## What's healthy

Metadata baseline (root layout: OG, JSON-LD, title template), consent gating everywhere it matters (default-deny, no bypass found), server-component discipline, dynamic-route `generateMetadata`, admin service-role kept server-side.

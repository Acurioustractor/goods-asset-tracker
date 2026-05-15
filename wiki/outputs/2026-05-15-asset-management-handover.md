# Asset Management + Site Sweep — Handover (2026-05-15)

Resume entry for the asset-register / fleet / brand workstreams. Picks up
after the GB0-156 sticker design pass, the full site audit, and the P0 + P1
sweep that followed.

---

## TL;DR — Where we are

**Done this session**
- 107 GB0-156 Stretch Beds staged in Supabase, ePrint-ready vinyl sticker
  pack (60×60mm cream-branded kiss-cut) generated and order-aligned
- Per-bed install logger live on `/bed/{id}` for field workers to log
  community/place/GPS on scan (admin-auth gated)
- `/canberra` landing page shipped for the Reconciliation Week installation
  at Canberra Airport, design brief drafted for CAG's design team
- Full 13-lens site audit run, P0 + P1 fixes shipped (titles, em dashes,
  footer, /privacy + /terms, story/mission/about consolidation, CTA palette,
  stories refactor, brand voice on shop page)
- Washing-machine count corrected sitewide to **14 confirmed on Country**
- Three commits pushed to `codex/goods-qbe-signoff`

**Three commits pushed**
- `ed991f3` discrete "Read all community voices" → /stories link (single doorway)
- `e16e2f8` brand-voice + visual polish round two (em dashes, "First Nations",
  stories refactor, washing-machine count, /about images, banner suppression)
- `3cc89db` asset register UI + site rewrite + Canberra Airport page

**Branch:** `codex/goods-qbe-signoff` (not yet merged to `main`).
Production hasn't taken these changes yet. Preview deploys are live.

**Open / next**
1. **Place the ePrint order** for the 107 vinyl stickers
   (`data/new_beds/batch_156/Goods_Batch156_ePrint_VariableData.pdf`,
   60×60mm, quantity 107, variations 107)
2. **Trip departure** — week of 2026-05-19 for Alice + Utopia
3. **Talk to Nic** about the 3 orphan washing-machine coreids — questions
   in `wiki/outputs/2026-05-14-washing-machine-talk-to-nic.md`
4. **Real ABN + ACNC** numbers to drop into footer
5. **Merge to main** when ready to push everything to production

---

## ePrint order — exact alignment

Upload: `data/new_beds/batch_156/Goods_Batch156_ePrint_VariableData.pdf`
(60×60mm cream-branded variant)

| ePrint field | Value |
|---|---|
| Product | QR Code Table Stickers (Vinyl) |
| Width | **60** mm |
| Height | **60** mm |
| Quantity | **107** |
| Variations | **107** (each sticker unique — critical) |
| Vinyl Stock | Polymeric Vinyl - Standard |
| Print Process | 8 COLOUR UV INKS |
| Laminating | No |
| Shape | Rectangle |
| Cut & Supply | Kiss-Cut Individually (Easy Peel) |
| Weeding | No |
| Make file Print Ready | No - File is correct size |

CSV dataset (if their VDP flow needs it):
`data/new_beds/batch_156/Goods_Batch156_ePrint_dataset.csv`

To regenerate at a different size or style:
```bash
python3 scripts/generate_batch_eprint_variable.py --style cream --size 60
python3 scripts/generate_batch_eprint_variable.py --style charcoal --size 60
python3 scripts/generate_batch_eprint_variable.py --style pink --size 60
```

---

## Asset register — state of play

### Counts (post 2026-05-14 + 2026-05-15)
- **41 active rows** in the admin register (`/admin/assets`)
- **23 storytellers across 8 communities** on `/stories` (live counts)
- **520+ beds** across Australia (Stretch + Basket combined)
- **14 washing machines confirmed on Country** (locked-in roll-call number,
  source: `wiki/outputs/2026-05-14-washing-machine-roll-call.md`)
- Telemetry-live: 4 (Norman, Nicole, Dianne/Red Dust, Barkley Arts)
- 3 orphan coreids tagged `under_investigation` pending physical reconciliation

### Where things live
- **Admin UI:** `/admin/assets` (filter, search, telemetry dot, click ID → edit)
- **Edit form:** `/admin/assets/{unique_id}` (community, place, status, partner,
  gps, append-only notes)
- **PATCH API:** `/api/admin/assets/{unique_id}` (whitelist: name, community,
  place, status, notes, partner_name, gps, plus `appendNote` audit trail)
- **Field install flow:** `/bed/{unique_id}` — admin-only "Log this bed's
  location" card with community dropdown + GPS button + status selector
- **Telemetry mapping:** `v2/src/app/admin/assets/page.tsx` const `TELEMETRY_TO_ASSET`
- **Bed/machine landing:** `/bed/{id}` — product-aware (Stretch Bed OR Pakkimjalki Kari)

---

## Site state of play (post-audit sweep)

| Page | State |
|---|---|
| `/` | Hero CTA on brand palette, single primary CTA at the bottom (was two), hero image off Webflow CDN |
| `/about` | 1-2 screen elevator pitch, Xavier + heat-press + Dianne + Nic-and-Ben images, 14 washing machines on Country stat |
| `/story` | Canonical long-form (unchanged narrative), discrete "Read all community voices →" link at the foot of the voices section |
| `/stories` | Refactored 590 KB → 375 KB; 23 storytellers, all cards have Goods-related quotes with zero em dashes; "X recordings" labels removed; internal team accounts filtered; story cards use storyteller portrait fallback when EL story lacks featured image; video badge surfaced |
| `/mission` | Server redirect → `/story` |
| `/canberra` | Live, brand-aligned, captures email/SMS tagged `canberra-airport-2026` |
| `/shop`, `/shop/stretch-bed-single` | "Indigenous" → "First Nations" in Goods voice, em dashes scrubbed, "Buy Now &mdash;" → "Buy Now ·" |
| `/privacy`, `/terms` | Built fresh, brand-aligned, no longer 404 |
| `/contact` | Metadata added via layout.tsx |
| ImpactBanner | Suppressed on /canberra, /shop/stretch-bed-single, /bed/{id} where it competed with page-specific stats |
| Site header | Drops "My Goods", adds "Contact", subtitles "Pakkimjalki Kari (Washing Machine)" |
| Site footer | Drops Dashboard + Shift Log + farm-content newsletter copy + "Every purchase makes a difference" |
| Brand voice | Em dashes globally swept (zero in rendered HTML, with the deliberate exception of community speakers' verbatim quotes which were never written in our hand) |

### Brand palette (canonical, from `v2/src/lib/data/content.ts:1138`)
- Cream `#FDF8F3`
- Sage `#8B9D77`
- Rust `#C45C3E`
- Charcoal `#2E2E2E`
Display font: Georgia (or Times-Bold serif equivalent). No em dashes. On-Country
capitalised. No "Indigenous" in Goods voice — use "First Nations".

---

## How /stories is reachable

Nothing in nav, header, or footer points to it. Single doorway:
1. `/story` → scroll to Community Voices section
2. End of the four full-bleed voices panels
3. Small uppercase tracked-caps "Read all community voices →"
4. Lands on `/stories`

Intentional: keeps the route deep-linkable for sharing while we keep
iterating, without pressuring main nav.

---

## Generating future batches

`scripts/generate_batch_156.py` is the canonical template. Copy it,
edit the BATCH/COUNT/COMMUNITY constants, run:

```bash
cp scripts/generate_batch_156.py scripts/generate_batch_NEW.py
python3 scripts/generate_batch_NEW.py
python3 scripts/generate_batch_eprint_variable.py --batch NEW --count <n> --size 60
```

Outputs land in `data/new_beds/batch_NEW/`.

---

## Outstanding before next session

1. Drop ABN + ACNC number into `site-footer.tsx` legal block when available
2. Wayne Glenn quote on /stories now leads with the Stretch Bed framing,
   not the RHD-and-Indigenous framing. Confirm that matches editorial intent
3. `/community` route is auth-gated (307s) but listed in footer — decide
   whether to make it public or remove from footer
4. Final 23 em dashes preserved on the site live inside community-member
   quotes (Dianne's "Working both ways" in 5 places, Wayne Glenn's RHD
   quote which the user paste flagged). If brand rule truly applies to
   speakers too, sweep those next round
5. /stories page size: 375 KB still rich. Could be further reduced by
   server-rendering only summary cards + per-storyteller detail pages.
   Saved for future round; not on the trip-prep critical path

---

## Source-of-truth docs

- `wiki/outputs/2026-05-15-goods-site-audit.md` — the 13-lens audit
- `wiki/outputs/2026-05-15-canberra-airport-design-brief.md` — CAG brief
- `wiki/outputs/2026-05-14-asset-register-trip-readiness.md` — pre-trip audit
- `wiki/outputs/2026-05-14-washing-machine-roll-call.md` — locked-in WM list
- `wiki/outputs/2026-05-14-washing-machine-talk-to-nic.md` — open questions
- `wiki/outputs/2026-05-14-washing-machine-master-listing.md` — regenerable

---

## Resume commands

```bash
# Confirm dev server, hit the key routes
cd v2 && npm run dev
# then open http://localhost:3000/admin/assets
# and http://localhost:3000/canberra
# and http://localhost:3000/about

# Regenerate the washing-machine master listing
python3 scripts/build_wm_master_listing.py

# Regenerate stickers
python3 scripts/generate_batch_eprint_variable.py --style cream --size 60

# Smoke test public routes after pulling latest
for path in / /about /story /stories /mission /canberra /shop /shop/stretch-bed-single /privacy /terms /contact; do
  curl -sS -o /dev/null -w "%{http_code} %{size_download}  $path\n" "http://localhost:3000$path"
done
```

---

## When ready to merge

The work lives on `codex/goods-qbe-signoff`. Three commits ahead of `main`.
Merging or opening a PR will push everything to production. Until then,
preview deploys reflect the latest push.

---

## Update — 2026-05-15 evening (admin operations refactor + merge)

After this asset-management handover was written, the same day saw a major
admin-side refactor and the full branch was merged to main as PR #19
(squash commit `8fd72cc`).

**What shipped on top of the asset-register UI:**
- Communities table + demand table + community_rollup view in Supabase
- `assets.community_id` FK (561/561 backfilled, drift eliminated)
- `/admin/communities` rebuilt DB-backed + per-community drill-in with editable demand
- `/admin/assets/batch/[batch]` bulk-allocate page (107 beds to a community in one click)
- `/admin/production` cost-per-batch card with Xero ACCPAY actuals
- Fleet to communities cross-link (machine cells link to community pages, community pages list machines with last-seen + alerts)
- Sidebar refactored to 16 items in 3 groups; 27 static deck pages moved to `_archive/2026-05-15-admin-decks/`
- Mobile polish on field-team-critical pages

**Env vars added on Vercel** (Production + Preview + Development):
- `ACT_INFRA_SUPABASE_URL`, `ACT_INFRA_SUPABASE_KEY`
- (Preview was also missing `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` / `SERVICE_ROLE_KEY`; now added)

**Live on production**: https://goodsoncountry.com — verified end-to-end.

**Canonical session ledger going forward**: `thoughts/shared/handoffs/network-consolidation/current.md`.
The prior 2026-03-27 ledger lives at `thoughts/shared/handoffs/network-consolidation/2026-03-27.md`.


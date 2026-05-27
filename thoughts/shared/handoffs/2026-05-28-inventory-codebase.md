# Goods on Country — Codebase Artifact Inventory (v2 app + data + scripts)

Compiled 2026-05-28 for the master artifact register. Covers `v2/src/app/` routes (public + admin + API), `v2/src/lib/data/`, and `scripts/` (root) + `v2/scripts/`.
Method: route-tree glob + header reads only (no whole-file reads). Purposes for big route families inferred from path names where noted.

Legend — workstream themes: Website/v2 · Asset-register/Field-ops · CRM/GHL · Cost/Unit-economics · Impact/MEL · Fleet · Media · Brand · Production · Funder/Partner.
Status: Live/Shipped · Partial · Stale/legacy.

---

## 1. Public pages (`v2/src/app/`)

| Path | Theme | What it does | Status |
|---|---|---|---|
| `/` | Website/v2 | Homepage — hero video, impact stats, product entry | Live |
| `/about` | Website/v2 | Elevator-pitch about page (rewritten to images + pitch) | Live |
| `/shop` | Website/v2 | Shop index | Live |
| `/shop/[slug]` | Website/v2 | Dynamic product detail | Live |
| `/shop/stretch-bed-single` | Website/v2 | Stretch Bed PDP — Stripe buy-now (only purchasable product) | Live |
| `/shop/washing-machine` | Website/v2 | Washing machine — Register Interest (prototype, not for sale) | Live |
| `/stretch-bed` | Website/v2 | Stretch Bed marketing landing | Live |
| `/basket-bed-plans` | Website/v2 | Basket Bed open-source plans download (archived product) | Live |
| `/checkout` | Website/v2 | Stripe checkout flow | Live |
| `/checkout/success` | Website/v2 | Post-purchase confirmation | Live |
| `/sponsor` | Website/v2 | Sponsor-a-bed (DB-driven $750 price) | Live |
| `/get-involved` | Website/v2 | Conversion microsite (Utopia audience funnel) | Live |
| `/the-work` | Website/v2 | Nurture microsite (Utopia audience funnel) | Live |
| `/kit` | Funder/Partner | Partner asset hub (Utopia funnel) | Live |
| `/partner` | CRM/GHL | Two-stage partner inquiry form → GHL | Live |
| `/contact` | CRM/GHL | Contact form → GHL inquiry | Live |
| `/support` | Website/v2 | Support / help page | Live |
| `/canberra` | Website/v2 | Canberra-specific campaign landing | Live |
| `/process` | Website/v2 | How-it's-made / process page | Live |
| `/mission` | Website/v2 | Mission page (note: memory says /mission redirects to /story) | Partial |
| `/story` | Website/v2 | Founding-story narrative page | Live |
| `/communities` | Impact/MEL | Communities index | Live |
| `/communities/[slug]` | Impact/MEL | Per-community drill-in (deployments, stories) | Live |
| `/stories` | Media | Public stories index (refactored 590→375KB) | Live |
| `/stories/[id]` | Media | Single story detail | Live |
| `/storytellers` | Media | Storyteller index (Empathy Ledger) | Live |
| `/storytellers/[slug]` | Media | Single storyteller profile | Live |
| `/field-notes` | Media | Field-notes index (scrollytelling trips) | Live |
| `/field-notes/[slug]` | Media | Full-bleed field-note (e.g. utopia-may-2026), EL media | Live |
| `/gallery` | Media | Photo/media gallery | Live |
| `/media` | Media | Media/press landing | Live |
| `/press` | Brand | Press kit page (`_components/` supporting) | Live |
| `/impact` | Impact/MEL | Public impact dashboard (live Supabase+EL data, tagged metrics) | Live |
| `/impact/login` | Impact/MEL | Password gate for impact detail | Live |
| `/insights` | Impact/MEL | Insights/analysis page | Live |
| `/pitch` | Funder/Partner | Investor/funder pitch page | Live |
| `/pitch/document` | Funder/Partner | Pitch as document view | Live |
| `/funders/[slug]` | Funder/Partner | Password-gated funder landing/brief | Live |
| `/funders/[slug]/communities` | Funder/Partner | Funder-scoped community breakdown | Live |
| `/funders/[slug]/login` | Funder/Partner | Funder page auth gate | Live |
| `/partners/[slug]/outcomes` | Funder/Partner | Templated partner outcomes report (reads partners.ts) | Live |
| `/partners/centrecorp` | Funder/Partner | Centrecorp partner page | Live |
| `/partners/oonchiumpa` | Funder/Partner | Oonchiumpa partner page | Live |
| `/insiders`, `/insiders/[...slug]`, `/insiders/login` | Funder/Partner | Gated insiders content hub + auth | Live |
| `/wiki` + 13 subpages | Website/v2 | Public knowledge base: community (partner-guide, tracking-model), guides (operations, recipient-handover, story-templates), manufacturing (facility-manual, machine-specs, plastic-processing, safety-briefing, throughput), products (stretch-bed, washing-machine), support/faq | Live |
| `/portal` + ask-goods, goals, our-story, projects | Community | Community/recipient portal area | Live |
| `/community`, `/community/ideas`, `/community/ideas/new` | Community | Community idea submission + voting | Live |
| `/bed/[id]` | Asset-register/Field-ops | Public per-bed page; admin-only "Log this bed's location" install card | Live |
| `/claim/[asset_id]` | Asset-register/Field-ops | Claim/register a bed by asset ID | Live |
| `/my-items` | Asset-register/Field-ops | Logged-in user's items | Live |
| `/dashboard`, `/dashboard/feedback` | Website/v2 | User dashboard + feedback capture | Live |
| `/login`, `/auth/phone-login`, `/auth/verify-otp` | Website/v2 | Auth (incl. phone OTP) | Live |
| `/unauthorized` | Website/v2 | Access-denied page | Live |
| `/privacy`, `/terms` | Website/v2 | Legal pages | Live |
| `/design`, `/design/community-voices`, `/design/country-first`, `/design/mission-forward` | Brand | Design/brand-direction concept variants | Partial (concept) |
| `/test-gallery` | Media | Dev/test gallery scratch page | Stale/legacy |

## 2. Admin pages (`v2/src/app/admin/`)

| Path | Theme | What it does | Status |
|---|---|---|---|
| `/admin` | Website/v2 | Admin home/dashboard | Live |
| `/admin/login` | Website/v2 | Admin auth | Live |
| `/admin/unauthorized` | Website/v2 | Admin access-denied | Live |
| `/admin/assets` | Asset-register/Field-ops | Filterable asset register (beds + washers) | Live |
| `/admin/assets/[unique_id]` | Asset-register/Field-ops | Single-asset detail/edit | Live |
| `/admin/assets/batch/[batch]` | Asset-register/Field-ops | Per-batch view (manifest/print/allocate) | Live |
| `/admin/scans` | Asset-register/Field-ops | QR scan log | Live |
| `/admin/install-bulk` | Asset-register/Field-ops | Bulk install/deploy beds | Live |
| `/admin/install-checklist` | Asset-register/Field-ops | Field install checklist | Live |
| `/admin/alice-fill` | Asset-register/Field-ops | Alice Springs batch fill tooling | Live |
| `/admin/bed-preflight` | Asset-register/Field-ops | Bed preflight QA before dispatch | Live |
| `/admin/bed-signals` | Fleet/Asset | Bed signal/telemetry view | Live |
| `/admin/communities`, `/[id]` | Impact/MEL | Community admin + drill-in | Live |
| `/admin/products` | Website/v2 | Product admin | Live |
| `/admin/orders`, `/[id]`, `/launch-checklist` | Website/v2 | Order management + launch checklist | Live |
| `/admin/production` | Production | Production overview admin | Live |
| `/admin/fleet`, `/[machine_id]` | Fleet | Washing-machine fleet dashboard + per-device | Live |
| `/admin/el-stories`, `/[id]/edit`, `/new` | Media | Empathy Ledger story CRUD | Live |
| `/admin/el-storytellers`, `/new` | Media | EL storyteller management | Live |
| `/admin/stories` | Media | Story admin | Live |
| `/admin/field-notes`, `/[slug]`, `/library` | Media | Field-note editor + media library | Live |
| `/admin/photos`, `/admin/photos-browser` | Media | Photo management/browser | Live |
| `/admin/library` | Funder/Partner | Asset/content library (references funder URL map) | Live |
| `/admin/funders`, `/[slug]/video-brief`, `/new` | Funder/Partner | Funder admin + video brief generator | Live |
| `/admin/reports` | Funder/Partner | Funder/impact report generation | Live |
| `/admin/deals` | CRM/GHL | Deals/pipeline view | Live |
| `/admin/reach-out` | CRM/GHL | Outreach composer (dispatch/preview APIs) | Live |
| `/admin/messages` | CRM/GHL | Inbound/outbound message admin | Live |
| `/admin/requests` | CRM/GHL | Inbound requests admin | Live |
| `/admin/announcements` | CRM/GHL | Announcements management | Live |
| `/admin/team` | Brand | Team management | Live |
| `/admin/brand` | Brand | Brand admin/voice tooling | Live |
| `/admin/deck` | Brand | Pitch deck admin | Live |
| `/admin/compassion` | Impact/MEL | Compassion/donor program admin | Live |
| `/admin/xero-reconciliation` | Cost/Unit-economics | Xero reconciliation view | Live |
| `/admin/trip-receipts` | Cost/Unit-economics | Trip receipt capture/expense | Live |

## 3. API routes (`v2/src/app/api/`) — grouped

- **Commerce/Stripe:** `/checkout` (create session), `/webhooks/stripe` (fulfilment + GHL tag), `/products`. — Live
- **Asset/Field-ops:** `/bed/[id]/name|signal|story`, `/claim/[asset_id]`, `/admin/assets/[unique_id]` (+`/install-photo`), `/admin/assets/batch/[batch]/[kind]` (manifest/print stream), `/batch/[batch]/allocate`. — Live
- **Fleet:** `/webhooks/particle` (Particle/Zapier), `/webhooks/openfields` (HMAC), `/cron/fleet-rollup` (6h), `/admin/fleet/import-csv|map-device|particle-status|resolve-alert`. — Live (only F25 reporting per memory)
- **Empathy Ledger / media:** `/cron/el-sync` (daily), `/admin/el-story-block-insert/[id]`, `/admin/el-story-media-swap/[id]`, `/admin/field-note-override(/list)`. — Live
- **CRM/GHL + campaign:** `/contact`, `/partnership`, `/newsletter`, `/feedback`, `/support`, `/chat`; `/cron/campaign/{engagement-scoring,ghl-activity-sync,ghl-sync,pipeline-followup}`, `/cron/sms-dispatch`, `/cron/weekly-digest`, `/cron/pulse-watch`; `/admin/campaign/send-email`, `/admin/messages`, `/admin/pipeline`, `/admin/requests`, `/admin/gmail-sync`, `/admin/linkedin-import`, `/admin/parliament-followup`, `/admin/kv-state`. — Live (some campaign crons Partial)
- **Outreach targets / grants:** `/admin/targets/{backfill-identities,intake-status,push-outreach,resolve-identity,review-identity}`, `/admin/reach-out/{dispatch,preview}`, `/admin/grants/compose`, `/grantscope/targets`. — Live
- **Funder/Impact gating:** `/funders/[slug]/auth`, `/impact` + `/impact/auth`, `/insiders/auth`. — Live
- **Production:** `/production/inventory|journal|shifts`. — Live
- **Auth/User:** `/auth/{phone-login,verify-otp,signout}`, `/user/{compassion,items,messages,requests}`. — Live
- **Community:** `/community/ideas`, `/community/ideas/[id]/vote`, `/admin/compassion`. — Live

## 4. Data files (`v2/src/lib/data/`)

| File | Theme | What it holds |
|---|---|---|
| `products.ts` | Website/v2 | Canonical product specs — single source of truth, NO prices |
| `content.ts` | Website/v2 | Brand copy, messaging, community partnerships (static) |
| `compendium.ts` | Impact/MEL | Master structured data: funding, partners, voices, deployments |
| `impact-model.ts` | Impact/MEL | 5-dimension impact measurement framework |
| `impact-fetcher.ts` | Impact/MEL | Server fns pulling live Supabase + EL data for /impact + API |
| `supplier-quotes.ts` | Cost/Unit-economics | Supplier quotes/pricing (Xero + email quotes + compendium) |
| `supplier-cost-actuals.ts` | Cost/Unit-economics | Actual supplier spend from Xero (ACT-infra Supabase mirror) → real cost/bed |
| `funder-pages.ts` | Funder/Partner | Password-gated funder landing-page configs |
| `funder-shared-content.ts` | Funder/Partner | Shared content across all funder pages (edit once) |
| `grant-content.ts` | Funder/Partner | Grant content library (reusable application copy) |
| `outreach-targets.ts` | CRM/GHL | Outreach target registry |
| `expansion-targets.ts` | Impact/MEL | Priority NT/QLD expansion communities (Mar 2026 sweep) |
| `partners.ts` | Funder/Partner | Partner registry feeding /partners/[slug]/outcomes |
| `supporters.ts` | CRM/GHL | Supporter records |
| `team.ts` | Brand | Team member records |
| `bed-owners.ts` | Asset-register/Field-ops | Derived "who's connected to this bed" view |
| `community-stories.ts` | Media | Helpers surfacing stories on per-community pages |
| `curated-quotes.ts` | Media | Hand-picked cleaned quotes for public stories |
| `story-atoms.ts` | Media | Canonical reusable content blocks for field-notes |
| `trip-stories.ts` | Media | Data-authored scrollytelling trip system (`<TripStory>`) |
| `press-reads.ts` | Brand | Curated long-form reads for journalists/funders |
| `media.ts` | Media | Supabase Storage video/image URLs (EL fallback) |

Note: `funder-url-map.ts` (per memory) is NOT in `data/`. Funder config now lives in `v2/src/lib/funders/` (`configs/`, `generate.ts`, `metrics.ts`, `registry.ts`, `types.ts`). `/admin/library` still references a funder URL map. — memory entry is **Stale**.

## 5. Lib integrations (`v2/src/lib/`)

- **Stripe** — `stripe/{client,index}.ts`. Live (only Stretch Bed; dynamic price_data, $750).
- **GHL** — `ghl/{index,smart-lists}.ts`. Live — identify-and-tag only; ONE Smart Router workflow branches on `goods-*` tag.
- **Supabase** — `supabase/{client,server,storage}.ts`. Live — v2 project `cwsyhpiuepvdjtxaozwf`.
- **Empathy Ledger** — `empathy-ledger/{client,index,press-pack,types}.ts`. Live — Goods project `6bd47c8a...`, daily sync.
- **Others:** `auth/`, `campaign/`, `cart/`, `email/`, `field-notes/`, `funders/`, `grantscope/`, `knowledge-base/`, `openai/`, `process/`, `scans/`, `stories/`, `telegram/`, `wiki/`, `types/`, `storytellers.ts`, `utils.ts`.

## 6. Scripts

### Root `scripts/` (Python — asset/QR/sticker tooling, Asset-register/Field-ops)
| Script | What it does | Status |
|---|---|---|
| `generate_batch_156.py` | Template batch generator: idempotent upsert + PNG + A4 print PDF (GB0-156, 107 beds) | Live (template) |
| `add_new_assets.py` | Add assets to system + generate QR codes | Live |
| `generate_batch_eprint_variable.py` | ePrint Online variable-data sticker pack (`--style cream --size 60`) | Live |
| `generate_qr_sticker_avery.py` | QR sticker sheets on Avery A4 templates (+VINYL, `--cuts grid`) | Live |
| `generate_batch_dtf_gangsheet.py` / `generate_dtf_gangsheet.py` | Parameterised DTF gang-sheet generators | Live |
| `generate_batch_leg_stickers.py` | A4 peel-off HDPE bed-leg label sheets | Live |
| `generate_washing_machine_stickers.py` | Washer sticker generator | Live |
| `generate_new_beds_qr.py`, `generate_qr_png.py`, `generate_qrs.py`, `export_qr_packages.py` | QR PNG / package generation | Live |
| `generate_individual_unit_pngs.py` / `_white_bg.py` | Per-unit PNG label generation | Live |
| `qr_audit.py` | QR audit/validation — verify QRs map to correct assets | Live |
| `verify_deployment.py` | End-to-end deployment verification | Live |
| `build_wm_master_listing.py` | Washing Machine master listing from Supabase + telemetry | Live |
| `generate_seed_sql.py`, `expand_csv.py`, `validate_expansion.py` | Seed SQL gen, CSV expansion, expansion-target validation | Live |
| `create_logo_image.py`, `generate_logo_variations.py` | Logo asset generation (Brand) | Live |

### `v2/scripts/` (Node `.mjs` / SQL — DB, EL, GHL, trip-content)
| Script | Theme | What it does | Status |
|---|---|---|---|
| `apply-batch-156-drop.mjs`, `apply-alice-batch.mjs`, `apply-utopia-batch.mjs`, `apply-utopia-day2.mjs` | Asset-register | Apply batch asset migrations to DB | Live |
| `apply-bed-scans-migration.mjs` | Asset-register | Bed-scans table migration | Live |
| `backfill-asset-community-id.mjs`, `backfill-deal-community-id.mjs` | Asset/CRM | Backfill community_id FKs | Live |
| `batch-install-from-photos.mjs`, `bridge-delivery-photo-tags.mjs` | Asset/Media | Bulk-install beds from delivery photos / tag bridging | Live |
| `count-live-assets.mjs`, `check-db.mjs` | Asset-register | Asset count + DB sanity checks | Live |
| `seed-communities.mjs` | Impact/MEL | Seed communities table | Live |
| `sync-goods-impact-rollups.mjs`, `cron-goods-impact-sync.sh` | Impact/MEL | Live impact resync → GHL rollups (one source of truth) | Live |
| `generate-funder-report.mjs` | Funder/Partner | Generate funder report | Live |
| `tag-trip-videos-in-el.mjs` | Media | Tag trip videos across EL stories + media_assets | Live |
| `create-mykel-storyteller.mjs` | Media | Seed Mykel storyteller in EL | Live |
| `publish-utopia-blog-to-el.mjs`, `upgrade-utopia-blog-to-blocks.mjs`, `rewrite-utopia-blog-full-text.mjs`, `sync-utopia-blog-content-from-blocks.mjs`, `extend-utopia-blog-with-photos-reflection.mjs`, `patch-utopia-*.mjs` (opening/standfirst/last-week/oonchiumpa-name) | Media | Utopia field-note content authoring/patching pipeline | Live (one-off) |
| `build-utopia-map.mjs`, `build-full-trip-map.mjs`, `build-photo-picker.mjs` | Media | Trip map + photo-picker builders | Live |
| `generate-utopia-video-thumbnails.mjs` | Media | Video thumbnail generation | Live |
| `upload-real-trip-photos.mjs`, `upload-trip-photos-to-el.mjs`, `upload-alice-build-photos.mjs`, `approve-alice-build-photos.mjs`, `upload-videos.mjs` | Media | EL media uploads | Live |
| `ghl-migrate-linkedin-tags.mjs` | CRM/GHL | Migrate LinkedIn tags in GHL | Live (one-off) |
| `fix-all-products.mjs`, `fix-products-with-service-key.mjs`, `fix-products.sql` | Website/v2 | One-off product data fixes (weave→stretch) | Stale/one-off |
| `setup-admin-auth.ts`, `setup-admin.mjs` | Website/v2 | Admin auth setup | Live |
| `update-metadata.mjs` | Website/v2 | Metadata update | Live |
| `empathy-ledger-content-audit.sql`, `empathy-ledger-tag-content.sql` | Media | EL content audit + tagging SQL | Live |

---

## Most important built systems
1. **Asset register / field-ops** — `/admin/assets` + `/bed/[id]` install flow + batch generators (root Python) + QR/sticker pipeline + offline install queue.
2. **Stripe commerce** — Stretch Bed buy-now (`/checkout`, `/webhooks/stripe`) feeding GHL Smart Router tags.
3. **CRM/GHL** — universal inquiry tag→workflow, campaign crons (engagement scoring, pipeline followup, SMS), outreach-targets + reach-out composer.
4. **Empathy Ledger media system** — field-notes scrollytelling (`trip-stories.ts` + `/field-notes/[slug]`), EL story/storyteller admin, daily sync cron, two-table video resolver.
5. **Impact / funder reporting** — `/impact` live data, `impact-fetcher.ts`, `partners.ts`→`/partners/[slug]/outcomes`, gated funder pages, impact→GHL rollup sync.
6. **Fleet telemetry** — Particle + OpenFields webhooks, fleet-rollup cron, `/admin/fleet` (only F25 reporting).
7. **Cost/unit-economics** — `supplier-cost-actuals.ts` (Xero mirror), `/admin/xero-reconciliation`, `/admin/trip-receipts`.

## Discrepancies vs memory
- `funder-url-map.ts` is **not** in `v2/src/lib/data/` — funder config moved to `v2/src/lib/funders/`. Memory "Key File Locations" entry is stale.
- `/mission` exists as a route despite memory note that it redirects to `/story` — verify whether it's a redirect or a live page (not opened; flagged Partial).

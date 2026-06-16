# QBE Pack — Web Surfaces Inventory (Agent 2)

Read-only review of the Goods on Country v2 Next.js app (App Router, `v2/src/app/`).
Date: 2026-06-16. Scope: public + gated web surfaces that serve the QBE funding pack.

## How gating works (single source: `v2/src/proxy.ts`)

There is no `middleware.ts`; the matcher/gate lives in `v2/src/proxy.ts`. Gates are
shared-password cookie checks (no per-user auth) except `/admin/*` (Supabase auth):

- `/impact` + `/api/impact` -> cookie `impact_auth`, env `IMPACT_PASSWORD` (default `goods2026`). Login `/impact/login`.
- `/insiders/*` -> cookie `INSIDERS_COOKIE`, env `INSIDERS_PASSWORD`.
- `/investors`, `/investors/*`, `/sites/qbe`, `/sites/qbe/*`, `/sites/qbe-readiness`, `/sites/qbe-readiness/*`, `/sites/cost-lab`, `/sites/cost-lab/*` -> ALL behind ONE cookie `INVESTORS_COOKIE`, env `INVESTORS_PASSWORD` (memory: live pw `OnCountry-E1C4AC`). Login `/investors/login`.
- `/funders/<slug>` -> per-slug cookie `funder_<slug>`. Login `/funders/<slug>/login`.
- `/partners/<slug>/dashboard` -> per-slug cookie `partner_<slug>` (e.g. Snow pw `snow2026`). The public partner pages (`/partners/centrecorp`, `/partners/oonchiumpa`) stay OPEN.
- `/admin/*` -> Supabase admin auth (email allowlist `ADMIN_EMAILS`).

Everything else is public.

## The 12 QBE areas (source: `v2/src/lib/data/qbe-areas.json` / `.ts`)

01 Vision & Ambition · 02 Social Objective & Impact / MEL · 03 Business Model Clarity ·
04 Financial Management · 05 Strategic Planning & Risk · 06 Process & Technology ·
07 Governance, Data & Reporting · 08 People & Enterprise · 09 Legal Structure (KEYSTONE,
0 artifacts, entity/ownership decision open) · 10 Investors & Capital Raising ·
11 Cost Model v6 · 12 Investor Alignment Tool. (11+12 added in Notion, no V4 score.)

---

## Route table

| Route | Public/Gated | What it serves | QBE area(s) | Stale-canon risk |
|---|---|---|---|---|
| `/pitch` | Public | Full narrative pitch page (hook -> model -> assembly -> partners -> quotes). 702 lines. Pulls `investmentCase`, `oonchiumpaPartnership` from content.ts. | 01, 03, 08 | Indirect — uses `investmentCase` (content.ts:593) + canonical assets. No raw revenue $ hardcoded in page; risk is downstream in content.ts. |
| `/pitch/document` | Public | Print/PDF-formatted pitch (client comp, hides chrome, A4 print CSS). 513 lines. | 01, 03, 04 | HARDCODED: `$3M/year` washer market, washer price tiers `$600/$850/$1,200`, `~$100K invested`, `$0` (pitch/document/page.tsx:146,222-230,272,314). Static, not from canon. |
| `/impact` | **Gated** (`impact_auth`) | The live impact model — health/enviro/economic/ownership/production dimensions, provenance tiers, EL-driven. 1013 lines. Fetches `fetchImpactData()` + `impact-model.ts`. | 02, 03, 04 | **HIGH.** Revenue denominator = `$741,111` via `verifiedFinancials.revenueReceived` (compendium.ts:320) — this is the OLD canon; the corrected QBE figure is ~$907,569 (+$166,458 swing) and is NOT reflected here. Also Centrecorp shown as **109 beds** (impact/page.tsx:677-678; impact-model.ts:113,603) vs corrected **107** used everywhere else. |
| `/cost-story` | Public | "What a Bed Really Costs" — cost-per-bed narrative + live Recharts driven by cost engine. 408 lines. | 03, 11 | Many hardcoded $ in prose ($685, $426, $1,780, $534.79, $344.05, $750, $109,500, $110,046, $112K-$222K) — cost-model v6 figures, internally consistent but hand-maintained (cost-story/page.tsx:144-370). Charts are live; prose is static. |
| `/sites/cost-lab` | **Gated** (`INVESTORS_PASSWORD`) | Internal first-principles cost working room (`CostLabWorkspace`). noindex. | 11, 04 | Live engine — low. Internal. |
| `/sites/cost-lab/playbook` | **Gated** (`INVESTORS_PASSWORD`) | Cost Lab Playbook (analogies, one-liners, set plays) via `ArticleRenderer` + `PLAYBOOK_MD`. noindex. | 11 | Static MD content — review for figure drift. |
| `/sites/qbe` | **Gated** (`INVESTORS_PASSWORD`) | "QBE Capital Evidence" investor cockpit (`QbeSiteWorkspace`) — cost model, pricing, impact proof, readiness gates. noindex. | 03, 04, 10, 11 | Live cost engine — medium. Verify workspace copy figures. |
| `/sites/qbe-readiness` | **Gated** (`INVESTORS_PASSWORD`) | The 12-area readiness one-pager: 1 goal, 5 proofs, timeline, 12-area scoreboard, links to live models. 686 lines, Server Component. Figures trace to 2026-06-13 strategic pack. noindex + confidential banner. | ALL 12 (this is the spine) | MEDIUM. Hardcoded prose figures from strategic pack (e.g. `107 beds via Centrecorp`, line 298 — correct). Needs re-check against corrected ~$907,569 revenue + current ask/stack. This is THE pack one-pager. |
| `/investors` | **Gated** (`INVESTORS_PASSWORD`) | Investor cockpit — same verified cost-model engine as `/admin/cost-model`, Investment skin default. 37 lines (thin wrapper). | 03, 04, 10, 11 | Live engine — low. |
| `/stories` | Public | Storyteller/quote gallery. 766 lines. | 02, 08 | Low — narrative/EL. |
| `/communities` | Public | Map + list of every community; totals from `communityLocations` (content.ts), sorted by `bedsDelivered`. 54 lines. | 02 | Medium — bed totals are SUMMED from `communityLocations`, so drift if that array is stale vs `CANONICAL_ASSETS.bedsDeployed=496`. |
| `/insights` | Public | Thematic analysis of community voices (theme counts, featured quotes). 347 lines. | 02 | Low — derived from `quotes`/themes. |
| `/process` | Public | "How It's Made" — collection -> press -> CNC -> assembly -> delivery, EL build photos, admin photo-swap. 578 lines. | 06 | Low on $; product-process accuracy matters (X-trestle wording present). |
| `/stretch-bed` | Public | "The Stretch Bed: How It Works" — build guide + specs from `STRETCH_BED` (products.ts, canonical). 380 lines. | 03, 06 | Low — specs imported from single source of truth. |
| `/bed/[id]` | Public (per-asset) | Individual bed/asset page (442 lines) — `/bed/<id>` public asset view. | 02, 07 | Low — per-asset DB-driven. |
| `/partner` | Public | "Back the Work" — capital pathways, partnership + washer-interest forms, DGR note, `TRACTION_STATS`. 509 lines. | 10, 09, 04 | MEDIUM. Hardcoded `up to $400,000` QBE match (×2), `about $3M` target (partner/page.tsx:91,309,328,339). `TRACTION_STATS` pulls `$741.1K` "verified receipts, $143K still due" (funder-shared-content.ts:11) = OLD revenue canon. DGR note current (Butterfly). |
| `/press` | Public | Press & brand pack — logos, voice, photos, partners, key facts. 655 lines. `LAST_UPDATED = '25 May 2026'`. | 02, 07 | MEDIUM. keyFacts hardcode `496` beds, `9` communities, `20kg` (press/page.tsx:42-44). No washer count in facts. `LAST_UPDATED` is stale (25 May). |
| `/field-notes/utopia-may-2026` | Public | Trip story (slug `utopia-may-2026` exists in `trip-stories.ts:407`) — May 2026 Utopia run, EL galleries, live map counts. Rendered via `/field-notes/[slug]`. | 02, 06 | Low — narrative; `107 beds` that trip is the corrected figure. |
| `/partners/snow/dashboard` | **Gated** (`partner_snow`, pw `snow2026`) | The sendable Snow funder dashboard — live metrics, funding->impact, kanban roadmap, EL voices. (`/partners/[slug]/dashboard`.) | 02, 04, 10 | Snow-specific; recently aligned (memory: $493,130, 107 beds). Verify against latest. Not QBE-pack-core but a model for funder surfaces. |

### Other QBE/funder/investor routes found (not in the original list)

| Route | Public/Gated | Note |
|---|---|---|
| `/investors/login` | Public | Login door for the whole investor/qbe/cost-lab gate. |
| `/impact/login` | Public | Login for `/impact`. |
| `/funders/[slug]` | **Gated** (`funder_<slug>`) | Per-funder landing pages (generic engine, `src/lib/funders/configs/*`). |
| `/funders/[slug]/communities` | **Gated** | Per-funder communities view. |
| `/funders/[slug]/login` | Public | Per-funder login. |
| `/partners/[slug]/dashboard` | **Gated** | Generic partner dashboard engine (Snow is the live instance). |
| `/partners/[slug]/outcomes` | Public(?) | Partner outcomes page (not in proxy gate list — only `/dashboard` is gated). |
| `/partners/centrecorp` | Public | Centrecorp partner page. |
| `/partners/oonchiumpa` | Public | Oonchiumpa partnership page (107 beds, DEWR Real Innovation Fund story). |
| `/kit` | Public | Field/trip kit page (Centrecorp-funded trip, 107 beds — kit/page.tsx:124). |
| `/the-work` | Public | "The Work" narrative (107 beds single run). |
| `/admin/loi-tracker` | Admin | **LOI / signed-commitment tracker EXISTS** (admin-only) — relevant to areas 10/12 below. |
| `/admin/cost-model` | Admin | The engine behind `/investors` + `/sites/qbe`. |
| `/admin/roadmap` | Admin | Drives the partner-dashboard kanban. |
| `/admin/funders/[slug]/video-brief` | Admin | Funder video brief tooling. |

---

## (a) Routes that need a content update for the current pack

1. **`/impact`** (gated) — **highest priority.** Revenue denominator is `$741,111` (old canon) via `verifiedFinancials.revenueReceived` in `compendium.ts:320`; the corrected QBE figure is ~$907,569 (+$166,458 swing) and is not reflected. Also Centrecorp = **109 beds** here (impact/page.tsx:677-678, impact-model.ts:113,603) while the rest of the site uses **107**. Update once the accountant signs the figure.
2. **`/partner`** (public) — `TRACTION_STATS` shows `$741.1K verified receipts, $143K still due` (funder-shared-content.ts:11) = old revenue canon. Update to the signed figure. QBE match copy ($400K, ~$3M) is current and correct.
3. **`/sites/qbe-readiness`** (gated) — THE pack one-pager. Re-verify every figure against the corrected revenue (~$907,569), the current ask/stack, and the 12-area scoreboard (esp. Area 09 keystone status). Bed/Centrecorp counts here are already 107 (correct).
4. **`/sites/qbe`** + **`/investors`** + **`/admin/cost-model`** — share the cost engine; if cost model v6 figures move, all three move together. Verify workspace copy figures match the pack.
5. **`/press`** (public) — `LAST_UPDATED = '25 May 2026'` is stale; key facts (496/9/20kg) are current but should be re-confirmed. No washer count present.
6. **`/cost-story`** (public) — many hand-maintained $ in prose; charts are live. Re-sync prose to cost model v6 if any unit changed.
7. **`/communities`** (public) — totals are SUMMED from `communityLocations`; confirm that array sums to the canonical `496` so the public total doesn't drift.

### Cross-cutting canon note
- `asset-canonical.ts:6` still carries `washersWorking: 14, washersDeployed: 28`. Memory says the canonical washer figure is now **16 "in community"** (28/14 retired). The public pitch/impact/partner/press pages do NOT appear to surface 28/14 directly, but any new washer copy must use **16**, and `asset-canonical.ts` itself is a latent drift source.
- Two revenue numbers coexist in the codebase: `$741,111` (compendium.ts, canon.ts:90, grant-content.ts:140, impact-model.ts) is the live site figure; the QBE pack should move to the corrected ~$907,569 once the accountant signs. This is a single-source fix (update `verifiedFinancials.revenueReceived` + the segment notes) that propagates to `/impact`, `/partner` TRACTION_STATS, and the canon ledger.

---

## (b) Net-new pages/sites the 12 areas imply that don't fully exist yet

| Candidate (area) | Exists today? | Gap |
|---|---|---|
| **Scored risk register** [area 05] | NO dedicated route. `/sites/qbe-readiness` lists blockers narratively; `qbe-areas.json` has `blockers`/`keystone`. | Net-new. No page renders a *scored* risk register (likelihood × impact). Closest is the readiness scoreboard, which is maturity scores, not a risk matrix. Build a section in `/sites/qbe-readiness` or a new gated `/sites/qbe/risks`. |
| **Entity-wording / legal-structure page** [area 09 KEYSTONE] | NO. Area 09 has **0 artifacts** (qbe-areas.json keystone). DGR/entity note exists only as a paragraph on `/partner` (Butterfly Movement) and scattered governance canon. | Net-new and highest-leverage. No surface presents the entity/ownership decision + transition path + Supply Nation 51% + Butterfly DGR routing in one place. Partial coverage: `/partner` DGR note; `governance` canon domain (4 entity ABNs). |
| **Signed-commitment / LOI tracker** [areas 10/12] | PARTIAL — `/admin/loi-tracker` EXISTS but is admin-only (Supabase auth). | A *funder-facing* (gated, investor-password) view of LOIs/signed dollars does not exist. Area 10 needs "first signed dollar" evidence visible in the pack. Promote/duplicate `/admin/loi-tracker` into a gated investor surface, or add a "commitments" panel to `/sites/qbe-readiness`. |
| **Impact-measurement-method one-pager** [area 02] | PARTIAL — `/impact` shows the model with provenance tiers; `/insights` shows thematic method. | No concise *method* one-pager (MEL framework: what we measure, how, confidence tiers, cadence). `/impact` is the data surface; the methodology is implicit in its provenance tiers. Net-new one-pager (could be a gated `/sites/qbe/impact-method` or a `/impact` sub-section). |
| **People / 12-month role map** [area 08] | PARTIAL — `/admin/team` (admin) exists; `/pitch` and partner pages mention roles (Alice Springs jobs, advisory group, Oonchiumpa). No org chart / 12-month hiring-and-role roadmap surface. | Net-new. Area 08 (People & Enterprise) has no public/gated page mapping current team + the 12-month role plan tied to the raise. `goodsOrbit`/`advisoryGroup` data exist in content.ts but render only as pitch sections. |

### Summary
- **Strongest existing spine:** `/sites/qbe-readiness` (covers all 12 areas at a scoreboard level) + the live cost cockpits (`/sites/qbe`, `/investors`, `/sites/cost-lab`).
- **Biggest content-update need:** `/impact` and `/partner` TRACTION_STATS (old $741,111 revenue + 109-vs-107 Centrecorp on `/impact`).
- **Biggest net-new gap:** Area 09 legal-structure/entity page (keystone, 0 artifacts) and a funder-facing LOI/commitment surface (admin-only today).

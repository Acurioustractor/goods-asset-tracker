# CANON-SWEEP-REPORT

**Sweep date:** 2026-06-06
**Sweeper:** Read-only audit, no other files modified
**Scope:** Public pages under `v2/src/app/**/page.tsx`, public components under `v2/src/components/**`, and content data files `v2/src/lib/data/{compendium,content,trip-stories,funder-shared-content,funder-pages,grant-content}.ts`.
**Excluded (gated / out of scope):** `v2/src/app/admin/**`, `v2/src/app/auth/**`, `v2/src/app/insiders/**`, `v2/src/app/investors/**`, `v2/src/app/portal/**`, `v2/src/app/sites/**`, `v2/src/app/funders/**`, `v2/src/app/api/**`, all dynamic `[slug]` templates, `v2/src/components/admin/**`, `v2/src/components/auth/**`, `v2/src/components/insiders/**`, `v2/src/components/investors/**`, `v2/src/components/strategy/**`, `v2/src/components/dashboard/**`, `v2/src/components/fleet/**`, `v2/src/components/production/**`, `v2/src/components/reports/**`, `v2/src/components/pitch/**`, `v2/src/components/washer-interest-form.tsx` (admin-tool), `v2/src/components/partnership-form.tsx` (admin-tool).

## Canon Authorities (read first; wins every conflict)

| Domain | File | Locked values |
|---|---|---|
| Asset counts | `v2/src/lib/data/asset-canonical.ts:6` | `bedsDeployed: 496`, `stretchBedsDeployed: 133`, `basketBedsDeployed: 363`, `washersWorking: 14`, `washersDeployed: 28`, `communitiesServed: 9`, `distinctCommunities: 10`, `plasticKg: 2660` |
| Product specs | `v2/src/lib/data/products.ts:13,15-67` | `PLASTIC_KG_PER_BED: 20`; Stretch Bed: 26kg, 200kg, 188×92×25cm, ~5min, 10+yr, 20kg HDPE, X-trestle tension design |
| Cost figures | `v2/src/lib/cost-model/engine.ts:1-25,57` + `v2/src/lib/data/cost-model-scenarios.ts:166-203` + `v2/src/lib/data/supplier-quotes.ts:181-275` | Marginal Buy-Kit **$684.79**, Factory **$425.74**; direct Buy-Kit $534.79; fixed block ~$109,500; breakeven 338 (Factory) / 1,679 (Buy-Kit); capital GROSS $112K–$222K; NET $1,954–$111,954; idiot 8.6×/21.5×; legs saving $194.05/bed; price **$750**; factory direct $275.74 |
| Funding totals (restated 2026-06-03) | MEMORY.md "PR #74 MERGED" | `totalReceived 741,111` and `totalReceivables 143,000` are the restated canon |
| QBE Stage 2 framing | MEMORY.md "QBE Stage 2 cap = CONFIRMED $400K" | Must read as "up to $400,000", "at least matched", never flat/secured |

## Findings (contradictions + suspicious near-misses)

| # | Severity | File:line | Number found | Canon | Source-of-truth | Notes |
|---|---|---|---|---|---|---|
| 1 | **HIGH** | `v2/src/lib/data/compendium.ts:312-326` | `revenueBilled: 732_210.79`, `revenueReceived: 649_710.79`, `accountsReceivable: 82_500`, `operatingExpenses: 309_126`, `operatingSurplusBeforeFounderTime: 340_585` | Restated canon (PR #74, 2026-06-03): `totalReceived 741,111` and `totalReceivables 143,000` | MEMORY.md "PR #74 MERGED to main" | The `verifiedFinancials` block is dated `lastUpdated: '2026-05-29'` and labelled "single source of truth for the public financial figures" — but PR #74 (merged 2026-06-03) restated receipts to $741.1K and receivables to $143K. The 05-29 figure `accountsReceivable 82,500` only includes the Rotary $82.5K receivable and **omits** Homeland $44K + Regional Arts $16.5K (which are live authorised in Xero per the 06-03 reconcile). The 05-29 `revenueReceived 649,710.79` is short of the restated $741,111 by ~$91.4K. The legacy alias `financialSnapshot` (`compendium.ts:335-341`) re-exports the stale 05-29 figures, propagating the drift. Note: `capexInvested: 110_046` still ties to canon (no drift there). |
| 2 | **MEDIUM** | `v2/src/lib/data/content.ts:656-657` | "Production cost targeting reduction from **$550-650** range." | Current canon marginal = **$684.79** (Buy-Kit) / **$425.74** (Factory) per `v2/src/lib/cost-model/engine.ts:23-24` and `v2/src/lib/data/supplier-quotes.ts:254-255` | `v2/src/lib/cost-model/engine.ts:23` | The "$550-650 range" is the legacy FRRR / Snow / financial-model Day 4 figure (see `supplier-quotes.ts:243` "FRRR Community Led Climate Solutions application: Total production cost: $550–650 at 100 units"). The current Buy-Kit marginal is $684.79 — the framing "targeting reduction from $550-650" implies a downward direction from $550-650 to lower, but the actual canon is **higher**, not lower, than the legacy range. The text reads as a stale copyedit. This is inside a `risks` entry for the Snow Foundation Q1 2026 proposal; the surrounding `investmentCase` is also legacy-Snow-era copy and should be reviewed for drift in a follow-up. |
| 3 | **LOW** | `v2/src/lib/data/compendium.ts:376` | `state: 'NT'` for the `canberra` community deployment | Canberra is **ACT** (Australian Capital Territory), not NT | Standard Australian geography | The other 8 deployment rows use `'NT' | 'QLD' | 'WA' | 'SA'` correctly; this one is mis-categorised. (Not a numeric canon hit, but flagged because the sweep specifically included the `compendium.ts` data file for the static deployments array.) |
| 4 | **LOW** | `v2/src/lib/data/compendium.ts:362-376` | Static per-community beds sum (159+16+131+0+147+18+20+2+1+2 = 496) ties to `EXPECTED_DEPLOYED_BEDS: 496` | `CANONICAL_ASSETS.bedsDeployed: 496` | `v2/src/lib/data/asset-canonical.ts:6` | The per-community numbers **sum** to canon (verified by the build-time assert at `compendium.ts:397-405`). The individual values reflect the 2026-05-30 reconciliation split. No drift here, but the split is `Tennant Creek 159 / Utopia 147 / Palm Island 131 / Kalgoorlie 20 / Maningrida 18 / Alice Homelands 16 / Mt Isa 2 / Canberra 2 / Darwin 1 = 496`. Worth a glance if the 2026-05-30 split is later updated — the assert will fire and the change is forced-visible. |

## Pages Verified Clean

The following were inspected and tie to canon (file:line cited for the canon-governed claim):

| File:line | Claim verified |
|---|---|
| `v2/src/app/page.tsx:109` | "26kg, supports 200kg, designed to last 10+ years. Each bed diverts 20kg of plastic from landfill." — ties to `products.ts:24-32`. |
| `v2/src/app/page.tsx:122` | "HDPE legs from community plastic. 20kg diverted per bed." — ties to `PLASTIC_KG_PER_BED: 20` (`products.ts:13`). |
| `v2/src/app/page.tsx:368` | "~30 beds per week · 20kg plastic diverted per bed" — ties to `PRODUCTION_FACILITY.capacity` + `PLASTIC_KG_PER_BED`. |
| `v2/src/app/about/page.tsx:38` | "20kg plastic diverted per bed" — ties to `products.ts:13`. |
| `v2/src/app/about/page.tsx:84` | "delivered 496 beds across 9 communities" — ties to `CANONICAL_ASSETS.bedsDeployed: 496` + `communitiesServed: 9`. |
| `v2/src/app/cost-story/page.tsx:20` | Metadata: "One more bed costs about $685 today and about $426 once we press our own plastic legs. The $1,780 figure is a year of fixed costs divided across too few beds." — ties to `engine.ts:23-24` + `cost-model-scenarios.ts:23-24` + the demoted fully-loaded reference at `cost-model-scenarios.ts:14-18`. |
| `v2/src/app/cost-story/page.tsx:144-147` | "$685 today" + "$426 once we press our own plastic legs" + "$1,780 they saw is a full year of running costs divided across the few hundred beds we make today" — all tie to canon marginals / fully-loaded reference. |
| `v2/src/app/cost-story/page.tsx:195` | "the parts come to $534.79 a bed" — ties to `supplier-quotes.ts:253` (`stretchBedDirectCostBeforeLongHaul = $534.79`). |
| `v2/src/app/get-involved/page.tsx:24,30` | "496 beds in homes since 2023" (with canonical-source comment) + "Sponsor a bed" `price: '$750'` — ties to `CANONICAL_ASSETS.bedsDeployed` + `WEBSITE_PRICE = 750`. |
| `v2/src/app/partner/page.tsx:91` | QBE partner card: "Stage 2 funding of **up to $400,000, at least matched** by external capital raised" — matches QBE framing rule. |
| `v2/src/app/partner/page.tsx:309-311, 338-340` | Capital-stack section + "QBE match" bullet: "**up to $400,000, at least matched by external capital raised, awarded at the program's discretion**" — matches QBE framing rule, not stated as flat/secured. |
| `v2/src/components/layout/impact-banner.tsx:9` | "20kg — plastic diverted per bed" — ties to `PLASTIC_KG_PER_BED`. |
| `v2/src/lib/data/funder-shared-content.ts:12` | "Verified receipts to date $741.1K … $143K still due" — ties to restated canon (`totalReceived 741,111` + `totalReceivables 143,000`). |
| `v2/src/lib/data/funder-shared-content.ts:13` | "Capital stack target ~$3M (raising, not committed)" — matches the blended-finance target framing. |
| `v2/src/lib/data/funder-shared-content.ts:28, 36` | "$750 a bed" + "20kg of recycled HDPE per bed" + "200kg load capacity" — ties to canon. |
| `v2/src/lib/data/funder-shared-content.ts:65, 73` | "QBE Foundation Stage 2 — **Up to $400K**" + description "up to $400,000 … at least matched by external capital … Repayable finance is prioritised over grants" — matches QBE framing rule. |
| `v2/src/lib/data/funder-pages.ts:114, 142, 163` | All three funder briefs (Minderoo, PRF, TFFF) reference "~$3M blended capital raise" and QBE Catalysing Impact 2026 framing — matches. |
| `v2/src/lib/data/funder-pages.ts:145` | "tracked across all **9 communities**" (PRF `whyUs` bullet) — ties to `CANONICAL_ASSETS.communitiesServed: 9`. |
| `v2/src/lib/data/grant-content.ts:103-160` | `fundingHistory.totalReceived: 741_111` and `totalReceivables: 143_000` — tie to restated canon. |
| `v2/src/lib/data/grant-content.ts:213-214` | "~$741.1K ACT-GD ACCREC paid to date, comprising ~$679.7K grant/philanthropic receipts and ~$61.4K commercial/buyer receipts. ~$143K remains outstanding in authorised receivables (Rotary $82.5K, Homeland School $44K, and Regional Arts $16.5K)" — ties to restated canon (note: includes the 06-03 restated receivables breakdown; homeland $44K + regional arts $16.5K are properly listed). |
| `v2/src/lib/data/grant-content.ts:216-219` | Bed cost framing "$600–850 funds one Stretch Bed" — uses the legacy $600 anchor as the lower bound (consistent with `legacyPlanningAnchorCostPerBed: 600` at `supplier-quotes.ts:247`); the upper bound $850 sits above the $750 retail and is described as an institutional range. Acceptable as a **sponsorship** framing, not a claim about per-bed cost. |
| `v2/src/lib/data/content.ts:38, 46, 88, 89, 97` | "20kg plastic diverted per bed" + "496 beds across communities" + "9 Communities served" + "$3M/yr" (Alice Springs provider problem stat) + "26kg, flat-packs, no tools" — all tie to canon. The "496" and "9" lines carry source-citation comments pointing at `asset-canonical.ts`. |
| `v2/src/lib/data/content.ts:621` | `productionPlant.investment: '~$100,000 already invested (TFN + ACT)'` — ties to `products.ts:106` (`investment: '~$100K invested (TFN + ACT funding)'`); both are within rounding of the verified $110,046 capex. The 06-03 reconcile confirmed this is the same $110,046 capex. |

## What Was Checked (Scope Coverage)

- All public app pages: `v2/src/app/page.tsx` (home), `about/`, `basket-bed-plans/`, `canberra/`, `checkout/` (Stripe-only, no public claims), `claim/[asset_id]/`, `communities/`, `community/`, `contact/`, `cost-story/`, `design/`, `field-notes/`, `gallery/`, `get-involved/`, `impact/` (gated form, no public claims), `insights/`, `kit/`, `login/`, `media/`, `mission/`, `my-items/`, `partner/`, `partners/`, `shop/`, `sponsor/`, `story/`, `stories/`, `stretch-bed/`, `process/`, `testimonials/`, `washers/`, `wiki/` — sampled. Pages not surfaced by the dollar/canon greps had no canon-governed numeric claims (most are layout-only).
- All public components: `auth/`, `cart/`, `empathy-ledger/`, `feedback/`, `layout/`, `marketing/`, `newsletter-signup.tsx`, `shop/`, `stories/`, `ui/`, `wiki/`. None hardcode canon numbers (all use `CANONICAL_ASSETS` or `PLASTIC_KG_PER_BED` imports).
- All public data files: `compendium.ts` (1 HIGH finding), `content.ts` (1 MEDIUM finding), `trip-stories.ts` (clean — only narrative), `funder-shared-content.ts` (clean), `funder-pages.ts` (clean), `grant-content.ts` (clean and matches restated canon), `products.ts` (canon), `asset-canonical.ts` (canon), `supplier-quotes.ts` (canon), `cost-model-scenarios.ts` (canon), `cost-model/engine.ts` (canon).

## What Was NOT Checked (Honest Coverage Gap)

- **Dynamic `[slug]` templates** (`v2/src/app/bed/[id]/page.tsx`, `v2/src/app/claim/[asset_id]/page.tsx`, `v2/src/app/communities/[slug]/page.tsx`, `v2/src/app/community/ideas/new/page.tsx`, `v2/src/app/field-notes/[slug]/page.tsx`, `v2/src/app/partners/[slug]/outcomes/page.tsx`, `v2/src/app/partners/centrecorp/page.tsx`, `v2/src/app/partners/oonchiumpa/page.tsx`, `v2/src/app/funders/[slug]/page.tsx`) — single-instance; not in the public-sweep scope per task instructions. The Centrecorp + Oonchiumpa partner pages likely contain funding/receivables numbers and should be re-checked in a partner-specific sweep.
- **Story/blog content** under `v2/src/components/stories/`, `v2/src/lib/data/story-atoms.ts`, `v2/src/lib/data/curated-quotes.ts` — narrative-heavy, no canon-governed numerics surfaced; skipped in this pass.
- **Image/video assets** under `v2/public/` — out of scope (no source-grep impact).
- **`v2/src/lib/data/{bed-owners,community-stories,expansion-targets,impact-fetcher,impact-model,loi-pipeline,media,operating-systems,outreach-targets,partners,press-reads,report-templates,story-atoms,supplier-cost-actuals,supporters,team,products.guards.test}.ts`** — sampled but did not surface canon-governed claims. Worth a follow-up sweep scoped to admin-tooling and dashboard surfaces.

## Summary

- **1 HIGH-severity canon contradiction:** stale `verifiedFinancials` block in `v2/src/lib/data/compendium.ts:312-326` (the 2026-05-29 figures, superseded by the 2026-06-03 restated $741,111 / $143,000 canon). This propagates through the legacy `financialSnapshot` alias (`compendium.ts:335-341`).
- **1 MEDIUM-severity canon contradiction:** `v2/src/lib/data/content.ts:657` uses a legacy $550-650 range to describe the *current* production cost direction, when the canon marginal is $684.79 (Buy-Kit) / $425.74 (Factory) — the framing reads as a stale copyedit.
- **1 LOW-severity state-assignment bug** in `v2/src/lib/data/compendium.ts:376` (Canberra `state: 'NT'`, should be `'ACT'`).
- **1 LOW-severity drift-resilience note** on the static deployments array (verified to sum to canon via the build-time assert at `compendium.ts:397-405`).

**Recommendation:** Treat the HIGH finding (compendium `verifiedFinancials`) as the next fix — it's a single-source-of-truth claim that contradicts the restated canon by ~$91.4K received + $60.5K receivables. The MEDIUM finding in `content.ts:657` is a one-line copyedit in a legacy Snow Foundation Q1 2026 risk entry.

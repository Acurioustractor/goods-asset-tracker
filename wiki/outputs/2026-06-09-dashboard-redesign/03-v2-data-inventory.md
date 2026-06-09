I now have a complete picture. Here is the hard inventory.

# Goods on Country — v2 Live Data Inventory (read-only)

## Part 1 — Metrics/fields the v2 app actually has wired

Confidence tiers map to the design's COUNTED / MODELLED / NOT-YET-MEASURED. The code's own `confidence` field (`verified`/`modelled`/`estimate`/`target`) is noted where it disagrees.

| Metric / field | Source | Live or static | Classification |
|---|---|---|---|
| Beds delivered (`totalBeds`, qty-summed, deployed) | Asset register (`assets` table, `getAssetStats`) | **Live** (force-dynamic) | COUNTED |
| Stretch beds vs Basket beds split | Asset register | Live | COUNTED |
| Washers deployed (28) | Asset register | Live | COUNTED |
| Washers working (14) | Curated constant `WASHERS_WORKING` in `impact-fetcher.ts` (telemetry unreliable) | **Static** | COUNTED (admin-confirmed, hand-set) |
| Communities served (9, deployed) + per-community breakdown | Asset register | Live | COUNTED |
| Total deployed units (beds + washers) | Asset register | Live | COUNTED |
| Plastic diverted (kg/tonnes) | Computed: `stretchBeds × 20kg` (`PLASTIC_KG_PER_BED`) | Live (derived) | MODELLED (assumes 20kg/bed; code labels `modelled`) |
| Wash cycles completed | `get_fleet_kpis` RPC / `usage_logs` fallback | Live **if RPC exists**, else 0 | COUNTED (when present) — telemetry coverage partial |
| Machines online / total / total kWh | `get_fleet_kpis` RPC | Live if RPC exists, else 0 | COUNTED (partial coverage) |
| Active storytellers count | Empathy Ledger `getProjectInsights().project.storytellerCount` (fallback 33) | Live (EL, 5-min cache) | COUNTED |
| Story/transcript count | EL `transcriptCount` | Live | COUNTED |
| EL themes (name, frequency, storytellerCount, culturalContexts) | EL `getProjectInsights().themes` | Live | COUNTED (qualitative) |
| EL top quotes (text, context, theme, impactScore) | EL `topQuotes` | Live | COUNTED (qualitative, consent-gated) |
| EL per-storyteller analysis (bio, location, isElder, themes, quotes, qualityScore, emotionalTone, cultural markers, ALMA signals, impactDimensions) | EL syndication API (`getProjectStorytellers`/`getStoryteller`) | Live | COUNTED (qualitative); requires `EMPATHY_LEDGER_PROJECT_ID` env |
| EL site clearance (cleared vs candidate per storyteller) | EL `stories_for_site` RPC | Live | COUNTED (consent gate) |
| EL galleries / project media (photos, cdn_url, alt) | EL Supabase | Live | COUNTED |
| Sleep nights provided | Computed: `beds × 2.5 × 365` | Live (derived) | MODELLED |
| People / lives impacted | Computed: `beds × 2.5` | Live (derived) | MODELLED |
| Employment hours created | Computed: `beds × 6.5 modelled hrs/bed` (`MODELLED_LABOUR_HOURS_PER_BED`) | Live (derived) | MODELLED (not time-studied) |
| Govt health savings ($) | Computed: RHD-admission proxy ($70K × modelled cases) | Live (derived) | MODELLED (flagged "needs health-evidence partner") |
| Impact-per-dollar / composite impact score | Computed weighted sum ÷ `totalInvestment` | Live (derived) | MODELLED |
| Funding received to date ($741,111) | `verifiedFinancials.revenueReceived` (Xero workpaper, verified-not-audited) | **Static** (hand-reconciled) | COUNTED (Xero-backed) |
| Revenue billed ($732,210.79) | `verifiedFinancials.revenueBilled` | Static | COUNTED |
| Accounts receivable ($143,000) | `verifiedFinancials.accountsReceivable` | Static | COUNTED |
| Accounts payable ($0) | `verifiedFinancials` | Static | COUNTED |
| Operating expenses ($309,126) | `verifiedFinancials` | Static | COUNTED |
| Capex invested in plant ($110,046) | `verifiedFinancials.capexInvested` | Static | COUNTED |
| Operating surplus before founder time ($340,585) | `verifiedFinancials` | Static | MODELLED (conservative) |
| Cost per bed — direct, by 4 build paths (Factory $275.74 / Defy Kits $534.79 / Defy Panels / Community $270.74) | Cost-model engine (`cost-model-scenarios.ts` → `getMarginGridAt750`) | Static (locked canon) | MODELLED (from verified supplier invoices) |
| Margin / margin% per build path at $750 | Cost-model engine | Static | MODELLED |
| Fully-loaded cost grid (~$1,780 @ pilot volume) | Cost-model engine (`getFullyLoadedGrid`) | Static | MODELLED (reference only) |
| Marginal cost, fixed block (~$109.5K/yr), breakeven beds/yr, capital payback, legs saving ($194.05/bed) | Cost-model `engine.ts` (DEFAULTS, locked) | Static | MODELLED |
| Website/institutional price ($750) | `supplier-quotes.ts` (`WEBSITE_PRICE`) | Static | COUNTED (set price) |
| 7 revenue segments + projected share % + current evidence | Curated config (`REVENUE_SEGMENTS`) | Static | MODELLED (projection) |
| FTE jobs (2), production days/week (0), community employment % (30), CNC time (3.5h), facility count (1), utilisation (30%), units/month (15), product survival (95%), lifespan (10y), local feedstock (60%) | Curated config in `impact-model.ts` (`source: 'manual'`) | Static | mix: `estimate`/`target`/`verified` — treat as MODELLED / NOT-YET-MEASURED |
| Year-1 / Year-3 / Vision-2030 targets per metric | Curated config (`targets` on each `ImpactMetric`) | Static | TARGET (design goal) |
| Roadmap kanban (up-next / in-progress / done, with notes) | Supabase `roadmap_items` (`getRoadmap`); falls back to curated config | Live | COUNTED (curated content, live-edited) |
| Roadmap timeline / engagement history | Supabase `roadmap_items` (timeline) | Live | COUNTED (curated) |
| Health cascade (6 steps, interrupted flags, live wash-cycle metric) | Built from beds + wash cycles + machines online | Live (derived) | MODELLED (the cascade is a modelled narrative; underlying counts are counted) |
| Optimization opportunities (5 default + dynamic: offline-fleet, community-concentration) | Curated `DEFAULT_OPPORTUNITIES` + generated from live stats | Mixed | MODELLED |
| **Per-partner curated layer** (heroLine, intro, statusLine, facilities count "1+1", contribution e.g. "~$493K", engagement timeline, links, traffic snapshots, gallery, password) | Curated config (`partner-dashboards.ts`) | Static | mix — contribution/traffic are COUNTED; facilities is a hand-count |
| Airport / traffic snapshots (73 page views, 318 visitors, LinkedIn 41, 44 reads) | Curated config (`partner.traffic`, manually transcribed from Vercel Analytics) | Static | COUNTED (but hand-entered, not wired to Analytics API) |
| Funding pipeline records (source, amount, status received/pending/pipeline/receivable, contact, notes) | Curated config (`funding[]` + `getFundingSummary()` in `compendium.ts`) | Static | mix — received=COUNTED, pending/pipeline=TARGET/forecast |

## Part 2 — What the redesign wants but the code does NOT have (with smallest path to source it)

**Funding TARGETS framed forward (the #1 gap for Ben's "where we are going" reframe).**
- The code has a backward "funding received" figure ($741K) and a raw `funding[]` pipeline list, but **no concept of a current RAISE with a goal, a committed amount, and a gap** (e.g. "$X target / $Y committed / $Z to go"). The `targets` that exist are per-impact-metric (beds, plastic), not dollars.
- **QBE Stage 2 (~$400K matched) is nowhere in typed data** — it lives only in kanban prose and memory. There is no `MATCH_TARGET`/cap/committed-match structure on the live surface.
- Smallest path: **curated config now.** Add a `FUNDING_GOAL`/`raise` object (target, committed, matched, gap, deadline, instrument type grant-vs-repayable) alongside `verifiedFinancials`. The `funding[]` pipeline already has the rows to aggregate "committed" from; QBE cap is a single constant. No new data system needed.

**Community-owned-asset milestones (the core narrative asset).**
- Production facilities is a hand-typed string ("1 + 1") in `partner-dashboards.ts`; **facilities/plants are NOT in the asset register.** There is no structured "ownership transfer" progression (built → operating → community-run → community-owned).
- `community-production-days/week` and `community-employment-%` exist as manual metrics but are stub values (0, 30) with no milestone timeline.
- Smallest path: **curated config now.** Add a `communityAssets[]` / `ownershipMilestones[]` config (facility, location, host community, stage enum, % to community ownership, target date). Later: a Supabase `facilities` table parallel to `assets` so it goes live. The roadmap kanban is the closest live surface and could carry interim milestones today.

**Cost-per-outcome (vs cost-per-output).**
- The app deliberately shows **cost-per-bed only** (the stewardship panel says so explicitly). There is no cost-per-RHD-case-averted, cost-per-person-reached, or cost-per-job that ties dollars to an outcome.
- Smallest path: **derivable now but should stay MODELLED/labelled.** `funding ÷ peopleReached` and `funding ÷ beds` are one division away from existing values; cost-per-health-outcome needs the health-evidence partner the code already flags. Recommend a clearly-MODELLED "cost per person reached" tile now, hold cost-per-health-outcome as NOT-YET-MEASURED.

**Equity / need denominators (every section is supposed to get one).**
- **Nothing in code provides a denominator** — no "beds delivered vs beds needed", no remote-housing overcrowding baseline, no RHD-incidence population figure, no community-level need index. The health cascade cites "1 in 3 children" as a hardcoded prose string, not data.
- Smallest path: **curated config now.** Add a small `needBenchmarks` config (e.g. overcrowding rate, beds-needed estimate per community, RHD incidence) with citations, rendered as "X of an estimated Y" context. These are public ABS/AIHW/END-RHD figures — sourcing is a citation exercise, not a data-pipeline one. No live source exists or is realistic short-term.

**Beneficiary outcomes (output→outcome made explicit).**
- The app has outputs (beds, cycles, plastic) and modelled proxies (sleep nights, govt savings) but **zero measured beneficiary outcomes** — no follow-up health data, no satisfaction instrument, no product-survival check-ins at scale (the 95% survival is an estimate over "15-20 beds"). `product-survival-rate` and outcome-rate targets are explicitly NOT-YET-MEASURED in the model.
- The richest real outcome signal available is **qualitative**: EL themes + consented quotes (already live). The design's "what changed for people" should lean on these, labelled qualitative, not on a fabricated outcome number.
- Smallest path: **EL qualitative now (already wired); quantitative outcomes are a new data-collection program later** (consented follow-up + health-partner instrumentation, on the roadmap). Do not curate a fake outcome figure.

**Two smaller gaps worth noting:**
- **Confidence grade is not uniform across surfaces.** `/impact` renders a per-metric `confidence` badge; the **partner dashboard does not** — it has one prose "How we know these numbers" block but no per-tile COUNTED/MODELLED chip. The data to drive per-tile badges already exists on every `ImpactMetric`. Smallest path: reuse the existing `CONFIDENCE_META` badge component on dashboard tiles — pure UI, data already present.
- **Traffic/analytics is hand-transcribed**, not pulled from a Vercel Analytics API. Fine as curated config for now; a live wire is possible later but not required for the redesign.
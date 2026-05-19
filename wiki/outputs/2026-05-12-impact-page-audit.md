# Impact page audit: aspirational-as-active metrics

> **Date:** 2026-05-12. **Source:** SIH Diagnostic Report May 2026, page 6 and page 8. **Owner:** Ben + Nic. **Goal:** Fix the credibility leak SIH flagged before any new funder/investor sees the page.

## What SIH actually said

Two lines we cannot ignore:

> "Founders observed in the diagnostic that some of their materials describe measures that are more aspirational than active; this is fine for GOC's early stage, but should be represented accurately to funders and investors."

> "the impact-metrics page in the pre-meeting materials presented aspirational metrics as if they were currently active."

The page at `/impact` (live at goodsoncountry.com/impact) is the one they read. The fix is honest provenance per metric, not a stylistic rewrite.

## What the page promises vs. what it shows

The page header sets a contract it cannot keep:

| Element | Copy | Reality |
|---|---|---|
| Eyebrow | "Live Data" | Mixed: some live, some model, some target |
| Tagline | "Every number is live. Every target is accountable." | Half the "current" values are estimates or design targets |
| Five Dimensions intro | "tracks live metrics from our asset register, fleet telemetry, and community engagement" | Only ~30% of metrics are live-sourced |
| How We Measure | "Real-time data from the field" | Fleet telemetry currently only reports from F25 (one unit) per fleet-connectivity audit |

## Metric-by-metric provenance (the truth)

Read against `v2/src/lib/data/impact-model.ts`:

| Metric | Shown as | Actual source | Honest label |
|---|---|---|---|
| Beds Delivered | Live | Supabase asset count | **VERIFIED** |
| Sleep Nights | Live | beds × 2.5 people × 365 (model) | **MODELLED** |
| Wash Cycles | Live | Supabase usage_logs (1 machine reporting) | **PARTIAL — F25 only** |
| Product Survival Rate (95%) | Live | "estimate, only 15-20 beds with 6+ months data" | **ESTIMATE** |
| Plastic Diverted | Live | beds × 20kg HDPE (model) | **MODELLED** |
| Product Lifespan (10 yrs) | Live | "Design target, not yet measured at scale" | **DESIGN TARGET** |
| Local Feedstock % (60%) | Live | "estimate, some plastic still sourced from metro" | **ESTIMATE** |
| Employment Hours | Live | TOTAL_LABOUR_HOURS_PER_BED × beds (model × verified) | **MODELLED** |
| FTE Jobs (2) | Live | Manual | **VERIFIED** |
| Production Cost per Unit ($550) | Live | Sum of PRODUCTION_COST_BREAKDOWN (a model from a meeting, not actuals) | **MODELLED** |
| Annual Revenue ($239,273) | Live | Xero | **VERIFIED** |
| Govt Health Savings | Live | RHD surgery cost × estimated cases prevented | **MODELLED, SPECULATIVE** |
| Active Storytellers | Live | Empathy Ledger (12 published) | **VERIFIED** |
| Community Production Days/Week (0) | Live | Manual, currently zero | **VERIFIED but zero** |
| Community Employment % (30%) | Live | Manual estimate | **ESTIMATE** |
| Communities Served | Live | Supabase distinct count | **VERIFIED** |
| Units per Month (15) | Live | "estimate during active production runs" | **ESTIMATE** |
| CNC Time (3.5h) | Live | Measured at one facility, intermittent | **PARTIAL** |
| Facility Count (1) | Live | Manual | **VERIFIED** |
| Facility Utilisation (30%) | Live | "intermittent production runs" | **ESTIMATE** |

Score: 6 verified, 5 modelled, 6 estimated, 1 design target, 2 partial. Out of 20.

Also problematic: **PRODUCTION_COST_BREAKDOWN itself is a model**, not measured unit economics. SIH's "more detailed work is needed to understand unit-costs for products, particularly beds, at different scales" lands directly on this table. The cost model is currently doing double duty as both a forecast assumption and a "live" page element.

## The fix (in priority order)

### 1. Rewrite the page header (this week, 1hr)

Replace:
- "Live Data" → "Impact Model"
- "Every number is live. Every target is accountable." → "A mix of verified data, modelled estimates, and design targets. Each metric is labelled with its source. Updated as field data accumulates."

This single change re-prices the rest of the page.

### 2. Add a `provenance` field to `ImpactMetric` (this week, 3hr)

```ts
type Provenance =
  | 'verified'   // queried live from Supabase / Xero / EL
  | 'modelled'   // computed from verified inputs and explicit assumptions
  | 'estimated'  // qualified manual estimate
  | 'design'     // design target, not yet measured
  | 'partial';   // measured at small N or single site
```

Render a small badge next to each metric. Visual hierarchy: verified > modelled > partial > estimated > design.

### 3. Strip "Live" framing from "How We Measure" section (this week, 30min)

"Real-time data from the field" → "Tracking infrastructure (live and in development)." Then mark each pillar honestly:
- QR Code Tracking: deployed
- Fleet Telemetry: **1 of 38 machines reporting** (see fleet-connectivity-audit-may-2026.md)
- Empathy Ledger: 12 published storytellers, auto-sync running
- Impact API: live

### 4. Add a "Where this data comes from" footer section (next week, 2hr)

Three-column block:

| Verified (live) | Modelled (assumptions visible) | Targets (we'll get there) |
|---|---|---|

Lists each metric in the right column. Anyone scanning the page can see exactly what's measured vs. modelled vs. aspirational.

### 5. The production cost model needs its own caveat (next week)

The `ProductionCostSection` should carry: "Cost model based on current production run data. Sensitivity at scale is being modelled separately as part of SIH advisory project (May–July 2026)." Ties it directly to the SIH-offered Priority Advisory Project (production cost sensitivity at different scales).

## Things to remove or rewrite

- **DEFAULT_OPPORTUNITIES line 506**: "Each bed sale creates X hours of employment ... At 1,500 beds/year that's Y hours" — 1,500 beds/year is a forecast, not a baseline. Reword: "At our Year 1 target of 1,500 beds/year, that would be Y hours."
- **Optimization Opportunities section**: same issue throughout. Anchor each on a measured baseline or label as a projection.
- **The CTA "Be Part of This Impact"**: fine as-is, no changes needed.

## Why this matters now (Butterfly + Goods Pty Ltd transition)

We're about to:
1. Spin Goods on Country Pty Ltd into a clean trading entity.
2. Transition The Butterfly Movement Ltd into the DGR charitable home.
3. Approach Butterfly members and directors with a proposal.
4. Open the QBE-supported capital raise.

Every one of those audiences will hit /impact. The page either earns or loses credibility in 30 seconds. SIH have given us a free warning: fix it before the next investor scans it.

## What this audit does NOT do

- Does not propose new metrics. The 5-dimension model is fine. The framing is the bug.
- Does not change the visual design. The fix is copy + a small `Provenance` badge.
- Does not require new data infrastructure. The provenance is already documented in code comments, just not surfaced to the user.

## Related deliverables

- [[ai-human-in-loop-policy]] (drafted same date): the rule that prevents this class of mistake from recurring.
- 2026-05-12-financial-model-scope.md: the GOC-only financial model, where the cost-per-bed assumptions will be properly sensitivity-tested rather than rendered as a "live" number.

## Acceptance criteria

When this audit is closed:

- [x] Page header no longer says "Live Data" or "Every number is live" (shipped 2026-05-12)
- [x] Each metric carries an honest provenance badge (shipped 2026-05-12)
- [x] Fleet Telemetry block reflects the F25-only state (shipped 2026-05-12)
- [x] Production Cost section carries the "model, not actuals" caveat (shipped 2026-05-12)
- [ ] A core team member (not AI) has read the rewritten page end-to-end and confirms they could defend every claim in a 30-minute funder Q&A

## What shipped 2026-05-12

Branch: `claude/stoic-ellis-cfca76`. TypeScript clean (`tsc --noEmit` exit 0). Files changed:
- `v2/src/lib/data/impact-model.ts` (+102 lines): added `Provenance` type, tagged every metric (20 of 20), fixed broken single-quote template literal in `DEFAULT_OPPORTUNITIES.wise-employment.title`, reframed "1,500 beds/year" language to "Year 1 target of 1,500 beds".
- `v2/src/app/impact/page.tsx` (+214 lines): new `ProvenanceBadge` component with five-level palette, badges wired into hero stats / dimension primary metrics / supporting metrics / production cost section, header copy rewritten ("Live Data" → "Impact Model" eyebrow, new tagline, new intro), legend block under header, FiveDimensions intro reworded, ProductionCost section now carries the SIH advisory-project caveat, HowWeTrack section carries explicit `live` vs `partial · reconnecting` pills, Fleet Telemetry description now says "1 of 38 deployed machines currently reporting; field reconnection program underway".

Provenance distribution after tagging (matches the audit's expected counts):
- 6 verified · 5 modelled · 6 estimated · 1 design · 2 partial

## 2026-05-12 follow-up: revenue metric corrected with verified Xero data

Following the Day 1 Xero extraction ([[2026-05-12-xero-day1-reconciliation]]), the `revenue` metric in `impact-model.ts` was found to be 26% high against the verified Xero number. Updated:

- **Before:** name "Annual Revenue", current $239,273, sourceDetail "Xero, goods project tagged transactions (March 2026 snapshot)"
- **After:** name "Annual Revenue (commercial, FY26 YTD)", current $164,548, sourceDetail explicit on income_type=commercial, project_code=ACT-GD, period FY26 YTD to 2026-04-30, with the reconciliation provenance and a note that grant revenue is tracked separately

Provenance level unchanged ('verified'), but the actual source is now defensible end-to-end. This is the kind of correction the AI-in-loop policy was designed to catch.

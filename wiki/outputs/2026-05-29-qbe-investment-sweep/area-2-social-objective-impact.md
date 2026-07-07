---
title: QBE Area 2 - Social Objective & Impact (Notion artifact body)
date: 2026-05-29
diagnostic_area: 02 - Social Objective & Impact
diagnostic_status: Priority gap (score 5, target 8)
build_status: Built - needs review
owner: Ben
---

# Area 2 - Social Objective & Impact

## Summary

Goods solves a real, repeated household-hardware problem in remote Indigenous
communities, and the evidence is operational, not aspirational. The Stretch Bed
is a live product, the QR-linked asset register is live, the consent-led story
base is live, and funder reports can be generated today. As of 29 May 2026 the
register shows 496 deployed bed units tracked (Stretch + legacy Basket), across
10 communities in asset records, with 558 asset rows carrying QR URLs and 229
scans (51 human, non-admin). What we cannot yet claim is measured wellbeing,
clinical health reduction, or government health savings. The remaining work is
not more story - it is the discipline layer: provenance labels, a Theory of
Change graphic, and a clean public/internal claim split.

## Where we are vs the diagnostic

The diagnostic scored impact 5/8 and flagged three things still needed before
external use: (1) impact provenance labels on `/impact`, (2) a Theory of Change
graphic, and (3) a public/internal claim split. Since the SIH V4 sign-off we have
built the substance of the claim split (a two-column public-vs-internal claim map)
and a Theory-of-Change results-chain in the review, and we have a canonical
numbers sheet that defines every count. The gap that remains is mechanical and
founder-owned: the `/impact` page code still renders "Live Data", "measured in
real time" and "Every number is live", `impact-model.ts` has no rendered
provenance field despite the 2026-05-12 audit claiming badges shipped, and the
speculative government health-savings line is still in the impact code. These are
P0 credibility risks because they repeat the exact diagnostic criticism.

## Priorities (next builds - real gap is signed/clean collateral, not narrative)

1. P0 - Ship the `/impact` fix: remove "Live Data"/"Every number is live", add a
   rendered provenance field to `ImpactMetric` (verified/modelled/target/future),
   and remove or relabel the speculative government health-savings line.
2. P0 - Founder decision on the defended public count (496 deployed bed units vs
   633 bed assets vs a rounded number) and which 3-5 stories/media are
   consent-cleared for QBE/SIH use.
3. P1 - Build the three report products (buyer / funder / internal ops) with a
   row-count vs quantity-count rule and a media-consent audit gate, and add the
   weekly internal ops fix-queue (missing QR/GPS/photo/consent, bad pulses,
   offline telemetry, report-copy drift).
4. P1 - Reconcile washer telemetry (raw usage logs 1,920 vs fleet KPI 17 cycles;
   1 of 13 machines online) before any external uptime claim.

## Proof links

- Full internal review: `wiki/outputs/2026-05-28-qbe-area-02-impact-full-review.md`
- Canonical numbers (only safe figures): `wiki/outputs/2026-05-29-qbe-canonical-numbers-sheet.md`
- Cross-area context: `wiki/outputs/2026-05-29-qbe-cross-area-alignment-review.md`
- Area 04 cost anchor: `wiki/outputs/2026-05-29-qbe-investment-sweep/01-bed-cost-model-reconfigured.md`
- Goods HQ (Notion): https://www.notion.so/177ebcf981cf805fb111f407079f9794
- Impact Claim Map (Notion): https://www.notion.so/358ebcf981cf810bb68dcc6f8913d317
- SIH Diagnostic Readiness Hub (Notion): https://www.notion.so/36debcf981cf814a8de1cd5da6d3387d
- Public/gated impact page: https://www.goodsoncountry.com/impact
- Asset register admin: https://www.goodsoncountry.com/admin/assets
- Reports admin: https://www.goodsoncountry.com/admin/reports
- QR bed-journey example: https://www.goodsoncountry.com/bed/GB0-156-40

## Claim labels in play

verified (deployed counts, QR/scans, story base, product spec), modelled (20kg
HDPE diverted per bed; survival rate), target (community production, local paid
work), future (longitudinal wellbeing/health outcomes), internal only (washer
telemetry, government health savings, user-claim adoption).

## Public copy risk for this area

"Every number is live" / "Live Data" / "measured in real time" on `/impact`;
speculative government health-savings from prevented RHD; implied measured
wellbeing or clinical (scabies/RHD) reductions; 25kg-plastic-per-bed and "fridge
expansion" / "live production data" wording in existing generated funder reports
(canonical is 20kg HDPE); stale public bed counts (369+, 520+, 600+) that mix row
vs quantity vs deployed.

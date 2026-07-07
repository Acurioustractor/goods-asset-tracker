# QBE Public-Copy Quarantine + Accuracy Sweep

**Date:** 2026-05-30 · **Method:** 20-agent workflow (12 Notion QBE areas + 7 source files) audited against the canonical numbers sheet + entity structure, Opus synthesis.
**Source data:** v2 Supabase + ACT-infra Xero mirror (2026-05-29/30). Canonical sheet: `wiki/outputs/2026-05-29-qbe-canonical-numbers-sheet.md`.

> Status: code edits **APPLIED + tsc-clean** on this branch. Notion edits **PROPOSED** (awaiting founder approval). Human-decision items **OPEN** (listed below).

---

## Headline

The investor-readiness system is structurally honest but numerically drifted: the full-review docs and Notion area diagnostics are well-calibrated (correct claim labels, no committed-capital or DGR-secured claims), but the underlying live code files still carry stale counts and several NEVER-SAY overclaims that would be the actual surface shown to a funder. The dominant risk is shipped public/funder-facing copy — the /impact page ("Live Data", "measured in real time", "every number is live", Centrecorp as a "commercial transaction"), content.ts ("ACT is a registered charity"), and funder-pages/funder-shared-content (unqualified QBE "$400K match", Centrecorp "Locked", DGR-routing implied live) — not the analytical docs. Numbers also disagree across files (deployed 496 vs 520/523/524, communities 8 vs 10 vs 27, breakeven 333/338/378, grant-received $450K vs $576K vs $588K vs $778K), so a funder comparing any two pages will see contradictions.

---

## The DGR question — resolved framing

Distinguish the ENTITY from the PATHWAY and never collapse them. Safest accurate public framing to use everywhere: "DGR-deductible giving is available only through The Butterfly Movement Ltd, an ACNC-registered charity. The arrangement routing Goods-on-Country philanthropy through Butterfly is being formalised for FY2026-27; confirm current routing with us before structuring a tax-deductible gift. Goods on Country / A Curious Tractor Pty Ltd are not themselves DGR-endorsed." This is true under BOTH possible states of the world: if Butterfly's ABN 22 155 132 684 already holds Item 1 DGR (per Area 09 ABN-Lookup), the statement "Butterfly is an ACNC charity / DGR is via Butterfly" is correct and we have simply not asserted Goods can receive DGR gifts today; if it does not, we have asserted nothing false because we only claimed the routing is being formalised. The one thing the founder must confirm to LOCK it (single fact): "Is the Goods-on-Country gifting/routing arrangement through Butterfly OPERATIVE now (so a donor can make a DGR-deductible gift earmarked for Goods today), or does it commence FY2026-27?" Once that yes/no is known, replace "being formalised for FY2026-27; confirm with us" with either "operative now" or "operative from 1 July 2026". Until then, do NOT call the pathway "active" (current funder-pages.ts:116 wording) and do NOT state DGR is live for Goods in either direction.

---

## Cross-area number conflicts (reconcile to canon)

- Deployed bed count: canon 496. Appears WRONG as 524 (Area 03 lines 58/207; Area 05 operating-signals table + metadata; Area 06 Supabase block; 02-area-by-area.md Area 6), 523 (Area 10 metadata), 520/633 conflated, and various STOP values (369+/400+/520+). content.ts:86 and pressBoilerplate:1232 say '400+', understating. Note: 524 = 496 beds + 28 washers (total deployed assets) — defensible ONLY with the split stated; bare '524 deployed' reads as 524 beds.
- Communities: canon 10 (verified delivery footprint). Appears as '8+' in content.ts:86, content.ts:1232 (pressBoilerplate), grant-content.ts:199 (whoDoYouWorkWith), and press boilerplate; as '7 active' in Area 07 community_rollup; as '27' in Area 10 metadata (CRM records); as '9' in Area 01 review table and Area 06 Supabase query. funder-shared-content.ts:7 already correctly says 10.
- Centrecorp received: canon $123,332 paid / $0 outstanding (10 invoices voided; $420K was a commitment). impact/page.tsx:618-622 frames it as a '$208K/$420K'-era 'commercial transaction / 109 beds sold / first B2B'. funder-shared-content.ts:52 and Area 10 finding show Centrecorp pipeline as 'Locked. Delivery in 1 month' at $80,250 — no canon source for a confirmed new order. grant-content.ts:134 correctly carries $123,332.
- Grant funding received: canon Xero-workpaper paid = $649,710.79; verified-paid named subset (Snow $402,929.79 + Centrecorp $123,332 + VFFF $50,000 + QIC $12,000) = $588,261.79. Conflicting live values: funder-shared-content.ts:9 '$450K+' (understates); grant-content.ts:201 '~$576K' (omits QIC $12K — should be ~$588K); grant-content.ts:130 totalReceived 778_162 (overstates by ~$128K vs Xero-paid; includes $201,900 unreconciled TFN/FRRR/AMP); Area 01 wiki '$460K'; Area 04 wiki Snow row '$193,785' (canon $402,929.79).
- Cost-per-bed / breakeven: canon direct BOM $469.79; Defy-kit direct $534.79; marginal today $684.79; factory marginal $425.74; community direct $270.74; fully-loaded low-vol anchor $600; breakeven factory ~338 / community ~333. Conflicts: Area 11 metadata quotes non-canon breakeven '378' and fixed block '~$110-123K' (canon $109,500); impact-model.ts:195/385/387/547 still carry stale v5 community direct '$140.74' and vision2030 target '141' (canon $270.74/271); Area 03:103 labels '$275.74' as 'Factory direct target' risking confusion with marginal $425.74; content.ts:601 quotes '$600 per bed' to Snow without qualification.
- Assets row/QR counts: canon bed asset rows 520 / all-status bed units 633. Conflicts: '561 rows / 674 qty' (Area 07, Area 08, grant-content.ts:100 comment, impact-model implied) is the ALL-PRODUCT total (beds + 41 washers); '558' QR-linked appears in grant-content.ts:100/200 and Area 10 — internally consistent but mixed with 561/633/674 without the beds-vs-all-products qualifier. Area 06 '664 active' (= 674 minus 10 retired) maps to no canon figure and is unlabelled.
- Washers: canon 41 rows / 28 deployed / ~14 honest-working. grant-content.ts:102 correctly uses 14 working / 28 deployed. funder-pages.ts:145, funder-shared-content.ts:83, and impact/page.tsx:561 imply fleet-wide live telemetry though only ~1 of ~38 (F25) reports.
- QBE match: canon CONTINGENT on raising ~$400K non-QBE capital FIRST; $200K vs $400K cap UNCONFIRMED. Stated as hard '$400K' fact in funder-pages.ts:118, funder-shared-content.ts:62 and :70, and Area 04 capital-stack scenario — all missing the contingency/unconfirmed-cap caveat.
- Entity (current operator): canon current = Nicholas Marchesi sole trader ABN 21 591 780 066; go-forward = A Curious Tractor Pty Ltd ACN 697 347 676. Area 01 review diagram and Area 04 name 'ACT Pty Ltd' / 'A Curious Tractor' as the CURRENT operator, omitting the sole-trader. content.ts:1229 calls ACT 'a registered charity' (false).
- Plastic diverted: canon ~9,920kg modelled (496 × 20kg). Conflicts: '9,225kg' in Area 02 wiki:193, outreach-targets.ts:202, and Area 02 finding; '9,900kg+' in grant-content.ts:200 (minor); story-atoms.ts:93/98 still say 25kg/bed (canon 20kg).

---

## ✅ Applied now (build-safe code edits — 20, tsc-clean)

| # | File | Change |
|---|---|---|
| 0 | `app/impact/page.tsx` | NEVER-SAY blacklist: 'Live Data' on the public /impact header. Data is a mix of verified/modelled/target, not live-streamed. |
| 1 | `app/impact/page.tsx` | NEVER-SAY: 'measured in real time'. Asset register updates on QR scan; only ~1 of ~38 machines reports telemetry. |
| 2 | `app/impact/page.tsx` | NEVER-SAY verbatim: 'Every number is live.' Mixed-provenance metrics cannot be claimed as all-live. |
| 3 | `app/impact/page.tsx` | Softer instance of the live-data overclaim; asset data is not streaming IoT. |
| 4 | `app/impact/page.tsx` | Only ~1 of ~38 deployed machines (F25) reports; 'in real-time' overstates fleet connectivity. |
| 5 | `app/impact/page.tsx` | NEVER-SAY: the RHD/health cascade is modelled, not clinically measured; 'measured outcomes' implies evidence that does not exist. |
| 6 | `app/impact/page.tsx` | Canon-confirmed (Ben 2026-05-12): Xero income_type=grant on ALL Centrecorp invoices. 'Commercial transaction / B2B / sold' misrepresents revenue nature to funde |
| 7 | `lib/data/content.ts` | NEVER-SAY blacklist: A Curious Tractor Pty Ltd is a trading company, not a registered charity and not DGR. Only Butterfly is the charity/DGR home. |
| 8 | `lib/data/content.ts` | Stale press boilerplate reproduced verbatim by media. Canon: 496 deployed across 10 communities (VERIFIED). '490+' is the conservative round form. |
| 9 | `lib/data/content.ts` | Public homepage stats. Canon: 520 bed asset rows / 633 all-status; '400+' understates and '8+' is wrong (10 verified). |
| 10 | `lib/data/content.ts` | Milestone labelled '2024+' reads as current; canon deployed is now 496. Reframe as historical threshold approaching 500. |
| 11 | `lib/data/grant-content.ts` | Stale '8+' vs canon VERIFIED 10-community delivery footprint. |
| 12 | `lib/data/outreach-targets.ts` | Stale March-compendium snapshot. Canon modelled total ~9,920kg (496 x 20kg). |
| 13 | `lib/data/story-atoms.ts` | Canon: 20kg HDPE/bed (products.ts). 25kg is the historical range upper end, not the canonical external figure. |
| 14 | `lib/data/story-atoms.ts` | Canon: 20kg HDPE/bed. Align highlight value with products.ts. |
| 15 | `lib/data/impact-model.ts` | Stale v5 volunteer-labour figure. Canon v6 community direct = $270.74 (fair-wage paid labour, locked 2026-05-28). |
| 16 | `lib/data/impact-model.ts` | vision2030 target 141 is the stale v5 volunteer floor rendered on /impact; canon v6 community direct = $270.74. Using 141 implies unpaid production. |
| 17 | `lib/data/impact-model.ts` | Public-rendered sourceDetail carries stale v5 $140.74; canon v6 = $270.74 with fair-wage labour. |
| 18 | `lib/data/impact-model.ts` | Exported FINANCIAL_SUMMARY vision2030 target uses stale v5 volunteer floor 141; canon v6 = $270.74. Consumed by downstream components. |
| 19 | `lib/data/impact-model.ts` | Without a status filter the count can return up to ~27 CRM community strings; canon verified footprint is 10. Note the filtering requirement so it is not read a |

---

## 🧑 Decisions only the founder can make (block final funder-facing wording)

### [4] v2/src/lib/data/funder-pages.ts:116 (DGR routing) + :118 (QBE $400K) + :145 (telemetry 'from day one')
*overclaim* — DGR: drop 'active' on the Goods pathway, apply the safe entity-vs-pathway framing. QBE: replace '$400K dollar-for-dollar match' with contingent/'cap to be confirmed' wording. Telemetry: stop implying fleet-wide real-time data. ALL THREE require founder confirmation of the routing live-date and the actual QBE cap before final wording.

### [5] v2/src/lib/data/funder-shared-content.ts:52 (Centrecorp 'Locked' $80,250) + :62/:70 (QBE $400K)
*error* — Centrecorp 'Locked. Delivery in 1 month' presents an unverified order as committed — downgrade to 'next order in discussion' pending founder confirmation a new order exists; do not state $80,250 as locked. QBE $400K -> 'up to $200K-$400K (cap TBC)'. Needs founder confirmation of the cap and the Centrecorp order.

### [8] v2/src/lib/data/funder-shared-content.ts:9 + grant-content.ts:130/201 (received totals) + :112-120 (deployments) + :104 (livesImpacted) + :28 (charityDgrHome)
*error* — Reconcile the grant-received aggregates: $450K+ understates, $576K omits QIC, totalReceived 778_162 overstates (includes $201,900 unreconciled). The correct verified-paid figure is ~$588K; decide whether to add QIC $12K to received[] and how to label the $201,900 unreconciled TFN/FRRR/AMP. livesImpacted '1,000+' is unsourced; charityDgrHome wording needs the entity-vs-pathway split. All need founder/accountant sign-off on the funder-facing total and on adding a financial line item.

### [9] v2/src/lib/data/content.ts:601
*overclaim* — '$600 per bed' quoted unqualified in a Snow proposal — confirm whether this block renders to funders; if so, qualify as a planning anchor (canon: $600 is the MODELLED fully-loaded low-volume anchor, not a clean per-bed cost; Defy-kit marginal is $684.79). Founder decision on whether/how to qualify.

### [10] funder-shared-content.ts:8 ('On-Country' processing) + :83 ('Real telemetry data', 'On-Country manufacturing model')
*overclaim* — On-Country HDPE processing and community-owned manufacturing are FUTURE pathways (canon NEVER-SAY: don't present as complete). Reword to 'target pathway' / 'building toward'. Build-safe in principle, but bundle with the same funder-page founder review (rank 4/5) to keep funder copy consistent.

---

## 📋 Proposed Notion edits (QBE Diagnostic DB — Tier-2, awaiting approval)

### [0] 01 - Vision & Ambition — `Public Copy Risk`
**Why:** Existing text warned on '600+' but missed the stale in-document figures (389/8+/Palm Island 141), the understated $460K, the current-operator entity error in the review diagram, and the modelled-not-measured RHD caveat — all flagged in the area findings.

**New value:**
```
Static public copy AND the wiki source document conflict with current data. v2 DB (28 May 2026): 633 bed assets tracked, 496 deployed beds, 270 Stretch qty, 133 Stretch deployed, 363 Basket deployed, 41 washer assets (28 deployed, ~14 honestly working), 10 delivery communities. The wiki source still uses stale March 2026 compendium figures (389 assets, 8+ communities, Palm Island 141 as 'largest' — Tennant Creek 159 is actually largest). Funding received in the wiki source ($460K) is understated vs WORKPAPER canonical $649,710 received. Avoid: 600+ beds delivered; 520+ beds across Australia; 8+ communities; Palm Island as largest; On-Country manufacturing complete. Current operator is Nicholas Marchesi sole trader (ABN 21 591 780 066), NOT A Curious Tractor Pty Ltd (that is go-forward). RHD/health pathway is modelled, not measured.
```

### [1] 02 - Social Objective & Impact — `Public Copy Risk`
**Why:** Adds the four concrete copy-risk vectors (table figures, 9,225kg, .au domain, 25kg) and the ACT-charity error that the existing text omitted; flags the live-data strings as in-flight fixes.

**New value:**
```
/impact still says 'Live Data' / 'measured in real time' / 'Every number is live' (NEVER-SAY — being fixed in code); current code mixes verified, modelled, estimated, partial and design-target metrics. Do not claim measured wellbeing/clinical health outcomes, full community-owned production, mature telemetry, or blanket media consent. Additional copy risks: per-community deployment figures in the wiki table are a pre-May-2026 snapshot (412 total) vs canonical 496 deployed; plastic diversion 9,225kg is stale (canon ~9,920kg modelled); live-site domain link points to goodsoncountry.au not canonical goodsoncountry.com; story-atoms.ts cited 25kg/bed vs canon 20kg; content.ts aboutACT described ACT as a registered charity (it is not).
```

### [2] 03 - Business Model — `Public Copy Risk`
**Why:** Existing text omitted the three highest-risk items for this area: the 600+ STOP, the stale 524 deployed count, and the $275.74-vs-$425.74 factory-cost confusion.

**New value:**
```
Do not imply standing inventory, mature ecommerce revenue, completed community-owned production, clean order revenue, or washer/fridge sales. Do not use '600+' as a delivered or deployed count — canonical deployed is 496 (363 Basket + 133 Stretch); 674 is the all-status register-unit total. Update any deployed-count claim from 524 to 496. Reconcile old AU$560/$600/$650 ranges against current AU$750. Do NOT quote AU$275.74 as the production cost target without stating it is direct materials only and excludes overhead/freight — the marginal FACTORY cost is AU$425.74 (MODELLED). Direct materials BOM AU$469.79 is VERIFIED (supplier invoices); fully-loaded figures are MODELLED.
```

### [3] 03 - Business Model — `Claim Labels`
**Why:** BOM was labelled 'modelled with source-backed inputs' which understates its evidential tier; canon marks the materials BOM VERIFIED while fully-loaded stays MODELLED.

**New value:**
```
AU$469.79 direct materials BOM = verified (supplier invoices reconciled 2026-05-28); AU$600 fully-loaded low-volume anchor and AU$275.74 factory-direct = modelled; AU$750 price = verified; CRM pipeline $3,418,698 / weighted $604,040 / won $898,863 = verified-internal (NOT committed capital).
```

### [4] 04 - Financial Management — `Public Copy Risk`
**Why:** Adds the ACCPAY-matching-gap, QBE-contingency, stale-Snow, Rotary-debtor, and current-entity corrections the existing text lacked; all flagged as material in the area findings.

**New value:**
```
Do not present financial pages as audited or accountant-endorsed (they are a Xero WORKPAPER). Do not use stale AUD 537,595 as current revenue without context. Do not use raw v2 order totals as revenue. Do not present draft/authorised invoices as cash. Do not claim profitability without founder time, capex, inventory and ACT shared services. Do not present ACCPAY due ($126,877.78) as confirmed debt — canon identifies it as a Xero payment-MATCHING gap pending reconciliation, NOT a creditor balance or director loan. Do not quote QBE $400K as a scheduled inflow — it is CONTINGENT on Goods first raising ~$400K eligible non-QBE capital (cap $200K vs $400K unconfirmed). Correct stale Snow Foundation figure ($193,785) to ~$402,930 paid (WORKPAPER). The $82,500 ACCREC due is Rotary (not received). Current entity is Nic Marchesi sole trader, not A Curious Tractor Pty Ltd (go-forward).
```

### [5] 05 - Strategic Planning & Risk — `Public Copy Risk`
**Why:** Adds the 524-vs-496 deployed guard and the stale-inventory/production guard the existing text omitted.

**New value:**
```
Do not present the current risk register as board-approved. Do not present pipeline value as committed revenue or QBE match evidence. Frame adaptive strategy as community-responsive planning plus explicit controls. Do not claim circular production without plastic QA, offcut and end-of-life controls. Do not use the old pitch document externally without refreshing price, cost, product and finance claims. Do not quote deployed-unit counts from internal data tables without verifying against the canonical register (496 deployed as of 2026-05-29; 524 is incorrect — it includes 28 washers). Do not use the March 2026 inventory snapshot (4 beds possible) or March production-shift data as a current supply/production figure in any investor or funder communication.
```

### [6] 06 - Process & Technology — `Public Copy Risk`
**Why:** Adds the 524-all-assets-vs-496-beds conflation, the 9-vs-10 community discrepancy, and the stale-production guard.

**New value:**
```
Do not imply automated supply chain, predictive maintenance, fleet reliability or complete SOP coverage are done. Keep raw QR, household, contact and support data internal. Founder-review all AI-assisted external material before sharing. Never quote 524 as a beds-deployed figure — 524 is total deployed across all asset types including 28 washing machines; canonical deployed bed count is 496. Communities served is 10 (verified), not 9. Production data in Supabase is from March 2026 — do not imply recent active production without a freshness check.
```

### [7] 06 - Process & Technology — `Claim Labels`
**Why:** 'modelled' applies to cost/breakeven/cashflow (Areas 03/04), not process-and-technology maturity; this area presents no models, so the label creates ambiguity.

**New value:**
```
verified, target, future, internal only
```

### [8] 07 - Governance, Data & Reporting — `Public Copy Risk`
**Why:** Adds the assets reconciliation, the 7-vs-10 community clarification, the Butterfly entity-vs-routing split, and the pipeline-not-committed guard the existing text omitted.

**New value:**
```
Do not present advisory support as a formal board, Butterfly as completed, or data sovereignty as fully automated. Distinguish (a) Butterfly entity DGR status [may be live now per ACNC] from (b) the Goods charitable routing through Butterfly [operational FY2026-27 — do not present as DGR-available for Goods today]. The CRM active-deal pipeline (AU$3.42m) is NOT committed capital and must never be quoted as a secured dollar figure. Cite communities served as 10 (verified delivery footprint), not 7 (CRM-active count). Reconcile assets data (561 rows/674 qty = all products incl. 41 washers vs canonical 520 bed rows / 633 all-status bed units) before external publication. Keep raw EL, household, QR, support and contact data internal. Founder-review all generated reports before external use.
```

### [9] 09 - Legal Structure — `Public Copy Risk`
**Why:** Replaces the duplicated, imprecise 'do not claim Butterfly is already the Goods charity home' with the accurate entity-vs-pathway framing and adds the A Kind Tractor 'active charity but not DGR' nuance.

**New value:**
```
Do not imply DGR-deductible giving to Goods via Butterfly is currently available — the Goods→Butterfly DGR pathway is operational from FY2026-27 (around 1 July 2026), not today. It IS correct to say Butterfly is the confirmed designated Goods charity/DGR home and an ACNC-registered charity. Do not conflate Butterfly's existing entity DGR status with the Goods routing arrangement being live. Do not use ACT Foundation/ACT Ventures as current legal entities. A Kind Tractor Ltd is an active ACNC charity but NOT DGR-endorsed and is dormant/not used. Do not claim community ownership/IP transfer is complete. Quarantine stale grant-content.ts legal identity claims. Confirm ABN/ACN details with Standard Ledger/ASIC before external publication.
```

### [10] 10 - Investors & Capital Raising — `Public Copy Risk`
**Why:** Strengthens the already-sound text with the specific number guards (496/524/10/27, $588K verified-paid, no single cost-per-bed, no 'Locked' Centrecorp) surfaced by the area findings.

**New value:**
```
Do not present active pipeline as committed capital; never quote the $3.4M CRM pipeline as a dollar figure (weighted $604K / won $898K are internal forecasts, not revenue). Do not present DGR1 as Goods' status; DGR-deductible giving is only via The Butterfly Movement Ltd and the Goods routing is operational FY2026-27 — confirm Butterfly's current status before stating it. Do not present QBE match as unlocked or quote '$400K' as confirmed (contingent on raising ~$400K non-QBE capital first; cap $200K vs $400K unconfirmed). Do not overstate community ownership, buyer commitments (no 'Locked' Centrecorp order), on-country production, or measured health outcomes. Beds deployed = 496 (VERIFIED); 524 = all deployed assets incl. 28 washers; communities = 10 (delivery footprint), 27 = CRM records. Do not quote a single cost-per-bed; use the marginal/fixed/breakeven triple. Verified-paid grants ~$588K (Snow $402,930 + Centrecorp $123,332 + VFFF $50K + QIC $12K), Xero workpaper not audited.
```

### [11] 11 - Cost Model v6 — `Public Copy Risk`
**Why:** Existing text missed the non-canon 378 breakeven, the unsourced $123K fixed block, the LIVE-dot overclaim, and the inferred/unverified status of the v6 investment-layer figures.

**New value:**
```
Do NOT imply the bed costs less than before — the reframe re-partitions $1,912 ($685 marginal + $1,227 fixed/bed at today's volume), it does not remove cost. Do not quote a single cost-per-bed externally ($534.79 is verified BOM direct, freight-excluded; $684.79 adds estimated $150 freight). Do not quote 378 as a breakeven — only ~338 (factory, canonical $109,500 fixed block) and ~333 (community) are canonical. Annual fixed block is $109,500 (default location), not $123K. Do not display or share the 'LIVE' dot/label on the investor cockpit — data is static JSON, not live-fed. All v6 investment-layer figures (3-site capex $300–450K, demand mix, margin waterfall, debt tranches) are inferred/unverified — flag as illustrative until vendor quotes and market anchors are confirmed. Founder-time inputs unverified until confirmed. Net-vs-gross capital ask must be resolved before any QBE number.
```

### [12] 11 - Cost Model v6 — `Claim Labels`
**Why:** The v6 investment-layer additions are tagged 'inferred'/'unverified' in the JSON; without those labels investors cannot distinguish verified BOM numbers from speculative capex/demand/margin/debt figures.

**New value:**
```
verified, modelled, inferred, unverified, target, future
```

### [13] 12 - Investor Alignment Tool — `Public Copy Risk`
**Why:** Adds the named-pipeline-dollar guard and the DGR/entity guard the existing text lacked — material because this tool is the document most likely shown directly to funders.

**New value:**
```
Pipeline is NOT committed capital — never quote the $3.4M CRM pipeline as a dollar figure in investor materials (weighted $604K, won $898K; not committed capital or verified revenue). QBE match is contingent, not unlocked (cap $200K vs $400K unconfirmed). Centrecorp $208K/$420K is stale (voided invoices) — $123,332 paid is canonical. Rotary $82,500 is invoiced-NOT-received. Do not assert DGR status or charitable registration for Goods on Country or A Curious Tractor Pty Ltd — DGR-deductible giving is only via The Butterfly Movement Ltd, and the Goods charitable pathway is operational from FY2026-27 (confirm current Butterfly status before stating it). Do not present Tab3 fit scores as investor-confirmed.
```

---

## Remaining build-safe fixes not auto-applied

- **[1] v2/src/app/impact/page.tsx (lines 874, 883-884, 887, 226, 561, 907)** — Remove NEVER-SAY live-data overclaims on the public /impact page: 'Live Data'->'Impact Data', 'measured in real time'->'tracked', 'Every number is live'->provenance line, 'live metrics'->'current metrics', fleet telemetry 'in real-time'->'where connectivity allows', 'measured outcomes'->'practical change'.
- **[2] v2/src/app/impact/page.tsx (lines 620-622)** — Reframe Centrecorp from 'commercial transaction / B2B Sales / 109 beds sold' to grant-funded institutional distribution partner (Xero income_type=grant on all invoices, canon-confirmed). Prevents misrepresenting revenue nature to funders.
- **[3] v2/src/lib/data/content.ts:1229** — Remove 'ACT is a registered charity' (NEVER-SAY: ACT/A Curious Tractor is a Pty Ltd, not a charity, not DGR). Replace with social-enterprise-only description.
- **[6] v2/src/lib/data/content.ts:86-88, :46, :1232 + grant-content.ts:199 + outreach-targets.ts:202 + story-atoms.ts:93/98** — Stale-count cleanup to canon: communities 8+->10; assets '400+'->'520+'; pressBoilerplate '400+ beds across 8+ communities'->'490+ beds deployed across 10 communities'; plastic 9,225kg->9,920kg; plastic-per-bed 25kg->20kg. All pure canon-number swaps.
- **[7] v2/src/lib/data/impact-model.ts:195, 385, 387, 547** — Replace stale v5 community-path direct cost $140.74 / target 141 with canon v6 $270.74 / 271 (fair-wage paid labour). Rendered on /impact; misstates the achievable cost floor and implies volunteer labour.
- **[11] Notion areas 01-12 'Public Copy Risk' fields** — Add the missing guards surfaced by this audit (deployed 496 not 524/523; communities 10 not 8/27; breakeven 338/333 not 378; ACCPAY is a matching-gap not debt; QBE $400K contingent/unconfirmed; DGR entity-vs-pathway; never quote $3.4M pipeline as a dollar figure; single cost-per-bed banned). See notionPropertyUpdates.
- **[12] Area 06/07 Notion 'Claim Labels' + Area 11 metadata** — Area 06: remove 'modelled' label (no models in process/tech area). Area 11: add 'inferred' and 'unverified' labels (v6 investment-layer figures are tagged unverified). Drop non-canon breakeven 378 and unsourced $123K fixed-block upper bound from Area 11 metadata.

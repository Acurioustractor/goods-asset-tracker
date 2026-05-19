# /impact page Q&A walkthrough: human-eyes defence checklist

> **Date:** 2026-05-12. **Owner:** Ben + Nic. **Purpose:** Close the final audit acceptance criterion: *"A core team member (not AI) has read the rewritten page end-to-end and confirms they could defend every claim in a 30-minute funder Q&A."* This is the checklist to walk before the next funder sees the page. Spend 45 minutes on it. If any answer makes you hesitate, fix the page first.

> **AI-in-loop policy applies.** This document was AI-drafted from the page source. Ben or Nic must read each claim, verify the source, edit anything that's drifted, and sign off. Do not share with anyone external until this pass is complete.

## How to use this document

1. Open /impact in one window. Open this doc in another.
2. For each section below: read the claim on the page, read the source/defence here, ask yourself **"would I say this on a call with a funder right now?"**
3. If yes: tick the box.
4. If no: edit the page first, then come back and tick.

## Section 1: Page header

**Claim:** "How We Measure What We Build. Five dimensions across our asset register, fleet telemetry, and community voices. A mix of verified data, modelled estimates, and design targets, updated as field evidence accumulates."

- [ ] **Source/defence:** This is the SIH-mandated honest framing. No specific numeric claim here. Defence: "We tag every metric with its provenance so funders can trust the dashboard without us oversetting expectations."

## Section 2: Loss Function hero (6 stats)

| Stat | Claim | Provenance shown | Defence |
|---|---|---|---|
| Assets Deployed | from Supabase asset count | verified | "Live count from our asset register, queried at page render." |
| Lives Impacted | computed (assets × 2.5) | modelled | "Modelled, average household size 2.5 from ABS remote-community data. We can show the calculation." |
| Plastic Diverted | computed (beds × 20kg HDPE) | modelled | "20kg HDPE per bed is the design specification, validated against our production runs." |
| Communities | distinct from asset register | verified | "Live count from the asset register." |
| Employment Hrs | computed (beds × labour hours) | modelled | "Modelled. Per-bed labour hours from production cost breakdown. We have the stage-by-stage figures behind it." |
| Invested | from compendium funding | verified | "From our funding records, cross-checked against Xero." |

- [ ] All six defences honest and defensible

## Section 3: Five Dimensions cards

### Health & Wellbeing (primary metric: Sleep Nights Provided)

| Metric | Provenance | Defence |
|---|---|---|
| Beds Delivered | verified | "Supabase asset register, live count." |
| Sleep Nights | modelled | "Beds × 2.5 people × 365 nights. Conservative on the household figure." |
| Wash Cycles | partial | "Fleet telemetry: 1 of 38 machines currently reporting. Reconnection program underway. Numbers shown are partial." |
| Product Survival Rate (95%) | estimated | "Estimate. 15-20 beds at 6+ months in field. Formal check-in system in development under Empathy Ledger consent infrastructure." |

- [ ] Defences ready

### Environmental (primary metric: Plastic Diverted)

| Metric | Provenance | Defence |
|---|---|---|
| Plastic Diverted | modelled | "Beds × 20kg HDPE. Material spec, validated at production." |
| Product Lifespan (10y) | design target | "Design target. Longest beds in field are about 2 years. We are confident but not yet measured." |
| Local Feedstock (60%) | estimated | "Estimate. Some HDPE still sourced metro; community collection programs in development." |

- [ ] Defences ready

### Economic (primary metric: Employment Hours)

| Metric | Provenance | Defence |
|---|---|---|
| Employment Hours | modelled | "Labour hours × beds. Per-bed hours from cost model." |
| FTE Jobs (2) | verified | "Two FTE at the production facility." |
| Production Cost per Unit ($550) | modelled | "Cost model. Sensitivity at scale is being validated through the SIH advisory project." |
| Annual Revenue ($239,273) | verified | "Xero, March 2026 snapshot. Cumulative across all sources to date is $537,595." |
| Government Health Savings | modelled | "Indicative model: RHD surgery cost × estimated cases prevented. Not validated with health economists yet. We flag this as indicative." |

- [ ] Defences ready (especially the Govt Health Savings one — it's the most easily challenged)

### Community Ownership (primary metric: Active Storytellers)

| Metric | Provenance | Defence |
|---|---|---|
| Active Storytellers | verified | "Empathy Ledger, 12 syndicated for Goods on Country project." |
| Community Production Days/Week (0) | verified | "Currently zero. Transition pathway under discussion with Oonchiumpa and PICC. We track this honestly because it is the long-term measure of success." |
| Community Employment % (30%) | estimated | "Estimate. Working through formal definition across active sites." |
| Communities Served | verified | "Distinct count from the asset register." |

- [ ] Defences ready

### Production Efficiency (primary metric: Units per Month)

| Metric | Provenance | Defence |
|---|---|---|
| Units per Month (15) | estimated | "Estimate during active production runs. Production is campaign-based, not continuous." |
| CNC Time (3.5h) | partial | "Measured at one facility. Single-site sample. Largest single time cost." |
| Facility Count (1) | verified | "One containerised production unit deployed." |
| Facility Utilisation (30%) | estimated | "Estimate. Formal time tracking in development." |

- [ ] Defences ready

## Section 4: Health Cascade (RHD)

**Claim:** "Rheumatic Heart Disease kills children in remote Australia. This is the chain we're breaking — and where our products intervene."

- [ ] **Defence:** The cascade itself (Strep A → scabies → RHD → surgery → premature death) is well-evidenced in remote Indigenous health literature (Miwatj Health, Menzies, AIHW). We can cite. **Our intervention claim** is on the bedding-and-laundry side of the chain (interrupts skin contact + clean clothing + clean bedding), not a direct treatment claim.
- [ ] **If asked:** "Beds delivered" = interrupting floor sleeping (better skin hygiene). "Wash cycles" = clean clothing/bedding (interrupts scabies chain). We can quote the Miwatj Health clinician quote on the page directly.
- [ ] **What we do NOT claim:** that we have reduced RHD prevalence. That measurement requires longitudinal health data and an evaluation framework, which is SIH Rec #5 (MEL framework, 6-12 months).

## Section 5: Production Cost & Employment

**Claim:** "Every bed produced creates 6.5 hours of employment for at-risk youth and community members. At our Year 1 target of 1,500 beds, that would scale to 9,750 hours."

- [ ] **Defence:** "Per-bed labour hours from our stage-by-stage production cost model. The 9,750 figure is conditional on the Year 1 target, which is itself a forecast." (The page now correctly says "would scale to" — confirm this reads right.)
- [ ] **Caveat on the page:** "These figures come from a modelled cost breakdown anchored on current production-run data. Cost sensitivity at higher volumes is being validated through the Social Impact Hub advisory project (May to July 2026)." — this exactly matches the SIH offer and should make the funder feel that we know what we don't know.
- [ ] **If asked about the $550 total:** sum of stages. Largest cost: CNC ($120) + Materials ($180) + Canvas/steel ($80). We can show the breakdown table.

## Section 6: Revenue Channels

The four segments on the page (B2B, Government, B2C, Corporate) each have a `currentEvidence` field. Walk each:

- [ ] **B2B (45% projected):** "109 beds sold to Centrecorp (first substantial commercial transaction)" — verifiable, defensible.
- [ ] **Government (25% projected):** "Conversations with NT government, health organisations requesting beds" — defensible if asked "are these signed?" Answer: no, not yet. Signed LOIs are an open action.
- [ ] **B2C (20% projected):** "Community consultations suggest camping/emergency bed market; 'cyclone beds' in NT" — honest about it being qualitative, not LOIs.
- [ ] **Corporate (10% projected):** "QIC interested in building 50 beds with staff for NAIDOC week" — verify whether this is current or stale before the next funder sees it.

## Section 7: Partners

Five partners listed with descriptions. For each:

- [ ] **Oonchiumpa / Bloomfield Family**: Kristy Bloomfield is a proposed Butterfly director. Status is "Active, delivering beds on country together." If asked: deep relationship across product co-design + cultural authority + future production facility hosting (Alice Springs).
- [ ] **Palm Island Community Company**: "New production site at Palm Island. PICC has existing funding to support at-risk youth through training programs." Verify the funding claim is current.
- [ ] **Centrecorp**: "First substantial commercial transaction, 109 beds purchased for distribution to communities." Anchor evidence, verifiable.
- [ ] **Dianne Stokes & Norman Frank**: Elder relationships, Pakkimjalki Kari naming. Defensible.
- [ ] **Defy Design**: "Taught ACT plastic recycling and helped build the containerised production plant. Training Palm Island team." Defensible.

## Section 8: Optimization Opportunities

Six opportunities are rendered. Each carries a `dataSource` line. Walk each:

- [ ] **CNC optimisation:** "Production cost breakdown (modelled)" — labelled honestly.
- [ ] **WISE employment:** "Production cost model + Eloise meeting" — fine, but note the Eloise reference. Verify the document is OK with that named attribution if it goes external.
- [ ] **B2B pipeline:** "Revenue segments + meeting notes" — fine.
- [ ] **Local feedstock:** "Environmental metrics" — fine.
- [ ] **Fleet utilisation:** "Fleet telemetry, daily_machine_rollups (partial reporting)" — honest about the partial state.

## Section 9: How We Measure

Four tracking systems shown with `live` or `partial · reconnecting` badges:

- [ ] **QR Code Tracking** (live): "Every bed and machine carries a unique QR code linked to its full history. Live across the asset register." Verifiable.
- [ ] **Fleet Telemetry** (partial · reconnecting): "1 of 38 deployed machines currently reporting; field reconnection program underway." Honest. Defensible.
- [ ] **Empathy Ledger** (live): "Live for the Goods on Country project (12 syndicated storytellers)." Verifiable.
- [ ] **Impact API** (live): "Structured JSON endpoint at /api/impact. Live." Verifiable.

## Section 10: CTA

"Be Part of This Impact ... Every bed purchased or sponsored adds to these numbers and changes a family's life."

- [ ] **Defence:** Soft CTA, not making impact claims. Three buttons: Shop, Sponsor, Impact API. All work.

## Cross-check on what we removed

These three problematic things from the pre-rewrite page should now be absent. Confirm:

- [ ] Eyebrow no longer says "Live Data"
- [ ] Tagline no longer says "Every number is live. Every target is accountable."
- [ ] "Real-time data from the field" copy in How We Measure is gone
- [ ] The literal `${TOTAL_LABOUR_HOURS_PER_BED.toFixed(1)}` placeholder (the broken single-quote bug in DEFAULT_OPPORTUNITIES) is gone, replaced with an interpolated value

## Sign-off

When the walkthrough is complete:

- [ ] Ben (or Nic) confirms: "I would say each of the above on a 30-minute funder call without notes."
- [ ] Date and initial here: __________________
- [ ] If any boxes are unticked, fix the page and re-walk those boxes only.

## After sign-off

- Tick the final acceptance criterion in [[2026-05-12-impact-page-audit]] ("A core team member (not AI) has read the rewritten page end-to-end...").
- The next external doc that goes out (Butterfly proposal, investor brief, funder application) gets the same walkthrough treatment under [[../articles/governance/ai-human-in-loop-policy]].

---
title: QBE Documentation Readiness — Deep Dive (built on the SIH V4 diagnostic)
date: 2026-05-28
status: working register — review before any external use
audience: Ben + Nic (founders), QBE Catalysing Impact steering committee prep
source diagnostic: /Users/benknight/Downloads/ACT_GOC Impact Investment Diagnostic V4 130526.pdf
companions: 2026-05-19-sih-diagnostic-v4-signoff.md · wiki/articles/program/* · financial-model Day 1-10 · 2026-05-28 cost tables
---

# QBE Documentation Readiness — Deep Dive

This maps **every "real thing" Goods needs documented for the QBE stages** to (a) what we actually have and where it lives, (b) the V4 diagnostic area + priority + timing, and (c) the real next action. It is a **readiness map, not a substitute for founder-authored collateral** — see the discipline rule below.

## 0. The rule that governs all of this (V4's hardest message)

V4 says this more than once (Process & Tech p8, Investors p10, Impact p5-6). It is the single most important thing to get right, because it is what cost us credibility in the pre-read:

- **Founder-authored.** External documents must be written/owned by Ben or Nic, grounded in lived practice — not AI-generated narrative. AI is for *recall, structuring and editing*, not original voice.
- **Human-in-the-loop, always.** "No documents should be shared for another party to review unless they have been audited, understood and — if needed — edited by a core member of the GOC team who can participate in detailed Q&A and stress-testing around their contents." (Formal policy: `wiki/articles/governance/ai-human-in-loop-policy.md`.)
- **Accurate, not aspirational.** V4 explicitly flagged that the pre-read materials "presented aspirational metrics as if they were currently active." Every figure must be tagged live vs modelled vs target.
- **The verbal beat the written.** "Verbal articulation during the diagnostic was richer and more compelling than the written collateral." The job is to close that gap — make the written convey the depth and community trust that already exists.

> **This deep-dive document itself is internal.** Nothing here goes to SIH/QBE/investors until a founder has audited it and can stand behind every number in a live Q&A.

## 1. The QBE stages and the Stage 2 submission set

**Stage 1 — Capability Building (now → Sept 2026):** $10k participation grant · diagnostic (V4, DONE) · SIH tailored advisory (→ production-cost tool) · PIN mentoring · **QBE skilled-volunteering project (→ market demand research)** · hackathon · check-ins.

**Stage 2 — Matched Funding:** apply **~Sept 2026**, assess **Oct**, outcomes **Nov**. Up to **$400k per enterprise**, **must be matched** by external investment/funding (repayable finance prioritised over grant). The submission set is the spine of this register:

1. Application form (SIH provides)
2. **Evidence of funding commitments** — legally binding LOIs / loan / investment agreements
3. **Supporting materials** — pitch deck, business plan, **financial model**
4. **Impact demonstration** — impact measurement report + beneficiary demographics
5. **Corporate structure & governance** — structure, **accountant-endorsed financials**, governance documents (board charter, risk register, policies)

Diligence frame (what the committee tests): legal vehicle clear? financials clean enough to underwrite? commitments real enough to count as match? impact model separates live from future? product claims backed by specs/photos/use/feedback? governance matches the risk of debt + scale? capital stack supports community ownership?

## 2. Master readiness register

Status: ✅ Have · 🟡 Partial · 🔴 Gap. Every "real thing", in priority order.

### A. GOC-only financial model + 3-yr forecast  — V4 Opp #1 (High, 0–2mo) · Stage 2 §3
**🟡 Partial.** Have: v0.1 built 12 May (Days 1–10) — 36-month cashflow, three scenarios (Base −$94k / Upside −$15k / Downside −$171k troughs), 12-instrument capital stack, 4-state buffer policy, unit economics. Locations: `wiki/outputs/2026-05-12-financial-model-day*.md`, `act-global-infrastructure/scripts/report-goods-cashflow-36mo.mjs`.
**Real gaps:** (1) integrate to a **3-statement** model (P&L + balance sheet + cashflow), not just cashflow; (2) **carve GOC cleanly out of ACT** — the Nic-personal-account spend ([[enterprise-hq-build]]) muddies entity boundaries; (3) **cost founder time at fair-market replacement** ($140k/yr default) — V4 flagged founder time is uncosted; gate = Ben + Nic FTE %; (4) **accountant endorsement**. Owner: Ben + accountant. Due: before Stage 2.

### B. Production cost model + sensitivity at scale — V4 Opp #2 (High, 0–3mo) · **SIH advisory project** · Stage 2 §3
**🟡 Partial → materially advanced THIS session.** Deliverable per V4 = an **Excel cost-calculation tool with user-editable assumptions**, scale sensitivity, and the on-Country-containerised vs centralised production mix.
Have (NEW, verified from real invoices 2026-05-28): direct bed cost **$523.70** (HDPE kit $344.05 ex Defy INV-1602/1732, canvas $93.50, steel $27, caps $3.20, assembly $55.95); fully-loaded **~$600/bed**; volume curve $550 (15/mo) → $479 (1,500/yr) → $351 (5,000/yr) → $270 (12,000/yr). Defy invoice core records + bed-input/facility tables now in Notion. Docs: `wiki/outputs/2026-05-28-bed-cogs-xero-reconciliation.md`, the three Notion tables, [[bed-cogs-reconciliation]].
**Real gaps:** build the **Excel tool itself** (editable assumptions, scale + production-mix sensitivity); validate the per-unit-at-scale decreases (V4 wants assumptions verified); pull **canvas/steel actuals** (in Notion/paper, not Xero); resolve **Zinus $28,691** (bed input?); freight per bed. NB V4 ties this project to the GOC-only model existing in parallel (Item A). Owner: SIH + Ben. Due: 0–3mo.

### C. Market demand research / market scan — V4 Opp #3 (High, 0–3mo) · **QBE skilled-volunteering project**
**🔴 Gap (accepted scope).** This is the one priority area with genuinely no v0.1 work. Have: strong *qualitative* demand (community voices, validated channels — institutional buyers, councils, NDIS/aged-care, business staff purchases); `market-intelligence-2026` (internal only). QBE project brief (p10): review prior production/sales runs + target customers; prioritise **≤4 segments** (primary: beds in deployment; secondary: washing machines); draft a **market scan with top-down market-size quantification**; recommend sales-approach changes.
**Real action:** scope and run the QBE project; output feeds Items A + I. Owner: QBE volunteers + Nic. Due: 0–3mo.

### D. Theory of Change + Impact Measurement / MEL — V4 Opp #5 (Med, 6–12mo) · Stage 2 §4
**🟡 Partial.** Have: /impact rewrite (12 May) with 20 metrics tagged 6 verified / 5 modelled / 6 estimated / 1 design / 2 partial; Empathy Ledger consent-led storytelling (data sovereignty is a *strength* per V4); QR-code bed tracking + washing-machine telemetry; ALMA framework draft.
**Real gaps:** an explicit **logic/results chain** (inputs → activities → outputs → outcomes → impact) with the connections drawn out; a **shortlist of priority metrics** (V4: resist tracking too much); **three tailored reporting products** (community / funders+investors / founders); keep data-sovereignty + storytelling as a core impact metric. Owner: Ben. Due: 6–12mo (a v0.1 ToC diagram is a fast win now).

### E. Governance & accountability structure (the trading Pty Ltd) — V4 Opp #4 (High, 0–6mo) · Stage 2 §5
**🟡 Partial.** Have: GOC Advisory Committee (Aboriginal leaders, **Zinus MD** — Australia's largest bedding manufacturer, Defy industrial-design partner, philanthropic supporters), monthly cadence; ACT Pty Ltd incorporated; Butterfly Movement Ltd DGR transition with founding directors confirming ([[butterfly_charity_transition]]).
**Real gaps:** **recruit 1–2 advisors/directors with commercial / social-enterprise scale-up experience** (V4 names this as the advisory skills gap — and the founders see the QBE program itself as the pathway); a **clear governance + accountability structure for the Pty Ltd** (board charter, decision rights); a **consolidated annual reporting cycle** (currently driven ad hoc by individual grant requirements). Owner: Ben + Nic. Due: 0–6mo.

### F. Risk register (updated, environmental explicit) — V4 Opp #6 (Med, 6–12mo) · Stage 2 §5
**🟡 Partial.** Have: a well-considered risk *philosophy* ("do no harm" / don't perpetuate the landfill problem); partial coverage of product-liability, cultural, data-sovereignty.
**Real gaps:** a **formal register** covering strategic / operational / financial / compliance / **environmental (recycled-plastic supply chain: waste streams, contamination, plastic stockpiling, pollution)** / cultural / data-sovereignty / product-liability. V4: do this *before the first containerised pilot facility is running*. Owner: Ben. Due: before pilot / 6–12mo.

### G. Legal structure + community-ownership pathway — V4 area 9 (Med)
**🟡 Partial.** Have: ACT Pty Ltd as the trading vehicle; hub-and-spoke vision (community-controlled production entities + parent holding IP/capital/shared services).
**Real gaps:** **specialist legal advice** on the realistic community-ownership model and the **trigger points** to move between structures; a decision on **whether/when GOC becomes a separate entity** from ACT Pty Ltd, timed to the raise; **mission-protection** (B Corp or social-purpose clauses, cultural-protection provisions). Owner: Ben + Mint Ellison. Due: timed to raise.

### H. Capital stack + binding funding commitments (the match) — Stage 2 §2 · V4 area 10
**🟡 Partial.** Have: 12-instrument capital stack across 6 layers; QBE match-contingency mapped (the $400k match is contingent on raising ~$400k first); Centrecorp + Snow anchor relationships. Docs: `wiki/outputs/2026-05-12-financial-model-day8-capital-stack.md`, [[capital-stack]].
**Real gaps:** **≥3 binding LOIs by 31 Aug 2026** from among SEFA / IBA / Minderoo / PFI / Snow R4 (these *are* the match — without them there is no Stage 2 ask); founders favour **patient/concessional debt, not equity** (equity only revisited when communities can hold it). Owner: Ben. Due: 31 Aug.

### I. Founder-authored investor narrative / pitch deck / business plan — Stage 2 §3 · **V4 area 10 = THE #1 investor-readiness gap**
**🔴 Gap (most critical).** V4 verbatim: *"Founder-authored, concise and accurate documentation supported by a financial model, projections and measurement framework, is the most critical investor-readiness gap."* Have: Strategy PD (Jan, dated language), March compendium (review-first), application draft (compressed), archived decks.
**Real action:** a **short, founder-authored** investor pack — clear problem, demonstrated traction, replicable model, demand exceeding supply across channels — backed by Items A/B/D. Must be written by Ben/Nic, not generated. This is the keystone; A, B, C, D all feed it. Owner: Ben + Nic. Due: before Sept.

### J. Accountant-endorsed financials — Stage 2 §5
**🔴 Gap.** Have: Xero data + reconciliations (cumulative revenue **$684,911** per our 12 May Xero pull; note V4 still cites the older $537,595 — corrected in the signoff memo). **Gap:** GOC financials carved from ACT and **accountant-endorsed/audited**. Depends on Item A. Owner: Ben + accountant.

### K. Impact measurement report + beneficiary demographics — Stage 2 §4
**🟡 Partial.** Have: asset register (496+ beds tracked across 8 communities, QR-stickered, GHL-linked), Empathy Ledger stories, /impact page. **Gap:** a **consolidated impact report** that separates live evidence from modelled, with demographics — distinct from the per-grant reporting we do now. Depends on Item D. Owner: Ben.

### L. Short strategic narrative (1–3 pages, founder-authored) — V4 area 5
**🔴 Gap (low-cost, high-value).** V4: "a short, founder-authored strategic narrative document (one to three pages) could be a low-cost, high-value asset." Owner: Ben/Nic. Due: now (fast win).

## 3. What's changed since V4 (fresh evidence to fold in)

V4 reflects the 1 May workshop. Since then (and especially this session) several gaps moved:
- **Production cost (Opp #2)** is no longer "some calculations in place" — we now have **real per-unit cost from actual Defy invoices** ($344.05 kit, $523.70 direct, $600 fully-loaded), a Defy invoice core-record, and a bed-input/facility cost table. This is the strongest single advance; it de-risks both the SIH advisory project and the financial model.
- **Financial model (Opp #1)** v0.1 exists (was "not built" at workshop).
- **ToC/MEL (Opp #5)** /impact rewrite shipped with live-vs-modelled tagging.
- **Governance (Opp #4)** Butterfly DGR transition in flight.
- **Revenue figure** corrected $537,595 → **$684,911** (signoff memo to Matt).
- **Bank/Xero now synced** to May; trip P&L + cost tables built.
Only **market demand research (Opp #3)** remains genuinely untouched — and that is the accepted QBE skilled-volunteering project.

## 4. Pre-send discipline checklist (apply to every artefact above)

Before anything leaves for SIH / QBE / an investor:
1. Authored or fully rewritten by a founder in their own voice?
2. Every number tagged **live / modelled / target**, and traceable to a source?
3. A founder can defend it in detailed Q&A and stress-testing?
4. Aspirational claims removed or relabelled?
5. Community consent confirmed for any story/photo/quote?
6. Audited against the current product truth (Stretch Bed: recycled HDPE + galvanised steel + canvas; not "woven/hardwood")?

## 5. Sequence to September (mapped to Stage 1 supports)

| When | Do | Stage 1 support | Items |
|---|---|---|---|
| 0–4 wks | Finalise GOC-only 3-statement model + founder FTE gate | PIN mentoring | A, J |
| 0–4 wks | Run SIH production-cost Excel tool off the new real costs | SIH advisory | B |
| 0–4 wks | Write the 1–3pp founder strategic narrative + ToC v0.1 diagram | — | D, L |
| 0–12 wks | Run QBE market-demand research project | QBE skilled volunteering | C |
| 0–12 wks | Recruit 1–2 commercial/scale-up advisors; draft board charter | program network | E |
| by 31 Aug | Land ≥3 binding LOIs (the match) | mentoring | H |
| by 31 Aug | Formal risk register (incl. environmental) before pilot | — | F |
| Sept | Assemble founder-authored investor pack + impact report | — | I, K |
| ongoing | Legal advice on community-ownership triggers | tailored advisory | G |

## Open decisions for Ben/Nic
- Founder FTE % allocation + fair-market rate (gates the financial model).
- Which ≤4 customer segments for the QBE market research.
- Which 3 funders to push for binding LOIs by 31 Aug.
- Confirm Zinus $28,691 purpose (bed input vs other) for the cost model.
- When GOC becomes a separate entity from ACT Pty Ltd (legal advice + raise timing).

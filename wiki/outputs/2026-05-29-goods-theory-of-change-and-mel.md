# Goods on Country — Theory of Change and impact measurement (MEL) framework

**Status:** Founder-review draft (v0.1, 2026-05-29). AI-assisted structuring and editing only; founders to verify and own every figure before any external use (per SIH guidance on human-in-the-loop and the ACT AI human-in-loop policy).
**Purpose:** The deliverable named in the SIH Impact Investment Readiness Diagnostic V4 (Section 2, "Opportunity Area: Theory of Change and Impact Measurement / MEL framework", p3, p5). Documents a clear logic chain (inputs to activities to outputs to outcomes to impact) and a shortlist of priority metrics, distinguishing what we track now from what we model or target.
**Audiences:** written to serve three readers, as SIH recommended (p6): community partners, funders and investors, and the founders themselves.

---

## 1. The problem (evidenced)

Mainstream household goods are not built for remote conditions. They fail fast, cost too much to replace, and the replacement cycle drains household income and fills remote-community tips. Three consequences matter most:

- **Health.** A lack of durable, washable bedding and of repairable washing machines is implicated in the scabies pathway. Untreated scabies and skin sores drive Strep A infection, which can lead to acute rheumatic fever and **rheumatic heart disease (RHD)**, a condition that remains far more common in remote First Nations communities than it should be: 94% of new acute rheumatic fever cases in Australia occur among Aboriginal or Torres Strait Islander people (END RHD 2018). The skin-infection arm of this pathway is recognised but still emerging in the evidence; the throat arm is well established (RHDAustralia 2025). Scabies affects as many as one-third of children in some remote communities (16 to 35% across studies; Davidson, Knight & Bowen 2020), and FRRR (2022) reports 59% of remote community homes do not have a washing machine. Functioning laundries matter: Housing for Health found 40% fewer infectious-disease hospitalisations where health hardware works (NSW Health 2010). See the health evidence appendix for verified citations. *"Scabies often leads to Rheumatic Heart Disease, so washing machines are essential to be able to clean infected clothing, bedding and towels."* (Jessica Allardyce, Miwatj Health, Gapuwiyak; recorded in `impact-model.ts`.)
- **Financial drain.** Short-lived goods force repeat purchases on households with the least to spend.
- **Environmental waste.** Failed products end up in landfill on Country, and very little plastic waste is captured and put back to use.

SIH assessed this problem definition as a **strength**: "clearly articulated and well-evidenced" (SIH Diagnostic V4, p5).

---

## 2. The model in one line

**Goods on Country designs durable, washable, repairable household goods in community, manufactures them on Country in part from recycled plastic, tracks every unit, and transfers production toward community ownership. Our job is to become unnecessary.**

The work runs as a continuous, community-led operating cycle. Community leads the design; Goods supports the building and the realising.

> **Listen** with community and partners → **Design** in community → **Make** on Country (collect, shred, press, cut, assemble) → **Deliver and track** every unit through the QR asset register → **Learn** from feedback, scans, telemetry and stories → **Improve** product, support and production. Repeat.

This adaptive cycle is itself a strength (SIH p7: "strategy is genuinely adaptive and responsive"). The logic chain below shows what that cycle *produces*.

---

## 3. The results chain (inputs → activities → outputs → outcomes → impact)

This is the spine SIH asked us to make explicit (p5). Outcomes are grouped short / medium / long, and mapped to the five impact dimensions in `impact-model.ts` and to the two QBE Foundation priorities (deck p3): **Climate Resilience** and **Inclusion**.

### Inputs
Community relationships and leadership · recycled HDPE feedstock collected on Country · galvanised steel and Australian canvas · on-Country containerised production plant · design IP and brand · capital (grants and catalytic / patient finance) · founder and team time · delivery and health partners (community-controlled health orgs, councils, Oonchiumpa, Palm Island Community Company).

### Activities (the operating cycle)
Listen · Design in community · Manufacture on Country · Deliver and track (QR) · Learn (feedback, QR scans, machine telemetry, consent-led stories) · Improve.

### Outputs (what the activities produce, mostly tracked)
Beds and washing machines delivered · plastic diverted · wash cycles run · employment hours worked · QR-tracked assets in a live register · consent-led stories captured · communities reached.

### Outcomes
| Horizon | Health & Wellbeing | Environmental (→ Climate Resilience) | Economic + Community Ownership (→ Inclusion) |
|---|---|---|---|
| **Short** | Off-floor sleeping; a clean-bedding and clean-clothing pathway in the home | Plastic captured and re-used; fewer failed products to landfill | Household income retained (fewer forced replacements); first local paid work |
| **Medium** | Reduced exposure to scabies and Strep A; durable assets still in use at 12 months+ | A working circular loop (community plastic → bed components); replacement cycles lengthened | Community members trained and employed; institutional demand converting to standing orders |
| **Long** | Reduced RHD burden (with health-evidence partners) | A measurable environmental-health evidence base | Community-owned production entities operating on Country; sustainable local livelihoods |

### Impact
Healthier, more self-determining remote communities, with locally-owned manufacturing and a circular economy that keeps value on Country. The central organisation's role shrinks over time by design.

---

## 4. Priority metrics shortlist

A deliberately short list (SIH p6 warned against tracking too much). **Every metric carries an honest status flag, because SIH twice flagged that our materials have presented aspirational metrics as if they were currently active (p6, p8). That stops here.**

**Status key:** ● Tracked (live data) · ◐ Partial (data thin or partial coverage) · ○ Modelled (computed proxy, not measured) · □ Design target (not yet validated in the field)

| # | Metric | Status | Current | Source | Year 1 target | Vision 2030 | Proxy for |
|---|---|---|---|---|---|---|---|
| 1 | Beds delivered | ● | 495 beds (132 Stretch + 363 Basket) | QR asset register (Supabase), verified 2026-05-26 | 1,500 | 25,000 | Households with safe off-floor sleeping |
| 2 | Communities reached | ● | 9 | Asset register (distinct communities) | 12 | 60 | Reach across remote Australia |
| 3 | Plastic diverted from landfill | ◐ | ~2,640 kg | Computed: Stretch beds × 20kg HDPE (Basket beds excluded, not HDPE) | 30,000 kg | 500,000 kg | Circular economy / Climate Resilience |
| 4 | Wash cycles completed | ◐ | Partial telemetry | IoT usage logs across ~28–38 deployed machines, subset reporting | 15,000 | 500,000 | Clean bedding → scabies / RHD prevention |
| 5 | Consent-led stories / active storytellers | ● | 12 Goods stories | Empathy Ledger (goods project); storytellers retain the right to retract | 50 storytellers | 300 | Community voice + **data sovereignty** |
| 6 | Commercial revenue | ● | $61,449 FY26 commercial (cumulative all-source ≈ $537,595) | Xero (via ACT infra), 2026-05-27; SIH cumulative figure p1 | $1.1M total | $15M | Financial sustainability / viability |
| 7 | Sleep-nights provided | ○ | Modelled | beds × 2.5 occupants × 365 (`impact-model.ts`) | 1.37M | 22.8M | Reach proxy (not a measured health outcome) |
| 8 | Employment hours created | ○ | Modelled; 2 FTE today (founders) | ≈6.5 labour-hours/bed × beds (`impact-model.ts`); SIH p8 on FTE | 9,750 hrs | 162,500 hrs | WISE economic inclusion |
| 9 | Health-system cost avoided (RHD) | ○ | Modelled / aspirational | RHD surgical admission ≈ $70K (END RHD 2018) × cases notionally prevented | — | — | **Modelled only; do not use externally until a health partner validates it. NOT $250K (unsubstantiated).** |
| 10 | Product survival at 12 months / lifespan | □ | 10-yr design life; field data thin (~15–20 beds with 6+ months) | Check-in system + design spec | 90% survival | 95% / 15-yr | Durability (environmental + health) |
| 11 | Community ownership (binary month-6 test, per site) | □ | Not yet met at any site | Handover checkpoints (see callout) | First site passes 1+ tests | All 4 passed at multiple sites | Self-determination / the handover itself |

> **Data sovereignty is itself a core impact metric (SIH p3).** Photographs and stories are shared back to community, storytellers are told where and how their stories are used, and they may retract at any time. We count consent-led stories as proof of impact, not just bed counts.

> **Community ownership is a binary terminal outcome, not a soft value (from the JusticeHub handover checkpoints).** At each production site we test four things at month 6, where partial counts as NO: (1) the community holds the keys to the factory; (2) a named community lead is on payroll; (3) a community-controlled entity invoices the buyer directly; (4) at least 50% of production is community-controlled. Passing all four is the clearest proof that "our job is to become unnecessary" is real, and it is readable against OCAP / Indigenous data-governance principles.

> **Viability is governed by a unit-economics decision band (from the delivered-cost report):** ≥25% margin = scale · 15–24% = workable · 5–14% = red flag · <5% = stop. Fully-loaded cost is currently ≈$550–600/bed against a $750 price (`impact-model.ts`; bed COGS reconciliation), i.e. roughly the "workable" band today, improving as volume rises. This keeps the "real enterprise, not charity" spine honest.

---

## 5. How this maps to QBE and to investors

- **QBE Foundation priorities (deck p3):** *Climate Resilience* is carried by the Environmental dimension (plastic diverted, circular loop, longer product life). *Inclusion* is carried by the Economic and Community Ownership dimensions (local paid work, WISE employment, ownership transfer) and by the Health dimension (closing a gap that falls hardest on remote First Nations communities).
- **The strongest under-used outcome is the health-to-education-to-justice link.** Durable bedding and working washing machines reduce skin infection and illness, which keeps children in school and away from the pathways that lead to the justice system. This is documented internally (the "bed to courtroom" claim) but has not yet been pitched to a public-health funder. It maps squarely onto QBE's inclusion priority and differentiates Goods from crowded youth-justice framing.
- **QBE Stage 2 is catalytic match-funding** (up to $400K, must at least match external investment secured, repayable finance prioritised; apply Sept, assess Oct, outcomes Nov 2026 — deck Structure and Funding slides). The metrics above are framed to evidence both *impact* and the *commercial traction* that unlocks matched capital.
- **CASE Investor Alignment tool:** impact investors assess Social Mission, Vision, and **Impact Evidence** ("we can provide the level of impact evidence expected"). Sections 1–4 of this document are written to be that evidence: clear mission, explicit logic chain, and a metrics shortlist that is honest about what is measured versus modelled.

---

## 6. What we track now vs what we will track

**Tracking now (live):** beds delivered and communities reached (QR asset register); consent-led stories (Empathy Ledger); commercial revenue (Xero); plastic diverted (computed from tracked Stretch-bed count).

**Tracking partially (build-out needed):** washing-machine wash cycles (fleet telemetry is live but only a subset of machines report; fleet connectivity is a known gap).

**Modelling only (not yet measured, label as such everywhere):** sleep-nights, employment hours, and health-system cost avoided / RHD cases prevented. The RHD cost-avoided figure must not appear in external collateral until a health-evidence partner validates the causal link.

**Design targets (field validation underway):** product survival and lifespan; local feedstock percentage; community production days per week and local-workforce percentage.

---

## 7. Sources and provenance

- **SIH Impact Investment Readiness Diagnostic V4**, 13 May 2026 (`~/Downloads/ACT_GOC Impact Investment Diagnostic V4 130526.pdf`): problem evidence (p5), Theory of Change / MEL opportunity area (p3, p5), aspirational-vs-active warning (p6, p8), maturity scores (p4, Social Objective and Impact Measurement 5→8), cumulative revenue ≈ $537,595 (p1).
- **QBE Catalysing Impact 2026 Induction** deck (`~/Downloads/Catalysing Impact 2026 - Induction - Slides.pdf`): Foundation priorities Climate Resilience + Inclusion (p3); program structure and Stage 2 catalytic match-funding (Structure, Funding slides).
- **CASE Smart Impact Capital — Investor Alignment Tool** (`~/Downloads/Investor Alignment Tool - CASE Smart Impact Capital.xlsx`): investor fit criteria including Social Mission, Vision, Impact Evidence (Tab 1).
- **`v2/src/lib/data/impact-model.ts`**: the five impact dimensions, metrics, current values, targets, sources and proxies; health cascade; production cost model.
- **Asset register** (Supabase, v2 project `cwsyhpiuepvdjtxaozwf`), counts verified 2026-05-26: 495 beds (363 Basket + 132 Stretch) + ~28 washers across 9 communities.
- **Xero** (via ACT infra Supabase `tednluwflfhxyucgwigh`), 2026-05-27: commercial revenue figures.
- **ACT infra repo** (`/Users/benknight/Code/act-global-infrastructure`): PFI EOI (`thoughts/shared/plans/_archive/2026-05/pfi-goods-on-country-eoi.md`, problem→ToC→outputs→outcomes §2, 5 impact dimensions §8, measurement framework §9); Goal Stack (`wiki/projects/goods.md`); narrative claims (`wiki/narrative/goods/claim-bed-to-courtroom.md` and siblings); handover checkpoints and delivered-cost band (`JusticeHub/output/goods-on-country/{community-ownership-checkpoints,actual-delivered-cost-report}.md`); health evidence essay (`wiki/raw/2026-03-12-article-the-cure-already-exists.md`).
- **Health evidence appendix** (`wiki/outputs/2026-05-29-goods-health-evidence-appendix.md`): verified primary citations per health claim — Davidson/Knight/Bowen 2020 (MJA, scabies); RHDAustralia 2025 guideline (pathway); END RHD 2018 (94% ARF disparity; ~$70K per surgical admission); FRRR 2022 (59%); NSW Health 2010 Housing for Health (40% fewer infectious-disease hospitalisations); AIHW HPF 2026 (crowding).

**Known reconciliation flags to resolve before external use:**
1. Plastic-diverted: `impact-model.ts` computes all beds × 20kg; only Stretch beds use HDPE, so the honest figure is Stretch beds × 20kg (≈2,640 kg), not all beds.
2. Washing-machine count: fleet records show ~38 deployed, the asset register shows ~28; reconcile before quoting.
3. Revenue basis: $61,449 is FY26 commercial only; ~$537,595 is cumulative all-source. State the basis whenever quoted.
4. RHD cost-avoided is modelled only. Use ~$70K per surgical admission (END RHD 2018), NOT $250K (unsubstantiated; corrected by the health-evidence workflow 2026-05-29).
5. Plastic-per-bed figure drifts across sources: 20kg (project `CLAUDE.md` / `products.ts`, treated as canonical here) vs 25kg (PFI EOI / `goods.md`). Use 20kg until reconciled.
6. Stale deployment figures in act-infra ("389 beds / 1,000+ lives / 9,225kg") are superseded by the current register (495 beds / 523 deployed units, 2026-05-26); do not quote the older numbers.
7. Health prevalence stats are now verified in the health evidence appendix (2026-05-29): scabies "up to about one-third / 16 to 35%" (Davidson et al. 2020); the skin to RHD pathway is "recognised but emerging" (RHDAustralia 2025); FRRR 59% means homes that "do not have" a machine (NT context). Use the appendix wording, not the older phrasings.

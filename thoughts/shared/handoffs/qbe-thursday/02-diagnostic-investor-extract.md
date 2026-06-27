# QBE Thursday — Diagnostic + Investor Alignment Tool Extract

Grounding extract for the QBE conversation. Facts only; scores/names/weights quoted verbatim. Anything not in source is marked UNCLEAR. Nothing invented.

Sources:
- **S1 (PDF):** `~/Downloads/ACT_GOC Impact Investment Diagnostic V4 130526 (1).pdf` — "Impact Investment Readiness Diagnostic, Report and Recommendations, May 2026" by **Social Impact Hub (SIH)**. Client: A Curious Tractor — Goods on Country. 10 pages.
- **S2 (XLSX):** `~/Downloads/Investor Alignment Tool (2026).xlsx` — "Investor Alignment Tool" (generic SIH template; see major caveat below).

---

## PART A — Impact Investment Readiness Diagnostic (S1)

### Provenance / dates
- Diagnostic workshop held with **Benjamin Knight (Co-founder)** and **Nicholas Marchesi (Co-founder)** on **1 May 2026**.
- Report cover date: **May 2026**. Filename version tag: **V4 / 130526** (i.e. 13 May 2026). Authored by **Social Impact Hub**.
- Stated intent: independent analysis for ACT's co-founders, focused on making GOC well-positioned to grow through impact investment funding.

### Maturity scores — Figure 1 (page 4), VERBATIM
Scoring key (verbatim): `0–2 Initial/ad hoc/limited evidence` · `3–4 Developing, some evidence of ability` · `5–7 Defined or managed, evidence of some strength` · `8–10 Established and optimised, evidence of strength`.

| # | Diagnostic Area | Current State | Future State | Gap | Priority Opportunity Area |
|---|---|---|---|---|---|
| 1 | Clarity of Vision and Ambition | 8 | 9 | 1 | — |
| 2 | Social Objective and Impact Measurement | **5** | 8 | **3** | **Yes** |
| 3 | Business Model Clarity and Sustainability | **4** | 7 | **3** | **Yes** |
| 4 | Financial Management and Performance | **4** | 7 | **3** | **Yes** |
| 5 | Strategic Planning and Risk Management | 5 | 7 | 2 | **Yes** |
| 6 | Process and Technology Maturity | 7 | 8 | 1 | — |
| 7 | Governance, Data and Reporting | **5** | 8 | **3** | **Yes** |
| 8 | People and Organisation | 6 | 7 | 1 | — |
| 9 | Legal Structure | 5 | 7 | 2 | — |
| 10 | Investors and Capital Raising | 6 | 8 | 2 | — |

(Note: there are exactly 10 areas, not the "12 QBE diagnostic areas" tracked elsewhere in the repo — that is a different framework. UNCLEAR whether they map 1:1.)

### Weakest current-state areas (lowest scores)
- **Area 4 Financial Management = 4** (lowest, tied) — priority.
- **Area 3 Business Model Clarity = 4** (lowest, tied) — priority.
- Then **Areas 2, 5, 7 = 5**. Of these, 2 and 7 also carry a 3-point gap and are flagged Priority.

### Largest gaps (current vs future) = the priority opportunity areas
The five "Yes" priority areas: **2, 3, 4, 5, 7.** Four carry a 3-point gap (2, 3, 4, 7); Area 5 carries a 2-point gap but is still flagged priority.

### The single most critical gap (the "keystone") — VERBATIM
From Area 10 detailed findings (page 10): *"Founder-authored, concise and accurate documentation supported by a financial model, projections and measurement framework, is the most critical investor-readiness gap."* So the keystone is **investor-ready documentation + GOC-specific financial model/projections + impact measurement framework**, founder-authored.

Reinforced under Area 4: *"A dedicated GOC financial model and reporting, separated from the broader A Curious Tractor organisation, will be needed to support investor due diligence."*

### Recommendations — Section 2 table, in SIH's stated priority order
| Priority | Diagnostic Area | Opportunity / Action | Timing | Tag |
|---|---|---|---|---|
| High | 4. Financial Mgmt | **Financial model and forecasts** — GOC-only model carved out of ACT accounts; unit economics, scenarios, 3-year forecast; cost founder time at fair-market replacement rate | 0–2 months | — |
| High | 3. Business Model | **Detailed production cost estimates with sensitivity analysis at different scales** — verify per-unit cost decreases at scale (esp. on-Country containerised) | 0–3 months | **\*\* Priority Advisory Project \*\*** |
| High | 3. Business Model | **Market research to quantify potential market size for core products** | 0–3 months | **\*\* Proposed QBE Project \*\*** |
| High | 7. Governance | **Develop governance and accountability structures for independent oversight** — recruit 1–2 advisors with commercial / social-enterprise scale-up experience; governance structure for the new Pty Ltd | 0–6 months | — |
| Medium | 2. Social Objective | **Theory of Change + Impact Measurement / MEL framework** — ToC with results chain + shortlist of priority metrics; keep data sovereignty + storytelling as core | 6–12 months | — |
| Medium | 5. Strategic Planning | **Updated risk register** — strategic, operational, financial, compliance, **environmental**, cultural / data-sovereignty, product-liability | 6–12 months | — |

**The proposed QBE skilled-volunteering project = "Market Demand Research"** (page 10): quantify demand to sharpen growth/scale vision. Scope: review prior production/sales runs + target customers; prioritise **max 4 customer segments** (primary = beds in deployment, secondary = washing machines, working prototype); draft a market-scan doc with top-down market-size quantification; give initial sales-approach recommendations.
- Separately, SIH offers a **tailored advisory project = "Production Cost Estimates"**; final deliverable = *a production cost calculation tool in Excel with user-editable assumptions* — explicitly dependent on the GOC-only financial model being established in parallel.

### Overall readiness verdict (Executive Summary, p1) — VERBATIM essentials
- *"GOC is at an early commercial stage. Cumulative revenue to date is approximately **$537,595**, generated through a mix of philanthropic support and project-funded bed deliveries."* (Repeated p7. NOTE: this is SIH's figure; repo canon for total received is **$741,111** — the diagnostic's $537,595 looks like a narrower cut. Flag for reconciliation, do not cite the $537,595 as the canonical total.)
- Orders typically tied to specific funders; **no standing inventory yet.**
- Seeking to raise capital via **grants and patient or concessional debt** to fund: standing inventory build, the next on-Country production facility, and key hires (**General Manager, Business Development**).
- *"The enterprise has the potential to attract early-stage impact capital, but will need substantial work over the next **6–12 months** across financial structuring, governance, investor-ready collateral and improved documentation."*
- On capital type (Area 10): founders **assess equity as inappropriate for the current stage and structure**, would only revisit equity within a future model where communities themselves become equity holders.

### Notable strengths (selected, verbatim-grounded)
- Area 1 (score 8): clear, compelling, well-articulated mission; clear short-term direction (deploy next on-Country facility, set GOC up as own entity) and long-term Aboriginal/locally-owned ownership pathway.
- Area 6 (score 7): comfortable with custom AI agents, Notion knowledge base, IoT washing machines + QR product tracking; clear automated-supply-chain vision.
- Recurring caution (Areas 2 & 6): pre-meeting materials **presented aspirational metrics as if currently active**; SIH stresses a **human must be in the review loop for all AI-generated documentation** before it goes to SIH/funders. Verbal articulation in the workshop was richer than the written collateral submitted in advance.

---

## PART B — Investor Alignment Tool (S2)

### MAJOR CAVEAT — read before using
**The tool is a BLANK SIH template, NOT a completed GOC investor shortlist.** Tabs 1–3 contain only placeholder rows ("[Enter Investor Name]", "[Enter Website]") with all alignment cells at default `0` / "No". **There are NO real GOC funders, scores, or rankings entered anywhere in the live tabs.** Do not present this file as "GOC's scored investor list" — it has not been filled in.

The only named investors in the whole workbook are **four fictional examples** on the `Example` tab (a worked demo for a fictional B Corp "Pathways Co"). They are NOT GOC's investors and NOT real organisations per the tool's own framing.

### Sheet structure / purpose
| Sheet | Purpose |
|---|---|
| Introduction | Explains the 3-step process; "clear, evidence-based shortlist of investors worth pursuing." |
| Tab 1. Our Needs | Define your own criteria: 8 Knockout + 14 Fit criteria, assign High/Med/Low priority to each Fit criterion. **Blank for GOC.** |
| Tab 2. Investor Tracking | Running CRM-style log per investor (contact, correspondence, connectors, engagement stage, NDA, likelihood, est. amount, blockers, owner, red flags, priority). **All placeholder; no investors.** |
| Tab 3. Alignment Tool | Rate each investor "Very/Somewhat/Not Aligned/Don't Know" per criterion; auto-rolls into 3 result columns. **All placeholder.** |
| Example | Worked demo (Pathways Co vs 4 fictional investors). |
| Dropdowns | Lookup lists (see below). |

### Scoring methodology (VERBATIM from the template)
**This is a knockout + count-based pass/fail model. There are NO numeric weights** — priority is captured as a High/Medium/Low *label* per Fit criterion, not a multiplier.

**8 KNOCKOUT criteria** ("must be aligned on these"): Investment Geography · Legal Structure · Investment Size · Timing · Alignment on Exit Expectations · Impact Alignment · Capital Type & Structure · Stage of Growth.
- Plus a separate **"Lead investor role"** prioritisation field (Lead / Follower / Don't know) on Tab 3.

**14 FIT criteria** (negotiable), in 3 groups:
- *Mission & Vision (2):* Social Mission, Company Vision.
- *Expected From Us (4):* Control and influence, Restrictions, Impact Evidence, (and Connections sits here in the header but is grouped under the next set — see note).
- *Expected From Our Investors (8+):* Connections, Geography experience, Industry experience, Business Challenge Experience, Working Style & Behaviour, Commercial Flexibility, Term Complexity, Reputation & Founder Feedback, Impact on future investments.
- (Header grouping is slightly inconsistent across rows; total Fit criteria = **14**, confirmed by the "/14" result denominator.)

**Results columns (Tab 3, RESULTS block), VERBATIM logic:**
- **Knockout Criteria** → Yes/No: *"For all 8 knockout criteria are you somewhat or very aligned"* (binary gate — any miss = "No").
- **High Priority Fit Criteria** → e.g. "7/7": *"For how many high-priority fit criteria are you somewhat or very aligned"* (out of however many YOU tagged High).
- **All Fit Criteria** → e.g. "14/14": *"For how many overall fit criteria are you somewhat or very aligned."*

Alignment rating dropdown values: **Very Aligned / Somewhat Aligned / Not Aligned / Don't Know / N/A.** Internally each "Very or somewhat aligned" = 1, else 0; summed. Priority dropdown: High / Medium / Low / N/A. Investor-type dropdown (Tab 2/Dropdowns): Angel, Friends & Family, Family Office, Community or Family Foundation, CDFI or DFI, Private Foundation, Government, International NGO, Corporate, Investment Fund, Institutional Investor or Bank, Fellowship/Incubator/Accelerator, Crowdfunding platform, Other.

### Fictional EXAMPLE investors (demo only — NOT GOC's investors, NOT real)
Verbatim names + scores from the `Example` tab. Flagged FICTIONAL.

| Investor (FICTIONAL) | Lead role | Knockout pass | High-Priority Fit | All Fit | Notes (verbatim gist) |
|---|---|---|---|---|---|
| [Enter Investor Name] (row 11 — best case) | Lead | **Yes** | 7/7 | 14/14 | Experienced lead, $500K–$2M, patient 8–10yr, workforce-inclusion thesis, flexible capital |
| Bennelong Foundation | Follower | **No** | 7/7 | 14/14 | Fails knockout on Investment Size (grants max ~$250–300K, below target) and can't lead equity |
| Australian Employment Innovation Fund | Don't know | **No** | 4/7 | 9/14 | Fails on timing (12–18mo), legal structure (NFP-only), concessional loans only, heavy reporting |
| Blue River Capital | Follower | **No** | 5/7 (shown "5/4") | 10/14 | Commercial VC; fails on exit expectations (market-rate, 5–7yr exit), heavy board control/dilution |

(The "5/4" in Blue River's High-Priority Fit cell is a template formula artefact; treat as UNCLEAR.)

---

## Bottom line for Thursday
1. **Diagnostic weakest/priority areas:** Financial Management (4) and Business Model Clarity (4) are the lowest current scores; the five priority "Yes" areas are 2, 3, 4, 5, 7. The named **keystone = investor-ready, founder-authored documentation + a GOC-only financial model + projections + impact-measurement framework.**
2. **Two SIH work-streams flagged:** the **QBE project = Market Demand Research**; the **advisory project = Production Cost Estimates** (delivers an editable Excel coster, dependent on the GOC financial model existing first).
3. **The Investor Alignment Tool is an unfilled template** — no real GOC funders or scores in it. Its value is the methodology (8 knockouts + 14 fit criteria, High/Med/Low priority labels, no numeric weights). To "tie to the CRM," GOC still has to populate Tabs 1–3. The only named entities are 4 fictional demo investors.
4. **Reconcile before quoting money:** diagnostic says cumulative revenue ≈ **$537,595**; repo canon total received = **$741,111**. Do not cite $537,595 as the headline total without resolving the difference.

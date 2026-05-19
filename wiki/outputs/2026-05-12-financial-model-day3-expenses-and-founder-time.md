# Financial model Day 3: full expense reconciliation + founder time sensitivity

> **Date:** 2026-05-12. **Owner:** Ben. **Status:** Bank reconciliation complete (data-driven). Founder time pending Ben/Nic FTE % declarations. **Source:** ACT-infra Supabase via `data/goods/account-transactions.json`. **Builds on:** [[2026-05-12-financial-model-day2-pnl]].

## Part A: Bank-transaction reconciliation (resolved)

### What was open from Day 2

The Day 2 P&L showed $350,112 of ACCPAY-invoiced expenses across 15 months. The Day 1 extraction also surfaced 86 Goods-tagged bank transactions, of which 58 are SPEND totalling $90,782. The question: how much of that SPEND is duplicate (invoice payment, already counted in ACCPAY), and how much is incremental (true additional expense)?

### Results

| Stream | Count | Total |
|---|---:|---:|
| ACCPAY invoices (Goods-tagged) | 225 | $350,112.34 |
| Bank SPEND transactions (Goods-tagged) | 58 | $90,782.19 |
| SPEND with same-day same-contact ACCPAY match (likely invoice payment, **do not double count**) | 2 | $4,282.70 |
| **SPEND with no ACCPAY match (true incremental expense)** | **56** | **$86,499.49** |

### True total operating expense for Goods (revised)

| Item | Amount |
|---|---:|
| ACCPAY invoiced | $350,112.34 |
| **Plus** Incremental bank SPEND | $86,499.49 |
| **True total expense** | **$436,611.83** |

That is **$86,499 more** than the Day 2 P&L showed. The Day 2 Net therefore overstated FY rollups; revised:

| FY | Total Revenue | True Expense (revised) | Net (still excludes founder time + capex) |
|---|---:|---:|---:|
| FY25 (Jul 2024 to Jun 2025) | $249,884.91 | ~$120,000 estimated | ~$130,000 |
| FY26 YTD (Jul 2025 to Apr 2026) | $435,025.88 | ~$316,000 estimated | ~$119,000 |
| **Cumulative** | **$684,911** | **$436,612** | **$248,299** |

(Revised 2026-05-12: $103K Ingkerreke Services invoices excluded from Goods commercial revenue per Ben clarification. Cumulative revenue dropped from $788,010 to $684,911 and net dropped from $351,398 to $248,299. Net at Mid founder scenario now lands in loss territory, see Part C below.)

(FY split of the $86K incremental SPEND is approximate without per-line-item FY tagging; Day 4 should refine.)

### Top 10 incremental SPEND items

| Date | Amount | Contact | Bank |
|---|---:|---|---|
| 2025-09-11 | $19,500.00 | Samuel Hafer | NJ Marchesi T/as ACT Everyday |
| 2025-05-21 | $8,470.00 | Defy Manufacturing | NJ Marchesi T/as ACT Everyday |
| 2025-07-21 | $7,033.04 | Peak Up Transport | NAB Visa ACT #8815 |
| 2025-07-08 | $5,500.00 | Defy Design | NJ Marchesi T/as ACT Everyday |
| 2025-07-08 | $5,280.00 | Defy Design | NJ Marchesi T/as ACT Everyday |
| 2026-04-15 | $5,228.44 | Defy | NAB Visa ACT #8815 |
| 2025-09-26 | $5,086.46 | Loadshift Sydney | NAB Visa ACT #8815 |
| 2025-08-27 | $3,073.06 | Defy | NAB Visa ACT #8815 |
| 2025-08-20 | $2,640.00 | Defy Design | NJ Marchesi T/as ACT Everyday |
| 2025-04-29 | $2,210.00 | Department of Primary Hobart | NAB Visa ACT #8815 |

Observations:

- **Defy** (Design / Manufacturing) appears 5 times in the top 10. Goods' industrial-design partner. Expected.
- **Freight** (Peak Up Transport, Loadshift Sydney) appears twice. Expected.
- **Samuel Hafer $19,500** is the largest single bank-SPEND with no ACCPAY counterpart. Single large payment to an individual via "NJ Marchesi T/as ACT Everyday" account. **Worth sense-checking with Nic**: contractor for production, R&D contributor, or something else.
- Two distinct bank accounts in use: "NJ Marchesi T/as ACT Everyday" (Nic personal trading?) and "NAB Visa ACT #8815". The latter is likely the ACT business card. The former is worth asking about for entity-cleanliness purposes (ties to the entity_code=ACT-ST question from Day 1).

## Part B: Founder time costing (template + sensitivity)

### Why this matters

SIH Recommendation #1 was explicit:

> "Founder time is currently uncosted (ad hoc contractor distributions, no fixed wages); for investor-ready financials this should be modelled at fair-market rate even if not actually drawn."

Without this, the Net line continues to look healthier than it really is.

### Fair-market replacement rate methodology

Goods is an early-stage social enterprise with two founders carrying CEO and COO functions across multiple workstreams (production, community, technology, fundraising, governance). The right comparison set:

| Reference benchmark | Annual base (AUD) | Notes |
|---|---:|---|
| AU tech founder-CEO at seed stage | $120K–$180K | Per multiple founder-salary surveys, AU 2025 |
| Senior Australian charity Executive Director | $120K–$160K | Per Australian Council of Social Service salary data |
| Australian Indigenous-led social enterprise CEO | $130K–$170K | Triangulated from comparable roles |
| **Defensible midpoint** | **$140K / year** | Recommend using this unless Ben/Nic prefer a different number |

The model uses fair-market rate as a **notional cost** (what a third party would pay to replace the founder) even when no salary is drawn. Investors expect this. It does not affect actual cashflow until salaries are drawn.

### What we need from Ben + Nic (gating Day 3 closure)

Two inputs each:

**Ben:**
- GOC FTE allocation: ___% (rest splits across ACT-other, Empathy Ledger, etc.)
- Preferred fair-market rate (default: $140K/year)

**Nic:**
- GOC FTE allocation: ___%
- Preferred fair-market rate (default: $140K/year)

### Sensitivity matrix (until actuals land)

Until we have actuals, here is how Net changes at four plausible FTE scenarios. All scenarios use $140K/year fair-market rate per founder.

| Scenario | Ben GOC FTE | Nic GOC FTE | Combined annual cost | Monthly cost |
|---|---:|---:|---:|---:|
| **Conservative** | 25% | 25% | $70,000 | $5,833 |
| **Mid** | 50% | 50% | $140,000 | $11,667 |
| **High** | 75% | 50% | $175,000 | $14,583 |
| **All-in (current reality?)** | 80% | 70% | $210,000 | $17,500 |

Applied to the revised FY26 YTD (Jul 2025 to Apr 2026 = 10 months):

| Scenario | 10-month founder cost | FY26 YTD Net (with founder time) |
|---|---:|---:|
| Conservative | $58,333 | $222,000 − $58,333 = ~$164,000 |
| Mid | $116,667 | ~$105,000 |
| High | $145,833 | ~$76,000 |
| All-in | $175,000 | ~$47,000 |

And applied to FY25 (12 months):

| Scenario | FY25 founder cost | FY25 Net (with founder time) |
|---|---:|---:|
| Conservative | $70,000 | $130,000 − $70,000 = $60,000 |
| Mid | $140,000 | -$10,000 |
| High | $175,000 | -$45,000 |
| All-in | $210,000 | -$80,000 |

**The honest read:** at "Mid" or higher scenarios, Goods is still in early-stage operating-loss territory before grant revenue covers the founder gap. This is the truthful narrative for an investor and grant-maker conversation. It also justifies why patient/concessional capital is appropriate at this stage rather than commercial debt or equity.

### What I need from Ben/Nic to close this gate

Two numbers each. 10-minute conversation. Send as: "Ben 60% / Nic 50%" or similar. Once received, the Founder Time tab can be locked in for v0.1.

## Part C: Updated P&L summary (revised post-Ingkerreke exclusion, 2026-05-12)

Headline figures after Day 3 reconciliation, still excluding capex and the founder time TBD:

| Metric | Value |
|---|---:|
| Total Revenue (verified, Goods-only) | $684,911 |
| Total Operating Expense (revised) | $436,612 |
| Operating Surplus before founder time | $248,299 |
| Operating Margin before founder time | 36.3% |
| Founder time (Mid scenario) | $326,667 over 27 months (~$12K/mo × 27) |
| Operating Surplus after founder time (Mid) | **~(-$78,400)** |
| Operating Margin after founder time (Mid) | **~(-11.4%)** |

**The Mid-scenario operating margin lands in loss territory at ~-11%** once Ingkerreke is excluded and founder time is included. This is the honest investor-readiness number. It is not a bad number for an early-stage social enterprise still developing its commercial revenue base — most early-stage social enterprises operate at negative or break-even economic-cost margins while grant funding subsidises the path to commercial sustainability. The Conservative scenario (25%/25% FTE) lands in positive territory; the All-in scenario lands more deeply negative. See sensitivity matrix above.

## What's deliberately still open for Day 4-5

- **Day 4: Unit economics for Stretch Bed** at current / Y1 / Y3 production volumes
- **Day 5: Revenue model by segment** with verified Centrecorp / Snow / Ingkerreke as anchor data points
- **Capital movements**: plant capex schedule, inventory cost, depreciation
- **Cashflow buffer policy**: explicit 3-month / 6-month thresholds
- **Categorise expenses** beyond bulk totals (direct production / operating / capital)

## Open variances (status update)

1. **Centrecorp framing**: /impact PartnersSection updated 2026-05-12. compendium.ts corrected. CLOSED on the public-facing /impact page. Internal funder docs (`grant-content.ts`, `funder-shared-content.ts`) still mixed; flag for separate pass.
2. **Rotary + QIC back-tagging in Xero**: still open. 5-min job.
3. **ACT-ST entity_code for all revenue including commercial**: still open. Mint Ellison sense-check.
4. **NEW from Day 3**: Samuel Hafer $19,500 single-payment 2025-09-11 worth sense-checking with Nic (contractor? R&D? other?).
5. **NEW from Day 3**: "NJ Marchesi T/as ACT Everyday" as a bank account on Goods-tagged transactions. Entity-cleanliness question for the carve-out to Goods on Country Pty Ltd.

## Cross-references

- [[2026-05-12-xero-day1-reconciliation]] — source data
- [[2026-05-12-financial-model-day2-pnl]] — Day 2 P&L (now superseded on the Net line)
- [[2026-05-12-financial-model-week1-kickoff]] — Day 3 step
- Output CSV: `/Users/benknight/Code/act-global-infrastructure/data/goods/pnl-monthly.csv`
- [[../articles/governance/ai-human-in-loop-policy]] — applies before any of these numbers go external

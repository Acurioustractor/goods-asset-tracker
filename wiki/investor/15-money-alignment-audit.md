# 15 — Money Alignment Audit (QBE spine)

> Generated 2026-07-21 from a repo-wide dollar-figure sweep (2 audit agents, every figure cited file:line).
> Purpose: one first-principles money spine from procurement → production → facility → fixed block → the raise,
> so every investor conversation lands on the same numbers and every $ has one home.
> Claim labels are as recorded in source. NOTHING here is new math — it is alignment of existing sources.

## A. The one money spine (first principles)

Every dollar in the QBE story flows through five gates. Each gate has ONE canonical figure; everything else is derived or stale.

### Gate 1 — Procurement (what a bed costs to buy-in today)
| Line | Figure | Source | Label |
|---|---|---|---|
| Defy finished leg kit | $344.05 | cost-story.ts:106; scenarios.ts:172 | verified |
| Steel poles | $27 | scenarios.ts:174 | verified |
| Canvas | $93.50 | scenarios.ts:174 | verified |
| Hardware | $5.24 | scenarios.ts:175 | verified |
| **Direct materials** | **$469.79** | cost-story.ts:120-124 | verified |
| Long-haul freight | ~$150 | scenarios.ts:194 | modelled |
| Assembly labour (Defy) | $55.95 | scenarios.ts:181 | verified |
| **Marginal cost today (Buy-Kit)** | **$685** ($684.79) | canon.ts:121; engine.ts:24 | verified (engine-locked); cost-story labels workpaper |
| Contribution at $750 price | **~$65/bed** | cost-story.ts:77 | workpaper |

The why-change number: plastic lands at $2.75/kg (~$55/bed) vs the $0.80/kg polymer floor (~$16/bed) — an 8.6-21.5× markup on material we could press ourselves (cost-story.ts:99, scenarios.ts:147-148). The leg kit is where the margin leaks: $344.05 bought vs ~$40-55 of raw plastic.

### Gate 2 — Production in-house (what the facility changes)
| Line | Figure | Source | Label |
|---|---|---|---|
| Marginal cost, Factory | **$426** ($425.74) | canon.ts:127; cost-story.ts:166-169 | modelled (capability proven: Maningrida Stretch run of 40 pressed at our facility, Ben ruling 2026-07-21; cost at production rate not yet measured) |
| Saving per bed | $194 | canon.ts:139; scenarios.ts:145 | verified |
| Contribution at $750 | **~$324/bed** (5× today) | cost-story.ts:84 | modelled |
| Community path marginal | ~$421 (direct $270.74 ≈ factory parity) | canon.ts:133; engine.ts:224 | modelled |

### Gate 3 — Facility capex (what it costs to get there)
| Line | Figure | Source | Label |
|---|---|---|---|
| Gross set-up (shredder + press + CNC + benches) | $112-222K (mid ~$167K) | cost-story.ts:239-244 | modelled |
| Already invested (~$80K TFN + ~$20K ACT) | **$110,046** | canon.ts:250; scenarios.ts:141 | verified |
| **Net remaining equipment ask** | **~$2-112K** | cost-story.ts:254-257 | modelled |
| Maintenance reserve | 3-5%/yr (~$5-8K) | cost-story.ts:279 | modelled |
| Per-community-site overhead | ~$24K/yr | cost-story.ts:176-178 | modelled |
| On-Country site capex | $100-150K/site | qbe-readiness.md:49 | modelled |
| 50-bed test run | ~$60-80K | cost-story.ts:181-184 | target |

### Gate 4 — Fixed block and break-even (what makes it a business)
| Line | Figure | Source | Label |
|---|---|---|---|
| Fixed running block | **~$109,500/yr** (facility $27K + founder prod $16.8K + admin $14.7K + travel $51K) | cost-story.ts:195-198; engine.ts:12 | workpaper |
| Break-even, today's method | ~1,679 beds/yr (not viable — the point) | cost-story.ts:203-206 | modelled |
| Break-even, Factory | **~338 beds/yr** | cost-story.ts:210-213 | modelled |
| Current run-rate | ~120 beds/yr | cost-story.ts:217-220 | verified |
| One-facility capacity | ~1,000 beds/yr | cost-story.ts:226-229 | target |
| Demand signals (LOIs-not-orders) | NPY 200-350 · Centrecorp ~237 · PICC 141 · Homeland 65 | cost-story.ts:333-335 | signals, NOT revenue |

### Gate 5 — The raise (what we're asking for, and the rules)
| Line | Figure | Source | Status |
|---|---|---|---|
| QBE Stage 2 | up to **$400K** ($150K floor), repayable preferred | 04-qbe-pipeline.md:9-11 | discretionary; Stage 1 $10K paid |
| Match rule | grant **at least matched by SIGNED external commitments** (paper SIH can verify) | 04-qbe-pipeline.md:10,13-14 | hard gate |
| Match-paper deadline | **31 Aug 2026**; form closes late Sept; outcomes Nov | 04-qbe-pipeline.md:12-13; 2026-07-16-notion-alignment-plan.md:273 | dates |
| Lead stack | **$475K = SEFA $300K + Snow $100K + Centrecorp $75K** | 2026-07-03-investor-asset-alignment.md:3 | **$0 signed today** |
| Excluded from match | QBE itself, DEWR/REAL vehicle, equity VCs, buyer revenue | 04-qbe-pipeline.md:37-38 | rule |
| Revenue (only external figure) | **$713,827** accountant-signed Goods carve-out + $143,000 AR | canon.ts:106,92 | verified (amber — basis named) |

## B. THE structural misalignment (where the waste is)

**The $400K QBE ask is not derived from the cost model.** The model's own capital requirement is $112-222K gross equipment, of which $110,046 is already invested — net ~$2-112K (02-financial-model.md:44,49: "$400K appears nowhere in these five files"). The $400K↔model link is asserted only in decks. Every investor who reads both will find the gap.

**First-principles fix — build the ask BOTTOM-UP so $400K (or whatever it truly is) is a SUM, not a slogan:**

| Use-of-funds block | Range | Source basis |
|---|---|---|
| 1. Equipment, net remaining | $2-112K | cost-story.ts:254 |
| 2. 50-bed in-house proof run | $60-80K | cost-story.ts:181 |
| 3. Working capital to bridge ~120 → ~338 beds/yr (B2B payment cycle — the SEFA job) | to be sized from the engine: ~218 extra beds × $426 marginal, cycle-length adjusted | day8-capital-stack.md:78 (SEFA use) |
| 4. Fixed block cover while ramping (12-18 mo × $109.5K) | $110-165K | cost-story.ts:195 |
| 5. Maintenance reserve + first on-Country site scoping | $5-8K + scoping | cost-story.ts:279; qbe-readiness.md:49 |

Sizing blocks 3-4 precisely is the $426 sense-check session Ben already owes himself (day-shift). Once summed, the ask is defensible to the dollar and every funder can pick a BLOCK, not a vibe.

## C. Conflicts register (fix owners assigned)

### C1. Fix in code/deck NOW (Tier 1, mechanical) — **EXECUTED 2026-07-21** (tsc + drift green)
> Applied: deck $685 pill → Verified (+ provenance nuance rows 26/33); products.ts → $110,046; impact-model.ts comments scope-disambiguated ($534.79 direct ≠ $685 marginal); compendium Snow rows restated ($493,130 received / $100K R4-R5 fresh ask / INV-0321 receivable retired); brand-kit invest-next-phase.html SEFA $250K → $300K ($475K); cost-per-bed-simple README canon-banner (338 range, $600 retired). $344-as-factory mislabel: NOT present in the live spine (old codex deck only). content.ts already clean (SEFA $300K; $250K = White Box, $200K = Minderoo — different funders, not conflicts).
1. **Deck "$685 Measured" pill** — deck-v2.html:299 + provenance.md:26 say Measured; cost-story says workpaper, canon says verified, and 02-financial-model.md:48 explicitly warns "Measured $426" overstates. Relabel deck pills to match canon labels (verified / modelled).
2. **products.ts:106 "~$100K invested"** → $110,046 (canon).
3. **impact-model.ts `currentCostPerUnit` $534.79** vs canon headline $685 — same BOM, different scope (direct vs marginal). Label it "direct materials+assembly" or repoint to $685.
4. **Slide mislabel risk**: $344 used as "city-factory cost" in one deck cut (loop-c-scope-test.md:35) — $344.05 is the LEG KIT line; factory marginal is $426.
5. **Break-even wording**: settle on "~338 beds/yr (range 333-338)" everywhere; kill "333-600" (cost-per-bed-simple/README.md:69).
6. **compendium.ts Snow rows** ($193,785 received + $130K pending + $132K receivable) don't reconcile to the $493,130 headline — restate compendium from the 2026-06-09 Snow reconciliation.
7. **Stale stack copies**: any remaining $425K / SEFA $250K instances (content.ts L603 legacy, old SEFA brief cuts) → $475K / $300K. Old $200K QBE cap mentions → $400K.

### C2. Accountant / Ben to confirm (day-shift, before external use)
8. **Revenue triangle** $741,111 (all-sources) vs $713,827 (carve-out) vs $650,910.79 (Xero paid cut) — no file bridges them; ~$907,569 reconciliation rec unresolved (02-financial-model.md:52). One bridging note needed.
9. **Capex nesting**: $110,046 confirmed vs $112-222K range — how they nest (cost-story.ts:356 open flag).
10. **Snow $493,130 exact** — provenance flags "from memory, not a code source; confirm before external use."
11. **Plastic per bed 20kg vs 25kg** — explicit `solidity: 'conflict'` (cost-story.ts:301-306); canon = 20kg.
12. **revenueBilled** $732,210.79 vs $733,410.79 — different as-at cuts, ~$1,200; date-stamp one.

### C3. Quarantine as stale (never reintroduce)
- Centrecorp $420K / $208K / $85K commitment math (voided invoices — day4/day8 docs); canon = **$123,332 paid**, stack ask = **$75K grant-side**.
- Snow $193,785 as "total" (pre-restatement), $132K R4 Day-8 framing.
- $600/bed (retired), $403,901 "surplus" (NEVER external — entity P&L is a net loss), superseded revenue baselines ($684,911 / $537,595 / $405,685 / $445K / $778,162).
- Day-8 $1.2M stack (QBE $400K + SEFA + Anchor $500K).
- REAL "$2M" rounding — write $2.4M ($1.2M × 2 sites), and always "Applied/EOI, excluded from QBE match."

## D. The investor alignment menu (every specific way to align)

Each block is one signable instrument, mapped to a gate in the spine. Match-eligible = counts toward QBE's ≥1:1 signed-paper rule by 31 Aug.

| # | Way to align | Instrument | Size | Funds which gate | Match-eligible | What signed paper looks like |
|---|---|---|---|---|---|---|
| 1 | **Working-capital anchor** (SEFA-shaped) | Repayable loan (QBE's preferred flavour) | $300K | Gate 4-5: bridge 120→338 beds/yr B2B cycle | YES | Loan agreement: amount, term, funder legal name, contact SIH can call |
| 2 | **Fresh philanthropic** (Snow R4/R5-shaped) | Grant | $100K | Gate 3-4: proof run + fixed-block cover | YES | Grant deed/letter of commitment |
| 3 | **Community-anchored grant** (Centrecorp-shaped) | Grant, separate from bed orders | $75K | Gate 3: community-site scoping | YES | Board-minuted commitment letter |
| 4 | **Equipment sponsor** | Grant or asset finance against NAMED line items: press $80-150K, shredder $15-30K, CNC $15-40K | net $2-112K | Gate 3 direct | YES | Purchase-order-backed commitment |
| 5 | **Bed orders** (NPY / PICC / Homeland / Centrecorp beds) | Purchase orders at $750/bed | 200-350 / 141 / 65 / ~237 beds | Gate 4: drives break-even, de-risks everything above | NO (revenue ≠ match) but the strongest signal | Signed PO with delivery schedule |
| 6 | **Site capital, later** (IBA-shaped, post-51% ownership gate) | Larger facility/site finance | $100-150K/site up to $5M | Gate 3 at scale | Post-entity-decision | Not for 31 Aug |
| ✗ | Equity, QBE itself, DEWR/REAL vehicle | — | — | — | EXCLUDED | — |

**The sentence for investors:** "Pick a block. Every dollar lands in a named gate of one model, the grant is matched 1:1 by your signed paper, and at ~338 beds a year the business stands without any of us."

## E. Do-next order
1. Ben: the $426/working-capital sense-check session (sizes blocks 3-4 → the ask becomes a sum). Day-shift.
2. Me (on Ben's word): execute C1 fixes 1-7 (mechanical, Tier 1) + re-run drift/audit gates.
3. Ben + accountant: C2 items 8-10 (revenue bridge note, capex nesting, Snow exact).
4. Outreach unchanged: SEFA + Jay first — every signed dollar before 31 Aug counts double (its own value + unlocking QBE match).

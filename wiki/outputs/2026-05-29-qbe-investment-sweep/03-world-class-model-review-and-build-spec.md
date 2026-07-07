# Goods World-Class Model: Review + Build Spec (2026-05-29)

**Audience:** Ben + Nic (build), Matt (unit-costing advisor, receives the Sheet), impact investors (QBE Catalysing Impact).
**Purpose:** Decide whether the financial + cost model is investor-ready, fix what is not, and hand Matt a single playable Google Sheet by end of June that he can bolt his unit-costing and investment-scenario layer onto without rebuilding.
**Source basis:** Re-derived from the actual files this session — `cost-model-explorer.tsx`, `cost-model-scenarios.json` (v5), `01-cost-model-idiot-index.json` (v6), `01-bed-cost-model-reconfigured.md` (v6), `matt-document-bundle/04-verified-financials.md`, `supplier-quotes.ts`, `00-MASTER-qbe-investment-sweep.md`, `02-investor-alignment-tool-populated.md`. The five workbooks (`Goods-3-Statement-Model-v0.1/v0.2.xlsx`, `Goods-Financial-Model.xlsx`, `Goods-Bed-Cost-Model-v6-Idiot-Index.xlsx`, `Goods-Investor-Alignment-Tool-2026.xlsx`) are binary and reviewed via their .md/.json mirrors.

---

## 1. VERDICT — is the model world-class yet?

Not yet. The unit-cost spine is genuinely investor-grade and re-derives to the cent. The financial-statement layer around it does not articulate, the playable artifact Matt asked for is not finished, and three numbers (a contradicted surplus, a forbidden capital figure, a stale founder rate) are live in files an advisor will open. The failure is propagation and articulation, not reasoning.

| Angle | Where we are (1-5) | World-class bar | The gap |
|---|:--:|---|---|
| **Compliance with Matt's brief** (Goods-only, dial-driven, all named levers, FTE sensitivity, playable Sheet) | **3** | One Sheet a CFO opens cold and plays: every named lever (location, method, freight, labour, containerisation) is its own dial; turning any dial including founder FTE 25/50/75/100% flows to surplus and cash trough | Production LOCATION has no dial (conflated into method); CONTAINERISATION absent; FTE sensitivity is a static side-table that does not flow to the P&L; staffing-hire scenarios (3 sales + head of mfg) not scaffolded |
| **3-statement integrity** (P&L -> BS -> Cashflow tie) | **2** | One revenue/volume driver flows P&L -> retained earnings -> cash; BS balances every period; a visible balance-check row reads 0; one driver re-flows all three | The balance sheet self-admittedly "does not balance" (no Total Assets/Liabilities/Equity, no retained-earnings post, no check row); the 36-mo cashflow is a hand-keyed burn series, not derived from the P&L; the "monthly" P&L is an annual FY rollup; v6 cost ladder is not wired into COGS |
| **Investor scenarios + returnable capital** ("$X in -> these returns?") | **2** | A capital amount maps to beds enabled, plant payback, cost-down, and a debt-service/repayment schedule for recoverable instruments | No use-of-funds line-item table tied to the statements; no financing schedule (SEFA $300K debt is a static BS line, never drawn/repaid/interest-bearing); multi-plant "$200K per plant -> return" not parameterised |
| **First-principles rigour** (idiot index, physics floor, requirement-challenge) | **3** | Floor anchored on the polymer's physics cost (raw HDPE $/kg), not a vendor price; requirements questioned (does the bed need 20kg HDPE / 2 poles?) before sourcing is optimised | Physics floor mis-anchored on Defy's $2/kg shred SELL price (Envirobank line is $0.80/kg in our own file) — understates the true idiot index; the bed requirements are never challenged (Musk steps 1-2 skipped) |
| **Numbers integrity + claim discipline** | **3** | One canonical value per number; every figure re-derives; guardrails hold in every file | Operating-surplus chain is internally inconsistent by ~$105K; founder rate is $1,000/day in the cost-model files vs locked $560/day; net capital ask quoted as the forbidden "$90-200K" in three live files; Buy-Panels $584.07 does not re-derive (~$58.33 undocumented) |
| **Playable + interactive UX** (Sheet + web explorer) | **2** | Two coupled artifacts reading ONE number set: the Sheet computes, the web visualises; both lead with marginal+fixed+breakeven; presets + 3 hero dials; founder FTE front and centre | The live explorer leads with the misleading "$1,912"-equivalent (`fullKits`), has 28 raw sliders and zero presets, no marginal/fixed/breakeven output, hardcodes founder rate $1,000 and the forbidden $90-200K; it would actively mislead an investor today |

**Bottom line (honest, three sentences):** The cost engineering is real and rare — the BOM ($469.79), factory direct ($275.74), marginal/breakeven ($685/426, 378/1,882) and the idiot index (HDPE 8.6x, ~$289/bed Defy margin) all re-derive to the cent and correctly isolate the one part that is the capital case. But the deliverable Matt actually commissioned — a single playable, balancing, Goods-only 3-statement Google Sheet where pulling a lever re-flows all three statements — does not yet exist in finished form, and three contradictions are live in files an advisor will open (a surplus that is off by ~$105K, a founder rate that says $1,000 in two files and $560 in a third, and the forbidden "$90-200K" capital figure in three places plus the public web tool). This is roughly one focused weekend of formula-wiring and a reconciliation pass away from world-class; the gap is articulation and propagation, not analysis.

---

## 2. PRIORITISED GAPS (P0 / P1 / P2)

### P0 — fix before anything goes in front of Matt or an investor

**P0-1. The operating-surplus chain does not reconcile (~$105K hole).** `04-verified-financials.md` S3 states surplus before founder time ~$340,585 and after ~$151,585. The difference is $189,000, but the locked founder cost is $84,000. Re-derived: $649,710.79 received − $309,126 Goods-only expenses = $340,584.79 (the before-founder figure ties exactly); $340,585 − $84,000 = **$256,585, not $151,585**. The $151,585 endpoint has no documented derivation. This is the single most load-bearing claim in the pack (Matt's explicit "does it stack up when founders are paid" test) and an advisor finds it in five seconds.
- **Fix:** Show the waterfall inline: `649,711 received − 309,126 Goods expenses = 340,585 before founder − 84,000 founder = 256,585 after founder`, footnoting the $13,980 reconciliation to the $323,106 single-cash-basis (the 1300-Washer ACT-FM reclass). If $151,585 is intended, document the extra ~$105K line by line; otherwise correct it to $256,585. **Owner: Ben + accountant.**

**P0-2. The forbidden "$90K-$200K net" capital figure is live in three source files and the public web tool.** Guardrail: quote `$112-222K gross` OR `~$2-112K net`, never `90-200K`. Confirmed live in: `01-cost-model-idiot-index.json` (`net_capital_ask_low: 90000 / high: 200000`, plus `_capital_ask_low/high` in two more blocks); `01-bed-cost-model-reconfigured.md` (S3 table "~90,000 / ~200,000" + ~6 textual repeats); `cost-model-explorer.tsx` (`capital_to_factory_low/high = 90000/200000`, renders "Invest $90,000-$200,000"). $112-222K gross less $110,046 invested = ~$1,954-111,954, so 90-200K net is arithmetically impossible. Only `04-verified-financials.md` and the master sweep flag it; the working files assert it as fact.
- **Fix:** Resolve open decision #4 (is the $110,046 deductible from THIS equipment capex), then pick ONE basis and purge the other everywhere — JSON fields, MD rows/footnotes, explorer defaults. Pair the single number with a use-of-funds line-item table and a one-line note that it is a different quantity from the QBE match cap. **Owner: Ben (decision), then propagate.**

**P0-3. The 3-statement model does not articulate.** The balance sheet has no Total Assets / Total Liabilities / Equity / retained-earnings line and no balance-check row (the workbook mirror says so itself). Net profit never posts to equity. The 36-month cashflow is a hand-keyed monthly delta series, not derived from the P&L. The "monthly" P&L is an FY annual rollup. The v6 cost ladder is not wired into COGS. As built, no lever re-flows the statements — which fails the entire "playable, identifies the levers" point of Matt's ask.
- **Fix:** Build the articulation (see Section 4 build spec): monthly forward P&L -> net profit posts to a retained-earnings/equity block -> P&L net + working-capital + capex/financing drive the cashflow -> closing cash links back to the BS cash line, with a visible balance-check cell that must read 0 every period. **Owner: Ben + Nic (build the Sheet).**

**P0-4. The live web explorer ships pre-lock, guardrail-breaching numbers and would mislead an investor today.** `cost-model-explorer.tsx`: `founder_rate_per_day = 1000` (locked is 560), `capital_to_factory_low/high = 90000/200000` (forbidden), `freight_per_bed = 100` (v6 is 150 long-haul + 25 local), `beds_per_year = 500` (today ~100-150). Headline card renders `fullKits` (the ~$1,912-equivalent the v6 doc disowns). Payback uses `savingsPerBed = stateKits − stateFactory` (~$259/bed full delta) not the v6 ~$194.05/bed legs saving, with no >300/yr committed-volume gate.
- **Fix:** Update defaults to locked canon, lead with marginal+fixed+breakeven, fix the payback basis, add the >300/yr guard band, repoint to the v6 JSON; gate the route behind admin until done. Do not screen-share it in the meeting until fixed. **Owner: Ben (code).**

### P1 — fix before the model is called "v1 final"

**P1-1. Founder rate is stale at $1,000/day across the cost-model files.** Canonical LOCKED is $560/day, $84K/yr, $16,800 production share. But `cost-model-scenarios.json` (`rate_per_day: 1000`, `founder_production: 30000`), `01-cost-model-idiot-index.json` (`rate_per_day: 1000`, `per_bed_wrong: 1500`), and `01-bed-cost-model-reconfigured.md` S5 (the 30/50/25/45 × $1,000 table, FOUNDER-CONFIRM flags) all run $1,000. Consequence: the headline fixed block is built on a $30K production line and reads $122,700 with breakeven 378/yr; on the locked $560 rate the production share is $16,800, fixed block ≈ $109,500, breakeven ≈ 338/yr. **The brief simultaneously locks "378 breakeven" AND "$560/day" — these two locks are mutually exclusive.**
- **Fix:** Propagate $560/$16,800 into all four files; recompute fixed block (~$109,500) and breakeven (~338/yr), OR present both as a band; downgrade the FOUNDER-CONFIRM flags to LOCKED. **Owner: Ben (confirmed the lock), then propagate.**

**P1-2. Production LOCATION has no dial.** Matt named it explicitly as part of the headline containerisation question (Sydney/Defy vs Sunshine Coast vs On-Country). It is silently conflated into the manufacturing-method switch. Freight origin and facility rent by location cannot be varied independently of method.
- **Fix:** Add a Location lookup table (Sydney / Sunshine Coast / On-Country -> rent/yr, inbound-freight/bed) wired into the fixed block and unit cost so "same method, different location" is playable. **Owner: Ben + Nic (Sheet), Matt (scenario layer).**

**P1-3. CONTAINERISATION — Matt's "big question" — is absent.** No container fit-out capex, no freight inversion (ship one container of equipment + feedstock once vs ship N finished 26kg beds repeatedly), no location dial behind it.
- **Fix:** Add a containerisation toggle / module (see Section 4). **Owner: Matt builds the scenario depth; Ben + Nic provide the rough capex + freight deltas.**

**P1-4. FTE sensitivity (25/50/75/100%) does not flow to the P&L.** It exists as a static side-table. Matt's whole point is it must be playable — turn the dial, watch surplus move.
- **Fix:** Wire an FTE-% selector on the control panel into the P&L founder-cost line; clean the axis to a single 25/50/75/100% scale (today's "All-in = 1.5 combined" reads as 150%). **Owner: Ben + Nic.**

**P1-5. No financing/repayment schedule for recoverable capital.** SEFA ~$300K concessional debt is a static BS line, never drawn, repaid, or interest-bearing. "Returnable capital" is asserted, not demonstrated; no coverage/DSCR-style check shows bed margin can service the debt.
- **Fix:** Add a financing schedule (draw, term, rate, repayment) feeding interest to the P&L, principal to the BS debt line and the cashflow financing section, plus a simple coverage metric. **Owner: Matt (with Ben's SEFA term assumptions).**

**P1-6. Opening cash is a $50K placeholder driving the whole trough.** The headline "insolvent by Aug-26 without capital" output rests on one unconfirmed cell.
- **Fix:** Get the real ACT-accounts Goods carve-out balance at 1 May 2026. 5-minute fix with bank access; highest-leverage unconfirmed input. **Owner: Ben.**

### P2 — tidy before external distribution

**P2-1. Re-anchor the physics floor on raw polymer, not Defy's shred price.** The floor uses 20kg × $2/kg = $40 (Defy's INV-1731 shred SELL price). Our own `supplier-quotes.ts` carries Envirobank recycled HDPE at $0.80/kg. At $0.80/kg the raw floor is $16/bed and the true idiot index on the legs is ~21x, not 8.6x. The capital case gets stronger and more honest. **Fix:** show BOTH indices (idiot-vs-shred 8.6x, idiot-vs-polymer ~21x); state the floor as kg × $/kg, not vendor prices. **Owner: Ben (+ 1-2 reclaimer quotes).**

**P2-2. Buy-Panels $584.07 does not re-derive.** 2 × $200 panels into the $469.79 BOM gives $525.74; the canonical $584.07 has an undocumented ~$58.33 (plausibly self-CNC labour — note the JSON `state_3` actually builds it as $400 + $27 + $93.50 + $5.24 + $5 diesel + $53.33 labour = $584.07, so the line exists in the JSON but is contradicted by the MD's simpler build-up). **Fix:** Reconcile the two build-ups so the figure traces from its parts in both. **Owner: Ben.**

**P2-3. Canvas $14,915 ACT-IN->ACT-GD retag + $10,285 duplicate.** Canvas spend is currently OUTSIDE the $309,126 ACT-GD expense base, so Goods materials are understated by ~$14,915 until retagged. **Fix:** resolve before the accountant carve-out; footnote it. **Owner: bookkeeper / accountant.**

**P2-4. Supplier concentration on Defy not modelled.** ~73% of the bought-in BOM ($344.05 of $469.79) and the entire in-source plan depend on one supplier. No second HDPE-processing quote, no make-vs-buy bargaining-power analysis; the $344.05 volume quote (500/1,000/5,000) is still an open question to Defy. **Fix:** get the Defy volume quote + 1 alternative processor quote; name concentration as a risk with the in-source capex as its mitigation. **Owner: Ben.**

**P2-5. Five overlapping workbooks, no "START HERE" pointer.** v0.1 (which carries the superseded "squeeze"), v0.2, Goods-Financial-Model, Bed-Cost-Model-v6, IAT. **Fix:** designate ONE canonical workbook (the new build per Section 4), archive the rest to a dated `_archive/` with a RESTORE.md, add a START-HERE note. **Owner: Ben.**

**P2-6. The "live Google Sheet on Drive" is claimed but unverified.** Matt's brief is specifically a Google Sheet; xlsx-to-Sheets formula drift (CHOOSE/MIN/IF) is real. **Fix:** upload, confirm every dial recomputes in Sheets, share the link to Matt with comment access, replace the README claim with the real URL. **Owner: Ben.**

---

## 3. HOW ELON MUSK WOULD DO THIS

The five-step algorithm, in order: (1) make the requirement less dumb, (2) delete the part, (3) simplify what survives, (4) accelerate, (5) automate last. Plus the idiot index (finished cost / raw cost) and the physics floor (what do the atoms actually cost). The work so far has done step 3 (optimise the existing bed) beautifully and skipped steps 1 and 2. Here is the reframe applied to both halves.

### (a) The bed + manufacturing chain

**Make the requirement less dumb — the physics floor is a price your supplier told you, not a cost.** The idiot index anchors raw HDPE at $2/kg, which is Defy's shred SELL price (INV-1731), not the polymer's physics cost. Our own `supplier-quotes.ts` has Envirobank recycled HDPE at **$0.80/kg**, and baled kerbside HDPE trades lower. The honest physics floor is mass × polymer $/kg:

| Element | Mass / qty | True raw rate | Physics floor $/bed | Currently paid | True idiot index |
|---|---|---|--:|--:|--:|
| HDPE legs | 20 kg | $0.80/kg (Envirobank, our file) | **16.00** | 344.05 (Defy kit) | **~21x** (not 8.6x) |
| Steel poles | 1.88 m | $5.50/m (Brisbane Steel) | 10.34 | 27.00 | 2.6x |
| Canvas | 2.1 m | $15-20/m raw 12oz | ~38 | 93.50 | ~2.4x |
| Hardware | 18 fasteners + 4 caps | bulk | ~3.6 | 5.24 | ~1.5x |

The integration case is **stronger** than the pack claims. One element — the plastic legs — carries essentially the entire prize, and at the true polymer floor it is a ~21x markup, not 8.6x. That is the number that should be impossible to miss on the model: **20kg of plastic that costs ~$16-40 of raw material is sitting inside a $344 part.** That gap, times volume, is the investment case.

**Delete the part — 20kg of solid HDPE is the requirement nobody challenged.** Musk's rule: if you are not adding back at least 10% of what you delete, you did not delete enough. The model questions HOW to make the legs (buy kit / buy panel / press in-house) but never asks whether the legs need 20kg of solid plastic. 20kg is enormous. It is the single largest driver of material cost AND freight weight (26kg bed) AND the "20kg HDPE diverted" impact claim simultaneously. Three deletion/simplification questions that beat every sourcing decision in the model:

1. **Can the legs be ribbed or hollow to cut HDPE mass 30-50% at the same 200kg rating?** A 30% mass cut takes ~$12/bed off raw material at the factory floor, cuts freight weight, and barely dents the impact story (still ~14kg diverted). Test mass as a dial.
2. **Does the bed need two steel poles, or can a different bracing geometry delete one?** "The best part is no part." Each pole is $13.50 + an end-cap pair + a sleeve in the canvas.
3. **Is solid pressed HDPE the right process at volume, or does injection-moulding beat it past ~1,000/yr?** The whole capex case assumes shred-press-CNC; that is a step that might itself be deletable at scale.

Even if every answer is "keep it, here is why," the case must show the requirement was questioned before the sourcing was optimised. Right now no BOM line is a candidate for deletion, only for cheaper sourcing.

**Simplify what survives, then accelerate, then automate.** The thing that survives is: bring the plastic processing in-house once committed volume crosses ~300/yr. That is the correct, disciplined call and the pack makes it. Accelerate = the containerised mobile plant (Matt's big question): a container does not just cut freight, it **deletes the step of paying Defy's ~$289/bed margin forever** and moves the factory to the feedstock and the community — the difference between a furniture margin and a circular-manufacturing platform. Automate last: do not polish the public web tool (step 5) while the manual model (steps 1-3) still ships the wrong founder rate and a forbidden capital number. That is automating the embarrassment.

### (b) The financial + investment model

**Make the requirement less dumb — Matt asked for a 3-statement model, but the investor's real question is a one-line chain.** A balance sheet does not answer "$X in -> what return." The chain that does is: **$X capital -> beds enabled -> $/bed cost-down -> plant payback in N years -> (for recoverable instruments) repayment schedule + coverage.** Build that chain first and let the three statements fall out of it, not the reverse. The idiot-index thinking already found the lever; the financial model just has to make that lever turn a dial that visibly moves the projections.

**Delete the part — 25 of the 28 sliders are noise.** The web explorer has 28 dials. Most do not change a decision. The decision lives in ONE number (HDPE kit idiot index, ~$289/bed) and ONE gate (committed volume > 300/yr). An investor needs exactly three knobs — how many beds/yr, who makes the legs, are the founders paid — and four preset buttons. If removing a dial does not change a decision, it was never a lever; it was decoration. The FTE table that does not flow to surplus is the same failure: a dial that moves nothing is theatre. Delete it or wire it in.

**The idiot index of the model itself — find the redundant copies and delete them.** The reasoning is correct; the propagation is not. The same founder rate exists as $560 in one file and $1,000 in two others. The net capital ask is ~$2-112K by arithmetic and $90-200K in the documents. The operating surplus has two endpoints whose difference contradicts the stated founder line. **Build the dial-driven Sheet so there is exactly one cell per number and the contradictions become structurally impossible.** That is the single highest-leverage move on the financial side — it is the "delete the duplicate parts" step applied to your own numbers.

**Musk's one-paragraph verdict for this pack:** You priced the bed you have; you never asked if it is the right bed. Your physics floor is a lie your supplier told you — real recycled HDPE is under a dollar a kilo, so your true idiot index on the legs is ~21x and your integration case is far stronger than you are claiming. Twenty kilos of solid plastic is the requirement no one challenged; take a third of the mass out with ribs and you cut your biggest material cost, your freight weight, and you barely touch your impact number — that one dial beats every sourcing decision in the model. And the thing the investor actually asked for — put $X in, watch the return move, tell me what containerisation does — you have not built; you built a gorgeous BOM explorer and disowned its own headline number while it still ships live. Delete the $1,912 from the tool, anchor the floor on physics not on Defy, put a mass dial and a container dial on the model, pay the founders a real wage in the numbers, build the one driver chain that re-flows the statements, and only then ask for the cheque.

---

## 4. PLAYABLE MODEL BUILD SPEC — Google Sheet

A single Google Sheet, 10 tabs. **One control panel (yellow input cells) drives everything via formulas; no hardcoded magic numbers in COGS or the statements.** Colour convention: **yellow = input dial**, white = formula, grey = label/note. Every input row carries a confidence tag in an adjacent column (`verified` / `modelled` / `target` / `future` / `locked`). Build the tabs in this order so downstream references resolve.

Conventions used below: `Inputs!B3` style references are illustrative cell addresses; keep the layout but the exact row numbers are yours to set. All formulas are Google-Sheets-compatible (CHOOSE, INDEX/MATCH, MIN, IF, SUMPRODUCT).

### Tab 1 — `Control Panel` (the dials)

The only tab Matt and an investor touch by default. Group the dials.

| Cell | Dial | Default (seed) | Tag | Notes |
|---|---|--:|---|---|
| `B3` | Beds/yr (Year-1 run-rate) | 120 | modelled | today ~100-150, NOT 500 |
| `B4` | Annual volume growth % | 60% | target | feeds the 36-mo ramp |
| `B5` | Price per bed | 750 | verified | shop stretch-bed-single |
| `B6` | **Build method (1-4)** | 1 | dial | 1 Buy-Kit / 2 Buy-Panels / 3 Factory / 4 Community |
| `B7` | **Production location (1-3)** | 1 | dial | 1 Sydney-Defy / 2 Sunshine Coast / 3 On-Country |
| `B8` | **Containerise? (0/1)** | 0 | dial | 1 = mobile container plant economics |
| `B9` | **Founder FTE % (combined)** | 100% | dial | 25 / 50 / 75 / 100 — feeds P&L founder line |
| `B10` | Labour rate $/day | 400 | inferred | promoted from hardcode |
| `B11` | Factory throughput beds/day | 5 | modelled | drives labour/bed |
| `B12` | Local freight $/bed | 25 | modelled | promoted from hardcode |
| `B13` | Long-haul freight $/bed | 150 | modelled | marginal, not overhead |
| `B14` | # containerised plants (0-N) | 0 | dial | each ~$200K, capacity ~1,000/yr |
| `B15` | Opening cash 1-May-2026 | **TO CONFIRM** (50,000 placeholder) | to confirm | highest-leverage input |
| `B16` | Founder day-rate | 560 | locked | NOT 1,000 |
| `B17` | Founder days/yr on Goods | 150 | locked | 30/50/25/45 split |

**Dashboard block** (top of Control Panel, formula cells, the six numbers an investor asks for):
- Marginal cost/bed = `='Unit Cost'!<selected method marginal>`
- Annual fixed block = `='Wages & People'!<fixed total>`
- Breakeven beds/yr = `=ROUNDUP(<fixed block>/(B5-<marginal>),0)`
- Capex + payback = `='Investment'!<gross capex>` and `='Investment'!<payback yrs at B3>`
- Operating surplus after founder time = `=P&L!<surplus after founder>`
- 36-mo cash trough = `=MIN(Cashflow!<cumulative cash range>)`

Banner row (grey): `~89% grant-funded. Xero-mirror workpaper, NOT audited. Capital ask: $112K-$222K gross (firm quote pending). CRM pipeline is INTERNAL ONLY, not committed capital.`

### Tab 2 — `Unit Cost` (the v6 cost ladder, formula-driven off the dials)

Rows = the four build paths; columns = each cost line. **Every line is a formula off Control Panel + Assumptions, no constants.**

Seed values (verified BOM, to enter as Assumptions, then reference):
- HDPE kit (Defy) `344.05`; steel `27.00`; canvas `93.50`; end caps `3.20`; screws `1.04`; bolts `1.00` -> BOM = `469.79`.
- Factory raw HDPE `55.00` (20kg × $2.75/kg incl delivery); diesel `15.00`; hardware `5.24`.
- Defy panel each `200.00`.

Formula logic (illustrative):
```
Assembly labour/bed   = Control!B10 / Control!B11            // 400/5 etc, per path throughput
Buy-Kit direct        = Assumptions!HDPEkit + Assumptions!steel + Assumptions!canvas + Assumptions!hardware
                        = 469.79
Factory direct        = Assumptions!rawHDPE + Assumptions!diesel + (Control!B10/Control!B11)
                        + Assumptions!steel + Assumptions!canvas + Assumptions!hardware
                        = 275.74
Marginal (Buy-Kit)    = BuyKitDirect + AssemblyLabour + Control!B12 + Control!B13   // 469.79+40+25+150 = 684.79
Marginal (Factory)    = FactoryDirect + Control!B13                                 // 275.74+150 = 425.74
Selected marginal     = CHOOSE(Control!B6, MarginalKit, MarginalPanel, MarginalFactory, MarginalCommunity)
Margin @ price        = Control!B5 - SelectedDirect
Idiot index (HDPE)    = Assumptions!HDPEkit / (Assumptions!HDPEkg * Assumptions!HDPEpolymerRate)
```
**Add two idiot-index columns:** vs-shred (`344.05/40 = 8.6x`) and vs-polymer (`344.05/16 = ~21.5x` at Envirobank $0.80/kg). State the polymer floor explicitly.

### Tab 3 — `Location & Containerisation` (the named levers as a lookup)

A 3-row location table the method dial cannot reach on its own:

| Location | Facility rent $/yr | Inbound freight $/bed | Outbound (finished-bed) freight $/bed |
|---|--:|--:|--:|
| 1 Sydney-Defy | 0 (buy kits, no facility) | 0 | 150 |
| 2 Sunshine Coast | 54,000 (Kirmos $4,500/mo) | 30 | 150 |
| 3 On-Country | 24,000 (modelled) | 60 (feedstock in) | 80 (local, shorter haul) |

Containerisation block (driven by `Control!B8` and `B14`):
```
Container fit-out capex/plant = 180,000   // modelled, vs $112-222K fixed shed
Freight saved/bed if containerised = Outbound(Sydney) - Outbound(On-Country) = 150-80 = 70
Plants capacity = Control!B14 * 1000
Selected rent      = INDEX(LocationTable_rent, MATCH(Control!B7,...))
Selected freight   = IF(Control!B8=1, On-Country freight, INDEX by location)
```
This is what makes "same method, different location" and "what does containerisation do" playable. Wire `Selected rent` into the fixed block and `Selected freight` into the Unit Cost marginal.

### Tab 4 — `Wages & People` (founder wage + the staffing-hire scenario layer)

**Founder line (flows to P&L, satisfies Matt's red-flag test):**
```
Founder cost/yr   = Control!B16 * Control!B17 * Control!B9    // 560 * 150 * FTE% 
Production share  = Control!B16 * 30 * Control!B9             // the only part that touches unit cost
```
Render the FTE sensitivity as a strip that READS off the dial, not a static table:

| FTE % | 25% | 50% | 75% | 100% |
|---|--:|--:|--:|--:|
| Founder cost/yr | 21,000 | 42,000 | 63,000 | 84,000 |
| Surplus after (period basis) | =formula | =formula | =formula | =256,585 |

**Staffing hires block (for Matt's investment scenarios — 3 salespeople + head of manufacturing):**

| Role | Fully-loaded $/yr | Ramp month | Beds-sold or capacity contribution |
|---|--:|--:|---|
| Salesperson ×3 | 90,000 ea | M1 / M4 / M7 | +X committed beds/yr each |
| Head of manufacturing | 130,000 | M1 | unlocks N plants / throughput |

Total staffing cost = `SUMPRODUCT` of role cost × active-months/12; flows to P&L opex.

### Tab 5 — `Revenue` (demand-driven, not a free dial)

Beds/yr is a DRIVEN output, not a slider set to 500. Build a demand schedule:

| Source | Beds Y1 | Basis | Tag |
|---|--:|---|---|
| Committed orders | (signed only) | name them | verified |
| Weighted pipeline | (separate column) | clearly labelled | internal only |
| **Driven beds/yr** | `=committed + weighted×prob` | | modelled |

Revenue = `DrivenBeds × Control!B5`. Never let the internal pipeline read as committed revenue. Show the economics at the honest current run-rate next to the target.

### Tab 6 — `P&L (36-month forward, monthly)`

Rows = 36 months; columns = revenue, COGS, gross profit, opex (fixed block + staffing), founder cost, EBITDA, depreciation, interest, net profit. Driven by Revenue + Unit Cost + Wages.
```
Month revenue   = MonthlyBeds * Control!B5
Month COGS      = MonthlyBeds * 'Unit Cost'!SelectedMarginal
Gross profit    = revenue - COGS
Opex            = (fixed block /12) + staffing/12 + Location rent/12
Founder cost    = 'Wages'!FounderCost /12
Depreciation    = 'Investment'!capex / 60   // 5-yr straight line
Interest        = 'Financing'!monthly interest
Net profit      = GrossProfit - Opex - Founder - Depreciation - Interest
```
Keep a separate **Actuals anchor** column block: revenue received `649,711`, Goods expenses `309,126`, surplus before founder `340,585`, after founder `256,585` — with the inline waterfall (P0-1 fix).

### Tab 7 — `Balance Sheet & WC` (must balance)

```
Assets:   Cash (=Cashflow closing) + AR (82,500 Rotary, verified) + Inventory (=beds-in-stock × marginal, seed $50K) + PP&E (=capex - accumulated depreciation)
Liabilities: AP (0, with a memo line for the matching gap) + Debt (=Financing principal outstanding) + GST payable (~29,657 rough)
Equity:   Opening equity + retained earnings (=cumulative P&L net) + capital injections
Balance check: = Total Assets - (Total Liabilities + Total Equity)   // MUST read 0
```
This is the single build that converts the scaffold into a 3-statement model.

### Tab 8 — `Cashflow (36-month)` (derived from P&L, not hand-keyed)

```
Opening cash (M1)   = Control!B15
Operating cash      = P&L net profit + depreciation +/- working-capital movements (ΔAR, ΔAP, ΔInventory, ΔGST)
Investing cash      = -Investment!capex draw (timed)
Financing cash      = +Financing draws - repayments
Net cash flow       = operating + investing + financing
Closing cash        = opening + net   // links to BS cash
Cumulative trough   = MIN(closing cash range)
```
Capital injections come through the Financing tab, not as raw cash plugs. Keep QBE contingent (a 0/1 probability flag).

### Tab 9 — `Investment & Financing` (the returnable-capital answer)

**Capex / plant template (parameterised, stampable 1..N):**
```
Gross capex          = 112,000 to 222,000 (firm quote pending)   // GROSS only
Capex per container plant = 180,000   // modelled
Total capex          = base + Control!B14 * capex-per-plant
Annual saving/bed    = 194.05 (in-house legs)   // NOT the full 259 delta
Payback yrs @ B3     = GrossCapex / (Control!B3 * 194.05)
Guard band           = IF(Control!B3 < 300, "Capex not sensible below ~300/yr committed", "OK")
```
**Use-of-funds line-item table:**

| Instrument | Type | Amount | Maps to |
|---|---|--:|---|
| QBE Catalysing Impact match | Grant (contingent on raising $400K first) | up to match cap | capex + fixed block |
| Anchor philanthropy | Grant | 500,000 | fixed block bridge |
| SEFA | Concessional debt | 300,000 | working capital + plant |
| Already invested | Sunk | 110,046 | facility + Carbatec |

**Financing schedule (SEFA):** draw M `Nov-26`, term, rate, monthly repayment -> interest to P&L, principal to BS debt, both to Cashflow financing. **Coverage check:** `(operating surplus + grant runway) / annual debt service`.

**Capital ask, stated ONE way (guardrail):** `$112K-$222K GROSS (firm quote pending)`. If net is chosen instead: `~$2K-$112K NET after $110,046 invested`. Never a blended $90-200K. One-line note: "different quantity from the QBE match cap."

### Tab 10 — `Scenarios` (live switch, not a static table)

One selector cell swaps the driver set; all three statements recompute.

| Preset | Beds Y1 | Method | Location | Containerise | Founder FTE | Capital timing |
|---|--:|--:|--:|--:|--:|---|
| **Today (honest)** | 120 | 1 Buy-Kit | 1 Sydney | 0 | 100% | none |
| **In-source assembly** | 250 | 1 Buy-Kit | 2 Sunshine Coast | 0 | 100% | $2K bench |
| **Factory at target** | 500 | 3 Factory | 2 Sunshine Coast | 0 | 100% | $112-222K, M `Sep-26` |
| **On-Country container** | 500 | 3 Factory | 3 On-Country | 1 | 100% | container plant |
| **Community vision** | 1,000 | 4 Community | 3 On-Country | 1 | 100% | + free feedstock |
| **Investor case** | blank | blank | blank | blank | blank | blank — Matt fills |

Reconcile the scenario opening-cash to `Control!B15` so the displayed trough matches the live engine.

### Tab 11 — `Assumptions & Provenance`

Every named cell with source + confidence tag + recommended fix (port the v6 critical-review table). This is the trust layer; keep it on every linked cell. Add a `START HERE` note: "This is THE canonical model. v0.1, Goods-Financial-Model, and Bed-Cost-Model-v6 are archived."

---

## 5. INTERACTIVE BUILD SPEC — web `/admin/cost-model`

Changes to `v2/src/app/admin/cost-model/cost-model-explorer.tsx`. The component is already a clean reactive `computeModel(inputs)` pure function with grouped sliders and an `IdiotCard`; this is a refactor, not a rebuild. The web tool is the 60-second investor toy; the Google Sheet is the engine Matt extends. **Both must read the same canonical numbers** (repoint to `01-cost-model-idiot-index.json`, the v6 file).

**5.1 Fix the defaults (P0-4) — in the `DEFAULTS` object:**
- `founder_rate_per_day: 1000` -> `560` (locked)
- `beds_per_year: 500` -> `120` (today's honest run-rate)
- `freight_per_bed: 100` -> split into `long_haul_freight_per_bed: 150` + the existing local `25`
- `capital_to_factory_low: 90000 / high: 200000` -> render GROSS `112000 / 222000` with a net `~2000-112000` caption; never a single 90-200K string

**5.2 Add scenario preset buttons** wired off `cost_down_trajectory[]` in the v6 JSON. Five buttons that `setInputs()` all dials at once: `Today (Buy-Kit, 120/yr)` / `In-source assembly (~250/yr)` / `Factory at target (500/yr)` / `On-Country container (500/yr)` / `Community vision (1,000/yr)`, plus a blank `Investor case`. Demote the 28 raw sliders behind an "Advanced / edit assumptions" `<details>` disclosure; surface only **3 hero dials** by default: beds/yr, build method, founder-FTE%.

**5.3 Rebuild the output hierarchy (P0-1 of the tool) — replace the headline cards.** Today the #1 card is `fmt(model.fullKits)` ("Fully-loaded today", the ~$1,912-equivalent). Replace the four hero cards with the v6 honest stack:
- Card 1: **Marginal cost/bed** = `marginalKit` (~$685 today) -> `marginalFactory` (~$426). Add these to `computeModel`: `marginalKit = stateKits + i.long_haul_freight_per_bed` (note `stateKits` already includes the +25 local freight and assembly); `marginalFactory = stateFactory + i.long_haul_freight_per_bed`.
- Card 2: **Annual fixed block** = `~$109,500/yr` (at locked $560 founder rate; recompute `founderProductionPerBed` base) — shown as a block-to-fund, NOT a per-bed tax.
- Card 3: **Breakeven beds/yr** = `Math.round(fixedBlock / (retail - marginalFactory))` (~338 at $560 rate; ~378 at $1,000 — pick the locked one).
- Card 4: **Capital payback** = keep, but fix the basis (5.5).
- Demote `fullKits` to a clearly-labelled reference row: "Fixed-cost absorption at pilot volume — NOT a marginal cost."

**5.4 Add a founder-FTE slider + the teaching card.** Add `founder_fte_pct` (25/50/75/100) anchored to the $140K/yr full-time replacement (= $560/day × 250d). Render the `per_bed_wrong` ($1,500) vs `per_bed_right` ($300 -> $30) pair from `founder_time_split` as an explicit teaching card. Show an enterprise-P&L line WITH the founder wage fully loaded so the sustainability answer is visible. Set founder FTE to 100% by default — if it only stacks up at 0%, the tool should SHOW that.

**5.5 Fix the payback math (P1).** Replace `savingsPerBed = stateKits − stateFactory` (the full ~$259 delta) with the v6 legs saving `194.05`. Default beds/yr to 120 (5.1). Add a payback-vs-volume guard band: when beds/yr < 300, render "Capex only sensible above ~300/yr committed — buy Defy kits below that." A small line chart (x = 100->1,000, y = payback yrs on $112K and $222K) makes the ~300/yr rule visible.

**5.6 Add the containerise + location toggles.** A `location` select (Sydney-Defy / Sunshine Coast / On-Country) setting rent + freight, and a `containerise` boolean adjusting freight (-$70/bed) and capex (+container fit-out). These are the named Matt levers the tool is currently missing.

**5.7 Fix the value-vs-counterfactual card.** `valueVsCommercial = counterfactualMid / fullFactory` divides by a fixed-absorption number, inflating the multiple at low volume. Compute against MARGINAL cost, and label the counterfactual "inferred, no firm quotes."

**5.8 Repoint the data source.** Change the footer + the `DEFAULTS`/`firstPrinciplesFloor` to import `01-cost-model-idiot-index.json` (v6); delete inline magic numbers (`10.34`, `35`, `2`, `1.65`, `+25`, `+55.95`). Add the polymer-floor idiot index (~21x) alongside the 8.6x shred index. Add a "verified/modelled" provenance caption and an "Open full model (Google Sheet)" link. Encode input state in the URL query string so any scenario is a shareable permalink. Until 5.1-5.3 ship, keep the route admin-gated and do not screen-share it.

---

## 6. WHAT TO TELL MATT + WHAT IS STILL OPEN

### What we hand over end-of-June

A single Goods-only Google Sheet (Section 4 spec): a balancing 3-statement model (P&L -> Balance Sheet -> 36-month Cashflow that tie, with a balance-check row reading 0), driven from one Control Panel where every lever Matt named is a labelled dial — production location, manufacturing method (Buy-Kit / Buy-Panels / Factory / Community), freight, labour rate and throughput, containerisation, and founder FTE 25/50/75/100% — feeding COGS from the v6 cost ladder and revenue from a demand schedule. Underneath it sits the advisor evidence pack (`matt-document-bundle/`: BOM, supplier quotes, build paths, verified financials, provenance README). It is honestly labelled "Xero-mirror workpaper, not audited, ~89% grant-funded." Matt should be able to bolt his unit-costing and investment-scenario layer (3 salespeople + head of manufacturing, "$200K per plant -> return") straight on top of Tabs 4/9/10 without rebuilding.

**What we will NOT claim:** audited profitability, financial self-sufficiency, committed capital. CRM pipeline (~$3.42M active / $604K weighted) is internal only — prioritisation, not a secured commitment and not QBE-match evidence. The reframe does not make the bed cheaper; it re-partitions a fixed-cost-absorption artefact.

### Open founder decisions (Ben + Nic must close these — they gate the model)

1. **Net-vs-gross capital ask** — is the $110,046 already invested deductible from THIS equipment capex? Until resolved, quote $112-222K gross. (Owner: Ben)
2. **Real opening cash at 1 May 2026** — the $50K placeholder drives the entire cash trough; get the ACT-accounts Goods carve-out balance. (Owner: Ben)
3. **Founder rate lock confirmed everywhere** — $560/day, $84K/yr is locked in `04-verified-financials.md`; propagate it to the cost-model JSON/MD and the web tool, recompute the fixed block (~$109,500) and breakeven (~338/yr). (Owner: Ben)
4. **The ~$105K surplus discrepancy** — confirm whether after-founder surplus is $256,585 (re-derived) or $151,585 (and if so, what the extra deduction is). (Owner: Ben + accountant)
5. **HDPE mass** — is 20kg fixed, or is a 30-50% mass cut on the table? This is the highest-leverage single dial. (Owner: Ben + Defy)
6. **Committed-demand bridge to 300+/yr** — what is actually signed vs weighted pipeline? The favourable unit economics rest on volume the enterprise has not yet earned. (Owner: Ben + Nic)

### Questions for Matt

1. **Unit-costing depth:** which cost lines does your model want at higher fidelity than our `modelled` allocations (diesel 25L/5beds, labour $400/day/5beds, 5 beds/day throughput)? We can time-study a real factory run to convert these from modelled to verified — tell us which matter.
2. **Containerisation:** this is your "big question" and the one we have least data on. What container fit-out capex and freight-inversion assumptions do you want us to seed, or do you want to model it from scratch on Tab 3?
3. **Plant economics:** confirm the parameterised plant template (capex ~$200K, capacity ~1,000 beds/yr, payback on the $194/bed legs saving) is the shape you want to stamp 1..N for the multi-plant investment scenario.
4. **Returnable capital:** for SEFA (~$300K concessional debt), what term/rate should we model so the financing schedule and coverage check are realistic, and what coverage ratio would an investor want to see?
5. **Physics floor:** we found our cost floor was anchored on Defy's $2/kg shred SELL price; the true polymer floor (Envirobank $0.80/kg) puts the leg idiot index at ~21x, not 8.6x. Do you want the floor stated on raw polymer (stronger, more honest integration case) with shred shown as a separate bought-processed line?
6. **What output convinces an investor?** Your brief is "$X in -> confident these results and returns." Tell us the exact one-line output you want on the dashboard so we build the model to produce it, not around it.
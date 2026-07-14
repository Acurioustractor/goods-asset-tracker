# Goods Playable Model v1 — Build Note (2026-05-29)

**File:** `wiki/outputs/2026-05-29-qbe-investment-sweep/Goods-Playable-Model-v1.xlsx`
**Built per:** Section 4 of `03-world-class-model-review-and-build-spec.md` (11-tab spec).
**Formula dialect:** Google-Sheets-compatible only (IF, CHOOSE, INDEX/MATCH, MIN, MAX, ROUND, SUM, SUMPRODUCT). No macros, no array-only syntax.
**Tool:** openpyxl 3.1.5. Build script: `tmp/build_goods_model.py` (kept for re-runs; rebuilds the xlsx idempotently).

> **READ FIRST — xlsx formulas are NOT computed by openpyxl.** Every output cell below is a live formula. They were validated by recalculating the workbook in the pure-Python `formulas` engine (see "Validation" at the end), but you MUST sanity-check the dials on first open in Google Sheets — Sheets is the target runtime and is the authority.

---

## Design contract (what makes it world-class)

- **One Control Panel of yellow input dials drives everything.** No hardcoded magic numbers in COGS or the statements — every computed cell traces to `Control Panel` or `Assumptions & Provenance`.
- **Operating surplus is a FORMULA, never a hardcoded number.** Forward surplus = `contribution x beds − non-founder-fixed − founder_rate x days x FTE%`. Actuals surplus = `received − expenses − founder`. This structurally prevents the ~$105K contradiction the review caught.
- **Real articulated 3-statement model:** monthly P&L (36 mo) → net profit posts to retained earnings on the Balance Sheet → P&L net + depreciation + WC + capex/financing drive the Cashflow → closing cash links back to the BS cash line.
- **Visible BALANCE-CHECK row** (Total Assets − Total Liabilities − Total Equity) reads **0 in every one of the 36 months** (validated).
- **Colour:** yellow = input dial; unfilled = formula; grey = label/note; green = key output; pale-orange = banner/caveat. Every Assumptions input carries a confidence tag (verified / modelled / target / locked / inferred / TO CONFIRM).

---

## Tab-by-tab (order matches the spec)

### 1. `Control Panel` — the dials
Yellow dials at rows 14–30 (col B). **Dials:** Beds/yr (B15, =120), Annual growth % (B16, =60%), Price/bed (B17, =750), **Build method 1-4** (B18, =1 Buy-Kit), **Production location 1-3** (B19, =1 Sydney), **Containerise? 0/1** (B20, =0), **Founder FTE %** (B21, =100%), Labour $/day (B22), Throughput beds/day (B23), Local freight (B24), Long-haul freight (B25), **# container plants** (B26), Opening cash (B27, =50,000 TO CONFIRM), Founder day-rate (B28, =560 LOCKED), Founder days/yr (B29, =150 LOCKED), Use-scenario-preset 0-6 (B30).
**Dashboard outputs (green, rows B5–B10):** marginal cost/bed `='Unit Cost'!B14`, annual fixed block `=Assumptions!B35`, breakeven `='Unit Cost'!B18`, surplus after founder `='P&L'!E11`, gross capex `='Investment & Financing'!B5`, 36-mo cash trough `='Cashflow 36-month'!B20`. Banner row 2 carries the "~89% grant-funded / not audited / $112-222K gross / CRM internal-only" caveat.

### 2. `Unit Cost` — v6 cost ladder (formula-driven, no constants)
Build-path direct cost: Buy-Kit B3 (**534.79**), Buy-Panels B4 (**584.07**), Factory B5 (**275.74**), Community B6 (**140.74**); each is a formula off Assumptions BOM + factory inputs. Selected direct B8 `=CHOOSE(method,...)`. Marginal rows 11-13; **Selected marginal B14 (684.79 at default)** — the Control Panel dashboard reads this cell. Contribution B17 (`=price − B14`, 65.21). **Breakeven B18** `=ROUND(FixedBlock/contribution,0)` (1679 Buy-Kit / 338 Factory / 238 Community). Idiot index: vs-shred B21 (**8.6x**), vs-polymer B22 (**21.5x**), steel B23 (2.1x), canvas B24 (2.4x). Banner row 26 states the capital case.

### 3. `Location & Containerisation` — named levers as a lookup
3-row location table (rows 4-6): rent/yr, inbound freight, outbound freight for Sydney / Sunshine Coast / On-Country. **Selected (driven by Control Panel):** rent B9 (`=INDEX/MATCH` on location dial), inbound B10, outbound B11 (container-aware: if containerise=1 use On-Country outbound), container capex B12, container capacity B13, **effective long-haul freight B14** (feeds Unit Cost marginal). Selected rent B9 feeds P&L opex.

### 4. `Wages & People` — founder wage (FTE flows to P&L) + staffing layer
**Founder cost/yr B3** `=founder_rate x days x FTE%` (=84,000 at 100%) — the P&L founder line reads this. Production share B4 (=16,800). FTE sensitivity strip (rows 7-9) reads off the dial structure (25/50/75/100% → 21k/42k/63k/84k). Staffing hires block (rows 12-16): 3 salespeople @90k + head of mfg @130k, each with ramp-month dial and active-months/12 cost; 3-yr total E16; annual run-rate B17; **"Include staffing in forward P&L? 0/1" dial at B18** (default 0 = founder-only base case).

### 5. `Revenue` — demand-driven (beds is an output, not a free 500)
Demand schedule rows 4-6 (committed / weighted-pipeline / retail, each beds × probability, INTERNAL-ONLY clearly tagged). Driven beds D7. **Beds/yr used by model B8** `=Control Panel beds dial` (the demand schedule is the honest cross-check). **Y1 revenue B9** `=beds x price` (=90,000 at default).

### 6. `P&L` — forward annual summary + 36-month monthly + actuals anchor
- **Forward annual summary (rows 3-11):** revenue, variable COGS (`beds x selected marginal`), contribution, non-founder fixed, location rent, staffing, **surplus before founder C10**, founder cost C11, **surplus after founder E11**.
- **Actuals anchor / P0-1 waterfall (rows 15-21):** received 649,710.79 − expenses 309,126 = **surplus before founder C17 = 340,584.79**; less founder (FTE-scaled) = **surplus after founder C19 = 256,584.79** at 100% (NOT 151,585). Memo: billed, AR Rotary.
- **36-month monthly P&L (rows 24-35, cols B…AK = M1…M36):** beds (ramped by annual growth), revenue, COGS, gross profit, opex, founder/mo, EBITDA, depreciation (`='Investment & Financing'!B22`), interest (`='Investment & Financing'!B27`), **net profit row 34**, **cumulative net profit row 35** (→ posts to BS retained earnings).

### 7. `Balance Sheet & WC` — must balance
Monthly BS (cols B…AK = M1…M36). Assets: cash (row 4 = `'Cashflow 36-month'!closing`), AR (5), inventory (6, seed $50k dial B24), PP&E (7, capex − accum dep), **Total Assets row 8**. Liabilities: AP (10), GST (11), SEFA debt outstanding (12), **Total Liabilities row 13**. Equity: opening-equity plug (15, computed once at B23 so M1 balances), **retained earnings (16) = `'P&L'!cumulative net`**, capital injections (17), **Total Equity row 18**.
- **▶ BALANCE-CHECK row 20** = `Total Assets − Total Liabilities − Total Equity`. **The M1 balance-check cell is `'Balance Sheet & WC'!B20`** (then C20…AK20 for M2…M36). **Validated = 0 in all 36 months.**

### 8. `Cashflow 36-month` — derived from P&L (not hand-keyed)
Cols B…AK = M1…M36. Opening cash (row 5, M1 = Control Panel opening cash), net profit (6 = `'P&L'!net`), + depreciation (7), WC movements (8, held 0 for a clean tie — see simplification note), operating CF (9), investing (10, −new capex draw in M1), financing (11, SEFA draw at draw-month − repayments), net CF (12), **closing cash row 13** (→ BS cash). **Cumulative cash trough B20** `=MIN(closing-cash range)` — Control Panel dashboard reads this. Closing M36 at B21.

### 9. `Investment & Financing` — the returnable-capital answer
Gross capital ask LOW/HIGH B3/B4 (112k/222k), **gross capex midpoint B5 (167,000)** — dashboard reads this. Container capex B6, total new capex B7, invested B8 (110,046), net new cash B9. Legs saving B12 (194.05), payback yrs B14, **guard band B15** (`IF(beds<300, "not sensible below ~300/yr", "OK")`). Use-of-funds table rows 18-22 (QBE match / anchor philanthropy / SEFA / sunk). **Monthly depreciation B22** (`(new+invested capex)/60`). SEFA schedule rows 24-29: draw-month dial B25, principal/rate/term, **monthly interest B27**, monthly principal B28, coverage check B29.

### 10. `Scenarios` — presets
6 preset rows (4-9): Today / In-source / Factory-at-target / On-Country-container / Community-vision / Investor-case(blank). Selected-preset readout rows 12-16 driven by the Control Panel "Use scenario preset?" dial via `INDEX`. **To activate a preset: copy its row values into the Control Panel yellow dials** (or wire the dials to the INDEX cells). Banner explains this.

### 11. `Assumptions & Provenance` — the trust layer
Every named value with confidence tag + source/fix note (col A label, B value/formula, C tag, D note). BOM lines 5-10 → BOM sum B11 (469.79). Factory inputs, physics floor (B19-23), founder LOCKED block (B25-29), fixed-block components (B31-35), price/freight/labour (B37-43), verified financials (B45-51), capital ask (B53-61), SEFA (B63-65). START-HERE note + "xlsx formulas not computed by openpyxl" + entity line.

---

## Locked-number provenance (all traced, none invented)

| Figure | Value | Where it lives | Source |
|---|--:|---|---|
| BOM direct materials | 469.79 | Assumptions B11 | supplier-quotes.ts (6 verified lines) |
| Factory direct | 275.74 | Unit Cost B5 | supplier-quotes.ts `factoryDirectMaterials` |
| Buy-Kit / Buy-Panels / Community direct | 534.79 / 584.07 / 140.74 | Unit Cost B3/B4/B6 | locked block + spec reconciliation |
| Marginal (Buy-Kit / Factory) | 684.79 / 425.74 | Unit Cost B11/B13 | direct + 150 long-haul |
| Contribution @750 (Kit/Factory/Comm) | 65.21 / 324.26 / 459.26 | Unit Cost B17 (live) | price − marginal |
| Breakeven (Factory/Kit/Comm) | 338 / 1679 / 238 | Unit Cost B18 (live) | ROUND(109,500 / contribution) |
| Annual fixed block | 109,500 | Assumptions B35 | Kirmos 27k + admin 14.7k + field 51k + founder-prod 16.8k |
| Founder | 560/day × 150d = 84,000/yr | Assumptions B25-28 | LOCKED |
| Idiot index HDPE | 8.6x / 21.5x | Unit Cost B21/B22 | 344.05 ÷ {40 shred, 16 polymer} |
| Revenue received / expenses | 649,710.79 / 309,126 | Assumptions B46/B48 | Xero workpaper (NOT audited) |
| Surplus before / after founder | 340,584.79 / 256,584.79 | P&L C17/C19 | formula |
| Capex invested | 110,046 | Assumptions B49 | Xero |
| Gross capital ask | 112,000–222,000 | Assumptions B53/B54 | firm quote pending (NEVER "90-200K") |
| Opening cash | 50,000 | Assumptions B60 | **PLACEHOLDER — TO CONFIRM** |

---

## Formula simplifications (flagged per the fallback rule)

1. **Breakeven uses `ROUND`, not `ROUNDUP`.** The spec (Section 4, Tab 1) wrote `=ROUNDUP(fixed/contribution,0)`, but the LOCKED breakeven values (338 / 1679 / 238) match `ROUND`, not `ROUNDUP` (which would give 339 / 1680 / 239). I used `ROUND` to honour the authoritative locked numbers. Noted in the Unit Cost B18 cell note. If you prefer the conservative round-up, change `ROUND`→`ROUNDUP` and expect +1 on each.
2. **`P&L` sheet references are quoted as `'P&L'!`.** The unquoted `P&L!Cell` form is mis-parsed (the `&` reads as concatenation) by strict parsers; quoting is universally safe in Excel and Google Sheets. All cross-sheet refs to tabs containing `&` (Wages & People, Balance Sheet & WC, etc.) are likewise single-quoted.
3. **Working-capital movements held at 0** in the Cashflow (row 8) for a clean 3-statement tie, since AR (Rotary) and seed inventory are static in the forward model. This keeps the balance check exactly 0. Refine with monthly ΔAR/ΔInventory/ΔGST once real timing is known (noted in the Cashflow A22 cell).
4. **SEFA financing is interest-only on flat principal** (monthly interest = principal × rate / 12, plus straight-line principal repayment), not a full amortisation schedule. Simplified for Google-Sheets safety; noted in Investment B27.
5. **Scenario presets are copy-into-dials**, not a single auto-switch cell, because wiring every dial to `=INDEX(Scenarios…)` would make the dials read-only formulas (no longer hand-playable). The Scenarios tab shows the selected preset values; the user copies them into the yellow cells. Banner explains this.
6. **Note strings that began with `=`** (e.g. "= 534.79 …") were changed to start with `≈` so Google Sheets does not try to parse them as formulas.

---

## Validation (recalculated, not just written)

Recalculated the workbook in the pure-Python `formulas` engine (throwaway venv, since openpyxl does not compute). Confirmed against the locked block:

- **3-statement tie: BALANCE CHECK = 0 in all 36 months** (M1 cell `B20` = 0, M36 cell `AK20` = 0).
- Build paths exact: Buy-Kit 534.79 / Buy-Panels 584.07 / Factory 275.74 / Community 140.74.
- Marginal 684.79, contribution 65.21, breakeven 1679, idiot index 8.6x / 21.5x.
- Founder 84,000; actuals surplus before 340,584.79 / after 256,584.79; gross capex mid 167,000; Y1 revenue 90,000.
- **Dials re-flow correctly** (set beds + method, recompute): Factory @500 → before **+69,430** / after **−14,570**; Community @1,000 → before **+366,560** / after **+282,560**; Buy-Kit @500 → before **−60,095**. All match the locked forward scenarios exactly.

**The balance-check cell to watch on every period: `'Balance Sheet & WC'!B20` (M1), extending C20…AK20 for M2…M36.**

## Open items the model surfaces (gate before external use)
- Opening cash (Assumptions B60 / Control Panel B27) is a **$50k placeholder** — get the real ACT-accounts Goods carve-out at 1-May-2026; it drives the entire cash trough.
- Net-vs-gross capital ask: model quotes **$112-222k GROSS**; net (~$2-112k) is shown but the deductibility of the $110,046 is an open founder decision.
- Defy volume quote (500/1,000/5,000) and HDPE-mass challenge (20kg → ribbed/hollow) are not yet dials — flagged for Matt's layer.

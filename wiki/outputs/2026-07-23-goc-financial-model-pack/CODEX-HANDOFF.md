# Codex handoff — GOC financial model (Excel)

**Date:** 2026-07-23  ·  **Repo:** `/Users/benknight/Code/Goods Asset Register`  ·  **Branch:** `claude/investment-deck-alignment-y3qc43`
**Everything for this task lives in:** `wiki/outputs/2026-07-23-goc-financial-model-pack/`

## Mission

Build and iterate the **GOC-only financial model** for Ben's advisor **Matt Allen** (Social Impact Hub). Goods on Country (GOC) is a social enterprise making recycled-plastic beds for remote Indigenous communities; it is being split out of its parent (ACT) into an "investible entity" for a capital raise. Matt is building a GOC-only 3-statement model; **our job is to hand him the entity figures in his own spreadsheet format** so he can build it out, and to keep those figures correct and traceable.

**Ben's steer (important):** keep it SIMPLE. Do NOT build Matt's 3-statement model for him. Mirror the format of his own file and give him the figures. His file: `~/Downloads/GOC Bed Unit-Costing Model v2.xlsx`.

## What already exists (all in this folder)

| File | Role |
|---|---|
| **`GOC-Entity-Model-Inputs.xlsx`** | **THE deliverable to send Matt.** Simple, mirrors his format: single `Inputs` page (numbered blocks, blue=input, per-line Status + Source/notes, All AUD ex-GST) + a `Notes` tab. 7 blocks: historical actuals, opening position, GOC operating cost structure, community wraparound (Pot 2), capital stack, working capital & tax, bed-economics plug. |
| `goc-data-and-figures-pack.csv` | The 117-row sourced figure set behind everything. Columns: Section, Metric, Value, Unit, Status, Source, Notes. **Single source of truth for figures.** |
| `assumptions-alignment.md` | Reconciles Matt's bed model vs our canon; resolves his 7 open items; two-pots framing; recommended 3-statement shape. Read this first. |
| `GOC-3-Statement-Model.xlsx` | OPTIONAL worked reference (a 5-yr live-formula 3-statement build that balances). Not the thing to send. |
| `README.md`, `goc-data-and-figures-pack.provenance.md` | Overview + provenance. |
| `build/*.py` | The openpyxl scripts that generate the xlsx + csv. Edit these and re-run to regenerate (they are reproducible). `shadow_calc.py` is a pure-python check that the 3-statement balances. |

To regenerate after editing a build script:
```bash
cd "/Users/benknight/Code/Goods Asset Register"
python3 wiki/outputs/2026-07-23-goc-financial-model-pack/build/build_inputs.py   # -> GOC-Entity-Model-Inputs.xlsx
python3 wiki/outputs/2026-07-23-goc-financial-model-pack/build/build_model.py    # -> GOC-3-Statement-Model.xlsx
```
Note: the build scripts write absolute output paths near the top (`OUT=...`); keep those pointing at this folder.

## Matt's format to mirror (`~/Downloads/GOC Bed Unit-Costing Model v2.xlsx`)

Four sheets:
- **Inputs** — single page. Legend: `Blue = editable input. Black = formula. Green = link. All AUD ex-GST.` Numbered blocks (1. Cost per bed by path / 2. Facility build / 3. Overheads / 4. Production & sales / 5. Capital stack / Key outputs). Columns: label | per-path values | Source/notes. Totals are SUM formulas.
- **Capex Estimates** — `Item | Low | High | Selected | Basis/derivation | Source | Confidence` (confidence = web-sourced / derived / allowance / user input). Container-workshop costing.
- **Projection** — 10-year rows, self-funding container-build trigger.
- **Notes** — version log, sources, model logic, decisions log, deliberate exclusions, reconciliation checks.

Open his file and match its look and conventions when you edit ours.

## CRITICAL RULES — do not break these (each has burned us)

1. **The Factory production path is PROVEN.** The 40 Maningrida Stretch beds (invoice INV-0303) were made in-house end-to-end at the farm plant: HDPE legs shredded, hot-pressed, CNC-routed, then assembled. **NEVER write "zero beds pressed in-house" or "50-bed run is the missing evidence."** That wrong claim has regressed twice. What IS still open: the *measured* per-bed cost/time at a sustained rate, and the separate *on-country community-owned* path (community labour, free feedstock) which has not been run. Live code `v2/src/lib/data/cost-story.ts` / `ask-surface.ts` is the reference wording.
2. **Revenue:** the only externally-quotable figure is the **accountant-signed Goods-only carve-out $713,827**. Never quote the $403,901 "surplus" (the entity P&L is a net loss). Not accountant-reviewed statutory accounts; ~89% grant-funded.
3. **Two pots, never cross-subsidised on paper:** Pot 1 = production (bed revenue vs bed cost + $109,500 fixed block) self-funds at volume. Pot 2 = the community wraparound (facility ops + $300K/yr employment program) is grant/government-funded by design. Keep them as separate cost centres.
4. **Capex:** quote **gross $112-222K** OR **net ~$2-112K**, never "$90-200K". Sunk (evidenced) ~$75K; fresh-site replication ~$90-123K (mid ~$105K). The old "$110,046 facility" note is superseded — do not quote it forward.
5. **Every figure needs a status + a source.** Vocab: accountant-signed / verified / evidenced / derived / modelled (Factory process proven, cost not yet measured) / workpaper / assumption / placeholder. Container + equipment capex are modelled midpoints / desktop estimates, NOT firm quotes.
6. **Voice:** no em dashes (use commas or full stops), straight quotes, units no space (`20kg`), "On Country" capitalised. Never "co-design".
7. **Validate any formulas you add** by forcing a recalc and checking the numbers:
   ```bash
   soffice --headless --calc --convert-to xlsx --outdir /tmp/recalc "<file>.xlsx"
   # then read /tmp/recalc/<file>.xlsx with openpyxl data_only=True and check the totals/balance
   ```
   For the 3-statement model, the balance-sheet check row must be 0 every year.

## The canonical numbers (from the CSV — use these, don't re-derive)

- Price **$750**/bed. Marginal cost/bed: Buy-Kit **$684.79**, Factory **$425.74** (process proven, cost modelled), Community **$420.74**. Contribution: Factory $324.26 / Community $329.26. Break-even ~338 / ~333 beds/yr.
- Fixed block **$109,500/yr** (founder prod 16,800 + Kirmos 27,000 + admin 14,700 + travel 51,000). Equipment maintenance 5% of $167K per facility.
- Facility build **$207,450**/container (Matt) or central capex **$112-222K gross**. Sunk plant **~$75K**. Replication **~$105K**.
- Community wraparound (Pot 2, grant-funded): bare **$151,666/yr**, staffed **$341,666/yr**, program **$300,000/yr**.
- Historical (base year): revenue $713,827 (accountant-signed), cash received $649,711, AR $143,000, expenses $309,126, surplus-before-founder $340,585, ~89% grant-funded.
- Opening position: cash $50,000 (assumption), sunk plant $75,000, debt $0, opening capital $125,000.
- Capital stack (PLACEHOLDER): SEFA $300K (debt, Yr1), QBE $400K (debt, Yr2), philanthropy $500K (equity, Yr1); interest 6%; $0 signed match-eligible today.
- Working capital: debtor 30d, creditor 30d, inventory 45d; tax 25%; plant life 10yr.
- Deployment evidence: 540 beds (363 Basket + 177 Stretch), 22 washers, 11 communities, 3,540kg HDPE.

## Ben's 6 open decisions (they firm up the placeholders — update the sheet when he decides)

1. HDPE per-bed mass & rate ($55 @ 20kg×$2.75 vs Q&A $1-2/kg × 25kg) — reconcile against the "20kg diverted" claim.
2. Site capex — adopt sunk ~$75K / replication ~$105K; retire the $30K and $100-150K figures.
3. Capital ask — gross vs net (quote gross, sunk as evidence).
4. Capital stack — real split + QBE match ratio.
5. Community-facility block — bare $152K / staffed $342K / program $300K as three cost centres.
6. Measured run — were the 40-bed run's actuals (time/diesel/yield) captured? If not, a short measured run locks $425.74.

## Suggested next tasks

- Keep `GOC-Entity-Model-Inputs.xlsx` in Matt's exact format; refine as Ben decides the 6 above (they are all blue inputs / Notes-tab lines).
- When Matt + Malcolm finalise the bed unit-costing model, update block 7 (bed economics) to match.
- If asked to extend the worked 3-statement model: right-size the capital stack (the base case over-draws $1.2M vs modest capex, so it builds idle cash), or add a scenario toggle / monthly cash flow.
- Anything you send externally is workpaper, not audited — carry that caveat.

## Notion (Matt-facing)

Standalone page `3a5ebcf981cf817ea83cfc5d01fff65d` ("GOC Financial Model Pack (for Matt)") holds the Inputs sheet download, the CSV, and the notes. If you change the figures, that page needs updating too (it is the Matt-facing surface).

## Commits so far (LOCAL, not pushed)

`aa186de` pack+3-statement model · `1ba6a6d` Factory-path correction sweep · `ce9da4a` simple Inputs sheet. Commit your work; do not push without Ben's say (Tier 2). Do not write to Xero/GHL/Supabase/Notion-external without Ben (Tier 3).

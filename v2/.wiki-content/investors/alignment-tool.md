---
publish: false
reason: internal investor scoring matrix
---

# Investor Alignment Tool (markdown)

> Markdown recreation of Tab 3 from the CASE Smart Impact Capital spreadsheet. Score each investor 0-3 against our [[our-investment-needs|needs]]. Lives in Obsidian so we can edit in pairs (advisor + Ben) during calls. The xlsx original is preserved at `raw/2026-03-31-investor-alignment-tool-case.xlsx`.

## Scoring legend

| Score | Meaning |
|---|---|
| **3** | Very aligned |
| **2** | Somewhat aligned |
| **1** | Unclear / needs research |
| **0** | Not aligned |
| **—** | Not applicable / knockout fail |

A knockout score of 0 on any of the six knockout criteria removes the investor from the pipeline. Fit criteria are weighted by the priority set in [[our-investment-needs]].

## Summary table (current pipeline)

Columns in order: **Geo | Structure | Size | Return | Capital | Stage | Mission | Vision | Gov | Restrict | Impact | Connect | GeoExp | IndustryExp | ChallengeExp | FutureImpact**. Last column = overall status.

| Investor | Geo | Struct | Size | Ret | Cap | Stage | Miss | Vis | Gov | Res | Imp | Conn | GEx | IEx | ChEx | FutI | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| [[qbe-foundation]] | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 2 | 2 | 3 | 2 | 2 | 2 | 3 | **ANCHOR (committed)** |
| [[snow-foundation]] | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | **ANCHOR (partner)** |
| [[sefa]] | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 3 | 3 | 2 | 3 | 2 | 3 | 3 | 3 | **ACTIVE (opening)** |
| [[iba]] | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 2 | 2 | 3 | 3 | 2 | 2 | 3 | **ACTIVE (eligibility ✓)** |
| [[pfi]] | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 3 | **ACTIVE (EOI in)** |
| [[mindaroo]] | 2 | 3 | 3 | 3 | 3 | 3 | 2 | 2 | 2 | 2 | 2 | 2 | 1 | 1 | 1 | 3 | **WARM (research needed)** |
| [[first-australians-capital]] | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 2 | 2 | 2 | 3 | 2 | 2 | 3 | **OPEN** |
| [[tim-fairfax]] | 3 | 3 | 2 | 3 | 2 | 2 | 3 | 2 | 1 | 1 | 2 | 2 | 3 | 1 | 1 | 2 | **RESEARCH** |
| [[dusseldorp]] | 3 | 3 | 2 | 3 | 2 | 2 | 3 | 2 | 1 | 1 | 2 | 2 | 2 | 1 | 1 | 2 | **RESEARCH** |
| [[qbe-ventures]] | 3 | 1 | 3 | 1 | 1 | 1 | 2 | 1 | 1 | 1 | 2 | 3 | 2 | 2 | 2 | 3 | **DEFERRED (2027)** |
| [[tfn]] | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 2 | 3 | 3 | RECEIVED |
| [[frrr]] | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 2 | 2 | 2 | 2 | RECEIVED |
| [[vfff]] | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 2 | 1 | 2 | 2 | RECEIVED |
| [[amp]] | 2 | 3 | 2 | 3 | 3 | 2 | 2 | 2 | 3 | 2 | 2 | 2 | 1 | 1 | 1 | 2 | RECEIVED |

## Detail panels

Each investor has their own profile card (see sidebar) with:
- Mandate details
- Deal history / patterns
- Key contacts
- Current status
- Next-action and owner
- Notes on correspondence

Link out from rows above.

## How to use this

1. When a new prospect appears, create a profile card file in this folder.
2. Run them through [[knockout-criteria]]. Any 0 = stop.
3. Score the 10 fit criteria 0-3.
4. Add a row to the summary table above.
5. Re-score as intelligence improves; log date of last score.

## Export

The original xlsx tool with dropdowns, conditional formatting, and formulas is at `raw/2026-03-31-investor-alignment-tool-case.xlsx`. For formal submissions (e.g. QBE Stage 2 data room), regenerate the xlsx from this markdown using a script in `outputs/` (not yet written).

## Sources

- `raw/2026-03-31-investor-alignment-tool-case.xlsx`
- `raw/2026-03-31-qbe-induction-slides-fulltext.md`

## Related

- [[our-investment-needs]]
- [[knockout-criteria]]
- [[investor-categories]]
- [[investor-pipeline]]

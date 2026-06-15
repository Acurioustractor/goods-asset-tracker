# Cost model: all links + tested artifacts (for Matt)

**Date:** 2026-06-16 · **Why:** the production cost model has gone to Matt; feedback due against the end-June deadline. Everything for the model in one accessible place. No em dashes (brand rule).

## Google Drive

**Goods - Financial Model & QBE Bundle (2026-05)** (the bundle, shared "anyone with the link can view"):
https://drive.google.com/drive/folders/1QEzivSw0jydwByAM8PA3VH8-wMlUG1iX

| File | What it is | Link |
|---|---|---|
| Goods — Cost per bed (playable) | The playable cost model (Google Sheet), updated 10 Jun | https://docs.google.com/spreadsheets/d/1-w6aJabegE7v3jxq0vGoQxAIlX70S2w182XY-HjRQiQ/edit |
| Raw data (CSV) v3, v6 community parity | The model's input / test data | https://drive.google.com/drive/folders/1uy_P1sSdrqBxU8JSAopOH1kt1GUPEom- |
| 01-bill-of-materials.md | The BOM (8.6x markup evidence) | https://drive.google.com/file/d/1xagwmzyHbssyJhxOpCq4KzY5yy9lGTC6/view |
| 02-supplier-quotes.md | Supplier quotes | https://drive.google.com/file/d/1T60J2IZE9c7nb2-0yIuFsz8pnOGSrbRl/view |
| 03-cost-model-and-build-paths.md | The three build paths | https://drive.google.com/file/d/1pDBk0WDqYLMYScurX3gruoolQ83rghEJ/view |
| 04-verified-financials.md | Verified financials | https://drive.google.com/file/d/1rMppYde8ytP5YYhl2BkfIrEDmE8HycqG/view |
| README.md | Bundle readme | https://drive.google.com/file/d/1k2H4klbmd19ZRyy4JrHgz2oeM77zTExz/view |

**qbe-catalysing-impact** (program docs: induction slides, Investor Alignment Tool, EOI):
https://drive.google.com/drive/folders/1OaFiEqlvB27G38J9aUn5aww3kEY6QdaT

## Live and interactive (investor login on goodsoncountry.com)

- Cost Lab + playbook: /sites/cost-lab
- Cost-model cockpit: /sites/qbe
- Cost-story (public): /cost-story

## In the codebase (the engine and its automated tests)

- Engine: `v2/src/lib/cost-model/engine.ts`
- Tests: `v2/src/lib/cost-model/engine.test.ts` (the model is unit-tested)
- Hook: `v2/src/lib/cost-model/use-cost-model.ts`

## Supporting documentation (repo `wiki/outputs/`)

- `2026-05-29-cost-model-cockpit-v6-handoff.md`
- `2026-06-05-goods-best-case-scenario.md`
- `2026-06-05-cost-lab-playbook.md`
- `2026-05-30-3-statement-model-v0.2-audit.md`
- `2026-06-02-goods-cost-per-bed-simple/`
- `2026-05-12-financial-model-day1` through `day10` series

## What we have validated (headline results)

- 8.6x markup on bought-in legs, saves about $194 per bed (verified, BOM).
- About $110,046 press capex already spent (verified).
- Three build paths: Buy-Kit $685, Factory in-source $426 (engine-locked), community in-source lower again (modelled). Exact current figures live in the playable sheet.
- Break-even drops from about 1,679 to 338 beds per year as we in-source.
- Still modelled / to test: facility and container capex ($112K to $222K), and the 50-bed in-source run (0 beds built in-house yet).

## Access note

The bundle folder is shared "anyone with the link can view," so Matt can open everything via the links. If it should be locked to named people (it is a financial model), change the folder's share setting.

## Notion

This is also a child page under the QBE Opportunity Hub: "Cost model: all links + tested artifacts (for Matt)".

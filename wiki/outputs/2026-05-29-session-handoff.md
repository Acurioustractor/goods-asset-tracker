# Session handoff — 2026-05-29 (theory of change + MEL)

## Shipped this session
Reworked the Goods theory of change from an operating-cycle diagram into a **results-chain logic model** (inputs → activities → outputs → outcomes → impact), aligned to SIH Diagnostic V4 + QBE priorities (Inclusion + Climate Resilience), and produced the written TOC + MEL deliverable. Health claims verified by a fan-out research + adversarial-verification workflow.

**Committed + pushed:** commit `ce8435d` on branch `wip/dashboard-rebuild-2026-05-28`.
**PR #35 MERGED to main** (2026-05-29) → https://github.com/Acurioustractor/goods-asset-tracker/pull/35

## Canonical artifacts
- Diagram source: `scripts/generate_theory_of_change.py` → `v2/public/theory-of-change.{svg,png,pdf}`
- Web component: `v2/src/components/marketing/theory-of-change.tsx` (embedded on `/impact`, between header and dashboard)
- Written TOC + MEL: `wiki/outputs/2026-05-29-goods-theory-of-change-and-mel.md`
- Health evidence appendix (verified citations): `wiki/outputs/2026-05-29-goods-health-evidence-appendix.md`
- Pencil operating-cycle (secondary visual): `design/goods-theory-of-change-v2.pen` (in app memory; Cmd+S to persist)

## Key corrections made (accuracy)
- RHD cost **$250K → ~$70K per surgical admission** (END RHD 2018) in the MEL doc AND `impact-model.ts`. $250K was unsubstantiated.
- Scabies "1 in 3" → "up to ~one-third (16–35%)" (Davidson 2020, MJA).
- Skin→RHD pathway → "recognised but emerging" (RHDAustralia 2025).
- 59% = FRRR "homes that do not have" a machine (NT); Housing for Health = 40% fewer infectious-disease hospitalisations (substantiated, NSW Health 2010); 94% of new ARF cases are First Nations (substantiated).

## Open / next steps
1. **Pencil GUI port — BLOCKED (optional, marginal).** `open_document` is a permanently missing MCP method in this Pencil build; restarting the app does NOT fix it (confirmed 2026-05-29). Only path: in the Pencil GUI do **File → New** (blank doc, make it the active tab), then `python3 scripts/_gen_pencil_logicmodel.py`, `set_variables` on the active doc, and feed `/tmp/pencil_lm.js` as ONE `batch_design` targeting the active editor (no `open_document` call). Export PNG/PDF, Cmd+S to persist. Canonical SVG model is already merged, so this is purely GUI-editing convenience.
2. **Founder sign-off** on health prevalence/cost claims before any external/funder use (see appendix "How to use"); attach a primary citation where flagged.

## Left untouched (other workstreams — do not sweep in)
Pre-existing uncommitted files: `v2/src/lib/data/supplier-{cost-actuals,quotes}.ts`, `wiki/outputs/2026-05-28-*`, `wiki/outputs/2026-05-29-qbe-area-*`, `wiki/outputs/brand-review-2026-05-28/`, `output/`, `tmp/`. These belong to separate sessions; the TOC commit deliberately excluded them.

# Codex: add the problem data to the live model

11 September 2026. From the Claude Code session on `feat/ai-tells-gate-and-goods-model` in
worktree `/Users/benknight/Code/goods-finance-wt`.

**Sheet:** https://docs.google.com/spreadsheets/d/1Sh0Kk0CI0NSeO_H0T8P91H8skBJLpKkRfcQjRWTd-5Y

**What to add:** a tab called **The problem**, placed before The plant so it reads first.

**The content is already written:** `deliverables/qbe-stage2/pages/problem-tab-for-sheet.md`.
Four sections, one per impact area, each a table of figure, what it counts, as-at, grade and
source, plus the claim ceiling for that area.

## The rule that matters

This tab **reads** the modules. Every figure originates in a typed module with guards:

| Area | Module |
|---|---|
| Health | `v2/src/lib/data/rhd-problem.ts` |
| Environment | `v2/src/lib/data/recycling-problem.ts` |
| Employment | `v2/src/lib/data/employment-problem.ts` |
| Ownership | `v2/src/lib/data/ownership-problem.ts` |

If a figure needs to change, it changes in the module first and then here. Please do not add a
figure to the tab that has no module row behind it, and please do not compute anything from these
numbers inside the sheet.

## Four things the guards enforce, which the tab must not break

1. **No figure may be multiplied by a bed count.** That covers the health rates, the national
   plastic tonnage, the employment rates and the sector figures. Each module has a test
   asserting it.
2. **Grades travel with figures.** `verified` means the primary source was read. `unverified`
   means a departmental or secondary summary was read and the primary was not opened. Six rows are
   unverified and each carries its reason. Keep the grade column.
3. **The claim ceilings are constants in the modules and are load-bearing.** Health claims no prevented
   case. Recycling claims no measured diversion and the national 14% describes no Goods community.
   Employment claims no job created. Ownership claims no Goods result. Each ceiling should appear
   under its section.
4. **The 40-to-100-times ownership claim is marked do-not-use.** The 68.4% against 3 to 5% is the
   same point read from the primary and is the line to use.

## The join worth making visible

AIHW names household overcrowding as the risk factor for the Strep A to acute rheumatic fever to
rheumatic heart disease chain, and defines it by the Canadian National Occupancy Standard. That is
the same standard the ABS extract uses. So the overcrowding figures already on the community tabs
are the risk-factor measure itself.

If there is a neat way to show that link on the tab, it is the strongest single thing in the
problem section. AIHW's regional figures: Arnhem Land and Groote Eylandt 70%, Central Australia
49%, Kimberley 35%, against 15% nationally.

## Also worth knowing

`community-need.ts` now carries the whole ABS table, 1,138 ILOCs, in
`v2/src/lib/data/abs-iloc-overcrowding.json`, with a nine-entry crosswalk deciding which ILOC
describes which served community. Maningrida Outstations is a separate ILOC at 80.4% overcrowding
against the township's 60.2%, and it was invisible before.

Mount Isa's persons-per-dwelling was corrected from a hand-typed 3.13 to the ABS 2.91.

Nothing in this session has been pushed. The branch is 33 commits ahead of `origin/main`.

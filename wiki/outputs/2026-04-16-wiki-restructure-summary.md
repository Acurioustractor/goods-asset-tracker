# Wiki Restructure (April 2026)

> Generated 2026-04-16. Summary of the April 2026 restructure of the Goods wiki around the QBE Catalysing Impact 2026 program.

## What changed

**Before:** flat `articles/` folder with 3 files (INDEX.md, linked-wikis.md, qbe-catalysing-impact-2026.md). Karpathy pattern in place but content thin.

**After:** 9 topic folders, 60+ articles, full CASE Investor Alignment Tool recreated in markdown for Obsidian editing, full-text slide capture added as raw source, signed enterprise agreement + funder letter + EOI ingested.

## New folder map

```
wiki/articles/
├── INDEX.md                       ← updated: full map
├── linked-wikis.md                ← unchanged
├── qbe-catalysing-impact-2026.md  ← now a redirect pointer
├── capital/                       (8 files)   instruments, blended finance, stack
├── investors/                     (16 files)  profiles + CASE alignment tool
├── governance/                    (7 files)   board, risk, legal, policies
├── program/                       (8 files)   QBE program operational
├── support-network/               (6 files)   SIH, PIN, legal, advisory, peers
├── impact/                        (6 files)   ALMA, EL, theory of change
├── products/                      (5 files)   stretch bed, washing machine, plant
├── communities/                   (9 files)   PICC, TC, Alice, NPY etc.
└── enterprise/                    (scaffolded; 10 durable diagnostic topic articles to populate post-session)
```

## Raw sources added

- `2026-02-qbe-expression-of-interest.pdf` (ingested from Downloads)
- `2026-03-31-qbe-enterprise-agreement-signed.pdf` (ingested from Downloads)
- `2026-03-31-qbe-letter-to-funders.pdf` (ingested from Downloads)
- `2026-03-31-qbe-induction-slides-fulltext.md` (text-only capture of the 62-page induction deck for agent reasoning)

## Key restructure decisions

1. **Lean hard into capital, investor, governance.** These are the operational frontier for the QBE program. Three dedicated folders.
2. **Recreate the CASE Investor Alignment Tool in markdown** (`investors/alignment-tool.md` + `investors/our-investment-needs.md`) so it can be refined in Obsidian as we talk to investors. The xlsx original is preserved in `raw/`.
3. **One article per investor** (knockout / fit / notes), linked from the alignment tool matrix.
4. **Separate `thoughts/shared/qbe-program/diagnostic/` from `wiki/articles/enterprise/`.** The former is time-boxed for the upcoming 3-hour PIN diagnostic session. The latter is durable. Post-session, diagnostic learnings fold into enterprise articles.
5. **Cross-link, never duplicate, with the ACT Tractorpedia.** LCAA method, Beautiful Obsolescence, OCAP principles, PICC history all live in the ACT wiki. We link from Goods wiki.
6. **Cross-link, never duplicate, with v2 codebase data.** Product specs live in `v2/src/lib/data/products.ts`.
7. **Updated AGENTS.md** with new folder conventions, focus topics, and naming rules (including "no em dashes" and "always capitalise On-Country").

## What's stubbed vs populated

**Populated (substantive):**
- `capital/` — all 7 articles fully written.
- `investors/README`, `alignment-tool`, `our-investment-needs`, `knockout-criteria`, `investor-categories`, `investor-pipeline`, `qbe-foundation`, `sefa`, `snow-foundation`, `iba`, `pfi`, `mindaroo`, `qbe-ventures`, `beck-parkinson` — substantive.
- `governance/` — all 7 articles substantive.
- `program/` — all 8 articles substantive.
- `support-network/` — all 6 articles substantive.
- `impact/` — all 6 articles substantive.

**Stub-plus (short, extensible):**
- `investors/first-australians-capital`, `tim-fairfax`, `dusseldorp`, `tfn`, `frrr`, `vfff`, `amp` — short profiles, extend as we research.
- `products/*` — short, because the canonical source is `v2/src/lib/data/products.ts`.
- `communities/*` — short, because canonical data is in `v2/src/lib/data/compendium.ts` and ACT Tractorpedia.
- `enterprise/` — scaffolded; 10 durable diagnostic topic articles to be created from `thoughts/shared/qbe-program/diagnostic/` after the PIN session.

## What to do next (in this wiki)

- [ ] Run a first sanity-edit pass in Obsidian to refine the investor scoring in `investors/alignment-tool.md`.
- [ ] Populate `investors/first-australians-capital` with a full profile (research required).
- [ ] Write a markdown-to-xlsx generator under `outputs/` so Stage 2 data-room can export the alignment tool back to xlsx.
- [ ] After the PIN diagnostic session (by 31 May 2026), create the 10 durable `enterprise/*` articles from the learnings.
- [ ] Build out `impact/impact-measurement-report.md` from a stub into a full report before August 2026.
- [ ] Compile a 3-statement financial model (outside the wiki; the wiki just links to it).

## Sources feeding this restructure

- `raw/2026-03-31-qbe-induction-slides-fulltext.md`
- `raw/2026-03-31-investor-alignment-tool-case.xlsx`
- `raw/2026-03-31-qbe-enterprise-agreement-signed.pdf`
- `raw/2026-04-02-email-jay-boolkin-qbe-induction-recap.md`
- `thoughts/shared/qbe-program/session-1-learnings.md`
- `thoughts/shared/qbe-program/diagnostic/` (all 10 topic drafts)
- `v2/docs/GOODS_STRATEGY_PD.md`
- `v2/docs/COMPENDIUM_MARCH_2026.md`
- `act-global-infrastructure/wiki/concepts/act-identity.md`
- `act-global-infrastructure/wiki/concepts/alma.md`
- `act-global-infrastructure/wiki/projects/goods-on-country.md`

---
reviewed: 2026-09-12
ruling: Ben, 12 Sep 2026, make the sheet the core that keeps all the numbers in step. Inverted on the evidence: the guarded modules are the core and the live workbook is a view of them.
canon: [year.needs, year.asked, line.runDaysPerMonth, line.pressPerDay, line.bedsPerMonth, line.wittaPerYear, bed.pressedKg]
sources: [v2/src/lib/data/sheet-canon.ts, v2/src/lib/data/the-year-and-the-raise.ts, v2/src/lib/data/capital-stack-flex.ts, v2/src/lib/data/demand-and-buyers.ts, v2/src/lib/data/who-has-asked.ts, v2/src/lib/data/production-route.ts, v2/src/lib/data/loi-pipeline.ts, tools/sheet-canon.mjs, tools/sheets.mjs, tools/check-wiki-canon.mjs, tools/check-ai-tells.mjs, deliverables/qbe-stage2/sheet-canon.json, deliverables/qbe-stage2/codex-sheet-canon-receipt.json, deliverables/qbe-stage2/codex-flatpack-route-receipt.md, deliverables/qbe-stage2/real-forms-review-2026-09-12.md, v2/package.json, wiki/AGENTS.md, Notion 3d8ebcf981cf8128bd9aee918f49733f]
supersedes: []
---

# Where the raise lives

> The raise is spread across a repository, a Google workbook, seven Notion pages, six published artifacts, a CRM, a Xero organisation and this wiki, and somebody asks it a question from a different one of those every day. This page is the map. It says which surface holds which part, who owns it, how fast it moves, and which surfaces are sources and which are only views. The ruling that makes it work sits in the first section: the guarded modules in `v2/src/lib/data/` are the core, and the live Google workbook is a view of them. Read this before changing a number anywhere, because most of the contradictions this year came from two surfaces holding the same figure and only one of them being edited.

## The architecture ruling, in full

Ben asked on 12 September 2026 for the sheet to be the core that keeps all the numbers in step. The build inverted it, and the reason is worth stating plainly, because it decides where every future edit goes.

The workbook cannot be the core. It has no guards, nobody can run a test against it, and it had already drifted from the modules in eleven places. One of those was an availability cell still reading 100% four days after Ben set 80%, so the Calculator counts 20 working days where the ruling gives 16 run days a month, and every capacity figure downstream of that cell is wrong. A surface that anybody can edit and nothing can check will drift again.

So the arrangement runs the other way. **The guarded modules in `v2/src/lib/data/` are the core. The live workbook is a view of them.** `v2/src/lib/data/sheet-canon.ts` holds the one list of settled figures the workbook is allowed to carry, 46 of them today, and every value is imported from a guarded module and none is retyped. Its guard test writes `deliverables/qbe-stage2/sheet-canon.json`, which is the machine-readable copy every tool reads. A figure changes by changing the module, running the tests and pushing again. Figures flow from the modules into the workbook, and never back.

`tools/sheet-canon.mjs` does the work, with four commands:

- `show` prints the canon and the known drift, with no network.
- `push` writes or refreshes the **Canon** tab in the workbook.
- `check` reads the Canon tab back and reports every figure out of step.
- `prompt` emits a Codex brief for doing the same by hand when the API is closed.

## The Canon tab as it stands today

The Canon tab exists. A Codex agent built it by hand on 12 September from the generated brief, because `push` is blocked, and the receipt is at `deliverables/qbe-stage2/codex-sheet-canon-receipt.json`. Three things about it decide how much you can trust a number you read in the workbook.

**It was written from an older canon.** The receipt records 41 keys against the 46 the modules hold now. Eight of those 41 values have moved since and five keys are new, because the flat-pack ruling landed the same day. The press went from 3 kits a day to 6, the month from 48 kits to 96, the modelled year from 576 kits to 1,152, and the shred through the tab press from 36 kg a bed to 15 kg a dispatched kit.

**No tab computes from it.** The receipt records a single reference cell, `Calculator!G27`, for freight. Every other settled figure in the workbook is still a typed literal, so it can be edited over, and nothing will say so.

**Seven of the 46 carry a recorded drift note.** Among them: no tab carries `year.needs` at all, so $747,950 appears nowhere in the workbook; the Money tab's December receipts read $700,000 against the $600,000 of `year.asked`, because a SEFA line of ours is counted inside it; and the Calculator still shows 100% availability against the 16 run days a month that 80% gives.

All of it turns on one share. `tools/sheets.mjs` authenticates and the Sheets API answers, and the only error is a permission denial on the file. Share the workbook with `subscription-scanner@act-subscription-tracker.iam.gserviceaccount.com` as Editor and `push` and `check` both start working, cell by cell, leaving the workbook's formulas alone. That share is Ben's, and it is the cheapest unblock on the list.

## Every surface, and what it is for

| Surface | What it holds | Who owns it | How fast it moves | Source or view |
|---|---|---|---|---|
| `v2/src/lib/data/*.ts`, the guarded modules | The model: price, route, the year, the raise, trade, demand, claim ceilings. Eleven modules carry the model, and `model-consistency.guards.test.ts` holds 29 cross-module invariants that fail when two of them stop agreeing | Written by agents, ruled by Ben | Same day as a ruling | **Source** |
| `v2/src/lib/data/sheet-canon.ts` and `deliverables/qbe-stage2/sheet-canon.json` | The 46 settled figures, each imported from a module. The JSON regenerates from the test suite | The test suite | Every test run | **Source**, assembled from the modules |
| Live Google workbook `1Sh0Kk0CI0NSeO_H0T8P91H8skBJLpKkRfcQjRWTd-5Y` | Scenarios, input cells, the calculator, funding timing, the things people want to type into | Ben and Nic | By hand, most days | **View**, once the Canon tab drives it |
| Notion front door `3d8ebcf981cf8128bd9aee918f49733f` and its six sub-pages | The applications in words: answers, attachment registers, blockers | Ben | Daily while the raise is open | **View** of the model, and **source** for form wording and funder correspondence |
| Six published artifacts | The control room, the 25 questions, the loops, the plates, the enterprise walk-through, the TFN answers | Rebuilt by agents on request | On republish | **View** |
| This wiki, `wiki/articles/` | Judgement: what was decided, why, what may be claimed, what has been retired | Whoever writes it, gated by two checkers | Per ruling | **Source** for reasoning, **view** for figures |
| GHL | The deal record: contacts, opportunities, pipeline stages | Ben | Live | **Source** for who is where |
| Xero, Nicholas Marchesi sole trader, ABN 21 591 780 066 | Invoices raised and settled. The trade record in `demand-and-buyers.ts` is read from here | Nic, with Eloise on the accounts and the FY26 repair | Live | **Source** for money |
| Supabase, Goods v2 project `cwsyhpiuepvdjtxaozwf` | The asset register, `community_demand`, orders | The app | Live | **Source** for beds deployed and recorded asks |
| The app itself, public pages and `/admin` | Renders the modules. `/admin/ask` is the private working home for the raise, `/admin/loi-tracker` reads the GHL pipelines live | The app | Vercel deploys about ninety seconds after a merge | **View** |
| `deliverables/qbe-stage2/` | Drafts, answer packs, reviews and machine receipts. `codex-sheet-brief.md` is generated by `sheet-canon.mjs prompt` and is regenerated, never hand-edited | Agents | Per session | **View**, with the receipts as evidence |

## Notion, the working home

The front door is **Goods on Country, the raise, start here**, `3d8ebcf981cf8128bd9aee918f49733f`, under Goods. Every application, artifact and blocker hangs off it, and all six sub-pages link back to it.

| Page | Id |
|---|---|
| QBE final application, with the attachment register | `3c6ebcf981cf809aad0eeafda8e8e9fa` |
| QBE Stage 2 submission pack | `3d8ebcf981cf8152a7d9fb114e39e2ef` |
| Brian M. Davis | `3d8ebcf981cf81dbb2defb430458ea50` |
| Tim Fairfax, against the real form | `3d8ebcf981cf81c9ada9c61eabed022a` |
| SEFA Backing the Bold, against the real EOI | `3d8ebcf981cf8147aef9c629e6107483` |
| The capital stack, and how it flexes | `3d8ebcf981cf81adab03e68bc9ed29d3` |

Notion holds one thing nothing else does: the real form wording, pasted into toggles. Our paraphrases of a form are worth nothing when the assessor reads the field. Everything else on those pages is a view of the modules and is rewritten when a module moves.

## The six published artifacts

| Artifact | Id |
|---|---|
| QBE Control Room | `b45c45a0-378b-41a0-b635-eaa461d0957f` |
| The 25 Questions | `92ad473f-91e5-4ec8-b68c-2c3580102cb5` |
| TFN answers, cut and paste | `eb4bd86c-20b7-4027-a3b4-1a77ca49477c` |
| The Two Loops | `58d96a4b-616e-49ac-b274-8237929ae68a` |
| Three Plates for the Deck | `69266095-8cfc-43ab-b81f-ed71b4e2b3de` |
| How a Bed Becomes an Enterprise | `90e5a525-b65b-48ae-8a34-95bf6268a728` |

Each one is generated from the modules and republished. Anyone can republish an artifact from another session, so re-read one before editing it.

## GHL, the deal record

GHL is where a relationship and its stage live, and the app reads three Goods pipelines by id, verified against `get-pipelines` on 30 May 2026 in the Goods location, whose id begins `agzsSZWg`:

| Pipeline | Id | What it carries |
|---|---|---|
| Goods, Demand Register | `UQsrmuqzxMSdCTklxEcG` | Unworked demand signals |
| Goods, Buyer Pipeline | `FjMyJM3YzWQFmKqR9fur` | Commercial bed sales |
| Goods Supporter Journey | `JvBFYpVpyKsw899lkFgj` | All philanthropy: foundations, grants, major donors, capital |

Two cautions live with it. A GHL stage named Committed is a pipeline status and says nothing about a signed document, and the QBE coverage test needs signed paper. And money is read from Xero, never from a CRM figure.

## This wiki, and the copies that will bite you

`wiki/articles/` is where judgement lives: the reasoning, the rulings, what may be claimed and what has been retired. Two gates run on it, and both have to come back clean before anything is published:

- `node tools/check-wiki-canon.mjs <file>` reads the frontmatter, checks every canon key exists and that the article prints the value that key holds today, and flags articles reviewed long before the rest of the wiki.
- `node tools/check-ai-tells.mjs <file>` fails the writing patterns from the Wikipedia guide to signs of AI writing, including em dashes and the negative-parallelism family.

**The hazard.** This wiki exists in every checkout of the repository. On 12 September 2026 `git worktree list` showed thirteen checkouts carrying `wiki/articles/`, holding between 102 and 164 files each, and a fourteenth copy inside the app at `v2/.wiki-content/`, which `npm run wiki:sync` regenerates by copying `wiki/articles/` across (`v2/package.json`).

The committed content is the same everywhere today: `main` and this branch both hold the same 139 articles with no diff between them. All of the drift is in working copies. The checkout in the folder called `Goods Asset Register` is sitting on the branch `feat/empathy-ledger-accountability-events` with thirteen wiki files edited and three new articles untracked, and this worktree holds twenty-five new articles that exist nowhere else until the branch merges. Reading a folder tells you what one session was doing, and it does not tell you what is settled.

**The home is `wiki/articles/` on `main`.** Everything else is a mirror: a worktree copy is a draft until its branch merges, and `v2/.wiki-content/` is generated output that nobody edits by hand. Before quoting a wiki article, run `git rev-parse --show-toplevel` and `git branch --show-current` to see which copy you are reading, and check the article's `reviewed:` date against the rest of the wiki.

## When two surfaces disagree

1. The guarded module wins. Open the file, read the constant and the comment above it, and cite the line.
2. If the module and the canon disagree, the tests have not been run. Run `npx vitest run src/lib/data/sheet-canon` from `v2/`, which rewrites `sheet-canon.json`.
3. If the workbook and the canon disagree, the workbook is stale. Run `node tools/sheet-canon.mjs check` once the share exists, and `show` until then.
4. If a Notion page, a deck slide or an artifact disagrees with a module, fix the page, then add the retirement to [[capital/what-we-no-longer-say]] the same day. Rule 14 in `wiki/AGENTS.md` makes that part of the edit, and it exists because nine articles here told funders the QBE grant was matched dollar for dollar months after ruling V retired that.
5. If the real form wording disagrees with our paraphrase of it, the form wins, every time.

## Related

[[the-raise]] is the front door and the reading order, and it links every article in this build. [[capital/the-money-model]] holds the price and the provisional cost. [[capital/the-blockers]] holds the ten things owed and who owes them. [[capital/what-may-be-claimed]] holds the claim ceilings. [[capital/what-we-no-longer-say]] holds what has been retired and the ruling that retired it. [[governance/the-entity-question]] holds the decision that three applications wait on. [[trade/what-has-been-bought]] holds the invoice record. [[production/the-flat-pack-route]] holds the route every capacity figure in the workbook now has to follow.

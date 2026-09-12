---
date: 2026-09-12T17:30:00+10:00
session_name: goc-one-entity-reconcile
branch: feat/ai-tells-gate-and-goods-model
status: handoff
audience: codex
---

# One entity: reconcile every surface

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-12T17:30:00+10:00
**Goal:** Every surface in both trees says the same thing about the entity, and that thing is the
12 September ruling. Done when the stale two-entity language is gone from code, guards, wiki and
root docs, the retirements are recorded in `capital/what-we-no-longer-say.md`, both `DECISIONS.md`
files carry both rulings, and the gates pass.
**Branch:** `feat/ai-tells-gate-and-goods-model` in worktree `/Users/benknight/Code/goods-finance-wt`,
pushed to `f210468`, clean, no PR.
**Test:** `cd v2 && npx tsc --noEmit -p tsconfig.json && npx vitest run` then, from the worktree root,
`node tools/check-wiki-canon.mjs` and `node tools/check-ai-tells.mjs <file>` on anything rewritten.

### Now
[->] Start at section 3, the sequence. Do not start by grepping: the inventory is already done and
sits in section 5. The first edit is `canon.ts`, because the canon keys are what the wiki gate
reads, and retiring one key breaks articles that cite it.

### Scope, as authorised
Reconcile **code and documents only**. No Notion writes. No funder surfaces sent anywhere. No
`git push` without Ben's word, and no PR without his explicit verb. Nothing in this handoff touches
Xero, GoHighLevel or a person's inbox, with three exceptions flagged in section 6. Stop at each one.

---

## 1. The ruling

Ben ruled on 12 September 2026, when SEFA's Backing the Bold expression of interest forced the
entity field. The text of record is in this worktree at `DECISIONS.md:47-79`.

**The Butterfly Movement Ltd is the entity, and its name changes to Goods on Country.** It holds the
grants, the trade, the wages and the resources. Goods on Country stops being a registered business
name sitting over a charity and becomes the charity's own legal name.

Four consequences do the work of the sweep:

1. **There is no go-forward trading company.** A Curious Tractor Pty Ltd stops being the maker, the
   seller, the applicant and the fallback applicant.
2. **Equity has no home at all.** A company limited by guarantee has no shares. Every line that
   says equity sits in the Pty Ltd, or that equity is not sold as a choice, is now wrong for a
   structural reason. The form of the company decides it, and no policy choice is left.
3. **Debt is borrowed by the entity.** The SEFA loan lands there.
4. **The sole trader's ledger is historic.** Nicholas Marchesi still holds FY26 and every settled
   bed invoice, and that trade moves across as a related-party transaction that has not been
   papered.

The ruling was made knowing it weakens the SEFA case. Answered as the charity, FY26 is an EBITDA of
about negative $42,854 with a dormant shell behind it, against roughly $168,000 on the trading side.
That cost is accepted and the call with Joel Bird and Tanya Wong carries the application. Do not
soften it in any file you touch.

## 2. The anchor

**`wiki/articles/governance/the-entity-question.md` is the reference.** Every other surface
reconciles to it. Surfaces never reconcile to each other. Its opening block and front matter already carry the ruling
correctly and are the model for tone and level of detail.

The anchor is not finished. Its own lower half still carries the old model, listed in section 5b.
Fix the anchor first, then sweep outward from it.

## 3. The sequence

Work in this order. Each step unblocks the next.

1. **`canon.ts`.** Retire `entity-trading-goforward`. Rewrite `entity-operating-now` so the sole
   trader reads as the historic ledger. Drop the `reconcilesWith` pointer to the retired key.
   Relabel the charity row from "Charity / DGR home" to the entity. Keep `entity-dormant` exactly
   as it is: A Kind Tractor is still dormant and still carries no role.
2. **The anchor article**, section 5b.
3. **`capital/what-we-no-longer-say.md`.** Rule 14 in `wiki/AGENTS.md` makes this a step of its own: a retirement is an edit plus a row here recording the old statement, what replaced
   it and the ruling that did it. Nine articles once said QBE money was match-funded long after
   ruling V retired that, because nothing made retirement a step. Do not repeat it.
4. **The remaining wiki articles**, section 5b.
5. **The code modules and the guards**, section 5a. The guard is the one place the old model is
   machine-enforced and it will fail loudly, which is the point.
6. **Root docs**, section 5c, including the `DECISIONS.md` reconciliation in section 4.
7. **Deliverables**, section 5d. Read the dating rule there before editing any of them.
8. **App routes**, section 5e, and stop at the two items marked STOP.

## 4. The thing to fix before anything else: the decision log is split

Neither `DECISIONS.md` is complete.

| Ruling | Where it is | Where it is missing |
|---|---|---|
| Ruling AA, 5 Sep, applicant and recipient | primary repo, `DECISIONS.md:31` | this worktree |
| One entity, 12 Sep | this worktree, `DECISIONS.md:47-79` | the primary repo |

An agent reading either file alone gets half the entity position, and the anchor article already
carries a note in its front matter apologising for exactly this. Port both directions so the two
files agree, and put the 12 September ruling immediately after ruling AA so the supersession reads
in order.

## 5. The inventory

Line numbers were read on 12 September against worktree `f210468` and primary `ad283bd`. Verify
before editing; they will drift.

### 5a. Code modules and guards

**Canon keys, stale in both trees.** `v2/src/lib/data/canon.ts`, worktree lines `247`, `251`, `257`,
`263`, `269`; primary lines `257`, `261`, `267`, `273`, `279`. The go-forward trading entity key is
the retirement. The primary tree also has `canon.ts:23`, `GOODS_LEGAL_ENTITY`, consumed by
`v2/src/components/admin/goods-board.tsx:2`: the name field becomes Goods on Country once the ACNC
and ASIC change lands, so mark it pending and leave the value alone today.

**Already swept in the worktree, still to port to the primary tree.** `raise-stack.ts:376-391` and
`ask-surface.ts:190` carry the ruling correctly here. The primary copies do not.

**Swept files with stale remainders.** The 3 September sweep was partial.

| File:line | What it still says |
|---|---|
| `raise-stack.ts:43-44` | the `legalHome` union type still offers `'A Curious Tractor Pty Ltd'` |
| `raise-stack.ts:194` | a raise line still sets `legalHome` to the Pty Ltd |
| `raise-stack.ts:385` | ACT as "cohort entrant, holder of the historic trading record" |
| `raise-stack.ts:388` | the diagram is still three boxes and two arrows |
| `ask-surface.ts:184` (worktree) | the buy door is "A Curious Tractor Pty Ltd, selling as Goods." |
| `ask-surface.ts:189` (worktree) | "trading as Goods on Country", which goes once renamed |
| `ask-surface.ts:191` (primary) | equity and loans to the Pty Ltd, gifts to the DGR |

**Stale in both trees.** `pitch-cockpit.ts` lines `108`, `190`, `192`, `193`, `194`, which is the
fullest statement of the old model anywhere in code. Then `road-ending.ts:383`, `audience.ts:33`,
`partner-dashboards.ts:320`.

**Leave alone.** `v2/src/lib/ghl/canonical-tags.ts:5`, `v2/src/lib/empathy-ledger/client.ts:187`,
`v2/src/lib/impact-system/evidence-packs.ts:53` and `:103` name A Curious Tractor as operational
infrastructure. No trading claim is made. No change.

**Entity files that exist only in the primary tree**, so the worktree sweep never saw them:
`v2/src/lib/investment/evidence.ts:37` and `:58`, `v2/src/lib/admin/workspace.ts:40`,
`v2/src/lib/data-review/deck-drafts.ts:15` and `:40`,
`v2/src/components/admin/investment/deck.tsx:25`, `v2/src/components/pitch/evidence-story.tsx:51`.

**The guards.** `v2/src/lib/data/audience.guards.test.ts:154` asserts
`expect(entityDoor('buy').entity).toMatch(/curious tractor/i)`. That single line is where the
two-entity split is machine-enforced, and changing it is how you know the model actually moved.
Line `153` and line `158` match on the Butterfly name and move with the rename. Then check
`raise-stack.guards.test.ts` for a surviving fallback-applicant assertion, and `deck.guards.test.ts`
and `road-ending.guards.test.ts` for entity string matches.

**The gate.** `tools/check-wiki-canon.mjs` exists only in this worktree. It fails by name when a
module moves under an article, so retiring the go-forward key will break every article citing it.
That is the gate working. The primary tree has no such gate, which is why its wiki articles drifted
without anything catching them.

### 5b. Wiki articles

**The anchor, `governance/the-entity-question.md`.** Correct at lines `1-30`. Stale below:

- `:57-64`, the four-entities table, still calls ACT the go-forward trading company and still puts
  equity and loans there.
- `:61`, Butterfly "holds the registered business name". It is the name.
- `:66-68`, beds sold by the company on the charity's domain. One entity sells. The seller of record
  under ruling K stays open with MinterEllison.
- `:134`, the canon row on the 23 July business name registration. True as a register fact, and it
  needs the ruling beside it.
- `:35-40` quotes ruling AA naming ACT as cohort entrant. Keep the quote, frame it as superseded.

**Swept files with stale remainders.** `investors/sefa.md:55-59` and `:77-81`, which still offer an
alternative applicant. `governance/README.md:3`. `program/the-raise.md:14`.
`capital/what-we-no-longer-say.md:68`, which prints the old form in its own authoritative column.
`capital/what-may-be-claimed.md:168` and `:173`.

**Whole-article rewrites, stale in both trees.** `enterprise/09-legal-structure.md`, whose line `70`
states the two-function split as a principle to be maintained. `enterprise/07-governance-data-reporting.md`.
`sources/act-core-facts.md` lines `22`, `23`, `24`, `30`, `32`, `50`, `52`, which feeds many other
articles and should be done early in this group. `capital/paf-puaf-dgr.md:21` and `:41`, where the
sentence now contradicts itself because DGR "never through Goods" and "only through Butterfly" name
the same entity. `program/cover-letter.md:13`. `program/weekly-actions.md:48`.
`program/stage-2-funding.md`, primary `:27` and worktree `:68`.

**The keystone is closed.** `wiki/canon/qbe-readiness.md`, primary `:32` and `:39`, worktree `:33`
and `:43`, still calls the entity decision the open keystone. Rewrite it: the entity is ruled, and
what is open is execution, the constitution, the ACNC and ASIC name change, the related-party
transfer and the DGR-versus-trading question for MinterEllison.

**The merge trap.** `governance/legal-structure.md` and `governance/board-structure.md` have
genuinely different content in the two trees. The primary copies are ruling-AA era, the worktree
copies are older still, from the sole-trader-to-Pty-Ltd migration. Both are wrong. A naive merge
picks one stale version over another. Rewrite both from the anchor instead of merging.

**Historical outputs.** Everything under `wiki/outputs/` is dated record and stays as written. One
exception: `2026-06-13-goods-strategic-pack/04-entity-wording-block.md` is still cited as the live
reusable entity paragraph by `qbe-readiness.md`, so mark it superseded and point the citation at the
anchor.

### 5c. Root docs

`CLAUDE.md:5` in both trees calls Goods on Country a registered business name. That line is read at
the start of every session in this repo, so it is the single edit that does the most work here.

Then `CONTEXT.md`, primary `:54` and worktree `:50`, where the register fact stays and the ruling
joins it. `STRATEGY.md:3` in the primary tree, and `:263` primary and `:279` worktree. `GRANTSCOPE.md:85`.
`DECISIONS.md:136` and worktree `:149`. Ruling K's reasoning at `DECISIONS.md:607`, `:626`, `:629`,
worktree `:646`, `:665`, `:668`, which is historical and gets marked superseded, with the text left as it stands.

Check `.claude/skills/act-brand-alignment/references/goods.md` and its siblings against the ruling;
they were in the sweep commit's file list and may be half-done.

`research/jodie-davis-video-title-text-guidance-2026-09-01.md:17` is dated research. Leave it.

### 5d. Deliverables

**The rule for this group: a dated deliverable that was sent or used stays as written.** Add a
correction note at the top and leave the original text intact. A draft that has not gone anywhere gets
edited in place.

| File | Lines | The problem |
|---|---|---|
| `deliverables/qbe-750k-strategy-2026-09-02.md` | `61`, `68`, `181-195`, `209`, `219-220`, `231` | line `195` is the fallback where A Curious Tractor applies and receives, which the ruling explicitly retires; line `220` asks for a shareholders agreement that cannot exist |
| `deliverables/CH00365-initial-application-draft.md` | `3`, `10`, `57`, `81`, `93`, `105`, `254`, `300`, `324` | line `254` buys beds from a related trading entity. That purchase is now internal, so the whole conflict-of-interest section is void |
| `deliverables/PA-QBE-media-alignment-2026-09-02.md` | `76`, `219-225`, `324` | "three names on three funders' paper" |
| `deliverables/LIF-150K-play.md` | `88`, `147`, `157`, `257`, `313-319`, `364-397` | line `319` records that the business-name conflation is already inside a Commonwealth document. See section 6 |
| `deliverables/NT-Corrections-decision-note.md` | `121` | Goods trades through a sole trader |
| `deliverables/GOC-model-in-plain-words-2026-08-03.md` | `175` | the Pty Ltd migration |
| `deliverables/deck-narrative-qbe-2026-09.md` | `33` | trading as |
| `deliverables/finance/goods-financial-plan/README.md` | `307` | "intended to operate through". It is ruled, not intended |
| `deliverables/finance/goods-financial-plan/QBE-workbook-review.md` | `30` | same intended-applicant framing |

Two mislabels in the finance plan are wrong independently of the ruling and worth fixing while you
are there. `goods-model.html` lines `222`, `223`, `233`, `283` and `WORKED-OUT-2026-09-09.md:78`
present the FY26 profit and loss as the whole of A Curious Tractor. It is the sole trader's ledger.
`export-notion-model.py:127` has the same label.

`deliverables/GOC-Entity-Model-Inputs (1).xlsx` is a binary and was not inspected. Flag it for Ben and leave it closed.

### 5e. App routes and pages

**There is no governance, entity or legal-structure page in either tree.** The closest thing is an
admin workspace section. Worth telling Ben: the entity position has no rendered home, which is part
of why it drifts.

Public surfaces, all stale, both trees:

- `v2/src/app/terms/page.tsx:32-34` says Goods is operated by A Curious Tractor Pty Ltd. This is the
  seller-of-record page. **STOP here.** See section 6.
- `v2/src/app/partner/page.tsx`, six renderings at `41`, `103`, `145`, `252-253`, `432-433`, each
  stating that the trading company is separate from the charity. The separation is abolished.
- `v2/src/components/layout/site-footer.tsx`, primary `204-207`, worktree `203-206`. Every page.
- `v2/src/app/export/leave-behind/page.tsx:174-176`, the give, buy and lend boxes mapped to three
  entities, and `:436`, equity is not sold.
- `v2/src/app/sites/qbe-readiness/page.tsx:488-489`, no equity because the end state is community
  ownership. True, and now also true because no shares exist.
- `v2/src/app/pitch/document/page.tsx:173`.
- `v2/src/app/insiders/login/page.tsx:82`, `v2/src/app/investors/login/page.tsx:84`,
  `v2/src/app/canberra/page.tsx:449`.
- `v2/src/components/seo/product-json-ld.tsx:80`, `84`, `85`, `106`, which puts A Curious Tractor in
  structured data as the legal name. Machine-readable and indexed, so treat it as high priority.
- `v2/src/app/layout.tsx`, primary `:53`, worktree `:60`, site keywords.
- `v2/src/app/partners/centrecorp/*` is a historical field record. Leave it.

Admin surfaces, primary tree only: `admin/workspace/[section]/page.tsx:17`, `admin/page.tsx:11`,
`admin/ask/page.tsx:28`, `admin-sidebar.tsx:215`.

## 6. Three things to stop at

**The seller of record.** `terms/page.tsx` names who sells a bed. That is ruling K's open item and it
sits with MinterEllison and Ben. A sweep cannot answer it. Write the correct sentence in the handoff, do not
publish it, and leave the page until the legal answer comes back.

**`push-outreach/route.ts:202`** writes `sourceOrgName: 'A Curious Tractor Pty Ltd'` into
GoHighLevel. That has external blast radius and changing it rewrites records in a live CRM. Report
it, change nothing.

**The Commonwealth document.** `LIF-150K-play.md:319` records that the entity conflation already
reached a Commonwealth document. That needs a correction decision from Ben before anything is
written anywhere. Do not draft the correction into the file.

## 7. The gates

From `v2/`: `npx tsc --noEmit -p tsconfig.json` and `npx vitest run`. Expect
`audience.guards.test.ts` to fail until you change line `154`; that failure is the sweep working.

From the worktree root: `node tools/check-wiki-canon.mjs` for frontmatter and canon keys, and
`node tools/check-ai-tells.mjs <file>` on every article or document you rewrite. Both are required
before anything is called done. Run them once, at the end, together.

`npm run build` from `v2/` only if you touched routing, dependencies or compilation. Report any
pre-existing failure separately from anything you caused.

## 8. Rules that bind this work

- **Rule 14, `wiki/AGENTS.md`.** Superseding is an edit plus a row in
  `capital/what-we-no-longer-say.md`. Not optional and not a separate task.
- **Rule 13.** Never retype a settled figure. Cite its canon key and list it in the article's
  `canon:` front matter.
- **Rule 15.** A provisional figure says so in the sentence that prints it. The $276, the $474 and
  break-even at 628 are all provisional until Nic confirms the bought leg panel yield.
- **No em dashes**, anywhere.
- **Never "co-design".** Designed in community, designed with community.
- **Ownership is a pathway** and is never claimed complete. Aboriginal directors on the charity fall short of
  First Nations ownership of the seller, and under one entity that distinction gets easier to blur,
  not harder. Ruling J still holds.
- **Run `node tools/check-ai-tells.mjs`** before any prose is called finished.

## 9. What is open, and who owns it

None of these are yours to close.

| Open | Owner |
|---|---|
| Whether trading sits inside the charitable purposes, and what routing bed invoices through a DGR does to the endorsement | MinterEllison |
| Papering the transfer of trade from the sole trader, a related-party transaction | Ben and Nic |
| The ACNC and ASIC name change and the board resolution behind it | The board |
| Butterfly's constitution, still unlocated, blocking QBE Q12 and Q22, TFFF 4.1, the 50% test and IBA | Eloise |
| The accountant's letter, the recorded QBE submission blocker | Unassigned |
| The shop's seller of record during the migration | Ben and Nic with MinterEllison |
| The AGM date | The auditor's report |

QBE closes Friday 25 September at noon.

# Paste this to pick the QBE raise back up

Copy everything between the lines into a fresh session.

---

Read `thoughts/shared/handoffs/goods-model-voice-and-tells/current.md` first. Work in the worktree
`/Users/benknight/Code/goods-finance-wt` on branch `feat/ai-tells-gate-and-goods-model`, which is
pushed and clean. Run gates from `v2/`: `npx vitest run src/lib/data/` and `npx tsc --noEmit`.

**Four applications are in flight and QBE closes Friday 25 September at noon.**

| | Due | What | State |
|---|---|---|---|
| QBE Stage 2 | 25 Sep, noon | $300,000 grant, two community plants | 9 of 25 answers final |
| Brian M. Davis | 25 Sep | $100,000 grant | Drafted against their form |
| Tim Fairfax | 9 Oct, 5pm | $300,000 over three years | 14 attachments required, we hold 3 |
| SEFA Backing the Bold | Open, rolling | $50,000 to $200,000 **loan** | EOI drafted, unsent |

Start at the Notion front door, **🛏️ Goods on Country, the raise, start here**,
`3d8ebcf981cf8128bd9aee918f49733f`. Every application, artifact and blocker hangs off it.

## The five things that decide the outcome

1. **Jay's steer.** QBE 2026 wants philanthropy to unlock debt or equity. Our $600,000 is 100%
   philanthropy. The SEFA EOI is drafted, unsent, and the Queensland stream is open with rolling
   acceptance. Sending it is worth more than any wording change anywhere.
2. **The accountant's letter** is recorded on the QBE page as the submission blocker and has no
   owner beside it.
3. **Butterfly's constitution** is not located. It blocks QBE Q12 and Q22, and Tim Fairfax field
   4.1, which is required.
4. **Which entity the trade revenue sits in.** A required SEFA field. Butterfly's FY26 EBITDA is
   about negative $42,854 against roughly $168,000 in the trading entity.
5. **Name the site for the second Commonwealth $150,000.** Worth $147,950, and decides whether QBE
   Q14 must declare it.

## The architecture, and do not invert it

**The modules are the core and the workbook is a view of them.** `v2/src/lib/data/sheet-canon.ts`
holds 43 settled figures, every one imported from a guarded module and never retyped, with a test
that fails on a literal. `tools/sheet-canon.mjs` has `show`, `push`, `check` and `prompt`.

The workbook is blocked on one share to
`subscription-scanner@act-subscription-tracker.iam.gserviceaccount.com` as Editor. Until then,
`deliverables/qbe-stage2/codex-sheet-brief.md` is the generated instruction for doing it by hand.

Eleven guarded modules carry the model. `model-consistency.guards.test.ts` holds 29 cross-module
invariants and fails when two modules stop agreeing.

## Rules that are not negotiable

- **Run `node tools/check-ai-tells.mjs <file>` before publishing anything.** It blanks `<script>`
  blocks, so use `tools/check-module-prose.mjs` for `.ts` files and extract JS strings by hand for
  HTML. That blind spot has shipped tells twice.
- **Never state a demand total.** Present acts: money moved, money named, an organisation asked, a
  person asked, raised in a meeting. The 778 adds figures scoped to different populations.
- **The money is a price model.** $750 a bed, $276 makes it, $474 carries the business. Cost-plus
  is banned, and so is dividing the organisation by beds alone.
- **Health is the reason and never a measured outcome.** It carries no number.
- **One slide at a time** in Pencil, and copy is Ben's to rule on.
- No em dashes. Community ownership is always written as a pathway.

## What I want done

A maximum review across all of it, then finish. Specifically:

- Read every answer against the **real** form wording. Our paraphrases are not it. The QBE form is in a
  toggle on Notion page `3c6ebcf981cf809aad0eeafda8e8e9fa`; the Tim Fairfax and Brian M. Davis
  forms are PDFs in `BMD - application forms/`.
- Check every figure that reaches a funder against its guarded module.
- Find anything that contradicts anything else across the Notion pages, the artifacts, the deck and
  the workbook.
- Build the three deck plates in Pencil, one at a time, on my word.
- Tell me what is still missing and who owns it.

Use a workflow with parallel agents for the review pass if that is the faster way. I am authorising
it.

---

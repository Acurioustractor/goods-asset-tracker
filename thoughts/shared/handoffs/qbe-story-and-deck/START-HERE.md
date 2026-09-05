# START HERE — QBE deck, the money, the ask

Paste one of these. The first is the normal slide pass. The second only runs when Nic is in the room.
The third is the money thread, which is closed but documented.

Everything below is true as at the end of 5 September 2026.

---

## 1 · The slide pass (paste this)

```
QBE deck, next open slide. Use the /deck-slide skill: it is the method and it is not optional.

Read thoughts/shared/handoffs/qbe-story-and-deck/current.md first, and nothing else
until you have.

The working surface is the Notion deck master, not the repo:
https://app.notion.com/p/3d1ebcf981cf817598d8f15ee4f89c32

The deck is THIRTEEN frames. Numbering follows the Pencil band, not the old notes:
01 cover · 02 the mattress · 03 382 people · 04 the road · 05 buyers · 06 the making ·
07 the unit · 08 the loop · 09 evidence · 10 governance · 11 capital · 12 catalytic ·
13 the ask.

State: 01, 05, 09 and 10 built or corrected 5 Sep, images swapped. 07 and 08 have full
evidence sections and wait on my ruling. 08 needs ONE line changed on the frame: its
headline still says "five loops" and I ruled that down to one loop on 4 Sep.
11, 12 and 13 carry the ask and wait on me and Nic.

Rules, all learned the hard way:
- ONE SLIDE AT A TIME. I ask for slide N, you give me slide N and stop.
- Findings go in the ledger, not in your reply to me.
- Notion: never search-and-replace. Insert at position start, or PATCH block
  children by id. ntn api write calls hang unless stdin is closed, and reject
  the "after" parameter on append-children.
- Check canon before you flag anything and before you tell me to delete anything.
- Every figure gets graded before it is printed. Only A goes on a slide uncaveated.
- Build the frame, export it, and swap the Notion image. A rebuilt frame changes
  nothing on the page until the image is swapped, and I will notice.
- Money figures come from money-lanes.ts. Never add a lane to another lane.
- Do not turn something I have stated as a director into an open decision (ruling AA).
```

---

## 2 · The ask decision (only when Nic is in the room)

```
Do not write anything. Grill us.

The business mentor said a grant that buys 1,000 beds is the "artificial customer"
model and that it feels short term to a philanthropic investor. He would fund the
plant. Ruling Y says the money buys beds, and slides 11, 12 and 13 all encode it,
plus two lines on 07 and one box on 08.

Run the three options against each other until Nic and I have ruled:
1. Artificial customer. The grant buys beds to get revenue moving.
2. Subsidising operations on a path to viability.
3. Investing in the plant so communities manufacture independently.

Nic's numbers on the call: two plants at $150K each plus $200K of beds is a $500K
raise. My note has 400 beds at $750 plus two plants, $600K. The deck says $400K and
533 beds. None of them match.

Settle the margin at the same time: slide 08 prints about $324 a locally pressed bed,
Nic told the mentor about $200. Both cannot be said to funders.

Before we start, read money-lanes.ts back to us. Nothing is signed. The two
$100,000 "commitments" are invitations to apply with board dates in November.

Nothing gets written until we have ruled.
```

---

## 3 · The money thread (closed 5 September, paste only if something moves)

```
Money thread. Read v2/src/lib/data/money-lanes.ts first, then the "Money lanes",
"Receivables restated" and "Revenue restated" sections of
thoughts/shared/handoffs/qbe-story-and-deck/current.md.

Every dollar sits in one of seven lanes and total() throws if you add lanes that
must not be added. Do not invent a number outside that module.

Every decision is ruled and swept. Do not re-ask them:
- Funding received $901,311, fully current. ALIVE and Julalikari are sales; both
  Oonchiumpa receipts are out (program work through ACT, and a reimbursement).
- Receivables $82,500, all bad debt (Rotary), $0 collectable.
- Centrecorp is a BUYER (ruling Z): commercial and buyer receipts $344,981,
  grant share about 62%.
- FY26 closed on a net PROFIT of about $168K before founder wages. Never "net loss".
- "Bryan Foundation incoming" meant Brian M. Davis.
- The carve-out re-pull is with Standard Ledger; nothing in code moves until their
  letter lands.

The receivables figure lives in FOUR places and revenue in ELEVEN. Move them
together or check:drift:ci fails on a copy you did not know about.
```

---

## What is waiting

**On me (Ben).** Slide 08's headline. Slide 07's section. Slides 02, 03, 04 and 06. Whether the
product-evolution slide gets built. Two unsent Gmail drafts, Jay and Eloise, mine to send or bin.

**On me and Nic.** The ask decision, which holds slides 11, 12 and 13. The margin, $324 against $200.
Telling Nic the two $100,000 "commitments" are invitations.

**On other people.** Standard Ledger's signed FY26 carve-out. Eloise's Butterfly statements and the
governance documents. The AGM date, once the auditor reports.

**Locked, do not reopen.** Ruling AA: The Butterfly Movement Ltd is the applicant and recipient; the
directors are Kristy Bloomfield, Audrey Deemal and Jeremy Donovan; the handover completes at the AGM.
The ASIC and ACNC extracts are attachments, not gates.

**Branch.** `feat/qbe-story` in `/Users/benknight/Code/goods-story-wt`, pushed and level with origin,
PR #253 open and unmerged. Gates green: tsc, 692 tests, `check:drift:ci`, `next build`.

**Dates.** QBE closes **25 September, 12pm AEST**; review slots 6 and 7 October. BMDF closes
**25 September**. TFFF closes **9 October, 5pm AEST**, board late November. Brian M. Davis board
**19 November**.

**Do not** re-render the QBE drawings without `deliverables/qbe-deck-handoff/scripts/render-all.sh`
(it takes the worktree v2 path and an output dir, and refuses to rasterise anything leaking internal
state). The one-document SVGs come from `deliverables/qbe-stage2/diagrams/build.mjs`.

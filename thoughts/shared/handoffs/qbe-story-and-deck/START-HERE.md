# START HERE — QBE deck and the money

Paste one of these. The first is the normal slide pass. The second only runs when Nic is in the
room. The third is the money clean-up, which is now a thread of its own.

---

## 1 · The slide pass (paste this)

```
QBE deck, the next open slide. Use the /deck-slide skill: it is the method and it is not optional.
Numbering follows the Pencil band (thirteen frames): 07 the unit, 08 the loop, 09 evidence,
10 governance, 11 capital, 12 catalytic, 13 ask. 05, 09 and 10 built 5 Sep. Every remaining slide (07, 08, 11, 12, 13) waits on the ask
decision with Nic. RULING AA (5 Sep): the charity is the applicant, the directors are Kristy Bloomfield, Audrey
Deemal and Jeremy Donovan, the handover completes at the AGM. No surface says "subject to" or
"proposed" on any of that. Two drafts wait on my send: Jay (heads-up) and Eloise (Q22 documents).

Read thoughts/shared/handoffs/qbe-story-and-deck/current.md first, and nothing else
until you have.

The working surface is the Notion deck master, not the repo:
https://app.notion.com/p/3d1ebcf981cf817598d8f15ee4f89c32

Slides 01 to 06 are built in Pencil, exported, and on the Notion page with the full
section structure. The loop is 08, frame tkDpX.

Before you touch 07, 08, 11, 12 or 13: the ask decision is not settled and they all
encode it. If it is still open, say so and stop. 09 and 10 are open.

Rules, all learned the hard way:
- ONE SLIDE AT A TIME. I ask for slide N, you give me slide N and stop.
- Findings go in the ledger, not in your reply to me.
- Notion: never search-and-replace. Insert at position start, or PATCH block
  children by id.
- Check canon before you flag anything and before you tell me to delete anything.
- Every figure gets graded before it is printed. Only A goes on a slide uncaveated.
- Build the frame, export it, and swap the Notion image. A rebuilt frame changes
  nothing on the page until the image is swapped, and I will notice.
- Money figures come from money-lanes.ts. Never add a lane to another lane.
```

---

## 2 · The ask decision (only when Nic is in the room)

```
Do not write anything. Grill us.

The business mentor said a grant that buys 1,000 beds is the "artificial customer"
model and that it feels short term to a philanthropic investor. He would fund the
plant. Ruling Y says the money buys beds, and slides 07, 10, 11 and 12 all encode it.

Run the three options against each other until Nic and I have ruled:
1. Artificial customer. The grant buys beds to get revenue moving.
2. Subsidising operations on a path to viability.
3. Investing in the plant so communities manufacture independently.

Nic's numbers on the call: two plants at $150K each plus $200K of beds is a $500K
raise. My note has 400 beds at $750 plus two plants, $600K. The deck says $400K and
533 beds. None of them match.

Before we start, read money-lanes.ts back to us. Nothing is signed. The two
$100,000 "commitments" are invitations to apply with board dates in November.

Nothing gets written until we have ruled.
```

---

## 3 · The money clean-up (paste this)

```
Money thread. Read v2/src/lib/data/money-lanes.ts first, then the "Money lanes",
"Receivables restated" and "Revenue restated" sections of
thoughts/shared/handoffs/qbe-story-and-deck/current.md.

Every dollar sits in one of seven lanes and total() throws if you add lanes that
must not be added. Do not invent a number outside that module.

Decisions waiting on me. Put them to me one at a time, with what changes if I
say yes:
1. DONE 5 Sep, ruled yes and SENT: the carve-out ask to Standard Ledger (with a fresh Xero
   cut attached; no June workpaper exists and the $713,827 does not reproduce from its own
   customer list) and the Butterfly statements ask to Eloise. Nothing in code moves until
   the accountant's letter lands.
2. DONE 5 Sep, ruled and swept: the FY26 sentence. Net profit of about $168K before
   founder wages, no surplus claimed, everything moves into the charity. "FY26 net loss"
   is a guarded retired phrase now.
3. DONE 5 Sep: "Bryan Foundation incoming" meant Brian M. Davis. Lanes were already
   right. The Bryan Foundation stays a potential with nothing in writing.
4. Rotary $82,500 is bad debt and fine for now. Tell me when that stops being true.

Settled 5 Sep: ALIVE $101,200 and Julalikari $15,000 are in funding received, which
is $901,311 and fully current: Oonchiumpa INV-0344 (program work through ACT) and
INV-0346 (a reimbursement) are both OUT, ruled 5 Sep. Centrecorp is a BUYER in the
funding-received composition (ruling Z, 5 Sep): commercial and buyer receipts
$344,981, grant share about 62%. Every money decision is closed.

The receivables figure lives in FOUR places and revenue in ELEVEN. Move them
together or check:drift:ci fails on a copy you did not know about.
```

---

## What is waiting

**Money, and it is now clean.** `money-lanes.ts` classifies every dollar into seven lanes with a
rule each, and `total()` throws rather than adding lanes that must not be added. Earned $288,966 ·
owed $0 · bad debt $82,500 · invited $400,000 · asked $600,000 · potential $540,000 · excluded
$1,995,000. Beds sold and paid: **$197,060 ex GST, 320 beds, four organisations.** Signed: **$0.** Funding received, all sources: **$901,311** (Ben, 5 Sep).
Recall surface: `deliverables/qbe-stage2/diagrams/08-money-lanes.svg`.

**Settled on 5 September, all in code and guarded:**
- Rotary INV-0222 is bad debt, not a buyer. It adds to nothing.
- Palm Island INV-0317 never happened. Retired, and `check-retired-figures` holds it out.
- Receivables **$143,000 → $82,500**, all of it bad debt, **$0 collectable**.
- Revenue **$741,111 → $785,111**. Commercial and buyer receipts $61,449 → $105,449.
- The two invitations are invitations. TFFF $300,000 over three years, board late November.
  Brian M. Davis up to $100,000, board 19 November. **Nic told the mentor these were commitments.
  Somebody has to correct that**, because the QBE form scores leverage.

**Open and mine to fix once the accountant's letter lands:** the carve-out copies (both asks sent
5 Sep on Ben's word; waiting on Standard Ledger and Eloise). **Done 5 Sep, all of it:** ALIVE and Julalikari in ($901,311,
fully current), Oonchiumpa out, the FY26 sentence swept, Bryan is Brian, Centrecorp a buyer (grant
share about 62%).

**Open and Ben's alone:**
- **The ask decision.** Blocks 07, 10, 11 and 12.
- **Slide 05 DONE 5 Sep.** Ruled and rebuilt: four organisations, 320 beds, $197,060 ex GST, every
  invoice paid, Centrecorp's sixty on, Rotary and Palm Island off. Image swapped on the page.
- **"The bed learned in public"**, the product-evolution slide that would make the 363 Basket Beds
  visible. Proposal is in slide 04's research section.
- Ben has not formally ruled on slides 02 to 06.

**Branch state.** `feat/qbe-story` in `/Users/benknight/Code/goods-story-wt`, **pushed 5 Sep on
Ben's word; merge #253 only on his explicit word.** Before the push it was eighteen commits ahead. Two predate this session (`53b7193` the Kalgoorlie fix, `07af900` slides
01 to 06). Six are the money work: `08f3acb` buyers derived from the paper · `574ca86` money lanes ·
`cddf5ed` INV-0317 retired · `b2a0052` receivables $82,500 · `6de744a` revenue $785,111 · `22e839d`
these prompts. Second session, 5 Sep: `cc45164` the Xero re-check of decision 1, then the
restatement to $901,311 with Julalikari in the earned lane, then `5c7a919` ruling H remnants out of the
areas JSON and the drift script, guard now scans JSON. PR #253 open and unmerged. Gates green: tsc,
692 tests, `check:drift:ci` in lockstep, `check:retired-figures` (32 figures), `next build`.

**Dates.** BMDF closes **25 September**. QBE closes **25 September, 12pm AEST**. TFFF closes
**9 October, 5pm AEST**, board late November. Brian M. Davis board **19 November**.

**Do not** re-render the QBE drawings without `deliverables/qbe-deck-handoff/scripts/render-all.sh`:
it reads the rendered output back and refuses to rasterise anything that leaks internal state.

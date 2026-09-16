---
date: 2026-09-16T17:00:00+10:00
session_name: snow-foundation-ongoing
branch: fix/snow-ask-and-figure
status: active
---

# Work Stream: snow-foundation-ongoing

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-16T17:00:00+10:00
**Goal:** Settle what Goods asks the Snow Foundation for next, and put words in Ben's hands he can send himself. Done when the ask is one thing and the letter has passed act-voice, /straight and /ground.
**Branch:** `fix/snow-ask-and-figure` in `../goods-ledger-wt`, off `docs/philanthropy-ledger` (= main + the two ledger commits). NOT pushed.
**Test:** `cd v2 && npx vitest run && npm run check:drift:ci && npm run build`

### Now
[->] **The clock is the news. Snow's letter is wanted by about 21 September; QBE submits on the 25th.** That came out of the 2:30pm check-in today and it reorders everything below.

### The ask conflict: mostly resolved, and not by a ruling
Three answers were live. Two were stale rather than contested.

- **`ask-surface.ts` "$100K, Grant: fresh money, flexible"** was simply pre-15-September. FIXED to $99,750 / 133 beds at $750, matching BMD and TFFF. `RAISE` in `model-placemat.ts` names Snow explicitly as one of the three bed grants, so the ruling was already in code.
- **The $150K loan** in the raise is **SEFA's** line for first-year running cost, never Snow's. No conflict once you read whose it is.
- **The dashboard's impact-investor invitation** is the only genuinely open one, and it says so itself: "the three things we want to settle together with Snow are the amount, the conditions it carries, and the impact it is held to".

**What the 16 September check-in adds, and it outranks all three:** the immediate ask is **not money**. Sally wants a written impact snapshot. Georgie has routed the decision through Snow's **advisory committee**. Sally is checking with Marie about an **out-of-session in-principle letter**, and the record says "even a broad letter acknowledging alignment with Snow Foundation's strategy and an ongoing relationship would be sufficient". A letter of intent by ~21 Sep is the thing on the clock. The $99,750 sits behind it as the written ask. The loan is the Bhanvi track and has never been formally retired.

**A $99,750 letter already exists**, unsent, in Notion: "Snow Foundation general Ask" `3daebcf981cf8034b1cbe5f4f72f6906`, body last edited 16 Sep 01:20. The row's `Amount (AUD)` property still says $100,000 against a body that says $99,750, which is the source of the open 399-versus-400 bed question.

### The Snow figure: the HOLD is resolved, and $35,200 of it is not Goods
The June reconciliation left two checks it could not run. Both were run today.

- **CLEARS.** Nothing from Snow predates INV-0092 (1 Oct 2023). The three-year MCP window was not hiding earlier money.
- **FAILS.** **INV-0092, $35,200 inc-GST, 1 Oct 2023, is "(Con)nected - Digital support for Drug Court participants"**, a different ACT project. Corroborated by a Knight Photography bill the same day for "(Con)nected - DASL Discovery Project Management" in the ACT wiki.

**Confirmed independently, and this is what settles it.** The Snow milestone ledger built in Notion on **21 May 2026** itemises six grant invoices ($434,500 inc-GST) plus three reimbursement and product invoices ($23,429.79). Nine invoices, summing to **exactly $457,929.79**. It was built four months before anyone went looking, by someone reconciling milestones. It never contained INV-0092. The gap to the Xero contact-level total is $35,200 to the cent.

| Figure | Basis | What it is |
|---|---|---|
| $493,129.79 | inc-GST cash | Everything Snow paid this ledger, **including** (Con)nected |
| **$457,929.79** | inc-GST cash | **Goods only** |
| $448,299.81 | ex-GST | Everything, ex-GST |
| $416,299.81 | ex-GST | Goods only, ex-GST |

Also: **the basis label was inverted.** $493,129.79 is the sum of `amount_paid`, so it is inc-GST. The June doc said the opposite. Corrected there.

Also closed: the ledger's two "Xero invoice (missing - investigate)" rows are **INV-0166** (3 Oct 2024) and **INV-0170** (11 Nov 2024), both PAID.

**The date bites harder than the money.** Snow's first *Goods* invoice is 3 October 2024. `grants-received.ts` has `since: '2023-10'`, and `/pitch` chapter 15 sorts funders by that field. AMP Foundation sits at `2024-07`. So "Snow went first", the spine of chapter 4 and of any letter, currently rests on the (Con)nected invoice. **Not changed. Ben's call, because it reorders a live public page.** Snow did back the organisation from Oct 2023; what is wrong is attributing that invoice to Goods.

### This Session
- [x] **The graduation story was live on the page Snow reads.** `partner-dashboards.ts` said "The idea is proven now" and "built to stand on its own", two of the five fragments Ben's 16 Sep ruling bans. The guard that bans them only ever read `funder-moments.ts`. Fixed, and **the guard now covers every funder-facing surface** (dashboards, arc, invitation, funder configs). Proved it bites by reintroducing the phrase and watching it fail
- [x] The same phrase found and fixed on the **public /impact page** and in the Snow funder report
- [x] `ask-surface.ts` rebuilt: Snow $99,750, SEFA $300K to $150K (the 15 Sep ruling), TFN $130K to $144,558
- [x] **Dashboard quotes now resolve from the consent registry by slug**, not typed in. `quotes: []` had been empty while twelve approved Georgina quotes sat in the registry; typing them in is the pattern that caused the eight-week consent leak on her record. Four chosen for the catalytic frame in her own words
- [x] `content.ts` "It's cardiac prevention" removed. It contradicted the claim ceiling in `claims-ledger.ts` and it was public
- [x] `impact-model.ts` "~89% grant-funded" removed. No denominator, counts **Centrecorp as a grant** when Centrecorp is a buyer, and grants ($772,788) exceed the revenue printed beside it
- [x] The **June first-mover loan draft** is banner-flagged DO NOT SEND. It still says "QBE will match external capital we raise, at least one to one", retired by **ruling V** on 1 Aug, and its August deadline has passed. The same retired claim is in the rendered 27 Jun brief HTML and PDF
- [x] Gates: tsc clean, **799 tests pass**, `check:voice` and `check:drift:ci` clean, build passes

### Next
- [ ] **Decide the instrument, then write the letter.** See the two questions below
- [ ] **The letter of intent for QBE**, by ~21 Sep. Separate from, and ahead of, the money letter
- [ ] Four Notion pages still print retired Snow figures: the canonical **Snow Foundation Reporting** page `367ebcf981cf80838315d00d85555bad` (still headlines $395K/$275K/$120K and never mentions the reconciled figure); **snow-foundation-q4-fy26** `3d4ebcf981cf816891c2e75bcceddd87` (status "reviewed", prints $402,930 as lifetime); **Other grants** `3dbebcf981cf81e184b0ed9b9fabda25` ($795,000, TFN $130K, FRRR separate); **Q&A Write-ups** `36bebcf981cf801aa903c7acdba1142f` ($193,785)
- [ ] **The 31 July FY26 Operational acquittal has no record of being submitted.** Ledger row still "Not started", register row still "Needed", nothing edited since 23 July. Six weeks overdue, and you do not ask for the next commitment over an open acquittal
- [ ] Read the two FY26 PDFs on the 19 May thread (`19e3e43c5062ae00`): "Successful Grant Letter" and "Letter agreement", both "Goods on Country A Curious Tractor - FY26". Attachments cannot be opened from here; drop them in `~/Downloads` and they can be
- [ ] Whether the 28 Jun Round 4 email to Sally ever went out is still unconfirmed
- [ ] INV-0321 is AUTHORISED with "Eftsure verification pending" in the Notion ledger but PAID in Xero on 22 May. Close the loop
- [ ] Decide whether the Snow dashboard becomes shareable. Georgina says in her own recording that taking what she saw back to Sydney is her job

### The alignment case, which is stronger than the money case
Snow's own published strategy, tested area by area:

- **First Nations leadership is now a gate, not a preference.** Snow's Nov 2025 note: forming a First Nations advisory group, "**all future grants will require First Nations leadership**", and it "**will review all Snow Foundation partners**", flagged internally as a potential future challenge. **Goods on Country Ltd, DGR1, 100% Indigenous directors, public ABN, three sourced director profiles answers that outright.** This is the most important thing to put in front of Snow, and it turns a flagged risk into the strongest card in the hand
- **Capacity building is a named Snow principle**: "building greater capacity, knowledge, and ownership of RHD within communities... Education enables communities to set self-determined priorities". Goods has training inside the bed price by design, plus countable instances (Palm Island, 30 young people; Katrina train-the-trainer). No curriculum, no completion count. The weakest fixable area
- **RHD**: Goods is already named in Snow's own 2024 annual report as an RHD partner ("A Curious Tractor - Greate Beds"; the typo is theirs). Against a funder asking for "evidence-based and culturally safe programs", **refusing to claim a health outcome is the strongest possible signal**, and it is enforced in code, with two metrics deleted rather than overclaimed
- **Community ownership**: zero community-owned sites, labelled `future` everywhere. Say it as a pathway with a named next step
- **RECYCLING IS NOT A DOOR.** Snow's published exclusions: "We do not accept applications for initiatives that are focused on: **Environmental causes**". Not that Goods lacks the evidence; Snow lacks the priority. Frame 20kg a bed as local economics and freight substitution inside the RHD and ownership story. Sally personally values the circular story, which is a person, not a criterion
- **Impact investing is real and growing**: $26.2M across 38 investments, 12% of corpus targeting 20%, catalytic at 32% of active commitments, patient loans via First Australians Capital and SEFA. **A $99,750 bed grant asks Snow to do what it already did. A recoverable instrument asks it to do what it says it is growing.** That is the argument for the loan, if Ben wants it
- **Do not print an RHD strategy period.** The Statement of Intent reads 2024 to 2030; the 2024 annual report says 2024 to 2028 and "five-year". Georgina's own recorded words say "another five". Unresolved

### Decisions
- **Catalytic capital, never a graduation story** (Ben, 16 Sep). Now enforced across every funder surface, not one file
- **No dollar figures on public funder surfaces** (Ben, 16 Sep). A private letter to Snow is different and CAN carry numbers. Do not carry that ruling across by mistake
- **NEVER SEND EMAILS** (Ben, 12 Sep). Reading is fine. Drafting is fine. Sending is not

### Open Questions
1. **Instrument.** Bed grant at $99,750, the recoverable loan the dashboard invites, or the bed grant now with the loan opened as the next conversation? Everything else is written and waiting on this one
2. **The $35,200 and the arrival date.** Restate Snow to $457,929.79 Goods-only and move `since` to 2024-10, which reorders the funders on live `/pitch` and unseats "Snow went first"? Or keep the lifetime figure and footnote it? The evidence is settled; what to publish is not

### Workflow State
pattern: sequential
phase: 2
total_phases: 4
retries: 0
max_retries: 3

#### Resolved
- snow_figure_hold: RESOLVED. INV-0092 is not Goods. Goods-only is $457,929.79 inc-GST, confirmed by two independent sources
- gst_basis: RESOLVED. $493,129.79 is inc-GST, not ex-GST. The June doc had it backwards
- ask_conflict: TWO OF THREE were staleness, now fixed in code. The instrument question is real and is Ben's

#### Unknowns
- next_ask_instrument: UNKNOWN, blocking the letter
- snow_figure_publication: UNKNOWN, blocking a public correction
- fy26_agreement_conditions: UNKNOWN, PDFs unreadable from here
- fy26_acquittal_submitted: UNKNOWN, no record since 23 July

#### Last Failure
(none)

---

## Context

### The relationship, as the books now have it
**Ten paid invoices to the Snow contact, INV-0092 to INV-0321, October 2023 to May 2026, $493,129.79 inc-GST, $0 outstanding.** Nine of them are Goods, and those nine are **$457,929.79**. Snow remains far and away the largest philanthropic backer either way.

The most recent is **INV-0321, $132,000, paid 22 May 2026**: $60,000 for 100 beds at $600 and $60,000 for the on-Country production plant. Georgina sent the notification and agreement herself on 19 May, cc Sally.

### People
- **Georgina Byron AM**, CEO. Registry tier `funder`, portrait in the repo, **twelve approved quotes** and two on `hold`. Her recording is Descript `QOpJepwNzo9`
- **Sally Grimsley-Ballard**, Head of Partnerships, Our Country. Also **sits on the Goods advisory group** and is listed as a project referee
- **Maree Meredith**, Consultant. Holds the out-of-session letter decision
- **Bhanvi**, impact investment. Leads the loan pathway
- **Ashley Machuca**, **L. McKee**, **Carolyn Ludovici** (Our Place, 2024, may be stale)

### What a letter has to do
Report what the money did, name what is not finished, make one ask. The report is easy now. The ask is the hard part, which is why it is question 1.

Gates: `act-voice`, then `/straight`, then `/ground`. Ben reads it last and sends it himself.

### Traps
- The allocation split on the Snow dashboard is indicative. Never an acquittal
- `check:voice` allows "catalytic" for the QBE programme name and when quoting a funder, and BANS it as our own framing. Quote Georgina, do not assert it
- The $120K Jan 2026 proposal uses the **superseded 25kg a bed** plastic figure. Canon is 20kg
- Snow's national giving ("Our Country") is **targeted, not an open application**. There is no form. It is a relationship decision, which is how it already works

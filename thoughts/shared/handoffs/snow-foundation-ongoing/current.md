---
date: 2026-09-16T14:45:00+10:00
session_name: snow-foundation-ongoing
branch: main
status: active
---

# Work Stream: snow-foundation-ongoing

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-16T14:45:00+10:00
**Goal:** Settle what Goods asks the Snow Foundation for next, and put a letter in Ben's hands that he can send. Done when the ask is one number with one instrument, and the letter has passed act-voice, /straight and /ground.
**Branch:** main
**Test:** `cd v2 && npx vitest run && npm run check:drift:ci && npm run check:storytellers`

### Now
[->] Resolve the ask conflict below. Everything else waits on it, because the letter cannot be written until the ask is one thing.

### This Session
- [x] (new stream, nothing yet)

### Next
- [ ] **Resolve the ask.** `ask-surface.ts` says **$100K, "Grant: fresh money", flexible use, "Warm. Not signed."** Ben's 15 Sep ruling says **every grant except QBE buys 133 beds at $750 = $99,750**, Snow included. Those are different asks with different instruments. One has to go
- [ ] **Decide grant or loan.** The partner dashboard already carries an invitation Ben wrote: *"From grant partner to impact investor... our hope is to structure as much of the next commitment as possible as a loan, recoverable capital that returns to Snow over time."* Snow has OPENED that conversation. So the real question is whether the next ask is a bed-buying grant, a loan, or both
- [ ] **Draft the letter.** NEVER SEND IT. Hand Ben the words
- [ ] Fill `funderImpact.quotes: []` on the Snow partner dashboard. It is still empty while six approved Georgina quotes sit in the registry
- [ ] Decide whether the Snow partner dashboard becomes shareable. Georgina says in her own recording that taking what she saw back to Sydney is her job; a page she can pass on is what lets her
- [ ] Reciprocal links: Snow published the Parliament House RHD story (URL already in `canberra/page.tsx`, now linked from /pitch). Ask them to link back to /beds or /canberra

### Decisions
- **Catalytic capital, never a graduation story** (Ben, 16 Sep). Do NOT write that grants were right "then" and the model stands alone now. Snow's tenth invoice is May 2026 and there is an open raise. The forward ask is "do it again in a different instrument"
- **No dollar figures on public funder surfaces** (Ben, 16 Sep). A letter to Snow is different: it is private and to the funder themselves, so it CAN carry numbers. Do not carry that ruling across by mistake
- **NEVER SEND EMAILS** (Ben, 12 Sep). Reading Gmail is fine. Drafting is fine. Sending is not

### Open Questions
- UNCONFIRMED: is the next Snow ask $99,750 of beds, $100K flexible, or a loan?
- UNCONFIRMED: another session referred to "a HOLD on the Snow figure". Find out what that was before printing $493,130 anywhere new
- UNCONFIRMED: does the May 2026 grant agreement (Georgina's 19 May email) carry conditions or reporting dates that shape the timing of the next ask?

### Workflow State
pattern: sequential
phase: 1
total_phases: 4
retries: 0
max_retries: 3

#### Resolved
- goal: "settle the Snow ask and draft the letter"
- resource_allocation: balanced

#### Unknowns
- next_ask_instrument_and_amount: UNKNOWN
- snow_figure_hold: UNKNOWN

#### Last Failure
(none)

---

## Context

### The relationship, as the books have it
**$493,130 across ten paid invoices, INV-0092 to INV-0321, October 2023 to May 2026.** 64 per cent of every philanthropic dollar Goods has ever received. Reconciled 16 Sep, `$0` outstanding.

The most recent is **INV-0321, $132,000, paid 22 May 2026**: $60,000 for 100 beds at $600 and $60,000 for the on-Country production plant. Georgina sent the notification and agreement herself on 19 May, cc Sally. Snow's own RHD commitment is 12 to 13 years with another five just signed.

### Why they matter more than the amount
They went FIRST, in October 2023, before there was a product, a register, a charity, a board or a customer. Everything else in `grants-received.ts` arrived after someone was willing to do that. Nic's own words, now in the registry: *"If it was not for the passionate leadership and generosity of Georgina Byron AM I am really not sure we would have progressed anywhere near what has been done."*

### People
- **Georgina Byron AM**, CEO. Registry tier `funder`, portrait now in the repo, six approved quotes, two on `hold` (a proper noun the auto-transcript damaged, and a referendum passage that is Snow's to publish, not ours). Her recording is Descript `QOpJepwNzo9`
- **Sally Grimsley-Ballard**, partnerships. Not a registry voice
- **Carolyn Ludovici**, Our Place Manager (2024 contact, may be stale)

### What is already live, as of today
- `/pitch` chapter 4 carries `SnowArc`: a full-bleed scrollytelling section over the Tingkkarli drone, nine moments from 2016 to the charity, closing on Georgina's own words. Live on goodsoncountry.com
- Road stop 2 (Tennant Creek) carries a Snow funder moment
- Chapter 15 lists all seven funders in arrival order
- `/partners/snow/dashboard`, password gated, carries the thank-you, the allocation split (explicitly indicative, NOT an acquittal), six moments, and the impact-investor invitation

### What a letter has to do
Three jobs, in this order: report what the money did, name what is not finished, make one ask. The report is easy now because the evidence is built. The hard part is the ask, which is why it is the first item in Next.

Gates before it goes anywhere: `act-voice`, then `/straight`, then `/ground`. Ben reads it last and sends it himself.

### Traps
- `ask-surface.ts` also prints **TFN $130K**. The banked figure is **$144,558**. Fix if that surface is touched
- The allocation split on the Snow dashboard is indicative. Never present it as an acquittal
- `check:voice` allows "catalytic" for the QBE programme name and when quoting a funder, and BANS it as our own framing. Quote Georgina, do not assert it

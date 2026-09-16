---
date: 2026-09-16T11:45:00+10:00
session_name: goods-artefact-hub
branch: fix/q3-structure-diagram-and-attachment-readme (worktree ../goods-public-wt)
status: handed-over
---

# Work Stream: goods-artefact-hub

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-16T11:45:00+10:00
**Goal:** One Notion page holding every artefact, submission and answer, aligned to the site and the figures. DONE. Now handed to goods-asset-register-3c along with the Snow report build.
**Branch:** `fix/q3-structure-diagram-and-attachment-readme` in `../goods-public-wt`, two commits, NOT pushed.
**Test:** `cd v2 && npm run check:drift:ci`, then `npx tsc --noEmit`, then `npm run build`. All passed 16 Sep.

### Now
[->] **HANDED OVER to goods-asset-register-3c** (Ben, 16 Sep). That session holds the Snow figures, funder configs, `grants-received.ts`, partner dashboard, `story-road.ts` and `/impact`, and is now taking the Notion side and the Snow report as well.

### This Session (16 September)
- [x] **Reviewed all 41 artefacts.** Seven findings. Two fixed and committed, two need Ben's ruling, three dissolved when the front door was rebuilt.
- [x] **Built the Artefact Register database** `0a36ca45bb7f4d27a5bece37bd2cfa10`, 41 rows, 16 files uploaded once each, two-way relation to the funders database. QBE 24, Tim Fairfax 14, Brian M. Davis 11, SEFA 9, Snow 2, Dusseldorp 2, Mazda 1.
- [x] **Rebuilt the front door** `3d8ebcf981cf8128bd9aee918f49733f` as the one page in seven sections. Old applications page `3dcebcf981cf81228acad4b1e0601ce7` banner-marked superseded, NOT archived (archive cascades).
- [x] **Wrote page bodies for all 41 artefact rows**: the embedded document, a plain explanation, why a funder asks, and a review date. The 27 owed ones each carry why we do not have it and what finishes it.
- [x] **Rewrote the Snow ask letter** on row `3daebcf981cf8034b1cbe5f4f72f6906`, then put a HOLD callout on it when 3c found two errors in it.
- [x] Fixed the truncated sentence in the QBE Q3 structure diagram and re-rendered it. Fixed the stale attachments README.

### Next (for whoever picks this up)
- [ ] **Ben's two rulings** (both printed on funder-facing artefacts today): the washing machine count, and 399 beds vs 400.
- [ ] **The Claims row on the front door** still reads "Partnership and broader ecosystem health outcome". Reverting it is unresolved with Ben.
- [ ] **Push the branch** (Tier 2, needs Ben's word) or fold the two commits into 3c's stream.
- [ ] **Snow in-principle letter by ~21 September**, advisory committee route. QBE submits the 25th.
- [ ] The Snow report build, now 3c's.

### Decisions
- **One page replaces the front door and the applications page** (Ben, 16 Sep), keeping the ten child pages and both databases underneath.
- **Artefacts live once in a register database**, related to application rows, never duplicated per row. A file is uploaded one time.
- **Any figure appears once on the one page**, in section 1 or 2. Contradictions go to section 7 "Open questions" with a date and a name, instead of becoming a second version of a page.
- **Snow ask is $99,750**, exactly 133 beds at $750. The old letter said $100,000 buys 133 beds, which is false.
- **Recoverable capital is named as the next chapter, not folded into this ask** (Ben, 16 Sep).
- **Snow-for-Goods is $457,929.79 inc-GST, not $493,130.** Ben's call: footnote it, leave public pages alone, never use $493,130 as a Goods-only figure in anything new.

### Open Questions
- UNCONFIRMED: who changed the Claims row between 00:13 and 00:25 on 16 Sep. Not 3c, which started at 16:00 and has written nothing to Notion.
- UNCONFIRMED: whether the two commits on this branch get pushed separately or folded into 3c's branch.

### Workflow State
pattern: sequential
phase: 3
total_phases: 3
retries: 0
max_retries: 3

#### Resolved
- goal: "review all artefacts, add them to every submission row, design the one page, then the Snow report"
- resource_allocation: balanced

#### Unknowns
- claims_row_author: UNKNOWN
- branch_disposition: UNKNOWN

#### Last Failure
(none)

---

## Context

### Where everything is

**Notion.** Front door and one page `3d8ebcf981cf8128bd9aee918f49733f`. Artefact Register database `0a36ca45bb7f4d27a5bece37bd2cfa10`, data source `44c39b7a-1a81-4139-a314-7d27972177b9`, now a direct child of the front door so it renders inline. Superseded applications page `3dcebcf981cf81228acad4b1e0601ce7`. Funders database `bfa94a53aceb47fab99b63c52b8077b6`, data source `ecfa025b-3275-42a4-8923-6cddf800adce`, with a new two-way `Artefacts` relation property. Snow row `3daebcf981cf8034b1cbe5f4f72f6906`. Snow FY26 acquittal record `371ebcf981cf8171bf27ef793c643335`, still "Needed", due 31 July, 47 days overdue.

**Git.** `../goods-public-wt`, branch `fix/q3-structure-diagram-and-attachment-readme`, commits `23e34ef` (diagram sentence fix and re-render) and `679e2a3` (attachments README). Not pushed. Three `wiki/canon/*.md` files are modified in the tree and are NOT mine: another session regenerated them on 15 Sep and the only change is a date stamp.

### The seven findings from the artefact review

1. **Two raise totals in circulation.** Attachments said $750,000, the front door said $599,750. Resolved on the one page to $749,750, the actual sum of five asks, loan inside per Ben's 15 Sep ruling. The front door's "gap $136,437" turned out not to be a gap: it is the running-cost shortfall the $150,000 loan exists to carry.
2. **The bed arithmetic is $750 short.** 133 x 3 = 399 beds and $299,250. Attachments 11 and 12 print 400 beds and $300,000. The three asks as sent total $299,750. NEEDS BEN.
3. **"11 washing machines paid for" is unsupported.** Hardcoded at `pitch-chapters.ts:109` and `:252`, labelled verified, printed on attachments 04 and 11 and live on /pitch. The 14 May purchase ledger shows four invoices out carrying nine new machines plus four upgrades. No combination gives eleven. That ledger is four months old, so it needs a live read before either number is printed. NEEDS BEN.
4. **The QBE Q3 structure diagram printed a truncated sentence** on the sole-trader box. Fixed and re-rendered. The copy attached to the old applications page still has it.
5. **Snow was counted both ways** on the front door, inside the asked total and as beds still to find.
6. **Two different "year needs" totals**, $851,224 on the money map and $736,187 on the front door, because one prices beds at what the grant pays and the other at cost.
7. **The deliverables README was stale.** Fixed.

### Snow: everything gathered, for the report

**The relationship.** Sally Grimsley-Ballard sits on the Goods advisory group. Snow co-invested in Jigsaw alongside a SEFA-led syndicate, which matters because SEFA is the $150,000 loan in this raise. Snow's mandate is long-term enterprise partnership, flexible capital over time, a fellowship model for founders, and co-investment alongside other catalytic capital.

**The corrected money.** Ten paid invoices, contact `9bbf72cc-5bef-47bd-9a29-a646ad22fb71`. INV-0092, 1 Oct 2023, $35,200 inc, is "(Con)nected - Digital support for Drug Court participants" and is NOT Goods. **First Goods invoice is INV-0166, dated 3 Oct 2024, paid 24 Oct 2024, $27,500 inc, "Goods. Bedding Project - Phase 1 Support".** Snow-for-Goods is **$457,929.79 inc-GST**; the all-ten figure is $493,129.79 inc-GST. Both are the same basis; the ex-GST pair is $416,299.81 / $448,299.81. The 9 June reconciliation doc stated the basis inverted and 3c has corrected it.

**The line that cannot be used.** "Snow funded this before there was a bed to point at" is false. First bed reached a community 4 Oct 2024; the first Goods invoice is dated one day before that and the cash landed three weeks after. Georgina's commitment email is 2 Oct 2024, two days before the bed, so every version of the claim fails. **Use her words instead**, which need no date: "initial seed funding for your entrepreneurial remote mattress project", and "Good on you and Ben getting started out in community with little funding, shows conviction and passion!"

**Snow's four standing reservations** (Sally, 23 Jan 2026, asking for risks against "concerns that have been raised to date by us"): **waste, demand for the plant, payment first, key learnings.** Answer all four by name.

**How Sally wants the health case made** (20 May 2026): "A cold audience needs that chain explained immediately and plainly, before the product, before the manufacturing story." Her own sentence: "Rheumatic heart disease (RHD) is a preventable condition that damages the heart valves of children and young people. It is almost eradicated everywhere in the world except in remote Aboriginal and Torres Strait Islander communities in Australia." On "Made by community. Made for community.": "The health stakes need to come first."

**The card for the new directors.** Snow's Nov 2025 position is that all future grants require First Nations leadership and that they will review all partners. Goods on Country Ltd, DGR1, 100% Indigenous directors, public ABN answers that outright.

**Do not lead on recycling.** Snow's published exclusions name "Environmental causes". Frame 20 kg a bed as local economics and freight substitution inside the RHD and ownership story.

**Two traps.** The public Statement of Intent enumerates seven principles, and there is a separate newer DRAFT "Snow Foundation First Nations Principles" (ID 22594) Sally shared 20 Jan 2026 for the incoming First Nations Advisory. Two different documents, pick one deliberately. And do not print an RHD strategy period: the Statement of Intent reads 2024-2030, the 2024 annual report says 2024-2028 and "five-year".

**The soft spot.** No acquittal or formal report was ever emailed to Snow. Goods' own Jan 2026 proposal already carried "Complete any outstanding reporting from previous Snow Foundation commitment." The FY26 acquittal is 47 days overdue.

**No Snow person ever put the loan or impact-investment idea in writing.** All three sources are our own words. Do not say Snow opened that door. The Bhanvi intro drafted in June was never sent and was never a written Snow offer.

**The Q2 2026 acquittal draft** at `wiki/outputs/funder-reports/snow/2026-Q2.md` has the right structure and Snow's principles, and is full of withdrawn or superseded figures: the 200-350 bed requests, Dianne Stokes' "20 more", Norman Frank's 3, Utopia's ~6,000, Palm Island offering to buy a plant, 25 kg a bed (canon is 20), a 28-washer fleet (canon is 22), $684.79 and $600 a bed (superseded by about $262), and the $275,000 paid / $120,000 owing split. Reuse the skeleton, none of the numbers.

**3c's full Snow detail** is at `thoughts/shared/handoffs/snow-foundation-ongoing/current.md` on branch `fix/snow-ask-and-figure` in `../goods-ledger-wt`.

### Empathy Ledger: live counts and a consent problem

Queried live against `yvnuayzslukamizrlhwb`, Goods project `6bd47c8a-e676-456f-aa25-ddcbb5a31047`, by empathy-ledger-v2-c0 on 16 September:

- project_storytellers: **44**, not 240. The 240 in my notes is probably org-level or all-projects.
- stories: **390 total, 14 published**, not 0 published.
- extracted_quotes: **110 total, 98 approved, 0 carrying `public_display_consented`.**
- media_assets: **270, all public.** This one matches what we thought.

**The zero is worth stopping on, but read it narrowly.** Corrected by empathy-ledger-v2-c0 after they saw my first write-up: `public_display_consented` is the gate for display on **Empathy Ledger's own public surfaces**, verified in that session by watching a quote leave the public archive while staying on the installation screen, because each door honours its own permission. What it does **not** govern is external use in a funder report, a Notion register or a deck. That runs on different machinery, including use-request and syndication, which nobody has traced.

So **"0 public" does not mean no quote may appear in a Snow report.** It means the basis for that use has to be established on its own terms rather than inherited from `approval_status`. The sentence that holds is the narrow one: **approved means a human ruled on the text, not that anyone agreed to it being shown.** Whether the Goods five-tier record already carries a sufficient external-use basis is the open reconciliation, and EL has no view on it.

This still sits under artefact 02, which I have described everywhere as "every quote in our applications comes from it, word for word", and under artefact 10, the consent summary. Both go to funders.

**Two more evidence-integrity findings from the same session.** `npm run check:quotes-verbatim` found **540 transcript-sourced quotes matching no transcript, 313 of them approved and 135 publicly displayed.** And a Goods framework doc presented **409 lens answers as "in their words" when they were not**: speech accounted for 244 and a single word for 30. On that platform a lens answer is a reading, not a quote. Run that check before any quote reaches a funder page, and never lift a sentence out of an analysis output and set it in quote marks.

**The "word for word" claim is checkable rather than arguable.** `npm run check:quotes-verbatim` in `empathy-ledger-v2` compares stored quote text against the transcripts. Run it before that sentence goes back in front of a funder and it either earns the sentence or names the exceptions. Cheaper than a policy argument, and it is the single next action here.

This does not by itself mean the Goods tier system is wrong. Goods holds its own consent record in `cleared-voices.ts` and `storyteller-registry.ts` with five tiers, and Ben ruled on 11 September that EL consent is approved and to stop hedging. But the Goods-side tiers and the EL-side `public_display_consented` field currently disagree, and nobody has reconciled them. **That reconciliation is Ben's call and it should happen before the 37-voices claim goes in front of another funder.**

Note for anyone running migrations: `20260916020000_project_storytellers_points_at_storytellers.sql` is on main, written but not applied to prod. It is a no-op against current prod, which already references `storytellers`.

### The claim ceiling is being breached from more than one direction

On 16 September the Notion front door's Claims row changed from "No health outcome..." to "Partnership and broader ecosystem health outcome". Separately, 3c found and fixed two live breaches the same day: `content.ts` said "It's cardiac prevention" on a public page, and `impact-model.ts` carried an unsourced "~89% grant-funded". `claims-ledger.ts` enforces the anti-claim "We do not claim health outcomes", and `impact-model.ts` has had metrics deleted rather than overclaimed. Worth watching as a pattern rather than three separate slips.

### The figures a funder can check, as at 16 September 2026
- 540 beds recorded across 11 communities; 177 Stretch, 363 Basket. 22 washing machines. Earliest bed supplied 4 October 2024.
- 320 beds bought and paid for on five invoices from four organisations: $247,770 net of GST, $273,966 including GST.
- Bed price $750; about $262 makes it (provisional); $100 freight and $100 facilitation absorbed; $288 reaches the organisation.
- Running the organisation costs $251,224 a year, so 874 paid beds a year carries it with no grant. This year plans 400.
- Raise $749,750 across five lines. Nothing signed.
- Grants received $772,788, seven lines. Snow-for-Goods within that is $457,929.79.
- 37 cleared voices, 142 approved quotes.

### The standing rules that bite here
- Never print the withdrawn "who has asked" bed figures.
- No health outcome is claimed. Scabies and RHD are the why; the claim stops there.
- "DGR1 charity led by 100% Indigenous Directors" is right; never flag it.
- Ben and Nic are employees, not directors. No chair is printed.
- No "A" before a dollar sign.
- No local file references in Notion: cite people, dates, rulings, live pages or attached files.
- Run the AI tells gate before publishing. It lives at `tools/check-ai-tells.mjs` in `../goods-finance-wt`, not in the public worktree.

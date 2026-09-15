---
date: 2026-09-16T09:30:00+10:00
session_name: goods-artefact-hub
branch: main (worktree ../goods-public-wt; handoff written on docs/artefact-hub-handoff)
status: active
---

# Work Stream: goods-artefact-hub

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-16T09:30:00+10:00
**Goal:** One Notion page for the Goods project that holds every artefact, every submission and every answer, aligned to the site and the figures, and easy to search. Done when a person can open one page, find any artefact or answer in under a minute, and nothing on it disagrees with goodsoncountry.com.
**Branch:** main is 5af48a0. Attachments and data live in `../goods-public-wt`.
**Test:** `cd v2 && npm run check:drift:ci` (ends on check:voice; exit 0 = the whole chain passed).

### Now
[->] Nothing in flight. Next session starts fresh with the three asks below.

### Ben's ask for the next session, in his order
1. **Review all artefacts.** Everything built so far: the 13 application attachments, the structure PDF, the deck, the model workbook, the placemat and money map, the live site pages.
2. **Work through every submission page and add them.** Each application row in Notion, one at a time, adding the artefacts that belong to it.
3. **Then design the one page.** The best ongoing way to build a Notion page for the Goods project that aligns everything, creates clarity and is easy to search. Think about the structure before building it.

### This session (16 September)
- [x] **37 cleared voices confirmed and corrected everywhere.** Canon and the registry both say 37 at the external tier, holding 142 approved quotes; Carmelita and Colette share one card. The count went 32 (June) → 34 (Margaret Lloyd, Tanya Turner) → 35 (Jahvan Oui) → 37 (Eric Pascoe, Tehmineh Mason, August). QBE Q6, Q7, Q11, Tim Fairfax 5.1, attachment 02 and two investor wiki pages updated.
- [x] **Palm Island claim corrected.** QBE and Tim Fairfax said Palm Island had more cleared voices than anywhere else. Tennant Creek has ten, Palm Island seven. Q6's case for Palm Island going first now reads "second only to Tennant Creek"; the rest of that case is unchanged.
- [x] **Grants received reconciled against live Xero and the FY26 statements: $772,788, seven lines.** Two errors fixed: FRRR was a second $50,000 (it is the same joint Backing the Future grant as Vincent Fairfax, INV-0253), and The Funding Network was $130,000 (the banked cash is $144,558, two receipts 28 Nov and 19 Dec 2025, account 262). Attachment 08 now prints one total with a source on every line.
- [x] PR #270 merged (5af48a0), Vercel green. Attachments 02 and 08 rebuilt and re-uploaded to Notion.
- [x] **Entity sweep.** Every Goods application row, the front door and the research rows say "Goods on Country Ltd, formerly The Butterfly Movement Ltd". The funders database select option was renamed, which cleared the field on 26 rows; all 26 were re-set.
- [x] **Facility sweep.** QBE Q8/Q19, SEFA and the front door say "the Goods on Country facility in Queensland". The Harvest keeps its own name on rows that are about the Witta site itself (Sunshine Coast Council, auDA, RADF, Nutrien, Ian Potter).
- [x] SEFA row fixed: ask $150,000 (Ben confirmed), grants list replaced, revenue answer corrected.
- [x] Jeremy Donovan's nomination is lodged (Ben, 16 Sep). Chased out of the QBE next-action, the front door, Blockers and the worklist task.

### Next
- [ ] Artefact review: open each of the 13 attachments and the structure PDF, check each against the site and the figures, list what is stale.
- [ ] Per submission row: attach or link the artefacts it needs; QBE has 19 (8 in hand, 4 partial, 7 missing), Tim Fairfax 14 (5 in hand).
- [ ] Design the one page, then rebuild it. See "What the one page has to solve" below.
- [ ] Still open from earlier: /pitch/road vs /pitch decision; Q&A fixes in code (drop A$, where-money-lands "the sales", washing machines "not for sale", why-100 blank); the front door's "Every investment option" table vs the raise.

### Decisions
- **Grants total basis: $772,788, cash received, each line traced to Xero or the charity's FY26 statements.** Never $741,111 (includes Centrecorp bed purchases and commercial receipts), never $901,311 (all funding received, including $221,649 from buyers), never ~$795,000 (the old SEFA list, which double-counted FRRR).
- **The unit for cleared voices is voices, not people** (37 cards, one shared). "37 people" overstates by one.
- Documents prepared in the old name (constitution, FY26 statements) keep it, described as the former name, so a funder can match a file to a register entry.
- Notion carries no references to .ts, .md or any local file (Ben, 16 Sep). Cite people, dates, rulings, live pages, Notion pages or attached files.

### What the one page has to solve (input for the design step)
- Today there are two pages doing overlapping jobs: the front door "Goods on Country QBE raise" (the raise, the model, key dates, actions) and "Goods applications: facts, attachments, pages and Q&As" (facts, the attachment register, each application, the live pages, the 25 Q&As). Plus the funders database, the worklist database, and child pages (The focus, About us, The model, The deck, QBE application, Other grants, FAQs, Numbers, Blockers, Artefact Register).
- The recurring failure is drift: a figure changes and three pages disagree. The attachments now come from the same data as the website, which is what stopped it for the money.
- Search matters to Ben: he wants to find an artefact or an answer fast, not scroll.

### Open Questions
- UNCONFIRMED: whether the one page replaces the front door and the applications page, or sits above both as an index. Ask Ben before building.
- UNCONFIRMED: whether the attachments should live on the one page, on each application row, or in a Notion folder both link to.

### Where things are
- **Attachments (13 + structure):** built by the attachments script in `../goods-public-wt/v2`, written to `deliverables/application-attachments-2026-09/`. Rebuild after any figure change, then re-upload to Notion.
- **Notion:** applications page `3dcebcf981cf81228acad4b1e0601ce7`; front door `3d8ebcf981cf8128bd9aee918f49733f`; funders database `bfa94a53aceb47fab99b63c52b8077b6` (view: QBE Final List); worklist `321f4fc7ba6d476c8640c509b88c5076`.
- **Figures:** canon and the data modules in `v2/src/lib/data`, drift-checked. Grants, paid trade, facility modules and the year each have guards.
- **Live Xero reads:** read-only, via the act-infra token refresh and REST GETs against the Nicholas Marchesi tenant. The Supabase Xero mirror is stale for bank transactions (last synced Dec 2025) and misses pre-2025 invoices; use live for anything that matters.
- The older `funder-submissions-2026-09` handoff lives in the main checkout and belongs to another session's tree. Read it, do not write to it.

### Workflow State
pattern: sequential
phase: 1
total_phases: 3
retries: 0
max_retries: 3

#### Resolved
- goal: "review all artefacts, work through every submission page and add them, then design the one Notion page that aligns everything and is easy to search"
- resource_allocation: balanced

#### Unknowns
- one_page_shape: UNKNOWN (replace the two pages, or index above them)
- attachment_home: UNKNOWN (one page, each row, or a shared folder)

#### Last Failure
(none)

---

## Context

### The figures a funder can check, as at 16 September 2026
- 540 beds recorded across 11 communities; 177 Stretch, 363 Basket. 22 washing machines.
- 320 beds bought and paid for on five invoices from four organisations: $247,770 net of GST, $273,966 including GST.
- Bed price $750; about $262 makes it (provisional); $100 freight and $100 facilitation absorbed; $288 reaches the organisation.
- Running the organisation costs $251,224 a year, so 874 paid beds a year carries it with no grant. This year plans 400, which bring about $115,000; the $150,000 loan carries the rest.
- Raise $750,000: QBE $300,000 for two facilities, three bed grants of 133 beds each, SEFA loan $150,000. Nothing signed.
- Grants received $772,788 (seven lines, see Decisions).
- 37 cleared voices, 142 approved quotes.

### The standing rules that bite here
- Never print the withdrawn "who has asked" bed figures.
- No health outcome is claimed.
- "DGR1 charity led by 100% Indigenous Directors" is right; never flag it.
- Ben and Nic are employees, not directors. No chair is printed.
- No "A" before a dollar sign.
- Run the AI tells gate on public copy before publishing.

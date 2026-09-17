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
[->] **BUILT AND RUNNING: the Snow partnership report. `http://localhost:3013/partners/snow/story`, password `snow2026`.** Eight chapters in the shape of /pitch. Gated in `proxy.ts` in the same commit that created the route. Ben has not seen it yet.

Chapters: the health chain first (Sally's own instruction), the arc from idea to charity over the Tingkkarli drone, every engagement since Aug 2024 filterable by kind, what the money turned into ending on zero community-owned sites, the three Indigenous directors, Snow's published priorities with our evidence against each including the weak ones, what is not finished, then $99,750.

Both blocking rulings are in (Ben, 16 Sep): **$99,750 for 133 beds as a grant now**, recoverable capital named as the next chapter; **the figure is footnoted, not restated**.

**Clock: an in-principle letter is wanted by about 21 September; QBE submits the 25th.** Snow route the decision through their advisory committee.

**Also inherited today** (the other session stood down, Ben moved it here): the Notion side, the Snow ask letter on row `3daebcf981cf8034b1cbe5f4f72f6906` (red HOLD awaiting the INV-0166 numbers), the Artefact Register and the front door. Their three commits sit unpushed on `fix/q3-structure-diagram-and-attachment-readme` in `../goods-public-wt`.

**Consent alarm: CLOSED.** `npm run check:quotes-verbatim` in empathy-ledger-v2 run live today: **0 public quotes non-verbatim**, control passed. The "135 publicly displayed" figure that was circulating is the script's own docstring from a 10 September measurement, since remediated. 189 approved-but-not-verbatim remain, none public. Three misattributions, all named, none of them Goods community storytellers (Sarah Mayers once, Ben twice). The `public_display_consented` half was never a Goods issue: `cleared-voices.ts` says in its header that EL exposes no per-storyteller consent flag to the syndication client, which is why the name allowlist is the gate.

**One gate still worth hardening:** `isClearedForExternal` checks the speaker's name and never the words, so `/community`, `/gallery` and `/communities/[slug]` would render altered EL text under a cleared person's name. Nothing bad is coming through it today. Not changed, because closing it could blank live sections.

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

### What the mailbox adds, and it is the best material for the letter
A full read-only sweep of every Snow thread, ~45 searches, `in:anywhere`. About 64 distinct engagements since March 2024.

**Snow's four standing reservations about Goods, in Sally's words, 23 Jan 2026.** She asked for the risks to be fleshed out, "think about concerns that have been raised to date by us": **waste, demand for the plant, payment first, key learnings**. That is the objection list. A letter that answers those four by name lands better than one that does not know they exist.

**How Snow wants the health case made.** Sally's 20 May 2026 critique of the Canberra landing page is the single most useful paragraph in the corpus: "A cold audience needs that chain explained immediately and plainly, **before the product, before the manufacturing story**." She even wrote the sentence she wanted: "Rheumatic heart disease (RHD) is a preventable condition that damages the heart valves of children and young people. It is almost eradicated everywhere in the world except in remote Aboriginal and Torres Strait Islander communities in Australia." And: "'Made by community. Made for community.' ... **The health stakes need to come first.**" Her suggested call to action: "Join us to help end Rheumatic Heart Disease".

**Georgina's founding words, 2 October 2024**, at the moment of first commitment: "Snow is interested to provide some **initial seed funding** for your entrepreneurial remote mattress project... **Good on you and Ben getting started out in community with little funding, shows conviction and passion!**" That is catalytic capital and backing the founder in her own voice, and it is better than anything we would write. It is not in the registry yet; add it before quoting it anywhere public.

**The loan was never Snow's idea in writing.** No Snow person has put the loan or impact-investment pathway in an email, ever. The three sources are all ours: Nic's Jan 2026 proposal ("Snow Foundation has offered access to social impact loans"), Nic's Feb 2026 note to QBE ("matched and potentially doubled by Snow"), and Ben's Jun 2026 "potential Snow loan system". The dashboard said "Snow has opened a conversation" and has been rewritten. **Do not put that intention in their mouth again.** What IS evidenced: Bhanvi Anand of Snow works on impact investing, named in their June 2026 newsletter on the $4.1M Thrive lending facility.

**Reporting is the soft spot.** No acquittal or formal report was ever emailed to Snow. Goods' own Jan 2026 proposal timeline contains the line "Complete any outstanding reporting from previous Snow Foundation commitment", so it was already outstanding then. The only reporting artefact is Ben's 11 Jun 2026 package of links, which Snow never answered by email. The 31 July 2026 acquittal date is in neither the grant letter's indexed text nor any email.

**The FY26 agreement, probed but not read.** Gmail full-text-indexes PDFs, so string presence is knowable. Present: `2024/OC0014`, `acquittal`, `395,000`, `275,000`, `120,000`, `100,000`, `2027`, `Operational`, `wages`, `washing`. Absent: every reconciled figure, `31 July`, `quarterly`, `12 months`. So the whole relationship is carried under one 2024-vintage grant reference, it does impose an acquittal, it runs into 2027, and it covers wages and washing machines as well as beds. **Which of the four amounts is the grant is unknown. Get the PDFs opened before a figure goes in a letter.**

**Snow's new strategy, Georgina, 26 June 2026.** Pillars stay (Place, Country, Sector, Family); six priority areas: Gender, First Nations, Youth, LGBTIQ+, Community, "all underpinned by **Ecosystem**... backing social change makers, acting as the glue between funders and nonprofits, and **advancing the impact investing market**." 2025: 196 grants, 198 grants to individuals, 38 social impact investments.

**People.** Bhanvi = **Bhanvi Anand**, impact investing (address not recoverable from the mailbox). **Carolyn Ludovici is NOT stale**, still named as Snow staff in June 2026. Also active: **Alex Lagelee Kean** (Impact & Engagement), **Lucy McKee** (Marketing), **Jimyong "Brenton" Um**, **Ashley Machuca**, **Maree Meredith**. Sally's title changed to Head of Partnerships, Our Country.

**Loose end.** Nic asked Snow on 3 Oct 2024 whether to charge GST and was never answered in writing. That is the origin of the inc/ex-GST fork that has run through every figure since.

### Decisions
- **Catalytic capital, never a graduation story** (Ben, 16 Sep). Now enforced across every funder surface, not one file
- **No dollar figures on public funder surfaces** (Ben, 16 Sep). A private letter to Snow is different and CAN carry numbers. Do not carry that ruling across by mistake
- **NEVER SEND EMAILS** (Ben, 12 Sep). Reading is fine. Drafting is fine. Sending is not

### Open Questions
Both of the blocking ones are answered (see Now). What is left:
- The FY26 grant letter's headline amount, term and acquittal date. Four amounts sit in the PDF and none of them can be read from here
- Whether the FY26 Operational acquittal was ever lodged. No evidence either way
- Whether the 28 Jun Round 4 email to Sally went out
- The Snow Entrepreneurs outcome (2025/OC0146). No result email either way
- Snow's RHD strategy period: 2024-2028 or 2024-2030. Do not print one

### Workflow State
pattern: sequential
phase: 3
total_phases: 4
retries: 0
max_retries: 3

#### Resolved
- snow_figure_hold: RESOLVED. INV-0092 is not Goods. Goods-only is $457,929.79 inc-GST, confirmed by two independent sources
- gst_basis: RESOLVED. $493,129.79 is inc-GST, not ex-GST. The June doc had it backwards
- ask_conflict: RESOLVED (Ben, 16 Sep). Bed grant $99,750 now, recoverable capital named as the next chapter. Two of the three answers were staleness, now fixed in code
- snow_figure_publication: RESOLVED (Ben, 16 Sep). Footnote it; the live pages do not move
- snow_loan_provenance: RESOLVED. No Snow person has ever put the loan in writing. All three sources were our own words

#### Unknowns
- fy26_agreement_conditions: UNKNOWN. PDFs indexed by Gmail but not readable from here
- fy26_acquittal_submitted: UNKNOWN. No acquittal was ever emailed; Goods' own Jan 2026 proposal says reporting was already outstanding then

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

# GOC cost model, community modules and NT Corrections — handoff

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-08-04T21:00:00Z
**Goal:** Make the Goods on Country numbers explainable, answer the community side, and
scope the NT Corrections opportunity. DONE. Everything merged, nothing in flight.
**Branch:** `main` = `2263c60` (PRs #200-#204 merged). Working tree ON MAIN.
**Test:** `cd v2 && npm test && npm run check:register && npm run check:audience && npm run build`

### Now
[->] **Nothing in code.** The next topic is PITCH DECKS and the different packs we build for
investors. This handoff closes the cost-model thread.

### The one thing to carry forward

**The GOC cost model is three numbers. Two are settled. One is not.**

1. **Per bed: $425.74.** Settled, and checked against a paid invoice (see below).
2. **Per site per year: NOT AGREED.** Three live answers. This is the whole blocker.
3. **Once, for the whole company: $229,700.** Network $109,500 + company overhead $53,000 +
   founder non-production $67,200.

| A site costs this to run | Sites needed to break even |
|---|---|
| ~$15,000 (Matt's projection at scale) | 2.0 |
| $48,333 (our MODEL tab) | 2.8 |
| $64,333 (detailed, less the double count) | 3.5 |
| $79,333 (our module allocation) | 4.6 |

**Two sites or five sites, same product, same price.** Every document was built on a different
one of these, which is why the modelling felt arbitrary all week. It is not the arithmetic.

**Decision page: `deliverables/GOC-site-cost-decision.md`.** Three questions, blank decision
lines, half an hour with Nic. Rent ($12K or $30K, where $30K is half of Kirmos and an on-Country
site is not Kirmos), admin (a straight double count: $14,700 in the network block AND $15,000 in
the site floor), machine upkeep ($18,333 flat or 5% of that site's equipment).

### What landed this session
- [x] **PR #201 — the community side of the cost model.** `community-model.ts`, 35 guards. The
      value ladder, every rung priced from a Defy invoice: shred $40 → kit $344.05 → bed $400 →
      sold $750. `/pathways/[id]/numbers` one-pager for all four communities, noindexed.
- [x] **Selling does not depend on making.** Contiguity is right for the physical steps and wrong
      for sales. Fixing it revealed that adding SELLING to Utopia's existing ask moves it from
      −$33,043 to +$122,657 with no extra capex, and beats pressing (+$83,742) which costs
      $33K more to set up.
- [x] **PR #200 — Maningrida bed provenance.** TWO invoices, which is why the count kept moving:
      INV-0283 (13 Basket Beds, Mala'la, Oct 2025) and INV-0303 (40 Stretch Beds @ $750,
      Homeland School Company, 18 May 2026, PAID). Neither says "Maningrida"; INV-0303 is tied to
      it only by the freight line "ex BNE - DRW - MNG".
- [x] **PR #202 — the 40-bed run reconciles.** Contribution $326.76/bed actual vs $324.26
      modelled, under $100 gap across forty beds. The costing has been tested against real paper.
- [x] **PR #202 — the throughput conflict logged.** `FACTORY_THROUGHPUT_CONFLICT` +
      6 guards. Defaults say 5 beds/day, `state_4_factory` says 4, its own labour line divides by
      5. Worth $20/bed. Guards assert it STILL EXISTS in the logged shape, so resolving it fails
      the test and forces a human decision.
- [x] **PR #203 — NT Corrections**: one-pager (goes to Bodie), decision note (decides whether to
      send it), production pack (internal, marked do-not-send).
- [x] **PR #204 — the site cost decision page.**
- [x] Sheet updated twice and live, 9 tabs including Community Economics.

### Next
- [ ] **PITCH DECKS AND INVESTOR PACKS.** The new topic. Start here.
- [ ] **Half an hour with Nic** on the three site-cost questions. Everything reads off it.
- [ ] **Email to Matt.** Drafted in the 2026-08-04 transcript, NOT sent, not in Gmail drafts.
      Three corrections: the QBE 1:1 match does not exist (takes $250K out of his stack), sites
      cost ~$15K/yr in his projection, and nothing caps the build so it reaches 18 sites and
      8,600 beds against zero signed orders.
- [ ] **Share the Sheet** with matt.allen@socialimpacthub.org and malcolm.aikman@socialimpacthub.org.
- [ ] **One question to Defy**: how many bed sets come out of one pressed panel. Decides whether
      the Corrections supply idea saves $23/bed or $123/bed. Nothing else should move first.
- [ ] **Ask one community** about production inside a prison. The decision note treats it as a
      GATE, not a consultation.
- [ ] Two phone calls (Nic on the CNC, bookkeeper on the Telford Smith voids), the measured
      production week (~$2,250), the COGS reclassification.

### Decisions
- **Freight is 35% of the cost of a bed.** $150 of the $425.74, more than plastic, diesel and
  labour combined, and INV-0303 puts it at $147.50 actual. Nobody put it there deliberately and
  it is now one of the best-evidenced inputs in the model. It is also the strongest argument for
  production near community, and it is a cost argument rather than a values one.
- **The register counts assets IN COMMUNITY; an invoice records a SALE.** Different measures, not
  supposed to tie, register always larger. Maningrida: 18 Basket vs 13 invoiced, 8 washers vs 2.
- **A negative community result is a POT question, not a deficit.** "This step needs $X of grant
  behind it", never "the community is $X short". No community puts in capital or covers running
  costs.
- **The community model refuses to split money into wages and surplus.** That is the community's
  call. Guarded by test.
- **NT Corrections is a SUPPLIER, not a customer**, in the narrow two-station scope. It does not
  answer the demand question. Judge it as a cost and capability play.
- **Goods buys Corrections output, never takes it free.** Backed by published policy: correctional
  industries must recover full cost and are explicitly "not exploiting cheap labour".

### Open questions
- UNRESOLVED: what a site costs to run for a year. See the decision page.
- UNRESOLVED: 4 or 5 beds per operator day. Only the measured week settles it.
- UNKNOWN: the bigger CNC router's price. NOT in this Xero org at all; only $5,134.71 of Multicam
  install. But a CNC IS in Xero, bundled: Circularity Group, 17 Dec 2025, $32,780, "Machinery
  (CNC, Hot + Cold Presses, Sheet Storage, Prep Table)", which is where the $32,780 pressing
  module figure comes from. Whether the Multicam replaces or adds to it is a question for Nic.
- UNKNOWN: bed sets per pressed panel.
- OPEN: demand. Still no signed FY27 orders.
- NOT READ: parliament.nt.gov.au 403s and Wayback rate-limited, so the Lambley written-question
  answers on NTCI competition were never read. Nothing now depends on them.

---

## The simplest investor framing found this session

**A bed makes $324.** Sells for $750, costs $426.
**A site makes about $81,000 a year.** 450 beds of margin less what the site costs to run.
**You need about three sites.** $229,700 of cost does not change however many sites there are.

> **We are raising $800,000. That is three sites. Three sites is where the business pays for
> itself. You are not funding a gap, you are funding the third site.**

Two sums arriving at the same place from opposite directions: $275,000 a site fully funded means
$800K buys three, and three is where the fixed block is covered. **Caveat: the "three" moves to
between two and five until the site cost is settled.** Do not print it until then.

## How to test a module in community

> One community, one module, one year. Count what it produced, what it cost to run, what it earned.

First test worth running: **collection, shredding and selling, twelve months.** Smallest thing
that could show a community module paying for itself, and it needs no press.

## Where the documents are

| File | For |
|---|---|
| `deliverables/GOC-site-cost-decision.md` | Ben + Nic, the three questions |
| `deliverables/GOC-what-we-can-actually-make.md` | The 40-bed run reconciled |
| `deliverables/GOC-model-in-plain-words-2026-08-03.md` | The narrative |
| `deliverables/NT-Corrections-one-pager.md` | Goes to Bodie |
| `deliverables/NT-Corrections-decision-note.md` | Decides whether to send it |
| `deliverables/NT-Corrections-production-pack.md` | Internal only, do not send |

Notion hub: https://app.notion.com/p/3b1ebcf981cf81089414ca80aea46795
Live Sheet: https://docs.google.com/spreadsheets/d/1pMbW1P85ejKVeu-oAYx_SmawbFJHOk3Cb7D7vK-ecF0

## How to regenerate anything

```
cd v2
npx tsx ../tools/emit-community-model.ts        # must run before the workbook
npx tsx ../tools/build-site-cost-decision.ts
npx tsx ../tools/build-what-we-can-make.ts
npx tsx ../tools/build-corrections-onepager.ts
npx tsx ../tools/build-corrections-decision-note.ts
cd .. && .venv-sheets/bin/python tools/build-goc-answered-workbook.py
.venv-sheets/bin/python tools/push-xlsx-to-gsheet.py deliverables/GOC-Entity-Model-Inputs-ANSWERED-2026-08-03.xlsx
```

The workbook generator FAILS LOUDLY if `deliverables/community-model.json` is missing, on purpose.
Both the .xlsx and that .json are gitignored: they are build artifacts.

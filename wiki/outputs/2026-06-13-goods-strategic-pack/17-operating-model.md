---
title: Goods on Country — Operating Model and Owner Map
subtitle: How the work flows, which systems hold the truth, who owns each domain, and the rule that no document leaves without a human behind it
date: 2026-06-13
status: DRAFT for founder review
area: 6 Process & Technology
audience: QBE Diagnostic Area 06 (Process & Technology Maturity) / SIH mentors / board / advisory
reviewed_against: 00-master-alignment-map.md, 11-diagnostic-closure-map.md, CLAUDE.md (systems), wiki/articles/enterprise/06-process-and-technology.md
owner: Ben Knight / Nicholas Marchesi
priority: Area 06, scored 7→8
labels: VERIFIED (independently checkable) · WORKPAPER (Xero mirror, unaudited) · MODELLED (planning assumption) · TARGET (sought, not signed)
note: the diagnostic scored this area 7→8 — a strength. Goods has strong technical capability for a small team. This document closes the two things the diagnostic asked for: document the operating processes so they do not live only in founders' heads, and write down the human-in-loop rule for AI-generated material. It separates what is automated/systematised from what is still founder-dependent, and it names one accountable owner per domain so nothing falls between the two founders.
---

# Operating model and owner map

> **What this is.** A plain map of how Goods runs: the flow from order to feedback, the systems that hold the truth, who owns what, the production SOP we still need to write, and the rule that keeps AI a tool rather than an author. The diagnostic's verdict on this area was that the architecture is thoughtful but the daily operating discipline still needs human verification and the processes still live in two founders' heads. This document is the start of moving them onto the page.
>
> **The honest framing.** Strong systems, emerging operating system. Several things are genuinely live — the Stretch Bed ecommerce path, the Supabase truth layer, the QR asset register, GHL integration. Other things are documented-but-manual or still founder-carried — production tracking, repair follow-up, washing-machine telemetry as a reliable feed. We mark each one rather than imply the whole machine is humming. The founder bottleneck is the #1 risk in the register, and it is "already happening"; this document exists partly to reduce it.

---

## 1. The operating flow

This is the path a bed takes from someone wanting one to us learning whether it worked. The point of writing it down is so a third person — a new hire, a mentor, a community operator — can see the whole loop without a founder narrating it.

```
  DEMAND / ORDER          ON-COUNTRY MANUFACTURE              QR-TAG & REGISTER        DELIVERY            FEEDBACK / TELEMETRY
  --------------          ---------------------              -----------------        --------            --------------------
  Shop order (Stripe)     collect HDPE  ->  shred  ->  press  Unique ID / QR on        Freight or hand     QR scan -> support /
  or institutional   -->  sheet  ->  cut parts  ->  assemble  each unit; recorded  -->  delivery to    -->  repair / feedback;
  request / grant         with steel poles + canvas           in the asset register    community            washing-machine
  -funded batch           (~5 min final assembly, no tools)   (Supabase)                                    telemetry (IoT)
        |                          |                                 |                     |                       |
   [ SYSTEMISED ]          [ FOUNDER-DEPENDENT ]            [ SYSTEMISED ]         [ FOUNDER-DEPENDENT ] [ PARTLY SYSTEMISED ]
   shop path is live;      manufacture is run by             register is live      logistics are         QR + register exist;
   institutional orders    the founders by hand;             and the strongest     coordinated by        telemetry and repair
   are relationship-led    0 beds assembled in-house         single piece of       hand, relationship    follow-up are not yet
   and manual              in-house yet [MODELLED]           operating evidence    by relationship       a reliable feed
```

**What is automated / systematised**
- **Order intake for the Stretch Bed.** The shop and Stripe path is live and works end to end. Commercial revenue through it is AU$90 across three orders [WORKPAPER] — proof the pipe works, not proof of a market.
- **The QR asset register.** Every deployed unit gets a unique ID and is recorded. 496 beds are tracked across 9 communities [VERIFIED, 29 May 2026]. This is the single most credible piece of operating evidence Goods has — a stranger can scan a code and find a real, registered unit (e.g. Ray Nelson's bed, GB0-156-96).
- **The truth layer underneath.** Products, orders, assets, and CRM/deal data sit in Supabase. The data model exists; raw asset data is sensitive and must be redacted before external use.

**What is still founder-dependent**
- **Manufacture itself.** The production steps below are documented, but the work is done by the two founders. Critically, **0 beds have been assembled in-house** — the on-country in-source run is the gating experiment the raise funds, not a current operating reality [MODELLED]. Today's beds are built with outsourced HDPE legs.
- **Institutional orders and delivery.** Demand from communities, ACCHOs, and procurement bodies is relationship-led and coordinated by hand. Logistics to remote communities are arranged per order. None of this is systematised yet, and it sits almost entirely with the founders.
- **Repair and feedback follow-up.** The QR scan can in principle trigger a support, repair, or feedback path, but who acts on it, and within what time, is not yet an owned, time-bound process.

**Partly systematised**
- **Washing-machine telemetry.** The IoT washing machines (Pakkimjalki Kari, on a Speed Queen base) are deployed and collecting feedback, but telemetry is not yet a reliable reporting feed. Treat it as a prototype signal, not a metric.

The shape of the loop is right. The gap the diagnostic named is that too much of the middle — manufacture, delivery, repair — runs through two people rather than through a written process. That is what the SOP in §4 begins to fix.

---

## 2. Systems and tools map

Goods runs on six systems. The discipline that matters here is **one source of truth per thing** — when two systems both claim to hold the same fact, they drift, and the drift shows up as a contradicted number in front of a funder. This table names, for each system, the one thing it is authoritative for, and who owns it.

| System | Source of truth for | Owner |
|---|---|---|
| **Website / app — Supabase** (`cwsyhpiuepvdjtxaozwf`) | Products, orders, deployed-asset records, and the public storefront. Product specs themselves are canonical in code (`v2/src/lib/data/products.ts`), not hand-entered. | Ben Knight |
| **Notion** | The knowledge base / repository — the human review workspace, the QBE working pack, source mirrors. **Repository and review surface, not the system of record for live operational data.** | Ben Knight |
| **GHL / HighLevel** | CRM and pipeline — contacts, follow-up workflows, support tickets, partnership and buyer/capital targets. The **follow-up engine, not the source of truth.** API re-verified 10 Jun 2026. | Ben Knight (BD lead once hired) |
| **Xero** | Finance — money in, money billed, collection. The live billing view (received AU$649,710.79 [WORKPAPER, 29 May]). Note: this org also holds non-Goods income, so it is **not** a Goods-only revenue figure until an accountant carves one out. | Nicholas Marchesi (sole trader) → accountant |
| **QR asset register** (in Supabase) | Deployed physical assets in the field — which unit is where, its condition, its repair/service history. 496 beds tracked [VERIFIED]. **Care and repair infrastructure, framed as such — not surveillance.** | Nicholas Marchesi |
| **Empathy Ledger** | Consented community stories and the consent state attached to each. 12 stories syndicated; only Ivy Johnson + Dianne Stokes headshots are cleared for external use, others consent-pending. | Ben Knight |

**The routing rule that keeps these honest** (from the existing Area 6 article, kept as policy):
- Discovery and matching can happen in Grantscope / CivicGraph.
- **Review happens in Notion.**
- **Evidence lives in the wiki / source pages and Drive.**
- **Only approved follow-up goes to GHL.** No raw story, household, QR, asset-level, or sensitive contact note is pushed into the CRM.

This is the same discipline as the evidence labels: each fact has one home, and the home is named.

---

## 3. Data / single-owner map

Two founders is the smallest possible team, and the failure mode is not that work is undone — it is that something falls *between* them, owned by neither. So every domain gets exactly one accountable owner. "Accountable" means: this person can answer for it in a funder Q&A, knows where its truth lives, and is the one who signs off before it goes out. It does not mean they do all the work — it means the buck stops in one place.

| Domain | Lives in | Accountable owner | What "owns it" means here |
|---|---|---|---|
| **Money** | Xero (+ accountant) | **Nicholas Marchesi** | Every external dollar figure traces to a labelled source; can defend received vs billed vs grants-received; commissions the accountant carve-out (the hard Stage-2 gate). |
| **Pipeline** | GHL / HighLevel | **Ben Knight** (handing to the BD hire) | Owns the state of every buyer, funder, and partner conversation; owns which become signed, match-eligible commitments. Today: 0 signed. |
| **Assets** | QR asset register (Supabase) | **Nicholas Marchesi** | Owns what is deployed, where, and in what condition; owns the repair/service response; owns the redacted sample that can be shown to mentors. |
| **Stories** | Empathy Ledger | **Ben Knight** | Owns consent state for every name, quote, and image; the OCAP gate before any community content is published externally. |
| **Public copy** | Wiki / this pack | **Ben Knight** (numbers co-signed by Nic) | Owns that every external claim is labelled VERIFIED / WORKPAPER / MODELLED / TARGET and is Q&A-defensible; runs the pre-send checklist. |

Where a domain is mid-handover (pipeline to a future BD lead; finance to an accountant), that is stated rather than hidden. The principle the founders hold — Nicholas's "do no harm," including "do not centralise value in ACT while talking about community ownership" — applies to ownership too: as community operators come on, production and asset ownership are designed to move toward them, not stay with the founders by default.

---

## 4. Production SOP — the document to build

This is the operating document Goods does **not** yet have in a transferable form, and the one the diagnostic most pointed at. A facility guide and an operations handbook exist in draft, but they are not yet a clean, teachable SOP that a community operator could run from without a founder present. Below are the headings that SOP needs. The reason to build it is direct: **a written SOP is what lets the team grow without the founders being the single point of failure** — it is the concrete answer to the #1 risk in the register.

**Production SOP — required sections**

1. **Intake.** What plastic is accepted; sort HDPE/PP; exclude unsafe and contaminated material; weigh and log input. (Feeds the per-bed material claim — today 20 kg HDPE diverted per bed [VERIFIED from products.ts]; current actual input per bed needs confirming against the plant.)
2. **Shred and press parameters.** Shred to flake; weigh flakes; fill tray; heat and press temperature/time; cool the sheet. These parameters are the heart of the transferable knowledge — they are what turns "the founders know how" into "the plant can be taught."
3. **Cut and assembly QA.** CNC-cut parts; edge finish; assemble with the two galvanised steel poles and canvas (X-trestle tension design — poles thread through the canvas sleeves and the HDPE X-leg holes; the canvas is structural). Define the assembly QA check: tension correct, frame stable, no sharp edges, weight/dimension within spec (26 kg, 188 × 92 × 25 cm, 200 kg capacity).
4. **Defect handling.** What counts as a defect; what gets reworked vs scrapped; how scrapped HDPE re-enters intake (so the process does not "accidentally add to the waste problem" — a named environmental risk); who signs off a unit as pass.
5. **Dispatch.** QR-tag and register each unit before it leaves; record the destination; trigger the delivery and the post-delivery feedback path. Dispatch is the handoff from manufacture (founder-dependent today) to the asset register (systematised).

**A note that belongs in the SOP itself:** documenting these steps is not bureaucracy — it is the mechanism by which Goods reduces founder dependency as it grows and as the first community-employed operator comes on. The SOP is also the artifact that makes the on-country plant genuinely transferable to community ownership, which is the whole point of the model. Until the 50-bed in-source run happens, the shred/press parameters are partly modelled; the run is what turns them into measured, documented settings.

---

## 5. The human-in-loop rule

State it as policy, in one line, and hold it:

> **AI is a repository and a drafting aid. It is never the author of record. No document leaves Goods for any external party — SIH, mentors, funders, partners, board — unless a named core team member has audited it, understands every claim in it, has edited it where needed, and can defend it in detailed live Q&A.**

This rule has two halves, and both matter.

**Distinguish AI-as-repository from AI-as-authored-content.** The systems above use AI and automation well for what automation is good at: summarising source documents, finding contradictions, building review queues, drafting first-pass pages, comparing funders to criteria, producing admin and reporting drafts. That is the repository and aggregation role, and it is genuinely a strength. What automation must **not** do is be the final voice on anything that carries weight — community story interpretation, external language, consent decisions, funder claims, legal and governance claims, finance numbers, and relationship judgement. A polished draft is an input to a human, not a substitute for one.

**Enforce the human gate before anything ships.** A draft is not a deliverable. Before any document goes to an external party, a named owner from §3 must be able to stand behind every line of it under questioning. This is exactly the discipline the rest of the pack already runs on:

- **The evidence-label discipline** — every external number carries VERIFIED / WORKPAPER / MODELLED / TARGET (see `00-master-alignment-map.md`). A figure no owner can defend should not be in the document.
- **The pre-send checklist** (`00-master-alignment-map.md` §11) — nothing ships until a core team member has audited each external number and can defend it in live Q&A, Xero is re-pulled fresh, only consent-cleared voices/photos are used, and the legal-structure wording is approved.
- **The OCAP / consent gate** — before publishing any storyteller or community content externally, the consent trail is checked first; an incomplete or unverified trail means do not publish, and names or dates are never fabricated to fill a gap.

The diagnostic's deepest point across every area was that materials must be founder-owned, accurate, and defensible in live Q&A — that the real readiness gap is signed money and audited numbers, not more collateral. The human-in-loop rule is how that point becomes a daily operating habit rather than a good intention: the technology buys the founders more time with people; it does not get to speak for them.

---

*Owners: money — Nicholas Marchesi; pipeline / stories / public copy — Ben Knight; assets — Nicholas Marchesi. Systems per CLAUDE.md; figures and labels per 00-master-alignment-map.md (2026-06-13). This document is the companion to `11-diagnostic-closure-map.md` for Area 6 — read together: that map scores the recommendation status, this one is the operating model and owner map that closes the "document the SOPs and the human-review rule" recommendation.*

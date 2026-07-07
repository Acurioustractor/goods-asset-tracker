---
title: Goods on Country — GoHighLevel investor-outreach pipeline (design + import spec)
date: 2026-06-13
status: DRAFT for founder review — import-ready, not yet imported
audience: Ben, Nic (and whoever runs the GHL Goods location)
purpose: A single, defensible GHL pipeline for the 2026 capital raise, wired to the QBE Catalysing Impact match, with import-ready data and load steps. Turns the scored CASE alignment (12-investor-alignment.md) into a working CRM follow-up engine.
companion_file: ghl-investor-import.csv (this folder) — one row per investor/funder, import-ready
source: 12-investor-alignment.md (scored pipeline + shortlist) · 00-master-alignment-map.md §3 (the ask, the stack) · 08/09/10 cover notes (next actions, named contacts) · wiki/articles/investors/* (type, instrument, contacts) · wiki/articles/capital/funder-register.md (existing GHL conventions)
scope_note: There is no live GHL connector in this session. This is a design + an import file the team loads by hand (or via the existing /api/admin/targets/push-outreach dry-run path). Nothing here was pushed to a CRM.
---

# Goods — GoHighLevel investor-outreach pipeline

> **What this is.** The design for one GoHighLevel pipeline that runs the 2026 capital raise, plus an import-ready CSV (`ghl-investor-import.csv`) the team can load into the Goods GHL location. It takes the CASE alignment scoring (`12-investor-alignment.md`) and turns it into stages, tags, owners, and per-stage next actions — so the triage artifact becomes a live follow-up engine.
>
> **The spine it serves.** The raise is *"a conversation problem, not a discovery problem."* Signed, match-eligible LOIs today: **0**. The QBE Catalysing Impact match (up to AU$400K, ≥1:1 against secured external capital, **legally binding** evidence, verified by SIH at the **September 2026** application) is an *output* of money raised first. This pipeline exists to drive warm relationships to a **signed commitment before 31 August 2026** — the stage list, the tags, and the cadence all bend toward that date.
>
> **No fabrication.** Email/phone are left blank unless a real one is recorded in the sources. Where a contact is named but unverified, the row carries the name in Notes with a `confirm` flag and the cell stays blank.

---

## 1. Pipeline name + purpose

**Pipeline name:** `Goods — Capital Raise 2026 (QBE Match)`

**Purpose:** Track every funder/investor in the 2026 blended raise from identification to funded, with the explicit goal of converting ≥AU$400K of **secured, match-eligible external capital** into the QBE Catalysing Impact match by the **31 August 2026** commitment deadline and **September 2026** SIH verification. One opportunity per funder; the opportunity value is the plausible ask (the AU$900K–1M blended target, assembled across the rows).

**Why a dedicated pipeline (not the existing Strategic Capital one).** The Goods GHL location already runs `Strategic Buyer`, `Strategic Capital`, and `Strategic Partner` pipelines for ongoing CRM (`funder-register.md`). This raise is a **time-boxed campaign** with a hard external deadline and a match-eligibility gate that the standing pipeline's stages do not express. Run it as its own pipeline so the match-readiness state is legible at a glance; keep the existing `goods-capital-target` / `goods-strategic-target` tags so a contact stays findable from the standing surfaces too. (If the team would rather not add a pipeline, these stages can be created as a stage-set inside `Strategic Capital` — the CSV's `Pipeline` column is the only field to change.)

---

## 2. Stages (ordered) — entry + exit criteria

Ten stages: eight forward stages plus two terminal/holding stages (`Parked`, `Declined`). The discriminator that matters is **Stage 7 — Signed (match-eligible)**: a commitment only counts toward the QBE match if it is **legally binding** (letter of commitment / loan agreement / investment agreement), **≥1:1**, and **in place before 31 August 2026**. A warm "yes" on a call is Stage 6, not Stage 7.

| # | Stage | Entry criterion (how a row lands here) | Exit criterion (what moves it on) |
|---|---|---|---|
| 1 | **Identified** | Funder exists in the wiki pipeline; basic type/instrument/geography known. | Run the knockout test (six criteria). Pass → Stage 2. Fail → Declined. Unknown knockout → Parked (confirm-then-consider). |
| 2 | **Qualified (passes knockouts)** | Somewhat/Very Aligned on **all six** knockouts (geography, legal structure, size, return, capital type, stage) per the CASE tool. | A specific person and a specific ask are identified and a first approach is drafted. → Stage 3. |
| 3 | **Contacted** | First approach sent (email/cover note/intro request). | The funder responds and a two-way dialogue opens (reply, meeting agreed). → Stage 4. No response after the cadence below → stays in Contacted with a follow-up task; repeated non-response → Parked. |
| 4 | **In conversation** | Live dialogue: meeting held or scheduled, questions being answered. | A formal proposal / EOI / LOI request goes out, or they ask for one. → Stage 5. |
| 5 | **Proposal / LOI out** | Deck + one-pager + specific ask delivered, or their EOI/application submitted; ball is in their court. | They signal intent to commit (verbal yes, term discussion, "we'll write the letter"). → Stage 6. A pass → Declined with reason. |
| 6 | **Verbal commitment** | Funder has said yes in substance (amount + instrument agreed in principle) but nothing legally binding is signed. | A legally-binding instrument is executed. → Stage 7. |
| 7 | **Signed (match-eligible)** | **Legally-binding** commitment executed — letter of commitment / loan / investment agreement — **≥1:1**, dated **before 31 Aug 2026**. This is the stage the QBE match counts. Tag `qbe-match-eligible`. | Funds actually received / drawn. → Stage 8. |
| 8 | **Funded** | Cash in the door (grant received, debt drawn, recoverable grant disbursed). | Terminal success. Keep for the Sept 2026 SIH verification pack and reporting. |
| — | **Parked** | Knockout is **unconfirmed** (a "Don't Know", not a fail), or timing is wrong (gated on an external decision/board), or the funder went quiet. Carries a reason + a revisit date. | The unknown is confirmed / the gate clears → re-enter at the right forward stage. Confirmed misfit → Declined. |
| — | **Declined** | A knockout **fails**, the funder passed, or they are out of scope for 2026. Carries the **killer criterion**. | Terminal for 2026. May re-open in a later round (e.g. QBE Ventures 2027). |

> **The match line, drawn explicitly.** Stages 1–6 build pipeline; only **Stage 7 (Signed, match-eligible)** produces what QBE counts. Track the *sum of Stage 7 lead values* as the live "secured external capital" number — that is what must reach ≥AU$400K (and ≥1:1 against the match drawn) before 31 Aug 2026. A funded grant that was never a *legally binding commitment before the deadline* still counts as Goods money but may not count toward the match — keep the distinction visible.

---

## 3. Tags — what to apply and why

GHL tags are flat labels on the contact/opportunity. Apply from these controlled groups so views and automations stay clean. (Capital-type and shortlist tags do the real triage work; geography and knockout tags support filtering and honesty.)

**Capital type** — the instrument sought (drives which stage logic and which match-priority applies):
- `cap-grant` — philanthropic grant (Snow, Centrecorp, FRRR, VFFF, AMP, TFN, Tim Fairfax, Minderoo bucket).
- `cap-concessional-debt` — concessional / recoverable / patient debt (SEFA sub-debt, IBA debt blend, First Australians Capital, PFI recoverable grant behaves debt-like).
- `cap-equity-NO` — equity-only funder, **disqualified** for 2026 (QBE Ventures). The tag exists to record *why* a row is Declined and to make the "no equity in 2026" filter one click.

**Priority / match:**
- `priority-shortlist` — on the ranked first-AU$400K shortlist (Snow, Centrecorp, SEFA, PFI, IBA per `12-investor-alignment.md` §C). Focus outreach here.
- `qbe-match-eligible` — applied **only** when a row reaches Stage 7 with a legally-binding, ≥1:1, pre-31-Aug commitment. This tag is the match register; its summed value is the headline number for the Sept 2026 SIH application.

**Geography** (use-of-funds / mandate scope — matters because some warm money is geography-restricted):
- `geo-national` · `geo-NT` · `geo-central-australia` · `geo-QLD` · `geo-remote-australia`. (e.g. Centrecorp is Trust-Deed-bound to Central Australia → `geo-central-australia`; Snow R4/R5 is NT-restricted → `geo-NT`.)

**Knockout / status:**
- `knockout-fail` — failed a hard knockout (paired with the killer criterion in Notes). On QBE Ventures.
- `knockout-unconfirmed` — a "Don't Know" knockout to resolve before serious outreach (Minderoo, Tim Fairfax, AMP). Distinct from a fail — these are Parked, not Declined.

**Carry-over (keep for the standing surfaces):**
- `goods-capital-target` and `goods-strategic-target` — the existing tags from `funder-register.md` / the `/api/admin/targets/push-outreach` path. Keep them so a contact remains findable from the standing Strategic Capital pipeline and the admin dashboards.

---

## 4. Owner model (Ben vs Nic) + per-stage cadence

**Owner split** (from the pipeline article + cover notes):
- **Ben** — relationships, philanthropy, story/consent, governance: QBE Foundation, Snow, SEFA (opener), PFI, Minderoo, Tim Fairfax, FRRR, VFFF, AMP, TFN, Centrecorp, QBE Ventures.
- **Nic (Nicholas)** — builder/operator, Indigenous-business + debt structure: IBA, First Australians Capital. Co-owner with Ben on Snow (the R4/R5 cover note is sent by both) and on anything touching the in-source production run.

> Every opportunity must have exactly one **Owner** of record (for the GHL task assignment) even where both founders are involved — use the lead founder in the CSV `Owner` column; note the co-owner in Notes. All rows below have an owner; none is blank.

**Per-stage next-action / cadence convention** (a "next action" = a dated, owned task on the opportunity):
- **On stage entry → auto-create a task** for the Owner (see §5). The task names the single next action.
- **Cadence by stage:**
  - Identified / Qualified: review weekly until contacted (this is a fast-moving 11-week window to 31 Aug).
  - Contacted: follow up if no reply in **5 business days**, then again at **10**; third non-reply → Parked.
  - In conversation: keep a next-touch never more than **7 days** out.
  - Proposal / LOI out: follow up at **7** and **14 days**; respect funder-led timelines (PFI, IBA are "founder-can't-accelerate" — note that, don't pester).
  - Verbal commitment: chase the signed instrument **weekly** — this is the conversion that feeds the match.
  - Signed (match-eligible): log the instrument to the match register; set a reminder to include in the **Sept 2026 SIH pack**.
  - Parked: a **revisit date** (e.g. Minderoo → after the June 2026 board; Centrecorp gate → the ~26 June board).
- **Convention for the `Next Action` field:** `<verb> — <who/what> — <by when>` (e.g. "Email to open — Hannah Ebeling — within 2 weeks"). Kept short; the evidence lives in the wiki, not in GHL (per the funder-register's "do not use GHL as the knowledge base" rule).

---

## 5. Suggested automations (configured inside GHL — described, not built here)

> These are **GHL workflow configurations**. This session has no GHL connector and did not create them. Set them up in the Goods location under Automation → Workflows.

1. **Task on stage entry.** Trigger: *Opportunity stage changed* in `Goods — Capital Raise 2026 (QBE Match)`. Action: create a task assigned to the opportunity Owner, due per the cadence in §4, titled from the `Next Action` convention. One per forward stage.
2. **Follow-up reminders (no-response).** Trigger: opportunity in `Contacted` with no activity for 5 business days → task "follow up #1"; at 10 days → task "follow up #2 / consider Park". (GHL "if no reply" wait steps.)
3. **Proposal-out timer.** Trigger: entry to `Proposal / LOI out` → wait 7 days → reminder task; wait 14 → second reminder. Suppress for owners-flagged "funder-led timeline" rows (PFI, IBA).
4. **Verbal→Signed chaser.** Trigger: entry to `Verbal commitment` → weekly recurring task to the Owner until the row leaves the stage. This is the most important automation — it guards the match conversion.
5. **Match-eligible alert.** Trigger: tag `qbe-match-eligible` added (i.e. a row hit Stage 7) → notify both founders + add to the "Match Campaign" tracker. Optionally roll up summed Stage-7 value vs the AU$400K target.
6. **Deadline countdown.** A dashboard widget / recurring task surfacing days remaining to **31 Aug 2026** against the current summed Stage-7 value. (Not strictly an automation, but the single most useful view.)

> **Do not** automate outbound emails to funders. Every funder approach is founder-sent and consent-/relationship-sensitive (the cover notes are explicit: "the actual send is Ben's to make"). Automations create *tasks and reminders*, never auto-send to a funder.

---

## 6. How this maps from the alignment tool

The CASE alignment output (`12-investor-alignment.md`) maps mechanically into stage + tags:

| Alignment-tool result | GHL stage | Tags |
|---|---|---|
| **Knockout fail** (a hard criterion fails — e.g. equity-only) | **Declined** | `knockout-fail`, `cap-equity-NO` (if applicable) + the killer criterion in Notes |
| **Knockout unconfirmed** ("Don't Know" on a knockout) | **Parked** | `knockout-unconfirmed` + which criterion is unconfirmed in Notes |
| **Knockout pass + high-fit + warm + near-term signature** (shortlist §C) | the row's **current real stage** | `priority-shortlist` + capital-type + geography |
| **Knockout pass but founder-can't-accelerate / received / connector** (bench) | current real stage | capital-type + geography (no `priority-shortlist`) |
| **Reaches a legally-binding ≥1:1 pre-deadline commitment** | **Signed (match-eligible)** | add `qbe-match-eligible` |

So: **knockout fail → Declined with reason**; **knockout unconfirmed → Parked with the unconfirmed criterion**; **high-fit + warm → shortlist tag** at whatever forward stage the relationship has actually reached. The `12` doc's "killer criterion in each case" text is the source for every Declined/Parked reason in the CSV Notes.

---

## 7. Row-by-row stage rationale (the CSV, explained)

Each row's stage = the design (§2) applied to the funder's **current real status** from `12-investor-alignment.md` and the cover notes. Lead values = the plausible ask from the alignment map / master map §3 (blank where unknown).

| Funder | Stage | Why this stage | Lead value (AUD) | Shortlist? |
|---|---|---|---|---|
| **QBE Foundation** | In conversation | Program host; Stage 1 grant committed; Stage 2 (≤AU$400K, match-contingent) due Sept 2026 — active dialogue, not yet a signed Stage 2 instrument. The match mechanism itself, not a match-eligible external commitment. | 400,000 | Anchor (program) |
| **Snow Foundation** | Proposal / LOI out | R4/R5 cover note (08) is drafted to send — the specific ask (AU$130–200K, NT-restricted) is out/going out; deepest relationship; asked to be the **first signature**. | 200,000 | Yes |
| **Centrecorp Foundation** | In conversation | Active buyer-to-capital; next-round ~130 beds (~AU$106K) going to the ~26 June board (09). Board decision pending = live conversation, decision imminent. | 106,150 | Yes |
| **SEFA** | Contacted | Opener email to Hannah Ebeling (10) is the first approach; ~AU$300K concessional sub-debt; honest that 3 gates unmet. First touch, dialogue not yet two-way. | 300,000 | Yes |
| **PFI (Paul Ramsay Foundation)** | Proposal / LOI out | Recoverable-grant EOI **submitted**, AU$640K target, awaiting feedback — ball in their court. | 640,000 | Yes |
| **IBA** | In conversation | Eligibility confirmed; up to AU$5M blend; business plan in development. Dialogue open; deliberately the later anchor, not the first-AU$400K tranche. | 5,000,000 | Yes (later anchor) |
| **First Australians Capital** | Qualified | Passes knockouts; indicative AU$100–500K debt; research-stage, pursue via IBA/SIH warm intro. Not yet contacted. | 500,000 | Bench |
| **Minderoo Foundation** | Parked | **Knockout unconfirmed** (geography/mandate — oceans + modern slavery priorities vs remote housing). Warm via Lucy Stronach; gated on June 2026 board. Confirm-then-consider. | 200,000 | Parked |
| **Tim Fairfax Family Foundation** | Parked | **Knockout unconfirmed** (capital type / stage / size). Strong geography+mission (QLD, remote, Indigenous) but unconfirmed they fund at Goods' stage/ticket. Advisory via Katie Norman. | 150,000 | Parked |
| **FRRR** | In conversation | Received funder ($50K joint BTF, acquittal complete Mar 2026); already a QBE Local Division Partnership → receptive to a coordinated second ask. Relationship active. | — | Bench |
| **VFFF** | In conversation | Co-funder of the $50K BTF; received funder; explore a Round 2 as part of the philanthropic layer. | — | Bench |
| **AMP (AMP Foundation / Spark)** | Parked | **Knockout unconfirmed** (geography / size / stage). Received $21.9K Spark; thin profile for a follow-on. Light-touch credentialing relationship. | — | Parked |
| **TFN (The Funding Network)** | In conversation | Received $130K (Dec 2025); relationship active. Most valuable as a **connector** to downstream funders, not a follow-on cheque. | — | Bench (connector) |
| **QBE Ventures** | **Declined** | **Knockout fail** — equity / SAFEs / convertible notes only (Capital Type fail), plus Legal Structure + Stage of Growth fails. Deferred to 2027; Lighthouse is the only narrow 2026 door. | — | Out |

> **Dusseldorp is deliberately excluded** from the CSV: `12-investor-alignment.md` confirms it is **not a Goods funder** (the known $15K belongs to Mounty Backyard / Contained / JusticeHub). Adding it would misrepresent the pipeline. If the team wants it tracked for relationship context, add it later as `Parked` with a "not a Goods funder — relationship context only" note.

---

## 8. Load steps (how the team imports this)

**Option A — GHL native CSV import (simplest):**
1. In the Goods GHL location, create the pipeline `Goods — Capital Raise 2026 (QBE Match)` with the ten stages from §2, in order.
2. Create the tags from §3 (or let import create them — confirm spelling matches the CSV exactly).
3. Contacts & Companies → **Import** (or Opportunities import, depending on plan) → upload `ghl-investor-import.csv`.
4. **Map columns:** Contact Name → Contact; Organisation → Company/Business Name; Email → Email (blank cells skip); Phone → Phone; Pipeline → Pipeline; Stage → Stage; Opportunity Name → Opportunity Name; Lead Value (AUD) → Opportunity Value; Owner → Assigned User (map "Ben"/"Nic" to the real GHL users); Source → Source; Tags → Tags (comma-separated within the quoted cell); Next Action → a custom field or the first task note; Notes → Opportunity Notes / a notes custom field.
5. **After import:** for each `Verbal commitment`/`Signed` row (none today — all are pre-commitment) you'd add `qbe-match-eligible` only when the legally-binding instrument exists. Confirm every row has an assigned user.
6. Configure the §5 automations.

**Option B — existing push path (if the team prefers the app's own route):** the Goods app already maps approved targets into GHL + Supabase CRM via `/api/admin/targets/push-outreach` (see `funder-register.md` § "GHL Push Rules"). Use **dry-run first** to preview contact/tags/note/opportunity before any CRM write. This CSV is the reviewed target set that route expects; push capital rows with `goods-capital-target` retained.

**Before either:** these are CRM writes (Tier 2, shared-state). Confirm with the founders before importing — the funder-register is explicit that targets move to GHL only after human review.

---

## 9. Caveats (read before importing)

- **No emails/phones invented.** Only real addresses from the sources are included: Minderoo (`lstronach@minderoo.org`), FRRR (`s.pearson@frrr.org.au`), VFFF (`nchinner@vfff.org.au`, `elschwanke@vfff.org.au`). Every other Email/Phone cell is **blank** — fill from your own records before outreach.
- **Named-but-unverified contacts** sit in Notes with a `confirm` flag (Snow → Sally Grimsley-Ballard; SEFA → Hannah Ebeling; Centrecorp → Randle Walker/Jodie; QBE Foundation → Jay Boolkin; Tim Fairfax → Katie Norman; QBE Ventures → "Alex"). The cover notes flag the same "confirm contact + salutation" — do not address a formal ask until confirmed.
- **Lead values are the *plausible ask*, not committed money.** They are `[TARGET]` figures from the alignment map / master map §3. IBA's AU$5M is the full facility ceiling (a later anchor), not a first-AU$400K number. Snow shows AU$200K (top of the $130–200K band). Received-funder rows (FRRR, VFFF, AMP, TFN) have **blank** values because no new ask amount is set — flag these to the team.
- **Figures move.** Master map §10 says re-pull Xero before sending anything; nothing in this CSV is a live financial total.
- **This is not the match register.** The match register is the sum of Stage-7 rows once they exist (today: zero). The CSV stages everyone at their real pre-commitment status.

---

## 10. Summary for the team

- **Pipeline:** `Goods — Capital Raise 2026 (QBE Match)`, 10 stages (8 forward + Parked + Declined), match gate at Stage 7.
- **CSV:** `ghl-investor-import.csv`, **14 rows** (13 active/holding funders + QBE Ventures Declined).
- **Shortlist (`priority-shortlist`):** Snow, Centrecorp, SEFA, PFI, IBA (5).
- **Parked (`knockout-unconfirmed`):** Minderoo, Tim Fairfax, AMP (3).
- **Declined (`knockout-fail`):** QBE Ventures (1).
- **Bench / received (no shortlist tag):** First Australians Capital, FRRR, VFFF, TFN (4).
- **Anchor / program:** QBE Foundation (the match host itself).
- **Rows missing a value:** FRRR, VFFF, AMP, TFN (received funders — no new ask amount set; flag to team).
- **Rows missing an owner:** none — every row has Ben or Nic.

# On-Country Production Facility — GHL Pipeline Design (build-ready spec)

**Date:** 2026-05-30
**Author:** Claude (DESIGN ONLY — nothing written to GHL; no GHL write tool called)
**Status:** Spec for Ben to stand up the shell in the GHL UI. Tier-2 propose → approve → build.
**Builds on:** the 7-stage Community Production design already approved 2026-05-30 (memory `[[goods-data-alignment]]`; `thoughts/shared/handoffs/network-consolidation/current.md` #45). This document is the **build-ready elaboration** of that design — same 7+2 stage spine, now with entry/exit criteria, custom fields, tags, asset/bed-lifecycle wiring, and exact UI steps. It does **not** introduce a competing pipeline.
**Grounded in source:**
- `wiki/outputs/2026-05-30-buildslice/01-ghl-pipeline-audit.md` (the 10 live pipelines; Supporter Journey 10-stage shell, Buyer 12-stage, Demand 4-stage)
- `v2/src/lib/data/loi-pipeline.ts` (`LoiRung`, `GOODS_PIPELINES`, `STAGE_TO_RUNG`, stage-id pattern)
- `v2/src/lib/ghl/smart-lists.ts` (`AUDIENCE_SEGMENTS`, tag/segment conventions, "GHL owns the send")
- `v2/src/lib/ghl/index.ts` (`tagForAsset`, opportunity shape, strategic-pipeline env config)

> **What this pipeline IS:** a **people-and-capability journey**, not a sales funnel. Each opportunity is **one community moving toward owning its own on-country plastic plant** — collect HDPE → shred → melt → press bed components → assemble Stretch Beds → **own the plant**. The "deal" closing is **community control of the means of production**. Money flows through it (stand-up capex is a fundable ask), but the unit of progress is *local people gaining capability and a community taking ownership*, never a unit of revenue.

> **Brand frame (load-bearing, not decoration):** stages are written from the community's side of the table. Goods is the *enabler that works itself out of a job*; the destination is **Community-Owned**, with Goods stepping back to support-on-request. Lead with capability and agency, not charity. (CLAUDE.md brand voice; "community ownership of the plant" from the product truth.)

---

## 1. Where this sits in the CRM (the 5th Goods pipeline)

The audit found **3 canonical Goods pipelines** wired into `loi-pipeline.ts` / `/admin/loi-tracker`:

| Stream | Pipeline | What it tracks | Unit |
|---|---|---|---|
| `demand` | Goods — Demand Register | Who *needs* beds | a demand signal |
| `commercial` | Goods — Buyer Pipeline | Who *buys* beds | a sale |
| `philanthropy` | Goods Supporter Journey | Who *funds* the work | a funder relationship |

This pipeline is the **fourth Goods stream and the network hub** — call its stream **`production`**. It is the only one whose unit is **a community's path to making beds itself**, and it is where supply (the supplier LIST), demand (Buyer Pipeline), philanthropy (Supporter Journey) and impact reporting (`report-templates.ts`) all converge:

| Stream | Pipeline | Unit | Closes when… |
|---|---|---|---|
| **`production`** | **Goods — On-Country Production** | **a community-facility journey** | **the community owns and runs the plant** |

**It does NOT replace** the supplier LIST (suppliers are a CRM *list*, not a pipeline — Ben, 2026-05-30) or the Buyer/Demand/Supporter pipelines. It threads them:
- A community here may also be a **Demand Register** signal (they need beds) → the facility *is* the supply answer.
- Beds the facility makes feed the **bed-lifecycle** (`made-on-country`) and become deployable/saleable assets.
- Stand-up capex is raised through the **Supporter Journey** (a linked funder opp) and/or a **Buyer** offtake (a buyer underwrites a first run).
- Champions/trainees become the human story behind the **Supporter** and **Funder** impact reports.

---

## 2. Pipeline name

**`Goods — On-Country Production`**

(GHL UI display name. Keep the `Goods —` prefix so it sorts with the other 3 Goods pipelines in the shared "A Curious Tractor" location `agzsSZWgovjwgpcoASWG`, which also hosts Harvest/EL/org boards.)

Short internal handle: **On-Country Production** / stream key `production`.

---

## 3. Stages — the relationship + production-capability journey

**9 stages = 7 forward + 2 holding** (the approved spine, now with criteria). Read it as a ladder of **agency transferring from Goods to community**: early stages Goods leads with the community alongside; by stage 6 the community runs the plant with Goods support; by stage 7 the community owns it and Goods is on-call.

Each stage has an **entry criterion** (what makes an opp belong here) and an **exit criterion** (the evidence to advance). The exit of one stage is the entry of the next.

| # | Stage | What's true here | Enter when… | Advance when… (exit) |
|---|---|---|---|---|
| 1 | **Community Interest** | A community has signalled it wants to make beds on country (not just receive them). Relationship is forming. | A community/org expresses interest in local production, OR Goods identifies a strong-fit community and gets a first "yes, let's talk". | A named local point-of-contact exists AND the community has agreed to explore it together (verbal is fine). |
| 2 | **Local Champions** | One or more local people have stepped up to carry this — the human engine. Goods is alongside, not driving. | ≥1 local champion is named and willing to lead/coordinate on the ground. | Champions identified + linked as contacts (`goods-prod-champion`), and a first yarn/visit about what a plant would mean has happened. |
| 3 | **Feasibility & Fit** | Honest joint assessment: is this the right community, site, demand, governance and timing? Could end in a respectful "not yet". | Champions + Goods agree to scope feasibility (site, power, demand pull, who governs, plastic feedstock access). | A feasibility view exists (go / not-yet / needs-X) AND the community confirms it wants to proceed to building capability. |
| 4 | **Capability Building** | Training and skills transfer — local people learning collect → shred → melt → press → assemble. This is the heart of the pipeline. | Community has said go; a training/skilling plan is agreed (who learns what, who trains, where). | Core local crew trained to a working competency (`Training status` = Skilled, or at least Practising across the key steps) AND a funded plan to stand up the plant exists. |
| 5 | **Facility Stand-Up** | The physical plant is being installed/commissioned on country — equipment in, first components pressed. | Capex secured (linked funder/buyer opp) AND training crew ready. | Plant commissioned: it can produce bed components on country (`Plant/equipment status` = Commissioned) and a first batch is in progress. |
| 6 | **Operating (Goods-supported)** | The community is **making beds on country**, with Goods support (parts supply, QA, troubleshooting, demand routing). Capability proven, ownership not yet fully transferred. | First on-country batch produced (a `made-on-country` batch id exists). | Production is steady, local crew runs day-to-day, and an **ownership-transfer plan** (governance + assets + IP/know-how) is agreed and underway. |
| 7 | **Community-Owned** | **The destination.** The community owns and runs the plant. Goods has worked itself out of the lead role — support is on-request. | Ownership transfer milestones complete (governance vehicle holds the plant; local crew self-sufficient; Goods role = support-on-call). | *Terminal success.* (Opp stays here, marked won, as the standing record of a community-owned facility. New work = new linked opps in Demand/Buyer/Supporter, not re-opening this.) |
| — | **Paused** *(holding)* | Genuinely active relationship but on hold (seasonal, sorry business, funding gap, community priorities elsewhere). Not dead. | The community/Goods agree to pause; a reason + a "revisit when/what" is captured. | Conditions clear → return to the stage it paused from. |
| — | **Stood Down** *(holding)* | Respectfully not proceeding (now or for good). Closed without judgement — relationship and door stay open. | A clear, respectful decision not to continue. | *Terminal.* Re-engagement = a fresh opp at Community Interest, carrying the history. |

**Why these and not a sales shape:** the audit's other boards close on *money in* (Supporter "Stewarding", Buyer "Paid"). This board closes on *capability transferred + ownership taken*. Stages 1–3 are relationship/consent, 4 is skills, 5 is plant, 6 is proven-but-supported, 7 is owned. The two holding stages exist because on-country timelines are seasonal and community-led — "paused" must be a first-class state, not a failure.

**GHL note:** GHL has no native "won/holding" stage type beyond marking an opportunity `status: won/lost/abandoned`. Convention for this board:
- **Community-Owned** → set opp `status: won` (the success state).
- **Paused** → keep `status: open`, sit at the Paused stage.
- **Stood Down** → set opp `status: abandoned` (mirrors how Centre Canvas was handled), sit at Stood Down so the reason is visible.

---

## 4. Custom fields

GHL custom fields are **location-wide** (shared across all pipelines in `agzsSZWgovjwgpcoASWG`). To avoid colliding with Harvest/EL/org fields, **prefix every field key with `goods_prod_`** and group them under a **"Goods — On-Country Production"** custom-field folder/group in the UI.

Two homes for data:
- **Opportunity-level** fields = the *facility journey* (one per community-opp).
- **Contact-level** fields = the *person* (champions/trainees are linked contacts; their skills/training live on the contact, reused across comms segments).

### 4a. Opportunity custom fields (the facility)

| Field (UI label) | Key | Type | Options / notes |
|---|---|---|---|
| Community | `goods_prod_community` | Single-select | The 9 canonical communities only (see §7) + `Other (name in notes)`. Mirrors the asset register `community` value so this opp joins to `assets`. |
| Production stage detail | `goods_prod_stage_detail` | Multi-select | collect · shred · melt · press · assemble — which steps are live on country. Drives "how far along the make-chain". |
| Plant / equipment status | `goods_prod_plant_status` | Single-select | None → Specced → Funded → On-site → Commissioned → Operational → Community-owned. (The physical-asset spine, parallel to the people spine.) |
| Feedstock (HDPE) access | `goods_prod_feedstock` | Single-select | Unknown → Identified → Collection running → Steady supply. (No plant works without plastic in.) |
| Governance / ownership vehicle | `goods_prod_owner_vehicle` | Text | Who will/does own the plant (corporation, ranger group, community org). Free text — do NOT pre-fill. |
| Ownership-transfer milestones | `goods_prod_transfer_milestones` | Multi-select | Governance vehicle named · Assets to be transferred · IP / know-how documented · Local crew self-sufficient · Goods role = support-on-call · **Transfer complete**. (The "worked ourselves out of a job" checklist.) |
| Stand-up capex (ask) | `goods_prod_capex_ask` | Monetary | Estimated $ to stand up THIS plant. Also set the opp `monetaryValue` to this so it shows in pipeline value — **but** label it clearly: this is a *fundable capex ask*, not revenue (same caveat as the audit's GHL-$ warning). |
| Linked funder opp | `goods_prod_funder_opp` | Text | The Supporter-Journey opp id/name funding the stand-up (manual link until code wires it). |
| Linked buyer/offtake opp | `goods_prod_offtake_opp` | Text | A Buyer-Pipeline opp underwriting a first run, if any. |
| Beds made on country (batch ids) | `goods_prod_batches` | Text | Comma list of `made-on-country` batch ids (e.g. `GB0-156`) — the join to the **bed-lifecycle** (§6). |
| Beds made on country (count) | `goods_prod_beds_made` | Number | Running count produced on country. Feeds impact reports. |
| Last verified on country | `goods_prod_last_verified` | Date | When a human last confirmed status on the ground. Mirrors the bed-lifecycle `last_verified_at` discipline. |

### 4b. Contact custom fields (the people — champions & trainees)

Stored on the **contact**, so a person's skills/training travel with them and can drive comms segments.

| Field (UI label) | Key | Type | Options / notes |
|---|---|---|---|
| Production role | `goods_prod_role` | Single-select | Champion · Trainee · Trainer/mentor · Community lead · Governance. |
| Skills (make-chain) | `goods_prod_skills` | Multi-select | collect · shred · melt · press · assemble · QA · maintenance · plant operation. The capability map per person. |
| Training status | `goods_prod_training_status` | Single-select | Interested → In training → Practising → Skilled → Mentoring others. (Capability ladder for one person.) |
| Home community | `goods_prod_home_community` | Single-select | The 9 canonical communities (§7). Lets you build a per-community crew list. |

---

## 5. Tags — aligned to existing conventions

All new tags follow the established `goods-*` / `audience-*` / `project-goods` patterns in `smart-lists.ts` and `index.ts`. **Append-only; reuse before inventing.**

### 5a. Reuse (already in the system — do NOT create)
- `project-goods` — every contact in this pipeline (the universal Goods project tag).
- `goods-community-{name}` — the per-community tag already used by the asset/community work (e.g. the canonical-community slug). Apply the matching one.
- `goods-communitycontrolled` — the existing tag for the community-controlled/ownership thread (named in the approved design). Apply once an opp reaches **Operating** (capability proven) and definitively at **Community-Owned**.
- `audience-funder`, `grant` — only on the *linked funder* contact, in the Supporter Journey, never minted here.

### 5b. New tags (this pipeline)
| Tag | On | Means |
|---|---|---|
| `goods-production` | the community-facility opp's primary contact | This contact/opp is in the On-Country Production pipeline. The pipeline-membership tag (mirrors how segments key off a tag). |
| `goods-prod-champion` | a person | A **local champion** leading on the ground. (From the approved design.) |
| `goods-prod-trainee` | a person | A **local trainee** building capability. (From the approved design.) |
| `goods-prod-skilled` | a person | Reached `Training status = Skilled` — graduated capability. Powers a "trained on-country makers" list + impact story. |
| `goods-prod-owned` | opp contacts + champions | The facility reached **Community-Owned**. The proof-of-impact tag — drives the funder/supporter "a community now makes its own beds" story. |

**Comms wiring (definitions-only — GHL owns the send, per `smart-lists.ts`):** add **one** `AUDIENCE_SEGMENTS` entry later, e.g. id `community-makers`, source `{ kind: 'tag', tag: 'goods-prod-champion' }` (optionally OR `goods-prod-trainee`), `recommendedReportId: 'supply-partner'` or a future `community-production` report, `campaignNote`: "Relationship + capability cadence — celebrate milestones, share know-how. This is a small, deeply personal list; never blast." Champions are people you partner with, not a marketing list — keep caps tiny (softCap ~30).

---

## 6. Link to assets + the bed-lifecycle (the data joins)

This pipeline is where **people-capability** meets the **physical asset register**. Three joins:

1. **Community join.** `goods_prod_community` mirrors the `assets.community` value (real column is `assets.product` for type, `community` for place — per `goods-data-alignment`). So a facility opp can be joined to the beds in/for that community.

2. **Bed-lifecycle join (the headline).** The approved **bed-lifecycle dimension** adds to each bed asset:
   - `lifecycle_state`: `components-bought → made-on-country[batch-id] → ordered → deployed → in-service → retired/replaced`
   - `made_from_recycled` (bool) · `last_verified_at` (date)

   When a facility reaches **Operating**, the beds it presses are stamped `lifecycle_state = made-on-country` with the facility's batch id. The opp's `goods_prod_batches` + `goods_prod_beds_made` are the CRM-side mirror of those batch records. **This is what makes the "made on country, from recycled HDPE" claim auditable** — it ties a bed in the register to the community that made it.
   - Reconciliation triangle (from the design): **Xero** (`components-bought`) ↔ **batch records** (`made-on-country`, e.g. GB0-156) ↔ **register/QR** (`ordered`/`deployed`/`in-service`). The facility opp is the relationship-layer anchor of that triangle.

3. **Plant-as-asset join.** `goods_prod_plant_status` (None → … → Community-owned) tracks the *plant itself* as a transferable asset, parallel to the bed assets. "This plant can move to community ownership" (CLAUDE.md) becomes a tracked milestone (`goods_prod_transfer_milestones` → *Transfer complete*), not a slogan.

**Canonical-count guardrail:** beds made on country must flow through the existing canonical rollup (`getCanonicalAssetRollup()` / `CANONICAL_ASSETS` / `check-asset-drift.mjs`), not be counted separately in CRM. The opp's `goods_prod_beds_made` is a **convenience mirror for comms**, never a second source of truth. Plastic stays **Stretch-only, 20kg/bed** (Basket beds are not a plastic product) — do not let a facility opp re-introduce the retired all-beds plastic overclaim.

---

## 7. Communities (reference only — do NOT invent names)

Use the **canonical 9** as the `goods_prod_community` / `goods_prod_home_community` option set. From the asset register (deployed-bed communities): **Tennant Creek, Utopia, Palm Island, Kalgoorlie, Maningrida, Alice Springs, Mt Isa, Canberra, Darwin** — plus an `Other (name in notes)` escape hatch. *(Provenance: `getCanonicalAssetRollup()` deployed-by-community list, memory.)*

**Candidate first facilities** (from the approved design — Ben's call, not assigned here): **Oonchiumpa** (lead, via the REAL Innovation grant) → **Tennant Creek** community shed → **Palm Island** (via PICC + local leads). *Note:* Oonchiumpa is the working name in the design but is **not** in the canonical-9 deployed list — Ben to confirm its exact register name before it becomes a select option; until then it uses `Other`.

---

## 8. Build steps for Ben (Tier-2 propose → approve → build)

**This is a spec, not an execution.** Per workflow rules, GHL writes are **Tier 2** (shared-state, reversible) — Ben builds the **shell** in the GHL UI; **then** code/MCP fills opportunities. Stand the empty structure up first; nothing is seeded until the shell exists and Ben says go.

> ⚠️ The GHL MCP has **no create-pipeline / create-stage / create-custom-field / create-opportunity** tool (confirmed: the available `mcp__ghl__*` tools are read + tag/contact/opp-*update* only). So **pipeline, stages and custom fields MUST be created by hand in the UI.** Code can later only *update* existing opps and *upsert* contacts/tags. This matches the Supporter-Journey precedent ("Ben builds the 10-stage shell in UI first").

### Step 1 — Create the pipeline
1. GHL → **Opportunities → Pipelines → Create Pipeline**.
2. Name: **`Goods — On-Country Production`**.

### Step 2 — Add the 9 stages (in order)
Add stages top-to-bottom exactly:
1. Community Interest
2. Local Champions
3. Feasibility & Fit
4. Capability Building
5. Facility Stand-Up
6. Operating (Goods-supported)
7. Community-Owned
8. Paused
9. Stood Down

(Leave GHL "stage probability/%" defaults — this isn't a revenue-weighted board. If GHL forces a value, set Community-Owned = 100%, holding stages = 0%, others ascending — but it carries no meaning here.)

### Step 3 — Create custom fields
Create a custom-field **group** named **"Goods — On-Country Production"**, then add every field in **§4a (opportunity)** and **§4b (contact)** with the exact keys (`goods_prod_*`) and types. Set the select options exactly as listed (especially the 9 communities, the make-chain steps, and the transfer milestones).

### Step 4 — Tell Ben to confirm, then hand back to code
Once the shell exists, Ben confirms:
- pipeline name + 9 stage names match, and
- he posts the **GHL stage IDs** (GHL assigns a UUID per stage — copy them from the pipeline settings/API).

**Then** (separate, post-approval task — NOT in this spec):
1. Add a `production` entry to `GOODS_PIPELINES` in `v2/src/lib/data/loi-pipeline.ts` with the new pipeline id + stream `'production'`, and map the 9 stage IDs (note: the LOI `STAGE_TO_RUNG` model assumes a money ladder — this pipeline's "rung" semantics differ, so either add a separate `PRODUCTION_STAGES` map or extend the type; do **not** force capability stages onto target/signed/contract/cash).
2. Optionally surface it in `/admin/loi-tracker` as a *capability* view (count by stage), clearly **not** summed into the funder/buyer $ rollup.
3. Add the `community-makers` segment to `AUDIENCE_SEGMENTS` (definitions only).
4. Seed initial opps via MCP `opportunities/*update*` + `contacts/upsert-contact` (champions/trainees as linked contacts with `goods-prod-*` tags) — **one community at a time, Ben-approved each**.

---

## 9. What this is NOT (guardrails)

- **Not a sales funnel.** No "win" = revenue. "Win" = a community owns its plant. Keep `monetaryValue` labelled as a *capex ask*, never revenue; never roll it into the QBE match or board $ (same rule as the audit's GHL-$ caveat — Xero is the money source of truth).
- **Not a duplicate.** It builds on the approved 7-stage Community Production design; it does not create a parallel one. If the older design notes and this doc ever diverge, **this doc is the build-ready version**.
- **Not the supplier list.** Suppliers stay a CRM *list* (`goods-supplier`), detail in `supplier-quotes.ts`. A plastic-plant *builder* is a supplier; the *community standing up the plant* is an opp here.
- **Not seeded by this task.** Design only. Shell-build is Ben's UI action; opp-seeding is a later, separately-approved code step.
- **Not centring Goods.** Every stage label and milestone is framed around community agency and the hand-off of ownership. If a future edit makes Goods the hero, it's wrong.

---

## 10. Provenance

- **Prior design (the spine this builds on):** memory `[[goods-data-alignment]]` ("Community Production pipeline … 7 stages … `goods-prod-champion`/`goods-prod-trainee` … `goods-communitycontrolled` … bed-lifecycle dimension"); `thoughts/shared/handoffs/network-consolidation/current.md` #31/#45.
- **Existing pipeline structure:** `wiki/outputs/2026-05-30-buildslice/01-ghl-pipeline-audit.md` (live pull 2026-05-30, location `agzsSZWgovjwgpcoASWG`).
- **Code patterns (read this session):** `v2/src/lib/data/loi-pipeline.ts` (`LoiRung`, `GOODS_PIPELINES`, `STAGE_TO_RUNG`, stage-id UUIDs); `v2/src/lib/ghl/smart-lists.ts` (`AUDIENCE_SEGMENTS`, SegmentSource, "GHL owns the send"); `v2/src/lib/ghl/index.ts` (`tagForAsset`, `GoodsOpportunity` shape, strategic-pipeline env config).
- **Product / manufacturing truth + canonical communities/assets:** `CLAUDE.md` (the on-country plant; "this plant can move to community ownership"); `getCanonicalAssetRollup()` (9 communities, 496 beds, Stretch-only plastic).
- **MCP capability check:** available `mcp__ghl__*` tools are read + tag/contact/opp-update only — **no create-pipeline/stage/field/opportunity** tool exists → shell must be built by hand. (Tool list, this session.)
- **DESIGN ONLY:** zero GHL writes performed; no GHL write tool called.

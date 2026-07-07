# GHL Pipeline Audit — Full CRM Picture

**Date:** 2026-05-30
**Author:** Claude (read-only audit — NOTHING written to GHL)
**Source:** GHL location `agzsSZWgovjwgpcoASWG` ("A Curious Tractor" sub-account), pulled LIVE via the GHL MCP `opportunities/get-pipelines` + `opportunities/search` on 2026-05-30.
**Scope:** All 10 pipelines in the location enumerated (id, name, every stage). Opp counts + stage distribution + GHL $ value summarised per pipeline.
**Cross-referenced:** `v2/src/lib/ghl/index.ts` (strategic-pipeline config) + `wiki/outputs/2026-05-30-ghl-sweep-recon-and-write-plan.md` (the prior same-day recon). Numbers below were re-pulled live for this audit and reconcile with that recon (deltas noted inline).

> **⚠️ MONEY CAVEAT — read before quoting any dollar figure.**
> Every `$` in this document is **GHL-reported, unverified — Xero is the source of truth.** GHL `monetaryValue` is a sales-pipeline forecast field, not confirmed cash. It includes aspirational, first-stage, and unqualified numbers. Do NOT use these figures for the QBE match, board reporting, or financials without reconciling against Xero. The verified-paid grant total (Xero) is ≈ **$588,262**; the GHL Supporter-Journey "cash tier" reads **$846,177** — a **$257,915 unreconciled gap** (detailed in the Supporter Journey section).

---

## 1. Summary — one row per pipeline

| # | Pipeline | ID | Stages | Opps (live) | GHL $ (unverified) | Goods? | State |
|---|---|---|---|---|---|---|---|
| 1 | Goods — Demand Register | `UQsrmuqzxMSdCTklxEcG` | 4 | 105 | ~$5.96M (signal sticker) | ✅ core | 🟡 Bulk civicgraph demand, $0 committed |
| 2 | Goods — Buyer Pipeline | `FjMyJM3YzWQFmKqR9fur` | 12 | 10 | $1,835,571 | ✅ core | 🟢 Real commercial pipeline (1 supplier already abandoned) |
| 3 | Goods Supporter Journey | `JvBFYpVpyKsw899lkFgj` | 10 | 43 | $5,178,111 | ✅ core | 🟢 The live funder ladder (Committed rung = $0) |
| 4 | Grants (legacy) | `scom3L0kNwA1W0zPIzMe` | 7 | 435 | ~$142.8M (page-1 extrap.) | ❌ none | 🔴 Grantscope multi-project prospect dump — NOT Goods grants |
| 5 | A Curious Tractor (org) | `BvrCPnOcpPxIgpgrMbFF` | 6 | 14 (all won) | $899,555 | 🟡 ~4 overlap | 🟡 Historical org wins; 4 Goods deals DOUBLE-COUNT Supporter Journey |
| 6 | The Shop pipeline | `Pdtr1ZIOvg3LrMSeNvHe` | 6 | 32 | $0 | ❌ none | ⚪ Harvest/Maleny makers — different project |
| 7 | Universal Inquiry | `ggQw10DuH0XRji6keimS` | 4 | 3 | $0 | 🟡 2 Goods | 🟡 1–2 unrouted Goods inquiries + 1 likely-spam |
| 8 | Harvest Inbox | `5ZqAuFokM4LsNqMCMPmY` | 4 | 10 | $0 | ❌ none | ⚪ Harvest member comments (`project:act-hv/gl`) |
| 9 | Supporters & Donors | `QiK57emft8v05hxylmwA` | 4 | 0 | $0 | ❌ none | ⚪ Empty board |
| 10 | Empathy Ledger | `aRGmSaMh62wPO2R0Bt4g` | 7 | (not swept) | — | ❌ none | ⚪ Separate EL project — out of audit scope |

**The 3 canonical Goods pipelines** (matched in `v2/src/lib/ghl/loi-pipeline.ts` / `/admin/loi-tracker`): Demand Register, Buyer Pipeline, Supporter Journey. Everything else is shared-tenant ACT/Harvest/EL or legacy noise. This sub-account is shared across the whole ACT portfolio (`project:act-*` tags), so most boards are not Goods.

**Live data note:** GHL's search API always returns a `nextPageUrl` even on the final page; pipeline totals above use the `meta.total` field, which is authoritative. Boards >100 opps (Demand Register 105, Grants 435) were sampled at page 1 (100 rows) for stage spread; `meta.total` gives the true count.

---

## 2. Per-pipeline detail

### 1. Goods — Demand Register `UQsrmuqzxMSdCTklxEcG`
- **Purpose:** Capture raw *demand signals* — communities/orgs that have expressed (or been identified as having) a need for beds, before a specific buyer/funder is matched. Feeds the Buyer Pipeline.
- **Audience / business area:** Demand generation / community need. The "top of funnel" for the commercial + impact engine.
- **Opps:** 105 (`meta.total`). Page-1 sample (100): **77 Signal / 23 Buyer Matched**, 0 Converted, 0 Dormant. All `status: open`.
- **GHL $ (unverified):** Page-1 sample sums to **~$5.96M** (Signal ~$5.60M, Buyer-Matched ~$0.37M). This is aspirational "sticker" demand value across bulk civicgraph-imported prospects, **not** committed or even quoted revenue. The prior recon described these as "$0 committed" — correct in the sense that nothing is contracted; the monetaryValue field nonetheless carries large forecast numbers that should be treated as noise.
- **Stages (4):** Signal → Buyer Matched → Converted → Dormant.
- **Hygiene:** Bulk-imported (civicgraph) — high volume, low qualification. The $ field is misleading here; consider zeroing or ignoring monetaryValue on Signal-stage demand records so it can't leak into any forecast roll-up.

### 2. Goods — Buyer Pipeline `FjMyJM3YzWQFmKqR9fur`
- **Purpose:** The real **commercial sales** pipeline — orgs buying beds (health services, land councils, stations, corporates).
- **Audience / business area:** Commercial revenue / buyers. Maps to the `loi-pipeline.ts` Buyer stage map and the `/admin/loi-tracker` "buyer" rollup.
- **Opps:** 10 (`meta.total`), all captured live.
- **GHL $ (unverified):** **$1,835,571** = WHSAC $1,700,000 + Northern Land Council/GAPUWIYAK $70,771 + ALIVE $60,000 + Anyinginyi Health $4,800. (Six others at $0.)
- **Stage breakdown:** Outreach Queued 4 (incl. WHSAC, NLC, NPY, + abandoned Centre Canvas) · In Conversation 4 (Hewitt, Centrebuild, Anyinginyi, Miwatj) · Qualified 1 (ALIVE) · Centre Canvas = abandoned.
- **Notable opps:**
  - **WHSAC (Groote Archipelago) — $1,700,000 @ Outreach Queued.** A $1.7M number sitting at the very first stage = forecast anomaly / aspirational. This single opp is 93% of the board's $.
  - **ALIVE — $60,000 @ Qualified.** Looks like a real near-term deal.
  - **Centrebuild Pty Ltd — $0 @ In Conversation.** Contact = Randle Walker **@ Centrecorp** (`goods-hot`, `audience-funder`, `grant`). Centrecorp is "in discussion / declined 3 quotes" per memory — likely stale.
  - **Centre Canvas — `status: abandoned`** (opp `UozRRvtkcc8XvKuKevMP`). This is the known **supplier-misfiled-in-Buyer** item. It has been **set to abandoned (2026-05-29)** but NOT removed; the contact still carries `goods-supplier` / `supplier-canvas` / `goods-supplier-active` tags. It is already filtered out of the LOI ladder. (Suppliers are a CRM *list*, not a pipeline — per Ben's 2026-05-30 decision.)
- **Hygiene:** (a) reset/confirm WHSAC's $1.7M; (b) Centrebuild/Centrecorp opp looks stale; (c) Centre Canvas supplier record lingers (abandoned but present).

### 3. Goods Supporter Journey `JvBFYpVpyKsw899lkFgj`
- **Purpose:** The **funder / philanthropic** relationship ladder — every grant-maker and capital source, from identification through stewarding/renewing. This is the live source for the QBE-match LOI tracker.
- **Audience / business area:** Capital raising / funders / grants. Maps to `loi-pipeline.ts` `STAGE_TO_RUNG` and the `/admin/loi-tracker` funder rollup. **Grants belong here** (tagged), which is why the legacy "Grants" board is redundant (see #4).
- **Opps:** 43 (`meta.total`), all `status: open`, all captured live.
- **GHL $ (unverified):** **$5,178,111** total across all stages.
- **Stage breakdown (count / $):**

  | Stage | Opps | GHL $ |
  |---|---|---|
  | Identified | 16 | $0 |
  | Qualified | 3 | $200,000 |
  | Cultivating | 8 | $5,434 |
  | Ask made | 5 | $4,082,500 |
  | **Committed** | **0** | **$0** |
  | Delivering | 1 | $44,000 |
  | Stewarding / Reporting | 8 | $806,112 |
  | Renewing | 2 | $40,065 |
  | Lapsed | 0 | $0 |
  | Declined / Parked | 0 | $0 |

- **Biggest opps:** QBE Foundation $2,000,000 (Ask made) · REAL Innovation Fund/DEWR $2,000,000 (Ask made) · Snow Foundation $402,930 (Stewarding) · Minderoo $200,000 (Qualified) · The Funding Network $130,000 (Stewarding) · Centrecorp $123,332 (Stewarding) · Rotary Eclub $82,500 (Ask made) · FRRR $50,000 (Stewarding) · VFFF $50,000 (Stewarding).
- **THE LOAD-BEARING FINDINGS:**
  1. **Committed stage = $0 / 0 opps.** The signed-LOI rung is empty. This is the QBE-match story: lots of cultivation + asks, nothing yet in a signed/committed state.
  2. **Cash tier (Stewarding $806,112 + Renewing $40,065 = $846,177) vs Xero verified-paid ≈ $588,262 → ~$257,915 unreconciled.** The delta = The Funding Network $130K + FRRR $50K + AMP $21,900 + Our Community Shed $20,265 + Julalikari $19,800 + Red Dust $15,950, all parked at "Stewarding" in GHL but not in the Xero verified-paid set. **None should count toward the QBE match until confirmed in Xero + a signed doc exists.**
  3. **Ask-made tier ≈ $4.08M** is dominated by two $2M asks (QBE, REAL/DEWR) — large, early, unconfirmed.
- **Hygiene:** Grant-type opps here (FRRR, VFFF, QIC, AMP, Snow…) do not all carry a `grant` tag — the routing rule wants it. Minor, append-only fix.

### 4. Grants (legacy) `scom3L0kNwA1W0zPIzMe`
- **Purpose (as built):** Was intended as a grants pipeline. **In reality it is a Grantscope prospecting dump.**
- **Audience / business area:** None that is Goods-specific. This is a portfolio-wide grant *universe*, not grants Goods pursued.
- **Opps:** **435** (`meta.total`). Page-1 sample (100): all 100 at "Grant Opportunity Identified".
- **GHL $ (unverified):** Page-1 sample alone sums to **~$142.8M** (i.e. the surfaced grant universe — ARC research projects, large housing-office tenders, arts grants). Extrapolated across 435 this is a meaningless aggregate; do not quote it.
- **Stages (7):** Grant Opp Identified → Application In Progress → Grant Submitted → Grant Awarded → Reporting Due → Report Submitted → Grant Declined.
- **Evidence it is NOT Goods:** Every sampled opp's contact is an `@act.place` address and carries **all** ACT project markers simultaneously (`project:watch` + `act-hv` + `act-ra` + `act-oo` + `act-jh` + `act-gd` + `act-core` + `act-cn`, ~98 of 100 each) — the Grantscope multi-project bulk signature. 0 of the 100 sampled are real Goods-specific grants.
- **Hygiene / decision REVERSAL:** Prior assumption was "Grants (legacy) = merge target into Supporter Journey." **That is wrong** — there is nothing here to migrate; the real Goods grants already live in Supporter Journey. Treat this board as a Grantscope artefact, not a Goods source. (Bulk archival of 435 records is Tier 3 — explicit go only, and probably not worth it.)

### 5. A Curious Tractor (org) `BvrCPnOcpPxIgpgrMbFF`
- **Purpose:** The original org-level pipeline holding historical **won** deals across the whole ACT portfolio (Goods, BG Fit, PICC storytelling, Harvest, etc.).
- **Audience / business area:** Portfolio-wide historical wins. Org-level, not Goods-specific.
- **Opps:** 14, **all `status: won`**.
- **GHL $ (unverified):** **$899,555** total won.
- **Stages (6):** Germination → Growth → Harvest → Composting → Graduation → Not Yet (most won deals sit at Graduation/Composting).
- **⚠️ DOUBLE-COUNT WATCH (the key finding):** Four Goods deals here overlap Supporter Journey — **Fairfax Goods Grant $50,000 (VFFF)**, **First Greate Bed $37,620 (Centrecorp)**, **Central Australian Pilot $53,900 (Centrecorp)**, **Weave Beds Utopia $85,712 (Centrecorp)**. Anyone summing this board AND Supporter Journey double-counts these. (The LOI tracker reads only Supporter Journey, so the *tool* is safe — the risk is manual reporting.)
- **Other (non-bed-revenue) Goods-tagged items:** Five PICC-contact deals — On Country Photo Studio $68,200, Flood Stories $50,000, Elders Trip Story $50,600, Automated Annual Report $81,400, Station Revive $165,000 — are tagged `goods` but are ACT storytelling/EL/automation work for PICC (`project:act-hv`/`act-ca`, `auto-created-from-xero`), not Stretch/Basket bed sales. Don't fold these into Goods bed revenue. Contained Rental/Mounty Yarns $15,000 (Dusseldorp), BG Fit/Qld Gives $28,000, and MELT $7,150 are other-project wins.
- **Hygiene:** Leave as a historical record; just **flag the overlap** in any funding reconciliation. No write needed.

### 6. The Shop pipeline `Pdtr1ZIOvg3LrMSeNvHe`
- **Purpose:** A retail/maker shelf pipeline for the **Harvest** project (Maleny / Sunshine Coast hinterland makers and producers).
- **Audience / business area:** Harvest, NOT Goods.
- **Opps:** 32, all `status: open`, all **$0**, **0 goods-tagged**.
- **Stages (6):** New interest → In conversation → Sampling/trial shelf → On the shelf → Not now → Parked.
- **Contents:** Maleny Dairies, Maleny Cheese, Hinterland Bees, Red Mud Coffee Roasters, local artists/jewellers, etc. (Recon doc said 4 opps; it's now 32 — the board has grown but remains entirely non-Goods.)
- **Hygiene:** None for Goods. Out of Goods scope.

### 7. Universal Inquiry `ggQw10DuH0XRji6keimS`
- **Purpose:** Catch-all router for inbound website inquiries before they're routed to the right project.
- **Audience / business area:** Cross-project intake; some Goods.
- **Opps:** 3 (recon doc said 2 — one new arrived 2026-05-30).
  - **Laura McConnell Conti** (`laura@gokindly.com.au`) — Goods inquiry (`goods-inquiry`, `project-goods`), stuck at "Needs Assessment". Unrouted.
  - **"HqCGSyKsWTixCpflQZMz"** (`javi_tess92@outlook.com`, +619673472124) — new 2026-05-30, tagged `goods-inquiry`/`project-goods` but the name is a random string = **likely spam/bot** through the General Inquiry form. Triage/likely delete.
  - **Bek** (`rebekahsdaw@gmail.com`) — `harvest-website`/`harvest-newsletter` = Harvest, not Goods.
- **GHL $:** $0 across all.
- **Stages (4):** New Inquiry → Needs Assessment → Routed to Project → Out of Scope.
- **Hygiene:** Route Laura into Buyer or Supporter Journey (or action/close); triage the random-name spam-looking inquiry.

### 8. Harvest Inbox `5ZqAuFokM4LsNqMCMPmY`
- **Purpose:** Harvest project member-comment / signup inbox.
- **Audience / business area:** Harvest, NOT Goods.
- **Opps:** 10, all `status: open`, all **$0**, all sitting at "Resolved" stage. Contacts tagged `harvest-member` / `harvest-inbox` / `project:act-hv` / `project:act-gl`.
- **Stages (4):** New → In progress → Waiting on them → Resolved.
- **Hygiene:** None for Goods. Out of scope.

### 9. Supporters & Donors `QiK57emft8v05hxylmwA`
- **Purpose (as built):** Donor-progression pipeline (First Donation → Second → Legacy $5000+ → Lapsed).
- **Opps:** **0** (`meta.total: 0`). Empty board.
- **Hygiene:** Unused. Either populate (if individual-giving is a real channel) or retire to reduce board clutter. No Goods data at risk.

### 10. Empathy Ledger `aRGmSaMh62wPO2R0Bt4g`
- **Purpose:** EL storyteller/partner pipeline (Identified → Outreach Sent → In Conversation → Confirmed Partner → Planning → Active → Not Yet).
- **Audience / business area:** Empathy Ledger — a separate ACT product, not Goods.
- **Opps:** Not swept (explicitly out of audit scope — separate project).
- **Hygiene:** N/A for Goods.

---

## 3. Hygiene / write-proposals (Tier 2 — PROPOSE ONLY, nothing executed)

All items below are GHL writes = **Tier 2** (shared-state, reversible). Per workflow rules they require Ben's explicit "proceed" — one confirmation each. This audit executed **zero** writes. Listed in priority order.

| # | Proposal | Pipeline | Action | Tier | Why |
|---|---|---|---|---|---|
| H1 | **Confirm Centre Canvas handling** | Buyer | It's already `abandoned`; decide whether to also strip the `goods-supplier`-on-an-opp situation by leaving it abandoned (recommended) or deleting the opp. Keep the *contact* + supplier tags. | 2 | Supplier misfiled as a buyer opp; already neutralised, just confirm the end state. |
| H2 | **Reset / confirm WHSAC $1,700,000** | Buyer | Either qualify + stage-up if real, or reset the value. It's 93% of the Buyer board's $ at the first stage. | 2 | Forecast anomaly — distorts any pipeline-value read. |
| H3 | **Review Centrebuild/Centrecorp opp** | Buyer | Centrecorp declined 3 quotes ("in discussion"). Move to a realistic stage or mark parked. | 2 | Stale-looking opp. |
| H4 | **Route Laura McConnell Conti** | Universal Inquiry | Route into Buyer or Supporter Journey, or action/close. | 2 | Unrouted Goods inquiry. |
| H5 | **Triage spam-looking inquiry** | Universal Inquiry | `javi_tess92@outlook.com` / random-name opp from 2026-05-30 — verify or delete. | 2 | Likely bot submission. |
| H6 | **Add `grant` tag to grant-type Supporter Journey opps** | Supporter Journey | Append-only tag-add on FRRR/VFFF/QIC/AMP/Snow… to honour the routing rule. | 2 | Tag hygiene; append-only = safe. |
| H7 | **Update decision record: Grants (legacy) is NOT a merge target** | Grants (legacy) | Doc/memory edit (Tier 1 — can do now): "Grants (legacy) = Grantscope prospect dump, do NOT migrate to Supporter Journey." | 1 | Reverses prior assumption; the real Goods grants are already in Supporter Journey. |
| H8 | **(Optional) Retire empty Supporters & Donors board** | Supporters & Donors | 0 opps — retire or commit to populating it. | 2 | Board clutter only. |
| H9 | **(Optional, Tier 3) Archive irrelevant Grants prospects** | Grants (legacy) | 435 Grantscope records are noise. Bulk status change = **Tier 3, explicit go only**; likely not worth it. Leave as-is recommended. | 3 | Low value, irreversible-ish at volume. |

**Reporting-hygiene (no write):** flag the **A Curious Tractor org-pipeline double-count** (Fairfax/VFFF $50K, First Greate Bed $37,620, Central Australian Pilot $53,900, Weave Beds Utopia $85,712 also exist in Supporter Journey) anywhere funder $ is manually summed. And keep the **$846,177 GHL-cash vs $588,262 Xero-verified gap** visible — it already shows in `/admin/loi-tracker`.

---

## 4. Provenance

- **Pipelines + stages:** GHL MCP `opportunities/get-pipelines`, location `agzsSZWgovjwgpcoASWG`, 2026-05-30. All 10 enumerated with full stage lists.
- **Opp counts / stage distribution / $ sums:** GHL MCP `opportunities/search` per pipeline_id, `status=all`, `limit=100`, 2026-05-30. Totals use `meta.total`. Boards >100 (Demand Register 105, Grants 435) sampled at page 1 for stage spread.
- **Code cross-ref:** `v2/src/lib/ghl/index.ts` (strategic-pipeline env-config: BUYER/CAPITAL/PARTNER target types). The 3 Goods pipeline IDs + stage→rung maps live in `v2/src/lib/ghl/loi-pipeline.ts` (per project memory + `/admin/loi-tracker`); that exact file path was not present in the working tree at audit time, but the three IDs are confirmed live from `get-pipelines` and match the recon doc.
- **Prior recon (same day):** `wiki/outputs/2026-05-30-ghl-sweep-recon-and-write-plan.md`. This audit re-pulled live and reconciles with it; deltas noted (Shop 4→32, Universal Inquiry 2→3, Centre Canvas now abandoned, Grants 435 confirmed).
- **DOLLAR CAVEAT (repeat):** all `$` = GHL-reported, unverified. **Xero is the source of truth.**

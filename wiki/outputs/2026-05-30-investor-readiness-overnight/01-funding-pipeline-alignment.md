# Funding & Pipeline Alignment

**Date:** 2026-05-30 · **For:** Founder review · **Companion to:** `00-MASTER-investor-readiness-view.md`
**One rule above all:** *Pipeline is never capital. QBE is an output, not an input. Money lives only in Xero.*

This is the detailed alignment behind the master briefing: the GHL consolidation, the Grantscope division of labour, the funding-source map, and the canonical-numbers discipline — so every surface (CRM, Grantscope, v2, Notion, public pages) tells the same story.

---

## 1. GHL pipelines — KEEP / MERGE / RENAME / RETIRE

**Today:** 10 live pipelines in one location (`agzsSZWgovjwgpcoASWG`), of which **9 touch Goods**. A canonical 3-pipeline spine was already decided on 2026-05-27 (`wiki/outputs/2026-05-27-goods-crm-pipeline-operating-model.md`); the other boards have drifted back into the exact grant-vs-commercial confusion that model was built to kill.

**Target: 4 working Goods pipelines.**

| Pipeline (live census 2026-05-27) | Action | Reason | What to do |
|---|---|---|---|
| **Universal Inquiry** (4) | **KEEP** | The single ACT front door — trigger `act-inquiry`, route out by `project-goods` | Add the 4 stage defs + SLA + route automations per the tag-scheme doc |
| **Goods – Demand Register** (86, all placeholders) | **KEEP** | Top-of-funnel unworked signal; $0 until qualified | One-way graduation into Buyer (**move, never copy** — copying forks counts) |
| **Goods – Buyer Pipeline** (1, NLC Gapuwiyak) | **KEEP — trim 12→~6 stages** | The **only** commercial-revenue board; 12 stages is phantom precision at 1 live deal | Collapse to Outreach → Qualified → Proposed → Committed → Delivered → Paid |
| **Goods – Supporter Journey** (13 funders, ~$978K open) | **KEEP — trim 10→~7, becomes the single philanthropy home** | One relationship home for all philanthropy | Collapse to Identified → Cultivating → Ask → Committed → Delivering → Stewarding/Reporting → Renewing; Lapsed/Declined become **lost reasons**, not stages |
| **Grants** (413) | **MERGE → Supporter Journey** | A grant is a funder relationship at an application stage | Track relationship in Supporter Journey; application status = a stage/custom field. Indigenous-focused = a **segment tag** (`goods-segment-indigenous-grant`), never a separate pipeline. *If ACT-wide grant ops genuinely need application-tracking, keep ONE org-level Grants board and filter the Goods slice by `project-goods` — do not run a Goods-specific grants pipeline.* |
| **Supporters & Donors** (0) | **MERGE → Supporter Journey** | 0 records, legacy, explicitly superseded | No migration needed. First/Second/Legacy-donor are warmth states (tags + Stewarding/Renewing stages) |
| **Harvest Inbox** (10) | **MERGE → Universal Inquiry** | A second triage board fragments intake + SLA | Route Harvest items out by `project-harvest`; split member-signups to a Harvest membership list |
| **A Curious Tractor** master (14) | **RETIRE from Goods view** | Portfolio/org altitude (Germination→Graduation), not a Goods funding pipeline; double-tracks relationships | Keep at ACT-portfolio level only; out of scope for the Goods spine |
| **The Shop** (0) | **PARK** | Retail-stockist consignment is real but not-yet-live | Revisit as a Buyer Pipeline *channel* when it activates, not a parallel board |
| **Empathy Ledger** (1 test) | **RETIRE** | Test noise; EL partner cultivation is a different project | Keep EL out of the Goods funding picture entirely |

**Capital is NOT an 11th board.** Track the QBE-match + SEFA/QBE-Ventures conversations as a `goods-capital`-tagged set (or a single "Capital raise" stage) inside Supporter Journey — the relationship stays visible without inventing a pipeline.

**Net:** 4 working Goods pipelines (Universal Inquiry + Demand + Buyer + Supporter Journey) instead of 9.

**Tagging unchanged:** trigger on action tags (`act-inquiry` + `project-goods`); filter on segment/warmth tags (`goods-funder`, `goods-state-nt`, `goods-communitycontrolled`, `goods-hot/warm`).

**Execution discipline:** the GHL MCP has **no create-opportunity tool** — use `act-global-infrastructure/scripts/lib/ghl-api-service.mjs` (`createGHLService`) and the existing seed/cleanup scripts (`seed-goods-supporter-journey.mjs`, `cleanup-goods-buyer-pipeline.mjs`). **Write a restore snapshot before any destructive op.** Ratify the 4-pipeline target with the founder before any GHL write, then update the 2026-05-27 canonical doc to match.

---

## 2. Grantscope — division of labour + the drift to fix

**Architecture fact that explains everything:** Grantscope reads its **own** Supabase (`tednluwflfhxyucgwigh` — the ACT-infra DB with Xero + GHL-mirror tables), **not** v2's `cwsyhpiuepvdjtxaozwf`. It cannot reach v2's `assets` table, so it carries delivered-bed counts as a hand-cited cross-DB constant — structurally guaranteed to rot.

### One-line division of labour
- **Grantscope = the funding-discovery + readiness brain.** "Who could fund this, and are we ready?" Reads Xero/GHL/demand; never a second source of truth.
- **GHL = system of record for relationships + pipeline stages.** "Where is each relationship?"
- **v2 admin = system of record for physical assets + cost model v6 + public site/Stripe.** "What physical/financial truth do we have?"
- **Notion = system of record for the human QBE narrative.** "What's the story we tell QBE?" — pulls numbers from the other three.

### KEEP / MERGE / RESCOPE / RETIRE (by service)
| Surface | Action | Why |
|---|---|---|
| `goods-signals-workbench.ts` (+ Indigenous-finance capital pipeline: IBA/NAIF/Many Rivers) | **KEEP — own it** | The one thing nothing else does: matches community demand → grants + foundations + loans. *This is Grantscope's reason to exist in the Goods stack.* |
| `goods-readiness-snapshot.ts` (read-only QBE/SEFA scorer + governance promotion-gate) | **KEEP** | Complements Notion's narrative. **Feed it canonical numbers + the $400K-match-contingency gate** (currently un-encoded). |
| `goods-funnel.ts` (5-stage cross-system view) | **KEEP — read-only** | *Provided* it reads GHL live AND **imports** v2 delivered counts rather than freezing `DELIVERED={beds:520,washers:41}` |
| `goods-finance-ledger.ts` (Xero ACT-GD ACCREC) | **MERGE — label as a mirror** | Same source as v2 `xero-reconciliation` + canonical Area-04. Don't maintain a parallel finance truth |
| Two GHL read paths (funnel hits API live; snapshot reads `ghl_opportunities` mirror) | **MERGE → one path** | So pipeline value is quoted once; always labelled "pipeline, NOT committed capital" |
| `goods_asset_lifecycle` + `community/[id]/deploy` route | **RESCOPE → planning/forecast** (or wire the write into v2) | v2 owns the canonical bed register; minting rows here forks the count across two DBs |
| `goods-buyer-ghl.ts` buyer-push | **KEEP — the sole legitimate write** | Turning a discovered buyer into a GHL contact+opportunity. Must remain the **only** Grantscope→GHL write |
| `goods-operating-system.ts` static fact + money blocks (389 assets / $445,685 / $537,595 / $2.4M asks / $400 cost) + `goods-cost-evidence.ts` single "$600/bed" | **RETIRE / REFRESH** | The worst drift in the repo — restated, not imported, and stale vs canonical + v6. Repoint to live services or delete |

**Three Grantscope fixes that double as compliance fixes:**
1. Kill the single "$600/$550–$650/$400" cost-per-bed → import v6 multi-number framing (this is also a CLAUDE.md-rule fix).
2. Refresh/retire the `goods-operating-system.ts` static facts → canonical (~633 assets / 496 deployed; ACCREC $649,710.79 paid / $732,210.79 billed; pipeline labelled internal).
3. Reframe Centrecorp everywhere to **$123,332 paid** (drop $208K/$420K); add the QBE-match-contingency gate to the readiness snapshot so the cockpit can't imply QBE money is unconditional.

---

## 3. Funding sources — the 3-stream map (with foundations + Indigenous grants explicit)

> The 12-instrument capital-stack-v0.1 list is internally useful but reads as "number soup" to investors. **Collapse to 3 streams** for the investor-facing view.

### Stream 1 — Commercial revenue
Institutional Stretch Bed sales @ **AU$750/bed** into **A Curious Tractor Pty Ltd (t/a Goods on Country)**, plus the live Stripe shop.
- **Verified proof:** AU$649,710.79 paid receivables (Xero mirror, workpaper); 496 deployed bed units across 10 communities; $898,863 CRM won (workpaper).
- **Honest caveat for investors:** *emerging, not established* — most paid invoices are still `income_type=grant`, and real ecommerce is ~AU$90. Margin is path-dependent vs $750 (factory marginal $425.74 → contribution ~$324; buy-kit $684.79 → thin).
- **Rename:** Rotary moves here as an **AR receivable — $82,500 invoiced, NOT received** (it *is* the $82,500 "due" line).

### Stream 2 — Philanthropy / grants via the Butterfly DGR pathway
The mission-lock stream. **DGR is FUTURE** — tax-deductibility comes only via **The Butterfly Movement Ltd from FY2026-27**, never Goods/ACT directly. *Goods cannot promise donor deductibility today.*

**2a — Foundations**
- **Snow Foundation** — AU$402,929.79 verified-paid. Largest anchor, repeat R4/R5 relationship, credibility + letter-of-support feeds the QBE narrative. **KEEP.**
- **VFFF** — AU$50,000 R1 verified.
- **Minderoo** — AU$1.5M *target* (warm; right-size the first ask). No confirmed opportunity yet.
- **QIC** — AU$12,000 historic grant.
- **Butterfly DGR vehicle** — the only route to deductible giving; $200K Yr-1 target, FY2026-27 (future).

**2b — Indigenous-focused grants & trusts**
- **Centrecorp Foundation** — AU$123,332 verified-paid, NT Aboriginal Trust, **buyer + funder**. **Rename** from "commercial buyer at scale" → "Stream 2b Indigenous-trust funder + buyer". *Income_type=grant on paid invoices; the $208K/$420K is stale (10 invoices voided) and must not be re-counted.*
- **First Nations Clean Energy Advice grant** — AU$40–60K target.
- **Oonchiumpa / REAL consortium** — $1.2M consortium target (Indigenous-led).
- **IBA** — up to $5M Yr2–3 (also a Stream-3 senior-debt line).

**Track-record note:** fold the small historic grants — Our Community Shed ($20,265), Julalikari ($19,800), Red Dust ($15,950), QIC ($12K) — into a single "smaller historic grants" line. Each is too small to be a 2026 line; together they evidence funder breadth.

### Stream 3 — Capital / investment (patient, non-equity only)
- **QBE Catalysing Impact match** — up to AU$400K, 1:1, **CONTINGENT OUTPUT**: 0% until ≈AU$400K eligible non-QBE capital is signed and evidenced (LOIs/contracts, **not** pipeline) by **31 Aug 2026**. The $200K-vs-$400K cap and eligible-instrument definition are **both unconfirmed** with QBE/SIH.
- **SEFA concessional working-capital debt** — $300K target, gated on a Goods-only 3-statement model + accountant-reviewed accounts + independent-director majority. SEFA landing first is a primary trigger for the match.
- **Future recoverable/senior debt** — PFI $640K repayable, Minderoo recoverable, IBA senior debt.
- **No conventional equity, no exit event.** Social return primary.

### The loop (the whole engine)
Stream 1 (revenue) + Stream 2 (philanthropy/DGR) fill the ≈AU$400K "eligible non-QBE capital" bucket → **signed LOIs** evidence it → QBE matches 1:1. *That is why QBE is drawn as the output of streams 1+2, never an input.*

**RETIRE from external use:** "DGR1 status", "fully unlocks QBE", "de-risks SEFA", "600+ beds", "$445K/$778K grant", "~$3M close mid-2026", and presenting $3.42M/$899K/$604K CRM pipeline as capital or match evidence.

---

## 4. Canonical-numbers discipline — the alignment rule

The same metric is currently stated several incompatible ways across the 12 areas and public copy. **One sheet governs all of them:** `wiki/outputs/2026-05-29-qbe-canonical-numbers-sheet.md` (queried direct from v2 Supabase + ACT-infra Xero mirror, 2026-05-29) + cost model v6.

Every external number needs: **definition · source · date checked · evidence label · permission to use.** Status key: VERIFIED / WORKPAPER / MODELLED / TARGET. The full metric → canonical-value → status → stop-using table is in the master briefing, Section e. The load-bearing ones:

- **Beds:** 496 deployed (delivery proof) — never 369+/400+/520+/600+ as "delivered".
- **Revenue:** AU$732,210.79 billed / AU$649,710.79 paid (Xero workpaper, *not audited*) — never $537,595 / $445K / $778,162.
- **Centrecorp:** AU$123,332 paid — never $208K / $420K.
- **Cost per bed:** *never one external number* — always state the path (materials $469.79 / marginal-today $684.79 / factory $425.74 / community $270.74) and marginal-vs-loaded. Flag $1,912 as misleading-if-alone.
- **Pipeline:** AU$3,418,698 active is *internal, NOT committed* (and stale, `updated_at` Mar 26–27).
- **QBE match:** contingent on ≈AU$400K eligible non-QBE capital first — never secured/standalone.
- **DGR / community ownership:** "under transition / future pathway" — never current-state.

**The two outstanding artifacts the sheet flags** (both gate the capital story): a **Goods-only 3-statement model + accountant-reviewed summary** (the workpaper figures are not statutory accounts), and the **LOI tracker** that converts pipeline into a commitment QBE can assess.

---

## 5. How the streams map to the simplified pipelines (1:1, no double-counting)

| Money type | GHL board | Grantscope surface | Reconciled in |
|---|---|---|---|
| **Commercial revenue** | Demand → Buyer | `goods-funnel` BUYER + `goods-buyer-ghl` push | Xero `income_type=commercial` (delivered = ACCREC actuals; prospective = pipeline, NOT committed) |
| **Philanthropy / DGR** | Supporter Journey (incl. tagged Indigenous-focused) | `goods-signals-workbench` grant+foundation matching | Xero `income_type=grant`; verified-PAID only; DGR via Butterfly |
| **Capital** | `goods-capital` tag inside Supporter Journey | workbench Indigenous-finance pipeline + readiness snapshot capital roadmap | *Not a pipeline* — instruments; QBE match flagged contingent |

One board per dollar-type, money reconciled only in Xero → the investor deck reads **commercial vs grant/DGR vs capital** straight off the CRM with no double-counting. The readiness snapshot's governance promotion-gate ("don't promote a capital/commercial ask until governance + cost evidence are ready") is exactly the discipline an investor wants — as long as cost evidence uses v6 multi-number framing, not a single $600/bed.

---
title: Goods on Country — Master Strategic Alignment Map
date: 2026-06-13
status: internal source-of-truth — founder review before any external use
audience: internal (feeds the one-pager, strategy memo, and investor deck in this folder)
evidence_discipline: every external number carries a label — [VERIFIED] (independently checkable, e.g. asset register), [WORKPAPER] (Xero mirror, unaudited), [MODELLED] (planning assumption, no production actual), [TARGET] (sought, not signed)
---

# Goods on Country — Master Strategic Alignment Map

> **What this is.** One page that holds every QBE element together: the agreed numbers, the strategic spine, the capital ask, and — most importantly — the places where the wiki still disagrees with itself. Nothing in the one-pager, memo, or deck should use a number that is not reconciled here first.
>
> **The discipline that makes this credible.** Goods' own canonical numbers sheet exists "to stop 369+, 496+, 520+, 600+, $405K, $445K, $684K, $732K and $3M from being mixed without definitions." This map honours that. Catalytic investors forgive a gap they can see; they kill a venture for a blended number that hides one.

---

## 1. The strategic spine (the one-sentence chain)

**A good bed can prevent heart disease.** In remote Australia the household goods people depend on for health and dignity — beds, washing machines — are often the worst-designed things in the house: hard to freight, impossible to wash, quick to break, and unrecyclable when they fail. Unwashable bedding feeds scabies and skin infections → Strep A → rheumatic fever → rheumatic heart disease. Goods designs essential household goods *with* communities, builds them for actual remote conditions from recycled plastic, tracks every unit, and moves production toward community ownership. **The endgame is to become unnecessary** — local people making, owning, and repairing the goods themselves.

The three shifts: **material** (durable, washable, repairable goods replace failing ones), **economic** (more value stays local), **story** (communities control how their experience is recorded). [Source: theory-of-change.md, enterprise/01–02]

---

## 2. Canonical numbers — use these, retire the rest

### Proof of delivery [VERIFIED — asset register, 29 May 2026]
| Figure | Value | Note |
|---|---|---|
| Beds deployed (tracked) | **496** | 133 Stretch + 363 Basket (legacy, discontinued/open-sourced) |
| Communities | **9** | served communities (reviewer-approved public figure); supersedes "10 represented in records" and the stale "8" |
| HDPE diverted (Stretch only) | **2,660 kg** | 133 Stretch × 20 kg. **Retire 9,920 kg / 9,225 kg** (3.7× overclaim) |
| Plastic diverted per bed | **20 kg** | canonical, from products.ts |

> The 496 is *beds tracked in the asset register*, not "shipped" or "sold". Keep that wording. Do not say "600+ shipped" (overstates) or "369 delivered" (stale).

### Product — Stretch Bed [VERIFIED — v2/src/lib/data/products.ts, single source of truth]
| Field | Value |
|---|---|
| Status | For sale (the only product for direct sale) |
| Materials | Recycled HDPE plastic X-trestle legs · 2× galvanised steel poles (26.9mm OD × 2.6mm wall) · heavy-duty Australian canvas |
| Mechanism | **X-trestle tension design** — poles thread through the canvas sleeves *and* the top holes of the two crossed-plank HDPE X-legs; tensioning pulls poles deep into the legs; **the canvas is structural and braces the frame.** NOT clip-on/slot-on legs. |
| Weight | 26 kg |
| Capacity | 200 kg |
| Dimensions | 188 × 92 × 25 cm |
| Assembly | ~5 minutes, no tools |
| Lifespan / warranty | 10+ year design lifespan, 5-year warranty |
| Shop price | AU$750 |

### Unit economics [mixed — labelled per line]
| Figure | Value | Label |
|---|---|---|
| Sale price | AU$750 | [VERIFIED] |
| Bill of materials, today | AU$469.79 | [WORKPAPER] |
| Marginal cost, today | AU$684.79 | [WORKPAPER] |
| Fixed cost block | ~AU$109,500/yr | [MODELLED] |
| Breakeven, today's cost | ~1,679 Stretch beds/yr | [MODELLED] — out of reach (deploying ~130/yr now) |
| In-source target cost (factory) | AU$425.74 | [MODELLED] — **0 beds assembled in-house yet** |
| In-source target cost (community) | AU$270.74 | [MODELLED] |
| Breakeven after cost-down | 333–338 beds/yr | [MODELLED] |
| Key input proof | 8.6× "idiot index" markup on Defy HDPE legs | [VERIFIED] |

### Money in [WORKPAPER — Xero mirror, 29 May 2026, unaudited — never call this "audited Goods revenue"]
| Figure | Value | Note |
|---|---|---|
| Received | **AU$649,710.79** | across funders |
| Billed | AU$732,210.79 | incl. AU$82,500 in-flight (Rotary) |
| Collection rate | 88.8% | |
| Commercial revenue (shop) | **AU$90** | 3 orders — proof of pipe, not of market |
| Grant-funded share | **~89% by design** | this is a de-risking round, not a growth round |
| Anchor funders [VERIFIED] | Snow Foundation AU$402,930 · Centrecorp AU$123,332 paid · VFFF AU$50K · QIC AU$12K | |

### Funding received to date — the reconciled trail [~AU$405,685]
Snow Foundation $193,785 (2023–25) · TFN $130,000 (Dec 2025) · FRRR+VFFF Backing the Future **$50,000 (one joint grant, not two)** · AMP SPARK $21,900 (Jun 2024) · QBE Foundation Stage 1 $10,000 (Mar 2026).
**Exclusions:** Dusseldorp $15K is NOT Goods (belongs to Mounty Backyard/Contained/JusticeHub).
**Retire externally:** "$445K", "$778,162", "$537,595" — all superseded/do-not-use funder figures.

> Note the two coexisting frames: the **Xero workpaper** ($649,710.79 received) is the live billing view; the **reconciled funder trail** ($405,685) is the grants-received view. They measure different things. The standing P0 is to produce **one accountant-reviewed, Goods-only revenue figure** — it does not exist yet.

**Snow Foundation — reconciled 2026-06-13 (read-only Xero MCP, org = Nicholas Marchesi sole trader).** The Snow Foundation is the #1 contact by revenue: **$493,129.79 invoiced over the trailing 3 years** (accrual, last refreshed 2026-06-12, unaudited). This reconciles the three conflicting Snow figures — **$193,785** (older "received 2023–25" cash snapshot) and **$402,930** (deck "anchor" subset) are narrower/earlier views; **$493,129.79** is the current trailing-3yr invoiced total. Use $493,129.79 (accrual, this org) as the verified Snow total; it is invoiced, not necessarily cash-received. *Other top contacts confirmed in the same pull: PICC $436,700 · SMART Recovery $197,200 (non-Goods) · Centrecorp $123,332.00 (matches pack) · HipCamp $120,205 (non-Goods) — confirming this org holds non-Goods income too, so it is NOT a Goods-only revenue figure.*

---

## 3. The capital ask (catalytic, non-equity)

**Headline:** AU$900K–$1M blended, **non-equity** — close the first ~AU$400K of signed, match-eligible capital by **31 August 2026**.

**Why the deadline matters.** QBE Catalysing Impact Stage 2 offers **up to AU$400K** from a $1M pool, **at least 1:1 matched to secured external investment** (more is better; **repayable finance prioritised over grants**). Match must be **legally binding** (letters of commitment / loan / investment agreements) and is **verified by SIH at the September 2026 Stage 2 application**; conditional grants are possible if the match is not fully locked. *(Confirmed from program docs 2026-06-13 — ledger #7. The earlier "$200K" hedge is retired.)* The QBE match is an *output* of money raised first. **Signed, match-eligible LOIs today: 0.** This is "a conversation problem, not a discovery problem."

**The stack (junior → senior), all [TARGET] unless noted:**
| Layer | Instrument | Amount | Status |
|---|---|---|---|
| Grants (junior) | Philanthropy | ~AU$500K | Snow R4/R5 (~$132–200K NEW, NT-restricted, separate from the $402,930 anchor); Centrecorp next round (~end-June board); VFFF R2 / Minderoo |
| Catalytic top | QBE match | up to AU$400K | ≥1:1 vs secured external capital; repayable preferred; legally-binding evidence verified at Sept 2026 application |
| Concessional debt (senior) | SEFA working-capital line | AU$300K | ~70% modelled; gated on the financial model + independent-director majority + revenue covenant |
| Upside only | Butterfly/DGR | ~AU$200K | FY2026-27, DGR not live today |

**Use of funds:** in-source 50-bed proof run **~$60–80K** (the gating experiment) · plant capex ~$300–400K · working-capital buffer ~$150–200K · GM + BD hires ~$200K.

**Why catalytic, why non-equity.** Goods sits at the end of "proven product + proven delivery" and the very start of "proving the repeatable commercial engine" — exactly the pre-revenue, no-fiduciary-board zone catalytic capital exists for. Equity is inappropriate now because **the end-state is community-owned production**; equity is revisited only "within a future model where communities themselves become equity holders." Best-fit structure: project-level (the containerised plant) + company-level (SEFA/IBA) blend, with grants and guarantees on top de-risking concessional debt at the base. [Source: catalytic-capital.md, blended-finance.md, deck blueprint]

---

## 4. The hypothesis this capital tests (the honest core)

The capital case is **100% modelled.** The 8.6× markup on outsourced HDPE legs is [VERIFIED]; the claim that in-sourcing drops unit cost from $684.79 → $425.74 (factory) → $270.74 (community) is [MODELLED] with **0 beds assembled in-house** and a stale inventory snapshot (2026-03-27).

**The de-risking experiment:** ~AU$60–80K funds a 50-bed in-source production run.
- **Pass** = $425.74 confirmed → scale the raise.
- **Miss** = re-base the raise at $684.79.

A catalytic investor is being asked to fund this experiment, not a finished economic engine. Say so.

**36-month model (deck slide 10) [all MODELLED]:** without injection the position reaches **−AU$487,722** by month 36; with the catalytic injection stack (QBE + SEFA + philanthropy) it reaches **+AU$212,278** by month 36, through an intra-period trough of **−AU$177,292**. These come from the financial model, not from actuals — show the trough, not just the recovery. Reconcile against the live model before external use.

---

## 5. Traction — communities (keep source type visible)

Deployment snapshot is the **March 2026 compendium** (412 beds + 9 washers across 7 rows) — *different baseline* from the 496 asset-register figure. Do not blend. Largest relationships: **Palm Island 141 beds / 4 washers**, **Tennant Creek 139 / 5**, **Alice Homelands (Oonchiumpa) 60**, Utopia 24, Maningrida 24, Kalgoorlie 20, Mount Isa 4. Plus Darwin/Miwatj and NPY Lands relationships not in the snapshot.

**Standing demand — keep separate from deployed:**
- 107 beds approved, INV-0291 paid (Centrecorp/Utopia)
- 65 beds for children (Maningrida / Homeland Schools Company)
- 40 beds discussed (PICC, Palm Island)
- 20 beds offered self-funded (Dianne Stokes, Tennant Creek) — *strongest validation: request followed direct use and co-design*
- 500 mattresses + 300 washing machines exploratory (Groote Archipelago) — large market signal, NOT revenue
- NPY Women's Council — standing tri-state demand (Angela Lynch, demand voice)

**The human anchor:** Ray Nelson's bed, GB0-156-96, Plenty Highway, supplied 21 May 2026 — *"Since receiving their new beds, they are no longer experiencing back pains."* [VERIFIED — approved community voice]. 12 consented stories syndicated via Empathy Ledger (use only Ivy Johnson + Dianne Stokes headshots externally; others consent-pending).

---

## 6. Market (DRAFT v1 — to be ground-truthed; present as direction, not booked)

5-year addressable ~**30,750 beds** (~6,150/yr); realistic capture ~6,000 beds + ~975 washers. Eight procurement "pipes": NT Remote Housing ($4B/10yr, 270 homes/yr), Aboriginal Hostels Ltd (~17,000 beds), Outback Stores/ALPA, NACCHO + 144 ACCHOs, NIAA Community Laundries ($11.4M, partner not compete), State Aboriginal Housing offices, mining-region foundations (BHP $195M/yr, Rio $153M/yr), NDIS SDA (~$700M/yr). **The ceiling is procurement plumbing, not demand.** Context: one Alice Springs supplier sells **~AU$3M/yr** of washing machines into remote communities — most landfilled within months (supplier unnamed/unconfirmed). Indigenous-owned blueprint exists: **WINYA Furniture** (36 federal contracts, $950K, Supply Nation). Diagnostic claim: *no comparable washable, repairable, flat-pack mattress and no comparable repair-engineered remote washing machine currently exist.*

**Pre-condition for 4 of 8 pipes:** a **51%+ First Nations-owned operating entity** (IPP threshold tightens 1 July 2026).

---

## 7. Structure, governance, people

- **Trades today:** Nicholas Marchesi sole trader (ABN 21 591 780 066) → migrating all Goods activity into **A Curious Tractor Pty Ltd** (ACN 697 347 676, t/a Goods on Country) this FY.
- **DGR home:** **The Butterfly Movement Ltd** (ACNC, Item 1 DGR) — operational FY2026-27 (~1 July 2026), gifted from TABOO. **Not live today — donors cannot tax-receipt yet.** The only Goods DGR pathway. *A Kind Tractor Ltd is dormant, not the vehicle.*
- **Unsettled (the keystone gap):** subsidiary/CLG/hybrid form beneath ACT; the community-production entity's legal form; mission lock (no B Corp / asset-lock / community-ownership deed yet — protection is "cultural and relational," explicitly "not enough to carry larger capital").
- **Governance:** founder accountability + an advisory board (11 named members incl. Kristy Bloomfield, Nicholas Marchesi OAM, Corey Tutt, Judith Meiklejohn) — **advisory, not fiduciary.** MinterEllison (Keith Rovers) on structure. Gating gap for SEFA's $300K: an independent-majority fiduciary board.
- **People:** two FTE founders — **Ben Knight** (relationships, story-consent, governance, product feedback) and **Nicholas Marchesi** (builder/operator, remote-community, prototype-to-product). The founder bottleneck is the #1 risk ("already happening"). Two priority hires: **General Manager** + **Business Development/sales lead**, backfilled in the interim by QBE skilled-volunteering + 6-session PIN mentoring.

---

## 8. Risk register (working)

Key-person/founder bottleneck (**already happening**, high) · cashflow ("costs land before payments", high) · product safety (low-med likelihood, high consequence) · environmental ("accidentally add to the waste problem", med/high) · debt taken before the model can service it (future, high consequence) · story/data consent (med likelihood, very high consequence) · community trust (always live) · governance lagging investor needs · community-ownership model risk (value/risk asymmetry). Guiding test (Nicholas): **"do no harm"** — incl. "do not centralise value in ACT while talking about community ownership."

---

## 9. QBE readiness — what's ready vs what blocks the raise

[Source: canon/qbe-readiness.md, scores asOf 2026-06-02. P0 = priority gap.]

**Ready / strong:** Vision (8→9), Social Impact & MEL (11 artifacts), Business Model, Process & Tech, Investors & Capital Raising, Cost Model v6 (BOM + $110,046 press capex solid).

**The five raise-blockers (NOT ready):**
1. **Legal structure (KEYSTONE, 0 artifacts)** — entity/Indigenous-ownership undecided; blocks Supply Nation 51% cert (1-July deadline) and FAC/IBA eligibility. Needs one approved entity-wording block + a decided transition path.
2. **0 signed LOIs** — the match gate is open. One signed procurement/offtake LOI fixes both the match and the weak-commercial-paperwork gap.
3. **Financial reconciliation + founder-time costing** — three revenue cuts → one accountant-reviewed Goods-only figure; cost founder time at fair-market rate; no cashflow-buffer policy yet.
4. **Governance for the new entity** — advisory ≠ board; need 1–2 directors with commercial/scale-up experience; reports not audited.
5. **Public-copy accuracy + consent-cleared story list** — separate verified from modelled on every metric; rotate plaintext passwords out of Notion.

---

## 10. Contradictions ledger — fix before external use

| # | Issue | Resolution for this pack |
|---|---|---|
| 1 | Wiki product copy says legs "click/slot onto poles" | **WRONG.** Use the X-trestle tension design (canvas is structural). Fix wiki separately. |
| 2 | Bed counts: 496 vs 412 vs 369 | Use **496 deployed [VERIFIED, 29 May 2026]**; label source; never blend baselines. |
| 3 | Plastic: 9,920 / 9,225 vs 2,660 kg | Use **2,660 kg (Stretch only) [VERIFIED]**; retire the higher figures. |
| 4 | Revenue: $649,710.79 / $732,210.79 / $537,595 / $405,685 | Use **received $649,710.79 [WORKPAPER]** for billing view, **$405,685** for grants-received; never "audited". |
| 5 | Capital stack differs: catalytic-capital.md (PFI $640K, Mindaroo $200K, QBE $400K) vs deck (Snow + SEFA $300K + QBE up to $400K + philanthropy $500K) | Use the **deck stack** as primary (it is the adversarially-reviewed version). Note PFI/Minderoo as relationship-stage pipeline, not in the headline ask. |
| 6 | Unit cost-down $425.74/$270.74 | Always [MODELLED], 0 beds in-house. Frame as the hypothesis the capital tests. |
| 7 | QBE match cap $200K vs $400K | **RESOLVED 2026-06-13 from program docs (EOI, Letter to Funders 1 Apr 2026, Induction slides).** Cap is **AU$400,000 per enterprise from a $1M pool**, **at least 1:1 matched to secured external investment** (more is better), **repayable finance prioritised over grants**. Match must be **legally binding** (letters of commitment / loan / investment agreements) and is **verified by SIH** at the Sept 2026 application; conditional grants possible if match isn't fully locked. **Stop modelling at $200K — use $400K with the 1:1 rule.** Propagate to memo §4, one-pager, deck slide 11, next-stage focus. |
| 14 | EOI on record (submitted 2 Feb 2026) states a **$210K** capital target with **old figures** (369 beds / 8 communities / 25 kg per bed / 9,225 kg / 40% profit share) | The EOI is the historical entry, not a current claim. Our reconciled canon (496 / 9 / 20 kg / 2,660 kg) supersedes it. The Stage 2 ask (AU$900K–1M blended; first ~$400K signed) is deliberately larger than the EOI — fine, but be aware Stage 2 diligence may compare against the EOI. Do not restate the old EOI figures externally. |
| 15 | Stage 2 requires **audited or accountant-endorsed** financials + **legally-binding** match evidence by **September 2026** | This sharpens the Area 04 P0: the accountant carve-out/endorsement is now a hard Stage-2 gate, not just good practice. Converting pipeline → signed commitments before September is the critical path. |
| 8 | 40% community profit share | Placeholder concept, not committed. Say "principle settled, mechanism not." |
| 9 | DGR1 status / "community-owned production" today | DGR not live (FY2026-27); community ownership is the north star/pathway, not current state. |
| 10 | $16.56M / 103 Notion opportunities; "Won CRM" $898,863 | Internal pipeline intelligence only — exclude from external materials. |
| 11 | Market files (GO_TO_MARKET, MARKET_INTELLIGENCE) | DRAFT v1, un-ground-truthed. Present sizing as direction; flag the $3M supplier as unconfirmed. |
| 12 | **Communities: this pack says 10; the live QBE Notion reviewer-safe copy (1 Jun 2026) says "9 served communities"** | **RESOLVED 2026-06-13: founder confirmed — use 9 served communities externally. Propagated across pack.** |
| 13 | **Revenue drift: pack uses received $649,710.79 / billed $732,210.79 (29 May); live Notion check (1 Jun) is paid $650,910.79 / raised $733,410.79** | ~$1,200 higher on both. Not an error — the figure moves as invoices clear. Confirms "re-pull Xero before sending." Use the freshest pull on the send date. |

> **Live-tracker note (added 2026-06-13).** The QBE Diagnostic Artifact Database (Notion, under Goods. HQ → Projects) shows all 12 areas at **"Built — needs review"** — none "Ready to share". The pack is consistent with that: present nothing as final/approved. Good news to fold in: HighLevel API re-verified 10 Jun 2026, and the **signed/eligible commitment register is now live in CivicGraph ("Match Campaign" tab)** — that is the real home for the deck's "round assembling in real time" slide.

---

## 11. Pre-send checklist (nothing ships until)
- [ ] A core team member has audited each external number and can defend it in live Q&A.
- [ ] Re-pull Xero immediately before sending (received/billed figures move).
- [ ] Refresh CRM/pipeline (last updated 2026-03-26/27 — stale).
- [ ] Team slide carries named roles — no placeholders.
- [ ] Only consent-cleared voices/photos used (Ivy Johnson + Dianne Stokes safe; others pending).
- [ ] Legal-structure wording block approved by Nicholas/Keith Rovers.

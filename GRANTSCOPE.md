# GrantScope ↔ Goods: evidence and decision layer

> **Status:** cross-system implementation context, current 2026-07-29.
>
> Read this after `/STRATEGY.md` when changing a Goods funder, investor, pathway, community,
> relationship, impact, cost-model or narrative surface.
>
> **This file does not override the Goods source hierarchy.** Figures still come from
> `v2/src/lib/data/canon.ts` and `asset-canonical.ts`; human judgements from `/DECISIONS.md`;
> language from `/CONTEXT.md`; the whole picture from `/STRATEGY.md`. This file explains how
> GrantScope reads those truths alongside relationships and evidence. When the systems disagree,
> show the conflict and resolve it with a human ruling—never silently choose one.

---

## The frame

> **GrantScope should not become a better grant directory. It should become the evidence and
> decision layer connecting ACT projects, communities, funders, people, relationships and
> concrete actions.**

For Goods this means the system does not ask people to maintain another transactional model.
It reads what is already happening, shows what is known and unknown, and helps a human decide
what to do next.

The relationship is not decoration around the model. The relationship changes the design,
the evidence that may be used, the money door, the owner of the next action and whether an
investment is appropriate at all.

## The surface pattern

Every place-level or investment surface should answer six questions:

1. **Authority and relationship** — who has authority here, what relationship exists, and what
   remains unconfirmed?
2. **Requested now** — what is signed, authorised or explicitly requested now?
3. **What happened** — what was paid product trade, paid non-product work, voided, delivered or
   merely modelled?
4. **Coordination, not consent** — what does the CRM say internally, clearly labelled as internal
   coordination rather than community approval or an order?
5. **Next open action** — what concrete human action is unresolved, and who should hold it?
6. **Evidence health** — what is verified, partial, conflicted, stale, unavailable or awaiting
   human review?

This is a **decision read**, not a readiness score, pipeline stage or progress bar. Do not
auto-fill earlier stages because a later-stage record exists. Do not call population-modelled
need demand. Do not call an invoice an order without checking its status and contents.

## The narrative pattern

The road leads. The model comes after the road as what the relationships produced.

The Goods surface implemented in GrantScope moves through:

1. The road produced the model.
2. Start with a real place.
3. What moving the pressing changes.
4. Three cost centres, never one blended stack.
5. Three organisational jobs, not three settled companies.
6. Fund the next proof, not a polished fantasy.
7. Every number keeps its status.

For a community, translate the spreadsheet back into questions: what do you want to make, what
do you want to own first, who runs it, whose place is it, how is that person paid, who carries
maintenance and warranty, and what should never leave community control?

For a funder or investor, show the same truth with the evidence status intact. The pitch is not
certainty. The pitch is that Goods understands which uncertainties decide the result and has a
relationship-led way to resolve them.

## Three cost centres

Keep these separate on every surface:

- **Product making** — marginal product cost and ordinary delivery, paid by product orders.
- **Goods network** — design, quality, training, buyer work, back office and relationship travel,
  shared across places rather than copied into each site.
- **Community wraparound** — participation, employment brokerage, governance, learning and local
  support, funded as public-good work by design.

Never hide wraparound inside a bed price to manufacture a false commercial claim.

## Three organisational jobs and three money doors

The current working interpretation is:

- **A Curious Tractor Pty Ltd** — the historic maker, transferring its assets into Goods on Country (ruling X); no separate Goods. layer;
  seller-of-record remains a transition detail that must be stated accurately.
- **Goods on Country inside The Butterfly Movement Ltd** — charity/DGR home for relationship,
  participation, learning, evidence and wraparound.
- **Community production enterprise** — intended local form for machinery, making, contracts,
  margin, knowledge and decisions as agreed. It is not yet one settled legal template.

The corresponding doors are:

- **Give / buy the time** — public-good relationship and wraparound work.
- **Buy or order / prove the product** — authorised product demand and delivery.
- **Invest repayably / bridge the work** — order-backed working capital or productive assets with
  a clear repayment source, asset owner and release gates.

Contribution is not surplus. Revenue is not cash. A candidate is not a commitment. An entity
workbook placeholder is not investment.

## Evidence rules

- Use exact identifiers and explicit crosswalks. Do not fuzzy-match community authority,
  relationships or consent.
- Separate paid product invoices, paid non-product invoices and voided invoices.
- A CRM stage is internal coordination unless supported by an authority/request artifact.
- Missing authority stays missing. Never convert absence into zero or “not required”.
- Keep source freshness separate from truth status and human review.
- Quarantine conflicts; do not average them away.
- Relationship counts may show activity, but they do not prove trust, authority, consent or
  current demand.
- Human promises and promised returns are append-only obligations. They are not payments,
  completed work, consent, relationship stages or “last contact”.
- Automation may reduce administration. It must not impersonate the relationship.
- Personal contact details and RED storyteller/recipient data must not move into public surfaces
  or external models.

## Four current place reads

These are examples of the method, not permanent truth:

- **Oonchiumpa:** use the exact Oonchiumpa entity and relationship records. Do not match the
  similarly named Bloomfield family trust. Internal “Modules selected” is not consent.
- **Utopia / Urapuntja:** currently carries a three-way definition conflict—147 canonical Stretch
  Beds, 107 paid Weave Beds on INV-0291 and 68 unlinked lifecycle rows. Preserve all three until
  ruled.
- **Tennant Creek:** paid Basket Bed and washer history exists, while voided future-bed invoices
  and implausible pre-2010 deployment dates must remain quarantined. Modelled replacement need is
  not a request.
- **Palm Island:** distinguish paid travel/video work from product trade; preserve the voided-bed
  invoice contradiction; suppress postcode/LGA organisations that are not proven community
  relationships. Governance is unpriced, never `$0`.

For all four, present authority and a current authorised request as unresolved until a real
artifact or human review establishes them.

## Canonical alignment and unresolved definition conflicts

The systems currently agree on:

- 540 deployed beds: 177 Stretch and 363 Basket.
- 22 washers in community as a manual human ruling; the register still has 32 deployed rows and
  ten require restatusing before the value is query-derived.
- 11 communities served; 12 distinct communities touched is a different measure.
- Current Stretch Bed price of $750.
- Bought-kit marginal cost about $685 and pressed/factory marginal cost about $426.
- Ownership is a pathway, never a completed claim.
- Signed capital commitments currently equal zero unless new verifiable paper exists.

Two definitions require an explicit Goods ruling before cross-system publication:

1. **Per-bed improvement.** GrantScope shows `$684.79 - $425.74 = $259.05` as the change in
   contribution at the same $750 price. Goods canon currently holds `save-per-bed = $194` with a
   different BOM definition. Do not collapse these into one “saving”. Name the calculation or
   obtain a ruling and update canon/tests.
2. **Plastic impact.** GrantScope labels `177 × 20kg = 3,540kg` as modelled in-product/design mass,
   not measured waste diversion. Goods canon currently labels it verified diverted HDPE. Do not
   upgrade modelled mass into measured diversion without the evidence/ruling the Goods hierarchy
   requires.

## GrantScope implementation to consult

The working model lives in `/Users/benknight/Code/grantscope`:

- `apps/web/src/lib/services/goods-living-investment-model.ts` — story, cost centres, forms,
  money doors, decision gates and evidence ledger.
- `apps/web/src/lib/services/goods-living-data-adapter.ts` — read-only source adapter, explicit
  place crosswalks, evidence interpretation and conflict quarantine.
- `apps/web/src/app/org/[slug]/goods/model/` — the implemented model surface.
- `apps/web/src/lib/services/goods-canonical-numbers.ts` — GrantScope’s reconciled active numbers.
- `apps/web/src/lib/services/act-relationship-ledger.ts` — relationship events, commitments and
  promised returns.
- `docs/strategy/goods-relationship-led-funding-intelligence.md` — funding interpretation.
- `docs/strategy/act-relational-learning-protocol.md` — relational learning method.
- `docs/strategy/act-opportunity-model.md` — opportunity/evidence model.

Local route when the GrantScope development server is running:
`http://localhost:3003/org/act/goods/model`.

## How Codex should use this

Before building or rewriting a relevant Goods surface:

1. Read `/STRATEGY.md`, `/DECISIONS.md`, `/CONTEXT.md`, Goods canon and this file.
2. Inspect the relevant current source rows rather than copying numbers from prose.
3. Decide whether the surface is for community, operators, funders or investors.
4. Lead with the road/place/relationship; let the model arrive as evidence.
5. Preserve claim status and unknowns in both copy and UI.
6. Name the concrete decision or action the surface is meant to support.
7. Test that a user cannot mistake modelled need for demand, CRM activity for authority, a voided
   invoice for trade, contribution for surplus or intended ownership for completed ownership.
8. Run the Goods drift/build checks required by `/CLAUDE.md`.

The measure of success is not how much information the surface contains. It is whether a
community, operator, funder or investor can see what is true, what is unresolved, who must decide
and what responsible action comes next.

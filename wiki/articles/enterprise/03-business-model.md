# 3. Business Model Clarity

> Can the organisation clearly articulate its business model?

## One-line description

Goods designs durable household goods for remote communities, manufactures them in containerised plants sited On-Country, sells them B2B (housing, health, schools) and B2C (retail + sponsored-bed), and transfers plant ownership to community partners over time.

## Revenue streams

1. **Institutional B2B (current primary)**
   - Housing providers, health services, schools, community-controlled organisations.
   - Institutional price: $560 (Stretch Bed single), with volume terms.
   - Pipeline: Centrecorp 107 beds (approved), NT Housing $4B program (qualifying), Homeland Schools 65 beds, NPY 200-350 beds standing interest.

2. **Direct B2C retail**
   - goodsoncountry.com (Next.js + Stripe, live).
   - Retail price: $600-850 depending on channel.
   - Sponsor-a-Bed: donor buys, bed goes to a community request.

3. **Production services and licensing (emerging)**
   - Community production partnerships (revenue share model).
   - License the plant design to partners (long-term).
   - Training and consulting.

## Unit economics (Stretch Bed)

| Line | Value | Source |
|---|---|---|
| Production cost (small batch, today) | $550-650 | v2/src/lib/data/products.ts |
| Production cost at scale (5,000+/yr) | ~$350 | pathway, not current |
| Institutional wholesale price | $560 | Xero verified |
| Retail price | $600 | live ecommerce |
| Gross margin at scale | 50-55% | strategy PD |
| Community profit share | 40% of profit | non-negotiable |

The margin is thin at current scale and becomes healthy at scale. The QBE match-funding round is how we bridge to scale economics.

## Cost structure (high level)

- **Direct production:** materials (HDPE pellets / recycled feedstock, steel poles, canvas), labour, packaging.
- **Plant operating:** containerised facility power, maintenance, consumables.
- **Logistics:** freight to remote communities (high cost; offset over time by On-Country production).
- **Overhead (ACT shared):** design and engineering, storytelling (Empathy Ledger), admin, compliance.
- **R&D:** ongoing product iteration, washing machine prototype, fridge design.

## Product portfolio

| Product | Status | Role |
|---|---|---|
| **Stretch Bed** | Commercial (v4) | Flagship, for sale, revenue anchor |
| **Pakkimjalki Kari Washing Machine** | Prototype, 5-11 deployed | Register interest, not for sale yet |
| **Basket Bed** | Discontinued | Open-sourced (free plans) |
| **Fridge** | Concept | Future, same plant/molds |

Note: the Weave Bed is discontinued; any reference in older decks is legacy.

## Customer segments

- **Community-controlled organisations** (PICC, Oonchiumpa, Centrecorp, Julalikari, Anyinginyi, NPY, Wilya Janta).
- **Housing providers** (NT Housing, Homeland Schools, Aboriginal Housing Victoria).
- **Health services** (Healthy Homes programs, OT workers, Aboriginal Community Controlled Health Organisations).
- **Schools** (Homeland Schools Company is the first named buyer).
- **Retail consumers and donors** (B2C and Sponsor-a-Bed).
- **Philanthropic funders** (not a customer, but a capital source).

## Channels

- Direct relationships with community partners (primary).
- Ecommerce site (goodsoncountry.com) for retail and donors.
- Advisory network introductions (10-member advisory group).
- Forums and on-Country visits.

## Key partners (activity-critical)

- **Oonchiumpa Consultancy** (Alice Springs): confirmed manufacturing partner, Fred Campbell cultural lead.
- **PICC** (Palm Island): deployment partner, signalled buyer of plant, REAL Innovation Fund consortium partner.
- **Snow Foundation**: anchor funder, long-term partner.
- **Zinus**: mattress manufacturing industry advisor.
- **University of Melbourne**: design research.
- **Our Community Shed**: production partner.
- **Plate It Forward**: PICC integration.

## Competitive position

We are not competing on price with IKEA. We are competing on total cost of ownership with the shadow market of disposable furniture that already drains community budgets. Our moat is: (1) product actually designed for the conditions, (2) community co-design legitimacy, (3) On-Country manufacturing loop, (4) ACT ecosystem relationships (Empathy Ledger, PICC, Oonchiumpa).

## Where the model is still evolving

- **Community ownership transition economics.** What does the P&L look like for PICC the day they buy the plant? Not modelled yet.
- **Optimal plant density.** One container feeds how many communities, at what freight cost, is still being calibrated.
- **B2C retail viability.** Retail is live but small; we do not yet know if it scales to a material channel or stays as a donor/brand touchpoint.

## Source documents

- Strategy PD Part 5 (Business Model), Part 6 (Production), Part 7 (Partnerships), Part 8 (Go-to-Market): `v2/docs/GOODS_STRATEGY_PD.md`
- Canonical product specs and pricing: `v2/src/lib/data/products.ts`
- Compendium (deployments, partners, funding): `v2/src/lib/data/compendium.ts`

---
date: 2026-09-16T21:20:00+10:00
session_name: procurement-model
branch: fix/snow-ask-and-figure
status: active
---

# Work Stream: procurement-model

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-16T21:20:00+10:00
**Goal:** Work out who can buy a bed, what obliges them to look at an Aboriginal supplier first, and how a community organisation becomes the seller. Build it as a model that travels: NT, then SA, then WA, then QLD.
**Branch:** `fix/snow-ask-and-figure` in `../goods-ledger-wt`, 26 commits ahead of main, NOT pushed.
**Test:** `cd v2 && npx vitest run && npm run check:drift:ci && npm run build`

### Now
[->] **Queensland research running.** It is the last jurisdiction and the most unusual: seven of our nine QLD communities are Aboriginal Shire Councils, which makes them the buyer and the Aboriginal entity in one body. When it lands it slots into `JURISDICTIONS` in `procurement-model.ts` the same way the other three did.

**Everything is at `/admin/procurement`.** Dev server on 3013.

### The one-line answer per jurisdiction
| | Buy without a tender | Instrument |
|---|---|---|
| **WA** | **No cap at all** | Rule C4.2, WA Procurement Rules. Works even over a whole-of-government panel. |
| **SA** | **733 beds ($550,000)** | SAIPP Procedural Guidelines s3.7 and s4.6. Names the APY Lands in its own text. |
| **NT** | **66 beds ($50,000)** | Tier 1, since 1 October 2025. Direct purchase from a Territory enterprise. |
| **QLD** | pending | |

### What was found, in order of how much it changes
- **Nobody buys a bed for a remote NT house.** The housing agencies spent $817,871,353 across 1,394 contracts; nine mention furniture and they are office chairs and removalists. Across all 26,591 NT contracts, 125 mention furniture or whitegoods, 112 once roadside furniture is removed, and **zero** for a remote community. $1.7 billion of remote housing and no procurement channel for what goes in the bedroom. The tenant buys it. **That absence is the argument**, stated in the government's own record.
- **Every Indigenous procurement instrument tests the entity that SELLS.** Ruling J, 25 July: Aboriginal directors on the charity is not 51 per cent ownership of the selling entity. Orders are invoiced by A Curious Tractor Pty Ltd, so every channel is shut to Goods as constituted. The community organisations we work with do pass. **Beds handed over as stock they own are what makes them a supplier.**
- **EXCEPT POSSIBLY IN WA, and this is unresolved.** The Aboriginal Business Directory WA tests the BOARD for an incorporated Aboriginal organisation, at least 50 per cent Aboriginal members, not ownership. Goods on Country Ltd has 100 per cent Indigenous directors, and that register is one of two that unlock the uncapped rule. Open: the management-and-operations limb with non-Aboriginal employees, WA business registration, and whether the charity could sell at all. **Question for the Industry Capability Network. Not a finding.**
- **The head contractors on NT remote housing are Aboriginal corporations and we know six of them.** Bukmak (ALPA subsidiary) building 87 dwellings at Galiwin'ku for $51.5M; Binjari at Bulman, Weemol, Beswick; Bawinanga at Maningrida; MacDonnell at Titjikala and Kintore; ALPA at Ramingining; Julalikari at Tennant Creek. **A bed is not in their build scope.** The opening is their MAINTENANCE and tenancy contracts, where replacing a failed appliance is in scope.
- **Galiwin'ku is the case of the year.** Largest place in the federal record at $58.9M, 64 per cent of households need another bedroom at 7.1 people per dwelling, Bukmak building 87 dwellings there now, and we have nothing there.

### Dates that matter
- **WA head maintenance contract RFT in market September to November 2026, which is now.** Contracts start July 2028. Stated objective: increase Aboriginal community controlled participation. Live inbox: `MaintenanceContractReview@dohw.wa.gov.au`.
- **SA is writing an Aboriginal procurement policy this financial year** (Treasury's stated 2026-27 target). A reason to be in the room while it is drafted.
- **100 APY Lands houses moved to the SA Department for Education on 1 April 2026.** A furnishing buyer with no incumbent arrangement.
- NT bedding period contract re-tenders around late 2028 ($4,539,279 over 36 months, currently a non-Aboriginal Darwin firm).

### Doors, none of them approached
- **Tom Harris**, NT Territory Procurement Champion, `procurement.champion@nt.gov.au`, 08 8999 7799. Appointed 1 Nov 2025 to find exactly this kind of barrier.
- **John Chapman OAM**, SA Industry Advocate, `oia@sa.gov.au`, (08) 8429 2700.
- **Morrgul**, Aboriginal-owned Kimberley not-for-profit, runs the Aboriginal Procurement Advisory Service for Goldfields-Esperance, `info@morrgul.com.au`.
- **Nganampa Health Council**, the ACCHO for the APY Lands. They run UPK, and the 1987 UPK report is where the healthy living practices come from. The standard we quote back at governments descends from their work.
- **David Michael MLA** is both WA Minister for Finance, who owns the Aboriginal Procurement Policy, and regional minister for Goldfields-Esperance where Ninga Mia sits.

### Built this session
- `v2/src/lib/data/procurement.ts` — the rules, channels, named federal buyers, and the NT detail
- `v2/src/lib/data/procurement-model.ts` — the jurisdiction shape, community routes, SA and WA specifics
- `v2/src/app/admin/procurement/page.tsx` — all of it, one page
- `v2/scripts/pull-procurement.mjs` — federal and state contracts from the shared graph, evidence-based
- `v2/scripts/pull-nt-contracts.py` — the NT workbook nobody had ingested, and the furnishing gap computed
- `v2/scripts/pull-community-intel.py` — census crowding, with the caveats computed

### Next
- [ ] Queensland, running
- [ ] Put the WA board-test question to the Industry Capability Network
- [ ] Load the NT contract data into the shared graph properly. It is parsed from a workbook today; `state_tenders` is 99.98 per cent Queensland and has no NT rows at all
- [ ] The $3M Alice Springs washing machine claim in CLAUDE.md could not be sourced. Ground it or stop printing it
- [ ] Nothing anywhere covers helping a community organisation answer a buyer: a price, a lead time, an invoice, a delivery. That is the step between holding stock and being a supplier and no tooling in either repo touches it

### Open Questions
- Do our partner organisations WANT to be sellers? Every route in the model is possible. None has been agreed to by anybody.
- Recycling data does not exist. `est_plastic_waste_tpa` is null in all 1,543 rows of `goods_communities`. The one dimension asked for that the data cannot answer.
- Population in that table is unreliable (most communities return the same default) and employment is regional, repeated down. Both are labelled per row.

### Decisions
- **Never use `goods_procurement_entities`.** 4,562 rows built by proximity matching; it holds a Newcastle youth arts co-op as a Goods buyer prospect. Only 1,604 carry any contract value and none has moved past `prospect`. Work from evidence instead: contracts actually awarded.
- **No modelled demand, anywhere.** The withdrawn "who has asked" figures came from grantscope's `estimate-goods-demand.mjs` (households = population / 3.5, beds = households x 1.2). A guard fails the build if any reappears.
- **Every threshold is expressed in beds.** It is the only form in which a procurement rule is worth reading.

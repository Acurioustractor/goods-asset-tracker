# What a scan can fill in the framework, and what it cannot

10 September 2026. Read-only pass over the shared CivicGraph project, 1,459 tables.

The four empty axes are not all empty for the same reason. Two are a data-plumbing problem, one
is a data-quality trap, and one is fieldwork that no database holds.

## 1. Overcrowding: fill it, the data is thirty times bigger than the repo

`abs_iloc_overcrowding` holds **1,138 ILOCs**. `community-need.ts` holds 13. The shared table also
carries two columns the repo extract dropped: `atsip_households` and `atsip_need_1plus`. Those
count Aboriginal and Torres Strait Islander households specifically, where the repo figure covers
everyone.

It also holds rows the repo does not have at all. **Maningrida Outstations** is a separate ILOC at
**80.4% overcrowding**, 37 of 46 dwellings, against Maningrida township's 60.2%. The outstations
are the sharper picture and the repo cannot see them.

Straight win. Widen the extract, keep the same rules: one community, one ILOC, or nothing.

## 2. Health: the data exists and must never touch a bed number

`abs_iloc_health` holds the same 1,138 ILOCs with `heart_disease`, `kidney_disease`, `diabetes`,
`asthma` and median household income. Maningrida records 256 people with heart disease among 2,297
Indigenous persons counted. Palm Island records 83 among 1,918.

**Two hard limits before this goes anywhere.**

It is ABS Census self-reported long-term health conditions. "Heart disease" is not rheumatic heart
disease, and the two must not be used as if they were.

And the claim ceiling holds absolutely. Scabies and RHD are why the hardware exists and are never
a claimed outcome. Putting a heart-disease count beside a bed count implies the causal claim the
whole voice guide forbids, whoever reads it and however it is captioned. The health layer can size
a setting. It can never appear in the same row as beds delivered.

## 3. Buyers: the data exists, and joining it automatically would be wrong

`goods_procurement_entities` holds **4,562 rows** with entity name, ABN, buyer role and
procurement method, keyed to a community. That looks like the buyer axis solved.

It is not. Asked for Palm Island's procurement entities, it returns:

- Cooktown Fishermans Wharf
- Cape York Weeds and Feral Animals Inc
- Cape York Folk Club Inc
- Cooktown District Community Centre Ltd
- Juunjuwarra Aboriginal Corporation

Those are Cape York organisations. Palm Island is an island off Townsville in a different local
government area, several hundred kilometres away.

The cause is visible in the community row itself. Palm Island carries **postcode 4895** while its
`lga_name` is correctly "Palm Island". The entity join is not using the LGA, because if it were it
would be right. **Check the postcode before anything else.**

`GRANTSCOPE.md` anticipated this exact failure and names this exact place: "Palm Island: suppress
postcode/LGA organisations that are not proven community relationships." The contract was written
because this happened before.

So the buyer axis stays manual. A procurement entity earns a place when somebody confirms the
relationship. A postcode match is where this went wrong.

## 4. Plastics and authority: no database holds these

Searched the 1,459 tables for waste, recycling, plastic, circular, MRF, scrap and resource
recovery. Nothing, beyond a generic `scraped_services`.

There is no recycling-operator layer to scan, and there is no authority-artifact table. Who holds
the waste stream in a community, and who has authority to agree to a plant, are both found by
asking. That is fieldwork, and the framework is right to leave those axes empty until someone does
it.

## What else is sitting there unused

| Table | Rows | What it is |
|---|---:|---|
| `goods_communities` | 1,543 | Communities with LGA, region and service region |
| `v_goods_community_priority` | 1,543 | SEIFA decile, disadvantage score, demand beds, assets deployed |
| `nt_communities` | 75 | NT communities with land council and remoteness |
| `v_nt_community_buyer_crosswalk` | 23 | NT communities against buyer signals |
| `v_act_procurement_buyers` | 216 | Buyers with contract counts and spend |
| `social_enterprises` | 12,191 | Named social enterprises with ABN |

One warning on `v_goods_community_priority`. It carries `demand_beds` and `assets_deployed`, which
are the two figures canon already owns and guards. Community OS was wrong about Utopia once, 169
against the ruled 147. These columns must never override `community-canonical.ts`.

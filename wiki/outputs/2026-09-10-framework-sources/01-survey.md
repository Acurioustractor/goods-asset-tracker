# Survey of the shared project, 10 September 2026

Read-only. Ten candidate tables sampled out of 1,459. The question was not what is there but
whether the keys can be trusted, because a join on a bad key is worse than no join.

## The verdict in one line

**Reference data is good. Goods-specific columns are not.** The ABS layers are usable today. The
two columns that look most useful, `demand_beds` and `assets_deployed`, are unusable and would
have contradicted canon.

## `v_goods_community_priority`: do not use the Goods columns

1,543 rows. `seifa_irsd_decile` and `disadvantage_score` are ABS-derived and only 3% empty.

The other two columns are the problem.

`demand_beds` has 68 distinct values across 1,543 communities, and **746 of them hold exactly 52**.
That is a default value. Nobody measured it. Palm Island holds 52, so its recorded "demand" is the
placeholder. Maningrida holds 930 against a recorded ask of 65. Tennant Creek holds 0, against a
recorded 23 and Dianne Stokes's offer of 20.

`assets_deployed` disagrees with canon. It gives Maningrida 24 where `community-canonical.ts`
rules 58. It gives Tennant Creek 146. Utopia, which canon rules at 147 and is the largest
deployment Goods has, **has no row in the table at all**.

This is the Community OS failure again, the one that put Utopia at 169 against the ruled 147, and
now at a scale of 1,543 rows. Neither column may override canon and neither belongs in the
framework.

## Key quality, tested on the communities we know best

| Community | Postcode | LGA | In the table |
|---|---|---|---|
| Palm Island | **4895, wrong** | Palm Island | yes |
| Maningrida | 0822 | West Arnhem | yes |
| **Utopia** | | | **no row** |
| Tennant Creek | 0860 | null | yes |
| Alice Springs | 0870 | null | yes |
| Kununurra | 6743 | Wyndham-East Kimberley | yes |
| Mount Isa | 4825 | null | yes |

One wrong postcode, one community missing entirely, three with no LGA. That is the error rate
where we should be strongest, and the wrong postcode is the one that pulled Cooktown organisations
into a Palm Island buyer list.

Across the whole table: postcode 0% empty, `lga_name` 10% empty, `region_label` 94% empty,
`service_region` 95% empty. The two region columns are effectively unpopulated.

## What is actually usable

| Table | Rows | State | Use |
|---|---:|---|---|
| `abs_iloc_overcrowding` | 1,138 | complete | **In use.** Widened `community-need.ts` today |
| `abs_iloc_health` | 1,138 | complete | Sizes a setting. Never beside a bed count |
| `goods_procurement_entities` | 4,562 | fields 0% empty, keys unsafe | Only through a confirmed relationship |
| `v_act_procurement_buyers` | 216 | contract counts and spend | Worth a look for real buyers |
| `social_enterprises` | 12,191 | ABN 24% empty, website 32% | A directory, not a pipeline |
| `community_directory_orgs` | 76,151 | phone 25%, email 22% empty | A directory |
| `nt_communities` | 75 | has land council, remoteness | The best community table for the NT |
| `v_nt_community_buyer_crosswalk` | 23 | NT only | Small and specific |

`goods_procurement_entities` covers 358 of 1,543 communities. Its own fields are clean, with ABN,
buyer role and procurement method all present. The risk is entirely in which community a row is
attached to.

## What this means for the framework

Nothing changes in what was built today, and that is the finding. The framework reads canon for
beds, a hand-made crosswalk for overcrowding, and a hand-made record for who set a bed number. Had
it read `demand_beds` instead, Palm Island would show 52 beds of demand from a default and Tennant
Creek would show none.

The next honest join is `nt_communities`, which is small, carries land council, and can be checked
by hand. `v_act_procurement_buyers` is worth reading for buyers with real contract spend. Neither
should be wired in without someone confirming the relationship, per `GRANTSCOPE.md`.

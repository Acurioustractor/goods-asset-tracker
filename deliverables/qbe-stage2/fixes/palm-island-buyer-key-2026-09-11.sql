-- Palm Island buyer-key repair, shared project tednluwflfhxyucgwigh (JusticeHub + GrantScope).
-- Written 11 September 2026. NOT APPLIED: the auto-mode classifier blocks Supabase writes.
--
-- The problem, verified by reading the rows:
--   goods_communities 'PALM ISLAND' carries postcode 4895, which is Cooktown.
--   All 17 rows in goods_procurement_entities linked to it are Cape York and Cooktown
--   organisations (Cooktown Baptist Fellowship, Vera Scarth-Johnson Gallery, and so on).
--   gs_entities holds 21 real Palm Island entities under lga_name = 'Palm Island', all
--   postcode 4816.
--
-- The wider state of the table, which this script does NOT fix:
--   4,551 links total. 3,255 have an entity_id that does not resolve to gs_entities at all.
--   1,231 more disagree with their community's postcode. Palm Island is one instance of a
--   population bug, not the whole of it.
--
-- Run the whole file in one transaction and read the final SELECT before committing.

begin;

-- 1. Keep what is there, so this is reversible.
create table if not exists _backup_goods_palm_island_20260911 as
select e.*
from goods_procurement_entities e
join goods_communities c on c.id = e.community_id
where c.community_name = 'PALM ISLAND';

-- 2. Correct the postcode. Palm Island QLD is 4816; 4895 is Cooktown.
update goods_communities
set postcode = '4816', updated_at = now()
where community_name = 'PALM ISLAND' and postcode = '4895';

-- 3. Remove the Cooktown links.
delete from goods_procurement_entities e
using goods_communities c
where c.id = e.community_id and c.community_name = 'PALM ISLAND';

-- 4. Link the entities that are actually on Palm Island, keyed on LGA rather than postcode,
--    because postcode 4816 also covers mainland localities.
insert into goods_procurement_entities
  (id, community_id, entity_id, gs_id, entity_name, abn, entity_type, buyer_role,
   is_community_controlled, website, created_at, updated_at)
select
  gen_random_uuid(),
  c.id,
  g.id,
  g.gs_id,
  g.canonical_name,
  g.abn,
  g.entity_type,
  case
    when g.canonical_name ilike '%council%'  then 'council'
    when g.canonical_name ilike '%health%'   then 'health_service'
    when g.canonical_name ilike '%store%'    then 'store'
    when g.canonical_name ilike '%school%'   then 'education'
    when g.canonical_name ilike '%arts%'     then 'art_centre'
    else 'community_org'
  end,
  g.is_community_controlled,
  g.website,
  now(), now()
from gs_entities g
cross join (select id from goods_communities where community_name = 'PALM ISLAND') c
where g.lga_name = 'Palm Island';

-- 5. Recompute the counts that the community row publishes.
update goods_communities c
set buyer_entity_count = s.n,
    total_local_entities = s.n,
    updated_at = now()
from (
  select e.community_id, count(*) n
  from goods_procurement_entities e
  join goods_communities gc on gc.id = e.community_id
  where gc.community_name = 'PALM ISLAND'
  group by e.community_id
) s
where c.id = s.community_id;

-- 6. Read this before committing. Expect 21 rows, every name a Palm Island or Bwgcolman one.
select e.entity_name, e.buyer_role, e.is_community_controlled
from goods_procurement_entities e
join goods_communities c on c.id = e.community_id
where c.community_name = 'PALM ISLAND'
order by e.entity_name;

-- commit;
-- rollback;

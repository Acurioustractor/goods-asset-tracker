-- Palm Island buyer-key repair, shared project tednluwflfhxyucgwigh (JusticeHub + GrantScope).
-- Written 11 September 2026, revised after two failures in the SQL editor.
--
-- The problem, verified by reading the rows:
--   public.goods_communities 'PALM ISLAND' carries postcode 4895, which is Cooktown.
--   All 17 rows in goods_procurement_entities linked to it are Cape York and Cooktown bodies
--   (Cooktown Baptist Fellowship, Vera Scarth-Johnson Gallery, and so on). The same 17 are
--   linked to every other community carrying 4895, so Palm Island's copies are not unique data.
--   gs_entities holds 21 real Palm Island entities under lga_name = 'Palm Island', postcode 4816.
--
-- 142 rows in goods_procurement_signals point at those 17 links. Every one is machine-written
-- by goods-lifecycle-sync or goods-procurement-matcher, status 'new', none actioned, none in
-- GHL, no human notes, and all of them belong to Palm Island. They name the wrong buyer, so
-- step 3 clears the pointer and the agents rematch on the next run. Nothing human is lost.
--
-- The wider state of the table, which this script does NOT fix:
--   4,551 links. 3,255 have an entity_id that resolves to nothing. 1,231 more disagree with
--   their community's postcode. Palm Island is one instance of a population bug.
--
-- Every table is schema-qualified. If step 0 does not report 4,551 links and postcode 4895,
-- the editor is on the wrong project. The right one is tednluwflfhxyucgwigh, shown in the
-- dashboard as "JusticeHub + GrantScope".

-- 0. Confirm which database this is before changing anything.
select current_database() as db,
       (select count(*) from public.goods_procurement_entities) as links,
       (select postcode from public.goods_communities where community_name = 'PALM ISLAND') as palm_postcode;

begin;

-- 1. Keep what is there, so this is reversible. Already run on 11 September, holds 17 rows.
create table if not exists public._backup_goods_palm_island_20260911 as
select e.*
from public.goods_procurement_entities e
join public.goods_communities c on c.id = e.community_id
where c.community_name = 'PALM ISLAND';

-- 2. Keep the signal pointers too, so they can be put back.
create table if not exists public._backup_goods_palm_signals_20260911 as
select s.id, s.buyer_entity_id
from public.goods_procurement_signals s
where s.buyer_entity_id in (select id from public._backup_goods_palm_island_20260911);

-- 3. Clear the pointers that name a Cooktown organisation as a Palm Island buyer.
update public.goods_procurement_signals
set buyer_entity_id = null, updated_at = now()
where buyer_entity_id in (select id from public._backup_goods_palm_island_20260911);

-- 4. Correct the postcode. Palm Island QLD is 4816; 4895 is Cooktown.
update public.goods_communities
set postcode = '4816', updated_at = now()
where community_name = 'PALM ISLAND' and postcode = '4895';

-- 5. Remove the Cooktown links.
delete from public.goods_procurement_entities e
using public.goods_communities c
where c.id = e.community_id and c.community_name = 'PALM ISLAND';

-- 6. Link the entities actually on Palm Island, keyed on LGA rather than postcode, because
--    4816 also covers mainland localities.
insert into public.goods_procurement_entities
  (id, community_id, entity_id, gs_id, entity_name, abn, entity_type, buyer_role,
   is_community_controlled, website, created_at, updated_at)
select
  gen_random_uuid(), c.id, g.id, g.gs_id, g.canonical_name, g.abn, g.entity_type,
  case
    when g.canonical_name ilike '%council%'  then 'council'
    when g.canonical_name ilike '%health%'   then 'health_service'
    when g.canonical_name ilike '%store%'    then 'store'
    when g.canonical_name ilike '%school%'   then 'education'
    when g.canonical_name ilike '%arts%'     then 'art_centre'
    else 'community_org'
  end,
  g.is_community_controlled, g.website, now(), now()
from public.gs_entities g
cross join (select id from public.goods_communities where community_name = 'PALM ISLAND') c
where g.lga_name = 'Palm Island';

-- 7. Recompute the counts the community row publishes.
update public.goods_communities c
set buyer_entity_count = s.n, total_local_entities = s.n, updated_at = now()
from (
  select e.community_id, count(*) n
  from public.goods_procurement_entities e
  join public.goods_communities gc on gc.id = e.community_id
  where gc.community_name = 'PALM ISLAND'
  group by e.community_id
) s
where c.id = s.community_id;

-- 8. Read this before committing. Expect 21 rows, every name a Palm Island or Bwgcolman one,
--    and 142 signals now carrying no buyer.
select e.entity_name, e.buyer_role, e.is_community_controlled
from public.goods_procurement_entities e
join public.goods_communities c on c.id = e.community_id
where c.community_name = 'PALM ISLAND'
order by e.entity_name;

select count(*) as signals_cleared
from public.goods_procurement_signals
where buyer_entity_id is null
  and community_id = (select id from public.goods_communities where community_name = 'PALM ISLAND');

-- commit;
-- rollback;

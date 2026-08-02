-- The community identity seam: Goods slug <-> Empathy Ledger community uuid.
--
-- WHY THIS IS AN EXPLICIT MAP AND NOT A SLUG JOIN.
-- EL's 2026-08-02 Goods seed created 'kalgoorlie-community' and
-- 'tennant-creek-community'. Goods calls the same two places 'kalgoorlie' and
-- 'tennant-creek'. A slug join therefore matches five of seven and silently
-- drops the other two: no error, no null, just two communities that quietly
-- have no stories and no relationship stage. Verified against both live
-- databases 2026-08-02. The map is written out, and check:community-seam
-- asserts every row still resolves on both sides.
--
-- Goods stays authoritative for facilities, assets and production.
-- EL stays authoritative for people, consent, stories and relationship stage.
-- This column is the only thing that crosses.

alter table public.communities
  add column if not exists el_community_id uuid;

create unique index if not exists communities_el_community_id_uidx
  on public.communities (el_community_id)
  where el_community_id is not null;

comment on column public.communities.el_community_id is
  'Empathy Ledger public.communities.id. One EL community, one Goods community. '
  'Never derive this from a slug: two of the seven seeded slugs differ. '
  'Guarded by v2/scripts/check-community-seam.mjs.';

update public.communities c
set el_community_id = m.el_id::uuid
from (values
  ('alice-springs',  'c0a10001-0000-0000-0000-000000000001'),
  ('palm-island',    'c0a20002-0000-0000-0000-000000000001'),
  ('utopia',         'a1461377-945d-40ba-861e-2ed358e560da'),
  ('tennant-creek',  'e92ffa29-b0c1-496e-9ba1-4299b72ade05'),
  ('maningrida',     '4a96d728-422b-4811-ba4f-912b49cf9eaf'),
  ('kalgoorlie',     '4bd1b241-8def-4c71-af77-6f87ab76360c'),
  ('darwin',         'eee42a8b-54c5-4140-a50e-309e9847bf7e')
) as m(goods_id, el_id)
where c.id = m.goods_id
  and c.el_community_id is distinct from m.el_id::uuid;

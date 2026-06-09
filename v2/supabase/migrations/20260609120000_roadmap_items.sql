-- Shared Goods roadmap. Powers the partner-dashboard kanban (group by status)
-- AND the engagement timeline (rows with show_in_timeline, ordered by event_date).
-- One source, two views. Cards "move" by updating status + position (drag-drop admin).
--
-- Apply with the Supabase CLI (`supabase db push`) or the SQL editor, targeting
-- the Goods project (cwsyhpiuepvdjtxaozwf). Writes happen via the service-role
-- key in admin API routes (bypasses RLS); public read is for the dashboards.

create table if not exists public.roadmap_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  note text,
  status text not null default 'up-next' check (status in ('up-next','in-progress','done')),
  position double precision not null default 0,   -- fractional index for drag-drop reorder
  event_date date,                                -- for chronological timeline sort
  date_label text,                                -- friendly timeline label, e.g. "Apr 2025", "To date"
  show_in_kanban boolean not null default true,
  show_in_timeline boolean not null default false,
  partner_slug text,                              -- null = shown on all partner dashboards
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.roadmap_items enable row level security;

-- Partner dashboards render server-side with the anon key; allow read of public rows.
drop policy if exists "roadmap public read" on public.roadmap_items;
create policy "roadmap public read" on public.roadmap_items
  for select using (is_public = true);

create or replace function public.set_roadmap_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;
drop trigger if exists roadmap_items_set_updated_at on public.roadmap_items;
create trigger roadmap_items_set_updated_at before update on public.roadmap_items
  for each row execute function public.set_roadmap_updated_at();

-- Seed: the current Goods roadmap (matches the dashboard config as of 2026-06-09).
-- Guarded so re-applying the migration never double-seeds.
do $seed$
begin
  if not exists (select 1 from public.roadmap_items) then
    insert into public.roadmap_items
      (title, note, status, position, event_date, date_label, show_in_kanban, show_in_timeline) values
      -- Kanban: Up next
      ('Community siting decision for the plant','Tennant Creek or Mparntwe','up-next',10,null,null,true,false),
      ('Katrina: train-the-trainer at Witta','Skills travel home to run the Alice Springs build','up-next',20,null,null,true,false),
      ('QBE Catalysing Impact, Stage 2','September; could bring matched catalytic capital','up-next',30,null,null,true,false),
      ('Investment + loan opportunity with Snow','Exploring recoverable / impact-investment finance; intro to Bhanvi via Snow','up-next',40,null,null,true,false),
      -- Kanban: In progress
      ('Commission the on-country production plant','~85% complete','in-progress',10,null,null,true,false),
      ('Alice Springs facility with Oonchiumpa','REAL Innovation Fund submission lodged, decision pending','in-progress',20,null,null,true,false),
      ('New washing machine prototype','Next-generation build in development now','in-progress',30,null,null,true,false),
      ('The Butterfly Movement charity transition','Goods DGR home; Aboriginal-led board forming','in-progress',40,null,null,true,false),
      -- Kanban: Done
      ('496 beds delivered across 9 communities',null,'done',10,null,null,true,false),
      ('Containerised production plant built','Recycled-plastic line','done',20,null,null,true,false),
      ('28 washing machines deployed, 14 reporting live',null,'done',30,null,null,true,false),
      ('Utopia + Alice Springs trip, May 2026','87 beds that trip','done',40,null,null,true,false),
      -- Timeline (where we have come from, and where we are going)
      ('Snow becomes an anchor backer','Support before the proof was in the houses','done',100,'2023-01-01','2023',false,true),
      ('Grant 2024/OC0014','Multi-year support across beds, the production facility, and the team','done',110,'2024-01-01','2024',false,true),
      ('Snow visits Tennant Creek with us','Sally Grimsley-Ballard on country on 2 April 2025, seeing the work first-hand','done',120,'2025-04-02','Apr 2025',false,true),
      ('Deadly Heart Trek, Katherine','Out on the Katherine visit, 8 August 2025','done',130,'2025-08-08','Aug 2025',false,true),
      ('First washing machine given to Dianne Stokes','In Tennant Creek. She named it Pakkimjalki Kari in Warumungu','done',140,'2026-01-15','Jan 2026',false,true),
      ('Selected into QBE Catalysing Impact 2026','Blended-finance accelerator run by the Social Impact Hub','done',150,'2026-03-01','Early 2026',false,true),
      ('Central Australia deployment','Utopia + Alice Springs; 87 beds that trip, with Centrecorp','done',160,'2026-05-21','May 2026',false,true),
      ('Oonchiumpa REAL Innovation Fund submission','A community-owned Alice Springs facility + jobs pathway, decision pending','done',170,'2026-06-02','Jun 2026',false,true),
      ('~$493K invested by Snow over three years','Fully received. The anchor that makes the blended raise credible','done',900,null,'To date',false,true);
  end if;
end $seed$;

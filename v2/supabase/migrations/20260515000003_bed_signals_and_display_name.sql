-- Bed scan UX signals — pulses, reminders, scheduled check-ins, demand bumps, name changes.
-- All write paths from /bed/{id} that aren't a story/photo/support ticket land here.

create table if not exists bed_signals (
  id uuid primary key default gen_random_uuid(),
  asset_id text not null references assets(unique_id) on delete cascade,
  signal_type text not null check (signal_type in ('pulse','reminder','check_in','demand_bump','name_change','workshop_interest')),
  signal_value text,
  payload jsonb not null default '{}'::jsonb,
  contact text,
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  created_by text
);

create index if not exists bed_signals_asset_idx on bed_signals(asset_id);
create index if not exists bed_signals_type_idx on bed_signals(signal_type, created_at desc);
create index if not exists bed_signals_pending_idx on bed_signals(scheduled_for) where scheduled_for is not null and sent_at is null;

-- Display name = what the recipient calls their bed (kids name beds). Public unless set otherwise.
alter table assets add column if not exists display_name text;
alter table assets add column if not exists display_name_public boolean not null default true;
alter table assets add column if not exists display_name_set_at timestamptz;
alter table assets add column if not exists display_name_set_by text;

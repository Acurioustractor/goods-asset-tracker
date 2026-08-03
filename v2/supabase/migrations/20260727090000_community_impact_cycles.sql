-- Community Impact Cycle foundation.
--
-- Private by default. Goods does not yet have a reliable model connecting an
-- authenticated profile to authority for a community, so all access is
-- service-role only until explicit authority records and community review
-- invitations are implemented.

create table if not exists public.community_impact_cycles (
  id uuid primary key default gen_random_uuid(),
  community_id text not null references public.communities(id) on delete cascade,
  title text not null,
  purpose text not null,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'paused', 'completed', 'archived')),
  local_language_name text,
  lead_organisation text,
  authority_summary text,
  decision_protocol text,
  data_custody_preference text,
  review_cadence text,
  next_review_at timestamptz,
  approved_for_public_summary boolean not null default false,
  public_summary_approved_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_impact_cycles_community_idx
  on public.community_impact_cycles (community_id, status);
create index if not exists community_impact_cycles_review_idx
  on public.community_impact_cycles (next_review_at)
  where status = 'active';

create table if not exists public.community_impact_authorities (
  id uuid primary key default gen_random_uuid(),
  impact_cycle_id uuid not null references public.community_impact_cycles(id) on delete cascade,
  authority_type text not null
    check (authority_type in ('cultural', 'operational', 'data', 'story', 'publication', 'review')),
  person_or_group_name text not null,
  organisation_name text,
  scope text not null,
  confirmation_method text,
  confirmed_at timestamptz,
  review_on timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_impact_authorities_cycle_idx
  on public.community_impact_authorities (impact_cycle_id, authority_type, is_active);

create table if not exists public.community_impact_goals (
  id uuid primary key default gen_random_uuid(),
  impact_cycle_id uuid not null references public.community_impact_cycles(id) on delete cascade,
  local_name text not null,
  why_it_matters text not null,
  desired_change text not null,
  unacceptable_changes text[] not null default '{}',
  goods_domain_mappings text[] not null default '{}',
  baseline_value numeric,
  baseline_unit text,
  baseline_description text,
  baseline_observed_at timestamptz,
  desired_direction text
    check (desired_direction is null or desired_direction in (
      'increase', 'decrease', 'maintain', 'locally_defined'
    )),
  target_value numeric,
  target_unit text,
  target_date date,
  review_cadence text,
  next_review_at timestamptz,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'paused', 'met', 'retired')),
  release_state text not null default 'private'
    check (release_state in (
      'private', 'community_review', 'approved_with_conditions',
      'released', 'expired', 'withdrawn'
    )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (target_value is null and target_unit is null)
    or (target_value is not null and target_unit is not null)
  )
);

create index if not exists community_impact_goals_cycle_idx
  on public.community_impact_goals (impact_cycle_id, status);
create index if not exists community_impact_goals_review_idx
  on public.community_impact_goals (next_review_at)
  where status = 'active';

create table if not exists public.community_impact_observations (
  id uuid primary key default gen_random_uuid(),
  impact_cycle_id uuid not null references public.community_impact_cycles(id) on delete cascade,
  goal_id uuid references public.community_impact_goals(id) on delete set null,
  observation_type text not null
    check (observation_type in (
      'operational_event', 'measurement', 'participant_account',
      'reflection', 'group_deliberation', 'document', 'external_verification'
    )),
  title text not null,
  description text not null,
  occurred_at timestamptz not null,
  expectedness text
    check (expectedness is null or expectedness in ('expected', 'unexpected')),
  direction text
    check (direction is null or direction in ('positive', 'negative', 'mixed', 'neutral')),
  evidence_system text not null
    check (evidence_system in ('goods', 'empathy_ledger', 'community_impact_cycle', 'external')),
  evidence_type text not null,
  evidence_external_id text,
  evidence_url text,
  evidence_version text,
  source_start_seconds numeric check (source_start_seconds is null or source_start_seconds >= 0),
  source_end_seconds numeric check (source_end_seconds is null or source_end_seconds >= 0),
  speaker_name text,
  speaker_storyteller_id text,
  consent_state text not null default 'pending'
    check (consent_state in (
      'pending', 'user_attested', 'approved', 'restricted',
      'declined', 'revoked', 'not_required'
    )),
  consent_basis text,
  approved_purposes text[] not null default '{}',
  approved_audiences text[] not null default '{}',
  claim_boundary text not null,
  evidence_strength text not null
    check (evidence_strength in (
      'direct_operational_record', 'direct_participant_account',
      'repeated_independent_accounts', 'corroborated_account',
      'community_deliberation', 'documentary_evidence',
      'independent_substantiation', 'evaluator_interpretation',
      'plausible_contribution', 'causal_estimate'
    )),
  restricted boolean not null default true,
  follow_up_needed boolean not null default false,
  follow_up_on timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    source_start_seconds is null
    or source_end_seconds is null
    or source_end_seconds > source_start_seconds
  )
);

create index if not exists community_impact_observations_cycle_idx
  on public.community_impact_observations (impact_cycle_id, occurred_at desc);
create index if not exists community_impact_observations_goal_idx
  on public.community_impact_observations (goal_id, occurred_at desc)
  where goal_id is not null;
create unique index if not exists community_impact_observations_external_evidence_uidx
  on public.community_impact_observations (
    impact_cycle_id, evidence_system, evidence_type, evidence_external_id, evidence_version
  )
  where evidence_external_id is not null;

create table if not exists public.community_impact_deliberations (
  id uuid primary key default gen_random_uuid(),
  impact_cycle_id uuid not null references public.community_impact_cycles(id) on delete cascade,
  goal_id uuid references public.community_impact_goals(id) on delete set null,
  title text not null,
  held_at timestamptz not null,
  participants_summary text not null,
  authority_basis text not null,
  authority_ids uuid[] not null default '{}',
  observation_ids uuid[] not null default '{}',
  what_matters text not null,
  selected_change text,
  selection_reason text,
  dissent text[] not null default '{}',
  harms_or_burdens text[] not null default '{}',
  approved_claim_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_impact_deliberations_cycle_idx
  on public.community_impact_deliberations (impact_cycle_id, held_at desc);

create table if not exists public.community_impact_decisions (
  id uuid primary key default gen_random_uuid(),
  impact_cycle_id uuid not null references public.community_impact_cycles(id) on delete cascade,
  deliberation_id uuid references public.community_impact_deliberations(id) on delete set null,
  question text not null,
  evidence_ids uuid[] not null default '{}',
  authority_ids uuid[] not null default '{}',
  options text[] not null default '{}',
  decision text not null,
  rationale text not null,
  dissent text[] not null default '{}',
  action_owner text,
  due_at timestamptz,
  affected_goal_ids uuid[] not null default '{}',
  follow_up_at timestamptz,
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'completed', 'reconsidered')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_impact_decisions_cycle_idx
  on public.community_impact_decisions (impact_cycle_id, status, due_at);

create table if not exists public.community_ownership_milestones (
  id uuid primary key default gen_random_uuid(),
  impact_cycle_id uuid not null references public.community_impact_cycles(id) on delete cascade,
  dimension text not null
    check (dimension in (
      'assets', 'operations', 'money', 'capability',
      'demand', 'knowledge_ip', 'data', 'narrative'
    )),
  stage text not null
    check (stage in ('goods_led', 'shared', 'community_led', 'community_controlled')),
  evidence_ids uuid[] not null default '{}',
  decided_at timestamptz,
  next_decision text,
  next_review_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (impact_cycle_id, dimension)
);

create index if not exists community_ownership_milestones_review_idx
  on public.community_ownership_milestones (next_review_at)
  where next_review_at is not null;

create or replace function public.touch_community_impact_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'community_impact_cycles',
    'community_impact_authorities',
    'community_impact_goals',
    'community_impact_observations',
    'community_impact_deliberations',
    'community_impact_decisions',
    'community_ownership_milestones'
  ]
  loop
    execute format('drop trigger if exists %I on public.%I', table_name || '_touch_updated_at', table_name);
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.touch_community_impact_updated_at()',
      table_name || '_touch_updated_at',
      table_name
    );
  end loop;
end;
$$;

alter table public.community_impact_cycles enable row level security;
alter table public.community_impact_authorities enable row level security;
alter table public.community_impact_goals enable row level security;
alter table public.community_impact_observations enable row level security;
alter table public.community_impact_deliberations enable row level security;
alter table public.community_impact_decisions enable row level security;
alter table public.community_ownership_milestones enable row level security;

create policy "Service role manages community impact cycles"
  on public.community_impact_cycles for all
  using (auth.jwt() ->> 'role' = 'service_role')
  with check (auth.jwt() ->> 'role' = 'service_role');
create policy "Service role manages community impact authorities"
  on public.community_impact_authorities for all
  using (auth.jwt() ->> 'role' = 'service_role')
  with check (auth.jwt() ->> 'role' = 'service_role');
create policy "Service role manages community impact goals"
  on public.community_impact_goals for all
  using (auth.jwt() ->> 'role' = 'service_role')
  with check (auth.jwt() ->> 'role' = 'service_role');
create policy "Service role manages community impact observations"
  on public.community_impact_observations for all
  using (auth.jwt() ->> 'role' = 'service_role')
  with check (auth.jwt() ->> 'role' = 'service_role');
create policy "Service role manages community impact deliberations"
  on public.community_impact_deliberations for all
  using (auth.jwt() ->> 'role' = 'service_role')
  with check (auth.jwt() ->> 'role' = 'service_role');
create policy "Service role manages community impact decisions"
  on public.community_impact_decisions for all
  using (auth.jwt() ->> 'role' = 'service_role')
  with check (auth.jwt() ->> 'role' = 'service_role');
create policy "Service role manages community ownership milestones"
  on public.community_ownership_milestones for all
  using (auth.jwt() ->> 'role' = 'service_role')
  with check (auth.jwt() ->> 'role' = 'service_role');

grant all on table public.community_impact_cycles to service_role;
grant all on table public.community_impact_authorities to service_role;
grant all on table public.community_impact_goals to service_role;
grant all on table public.community_impact_observations to service_role;
grant all on table public.community_impact_deliberations to service_role;
grant all on table public.community_impact_decisions to service_role;
grant all on table public.community_ownership_milestones to service_role;

comment on table public.community_impact_cycles is
  'Private community-led goal, evidence, review and decision cycles.';
comment on table public.community_impact_observations is
  'Evidence references only. Story and transcript content remains canonical in Empathy Ledger.';

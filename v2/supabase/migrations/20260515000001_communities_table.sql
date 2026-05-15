-- Communities: canonical reference table for every On-Country community
-- Goods has deployed to, is exploring, or has documented demand from.
-- Resolves drift between compendium.ts, assets.community (free-text),
-- crm_deals organisation names, and expansion-targets.ts.

CREATE TABLE IF NOT EXISTS communities (
  id text PRIMARY KEY,                 -- slug, e.g. 'palm-island'
  name text NOT NULL,                  -- canonical display name, matches assets.community
  traditional_name text,               -- Bwgcolman, Wumpurrarni, etc
  state text NOT NULL CHECK (state IN ('NT','QLD','WA','SA','VIC','NSW','TAS','ACT')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','testing','exploring','prospect','administrative')),
  partner text,                        -- PICC, Wilya Janta, Oonchiumpa, etc
  contacts text[] DEFAULT '{}',
  region text,
  lat numeric,
  lng numeric,
  name_aliases text[] DEFAULT '{}',    -- e.g. ['Mt Isa','Mount Isa']
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS communities_state_idx ON communities(state);
CREATE INDEX IF NOT EXISTS communities_status_idx ON communities(status);
CREATE UNIQUE INDEX IF NOT EXISTS communities_name_idx ON communities(lower(name));

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can manage communities" ON communities;
CREATE POLICY "Authenticated users can manage communities" ON communities
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public can read communities" ON communities;
CREATE POLICY "Public can read communities" ON communities
  FOR SELECT TO anon USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_communities_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS communities_updated_at ON communities;
CREATE TRIGGER communities_updated_at
  BEFORE UPDATE ON communities
  FOR EACH ROW EXECUTE FUNCTION update_communities_updated_at();

-- Demand records: requests, allocations, and exploration interest
-- separate from assets (which is fulfilment) and crm_deals (which is revenue)
CREATE TABLE IF NOT EXISTS community_demand (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id text NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  requested_by text,                   -- "Dianne Stokes", "Norman Frank"
  product text NOT NULL DEFAULT 'Stretch Bed',
  qty integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('exploring','requested','approved','allocated','fulfilled','dropped')),
  estimated_value_cents bigint,
  request_date date,
  target_date date,
  source text,                         -- 'community_voice', 'meeting', 'email', 'compendium'
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_demand_community_idx ON community_demand(community_id);
CREATE INDEX IF NOT EXISTS community_demand_status_idx ON community_demand(status);

ALTER TABLE community_demand ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can manage community demand" ON community_demand;
CREATE POLICY "Authenticated users can manage community demand" ON community_demand
  FOR ALL USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS community_demand_updated_at ON community_demand;
CREATE TRIGGER community_demand_updated_at
  BEFORE UPDATE ON community_demand
  FOR EACH ROW EXECUTE FUNCTION update_communities_updated_at();

-- Rollup view: per-community demand vs supply
-- assets.community is free-text, so we join on either communities.name OR an alias
CREATE OR REPLACE VIEW community_rollup AS
SELECT
  c.id,
  c.name,
  c.traditional_name,
  c.state,
  c.status,
  c.partner,
  c.lat,
  c.lng,
  -- assets fulfilment (count rows weighted by quantity)
  COALESCE(asset_stats.deployed_beds, 0)        AS deployed_beds,
  COALESCE(asset_stats.deployed_machines, 0)    AS deployed_machines,
  COALESCE(asset_stats.allocated_beds, 0)       AS allocated_beds,
  COALESCE(asset_stats.requested_beds, 0)       AS requested_beds,
  COALESCE(asset_stats.ready_beds, 0)           AS ready_beds,
  COALESCE(asset_stats.retired_assets, 0)       AS retired_assets,
  -- demand
  COALESCE(demand_stats.open_demand_qty, 0)     AS open_demand_qty,
  COALESCE(demand_stats.open_demand_value_cents, 0) AS open_demand_value_cents,
  -- crm deal value (active deals)
  COALESCE(deal_stats.active_pipeline_cents, 0) AS active_pipeline_cents,
  COALESCE(deal_stats.won_revenue_cents, 0)     AS won_revenue_cents
FROM communities c
LEFT JOIN LATERAL (
  SELECT
    SUM(CASE WHEN a.status = 'deployed' AND a.product ILIKE '%bed%' THEN COALESCE(a.quantity,1) ELSE 0 END) AS deployed_beds,
    SUM(CASE WHEN a.status = 'deployed' AND a.product ILIKE '%machine%' THEN COALESCE(a.quantity,1) ELSE 0 END) AS deployed_machines,
    SUM(CASE WHEN a.status = 'allocated' AND a.product ILIKE '%bed%' THEN COALESCE(a.quantity,1) ELSE 0 END) AS allocated_beds,
    SUM(CASE WHEN a.status = 'requested' AND a.product ILIKE '%bed%' THEN COALESCE(a.quantity,1) ELSE 0 END) AS requested_beds,
    SUM(CASE WHEN a.status = 'ready' AND a.product ILIKE '%bed%' THEN COALESCE(a.quantity,1) ELSE 0 END) AS ready_beds,
    SUM(CASE WHEN a.status = 'retired' THEN COALESCE(a.quantity,1) ELSE 0 END) AS retired_assets
  FROM assets a
  WHERE lower(a.community) = lower(c.name)
     OR lower(a.community) = ANY(SELECT lower(unnest(c.name_aliases)))
) asset_stats ON TRUE
LEFT JOIN LATERAL (
  SELECT
    SUM(qty) AS open_demand_qty,
    SUM(COALESCE(estimated_value_cents,0)) AS open_demand_value_cents
  FROM community_demand d
  WHERE d.community_id = c.id
    AND d.status IN ('exploring','requested','approved','allocated')
) demand_stats ON TRUE
LEFT JOIN LATERAL (
  SELECT
    SUM(CASE WHEN cd.pipeline_stage NOT IN ('won','lost') THEN COALESCE(cd.amount_cents,0) ELSE 0 END) AS active_pipeline_cents,
    SUM(CASE WHEN cd.pipeline_stage = 'won' THEN COALESCE(cd.amount_cents,0) ELSE 0 END) AS won_revenue_cents
  FROM crm_deals cd
  WHERE cd.metadata->>'community_id' = c.id
) deal_stats ON TRUE;

-- View grant
GRANT SELECT ON community_rollup TO anon, authenticated;

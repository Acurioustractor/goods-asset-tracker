-- Add canonical FK from assets to communities.
-- The free-text `community` column stays (denormalised for backward compat),
-- but community_id is now the authoritative join key.

ALTER TABLE assets
  ADD COLUMN IF NOT EXISTS community_id text REFERENCES communities(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS assets_community_id_idx ON assets(community_id);

-- Replace the rollup view: prefer community_id, fall back to legacy name match
-- (the fallback is removed once backfill is complete and all writes use community_id).
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
  COALESCE(asset_stats.deployed_beds, 0)        AS deployed_beds,
  COALESCE(asset_stats.deployed_machines, 0)    AS deployed_machines,
  COALESCE(asset_stats.allocated_beds, 0)       AS allocated_beds,
  COALESCE(asset_stats.requested_beds, 0)       AS requested_beds,
  COALESCE(asset_stats.ready_beds, 0)           AS ready_beds,
  COALESCE(asset_stats.retired_assets, 0)       AS retired_assets,
  COALESCE(demand_stats.open_demand_qty, 0)     AS open_demand_qty,
  COALESCE(demand_stats.open_demand_value_cents, 0) AS open_demand_value_cents,
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
  WHERE
    a.community_id = c.id
    OR (
      a.community_id IS NULL AND (
        lower(a.community) = lower(c.name)
        OR lower(a.community) = ANY(SELECT lower(unnest(c.name_aliases)))
      )
    )
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

GRANT SELECT ON community_rollup TO anon, authenticated;

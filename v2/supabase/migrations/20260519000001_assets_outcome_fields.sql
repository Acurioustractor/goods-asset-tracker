-- Outcome capture columns on assets: lets the field team record household_size,
-- a theme tag for impact-report grouping, and an explicit recipient_consent_at
-- timestamp that downstream outcomes reports can filter on.

ALTER TABLE assets
  ADD COLUMN IF NOT EXISTS household_size integer
    CHECK (household_size IS NULL OR (household_size > 0 AND household_size < 50)),
  ADD COLUMN IF NOT EXISTS theme_tag text
    CHECK (theme_tag IS NULL OR theme_tag IN (
      'practical-need',
      'circular-value',
      'youth-pathway',
      'local-production',
      'health-comfort'
    )),
  ADD COLUMN IF NOT EXISTS recipient_consent_at timestamptz;

CREATE INDEX IF NOT EXISTS assets_theme_tag_idx ON assets(theme_tag) WHERE theme_tag IS NOT NULL;
CREATE INDEX IF NOT EXISTS assets_recipient_consent_idx ON assets(recipient_consent_at) WHERE recipient_consent_at IS NOT NULL;

-- Extend community_rollup with household reach + consent counts so per-partner
-- outcomes reports can move from "60+ direct people" to a real reach figure.
-- DROP + CREATE (not CREATE OR REPLACE): the two new columns slot into the
-- middle of the column list, and Postgres only lets CREATE OR REPLACE append
-- at the end. Nothing depends on this view (read by name via PostgREST only).
DROP VIEW IF EXISTS community_rollup;
CREATE VIEW community_rollup AS
SELECT
  c.id,
  c.name,
  c.traditional_name,
  c.state,
  c.status,
  c.partner,
  c.lat,
  c.lng,
  COALESCE(asset_stats.deployed_beds, 0)            AS deployed_beds,
  COALESCE(asset_stats.deployed_machines, 0)        AS deployed_machines,
  COALESCE(asset_stats.allocated_beds, 0)           AS allocated_beds,
  COALESCE(asset_stats.requested_beds, 0)           AS requested_beds,
  COALESCE(asset_stats.ready_beds, 0)               AS ready_beds,
  COALESCE(asset_stats.retired_assets, 0)           AS retired_assets,
  COALESCE(asset_stats.household_reach, 0)          AS household_reach,
  COALESCE(asset_stats.households_with_consent, 0)  AS households_with_consent,
  COALESCE(demand_stats.open_demand_qty, 0)         AS open_demand_qty,
  COALESCE(demand_stats.open_demand_value_cents, 0) AS open_demand_value_cents,
  COALESCE(deal_stats.active_pipeline_cents, 0)     AS active_pipeline_cents,
  COALESCE(deal_stats.won_revenue_cents, 0)         AS won_revenue_cents
FROM communities c
LEFT JOIN LATERAL (
  SELECT
    SUM(CASE WHEN a.status = 'deployed' AND a.product ILIKE '%bed%' THEN COALESCE(a.quantity,1) ELSE 0 END) AS deployed_beds,
    SUM(CASE WHEN a.status = 'deployed' AND a.product ILIKE '%machine%' THEN COALESCE(a.quantity,1) ELSE 0 END) AS deployed_machines,
    SUM(CASE WHEN a.status = 'allocated' AND a.product ILIKE '%bed%' THEN COALESCE(a.quantity,1) ELSE 0 END) AS allocated_beds,
    SUM(CASE WHEN a.status = 'requested' AND a.product ILIKE '%bed%' THEN COALESCE(a.quantity,1) ELSE 0 END) AS requested_beds,
    SUM(CASE WHEN a.status = 'ready' AND a.product ILIKE '%bed%' THEN COALESCE(a.quantity,1) ELSE 0 END) AS ready_beds,
    SUM(CASE WHEN a.status = 'retired' THEN COALESCE(a.quantity,1) ELSE 0 END) AS retired_assets,
    SUM(CASE WHEN a.status = 'deployed' AND a.household_size IS NOT NULL THEN a.household_size ELSE 0 END) AS household_reach,
    COUNT(*) FILTER (WHERE a.status = 'deployed' AND a.recipient_consent_at IS NOT NULL) AS households_with_consent
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

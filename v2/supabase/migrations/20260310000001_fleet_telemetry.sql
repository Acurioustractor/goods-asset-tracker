-- Fleet Telemetry: Extend usage_logs, add machine linking, commentary, rollups, KPI function
-- For Openfields Solutions washing machine monitoring

-- ============================================================================
-- 1a. Extend usage_logs with telemetry columns
-- ============================================================================

ALTER TABLE usage_logs
  ADD COLUMN IF NOT EXISTS event_type TEXT,
  ADD COLUMN IF NOT EXISTS event_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS machine_id TEXT,
  ADD COLUMN IF NOT EXISTS site_name TEXT,
  ADD COLUMN IF NOT EXISTS firmware_version TEXT,
  ADD COLUMN IF NOT EXISTS restart_counter INTEGER,
  ADD COLUMN IF NOT EXISTS energy_kwh_total NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS cycle_count_total INTEGER,
  ADD COLUMN IF NOT EXISTS signal_rssi INTEGER,
  ADD COLUMN IF NOT EXISTS online BOOLEAN DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_usage_logs_asset_created
  ON usage_logs (asset_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_usage_logs_event_id
  ON usage_logs (event_id) WHERE event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_usage_logs_machine_id
  ON usage_logs (machine_id) WHERE machine_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_usage_logs_event_type
  ON usage_logs (event_type) WHERE event_type IS NOT NULL;

-- ============================================================================
-- 1b. Add machine_id to assets (links Openfields machine names to asset registry)
-- ============================================================================

ALTER TABLE assets
  ADD COLUMN IF NOT EXISTS machine_id TEXT;

CREATE INDEX IF NOT EXISTS idx_assets_machine_id
  ON assets (machine_id) WHERE machine_id IS NOT NULL;

-- ============================================================================
-- 1c. Machine commentary table (operational notes from weekly reports)
-- Note: asset_id is TEXT referencing assets.unique_id (the actual PK)
-- ============================================================================

CREATE TABLE IF NOT EXISTS machine_commentary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id TEXT NOT NULL,
  asset_id TEXT,
  commentary TEXT NOT NULL,
  commentary_type TEXT NOT NULL DEFAULT 'observation',
  created_by TEXT,
  report_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_machine_commentary_machine
  ON machine_commentary (machine_id, created_at DESC);

-- ============================================================================
-- 1d. Daily machine rollups (materialized view for dashboard performance)
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS daily_machine_rollups AS
SELECT
  machine_id,
  DATE(created_at) AS rollup_date,
  COUNT(*) FILTER (WHERE event_type = 'cycle_complete') AS cycles,
  COALESCE(SUM(power_kwh) FILTER (WHERE event_type = 'cycle_complete'), 0) AS kwh_used,
  CASE
    WHEN COUNT(*) FILTER (WHERE event_type = 'cycle_complete') > 0
    THEN ROUND(
      (SUM(power_kwh) FILTER (WHERE event_type = 'cycle_complete') /
      COUNT(*) FILTER (WHERE event_type = 'cycle_complete'))::numeric,
      2
    )
    ELSE 0
  END AS avg_kwh_per_cycle,
  COUNT(*) FILTER (WHERE event_type = 'restart') AS restart_count,
  MAX(created_at) AS last_seen_at
FROM usage_logs
WHERE machine_id IS NOT NULL
GROUP BY machine_id, DATE(created_at);

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_rollups_machine_date
  ON daily_machine_rollups (machine_id, rollup_date);

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_daily_machine_rollups()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY daily_machine_rollups;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 1e. Fleet KPI function
-- ============================================================================

CREATE OR REPLACE FUNCTION get_fleet_kpis(
  from_date TIMESTAMPTZ DEFAULT now() - INTERVAL '7 days',
  to_date TIMESTAMPTZ DEFAULT now()
)
RETURNS TABLE (
  total_cycles BIGINT,
  total_kwh DOUBLE PRECISION,
  avg_kwh_per_cycle DOUBLE PRECISION,
  machines_online BIGINT,
  machines_total BIGINT,
  open_alerts BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM usage_logs
     WHERE event_type = 'cycle_complete'
       AND created_at BETWEEN from_date AND to_date)::BIGINT AS total_cycles,
    (SELECT COALESCE(SUM(power_kwh), 0) FROM usage_logs
     WHERE event_type = 'cycle_complete'
       AND created_at BETWEEN from_date AND to_date)::DOUBLE PRECISION AS total_kwh,
    (SELECT CASE
       WHEN COUNT(*) > 0
       THEN ROUND((SUM(power_kwh) / COUNT(*))::numeric, 2)::DOUBLE PRECISION
       ELSE 0::DOUBLE PRECISION
     END
     FROM usage_logs
     WHERE event_type = 'cycle_complete'
       AND created_at BETWEEN from_date AND to_date) AS avg_kwh_per_cycle,
    (SELECT COUNT(DISTINCT machine_id) FROM usage_logs
     WHERE online = true
       AND created_at > now() - INTERVAL '24 hours')::BIGINT AS machines_online,
    (SELECT COUNT(DISTINCT machine_id) FROM assets
     WHERE machine_id IS NOT NULL)::BIGINT AS machines_total,
    (SELECT COUNT(*) FROM alerts
     WHERE resolved IS NOT TRUE)::BIGINT AS open_alerts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RLS policies
-- ============================================================================

ALTER TABLE machine_commentary ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (webhook + admin)
CREATE POLICY "Service role full access on machine_commentary"
  ON machine_commentary FOR ALL
  USING (true)
  WITH CHECK (true);

-- Authenticated users can read
CREATE POLICY "Authenticated users can read machine_commentary"
  ON machine_commentary FOR SELECT
  TO authenticated
  USING (true);

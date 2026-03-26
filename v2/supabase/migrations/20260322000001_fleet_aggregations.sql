-- Migration to create an RPC function for aggregating individual machine statistics
-- This replaces the need to run 12+ individual API/DB calls and aggregate them manually in Next.js

CREATE OR REPLACE FUNCTION get_fleet_machine_stats()
RETURNS TABLE (
  machine_id TEXT,
  asset_id TEXT,
  name TEXT,
  community TEXT,
  site_name TEXT,
  firmware_version TEXT,
  online BOOLEAN,
  last_seen_at TIMESTAMPTZ,
  today_cycles BIGINT,
  week_kwh DOUBLE PRECISION,
  week_cycles BIGINT,
  restart_counter INTEGER,
  open_alert_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH latest_logs AS (
    SELECT DISTINCT ON (u.machine_id)
      u.machine_id,
      u.site_name,
      u.firmware_version,
      u.restart_counter,
      u.created_at AS last_seen_at
    FROM usage_logs u
    WHERE u.machine_id IS NOT NULL
    ORDER BY u.machine_id, u.created_at DESC
  ),
  today_stats AS (
    SELECT u.machine_id, COUNT(*) AS today_cycles
    FROM usage_logs u
    WHERE u.event_type = 'cycle_complete'
      AND u.created_at >= DATE_TRUNC('day', now())
      AND u.machine_id IS NOT NULL
    GROUP BY u.machine_id
  ),
  week_stats AS (
    SELECT u.machine_id, 
           COUNT(*) AS week_cycles,
           COALESCE(SUM(u.power_kwh), 0) AS week_kwh
    FROM usage_logs u
    WHERE u.event_type = 'cycle_complete'
      AND u.created_at >= (now() - INTERVAL '7 days')
      AND u.machine_id IS NOT NULL
    GROUP BY u.machine_id
  ),
  recent_machines AS (
    SELECT DISTINCT u.machine_id
    FROM usage_logs u
    WHERE u.created_at >= (now() - INTERVAL '7 days')
      AND u.machine_id IS NOT NULL
  ),
  asset_alerts AS (
    SELECT a.asset_id, COUNT(*) AS open_alert_count
    FROM alerts a
    WHERE a.resolved IS NOT TRUE
      AND a.asset_id IS NOT NULL
    GROUP BY a.asset_id
  )
  SELECT 
    a.machine_id,
    a.unique_id AS asset_id,
    a.name,
    COALESCE(a.community, a.place) AS community,
    l.site_name,
    l.firmware_version,
    CASE WHEN rm.machine_id IS NOT NULL THEN true ELSE false END AS online,
    l.last_seen_at,
    COALESCE(t.today_cycles, 0)::BIGINT AS today_cycles,
    COALESCE(w.week_kwh, 0)::DOUBLE PRECISION AS week_kwh,
    COALESCE(w.week_cycles, 0)::BIGINT AS week_cycles,
    l.restart_counter,
    COALESCE(al.open_alert_count, 0)::BIGINT AS open_alert_count
  FROM assets a
  LEFT JOIN latest_logs l ON a.machine_id = l.machine_id
  LEFT JOIN today_stats t ON a.machine_id = t.machine_id
  LEFT JOIN week_stats w ON a.machine_id = w.machine_id
  LEFT JOIN recent_machines rm ON a.machine_id = rm.machine_id
  LEFT JOIN asset_alerts al ON a.unique_id = al.asset_id
  WHERE a.machine_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

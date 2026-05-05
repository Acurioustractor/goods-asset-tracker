-- Per-machine monthly activity histogram, used by the investigation cards on
-- /admin/fleet to show whether each machine's death was sudden or gradual.

CREATE OR REPLACE FUNCTION get_machine_monthly_activity()
RETURNS TABLE (
  machine_id TEXT,
  month_start DATE,
  events BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.machine_id,
    DATE_TRUNC('month', u.created_at)::DATE AS month_start,
    COUNT(*)::BIGINT AS events
  FROM usage_logs u
  WHERE u.machine_id IS NOT NULL
    AND u.created_at >= now() - INTERVAL '12 months'
    AND u.event_type IN ('cycle_complete', 'heartbeat')
  GROUP BY u.machine_id, DATE_TRUNC('month', u.created_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_machine_monthly_activity() TO anon, authenticated, service_role;

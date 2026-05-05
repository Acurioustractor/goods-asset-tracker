-- Fleet visibility: surface all deployed washing machines, not just telemetry-enabled ones
--
-- get_fleet_machine_stats() filters on `assets.machine_id IS NOT NULL`, so the
-- /admin/fleet dashboard has only ever shown the 10 Tennant Creek machines that
-- were paired with a Particle/named telemetry id. The other ~28 deployed
-- machines (Palm Island, Maningrida, plus several Tennant Creek units that
-- never got hardware) are invisible.
--
-- This RPC returns every washing machine asset with a derived
-- connectivity_status so the UI can group by community and show the gap.

CREATE OR REPLACE FUNCTION get_all_washing_deployments()
RETURNS TABLE (
  unique_id TEXT,
  name TEXT,
  community TEXT,
  place TEXT,
  contact_household TEXT,
  product TEXT,
  supply_date TIMESTAMPTZ,
  last_checkin_date TIMESTAMPTZ,
  asset_status TEXT,
  machine_id TEXT,
  has_telemetry_hw BOOLEAN,
  last_seen_at TIMESTAMPTZ,
  cycles_7d BIGINT,
  kwh_7d DOUBLE PRECISION,
  connectivity_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH telemetry AS (
    SELECT
      u.machine_id,
      MAX(u.created_at) AS last_seen_at,
      COUNT(*) FILTER (WHERE u.event_type = 'cycle_complete'
                         AND u.created_at >= now() - INTERVAL '7 days') AS cycles_7d,
      COALESCE(SUM(u.power_kwh) FILTER (WHERE u.event_type = 'cycle_complete'
                                          AND u.created_at >= now() - INTERVAL '7 days'), 0) AS kwh_7d
    FROM usage_logs u
    WHERE u.machine_id IS NOT NULL
    GROUP BY u.machine_id
  )
  SELECT
    a.unique_id,
    a.name,
    COALESCE(a.community, a.place) AS community,
    a.place,
    a.contact_household,
    a.product,
    a.supply_date,
    a.last_checkin_date,
    a.status AS asset_status,
    a.machine_id,
    (a.machine_id IS NOT NULL) AS has_telemetry_hw,
    t.last_seen_at,
    COALESCE(t.cycles_7d, 0)::BIGINT AS cycles_7d,
    COALESCE(t.kwh_7d, 0)::DOUBLE PRECISION AS kwh_7d,
    CASE
      WHEN a.machine_id IS NULL AND a.name ILIKE '%pending%'
        THEN 'pending_assignment'
      WHEN a.machine_id IS NULL
        THEN 'no_telemetry_hw'
      WHEN t.last_seen_at IS NULL
        THEN 'never_reported'
      WHEN t.last_seen_at >= now() - INTERVAL '24 hours'
        THEN 'reporting'
      WHEN t.last_seen_at >= now() - INTERVAL '7 days'
        THEN 'lagging'
      ELSE 'silent'
    END AS connectivity_status
  FROM assets a
  LEFT JOIN telemetry t ON a.machine_id = t.machine_id
  WHERE a.product ILIKE '%washing machine%'
     OR a.product ILIKE '%pakkimjalki%'
  ORDER BY
    COALESCE(a.community, a.place) NULLS LAST,
    a.supply_date DESC NULLS LAST,
    a.unique_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_all_washing_deployments() TO anon, authenticated, service_role;

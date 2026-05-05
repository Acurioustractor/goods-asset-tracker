-- Fleet telemetry: normalise event_type drift caused by Zapier integration
--
-- Problem: the Zapier path POSTs Particle wash events with event="zapier-new-wash".
-- The webhook handler stored that string verbatim instead of mapping it to
-- "cycle_complete", so 212 historical rows + the daily rollup + the KPI RPC all
-- under-counted real washes. Result: /admin/fleet showed 0 cycles even when
-- machines were active.
--
-- This migration:
--   1) Renames historical event_type='zapier-new-wash' rows to 'cycle_complete'.
--   2) Refreshes the daily_machine_rollups materialized view.
--
-- The webhook handler (v2/src/app/api/webhooks/particle/route.ts) is updated in
-- the same change-set to map the event on insert going forward, so this
-- migration only needs to run once.

UPDATE usage_logs
SET event_type = 'cycle_complete'
WHERE event_type = 'zapier-new-wash';

REFRESH MATERIALIZED VIEW CONCURRENTLY daily_machine_rollups;

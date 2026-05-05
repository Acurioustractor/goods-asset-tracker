-- Webhook receipts log: capture every incoming POST to /api/webhooks/* so we
-- can definitively answer "did Zapier hit us in the last 24h?" without
-- scrolling Vercel logs. The next time the fleet goes silent we want to know
-- in 60 seconds whether the break is upstream of us or downstream.

CREATE TABLE IF NOT EXISTS webhook_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,                  -- 'particle' | 'openfields' | 'stripe' | …
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status_code INTEGER,                   -- HTTP we returned to the caller
  event_type TEXT,                       -- parsed event type if available
  machine_id TEXT,                       -- parsed coreid / machine_id if available
  body_size INTEGER,                     -- bytes
  user_agent TEXT,
  remote_ip TEXT,
  duplicate BOOLEAN DEFAULT false,
  error_message TEXT,
  raw_body JSONB                         -- truncated, optional for debugging
);

CREATE INDEX IF NOT EXISTS idx_webhook_receipts_received
  ON webhook_receipts (received_at DESC);

CREATE INDEX IF NOT EXISTS idx_webhook_receipts_source_received
  ON webhook_receipts (source, received_at DESC);

CREATE INDEX IF NOT EXISTS idx_webhook_receipts_machine
  ON webhook_receipts (machine_id, received_at DESC) WHERE machine_id IS NOT NULL;

ALTER TABLE webhook_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on webhook_receipts"
  ON webhook_receipts FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can read webhook_receipts"
  ON webhook_receipts FOR SELECT
  TO authenticated
  USING (true);

-- Convenience: how many webhooks have arrived per source per day, last 14 days
CREATE OR REPLACE VIEW webhook_receipts_daily AS
SELECT
  DATE(received_at) AS day,
  source,
  COUNT(*) AS receipts,
  COUNT(*) FILTER (WHERE status_code BETWEEN 200 AND 299) AS ok,
  COUNT(*) FILTER (WHERE status_code >= 400) AS errors,
  COUNT(*) FILTER (WHERE duplicate) AS duplicates,
  COUNT(DISTINCT machine_id) FILTER (WHERE machine_id IS NOT NULL) AS distinct_machines
FROM webhook_receipts
WHERE received_at >= now() - INTERVAL '14 days'
GROUP BY DATE(received_at), source
ORDER BY day DESC, source;

GRANT SELECT ON webhook_receipts_daily TO anon, authenticated, service_role;

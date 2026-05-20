-- Track every page view of /bed/[id] as a "scan". Each row is one server-side
-- render of the bed page — i.e. someone (or something) opened the URL the QR
-- sticker resolves to. We log link-preview bots too so we don't silently lose
-- data, but flag them with is_bot so analytics queries can exclude them.

CREATE TABLE IF NOT EXISTS bed_scans (
  id              bigserial PRIMARY KEY,
  unique_id       text NOT NULL REFERENCES assets(unique_id) ON DELETE CASCADE,
  scanned_at      timestamptz NOT NULL DEFAULT now(),
  user_agent      text,
  ip_hash         text,        -- SHA-256(salt || ip), never the raw IP
  referer         text,
  is_bot          boolean NOT NULL DEFAULT false,
  is_admin        boolean NOT NULL DEFAULT false,  -- viewer was a Goods admin
  admin_email     text                              -- only set when is_admin = true
);

-- Hot path: rollups per bed, time-windowed
CREATE INDEX IF NOT EXISTS bed_scans_unique_id_scanned_at_idx
  ON bed_scans (unique_id, scanned_at DESC);

-- Hot path: dashboard time-series across all beds
CREATE INDEX IF NOT EXISTS bed_scans_scanned_at_idx
  ON bed_scans (scanned_at DESC);

-- Filtered index for "real human scans" (excludes bots + admin views) — this
-- is the count most public-facing analytics will use.
CREATE INDEX IF NOT EXISTS bed_scans_real_idx
  ON bed_scans (unique_id, scanned_at DESC)
  WHERE is_bot = false AND is_admin = false;

-- RLS: deny anon reads, allow service role full access. The /bed/[id] page
-- inserts via the service-role client; the /admin/scans page reads via the
-- service-role client. No client-side access needed.
ALTER TABLE bed_scans ENABLE ROW LEVEL SECURITY;

-- (No policies created. With RLS on and no policies, only the service role
-- key can read/write — which is exactly what we want.)

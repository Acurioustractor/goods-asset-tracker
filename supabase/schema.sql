-- Goods Asset Register - Complete Database Schema
-- Supabase PostgreSQL Database
-- Version: 1.0

-- ============================================================================
-- TABLE: assets (Central Asset Registry)
-- ============================================================================

CREATE TABLE IF NOT EXISTS assets (
  -- Identity
  unique_id TEXT PRIMARY KEY,           -- e.g., "GB0-22-3"
  id TEXT NOT NULL,                     -- Original group ID (e.g., "GB0-22")
  name TEXT,                            -- Asset name/recipient
  product TEXT NOT NULL,                -- "Basket Bed" | "ID Washing Machine" | "Weave Bed"

  -- Location & Contact
  community TEXT NOT NULL,              -- Palm Island, Tennant Creek, etc.
  place TEXT,                           -- Full address
  gps TEXT,                             -- Coordinates (if available)
  contact_household TEXT,               -- Contact person/household

  -- Physical Attributes
  paint TEXT,                           -- Color code
  photo TEXT[],                         -- Array of photo URLs

  -- Metadata
  number INTEGER DEFAULT 1,             -- Original group size
  notes TEXT,

  -- Timestamps
  supply_date TIMESTAMPTZ,              -- When delivered
  last_checkin_date TIMESTAMPTZ,        -- Last verified/serviced
  created_time TIMESTAMPTZ DEFAULT NOW(),

  -- QR Integration
  qr_url TEXT                           -- Pre-generated QR target URL
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_assets_community ON assets(community);
CREATE INDEX IF NOT EXISTS idx_assets_product ON assets(product);
CREATE INDEX IF NOT EXISTS idx_assets_community_product ON assets(community, product);
CREATE INDEX IF NOT EXISTS idx_assets_overdue ON assets(last_checkin_date) WHERE last_checkin_date < NOW() - INTERVAL '6 months';

COMMENT ON TABLE assets IS 'Central registry of all 389 individual assets (beds and washers)';

-- ============================================================================
-- TABLE: checkins (Visit/Inspection Records)
-- ============================================================================

CREATE TABLE IF NOT EXISTS checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id TEXT REFERENCES assets(unique_id) ON DELETE CASCADE,

  -- Visit Details
  checkin_date TIMESTAMPTZ DEFAULT NOW(),
  visitor_name TEXT,
  comments TEXT,
  photo_url TEXT,

  -- Asset Status
  status TEXT CHECK (status IN ('Good', 'Needs Repair', 'Damaged', 'Missing', 'Replaced')),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checkins_asset ON checkins(asset_id);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON checkins(checkin_date DESC);

COMMENT ON TABLE checkins IS 'Check-in/inspection records for assets';

-- ============================================================================
-- TABLE: tickets (Support Requests via QR Forms)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id TEXT REFERENCES assets(unique_id) ON DELETE CASCADE,

  -- Submission Details
  submit_date TIMESTAMPTZ DEFAULT NOW(),
  user_name TEXT,
  user_contact TEXT,

  -- Issue Details
  issue_description TEXT NOT NULL,
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  category TEXT,                        -- 'Damage', 'Missing', 'Request Pickup', 'Question'
  photo_urls TEXT[],

  -- Resolution Tracking
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
  assigned_to TEXT,
  resolved_date TIMESTAMPTZ,
  resolution_notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_asset ON tickets(asset_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status) WHERE status != 'Closed';
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority, submit_date DESC);

COMMENT ON TABLE tickets IS 'Support tickets submitted via QR code scans';

-- ============================================================================
-- TABLE: usage_logs (IoT Washer Monitoring)
-- ============================================================================

CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id TEXT REFERENCES assets(unique_id) ON DELETE CASCADE,

  -- Ping Timestamp
  timestamp TIMESTAMPTZ DEFAULT NOW(),

  -- Washer Metrics
  power_kwh FLOAT,                      -- Energy consumption
  cycle_type TEXT,                      -- 'Wash', 'Rinse', 'Spin', 'Idle'
  duration_min INTEGER,                 -- Cycle duration
  water_temp_c FLOAT,                   -- Water temperature (if sensor available)
  status TEXT,                          -- 'Running', 'Idle', 'Error', 'Maintenance Needed'

  -- Raw Data
  raw_ping JSONB,                       -- Full IoT payload for debugging

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_logs_asset ON usage_logs(asset_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_timestamp ON usage_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_status ON usage_logs(status) WHERE status IN ('Error', 'Maintenance Needed');

COMMENT ON TABLE usage_logs IS 'IoT monitoring data from washing machines';

-- ============================================================================
-- TABLE: alerts (Automated Alert System)
-- ============================================================================

CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id TEXT REFERENCES assets(unique_id) ON DELETE CASCADE,

  -- Alert Details
  alert_date TIMESTAMPTZ DEFAULT NOW(),
  type TEXT NOT NULL,                   -- 'Overuse', 'Maintenance Due', 'No Check-in', 'High Priority Ticket'
  severity TEXT DEFAULT 'Medium' CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  details TEXT,

  -- Resolution
  resolved BOOLEAN DEFAULT FALSE,
  resolved_date TIMESTAMPTZ,
  resolved_by TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_asset ON alerts(asset_id);
CREATE INDEX IF NOT EXISTS idx_alerts_unresolved ON alerts(resolved) WHERE resolved = FALSE;
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity, alert_date DESC);

COMMENT ON TABLE alerts IS 'Automated alerts for maintenance, overuse, and high-priority issues';

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function: Auto-update last_checkin_date when check-in is logged
CREATE OR REPLACE FUNCTION update_last_checkin()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE assets
  SET last_checkin_date = NEW.checkin_date
  WHERE unique_id = NEW.asset_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS checkin_updates_asset
AFTER INSERT ON checkins
FOR EACH ROW
EXECUTE FUNCTION update_last_checkin();

COMMENT ON FUNCTION update_last_checkin() IS 'Automatically updates asset last_checkin_date when a check-in is created';

-- Function: Auto-alert on washer overuse or errors
CREATE OR REPLACE FUNCTION trigger_washer_alerts()
RETURNS TRIGGER AS $$
BEGIN
  -- High power consumption
  IF NEW.power_kwh > 5.0 THEN
    INSERT INTO alerts (asset_id, type, severity, details)
    VALUES (NEW.asset_id, 'Overuse', 'High',
            'High power consumption: ' || NEW.power_kwh || ' kWh detected');
  END IF;

  -- Error status
  IF NEW.status = 'Error' THEN
    INSERT INTO alerts (asset_id, type, severity, details)
    VALUES (NEW.asset_id, 'Maintenance Needed', 'Critical',
            'Washer reported error status: ' || COALESCE(NEW.raw_ping->>'error_code', 'Unknown'));
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS usage_alert_trigger
AFTER INSERT ON usage_logs
FOR EACH ROW
EXECUTE FUNCTION trigger_washer_alerts();

COMMENT ON FUNCTION trigger_washer_alerts() IS 'Creates alerts for washer overuse and error conditions';

-- Function: Auto-alert on high priority tickets
CREATE OR REPLACE FUNCTION trigger_ticket_alerts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.priority IN ('High', 'Urgent') THEN
    INSERT INTO alerts (asset_id, type, severity, details)
    VALUES (NEW.asset_id, 'High Priority Ticket',
            CASE WHEN NEW.priority = 'Urgent' THEN 'Critical' ELSE 'High' END,
            'Ticket #' || NEW.id || ': ' || LEFT(NEW.issue_description, 100));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS ticket_alert_trigger
AFTER INSERT ON tickets
FOR EACH ROW
EXECUTE FUNCTION trigger_ticket_alerts();

COMMENT ON FUNCTION trigger_ticket_alerts() IS 'Creates alerts for high-priority and urgent tickets';

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Public access policies (for community members scanning QR codes)

-- Anyone can read assets
CREATE POLICY "Public assets read" ON assets
FOR SELECT USING (true);

-- Anyone can submit tickets
CREATE POLICY "Public ticket insert" ON tickets
FOR INSERT WITH CHECK (true);

-- Anyone can read their own tickets (could be refined with user authentication)
CREATE POLICY "Public ticket read" ON tickets
FOR SELECT USING (true);

-- Staff access policies (authenticated users can manage everything)

-- Staff can manage all assets
CREATE POLICY "Staff manage assets" ON assets
FOR ALL USING (auth.role() = 'authenticated');

-- Staff can manage all checkins
CREATE POLICY "Staff manage checkins" ON checkins
FOR ALL USING (auth.role() = 'authenticated');

-- Staff can manage all tickets
CREATE POLICY "Staff manage tickets" ON tickets
FOR ALL USING (auth.role() = 'authenticated');

-- Staff can view usage logs
CREATE POLICY "Staff view usage logs" ON usage_logs
FOR SELECT USING (auth.role() = 'authenticated');

-- IoT devices can insert usage logs (use service role key)
CREATE POLICY "IoT insert usage logs" ON usage_logs
FOR INSERT WITH CHECK (true);

-- Staff can view alerts
CREATE POLICY "Staff view alerts" ON alerts
FOR SELECT USING (auth.role() = 'authenticated');

-- Staff can resolve alerts
CREATE POLICY "Staff resolve alerts" ON alerts
FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================================
-- REALTIME
-- ============================================================================

-- Enable Realtime for all tables
-- Note: This requires running the following via Supabase Dashboard or API
-- ALTER PUBLICATION supabase_realtime ADD TABLE assets, checkins, tickets, usage_logs, alerts;

-- ============================================================================
-- UTILITY VIEWS
-- ============================================================================

-- View: Overdue assets (no check-in in 6+ months)
CREATE OR REPLACE VIEW overdue_assets AS
SELECT
  unique_id,
  name,
  product,
  community,
  last_checkin_date,
  EXTRACT(DAY FROM NOW() - last_checkin_date) as days_since_checkin
FROM assets
WHERE last_checkin_date < NOW() - INTERVAL '6 months'
   OR last_checkin_date IS NULL
ORDER BY last_checkin_date ASC NULLS FIRST;

COMMENT ON VIEW overdue_assets IS 'Assets that have not been checked in 6+ months';

-- View: Active tickets summary
CREATE OR REPLACE VIEW active_tickets_summary AS
SELECT
  status,
  priority,
  COUNT(*) as count
FROM tickets
WHERE status IN ('Open', 'In Progress')
GROUP BY status, priority
ORDER BY
  CASE priority
    WHEN 'Urgent' THEN 1
    WHEN 'High' THEN 2
    WHEN 'Medium' THEN 3
    WHEN 'Low' THEN 4
  END,
  status;

COMMENT ON VIEW active_tickets_summary IS 'Summary of active tickets by status and priority';

-- View: Community asset health
CREATE OR REPLACE VIEW community_asset_health AS
SELECT
  community,
  COUNT(*) as total_assets,
  SUM(CASE WHEN last_checkin_date > NOW() - INTERVAL '3 months' THEN 1 ELSE 0 END) as recent_checkins,
  SUM(CASE WHEN last_checkin_date < NOW() - INTERVAL '6 months' OR last_checkin_date IS NULL THEN 1 ELSE 0 END) as overdue,
  ROUND(100.0 * SUM(CASE WHEN last_checkin_date > NOW() - INTERVAL '3 months' THEN 1 ELSE 0 END) / COUNT(*), 1) as health_score
FROM assets
GROUP BY community
ORDER BY health_score DESC;

COMMENT ON VIEW community_asset_health IS 'Health metrics for assets by community';

-- ============================================================================
-- SAMPLE DATA FUNCTIONS (for testing)
-- ============================================================================

-- Function to test ticket creation
CREATE OR REPLACE FUNCTION test_create_ticket(
  p_asset_id TEXT,
  p_user_name TEXT DEFAULT 'Test User',
  p_issue TEXT DEFAULT 'Test issue',
  p_priority TEXT DEFAULT 'Medium'
) RETURNS UUID AS $$
DECLARE
  v_ticket_id UUID;
BEGIN
  INSERT INTO tickets (asset_id, user_name, issue_description, priority)
  VALUES (p_asset_id, p_user_name, p_issue, p_priority)
  RETURNING id INTO v_ticket_id;

  RETURN v_ticket_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION test_create_ticket IS 'Helper function to create test tickets';

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Goods Asset Register schema created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  - assets (389 individual assets)';
  RAISE NOTICE '  - checkins (visit/inspection records)';
  RAISE NOTICE '  - tickets (support requests)';
  RAISE NOTICE '  - usage_logs (IoT washer monitoring)';
  RAISE NOTICE '  - alerts (automated alerts)';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Import data: psql -f supabase/seed.sql';
  RAISE NOTICE '  2. Enable Realtime in Supabase Dashboard';
  RAISE NOTICE '  3. Test with: SELECT * FROM assets LIMIT 10;';
END $$;

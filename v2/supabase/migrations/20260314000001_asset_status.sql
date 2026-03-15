-- Add status, quantity, and partner_name columns to assets table
-- for tracking bed distribution pipeline (requested → allocated → demo → deployed → retired)

ALTER TABLE assets ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'deployed';
ALTER TABLE assets ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS partner_name TEXT;

-- Backfill existing rows as 'deployed'
UPDATE assets SET status = 'deployed' WHERE status IS NULL OR status = '';

-- Seed pipeline entries for known pre-deployment beds
-- The v1 assets table has a NOT NULL text `id` column; use unique_id as id.
INSERT INTO assets (id, unique_id, product, status, community, quantity, partner_name, notes)
VALUES
  ('REQ-CENTRECORP-2026', 'REQ-CENTRECORP-2026', 'Stretch Bed', 'requested', 'Tennant Creek', 108, 'Centrecorp', 'Approved Jan 2026'),
  ('DEMO-PICC-001', 'DEMO-PICC-001', 'Stretch Bed', 'demo', 'Palm Island', 1, 'PICC', 'Display unit in PICC offices'),
  ('ALLOC-SNOW-2026', 'ALLOC-SNOW-2026', 'Stretch Bed', 'allocated', 'Canberra', 2, 'Snow Foundation', 'Upcoming foundation event'),
  ('ALLOC-LUTIJULIU-001', 'ALLOC-LUTIJULIU-001', 'Stretch Bed', 'allocated', 'Lutijuliu', 2, NULL, 'Two beds for community')
ON CONFLICT (unique_id) DO NOTHING;

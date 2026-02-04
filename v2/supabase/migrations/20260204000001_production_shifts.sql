-- Migration: Create production_shifts table for shift logging
-- Description: Track daily production at on-country recycled plastic bed manufacturing facility

CREATE TABLE production_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator TEXT NOT NULL,
  shift_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sheets_produced INTEGER NOT NULL DEFAULT 0,
  sheets_cooling INTEGER NOT NULL DEFAULT 0,
  plastic_shredded_kg DECIMAL(6,1) NOT NULL DEFAULT 0,
  diesel_level TEXT NOT NULL DEFAULT 'medium' CHECK (diesel_level IN ('low', 'medium', 'full')),
  issues TEXT[] DEFAULT '{}',
  issue_notes TEXT,
  handover_notes TEXT,
  total_sheets_to_date INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE production_shifts ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read
CREATE POLICY "Authenticated users can read production shifts"
  ON production_shifts FOR SELECT
  TO authenticated
  USING (true);

-- Admin can write
CREATE POLICY "Admin can insert production shifts"
  ON production_shifts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update production shifts"
  ON production_shifts FOR UPDATE
  TO authenticated
  USING (true);

-- Add updated_at trigger (reuse function from products migration)
CREATE TRIGGER update_production_shifts_updated_at
  BEFORE UPDATE ON production_shifts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for common queries
CREATE INDEX idx_production_shifts_date ON production_shifts(shift_date DESC);
CREATE INDEX idx_production_shifts_operator ON production_shifts(operator);

COMMENT ON TABLE production_shifts IS 'Daily shift logs for on-country recycled plastic bed manufacturing facility';

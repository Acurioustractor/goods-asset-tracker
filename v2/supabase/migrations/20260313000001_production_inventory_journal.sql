-- Production Inventory Snapshots
-- Point-in-time inventory counts from facility walkthroughs

CREATE TABLE production_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  operator TEXT NOT NULL,
  -- Raw material
  chipped_plastic_sheets INTEGER DEFAULT 0,
  -- Tab pipeline
  tab_sheets_finished INTEGER DEFAULT 0,
  tab_sheets_in_cooker INTEGER DEFAULT 0,
  tab_sheets_cooling INTEGER DEFAULT 0,
  tabs_ready INTEGER DEFAULT 0,
  -- Leg pipeline
  leg_sheets_uncut INTEGER DEFAULT 0,
  legs_ready INTEGER DEFAULT 0,
  -- Assembly components
  steel_poles INTEGER DEFAULT 0,
  canvas_ready INTEGER DEFAULT 0,
  -- Calculated: beds possible from current stock
  -- BOM: 4 legs, 8 tabs, 2 poles, 1 canvas per bed
  beds_possible INTEGER GENERATED ALWAYS AS (
    LEAST(legs_ready / 4, tabs_ready / 8, steel_poles / 2, canvas_ready)
  ) STORED,
  -- Context
  notes TEXT,
  photo_urls TEXT[] DEFAULT '{}',
  voice_note_urls TEXT[] DEFAULT '{}',
  voice_note_transcripts TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Production Journal
-- Process reflections, cost improvement ideas, issues

CREATE TABLE production_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  operator TEXT NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('reflection', 'issue', 'cost_idea', 'general')),
  title TEXT NOT NULL,
  content TEXT,
  voice_note_urls TEXT[] DEFAULT '{}',
  voice_note_transcripts TEXT[] DEFAULT '{}',
  photo_urls TEXT[] DEFAULT '{}',
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_production_inventory_date ON production_inventory (snapshot_date DESC);
CREATE INDEX idx_production_journal_date ON production_journal (entry_date DESC);
CREATE INDEX idx_production_journal_type ON production_journal (entry_type);

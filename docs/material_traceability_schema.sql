-- Goods Asset Register - Material Traceability Schema
-- Design 2026-08-24. APPLIED 2026-08-24 to Goods Supabase (cwsyhpiuepvdjtxaozwf) via MCP
-- migrations `material_traceability` + `material_traceability_rls` (RLS enabled, no
-- policies: service-role-only until an admin write path exists). Purpose: per-batch plastic traceability so every pressed product
-- can say, with receipts: "contains N kg of HDPE collected at <community>, pressed in
-- run <R>, deployed as asset <unique_id>". This is the north star made verifiable
-- (community collects the plastic -> makes the goods -> comes to own the making).
--
-- Canon facts this design rests on (v2/src/lib/data/canon.ts, cost-story.ts):
--   * ~20 kg recycled HDPE per Stretch Bed (legs only; Basket Beds contain no plastic).
--     OPEN CONFLICT: Envirobank brief said ~25 kg. Ben to rule before any public
--     beds-per-tonne figure is derived from these tables.
--   * Only farm-pressed beds (Maningrida 40, INV-0303) contain our own pressed legs;
--     Defy-kit beds' plastic provenance belongs to Defy, not to a community batch.
--   * Every derived figure keeps its honesty label: batch weights are VERIFIED
--     (weighed), yields are WORKPAPER, beds-per-tonne projections are MODELLED.
--
-- Apply (when approved): run against the Goods v2 Supabase project, not CivicGraph's.

-- One physical lot of collected plastic.
CREATE TABLE IF NOT EXISTS material_batches (
  batch_id TEXT PRIMARY KEY,                 -- e.g. "MB-MANI-2026-001"
  source_community TEXT NOT NULL,            -- matches assets.community naming
  collection_site TEXT,                      -- depot / school / store / cleanup event
  collected_by TEXT,                         -- org or crew; employment story lives here
  collection_date DATE,
  polymer_type TEXT NOT NULL,                -- 'HDPE' | 'PP' | 'PET' | 'LDPE' | 'mixed' | 'unknown'
  polymer_verified BOOLEAN DEFAULT FALSE,    -- float/burn/marking test done vs assumed
  gross_weight_kg NUMERIC(8,2),              -- as collected (verified: weighed)
  clean_weight_kg NUMERIC(8,2),              -- after sort/wash/dry (verified: weighed)
  contamination_pct NUMERIC(5,2),            -- derived: (gross-clean)/gross
  colour TEXT,
  moisture_note TEXT,
  transport_km NUMERIC(7,1),
  processing_cost_aud NUMERIC(10,2),
  evidence_url TEXT,                         -- photo of scale / weighbridge docket
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- One pressing session at a facility.
CREATE TABLE IF NOT EXISTS production_runs (
  run_id TEXT PRIMARY KEY,                   -- e.g. "PR-FARM-2026-003"
  facility TEXT NOT NULL,                    -- 'farm' | future on-Country sites
  run_date DATE,
  operator_crew TEXT,                        -- who pressed; trainee hours belong here
  trainee_count INTEGER,
  trainee_hours NUMERIC(6,1),
  product TEXT NOT NULL,                     -- 'Stretch Bed legs' etc.
  units_produced INTEGER,
  reject_units INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Which batches fed which run, and how much of each. Yield falls out of this join:
-- SUM(kg_consumed) / units_produced = measured kg/unit (converts the 20-vs-25 conflict
-- from ruling to measurement once the measured run happens).
CREATE TABLE IF NOT EXISTS run_batch_inputs (
  run_id TEXT REFERENCES production_runs(run_id),
  batch_id TEXT REFERENCES material_batches(batch_id),
  kg_consumed NUMERIC(8,2) NOT NULL,
  PRIMARY KEY (run_id, batch_id)
);

-- Which run produced the components in which deployed asset.
CREATE TABLE IF NOT EXISTS asset_material_provenance (
  asset_unique_id TEXT REFERENCES assets(unique_id),
  run_id TEXT REFERENCES production_runs(run_id),
  component TEXT DEFAULT 'legs',
  kg_in_asset NUMERIC(6,2),                  -- NULL until per-unit weight is measured
  PRIMARY KEY (asset_unique_id, run_id, component)
);

CREATE INDEX IF NOT EXISTS idx_batches_community ON material_batches(source_community);
CREATE INDEX IF NOT EXISTS idx_runs_facility ON production_runs(facility);

-- Consent + data boundary (standing, from the CivicGraph alignment 2026-08-24):
--   * These tables hold MATERIAL and PRODUCTION facts only. No household names, no
--     household conditions, no health observations. The deployment end of the chain
--     stops at assets.unique_id/community — household-level detail stays in the
--     register's existing consent-gated structures and never syncs to CivicGraph.
--   * CivicGraph reads community-level aggregates only (kg collected per community,
--     beds produced per run, yield) via the existing goods_* sync, public layer.
--   * Collection crew / trainee names are employment records: publishable only with
--     the same per-person consent discipline as the storyteller registry.

-- Add beds_assembled column to production_shifts
ALTER TABLE production_shifts
ADD COLUMN IF NOT EXISTS beds_assembled integer DEFAULT 0;

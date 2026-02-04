-- Add voice note transcripts column to production_shifts
ALTER TABLE production_shifts
  ADD COLUMN IF NOT EXISTS voice_note_transcripts TEXT[] DEFAULT '{}';

-- Migration: Add user tracking and media support to production_shifts
-- Description: Voice notes, photos, and user_id for shift accountability

-- Add user tracking
ALTER TABLE production_shifts
  ADD COLUMN user_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
CREATE INDEX idx_production_shifts_user ON production_shifts(user_id);

-- Add media columns
ALTER TABLE production_shifts
  ADD COLUMN voice_note_urls TEXT[] DEFAULT '{}',
  ADD COLUMN photo_urls TEXT[] DEFAULT '{}';

-- Create storage bucket for production media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'production-media', 'production-media', true, 10485760,
  ARRAY['audio/webm','audio/ogg','audio/mp4','audio/mpeg','image/jpeg','image/png','image/webp']
);

-- Storage policies
CREATE POLICY "Auth users can upload production media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'production-media');

CREATE POLICY "Public read production media"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'production-media');

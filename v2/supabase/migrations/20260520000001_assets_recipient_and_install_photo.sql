-- Add recipient_name and install_photo_url to assets so the field team can
-- record who got the bed and a single representative photo of the install,
-- instead of stuffing both into the freeform notes field.

ALTER TABLE assets
  ADD COLUMN IF NOT EXISTS recipient_name text,
  ADD COLUMN IF NOT EXISTS install_photo_url text;

-- The bulk-install page renders thumbnails, so an index on install_photo_url
-- being non-null helps the /admin/assets list filter to "deployed beds with photos".
CREATE INDEX IF NOT EXISTS assets_install_photo_idx
  ON assets(unique_id) WHERE install_photo_url IS NOT NULL;

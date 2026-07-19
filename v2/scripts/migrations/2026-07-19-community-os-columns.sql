-- Community OS columns: facility interest/progress, procurement + key people, Notion link.
-- Run against the Goods project (cwsyhpiuepvdjtxaozwf) with psql.
-- Mirrors the code-side overlay in v2/src/lib/data/community-os.ts — once applied,
-- move overlay values into these columns and the admin UI reads them live.
ALTER TABLE communities
  ADD COLUMN IF NOT EXISTS facility_interest text,        -- none | interested | exploring | committed | progressing
  ADD COLUMN IF NOT EXISTS facility_notes text,           -- evidence for the stage, with claim label
  ADD COLUMN IF NOT EXISTS procurement_contacts jsonb DEFAULT '[]'::jsonb, -- [{name, org, role, phone, email}]
  ADD COLUMN IF NOT EXISTS key_people jsonb DEFAULT '[]'::jsonb,           -- [{name, role, org, storytellerSlug?}]
  ADD COLUMN IF NOT EXISTS notion_url text;               -- Community OS page for this community

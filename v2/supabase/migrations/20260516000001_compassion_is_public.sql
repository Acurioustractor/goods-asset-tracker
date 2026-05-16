-- Photo privacy: compassion_content.is_public gates the BedGallery on /bed/{id}.
-- Default false (opt-in to public). Existing rows: backfill staff uploads to true,
-- bed-scan submissions to false (we can't tell after-the-fact what the recipient meant).

alter table compassion_content add column if not exists is_public boolean not null default false;

-- Best-effort backfill: anything created from /admin/compassion has created_by = staff email.
-- Bed-scan submissions use the submitter's contact (or "Bed scan submission" label).
-- Mark existing photos public if created_by looks like an internal email — admin uploads
-- predate the consent flow, so they were uploaded with implied "share with the recipient" intent.
update compassion_content
   set is_public = true
 where is_public = false
   and (created_by ilike '%@goodsoncountry.com' or created_by ilike '%@%goods%' or created_by = 'Staff');

create index if not exists compassion_content_public_idx
  on compassion_content(asset_id, is_public)
  where is_public = true;

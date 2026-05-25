-- The partnership_type CHECK constraint only allowed the seven original values
-- (corporate_sponsor, retail_partner, community_partner, media_partner,
-- government, ngo, other). The /partner page form has since started sending
-- additional values (washer-interest, sponsor, license, distribution, grant,
-- partnership-inquiry, media-pack-request) which silently failed insertion —
-- every real inquiry has only been captured in GoHighLevel, not Supabase.
--
-- Widen the constraint so /api/partnership writes succeed for every value the
-- form can produce. The set matches ALLOWED_TYPES in src/app/partner/page.tsx
-- plus the legacy values still present in seed/test data.

ALTER TABLE partnership_inquiries
  DROP CONSTRAINT IF EXISTS partnership_inquiries_partnership_type_check;

ALTER TABLE partnership_inquiries
  ADD CONSTRAINT partnership_inquiries_partnership_type_check
  CHECK (partnership_type IN (
    -- Legacy values (kept for backwards compatibility)
    'corporate_sponsor',
    'retail_partner',
    'community_partner',
    'media_partner',
    'government',
    'ngo',
    'other',
    -- Current form values from /partner page
    'partnership-inquiry',
    'washer-interest',
    'sponsor',
    'license',
    'distribution',
    'grant',
    'media-pack-request'
  ));

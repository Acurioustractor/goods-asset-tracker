-- ═══════════════════════════════════════════════════════════════════════════
-- EL: add media_assets.community_id FK        (STAGED 2026-07-21 — NOT APPLIED)
-- ═══════════════════════════════════════════════════════════════════════════
-- Target DB : Empathy Ledger PRODUCTION (Supabase project yvnuayzslukamizrlhwb).
-- Apply by  : the EL owner, via psql against EL prod. This file is NOT run from
--             the Goods repo. Idempotent; rollback at the bottom.
-- Context   : wiki/canon/el-goods-alignment.md — "Next to make it fully seamless
--             (EL-side)", item 1: a real media_assets.community_id FK to
--             communities.id (place-level relational link vs today's text field).
--
-- Why: a photo's community currently lives only in the text field
-- `country_or_place` (verified values today: 'Alice Springs', 'Palm Island',
-- 'Utopia Homelands (Urapuntja)', 'Tennant Creek'). There is no relational link
-- to communities.id, so a community cannot query/own its media directly and
-- Goods must string-match. This adds the FK. Verified against EL schema
-- 2026-07-21: media_assets has NO community_id column today; communities.id is
-- uuid.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

ALTER TABLE public.media_assets
  ADD COLUMN IF NOT EXISTS community_id uuid REFERENCES public.communities(id);

CREATE INDEX IF NOT EXISTS media_assets_community_id_idx
  ON public.media_assets (community_id);

COMMENT ON COLUMN public.media_assets.community_id IS
  'Place-level FK to communities.id. Relational replacement for the country_or_place text field. Set from verified community data only; never inferred.';

COMMIT;

-- ─────────────────────────────────────────────────────────────────────────────
-- OPTIONAL BACKFILL — review before running. Fills community_id from the
-- existing country_or_place text, matched to communities.name, scoped to the
-- Goods project ONLY (6bd47c8a-e676-456f-aa25-ddcbb5a31047). Run the SELECT
-- first to see exactly what would be linked; only then run the UPDATE.
--
-- 1) Preview (dry-run — safe, read-only):
--
--    SELECT m.id, m.country_or_place, c.id AS would_link_to, c.name
--      FROM public.media_assets m
--      JOIN public.communities  c
--        ON LOWER(TRIM(m.country_or_place)) = LOWER(TRIM(c.name))
--     WHERE m.project_id = '6bd47c8a-e676-456f-aa25-ddcbb5a31047'
--       AND m.community_id IS NULL
--       AND m.country_or_place IS NOT NULL;
--
-- 2) Apply (only after the preview looks right):
--
--    UPDATE public.media_assets m
--       SET community_id = c.id
--      FROM public.communities c
--     WHERE LOWER(TRIM(m.country_or_place)) = LOWER(TRIM(c.name))
--       AND m.project_id = '6bd47c8a-e676-456f-aa25-ddcbb5a31047'
--       AND m.community_id IS NULL;
--
-- NOTE — Tennant Creek: 'Tennant Creek' media will only link if a matching row
-- exists in communities. Alice Springs, Palm Island and Utopia Homelands
-- (Urapuntja) match by name today; confirm a Tennant Creek community row exists
-- (create it EL-side first, with a community-verified nation) before expecting
-- those to backfill.
-- ─────────────────────────────────────────────────────────────────────────────

-- ROLLBACK (if ever needed):
--   DROP INDEX IF EXISTS public.media_assets_community_id_idx;
--   ALTER TABLE public.media_assets DROP COLUMN IF EXISTS community_id;

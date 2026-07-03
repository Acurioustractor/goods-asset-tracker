-- Content system — Phase 2 slice C: content_items.community_id was uuid (Phase 0)
-- but communities.id is text. All values were null (never populated), so the cast
-- is safe. Enables linking photos to communities for gallery search.
-- Applied to Goods (cwsyhpiuepvdjtxaozwf) via Supabase MCP apply_migration 2026-07-03.
alter table public.content_items alter column community_id type text using community_id::text;

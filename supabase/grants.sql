-- ============================================================================
-- Supabase API GRANTS (Required for client-side access)
-- Run this in Supabase SQL Editor if the website shows blank/— stats or
-- "permission denied for relation ..." errors in the browser console.
--
-- Notes:
-- - RLS policies control *which rows* are visible/editable.
-- - GRANTs control whether the PostgREST API roles (anon/authenticated) can
--   access the table at all.
-- - This file is safe to run multiple times.
-- ============================================================================

-- Allow API roles to use the public schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

DO $$
BEGIN
  -- Core tables used by the public website
  IF to_regclass('public.assets') IS NOT NULL THEN
    EXECUTE 'GRANT SELECT, UPDATE ON TABLE public.assets TO anon';
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.assets TO authenticated';
  END IF;

  IF to_regclass('public.tickets') IS NOT NULL THEN
    EXECUTE 'GRANT SELECT, INSERT ON TABLE public.tickets TO anon';
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tickets TO authenticated';
  END IF;

  -- Supporting/audit tables (used by triggers and maintenance scripts)
  IF to_regclass('public.asset_change_log') IS NOT NULL THEN
    EXECUTE 'GRANT SELECT, INSERT ON TABLE public.asset_change_log TO anon, authenticated';
  END IF;

  IF to_regclass('public.qr_audit_logs') IS NOT NULL THEN
    EXECUTE 'GRANT SELECT, INSERT ON TABLE public.qr_audit_logs TO anon, authenticated';
  END IF;

  -- Internal/admin tables (auth required; RLS still applies)
  IF to_regclass('public.checkins') IS NOT NULL THEN
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.checkins TO authenticated';
  END IF;

  IF to_regclass('public.usage_logs') IS NOT NULL THEN
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.usage_logs TO authenticated';
  END IF;

  IF to_regclass('public.alerts') IS NOT NULL THEN
    EXECUTE 'GRANT SELECT, UPDATE ON TABLE public.alerts TO authenticated';
  END IF;

  -- "My Items" user account tables (require Supabase Auth; RLS still applies)
  IF to_regclass('public.profiles') IS NOT NULL THEN
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO authenticated';
  END IF;

  IF to_regclass('public.user_assets') IS NOT NULL THEN
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_assets TO authenticated';
  END IF;

  IF to_regclass('public.messages') IS NOT NULL THEN
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.messages TO authenticated';
  END IF;

  IF to_regclass('public.user_requests') IS NOT NULL THEN
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_requests TO authenticated';
  END IF;

  IF to_regclass('public.compassion_content') IS NOT NULL THEN
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.compassion_content TO authenticated';
  END IF;
END $$;


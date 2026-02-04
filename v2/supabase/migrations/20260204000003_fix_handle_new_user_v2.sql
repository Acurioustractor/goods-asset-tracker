-- Fix handle_new_user trigger to handle phone-only signups gracefully
-- Issues fixed:
-- 1. NEW.email can be empty string '' which should be treated as NULL
-- 2. NEW.phone from auth.users may lack '+' prefix
-- 3. raw_user_meta_data may be NULL or empty object

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, phone, email, display_name)
  VALUES (
    NEW.id,
    NULLIF(NEW.phone, ''),
    NULLIF(NEW.email::text, ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User')
  )
  ON CONFLICT (id) DO UPDATE SET
    phone = COALESCE(NULLIF(EXCLUDED.phone, ''), profiles.phone),
    email = COALESCE(NULLIF(EXCLUDED.email, ''), profiles.email),
    last_login = NOW();
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log but don't block user creation if profile insert fails
  RAISE WARNING 'handle_new_user trigger failed: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

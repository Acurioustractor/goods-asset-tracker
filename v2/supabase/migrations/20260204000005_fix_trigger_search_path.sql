-- Fix: Set search_path explicitly so the trigger can find the profiles table
-- The trigger runs in auth schema context but profiles is in public schema
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, email, display_name)
  VALUES (
    NEW.id,
    NULLIF(NEW.phone, ''),
    NULLIF(NEW.email::text, ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User')
  )
  ON CONFLICT (id) DO UPDATE SET
    phone = COALESCE(NULLIF(EXCLUDED.phone, ''), public.profiles.phone),
    email = COALESCE(NULLIF(EXCLUDED.email, ''), public.profiles.email),
    last_login = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

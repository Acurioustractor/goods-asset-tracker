-- Debug: temporarily remove exception handler to see actual error
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

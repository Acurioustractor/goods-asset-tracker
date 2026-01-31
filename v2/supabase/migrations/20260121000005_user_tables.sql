-- ============================================================================
-- USER TABLES - Profiles, Claims, Messages, Requests, Compassion Content
-- For bed/washer recipients to manage their items
-- ============================================================================

-- ============================================================================
-- TABLE: profiles (User accounts linked to Supabase Auth)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,

  -- Contact Info
  phone TEXT UNIQUE,                    -- Primary identifier for SMS auth
  email TEXT,                           -- Optional backup contact
  display_name TEXT,                    -- User's preferred name

  -- Preferences
  notification_preferences JSONB DEFAULT '{"sms": true, "email": false}'::jsonb,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);

COMMENT ON TABLE profiles IS 'User profiles for bed/washer recipients who claim their items';

-- ============================================================================
-- TABLE: user_assets (Links profiles to their claimed assets)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  asset_id TEXT REFERENCES assets(unique_id) ON DELETE CASCADE,

  -- Claim Details
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  claim_status TEXT DEFAULT 'active' CHECK (claim_status IN ('active', 'transferred', 'revoked')),

  -- Verification (optional admin approval)
  verified_by TEXT,
  verified_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(profile_id, asset_id)
);

CREATE INDEX IF NOT EXISTS idx_user_assets_profile ON user_assets(profile_id);
CREATE INDEX IF NOT EXISTS idx_user_assets_asset ON user_assets(asset_id);

COMMENT ON TABLE user_assets IS 'Links user profiles to their claimed beds/washers';

-- ============================================================================
-- TABLE: messages (Two-way messaging between staff and users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Participants
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  asset_id TEXT REFERENCES assets(unique_id) ON DELETE SET NULL,

  -- Message Content
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_text TEXT NOT NULL,
  media_url TEXT,

  -- Status
  read_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  -- Metadata
  sender_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_profile ON messages(profile_id);
CREATE INDEX IF NOT EXISTS idx_messages_asset ON messages(asset_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(profile_id, read_at) WHERE read_at IS NULL;

COMMENT ON TABLE messages IS 'Two-way messaging between staff and item owners';

-- ============================================================================
-- TABLE: user_requests (Requests for blankets, parts, check-ins)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  asset_id TEXT REFERENCES assets(unique_id) ON DELETE SET NULL,

  -- Request Details
  request_type TEXT NOT NULL CHECK (request_type IN ('blanket', 'pillow', 'parts', 'checkin', 'pickup', 'other')),
  description TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'urgent')),

  -- Fulfillment
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_progress', 'fulfilled', 'denied')),
  fulfilled_at TIMESTAMPTZ,
  fulfilled_by TEXT,
  fulfillment_notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_requests_profile ON user_requests(profile_id);
CREATE INDEX IF NOT EXISTS idx_user_requests_status ON user_requests(status) WHERE status IN ('pending', 'approved', 'in_progress');

COMMENT ON TABLE user_requests IS 'User requests for additional items or services';

-- ============================================================================
-- TABLE: compassion_content (Photos/videos sent to owners)
-- ============================================================================

CREATE TABLE IF NOT EXISTS compassion_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id TEXT REFERENCES assets(unique_id) ON DELETE CASCADE,

  -- Content
  content_type TEXT NOT NULL CHECK (content_type IN ('photo', 'video', 'message')),
  media_url TEXT,
  thumbnail_url TEXT,
  caption TEXT,

  -- Metadata
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Delivery Tracking
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_compassion_content_asset ON compassion_content(asset_id);
CREATE INDEX IF NOT EXISTS idx_compassion_content_created ON compassion_content(created_at DESC);

COMMENT ON TABLE compassion_content IS 'Photos and videos of items being made, for sharing with owners';

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE compassion_content ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage profiles" ON profiles
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- USER_ASSETS: Users can view and create their own claims
CREATE POLICY "Users can view own claimed assets" ON user_assets
FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can claim assets" ON user_assets
FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Service role can manage user_assets" ON user_assets
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- MESSAGES: Users can view their own messages and send inbound messages
CREATE POLICY "Users can view own messages" ON messages
FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can send messages" ON messages
FOR INSERT WITH CHECK (auth.uid() = profile_id AND direction = 'inbound');

CREATE POLICY "Users can mark messages as read" ON messages
FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Service role can manage messages" ON messages
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- USER_REQUESTS: Users can view and create their own requests
CREATE POLICY "Users can view own requests" ON user_requests
FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can create requests" ON user_requests
FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Service role can manage requests" ON user_requests
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- COMPASSION_CONTENT: Users can view content for their assets
CREATE POLICY "Users can view own compassion content" ON compassion_content
FOR SELECT USING (
  asset_id IN (
    SELECT asset_id FROM user_assets WHERE profile_id = auth.uid() AND claim_status = 'active'
  )
);

CREATE POLICY "Service role can manage compassion_content" ON compassion_content
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-create profile when user signs up via phone
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, phone, email, display_name)
  VALUES (
    NEW.id,
    NEW.phone,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User')
  )
  ON CONFLICT (id) DO UPDATE SET
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    email = COALESCE(EXCLUDED.email, profiles.email),
    last_login = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Update timestamp on profile changes
CREATE OR REPLACE FUNCTION update_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profile_updated ON profiles;
CREATE TRIGGER profile_updated
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_timestamp();

-- Update timestamp on request changes
CREATE OR REPLACE FUNCTION update_request_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS request_updated ON user_requests;
CREATE TRIGGER request_updated
BEFORE UPDATE ON user_requests
FOR EACH ROW
EXECUTE FUNCTION update_request_timestamp();

-- ============================================================================
-- VIEWS for easy querying
-- ============================================================================

-- Users with their claimed items
CREATE OR REPLACE VIEW user_items_view AS
SELECT
  p.id as profile_id,
  p.phone,
  p.display_name,
  ua.asset_id,
  ua.claimed_at,
  ua.claim_status,
  a.product,
  a.community,
  a.name as recipient_name,
  a.place
FROM profiles p
JOIN user_assets ua ON p.id = ua.profile_id
JOIN assets a ON ua.asset_id = a.unique_id
WHERE ua.claim_status = 'active';

-- Unread messages count by user
CREATE OR REPLACE VIEW unread_messages_view AS
SELECT
  profile_id,
  COUNT(*) as unread_count
FROM messages
WHERE read_at IS NULL AND direction = 'outbound'
GROUP BY profile_id;

-- Pending requests summary
CREATE OR REPLACE VIEW pending_requests_view AS
SELECT
  ur.*,
  p.phone,
  p.display_name,
  a.product,
  a.community
FROM user_requests ur
JOIN profiles p ON ur.profile_id = p.id
LEFT JOIN assets a ON ur.asset_id = a.unique_id
WHERE ur.status IN ('pending', 'approved', 'in_progress')
ORDER BY
  CASE ur.priority WHEN 'urgent' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END,
  ur.created_at;

-- ============================================================================
-- GRANTS for API access
-- ============================================================================
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT, INSERT ON TABLE public.user_assets TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.messages TO authenticated;
GRANT SELECT, INSERT ON TABLE public.user_requests TO authenticated;
GRANT SELECT ON TABLE public.compassion_content TO authenticated;

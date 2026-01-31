-- ============================================================================
-- COMMUNITY TABLES - Ideas, Voting, Announcements
-- For community engagement and feedback
-- ============================================================================

-- ============================================================================
-- TABLE: community_ideas (User-submitted ideas for products/services)
-- ============================================================================

CREATE TABLE IF NOT EXISTS community_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Idea Details
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('product', 'service', 'community', 'other')),

  -- Status
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'planned', 'in_progress', 'completed', 'declined')),

  -- Voting
  vote_count INT DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_ideas_profile ON community_ideas(profile_id);
CREATE INDEX IF NOT EXISTS idx_community_ideas_status ON community_ideas(status);
CREATE INDEX IF NOT EXISTS idx_community_ideas_votes ON community_ideas(vote_count DESC);

COMMENT ON TABLE community_ideas IS 'User-submitted ideas for improving products and services';

-- ============================================================================
-- TABLE: idea_votes (Tracks who voted for which ideas)
-- ============================================================================

CREATE TABLE IF NOT EXISTS idea_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES community_ideas(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(idea_id, profile_id)
);

CREATE INDEX IF NOT EXISTS idx_idea_votes_idea ON idea_votes(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_votes_profile ON idea_votes(profile_id);

COMMENT ON TABLE idea_votes IS 'Tracks votes on community ideas (one vote per user per idea)';

-- ============================================================================
-- TABLE: announcements (Admin announcements for the community)
-- ============================================================================

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Content
  title TEXT NOT NULL,
  content TEXT,

  -- Publishing
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,

  -- Metadata
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(is_published, published_at DESC);

COMMENT ON TABLE announcements IS 'Admin announcements for the community';

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE community_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- COMMUNITY_IDEAS: Anyone authenticated can view, users can create/update their own
CREATE POLICY "Anyone authenticated can view ideas" ON community_ideas
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create ideas" ON community_ideas
FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own ideas" ON community_ideas
FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Service role can manage ideas" ON community_ideas
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- IDEA_VOTES: Anyone authenticated can view, users can manage their own votes
CREATE POLICY "Anyone authenticated can view votes" ON idea_votes
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can vote" ON idea_votes
FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can remove own vote" ON idea_votes
FOR DELETE USING (auth.uid() = profile_id);

CREATE POLICY "Service role can manage votes" ON idea_votes
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ANNOUNCEMENTS: Anyone can view published, admins can manage all
CREATE POLICY "Anyone can view published announcements" ON announcements
FOR SELECT USING (is_published = true);

CREATE POLICY "Service role can manage announcements" ON announcements
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update vote_count when votes change
CREATE OR REPLACE FUNCTION update_idea_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_ideas SET vote_count = vote_count + 1 WHERE id = NEW.idea_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_ideas SET vote_count = vote_count - 1 WHERE id = OLD.idea_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_idea_vote_change ON idea_votes;
CREATE TRIGGER on_idea_vote_change
AFTER INSERT OR DELETE ON idea_votes
FOR EACH ROW
EXECUTE FUNCTION update_idea_vote_count();

-- Update timestamp on idea changes
CREATE OR REPLACE FUNCTION update_idea_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS idea_updated ON community_ideas;
CREATE TRIGGER idea_updated
BEFORE UPDATE ON community_ideas
FOR EACH ROW
EXECUTE FUNCTION update_idea_timestamp();

-- Update timestamp on announcement changes
CREATE OR REPLACE FUNCTION update_announcement_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.is_published = true AND OLD.is_published = false THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS announcement_updated ON announcements;
CREATE TRIGGER announcement_updated
BEFORE UPDATE ON announcements
FOR EACH ROW
EXECUTE FUNCTION update_announcement_timestamp();

-- ============================================================================
-- GRANTS for API access
-- ============================================================================
GRANT SELECT, INSERT, UPDATE ON TABLE public.community_ideas TO authenticated;
GRANT SELECT, INSERT, DELETE ON TABLE public.idea_votes TO authenticated;
GRANT SELECT ON TABLE public.announcements TO authenticated;
GRANT SELECT ON TABLE public.announcements TO anon;

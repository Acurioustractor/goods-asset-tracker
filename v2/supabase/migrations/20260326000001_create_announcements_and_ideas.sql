-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on announcements" ON announcements
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anon can read published announcements" ON announcements
  FOR SELECT USING (is_published = true);

-- Create community_ideas table
CREATE TABLE IF NOT EXISTS community_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text CHECK (category IN ('product', 'service', 'community', 'other')),
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'planned', 'in_progress', 'completed', 'declined')),
  vote_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE community_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on community_ideas" ON community_ideas
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anon can read community_ideas" ON community_ideas
  FOR SELECT USING (true);

-- Create idea_votes table
CREATE TABLE IF NOT EXISTS idea_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid NOT NULL REFERENCES community_ideas(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(idea_id, profile_id)
);

ALTER TABLE idea_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on idea_votes" ON idea_votes
  FOR ALL USING (auth.role() = 'service_role');

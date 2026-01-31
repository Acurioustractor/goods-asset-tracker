-- Migration: Create stories table for CMS content
-- Description: Impact stories, community voices, and bed journey content

CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT, -- Main content (markdown or HTML)
  excerpt TEXT, -- Short summary for listings

  -- Media
  featured_image TEXT,
  images TEXT[] DEFAULT '{}',
  video_url TEXT,

  -- Categorization
  story_type TEXT NOT NULL CHECK (story_type IN (
    'community_voice',  -- Testimonials from recipients
    'impact_report',    -- Data-driven impact stories
    'bed_journey',      -- Story of a specific bed
    'artisan_profile',  -- About a maker
    'news',             -- General news/updates
    'blog'              -- Blog posts
  )),
  community TEXT, -- Which community this relates to
  tags TEXT[] DEFAULT '{}',

  -- Publishing
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,

  -- Author/attribution
  author_name TEXT,
  author_id UUID, -- References team_members or auth.users

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members / Artisan profiles
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  short_bio TEXT, -- For cards/listings

  -- Media
  photo TEXT,
  photos TEXT[] DEFAULT '{}', -- Additional photos

  -- Type
  is_artisan BOOLEAN DEFAULT false,
  is_staff BOOLEAN DEFAULT false,
  community TEXT, -- For artisans - where they're from

  -- Contact/Social
  email TEXT,
  phone TEXT,
  instagram TEXT,
  facebook TEXT,

  -- Display
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bed journey timeline events
CREATE TABLE IF NOT EXISTS bed_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id TEXT, -- References assets(unique_id)
  order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,

  event_type TEXT NOT NULL CHECK (event_type IN (
    'created',        -- Artisan started making
    'in_production',  -- Being woven/assembled
    'quality_check',  -- Quality inspection
    'ready',          -- Ready for shipping
    'shipped',        -- Left warehouse
    'in_transit',     -- On the way
    'delivered',      -- Arrived at community
    'setup',          -- Set up in home
    'photo_update'    -- Photo update from community
  )),

  event_date TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  location TEXT,

  -- Media for this event
  media TEXT[] DEFAULT '{}',

  -- Attribution
  created_by UUID, -- Who logged this event
  artisan_id UUID REFERENCES team_members(id) ON DELETE SET NULL,

  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_stories_slug ON stories(slug);
CREATE INDEX idx_stories_type ON stories(story_type);
CREATE INDEX idx_stories_published ON stories(is_published, published_at DESC);
CREATE INDEX idx_stories_community ON stories(community);
CREATE INDEX idx_team_members_artisan ON team_members(is_artisan) WHERE is_artisan = true;
CREATE INDEX idx_team_members_order ON team_members(display_order);
CREATE INDEX idx_bed_journeys_asset ON bed_journeys(asset_id);
CREATE INDEX idx_bed_journeys_date ON bed_journeys(event_date DESC);

-- Enable RLS
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE bed_journeys ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public read for published stories"
  ON stories FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public read for active team members"
  ON team_members FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public read for bed journeys"
  ON bed_journeys FOR SELECT
  USING (true);

-- Admin full access
CREATE POLICY "Admin full access to stories"
  ON stories FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access to team members"
  ON team_members FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access to bed journeys"
  ON bed_journeys FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Updated at triggers
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE stories IS 'CMS content - impact stories, community voices, news';
COMMENT ON TABLE team_members IS 'Team members and artisan profiles';
COMMENT ON TABLE bed_journeys IS 'Timeline of events in a beds journey from creation to delivery';

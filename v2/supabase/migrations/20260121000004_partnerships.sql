-- Migration: Create partnerships tables
-- Description: Partner inquiries and active partner management

-- Partnership inquiries (inbound leads)
CREATE TABLE IF NOT EXISTS partnership_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact info
  organization_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  website TEXT,

  -- Inquiry details
  partnership_type TEXT CHECK (partnership_type IN (
    'corporate_sponsor',    -- Companies wanting to sponsor beds
    'retail_partner',       -- Retailers wanting to stock products
    'community_partner',    -- Organizations in communities
    'media_partner',        -- Media/press partnerships
    'government',           -- Government programs
    'ngo',                  -- Other non-profits
    'other'
  )),
  message TEXT,
  how_heard TEXT, -- How they heard about Goods

  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN (
    'new',
    'contacted',
    'in_discussion',
    'approved',
    'declined',
    'inactive'
  )),

  -- Follow-up
  assigned_to UUID, -- Staff member handling
  notes TEXT,
  next_follow_up TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active partners
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,

  -- Organization info
  name TEXT NOT NULL,
  logo TEXT,
  website TEXT,
  description TEXT,

  -- Partnership details
  partnership_type TEXT NOT NULL,
  partnership_tier TEXT CHECK (partnership_tier IN (
    'founding',    -- Founding partners
    'major',       -- Major sponsors
    'supporting',  -- Supporting partners
    'community'    -- Community partners
  )),
  start_date DATE,
  end_date DATE,

  -- Display
  is_active BOOLEAN DEFAULT true,
  show_on_website BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  -- Contact
  primary_contact_name TEXT,
  primary_contact_email TEXT,
  primary_contact_phone TEXT,

  -- Financials (summary)
  total_sponsored_beds INTEGER DEFAULT 0,
  total_contribution_cents INTEGER DEFAULT 0,

  -- From inquiry
  inquiry_id UUID REFERENCES partnership_inquiries(id) ON DELETE SET NULL,

  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_partnership_inquiries_status ON partnership_inquiries(status);
CREATE INDEX idx_partnership_inquiries_email ON partnership_inquiries(contact_email);
CREATE INDEX idx_partners_active ON partners(is_active, show_on_website);
CREATE INDEX idx_partners_type ON partners(partnership_type);
CREATE INDEX idx_partners_tier ON partners(partnership_tier);

-- Enable RLS
ALTER TABLE partnership_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Public can submit inquiries
CREATE POLICY "Anyone can submit partnership inquiry"
  ON partnership_inquiries FOR INSERT
  WITH CHECK (true);

-- Public can view active partners (for website display)
CREATE POLICY "Public read for active partners"
  ON partners FOR SELECT
  USING (is_active = true AND show_on_website = true);

-- Admin full access
CREATE POLICY "Admin full access to inquiries"
  ON partnership_inquiries FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access to partners"
  ON partners FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Updated at triggers
CREATE TRIGGER update_partnership_inquiries_updated_at
  BEFORE UPDATE ON partnership_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE partnership_inquiries IS 'Inbound partnership/sponsorship inquiries';
COMMENT ON TABLE partners IS 'Active partner organizations';

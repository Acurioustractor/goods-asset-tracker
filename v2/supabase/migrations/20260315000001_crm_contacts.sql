-- CRM Contacts: unified people table aggregating all relationship types
-- Sources: manual entry, Empathy Ledger storytellers, Grantscope contacts, compendium partners

CREATE TABLE IF NOT EXISTS crm_contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Identity
  name text NOT NULL,
  email text,
  phone text,
  avatar_url text,
  organization text,
  job_title text,
  location text,

  -- Classification
  roles text[] DEFAULT '{}' NOT NULL,  -- storyteller, partner, supplier, staff, advisory, supporter, inquiry, buyer, funder, community_leader
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect', 'archived')),

  -- External links
  empathy_ledger_id text,           -- linked EL storyteller ID
  grantscope_id text,               -- linked Grantscope contact/org ID
  compendium_partner_id text,       -- linked compendium partner ID
  supabase_partner_id uuid,         -- linked partners table ID

  -- Relationship
  relationship_status text DEFAULT 'prospect' CHECK (relationship_status IN ('active', 'warm', 'prospect', 'dormant')),
  first_contact_date date,
  last_contact_date date,
  next_follow_up date,
  assigned_to text,

  -- Enrichment
  bio text,
  tags text[] DEFAULT '{}',
  website text,
  is_elder boolean DEFAULT false,
  cultural_background text,

  -- Metadata
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notes / milestones / activity log
CREATE TABLE IF NOT EXISTS crm_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id uuid NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,

  -- Content
  note_type text DEFAULT 'note' CHECK (note_type IN ('note', 'milestone', 'email', 'call', 'meeting', 'delivery', 'follow_up')),
  title text,
  content text NOT NULL,

  -- Context
  created_by text,
  is_pinned boolean DEFAULT false,

  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_crm_contacts_roles ON crm_contacts USING gin(roles);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_status ON crm_contacts(status);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_relationship ON crm_contacts(relationship_status);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_el_id ON crm_contacts(empathy_ledger_id) WHERE empathy_ledger_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_crm_notes_contact ON crm_notes(contact_id);

-- Enable RLS
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_notes ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (admin app)
CREATE POLICY "Authenticated users can manage contacts" ON crm_contacts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage notes" ON crm_notes
  FOR ALL USING (auth.role() = 'authenticated');

-- Also allow service role
CREATE POLICY "Service role full access contacts" ON crm_contacts
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access notes" ON crm_notes
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_crm_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER crm_contacts_updated_at
  BEFORE UPDATE ON crm_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_crm_contacts_updated_at();

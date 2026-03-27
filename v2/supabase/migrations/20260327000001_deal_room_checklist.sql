-- Deal Room checklist: persistent checkboxes for next-steps items
CREATE TABLE IF NOT EXISTS deal_room_checklist (
  id text PRIMARY KEY,              -- e.g. 'groote-1', 'real-3'
  checked boolean DEFAULT false,
  checked_at timestamptz,
  checked_by text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE deal_room_checklist ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access deal_room_checklist" ON deal_room_checklist
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow authenticated users full access (admin app)
CREATE POLICY "Authenticated users can manage deal_room_checklist" ON deal_room_checklist
  FOR ALL USING (auth.role() = 'authenticated');

-- Durable public-contact outbox. A form submission is retained independently
-- of both GoHighLevel and email delivery, so a transient provider outage does
-- not turn into a lost enquiry.
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('contact', 'partnership', 'newsletter')),
  submitter_email text,
  submitter_name text,
  subject text,
  payload jsonb NOT NULL,
  ghl_status text NOT NULL DEFAULT 'pending' CHECK (ghl_status IN ('pending', 'delivered', 'failed', 'disabled')),
  inbox_status text NOT NULL DEFAULT 'pending' CHECK (inbox_status IN ('pending', 'delivered', 'failed', 'disabled')),
  attempts integer NOT NULL DEFAULT 0,
  last_attempt_at timestamptz,
  delivered_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_submissions_retry_idx
  ON contact_submissions (created_at)
  WHERE ghl_status IN ('pending', 'failed') OR inbox_status IN ('pending', 'failed');

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access contact submissions"
  ON contact_submissions FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_crm_contacts_updated_at();

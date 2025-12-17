## Automation notes (tickets, messaging, GHL, notifications)

### Keep secrets out of the browser

Right now `deploy/js/ghl-integration.js` is client-side. If you put a GHL API key into the browser, anyone can extract it.

Recommended pattern:
- Put GHL/Twilio/API keys in server-side secrets (Netlify env vars or Supabase secrets).
- Call those APIs via:
  - Netlify Functions (serverless), or
  - Supabase Edge Functions (recommended if you want tight Supabase auth integration).

### Automations that add the most value first

1) Notify staff on new high-priority tickets
- Already exists: `supabase/schema.sql` trigger `trigger_ticket_alerts()` inserts rows into `alerts`.
- Add: a scheduled function (cron) that checks `alerts` where `resolved=false` and `severity in ('High','Critical')` and sends an SMS/email to staff.

2) Confirm to the user that their ticket/message was received
- On ticket insert (`tickets`) send a short SMS confirmation to `user_contact`.
- On message insert (`messages`, inbound) send a confirmation to the user and/or create a GHL conversation.

3) Staff reply workflow
- Minimal: staff replies by inserting into `messages` (`direction='outbound'`) and optionally sending SMS.
- Better: build a staff “Inbox” page (protected) to view inbound messages + respond.

### Suggested implementation approach (practical)

Option A: Supabase Edge Functions (best for auth + RLS)
- Use a service role key inside the edge function (never in the client).
- Verify the caller using Supabase JWT.
- Write to the DB (`messages`, `tickets`) and call external APIs (GHL/Twilio).

Option B: Netlify Functions (good if you want everything in Netlify)
- Put secrets in Netlify Site settings → Environment variables.
- Implement endpoints like:
  - `/api/ghl/contact`
  - `/api/ghl/message`
  - `/api/notify/ticket`
- Still validate callers (Supabase JWT) before doing anything.

### What “done” looks like

- User submits ticket → row in `tickets` → staff notified (SMS/email) → user gets confirmation.
- User sends message in `my-items.html` → row in `messages` → staff inbox shows it → staff replies → user sees reply + optionally receives SMS.


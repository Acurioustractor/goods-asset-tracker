## Site functional testing (beds, deliveries, support, messages)

This repo deploys a static site from `deploy/` (Netlify), with Supabase as the data backend.

### 0) Prereqs (once per environment)

- Supabase tables + RLS loaded:
  - Core: `supabase/schema.sql`
  - User accounts: `supabase/my_bed_schema.sql`
- Supabase API access granted (fixes “live numbers not showing”):
  - Run: `supabase/grants.sql`
- Storage buckets exist (names used in the site):
  - Delivery/support photos: `ticket-photos`
  - (Optional) Owner updates: `compassion-content`

### 1) Quick smoke test (5 minutes)

1. Open public support form: `https://YOUR-SITE/?asset_id=GB0-1`
2. Confirm the asset loads (product/community show).
3. Submit a test support ticket.
4. In Supabase → Table Editor:
   - `tickets`: new row exists
   - `assets`: unchanged (support form should not edit assets)
5. Open `deploy/public-home.html` on the site and confirm stats show numbers (not `—`).

### 2) Bed delivery / tracking (staff workflow)

Pages:
- `deploy/home.html` (staff “home”)
- `deploy/deliver.html` (deliveries)
- `deploy/dashboard.html` (admin dashboard)

Test:
1. Open `deliver.html`
2. Deliver one known bed:
   - choose an available bed
   - add recipient + place + photo
   - confirm delivery
3. Verify in Supabase:
   - `assets.supply_date` updated for that `unique_id`
   - `assets.place`, `assets.name`, `assets.gps` updated (if captured)
   - `checkins`: a new check-in row exists (delivery log)
4. Open `dashboard.html`
   - confirm counts update (beds vs washers)
   - search for the delivered `unique_id` and confirm delivery date shows

Receiving / moving an item:
- Use `dashboard.html` → “Reset for Move” (clears delivery fields), then re-deliver to a new place.

### 3) “My Items” user workflow (claim, requests, messages)

Pages:
- `deploy/login.html` + `deploy/verify-otp.html` (phone auth)
- `deploy/my-items.html`

Test:
1. In Supabase → Auth:
   - Ensure Phone provider is enabled and SMS is configured (Twilio).
2. On the support form (`/?asset_id=...`) click “Sign In to Claim”.
3. Complete OTP sign-in → land on `my-items.html?claim=...` and confirm claim.
4. In Supabase:
   - `user_assets`: new row for (`profile_id`, `asset_id`)
5. In `my-items.html`:
   - Requests tab: create a request (blanket/pillow/etc)
   - Messages tab: send a message
6. In Supabase:
   - `user_requests`: new row for the user
   - `messages`: new row with `direction='inbound'`

Staff replying to messages (manual for now):
- Insert a new row in `messages` with the same `profile_id`, `direction='outbound'`, `message_text='...'`.
- Refresh `my-items.html` → the reply appears.

### 4) Data correctness checks

- Washer counts: in seed data the product is `ID Washing Machine`, so anything filtering on exact `Washing Machine` will show 0.
  - The site now classifies washers by checking if product contains `washing/washer/machine`.
- Public-home “Beds Delivered” counts only products containing `Bed`.

### 5) Suggested staging setup (recommended)

- Create a second Supabase project for staging.
- Import the same schema + seed.
- Deploy a “staging” Netlify site (or deploy-preview) pointing at staging Supabase keys.
- Run tests there first, then repeat on production.


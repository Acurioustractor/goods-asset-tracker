# Simple Deployment Guide - QR Support Form

**Fastest path to production**: Single HTML file + Supabase. No build tools, no integrations, no complexity.

Total setup time: **30-60 minutes**

---

## Step 1: Set Up Supabase (15 minutes)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub or email
3. Click "New Project"
4. Fill in:
   - **Name**: Goods Asset Tracker
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Australia Southeast (Sydney)
   - **Plan**: Free
5. Click "Create new project" (takes 2-3 minutes)

### 1.2 Create Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "+ New Query"
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click **Run**
5. You should see success message

### 1.3 Import Your Data

1. SQL Editor → "+ New Query"
2. Copy and paste the entire contents of `supabase/seed.sql`
3. Click **Run** (takes 30-60 seconds for 389 rows)
4. Verify: Run `SELECT COUNT(*) FROM assets;` → Should return **389**

### 1.4 Create Storage Bucket for Photos

1. Go to **Storage** in sidebar
2. Click "New bucket"
3. Name: `ticket-photos`
4. **Public bucket**: ✅ Yes (so photos display in dashboard)
5. Click "Create bucket"

### 1.5 Enable Storage Upload Policy

1. Storage → ticket-photos → Policies
2. Click "New Policy"
3. Choose template: "Allow public uploads"
4. Click "Review" → "Save policy"

### 1.6 Enable Real-Time

1. Go to **Database** → **Publications**
2. Find `supabase_realtime` publication
3. Click edit (pencil icon)
4. Check these tables:
   - ✅ assets
   - ✅ tickets
   - ✅ checkins
   - ✅ alerts
   - ✅ usage_logs
5. Click "Save"

### 1.7 Get Your Credentials

1. Go to **Settings** → **API**
2. Copy these two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
3. Save them - you'll need them in Step 2

---

## Step 2: Configure the Form (5 minutes)

1. Open `frontend/support-form.html` in a text editor
2. Find lines 204-205:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```
3. Replace with your values from Step 1.7:
   ```javascript
   const SUPABASE_URL = 'https://xxxxx.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGc...';
   ```
4. Save the file

---

## Step 3: Deploy the Form (10 minutes)

### Option A: Netlify Drop (Easiest - 2 minutes)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Sign up (free) or login
3. Drag and drop `frontend/support-form.html` into the upload area
4. Wait 5 seconds
5. You get a live URL: `https://random-name.netlify.app`
6. **Done!** Your form is live

To use a custom domain:
1. Buy domain (e.g., goods-tracker.app)
2. Netlify Dashboard → Domain settings
3. Add custom domain
4. Update DNS (follow Netlify instructions)

### Option B: GitHub Pages (Free, Custom Domain)

1. Create GitHub account (if you don't have one)
2. Create new repository: `goods-asset-tracker`
3. Upload `frontend/support-form.html`
4. Rename it to `index.html`
5. Go to Settings → Pages
6. Source: Deploy from branch `main`
7. Your site: `https://username.github.io/goods-asset-tracker`

### Option C: Vercel (Free, Fast)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Create new project
4. Upload `frontend/support-form.html`
5. Deploy
6. Live at: `https://your-project.vercel.app`

---

## Step 4: Update QR Code URLs (10 minutes)

Your QR codes currently point to `https://goods-tracker.app/support?asset_id={id}`

Update them to your new domain:

### Option 1: Update Database (Recommended)

```sql
-- Replace with your actual domain from Step 3
UPDATE assets
SET qr_url = REPLACE(qr_url, 'goods-tracker.app', 'random-name.netlify.app');

-- Verify
SELECT qr_url FROM assets LIMIT 5;
```

### Option 2: Regenerate QR Codes

If you prefer, regenerate with new domain:

```bash
# Edit scripts/generate_qrs.py
# Change domain parameter on line 75

python3 scripts/generate_qrs.py
```

---

## Step 5: Test Everything (10 minutes)

### 5.1 Test QR Scan

1. Print or display one QR code on screen
2. Scan with your phone
3. Verify:
   - ✅ Form loads
   - ✅ Asset details show correctly
   - ✅ All fields are present

### 5.2 Test Form Submission

1. Fill out the form:
   - Name: "Test User"
   - Contact: your email
   - Description: "Test submission"
   - Priority: Medium
   - Photo: (optional) take a test photo
2. Click "Submit"
3. Wait for success message

### 5.3 Verify in Database

1. Supabase Dashboard → Table Editor → tickets
2. You should see your test ticket
3. Check:
   - ✅ asset_id matches
   - ✅ Your name and contact are there
   - ✅ Description is correct
   - ✅ Photo URL works (if you uploaded one)

### 5.4 Test Real-Time (Optional)

1. Open Supabase Table Editor → tickets (keep it open)
2. In another tab/phone, submit another test ticket
3. Watch the Table Editor → new ticket appears instantly!

---

## Step 6: Go Live! (5 minutes)

### 6.1 Print QR Codes

Your QR codes are organized in `data/qr_export_packages/by_community/`

**Quick Start (5-10 test codes)**:
1. Choose a community folder (e.g., `Palm_Island/`)
2. Pick 5-10 SVG files
3. Print on regular paper (50mm x 50mm each)
4. Tape to test assets
5. Test with real users

**Full Rollout**:
1. Send community folders to local print shop
2. Request: Vinyl stickers, weatherproof, 50mm × 50mm
3. Cost: ~$1-3 per sticker
4. Apply to all assets

### 6.2 Train Your Team

Share this checklist with staff:

**When someone scans a QR code:**
1. They see the asset details
2. They fill out the form
3. You get notified in your dashboard
4. You can see the ticket, assign it, resolve it

**Dashboard Access:**
- URL: Supabase Dashboard → Table Editor → tickets
- Or build custom admin dashboard (see main deployment guide)

---

## Costs

| Item | Service | Cost |
|------|---------|------|
| Domain (optional) | Namecheap | $12/year |
| Form hosting | Netlify/Vercel/GitHub Pages | **FREE** |
| Database | Supabase Free Tier | **FREE** (up to 500MB) |
| File storage | Supabase Free Tier | **FREE** (up to 1GB) |
| **Total** | | **$0-12/year** |

Supabase free tier includes:
- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth
- Unlimited API requests
- Real-time subscriptions
- More than enough for hundreds of tickets/month

---

## Troubleshooting

### Form doesn't load asset details

**Check:**
1. QR URL format: Should be `https://your-domain.com/?asset_id=GB0-1`
2. Supabase credentials in HTML file are correct
3. Asset exists in database: `SELECT * FROM assets WHERE unique_id = 'GB0-1';`

**Fix:** Verify URL parameter and database connection

### "Failed to upload photo"

**Check:**
1. Storage bucket `ticket-photos` exists
2. Bucket is public
3. Upload policy is enabled (Storage → Policies)

**Fix:** Re-create bucket or add upload policy (see Step 1.5)

### Submission fails with error

**Check browser console** (F12 → Console):
- Look for red error messages
- Common issues:
  - CORS errors → Check Supabase URL/key
  - RLS errors → Verify policies allow INSERT on tickets
  - Network errors → Check internet connection

**Fix:** Check Supabase Table Editor → tickets → Policies. Should have "Public ticket insert" policy enabled.

### Real-time doesn't work

**Check:**
1. Supabase Dashboard → Database → Publications
2. `supabase_realtime` includes `tickets` table
3. Browser console for subscription errors

**Fix:** Add tables to publication (see Step 1.6)

---

## Next Steps

Now that your basic form is working, consider:

1. **Custom Admin Dashboard** (see main deployment guide)
   - Build with Next.js or use Retool
   - Better ticket management
   - Charts and analytics

2. **Email Notifications** (see main deployment guide)
   - Get notified when new tickets arrive
   - Use Supabase Edge Functions + Resend

3. **IoT Washer Monitoring** (optional)
   - Track washer usage in real-time
   - See Phase 4.2 in main plan

4. **Mobile App** (future)
   - Offline check-ins
   - Push notifications

---

## Support

**Having issues?**
- Check Supabase Dashboard logs
- Review browser console (F12)
- Verify all credentials are correct
- Test with Supabase SQL Editor first

**Everything working?**
Congratulations! You have a production-ready asset tracking system with:
- ✅ 389 assets in database
- ✅ QR code scanning
- ✅ Mobile-friendly support forms
- ✅ Real-time updates
- ✅ Photo uploads
- ✅ Zero monthly costs (on free tier)

**Your system is live and ready to help your communities!** 🎉

---

**Total Setup Time**: 30-60 minutes
**Ongoing Cost**: $0-12/year
**Infrastructure**: Single HTML file + Supabase
**Scalability**: Handles thousands of tickets
**Maintenance**: Minimal - Supabase handles everything

This is a world-class system with enterprise features, built with zero complexity. Enjoy!

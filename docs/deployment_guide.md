# Goods Asset Tracker - Deployment Guide

Complete step-by-step guide to deploy your real-time asset tracking system from development to production.

## 📋 Pre-Deployment Checklist

- [ ] Domain name purchased (e.g., goods-tracker.app)
- [ ] Supabase account created
- [ ] Vercel account created (for frontend)
- [ ] QR codes reviewed and ready for printing
- [ ] Email service configured (Resend/SendGrid) - optional
- [ ] IoT hardware acquired (if using washer monitoring) - optional

---

## Part 1: Database Deployment (Supabase)

### Step 1.1: Create Supabase Project

1. **Sign up/Login**:
   - Go to [supabase.com](https://supabase.com)
   - Sign up with GitHub (recommended) or email

2. **Create New Project**:
   - Click "New Project"
   - Organization: Create new or use existing
   - Name: `Goods-RealTime-Tracker`
   - Database Password: Generate strong password (save in password manager!)
   - Region: **Australia Southeast (Sydney)** (closest to communities)
   - Pricing Plan: Free (upgrade to Pro if needed later)

3. **Wait for Setup** (2-3 minutes)

4. **Save Credentials**:
   - Go to Settings → API
   - Copy and save:
     - Project URL: `https://xxxxxx.supabase.co`
     - Anon (public) Key: `eyJhbGc...`
     - Service Role Key: `eyJhbGc...` (keep secret!)

### Step 1.2: Deploy Database Schema

**Option A: Via Dashboard (Recommended for beginners)**

1. **Open SQL Editor**:
   - Dashboard → SQL Editor → "+ New Query"

2. **Create Schema**:
   - Copy entire contents of `supabase/schema.sql`
   - Paste into SQL Editor
   - Click "Run" (bottom right)
   - Wait for success message
   - Should see: "✅ Goods Asset Register schema created successfully!"

3. **Import Data**:
   - SQL Editor → "+ New Query"
   - Copy entire contents of `supabase/seed.sql`
   - Paste into SQL Editor
   - Click "Run"
   - This may take 30-60 seconds (389 inserts)

4. **Verify Import**:
   - SQL Editor → New Query
   - Run: `SELECT COUNT(*) FROM assets;`
   - Should return: **389**
   - Run: `SELECT product, COUNT(*) FROM assets GROUP BY product;`
   - Should show:
     - Basket Bed: 363
     - ID Washing Machine: 20
     - Weave Bed: 6

**Option B: Via psql CLI**

```bash
# Get connection string from Supabase Dashboard → Settings → Database
DB_URL="postgresql://postgres:[PASSWORD]@db.xxxxxx.supabase.co:5432/postgres"

# Run schema
psql "$DB_URL" -f supabase/schema.sql

# Import data
psql "$DB_URL" -f supabase/seed.sql

# Verify
psql "$DB_URL" -c "SELECT COUNT(*) FROM assets;"
```

### Step 1.3: Enable Real-Time

1. **Open Database → Publications**:
   - Dashboard → Database → Publications

2. **Edit supabase_realtime Publication**:
   - Find "supabase_realtime" publication
   - Click edit
   - Add tables:
     - ✅ assets
     - ✅ checkins
     - ✅ tickets
     - ✅ usage_logs
     - ✅ alerts
   - Save

3. **Verify Real-Time**:
   - SQL Editor → New Query
   - Run: `SELECT schemaname, tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';`
   - Should show all 5 tables

### Step 1.4: Configure Row-Level Security (RLS)

RLS policies are already included in schema.sql, but verify:

1. **Check RLS Status**:
   - Dashboard → Authentication → Policies
   - All 5 tables should show as "Enabled"

2. **Test Public Access** (from SQL Editor):
   ```sql
   -- This should work (public read)
   SELECT * FROM assets LIMIT 1;

   -- This should work (public ticket insert)
   INSERT INTO tickets (asset_id, user_name, issue_description)
   VALUES ('GB0-1', 'Test User', 'Test issue');
   ```

3. **Test Authenticated Access**:
   - Create test user: Dashboard → Authentication → Users → "Add User"
   - Email: test@example.com, Password: Test123!
   - Test authenticated actions work

---

## Part 2: QR Code Deployment

### Step 2.1: Update QR URLs (if needed)

If your domain differs from `https://goods-tracker.app`:

```sql
-- Update all QR URLs in database
UPDATE assets
SET qr_url = REPLACE(qr_url, 'goods-tracker.app', 'your-domain.com');

-- Verify
SELECT qr_url FROM assets LIMIT 5;
```

Re-generate QR codes if needed:
```bash
# Edit scripts/generate_qrs.py - update domain parameter
python3 scripts/generate_qrs.py
```

### Step 2.2: Organize QR Codes for Printing

Your QR codes are already organized in `data/qr_export_packages/`:

**By Community** (recommended for distribution):
```
data/qr_export_packages/by_community/
├── Palm_Island/          # 141 QR codes
├── Tennet_Creek/         # 139 QR codes
├── Alice_Homelands/      # 60 QR codes
├── Maningrida/           # 24 QR codes
├── Kalgoorlie/           # 20 QR codes
└── ...
```

Each folder contains:
- SVG files (scalable, best for printing)
- Manifest CSV (list of assets)

### Step 2.3: Printing

**Recommended Specifications**:
- **Format**: SVG (scalable)
- **Size**: Minimum 50mm x 50mm (2 inches x 2 inches)
- **Material**: Weatherproof vinyl or polyester
- **Finish**: Matte (reduces glare)
- **Adhesive**: Permanent outdoor-grade

**Printing Options**:

1. **Local Print Shop**:
   - Send community folders to local printers
   - Request vinyl stickers or labels
   - Estimated cost: $1-3 per sticker

2. **Online Services**:
   - Sticker Mule (stickermule.com)
   - Vistaprint (vistaprint.com.au)
   - Upload SVG files, specify size

3. **DIY (Budget Option)**:
   - Weatherproof inkjet label sheets
   - Print at home or office
   - Apply laminate for UV protection

### Step 2.4: QR Code Application

**For Beds**:
- Position: Top-right corner of bed frame
- Visible when bed is made
- Not obstructed by bedding

**For Washers**:
- Position: Top panel near controls
- Away from water spray zones
- Visible and accessible

---

## Part 3: Frontend Deployment

### Option A: Next.js Custom App (Full Control)

#### Step 3A.1: Create Next.js Project

```bash
# Create new Next.js app
npx create-next-app@latest goods-tracker-frontend
cd goods-tracker-frontend

# Install dependencies
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-nextjs
npm install recharts  # For charts
npm install date-fns  # For date formatting
```

#### Step 3A.2: Configure Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Keep secret, server-side only
```

#### Step 3A.3: Create Supabase Client

Create `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

#### Step 3A.4: Create Support Form Page

Create `app/support/page.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';

export default function SupportForm() {
  const searchParams = useSearchParams();
  const assetId = searchParams.get('asset_id');
  const [asset, setAsset] = useState<any>(null);
  const [formData, setFormData] = useState({
    user_name: '',
    user_contact: '',
    issue_description: '',
    priority: 'Medium'
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (assetId) {
      // Fetch asset details
      supabase
        .from('assets')
        .select('*')
        .eq('unique_id', assetId)
        .single()
        .then(({ data }) => setAsset(data));
    }
  }, [assetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('tickets')
      .insert({
        asset_id: assetId,
        ...formData
      });

    if (!error) {
      setSubmitted(true);
    } else {
      alert('Error submitting ticket: ' + error.message);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 text-green-600">Thank You!</h1>
        <p>Your support request has been submitted. Someone will follow up soon.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Report an Issue</h1>

      {asset && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h2 className="font-semibold text-lg mb-2">Asset Details</h2>
          <p><strong>Asset ID:</strong> {asset.unique_id}</p>
          <p><strong>Name:</strong> {asset.name}</p>
          <p><strong>Type:</strong> {asset.product}</p>
          <p><strong>Location:</strong> {asset.community}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Your Name *</label>
          <input
            type="text"
            value={formData.user_name}
            onChange={(e) => setFormData({...formData, user_name: e.target.value})}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Number (optional)</label>
          <input
            type="tel"
            value={formData.user_contact}
            onChange={(e) => setFormData({...formData, user_contact: e.target.value})}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Describe the Issue *</label>
          <textarea
            value={formData.issue_description}
            onChange={(e) => setFormData({...formData, issue_description: e.target.value})}
            required
            rows={5}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
        >
          Submit Support Request
        </button>
      </form>
    </div>
  );
}
```

#### Step 3A.5: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Follow prompts:
# - Project name: goods-tracker-frontend
# - Framework: Next.js
# - Build command: (default)
# - Output directory: (default)
```

Set environment variables in Vercel Dashboard:
- Settings → Environment Variables
- Add: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Option B: Google Forms + Zapier (No-Code, Faster)

#### Step 3B.1: Create Google Form

1. **Create Form** (forms.google.com):
   - Title: "Goods Asset Support Request"
   - Fields:
     - Asset ID (short text, required)
     - Your Name (short text, required)
     - Contact Number (short text, optional)
     - Issue Description (paragraph, required)
     - Priority (multiple choice: Low, Medium, High, Urgent)

2. **Get Pre-fill Link**:
   - Click "..." → "Get pre-filled link"
   - Fill Asset ID field with placeholder: `{{asset_id}}`
   - Click "Get Link"
   - Copy link (format: `https://docs.google.com/forms/.../viewform?entry.12345={{asset_id}}`)

3. **Update QR URLs in Database**:
   ```sql
   UPDATE assets
   SET qr_url = 'https://docs.google.com/forms/.../viewform?entry.12345=' || unique_id;
   ```

#### Step 3B.2: Set Up Zapier Integration

1. **Create Zap** (zapier.com):
   - Trigger: Google Forms → New Response
   - Action: Webhooks by Zapier → POST

2. **Configure POST**:
   - URL: `https://[your-project].supabase.co/rest/v1/tickets`
   - Headers:
     - `apikey`: `[your-anon-key]`
     - `Content-Type`: `application/json`
     - `Prefer`: `return=representation`
   - Data:
     ```json
     {
       "asset_id": "{{Asset ID}}",
       "user_name": "{{Your Name}}",
       "user_contact": "{{Contact Number}}",
       "issue_description": "{{Issue Description}}",
       "priority": "{{Priority}}"
     }
     ```

3. **Test** → **Turn on Zap**

### Option C: Retool Admin Dashboard (No-Code)

1. **Create Retool Account** (retool.com)

2. **Connect Supabase**:
   - Resources → New Resource → PostgreSQL
   - Host: `db.[project].supabase.co`
   - Port: 5432
   - Database: postgres
   - Username: postgres
   - Password: [your database password]

3. **Build Dashboard**:
   - Create App → Blank App
   - Add components:
     - **Table**: Query `SELECT * FROM assets ORDER BY community, product`
     - **Chart**: Assets by community (bar chart)
     - **Form**: Create check-in, update asset
     - **Kanban**: Tickets by status

4. **Deploy**:
   - Settings → Publish
   - Custom domain (optional): `admin.goods-tracker.app`

---

## Part 4: Domain & DNS Setup

### Step 4.1: Purchase Domain

1. **Domain Registrar**:
   - Namecheap, Google Domains, or Cloudflare
   - Example: `goods-tracker.app` (~$12-20/year)

### Step 4.2: Configure DNS

Add these DNS records:

```
Type   Name       Value                          TTL
A      @          76.76.21.21 (Vercel IP)        300
CNAME  www        cname.vercel-dns.com.          300
CNAME  admin      [your-retool-url]              300
```

For Vercel:
- Dashboard → Settings → Domains
- Add `goods-tracker.app` and `www.goods-tracker.app`
- Follow verification steps

---

## Part 5: Testing & Go-Live

### Step 5.1: End-to-End Testing

**Test 1: QR Scan Flow**
1. Print 1-2 test QR codes
2. Scan with mobile phone
3. Verify form loads with correct asset details
4. Submit test issue
5. Check ticket appears in database:
   ```sql
   SELECT * FROM tickets ORDER BY submit_date DESC LIMIT 5;
   ```

**Test 2: Real-Time Updates**
1. Open admin dashboard
2. Open SQL Editor in another tab
3. Insert test ticket:
   ```sql
   INSERT INTO tickets (asset_id, user_name, issue_description, priority)
   VALUES ('GB0-1', 'Test', 'Real-time test', 'High');
   ```
4. Verify ticket appears in dashboard immediately (real-time)

**Test 3: Alert Triggers**
1. Create high-priority ticket:
   ```sql
   INSERT INTO tickets (asset_id, user_name, issue_description, priority)
   VALUES ('GB0-1', 'Test', 'Urgent issue', 'Urgent');
   ```
2. Check alert created:
   ```sql
   SELECT * FROM alerts WHERE asset_id = 'GB0-1' ORDER BY alert_date DESC;
   ```

**Test 4: Mobile Responsiveness**
1. Open support form on phone
2. Verify layout is mobile-friendly
3. Test form submission

### Step 5.2: Load Testing (Optional)

```bash
# Install Apache Bench
brew install httpd  # macOS
sudo apt-get install apache2-utils  # Linux

# Test support form endpoint
ab -n 100 -c 10 https://goods-tracker.app/support?asset_id=GB0-1
```

### Step 5.3: Launch Checklist

- [ ] Database deployed and verified (389 assets)
- [ ] QR codes printed and ready
- [ ] Support form tested end-to-end
- [ ] Real-time subscriptions working
- [ ] Alert triggers functioning
- [ ] Admin dashboard accessible
- [ ] Mobile experience tested
- [ ] Domain configured and SSL active
- [ ] Backups enabled (Supabase auto-backup active)
- [ ] Monitoring set up (Supabase Dashboard → Reports)

---

## Part 6: Post-Deployment

### Monitoring

**Supabase Dashboard**:
- Monitor database size: Settings → Usage
- Track API requests: Reports → API
- Check real-time connections: Reports → Realtime

**Alerts**:
- Set up email alerts for:
  - Database >80% capacity
  - High error rates
  - Downtime

### Backups

**Automatic** (Supabase Free Tier):
- Daily backups (7-day retention)
- Upgr ade to Pro for point-in-time recovery

**Manual Backup**:
```bash
# Weekly manual backup
pg_dump "$DB_URL" > backup_$(date +%Y%m%d).sql

# Upload to cloud storage
# aws s3 cp backup_$(date +%Y%m%d).sql s3://your-bucket/backups/
```

### Maintenance Schedule

**Weekly**:
- Review new tickets
- Check alert status
- Verify QR scan rates

**Monthly**:
- Review overdue assets
- Database size check
- Update software dependencies

**Quarterly**:
- Review community asset health
- Plan QR code replacements (if faded)
- Gather feedback for feature improvements

---

## Troubleshooting

### Database Issues

**Problem**: Can't connect to database
```bash
# Test connection
psql "$DB_URL" -c "SELECT 1;"

# Check Supabase status
https://status.supabase.com
```

**Problem**: RLS policies blocking queries
```sql
-- Temporarily disable RLS for testing (ONLY FOR DEBUG)
ALTER TABLE assets DISABLE ROW LEVEL SECURITY;

-- Check which policies exist
SELECT * FROM pg_policies WHERE tablename = 'assets';

-- Re-enable when done
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
```

### QR Code Issues

**Problem**: QR codes not scanning
- Ensure minimum 50mm x 50mm size
- Check phone camera focus
- Try different QR scanning apps

**Problem**: Wrong page loads after scan
- Verify `qr_url` in database
- Check domain DNS configuration

### Frontend Issues

**Problem**: Form not submitting
- Check browser console for errors
- Verify Supabase anon key in .env
- Test API manually:
  ```bash
  curl -X POST https://[project].supabase.co/rest/v1/tickets \
    -H "apikey: [anon-key]" \
    -H "Content-Type: application/json" \
    -d '{"asset_id":"GB0-1","user_name":"Test","issue_description":"Test"}'
  ```

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**Deployment Status**: Ready for production deployment

**Estimated Deployment Time**: 2-4 hours (excluding QR printing)

**Last Updated**: 2025-12-02

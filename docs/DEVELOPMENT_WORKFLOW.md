# Development Workflow - From Setup to Production

Complete guide to deploying your asset tracking system with maximum efficiency.

---

## 📊 Current State Analysis

### ✅ What's Complete (Development Phase)

| Component | Status | Files |
|-----------|--------|-------|
| Data Processing | ✅ Done | `data/expanded_assets_final.csv` (389 assets) |
| QR Code Generation | ✅ Done | `data/qr_codes/` (778 files: SVG + PNG) |
| Database Schema | ✅ Done | `supabase/schema.sql` (production-ready) |
| Seed Data | ✅ Done | `supabase/seed.sql` (389 INSERT statements) |
| Support Form | ✅ Done | `frontend/support-form.html` (needs config) |
| Documentation | ✅ Done | All guides written |
| Scripts | ✅ Done | 5 Python automation scripts |

### ⚠️ What's Needed (Deployment Phase)

| Task | Time | Blocker | Status |
|------|------|---------|--------|
| **1. Choose Domain** | 15 min | Decision needed | ⏳ Pending |
| **2. Set Up Supabase** | 20 min | Need account | ⏳ Pending |
| **3. Configure Form** | 5 min | Needs Supabase URL/key | ⏳ Pending |
| **4. Deploy Form** | 10 min | Need hosting choice | ⏳ Pending |
| **5. Update QR URLs** | 10 min | Needs final domain | ⏳ Pending |
| **6. Test End-to-End** | 30 min | All above must be done | ⏳ Pending |
| **7. Print QR Codes** | Varies | External vendor | ⏳ Pending |

**Total Active Development Time**: ~90 minutes
**External Dependencies**: Domain purchase, QR printing (you handle)

---

## 🚀 Deployment Workflow Options

### Option A: Manual Step-by-Step (Current)

**Pros**: Full control, understand each step
**Cons**: Repetitive, error-prone, slow for iterations
**Time**: 90 minutes first time, 60 minutes for updates

**Process**:
1. Manually create Supabase project
2. Manually copy/paste SQL
3. Manually edit HTML file
4. Manually deploy to Netlify
5. Manually update database
6. Manually test

### Option B: CLI-Driven Workflow (Proposed) ⭐

**Pros**: Fast, repeatable, less error-prone, professional
**Cons**: Needs initial CLI setup
**Time**: 20 minutes first time, 5 minutes for updates

**Process**:
```bash
# One-time setup
goods-tracker init

# Deploy everything
goods-tracker deploy --env production

# Update QR codes
goods-tracker qr update-urls --domain new-domain.com

# Test
goods-tracker test
```

### Option C: Hybrid (Best for You)

**Mix manual for first-time decisions, CLI for repetitive tasks**

**Process**:
1. Manual: Choose domain, create Supabase project (one-time)
2. CLI: Deploy database, configure form, deploy frontend
3. CLI: Update QR URLs, regenerate codes if needed
4. CLI: Run tests, verify setup

---

## 🛠️ Proposed CLI Tool: `goods-tracker`

### Architecture

```
goods-tracker (Python Click CLI)
├── init          → Initialize project config
├── deploy        → Deploy database + frontend
│   ├── --database → Just deploy database
│   ├── --frontend → Just deploy frontend
│   └── --all      → Deploy everything
├── qr            → QR code management
│   ├── generate   → Generate QR codes
│   ├── update-urls → Update URLs in database
│   └── export     → Export organized packages
├── config        → Manage configuration
│   ├── show       → Show current config
│   └── set        → Set config values
├── test          → Run end-to-end tests
└── status        → Check deployment status
```

### Configuration File: `goods-tracker.config.json`

```json
{
  "project": {
    "name": "Goods Asset Tracker",
    "environment": "production"
  },
  "supabase": {
    "url": "https://xxxxx.supabase.co",
    "anon_key": "eyJhbGc...",
    "service_key": "eyJhbGc..."
  },
  "domain": {
    "url": "https://goods-tracker.app",
    "support_path": "/support"
  },
  "deployment": {
    "platform": "netlify",
    "site_id": "xxxxx"
  },
  "data": {
    "csv_path": "data/expanded_assets_final.csv",
    "qr_codes_path": "data/qr_codes"
  }
}
```

### Example Usage

```bash
# First-time setup (interactive)
$ goods-tracker init

Welcome to Goods Asset Tracker Setup! 🚀

Let's configure your project...

? Supabase URL: https://xxxxx.supabase.co
? Supabase Anon Key: eyJhbGc...
? Your Domain: https://goods-tracker.app
? Deployment Platform: (Use arrow keys)
  ❯ Netlify (Recommended)
    Vercel
    GitHub Pages
    Manual

Configuration saved to goods-tracker.config.json ✅

Next steps:
  1. Run: goods-tracker deploy --database
  2. Run: goods-tracker deploy --frontend
  3. Run: goods-tracker test

---

# Deploy database
$ goods-tracker deploy --database

Deploying to Supabase...
✅ Schema deployed (5 tables created)
✅ Seed data imported (389 assets)
✅ Real-time enabled
✅ RLS policies active
✅ Storage bucket created

Database ready! 🎉

---

# Deploy frontend
$ goods-tracker deploy --frontend

Configuring support form...
✅ Supabase credentials injected
✅ Domain configured
✅ Building for deployment...

Deploying to Netlify...
✅ Site deployed: https://random-name.netlify.app

Custom domain setup:
  Add DNS record: CNAME www → random-name.netlify.app

Frontend ready! 🎉

---

# Update QR URLs in database
$ goods-tracker qr update-urls --domain goods-tracker.app

Updating QR URLs...
✅ Updated 389 assets
✅ Old: https://goods-tracker.app/support?asset_id=...
✅ New: https://your-new-domain.com/support?asset_id=...

QR URLs updated! 🎉

Want to regenerate QR codes? Run:
  goods-tracker qr generate --output data/qr_codes_new

---

# Run tests
$ goods-tracker test

Running end-to-end tests...

✅ Database connection (389 assets found)
✅ Support form loads
✅ Asset details display correctly
✅ Form submission works
✅ Real-time updates active
✅ Photo upload functional
✅ QR codes valid (tested 10 random samples)

All tests passed! ✅

Your system is production-ready! 🚀

---

# Check status anytime
$ goods-tracker status

📊 Goods Asset Tracker Status

Project: Production
Environment: Live

Database (Supabase):
  ✅ Connected
  ✅ 389 assets
  ✅ 12 tickets
  ✅ Storage: 45 MB / 500 MB (9%)

Frontend (Netlify):
  ✅ Deployed
  ✅ URL: https://goods-tracker.app
  ✅ Last deploy: 2 hours ago
  ✅ Uptime: 99.9%

QR Codes:
  ✅ 389 generated
  ✅ Domain: goods-tracker.app
  ⚠️  141 not scanned yet (Palm Island)

Tests:
  ✅ Last run: 5 minutes ago
  ✅ All passing

Health: Excellent ✅
```

---

## 📝 Detailed Workflow Steps

### Phase 1: Pre-Deployment Setup (One-Time)

#### Step 1.1: Domain Decision

**Options**:

**A. Use Temporary Domain (Fastest)**
- Netlify auto-generates: `random-name.netlify.app`
- **Pros**: Free, instant, no setup
- **Cons**: Ugly URL, can't customize
- **Use for**: Testing, MVP, immediate deployment

**B. Purchase Custom Domain (Professional)**
- Buy: `goods-tracker.app` or similar
- **Cost**: $12-20/year
- **Pros**: Professional, memorable, brandable
- **Cons**: Costs money, DNS setup needed
- **Use for**: Production, long-term

**C. Use Existing Domain (If you have one)**
- Add subdomain: `support.yourdomain.com`
- **Pros**: No additional cost
- **Cons**: Need DNS access
- **Use for**: If you already own a domain

**CLI Helper**:
```bash
goods-tracker config set domain --interactive

? Choose domain strategy:
  1. Use temporary Netlify domain (free, instant)
  2. I'll purchase a custom domain (recommended)
  3. I have an existing domain (advanced)

> 1

✅ Will use temporary domain
   You can update later with: goods-tracker domain update
```

#### Step 1.2: Supabase Project Setup

**Manual Steps** (20 minutes):
1. Go to supabase.com
2. Create account
3. Create project (wait 2-3 min)
4. Copy URL and keys

**CLI-Assisted** (5 minutes):
```bash
goods-tracker supabase setup

This will:
1. Open Supabase signup page
2. Wait for you to create project
3. Guide you to find credentials
4. Save them securely

Press Enter when ready...

[Opens browser to supabase.com]

? Supabase project ready? (y/n): y
? Paste your Project URL: https://xxxxx.supabase.co
? Paste your Anon Key: eyJhbGc...
? Paste your Service Key: eyJhbGc...

✅ Supabase credentials saved
✅ Testing connection... Success!

Next: goods-tracker deploy --database
```

#### Step 1.3: Choose Deployment Platform

**Options**:

| Platform | Pros | Cons | Time |
|----------|------|------|------|
| **Netlify Drop** | Instant (2 min), free, no account needed | Manual each update | 2 min |
| **Netlify CLI** | Automated, CI/CD, custom domain | Need account | 10 min |
| **Vercel** | Fast, Next.js optimized | Need account | 10 min |
| **GitHub Pages** | Free, familiar | Manual builds | 15 min |

**CLI Setup**:
```bash
goods-tracker deployment setup

? Choose platform:
  ❯ Netlify CLI (recommended)
    Vercel
    GitHub Pages
    Manual (I'll deploy myself)

> Netlify CLI

Installing Netlify CLI...
✅ Netlify CLI installed

? Netlify account ready? (y/n): y

Connecting to Netlify...
✅ Authenticated
✅ Site created: random-name.netlify.app

Configuration saved!
```

---

### Phase 2: Database Deployment (10 minutes)

#### Step 2.1: Deploy Schema

**Manual**:
1. Open Supabase Dashboard
2. SQL Editor → New Query
3. Copy/paste `supabase/schema.sql`
4. Run
5. Verify tables created

**CLI** (Automated):
```bash
goods-tracker deploy --database

Deploying database schema...

Reading: supabase/schema.sql
Connecting to Supabase...
Executing SQL...

✅ Table: assets (389 rows ready)
✅ Table: checkins (0 rows)
✅ Table: tickets (0 rows)
✅ Table: usage_logs (0 rows)
✅ Table: alerts (0 rows)
✅ Indexes created (8)
✅ Triggers active (3)
✅ RLS enabled

Schema deployed! ✅

Next: Importing seed data...
```

#### Step 2.2: Import Data

**Manual**:
1. SQL Editor → New Query
2. Copy/paste `supabase/seed.sql`
3. Run (30-60 seconds)
4. Verify: `SELECT COUNT(*) FROM assets;`

**CLI** (Automated):
```bash
goods-tracker data import

Importing seed data...

Reading: supabase/seed.sql
Parsing 389 INSERT statements...
Connecting to Supabase...

[████████████████████] 389/389 assets imported

✅ Assets imported: 389
✅ Breakdown:
   - Basket Bed: 363
   - ID Washing Machine: 20
   - Weave Bed: 6
✅ Communities: 8
✅ QR URLs: All set

Data imported! ✅

Verify:
  SQL: SELECT COUNT(*) FROM assets;
  Expected: 389
```

#### Step 2.3: Enable Real-Time

**Manual**:
1. Database → Publications
2. Edit `supabase_realtime`
3. Check: assets, tickets, checkins, usage_logs, alerts
4. Save

**CLI** (Automated):
```bash
goods-tracker supabase enable-realtime

Enabling real-time subscriptions...

✅ Table: assets
✅ Table: tickets
✅ Table: checkins
✅ Table: usage_logs
✅ Table: alerts

Real-time enabled! ✅

Test real-time:
  Open: https://[project].supabase.co/project/[id]/database/tables
  Insert test row → See it appear instantly
```

---

### Phase 3: Frontend Deployment (15 minutes)

#### Step 3.1: Configure Support Form

**Manual**:
1. Open `frontend/support-form.html`
2. Find lines 204-205
3. Replace URL and key
4. Save

**CLI** (Automated):
```bash
goods-tracker frontend configure

Configuring support form...

Reading: goods-tracker.config.json
Reading: frontend/support-form.html

Injecting configuration:
✅ SUPABASE_URL → https://xxxxx.supabase.co
✅ SUPABASE_ANON_KEY → eyJhbGc... (hidden)
✅ Domain → https://goods-tracker.app

Saving: frontend/support-form.configured.html

Configuration complete! ✅
```

#### Step 3.2: Deploy Form

**Manual (Netlify Drop)**:
1. Go to app.netlify.com/drop
2. Drag `support-form.configured.html`
3. Wait 5 seconds
4. Copy URL

**CLI** (Automated):
```bash
goods-tracker deploy --frontend

Deploying frontend...

Building for production...
✅ Configuration injected
✅ Assets optimized
✅ Build complete

Deploying to Netlify...
[████████████████████] 100%

✅ Deployed: https://random-name.netlify.app
✅ Status: Live
✅ HTTPS: Enabled

Custom domain setup:
  Run: goods-tracker domain setup --name goods-tracker.app

Frontend deployed! 🎉
```

#### Step 3.3: Setup Custom Domain (Optional)

**Manual**:
1. Netlify Dashboard → Domain settings
2. Add custom domain
3. Add DNS records (wait 5-60 min)
4. Verify SSL

**CLI** (Interactive):
```bash
goods-tracker domain setup --name goods-tracker.app

Setting up custom domain...

? Domain registered? (y/n): y
? DNS access? (y/n): y

Add these DNS records to your domain:

  Type    Name    Value
  ────────────────────────────────────────────
  CNAME   www     random-name.netlify.app
  A       @       75.2.60.5

? Records added? (y/n): y

Verifying DNS...
⏳ Waiting for propagation (this may take 5-60 minutes)...

[████████████████████] Complete

✅ DNS verified
✅ HTTPS certificate issued
✅ Domain active: https://goods-tracker.app

Custom domain ready! 🎉
```

---

### Phase 4: QR URL Management (10 minutes)

#### Step 4.1: Update QR URLs in Database

**Current State**: QR codes point to `https://goods-tracker.app` (placeholder)
**Goal**: Update to your actual deployed domain

**Manual**:
```sql
UPDATE assets
SET qr_url = REPLACE(qr_url, 'goods-tracker.app', 'random-name.netlify.app');
```

**CLI** (Automated):
```bash
goods-tracker qr update-urls --domain random-name.netlify.app

Updating QR URLs in database...

Current domain: goods-tracker.app
New domain: random-name.netlify.app

Affected assets: 389

? Proceed? (y/n): y

Updating...
[████████████████████] 389/389 updated

✅ QR URLs updated

Sample URLs:
  GB0-1: https://random-name.netlify.app/support?asset_id=GB0-1
  GB0-22-5: https://random-name.netlify.app/support?asset_id=GB0-22-5

QR codes still valid! ✅
(QR codes contain the URL, so database update doesn't break existing codes)
```

#### Step 4.2: Regenerate QR Codes (Optional)

**When to regenerate**:
- Domain changed before printing
- Need different format
- Lost original files

**Manual**:
1. Edit `scripts/generate_qrs.py`
2. Update domain parameter
3. Run: `python3 scripts/generate_qrs.py`

**CLI** (Automated):
```bash
goods-tracker qr generate --domain random-name.netlify.app --output data/qr_codes_updated

Generating QR codes...

Domain: random-name.netlify.app
Output: data/qr_codes_updated/

Reading assets from database...
✅ Found 389 assets

Generating...
[████████████████████] 389/389

✅ SVG files: 389
✅ PNG files: 389
✅ Manifest: qr_codes_updated/qr_manifest.csv

Export packages...
✅ By community: 8 folders
✅ By product: 3 folders

QR codes generated! 🎉

Location: data/qr_codes_updated/
Ready for printing!
```

---

### Phase 5: Testing & Validation (20 minutes)

#### Step 5.1: Automated Tests

**CLI**:
```bash
goods-tracker test --full

Running comprehensive test suite...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATABASE TESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Connection successful
✅ Assets table exists (389 rows)
✅ Tickets table exists (0 rows)
✅ Checkins table exists (0 rows)
✅ RLS enabled on all tables
✅ Triggers active (3/3)
✅ Indexes created (8/8)
✅ Storage bucket exists (ticket-photos)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRONTEND TESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Support form accessible
✅ Form loads in <2s
✅ Supabase client initialized
✅ Asset details fetch works
✅ Form validation active
✅ Mobile responsive (viewport tested)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTEGRATION TESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Testing ticket submission...
✅ Test ticket created (ID: 1)
✅ Appears in database
✅ Real-time subscription received update
✅ Photo upload works (test image)

Testing QR codes...
✅ 10 random QR codes scanned
✅ All load correct asset details
✅ URLs valid

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total: 23 tests
Passed: 23 ✅
Failed: 0
Duration: 18.3 seconds

System Status: PRODUCTION READY 🚀
```

#### Step 5.2: Manual Testing Checklist

**CLI-Generated Checklist**:
```bash
goods-tracker test checklist

📋 Manual Testing Checklist

Save this for your records:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QR CODE SCANNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test URL: https://random-name.netlify.app/support?asset_id=GB0-1

□ Print one QR code
□ Scan with phone camera
□ Form loads within 3 seconds
□ Asset details display correctly
  - Asset ID: GB0-1
  - Name: Red Dust
  - Community: Darwin
□ All form fields present

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORM SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Fill out form:
  - Name: Test User
  - Contact: test@example.com
  - Issue: "Test submission from checklist"
  - Priority: Medium
□ Optional: Take photo with phone camera
□ Submit button works
□ Success message appears
□ Form resets after submission

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATABASE VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Go to: https://app.supabase.com/project/[your-id]/editor

□ Open tickets table
□ Find your test ticket
□ Verify all fields correct
□ Click photo URL (if uploaded) - image loads

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REAL-TIME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Keep Supabase table editor open
□ Submit another test ticket from phone
□ New ticket appears instantly (no refresh needed)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MOBILE TESTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Test on iOS (if available)
□ Test on Android (if available)
□ Camera access works
□ Form is readable (no horizontal scroll)
□ Buttons are tap-friendly

All checks passed? You're ready to go live! ✅
```

---

### Phase 6: Go Live (Variable Time)

#### Step 6.1: QR Code Printing Decision

**CLI Helper**:
```bash
goods-tracker qr print-guide

📦 QR Code Printing Guide

Your codes are ready in:
  data/qr_export_packages/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BY COMMUNITY (Recommended for Distribution)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Palm_Island/        141 codes
□ Tennet_Creek/       139 codes
□ Alice_Homelands/     60 codes
□ Maningrida/          24 codes
□ Kalgoorlie/          20 codes
□ Mount_Isa/            2 codes
□ Darwin/               1 code
□ Alice_Springs/        1 code

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRINTING OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Option 1: Test Batch (5-10 codes)
  - Print on regular paper
  - Laminate or use clear tape
  - Test with real users
  - Cost: ~$5 DIY
  - Time: 1 hour

Option 2: Local Print Shop
  - Vinyl stickers, weatherproof
  - 50mm × 50mm minimum
  - Quote: $1-3 per sticker
  - Cost: $389-1,167 total
  - Time: 1-3 days

Option 3: Online Service
  - Upload SVG files
  - Sticker Mule, Vistaprint, etc.
  - Professional quality
  - Cost: $400-800
  - Time: 5-10 days (shipping)

Recommendation:
  Start with Option 1 (test batch)
  Then scale to Option 2 or 3

Next: goods-tracker qr export --test-batch --count 10
```

---

## 🎯 Summary: Complete Deployment Sequence

### With CLI (Fastest - 30 minutes)

```bash
# 1. Initialize (5 min)
goods-tracker init

# 2. Deploy database (5 min)
goods-tracker deploy --database

# 3. Deploy frontend (5 min)
goods-tracker deploy --frontend

# 4. Update QR URLs (2 min)
goods-tracker qr update-urls --domain [your-domain]

# 5. Run tests (3 min)
goods-tracker test

# 6. Check status (1 min)
goods-tracker status

# DONE! System is live ✅
```

### Without CLI (Manual - 90 minutes)

```bash
# 1. Create Supabase project (20 min)
# → supabase.com, manual setup

# 2. Deploy schema (10 min)
# → Copy/paste schema.sql into SQL Editor

# 3. Import data (10 min)
# → Copy/paste seed.sql into SQL Editor

# 4. Enable real-time (5 min)
# → Database → Publications

# 5. Configure form (10 min)
# → Edit support-form.html manually

# 6. Deploy form (15 min)
# → Netlify Drop or CLI

# 7. Update QR URLs (10 min)
# → SQL UPDATE statement

# 8. Manual testing (30 min)
# → Follow checklist above

# DONE! System is live ✅
```

---

## 🔄 Iteration & Updates

### Common Update Scenarios

#### Scenario 1: Domain Changed

**Problem**: You got a custom domain, need to update everything

**CLI**:
```bash
goods-tracker domain update --name goods-tracker.app

This will:
1. Update database QR URLs (389 rows)
2. Reconfigure frontend
3. Redeploy to new domain
4. Re-run tests

Estimated time: 10 minutes

? Proceed? (y/n): y

[Runs all steps automatically]

✅ Domain updated! All systems now use goods-tracker.app
```

**Manual**: 4 separate steps, 30 minutes

#### Scenario 2: New Assets Added

**Problem**: Got 50 new beds, need to add to system

**CLI**:
```bash
# 1. Add to CSV
# Edit: data/new_assets.csv

# 2. Expand and import
goods-tracker data import --file data/new_assets.csv

Reading: data/new_assets.csv
Expanding: 50 grouped entries → 50 individual assets
Generating QR codes...
Importing to database...

✅ 50 new assets added
✅ Total assets: 439
✅ QR codes generated: 50 new files

Next steps:
  1. Print new QR codes: data/qr_codes/svg/ (last 50 files)
  2. Verify: goods-tracker test
```

#### Scenario 3: Supabase Credentials Changed

**Problem**: Rotated API keys for security

**CLI**:
```bash
goods-tracker config update --supabase

? New Supabase URL (or press Enter to keep): [Enter]
? New Anon Key: eyJhbGc... [paste new key]
? New Service Key: eyJhbGc... [paste new key]

Updating configuration...
✅ Config updated
✅ Frontend reconfigured
✅ Redeploying...

✅ All systems updated with new credentials
```

---

## 📋 Next Steps

### For You Now

1. **Decide on CLI**:
   - Want CLI tool? → I'll build it (30 min)
   - Prefer manual? → Use deployment guide

2. **Choose Path**:
   - Quick test: Manual + Netlify Drop (1 hour)
   - Production: CLI + custom domain (30 min with CLI)

3. **Domain Decision**:
   - Temporary: Use Netlify auto-domain
   - Professional: Buy custom domain

Let me know:
- Do you want me to build the CLI tool?
- Should we go with manual or CLI approach?
- Ready to deploy now or want to refine plan first?

I can create the CLI tool in the next step! 🚀

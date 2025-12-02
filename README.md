# Goods Real-Time Asset Tracking System

A world-class real-time asset tracking system for managing 389 individual assets (369 beds, 20 washers) across multiple remote Australian communities.

## 📊 Project Overview

- **Total Assets**: 389 individual items
  - 363 Basket Beds
  - 6 Weave Beds
  - 20 ID Washing Machines
- **Communities**: 8 locations (Palm Island, Tennant Creek, Kalgoorlie, Maningrida, and more)
- **Features**: QR code tracking, real-time forms, IoT monitoring (optional), automated alerts

## 🎯 What's Been Built

### ✅ Phase 1: Data Foundation (COMPLETE)
- [x] CSV data expansion (97 entries → 389 individual assets)
- [x] Data validation (all assets verified, unique IDs confirmed)
- [x] Expanded dataset: [`data/expanded_assets_final.csv`](data/expanded_assets_final.csv)

### ✅ Phase 2: Database Architecture (COMPLETE)
- [x] Complete PostgreSQL schema for Supabase
- [x] 5 tables: assets, checkins, tickets, usage_logs, alerts
- [x] Automated triggers for check-ins, washer monitoring, high-priority tickets
- [x] Row-level security (RLS) policies
- [x] Seed data with all 389 assets

**Database Files:**
- [`supabase/schema.sql`](supabase/schema.sql) - Complete database schema
- [`supabase/seed.sql`](supabase/seed.sql) - INSERT statements for all 389 assets

### ✅ Phase 3: QR Code Generation (COMPLETE)
- [x] 389 unique QR codes generated
- [x] Both SVG (scalable) and PNG (high-res) formats
- [x] Organized by community and product type
- [x] QR codes ready for printing

**QR Code Files:**
- [`data/qr_codes/svg/`](data/qr_codes/svg/) - 389 SVG files
- [`data/qr_codes/png/`](data/qr_codes/png/) - 389 PNG files
- [`data/qr_codes/qr_manifest.csv`](data/qr_codes/qr_manifest.csv) - Complete index
- [`data/qr_export_packages/`](data/qr_export_packages/) - Organized by community/product

## 📁 Project Structure

```
Goods Asset Register/
├── data/
│   ├── expanded_assets_final.csv          # 389 individual assets
│   ├── qr_codes/
│   │   ├── svg/                           # 389 SVG QR codes
│   │   ├── png/                           # 389 PNG QR codes
│   │   └── qr_manifest.csv                # QR code index
│   └── qr_export_packages/
│       ├── by_community/                  # Organized by location
│       ├── by_product/                    # Organized by type
│       └── README.md                      # Printing instructions
├── scripts/
│   ├── expand_csv.py                      # CSV expansion script
│   ├── validate_expansion.py              # Data validation
│   ├── generate_qrs.py                    # QR code generator
│   ├── export_qr_packages.py              # QR organization
│   └── generate_seed_sql.py               # SQL seed generator
├── supabase/
│   ├── schema.sql                         # Database schema
│   └── seed.sql                           # Seed data (389 assets)
├── docs/
│   └── deployment_guide.md                # Deployment instructions
└── README.md                              # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.7+ (for scripts)
- PostgreSQL/Supabase account
- Domain for QR URLs (e.g., goods-tracker.app)

### Step 1: Data Processing (Already Done! ✅)

All data has been processed and is ready to use:

```bash
# Review the expanded data
head data/expanded_assets_final.csv

# Check QR codes
ls data/qr_codes/svg/ | head -10

# Review organized packages for printing
ls data/qr_export_packages/by_community/
```

### Step 2: Database Setup

#### Option A: Supabase Dashboard (Easiest)

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create new project: "Goods-RealTime-Tracker"
   - Choose Australia region
   - Save your credentials

2. **Run Schema**:
   - Dashboard → SQL Editor → New Query
   - Copy contents of `supabase/schema.sql`
   - Click "Run"

3. **Import Data**:
   - SQL Editor → New Query
   - Copy contents of `supabase/seed.sql`
   - Click "Run"
   - Verify: `SELECT COUNT(*) FROM assets;` → Should return 389

4. **Enable Realtime**:
   - Dashboard → Database → Publications
   - Add tables to `supabase_realtime` publication:
     - assets
     - checkins
     - tickets
     - usage_logs
     - alerts

#### Option B: Local PostgreSQL

```bash
# Create database
createdb goods_tracker

# Run schema
psql -d goods_tracker -f supabase/schema.sql

# Import data
psql -d goods_tracker -f supabase/seed.sql

# Verify
psql -d goods_tracker -c "SELECT COUNT(*) FROM assets;"
```

### Step 3: QR Code Printing

Your QR codes are organized and ready:

1. **By Community** (in `data/qr_export_packages/by_community/`):
   - Palm_Island/ - 141 QR codes
   - Tennet_Creek/ - 139 QR codes
   - Alice_Homelands/ - 60 QR codes
   - Maningrida/ - 24 QR codes
   - Kalgoorlie/ - 20 QR codes
   - And more...

2. **By Product** (in `data/qr_export_packages/by_product/`):
   - Basket_Bed/ - 363 QR codes
   - ID_Washing_Machine/ - 20 QR codes
   - Weave_Bed/ - 6 QR codes

3. **Printing Instructions**:
   - See [`data/qr_export_packages/README.md`](data/qr_export_packages/README.md)
   - Recommended: SVG format for scalability
   - Minimum size: 50mm x 50mm
   - Material: Weatherproof/UV-resistant for outdoor use

### Step 4: Frontend Setup (Next Phase)

**Option 1: Next.js + Supabase (Recommended)**

```bash
# Create Next.js app
npx create-next-app@latest goods-tracker-frontend
cd goods-tracker-frontend

# Install Supabase client
npm install @supabase/supabase-js

# Set up environment variables
echo "NEXT_PUBLIC_SUPABASE_URL=your-project-url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env.local
```

**Option 2: Retool (No-Code)**

1. Connect to Supabase via REST API
2. Build admin dashboard with tables and charts
3. Deploy as web app

See [`docs/deployment_guide.md`](docs/deployment_guide.md) for detailed frontend setup instructions.

## 📊 Database Schema

### Tables

**assets** - Central asset registry (389 rows)
- Primary key: `unique_id` (e.g., "GB0-22-3")
- Fields: name, product, community, contact, photos, GPS, dates, QR URL

**checkins** - Visit/inspection records
- Tracks asset check-ins and status updates
- Auto-updates `assets.last_checkin_date`

**tickets** - Support requests via QR scans
- Priority levels: Low, Medium, High, Urgent
- Auto-creates alerts for High/Urgent priorities

**usage_logs** - IoT washer monitoring (optional)
- Power consumption, cycle type, duration
- Auto-creates alerts for overuse/errors

**alerts** - Automated alert system
- Types: Overuse, Maintenance, No Check-in, High Priority Ticket
- Severity: Low, Medium, High, Critical

### Views

- `overdue_assets` - Assets with no check-in in 6+ months
- `active_tickets_summary` - Ticket counts by status/priority
- `community_asset_health` - Health score per community

## 🔧 Scripts Reference

### Data Processing

```bash
# Expand CSV (already run)
python3 scripts/expand_csv.py

# Validate expansion
python3 scripts/validate_expansion.py
```

### QR Code Generation

```bash
# Generate all QR codes (already run)
python3 scripts/generate_qrs.py

# Organize by community/product (already run)
python3 scripts/export_qr_packages.py
```

### Database

```bash
# Generate seed SQL (already run)
python3 scripts/generate_seed_sql.py
```

## 🌐 QR Code URLs

All QR codes point to: `https://goods-tracker.app/support?asset_id={unique_id}`

**Examples:**
- `https://goods-tracker.app/support?asset_id=GB0-1`
- `https://goods-tracker.app/support?asset_id=GB0-22-3`
- `https://goods-tracker.app/support?asset_id=GB0-150-6`

**To Update Domain:**
1. Update `qr_url` column in database
2. Or use URL redirect from old domain to new

## 📈 Next Steps

### Immediate (Phase 4-6)
1. [ ] Set up domain (e.g., goods-tracker.app)
2. [ ] Deploy database to Supabase
3. [ ] Build QR support form (Next.js or Google Forms)
4. [ ] Create admin dashboard (Retool or custom)
5. [ ] Print and apply QR codes
6. [ ] Test end-to-end flow

### Optional (Phase 4.2)
1. [ ] Set up IoT washer monitoring (ESP32 or smart plugs)
2. [ ] Configure email alerts (Resend/SendGrid)
3. [ ] Add mobile PWA features

### Future Enhancements
- SMS alerts for urgent tickets
- Asset transfer workflow
- Mobile app (React Native)
- Multi-language support
- Predictive maintenance
- Community portal

## 💰 Estimated Costs

**Year 1** (AUD):
- Domain: $12
- Supabase: $0 (free tier, or $25/mo for Pro)
- Vercel hosting: $0 (free tier)
- IoT hardware (optional): $300-500
- **Total: $12-$837**

**Year 2+**: $12-$337/year

**Note**: Printing costs handled separately

## 📚 Documentation

- [Deployment Guide](docs/deployment_guide.md) - Full deployment instructions
- [QR Printing Guide](data/qr_export_packages/README.md) - Printing instructions
- [Database Schema](supabase/schema.sql) - Complete schema with comments
- [Implementation Plan](https://claude.com/plans/...) - Original detailed plan

## 🐛 Troubleshooting

### QR Codes Not Scanning
- Ensure minimum 50mm x 50mm size
- Check phone camera permissions
- Verify URL in database matches QR code

### Database Connection Issues
- Verify Supabase credentials in .env
- Check RLS policies are enabled
- Confirm tables are created

### Data Import Errors
- Check for special characters in CSV
- Verify photo URLs are valid
- Ensure dates are in ISO format

## 🤝 Support

For issues or questions:
1. Review documentation in `docs/`
2. Check script comments in `scripts/`
3. Verify database schema in `supabase/schema.sql`
4. Contact project maintainer

## 📝 License

Proprietary - Goods Asset Register Project

---

**Status**: ✅ Data processing, QR generation, and database schema complete. Ready for deployment phase.

**Last Updated**: 2025-12-02

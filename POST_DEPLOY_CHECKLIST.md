# Post-Deployment Checklist

## ✅ Completed

- [x] Git repository initialized
- [x] Code pushed to GitHub: https://github.com/Acurioustractor/goods-asset-tracker
- [x] Professional configuration files created (netlify.toml, .gitignore)
- [x] Database deployed with 404 assets
- [x] Netlify dashboard opened

## 🔄 In Progress

### 1. Connect GitHub to Netlify (YOU ARE HERE)

**In the Netlify dashboard:**

1. Click **"Import from Git"** or **"Add new site"**
2. Choose **"GitHub"**
3. Authorize Netlify to access your GitHub (if asked)
4. Select repository: **"Acurioustractor/goods-asset-tracker"**
5. Build settings:
   - Build command: (leave empty)
   - Publish directory: **`deploy`**
   - Branch to deploy: **`main`**
6. Click **"Deploy site"**

**Wait for deployment to complete** (usually 1-2 minutes)

Once deployed, you'll get a URL like: `https://YOUR-SITE-NAME.netlify.app`

---

## ⏳ Next Steps (After Netlify Deploy)

### 2. Update Configuration with New URL

```bash
goods-tracker config set frontend_url https://YOUR-SITE-NAME.netlify.app
```

### 3. Update All QR Code URLs in Database

This updates all 404 assets to point to the new domain:

```bash
goods-tracker qr update-urls YOUR-SITE-NAME.netlify.app
```

**What this does:**
- Updates `qr_url` field for all 404 assets in database
- Changes from old domain to new Netlify domain
- Takes ~30 seconds to complete

### 4. Regenerate QR Codes (Optional but Recommended)

If you want fresh QR code files with the new domain:

```bash
goods-tracker qr generate --force
```

**Output:**
- Updates all SVG files in `data/qr_codes/svg/`
- Updates all PNG files in `data/qr_codes/png/`
- Preserves existing files, overwrites with new URLs

### 5. Export QR Packages for Printing

Organize QR codes by community/product for easy printing:

```bash
goods-tracker qr export
```

**Output:**
- Creates `data/qr_export_packages/by_community/`
- Creates `data/qr_export_packages/by_product/`
- Includes manifest CSVs for tracking

### 6. Delete Old Netlify Drop Site

1. Go to: https://app.netlify.com/teams/YOUR-TEAM/sites
2. Find the old site: **"quiet-babka-e6d738"**
3. Click on it → **Settings** → **Danger zone**
4. Click **"Delete this site"**
5. Confirm deletion

**Why delete it?**
- Avoids confusion with multiple deployments
- Frees up your Netlify site limit
- Old site has password protection issues

### 7. Run Verification Tests

Test that everything is working:

```bash
python3 scripts/verify_deployment.py
```

**What it tests:**
- Frontend accessible (HTTP 200)
- Supabase integration present
- QR scan URLs work (loads asset details)
- Database API accessible

**If live numbers / asset data don’t load online**
- In Supabase Dashboard → SQL Editor, run: `supabase/grants.sql`
- This fixes the common case where RLS policies exist, but the API roles (`anon`/`authenticated`) are missing table GRANTs (browser errors like `permission denied for relation assets`).

Expected output:
```
Testing frontend: https://YOUR-SITE-NAME.netlify.app
  ✓ Frontend accessible (status: 200)
  ✓ Supabase integration detected

Testing QR scan: https://YOUR-SITE-NAME.netlify.app?asset_id=GB0-1
  ✓ QR URL accessible
  ✓ Asset ID found in page

Testing database connection...
  ✓ Database accessible

✅ All tests passed! Deployment is working correctly.
```

### 8. Manual End-to-End Test

**Test with your phone:**

1. Open camera app or QR scanner
2. Scan any test QR code (e.g., `data/qr_codes/png/qr_GB0-1.png`)
3. Should open: `https://YOUR-SITE-NAME.netlify.app?asset_id=GB0-1`
4. Verify asset details load (name, community, product)
5. Fill out support form with test data
6. Submit ticket

**Verify in database:**
```bash
goods-tracker test
```

Or manually:
```bash
psql "postgresql://postgres:PASSWORD@db.cwsyhpiuepvdjtxaozwf.supabase.co:5432/postgres" \
  -c "SELECT * FROM tickets ORDER BY submit_date DESC LIMIT 5;"
```

### 9. Commit and Push Final Updates

After updating QR URLs and regenerating codes:

```bash
git add data/
git commit -m "Update QR codes with new Netlify domain"
git push
```

**Note:** This will trigger another automatic deployment on Netlify (takes ~1 min)

---

## 📊 System Status

Run this to check overall system health:

```bash
goods-tracker status
```

Expected output:
```
System Status
────────────────────────────────────────────────────────────
Configuration:     ✓ Found (~/.goods-tracker/config.json)
Database:          ✓ Connected (cwsyhpiuepvdjtxaozwf.supabase.co)
Assets:            ✓ 404 assets in database
Frontend:          ✓ Deployed (YOUR-SITE-NAME.netlify.app)
QR Codes:          ✓ 404 SVG + 404 PNG files generated

Status: All systems operational ✓
```

---

## 🚀 You're Done!

Once all checks pass, your system is fully deployed and operational:

- ✅ **Professional Git workflow**: Push to GitHub → Auto-deploy to Netlify
- ✅ **404 assets tracked**: All beds and washers in database
- ✅ **QR codes ready**: SVG + PNG files organized by community/product
- ✅ **Support form live**: QR scans load form with pre-filled asset details
- ✅ **Scalable architecture**: Team collaboration, version control, rollback capability

---

## 🆘 Troubleshooting

### "Site shows password protection"
- This is the OLD Netlify Drop site
- Ignore it and delete after new deployment is live
- The new GitHub-connected site will NOT have password protection

### "QR URLs still point to old domain"
```bash
# Check current URLs
goods-tracker status

# Update if needed
goods-tracker qr update-urls YOUR-NEW-DOMAIN.netlify.app
```

### "Tests failing"
```bash
# Check system status
goods-tracker status

# Verify configuration
goods-tracker config show

# Re-run init if needed
goods-tracker init
```

### "Database connection failed"
- Check Supabase project is active: https://supabase.com/dashboard/projects
- Verify credentials: `goods-tracker config show`
- Test connection: `goods-tracker test`

---

## 📞 Support

If you encounter issues:

1. Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting
2. Review [cli/README.md](cli/README.md) for CLI documentation
3. Run `goods-tracker --help` for command reference

---

**Current Step:** Connect GitHub to Netlify (see top of this file)

**Status:** Awaiting Netlify deployment completion

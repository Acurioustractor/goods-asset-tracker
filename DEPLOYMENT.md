# Professional Deployment Guide

## Overview

This guide covers the professional deployment workflow for the Goods Asset Tracker system.

**What you get:**
- ✅ Automatic deployments from Git
- ✅ Version control and rollback capability
- ✅ Staging and production environments
- ✅ Easy team collaboration
- ✅ Professional workflow

---

## Prerequisites

- GitHub account
- Netlify account (free tier is fine)
- Supabase project (already set up)

---

## Deployment Workflow

### Option A: GitHub + Netlify (Recommended)

**Why this approach:**
- Push to GitHub → Automatic deployment
- Version controlled
- Easy rollbacks
- Team collaboration ready
- Free hosting

**Steps:**

#### 1. Create GitHub Repository

```bash
# Already done: Git initialized locally
# Now push to GitHub

# Create repository on GitHub.com:
# - Go to https://github.com/new
# - Name: goods-asset-tracker
# - Description: Real-time asset tracking system with QR codes
# - Public or Private: Your choice
# - Don't initialize with README (we already have files)

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/goods-asset-tracker.git
git branch -M main
git push -u origin main
```

#### 2. Connect to Netlify

**Method 1: Netlify Dashboard**

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Authorize Netlify to access GitHub
5. Select "goods-asset-tracker" repository
6. Configure build settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `deploy`
   - **Branch:** `main`
7. Click "Deploy site"

**Method 2: Netlify CLI** (Faster)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize and deploy
cd "/Volumes/OS_FIELD_B/Code/Goods Asset Register"
netlify init

# Follow prompts:
# - Create & configure a new site
# - Team: Choose your team
# - Site name: goods-asset-tracker (or auto-generated)
# - Build command: (leave empty)
# - Directory to deploy: deploy

# Deploy
netlify deploy --prod
```

#### 3. Configure Environment (If Needed)

If you ever need environment variables (for future features):

```bash
# Via CLI
netlify env:set SUPABASE_URL "https://your-project.supabase.co"
netlify env:set SUPABASE_ANON_KEY "your-anon-key"

# Or via Dashboard:
# Site settings → Environment variables → Add variable
```

#### 4. Custom Domain (Optional)

```bash
# Via CLI
netlify domains:add yourdomain.com

# Or via Dashboard:
# Domain settings → Add custom domain → Follow DNS instructions
```

---

### Option B: Vercel (Alternative)

**Why Vercel:**
- Even easier than Netlify
- Excellent performance
- Great developer experience

**Steps:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd "/Volumes/OS_FIELD_B/Code/Goods Asset Register"
vercel --prod

# Follow prompts:
# - Set up and deploy
# - Link to existing project or create new
# - Project name: goods-asset-tracker
# - Directory: deploy
```

---

## Workflow After Setup

### Making Updates

```bash
# 1. Make changes to code
# (Edit files, add features, update assets, etc.)

# 2. Test locally
python3 -m http.server 8000 --directory deploy
# Test at http://localhost:8000

# 3. Commit changes
git add .
git commit -m "Description of changes"

# 4. Push to GitHub
git push

# 5. Automatic deployment!
# Netlify/Vercel automatically deploys the new version
```

### Adding New Assets

```bash
# 1. Add new assets
python3 scripts/add_new_assets.py
# Or use the CLI:
goods-tracker qr generate

# 2. Commit and push
git add data/
git commit -m "Added 10 new beds for Community X"
git push

# 3. Automatic deployment!
```

### Rollback (If Something Breaks)

**Netlify:**
```bash
# Via Dashboard:
# Deploys → Find working version → Publish deploy

# Via CLI:
netlify rollback
```

**Vercel:**
```bash
# Via Dashboard:
# Deployments → Find working version → Promote to production
```

---

## Environment Management

### Production Environment

- **URL:** Your live Netlify/Vercel URL
- **Branch:** `main`
- **Database:** Production Supabase project
- **Purpose:** User-facing, stable

### Staging Environment (Optional)

Create a staging branch for testing:

```bash
# Create staging branch
git checkout -b staging

# Push to GitHub
git push -u origin staging

# In Netlify/Vercel:
# - Configure branch deploys
# - Staging branch → staging-subdomain.netlify.app
```

### Development Environment

- **URL:** `http://localhost:8000`
- **Branch:** Local feature branches
- **Database:** Same production DB (or create a staging DB)
- **Purpose:** Local development and testing

---

## Team Collaboration

### Adding Team Members

**GitHub:**
```bash
# Repository → Settings → Collaborators
# Add team members
```

**Netlify:**
```bash
# Site settings → Team and accounts → Add team members
# Assign roles: Owner, Admin, Developer, etc.
```

### Protected Branches

```bash
# On GitHub:
# Settings → Branches → Add branch protection rule
# - Branch name: main
# - Require pull request reviews
# - Require status checks to pass
```

---

## Scaling Considerations

### When You Outgrow Free Tier

**Supabase:**
- Free: 500MB database, 2GB bandwidth
- Pro: $25/month - 8GB database, 50GB bandwidth
- **Upgrade trigger:** >400 assets or >1000 tickets/month

**Netlify:**
- Free: 100GB bandwidth
- Pro: $19/month - 1TB bandwidth
- **Upgrade trigger:** >10k visitors/month

**Vercel:**
- Free: 100GB bandwidth
- Pro: $20/month - 1TB bandwidth
- **Upgrade trigger:** >10k visitors/month

### Performance Optimization

When you scale:

1. **CDN for QR Codes:**
   - Move QR codes to Cloudflare R2 or AWS S3
   - Serve via CDN for faster loading

2. **Database Optimization:**
   - Add database indexes (already done)
   - Enable connection pooling
   - Consider read replicas for high traffic

3. **Caching:**
   - Enable edge caching
   - Cache asset data in browser
   - Use service workers for offline support

---

## Monitoring & Analytics

### Built-in Tools

**Netlify Analytics:**
```bash
# Site settings → Analytics → Enable
# $9/month for serverless analytics
```

**Vercel Analytics:**
```bash
# Automatically included
# Real User Monitoring (RUM)
```

### Custom Monitoring

Add to `deploy/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

<!-- Sentry Error Tracking -->
<script src="https://browser.sentry-cdn.com/7.x/bundle.min.js"></script>
```

---

## Security Best Practices

### Current Implementation

✅ HTTPS enforced
✅ Security headers configured
✅ Supabase RLS policies active
✅ No secrets in repository
✅ CORS properly configured

### Additional Security (When Scaling)

1. **Rate Limiting:**
   - Implement in Supabase Edge Functions
   - Prevent spam submissions

2. **WAF (Web Application Firewall):**
   - Netlify Pro includes basic WAF
   - Or use Cloudflare (free tier available)

3. **Regular Audits:**
   ```bash
   # Check for vulnerabilities
   npm audit

   # Lighthouse security score
   lighthouse https://your-site.com --only-categories=security
   ```

---

## Disaster Recovery

### Backup Strategy

**Database:**
```bash
# Automatic: Supabase daily backups (7-day retention)

# Manual backup:
pg_dump -h db.project.supabase.co -U postgres > backup_$(date +%Y%m%d).sql

# Store in:
# - Google Drive
# - AWS S3
# - GitHub (encrypted)
```

**Code:**
```bash
# Already backed up in GitHub
# Additional mirrors:
git remote add backup https://gitlab.com/you/goods-asset-tracker.git
git push backup main
```

**QR Codes:**
```bash
# Archive print-ready files
tar -czf qr_codes_$(date +%Y%m%d).tar.gz data/qr_codes/
# Upload to cloud storage
```

---

## Cost Projections

### Year 1 (Free Tier)

| Service | Cost | Notes |
|---------|------|-------|
| Domain | $12/year | Optional |
| Netlify | $0 | Free tier sufficient |
| Supabase | $0 | Free tier sufficient |
| GitHub | $0 | Public repo |
| **Total** | **$0-12/year** | |

### Year 2+ (Scaling)

| Service | Free Tier | Paid Tier | Trigger |
|---------|-----------|-----------|---------|
| Netlify | $0 | $19/mo | >100GB bandwidth |
| Supabase | $0 | $25/mo | >500MB database |
| Domain | $12/yr | $12/yr | Always |
| **Total** | **$12/yr** | **$540/yr** | At scale |

---

## Troubleshooting

### Deploy Fails

```bash
# Check logs
netlify logs

# Or in dashboard:
# Deploys → Failed deploy → View logs
```

### Site Not Updating

```bash
# Clear cache
netlify build --clear-cache

# Force deploy
git commit --allow-empty -m "Force rebuild"
git push
```

### Database Connection Issues

```bash
# Verify Supabase credentials in deploy/index.html
# Check Supabase project status
# Review Supabase logs
```

---

## Next Steps

1. **Push to GitHub** (5 minutes)
2. **Connect to Netlify** (5 minutes)
3. **Verify deployment** (2 minutes)
4. **Update QR URLs** (if domain changed)
5. **Test end-to-end** (10 minutes)

**Total setup time:** ~30 minutes for a professional, scalable deployment!

---

## Support & Resources

- **Netlify Docs:** https://docs.netlify.com/
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Git Best Practices:** https://git-scm.com/doc

---

**Status:** Ready for professional deployment ✅
**Maintained by:** Your team
**Last updated:** 2025-12-02

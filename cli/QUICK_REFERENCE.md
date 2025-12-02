# Goods Tracker CLI - Quick Reference Card

## Installation

```bash
./cli/setup.sh --global
```

## Essential Commands

### Setup & Status
```bash
goods-tracker init              # Initialize project
goods-tracker status            # Check system status
goods-tracker test              # Run all tests
```

### Deployment
```bash
goods-tracker deploy database            # Deploy schema + seed data
goods-tracker deploy database --schema-only  # Schema only
goods-tracker deploy frontend            # Deploy form (Netlify)
goods-tracker deploy frontend --platform vercel  # Deploy to Vercel
```

### QR Code Management
```bash
goods-tracker qr generate                # Generate all QR codes
goods-tracker qr generate --force        # Regenerate existing
goods-tracker qr update-urls example.com # Update database URLs
goods-tracker qr export                  # Organize by community/product
```

### Configuration
```bash
goods-tracker config show               # View config (masked)
goods-tracker config set key value      # Set config value
goods-tracker config reset              # Reset all config
```

## Common Workflows

### First Time Deployment (30 mins)
```bash
goods-tracker init
goods-tracker deploy database
goods-tracker deploy frontend
goods-tracker test
```

### Update Domain
```bash
goods-tracker qr update-urls new-domain.com
goods-tracker qr generate --force
goods-tracker qr export
```

### Add New Assets
```bash
python3 scripts/expand_csv.py
python3 scripts/generate_seed_sql.py
goods-tracker deploy database
goods-tracker qr generate
goods-tracker test
```

## Configuration File

Location: `~/.goods-tracker/config.json`

```json
{
  "project_name": "Goods Asset Tracker",
  "domain": "your-domain.com",
  "supabase_url": "https://xxx.supabase.co",
  "supabase_anon_key": "eyJ...",
  "supabase_service_key": "eyJ...",
  "db_password": "***",
  "frontend_path": "/path/to/support-form.html",
  "frontend_url": "https://deployed-site.com"
}
```

## Troubleshooting

### Error: "No configuration found"
```bash
goods-tracker init
```

### Error: "psql not found"
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client
```

### Error: "Database connection failed"
- Check Supabase credentials
- Verify database password
- Ensure Supabase project is active

### Tests failing
```bash
goods-tracker status  # Identify missing components
```

## Help Commands

```bash
goods-tracker --help
goods-tracker deploy --help
goods-tracker qr --help
goods-tracker config --help
```

## Output Colors

- 🟢 Green ✓ - Success
- 🔴 Red ✗ - Error
- 🟡 Yellow ⚠ - Warning
- 🔵 Cyan ℹ - Info

## Version

```bash
goods-tracker --version
```

---

**Full Documentation**: [cli/README.md](README.md)

**Implementation Details**: [CLI_SUMMARY.md](../CLI_SUMMARY.md)

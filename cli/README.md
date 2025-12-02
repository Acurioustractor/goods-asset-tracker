# Goods Tracker CLI

A command-line tool for managing the Goods Real-Time Asset Tracking System.

## Quick Start

### Installation

```bash
# From project root
./cli/setup.sh

# For global access (optional)
./cli/setup.sh --global
```

### Basic Usage

```bash
# Initialize your project
goods-tracker init

# Check system status
goods-tracker status

# Deploy database
goods-tracker deploy database

# Deploy frontend
goods-tracker deploy frontend

# Run tests
goods-tracker test
```

## Commands

### `init`
Initialize a new Goods Tracker project. Prompts for:
- Supabase credentials (URL, anon key, service key)
- Database password
- Domain name (optional)

Saves configuration to `~/.goods-tracker/config.json`

### `status`
Display current system status:
- Configuration details
- Data file status (CSV, QR codes)
- Database readiness
- Frontend readiness

### `deploy database`
Deploy database schema and seed data to Supabase.

**Options:**
- `--schema-only` - Deploy only the schema, skip seed data

**Requirements:**
- PostgreSQL client tools (`psql`) installed
- Database password configured

**Example:**
```bash
# Deploy everything
goods-tracker deploy database

# Schema only
goods-tracker deploy database --schema-only
```

### `deploy frontend`
Deploy the support form frontend.

**Options:**
- `--platform` - Choose platform: `netlify` (default), `vercel`, or `manual`

**Example:**
```bash
# Deploy to Netlify Drop (easiest)
goods-tracker deploy frontend

# Deploy to Vercel
goods-tracker deploy frontend --platform vercel

# Get manual deployment instructions
goods-tracker deploy frontend --platform manual
```

### `qr generate`
Generate QR codes for all 389 assets.

**Options:**
- `--force` - Regenerate even if QR codes already exist

**Output:**
- SVG files in `data/qr_codes/svg/`
- PNG files in `data/qr_codes/png/`
- Manifest CSV in `data/qr_codes/qr_manifest.csv`

**Example:**
```bash
goods-tracker qr generate
```

### `qr update-urls`
Update QR code URLs in the database after domain change.

**Example:**
```bash
# Update to new domain
goods-tracker qr update-urls my-new-domain.com

# Update to Netlify URL
goods-tracker qr update-urls random-name.netlify.app
```

### `qr export`
Export QR codes organized by community and product type.

**Output:**
- Organized folders in `data/qr_export_packages/`
- By community (8 folders)
- By product (3 folders)

**Example:**
```bash
goods-tracker qr export
```

### `test`
Run comprehensive system tests:
1. Validate expanded CSV
2. Check QR code count
3. Test Supabase connection
4. Check frontend file and credentials
5. Verify database asset count

**Example:**
```bash
goods-tracker test
```

### `config show`
Display current configuration (with sensitive values masked).

**Example:**
```bash
goods-tracker config show
```

### `config set`
Set a configuration value.

**Example:**
```bash
goods-tracker config set domain goods-tracker.app
goods-tracker config set frontend_url https://my-site.netlify.app
```

### `config reset`
Reset all configuration (with confirmation prompt).

**Example:**
```bash
goods-tracker config reset
```

## Configuration

Configuration is stored in `~/.goods-tracker/config.json`:

```json
{
  "project_name": "Goods Asset Tracker",
  "domain": "goods-tracker.app",
  "supabase_url": "https://xxxxx.supabase.co",
  "supabase_anon_key": "eyJhbGc...",
  "supabase_service_key": "eyJhbGc...",
  "db_password": "your-db-password",
  "frontend_path": "/path/to/frontend/support-form.html",
  "frontend_url": "https://your-deployed-site.com"
}
```

## Workflows

### Complete Deployment (30 minutes)

```bash
# 1. Initialize
goods-tracker init

# 2. Check status
goods-tracker status

# 3. Deploy database
goods-tracker deploy database

# 4. Deploy frontend
goods-tracker deploy frontend

# 5. Update QR URLs (if using temporary domain)
goods-tracker qr update-urls your-domain.netlify.app

# 6. Run tests
goods-tracker test
```

### Update Domain

```bash
# Update QR URLs in database
goods-tracker qr update-urls new-domain.com

# Regenerate QR codes (optional)
goods-tracker qr generate --force
goods-tracker qr export
```

### Add New Assets

```bash
# 1. Update CSV
# 2. Re-run expansion script
python3 scripts/expand_csv.py

# 3. Regenerate seed SQL
python3 scripts/generate_seed_sql.py

# 4. Deploy updated data
goods-tracker deploy database

# 5. Generate new QR codes
goods-tracker qr generate

# 6. Export packages
goods-tracker qr export

# 7. Verify
goods-tracker test
```

## Requirements

### System Requirements
- Python 3.7+
- PostgreSQL client tools (`psql`)
- Internet connection

### Installing psql

**macOS:**
```bash
brew install postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql-client
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### Python Dependencies
- `click` - CLI framework
- `requests` - HTTP client

Installed automatically by `setup.sh`

## Troubleshooting

### "psql not found"
Install PostgreSQL client tools (see Requirements above)

### "No configuration found"
Run `goods-tracker init` to set up configuration

### "Database connection failed"
Check:
- Database password is correct
- Supabase project is running
- Network connection is active

### "Frontend credentials not updated"
Run `goods-tracker init` again and confirm credential update

### Tests failing
Run `goods-tracker status` to identify missing components

## Development

### Running without installation

```bash
# From project root
python3 cli/goods_tracker.py [command]
```

### Adding new commands

Edit `cli/goods_tracker.py` and add new Click commands:

```python
@cli.command()
def my_command():
    """My custom command."""
    header("🎯 My Command")
    # Implementation
    success("Done!")
```

## Support

For issues or questions:
1. Check `goods-tracker status`
2. Run `goods-tracker test` for diagnostics
3. Review configuration with `goods-tracker config show`
4. Check main project documentation in `docs/`

## Version

Current version: 1.0.0

## License

Part of the Goods Asset Tracker project.

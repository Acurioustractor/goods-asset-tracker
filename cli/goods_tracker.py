#!/usr/bin/env python3
"""
Goods Asset Tracker CLI
A command-line tool for managing the Goods Real-Time Asset Tracking System.
"""

import click
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Optional, Dict, Any
import requests

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def success(msg):
    click.echo(f"{Colors.OKGREEN}✓{Colors.ENDC} {msg}")

def info(msg):
    click.echo(f"{Colors.OKCYAN}ℹ{Colors.ENDC} {msg}")

def warning(msg):
    click.echo(f"{Colors.WARNING}⚠{Colors.ENDC} {msg}")

def error(msg):
    click.echo(f"{Colors.FAIL}✗{Colors.ENDC} {msg}", err=True)

def header(msg):
    click.echo(f"\n{Colors.BOLD}{Colors.HEADER}{msg}{Colors.ENDC}\n")

# Configuration file paths
CONFIG_FILE = Path.home() / '.goods-tracker' / 'config.json'

# Resolve symlink to get actual script location
SCRIPT_PATH = Path(__file__).resolve()
PROJECT_ROOT = SCRIPT_PATH.parent.parent

@click.group()
@click.version_option(version='1.0.0', prog_name='goods-tracker')
def cli():
    """
    Goods Asset Tracker CLI

    Manage your real-time asset tracking system with ease.
    """
    pass

def load_config() -> Dict[str, Any]:
    """Load configuration from file."""
    if not CONFIG_FILE.exists():
        return {}

    try:
        with open(CONFIG_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        error(f"Failed to load config: {e}")
        return {}

def save_config(config: Dict[str, Any]):
    """Save configuration to file."""
    CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)

    try:
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f, indent=2)
        success(f"Configuration saved to {CONFIG_FILE}")
    except Exception as e:
        error(f"Failed to save config: {e}")
        sys.exit(1)

@cli.command()
def init():
    """Initialize a new Goods Tracker project."""
    header("🚀 Goods Tracker Initialization")

    config = {}

    # Project details
    click.echo(f"{Colors.BOLD}Project Details{Colors.ENDC}")
    config['project_name'] = click.prompt("Project name", default="Goods Asset Tracker")
    config['domain'] = click.prompt("Domain (leave empty for temporary)", default="", show_default=False)

    # Supabase credentials
    click.echo(f"\n{Colors.BOLD}Supabase Configuration{Colors.ENDC}")
    info("Get these from: https://app.supabase.com/project/_/settings/api")
    config['supabase_url'] = click.prompt("Supabase Project URL")
    config['supabase_anon_key'] = click.prompt("Supabase Anon Key", hide_input=True)
    config['supabase_service_key'] = click.prompt("Supabase Service Role Key (optional)", default="", hide_input=True, show_default=False)

    # Database credentials
    click.echo(f"\n{Colors.BOLD}Database Connection{Colors.ENDC}")
    config['db_password'] = click.prompt("Database Password", hide_input=True)

    # Frontend deployment
    click.echo(f"\n{Colors.BOLD}Deployment Settings{Colors.ENDC}")
    config['frontend_path'] = str(PROJECT_ROOT / 'frontend' / 'support-form.html')

    # Save configuration
    save_config(config)

    # Update frontend HTML with credentials
    if click.confirm("\nUpdate frontend HTML with Supabase credentials?", default=True):
        update_frontend_credentials(config)

    header("✨ Initialization Complete!")
    info("Run 'goods-tracker status' to check your setup")
    info("Run 'goods-tracker deploy --help' for deployment options")

def update_frontend_credentials(config: Dict[str, Any]):
    """Update support-form.html with Supabase credentials."""
    frontend_path = Path(config['frontend_path'])

    if not frontend_path.exists():
        error(f"Frontend file not found: {frontend_path}")
        return

    try:
        with open(frontend_path, 'r') as f:
            content = f.read()

        # Replace credentials
        content = content.replace(
            "const SUPABASE_URL = 'https://your-project.supabase.co';",
            f"const SUPABASE_URL = '{config['supabase_url']}';"
        )
        content = content.replace(
            "const SUPABASE_ANON_KEY = 'your-anon-key-here';",
            f"const SUPABASE_ANON_KEY = '{config['supabase_anon_key']}';"
        )

        with open(frontend_path, 'w') as f:
            f.write(content)

        success(f"Updated credentials in {frontend_path.name}")
    except Exception as e:
        error(f"Failed to update frontend: {e}")

@cli.group()
def deploy():
    """Deploy components of the Goods Tracker system."""
    pass

@deploy.command('database')
@click.option('--schema-only', is_flag=True, help='Deploy schema without seed data')
def deploy_database(schema_only):
    """Deploy database schema and seed data to Supabase."""
    header("📊 Deploying Database")

    config = load_config()
    if not config:
        error("No configuration found. Run 'goods-tracker init' first.")
        sys.exit(1)

    # Check for schema file
    schema_path = PROJECT_ROOT / 'supabase' / 'schema.sql'
    seed_path = PROJECT_ROOT / 'supabase' / 'seed.sql'

    if not schema_path.exists():
        error(f"Schema file not found: {schema_path}")
        sys.exit(1)

    # Extract database connection details
    db_host = config['supabase_url'].replace('https://', '').replace('http://', '')
    db_host = f"db.{db_host.split('.')[0]}.supabase.co"

    info("Deploying schema...")

    try:
        # Deploy schema
        result = subprocess.run(
            [
                'psql',
                f"postgresql://postgres:{config['db_password']}@{db_host}:5432/postgres",
                '-f', str(schema_path)
            ],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            success("Schema deployed successfully")
        else:
            error(f"Schema deployment failed: {result.stderr}")
            sys.exit(1)

        # Deploy seed data
        if not schema_only and seed_path.exists():
            info("Deploying seed data...")

            result = subprocess.run(
                [
                    'psql',
                    f"postgresql://postgres:{config['db_password']}@{db_host}:5432/postgres",
                    '-f', str(seed_path)
                ],
                capture_output=True,
                text=True
            )

            if result.returncode == 0:
                success("Seed data deployed successfully")
                success("✓ Database deployment complete!")
            else:
                error(f"Seed deployment failed: {result.stderr}")
                sys.exit(1)

        # Verify
        info("Verifying deployment...")
        result = subprocess.run(
            [
                'psql',
                f"postgresql://postgres:{config['db_password']}@{db_host}:5432/postgres",
                '-c', 'SELECT COUNT(*) FROM assets;'
            ],
            capture_output=True,
            text=True
        )

        if "389" in result.stdout:
            success("Verified: 389 assets in database ✓")
        else:
            warning("Verification incomplete. Check database manually.")

    except FileNotFoundError:
        error("psql not found. Install PostgreSQL client tools.")
        info("macOS: brew install postgresql")
        info("Ubuntu: sudo apt-get install postgresql-client")
        sys.exit(1)
    except Exception as e:
        error(f"Deployment failed: {e}")
        sys.exit(1)

@deploy.command('frontend')
@click.option('--platform', type=click.Choice(['netlify', 'vercel', 'manual']), default='netlify', help='Deployment platform')
def deploy_frontend(platform):
    """Deploy the support form frontend."""
    header("🌐 Deploying Frontend")

    config = load_config()
    if not config:
        error("No configuration found. Run 'goods-tracker init' first.")
        sys.exit(1)

    frontend_path = Path(config['frontend_path'])

    if not frontend_path.exists():
        error(f"Frontend file not found: {frontend_path}")
        sys.exit(1)

    if platform == 'netlify':
        info("Opening Netlify Drop...")
        click.echo(f"\n{Colors.BOLD}Instructions:{Colors.ENDC}")
        click.echo(f"1. Drag and drop: {Colors.OKCYAN}{frontend_path}{Colors.ENDC}")
        click.echo("2. Copy the generated URL")
        click.echo("3. Update QR code URLs with the new domain\n")

        import webbrowser
        webbrowser.open('https://app.netlify.com/drop')

        if click.confirm("Have you deployed and received your URL?"):
            deployed_url = click.prompt("Enter your Netlify URL")
            config['frontend_url'] = deployed_url
            save_config(config)

            if click.confirm("Update QR code URLs in database?"):
                update_qr_urls(deployed_url)

    elif platform == 'vercel':
        info("Deploying to Vercel...")

        # Check for Vercel CLI
        try:
            subprocess.run(['vercel', '--version'], capture_output=True, check=True)
        except (FileNotFoundError, subprocess.CalledProcessError):
            error("Vercel CLI not found. Install with: npm install -g vercel")
            sys.exit(1)

        # Deploy
        result = subprocess.run(
            ['vercel', '--prod', str(frontend_path.parent)],
            cwd=frontend_path.parent
        )

        if result.returncode == 0:
            success("Frontend deployed to Vercel!")
        else:
            error("Vercel deployment failed")
            sys.exit(1)

    else:  # manual
        info("Manual deployment instructions:")
        click.echo(f"\n{Colors.BOLD}File to deploy:{Colors.ENDC} {frontend_path}")
        click.echo(f"\n{Colors.BOLD}Options:{Colors.ENDC}")
        click.echo("1. Netlify Drop: https://app.netlify.com/drop")
        click.echo("2. GitHub Pages: Upload to repository, enable Pages")
        click.echo("3. Vercel: Install CLI and run 'vercel --prod'")

@cli.group()
def qr():
    """Manage QR codes."""
    pass

@qr.command('generate')
@click.option('--force', is_flag=True, help='Regenerate all QR codes even if they exist')
def qr_generate(force):
    """Generate QR codes for all assets."""
    header("📱 Generating QR Codes")

    script_path = PROJECT_ROOT / 'scripts' / 'generate_qrs.py'

    if not script_path.exists():
        error(f"QR generation script not found: {script_path}")
        sys.exit(1)

    info("Running QR code generation...")

    try:
        result = subprocess.run(
            ['python3', str(script_path)],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            click.echo(result.stdout)
            success("QR codes generated successfully!")
        else:
            error(f"Generation failed: {result.stderr}")
            sys.exit(1)
    except Exception as e:
        error(f"Failed to generate QR codes: {e}")
        sys.exit(1)

@qr.command('update-urls')
@click.argument('new_domain')
def qr_update_urls(new_domain):
    """Update QR code URLs in the database."""
    header("🔗 Updating QR URLs")

    update_qr_urls(new_domain)

def update_qr_urls(new_domain: str):
    """Update QR URLs in database."""
    config = load_config()
    if not config:
        error("No configuration found. Run 'goods-tracker init' first.")
        sys.exit(1)

    # Clean domain (remove protocol if provided)
    domain = new_domain.replace('https://', '').replace('http://', '')

    # Update database
    db_host = config['supabase_url'].replace('https://', '').replace('http://', '')
    db_host = f"db.{db_host.split('.')[0]}.supabase.co"

    info(f"Updating URLs to: https://{domain}/?asset_id={{id}}")

    try:
        sql = f"""
        UPDATE assets
        SET qr_url = 'https://{domain}/?asset_id=' || unique_id;

        SELECT COUNT(*) as updated FROM assets;
        """

        result = subprocess.run(
            [
                'psql',
                f"postgresql://postgres:{config['db_password']}@{db_host}:5432/postgres",
                '-c', sql
            ],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            success("QR URLs updated successfully!")
            info("Verify with: SELECT qr_url FROM assets LIMIT 5;")
        else:
            error(f"Update failed: {result.stderr}")
            sys.exit(1)
    except Exception as e:
        error(f"Failed to update URLs: {e}")
        sys.exit(1)

@qr.command('export')
def qr_export():
    """Export QR codes organized by community/product."""
    header("📦 Exporting QR Packages")

    script_path = PROJECT_ROOT / 'scripts' / 'export_qr_packages.py'

    if not script_path.exists():
        error(f"Export script not found: {script_path}")
        sys.exit(1)

    info("Organizing QR codes...")

    try:
        result = subprocess.run(
            ['python3', str(script_path)],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            click.echo(result.stdout)
            success("QR packages exported!")
            info(f"Location: {PROJECT_ROOT / 'data' / 'qr_export_packages'}")
        else:
            error(f"Export failed: {result.stderr}")
            sys.exit(1)
    except Exception as e:
        error(f"Failed to export QR codes: {e}")
        sys.exit(1)

@cli.command()
def test():
    """Run system tests and validation."""
    header("🧪 Running Tests")

    config = load_config()
    if not config:
        error("No configuration found. Run 'goods-tracker init' first.")
        sys.exit(1)

    tests_passed = 0
    tests_failed = 0

    # Test 1: Check CSV expansion
    info("Test 1: Validating expanded CSV...")
    csv_path = PROJECT_ROOT / 'data' / 'expanded_assets_final.csv'
    if csv_path.exists():
        success("✓ Expanded CSV exists")
        tests_passed += 1
    else:
        error("✗ Expanded CSV not found")
        tests_failed += 1

    # Test 2: Check QR codes
    info("Test 2: Checking QR codes...")
    qr_svg_dir = PROJECT_ROOT / 'data' / 'qr_codes' / 'svg'
    if qr_svg_dir.exists():
        qr_count = len(list(qr_svg_dir.glob('*.svg')))
        if qr_count == 389:
            success(f"✓ All 389 QR codes present")
            tests_passed += 1
        else:
            warning(f"⚠ Found {qr_count} QR codes (expected 389)")
            tests_failed += 1
    else:
        error("✗ QR codes directory not found")
        tests_failed += 1

    # Test 3: Test Supabase connection
    info("Test 3: Testing Supabase connection...")
    try:
        response = requests.get(
            f"{config['supabase_url']}/rest/v1/",
            headers={'apikey': config['supabase_anon_key']}
        )
        if response.status_code == 200:
            success("✓ Supabase connection successful")
            tests_passed += 1
        else:
            error(f"✗ Supabase connection failed (HTTP {response.status_code})")
            tests_failed += 1
    except Exception as e:
        error(f"✗ Supabase connection error: {e}")
        tests_failed += 1

    # Test 4: Check frontend file
    info("Test 4: Checking frontend file...")
    frontend_path = Path(config['frontend_path'])
    if frontend_path.exists():
        # Check if credentials are updated
        with open(frontend_path, 'r') as f:
            content = f.read()
            if 'your-project.supabase.co' in content:
                warning("⚠ Frontend credentials not updated")
                tests_failed += 1
            else:
                success("✓ Frontend file ready")
                tests_passed += 1
    else:
        error("✗ Frontend file not found")
        tests_failed += 1

    # Test 5: Check database schema
    info("Test 5: Checking database...")
    if config.get('db_password'):
        try:
            db_host = config['supabase_url'].replace('https://', '').replace('http://', '')
            db_host = f"db.{db_host.split('.')[0]}.supabase.co"

            result = subprocess.run(
                [
                    'psql',
                    f"postgresql://postgres:{config['db_password']}@{db_host}:5432/postgres",
                    '-c', 'SELECT COUNT(*) FROM assets;'
                ],
                capture_output=True,
                text=True
            )

            if "389" in result.stdout:
                success("✓ Database has 389 assets")
                tests_passed += 1
            else:
                warning("⚠ Database asset count incorrect")
                tests_failed += 1
        except Exception as e:
            warning(f"⚠ Could not verify database: {e}")
            tests_failed += 1
    else:
        warning("⚠ Database password not configured")
        tests_failed += 1

    # Summary
    header("Test Summary")
    click.echo(f"Passed: {Colors.OKGREEN}{tests_passed}{Colors.ENDC}")
    click.echo(f"Failed: {Colors.FAIL}{tests_failed}{Colors.ENDC}")

    if tests_failed == 0:
        success("\n✨ All tests passed! System is ready for deployment.")
    else:
        warning(f"\n⚠ {tests_failed} test(s) failed. Review issues above.")

@cli.command()
def status():
    """Show current system status."""
    header("📊 Goods Tracker Status")

    config = load_config()

    if not config:
        warning("No configuration found")
        info("Run 'goods-tracker init' to get started")
        return

    # Configuration status
    click.echo(f"{Colors.BOLD}Configuration{Colors.ENDC}")
    click.echo(f"  Project: {config.get('project_name', 'Not set')}")
    click.echo(f"  Domain: {config.get('domain', 'Not set (using temporary)')}")
    click.echo(f"  Supabase URL: {config.get('supabase_url', 'Not configured')}")
    click.echo(f"  Frontend URL: {config.get('frontend_url', 'Not deployed')}")

    # Data status
    click.echo(f"\n{Colors.BOLD}Data Status{Colors.ENDC}")

    csv_path = PROJECT_ROOT / 'data' / 'expanded_assets_final.csv'
    if csv_path.exists():
        success(f"Expanded CSV: Ready ({csv_path.name})")
    else:
        error("Expanded CSV: Not found")

    qr_svg_dir = PROJECT_ROOT / 'data' / 'qr_codes' / 'svg'
    if qr_svg_dir.exists():
        qr_count = len(list(qr_svg_dir.glob('*.svg')))
        if qr_count == 389:
            success(f"QR Codes: Ready ({qr_count} SVG files)")
        else:
            warning(f"QR Codes: {qr_count}/389 generated")
    else:
        error("QR Codes: Not generated")

    # Database status
    click.echo(f"\n{Colors.BOLD}Database{Colors.ENDC}")
    schema_path = PROJECT_ROOT / 'supabase' / 'schema.sql'
    seed_path = PROJECT_ROOT / 'supabase' / 'seed.sql'

    if schema_path.exists():
        success(f"Schema: Ready")
    else:
        error("Schema: Not found")

    if seed_path.exists():
        success(f"Seed data: Ready")
    else:
        error("Seed data: Not found")

    # Frontend status
    click.echo(f"\n{Colors.BOLD}Frontend{Colors.ENDC}")
    frontend_path = Path(config.get('frontend_path', ''))
    if frontend_path.exists():
        with open(frontend_path, 'r') as f:
            content = f.read()
            if 'your-project.supabase.co' in content:
                warning("Support form: Credentials not updated")
            else:
                success("Support form: Ready for deployment")
    else:
        error("Support form: Not found")

    # Quick actions
    click.echo(f"\n{Colors.BOLD}Quick Actions{Colors.ENDC}")
    info("goods-tracker deploy database    # Deploy database schema")
    info("goods-tracker deploy frontend    # Deploy support form")
    info("goods-tracker test               # Run validation tests")

@cli.group()
def config():
    """Manage configuration."""
    pass

@config.command('show')
def config_show():
    """Show current configuration."""
    config = load_config()

    if not config:
        warning("No configuration found")
        return

    # Mask sensitive keys
    safe_config = config.copy()
    if 'supabase_anon_key' in safe_config:
        safe_config['supabase_anon_key'] = safe_config['supabase_anon_key'][:20] + '...'
    if 'supabase_service_key' in safe_config:
        safe_config['supabase_service_key'] = safe_config['supabase_service_key'][:20] + '...'
    if 'db_password' in safe_config:
        safe_config['db_password'] = '***'

    click.echo(json.dumps(safe_config, indent=2))

@config.command('set')
@click.argument('key')
@click.argument('value')
def config_set(key, value):
    """Set a configuration value."""
    config = load_config()
    config[key] = value
    save_config(config)
    success(f"Set {key} = {value}")

@config.command('reset')
@click.confirmation_option(prompt='Are you sure you want to reset all configuration?')
def config_reset():
    """Reset configuration."""
    if CONFIG_FILE.exists():
        CONFIG_FILE.unlink()
        success("Configuration reset")
    else:
        info("No configuration to reset")


# ============================================================================
# AUDIT COMMANDS
# ============================================================================

@cli.group()
def audit():
    """QR code audit and validation commands."""
    pass


@audit.command('full')
@click.option('--save', '-s', is_flag=True, help='Save results to database')
@click.option('--json', '-j', 'as_json', is_flag=True, help='Output as JSON')
def audit_full(save, as_json):
    """Run all QR code validation checks."""
    if not as_json:
        header("QR Code Audit - Full Validation")

    script_path = PROJECT_ROOT / 'scripts' / 'qr_audit.py'

    if not script_path.exists():
        error(f"Audit script not found: {script_path}")
        sys.exit(1)

    args = ['python3', str(script_path), 'full']
    if save:
        args.append('--save')
    if as_json:
        args.append('--json')

    try:
        result = subprocess.run(args, cwd=PROJECT_ROOT)
        sys.exit(result.returncode)
    except Exception as e:
        error(f"Audit failed: {e}")
        sys.exit(1)


@audit.command('database')
@click.option('--json', '-j', 'as_json', is_flag=True, help='Output as JSON')
def audit_database(as_json):
    """Validate database assets have required fields and valid values."""
    if not as_json:
        header("QR Code Audit - Database Validation")

    script_path = PROJECT_ROOT / 'scripts' / 'qr_audit.py'

    if not script_path.exists():
        error(f"Audit script not found: {script_path}")
        sys.exit(1)

    args = ['python3', str(script_path), 'database']
    if as_json:
        args.append('--json')

    try:
        result = subprocess.run(args, cwd=PROJECT_ROOT)
        sys.exit(result.returncode)
    except Exception as e:
        error(f"Audit failed: {e}")
        sys.exit(1)


@audit.command('urls')
@click.option('--json', '-j', 'as_json', is_flag=True, help='Output as JSON')
def audit_urls(as_json):
    """Validate all QR URLs have correct format and domain."""
    if not as_json:
        header("QR Code Audit - URL Validation")

    script_path = PROJECT_ROOT / 'scripts' / 'qr_audit.py'

    if not script_path.exists():
        error(f"Audit script not found: {script_path}")
        sys.exit(1)

    args = ['python3', str(script_path), 'urls']
    if as_json:
        args.append('--json')

    try:
        result = subprocess.run(args, cwd=PROJECT_ROOT)
        sys.exit(result.returncode)
    except Exception as e:
        error(f"Audit failed: {e}")
        sys.exit(1)


@audit.command('qr-files')
@click.option('--json', '-j', 'as_json', is_flag=True, help='Output as JSON')
def audit_qr_files(as_json):
    """Check that QR code files exist for all assets."""
    if not as_json:
        header("QR Code Audit - QR File Validation")

    script_path = PROJECT_ROOT / 'scripts' / 'qr_audit.py'

    if not script_path.exists():
        error(f"Audit script not found: {script_path}")
        sys.exit(1)

    args = ['python3', str(script_path), 'qr-files']
    if as_json:
        args.append('--json')

    try:
        result = subprocess.run(args, cwd=PROJECT_ROOT)
        sys.exit(result.returncode)
    except Exception as e:
        error(f"Audit failed: {e}")
        sys.exit(1)


@audit.command('consistency')
@click.option('--json', '-j', 'as_json', is_flag=True, help='Output as JSON')
def audit_consistency(as_json):
    """Cross-check database against QR manifest."""
    if not as_json:
        header("QR Code Audit - Consistency Check")

    script_path = PROJECT_ROOT / 'scripts' / 'qr_audit.py'

    if not script_path.exists():
        error(f"Audit script not found: {script_path}")
        sys.exit(1)

    args = ['python3', str(script_path), 'consistency']
    if as_json:
        args.append('--json')

    try:
        result = subprocess.run(args, cwd=PROJECT_ROOT)
        sys.exit(result.returncode)
    except Exception as e:
        error(f"Audit failed: {e}")
        sys.exit(1)


@audit.command('report')
@click.option('--save', '-s', is_flag=True, help='Save results to database')
def audit_report(save):
    """Generate a comprehensive audit report."""
    header("QR Code Audit - Full Report")

    script_path = PROJECT_ROOT / 'scripts' / 'qr_audit.py'

    if not script_path.exists():
        error(f"Audit script not found: {script_path}")
        sys.exit(1)

    args = ['python3', str(script_path), 'report']
    if save:
        args.append('--save')

    try:
        result = subprocess.run(args, cwd=PROJECT_ROOT)
        sys.exit(result.returncode)
    except Exception as e:
        error(f"Audit failed: {e}")
        sys.exit(1)


@audit.command('history')
@click.option('--limit', '-n', default=10, help='Number of records to show')
def audit_history(limit):
    """Show recent audit history from database."""
    header("QR Code Audit - History")

    config = load_config()

    # Try to get Supabase credentials from config or use defaults
    supabase_url = config.get('supabase_url', 'https://cwsyhpiuepvdjtxaozwf.supabase.co')
    supabase_key = config.get('supabase_anon_key', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3c3locGl1ZXB2ZGp0eGFvendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTcxODgsImV4cCI6MjA4MDIzMzE4OH0.Pgexh-ff_zU4SsDWV3uGO7foQjCO8xZbWvN_BU6Vxkw')

    try:
        response = requests.get(
            f"{supabase_url}/rest/v1/qr_audit_logs?select=*&order=audit_date.desc&limit={limit}",
            headers={'apikey': supabase_key}
        )

        if response.status_code == 200:
            audits = response.json()
            if not audits:
                info("No audit records found")
                info("Run 'goods-tracker audit full --save' to create one")
                return

            for audit in audits:
                date = audit.get('audit_date', 'Unknown')[:19]
                audit_type = audit.get('audit_type', 'unknown')
                passed = audit.get('passed', 0)
                failed = audit.get('failed', 0)
                summary = audit.get('summary', '')

                status_color = Colors.OKGREEN if failed == 0 else Colors.FAIL
                status = "PASS" if failed == 0 else "FAIL"

                click.echo(f"\n{Colors.BOLD}{date}{Colors.ENDC}")
                click.echo(f"  Type: {audit_type}")
                click.echo(f"  Status: {status_color}[{status}]{Colors.ENDC} {passed}/{passed + failed} checks passed")
                if summary:
                    click.echo(f"  Summary: {summary}")

        elif response.status_code == 404:
            warning("Audit logs table not found")
            info("Deploy schema with: goods-tracker deploy database")
        else:
            error(f"Failed to fetch history: HTTP {response.status_code}")
            sys.exit(1)

    except requests.exceptions.RequestException as e:
        error(f"Connection error: {e}")
        sys.exit(1)


@audit.command('changes')
@click.option('--limit', '-n', default=20, help='Number of records to show')
@click.option('--asset', '-a', help='Filter by asset ID')
def audit_changes(limit, asset):
    """Show recent asset changes from database."""
    header("Asset Change History")

    config = load_config()

    # Try to get Supabase credentials from config or use defaults
    supabase_url = config.get('supabase_url', 'https://cwsyhpiuepvdjtxaozwf.supabase.co')
    supabase_key = config.get('supabase_anon_key', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3c3locGl1ZXB2ZGp0eGFvendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTcxODgsImV4cCI6MjA4MDIzMzE4OH0.Pgexh-ff_zU4SsDWV3uGO7foQjCO8xZbWvN_BU6Vxkw')

    try:
        url = f"{supabase_url}/rest/v1/asset_change_log?select=*&order=change_date.desc&limit={limit}"
        if asset:
            url += f"&asset_id=eq.{asset}"

        response = requests.get(url, headers={'apikey': supabase_key})

        if response.status_code == 200:
            changes = response.json()
            if not changes:
                info("No change records found")
                if asset:
                    info(f"No changes recorded for asset {asset}")
                return

            for change in changes:
                date = change.get('change_date', 'Unknown')[:19]
                asset_id = change.get('asset_id', 'unknown')
                change_type = change.get('change_type', 'unknown')
                changed_fields = change.get('changed_fields', [])

                # Color code by change type
                if change_type == 'created':
                    type_color = Colors.OKGREEN
                elif change_type == 'updated':
                    type_color = Colors.WARNING
                else:  # deleted
                    type_color = Colors.FAIL

                click.echo(f"\n{Colors.BOLD}{date}{Colors.ENDC} - {type_color}{change_type.upper()}{Colors.ENDC}")
                click.echo(f"  Asset: {asset_id}")
                if changed_fields:
                    click.echo(f"  Changed: {', '.join(changed_fields)}")

        elif response.status_code == 404:
            warning("Asset change log table not found")
            info("Deploy schema with: goods-tracker deploy database")
        else:
            error(f"Failed to fetch changes: HTTP {response.status_code}")
            sys.exit(1)

    except requests.exceptions.RequestException as e:
        error(f"Connection error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    cli()

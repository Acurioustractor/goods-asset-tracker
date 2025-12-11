#!/usr/bin/env python3
"""
QR Code Audit & Validation System
Validates QR codes connect to correct assets and tracks changes.

Usage:
    python scripts/qr_audit.py full          # Run all validations
    python scripts/qr_audit.py database      # Check database assets
    python scripts/qr_audit.py urls          # Validate QR URLs
    python scripts/qr_audit.py report        # Generate report
"""

import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any
import requests

# Configuration
SUPABASE_URL = 'https://cwsyhpiuepvdjtxaozwf.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3c3locGl1ZXB2ZGp0eGFvendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTcxODgsImV4cCI6MjA4MDIzMzE4OH0.Pgexh-ff_zU4SsDWV3uGO7foQjCO8xZbWvN_BU6Vxkw'
EXPECTED_DOMAIN = 'goodsoncountry.netlify.app'
EXPECTED_URL_PATTERN = re.compile(r'^https://goodsoncountry\.netlify\.app/\?asset_id=GB0-[\w-]+$')

# Valid values
VALID_PRODUCTS = {'Basket Bed', 'Weave Bed', 'ID Washing Machine', 'Washing Machine'}
VALID_COMMUNITIES = {
    'Palm Island', 'Tennant Creek', 'Kalgoorlie', 'Darwin', 'Alice Springs',
    'Mount Isa', 'Maningrida', 'Utopia Homelands', 'Alice Homelands',
    'Pending Delivery', 'Unknown'
}


class AuditResult:
    """Stores results from a single audit check."""

    def __init__(self, check_name: str):
        self.check_name = check_name
        self.passed = 0
        self.failed = 0
        self.issues: list[dict[str, Any]] = []

    def add_pass(self):
        self.passed += 1

    def add_fail(self, asset_id: str, issue_type: str, details: str):
        self.failed += 1
        self.issues.append({
            'asset_id': asset_id,
            'issue_type': issue_type,
            'details': details
        })

    @property
    def total(self) -> int:
        return self.passed + self.failed

    @property
    def success(self) -> bool:
        return self.failed == 0

    def to_dict(self) -> dict:
        return {
            'check_name': self.check_name,
            'passed': self.passed,
            'failed': self.failed,
            'total': self.total,
            'success': self.success,
            'issues': self.issues
        }


class QRAudit:
    """QR Code Audit System."""

    def __init__(self, verbose: bool = True):
        self.verbose = verbose
        self.results: list[AuditResult] = []
        self.assets: list[dict] = []
        self.start_time = datetime.now()

    def log(self, message: str):
        """Print message if verbose mode is on."""
        if self.verbose:
            print(message)

    def fetch_assets(self) -> list[dict]:
        """Fetch all assets from Supabase."""
        self.log("Fetching assets from Supabase...")

        headers = {'apikey': SUPABASE_KEY}
        response = requests.get(
            f'{SUPABASE_URL}/rest/v1/assets?select=*',
            headers=headers
        )

        if response.status_code != 200:
            raise Exception(f"Failed to fetch assets: {response.status_code} - {response.text}")

        self.assets = response.json()
        self.log(f"  Found {len(self.assets)} assets")
        return self.assets

    def audit_database(self) -> AuditResult:
        """Validate database assets have required fields and valid values."""
        self.log("\n[1/4] Database Validation")
        self.log("-" * 40)

        result = AuditResult('database')

        if not self.assets:
            self.fetch_assets()

        for asset in self.assets:
            asset_id = asset.get('unique_id', 'UNKNOWN')
            issues_found = False

            # Check required fields
            required_fields = ['unique_id', 'product', 'community']
            for field in required_fields:
                if not asset.get(field):
                    result.add_fail(asset_id, 'missing_field', f"Missing required field: {field}")
                    issues_found = True

            # Validate product type
            product = asset.get('product')
            if product and product not in VALID_PRODUCTS:
                result.add_fail(asset_id, 'invalid_product', f"Invalid product type: {product}")
                issues_found = True

            # Validate community
            community = asset.get('community')
            if community and community not in VALID_COMMUNITIES:
                result.add_fail(asset_id, 'invalid_community', f"Invalid community: {community}")
                issues_found = True

            # Check qr_url exists
            if not asset.get('qr_url'):
                result.add_fail(asset_id, 'missing_qr_url', "No QR URL defined")
                issues_found = True

            if not issues_found:
                result.add_pass()

        self._print_result(result)
        self.results.append(result)
        return result

    def audit_urls(self) -> AuditResult:
        """Validate all QR URLs have correct format and domain."""
        self.log("\n[2/4] URL Validation")
        self.log("-" * 40)

        result = AuditResult('urls')

        if not self.assets:
            self.fetch_assets()

        for asset in self.assets:
            asset_id = asset.get('unique_id', 'UNKNOWN')
            qr_url = asset.get('qr_url', '')
            issues_found = False

            if not qr_url:
                result.add_fail(asset_id, 'no_url', "QR URL is empty")
                issues_found = True
            else:
                # Check domain
                if EXPECTED_DOMAIN not in qr_url:
                    result.add_fail(asset_id, 'wrong_domain', f"Wrong domain in URL: {qr_url}")
                    issues_found = True

                # Check format
                if not EXPECTED_URL_PATTERN.match(qr_url):
                    result.add_fail(asset_id, 'invalid_format', f"URL format invalid: {qr_url}")
                    issues_found = True

                # Check asset_id in URL matches
                expected_url = f"https://{EXPECTED_DOMAIN}/?asset_id={asset_id}"
                if qr_url != expected_url:
                    result.add_fail(asset_id, 'url_mismatch', f"URL should be {expected_url}, got {qr_url}")
                    issues_found = True

            if not issues_found:
                result.add_pass()

        self._print_result(result)
        self.results.append(result)
        return result

    def audit_qr_files(self, qr_dir: Path = None) -> AuditResult:
        """Check that QR code files exist for all assets."""
        self.log("\n[3/4] QR File Validation")
        self.log("-" * 40)

        result = AuditResult('qr_files')

        if qr_dir is None:
            script_dir = Path(__file__).parent
            qr_dir = script_dir.parent / 'data' / 'qr_codes'

        svg_dir = qr_dir / 'svg'
        png_dir = qr_dir / 'png'

        if not self.assets:
            self.fetch_assets()

        for asset in self.assets:
            asset_id = asset.get('unique_id', 'UNKNOWN')
            safe_id = asset_id.replace('/', '-')
            issues_found = False

            # Check SVG exists
            svg_path = svg_dir / f"qr_{safe_id}.svg"
            if not svg_path.exists():
                result.add_fail(asset_id, 'missing_svg', f"SVG file not found: {svg_path.name}")
                issues_found = True

            # Check PNG exists
            png_path = png_dir / f"qr_{safe_id}.png"
            if not png_path.exists():
                result.add_fail(asset_id, 'missing_png', f"PNG file not found: {png_path.name}")
                issues_found = True

            if not issues_found:
                result.add_pass()

        self._print_result(result)
        self.results.append(result)
        return result

    def audit_consistency(self) -> AuditResult:
        """Cross-check database against QR manifest."""
        self.log("\n[4/4] Consistency Check")
        self.log("-" * 40)

        result = AuditResult('consistency')

        # Load QR manifest
        script_dir = Path(__file__).parent
        manifest_path = script_dir.parent / 'data' / 'qr_codes' / 'qr_manifest.csv'

        manifest_ids = set()
        if manifest_path.exists():
            import csv
            with open(manifest_path) as f:
                reader = csv.DictReader(f)
                manifest_ids = {row['unique_id'] for row in reader}
            self.log(f"  Manifest has {len(manifest_ids)} entries")
        else:
            self.log(f"  Warning: Manifest not found at {manifest_path}")

        if not self.assets:
            self.fetch_assets()

        db_ids = {a['unique_id'] for a in self.assets}
        self.log(f"  Database has {len(db_ids)} entries")

        # Check for assets in DB but not in manifest
        in_db_not_manifest = db_ids - manifest_ids
        for asset_id in in_db_not_manifest:
            result.add_fail(asset_id, 'not_in_manifest', "Asset in database but not in QR manifest")

        # Check for assets in manifest but not in DB
        in_manifest_not_db = manifest_ids - db_ids
        for asset_id in in_manifest_not_db:
            result.add_fail(asset_id, 'not_in_database', "Asset in QR manifest but not in database")

        # Count passes (assets in both)
        in_both = db_ids & manifest_ids
        for _ in in_both:
            result.add_pass()

        self._print_result(result)
        self.results.append(result)
        return result

    def run_full_audit(self) -> dict:
        """Run all audit checks."""
        self.log("=" * 50)
        self.log("QR CODE AUDIT REPORT")
        self.log(f"Date: {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        self.log("=" * 50)

        # Fetch assets once
        self.fetch_assets()

        # Run all checks
        self.audit_database()
        self.audit_urls()
        self.audit_qr_files()
        self.audit_consistency()

        # Generate summary
        return self.generate_report()

    def generate_report(self) -> dict:
        """Generate audit report."""
        self.log("\n" + "=" * 50)
        self.log("SUMMARY")
        self.log("=" * 50)

        total_passed = sum(r.passed for r in self.results)
        total_failed = sum(r.failed for r in self.results)
        all_passed = all(r.success for r in self.results)

        for result in self.results:
            status = "PASS" if result.success else "FAIL"
            self.log(f"  [{status}] {result.check_name}: {result.passed}/{result.total}")
            if not result.success and result.issues[:3]:
                for issue in result.issues[:3]:
                    self.log(f"       - {issue['asset_id']}: {issue['details']}")
                if len(result.issues) > 3:
                    self.log(f"       ... and {len(result.issues) - 3} more issues")

        self.log("")
        if all_passed:
            self.log("Result: ALL CHECKS PASSED")
        else:
            self.log(f"Result: {total_failed} ISSUES FOUND")

        report = {
            'audit_date': self.start_time.isoformat(),
            'audit_type': 'full',
            'total_assets': len(self.assets),
            'passed': total_passed,
            'failed': total_failed,
            'all_passed': all_passed,
            'checks': [r.to_dict() for r in self.results],
            'issues': [issue for r in self.results for issue in r.issues]
        }

        return report

    def save_audit_to_db(self, report: dict) -> bool:
        """Save audit results to Supabase."""
        self.log("\nSaving audit to database...")

        payload = {
            'audit_type': report['audit_type'],
            'total_assets': report['total_assets'],
            'passed': report['passed'],
            'failed': report['failed'],
            'issues': report['issues'],
            'summary': 'PASSED' if report['all_passed'] else f"{report['failed']} issues found"
        }

        headers = {
            'apikey': SUPABASE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }

        response = requests.post(
            f'{SUPABASE_URL}/rest/v1/qr_audit_logs',
            headers=headers,
            json=payload
        )

        if response.status_code in (200, 201):
            result = response.json()
            if result:
                self.log(f"  Audit saved with ID: {result[0].get('id', 'unknown')}")
            return True
        else:
            self.log(f"  Warning: Failed to save audit - {response.status_code}")
            return False

    def _print_result(self, result: AuditResult):
        """Print result for a single check."""
        status = "PASS" if result.success else "FAIL"
        self.log(f"  [{status}] {result.passed}/{result.total} assets OK")
        if not result.success:
            self.log(f"  Issues: {result.failed}")


def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(description='QR Code Audit System')
    parser.add_argument('command', nargs='?', default='full',
                       choices=['full', 'database', 'urls', 'qr-files', 'consistency', 'report'],
                       help='Audit command to run')
    parser.add_argument('--quiet', '-q', action='store_true',
                       help='Suppress output')
    parser.add_argument('--save', '-s', action='store_true',
                       help='Save results to database')
    parser.add_argument('--json', '-j', action='store_true',
                       help='Output as JSON')

    args = parser.parse_args()

    audit = QRAudit(verbose=not args.quiet and not args.json)

    if args.command == 'full':
        report = audit.run_full_audit()
    elif args.command == 'database':
        audit.fetch_assets()
        audit.audit_database()
        report = audit.generate_report()
    elif args.command == 'urls':
        audit.fetch_assets()
        audit.audit_urls()
        report = audit.generate_report()
    elif args.command == 'qr-files':
        audit.fetch_assets()
        audit.audit_qr_files()
        report = audit.generate_report()
    elif args.command == 'consistency':
        audit.fetch_assets()
        audit.audit_consistency()
        report = audit.generate_report()
    elif args.command == 'report':
        report = audit.run_full_audit()

    if args.save:
        audit.save_audit_to_db(report)

    if args.json:
        print(json.dumps(report, indent=2))

    # Exit with error code if issues found
    sys.exit(0 if report.get('all_passed', False) else 1)


if __name__ == '__main__':
    main()

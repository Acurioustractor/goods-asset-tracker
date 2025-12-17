#!/usr/bin/env python3
"""
Quick deployment verification script.
Tests that the system is working end-to-end.
"""

import requests
import json
import sys
from pathlib import Path
from urllib.parse import urlparse

def load_config():
    """Load CLI configuration."""
    config_file = Path.home() / '.goods-tracker' / 'config.json'
    with open(config_file, 'r') as f:
        return json.load(f)

def test_frontend(url):
    """Test that frontend is accessible."""
    print(f"Testing frontend: {url}")
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            print(f"  ✓ Frontend accessible (status: {response.status_code})")

            # Check if Supabase credentials are in the HTML
            if 'supabase' in response.text.lower():
                print("  ✓ Supabase integration detected")
            else:
                print("  ⚠ Warning: Supabase integration not detected in HTML")

            return True
        else:
            print(f"  ✗ Frontend returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"  ✗ Frontend test failed: {e}")
        return False

def test_qr_scan(url, asset_id):
    """Test QR code scan workflow."""
    qr_url = f"{url}?asset_id={asset_id}"
    print(f"\nTesting QR scan: {qr_url}")
    try:
        response = requests.get(qr_url, timeout=10)
        if response.status_code == 200:
            print(f"  ✓ QR URL accessible")
            if asset_id in response.text:
                print(f"  ✓ Asset ID found in page")
                return True
            else:
                print(f"  ⚠ Warning: Asset ID '{asset_id}' not found in page")
                return True
        else:
            print(f"  ✗ QR URL returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"  ✗ QR scan test failed: {e}")
        return False

def test_database(config):
    """Test database connection."""
    print("\nTesting database connection...")

    # Try to query the API
    supabase_url = config.get('supabase_url')
    anon_key = config.get('supabase_anon_key')

    if not supabase_url or not anon_key:
        print("  ✗ Supabase credentials not configured")
        return False

    try:
        headers = {
            'apikey': anon_key,
            'Authorization': f'Bearer {anon_key}'
        }
        response = requests.get(
            f"{supabase_url}/rest/v1/assets?select=unique_id&limit=1",
            headers=headers,
            timeout=10
        )

        if response.status_code == 200:
            print(f"  ✓ Database accessible")
            return True
        else:
            print(f"  ✗ Database returned status {response.status_code}")
            # Helpful when GRANTs/RLS block access
            try:
                print(f"    {response.text[:300]}")
            except Exception:
                pass
            return False
    except Exception as e:
        print(f"  ✗ Database test failed: {e}")
        return False

def main():
    """Run all verification tests."""
    print("=" * 60)
    print("Goods Asset Tracker - Deployment Verification")
    print("=" * 60)

    # Load config
    try:
        config = load_config()
        print("\n✓ Configuration loaded")
    except Exception as e:
        print(f"\n✗ Failed to load configuration: {e}")
        print("\nRun: goods-tracker init")
        sys.exit(1)

    frontend_url = config.get('frontend_url', '').rstrip('/')

    if not frontend_url:
        print("\n✗ No frontend URL configured")
        print("Update config with: goods-tracker config set frontend_url https://your-site.netlify.app")
        sys.exit(1)

    # Run tests
    results = []

    results.append(test_frontend(frontend_url))
    results.append(test_qr_scan(frontend_url, "GB0-1"))
    results.append(test_database(config))

    # Summary
    print("\n" + "=" * 60)
    if all(results):
        print("✅ All tests passed! Deployment is working correctly.")
        print("\nNext steps:")
        print("  1. Test QR scanning with your phone")
        print("  2. Submit a test support ticket")
        print("  3. Check dashboard to see the ticket")
        print("=" * 60)
        sys.exit(0)
    else:
        print("⚠️  Some tests failed. Please review the results above.")
        print("=" * 60)
        sys.exit(1)

if __name__ == '__main__':
    main()

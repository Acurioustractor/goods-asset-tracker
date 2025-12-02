#!/usr/bin/env python3
"""
Validation Script for Expanded CSV
Verifies data integrity after expansion
"""

import pandas as pd
from pathlib import Path

def validate_expansion(csv_file):
    """Validate the expanded CSV data"""

    print(f"Reading {csv_file}...")
    df = pd.read_csv(csv_file)

    print("\n" + "="*60)
    print("VALIDATION REPORT")
    print("="*60)

    # Check 1: Total count
    total_assets = len(df)
    print(f"\n✓ Total individual assets: {total_assets}")

    # Check 2: Unique IDs
    unique_ids = df['unique_id'].nunique()
    if unique_ids == total_assets:
        print(f"✓ All unique_ids are unique ({unique_ids} unique IDs)")
    else:
        print(f"❌ ISSUE: Found duplicate unique_ids!")
        duplicates = df[df.duplicated(subset=['unique_id'], keep=False)]
        print(f"  Duplicates: {duplicates['unique_id'].tolist()}")

    # Check 3: Product breakdown
    print(f"\n✓ Product breakdown:")
    product_counts = df['product'].value_counts()
    for product, count in product_counts.items():
        print(f"  - {product}: {count}")

    # Expected counts (from plan)
    bed_count = df[df['product'].str.contains('Bed', na=False)].shape[0]
    washer_count = df[df['product'] == 'ID Washing Machine'].shape[0]

    print(f"\n✓ Asset type summary:")
    print(f"  - Total Beds (all types): {bed_count}")
    print(f"  - Washers: {washer_count}")

    if bed_count == 369 and washer_count == 20:
        print(f"  ✓ Counts match expected (369 beds, 20 washers)")
    else:
        print(f"  ⚠️  Expected 369 beds and 20 washers")
        print(f"     Got {bed_count} beds and {washer_count} washers")

    # Check 4: Communities
    print(f"\n✓ Community distribution (top 10):")
    community_counts = df['community'].value_counts().head(10)
    for community, count in community_counts.items():
        print(f"  - {community}: {count}")

    # Check 5: Data completeness
    print(f"\n✓ Data completeness:")
    required_fields = ['unique_id', 'id', 'product', 'community', 'qr_url']
    for field in required_fields:
        missing = df[field].isna().sum()
        if missing == 0:
            print(f"  ✓ {field}: No missing values")
        else:
            print(f"  ⚠️  {field}: {missing} missing values")

    # Check 6: QR URLs
    missing_qr = df['qr_url'].isna().sum()
    if missing_qr == 0:
        print(f"\n✓ All {total_assets} assets have QR URLs")
        sample_qr = df['qr_url'].iloc[0]
        print(f"  Sample: {sample_qr}")
    else:
        print(f"\n❌ {missing_qr} assets missing QR URLs")

    # Check 7: Date parsing
    date_fields = ['supply_date', 'last_checkin_date', 'created_time']
    print(f"\n✓ Date field status:")
    for field in date_fields:
        if field in df.columns:
            valid_dates = df[field].notna().sum()
            print(f"  - {field}: {valid_dates}/{total_assets} populated")

    # Check 8: Photo URLs
    has_photos = df[df['photo'] != ''].shape[0]
    print(f"\n✓ Photos: {has_photos} assets have photos")

    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    all_checks_passed = (
        unique_ids == total_assets and
        missing_qr == 0
    )

    if all_checks_passed:
        print("✅ All critical validations passed!")
        print(f"   Ready to proceed with QR code generation")
    else:
        print("⚠️  Some issues found - review above")

    print("="*60 + "\n")

    return df

if __name__ == '__main__':
    # File path
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent
    csv_file = project_dir / 'data' / 'expanded_assets_final.csv'

    if not csv_file.exists():
        print(f"❌ Error: File not found: {csv_file}")
        print(f"   Run expand_csv.py first!")
    else:
        validate_expansion(csv_file)

#!/usr/bin/env python3
"""
CSV Expansion Script for Goods Asset Register
Converts grouped entries (with Number > 1) into individual asset records
"""

import pandas as pd
from pathlib import Path
import re
from datetime import datetime

def parse_date(date_str):
    """Parse various date formats into ISO 8601"""
    if pd.isna(date_str) or date_str == '':
        return None

    # Remove timezone info like (GMT+10) for parsing
    date_str = re.sub(r'\s*\([^)]*\)', '', str(date_str))

    # Try various date formats
    formats = [
        '%B %d, %Y %I:%M %p',  # October 4, 2024 2:49 PM
        '%B %d, %Y',            # October 4, 2024
        '%Y-%m-%d',             # 2024-10-04
        '%m/%d/%Y',             # 10/04/2024
        '%d/%m/%Y',             # 04/10/2024
    ]

    for fmt in formats:
        try:
            return datetime.strptime(date_str.strip(), fmt).isoformat()
        except ValueError:
            continue

    return None

def split_photos(photo_str):
    """Convert comma-separated photo URLs to array"""
    if pd.isna(photo_str) or photo_str == '':
        return []
    return [url.strip() for url in str(photo_str).split(',')]

def expand_csv(input_file, output_file, domain='https://goods-tracker.app'):
    """
    Expand grouped CSV entries into individual assets

    Args:
        input_file: Path to original CSV
        output_file: Path to save expanded CSV
        domain: Domain for QR URL generation
    """
    # Read original CSV
    print(f"Reading {input_file}...")
    df = pd.read_csv(input_file)

    # Remove BOM if present
    df.columns = df.columns.str.replace('\ufeff', '')

    # Rename columns to match database schema
    column_mapping = {
        'Name': 'name',
        'Community': 'community',
        'Contact / Household': 'contact_household',
        'Created time': 'created_time',
        'GPS': 'gps',
        'ID': 'id',
        'Last Check-in Date': 'last_checkin_date',
        'Notes': 'notes',
        'Number': 'number',
        'Paint': 'paint',
        'Photo': 'photo',
        'Place': 'place',
        'Product': 'product',
        'Supply date': 'supply_date'
    }
    df = df.rename(columns=column_mapping)

    # Fill NaN values in 'number' with 1
    df['number'] = df['number'].fillna(1).astype(int)

    # Expand rows
    expanded_rows = []

    for _, row in df.iterrows():
        num_assets = row['number']

        if num_assets == 1:
            # Single asset - no sub-numbering needed
            expanded_row = row.copy()
            expanded_row['unique_id'] = row['id']

            # Add QR URL
            expanded_row['qr_url'] = f"{domain}/support?asset_id={expanded_row['unique_id']}"

            # Parse dates
            expanded_row['supply_date'] = parse_date(row['supply_date'])
            expanded_row['last_checkin_date'] = parse_date(row['last_checkin_date'])
            expanded_row['created_time'] = parse_date(row['created_time'])

            # Process photo URLs
            photo_array = split_photos(row['photo'])
            expanded_row['photo'] = '|'.join(photo_array) if photo_array else ''

            expanded_rows.append(expanded_row)
        else:
            # Multiple assets - create sub-numbered entries
            for sub_num in range(1, num_assets + 1):
                expanded_row = row.copy()
                expanded_row['unique_id'] = f"{row['id']}-{sub_num}"

                # Add QR URL
                expanded_row['qr_url'] = f"{domain}/support?asset_id={expanded_row['unique_id']}"

                # Parse dates
                expanded_row['supply_date'] = parse_date(row['supply_date'])
                expanded_row['last_checkin_date'] = parse_date(row['last_checkin_date'])
                expanded_row['created_time'] = parse_date(row['created_time'])

                # Process photo URLs
                photo_array = split_photos(row['photo'])
                expanded_row['photo'] = '|'.join(photo_array) if photo_array else ''

                expanded_rows.append(expanded_row)

    # Create expanded dataframe
    expanded_df = pd.DataFrame(expanded_rows)

    # Reorder columns for clarity
    column_order = [
        'unique_id', 'id', 'name', 'product', 'community', 'place', 'gps',
        'contact_household', 'paint', 'photo', 'number', 'notes',
        'supply_date', 'last_checkin_date', 'created_time', 'qr_url'
    ]
    expanded_df = expanded_df[column_order]

    # Save to CSV
    print(f"Saving expanded data to {output_file}...")
    expanded_df.to_csv(output_file, index=False)

    # Print statistics
    print(f"\n✅ Expansion Complete!")
    print(f"Original entries: {len(df)}")
    print(f"Expanded to: {len(expanded_df)} individual assets")
    print(f"\nBreakdown by product:")
    product_counts = expanded_df['product'].value_counts()
    for product, count in product_counts.items():
        print(f"  {product}: {count}")

    print(f"\nBreakdown by community:")
    community_counts = expanded_df['community'].value_counts().head(10)
    for community, count in community_counts.items():
        print(f"  {community}: {count}")

    return expanded_df

if __name__ == '__main__':
    # File paths
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent

    input_file = project_dir / 'Goods Asset Register 115ebcf981cf800d9b99d0d765bedb47_all.csv'
    output_file = project_dir / 'data' / 'expanded_assets_final.csv'

    # Expand CSV
    expanded_df = expand_csv(input_file, output_file)

    print(f"\n📁 Output saved to: {output_file}")
    print(f"\nNext steps:")
    print(f"1. Run validation: python scripts/validate_expansion.py")
    print(f"2. Generate QR codes: python scripts/generate_qrs.py")

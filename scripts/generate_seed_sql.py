#!/usr/bin/env python3
"""
Generate SQL seed file from expanded CSV
Creates INSERT statements for Supabase database
"""

import pandas as pd
from pathlib import Path
import json

def escape_sql_string(value):
    """Escape single quotes for SQL"""
    if pd.isna(value) or value == '' or value == 'nan':
        return 'NULL'
    escaped = str(value).replace("'", "''")
    return f"'{escaped}'"

def generate_seed_sql(csv_file, output_file):
    """
    Generate SQL INSERT statements from expanded CSV

    Args:
        csv_file: Path to expanded assets CSV
        output_file: Path to save SQL seed file
    """
    print(f"Reading {csv_file}...")
    df = pd.read_csv(csv_file)

    print(f"\nGenerating SQL INSERT statements for {len(df)} assets...")

    with open(output_file, 'w') as f:
        # Header
        f.write("-- Goods Asset Register - Seed Data\n")
        f.write(f"-- Generated from: {csv_file.name}\n")
        f.write(f"-- Total assets: {len(df)}\n\n")

        f.write("-- ============================================================================\n")
        f.write("-- SEED DATA: assets table\n")
        f.write("-- ============================================================================\n\n")

        f.write("-- Disable triggers temporarily for faster import\n")
        f.write("SET session_replication_role = 'replica';\n\n")

        f.write("BEGIN;\n\n")

        # Generate INSERT statements
        for idx, row in df.iterrows():
            # Convert photo string to PostgreSQL array
            photos = []
            if pd.notna(row['photo']) and row['photo'] != '':
                photos = [p.strip() for p in str(row['photo']).split('|') if p.strip()]

            # Format photo array for PostgreSQL
            if photos:
                photo_array = "ARRAY[" + ", ".join([f"'{p}'" for p in photos]) + "]::TEXT[]"
            else:
                photo_array = "NULL"

            # Build INSERT statement
            insert = f"""INSERT INTO assets (
    unique_id, id, name, product, community, place, gps,
    contact_household, paint, photo, number, notes,
    supply_date, last_checkin_date, created_time, qr_url
) VALUES (
    {escape_sql_string(row['unique_id'])},
    {escape_sql_string(row['id'])},
    {escape_sql_string(row['name'])},
    {escape_sql_string(row['product'])},
    {escape_sql_string(row['community'])},
    {escape_sql_string(row['place'])},
    {escape_sql_string(row['gps'])},
    {escape_sql_string(row['contact_household'])},
    {escape_sql_string(row['paint'])},
    {photo_array},
    {row['number'] if pd.notna(row['number']) else 1},
    {escape_sql_string(row['notes'])},
    {escape_sql_string(row['supply_date']) if pd.notna(row['supply_date']) and row['supply_date'] != 'None' else 'NULL'},
    {escape_sql_string(row['last_checkin_date']) if pd.notna(row['last_checkin_date']) and row['last_checkin_date'] != 'None' else 'NULL'},
    {escape_sql_string(row['created_time']) if pd.notna(row['created_time']) and row['created_time'] != 'None' else 'NULL'},
    {escape_sql_string(row['qr_url'])}
);

"""
            f.write(insert)

            # Progress indicator
            if (idx + 1) % 50 == 0:
                print(f"  Generated {idx + 1}/{len(df)} INSERT statements...")

        f.write("COMMIT;\n\n")

        f.write("-- Re-enable triggers\n")
        f.write("SET session_replication_role = 'origin';\n\n")

        # Add verification queries
        f.write("-- ============================================================================\n")
        f.write("-- VERIFICATION QUERIES\n")
        f.write("-- ============================================================================\n\n")

        f.write("-- Check total count\n")
        f.write("SELECT 'Total assets: ' || COUNT(*) FROM assets;\n\n")

        f.write("-- Check product breakdown\n")
        f.write("SELECT product, COUNT(*) as count FROM assets GROUP BY product ORDER BY count DESC;\n\n")

        f.write("-- Check community breakdown\n")
        f.write("SELECT community, COUNT(*) as count FROM assets GROUP BY community ORDER BY count DESC;\n\n")

        f.write("-- Sample records\n")
        f.write("SELECT unique_id, name, product, community FROM assets LIMIT 10;\n\n")

        f.write("-- Check for duplicates\n")
        f.write("SELECT unique_id, COUNT(*) FROM assets GROUP BY unique_id HAVING COUNT(*) > 1;\n\n")

    print(f"\n✅ SQL seed file generated!")
    print(f"📁 Saved to: {output_file}")

    # Print statistics
    print(f"\n📊 Statistics:")
    print(f"  Total INSERT statements: {len(df)}")
    product_counts = df['product'].value_counts()
    print(f"\n  By product:")
    for product, count in product_counts.items():
        print(f"    - {product}: {count}")

    community_counts = df['community'].value_counts()
    print(f"\n  By community (top 5):")
    for community, count in community_counts.head(5).items():
        print(f"    - {community}: {count}")

if __name__ == '__main__':
    # File paths
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent

    csv_file = project_dir / 'data' / 'expanded_assets_final.csv'
    output_file = project_dir / 'supabase' / 'seed.sql'

    if not csv_file.exists():
        print(f"❌ Error: File not found: {csv_file}")
        print(f"   Run expand_csv.py first!")
    else:
        generate_seed_sql(csv_file, output_file)

        print(f"\nNext steps:")
        print(f"1. Set up Supabase project")
        print(f"2. Run schema: psql -h <host> -U postgres -d postgres -f supabase/schema.sql")
        print(f"3. Run seed: psql -h <host> -U postgres -d postgres -f supabase/seed.sql")
        print(f"4. Or use Supabase Dashboard > SQL Editor to run both files")

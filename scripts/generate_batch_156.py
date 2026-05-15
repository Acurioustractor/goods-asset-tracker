#!/usr/bin/env python3
"""
Batch GB0-156 — 107 Stretch Beds for the Alice Springs + Utopia Homelands trip
(week of 2026-05-19).

Idempotent. Re-running will not duplicate Supabase rows (uses upsert).

Outputs:
  data/new_beds/batch_156/manifest.csv          - one row per bed
  data/new_beds/batch_156/qr_png/qr_GB0-156-N.png   - 1024px PNG per bed
  data/new_beds/batch_156/print_sheet.pdf       - A4, 6 stickers/page, 18 pages

Run from repo root:
  python3 scripts/generate_batch_156.py
  python3 scripts/generate_batch_156.py --insert-only      # skip artwork
  python3 scripts/generate_batch_156.py --artwork-only     # skip Supabase
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import qrcode
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

REPO = Path(__file__).resolve().parent.parent
BATCH = "156"
COUNT = 107
PRODUCT = "Stretch Bed"
STATUS = "ready"
NOTES = "Batch 156 — Alice Springs + Utopia Homelands trip (week of 2026-05-19)"
SITE = "https://www.goodsoncountry.com"

OUT = REPO / "data" / "new_beds" / f"batch_{BATCH}"
QR_PNG = OUT / "qr_png"
MANIFEST = OUT / "manifest.csv"
PDF_PATH = OUT / "print_sheet.pdf"


def load_env() -> tuple[str, str]:
    """Return (supabase_url, service_role_key) from v2/.env.local."""
    env_path = REPO / "v2" / ".env.local"
    url = key = None
    for raw in env_path.read_text().splitlines():
        line = raw.strip()
        if line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        v = v.strip().strip('"').strip("'")
        if k.strip() == "NEXT_PUBLIC_SUPABASE_URL":
            url = v
        elif k.strip() == "SUPABASE_SERVICE_ROLE_KEY":
            key = v
    if not url or not key:
        sys.exit("ERROR: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing from v2/.env.local")
    return url, key


def build_rows() -> list[dict]:
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    rows = []
    for n in range(1, COUNT + 1):
        uid = f"GB0-{BATCH}-{n}"
        rows.append(
            {
                "id": uid,
                "unique_id": uid,
                "name": f"Stretch Bed #{n}",
                "product": PRODUCT,
                "status": STATUS,
                "community": "Pending Delivery",
                "place": None,
                "quantity": 1,
                "notes": NOTES,
                "supply_date": now,
                "created_time": now,
                "qr_url": f"{SITE}/bed/{uid}",
            }
        )
    return rows


def upsert_supabase(rows: list[dict]) -> None:
    url, key = load_env()
    endpoint = f"{url}/rest/v1/assets"
    body = json.dumps(rows).encode("utf-8")
    req = urllib.request.Request(
        endpoint,
        data=body,
        method="POST",
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=representation",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read())
            print(f"  Supabase upsert OK: {len(data)} rows merged into public.assets")
    except urllib.error.HTTPError as e:
        sys.exit(f"  Supabase upsert FAILED ({e.code}): {e.read().decode()}")


def write_manifest(rows: list[dict]) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with MANIFEST.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        for r in rows:
            w.writerow(r)
    print(f"  manifest: {MANIFEST.relative_to(REPO)}  ({len(rows)} rows)")


def make_qr_png(url: str, out_path: Path, px: int = 1024) -> None:
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    img = img.resize((px, px), Image.NEAREST)
    img.save(out_path, format="PNG")


def generate_pngs(rows: list[dict]) -> None:
    QR_PNG.mkdir(parents=True, exist_ok=True)
    for r in rows:
        make_qr_png(r["qr_url"], QR_PNG / f"qr_{r['unique_id']}.png")
    print(f"  PNGs:    {QR_PNG.relative_to(REPO)}  ({COUNT} files)")


def generate_pdf(rows: list[dict]) -> None:
    """A4 landscape, 3 across x 2 down = 6 stickers per page."""
    page = landscape(A4)
    page_w, page_h = page

    cols, rows_per = 3, 2
    margin = 12 * mm
    gutter = 8 * mm

    cell_w = (page_w - 2 * margin - (cols - 1) * gutter) / cols
    cell_h = (page_h - 2 * margin - (rows_per - 1) * gutter) / rows_per

    qr_size = min(cell_w, cell_h) - 22 * mm

    c = canvas.Canvas(str(PDF_PATH), pagesize=page)

    per_page = cols * rows_per
    for i, row in enumerate(rows):
        if i and i % per_page == 0:
            c.showPage()
        slot = i % per_page
        col = slot % cols
        row_idx = slot // cols

        x0 = margin + col * (cell_w + gutter)
        y0 = page_h - margin - (row_idx + 1) * cell_h - row_idx * gutter

        c.setStrokeColorRGB(0.8, 0.8, 0.8)
        c.setLineWidth(0.5)
        c.rect(x0, y0, cell_w, cell_h)

        c.setFont("Helvetica-Bold", 11)
        c.drawString(x0 + 6 * mm, y0 + cell_h - 8 * mm, "Goods.")
        c.setFont("Helvetica", 7)
        c.drawString(x0 + 6 * mm, y0 + cell_h - 12 * mm, "Stretch Bed - Batch 156")

        qr_path = QR_PNG / f"qr_{row['unique_id']}.png"
        qr_x = x0 + (cell_w - qr_size) / 2
        qr_y = y0 + (cell_h - qr_size) / 2 - 2 * mm
        c.drawImage(str(qr_path), qr_x, qr_y, qr_size, qr_size, preserveAspectRatio=True)

        c.setFont("Helvetica-Bold", 14)
        c.drawCentredString(x0 + cell_w / 2, y0 + 7 * mm, row["unique_id"])
        c.setFont("Helvetica", 6)
        c.drawCentredString(x0 + cell_w / 2, y0 + 3 * mm, row["qr_url"])

    c.save()
    print(f"  PDF:     {PDF_PATH.relative_to(REPO)}  ({(COUNT + per_page - 1) // per_page} pages)")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--insert-only", action="store_true")
    ap.add_argument("--artwork-only", action="store_true")
    args = ap.parse_args()

    rows = build_rows()
    print(f"Batch GB0-{BATCH}: {COUNT} Stretch Beds")
    print(f"  first: {rows[0]['unique_id']}  ->  {rows[0]['qr_url']}")
    print(f"  last:  {rows[-1]['unique_id']}  ->  {rows[-1]['qr_url']}")

    if not args.artwork_only:
        print("Inserting to Supabase (upsert on unique_id) ...")
        upsert_supabase(rows)

    if not args.insert_only:
        print("Writing artwork ...")
        write_manifest(rows)
        generate_pngs(rows)
        generate_pdf(rows)

    print("Done.")


if __name__ == "__main__":
    main()

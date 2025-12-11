#!/usr/bin/env python3
"""Generate Goods. logos in pink, black, and white for gang sheet decoration"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

# Output directory
BASE_DIR = Path('/Volumes/OS_FIELD_B/Code/Goods Asset Register')
OUTPUT_DIR = BASE_DIR / 'data/new_beds/logos'
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Settings for 20cm width at 300 DPI
MM_TO_PX = 11.811  # 300 DPI conversion
WIDTH_CM = 20  # 20 cm
WIDTH_PX = int(WIDTH_CM * 10 * MM_TO_PX)  # 20cm = 200mm = 2362px

# Font size proportional to width
FONT_SIZE = int(WIDTH_PX * 0.30)  # ~709px font size (smaller to fit with padding)

# Add generous padding to prevent cutoff
PADDING_PX = int(WIDTH_PX * 0.15)  # 15% padding on all sides

# Image dimensions (much wider to ensure no cutoff)
IMG_WIDTH = WIDTH_PX + (2 * PADDING_PX)  # Add padding left and right
IMG_HEIGHT = int(WIDTH_PX * 0.5)  # Taller for more breathing room

# Colors (RGBA with transparency)
COLORS = {
    'Pink': (255, 128, 178, 255),    # Bright pink
    'Black': (0, 0, 0, 255),         # Black
    'White': (255, 255, 255, 255),   # White
}

TRANSPARENT = (255, 255, 255, 0)  # Transparent background

print(f"🎨 Generating Goods. logo variations...")
print(f"Size: {WIDTH_CM}cm wide ({WIDTH_PX}px)")
print(f"Output: {OUTPUT_DIR}")
print()

# Try to load Helvetica Bold
try:
    font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", FONT_SIZE, index=1)  # Bold variant
except:
    try:
        font = ImageFont.truetype("/System/Library/Fonts/SFNSDisplay-Bold.otf", FONT_SIZE)
    except:
        print("⚠️  Warning: Using default font (system fonts not found)")
        font = ImageFont.load_default()

text = "Goods"  # Without period - we'll draw a circle instead

# Generate each color variation
for color_name, color_value in COLORS.items():
    print(f"Creating {color_name} logo...")

    # Create image with transparent background
    img = Image.new('RGBA', (IMG_WIDTH, IMG_HEIGHT), TRANSPARENT)
    draw = ImageDraw.Draw(img)

    # Get text bounding box for "Goods" (without period)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Account for any negative left offset (font overhang)
    text_left_offset = abs(min(0, bbox[0]))

    # Position the text with padding
    x = PADDING_PX + text_left_offset
    y = (IMG_HEIGHT - text_height) // 2

    # Draw the "Goods" text
    draw.text((x, y), text, fill=color_value, font=font)

    # Draw circle instead of period (at baseline, like a real period)
    circle_radius = FONT_SIZE // 8  # Circle size based on font
    circle_x = x + text_width + circle_radius + (FONT_SIZE // 25)  # Small gap after text
    circle_y = y + text_height - circle_radius  # Position at baseline
    draw.ellipse(
        [(circle_x - circle_radius, circle_y - circle_radius),
         (circle_x + circle_radius, circle_y + circle_radius)],
        fill=color_value
    )

    # Save as PNG with transparency
    output_path = OUTPUT_DIR / f"Goods_Logo_{color_name}_20cm.png"
    img.save(str(output_path), 'PNG')
    print(f"  ✓ Saved: {output_path.name}")

print()
print(f"✅ Generated 3 logo variations!")
print(f"\n📁 All files saved to: {OUTPUT_DIR}")
print(f"\nEach logo:")
print(f"  - Width: {WIDTH_CM}cm ({WIDTH_PX}px)")
print(f"  - Height: ~{IMG_HEIGHT}px (auto)")
print(f"  - Font: Helvetica Bold")
print(f"  - Background: Transparent")
print()
print("Colors generated:")
print("  💗 Pink (RGB: 255, 128, 178)")
print("  ⚫ Black (RGB: 0, 0, 0)")
print("  ⚪ White (RGB: 255, 255, 255)")
print()
print("Ready to add to your gang sheet design!")

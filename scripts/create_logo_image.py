#!/usr/bin/env python3
"""Create high-resolution Goods. logo in pink with transparent background"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

# Output path
output_dir = Path('/Volumes/OS_FIELD_B/Code/Goods Asset Register/data/new_beds')
output_path = output_dir / 'Goods_Logo_Pink_Transparent.png'

# Image settings
img_width = 1200
img_height = 400
pink_color = (255, 128, 178, 255)  # RGBA - same pink as the gang sheet

# Create image with transparent background
img = Image.new('RGBA', (img_width, img_height), (255, 255, 255, 0))  # Transparent
draw = ImageDraw.Draw(img)

# Try to use a bold font, fallback to default
try:
    # Try to find a system font
    font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 280)
except:
    try:
        font = ImageFont.truetype("/System/Library/Fonts/SFNSDisplay.ttf", 280)
    except:
        # Use default font if no system fonts found
        font = ImageFont.load_default()
        print("Warning: Using default font. For best results, system fonts are recommended.")

# Text to draw
text = "Goods."

# Get text bounding box
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]

# Center the text
x = (img_width - text_width) // 2
y = (img_height - text_height) // 2 - 30  # Slight adjustment for better centering

# Draw the text in pink
draw.text((x, y), text, fill=pink_color, font=font)

# Save as PNG with transparency
img.save(str(output_path), 'PNG')

print("✅ Logo created successfully!")
print(f"📄 File: {output_path.name}")
print(f"📏 Size: {img_width}px × {img_height}px")
print(f"💗 Color: Bright pink (RGB: 255, 128, 178)")
print(f"🔲 Background: Transparent")
print(f"\n📁 Location: {output_path}")
print("\nYou can now download this and import it into your gang sheet design!")

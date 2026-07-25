#!/usr/bin/env python3
"""Generate the canonical Goods and Goods on Country logo package.

The SVG files contain outlined Archivo glyphs, so they render consistently
without requiring the recipient to install the font.
"""

from __future__ import annotations

import shutil
import subprocess
import urllib.request
import zipfile
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parents[1]
KIT = ROOT / "brand-assets" / "approved" / "Goods" / "goods-brand-kit"
PUBLIC = ROOT / "v2" / "public" / "brand" / "goods"
CANONICAL = ROOT / "v2" / "public" / "brand" / "canonical"
FONT_DIR = KIT / "source" / "fonts"

COLORS = {
    "ink": "#1C1A17",
    "terracotta": "#C9613C",
    "cream": "#FBF8F1",
    "white": "#FFFFFF",
    "sand": "#E8DCC8",
    "sage": "#8B9D77",
    "sub": "#6A6158",
    "grid": "#E6DFD1",
}

FONT_URLS = {
    500: "https://fonts.gstatic.com/s/archivo/v25/k3k6o8UDI-1M0wlSV9XAw6lQkqWY8Q82sJaRE-NWIDdgffTTBjNp8A.ttf",
    600: "https://fonts.gstatic.com/s/archivo/v25/k3k6o8UDI-1M0wlSV9XAw6lQkqWY8Q82sJaRE-NWIDdgffTT6jRp8A.ttf",
    700: "https://fonts.gstatic.com/s/archivo/v25/k3k6o8UDI-1M0wlSV9XAw6lQkqWY8Q82sJaRE-NWIDdgffTT0zRp8A.ttf",
}


def ensure_fonts() -> dict[int, Path]:
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    paths: dict[int, Path] = {}
    for weight, url in FONT_URLS.items():
        path = FONT_DIR / f"Archivo-{weight}.ttf"
        if not path.exists():
            urllib.request.urlretrieve(url, path)
        paths[weight] = path
    return paths


class OutlinedText:
    def __init__(self, font_path: Path):
        self.font = TTFont(font_path)
        self.glyphs = self.font.getGlyphSet()
        self.cmap = self.font.getBestCmap()
        self.units = self.font["head"].unitsPerEm
        self.hmtx = self.font["hmtx"]

    def build(
        self,
        text: str,
        x: float,
        baseline: float,
        size: float,
        tracking: float = 0,
    ) -> tuple[str, float]:
        scale = size / self.units
        cursor = x
        paths: list[str] = []
        for char in text:
            glyph_name = self.cmap.get(ord(char), ".notdef")
            advance, _ = self.hmtx[glyph_name]
            pen = SVGPathPen(self.glyphs)
            transformed = TransformPen(
                pen,
                (scale, 0, 0, -scale, cursor, baseline),
            )
            self.glyphs[glyph_name].draw(transformed)
            command = pen.getCommands()
            if command:
                paths.append(command)
            cursor += advance * scale + tracking
        if text:
            cursor -= tracking
        return " ".join(paths), cursor - x


def svg_document(
    width: int,
    height: int,
    paths: list[tuple[str, str]],
    shapes: list[str],
    label: str,
) -> str:
    path_markup = "\n".join(
        f'  <path d="{commands}" fill="{fill}"/>' for commands, fill in paths
    )
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title">
  <title id="title">{label}</title>
{path_markup}
{chr(10).join(shapes)}
</svg>
"""


def write_goods(
    out: Path,
    filename: str,
    text_fill: str,
    dot_fill: str,
) -> None:
    archivo = OutlinedText(FONTS[700])
    commands, word_width = archivo.build("Goods", 70, 205, 170, tracking=-4.5)
    dot_radius = 18
    dot_x = 70 + word_width + 20 + dot_radius
    width = round(dot_x + dot_radius + 70)
    svg = svg_document(
        width,
        280,
        [(commands, text_fill)],
        [f'  <circle cx="{dot_x:.2f}" cy="190" r="{dot_radius}" fill="{dot_fill}"/>'],
        "Goods.",
    )
    (out / filename).write_text(svg)


def write_grounded(
    out: Path,
    filename: str,
    text_fill: str,
    accent_fill: str,
) -> None:
    bold = OutlinedText(FONTS[700])
    semibold = OutlinedText(FONTS[600])
    goods, goods_width = bold.build("Goods", 80, 200, 170, tracking=-4.5)
    dot_radius = 18
    dot_x = 80 + goods_width + 20 + dot_radius
    logo_right = dot_x + dot_radius
    phrase, phrase_width = semibold.build("on Country", 80, 278, 50, tracking=-0.5)
    rail_x = 80 + phrase_width + 22
    rail_width = max(100, logo_right - rail_x)
    width = round(logo_right + 80)
    svg = svg_document(
        width,
        350,
        [(goods, text_fill), (phrase, text_fill)],
        [
            f'  <circle cx="{dot_x:.2f}" cy="185" r="{dot_radius}" fill="{accent_fill}"/>',
            f'  <rect x="{rail_x:.2f}" y="269" width="{rail_width:.2f}" height="7" fill="{accent_fill}"/>',
        ],
        "Goods on Country",
    )
    (out / filename).write_text(svg)


def render_raster(svg_path: Path, png_dir: Path, jpg_dir: Path, backgrounds: dict[str, str]) -> None:
    stem = svg_path.stem
    background = backgrounds[stem]
    for width in (600, 1200, 2400):
        png_path = png_dir / f"{stem}-{width}px.png"
        subprocess.run(
            [
                "rsvg-convert",
                "--keep-aspect-ratio",
                "--width",
                str(width),
                "--output",
                str(png_path),
                str(svg_path),
            ],
            check=True,
        )
    jpg_path = jpg_dir / f"{stem}-2400px.jpg"
    subprocess.run(
        [
            "magick",
            str(png_dir / f"{stem}-2400px.png"),
            "-background",
            background,
            "-alpha",
            "remove",
            "-alpha",
            "off",
            "-quality",
            "94",
            str(jpg_path),
        ],
        check=True,
    )


def write_readme() -> None:
    (KIT / "README.md").write_text(
        """# Goods on Country brand kit

Canonical identity package approved 24 July 2026.

## Logo families

- `goods-*` — the complete Goods. wordmark. Never use a standalone letter or monogram.
- `goods-on-country-grounded-*` — the approved Goods on Country lockup. The words `on Country` sit on a terracotta ground rail.

## Formats

- `logos/svg/` — outlined vector masters. Preferred for print, signage and professional design.
- `logos/png/` — transparent raster exports at 600px, 1200px and 2400px.
- `logos/jpg/` — 2400px flattened files for tools that do not accept transparency.
- `brand-guide/` — usage rules, palette and typography.

## Variant naming

- `primary` — ink wordmark with terracotta full stop and rail.
- `reverse` — white wordmark with terracotta full stop and rail.
- `mono-ink` — single-colour ink.
- `mono-white` — single-colour white.
- `mono-terracotta` — single-colour terracotta.

Use primary on white or cream. Use reverse on ink or dark photography with a sufficient tint.
Use mono variants only when production is limited to one colour.

## Minimum size

- Goods on Country grounded lockup: 160px digital or 42mm print.
- Below 160px, remove the ground rail only.
- Below 96px, use the Goods. wordmark alone.

## Never

- Retype, stretch, skew, outline or add effects.
- Recolour individual elements outside the supplied variants.
- Use the old tracked, all-caps `ON COUNTRY` lockup.
- Create or imitate Aboriginal visual motifs.
"""
    )


def write_brand_guide() -> None:
    palette_rows = "\n".join(f"| {name.title()} | `{value}` |" for name, value in COLORS.items())
    (KIT / "brand-guide" / "GOODS-BRAND-GUIDE.md").write_text(
        f"""# Goods on Country identity guide

## Brand essence

**The making belongs on Country.**

Goods designs practical health hardware with communities and builds production pathways that can move into community ownership.

## Logo system

The master mark is the complete **Goods.** wordmark in Archivo Bold 700. The terracotta full stop is part of the mark.

The approved Goods on Country lockup is the **grounded lockup**. `on Country` is set in Archivo SemiBold 600 beneath Goods., followed by a terracotta rail. It describes the relationship to place as the foundation of the work, not as a detached subtitle.

Use the supplied outlined SVG files. Do not rebuild the mark in Canva, PowerPoint or another application.

## Colour

| Colour | Hex |
|---|---|
{palette_rows}

Primary brand combinations:

- Ink `{COLORS["ink"]}` and terracotta `{COLORS["terracotta"]}` on white `{COLORS["white"]}` or cream `{COLORS["cream"]}`.
- White `{COLORS["white"]}` and terracotta `{COLORS["terracotta"]}` on ink `{COLORS["ink"]}`.

## Typography

- Logo: Archivo Bold 700.
- Grounded descriptor: Archivo SemiBold 600, sentence case `on Country`.
- Editorial display: Georgia.
- Body and interface: system sans-serif.

The logo typography is supplied as vector outlines and must not be retyped.

## Clear space

Keep clear space equal to the height of the lowercase `o` in `on Country` around the complete grounded lockup.

## Minimum size

- Full grounded lockup: 160px digital or 42mm print.
- Below 160px: omit the rail if it becomes unclear.
- Below 96px: use Goods. alone and write “Goods on Country” as adjacent accessible text.

## Co-branding

When shown with community partners, give Goods equal or lesser visual weight. Never allow Goods to dominate a community-owned identity. Keep every partner mark inside its own clear space.

## Cultural protocol

The identity does not borrow or imitate Aboriginal artwork, symbols or pattern systems. Any cultural artwork used alongside the brand must be commissioned, attributed, paid for and governed by the relevant artist and community.

## Photography

Use real on-Country photography over stock. Every identifiable person requires consent appropriate to the intended channel. Communities retain rights over their stories and likeness; Goods receives permission to use them.

## Voice

Warm, direct and community-first. Lead with agency and the practical work. Avoid charity framing, inflated claims and language that positions intermediaries as the heroes.
"""
    )


def make_zip() -> None:
    zip_path = KIT.parent / "goods-on-country-brand-kit.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(KIT.rglob("*")):
            if path.is_file():
                archive.write(path, Path("goods-on-country-brand-kit") / path.relative_to(KIT))
    shutil.copy2(zip_path, PUBLIC / "goods-on-country-brand-kit.zip")


def mirror_public() -> None:
    if PUBLIC.exists():
        shutil.rmtree(PUBLIC)
    (PUBLIC / "logos").mkdir(parents=True)
    shutil.copytree(KIT / "logos", PUBLIC / "logos", dirs_exist_ok=True)
    shutil.copytree(KIT / "brand-guide", PUBLIC / "brand-guide")
    shutil.copy2(KIT / "README.md", PUBLIC / "README.md")
    CANONICAL.mkdir(parents=True, exist_ok=True)
    canonical_files = {
        "goods-primary-ink.png": "goods-primary-1200px.png",
        "goods-primary-white.png": "goods-reverse-1200px.png",
        "goods-on-country-primary-ink.png": "goods-on-country-grounded-primary-1200px.png",
        "goods-on-country-primary-white.png": "goods-on-country-grounded-reverse-1200px.png",
    }
    for target, source in canonical_files.items():
        shutil.copy2(KIT / "logos" / "png" / source, CANONICAL / target)


def main() -> None:
    global FONTS
    if KIT.exists():
        shutil.rmtree(KIT)
    for directory in (
        KIT / "logos" / "svg",
        KIT / "logos" / "png",
        KIT / "logos" / "jpg",
        KIT / "brand-guide",
    ):
        directory.mkdir(parents=True, exist_ok=True)
    FONTS = ensure_fonts()
    svg_dir = KIT / "logos" / "svg"
    png_dir = KIT / "logos" / "png"
    jpg_dir = KIT / "logos" / "jpg"

    variants = {
        "primary": (COLORS["ink"], COLORS["terracotta"]),
        "reverse": (COLORS["white"], COLORS["terracotta"]),
        "mono-ink": (COLORS["ink"], COLORS["ink"]),
        "mono-white": (COLORS["white"], COLORS["white"]),
        "mono-terracotta": (COLORS["terracotta"], COLORS["terracotta"]),
    }
    backgrounds: dict[str, str] = {}
    for name, (text_fill, accent_fill) in variants.items():
        goods_stem = f"goods-{name}"
        grounded_stem = f"goods-on-country-grounded-{name}"
        write_goods(svg_dir, f"{goods_stem}.svg", text_fill, accent_fill)
        write_grounded(svg_dir, f"{grounded_stem}.svg", text_fill, accent_fill)
        background = COLORS["ink"] if name in {"reverse", "mono-white"} else COLORS["white"]
        backgrounds[goods_stem] = background
        backgrounds[grounded_stem] = background

    for svg_path in sorted(svg_dir.glob("*.svg")):
        render_raster(svg_path, png_dir, jpg_dir, backgrounds)

    write_readme()
    write_brand_guide()
    mirror_public()
    make_zip()
    print(f"Generated brand kit: {KIT}")
    print(f"Public mirror: {PUBLIC}")


if __name__ == "__main__":
    main()

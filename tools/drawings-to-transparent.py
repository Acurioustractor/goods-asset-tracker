#!/usr/bin/env python3
"""
Turn Goods line-art renders (ink on a flat cream field) into true transparent PNGs
that sit on ANY background, light or dark.

Why not a colour key: a hard key on the background colour eats the anti-aliased
edges and the paper grain, leaving jaggy lines with a cream halo. Instead we treat
each render as ink-on-paper and recover the ink:

    alpha = how far this pixel is from the paper, per channel (max wins)
    colour = the ink colour with the paper divided back out (un-premultiply)

That preserves soft edges and grain, because a half-covered pixel becomes a
half-alpha pixel rather than a hard in/out decision.

Two variants per source:
  -on-light.png  the ink as drawn (terracotta/sage on transparency)
  -on-dark.png   the same alpha, ink lifted toward cream so it reads on ink/black

Usage: python3 tools/drawings-to-transparent.py
Output: generated-images/goods-illustrations/transparent/
"""
from PIL import Image
import numpy as np
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC_DIRS = [
    ROOT / "generated-images/goods-illustrations/model-diagrams",
    ROOT / "generated-images/goods-illustrations/process-anchors",
]
EXTRA = [ROOT / "v2/public/images/brand/generated/goods-ill-x-leg.png"]
OUT = ROOT / "generated-images/goods-illustrations/transparent"

# How far toward cream the ink is lifted for the dark variant (0 = unchanged, 1 = cream)
DARK_LIFT = 0.58
CREAM = np.array([242, 236, 224], dtype=np.float32)
# Alpha below this is treated as pure paper, killing faint JPEG-ish mottle in the field
NOISE_FLOOR = 0.06


def estimate_paper(a):
    """Median of the four corner patches - robust to a stray dark object in a corner."""
    h, w, _ = a.shape
    k = max(4, min(h, w) // 64)
    patches = [a[0:k, 0:k], a[0:k, w - k:w], a[h - k:h, 0:k], a[h - k:h, w - k:w]]
    return np.median(np.concatenate([p.reshape(-1, 3) for p in patches]), axis=0)


def to_transparent(path: Path):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32)
    paper = estimate_paper(a)

    # Per-channel coverage: how far below the paper this pixel sits, normalised.
    # max across channels so a saturated terracotta line keys as strongly as a grey one.
    deficit = (paper[None, None, :] - a) / np.maximum(paper[None, None, :], 1.0)
    alpha = np.clip(deficit.max(axis=2), 0.0, 1.0)
    alpha[alpha < NOISE_FLOOR] = 0.0

    # Un-premultiply: recover the ink colour with the paper divided back out.
    safe = np.maximum(alpha, 1e-4)[..., None]
    ink = (a - paper[None, None, :] * (1.0 - safe)) / safe
    ink = np.clip(ink, 0, 255)

    light = np.dstack([ink, alpha * 255.0]).astype(np.uint8)
    lifted = ink + (CREAM[None, None, :] - ink) * DARK_LIFT
    dark = np.dstack([np.clip(lifted, 0, 255), alpha * 255.0]).astype(np.uint8)

    OUT.mkdir(parents=True, exist_ok=True)
    stem = path.stem
    Image.fromarray(light, "RGBA").save(OUT / f"{stem}-on-light.png")
    Image.fromarray(dark, "RGBA").save(OUT / f"{stem}-on-dark.png")
    return stem, float(alpha.mean()), tuple(int(v) for v in paper)


def main():
    targets = [p for d in SRC_DIRS if d.is_dir() for p in sorted(d.glob("*.png"))]
    targets += [p for p in EXTRA if p.is_file()]
    if not targets:
        print("no source drawings found")
        return
    print(f"{'drawing':34} {'ink%':>6}  paper")
    for p in targets:
        stem, cover, paper = to_transparent(p)
        print(f"{stem:34} {cover*100:5.1f}%  rgb{paper}")
    print(f"\n{len(targets)} drawings -> {len(targets)*2} files in {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Generate Goods on Country line illustrations with the latest Gemini image model
("Nano Banana Pro" / gemini-3-pro-image-preview), steered by the existing
goods-ill-* reference set so every new illustration matches the locked style.

This is the "different way to draw": a real drawing model, not hand-coded SVG.
Consistency comes from (a) the locked style prompt below and (b) attaching the
reference images so the model copies the hand.

USAGE
  # named prompt from the built-in pack:
  python scripts/gen_goods_illustration.py --name plastic-loop --out out.png
  # your own scene (the locked style is appended automatically):
  python scripts/gen_goods_illustration.py --scene "a heat press pressing a recycled-plastic sheet" --out press.png
  # override refs / model / aspect:
  python scripts/gen_goods_illustration.py --name flywheel --aspect 16:9 \
      --refs v2/public/images/brand/goods-ill-plastic-loop.png v2/public/images/brand/goods-ill-plant.png

KEY
  Reads GEMINI_API_KEY or GOOGLE_API_KEY from v2/.env.local (or the environment).
  Get one free at https://aistudio.google.com/apikey and add to v2/.env.local:
      GEMINI_API_KEY=...

NOTE
  Cannot run inside the Claude Code web session (its egress proxy blocks Google
  hosts with a 403). Run it on your own machine, where Google is reachable.
"""
import argparse, base64, json, os, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
DEFAULT_MODEL = "gemini-3-pro-image-preview"   # latest ("Nano Banana Pro"); fallback: gemini-2.5-flash-image
DEFAULT_REFS = [
    "v2/public/images/brand/goods-ill-plastic-loop.png",
    "v2/public/images/brand/goods-ill-leg.png",
    "v2/public/images/brand/goods-ill-plant.png",
    "v2/public/images/brand/goods-ill-canvas.png",
]

# The locked style, appended to every scene so the model draws one hand.
MASTER_STYLE = (
    "Draw ONE clean flat line illustration on a warm cream (#FBF8F1) background. "
    "One consistent medium-weight terracotta-clay (#A8643F) outline, rounded caps and joins, "
    "a single confident line, no shading, no gradient, no 3D, no drop shadow. "
    "Recycled-plastic surfaces carry a few small sage-green (#8B9D77) terrazzo flecks. "
    "Colour ONLY by material: plastic clay #A8643F, steel gold #BBA255, canvas teal #5C8A86, "
    "place / On Country sage #8B9D77. Chunky outlined clay arrows for any flow. "
    "NO text, NO labels, NO numbers, NO people's faces, NO cultural symbols "
    "(no dot-painting, flags, boomerangs). Objects are open outlines on cream, not filled. "
    "The Stretch Bed is X-trestle true: two crossed-plank recycled-plastic legs, steel poles "
    "through the canvas sleeves into the leg holes, canvas taut and structural (never clip-on, "
    "woven, timber, or a hammock). Match the attached reference images exactly so it reads as "
    "one family, one hand."
)

# Built-in scene prompts (the "what to draw"; the locked style is added automatically).
PROMPTS = {
    "plastic-loop":
        "a circular loop showing recycled plastic becoming a bed: a pile of shredded HDPE "
        "flakes, then a heat press, then a finished Stretch Bed, with an arrow returning "
        "offcuts from the bed back to the flakes.",
    "x-leg":
        "a single recycled-plastic X-trestle bed leg (two crossed speckled planks) standing upright.",
    "flywheel":
        "a circular flywheel of four stages with clockwise arrows: make in-house, sell, surplus, "
        "fund the next container; a shipping container at the centre.",
    "containers-fund-containers":
        "one shipping-container plant, an arrow of surplus seeding a second container, then a third; "
        "the fleet growing left to right. No dollar signs.",
    "health-chain":
        "an ABSTRACT chain of links where a Stretch Bed breaks one link. Object-only, no people, "
        "no bodies, no sick figures. The bed interrupting the chain is the whole idea.",
    "how-its-made":
        "a cross-section of the containerised plant: a shredder, a heat press, and a CNC router "
        "inside open shipping containers, with pressed recycled-plastic sheets stacked.",
    "impact-per-bed":
        "one Stretch Bed at the centre with four simple objects around it (a plastic flake cluster, "
        "a small house, a hand, a canvas square), each connected to the bed by a short clay line.",
    "markup-gap":
        "a left-to-right transformation: a small pile of raw plastic flakes, then the heat press, "
        "then a finished speckled recycled-plastic bed leg. Value added as the plastic transforms.",
}


def load_key():
    for name in ("GEMINI_API_KEY", "GOOGLE_API_KEY", "GOOGLE_GENAI_API_KEY"):
        if os.environ.get(name):
            return os.environ[name]
    envf = ROOT / "v2" / ".env.local"
    if envf.exists():
        for line in envf.read_text().splitlines():
            line = line.strip()
            for name in ("GEMINI_API_KEY", "GOOGLE_API_KEY", "GOOGLE_GENAI_API_KEY"):
                if line.startswith(name + "="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None


def b64_image(path):
    p = (ROOT / path) if not os.path.isabs(path) else pathlib.Path(path)
    data = pathlib.Path(p).read_bytes()
    mime = "image/png" if str(p).lower().endswith(".png") else "image/jpeg"
    return mime, base64.b64encode(data).decode()


def main():
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--name", choices=sorted(PROMPTS), help="a built-in scene prompt")
    g.add_argument("--scene", help="your own scene description (locked style is appended)")
    ap.add_argument("--out", default="goods-illustration.png")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--aspect", default="16:9", help="e.g. 16:9, 4:3, 1:1")
    ap.add_argument("--refs", nargs="*", default=DEFAULT_REFS, help="reference images that steer the style")
    args = ap.parse_args()

    key = load_key()
    if not key:
        sys.exit("No GEMINI_API_KEY / GOOGLE_API_KEY found. Add one to v2/.env.local "
                 "(get it free at https://aistudio.google.com/apikey).")

    try:
        import requests
    except ImportError:
        sys.exit("pip install requests")

    scene = PROMPTS[args.name] if args.name else args.scene
    prompt = f"{scene}\n\n{MASTER_STYLE}\n\nAspect ratio {args.aspect}."

    parts = [{"text": prompt}]
    for r in args.refs:
        try:
            mime, data = b64_image(r)
            parts.append({"inline_data": {"mime_type": mime, "data": data}})
        except FileNotFoundError:
            print(f"  (skipping missing ref: {r})", file=sys.stderr)

    body = {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": args.aspect}},
    }
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{args.model}:generateContent"
    print(f"Generating '{args.name or 'custom'}' with {args.model} + {len(parts)-1} refs ...")
    resp = requests.post(url, headers={"x-goog-api-key": key, "Content-Type": "application/json"},
                         data=json.dumps(body), timeout=180)
    if resp.status_code != 200:
        sys.exit(f"Gemini API error {resp.status_code}: {resp.text[:600]}")

    out_written = None
    for cand in resp.json().get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                pathlib.Path(args.out).write_bytes(base64.b64decode(inline["data"]))
                out_written = args.out
    if not out_written:
        sys.exit("No image returned. Raw response head:\n" + resp.text[:600])
    print(f"Wrote {out_written}")


if __name__ == "__main__":
    main()

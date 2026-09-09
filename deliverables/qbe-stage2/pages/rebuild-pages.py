#!/usr/bin/env python3
"""Rebuild the two published QBE pages from their stripped sources.

The tracked HTML in this directory carries placeholders instead of the two large
embedded payloads, so git stays free of base64 blobs:

  qbe-control-room.html   __WORKBOOK_B64__   the recalculated workbook, offered as a download
  qbe-questions.html      __THUMBS__         19 deck slide thumbnails as data URIs

Run this, then publish the files it writes to /tmp with the Artifact tool, passing the
existing url so the same link is kept:

  control room   https://claude.ai/code/artifact/b45c45a0-378b-41a0-b635-eaa461d0957f
  the questions  https://claude.ai/code/artifact/92ad473f-91e5-4ec8-b68c-2c3580102cb5

Before publishing anything, run the writing-tells gate over the output:
  node tools/check-ai-tells.mjs <file>
"""
import base64, json, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
MASTER = os.path.join(REPO, "deliverables/finance/goods-financial-plan/Goods-financial-plan.xlsx")
SOFFICE = "/opt/homebrew/bin/soffice"
OUT = tempfile.mkdtemp(prefix="qbe-pages-")

FRAMES = ["LDM1K","nYkbR","T814io","S28Ukn","LP8Uy","i3mL7v","MYAVQ","XRUz9","mDhny","esUr4",
          "ZZ4GO","LX4ci","COJmo","nfPKg","TiKvy","F93w1o","rknzM","tVcLc","H5N2zG"]


def recalculated_workbook():
    """The master is saved with no cached values, so a copy has to be recalculated
    before any figure in it can be read, and before it is worth handing to anyone."""
    work = os.path.join(OUT, "recalc")
    os.makedirs(work, exist_ok=True)
    copy = os.path.join(work, "plan.xlsx")
    subprocess.run(["cp", MASTER, copy], check=True)
    subprocess.run([SOFFICE, "--headless", "--convert-to", "xlsx", "--outdir",
                    os.path.join(work, "out"), copy],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return os.path.join(work, "out", "plan.xlsx")


def build_control_room():
    src = open(os.path.join(HERE, "qbe-control-room.html")).read()
    if "__WORKBOOK_B64__" not in src:
        sys.exit("control room source has no placeholder; it may already carry the payload")
    wb = recalculated_workbook()
    b64 = base64.b64encode(open(wb, "rb").read()).decode()
    out = os.path.join(OUT, "qbe-control-room.html")
    open(out, "w").write(src.replace("__WORKBOOK_B64__", b64))
    print(f"control room -> {out}  ({len(b64):,} base64 chars of workbook)")
    return out


def build_questions(thumbs_dir):
    """thumbs_dir holds <frameId>.jpeg for each of the 19 live frames. Export them from
    Pencil with the mcp__pencil__execute tool:

        Export(FRAMES, "jpeg", "<thumbs_dir>", {scale:0.35, quality:74})
    """
    src = open(os.path.join(HERE, "qbe-questions.html")).read()
    if "__THUMBS__" not in src:
        sys.exit("questions source has no placeholder; it may already carry the payload")
    thumbs = {}
    for fid in FRAMES:
        p = os.path.join(thumbs_dir, f"{fid}.jpeg")
        if not os.path.exists(p):
            sys.exit(f"missing thumbnail {p}. Export the 19 frames from Pencil first.")
        thumbs[fid] = "data:image/jpeg;base64," + base64.b64encode(open(p, "rb").read()).decode()
    out = os.path.join(OUT, "qbe-questions.html")
    open(out, "w").write(src.replace("__THUMBS__", json.dumps(thumbs)))
    print(f"questions -> {out}  ({len(thumbs)} thumbnails)")
    return out


if __name__ == "__main__":
    build_control_room()
    if len(sys.argv) > 1:
        build_questions(sys.argv[1])
    else:
        print("questions page skipped. Pass the directory holding the 19 exported "
              "frame JPEGs to build it.")

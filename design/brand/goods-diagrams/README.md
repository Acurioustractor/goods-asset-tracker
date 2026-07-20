# goods-diagrams (versioned skill copy)

This folder is the **versioned copy** of the Goods diagrams skill. The working copy
Claude Code loads from (`.claude/skills/goods-diagrams/`) is **gitignored**, so this is
where the skill actually lives in git.

## Use it in Claude Code CLI

```bash
bash scripts/setup-drawing-skill.sh   # copies this folder -> .claude/skills/goods-diagrams/
```

Then start Claude Code in the repo; the `goods-diagrams` skill will be available.

## What's here

- `SKILL.md` — the workflow and rules (generation-first: draw with the model, never
  hand-code the picture).
- `references/generate.md` — the primary method: prompts + which references to attach.
- `references/style-and-rules.md` — palette, material→colour map, standing rules.
- `references/build-and-assemble.md` — the label-overlay conventions + optional vector path.
- `assets/overlay-template.svg` / `.html` — drop a generated PNG in, add the exact labels.

## Read first

- **The full story and the non-negotiable rules:** `wiki/outputs/2026-07-18-goods-drawing-system.md`
- **All prompts + slide text:** `wiki/outputs/2026-07-18-goods-image-generation-pack.md`
- **The pitch's single source of truth:** `wiki/outputs/2026-07-18-goods-pitch-canonical-map.md`

The one rule that matters most: **generate the picture with the model (Gemini, steered by
`goods-styleref-speckle.png`); never hand-author the illustration in SVG.**

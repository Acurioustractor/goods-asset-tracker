# P5: Retire the "ALMA" acronym from the impact-method docs

Date: 2026-06-18
Decision (Ben): KEEP the thinking, RETIRE the name. The 6-signal story/impact review lens is renamed **"the story-selection lens"** (plain English, lower case unless starting a sentence).

Reason: "ALMA" already means **Alternative Local Models Australia** in our work, so reusing it for the review lens was a name collision.

Scope rule honoured: only the story/impact-review lens was renamed. "Alternative Local Models Australia" (the OTHER, legitimate ALMA) was NOT touched. The six signals and their substance are intact: this was a rename, not a method rewrite.

## What changed

### Framework doc (the source of the method)
- `wiki/articles/impact/alma-framework.md` — title heading changed `# Australian Living Map of Alternatives` -> `# The story-selection lens`; every in-body "Australian Living Map of Alternatives" label replaced with "the story-selection lens" / "story-selection lens" as grammar fits. Six-signal table and all section substance kept verbatim. **FILENAME KEPT** (see follow-up below).

### compendium/stories (stories were scored with the lens)
- `compendium/stories/index.md` — heading "ALMA Aggregate" -> "Story-selection lens aggregate"
- `compendium/stories/community-innovation.md` — heading "ALMA Signals" -> "Story-selection lens signals"
- `compendium/stories/ellen-friday-fridge.md` — heading "ALMA Signals" -> "Story-selection lens signals"
- `compendium/README.md` — tree comment "ALMA aggregate" -> "story-selection lens aggregate"
  (the six signal rows + scores left intact; substance unchanged)

### wiki/articles + indexes
- `wiki/articles/impact/README.md` — label on the `[[alma-framework]]` line
- `wiki/articles/INDEX.md` — cluster blurb + the `[[impact/alma-framework]]` line label
- `wiki/articles/impact/alma-framework.md` (above)
- `wiki/articles/qbe-review.md` — Impact-cluster blurb
- `wiki/articles/program/workshop-evidence-map.md` — Area 02 evidence cell
- `wiki/articles/program/stage-2-funding.md` — Impact Measurement Report row
- `wiki/articles/enterprise/02-social-objective-impact.md` — section heading + 2 body lines
- `wiki/articles/sources/may-2026-founder-working-conversation.md` — founder-view bullet
- `wiki/articles/brand-comms/07-slide-deck.md` — Q&A answer ("ALMA framework underpins our theory of change" -> "The story-selection lens underpins...")
- `wiki/index.md` — section map row
- `wiki/AGENTS.md` — folder map line + Focus Topic 5 (also swapped an em dash for a colon on the touched line, per brand voice)

All `[[alma-framework]]` / `[[../impact/alma-framework]]` wikilink SLUGS were left as-is because the filename was kept.

## File-rename decision: KEPT `alma-framework.md`

Did NOT `git mv` to `story-selection-lens.md`. Reason: the slug `alma-framework` is referenced by Obsidian-style wikilinks in multiple live files AND is mirrored into the build output `v2/.wiki-content/` (regenerated from `wiki/articles/` by `npm run wiki:sync` / `prebuild`). Renaming the file would also require touching every `[[alma-framework]]`/`[[impact/alma-framework]]` wikilink and would not be reflected in the mirror until next build. Per the contract (keep the filename if refs are scattered/unclear), I renamed only the in-content label and flag the file rename as a clean follow-up.

**Follow-up (optional):** `git mv wiki/articles/impact/alma-framework.md wiki/articles/impact/story-selection-lens.md`, then update the wikilink slugs in: `wiki/articles/impact/README.md`, `wiki/articles/INDEX.md`, `wiki/articles/program/workshop-evidence-map.md`, `wiki/articles/program/stage-2-funding.md`, `wiki/articles/impact/alma-framework.md` (its own `## Related`/`## Source` are relative-up links to other files, unaffected). The `v2/.wiki-content/` mirror self-heals on next build.

## Deliberately NOT changed (out of scope / would be overwritten / are records of the past)

- **`v2/.wiki-content/` mirror** — build-generated copy of `wiki/articles/` (cp -R via `wiki:sync` in `v2/package.json`); editing it is pointless (overwritten on next build) and my `wiki/articles/` edits propagate automatically.
- **`wiki/outputs/*` dated snapshots** (e.g. `2026-04-25-qbe-*`, `2026-05-*`, `2026-06-09-*`) and `wiki/outputs/2026-06-18-goods-impact-framework.md` — these are dated point-in-time artifacts and the canonical framework doc that ITSELF instructs the retirement (its line 95 carries the only "Alternative Local Models Australia" reference). Left as historical record.
- **`v2/docs/GOODS_KNOWLEDGE_COMPENDIUM.md`, `GOODS_STRATEGY_PD.md`, `COMPENDIUM_MARCH_2026.md`, `DESIGN_SPRINT_PREP.md`** — dated compendium snapshots, not live wiki. Carry "ALMA (Authentic Learning for Meaningful Accountability)". Out of the named scope.
- **`thoughts/shared/handoffs/impact-model-align/02-wiki-articles.md`, `03-other-framings.md`, `2026-05-28-inventory-wiki.md`** and **`thoughts/shared/qbe-program/diagnostic/02-social-objective-impact.md`** — analysis/handoff docs that DISCUSS ALMA as the thing being retired; rewriting them would erase the rationale. Left as-is.

## Ambiguous hits left flagged

None genuinely ambiguous. The lens carried THREE expansions across the repo (all the same 6-signal lens): "Australian Living Map of Alternatives", "Authentic Learning for Meaningful Accountability", and the bare "ALMA framework". The single occurrence of "Alternative Local Models Australia" (the legitimate other ALMA) is isolated to the framework-doc note and was confirmed untouched.

## Verification
- `grep -rIn "ALMA|Australian Living Map|Authentic Learning" wiki/articles/ compendium/ wiki/index.md wiki/AGENTS.md` -> empty.
- "Alternative Local Models Australia" -> exactly 1 hit, in `wiki/outputs/2026-06-18-goods-impact-framework.md:95`, unchanged.
- No commit / push / deploy performed. Working tree only.

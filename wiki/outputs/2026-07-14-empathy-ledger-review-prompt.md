# Prompt: full Goods storyteller review in Empathy Ledger

*Paste this into whatever tool you use to work on the `empathy-ledger-v2` codebase (Claude Code, Codex, or directly in the EL app). Written 2026-07-14 from a real audit of the Goods side — see context below for why this is necessary, not optional.*

---

## Context (why this matters)

A provenance audit on the Goods on Country side just found that the `Project = "Goods."` tag cannot be trusted as the complete list of Goods storytellers:

- **One key storyteller's real transcript is tagged to a completely different program** ("Beyond Shadows," not Goods) even though his quote is currently the lead voice of the pitch's opening movement. If one is mistagged, others likely are too — in both directions (Goods people tagged elsewhere, or non-Goods people tagged Goods).
- Of the people currently quoted in the Goods pitch, only a third have any real transcript at all. The rest trace to hand-typed cards with no link back to a source.
- Several people have unresolved location/community conflicts (which Ivy, is Gloria Kalgoorlie or Tennant Creek, is Tracy Kalgoorlie or Mount Isa).

The Goods pitch cannot be finished on this foundation. This task is to fix the foundation first.

## Task

**1. Find every storyteller who could plausibly be a Goods participant — do not rely on the `Project` tag alone.**
Cross-reference by:
- **Location tags** matching known Goods trip locations: Kalgoorlie, Palm Island, Mount Isa, Darwin, Tennant Creek, Alice Springs / Utopia Homelands, Maningrida, Katherine, Ampilatwatja / Arawerr, Barunga.
- **Date ranges** matching known Goods trips: Oct 2024 (Kalgoorlie), Nov–Dec 2024 (Palm Island, Mount Isa), Jan 2025 (Darwin), May 2025 (Tennant Creek), May 2026 (Utopia / Alice Springs).
- **Full-text search across transcripts** for Goods-specific terms: "Stretch Bed," "bed," "mattress," "Pakkimjalki," "washing machine," "Oonchiumpa," "Wilya Janta," "Anyinginyi," "basket bed."
- Check every record this surfaces even if its `Project` tag says something else — that mismatch is exactly the bug that started this.

**2. For every match, confirm the transcript is real and genuinely about Goods.**
Read enough of it to confirm — don't just check the tag. Flag any record where the tag and the content disagree (the Gary case), in either direction.

**3. Lock four things per person, from the transcript itself, not from any secondary document:**
- Canonical name (correct spelling)
- Community
- Specific location
- Date recorded

**4. Run Empathy Ledger's AI synthesis / theme-extraction feature on each confirmed transcript** (opt-in, consent-respecting, per the platform's own rules — do not run analysis on anyone without active consent). For each person, extract:
- 3–5 key themes
- The 2–3 strongest verbatim quotes per theme (word-for-word, not paraphrased)
- A one-line highlight

**5. Output one structured record per storyteller:**
```
name | community | location | date recorded | consent status/tier | themes[] | quotes[] (verbatim + theme tag) | highlight
```
As CSV or JSON — needs to be importable back into the Goods repo's `storyteller-registry.ts`.

**6. Flag explicitly, as a separate list:** anyone whose transcript content conflicts with what the Goods pitch currently claims about them (wrong location, wrong role, a quote attributed to the wrong person, anything that reads as pulled from a different context).

## What happens with the output

Bring the exported records back to the Goods session. They'll be reconciled against `storyteller-registry.ts` (the current code-side voice registry) and used to rebuild the pitch's voice bank on confirmed, source-linked data, organised by community. Nothing gets added to the pitch until it traces back to a real, locked record from this pass.

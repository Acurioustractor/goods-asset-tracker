---
name: goods-strategic-pack
description: Regenerate the aligned Goods on Country strategic pack for catalytic investors and partners — a master alignment map, strategy memo, one-pager, and investor deck (.pptx) — synthesized from the wiki with strict evidence-tagging. Use when the user asks to "refresh the investor pack", "rebuild the strategy docs", "align the QBE elements", "regenerate the deck", "make the leave-behind", or after the wiki/canonical numbers change and the outward-facing pack needs to catch up.
---

# Goods Strategic Pack

Regenerate a coherent, defensible strategic bundle for Goods on Country from the wiki, without re-inventing facts. The pack is for **catalytic investors and partners**, so the governing rule is honesty over polish: every external number carries an evidence label, and contradictions are surfaced, not blended away.

## When to use
- The user wants the high-level strategic documents aligned and ready to send to funders/partners.
- The canonical numbers, capital stack, or readiness state changed and the pack is stale.
- A specific deliverable is requested (just-the-deck, just-the-one-pager) — produce that one but still validate it against the alignment map.

## The four deliverables
1. **`00-master-alignment-map.md`** — the single internal source of truth. Pulls every QBE element together, fixes the canonical numbers, and runs a contradictions ledger. Build this FIRST; the others derive from it.
2. **`01-strategy-memo.md`** — 3–5 page catalytic-investor memo: problem, proof, honest economics, the ask, why-catalytic, what's still to build, why-now.
3. **`02-one-pager.md`** — single-page leave-behind.
4. **`Goods-on-Country-Investor-Deck.pptx`** — ~14-slide deck. Generator is `build-deck.js` (pptxgenjs).

Output to `wiki/outputs/<YYYY-MM-DD>-goods-strategic-pack/`. The 2026-06-13 edition is the reference template — copy its structure.

## Evidence discipline (non-negotiable)
Every external figure carries one label:
- **[VERIFIED]** — independently checkable (asset register, products.ts).
- **[WORKPAPER]** — Xero mirror, unaudited. *Never call this "audited Goods revenue."*
- **[MODELLED]** — planning assumption, no production actual behind it.
- **[TARGET]** — sought, not signed.

This mirrors `wiki/outputs/2026-05-29-qbe-canonical-numbers-sheet.md`, whose whole purpose is to "stop 369+, 496+, 520+, $405K, $445K, $684K, $732K and $3M from being mixed without definitions."

## Workflow
1. **Read the canon (delegate to subagents for the heavy reads):**
   - `wiki/outputs/<latest>-qbe-canonical-numbers-sheet.md` and `wiki/canon/qbe-readiness.md` — numbers + readiness.
   - `wiki/articles/enterprise/01..10` — the ten QBE topics.
   - `wiki/articles/capital/{capital-stack,cost-register}.md`, `wiki/articles/investors/{our-investment-needs,investor-pipeline}.md` — capital + ask.
   - `wiki/articles/impact/{theory-of-change,metrics-tracked}.md`, `wiki/articles/products/{stretch-bed,plant-design}.md`.
   - `wiki/articles/communities/overview.md` — traction.
   - The latest pitch-deck blueprint in `wiki/outputs/` (the adversarially-reviewed deck spine — use it as primary structure).
2. **Build `00-master-alignment-map.md`** — reconcile numbers, write the contradictions ledger, set the canonical figures the other docs must use.
3. **Write the memo and one-pager** straight from the map.
4. **Generate the deck** with `build-deck.js`, then render to images and run a **fresh-eyes subagent visual QA** (pills covering captions and boxes touching edges are the recurring defects). Fix once, re-verify, stop.
5. **Validate** — cross-check every figure across all four files against the map.

## Canon traps (carry these every time)
- **Product mechanism:** the Stretch Bed is an **X-trestle tension design** — poles thread through canvas sleeves and the crossed-plank HDPE legs; the canvas is structural. NOT "clip-on"/"slot-on" legs (the wiki product copy is wrong on this — use products.ts / CLAUDE.md).
- **Bed count:** use **496 deployed [VERIFIED, asset register]**; never blend with the 412 (compendium) or 369 (go-to-market) baselines.
- **Plastic:** **2,660 kg (Stretch only)**; retire 9,920 / 9,225 kg.
- **Revenue:** received **$649,710.79 [WORKPAPER]** for the billing view; **$405,685** for grants-received; never "audited".
- **The ask:** AU$900K–1M blended, **non-equity**; first ~$400K signed ahead of the Sept 2026 Stage 2 application; QBE match **up to $400K, at least 1:1 vs secured external capital, repayable finance preferred, legally-binding evidence** (confirmed from program docs 2026-06-13 — not $200K).
- **The honest core:** ~89% grant-funded, AU$90 commercial revenue, 0 signed LOIs, and the in-source cost-down is [MODELLED] (0 beds assembled in-house). Say so — candor is the closing tool.
- **Entity:** A Curious Tractor Pty Ltd (trades, migrating) + Butterfly Movement Ltd (DGR, FY2026-27, not live today). A Kind Tractor Ltd is dormant, not the vehicle.
- **Consent:** only consent-cleared voices/photos externally (Ivy Johnson + Dianne Stokes safe; others pending). Run `consent-check` before publishing any community content.

## Pre-send checklist (put at the foot of every pack)
- [ ] Re-pull Xero immediately before sending (received/billed move).
- [ ] Refresh CRM/pipeline (goes stale fast).
- [ ] Team slide carries named roles — no placeholders.
- [ ] A core team member has audited each external number and can defend it in live Q&A.

## Deck generation notes (build-deck.js)
- pptxgenjs, `LAYOUT_WIDE`. Palette: red-dirt country (terracotta `B0492E`, ochre `D08C2E`, eucalyptus `6E7F5B`, earth `2B2118`, warm cream `F4EEE5`). Georgia headers, Calibri body — matches the Goods brand.
- Evidence pills are colored rounded-rects; keep captions clear of them (offset caption x by pill width + 0.1).
- Render check: `soffice --convert-to pdf` then `pdftoppm -jpeg`; inspect with a subagent. The jpgs lock after viewing — render to a fresh prefix on the second pass.

## Installing this skill
This folder is a ready-to-install skill. The repo `.claude/` directory is protected in this session, so the skill was written here instead. To make it available:
- Copy this `goods-strategic-pack/` folder into `.claude/skills/` in the Goods repo, **or**
- Install via Cowork Settings → Capabilities.

Editing a cached copy does not register the skill — it must be installed.

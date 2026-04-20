# Publishing the Goods Wiki (Obsidian Publish)

> One-page setup for sharing this wiki externally via Obsidian Publish. $10/mo, single site password, native `[[wikilink]]` rendering, separate subdomain (e.g. `publish.obsidian.md/goods-on-country` or custom domain).

## Setup steps (once)

1. **Open the vault in Obsidian.** File → Open → select `/Users/benknight/Code/Goods Asset Register/wiki`. Obsidian will create a `.obsidian/` config folder automatically (ignore it in git if desired).
2. **Subscribe to Obsidian Publish.** Settings → Core plugins → enable "Publish". Sign in and pick a site ID (suggestion: `goods-on-country` or `goods`).
3. **Set a site password.** In the Publish settings, enable "Password protection" and set one shared password. Write it down somewhere you can hand to Jess, Beck, Sarah, or a specific funder.
4. **Pick the homepage.** Set the homepage to `index.md`.
5. **Select notes to publish.** Right-click → "Publish" at the folder level or via the Publish panel. Start by publishing everything under `articles/` except the excluded list below. The `raw/` folder should NOT be published (immutable sources, some sensitive).
6. **Configure site settings.**
   - Site name: "Goods on Country — Wiki"
   - Site description: "Living knowledge base for Goods on Country — QBE Catalysing Impact 2026"
   - Enable: "Show file tree", "Show backlinks", "Show graph view", "Readable line length"
   - Disable: "Show local graph" if you don't want people exploring network state
7. **Optional: custom domain.** Point `wiki.goodsoncountry.com` or similar CNAME to `publish-main.obsidian.md`. Costs nothing extra.
8. **Publish.** Click the cloud icon in the Publish panel.

## What to publish (recommended)

| Folder | Publish? | Rationale |
|---|---|---|
| `articles/capital/` | ✅ Yes | Educational, non-sensitive. Useful context for funders. |
| `articles/program/` | ✅ Yes | Program structure is already public info from SIH/QBE. |
| `articles/impact/` | ✅ Yes | Our impact story; this is the pitch. |
| `articles/products/` | ✅ Yes | Product narrative. Public-facing. |
| `articles/communities/` | ⚠️ Case-by-case | Publishable but sense-check specific numbers with community partners first. |
| `articles/support-network/` | ✅ Yes | PIN + SIH + cohort peers are all public program roles. |
| `articles/governance/` | ⚠️ Selectively | Publish `legal-structure`, `data-sovereignty`, `compliance`. **Exclude `risk-register` and `board-structure`** (commercially sensitive + "we haven't done this yet" gaps). |
| `articles/investors/` | ⚠️ Selectively | Publish `investor-categories`, `knockout-criteria`, `our-investment-needs` (educational). **Exclude `alignment-tool`, `investor-pipeline`, and the individual investor profile cards** (live state, scoring, commercially sensitive). |
| `articles/enterprise/` | ✅ Yes (once populated) | Durable diagnostic topic articles. |
| `raw/` | ❌ No | Immutable sources including signed agreements and private correspondence. |
| `outputs/` | ❌ No | Internal generated briefings. |

## Exclusion convention

Files flagged with `publish: false` in their frontmatter are **our** signal not to publish. Obsidian Publish does not read this automatically (you select via the UI); it's just a guardrail so nobody accidentally clicks "publish" on them later.

Already flagged:
- `articles/investors/investor-pipeline.md` (live pipeline state)
- `articles/investors/alignment-tool.md` (our internal scoring)
- `articles/governance/risk-register.md` (full risk picture + gaps)
- `articles/program/weekly-actions.md` (live operational state)

## Who to share with

Default trust level = "advisor / funder under informal NDA". Reasonable to share with:
- Jess Grebenschikoff, Sarah Gregory, Jay Boolkin (SIH + QBE program).
- Beck Parkinson and other selected advisors.
- Specific funders when we send them a pitch (Snow R4 contact, Mindaroo intro, PFI follow-up).
- ACT advisory group members.

Not suitable for:
- Open sharing on LinkedIn / press.
- Cohort peers (publish selectively, not wholesale).
- Funders before first contact (use the pitch deck first; wiki is follow-up depth).

## Keeping it fresh

Obsidian Publish republishes whatever you've marked as "published" each time you press the cloud icon. Discipline:
- Update `articles/program/key-dates.md` after each program event.
- Update investor profile cards (kept internal for now) as stages change.
- Rotate the site password quarterly or when an advisor relationship ends.

## When to graduate off Obsidian Publish

Move to the v2-gated `/wiki` route when:
- You need per-person access control (different content for Jess vs a prospective funder).
- You want branding on `goodsoncountry.com` for formal investor submissions (QBE Stage 2 data room).
- The wiki exceeds what Publish renders well (>500 notes or heavy media).

For 2026 this shouldn't happen. Publish is the right tool.

## Cost and cancellation

- $10 USD/month.
- Cancel anytime. When cancelled, the public site goes offline but your local vault is untouched.
- You can pause publishing by unpublishing all notes; keeps the subscription but takes the site dark.

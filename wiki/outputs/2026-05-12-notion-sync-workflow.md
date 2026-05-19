# Notion sync workflow for the Goods Cockpit

> **Date:** 2026-05-12. **Owner:** Ben. **Purpose:** Document the day-to-day workflow for keeping the Notion-side Goods Cockpit mirror in sync with the wiki source-of-truth.

## What this is

The Goods on Country Cockpit lives in Notion as a single navigation hub, with each `wiki/outputs/*.md` file mirrored as a Notion subpage. Source of truth is the Goods repo. Notion is read-only mirror; edits made in Notion are overwritten on next sync.

## Architecture

```
Notion: Goods. HQ (existing parent page)
  └── Goods on Country Cockpit (managed by sync script)
        ├── Centrecorp narrative fixes across internal funder docs
        ├── Eloise Hall: founding-director outreach draft + consent register
        ├── Financial model Day 1: Xero extraction + anchor reconciliation
        ├── Financial model Day 2: P&L summary v0.1 (Xero-verified)
        ├── Financial model Day 3: full expense reconciliation + founder time sensitivity
        ├── Financial model Day 4: Stretch Bed unit economics (v0.1)
        ├── Goods on Country financial model: scope and build plan
        ├── Financial model Week 1-2 kickoff: operational checklist
        ├── Impact page audit: aspirational-as-active metrics
        ├── /impact page Q&A walkthrough: human-eyes defence checklist
        ├── QBE prep resume: action stack reframed against SIH diagnostic + Butterfly transition
        ├── SIH Priority Advisory Project: formal acceptance email draft
        ├── Financial model Day 1: Xero extraction blocked, paths forward
        └── ... (one subpage per wiki output, by H1 title)
```

## Script location

`/Users/benknight/Code/act-global-infrastructure/scripts/sync-goods-wiki-to-notion.mjs`

Uses the existing `scripts/lib/notion-md-blocks.mjs` library (already battle-tested across the ACT cockpit-sync family).

## Commands

```bash
cd /Users/benknight/Code/act-global-infrastructure

# Refresh the Cockpit page only (after editing the cockpit .md):
node scripts/sync-goods-wiki-to-notion.mjs --cockpit

# Sync one new or updated wiki output as a Cockpit subpage:
node scripts/sync-goods-wiki-to-notion.mjs --file "/Users/benknight/Code/Goods Asset Register/wiki/outputs/2026-05-12-financial-model-day5.md"

# Full sync: Cockpit + every 2026-05-* file as subpages:
node scripts/sync-goods-wiki-to-notion.mjs --all

# Preview without writing (always do this first):
node scripts/sync-goods-wiki-to-notion.mjs --all --dry-run

# Sync from a worktree instead of the main Goods repo:
node scripts/sync-goods-wiki-to-notion.mjs --all --wiki-root "/Users/benknight/Code/Goods Asset Register/.claude/worktrees/stoic-ellis-cfca76"

# Override parent page (e.g. push to a different Notion page during testing):
node scripts/sync-goods-wiki-to-notion.mjs --cockpit --parent <notion-page-id>
```

## Workflow patterns

### Pattern 1: New wiki output, push it to Notion

```bash
# 1. Write the wiki doc in the Goods repo
# 2. Run a sync of that one file:
node scripts/sync-goods-wiki-to-notion.mjs --file "/Users/benknight/Code/Goods Asset Register/wiki/outputs/<new-file>.md"
# 3. Update the Cockpit index if it should reference the new doc:
#    Edit wiki/outputs/2026-05-12-goods-cockpit.md, add the entry, then:
node scripts/sync-goods-wiki-to-notion.mjs --cockpit
```

### Pattern 2: Daily refresh after a session

```bash
# Refresh everything: latest cockpit + all subpages
node scripts/sync-goods-wiki-to-notion.mjs --all
```

### Pattern 3: Sharing with someone outside the team

The Cockpit Notion page URL is shareable directly. Subpages are accessible from the Cockpit. Default Notion sharing rules apply: anyone with the page link who has the right workspace permissions can see it.

## Editing rules

- **Edit in the wiki, not in Notion.** Notion is a mirror. Direct Notion edits will be overwritten on next sync.
- **One H1 per file.** The script uses the first H1 as the Notion page title. If a file has multiple H1s, only the first is used as the page name.
- **No frontmatter required.** The script handles `---\n...\n---\n` YAML frontmatter (strips it) if present.
- **Tables, headings, bullets, quotes, dividers** all convert cleanly. Code blocks may need formatting attention; the lib doesn't yet handle them with full fidelity.

## Safety notes

- The script preserves child pages and child databases when clearing (per the `notion-md-blocks.mjs` safeguard that prevented the 17-page cascade-archive incident on 2026-05-06).
- The default parent is "Goods. HQ" (`177ebcf9-81cf-805f-b111-f407079f9794`). Override with `--parent` for testing.
- Rate limits: the script paces appends at 50 blocks per batch with a 120ms sleep. Full sync of ~1000 blocks takes ~3 minutes.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| "no such file or directory" on cockpit | Cockpit md not in expected wiki/outputs/ path | Pass `--wiki-root <path>` or move the file |
| "page X is archived/in_trash" | Trying to clear a deleted page | Restore in Notion, then re-sync |
| Title shows as filename instead of H1 | First line of file isn't `# Title` | Add an H1 at the top |
| Notion authentication error | `NOTION_TOKEN` stale | Refresh in `.env.local` |

## Cross-references

- Source: `/Users/benknight/Code/Goods Asset Register/wiki/outputs/`
- Script: `scripts/sync-goods-wiki-to-notion.mjs`
- Library: `scripts/lib/notion-md-blocks.mjs`
- Cockpit doc: `wiki/outputs/2026-05-12-goods-cockpit.md`
- AI-in-loop policy: `wiki/articles/governance/ai-human-in-loop-policy.md` (applies to all wiki content that goes to Notion)

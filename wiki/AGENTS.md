# Goods Wiki — Agent Schema

> Living knowledge base for **Goods on Country**, restructured April 2026 around the
> **QBE Catalysing Impact 2026** program and investment-readiness work.
> Follows Karpathy's LLM Knowledge Base pattern. Lightweight by design — we defer deep
> ACT ecosystem knowledge to the ACT Tractorpedia at
> `/Users/benknight/Code/act-global-infrastructure/wiki` (see `articles/linked-wikis.md`).

## What This Is

A personal/org knowledge base about Goods on Country — flat-pack washable beds, washing
machines, and On-Country manufacturing for remote Indigenous communities. It sits next to
the codebase (`v2/`) so agents can read and write it without leaving the project.

The 2026 restructure leans the wiki heavily toward **capital, investment, legal,
governance** topics because that is the operational frontier this year: the QBE Catalysing
Impact program requires us to raise $400K of matched capital by 31 August 2026.

## Folder Structure

```
wiki/
  AGENTS.md           (this file — conventions)
  index.md            (short root pointer)
  articles/           (compiled wiki, one .md per topic)
    INDEX.md          (full map with one-line per article)
    linked-wikis.md
    qbe-catalysing-impact-2026.md  (legacy single-file article, now supplemented by program/)
    capital/          (instruments, stacks, blended finance, catalytic capital)
    investors/        (one profile per funder/investor + alignment tool)
    governance/       (board, risk, policies, legal structure, compliance)
    program/          (QBE program structure, stages, deadlines, weekly actions)
    support-network/  (SIH, PIN, cohort peers, advisors, legal / accounting support)
    impact/           (story-selection lens, OCAP, theory of change, Empathy Ledger)
    products/         (Stretch Bed, washing machines, basket beds — cross-links to v2 source)
    communities/      (deployment partners, place-based relationships)
    enterprise/       (diagnostic topic briefs — mirror of thoughts/shared/qbe-program/diagnostic)
  raw/                (immutable source capture — never hand-edit)
  outputs/            (generated briefings and reports)
```

## Rules for the LLM

1. **Never edit `raw/` files.** Treat them as immutable sources.
2. **Every article starts with a one-paragraph summary** in a blockquote.
3. **Link related articles** with `[[slug]]` syntax (Obsidian-compatible).
   - Within a subfolder: `[[capital-types]]`.
   - Cross-folder: `[[investors/sefa]]`.
4. **Maintain `articles/INDEX.md`** as the full map — every article one line.
5. **Maintain each subfolder's `README.md`** as a mini-index for that topic cluster.
6. **When new raw sources arrive**, update relevant articles and add new ones.
7. **Cite sources** — articles reference `raw/<file>` at the bottom.
8. **Don't duplicate the ACT wiki.** Cross-link instead.
9. **Don't duplicate the v2 codebase.** For product specs, cross-link to `v2/src/lib/data/products.ts`.
10. **No em dashes.** Use colons, periods, parentheticals.
11. **Always "On-Country" / "On Country"** (capitalised — Country is a proper noun).

## Canonical Sources (don't duplicate, cross-reference)

- **Product specs** → `v2/src/lib/data/products.ts` (single source of truth)
- **Brand copy** → `v2/src/lib/data/content.ts`
- **Compendium data** → `v2/src/lib/data/compendium.ts` + `v2/docs/COMPENDIUM_MARCH_2026.md`
- **Impact model** → `v2/src/lib/data/impact-model.ts`
- **Live QBE operational state** → `v2/src/app/admin/qbe-program/page.tsx` and `/qbe-actions`
- **Diagnostic pack drafts** → `thoughts/shared/qbe-program/diagnostic/`
- **ACT Tractorpedia** → `/Users/benknight/Code/act-global-infrastructure/wiki/`
- **Empathy Ledger** → `/Users/benknight/Code/empathy-ledger-v2/`
- **Xero (finance)** → ACT-GD cost code (external, cite only)
- **Memory notes** → `~/.claude/projects/-Users-benknight-Code-Goods-Asset-Register/memory/`

## Focus Topics (post-restructure)

1. **QBE Catalysing Impact 2026 program** — cohort, stages, deadlines, PIN support.
2. **Capital & blended finance** — the 13 instruments, catalytic capital, stack design.
3. **Investors & funders** — per-entity profile cards, alignment scores, pipeline state.
4. **Governance & compliance** — board, risk, policies, legal structure, ACNC/ASIC.
5. **Impact infrastructure**: the story-selection lens, OCAP, Empathy Ledger integration.
6. **Support network** — Social Impact Hub, PIN, Mint Ellison legal, advisory group.
7. **Stretch Bed & washing machine** — product narrative that anchors investor conversations.
8. **Communities & deployments** — PICC, Oonchiumpa, Centrecorp, NPY, Homelands.
9. **Enterprise / diagnostic** — the 10 QBE-diagnostic topics as durable articles.

## How to Add Raw Sources

- **Emails:** `raw/YYYY-MM-DD-email-from-<sender>-<topic>.md`
- **Web clippings:** `raw/YYYY-MM-DD-article-<slug>.md`
- **Meeting notes:** `raw/YYYY-MM-DD-meeting-<topic>.md`
- **PDFs/docs:** keep original; if long, also produce a `-fulltext.md` companion for agent reasoning
- **Spreadsheets:** keep the xlsx; mirror structure in `articles/investors/alignment-tool.md` so it can be edited in Obsidian

## Compilation Command (for agents)

> "Read everything in `wiki/raw/`. Compile articles in `wiki/articles/` following the rules
> in `wiki/AGENTS.md`. Update `wiki/articles/INDEX.md` and each subfolder README. Link
> related topics with `[[slug]]`. Cite sources. Keep the QBE program as the organising
> thread for 2026."

## Cross-wiki relationship

This wiki specialises in operational Goods-on-Country content and the QBE program. The
**ACT Tractorpedia** (124+ articles) carries the ecosystem-wide context: LCAA method,
Beautiful Obsolescence, dual-entity ACT structure, PICC, Empathy Ledger architecture,
people profiles. Always cross-link rather than copy.

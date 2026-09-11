---
reviewed: 2026-09-12
ruling: Ben, 12 Sep 2026, the flat-pack route, with the four applications in flight
canon: [year.needs, year.asked, year.secured, year.gap]
sources: [wiki/articles/INDEX.md, wiki/articles/program/the-raise.md, wiki/articles/trade/README.md, wiki/articles/production/README.md, wiki/AGENTS.md, v2/src/lib/data/sheet-canon.ts]
---

# Goods on Country: Wiki

> Living knowledge base for Goods on Country. The front door is **[articles/program/the-raise.md](articles/program/the-raise.md)**: four applications in flight, the money in four lines, and what is blocking each one. The year needs $747,950, $600,000 is asked across five lines, $0 is secured and the gap is $147,950. QBE Catalysing Impact Stage 2 closes at noon on Friday 25 September 2026.

## Start here

1. [articles/program/the-raise.md](articles/program/the-raise.md): the raise in one page. Read this first.
2. [articles/program/where-the-raise-lives.md](articles/program/where-the-raise-lives.md): which surface holds which part, and which ones are sources.
3. [articles/capital/the-money-model.md](articles/capital/the-money-model.md): how one $750 price pays for the bed and funds the organisation.
4. [articles/capital/the-blockers.md](articles/capital/the-blockers.md): the ten things owed, with owners.
5. [articles/INDEX.md](articles/INDEX.md): the full map.

## The three clusters written on 12 September 2026

| Cluster | What it holds |
|---|---|
| [articles/program/](articles/program/) + [articles/capital/](articles/capital/) | The raise: four applications, the money model, the stack, the claim ceiling, the retirement register |
| [articles/trade/](articles/trade/) | What buyers have paid for, the price, facilitation, the shop, and the path from an enquiry to a delivered bed |
| [articles/production/](articles/production/) | The flat-pack route, what the line can make, the Defy supply clock, and what a funder sees |

## Topic folders

| Folder | Purpose |
|---|---|
| [articles/program/](articles/program/) | The raise, the QBE program, key dates |
| [articles/capital/](articles/capital/) | The money model, the stack, instruments, blended finance, catalytic capital |
| [articles/trade/](articles/trade/) | Invoices, price, freight, facilitation, the shop |
| [articles/production/](articles/production/) | The route, capacity, supply, the second press |
| [articles/investors/](articles/investors/) | One profile per funder + alignment tool + pipeline |
| [articles/governance/](articles/governance/) | The entity question, board, risk, policies, ACNC/ASIC |
| [articles/support-network/](articles/support-network/) | SIH, PIN, Mint Ellison, advisory group, cohort peers |
| [articles/impact/](articles/impact/) | Story-selection lens, OCAP, theory of change, Empathy Ledger |
| [articles/products/](articles/products/) | Stretch Bed, washing machines |
| [articles/communities/](articles/communities/) | Deployment partners (PICC, Oonchiumpa, NPY, Centrecorp) |
| [articles/enterprise/](articles/enterprise/) | 10 diagnostic topics as durable articles |

## The rules and the gates

- [AGENTS.md](AGENTS.md): conventions. Rules 12 to 15 are the contract: frontmatter on every article, figures cited by canon key, superseding is an edit, and a provisional figure says so in the sentence that prints it.
- `node tools/check-wiki-canon.mjs`: fails by name when a module moves under an article.
- `node tools/check-ai-tells.mjs <file>`: the writing rules, from the Wikipedia signs-of-AI-writing guide.

## Linked systems

| System | Path | What's there |
|---|---|---|
| Guarded modules | `../v2/src/lib/data/` | The core. Every settled figure, with its guards |
| ACT Tractorpedia | `../../act-global-infrastructure/wiki/` | 124+ articles across the ACT ecosystem |
| Empathy Ledger | `../../empathy-ledger-v2/` | Consented storytelling platform |
| Live admin dashboards | `../v2/src/app/admin/qbe-program/` + `/qbe-actions` | QBE operational state |
| Notion front door | Page `3d8ebcf981cf8128bd9aee918f49733f` | The raise, start here |
| Memory notes | `~/.claude/projects/-Users-benknight-Code-Goods-Asset-Register/memory/` | Session-level facts |

## Log

- **2026-04-09** Wiki scaffolded. QBE induction email added.
- **2026-04-16** Restructured around the QBE program. Nine topic folders, capital/investor/governance articles, CASE alignment tool.
- **2026-09-12** The raise, trade and production clusters written against the flat-pack route ruling and the four real application forms. Frontmatter and canon keys on every new article, with two gates over them.

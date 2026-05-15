# Secure Inventory Template

Use this template for a local-only secure inventory at `secure/SECURE-INVENTORY.md`.

Do not put secrets, private tokens, raw credentials, private household data, unapproved community stories, or sensitive Notion/Drive links in GitHub. The purpose is to record that an item exists, who owns it, where it is controlled, and whether Codex can access it.

## Status language

| Status | Meaning |
| --- | --- |
| Accessible | Codex or the team can open it now. |
| Needs access | The item exists, but access needs to be granted or restored. |
| Human-only | The item should only be reviewed by Ben, Nicholas or an approved person. |
| Needs packaging | The source exists but needs a safe summary, redaction or export before use. |
| Retired | Keep a record, but do not use it for current decisions. |

## Sensitivity language

| Level | Meaning |
| --- | --- |
| Public | Can be linked publicly. |
| Internal | OK for ACT/Goods internal review. |
| Partner-confidential | Only share with the named partner or approved reviewers. |
| Community-consent | Requires consent review before quoting, linking or showing media. |
| Secret | Credentials, private keys, tokens or data that should never be copied into notes. |

## Inventory table

| Item | Type | Owner | Canonical location | Access status | Sensitivity | What it proves / supports | Safe wiki or Notion summary | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Example: Xero Goods tagged costs | Finance export / live data | Finance owner | Xero / Supabase finance mirror | Needs access | Internal | Actual costs, revenue, receivables, payables | `wiki/articles/capital/cost-register.md` | Confirm export fields and reconcile categories. |
| Example: Community story video | Media / story evidence | Story owner | Drive / Descript / Empathy Ledger | Human-only | Community-consent | Product feedback, design evidence, impact story | Community page after consent review | Confirm consent, approved use level and caption. |

## Core secure item categories

- Finance: Xero exports, invoices, receipts, receivables, payables, payroll, GST, BAS, budgets and bank statements.
- Legal: company registration, trust/company documents, contracts, insurance, IP, licences, funding agreements and board/advisory terms.
- Data: Supabase credentials, service-role keys, CRM exports, household/product records, QR register data and raw story consent data.
- People: staff, contractor, community worker, youth participant and advisory records.
- Community stories: photos, videos, transcripts, names, quotes, consent status and withdrawal requests.
- Funders and investors: private pitch decks, diligence questions, term sheets, rejected/active applications and funder feedback.
- Procurement and CRM: HighLevel pipelines, buyer contacts, grant targets, government opportunities, partner notes and follow-up tasks.
- Production: supplier pricing, plant costs, equipment manuals, operating safety details, site plans and quality records.

## Rules

- Store the real inventory in `secure/SECURE-INVENTORY.md`, which is gitignored.
- Link to public or permissioned systems only where the access level is intentional.
- Use summaries in the wiki, not raw confidential documents.
- Mark unknowns plainly. Do not infer consent, ownership or shareability.
- If an item is secret, write where it is controlled and who owns it. Do not copy the secret value.

# Source Register

> The source register is the governed map behind the QBE working pack. It records what each source proves, where people can review it, where originals should live, who owns the next decision, and how it connects to operations, CRM and procurement.

## Operating Rules

- Repo/wiki remains the canonical structured working pack.
- Notion is the human review and workshop layer.
- Drive holds originals and permissioned attachments.
- Supabase is operational truth for live data.
- HighLevel/GHL is the follow-up engine after human approval.
- Sensitive story, household, asset or community data must not be pushed to Notion, Drive or GHL until consent and sharing rules are explicit.

## Working Register

The structured register is maintained inside the working wiki so the app can generate pages consistently. Readers should use this page, [[source-library]] and the individual source notes rather than trying to inspect internal files.

## Notion Review Workspace

The human review layer now sits under [QBE Working Pack - Connected Wiki](https://app.notion.com/p/353ebcf981cf81d5a925d7d452aa1a88).

| Notion page | Use |
|---|---|
| [Source Register](https://app.notion.com/p/353ebcf981cf81f3a7f5f730491c4173) | Human-readable source shelf and source ownership. |
| [Document Review Queue](https://app.notion.com/p/353ebcf981cf8167ad3ac634ac0ba343) | founder review of source notes before they become workshop material. |
| [Workshop Decisions](https://app.notion.com/p/353ebcf981cf81d6aacbc0debe510ec1) | Decisions made in the deep-dive workshop that need to be written back into the wiki. |
| [Evidence Gaps](https://app.notion.com/p/353ebcf981cf815b850ef6f29412d80b) | Missing proof, consent checks, source-quality checks and unverified claims. |
| [CRM / Procurement Follow-up](https://app.notion.com/p/353ebcf981cf816faf51d9717f06579a) | Approved buyer, funder, partner and procurement follow-up before any GHL push. |
| [Implementation Sequence](https://app.notion.com/p/353ebcf981cf81b8b4d0e995526b285a) | Ordered human-verification and build sequence for the connected wiki, Notion, Grantscope, Supabase and GHL system. |
| [Human Verification Sprint](https://app.notion.com/p/354ebcf981cf815b8c0edac5bd2ab0dc) | founder review checklist for truth, consent, status and shareability. |

## Capital And Procurement Loop

Use [[grantscope-capital-procurement-loop]] for the process that connects:

- Grantscope/CivicGraph opportunity matching,
- Goods Supabase operational evidence,
- Notion review and decision-making,
- Drive artifact packs,
- governance and consent gates,
- HighLevel/GHL follow-up after approval.

Notion mirror: [Grantscope Capital And Procurement Loop](https://app.notion.com/p/353ebcf981cf81548f97ca5c50136733).

## High-Value Sources

| Source | Review URL | Status | Sensitivity | Operational links |
|---|---|---|---|---|
| [[../sources/goods-strategy-pd]] | `/insiders/sources/goods-strategy-pd` | review-needed | internal | products, orders, crm_deals, GHL target tags |
| [[../sources/march-2026-compendium]] | `/insiders/sources/march-2026-compendium` | review-needed | internal | products, orders, stories, bed_journeys, crm_contacts, crm_deals |
| [[../sources/community-voices-from-the-ground]] | `/insiders/sources/community-voices-from-the-ground` | sensitive | consent-sensitive | stories, crm_contacts, no raw GHL push |
| [[../sources/production-facility-guide]] | `/insiders/sources/production-facility-guide` | review-needed | internal | production_shifts, production_inventory, production_journal |
| [[../sources/operations-handbook]] | `/insiders/sources/operations-handbook` | review-needed | internal | orders, products, crm_contacts, support workflows |
| [[../sources/community-essential-goods-tracking-model]] | `/insiders/sources/community-essential-goods-tracking-model` | review-needed | sensitive | assets, bed_journeys, usage_logs, alerts |
| [[../sources/procurement-strategy]] | `/insiders/sources/procurement-strategy` | review-needed | internal | crm_contacts, crm_deals, GHL buyer/capital/partner tags |
| [[../sources/catalysing-impact-application-draft]] | `/insiders/sources/catalysing-impact-application-draft` | review-needed | internal | crm_deals, capital follow-up |
| [[../sources/snow-pitch-feedback-reflections]] | `/insiders/sources/snow-pitch-feedback-reflections` | review-needed | sensitive | Snow investor profile and capital target follow-up |
| [[../sources/funding-journey]] | `/insiders/sources/funding-journey` | review-needed | internal | crm_deals, GHL capital target |
| [[../sources/grants-archive-index]] | `/insiders/sources/grants-archive-index` | review-needed | internal | crm_deals, GHL capital target |
| [[../sources/go-to-market-thousands-2026]] | `/insiders/sources/go-to-market-thousands-2026` | draft | internal | crm_deals, orders, production capacity |
| [[../sources/market-intelligence-2026]] | `/insiders/sources/market-intelligence-2026` | draft | internal | crm_contacts, crm_deals, target categories |
| [[../sources/canonical-product-data]] | `/insiders/sources/canonical-product-data` | approved-internal | internal | products, orders |
| [[../sources/impact-model-data]] | `/insiders/sources/impact-model-data` | review-needed | internal | operational metrics and possible measures |
| [[../sources/case-investor-alignment-tool]] | `/insiders/sources/case-investor-alignment-tool` | review-needed | internal | crm_deals, GHL capital target |
| [[../sources/qbe-actions-dashboard]] | `/insiders/sources/qbe-actions-dashboard` | internal | internal | approved follow-up actions only |
| [[../sources/qr-code-data]] | `/insiders/sources/qr-code-data` | sensitive | sensitive | assets, bed_journeys, usage_logs, alerts |

## Review Queues

### Move To Notion

- [[../sources/goods-strategy-pd]].
- [[../sources/march-2026-compendium]].
- [[../sources/community-voices-from-the-ground]] after consent review.
- [[../sources/production-facility-guide]].
- [[../sources/operations-handbook]].
- [[../sources/community-essential-goods-tracking-model]].
- [[../sources/procurement-strategy]].
- [[../sources/catalysing-impact-application-draft]].
- [[../sources/go-to-market-thousands-2026]].
- [[../sources/market-intelligence-2026]].

### Keep In Drive With Wiki Summary

- Signed agreements.
- Original PDFs.
- Pitch decks.
- Spreadsheets.
- Photos and videos.
- Funder letters.

### Do Not Share Raw

- Consent-sensitive story assets.
- Household or product-level QR/asset data.
- Internal GHL contacts and follow-up metadata.
- Unverified financial or procurement forecasts.

## Related

- [[source-library]]
- [[document-readiness]]
- [[workshop-evidence-map]]

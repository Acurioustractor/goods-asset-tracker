# QR Code Data

> Reviewable source page for QR and asset-tracking infrastructure. The raw data is not share-ready; the review version should show the system without exposing household-level details.

## Source Control

| Field | Value |
|---|---|
| Source type | Raw/local asset data and product ID infrastructure |
| Canonical edit location | Internal QR/asset register data; only redacted examples should be reviewer-facing |
| Web review URL | `/insiders/sources/qr-code-data` |
| Best Notion home | Goods HQ / data sovereignty review |
| Drive home | Redacted sample exports only |
| Owner | Data/product support review |
| Status | sensitive |
| Sensitivity | sensitive |
| Last reviewed | 2026-05-02 |

## What It Contains

- Product IDs and QR infrastructure.
- Asset tracking intent.
- Repair, feedback and lifecycle support pathways.

## Reviewable Substance

The QR data proves Goods is treating products as assets that can be checked, repaired and learned from after delivery. It should never be treated as a public dataset.

| Layer | What can be shown | What must stay protected |
|---|---|---|
| Product identity | Example product ID format and a redacted QR label. | Full raw QR batches and unreviewed asset files. |
| Lifecycle support | Example flow: scan, request support, record condition, trigger repair or follow-up. | Household identity, location precision and private contact data. |
| Impact evidence | Aggregated counts: in use, repair needed, replaced, retired, moved. | Individual household timelines unless consent is explicit. |
| Procurement evidence | Aggregate repair/replacement patterns and product survival evidence. | Raw event logs or person-linked usage records. |

## Redacted Mentor Example To Build

| Field | Safe sample |
|---|---|
| Product | Stretch Bed |
| Asset ID | Redacted sample format only |
| Place | Community-level, not household-level |
| Event | Delivery or check-in |
| Condition | Good / repair needed / replacement needed |
| Follow-up | Partner check-in or repair request |
| Evidence | Consent-cleared note or redacted photo |

## Sharing Rule

- Use QR data to show care, repair and lifecycle thinking.
- Do not export raw QR records to Notion, Drive, HighLevel/GHL or mentor packs.
- Use redacted examples until data-sovereignty and consent rules are explicit.

## Connected Evidence

| System | Connection |
|---|---|
| Wiki pages | [[community-essential-goods-tracking-model]], [[../governance/data-sovereignty]], [[../impact/metrics-tracked]] |
| Supabase | assets, bed_journeys, usage_logs, alerts, user_requests |
| HighLevel | support follow-up only when a person has opted into contact |
| Procurement | lifecycle evidence and avoided dumping after aggregation |

## Human Review

- Do not expose raw household, location or product data.
- Create redacted examples for mentors.
- Tie QR use to care and repair, not surveillance.

## Related

- [[community-essential-goods-tracking-model]]
- [[impact-model-data]]

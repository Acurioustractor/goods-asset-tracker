# Community Essential Goods Tracking Model

> Reviewable source page for the asset and lifecycle tracking model. It frames tracking as care, repair, feedback and procurement learning, not surveillance.

## Source Control

| Field | Value |
|---|---|
| Source type | Local markdown data model |
| Canonical edit location | Internal tracking model document; this page is the reviewable source note |
| Web review URL | `/insiders/sources/community-essential-goods-tracking-model` |
| Best Notion home | Goods HQ / QBE Working Pack / data sovereignty review |
| Drive home | Redacted examples only |
| Owner | founder review plus data sovereignty review |
| Status | review-needed |
| Sensitivity | sensitive |
| Last reviewed | 2026-05-02 |

## What It Contains

- Purpose and first principles for essential goods tracking.
- Product lanes and core entities: asset, lifecycle event, buyer/supplier and community need context.
- Minimum lifecycle fields for rough conditions and hard-internet environments.
- Estimates for installed base, failure pressure, waste pressure and procurement leakage.
- Product strategy uses and reporting outputs.

## Reviewable Substance

The tracking model is the spine for turning delivered goods into cared-for assets.

| Tracking concept | What it means | Why it matters |
|---|---|---|
| Asset | A bed, washer or future essential good with an identity. | Stops products disappearing after delivery. |
| Lifecycle event | A delivery, scan, check-in, repair, movement, replacement or disposal event. | Shows what happens after the photo or invoice. |
| Buyer/supplier context | Who paid, who supplied, who owns or manages the product. | Helps separate resident, funder, council, health and partner pathways. |
| Community need context | Why the item was needed and what household/community problem it supports. | Keeps product evidence connected to the social objective. |
| Minimum field set | Condition, serviceability, failure cause, outcome wanted, safety risk and observed date. | Makes repair and waste evidence practical. |

## Care, Not Surveillance

The purpose is to support people and products:

- repair what can be repaired,
- replace what must be replaced,
- learn what fails,
- avoid waste,
- understand true lifecycle cost,
- support procurement and funder evidence,
- let people give feedback without being monitored.

The model must not become household surveillance. Household-level data, raw QR logs, precise locations and story-linked records need consent and access rules before they are shared or used in CRM.

## Redacted Example To Build

The mentor pack needs one example that looks like this:

| Field | Example value |
|---|---|
| Product | Stretch Bed |
| Place | Community-level only |
| Status | In use |
| Condition | Good / repair needed / replacement needed |
| Event | Delivery, check-in, repair request or movement |
| Follow-up | Partner check-in, repair, pickup, replacement or no action |
| Evidence | Photo or note, consent-checked |

No names, household addresses or raw QR logs should be included in the example.

## Connected Evidence

| System | Connection |
|---|---|
| Wiki pages | [[../impact/metrics-tracked]], [[../governance/data-sovereignty]], [[../enterprise/06-process-and-technology]] |
| Supabase | assets, bed_journeys, usage_logs, alerts, orders, crm_contacts |
| HighLevel | only approved support or partner follow-up, never raw household tracking |
| Procurement | replacement cycles, repair evidence and avoided waste signals |

## Human Review

- Tighten privacy and Indigenous data sovereignty language.
- Define who can see, edit, withdraw or export data.
- Create redacted sample records before showing this externally.

## Related

- [[qr-code-data]]
- [[impact-model-data]]
- [[../governance/data-sovereignty]]

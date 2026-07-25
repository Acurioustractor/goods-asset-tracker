# Community system integrations and communications architecture

**Date:** 24 July 2026  
**Status:** Architecture recommendation based on the current Goods codebase, Empathy Ledger architecture, live HighLevel records and Notion search.

## Decision

Do not introduce another general-purpose database.

Build a small community-pathway domain inside the Goods database, use HighLevel as the relationship and communications engine, keep Empathy Ledger authoritative for story and consent, and keep Notion as a generated working view.

The integration model should be event-driven, but deliberately asymmetric:

- Goods can tell HighLevel that a relationship or pathway changed.
- HighLevel can tell Goods that contact, opportunity or communication activity changed.
- Empathy Ledger can tell Goods that approved content, visibility or consent changed.
- Goods can create or update a Notion working page.
- Notion does not write canonical community, consent or financial state back automatically.

## What exists now

### Goods

The codebase already has:

- a server-side HighLevel client;
- contact upsert and duplicate checks;
- buyer, capital and partner opportunity creation;
- a canonical tag layer;
- explicit newsletter-consent logic;
- an OCAP strip-guard intended to prevent automatic sends to community-line contacts;
- Goods buyer, demand and supporter pipelines;
- audience-segment definitions for HighLevel campaigns;
- daily Grantscope-to-HighLevel target sync;
- daily HighLevel-tag-to-Goods activity sync;
- Goods `crm_contacts`, `crm_notes` and `crm_deals`;
- a live HighLevel opportunity overlay in the People view;
- Empathy Ledger media references through `media_links`; and
- an Empathy Ledger enrichment sync.

### Empathy Ledger

Empathy Ledger already has the right concepts for:

- storyteller, story and media authority;
- consent change logs;
- syndication requests and per-site consent;
- approved Goods as a syndication site;
- webhook subscriptions and delivery logs;
- `content_updated`, `content_revoked`, `consent_approved` and `consent_denied` events; and
- immediate withdrawal of public and syndicated media.

The Goods site does not currently expose the matching Empathy Ledger webhook receiver. This is the most important missing real-time connection.

### Notion

Notion search shows multiple overlapping Shed pages:

- an organisation page;
- proposal and grant pages;
- imported email pages;
- several role-based contact pages; and
- duplicate coordinator pages created by previous reconciliation processes.

Notion contains valuable working history, but it is already too duplicated to become the operational source of truth.

### Live HighLevel

The live account has the correct high-level Goods pipelines:

- Goods Buyer Pipeline;
- Goods Demand Register;
- Goods Supporter Journey; and
- Grants.

It does not yet have a dedicated Community Capability Pathway pipeline.

The live Shed records are fragmented:

- no clean `Michelle Bates` contact was returned;
- one Xero organisation record is quarantined;
- separate secretary, treasurer, chair and coordinator contacts exist;
- several of those records already carry Goods, ACT and drip communication tags; and
- the Tennant Creek Youth Centre manager is now identified as Ade Rizal, but no verified matching email or HighLevel contact has yet been found.

ALIVE exists as a clean partner contact. Victoria Palmer and several Dusseldorp contacts exist, but many carry broad newsletter and drip tags.

## Material issues to fix before expanding automation

### 1. Consent evidence and send tags are out of alignment

The code says only explicit consent can mint `comms:goods-newsletter`, and community-line contacts should not be auto-enrolled. The live HighLevel data contains role-based Shed records and Dusseldorp records with multiple `comms:*` and drip tags, without visible consent provenance in the search result.

Action:

- pause new automated partner and community drips;
- audit every Goods `comms:*` contact for consent source, timestamp, policy version and capture surface;
- remove send tags where evidence cannot be established;
- retain identity and relationship tags;
- require a structured consent field before any workflow enrolment.

### 2. The newsletter route can report a false success

`POST /api/newsletter` currently returns:

> “You're subscribed! We'll keep you in the loop.”

This happens even when:

- the person did not provide newsletter consent;
- HighLevel is disabled or simulated; or
- the HighLevel write failed.

The backend correctly withholds send tags without consent, but the response tells the person they are subscribed. The forms also do not yet consistently render the required default-off consent checkbox.

Action:

- add the checkbox to every signup surface;
- require the consent statement and privacy link;
- return `lead_recorded` when no newsletter consent exists;
- return `subscribed` only after the HighLevel write succeeds and consent is stored;
- show an honest error if HighLevel fails;
- record consent timestamp, source and policy version.

### 3. The current HighLevel sync is polling and lossy

The daily activity sync:

- matches contacts only by email or unnormalised phone;
- logs the current tag set as a new activity;
- does not import real notes, calls, emails, appointments or opportunity changes;
- timestamps the event at sync time, not the original event time; and
- cannot reliably reverse a removed tag or revoked communication consent.

Action:

- replace activity polling with signed HighLevel webhooks;
- keep a daily reconciliation job only as a safety net;
- store HighLevel contact and opportunity IDs directly on canonical Goods records;
- normalise phone numbers;
- make event processing idempotent.

### 4. Goods lacks the pathway entities required by this model

The existing CRM tables describe people, notes and generic deals. They do not represent:

- one community aspiration;
- selected modules;
- module readiness;
- community authority and approvals;
- ownership decisions;
- complete-project costs;
- support requested from Goods; or
- the current next community-controlled decision.

These belong in Goods, not HighLevel or Notion.

## Minimum Goods data model

Use UUID primary keys and expose short stable human IDs such as `GOC-TC-001`.

### `community_places`

- `id`
- `slug`
- `name`
- `region`
- `state`
- `country_names`: community-verified only
- `status`

This is the place. It is not an organisation or a contact.

### `partner_organisations`

- `id`
- `legal_name`
- `trading_name`
- `abn`
- `organisation_type`
- `place_id`
- `website`
- `status`

### `organisation_contacts`

Join table between `crm_contacts` and `partner_organisations`:

- `contact_id`
- `organisation_id`
- `role_title`
- `is_primary`
- `authority_scope`
- `valid_from`
- `valid_to`

This removes the need for generic “chair” and “coordinator” people records.

### `community_pathways`

- `id`
- `human_id`
- `place_id`
- `lead_organisation_id`
- `title`
- `community_aspiration`
- `stage`
- `authority_status`
- `lead_contact_id`
- `goods_owner`
- `next_action`
- `next_action_owner`
- `next_action_due_at`
- `last_community_approved_at`
- `ghl_opportunity_id`
- `notion_page_id`
- `empathy_ledger_project_id`
- `public_case_study_slug`

Recommended stages:

`invited`, `listening`, `brief_review`, `modules_selected`, `readiness`, `costing`, `funding`, `agreement`, `delivery`, `operating`, `community_review`, `paused`, `closed`.

### `pathway_modules`

- `id`
- `pathway_id`
- `module_type`
- `status`
- `requested_support_level`
- `local_owner`
- `local_operator`
- `readiness`
- `dependencies`
- `review_at`

Module values should match the menu already defined in the pilot plan.

### `pathway_decisions`

- `id`
- `pathway_id`
- `decision_type`
- `decision`
- `status`
- `approved_by_contact_id`
- `approved_by_organisation_id`
- `approved_at`
- `evidence_url`
- `supersedes_decision_id`

Never infer approval from an email open, meeting attendance or HighLevel stage change.

### `pathway_cost_items`

- `id`
- `pathway_id`
- `module_id`
- `category`
- `description`
- `amount_cents`
- `basis`: `verified`, `quoted`, `estimated`, `modelled`, `unknown`
- `source_url`
- `valid_until`
- `funding_status`

### `external_record_links`

- `id`
- `entity_type`
- `entity_id`
- `system`
- `external_id`
- `external_url`
- `sync_direction`
- `last_synced_at`
- `last_sync_status`

This is safer than adding more provider-specific columns to every table.

### `integration_events`

- `id`
- `event_id`: unique provider event ID
- `source_system`
- `event_type`
- `subject_type`
- `subject_external_id`
- `occurred_at`
- `received_at`
- `payload`
- `signature_valid`
- `processing_status`
- `attempt_count`
- `last_error`
- `processed_at`

### `integration_outbox`

- `id`
- `event_type`
- `aggregate_type`
- `aggregate_id`
- `payload`
- `destination`
- `status`
- `attempt_count`
- `available_at`
- `delivered_at`

Write the business change and outbox event in one database transaction. A worker delivers it with retries.

### `communication_consents`

Keep marketing consent separate from story consent:

- `id`
- `contact_id`
- `channel`: `email`, `sms`, `phone`
- `purpose`: `goods_newsletter`, `investor_updates`, `partner_updates`
- `status`: `granted`, `withdrawn`, `unknown`
- `captured_at`
- `withdrawn_at`
- `capture_source`
- `policy_version`
- `evidence_url`
- `ghl_contact_id`

Empathy Ledger remains authoritative for story, image and syndication consent. This table is only for direct communications.

## Integration events

Use an event envelope:

```json
{
  "specversion": "1.0",
  "id": "provider-event-id",
  "source": "goods|ghl|empathy-ledger",
  "type": "community.pathway.stage_changed",
  "subject": "community_pathway/GOC-TC-001",
  "time": "2026-07-24T09:00:00Z",
  "data": {}
}
```

Every receiver must:

1. verify the HMAC signature;
2. reject stale timestamps;
3. insert the event ID with a unique constraint;
4. acknowledge duplicates safely;
5. process asynchronously;
6. retry with exponential backoff;
7. send repeated failures to a dead-letter view; and
8. avoid logging raw stories, consent detail or secrets.

## Webhooks to build

### HighLevel to Goods

Endpoint: `/api/webhooks/highlevel`

Subscribe to:

- contact create/update;
- tag or communication-consent change;
- opportunity create/update/stage change;
- note create;
- appointment create/update;
- inbound and outbound message status; and
- unsubscribe or do-not-disturb change.

What Goods stores:

- canonical contact link;
- opportunity stage and ID;
- activity metadata and original timestamp;
- next-action signals;
- communication consent or withdrawal.

What Goods does not store:

- a duplicate full inbox;
- community stories;
- sensitive message bodies unless a human deliberately promotes one into a note.

### Empathy Ledger to Goods

Endpoint: `/api/webhooks/empathy-ledger`

Subscribe to:

- consent approved;
- consent denied or revoked;
- content updated;
- content revoked;
- media visibility changed; and
- syndication approval changed.

On revocation:

- invalidate caches immediately;
- stop rendering the content;
- mark related public placements unavailable;
- create an internal review activity;
- never send an automated message to the storyteller.

### Goods to HighLevel

Send through the outbox when:

- a pathway is created;
- a primary relationship contact changes;
- a pathway stage changes;
- a next action is assigned or overdue;
- funding status changes;
- delivery starts or completes; and
- an approved investor update is ready.

Goods should create one HighLevel opportunity per pathway, not one opportunity per contact.

### Goods to Notion

Create or update one working page per pathway:

- approved “what we heard” statement;
- current modules;
- readiness gaps;
- actions;
- linked documents;
- budget snapshot; and
- decision log links.

Only mirror approved or working-safe fields. Do not place private youth details, story consent evidence or sensitive community governance notes in the shared page.

## HighLevel operating design

### Add one pipeline

**Goods Community Capability Pathway**

Stages:

1. Invited
2. Listening
3. Community brief for review
4. Modules selected
5. Readiness and costing
6. Funding pathway
7. Agreement
8. Delivery
9. Operating
10. Community review
11. Paused
12. Closed

This is a relationship and follow-up view. The stage is mirrored from Goods and cannot constitute community approval.

### Tags describe identity, not action

Use:

- `project:act-gd`
- `role:community-partner`
- `role:funder`
- `role:buyer`
- `place:tennant-creek`
- `pathway:goc-tc-001`
- `interest:community-production`
- `interest:youth-pathways`
- `source:community-conversation`

Do not make identity tags trigger sends.

### Communication enrolment remains explicit

Only purpose-specific tags may trigger sends:

- `comms:goods-newsletter`
- `comms:investor-update`
- `comms:partner-update`

Each requires a matching Goods `communication_consents` row.

Do not use a generic `comms:act-newsletter` tag as a shortcut across projects without explicit cross-project consent.

### Community lane

Community representatives should receive:

- personal follow-up tasks;
- call reminders;
- approval requests; and
- agreed project updates.

They should not enter generic nurture or investor workflows by default.

## Communication strategy

The model needs four distinct communication lanes.

### 1. Community and delivery partners

**Purpose:** listen, return decisions, coordinate and remain accountable.

**Voice:** direct, human, specific and non-promotional.

**Artifacts:**

- personal email or phone call;
- two-page “what we heard” PDF;
- action and decision summary;
- private project page;
- community-first evidence return.

**Cadence:** event-led, not newsletter-led.

Examples:

- after every important conversation: send back the record within two working days;
- monthly while active: short progress note;
- before anything public: explicit review request;
- after delivery: community report before funder report.

### 2. Active funders and investors

**Purpose:** show disciplined progress, risks, learning and use of capital.

**Voice:** evidence-led, transparent and commercially literate.

**Artifacts:**

- quarterly investor evidence note;
- pathway snapshots;
- verified unit economics;
- approved community case material;
- direct ask or decision required.

Structure every update:

1. what communities asked for;
2. what changed;
3. verified evidence;
4. unknowns and risks;
5. what capital unlocks;
6. the next decision.

Do not present community stories as proof of financial viability. Combine consented qualitative evidence with verified operations and costs.

### 3. Prospective funders and strategic supporters

**Purpose:** build understanding and invite a specific next step.

**Voice:** clear model first, case evidence second.

**Artifacts:**

- monthly or six-weekly field note;
- one pathway diagram;
- one approved story or image set;
- one concrete invitation.

Avoid a high-frequency drip. Use behaviour to suggest a personal follow-up task, not to automatically escalate claims or pressure.

### 4. Public supporters and buyers

**Purpose:** build trust, product understanding and broad participation.

**Voice:** warm and grounded.

**Newsletter shape:**

- one community-approved field note;
- one product or production update;
- one transparent number;
- one way to participate.

Recommended cadence: monthly at most until the content and approval process is reliable.

## Content pipeline

1. Community conversation creates a Goods activity.
2. Goods generates a draft “what we heard” record.
3. Community corrects and approves the operational statement.
4. Story or media remains in Empathy Ledger and is approved for a named audience.
5. Goods assembles a candidate artifact from verified operational data and approved story references.
6. A human selects the audience and reviews all claims.
7. HighLevel sends only to the matching consented segment.
8. Send and engagement metadata return to Goods.
9. Community partners receive the resulting artifact and evidence before or alongside external audiences.

## Recommended newsletter programme

Do not create one newsletter that tries to serve everyone.

Create three editorial products:

### Goods Field Notes

- Audience: explicitly opted-in public supporters and buyers.
- Cadence: monthly.
- Purpose: show the living work without turning communities into content.

### Partner Working Update

- Audience: active organisations and named operational contacts who agreed to receive it.
- Cadence: monthly during an active pathway.
- Purpose: decisions, dependencies and dates.
- Normally sent personally or in a very small segment.

### Investor Evidence Note

- Audience: active and prospective funders who explicitly agreed to investment updates.
- Cadence: quarterly, with targeted interim updates around decisions.
- Purpose: progress, economics, risk, evidence and ask.

Each product needs its own consent purpose, unsubscribe path and editorial approval checklist.

## Build order

### Phase 0: stop drift

- audit and reconcile the Shed, Dusseldorp, ALIVE and Youth Centre records;
- remove unsupported send tags;
- identify real people behind generic role records;
- preserve emails and history before merging;
- add Michelle and the Youth Centre only after identity details are confirmed;
- fix the newsletter response and consent checkbox.

### Phase 1: canonical pathway records

- add the Goods pathway tables;
- create Tennant Creek, Urapuntja, Oonchiumpa and Palm Island pathways;
- add stable external links;
- create the Community Capability Pathway pipeline in HighLevel;
- mirror the four pathway opportunities.

### Phase 2: reliable integrations

- build the integration event log and outbox;
- build signed HighLevel and Empathy Ledger webhook receivers;
- keep daily reconciliation jobs;
- add an integration-health admin view;
- test duplicate delivery, reordering, retries and consent revocation.

### Phase 3: communication operations

- establish the three editorial products;
- create consented HighLevel smart lists;
- create approval checklists;
- produce the Tennant Creek “what we heard” brief;
- test the complete community-first then investor-facing publication loop.

### Phase 4: scale carefully

- turn the pathway template into a reusable partner page;
- automate safe data assembly, not approval;
- add Urapuntja, Oonchiumpa and Palm Island;
- measure response quality, approval time and operational usefulness;
- expand only when the first pathway is functioning end to end.

## Success measures

- one canonical contact per person;
- one canonical organisation per legal entity;
- one HighLevel opportunity per Goods pathway;
- zero automated community sends without explicit purpose-specific consent;
- all public story placements withdraw within minutes of an Empathy Ledger revocation;
- every pathway has a current next action, owner and due date;
- every external claim can be traced to a source and approval;
- community receives its record before the funder artifact;
- newsletter status is never falsely reported;
- daily reconciliation reports no unexplained drift.

## Sources reviewed

- Goods HighLevel client and canonical tag contract.
- Goods newsletter API.
- Goods campaign types, audience segments and HighLevel sync jobs.
- Goods CRM database types and Empathy Ledger media alignment.
- Empathy Ledger consent, withdrawal, syndication and webhook structures.
- Live HighLevel contacts and pipelines, 24 July 2026.
- Notion search for Our Community Shed, 24 July 2026.
- `wiki/outputs/2026-07-24-community-capability-pilot-plan.md`
- `wiki/outputs/2026-07-24-michelle-shed-conversation-and-system.md`
- `wiki/canon/el-goods-alignment.md`

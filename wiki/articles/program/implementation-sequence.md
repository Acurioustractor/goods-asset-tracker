---
wide: true
---

# Implementation Sequence

> This is the working order for turning the QBE wiki, Notion review pages, Drive attachments, Goods Supabase, Grantscope/CivicGraph and HighLevel/GHL into one connected operating system. It starts with evidence because the CRM and opportunity pipeline are only useful when the claims behind them are true, current and safe to share.

## The Rule

Build from proof outward:

- First, prove the source exists and is in the right place.
- Then, verify what the source can safely say.
- Then, rebuild the QBE topic pages from that evidence.
- Then, let Grantscope/CivicGraph match outside opportunities to the evidence.
- Then, create artifact packs.
- Then, push approved follow-up to GHL.
- Finally, write outcomes back into the wiki, Notion and pipeline records.

Notion mirror: [Implementation Sequence - Connected Goods Wiki](https://app.notion.com/p/353ebcf981cf81b8b4d0e995526b285a).

## Sequence

| Step | Workstream | What happens | Human check |
|---|---|---|---|
| 1 | Source register | Every source gets a row showing what it proves, where it can be reviewed, where originals live, owner, status, sensitivity and related pages. | founder confirm the source exists, is current and belongs in the pack. |
| 2 | Source pages | Each source gets a readable wiki source page. Local paths, code files and raw folders are translated into human-readable evidence. | Confirm the summary is accurate and does not overclaim. |
| 3 | Drive originals | Original PDFs, decks, spreadsheets, photos, letters and signed documents are linked in Drive. Sensitive files stay permissioned. | Confirm which originals can be shared with mentors or funders. |
| 4 | Notion review | Review-ready source notes move into Notion as pages or cards for comments and decisions. | Mark each source as approved-internal, shareable, sensitive, retired or still review-needed. |
| 5 | QBE topic rebuild | The ten QBE topic pages are rebuilt from approved source pages and visible evidence. | Check whether each page stands up when founder are not in the room. |
| 6 | Live truth mapping | Supabase-backed facts are translated into aggregate, reviewable evidence. | Confirm no household, asset-level, contact or story data is exposed without consent. |
| 7 | Opportunity matching | Grantscope/CivicGraph finds grants, funders, procurement buyers, trusts, partners and relationship paths. | Treat every match as a signal, not a decision. |
| 8 | Opportunity review | Serious matches become Notion opportunity cards with evidence, gaps, risks, owner and recommended action. | Decide no-go, monitor, research, partner path, apply path or approved follow-up. |
| 9 | Artifact pack | Build the opportunity brief, evidence map, product sheet, budget, governance appendix and consent-safe proof page. | Confirm the pack fits the opportunity and does not bend Goods away from its philosophy. |
| 10 | GHL approval | Use dry-run first, then push only approved buyer, capital or partner follow-up to HighLevel/GHL. | Confirm contact, tag, pipeline, owner, next action and no raw sensitive data. |
| 11 | Outcome write-back | Record submitted, won, lost, monitor or next-action outcomes in Notion, wiki/source register, Grantscope decision memory and CRM/deal records. | Capture what changed and what should be reused next time. |

## Current Build Priorities

### Priority 1: Source Shelf

- Keep [[source-register]] aligned with the working source inventory.
- Make every source listed in [[source-library]] resolve to a real source page or an external Drive/Notion URL.
- Keep [[../sources/grants-archive-index]] in the register because finance and capital pages depend on it.
- Replace generic Notion queue links with per-source Notion pages as they are created.
- Add Drive URLs for original decks, PDFs, spreadsheets, photos and redacted examples.

### Priority 2: Human Verification Sprint

Run [[human-verification-sprint]] as a founder review session:

| Source cluster | Human questions |
|---|---|
| Strategy and compendium | Which numbers, dates, legal-structure statements and deployment figures are current? |
| Community voices | Which names, quotes, photos, places and story extracts have explicit consent for mentor use? |
| Production and operations | Does the documented production process match the current Stretch Bed, equipment and team roles? |
| Tracking and QR data | Who can view, edit, export or withdraw product, story, household or asset-linked data? |
| Funding and grants | Which amounts are received, submitted, pending, relationship-only or no longer live? |
| Product data | Are the code-backed specs approved for product sheets, buyer material and mentor pages? |
| Impact data | Which metrics are live today and which are future candidate metrics? |

### Priority 3: QBE Topic Rebuild

Rebuild in this order:

1. [[../enterprise/04-financial-management]] and [[../enterprise/10-investors-capital-raising]] together.
2. [[../enterprise/06-process-and-technology]].
3. [[../enterprise/07-governance-data-reporting]], [[../enterprise/08-people-and-organisation]] and [[../enterprise/09-legal-structure]] as one governance block.
4. [[../enterprise/05-strategic-planning-risk]].
5. Final polish on [[../enterprise/01-vision-and-ambition]], [[../enterprise/02-social-objective-impact]] and [[../enterprise/03-business-model]].

Each page should include:

- what is real now,
- what is being tested,
- what evidence supports it,
- what photos, stories, docs or dashboards show it,
- what claims are not ready yet,
- what founder need to decide.

### Priority 4: Grantscope/CivicScope Integration

Before relying on live opportunity matching:

- Verify or implement the Grantscope `/api/goods-workspace/data` endpoint expected by the Goods client.
- Confirm the returned sections match the Goods client: `summary`, `buyers`, `capital`, `communities` and `all`.
- Keep static outreach target seed data as seed data only, not live opportunity truth.
- Create a stable opportunity source reference so Notion, Grantscope and GHL all point to the same opportunity.

### Priority 5: Notion Opportunity Register

Create a Notion opportunity register or page set with:

- opportunity name,
- source system,
- opportunity type,
- current status,
- recommended role,
- fit score and reasons,
- deadline and amount signal,
- relationship owner,
- related Goods source pages,
- required artifacts,
- evidence gaps,
- governance and consent risks,
- next action,
- GHL approval status,
- outcome.

### Priority 6: GHL Handoff

Use the existing GHL patterns, but make one canonical approval path:

- dry-run first,
- review exact contact and organisation,
- review tags and target type,
- review pipeline and stage,
- review next action and owner,
- push only after human approval,
- write the result back to the opportunity record.

## Stop Conditions

Stop and ask for review when:

- a claim depends on unverified finance numbers,
- a quote, image, story or place detail lacks clear consent,
- a source is only a local path and has no reviewable page,
- a Grantscope match would pull Goods away from community ownership, repairability, washability or resident agency,
- a GHL push would expose private contact, story, household, QR or asset-level data.

## Related

- [[source-register]]
- [[source-library]]
- [[document-readiness]]
- [[workshop-evidence-map]]
- [[human-verification-sprint]]
- [[grantscope-capital-procurement-loop]]
- [[../sources/grants-archive-index]]

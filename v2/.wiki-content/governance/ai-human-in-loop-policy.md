# AI human-in-loop policy for external materials

> No document, page, or message representing Goods on Country, A Curious Tractor Pty Ltd, Goods on Country Pty Ltd, or The Butterfly Movement Ltd leaves the organisation unless a core team member has read it, understood it, edited it where needed, and could defend its contents in live Q&A. AI is a recall, structuring, and editing tool. AI is not an author of organisational claims.

## Why this policy exists

SIH's May 2026 diagnostic raised two specific concerns:

1. Pre-meeting materials presented aspirational metrics as currently active.
2. Verbal articulation by founders was richer and more compelling than the written collateral.

The risk: AI-assisted content production is fast enough to outpace the founders' ability to audit it, which produces documents that look polished but cannot survive a 15-minute funder conversation.

SIH's direct ask (Diagnostic Report p.8):

> "GOC needs to ensure there is a human in the review loop for all AI-generated documentation and communications to SIH and funders. No documents should be shared for another party to review unless they have been audited, understood and, if needed, edited by a core member of the GOC team who can participate in detailed Q&A and stress-testing around their contents."

This article makes that policy explicit and durable.

## Scope

Applies to **all external-facing materials** produced by or on behalf of:

- Goods on Country (current and proposed Pty Ltd)
- A Curious Tractor Pty Ltd
- The Butterfly Movement Ltd (post-transition charitable home)
- Any community-led production entity carrying the Goods on Country brand

External materials include:

- Investor decks, briefings, EOIs
- Funder applications and reports
- ACNC, ASIC, ATO filings
- Board papers presented to non-team directors
- Public website pages and printed collateral
- Social posts on official channels
- Email replies to investors, funders, journalists, government
- Charity transition documents (e.g. the Butterfly proposal)

Does **not** apply to: internal Notion/wiki drafts, working documents inside the team, code comments, exploratory analysis.

## The rule

A core team member must, before send:

1. **Read** the document end to end.
2. **Verify** every numeric claim against its source (`v2/src/lib/data/`, Supabase, Xero, Empathy Ledger, or a cited external source). If a number is a forecast or estimate, the document must label it as such.
3. **Understand** every causal or impact claim well enough to answer "where does that come from?" without notes.
4. **Edit** anything that an LLM might have over-confidently asserted, especially: scale ("at 1,500 beds/year"), permanence ("we have"), capability ("we do") where the truth is closer to "we plan to" or "we are piloting".
5. **Sign off** by recording the reviewer's name and date in the document or its commit message.

## What AI is for, and what it is not for

| AI is good at | AI is not the author of |
|---|---|
| Summarising long documents | Founder narrative or lived experience |
| Structuring outlines | Impact claims |
| Editing for tone, grammar, brevity | Cost or unit-economics assertions |
| Drafting from verified facts | Anything we have not yet built or shipped |
| Recalling our own past decisions | Cultural or community-voice content |
| Cross-checking numeric consistency | Promises to investors or funders |

The test: if a reviewer asks "where did this come from?", the answer should be a person, a source document, a database query, or a verified prior claim. The answer should never be "the model wrote it."

## Application to community and cultural content

This policy is strictest for content that touches Indigenous communities, storytellers, Elders, or cultural protocols.

- Direct community voices must be quoted from named source (Empathy Ledger or signed consent) and confirmed not subject to retraction or `consent_withdrawn_at`.
- AI is not permitted to paraphrase community voices into hypothetical quotes.
- AI is not permitted to generate "community-style" narrative voice in our materials.
- Any AI-assisted rewrite of community-related content requires the reviewer to be Ben or Nic, not a contractor or volunteer.

## Application to the Butterfly transition

The proposal to transition The Butterfly Movement Ltd into the Goods on Country charitable home will produce a sequence of documents going to current Butterfly directors, members, ACNC, ASIC, and legal advisors. Every one of those documents:

- Must be reviewed under this policy.
- Must accurately state the current legal state (proposal, subject to due diligence) and not present a proposed structure as a completed one.
- Must accurately describe founding directors (Kristy Bloomfield, Nic Marchesi, Ben Knight, Eloise Hall) only after their consent is on record.
- Must reference Goods on Country's actual current entity (A Curious Tractor Pty Ltd, incorporated week of 28 April 2026), not a future Goods on Country Pty Ltd that does not yet exist.

## Provenance tags in our materials

Where a document includes data, the data must carry a provenance tag inline or in a footer. Adopt the five-level system from the impact-model rewrite:

- **Verified** — queried the source directly (cite table/API).
- **Modelled** — computed from verified inputs and explicit assumptions.
- **Partial** — measured at small N or single site.
- **Estimated** — qualified manual estimate.
- **Design target** — design target, not yet measured.

Source: `~/.claude/rules/verification.md` (global) and the [[../impact/README]] dimension definitions.

## Workflow practice

For high-stakes documents (investor decks, funder applications, board papers, charity transition documents), add a final "verify before send" pass:

1. Open the document.
2. Read each claim aloud.
3. For each claim: source? Provenance level? Could I defend this in Q&A?
4. If any answer is uncertain, edit or remove.
5. Record reviewer name and date.

For routine documents (replies, social posts), the standard is lower but the principle holds: read it, own it, send it.

## What this policy is not

- Not a ban on AI assistance. AI editing, structuring, and recall are how the team works efficiently.
- Not a requirement to disclose AI use to external parties (that is a separate conversation per recipient).
- Not a slowdown for internal exploration. Internal drafts move at AI speed; external sends move at human-verification speed.

## Failure modes this policy prevents

1. **Aspirational-as-active**: AI uses present tense for things that are planned. Reviewer catches it. (The /impact page failure SIH flagged.)
2. **Scale assumption creep**: AI references "at 1,500 beds/year" as if it is the current rate, not a target. Reviewer catches it.
3. **Capability inflation**: AI describes a piloted capability as a deployed one. Reviewer catches it.
4. **Stale data**: AI quotes a number that was true in February but is now out of date. Reviewer catches it.
5. **Cultural voice misuse**: AI generates a community-style quote or sentiment without a real source. Reviewer catches it.

## Review and revision

This policy is reviewed every six months, or whenever an incident occurs where an external party identifies a factual issue in our materials. Owner: Ben.

## Related

- [[risk-register]] — capture content-accuracy risk under operational risk
- [[data-sovereignty]] — community content protocols
- [[../brand-comms/README]] (forthcoming) — brand voice rules and lint tooling
- Diagnostic Report May 2026, item 6 (Process and Technology Maturity)
- `~/.claude/rules/verification.md` — global confidence-level rules

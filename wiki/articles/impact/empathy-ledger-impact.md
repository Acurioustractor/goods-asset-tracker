# Empathy Ledger (as Goods impact infrastructure)

> Empathy Ledger is ACT's consent-first storytelling platform. For Goods it is the impact-measurement backbone. 33 Goods-connected storytellers, all with active consent. Auto-sync daily.

## What it does for Goods

- Captures community voice with explicit, renewable consent.
- Every story has an owner (the storyteller). One-click withdrawal cascades.
- OCAP-compliant architecture.
- Elder review workflow for sensitive content.
- Trigger warnings.
- Syndication controls (storyteller decides where the story flows).

## Technical hooks

- API: `https://empathy-ledger-v2.vercel.app`
- Project code: `goods-on-country`
- Project ID: `6bd47c8a-e676-456f-aa25-ddcbb5a31047`
- Aggregated project code: `goods-on-country` returns ~18 stories (Goods + PICC + BG Fit etc).
- Client integration: `v2/src/lib/empathy-ledger/client.ts`, types: `v2/src/lib/empathy-ledger/types.ts`.
- Consent filtering: `consent_withdrawn_at`, `is_archived`, `syndication_enabled` applied everywhere.
- Cron: `/api/cron/el-sync` daily.

## Why this differentiates Goods as an investee

Most social enterprises extract stories for fundraising and never give them back. Our architecture reverses that. In QBE Stage 2 terms:
- "Demonstration of your impact (Impact Measurement Report, demographics)". Empathy Ledger-sourced, consented.
- Governance of story use is a board-grade control, not a marketing choice.
- Risk of inappropriate use of community voice (R1 in [[../governance/risk-register]]) is structurally managed, not just policy-managed.

## Source / cross-link

Empathy Ledger v2 repo: `/Users/benknight/Code/empathy-ledger-v2/`
ACT wiki: `act-global-infrastructure/wiki/concepts/consent-as-infrastructure.md`

## Related

- [[alma-framework]]
- [[../governance/data-sovereignty]]

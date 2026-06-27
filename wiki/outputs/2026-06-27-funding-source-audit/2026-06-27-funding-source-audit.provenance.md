# Provenance: Expanded Funding-Source Audit (2026-06-27)

> Sidecar for `00-expanded-source-list.md` and `sources.json`.

## How this was produced
A multi-agent workflow (goods-funding-source-audit, run wf_483eebff-7c8): 10 web-research agents (one per funding category) plus 1 synthesis agent. 11 agents, ~152 tool calls, ~552K tokens, ~8 min. Each research agent had the Goods fit profile plus the key gates (First-Nations-ownership, repayable-preferred, no-equity, 31 Aug window) and the list of 34 already-known sources to exclude, so every source here is net-new versus the existing Master Funder Register (2026-06-20-qbe-funder-landscape/00-MASTER).

## What the numbers mean
- 125 new deduped sources. By type: 4 repayable-loan, 7 concessional-debt, 10 blended, 80 grant, 24 connector. By category: networks 18, state-gov 17, corporate-foundations 16, philanthropy-remote 13, thematic 13, federal 12, indigenous-finance 11, blended/PRI 10, impact-debt 8, community-foundations 7.
- 72 carry no ownership gate; 12 are repayable AND ungated (the highest-value cluster for Goods today).

## Confidence is AGENT self-assessment, NOT independent verification
- verified (81) means a research agent found and cited a live source URL. It does NOT mean eligibility, cheque size, current round, or a 31 Aug timeline are confirmed for Goods.
- likely (37) means found but a detail is inferred.
- unverified (7) means a single weak signal; confirm before chasing.
- Every source must be re-checked against its URL before outreach. Treat this as a qualified lead list, not a verified register.

## Known gaps / not yet done
- The GrantScope DB (148K+ records, project bhwyqqbovcjoefezgfnq) was deliberately NOT queried by the workflow (credentials plus wrong-project risk). That mine is a separate follow-up to dedupe in.
- Several top picks need a state facility hook (QLD CEIP, Green Industries SA, WA WasteSorted, NT concessional loans) and several Indigenous lines need the 51% ownership decision (flagged per-source).
- Not yet integrated into the Notion data room or the artifact register.

## Voice / claim discipline
Report written no-em-dash, straight quotes. No Goods figures were introduced beyond the canon profile fed to the agents. Source-specific figures are the agents findings, labelled by confidence.

## Update: GrantScope mine DONE (2026-06-27)
Queried the shared GrantScope DB (grant_opportunities, 25,544 rows) read-only via REST, filtered by the pre-computed goods_relevance_score >= 60 (68 grants), deduped vs the 125 + 34. Result: 56 new providers (45 open) + 12 known-funder specific grants. See 01-grantscope-mine.md and grantscope-sources.json. The 148K figure refers to the wider gs_entities graph; the funding-relevant tables are grant_opportunities + foundations. goods_relevance_score is a pre-existing model score, not a Ben verification; accepts_pty_ltd and dgr_required are the deciding eligibility fields. Re-check each grant page before chasing.

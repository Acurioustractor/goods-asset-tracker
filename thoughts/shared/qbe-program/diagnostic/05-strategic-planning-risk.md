# 5. Strategic Planning and Risk Management

> Is there a clearly defined strategic planning process and risk management process?

## Strategic planning process

**Current rhythm:**
- **Annual strategy PD refresh** (current version: January 2026, v1.0). Document lives at `v2/docs/GOODS_STRATEGY_PD.md` and is the live strategic artefact.
- **Quarterly review** with advisory group.
- **Weekly operational action tracking** via live admin dashboards (`v2/src/app/admin/qbe-actions/page.tsx`, `v2/src/app/admin/qbe-program/page.tsx`).
- **Monthly ACT-level leadership check-ins** (Ben + Nick).

**Operating methodology: LCAA.** ACT's strategic method is not a linear roadmap. It is a practice loop: Listen, Curiosity, Action, Art. Every initiative moves through the cycle. "Art" returns you to "Listen." The discipline is staying honest about where you actually are rather than forcing forward motion when the listening is not done. Full description at `act-global-infrastructure/wiki/concepts/lcaa-method.md`.

**Why this matters for planning:** we plan in directional arcs, not Gantt charts. We commit to outcomes (community ownership of plant, revenue milestones, impact thresholds) and stay flexible on path. This is a feature when working with remote community partners and a weakness when dealing with funders who want quarterly deliverables; we flex by producing both views.

## Risk register (working draft)

This is an honest working view. A formal risk register on a board-grade template has not yet been adopted; we are including below what we actively track.

### Strategic risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| S1 | QBE match-funding target ($400K) not met by 31 Aug 2026 | Medium | High | Multiple capital sources in parallel (SEFA debt, PFI repayable, Snow R4, Mindaroo catalytic); LOI template + conditional commitments |
| S2 | Community partner disengagement at a key site | Low | High | Deep LCAA-based relationship work, multiple partner depth at each site, no single point of failure |
| S3 | Mission drift under commercial pressure | Medium | High | 40% community profit share is non-negotiable; ACT dual-entity structure insulates mission |

### Operational risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| O1 | Production delays | Medium | High | Buffer stock, multiple suppliers, Zinus industry advisor |
| O2 | Transport costs to remote communities | High | Medium | Containerised On-Country production is the long-term answer |
| O3 | Quality issues / product returns | Low | High | Field testing program, feedback loops via Empathy Ledger, 5-year warranty |
| O4 | Key person risk (Ben and Nick) | High | High | Advisory group, ACT shared services, documented processes (Operations Handbook) |

### Financial risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| F1 | Cashflow gap (Tennant Creek $36K + general working capital) | High (current) | Medium | SEFA working capital loan conversation opening; grant bridging in interim |
| F2 | Grant dependency | High | High | Diversify to debt + catalytic + earned revenue (this is the QBE program thesis) |
| F3 | Debt servicing if volume misses | Low-Med | High | Stress-tested unit economics; only take debt aligned to confirmed contracts |

### Reputational / cultural risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Inappropriate use of community voice / story | Low | Very High | Empathy Ledger consent-first architecture; OCAP principles; Fred Campbell cultural consultation |
| R2 | Perceived savior framing in external comms | Medium | High | Brand voice guide (ACT); explicit "not a First Nations organisation" positioning; Indigenous co-design in every public narrative |
| R3 | Data sovereignty breach | Low | Very High | Empathy Ledger architecture (see diagnostic topic 6) |

### Compliance / legal risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| L1 | Product liability (injury from bed failure) | Low | High | Australian Standards testing, 200kg capacity verified, 5-year warranty, public liability insurance (QBE-held) |
| L2 | Worker safety in community production | Medium | Medium | Training, supervision, SOPs (Production Facility Guide), WHS framework |
| L3 | Tax / structuring (trading vs charitable) | Low | Medium | ACT dual-entity structure; Mint Ellison consulted via QBE program |

## Gaps we are honest about

- **No formal risk register document on a standard template.** We plan to adopt one during this program (PIN / SIH templates welcome).
- **No formal board-level risk oversight cadence** (linked to governance topic 7).
- **Scenario planning is light.** We plan the base case and a downside on capital raise; full scenario set not modelled.

## Scenario / contingency thinking

**Downside scenario (QBE match miss):** raise falls short of $400K. Response: retrench to Queensland + NT only, defer Circuit 2 plant, extend grant runway, delay washing machine commercialisation. Enterprise survives; growth compresses.

**Upside scenario (over-raise):** match hits $400K+ with excess interest. Response: accelerate Circuit 2, bring forward PICC ownership transition, open Pacific Islands conversation.

## Source documents

- Strategy PD Part 13 (Risks): `v2/docs/GOODS_STRATEGY_PD.md`
- LCAA method: `act-global-infrastructure/wiki/concepts/lcaa-method.md`
- QBE live admin dashboards: `v2/src/app/admin/qbe-program/page.tsx` and `/qbe-actions`
- Session 1 learnings (capital stack): `thoughts/shared/qbe-program/session-1-learnings.md`

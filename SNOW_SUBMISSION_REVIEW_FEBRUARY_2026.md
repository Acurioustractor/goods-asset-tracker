# Snow Foundation Submission Review
**Date:** February 2026
**Reviewed by:** AI Assistant (at Ben/Nic's request)
**Documents reviewed:** Snow proposal, Sally's feedback, Codebase documentation, Oonchiumpa warehouse options

---

## Executive Summary

The Snow Foundation submission is **strong and well-aligned** with both Snow's First Nations Principles and the documented evidence in the codebase. However, there are several areas requiring attention based on Sally's feedback and some minor discrepancies to resolve.

**Key Actions Required:**
1. Remove Deadly Heart Trek reference; relocate "Do No Harm" principle
2. Significantly expand the Risks & Mitigations section
3. Separate into attachment format for ease of sharing
4. Consider incorporating Oonchiumpa warehouse partnership as a concrete location strategy
5. Review funding opportunities Sally flagged (Minderoo, SEDI, Giant Leap, etc.)

---

## Part 1: Alignment Check - Submission vs Codebase

### Numbers Verification

| Claim in Submission | Codebase Evidence | Status |
|---------------------|-------------------|--------|
| 369+ beds delivered | Catalysing Impact doc: "369+ beds" | ✓ Aligned |
| 200-350 bed requests | Multiple docs confirm this figure | ✓ Aligned |
| 15-20 stretch beds deployed | Compendium: "15-20 stretch beds with ~8 families" | ✓ Aligned |
| 5 washing machines deployed | Strategy doc: "5 units in Tennant Creek" | ✓ Aligned |
| $550-650 production cost | Multiple sources confirm | ✓ Aligned |
| 25kg plastic per bed | Consistent across documents | ✓ Aligned |
| $193,785 from Snow to date | Compendium funding table confirms | ✓ Aligned |
| $100,000 invested in production facility | Multiple sources confirm (TFN + ACT) | ✓ Aligned |

**Minor Discrepancy Noted:**
- Strategy doc (GOODS_STRATEGY_PD.md) shows "140+ beds constructed" and "389 assets tracked"
- Catalysing Impact Application shows "369+ beds"
- The asset CSV shows individual bed entries across communities

**Recommendation:** Clarify whether 369+ refers to total beds ever made (including pilot versions) vs. beds currently in active use/tracking. The 389 figure likely includes all asset types (beds + washing machines + prototypes).

### Community Voices - Well Documented

The submission draws from extensively documented community voices in the codebase:
- **15 storytellers across 6 communities** documented in "Community Voices from the Ground"
- Quotes from Diane Stokes, Norm Frank, Ivy, Alfred Johnson, etc. are all verified
- Demand evidence (Utopian homelands, Homeland Schools Company, Groote Archipelago) all documented

### Partnership Claims - Verified

| Partner | Documented in Codebase | Notes |
|---------|------------------------|-------|
| Oonchiumpa Bloomfield Family | ✓ Yes (multiple docs) | Key production partner |
| Tennant Creek Community Shed | ✓ Yes | Potential host for shredding |
| Red Dust Robotics | ✓ Yes | Advisory relationship |
| NPY Women's Council | ✓ Yes | Angela Lynch contact |
| Centre of Appropriate Technology | ✓ Yes | Potential partner |

---

## Part 2: Addressing Sally's Feedback

### 1. Remove Deadly Heart Trek Reference

**Sally's request:** "Please take out the reference to the Deadly Heart Trek – include the Do No harm principle elsewhere"

**Current state:** The submission has a section titled "Deadly Heart Trek Cultural Priorities Alignment" with four principles including "Do no harm"

**Action Required:**
- Remove the "Deadly Heart Trek Cultural Priorities Alignment" section entirely
- Integrate the "Do No Harm" principle into the existing Snow Foundation Principles alignment (perhaps under Section 6: Evidence-Based & Culturally Safe Programs, or as a separate section on "Ethical Practice Commitments")

**Suggested revision - Add to Section 6:**

> **Do No Harm Commitment:**
> ACT takes a measured scale-up approach, testing extensively before mass production. We acknowledge when things aren't ready (e.g., washing/sanitising solution still in development). Our philosophy is to leave production assets, skills, and revenue-generating capacity - not just consumable products. We ask: "What footprints are we leaving?"

### 2. Flesh Out Risks & Mitigations

**Sally's request:** "Please flesh out the risks a bit more (think about concerns that have been raised to date by us – waste, demand for the plant, payment first, key learnings?) and mitigations"

**Current state:** The "Risk Management and Testing Strategy" section is brief and focused mainly on testing approach, not comprehensive risk management.

**Evidence from Codebase - Risks to Include:**

From GOODS_STRATEGY_PD.md:
| Risk | Likelihood | Impact |
|------|------------|--------|
| Production delays | Medium | High |
| Transport costs | High | Medium |
| Community engagement | Low | High |
| Funding gaps | Medium | High |
| Quality issues | Low | High |

**Additional Risks to Address (from Sally's concerns and codebase):**

**a) Waste/Circular Economy Risk:**
- *Risk:* Plastic waste collection may not yield sufficient quality/quantity materials
- *Risk:* End-of-life for Goods products - do they also end up in landfill?
- *Mitigation:* Products designed for 10+ year lifespan; fully repairable; same production facility can recycle old beds

**b) Demand for Production Plant:**
- *Risk:* Communities may not have capacity/interest to host and operate plant
- *Risk:* Skills gap in communities for manufacturing roles
- *Mitigation:* Orange Sky-inspired model (ACT builds, local orgs staff); already have interest from Palm Island Community Company ("we'll buy it"); tiered payment structures for different roles

**c) Payment First / Financial Sustainability:**
- *Risk:* Current model generates no margin ("funds come in, products go out")
- *Risk:* Dependence on philanthropy with challenging funding landscape (2024 was difficult)
- *Mitigation:* Building toward 1,000-bed inventory; exploring social impact loans; pricing strategy (Wholesale $600, Retail $850-1,200); QIC corporate engagement demonstrates commercial viability

**d) Key Learnings/Product Iteration:**
- *Risk:* Scaling before sufficient field testing (currently 15-20 stretch beds)
- *Risk:* Previous bed designs had issues (foam component couldn't be washed properly)
- *Mitigation:* Targeting "few hundred beds for robust feedback before scaling to 5,000+ units"; V4 design informed by 140+ field deployments; dedicated outdoor testing (6+ weeks exposure)

**e) Partnership Formalisation:**
- *Risk:* Deep relationships ("far greater than any piece of paper") but limited formal agreements
- *Risk:* Unclear governance as project scales
- *Mitigation:* Open to formalising agreements; co-creating template with Snow Foundation; tiered payment structures being developed

**Suggested New Section:**

```markdown
### Comprehensive Risk Management

| Risk Category | Specific Risk | Likelihood | Impact | Mitigation Strategy |
|---------------|---------------|------------|--------|---------------------|
| **Circular Economy** | Insufficient plastic waste quality/quantity | Medium | Medium | Multiple community collection points; quality sorting protocols; buffer stock |
| **Circular Economy** | Goods products end up in landfill | Low | High | 10+ year design lifespan; fully repairable; recycling pathway via same facility |
| **Production Demand** | Communities lack capacity to host plant | Medium | High | Orange Sky model (ACT builds, local orgs operate); multiple interested hosts (Palm Island, Tennant Creek Shed) |
| **Production Demand** | Skills gap for manufacturing | Medium | Medium | Training programs included in deployment; tiered roles from collection to assembly |
| **Financial** | Zero-margin product delivery | High | High | Building inventory for commercial sales; social impact loan exploration; corporate engagement (QIC) |
| **Financial** | Philanthropy dependence | Medium | High | Diversified funding sources; revenue focus; asset-based model (plant has resale value) |
| **Product** | Scaling before adequate testing | Medium | High | Minimum 200-300 beds deployed before major scale-up; V4 informed by 140+ deployments |
| **Product** | Design issues discovered at scale | Low | High | Iterative co-design; continuous community feedback loops; repairable design allows fixes |
| **Partnership** | Informal governance structures | Medium | Medium | Developing formal agreements; Snow Foundation co-creating template; tiered payment structures |
| **Logistics** | Transport costs to remote communities | High | Medium | Local production model reduces freight; containerised facility enables circuit deployment |

**Key Learnings Applied:**
1. **Foam removal:** Community feedback on Basket Beds led to stretch bed design with washable tension-weave surface
2. **Simplification:** Washing machines reduced to ONE button after community said "we don't know what all these buttons mean"
3. **Payment structures:** Developing tiered rates for different roles (cultural consultation vs. program delivery vs. workforce)
4. **Testing patience:** Resisting pressure to scale before robust field data
```

### 3. Additional Funding Sources

**Sally's suggestions to investigate:**

| Funder | Type | Alignment | Action |
|--------|------|-----------|--------|
| **Minderoo Foundation** | Philanthropy | Strong | Already in comms (Lucy Stronach - 20 communications noted in Strategy doc) |
| **SEDI** | Government | Strong | Social enterprise development - good fit |
| **SELF** | Loan | Strong | Social enterprise loans - complements SEFA discussions |
| **Australian Communities Foundation** | Pooled giving | Medium | Impact Fund pathway |
| **Future Fund (ABC Foundation)** | Indigenous economic | Strong | On-country economic empowerment focus |
| **First Nations Business Acceleration** | Government | Strong | QLD program for scaling Indigenous businesses |
| **NTRAI** | Government | Strong | NT Aboriginal investment - perfect geography |
| **Giant Leap** | Impact VC | Medium | Already noted in Catalysing Impact application |
| **Planet Ark/Circular Future Fund** | Circular economy | Medium | Emerging funds, long-term conversation |
| **Local Government funds** | Local council | Low-Medium | Place-specific, requires outreach |

**Recommendation:** Add a funding pipeline table to the submission showing current status of each relationship.

---

## Part 3: Oonchiumpa Warehouse Partnership Analysis

The Oonchiumpa email presents three options for locating the plastic factory/production facility in Alice Springs. This is a significant opportunity that could strengthen the Snow proposal by demonstrating concrete partnership progress.

### Option Analysis

| Option | Location | Advantages | Disadvantages | Cost | Recommendation |
|--------|----------|------------|---------------|------|----------------|
| **1. Old CfAT Office** | 32 Priest Street, Ciccone | Incredible space; room for full operations growth; established location | High rental ($75k/year); exceeds current funding | $75k/year lease | ❌ Not viable with current funding |
| **2. Commercial Shed** | 36 Ghan Road, Ciccone (Units 1/3) | Ready to go; purpose-built industrial space; no setup required | Only for plastics project; Oonchiumpa stays elsewhere; separate operations | Lease TBD | ⚡ Good short-term option |
| **3. Kristy's Property** | Private land | Low cost; immediate availability; demonstrates deep partnership | Requires power and toilet setup; temporary structures; less professional | Lease TBD + setup costs | ✅ Best for pilot phase |

### Strategic Recommendation

**For Snow Foundation proposal, consider presenting a staged approach:**

**Phase 1 (Q1-Q2 2026): Pilot at Kristy's Property**
- Low-cost startup
- Demonstrates Oonchiumpa partnership commitment
- Nick to assess on Wednesday visit
- Setup costs (power, toilets) could be included in production facility budget

**Phase 2 (Q3+ 2026): Scale to Commercial Shed**
- Once production proven
- Revenue from beds helps fund lease
- Professional space for hosting other community partnerships

**Phase 3 (2027+): Full Operations Hub**
- If CfAT office becomes viable through revenue growth
- Or alternative permanent space
- Multi-purpose facility for beds, washing machines, fridges

### Suggested Addition to Proposal

```markdown
### Alice Springs Production Hub Partnership

In partnership with Oonchiumpa, we are actively assessing locations for the first on-country production facility in Alice Springs. Options include:

1. **Immediate pilot** on Oonchiumpa-connected property, enabling rapid startup with minimal overhead
2. **Commercial lease** at Ghan Road industrial precinct for scaled operations
3. **Future growth** to larger premises as production revenue supports operational costs

This partnership model ensures:
- Aboriginal-owned organisation hosts and benefits from facility
- Local jobs created in Alice Springs
- Revenue share agreement in development
- Pathway to community ownership of production infrastructure

Site assessment scheduled for late January 2026 (Nic's upcoming visit).
```

---

## Part 4: Document Structure Recommendations

### Sally's Request: "Pop the document into a separate attachment for ease of sharing"

**Suggested Structure:**

**Main Document (2-3 pages max for Board):**
- Executive Summary
- Funding Request ($120k breakdown)
- Key Deliverables
- Partnership Approach (brief)
- Risk Summary Table
- Timeline

**Attachment A - Full Proposal (current document, refined)**
- Complete alignment with Snow Principles
- Detailed risk management
- Production facility details
- Partnership deep-dive

**Attachment B - Evidence Pack**
- Community voices quotes
- Demand evidence table
- Photos/media links
- Impact metrics

**Attachment C - Budget Detail**
- Line-item breakdown
- Cost assumptions
- Revenue projections

---

## Part 5: Summary Checklist

### Immediate Actions (Before Next Snow Meeting)

- [ ] Remove Deadly Heart Trek section; relocate "Do No Harm"
- [ ] Expand Risks & Mitigations section significantly
- [ ] Split into main doc + attachments format
- [ ] Add Alice Springs location strategy (Oonchiumpa partnership)
- [ ] Create funding pipeline table showing Sally's suggested funders
- [ ] Verify bed numbers consistency (369 vs 389 vs 140)

### Questions for Sally

1. Does Snow have a preferred format/template for proposals?
2. Would Snow like to see a formal MOU with Oonchiumpa as part of this proposal?
3. Re: Minderoo - any specific contacts or pathways Snow can facilitate?
4. What level of risk detail does the Board typically want to see?
5. Timeline for internal First Nations team review?

### Opportunities to Strengthen

1. **Oonchiumpa warehouse partnership** - concrete demonstration of progress; include warehouse location strategy showing active site assessment and partnership commitment

2. **Dynamic consent** - Sally mentioned Snow team discussing this; could add explicit commitment to dynamic consent principles in the proposal

3. **SEFA loan progress** - 23 communications with Joel Bird; update on current status of social impact loan discussions

4. **Centre Corp Foundation outcome** - ✅ **107 beds approved** from January 30 meeting for Utopian homelands. This is significant validation to include in the Snow proposal - demonstrates:
   - External funder confidence in stretch bed design
   - Concrete progress on one of the key demand signals cited
   - Multi-funder support for the project
   - Moves total committed beds toward the "few hundred" threshold needed for robust feedback before major scale-up

---

*Review completed February 2026*
*This document should be treated as working notes for Nic and Ben's revision process*

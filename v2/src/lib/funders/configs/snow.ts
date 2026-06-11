import type { FunderConfig } from '../types';

/**
 * Snow Foundation — long-form quarterly report.
 * Encoded from the canonical Notion report at
 * https://www.notion.so/367ebcf981cf80838315d00d85555bad (fetched 2026-05-22).
 *
 * Commitment: $395K ex-GST total, grant ref 2024/OC0014, Oct 2024 → May 2027.
 */
export const snowConfig: FunderConfig = {
  slug: 'snow',
  displayName: 'Snow Foundation',
  contactName: 'The Snow Foundation',
  xeroProjectCode: 'ACT-GD',
  reportTitle: (period) =>
    `Snow Foundation — Goods on Country progress report (${period.label})`,
  preparedBy: 'Nicholas Marchesi · Benjamin Knight',
  funderContact: {
    name: 'Sally Grimsley-Ballard',
    email: 's.grimsley-ballard@snowfoundation.org.au',
    phone: '0417 851 341',
  },
  // FINANCIAL RECONCILED (2026-06-11): the 2024/OC0014 grant ($395,000 ex-GST
  // commitment) is fully drawn. Live Xero (read-only, contact-level) shows Snow
  // ~$493,129.79 received across 3yr with $0 outstanding, so the grant slice is
  // fully PAID, not $275K paid / $120K pending. 2 Xero-UI checks still pending
  // (all Snow invoices Goods-coded; any pre-2023-06-09 revenue). See
  // wiki/outputs/funder-reports/snow/2026-06-09-snow-figure-reconciliation.md
  // financials-at-a-glance / commitment-progress also render the LIVE
  // [METRIC: xero-drawn-aud] resolver, which remains the source to prefer.
  commitment: {
    totalAud: 395000,
    paidToDateAud: 395000, // 2024/OC0014 grant fully drawn (Xero, $0 outstanding)
    toBePaidAud: 0, // reconciled 2026-06-11: nothing outstanding on the grant
    invoicesRaisedAud: 434500, // inc-GST, across 6 invoices (2 missing)
    reportsSubmitted: '3 of 3 due so far ✓',
    nextReportDue: '31/07/2026 (FY26 Operational acquittal)',
    finalReportDue: '15/05/2027 (FY26 Scale-Up)',
    grantReference: '2024/OC0014',
  },
  photoTags: ['snow-funded', 'trip-may-2026'],
  tone: 'evidence-and-named',
  // Section order follows the 7-beat narrative spine (person -> numbers ->
  // stage of growth -> focus -> ignition -> proof/governance -> invitation).
  // The 3 new beats are inserted after the headline numbers; order is reviewable.
  sections: [
    'cover',
    'financials-at-a-glance',
    'headline-achievements',
    'stage-of-growth',
    'focus-area',
    'ignition',
    'investment-priorities',
    'alignment-principles',
    'safeguarding-risks',
    'commitment-progress',
    'upcoming-commitments',
    'voices',
    'photo-grid',
    'country-acknowledgement',
  ],
  investmentTiers: [
    {
      priority: 1,
      name: 'Stretch bed production and deployment',
      budgetAud: 140000,
      description:
        'FY25 payments funded V1 → V3 iteration, materials testing, deployment to 8 families, feedback gathering. FY26 Scale-Up $60K (incoming) supports the 100-bed deployment allocation; the old $600/bed planning anchor excludes long-haul freight and fixed-block absorption. Current Buy-Kit marginal is $684.79/bed.',
      outcomes:
        '15-20 beds deployed during funded period; 100-bed batch in production for delivery within FY26 Q4.',
    },
    {
      priority: 2,
      name: 'On-Country production facility',
      budgetAud: 155000,
      description:
        'FY25 main + FY26 Operational + FY26 Scale-Up $60K (incoming). Plant comprises plastic shredder + pellet/sheet press + computer-controlled router. Full deployment capacity: 30 beds/week. Each bed uses 25 kg of plastic waste fitting in a 25 L tub. Multi-product capable — same infrastructure will produce washing machines and fridges (Q3-Q4).',
      outcomes: '~85% complete; final assembly + community siting decision pending.',
    },
    {
      priority: 3,
      name: 'Nic + Ben’s time',
      budgetAud: 100000,
      description:
        '$100K Operational support and wages payment (paid 31/10/2025, INV-0268) covered Q1/Q2 FY26 wages. Time allocated: bed iteration design, cultural consultation visits (4 Central Australia trips in 2025), partnership development, fundraising.',
      outcomes:
        'Snow + Centrecorp + Vincent Fairfax + Rotary alignment closed for FY26; Minderoo Goods $900K pitch positioned for mid-May 2026.',
    },
  ],
  principles: [
    {
      id: 1,
      name: 'First Nations leadership and empowerment',
      evidence:
        '- Bloomfield family leads design decisions on washing machine V1; asked Nic + Ben to help plan next homestead iteration ($100K project) — reciprocal partnership.\n- Cultural advisors paid at university research rates ($3,800/day) throughout 2024-25 — "we asked for no favours."\n- Aboriginal ownership: exploring models where communities own production assets and generate revenue (Palm Island offered to buy a plant; QIC building 50 beds with staff for NAIDOC).',
    },
    {
      id: 2,
      name: 'Early partnership and design in community',
      evidence:
        '- Product evolved through iterative yarning + relational feedback — Norm Frank’s maroon request became a design feature; Diane Stokes’ "20 more" validated cleanability + durability.\n- Current 15-20 bed / 8 family sample. Targeting a few hundred (this $120K round) before scaling to 5,000+.\n- Co-creating an agreement template with Snow Foundation that can be replicated for other organisations.',
    },
    {
      id: 3,
      name: 'Place-based, on-Country delivery',
      evidence:
        '- Northern Territory focus: Alice Springs · Tennant Creek · Katherine · Darwin circuit. Utopian Homelands + Maningrida sites confirmed.\n- Production planned in community sheds (Tennant Creek Community Shed interested in hosting).\n- 25 kg of local plastic waste per bed — adapts to community waste streams.\n- NT is one of Snow’s four priority places — full alignment.',
    },
    {
      id: 4,
      name: 'Genuine collaboration and partnerships',
      evidence:
        '- Orange Sky-inspired model: ACT builds container facilities, local organisations staff and operate them.\n- Partner pipeline: Red Dust Robotics · Deadly Science · Centre of Appropriate Technology · NPY Women’s Council (Angela Lynch) · Tennant Creek Community Shed · Mayor Sid Tennant Creek.\n- Reciprocity: products address community-chosen priorities (beds, washing machines, fridges).\n- Anti-duplication: partnering with existing strong organisations rather than creating a separate Aboriginal-controlled entity.',
    },
    {
      id: 5,
      name: 'Advocacy and policy influence',
      evidence:
        '- Addressing the documented $3M/year washing machine dumping cycle in Alice Springs.\n- Each bed diverts 25 kg of plastic from landfill.\n- Building community-led evidence for policy change on plastic waste, circular economy in remote communities, and procurement standards.',
    },
    {
      id: 6,
      name: 'Evidence-based and culturally safe programs',
      evidence:
        '- Product evolution through community yarning + relational feedback — not extractive research.\n- Cultural safety in design: beds work inside/outside, are cleanable + movable, match house colours.\n- Trauma-aware approach: no imposed solutions; no "fixing" communities with Western furniture models.\n- Workforce training: manufacturing, materials processing, computer-controlled routing, plastic collection + sorting.',
    },
    {
      id: 7,
      name: 'Long-term, flexible funding',
      evidence:
        '- Multi-year vision: 1,000-bed inventory + social enterprise model. Snow’s social impact loan pathway being explored.\n- Full cost recovery: moving from zero-margin product delivery → sustainable pricing → reinvestment.\n- Flexible funding: $120K request includes production plant infrastructure serving multiple purposes (beds, washing machines, fridges).\n- Local workforce pipelines: 30 beds/week over 2 months supports sustained local employment per production run.',
    },
    {
      id: 8,
      name: 'Data sovereignty and Indigenous IP',
      evidence:
        '- Products designed in community with the Bloomfield family. Cultural knowledge and design decisions stay with community.\n- Testing feedback returns to Bloomfields first; production learnings shared with partner communities before external reporting.\n- Practical production partnership where communities retain control.\n- ACT commits to Indigenous Data Sovereignty principles for any future impact measurement.',
    },
  ],
  risks: [
    {
      risk: 'Waste management + environmental',
      status: 'Low',
      mitigation:
        'Small community-chosen collection protocols active; clear QA + contamination thresholds before shredding',
    },
    {
      risk: 'Demand for production plant',
      status: 'Low',
      mitigation:
        'Committed runs across NT circuit; multi-product capability (beds → washers → fridges) reduces single-product dependency',
    },
    {
      risk: 'Upfront payment + cashflow',
      status: 'Medium',
      mitigation:
        'Managing Snow + Centrecorp + Minderoo timing; deposit milestones, staged delivery, separate funding for urgent deployments vs longer-lead infrastructure',
    },
    {
      risk: 'Quality / safety / durability',
      status: 'Active',
      mitigation:
        '8-family field testing, 6 weeks outdoor exposure on test bed; V4 iteration gates tied to evidence not timelines; documented QA + maintenance pathway',
    },
    {
      risk: 'Partnership + cultural safety',
      status: 'Active',
      mitigation:
        'Formalising Bloomfield agreements; co-creating template with Snow; pause points between production runs; community-led feedback loops; tiered payment structures',
    },
  ],
  upcomingCommitments: [
    {
      activity: 'Build + deliver 100 beds in Central Australia (Mparntwe + Utopia, with Centrecorp)',
      timeline: '17-27 May 2026',
      status: '🟡 In flight',
    },
    {
      activity: 'Deploy 1-2 washing machines + beds with Homeland School Company',
      timeline: 'July 2026',
      status: '🟡 Planned',
    },
    {
      activity: 'Next washing machine prototype',
      timeline: 'August 2026',
      status: '🟡 Resourcing',
    },
    {
      activity: 'Deploy production plant to Central Desert (Tennant Creek or Mparntwe)',
      timeline: 'H2 2026',
      status: '🟡 Awaiting community investment',
    },
    {
      activity: 'Complete containerised production facility',
      timeline: 'Q2 2026 (with the FY26 Scale-Up round)',
      status: '🟡 ~85% complete',
    },
    {
      activity: 'Formalise partnership agreements (Bloomfield family + others)',
      timeline: 'Q2 2026',
      status: '🟡 In progress',
    },
    {
      activity: 'FY26 Operational acquittal report',
      timeline: '31 July 2026',
      status: '⏰ Upcoming',
    },
    {
      activity: 'FY26 Scale-Up progress report',
      timeline: '15 May 2027',
      status: '⏰ Future',
    },
  ],
  headlineAchievements:
    '### Product\n- **3 generations of stretch beds** developed (V1 → V3, V4 in design). 25 kg of plastic waste diverted per bed.\n- **Containerised washing machine V1** built and field-tested with Bloomfield family in Tennant Creek (Jan 2026).\n- **Production plant infrastructure** progressed from concept to near-complete containerised facility (shredder + extruder + CNC router for bed components). Investment to date ~$100,000 (TFN + ACT).\n- **15-20 beds deployed** across 8 families for field testing (Diane Stokes, Norm Frank, Utopian Homelands, Tennant Creek participants) prior to the Centrecorp scale-up. Trip-period numbers below.\n\n### Partnership\n- **Oonchiumpa Bloomfield family** partnership formalising — paid cultural consultation at university research rates (~$3,800/day), tiered payment structures, planned co-hosting of production plant.\n- **Four health organisations** initiated engagement after the 2025 Healthy Homes forum.\n- **Centrecorp Foundation** confirmed partnership for May 17-27 Central Australia deployment (Mparntwe + Utopia homelands).\n- **Homeland School Company** confirmed Q3 deployment — 1-2 washers + 65 beds across Maningrida communities.\n\n### Demand validation\n- **200-350 bed requests** logged from communities + health organisations.\n- **Diane Stokes** received 1 bed, requested 20 more within 2 weeks, offered to self-fund.\n- **Norm Frank** requested 3 beds in maroon after his daughter trialled them.\n- **Utopian Homelands** requested beds for every child (~6,000 worth).\n- **Palm Island Community Company** offered to purchase a production plant outright after watching the production video.\n- **QIC** committed to building 50 beds with staff for NAIDOC week.',
  additionalContext:
    '## RHD + Healthy Homes connection\n\n- Cleanable, durable beds and washing machines are foundational health interventions, especially relevant to **Rheumatic Heart Disease prevention** through housing quality and sleep health.\n- Four health organisations engaged after the 2025 Healthy Homes forum. **Anna Phillip** (Healthy Homes Project Coordinator) is a primary contact.\n- **Remote Laundry Collective**: washing machines built with Bloomfield family in January 2026; same production plant will scale washing machine access.\n- Multi-product capability means RHD-relevant interventions (beds + washers + fridges) flow from one infrastructure investment.',
  // PROPOSED 2026-06-09 (Claude) — grounded in canon + the Snow catch-up email.
  // Confirm dial labels, current stage, focus priorities, and the ignition chain
  // with Ben before sending. These three are the narrative spine's beats 3-5.
  stageOfGrowth: {
    dial: ['Prototype', 'Pilot', 'Scaling', 'On-Country production'],
    currentIndex: 2, // Scaling, building toward on-country production
    stepChange:
      'This period Goods began crossing from delivering beds to making them on country. The containerised production plant reached roughly 85% complete, the washing-machine line grew to 16 machines in community, and the first paid local production roles are forming in Alice Springs. The step-change is the shift from beds delivered to community toward beds made by community.',
  },
  focusAreas: [
    {
      title: 'Commission the on-country production plant',
      body: 'Finish the containerised facility (about 85% complete) and make the community siting decision (Tennant Creek or Mparntwe), so beds are made on country rather than freighted in.',
    },
    {
      title: 'Stand up paid local production roles in Alice Springs',
      body: 'Turn delivery into local employment. The first roles forming now are the proof point for the community-owned production model, and the part of this work Snow is most excited about.',
    },
  ],
  ignition: {
    chain: [
      "Snow's anchor capital, given before the proof was in the houses",
      'de-risked the on-country production plant',
      'the plant lets beds be made on country, not freighted in',
      'which creates paid local jobs (the Alice Springs roles forming now)',
      'and turns the next 1,000 beds into a local-employment story',
    ],
    narrative:
      'Snow backed Goods before the proof was in the houses. That anchor capital de-risked the production plant, and the plant is what turns a delivered bed into a locally made one. The Alice Springs roles forming now are the first jobs out of that decision. Your support is the spark under the shift from beds delivered to community toward beds made by community, and it is what makes the next 1,000 beds a local-employment story rather than a freight invoice.',
  },
};

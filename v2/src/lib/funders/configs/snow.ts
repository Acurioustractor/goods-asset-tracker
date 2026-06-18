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
        'FY25 main + FY26 Operational + FY26 Scale-Up $60K (incoming). Plant comprises plastic shredder + pellet/sheet press + computer-controlled router. Full deployment capacity: 30 beds/week. Each bed uses 20kg of plastic waste fitting in a 25 L tub. Multi-product capable: the same infrastructure produces washing machines now, with a fridge a future community-led product line (design not yet started, progressing when community is ready).',
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
  // Snow's own eight funding principles, each brought to the spine (P4, 2026-06-19):
  // a cleared community voice, a canon number, and an honest label (verified /
  // modelled / future). Voices are verbatim from curated-quotes.ts and every author
  // is on the cleared-for-external list. Numbers come from canon (496 beds / 9
  // communities / 16 washers / 2,660kg at 20kg per bed; ~$493K Snow relationship;
  // 15-20 beds / 8 families is the Snow-funded field-test period before Centrecorp).
  principles: [
    {
      id: 1,
      name: 'First Nations leadership and empowerment',
      evidence:
        '"Now we\'ve got our own ways, we can collaborate with our own people. Not only here. It\'ll be everywhere." (Norman Frank, Tennant Creek).\n- The Oonchiumpa Bloomfield family leads design decisions; cultural advisors are paid at university research rates (about $3,800 a day) through 2024-25 (verified).\n- 9 communities served to date (verified). The path runs toward community-owned production assets (future): Palm Island offered to buy a plant, and QIC committed to building 50 beds with staff for NAIDOC week.',
    },
    {
      id: 2,
      name: 'Early partnership and design in community',
      evidence:
        '"We\'ve never been asked what sort of house we\'d like to live in." (Linda Turner, Tennant Creek).\n- The product evolved through iterative yarning and relational feedback: Norman Frank\'s maroon request became a design feature, and Dianne Stokes received one bed then asked for twenty more within two weeks (verified).\n- 15-20 beds across 8 families in the Snow-funded field-test period, before the Centrecorp scale-up of 107 beds (verified).\n- Co-creating a partnership agreement template with Snow Foundation that can be replicated for other organisations.',
    },
    {
      id: 3,
      name: 'Place-based, on-Country delivery',
      evidence:
        '"Every time I go away, it\'s like it\'s calling me. Come back home." (Dianne Stokes, Tennant Creek, who named the washing machine Pakkimjalki Kari in Warumungu).\n- Northern Territory circuit: Alice Springs, Tennant Creek, Katherine and Darwin, with Utopia Homelands and Maningrida sites confirmed. NT is one of Snow\'s four priority places (verified).\n- 2,660kg of plastic diverted to date at 20kg of local waste per bed (modelled); production is planned in community sheds.',
    },
    {
      id: 4,
      name: 'Genuine collaboration and partnerships',
      evidence:
        '"When it comes from an Aboriginal person, it works. That\'s what makes the difference." (Jason).\n- An Orange Sky-inspired model: ACT builds container facilities, local organisations staff and operate them. 16 washing machines are now in community (verified).\n- Partner pipeline includes the Centre of Appropriate Technology, NPY Women\'s Council and the Tennant Creek Community Shed; we partner with existing strong organisations rather than create a separate entity.\n- Products address community-chosen priorities: beds and washing machines now, with a fridge as a future product line the community is exploring (design not yet started; it progresses when community is ready).',
    },
    {
      id: 5,
      name: 'Advocacy and policy influence',
      evidence:
        '"We challenge a lot of that and try to make a difference. Make it easier for our people to live in their homes." (Jimmy Frank).\n- 2,660kg of plastic diverted from landfill to date at 20kg per bed (modelled); the work addresses the documented washing-machine dumping cycle in Central Australia (external estimate, about $3M a year in Alice Springs).\n- Building community-led evidence for policy change on plastic waste, circular economy in remote communities, and social procurement (future).',
    },
    {
      id: 6,
      name: 'Evidence-based and culturally safe programs',
      evidence:
        '"It\'s a really simple idea to a really complex issue. One that can be taken and modified for individual families and communities." (Wayne Glenn, practitioner).\n- Product evolution comes through community yarning and relational feedback, not extractive research; beds work inside and outside, are cleanable and movable, and match house colours (verified).\n- Workforce training covers manufacturing, materials processing, computer-controlled routing, and plastic collection and sorting.',
    },
    {
      id: 7,
      name: 'Long-term, flexible funding',
      evidence:
        '"We don\'t force nothing on them. We just sit down and explain what we do, or we let them look and listen. When they\'re ready, they\'ll try." (Gary).\n- Snow has backed Goods with roughly $493,000 to date (verified, Xero), the foundation relationship that made the field-testing and the first plant possible.\n- The next step is a blended-finance pathway: a first-mover, recoverable commitment aligned with the QBE Catalysing Impact plan, moving Goods from grant-funded toward a community-owned enterprise that can stand on its own (future; the specific ask is being scoped with QBE).\n- Full cost recovery: moving from zero-margin delivery toward sustainable pricing and reinvestment.',
    },
    {
      id: 8,
      name: 'Data sovereignty and Indigenous IP',
      evidence:
        '"Now we\'re in a position to say: this is a sacred site for us as Aboriginal women and traditional owners." (Kristy Bloomfield, Oonchiumpa).\n- Products are designed in community with the Bloomfield family; cultural knowledge and design decisions stay with community (verified).\n- Consent travels with the story and testing feedback returns to community first, in the Mukurtu and Warumungu lineage; ACT commits to Indigenous Data Sovereignty principles for any future impact measurement (future).',
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
        'Committed runs across NT circuit; multi-product capability (beds and washers now, a fridge as a future line) reduces single-product dependency',
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
    '### Product\n- **3 generations of stretch beds** developed (V1 → V3, V4 in design). 20kg of plastic waste diverted per bed.\n- **Containerised washing machine V1** built and field-tested with Bloomfield family in Tennant Creek (Jan 2026).\n- **Production plant infrastructure** progressed from concept to near-complete containerised facility (shredder + extruder + CNC router for bed components). Investment to date ~$100,000 (TFN + ACT).\n- **15-20 beds deployed** across 8 families for field testing (Diane Stokes, Norm Frank, Utopian Homelands, Tennant Creek participants) prior to the Centrecorp scale-up. Trip-period numbers below.\n\n### Partnership\n- **Oonchiumpa Bloomfield family** partnership formalising — paid cultural consultation at university research rates (~$3,800/day), tiered payment structures, planned co-hosting of production plant.\n- **Four health organisations** initiated engagement after the 2025 Healthy Homes forum.\n- **Centrecorp Foundation** confirmed partnership for May 17-27 Central Australia deployment (Mparntwe + Utopia homelands).\n- **Homeland School Company** confirmed Q3 deployment — 1-2 washers + 65 beds across Maningrida communities.\n\n### Demand validation\n- **200-350 bed requests** logged from communities + health organisations.\n- **Diane Stokes** received 1 bed, requested 20 more within 2 weeks, offered to self-fund.\n- **Norm Frank** requested 3 beds in maroon after his daughter trialled them.\n- **Utopian Homelands** requested beds for every child (~6,000 worth).\n- **Palm Island Community Company** offered to purchase a production plant outright after watching the production video.\n- **QIC** committed to building 50 beds with staff for NAIDOC week.',
  additionalContext:
    '## RHD + Healthy Homes connection\n\n- This is why a bed and a washing machine are health hardware, not furniture: cleanable, durable beds and reliable washing machines support the conditions needed to interrupt the scabies to rheumatic heart disease pathway. We do not claim a bed prevents heart disease; that would need a partner clinical method.\n- Four health organisations engaged after the 2025 Healthy Homes forum. **Anna Phillip** (Healthy Homes Project Coordinator) is a primary contact.\n- **Remote Laundry Collective**: washing machines built with Bloomfield family in January 2026; same production plant will scale washing machine access.\n- Multi-product capability means health hardware (beds and washers now, with a fridge as a future line) flows from one infrastructure investment.',
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

/**
 * Goods on Country — Grant Content Library
 *
 * Pre-written, verified content blocks for composing grant applications.
 * Every claim is sourced from the master compendium.
 *
 * Source: goods-grant-content.ts in Grantscope repo
 * Synced: March 16, 2026
 */

import { CANONICAL_ASSETS } from './asset-canonical';

// ─────────────────────────────────────────────────────────────────────────────
// Organisation Identity
// ─────────────────────────────────────────────────────────────────────────────

export const orgIdentity = {
  // ── Entity structure confirmed by Ben 2026-05-29 (canonical: memory goods-entity-structure) ──
  // CURRENT operating entity: Nicholas Marchesi (sole trader), ABN 21 591 780 066.
  // GO-FORWARD trading/operating company (migrating ALL to it this FY, FY2026-27):
  //   A Curious Tractor Pty Ltd, ACN 697 347 676, trading as Goods on Country.
  // CHARITY / DGR home (operational from FY2026-27): The Butterfly Movement Ltd (ACNC, Item 1 DGR).
  // A Kind Tractor Ltd (ABN 73 669 029 341) is DORMANT and NOT used — do not cite it.
  // ⚠️ Per grant, confirm with the accountant which entity is the applicant/contracting party
  //    (current sole trader vs the Pty Ltd once migrated).
  legalName: 'A Curious Tractor Pty Ltd',
  acn: '697 347 676',
  abn: '36 697 347 676', // A Curious Tractor Pty Ltd (go-forward trading entity; ABN confirmed 2026-05-29, registered 21 Apr 2026)
  currentOperatingEntity: 'Nicholas Marchesi (sole trader), ABN 21 591 780 066',
  charityDgrHome: 'The Butterfly Movement Ltd (ACNC, Item 1 DGR; operational from FY2026-27)',
  acnc: false, // trading company is not itself a charity; charitable/DGR home is The Butterfly Movement Ltd
  dgr: false,  // DGR via The Butterfly Movement Ltd, not this entity
  tradingAs: 'Goods on Country',
  website: 'www.goodsoncountry.com',
  tagline: 'Goods that heal.',
  oneLiner: 'A good bed can prevent heart disease.',
  mission:
    'To transform essential household goods — beds, washing machines, refrigerators — into community-owned assets that improve lives in remote Australia, designed with communities and eventually manufactured by them.',
  philosophy: 'Our job is to become unnecessary.',
};

// ─────────────────────────────────────────────────────────────────────────────
// Founder Bios
// ─────────────────────────────────────────────────────────────────────────────

export const founders = {
  nic: {
    name: 'Nicholas Marchesi OAM',
    role: 'Co-founder & Project Lead',
    bio: 'Social entrepreneur with 15+ years founding and scaling community-led ventures. Co-founded Orange Sky (2014) — now 280+ shifts/week, 1.2M+ kg laundry, 1/3 of operations in remote communities.',
    credentials: [
      'Medal of the Order of Australia (OAM, 2020)',
      'Young Australian of the Year (2016, joint)',
      'Obama Foundation Leader: Asia-Pacific (2019)',
      'Westpac Social Change Fellow (2023)',
    ],
  },
  ben: {
    name: 'Benjamin Knight',
    role: 'Co-founder & Technology',
    bio: '20+ years in community-led innovation: youth refuges, QLD Corrective Services Gulf communities, QFCC Youth Advocate, Orange Sky, AIME.',
    credentials: [
      'Built Empathy Ledger ethical storytelling infrastructure',
      'Built the Goods Asset Register (QR-coded asset tracking)',
      'JusticeHub Digital Platform (launching 2026)',
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Problem Statement
// ─────────────────────────────────────────────────────────────────────────────

export const problemStatement = {
  headline: 'The health cascade that starts with a missing washing machine',
  cascade: [
    'No washing machine → dirty bedding → scabies',
    'Scabies → skin infections → Strep A',
    'Strep A → rheumatic fever → Rheumatic Heart Disease',
    'RHD → death certificates for children',
  ],
  prevention:
    'A washing machine interrupts the cascade. Clean bedding breaks the scabies cycle.',
  stats: [
    { claim: 'Remote homes lacking washing machines', value: '59%' },
    { claim: 'Children with scabies at any time', value: '1 in 3' },
    { claim: 'Very remote First Nations homes overcrowded', value: '55%' },
    { claim: 'Mattress cost in remote', value: '$1,200+ (2x city)' },
    { claim: 'Washing machines sold → dumps, Alice Springs', value: '$3M/year' },
    { claim: 'Remote laundries reduce scabies', value: '60% reduction' },
    { claim: 'Healthcare savings per $1 washing investment', value: '$6 saved' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Impact Numbers
// ─────────────────────────────────────────────────────────────────────────────

export const impactNumbers = {
  // Refreshed to canonical register figures 2026-05-30 (QBE sweep). Verified internal, not audited.
  asOf: '2026-05-30',
  totalAssetsTracked: 561, // asset table rows: 520 bed rows + 41 washer rows
  bedsDeployed: CANONICAL_ASSETS.bedsDeployed, // deployed bed units tracked (Stretch + legacy Basket)
  washersInCommunity: CANONICAL_ASSETS.washersInCommunity, // canonical in-community washing-machine count (curated)
  communitiesEngaged: CANONICAL_ASSETS.communitiesServed, // served communities; distinct register names = 10 incl. placeholder/allocated
  livesImpacted: '1,000+',
  plasticDivertedKg: CANONICAL_ASSETS.plasticKg, // Stretch beds only (133 x 20kg HDPE); Basket Beds are not a plastic product
  plasticPerBed: '20kg HDPE',
  verifiedStorytellers: '15+',
  advisoryBoardMembers: 13, // advisory/support network — NOT a fiduciary board
  // Deployed beds by community. Washer counts omitted here; see washersInCommunity above.
  deployments: [
    { community: 'Tennant Creek', state: 'NT', beds: 159 },
    { community: 'Utopia Homelands', state: 'NT', beds: 147 },
    { community: 'Palm Island', state: 'QLD', beds: 131 },
    { community: 'Kalgoorlie', state: 'WA', beds: 20 },
    { community: 'Maningrida', state: 'NT', beds: 18 },
    { community: 'Alice Springs', state: 'NT', beds: 16 },
    { community: 'Mt Isa', state: 'QLD', beds: 2 },
    { community: 'Canberra', state: 'ACT', beds: 2 },
    { community: 'Darwin', state: 'NT', beds: 1 },
  ] as Array<{ community: string; state: string; beds: number; washers?: number }>,
};

// ─────────────────────────────────────────────────────────────────────────────
// Funding History
// ─────────────────────────────────────────────────────────────────────────────

export const fundingHistory = {
  // Xero ACT-GD ACCREC paid as of 2026-05-30. Workpaper-level management data, not audited.
  // Includes grant/philanthropic receipts plus commercial buyer receipts.
  // 2026-06-03 (Ben decisions, all four blockers CLOSED): Snow restated to the full 3-year Xero
  // total ($493,130, now includes the 2024 receipts the earlier window excluded). PICC $436,700
  // EXCLUDED (ACT / Palm Island). The large mixed-ledger contacts (SMART Recovery, Sonas/Harvest,
  // Cassidy/tiny-home, HipCamp, Just Reinvest/JusticeHub) are all other Marchesi projects, EXCLUDED;
  // commercial line $61,449 confirmed NOT understated. totalReceived $741,111 is FINAL.
  // See wiki/outputs/2026-06-03-cluster2-xero-reconciliation.md.
  totalReceived: 741_111,
  received: [
    { source: 'Snow Foundation', amount: 493_130, when: '2023-2026' },
    { source: 'Centrecorp Foundation', amount: 123_332, when: '2025-2026' },
    { source: 'Vincent Fairfax Family Foundation', amount: 50_000, when: '2025' },
    { source: 'QIC', amount: 12_000, when: '2026' },
    { source: 'The John Villiers Trust', amount: 1_200, when: '2026' },
    { source: 'Commercial and buyer receipts', amount: 61_449, when: '2024-2026' },
  ],
  // TFN, FRRR and AMP have been founder-confirmed in prior work, but were not in the
  // live ACT-GD open/paid ACCREC set used for this QBE-alignment pass.
  receivables: [
    { source: 'Rotary eClub Outback Australia', amount: 82_500, notes: 'INV-0222 AUTHORISED, 405 days overdue. 200 Basket Beds v1 + $5K project.' },
    { source: 'Homeland School Company', amount: 44_000, notes: 'INV-0303 AUTHORISED, due 30 Jun 2026. Live ACT-GD ACCREC, Goods-tagged in Xero.' },
    { source: 'Regional Arts Australia', amount: 16_500, notes: 'INV-0302 AUTHORISED, due 30 Jun 2026. Confirmed Goods receivable (Ben, 2026-06-03).' },
  ],
  // Removed Centrecorp $420K: relationship commitment, but its invoices were voided ($0 currently invoiced).
  // Removed PICC/Palm Island: that revenue belongs to the PICC (ACT-PI) project, not Goods.
  // 2026-06-03 (Ben): receivables restated to Rotary $82.5K + Homeland $44K + Regional Arts $16.5K (all live authorised in Xero).
  // Homeland was wrongly dropped earlier; live Xero confirms it as an open authorised invoice.
  totalReceivables: 143_000,
};

// ─────────────────────────────────────────────────────────────────────────────
// Community Quotes (verified, verbatim)
// ─────────────────────────────────────────────────────────────────────────────

export const communityQuotes = {
  needForBeds: [
    { quote: 'Hardly anyone around the community has beds. When family comes to visit, people sleep on the floor.', person: 'Ivy', community: 'Palm Island' },
    { quote: "Having a bed is something you need; you feel more safe when you sleep in a bed.", person: 'Alfred Johnson', community: 'Palm Island' },
    { quote: "It's essential. The families right now... the beds were on the ground. It's a safety thing... a lot of snakes.", person: 'Fred Campbell', community: 'Alice Springs' },
  ],
  freightAndAccess: [
    { quote: "You can't just go down to the store and buy beds. It's a big muck-around.", person: 'Alfred Johnson', community: 'Palm Island' },
    { quote: 'The freight is very, very dear.', person: 'Carmelita', community: 'Palm Island' },
    { quote: 'We are on an island — literally. Therefore anything we purchase is so much more expensive due to freight.', person: 'Simone Grimmond', community: 'Groote Archipelago' },
  ],
  healthLink: [
    { quote: 'There is also a lot of scabies and this often leads to Rheumatic Heart Disease, so washing machines are essential.', person: 'Jessica Allardyce', community: 'East Arnhem' },
  ],
  productFeedback: [
    { quote: "From the waste, plastic. Perfect. That's really a perfect idea. Because it's very expensive buying bed. But with this here, it's so amazing.", person: 'Jacqueline', community: 'Alice Springs' },
  ],
  communityOwnership: [
    { quote: "We've never been asked at what sort of house we'd like to live in.", person: 'Linda Turner', community: 'Tennant Creek' },
    { quote: "We're setting this up for our kids and grandkids... independence, being in charge of your own destiny.", person: 'Linda Turner', community: 'Tennant Creek' },
  ],
  demandSignals: [
    { quote: 'Dianne Stokes received 1 bed → returned within 2 weeks requesting 20 more, offered to self-fund.', community: 'Tennant Creek' },
    { quote: 'PICC said "we\'ll buy the production facility itself."', community: 'Palm Island' },
    { quote: 'Groote Archipelago requested 500 mattresses + 300 washing machines from a single community.', community: 'Groote Eylandt' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Grant Answer Templates
// ─────────────────────────────────────────────────────────────────────────────

export const grantAnswers = {
  whatDoYouDo: {
    short: 'We design and manufacture essential household goods — beds, washing machines, and refrigerators — with remote Indigenous communities in Australia, using recycled plastic and local production to create health outcomes, jobs, and community ownership.',
    medium: `Goods on Country transforms essential household goods into community-owned assets that improve lives in remote Australia. Our flagship product, the Stretch Bed, is a flat-packable, washable bed made from recycled HDPE plastic, galvanised steel, and heavy-duty canvas. Each bed diverts 20kg of plastic from landfill and is designed to last 10+ years. We've deployed 496 bed units across 9 communities in multiple states and territories, with washing-machine prototypes in several communities. Our containerised production facility is being set up so communities can manufacture goods from local waste plastic On-Country.`,
  },
  whatProblemDoYouSolve: {
    short: 'In remote Australia, 59% of homes lack washing machines, mattresses cost $1,200+ delivered, and $3M worth of washing machines end up in dumps every year in Alice Springs alone. This drives preventable diseases including Rheumatic Heart Disease in children.',
    medium: `The health cascade starts with a missing washing machine: dirty bedding leads to scabies, which leads to Strep A, Rheumatic Fever, and ultimately Rheumatic Heart Disease — entirely preventable. 59% of remote homes lack washing machines. One in three children has scabies at any given time. Standard washing machines last 1–2 years in remote conditions. Mattresses cost $1,200+ delivered. One Alice Springs provider sells $3M/year worth of washing machines into remote communities — most end up in dumps within months. This is a design problem, not a supply problem.`,
  },
  whatMakesYouDifferent: {
    short: "We don't deliver products to communities. Communities lead the design in community, we support the build, and our goal is to transfer full manufacturing capability so communities own the means of production.",
    medium: `Three things differentiate Goods: (1) Community-led design. Every product decision is shaped in community with the people who use the thing. 500+ minutes of recorded community input drove the evolution from V1 Basket Beds to the V4 Stretch Bed. (2) Local production. Our containerised production facility ($100K invested) is being set up to turn waste plastic into bed components On-Country, creating jobs and a circular economy as it comes online. (3) Ownership pathway. The model is built to transfer capability to communities over time, with full training, capability and documentation, rather than a license.`,
  },
  whoDoYouWorkWith: 'We work with 9 remote Indigenous communities across QLD, NT, WA, and SA. Core community partners include Oonchiumpa Consultancy, Wilya Janta, and Palm Island Community Company. Health partners include Anyinginyi Health, Miwatj Health, Purple House, and Red Dust.',
  howDoYouMeasureImpact: 'We track impact through: (1) Asset Register — 561 asset rows with QR-coded lifecycle monitoring. (2) Telemetry — 16 washing machines in community, with fleet telemetry not yet fleet-wide. (3) Community feedback — 500+ minutes recorded, 15+ verified storytellers via Empathy Ledger. (4) Environmental metrics — 2,660kg+ plastic diverted (133 Stretch beds x 20kg HDPE; Basket Beds are not a plastic product). (5) Health outcomes — tracking with health partners.',
  whatAreYourFinancials: `~$741.1K ACT-GD ACCREC paid to date, comprising ~$679.7K grant/philanthropic receipts and ~$61.4K commercial/buyer receipts. ~$143K remains outstanding in authorised receivables (Rotary $82.5K, Homeland School $44K, and Regional Arts $16.5K). $100K invested in the production facility. Demand materially exceeds current production capacity. Figures are Xero management data, not audited.`,
  howWillYouUseThisFunding: {
    beds: 'Each $600–850 funds one Stretch Bed deployed to a remote community, diverting 20kg of plastic and providing a 10+ year sleeping surface.',
    production: '$100K funds a containerised production facility deployment to a community for ~2 months, producing roughly 20 beds/week at current throughput.',
    washers: '$4,000 funds one Pakkimjalji Kari washing machine deployed with telemetry and 10+ year design life.',
    scale: '$500K funds working capital for 500+ bed production run, supply chain establishment, and community training across 3+ communities.',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Eligibility
// ─────────────────────────────────────────────────────────────────────────────

export const eligibility = [
  'Trading entity: A Curious Tractor Pty Ltd, ACN 697 347 676 (trading as Goods on Country)',
  'Charitable / DGR home: The Butterfly Movement Ltd (ACNC, Item 1 DGR) — operational from FY2026-27',
  'Current operating entity during migration: Nicholas Marchesi (sole trader), ABN 21 591 780 066',
  '⚠️ Confirm the applicant/contracting entity with the accountant before submitting any application',
];

// ─────────────────────────────────────────────────────────────────────────────
// Compose a grant application from content blocks
// ─────────────────────────────────────────────────────────────────────────────

export type GrantSection =
  | 'org_identity'
  | 'founders'
  | 'problem'
  | 'solution'
  | 'impact'
  | 'financials'
  | 'community_voices'
  | 'use_of_funds'
  | 'eligibility';

export type ComposedGrant = {
  funderName: string;
  sections: Array<{
    id: GrantSection;
    title: string;
    content: string;
  }>;
  generatedAt: string;
};

export function composeGrantApplication(
  funderName: string,
  requestedSections: GrantSection[] = [
    'org_identity',
    'problem',
    'solution',
    'impact',
    'community_voices',
    'financials',
    'use_of_funds',
    'eligibility',
  ],
  fundingPurpose: 'beds' | 'production' | 'washers' | 'scale' = 'beds',
): ComposedGrant {
  const sectionBuilders: Record<
    GrantSection,
    () => { title: string; content: string }
  > = {
    org_identity: () => ({
      title: 'About Us',
      content: [
        `**${orgIdentity.tradingAs}** — trading entity ${orgIdentity.legalName} (ACN ${orgIdentity.acn})`,
        '',
        orgIdentity.mission,
        '',
        `*"${orgIdentity.philosophy}"*`,
        '',
        `Website: ${orgIdentity.website}`,
        `Current operating entity (migration in progress): ${orgIdentity.currentOperatingEntity}`,
        `Charitable / DGR home: ${orgIdentity.charityDgrHome}`,
      ].join('\n'),
    }),

    founders: () => ({
      title: 'Leadership',
      content: [
        `**${founders.nic.name}** — ${founders.nic.role}`,
        founders.nic.bio,
        `Key credentials: ${founders.nic.credentials.slice(0, 3).join('; ')}`,
        '',
        `**${founders.ben.name}** — ${founders.ben.role}`,
        founders.ben.bio,
      ].join('\n'),
    }),

    problem: () => ({
      title: 'The Problem',
      content: [
        `**${problemStatement.headline}**`,
        '',
        problemStatement.cascade.join(' → ').replace(/ → /g, '\n→ '),
        '',
        problemStatement.prevention,
        '',
        '**Key statistics:**',
        ...problemStatement.stats.map((s) => `- ${s.claim}: **${s.value}**`),
      ].join('\n'),
    }),

    solution: () => ({
      title: 'Our Solution',
      content: grantAnswers.whatMakesYouDifferent.medium,
    }),

    impact: () => ({
      title: 'Impact to Date',
      content: [
        `As of ${impactNumbers.asOf}:`,
        '',
        `- **${impactNumbers.bedsDeployed}** beds deployed across **${impactNumbers.communitiesEngaged}** communities`,
        `- **${impactNumbers.washersInCommunity}** washing machines in community`,
        `- **${impactNumbers.plasticDivertedKg.toLocaleString()}kg** plastic diverted from landfill`,
        `- **${impactNumbers.livesImpacted}** lives directly impacted`,
        `- **${impactNumbers.totalAssetsTracked}** assets tracked via QR-coded lifecycle monitoring`,
        `- **${impactNumbers.verifiedStorytellers}** verified storytellers (Empathy Ledger)`,
        '',
        '**Deployment footprint:**',
        ...impactNumbers.deployments.map(
          (d) =>
            `- ${d.community}, ${d.state}: ${d.beds} beds${d.washers ? `, ${d.washers} washers` : ''}`,
        ),
      ].join('\n'),
    }),

    financials: () => ({
      title: 'Financial Position',
      content: [
        grantAnswers.whatAreYourFinancials,
        '',
        '**Funding received:**',
        ...fundingHistory.received.map(
          (f) => `- ${f.source}: $${f.amount.toLocaleString()} (${f.when})`,
        ),
        '',
        `**Outstanding receivables:** $${fundingHistory.totalReceivables.toLocaleString()}`,
        ...fundingHistory.receivables.map(
          (r) => `- ${r.source}: $${r.amount.toLocaleString()} — ${r.notes}`,
        ),
      ].join('\n'),
    }),

    community_voices: () => {
      const allQuotes = [
        ...communityQuotes.needForBeds,
        ...communityQuotes.freightAndAccess.slice(0, 1),
        ...communityQuotes.productFeedback,
        ...communityQuotes.communityOwnership.slice(0, 1),
        ...communityQuotes.demandSignals.slice(0, 2),
      ];
      return {
        title: 'Community Voices',
        content: allQuotes
          .map((q) => {
            const attribution = 'person' in q && q.person ? `— ${q.person}` : '';
            const loc = q.community ? `, ${q.community}` : '';
            return `> "${q.quote}"\n> ${attribution}${loc}`;
          })
          .join('\n\n'),
      };
    },

    use_of_funds: () => ({
      title: 'Use of Funds',
      content:
        grantAnswers.howWillYouUseThisFunding[fundingPurpose] ||
        grantAnswers.howWillYouUseThisFunding.beds,
    }),

    eligibility: () => ({
      title: 'Eligibility',
      content: eligibility.map((e) => `- ${e}`).join('\n'),
    }),
  };

  const sections = requestedSections
    .filter((id) => sectionBuilders[id])
    .map((id) => ({
      id,
      ...sectionBuilders[id](),
    }));

  return {
    funderName,
    sections,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Export composed grant as markdown
 */
export function grantToMarkdown(grant: ComposedGrant): string {
  const lines = [
    `# Grant Application — ${grant.funderName}`,
    `*Generated ${new Date(grant.generatedAt).toLocaleDateString('en-AU', { dateStyle: 'long' })}*`,
    '',
  ];

  for (const section of grant.sections) {
    lines.push(`## ${section.title}`, '', section.content, '');
  }

  lines.push(
    '---',
    `*Prepared by Goods on Country (${orgIdentity.website})*`,
  );

  return lines.join('\n');
}

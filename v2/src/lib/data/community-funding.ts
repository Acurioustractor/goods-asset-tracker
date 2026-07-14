// Funding opportunities + public backing per community, for the public
// /communities/[slug] pages.
//
// Two directions, per the site's funding posture:
//   1. `needs`    — funder-facing: what a partner could fund NEXT in this
//                   community. Qualitative by design. Dollar figures and deal
//                   terms live behind the gated /funders/* pages, never here.
//   2. `backedBy` — funders/partners already publicly credited with work in
//                   this community. ONLY entries that are already public
//                   elsewhere on the site (e.g. the /partners/* pages or the
//                   partner registry in partners.ts) may appear. Default-deny,
//                   same posture as cleared-voices.
//
// `communityPartners` are the on-the-ground orgs (Oonchiumpa, PICC) — they are
// collaborators, not funders, and are labelled separately in the UI.

export interface FundingNeed {
  title: string;
  detail: string;
  href: string;
  cta: string;
}

export interface PublicBacker {
  name: string;
  detail: string;
  href?: string;
}

export interface CommunityFunding {
  needs: FundingNeed[];
  backedBy: PublicBacker[];
  communityPartners: PublicBacker[];
}

/** Needs that hold for every community we deliver into. */
function defaultNeeds(name: string): FundingNeed[] {
  return [
    {
      title: 'Sponsor the next beds',
      detail: `Every sponsored Stretch Bed goes to a family in ${name} — flat-packed, washable, built to last 10+ years.`,
      href: '/sponsor',
      cta: 'Sponsor beds',
    },
    {
      title: 'Partner on what comes next',
      detail: 'Washing machine trials, on-country manufacturing and community storytelling all need long-term partners.',
      href: '/partner',
      cta: 'Partner with Goods',
    },
  ];
}

const TAILORED: Record<string, Partial<CommunityFunding>> = {
  'tennant-creek': {
    needs: [
      {
        title: 'Back the Pakkimjalki Kari trial',
        detail:
          'The washing machine named here in Warumungu by Elder Dianne Stokes is in prototype. Funding extends the trial fleet and telemetry.',
        href: '/partner',
        cta: 'Support the trial',
      },
      ...defaultNeeds('Tennant Creek'),
    ],
  },
  'alice-springs': {
    needs: [
      {
        title: 'Fund design in community',
        detail:
          'Product design happens here through Oonchiumpa, a 100% Aboriginal-owned consultancy. Backing this work keeps design decisions on country.',
        href: '/partner',
        cta: 'Back community-led design',
      },
      ...defaultNeeds('Alice Springs'),
    ],
    communityPartners: [
      {
        name: 'Oonchiumpa Consultancy',
        detail: '100% Aboriginal-owned consultancy leading design in community',
        href: '/partners/oonchiumpa',
      },
    ],
  },
  'palm-island': {
    communityPartners: [
      {
        name: 'Palm Island Community Company (PICC)',
        detail: 'Local partner making sure beds reach the families who need them',
      },
    ],
  },
  'utopia-homelands': {
    backedBy: [
      {
        name: 'Centrecorp Foundation',
        detail: 'Funded bed deliveries to families across the Utopia Homelands',
        href: '/partners/centrecorp',
      },
    ],
  },
};

/** Funding block for a community. Always returns a complete object. */
export function communityFunding(id: string, name: string): CommunityFunding {
  const t = TAILORED[id] ?? {};
  return {
    needs: t.needs ?? defaultNeeds(name),
    backedBy: t.backedBy ?? [],
    communityPartners: t.communityPartners ?? [],
  };
}

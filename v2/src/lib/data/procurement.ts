/**
 * WHO CAN BUY A BED, AND WHY A COMMUNITY ORGANISATION SHOULD BE THE ONE SELLING IT.
 *
 * Ben, 16 September 2026: map every procurement opportunity, lean into Indigenous procurement,
 * and support the communities getting beds to sell them on.
 *
 * Sourced from the procurement work already done in the grantscope repo. Nothing is invented
 * here: the ANAO Indigenous Procurement Policy dataset, the five-jurisdiction social
 * procurement policy library, the federal repeat-buyer scan, and the Central Australian
 * channel archetypes. Where a figure comes from there, the `source` field says so. Nothing in
 * this file is modelled demand.
 *
 * THE ARGUMENT THIS FILE EXISTS TO MAKE, and which nothing in either repo had written down:
 *
 *   1. The Commonwealth mandatory set-aside means a remote-area procurement of ANY value must
 *      first be tested against Aboriginal and Torres Strait Islander business capability.
 *   2. That test is applied to THE ENTITY THAT SELLS. Ruling J, 25 July 2026: Aboriginal
 *      directors on the charity is not 51% First Nations ownership of the selling entity,
 *      which is what Supply Nation, the IPP, IBA and FAC all test.
 *   3. Orders are invoiced by A Curious Tractor Pty Ltd, which does not meet that test. So
 *      every Indigenous procurement channel is shut to Goods as it stands today.
 *   4. The community organisations we already work with DO meet it. They are Aboriginal
 *      community controlled.
 *   5. Therefore: beds given to a community organisation as stock they own and sell are not
 *      a donation. They are the thing that makes that organisation a supplier into a channel
 *      Goods itself cannot reach, and the margin stays there.
 *
 * That is the same $99,750 ask with a different argument under it.
 *
 * NEVER PUT MODELLED DEMAND IN THIS FILE. The withdrawn "who has asked" figures came from
 * grantscope's estimate-goods-demand.mjs (households = population / 3.5, beds = households x
 * 1.2). Ben withdrew them on 15 September. The only demand record is the paid trade.
 */

/** Where a rule or figure came from, so nothing here is unsourced. */
export type ProcSource = 'anao' | 'policy' | 'austender' | 'goods-register' | 'grantscope';

// ---------------------------------------------------------------------------
// The rules that create the opening.

export interface ProcurementRule {
  id: string;
  jurisdiction: string;
  name: string;
  /** The rule as the source states it. Quoted where it is quotable. */
  rule: string;
  /** What it means for a community organisation selling beds. */
  soWhat: string;
  source: ProcSource;
  sourceDetail: string;
}

export const PROCUREMENT_RULES: readonly ProcurementRule[] = [
  {
    id: 'set-aside',
    jurisdiction: 'Commonwealth',
    name: 'Indigenous Procurement Policy: mandatory set-aside',
    rule: 'A requirement to set aside all remote area procurements, and all non-remote area domestic procurements with a value of $80,000 to $200,000, to determine whether an Aboriginal and Torres Strait Islander business could deliver value for money before the procuring entity approaches the broader market.',
    soWhat: 'This is the one that matters most. A remote-area purchase of ANY value has to be tested against Aboriginal and Torres Strait Islander business capability first. An order of 133 beds at $750 is $99,750, which also sits inside the non-remote band. A community organisation holding stock is the answer to that test.',
    source: 'anao',
    sourceDetail: 'ANAO Report No. 40 2024-25, paragraphs 1.2 to 1.4',
  },
  {
    id: 'value-target',
    jurisdiction: 'Commonwealth',
    name: 'Annual value and volume targets',
    rule: 'The annual value target for the Australian Government and each portfolio rises to three per cent in 2025-26, and by a further 0.25 per cent annually to 2029-30.',
    soWhat: 'Every federal portfolio has a number to hit and is measured against it. A supplier who is easy to buy from is doing the buyer a favour.',
    source: 'anao',
    sourceDetail: 'ANAO Report No. 40 2024-25',
  },
  {
    id: 'mmr',
    jurisdiction: 'Commonwealth',
    name: 'Mandatory minimum requirements on large contracts',
    rule: 'Contracts valued at $7.5 million or more including GST, in one of 19 specified industry categories and wholly delivered in Australia, must carry a minimum four per cent Indigenous employment or contractor use for the contract, or three per cent across the contractor’s Australian organisation.',
    soWhat: 'A head contractor on a remote housing job can count Indigenous supply toward its own target. Beds bought from a community supplier are supply use. This is how Goods gets into a contract it could never bid for.',
    source: 'anao',
    sourceDetail: 'ANAO Report No. 40 2024-25. Category 73 covers industrial production and manufacturing services; 91 covers personal and domestic services',
  },
  {
    id: 'nsw',
    jurisdiction: 'New South Wales',
    name: 'Aboriginal Procurement Policy and Social Enterprise Policy',
    rule: 'Agencies can directly engage social enterprises for procurements under $150,000. The Aboriginal Procurement Policy targets a minimum three per cent of addressable spend.',
    soWhat: 'Under $150,000, a NSW agency can simply buy, with no tender. That covers a 133-bed order twice over.',
    source: 'policy',
    sourceDetail: 'grantscope social-procurement policy library',
  },
  {
    id: 'sa',
    jurisdiction: 'South Australia',
    name: 'South Australian Industry Participation Policy',
    rule: 'Aboriginal businesses can be directly engaged up to $550,000, with an across-government target of at least 0.5 per cent of spend, and a minimum 20 per cent tender evaluation weighting for economic contribution to the state.',
    soWhat: 'The most permissive direct-engagement threshold in the country. Half a million dollars without a tender.',
    source: 'policy',
    sourceDetail: 'grantscope social-procurement policy library',
  },
  {
    id: 'qld',
    jurisdiction: 'Queensland',
    name: 'Buy Queensland and the Queensland Indigenous Procurement Policy',
    rule: 'Buy Queensland weights local benefits in evaluation. The Queensland Indigenous Procurement Policy targets three per cent of addressable spend to Indigenous businesses.',
    soWhat: 'Relevant to Palm Island, where the shire council is itself an Aboriginal council.',
    source: 'policy',
    sourceDetail: 'grantscope social-procurement policy library',
  },
];

/**
 * How well the policy is actually complied with. This is here because a buyer who is behind on
 * their own target is a warmer buyer than one who is not, and because overstating how rigorous
 * the system is would be its own kind of dishonesty.
 */
export const IPP_COMPLIANCE = {
  exemptedShare: '63 per cent of all contracts recorded in the IPP reporting solution between July 2016 and September 2024, valued at $69.3 billion, were exempted from the mandatory minimum requirements.',
  otherCategory: 'Thirty-four per cent of those exemptions, valued at $30.2 billion, used the exemption category "other". The ANAO called that "not appropriate" because it obscures the degree of non-compliance.',
  worstPortfolios: 'Foreign Affairs and Trade exempted 90 per cent, Defence 63 per cent across $35.9 billion, Health and Aged Care 64 per cent.',
  bestPortfolios: 'Employment and Workplace Relations 22 per cent, the National Indigenous Australians Agency 29 per cent.',
  source: 'ANAO Report No. 40 2024-25, tables 3.1 and A.1, loaded in grantscope as anao_mmr_exemptions',
} as const;

// ---------------------------------------------------------------------------
// Who buys. Channels first, because the channel is the reusable idea.

export interface BuyerChannel {
  id: string;
  label: string;
  what: string;
  /** How this kind of buyer actually buys. */
  method: 'direct' | 'panel' | 'tender' | 'grant-funded';
  examples: string;
  /** Whether Goods has ever actually sold to one of these. */
  proven: boolean;
}

/**
 * Twelve buyer roles exist in grantscope's schema. These six are the ones with a real route
 * for a bed, collapsed from that schema and from the Central Australian channel archetypes,
 * which are the sharper framing because they name the mechanism a bed actually travels down.
 */
export const BUYER_CHANNELS: readonly BuyerChannel[] = [
  {
    id: 'acchos', label: 'Aboriginal community controlled health organisations', method: 'direct',
    what: 'Health services buying bedding as health hardware from their own budget. The shortest line between a bed and the reason it exists.',
    examples: "Mala'la Health Service has already done it. Anyinginyi, Miwatj, Katherine West, Central Australian Aboriginal Congress, Danila Dilba, Sunrise, Urapuntja. The NT graph holds 37 health entities.",
    proven: true,
  },
  {
    id: 'housing-logistics', label: 'Housing and homelands service organisations', method: 'grant-funded',
    what: 'The organisations already paid to maintain remote houses. They have house access, trucks and a maintenance contract, which is the whole last mile.',
    examples: 'Regional Anangu Services, paid $62.6 million in housing-purpose awards. Tangentyere Council, running Alice Springs town camps. Tjuwanpa Outstation Resource Centre, which runs regular trips to homelands. Aboriginal Housing NT.',
    proven: false,
  },
  {
    id: 'councils', label: 'Remote councils and Aboriginal shires', method: 'tender',
    what: 'Regional councils with published tender portals and community lists. Several are themselves Aboriginal organisations.',
    examples: 'MacDonnell Regional Council has taken $44.1 million in federal contracts, Roper Gulf $22.2 million, Barkly $3.6 million. Palm Island Aboriginal Shire Council is an active Goods relationship. The NT graph holds 38 councils.',
    proven: false,
  },
  {
    id: 'schools', label: 'Schools and school councils', method: 'direct',
    what: 'Schools buying beds for the families of the children who attend them.',
    examples: 'Homeland School Company bought 40 beds and two washing machines at full price in 2026. Ntaria School Council is the only other named example anywhere in the record.',
    proven: true,
  },
  {
    id: 'stores', label: 'Community stores and retail networks', method: 'direct',
    what: 'The existing freight and retail spine into remote communities. A store that stocks a bed turns it into a shelf item.',
    examples: 'ALPA covers 128 communities. Outback Stores runs about 50 across the NT, WA and Queensland. The NT graph holds 37 stores.',
    proven: false,
  },
  {
    id: 'royalty', label: 'Royalty, trust and land council bodies', method: 'direct',
    what: 'Bodies distributing royalty and trust money into community benefit, who can simply decide to buy.',
    examples: 'Centrecorp Foundation has bought 167 beds across two invoices. The Aboriginals Benefit Account funds NT Aboriginal community infrastructure. Northern, Anindilyakwa and Tiwi land councils.',
    proven: true,
  },
];

// ---------------------------------------------------------------------------
// Named targets, from contracts that actually exist.

export interface RepeatBuyer {
  name: string;
  contracts: number;
  valueAud: number;
  years: string;
  note: string;
}

/**
 * Federal agencies with a real, repeated record of buying the things Goods makes. From the
 * grantscope repeat-buyer scan of 823,620 AusTender contracts: 10,626 goods-matching contracts
 * across 366 buyers, of which 31 have a housing, community, First Nations or local government
 * remit. These are the top of that shortlist.
 *
 * These are contracts AWARDED. None of them is an open opportunity and nobody here has been
 * approached.
 */
export const REPEAT_BUYERS: readonly RepeatBuyer[] = [
  { name: 'NT Infrastructure, Planning and Logistics: Housing Program Office', contracts: 91, valueAud: 211_957_652, years: '2021 to 2024', note: 'Includes remote housing maintenance for the Central Australia region. The single closest fit in the federal record.' },
  { name: 'NT Department of Housing', contracts: 36, valueAud: 39_172_650, years: 'to 2024', note: 'One of thirteen NT housing entities in the same lineage on the shortlist.' },
  { name: 'HealthShare NSW', contracts: 33, valueAud: 35_256_307, years: 'multi-year', note: 'One contract is titled, in full, "BEDS, MATTRESSES & COTS".' },
  { name: 'National Indigenous Australians Agency', contracts: 14, valueAud: 1_077_607, years: '2019 to 2026', note: 'Administers the Indigenous Procurement Policy, and exempts less than almost any other portfolio at 29 per cent.' },
  { name: 'NSW Aboriginal Housing Office', contracts: 2, valueAud: 497_842, years: 'multi-year', note: 'Small, and directly on point.' },
];

// ---------------------------------------------------------------------------
// Where Goods actually is.

/**
 * The honest baseline, read from the live communities table on 16 September 2026. Four of
 * thirty-one communities have a single procurement contact recorded. Two of those four have
 * already bought or hold product, which is the pattern worth growing.
 */
export const PROCUREMENT_STATE = {
  readAt: '2026-09-16',
  communities: 31,
  withProcurementContact: 4,
  withKeyPeople: 9,
  contacts: [
    { community: 'Tennant Creek', org: 'Julalikari Council Aboriginal Corporation', already: 'Holds two washing machines.' },
    { community: 'Maningrida', org: 'Homeland School Company', already: 'Bought 40 beds and two washing machines on INV-0303.' },
    { community: 'Palm Island', org: 'PICC', already: 'No purchase recorded.' },
    { community: 'Utopia Homelands', org: 'Urapuntja Aboriginal Corporation', already: 'No purchase recorded. Centrecorp bought for this place instead.' },
  ],
  sellerEntity: 'A Curious Tractor Pty Ltd',
  sellerIsIndigenousOwned: false,
  supplyNationStatus: 'Listed as self-registered only. Not certified. The 51 per cent ownership threshold deadline of 1 July 2026 passed with nothing recorded about what it cost.',
  source: 'communities table, v2; organisation.ts; compendium.ts',
} as const;

/** What has to be true for a community organisation to sell a bed. Nothing here is done. */
export const SELLER_PATHWAY: readonly { step: string; detail: string; state: 'none' | 'started' }[] = [
  { step: 'They own the stock', detail: 'Beds bought by philanthropy and handed over as stock the organisation owns outright. This is what the current ask does, and it is the only step with money behind it.', state: 'started' },
  { step: 'They are registered as a supplier', detail: 'Supply Nation registration is free. Certification requires 51 per cent Indigenous ownership, which these organisations already have and Goods does not.', state: 'none' },
  { step: 'They can answer a buyer', detail: 'A price, a lead time, an invoice and a delivery. Nothing in either repo covers helping an organisation build that, and it is the gap that matters most.', state: 'none' },
  { step: 'A buyer is introduced to them', detail: 'Goods holds the relationships. Handing one over is the moment the model either works or does not.', state: 'none' },
];

// ---------------------------------------------------------------------------
// THE NORTHERN TERRITORY, SPECIFICALLY.
//
// Researched 16 September 2026 from NT Government primary sources and live records on
// Quotations and Tenders Online. This section exists because the NT is where most of the work
// is, and because the federal contract scan pointed at a department that no longer exists.

/**
 * The first correction. "NT Department of Infrastructure, Planning and Logistics" is the buyer
 * name on 261 federal contracts worth $402 million, and it was renamed in September 2024. Worse
 * for our purposes, remote housing moved out of it entirely.
 */
export const NT_DEPARTMENTS = {
  wasCalled: 'Department of Infrastructure, Planning and Logistics (DIPL)',
  nowCalled: 'Department of Logistics and Infrastructure (DLI)',
  renamed: 'September 2024',
  housingMovedTo: 'Department of Housing, Local Government and Community Development (DHLGCD), established 10 September 2024',
  whoOwnsWhat: 'DHLGCD leads: it owns the remote housing program, the tenancies, the maintenance and the community relationship. DLI is the infrastructure delivery arm and runs construction procurement. Tenders for remote housing are now listed in DHLGCD’s name.',
  ministers: 'Bill Yan holds Logistics and Infrastructure and Housing Construction. Steve Edgington holds Housing, Local Government and Community Development, and Aboriginal Affairs. A bed is Edgington’s portfolio.',
  vacancy: 'DLI’s General Manager, Housing and Land Servicing was VACANT on the executive chart dated 14 September 2026. The construction-side executive who would own this relationship is not in post.',
  source: 'dli.nt.gov.au/about-us, dhlgcd.nt.gov.au/about-us, parliament.nt.gov.au/members/ministry, and the DLI executive chart of 14 September 2026',
} as const;

/**
 * The second correction, and the most useful fact in this file.
 *
 * NT procurement tiers were reformed on 1 October 2025. Tier 1 rose from $15,000 to $50,000,
 * and inside Tier 1 a government buyer may DIRECT PURCHASE from a Territory enterprise with no
 * quote process at all.
 *
 * At $750 a bed that is 66 beds bought with no tender and no competition. Tier 2 reaches
 * $200,000, which is 266 beds, on three quotes of which two must be Territory businesses.
 *
 * So the entire realistic first sale sits below the tender line. Everything this file says
 * about set-asides and three per cent targets matters later. This matters now.
 */
export const NT_TIERS = [
  { tier: 'Tier 1', upToAud: 50_000, beds: 66, process: 'One quote from a Territory business, or direct purchase from one. No tender.' },
  { tier: 'Tier 2', upToAud: 200_000, beds: 266, process: 'Three quotes, at least two from Territory businesses. No tender.' },
  { tier: 'Tier 3', upToAud: 500_000, beds: 666, process: 'Open public tender through Quotations and Tenders Online.' },
  { tier: 'Tier 4', upToAud: 5_000_000, beds: 6_666, process: 'Public tender, open at least six weeks if not previously forecast.' },
] as const;

export const NT_TIER_NOTE =
  'Values include GST. Reformed 1 October 2025: Tier 1 rose from $15,000 and Tier 2 from $100,000. Contractor Accreditation Limited is required for construction work and was marked "No" on every furniture, bedding and whitegoods tender checked, so it is not a barrier to supplying goods.';

/**
 * The set-aside that actually applies to remote housing. It is stronger than the Commonwealth
 * one: it names a preference order, where the Commonwealth names only a test.
 */
export const NT_ABE_PREFERENCE = {
  program: 'Our Community. Our Future. Our Homes., the delivery brand for the $4 billion remote housing agreement',
  order: [
    'Directly engage local or community-based Aboriginal Business Enterprises by select tender.',
    'Directly engage regional Aboriginal Business Enterprises by select tender.',
    'Engage Territory organisations through an open tender.',
  ],
  employment: 'A minimum of 40 per cent Aboriginal employment is required for work under the program, rising two per cent each financial year to a maximum of 48 per cent.',
  shortfall: 'Life of program, the actual figure is 33.0 per cent by headcount and 35.3 per cent by full-time equivalent, against a required minimum of 40 per cent. The program is missing its own target, so a supplier who lifts that number is solving a reported problem.',
  ownership: 'The housing program defines an Aboriginal Business Enterprise as 50 per cent or more Aboriginal owned or controlled, and an incorporated joint venture at 25 per cent or more. The NT Indigenous Business Network and Supply Nation both require 51 per cent. Structure at 51 per cent and all three are satisfied.',
  source: 'ourfuture.nt.gov.au/about-the-program/aboriginal-business-enterprises and the program progress page at 30 June 2026',
} as const;

/**
 * The NT’s own maintenance doctrine, which happens to name our two products in order. This is
 * their language, not ours, which is what makes it usable.
 */
export const NT_HEALTHY_LIVING = {
  first: 'Washing people',
  second: 'Washing clothes and bedding',
  note: 'The preventative repairs and maintenance program is built on the Housing for Health nine healthy living practices. A washing machine and washable bedding are practices one and two.',
  source: 'ourfuture.nt.gov.au/about-the-program/repairs-and-maintenance',
} as const;

/** The size of the thing, and the fight going on inside it. */
export const NT_PROGRAM = {
  headline: '$4 billion over ten years, 1 July 2024 to 30 June 2034, Commonwealth and NT, for remote Aboriginal housing.',
  target: 'Up to 2,700 new homes, to halve overcrowding.',
  progress: 'At 30 June 2026: 401 homes completed, 85 underway, 61 under procurement, and 343 still to be tendered. 1,508 bedrooms completed. Overcrowding has moved from 53.4 per cent to 49.6 per cent across 5,474 homes and 22,071 tenants.',
  addressable: 'Every one of those 1,508 completed bedrooms needs a bed, and 343 homes have not been tendered yet.',
  dispute: 'In August 2026 the ABC reported the two governments deadlocked, about $330 million of Commonwealth funding withheld, and the NT Government seeking to cut the 2,700-home target to 1,800 or 1,100, with money redirected to land servicing at $300,000 to $600,000 a block. A $750 bed made on Country sits on the right side of a fight about cost per house.',
  source: 'federalfinancialrelations.gov.au, ourfuture.nt.gov.au program progress, abc.net.au 13 August 2026',
} as const;

export interface NtBenchmark {
  what: string;
  detail: string;
  aboriginalOwned: boolean | null;
  source: string;
}

/** What is already being bought, and by whom. Primary award records. */
export const NT_BENCHMARKS: readonly NtBenchmark[] = [
  {
    what: 'The live bedding period contract',
    detail: 'NTG25-0134, supply and delivery of foam mattresses, bedding and linen for 36 months, awarded 4 June 2026 at estimated unit rates of $4,539,279 to Keep Moving Pty Ltd of Berrimah. A Territory enterprise, not an Aboriginal one. It re-tenders around late 2028. Nine other firms bid and the list is public.',
    aboriginalOwned: false,
    source: 'Quotations and Tenders Online, tender 25704. Buyer is Corrections, not Housing.',
  },
  {
    what: 'An Aboriginal-owned NT firm already supplying washing machines',
    detail: 'RIDEM Pty Ltd trading as Dexter Barnes Electrical, of Tennant Creek, won supply, delivery, installation and commissioning of two washing machines at the Barkly Work Camp for $42,720 in January 2025. The public record flags it Aboriginal Enterprise: Yes. This is proof of concept in our largest community, and a potential installer or channel partner.',
    aboriginalOwned: true,
    source: 'Quotations and Tenders Online, tender 24702, listed by DLI',
  },
  {
    what: 'How remote-community furniture is actually bought',
    detail: 'Household furniture and whitegoods for two houses at Borroloola and Wadeye went to JAPE Furniture and Katherine Betta Home Living for $11,203 and $17,861, as a Tier 2 quote by selected invitation. House by house, by invitation. There is no central door to knock on, which cuts both ways.',
    aboriginalOwned: false,
    source: 'Quotations and Tenders Online, tender 7631',
  },
  {
    what: 'A sole-supplier precedent for a specified bed',
    detail: 'The NT bought Cortech Endurance 2.0 bed frames for youth justice by select quote from a single supplier, because that bed alone met the functional requirement. $387,356 in July 2023. A remote-rated, non-rusting, no-fabric-frame bed can be specified the same way.',
    aboriginalOwned: false,
    source: 'Quotations and Tenders Online, tender 22556',
  },
];

/** Named, current and contactable. Nobody here has been approached. */
export const NT_CONTACTS: readonly { who: string; role: string; contact: string; why: string }[] = [
  {
    who: 'Tom Harris',
    role: 'Territory Procurement Champion',
    contact: 'procurement.champion@nt.gov.au, 08 8999 7799',
    why: 'Appointed 1 November 2025 to engage local industry and identify barriers to participation, at arm’s length from the agencies. An Aboriginal-owned remote manufacturer who cannot get onto a mattress period contract is the exact systemic barrier the role was created to surface. Best single cold contact.',
  },
  {
    who: 'Contract and Procurement Services',
    role: 'The office named on every NT tender record',
    contact: 'capsassist.ntg@nt.gov.au, Darwin 08 8999 1919, Alice Springs 08 8951 6458',
    why: 'Where to ask who the executive directors are, since DHLGCD publishes those titles without names.',
  },
  {
    who: 'NT Indigenous Business Network',
    role: 'The NT Government’s recognised peak body and primary certifying body for Aboriginal Business Enterprises',
    contact: 'admin@ntibn.com.au, 1300 192 164',
    why: 'Certification at 51 per cent. Provisional certification is available while a business transitions to majority Aboriginal ownership, which is the live question for the entity that sells.',
  },
  {
    who: 'DLI procurement advice',
    role: 'Forward procurement plans, updated monthly',
    contact: 'procurementadvice.dli@nt.gov.au',
    why: 'The housing infrastructure procurement plan currently lists Galiwinku at Tier 5 committing around October 2026, and Groote Eylandt advertising around February 2027.',
  },
];

/**
 * A claim Goods uses that could not be sourced. Recorded here, so a funder is not the one who
 * discovers it.
 */
export const NT_UNSOURCED = {
  claim: 'One Alice Springs provider sells about $3 million a year of washing machines into remote communities, most of which are in dumps within months.',
  where: 'CLAUDE.md, and used as context for why the washing machine exists.',
  finding: 'A dedicated search of NT award records, company sites and trade press could not name any company at that scale, and could neither confirm nor rule out Retravision, Betta Home Living, Peter Kittle, Carla Furnishers or the rest. The claim currently rests on network knowledge.',
  action: 'Ground it or stop printing it before it goes in front of a funder.',
} as const;

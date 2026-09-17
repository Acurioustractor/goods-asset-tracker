/**
 * Goods on Country — Outreach Targets
 *
 * Synced from grantscope workspace intelligence.
 * Last synced: March 16, 2026
 */

export type TargetCategory =
  | 'philanthropy_active'
  | 'philanthropy_pipeline'
  | 'philanthropy_prospect'
  | 'aboriginal_trust'
  | 'government_grant'
  | 'impact_finance'
  | 'corporate'
  | 'health_buyer'
  | 'procurement_buyer'
  | 'paid_buyer'
  | 'distribution_partner'
  | 'community_partner'
  | 'manufacturing_partner';

export type RelationshipStatus = 'active' | 'warm' | 'applied' | 'prospect' | 'research';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

/**
 * How solid the evidence behind an entry actually is. Ben, 17 Sep 2026: every prospect needs
 * this or it silently reads as confirmed. 'real_contactable' = a named program with a live
 * contact point. 'needs_call' = a real org, unverified fit or no confirmed fund. 'dropped' =
 * researched and ruled out; kept here so nobody re-researches it, never shown as a live lead.
 */
export type EvidenceTier = 'real_contactable' | 'needs_call' | 'dropped';

/** Outreach progress, distinct from RelationshipStatus (which is the funding-relationship stage). */
export type ContactStatus = 'not_contacted' | 'contacted' | 'responded' | 'open' | 'dead';

export interface OutreachTarget {
  id: string;
  name: string;
  category: TargetCategory;
  status: RelationshipStatus;
  priority: Priority;
  states?: string[];
  /** Canonical community ids this org is linked to, e.g. 'utopia', 'maningrida', 'tennant-creek', 'palm-island', 'groote'. */
  communities?: string[];
  contactName?: string;
  contactEmail?: string;
  amountSignal?: string;
  instrument?: string;
  nextAction: string;
  grantRelevance: string;
  notes?: string;
  evidenceTier?: EvidenceTier;
  contactStatus?: ContactStatus;
}

// ─── PHILANTHROPY — Active Funders ───────────────────────────────────────────

export const philanthropyActive: OutreachTarget[] = [
  {
    id: 'snow', name: 'Snow Foundation', category: 'philanthropy_active', status: 'active', priority: 'critical',
    communities: ['maningrida'], contactName: 'Sally Grimsley-Ballard', contactEmail: 's.grimsley-ballard@snowfoundation.org.au',
    amountSignal: '$457,929.79 Goods-specific inc-GST (16 Sep 2026 reconciliation); also a direct buyer separately: 10+100 beds and 2 washers on paid invoices',
    instrument: 'grant + buyer',
    nextAction: 'Convert from anchor grantmaker into co-investment validator for production-scale capital.',
    grantRelevance: 'Anchor funder — reference in every application. Sally travelled to Tennant Creek.',
    evidenceTier: 'real_contactable',
  },
  {
    id: 'frrr', name: 'FRRR', category: 'philanthropy_active', status: 'active', priority: 'high',
    amountSignal: '$50K received via Backing the Future (locating Xero record)', instrument: 'grant',
    nextAction: 'Position next ask around remote-community proof. Explore other FRRR programs.',
    grantRelevance: 'Validates remote community focus. Strong reference for other rural/regional funders.',
  },
  {
    id: 'vfff', name: 'Vincent Fairfax Family Foundation', category: 'philanthropy_active', status: 'active', priority: 'high',
    amountSignal: '$50K received (Xero-verified)', instrument: 'grant',
    nextAction: 'Reconnect around youth jobs, community ownership, and governance maturity.',
    grantRelevance: 'Youth + governance focus aligns with community-owned production narrative.',
  },
  {
    id: 'tfn', name: 'The Funding Network', category: 'philanthropy_active', status: 'active', priority: 'medium',
    amountSignal: '$130K received (Sept 2025 pitch; sits in ACT-CE, reconcile)', instrument: 'grant',
    nextAction: 'Maintain relationship. Network connections are valuable.',
    grantRelevance: 'Largest single raise. Demonstrates pitch capability and donor confidence.',
  },
  {
    id: 'amp', name: 'AMP Spark', category: 'philanthropy_active', status: 'active', priority: 'medium',
    amountSignal: '$21.9K received (locating Xero record)', instrument: 'program',
    nextAction: 'Check for renewal or alumni network opportunities.',
    grantRelevance: 'Social enterprise accelerator credential.',
  },
];

// ─── PHILANTHROPY — Pipeline ─────────────────────────────────────────────────

export const philanthropyPipeline: OutreachTarget[] = [
  {
    id: 'snow-4', name: 'Snow Foundation Round 4', category: 'philanthropy_pipeline', status: 'applied', priority: 'critical',
    contactName: 'Sally Grimsley-Ballard', amountSignal: 'FY26 Scale-Up $132K paid (INV-0321, May 2026)', instrument: 'grant',
    nextAction: 'Follow up on Q1 2026 proposal status.',
    grantRelevance: 'If approved, validates production-scale thesis for other funders.',
  },
  {
    id: 'qbe', name: 'QBE Foundation', category: 'philanthropy_pipeline', status: 'applied', priority: 'high',
    instrument: 'grant',
    nextAction: 'Await response. Prepare for interview/site visit if shortlisted.',
    grantRelevance: 'Corporate foundation — adds diversity to funder mix.',
  },
  {
    id: 'real', name: 'REAL Innovation Fund (DEWR)', category: 'government_grant', status: 'applied', priority: 'critical',
    amountSignal: '$2.4M total ($1.2M Townsville + $1.2M Alice Springs over 3 years)', instrument: 'federal grant',
    nextAction: 'EOI submitted Mar 2. Confirm full-application status, lead entities, and whether both Townsville and Alice Springs remain in scope.',
    grantRelevance: 'Federal recognition. Two place-based production and jobs pathways: Townsville / North Queensland and Alice Springs / Central Australia.',
  },
  {
    id: 'sedg', name: 'Social Enterprise Development Grants', category: 'government_grant', status: 'applied', priority: 'medium',
    amountSignal: '$75K', instrument: 'grant',
    nextAction: 'Draft at 82% fit. Complete and submit.',
    grantRelevance: 'Social enterprise capability building.',
  },
  {
    id: 'minderoo', name: 'Minderoo Foundation', category: 'philanthropy_pipeline', status: 'warm', priority: 'high',
    contactName: 'Lucy Stronach', instrument: 'catalytic',
    nextAction: 'Approach as scale and systems-change backer. 20 comms logged. Sally recommended.',
    grantRelevance: 'Systems-change funder. Would validate at-scale thesis.',
  },
  {
    id: 'tim-fairfax', name: 'Tim Fairfax Family Foundation', category: 'philanthropy_pipeline', status: 'warm', priority: 'high',
    contactName: 'Katie Norman', instrument: 'grant',
    nextAction: '33 comms logged. QLD focus — lead with Palm Island proof.',
    grantRelevance: 'QLD-focused. Palm Island is strongest QLD proof point.',
  },
  {
    id: 'dusseldorp', name: 'Dusseldorp Forum', category: 'philanthropy_pipeline', status: 'warm', priority: 'medium',
    instrument: 'grant',
    nextAction: 'Meeting held Oct 2025. Follow up with updated impact data.',
    grantRelevance: 'Justice reinvestment angle.',
  },
];

// ─── IMPACT FINANCE ──────────────────────────────────────────────────────────

export const impactFinance: OutreachTarget[] = [
  {
    id: 'sefa', name: 'SEFA Partnerships Limited', category: 'impact_finance', status: 'warm', priority: 'critical',
    contactName: 'Joel Bird', amountSignal: '$500K social impact loan target', instrument: 'loan',
    nextAction: 'Package Snow-backed blended-capital ask. 23 comms logged.',
    grantRelevance: 'Debt readiness validates commercial viability to other funders.',
  },
  {
    id: 'pfi', name: 'PFI (QLD Partnering for Impact)', category: 'impact_finance', status: 'applied', priority: 'critical',
    amountSignal: '$640K repayable', instrument: 'repayable grant',
    contactEmail: 'PFIFund@treasury.qld.gov.au',
    nextAction: 'EOI was due Mar 15 — confirm submission status.',
    grantRelevance: 'QLD Treasury. Repayable = commercial signal.',
  },
  {
    id: 'giant-leap', name: 'Giant Leap', category: 'impact_finance', status: 'prospect', priority: 'medium',
    instrument: 'impact VC',
    nextAction: 'Sally recommended. Approach when ready for equity conversation.',
    grantRelevance: 'Impact VC interest validates investable social enterprise thesis.',
  },
];

// ─── ABORIGINAL TRUSTS ───────────────────────────────────────────────────────

export const aboriginalTrusts: OutreachTarget[] = [
  {
    id: 'centrecorp-foundation', name: 'Centrecorp Foundation', category: 'aboriginal_trust', status: 'active', priority: 'critical',
    states: ['NT'], communities: ['utopia'], amountSignal: '107 beds paid ($123,332), delivered; further 107-bed repeat order quoted ($80,250, in discussion)', instrument: 'buyer',
    nextAction: 'Close the repeat 107-bed order. Only genuine repeat institutional buyer to date.',
    grantRelevance: 'Aboriginal investment arm. Already connected to Utopia/Centrebuild pathway.',
    evidenceTier: 'real_contactable', contactStatus: 'open',
  },
  {
    id: 'groote-trust', name: 'Groote Eylandt Aboriginal Trust', category: 'aboriginal_trust', status: 'prospect', priority: 'critical',
    communities: ['groote'],
    states: ['NT'], amountSignal: 'High annual giving', instrument: 'grant',
    nextAction: 'Use Groote demand signal (500 mattresses + 300 washers) for place-based production ask.',
    grantRelevance: 'Direct community trust. Largest single demand signal in pipeline.',
  },
  {
    id: 'central-aus-trust', name: 'Central Australian Aboriginal Charitable Trust', category: 'aboriginal_trust', status: 'prospect', priority: 'high',
    states: ['NT'], instrument: 'grant',
    nextAction: 'Position as regional Aboriginal capital holder to underwrite community-owned production.',
    grantRelevance: 'NT/Central Australia focus. Community production alignment.',
  },
  {
    id: 'general-gumala', name: 'General Gumala Foundation Trust', category: 'aboriginal_trust', status: 'prospect', priority: 'medium',
    states: ['WA'], amountSignal: 'High annual giving', instrument: 'grant',
    nextAction: 'Test as WA-linked Indigenous production partner. Kalgoorlie proof point.',
    grantRelevance: 'WA expansion. Indigenous community trust with substantial giving.',
  },
];

// ─── PHILANTHROPY — Prospects ────────────────────────────────────────────────

export const philanthropyProspects: OutreachTarget[] = [
  {
    id: 'rio-tinto', name: 'Rio Tinto Foundation', category: 'philanthropy_prospect', status: 'prospect', priority: 'high',
    instrument: 'co-investment',
    nextAction: 'Position Goods as remote manufacturing and jobs platform.',
    grantRelevance: 'High annual giving. Indigenous + employment focus.',
  },
  {
    id: 'fortescue', name: 'Fortescue Foundation', category: 'philanthropy_prospect', status: 'prospect', priority: 'high',
    instrument: 'co-investment',
    nextAction: 'Lead with remote jobs, recycled material use, and durable community-owned production.',
    grantRelevance: 'Real Zero + community investment. Indigenous employment focus.',
  },
  {
    id: 'acf', name: 'Australian Communities Foundation', category: 'philanthropy_prospect', status: 'prospect', priority: 'medium',
    instrument: 'collective giving',
    nextAction: 'Explore collective giving model. Community-led solutions alignment.',
    grantRelevance: 'Collective giving = many small donors. Good for recurring support.',
  },
  {
    id: 'circular-future', name: 'Circular Future Fund / Planet Ark', category: 'philanthropy_prospect', status: 'research', priority: 'medium',
    instrument: 'grant',
    nextAction: 'Research eligibility. Strong circular economy fit.',
    grantRelevance: 'Environmental angle. 3,460kg+ plastic diverted (Stretch beds only).', // canonical: see asset-canonical.ts (Stretch beds only)
  },
  {
    id: 'self-loan', name: 'SELF (Social Enterprise Loan Fund)', category: 'impact_finance', status: 'research', priority: 'medium',
    instrument: 'loan',
    nextAction: 'Complements SEFA. Research terms and eligibility.',
    grantRelevance: 'Additional debt pathway. Validates commercial readiness.',
  },
];

// ─── GOVERNMENT PROGRAMS ─────────────────────────────────────────────────────

export const governmentPrograms: OutreachTarget[] = [
  {
    id: 'sedi', name: 'Social Enterprise Development Initiative', category: 'government_grant', status: 'prospect', priority: 'high',
    instrument: 'grant',
    nextAction: 'Frame as capability-building complement to debt and philanthropy.',
    grantRelevance: 'Australian Government social enterprise program. Explicit fit.',
  },
  {
    id: 'nt-gov', name: 'NT Government', category: 'government_grant', status: 'warm', priority: 'medium',
    states: ['NT'], contactName: 'Anna Philip', contactEmail: 'anna.philip2@nt.gov.au',
    nextAction: 'Check-in meeting held Jan 2026. Follow up with updated deployment data.',
    grantRelevance: 'State government backing validates scale.',
  },
  {
    id: 'ndis-pathway', name: 'NDIS Assistive Technology', category: 'government_grant', status: 'research', priority: 'medium',
    instrument: 'procurement',
    nextAction: 'Research whether Stretch Bed qualifies as assistive technology.',
    grantRelevance: 'Recurring procurement channel. Large market.',
  },
];

// ─── HEALTH BUYERS ───────────────────────────────────────────────────────────

export const healthBuyers: OutreachTarget[] = [
  {
    id: 'anyinginyi', name: 'Anyinginyi Health Aboriginal Corporation', category: 'health_buyer', status: 'warm', priority: 'critical',
    states: ['NT'], contactName: 'Tony',
    nextAction: 'Build Anyinginyi-specific case linking beds, washers, and community-production employment outcomes.',
    grantRelevance: '5 washers deployed. Health outcomes tracking. Quote for 4 more sent Feb 2026.',
  },
  {
    id: 'miwatj', name: 'Miwatj Health Aboriginal Corporation', category: 'health_buyer', status: 'warm', priority: 'critical',
    states: ['NT'], contactName: 'Jessica Allardyce',
    nextAction: 'Package Goods as health-hardware procurement line for RHD prevention. Explore fleet deployment across 8 clinics.',
    grantRelevance: 'East Arnhem. RHD prevention angle. Fleet deployment = recurring orders.',
  },
  {
    id: 'purple-house', name: 'Purple House', category: 'health_buyer', status: 'warm', priority: 'medium',
    states: ['NT'],
    nextAction: 'Dialysis patients need quality beds. Explore procurement pathway.',
    grantRelevance: 'Chronic disease management. Bed quality → health outcomes.',
  },
  {
    id: 'red-dust', name: 'Red Dust', category: 'health_buyer', status: 'warm', priority: 'medium',
    states: ['NT'],
    nextAction: 'Health partner relationship. Explore co-funding or procurement.',
    grantRelevance: 'Darwin-based health org. NT credibility.',
  },
];

// ─── PROCUREMENT BUYERS ──────────────────────────────────────────────────────

export const procurementBuyers: OutreachTarget[] = [
  {
    id: 'centrebuild', name: 'Centrebuild Pty Ltd', category: 'procurement_buyer', status: 'active', priority: 'critical',
    states: ['NT'], amountSignal: '109 beds sold. 107-bed Utopia pathway active.',
    nextAction: 'Lock repeat-order conversation tied to Utopia. Use as proof in every buyer conversation.',
    grantRelevance: 'Strongest commercial signal. Proves market exists.',
  },
  {
    // Ben, 15 Sep 2026: the "500 mattresses + 300 washers" figure below is WITHDRAWN as
    // fabricated demand (see memory goods-money-rulings-2026-09-15). Never restate it. Kept as
    // a contact record only, not a demand signal, until a real number is sourced.
    id: 'whsac-groote', name: 'WHSAC (Groote Archipelago)', category: 'procurement_buyer', status: 'prospect', priority: 'medium',
    states: ['NT'], communities: ['groote'], contactName: 'Simone Grimmond',
    nextAction: 'Re-establish real demand with WHSAC directly. Do not cite the withdrawn 500/300 figure.',
    grantRelevance: 'Groote Eylandt health service. Contact exists, demand signal does not.',
    evidenceTier: 'needs_call',
  },
  {
    id: 'outback-stores', name: 'Outback Stores Pty Ltd', category: 'procurement_buyer', status: 'prospect', priority: 'high',
    states: ['NT', 'QLD', 'WA', 'SA'],
    nextAction: 'Prepare stock-and-service pitch for pilot in 2–3 remote stores with freight and repair logic.',
    grantRelevance: 'Remote retail network. National reach. If converted, proves distribution model.',
  },
  {
    id: 'alpa', name: 'Arnhem Land Progress Aboriginal Corporation', category: 'procurement_buyer', status: 'prospect', priority: 'high',
    states: ['NT'],
    nextAction: 'Test pilot pitch around replacement demand, washer serviceability, and local assembly.',
    grantRelevance: 'Aboriginal-owned stores. Deep Arnhem Land footprint. Community trust.',
  },
  {
    id: 'tangentyere', name: 'Tangentyere Council Aboriginal Corporation', category: 'procurement_buyer', status: 'prospect', priority: 'medium',
    states: ['NT'],
    nextAction: 'Lead with dignity, floor-sleeping reduction, and practical household durability for town camps.',
    grantRelevance: 'Housing/community services. Central Australian reach.',
  },
  {
    id: 'west-arnhem', name: 'West Arnhem Regional Council', category: 'procurement_buyer', status: 'prospect', priority: 'medium',
    states: ['NT'],
    nextAction: 'Approach via regional service and local jobs framing.',
    grantRelevance: 'Regional government. Multiple remote communities.',
  },
  {
    id: 'qic', name: 'QIC', category: 'corporate', status: 'warm', priority: 'medium',
    states: ['QLD'], amountSignal: '50-bed staff-build interest (NAIDOC)',
    nextAction: 'Convert 50-bed NAIDOC-style build into visible corporate procurement case study.',
    grantRelevance: 'Corporate engagement proof. Staff activation model.',
  },
];

// ─── PAID BUYERS ──────────────────────────────────────────────────────────────
// Real Xero-invoiced bed/washer trade, traced 16-17 Sep 2026. Centrecorp and QIC also appear
// above under their historical categories; these are the reconciled invoice-level records.
// Do not treat this list as "320 beds, four buyers" — that figure is unsourced in this repo
// (traces to a module that never merged). This is the real, evidenced set instead.

export const paidBuyers: OutreachTarget[] = [
  {
    id: 'homeland-school-company', name: 'Homeland School Company', category: 'paid_buyer', status: 'active', priority: 'high',
    communities: ['maningrida'], states: ['NT'],
    amountSignal: '40 Stretch Beds + 2 washers, $44,000 (INV-0303, paid 18 May 2026)',
    nextAction: 'Capture feedback in their own words; no testimonial on file yet.',
    grantRelevance: 'Clean, paid, cross-product buyer.',
    evidenceTier: 'real_contactable', contactStatus: 'open',
  },
  {
    id: 'malala-health', name: "Mala'la Health Service Aboriginal Corporation", category: 'paid_buyer', status: 'active', priority: 'medium',
    communities: ['maningrida'], states: ['NT'],
    amountSignal: '13 Basket Beds, $4,940 + GST (INV-0283, paid 21 Oct 2025)',
    nextAction: 'Note for invoicing: this contact carries "Mala\'la", not "Maningrida" — caused months of undertracing once already.',
    grantRelevance: 'Bed-only, no washer. Real paid trade.',
    evidenceTier: 'real_contactable',
  },
  {
    id: 'julalikari-council', name: 'Julalikari Council Aboriginal Corporation', category: 'paid_buyer', status: 'active', priority: 'high',
    communities: ['tennant-creek'], states: ['NT'],
    amountSignal: '6 washers across two orders ($4,500 INV-0282 + $5,800 INV-0335, ~$10,300); beds delivered separately',
    nextAction: 'Only other genuine repeat buyer besides Centrecorp — worth understanding why they came back.',
    grantRelevance: 'Repeat buyer across two product lines.',
    evidenceTier: 'real_contactable', contactStatus: 'open',
  },
  {
    id: 'our-community-shed', name: 'Our Community Shed', category: 'paid_buyer', status: 'warm', priority: 'medium',
    amountSignal: '30 Basket Beds ($450 incl) + 1 washer ($5,500, INV-0308)',
    nextAction: 'One-off cross-product buyer; find out if repeatable.',
    grantRelevance: 'Small but genuine cross-product order.',
    evidenceTier: 'real_contactable',
  },
  {
    id: 'red-dust-buyer', name: 'Red Dust (as buyer)', category: 'paid_buyer', status: 'warm', priority: 'low',
    amountSignal: '30 Basket Beds v1, $430 (INV-0255)',
    nextAction: 'One-off. Red Dust is also a health partner — worth a combined conversation.',
    grantRelevance: 'Existing health partner, separate buying relationship.',
    evidenceTier: 'real_contactable',
  },
  {
    id: 'qic-rap-buyer', name: 'QIC (RAP purchase)', category: 'paid_buyer', status: 'warm', priority: 'medium',
    states: ['QLD'],
    amountSignal: '20 beds @ $450 through their RAP (INV-0232, Jun 2025)',
    nextAction: 'Separate from the QIC "50-bed NAIDOC build interest" entry above — this is a real invoiced order.',
    grantRelevance: 'Corporate RAP-driven purchase, real precedent.',
    evidenceTier: 'real_contactable',
  },
  {
    id: 'rotary-eclub-outback', name: 'Rotary eClub Outback Australia', category: 'paid_buyer', status: 'warm', priority: 'low',
    amountSignal: '200 Basket Beds + $5K project, $82,500 (INV-0222) — AUTHORISED but 405 days overdue',
    nextAction: 'Collections issue, not a sales proof point. Chase payment before citing as "sold".',
    grantRelevance: 'Largest single order by volume, but unpaid.',
    evidenceTier: 'needs_call', contactStatus: 'open',
  },
  {
    id: 'regional-arts-australia', name: 'Regional Arts Australia', category: 'paid_buyer', status: 'warm', priority: 'low',
    amountSignal: '$16,500 invoiced (INV-0302), due 30 Jun 2026, not yet paid',
    nextAction: 'Confirm payment.',
    grantRelevance: 'Receivable, not yet proof.',
    evidenceTier: 'needs_call', contactStatus: 'open',
  },
];

// ─── PHILANTHROPIC PROSPECTS — Centrecorp-shaped intermediaries, researched 17 Sep 2026 ───────
// Two research rounds looking for orgs that buy product and gift it into community the way
// Centrecorp does, rather than orgs bound by a procurement rule. Every entry WebSearch-verified;
// nothing invented. 'dropped' entries are kept so nobody re-researches them.

export const philanthropicProspects20260917: OutreachTarget[] = [
  {
    id: 'barkly-local-community-projects-fund', name: 'Barkly Local Community Projects Fund', category: 'government_grant', status: 'prospect', priority: 'critical',
    communities: ['tennant-creek'], states: ['NT'],
    contactEmail: 'info@barkly.nt.gov.au',
    amountSignal: '$6M program, up to $50K/project, explicitly for Aboriginal homelands across the Barkly region (excludes Tennant Creek township itself)',
    nextAction: 'Apply — has a live application form at barklyregionaldeal.com.au. Best-evidenced lead found.',
    grantRelevance: 'Barkly Regional Deal funding line, real and open.',
    evidenceTier: 'real_contactable', contactStatus: 'not_contacted',
  },
  {
    id: 'ian-potter-foundation', name: 'Ian Potter Foundation', category: 'philanthropy_prospect', status: 'prospect', priority: 'critical',
    communities: ['tennant-creek', 'maningrida'],
    amountSignal: 'Proven category fit: $300,000 to the Wilya Janta remote housing design project (Tennant Creek) + funded the Gunbalanya commercial laundry',
    nextAction: 'Warm approach via Wilya Janta relationship, not cold — they already fund exactly this category in towns we work in.',
    grantRelevance: 'Strongest new philanthropic find: proven precedent, same regions.',
    evidenceTier: 'real_contactable', contactStatus: 'not_contacted',
  },
  {
    id: 'south32-gemco', name: 'South32 GEMCO', category: 'corporate', status: 'prospect', priority: 'high',
    communities: ['groote'], states: ['NT'],
    amountSignal: '~$900K partnership with the Machado Joseph Disease Foundation funding medical equipment/remote service delivery; joint "Future Groote Strategy" with Anindilyakwa Land Council',
    nextAction: 'Approach via the existing Groote Eylandt Aboriginal Trust relationship — same region, a second door in.',
    grantRelevance: 'Already funds health hardware directly, same region as an existing prospect.',
    evidenceTier: 'real_contactable', contactStatus: 'not_contacted',
  },
  {
    id: 'bunnings-community-grants', name: 'Bunnings Community Grants Program', category: 'corporate', status: 'prospect', priority: 'high',
    amountSignal: '$1M over 5 years, grants up to $10,000, ABN-registered NFPs',
    contactEmail: 'CommunityGrants@bunnings.com.au',
    nextAction: 'Applications close 19 Oct 2026 (AEDT) — check our NFP/ABN eligibility structure before applying.',
    grantRelevance: 'Live, open now, real contact — fastest-moving lead in the list.',
    evidenceTier: 'real_contactable', contactStatus: 'not_contacted',
  },
  {
    id: 'glencore-csi-fund', name: 'Glencore Corporate Social Investment Fund (Mount Isa)', category: 'corporate', status: 'prospect', priority: 'medium',
    states: ['QLD'],
    amountSignal: '$840K across 60 community initiatives in 2025; Indigenous Employment Program via Myuma Group (Camooweal)',
    nextAction: 'Mount Isa is a regional hub, not one of the four core partner communities — treat as adjacent, not a direct fit yet.',
    grantRelevance: 'Largest, most active CSI fund found; needs a hub-relevance case.',
    evidenceTier: 'real_contactable', contactStatus: 'not_contacted',
  },
  {
    id: 'cwa-branches', name: 'CWA branches (Tennant Creek, Katherine, Alice Springs)', category: 'philanthropy_prospect', status: 'prospect', priority: 'low',
    communities: ['tennant-creek'],
    amountSignal: 'Small local welfare-fundraising branches; Tennant Creek marked 90th anniversary 12 Sep 2026',
    nextAction: 'A call, not an application — unlikely to fund at scale but could gift individual units.',
    grantRelevance: 'Real, contactable, small.',
    evidenceTier: 'needs_call', contactStatus: 'not_contacted',
    notes: 'Tennant Creek: 1st Sat 1:30pm, CWA Hall Noble St, President Pene Curtis. Katherine: 1st Sat 10am, President Amanda Kelly. Alice Springs: 2nd Thu 6:30pm, President Yvette Valentine.',
  },
  {
    id: 'rotary-tennant-katherine', name: 'Rotary Club of Tennant Creek / Katherine', category: 'philanthropy_prospect', status: 'prospect', priority: 'low',
    communities: ['tennant-creek'],
    amountSignal: 'Katherine: $23,598 documented in NT 2023-24 grants appendix',
    nextAction: 'Real presence confirmed, no bed/hardware funding history verified yet — needs a direct approach.',
    grantRelevance: 'Small but real, adjacent to Rotary eClub Outback Australia relationship already in the buyer list.',
    evidenceTier: 'needs_call', contactStatus: 'not_contacted',
  },
  {
    id: 'paul-ramsay-foundation', name: 'Paul Ramsay Foundation', category: 'philanthropy_prospect', status: 'prospect', priority: 'medium',
    amountSignal: '$6M First Nations Targeted Grant round, up to $500K each, covers NT/Torres Strait/Tas/regional-remote SA & Qld',
    nextAction: 'Capacity-building framing, not itemised hardware — would need reshaping to fit a bed/washer ask.',
    grantRelevance: 'Real and large, but fit is not proven for direct product funding.',
    evidenceTier: 'needs_call', contactStatus: 'not_contacted',
  },
  {
    id: 'arac-anindilyakwa-trust', name: 'ARAC / Anindilyakwa Mining Trust', category: 'aboriginal_trust', status: 'prospect', priority: 'medium',
    communities: ['groote'], states: ['NT'],
    amountSignal: 'Distributes ALC mining royalties to community/economic-development orgs on Groote',
    nextAction: 'Governance caution: 2024 ABC/ANAO reporting flagged concerns (royalties into a related mining company) — check current leadership before approach.',
    grantRelevance: 'Real entity, real money, real risk flag.',
    evidenceTier: 'needs_call', contactStatus: 'not_contacted',
  },
  {
    id: 'gulf-aboriginal-development-corp', name: 'Gulf Aboriginal Development Corporation (GADC)', category: 'aboriginal_trust', status: 'research', priority: 'low',
    amountSignal: 'Successor body from the old MMG Century Mine Gulf Communities Agreement (ADBT, ~$1.2M/yr at peak, now historical)',
    nextAction: 'Unresearched — surfaced from MMG history, not yet checked for current activity.',
    grantRelevance: 'New lead, unverified.',
    evidenceTier: 'needs_call', contactStatus: 'not_contacted',
  },
  // ── Dropped, researched and ruled out — kept so nobody re-researches them ──
  {
    id: 'dropped-west-arnhem-fund', name: 'West Arnhem Regional Council (discretionary fund)', category: 'government_grant', status: 'research', priority: 'low',
    communities: ['maningrida'],
    amountSignal: 'No discretionary community-grants line found on westarnhem.nt.gov.au',
    nextAction: 'Council itself is still a relationship worth having (covers Maningrida directly) — just not as a funding line.',
    grantRelevance: 'Dropped as a fund; kept as a relationship contact.',
    evidenceTier: 'dropped',
  },
  {
    id: 'dropped-palm-island-benefit-fund', name: 'Palm Island Aboriginal Shire Council (benefit fund)', category: 'government_grant', status: 'research', priority: 'low',
    communities: ['palm-island'],
    amountSignal: 'DOGIT confirmed (land-tenure mechanism) but no discretionary cash benefit-fund program found',
    nextAction: 'Dropped as a funding lead.',
    grantRelevance: 'No evidence.',
    evidenceTier: 'dropped',
  },
  {
    id: 'dropped-apunipima-brokerage', name: 'Apunipima Cape York Health Council (client brokerage)', category: 'health_buyer', status: 'research', priority: 'low',
    amountSignal: 'No client-brokerage or household-hardware fund confirmed',
    nextAction: 'Dropped.',
    grantRelevance: 'No evidence found.',
    evidenceTier: 'dropped',
  },
  {
    id: 'dropped-fred-hollows', name: 'Fred Hollows Foundation', category: 'philanthropy_prospect', status: 'research', priority: 'low',
    amountSignal: 'Funded programs found are eye health/trachoma only, not household goods',
    nextAction: 'Dropped as a direct funder. The "health hardware" framing itself (their own term) is reusable in our messaging.',
    grantRelevance: 'No direct fit; messaging borrow only.',
    evidenceTier: 'dropped',
  },
  {
    id: 'dropped-ilsc', name: 'Indigenous Land and Sea Corporation (ILSC)', category: 'government_grant', status: 'research', priority: 'low',
    amountSignal: '"Our Country Our Future" program is land/water acquisition only',
    nextAction: 'Dropped.',
    grantRelevance: 'No household-item grant stream found.',
    evidenceTier: 'dropped',
  },
  {
    id: 'dropped-newmont-mmg-gulf', name: 'Newmont / MMG (Gulf region community funds)', category: 'corporate', status: 'research', priority: 'low',
    amountSignal: 'Newmont has no active Qld Gulf operations; MMG Century Mine closed 2015, its Gulf Communities Agreement ended',
    nextAction: 'Dropped as live prospects.',
    grantRelevance: 'Historical only.',
    evidenceTier: 'dropped',
  },
];

// ─── COMMUNITY & MANUFACTURING PARTNERS ──────────────────────────────────────

export const communityAndManufacturingPartners: OutreachTarget[] = [
  {
    id: 'oonchiumpa', name: 'Oonchiumpa Consultancy & Services', category: 'community_partner', status: 'active', priority: 'critical',
    states: ['NT'], contactName: 'Kristy Bloomfield', contactEmail: 'kristy.bloomfield@oonchiumpa.com.au',
    nextAction: 'Keep at centre of every facility and jobs pitch. REAL Innovation Fund co-applicant.',
    grantRelevance: '100% Aboriginal owned. Community-led design partner. Lead applicant on federal grants.',
  },
  {
    id: 'wilya-janta', name: 'Wilya Janta', category: 'community_partner', status: 'active', priority: 'critical',
    states: ['NT'], contactName: 'Norman Frank Jupurrurla / Dr Simon Quilty',
    nextAction: 'Housing advocacy + demonstration home. Active bed testing.',
    grantRelevance: 'Tennant Creek anchor. Housing advocacy. Norman Frank is powerful community voice.',
  },
  {
    id: 'picc', name: 'Palm Island Community Company', category: 'community_partner', status: 'active', priority: 'critical',
    states: ['QLD'], contactName: 'Narelle',
    amountSignal: '131 beds deployed + 40-bed order + scoping conversations on hosting the facility',
    nextAction: 'Explore production facility hosting on Palm Island.',
    grantRelevance: 'Flagship QLD proof point. Said they\'d buy the production facility itself.',
  },
  {
    id: 'npy', name: "NPY Women's Council", category: 'community_partner', status: 'active', priority: 'high',
    states: ['NT', 'SA', 'WA'], contactName: 'Angela Lynch',
    nextAction: '"Always looking for beds." Established network across 3 jurisdictions.',
    grantRelevance: 'Cross-border reach. Ongoing demand. Established Aboriginal organisation.',
  },
  {
    id: 'defy', name: 'Defy Design', category: 'manufacturing_partner', status: 'active', priority: 'high',
    states: ['NSW'], contactName: 'Sam Davies', contactEmail: 'sam@defydesign.org',
    nextAction: 'Key manufacturing partner. Training Ebony + Jahvan for on-country production.',
    grantRelevance: 'Manufacturing knowledge transfer. Skills pathway for community production.',
  },
  {
    id: 'envirobank', name: 'Envirobank', category: 'manufacturing_partner', status: 'warm', priority: 'high',
    contactName: 'Marty Taylor / Narelle Anderson',
    nextAction: 'Recycled HDPE supply partnership. Meeting held Feb 11. Indigenous-led supply chain.',
    grantRelevance: 'Circular economy supply chain. Strengthens environmental impact narrative.',
  },
  {
    id: 'orange-sky', name: 'Orange Sky Australia', category: 'community_partner', status: 'active', priority: 'medium',
    states: ['QLD', 'NT', 'WA'], contactName: 'Judith Meiklejohn', contactEmail: 'judith@orangesky.org.au',
    nextAction: 'Use as trust proof and national credibility signal.',
    grantRelevance: 'National service network. Nic co-founded. Credibility multiplier.',
  },
  {
    id: 'bawinanga', name: 'Bawinanga Homelands Aboriginal Corporation', category: 'distribution_partner', status: 'prospect', priority: 'medium',
    states: ['NT'],
    nextAction: 'Test community-owned service and distribution model beyond store channel.',
    grantRelevance: 'Arnhem Land homelands. Remote service infrastructure.',
  },
  {
    id: 'eb-jahvan', name: 'Ebony & Jahvan Oui', category: 'manufacturing_partner', status: 'active', priority: 'high',
    states: ['QLD'],
    nextAction: 'Training with Defy Design. Jahvan visited factory. Future-CEO pipeline.',
    grantRelevance: 'Indigenous youth-led manufacturing. The "who makes these? we do" story.',
  },
  {
    id: 'red-dust-robotics', name: 'Red Dust Robotics', category: 'manufacturing_partner', status: 'warm', priority: 'medium',
    states: ['NT'],
    nextAction: 'Youth STEM education + manufacturing skills pathway.',
    grantRelevance: 'Youth jobs + STEM education angle for grant applications.',
  },
];

// ─── Aggregates ──────────────────────────────────────────────────────────────

export const capitalTargets: OutreachTarget[] = [
  ...philanthropyActive,
  ...philanthropyPipeline,
  ...impactFinance,
  ...aboriginalTrusts,
  ...governmentPrograms,
  ...philanthropyProspects,
];

export const allTargets: OutreachTarget[] = [
  ...capitalTargets,
  ...healthBuyers,
  ...procurementBuyers,
  ...paidBuyers,
  ...philanthropicProspects20260917,
  ...communityAndManufacturingPartners,
];

export function getTargetsByStatus(status: RelationshipStatus) {
  return allTargets.filter(t => t.status === status);
}

export function getTargetsByCategory(category: TargetCategory) {
  return allTargets.filter(t => t.category === category);
}

export function getTargetsByCommunity(communityId: string) {
  return allTargets.filter(t => t.communities?.includes(communityId));
}

/** Canonical community ids used by the `communities` link field, for the community-lens filter. */
export const COMMUNITY_LABELS: Record<string, string> = {
  utopia: 'Utopia Homelands',
  maningrida: 'Maningrida',
  'tennant-creek': 'Tennant Creek',
  'palm-island': 'Palm Island',
  groote: 'Groote Eylandt',
};

// ─── Category display helpers ────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<TargetCategory, string> = {
  philanthropy_active: 'Philanthropy (Active)',
  philanthropy_pipeline: 'Philanthropy (Pipeline)',
  philanthropy_prospect: 'Philanthropy (Prospect)',
  aboriginal_trust: 'Aboriginal Trust',
  government_grant: 'Government',
  impact_finance: 'Impact Finance',
  corporate: 'Corporate',
  health_buyer: 'Health Buyer',
  procurement_buyer: 'Procurement Buyer',
  paid_buyer: 'Paid Buyer',
  distribution_partner: 'Distribution',
  community_partner: 'Community Partner',
  manufacturing_partner: 'Manufacturing Partner',
};

export const CATEGORY_COLORS: Record<TargetCategory, string> = {
  philanthropy_active: 'bg-green-100 text-green-800',
  philanthropy_pipeline: 'bg-blue-100 text-blue-800',
  philanthropy_prospect: 'bg-purple-100 text-purple-800',
  aboriginal_trust: 'bg-amber-100 text-amber-800',
  government_grant: 'bg-teal-100 text-teal-800',
  impact_finance: 'bg-indigo-100 text-indigo-800',
  corporate: 'bg-sky-100 text-sky-800',
  health_buyer: 'bg-rose-100 text-rose-800',
  procurement_buyer: 'bg-orange-100 text-orange-800',
  paid_buyer: 'bg-lime-100 text-lime-800',
  distribution_partner: 'bg-cyan-100 text-cyan-800',
  community_partner: 'bg-emerald-100 text-emerald-800',
  manufacturing_partner: 'bg-violet-100 text-violet-800',
};

// ─── Strategic Capital Pathways ──────────────────────────────────────────────

export interface CapitalPathway {
  id: string;
  title: string;
  summary: string;
  targets: string[];
  thesis: string;
}

export const capitalPathways: CapitalPathway[] = [
  {
    id: 'anchor-debt-capability',
    title: 'Anchor grant + debt + capability',
    summary: 'Snow validates → SEFA provides working capital/facility debt → SEDI builds capability.',
    targets: ['snow', 'sefa', 'sedi'],
    thesis: 'Use grants to de-risk, then layer debt + capability. Proves commercial readiness.',
  },
  {
    id: 'central-aus-buyer-stack',
    title: 'Central Australia buyer-to-capital stack',
    summary: 'Convert Centrebuild/Centrecorp buyer proof into blended capital for Utopia and Central Australian production.',
    targets: ['centrecorp-foundation', 'central-aus-trust', 'sefa'],
    thesis: 'Buyer orders prove demand. Aboriginal trusts fund production. Debt covers working capital.',
  },
  {
    id: 'regional-industrial',
    title: 'Regional jobs and circular manufacturing',
    summary: 'Rio Tinto + Fortescue + Minderoo for systems-change scale.',
    targets: ['rio-tinto', 'fortescue', 'minderoo'],
    thesis: 'Remote manufacturing, jobs, and circular economy at national scale.',
  },
  {
    id: 'groote-place-based',
    title: 'Groote Eylandt place-based production',
    summary: 'Groote Aboriginal Trust + WHSAC demand + Miwatj health = place-based production and supply.',
    targets: ['groote-trust', 'whsac-groote', 'miwatj'],
    thesis: 'Largest single demand signal. Local trust can fund. Health partner validates.',
  },
];

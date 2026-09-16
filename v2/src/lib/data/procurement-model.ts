/**
 * THE MODEL: how a bed gets bought, in any jurisdiction, and who does the selling.
 *
 * Ben, 16 September 2026: build the model to identify procurement options, keep learning, and
 * do NT first, then SA, then WA.
 *
 * So this is deliberately a SHAPE with jurisdictions plugged into it. Every jurisdiction answers
 * the same six questions, and one we have not researched yet says `pending` instead of quietly
 * looking finished. That keeps the gap visible and makes the next jurisdiction a fill-in.
 *
 * WHAT THE NT TAUGHT US, and it is the reason the model is shaped this way:
 *
 *   1. The threshold matters more than the policy. NT Tier 1 permits direct purchase from a
 *      Territory enterprise with no quote process at all, up to $50,000. That is 66 beds with
 *      no tender. That single number outweighed every hour spent on set-aside theory.
 *   2. The department will have been renamed. DIPL became DLI in September 2024 and remote
 *      housing moved to a department that did not exist before then. Always check.
 *   3. Nobody buys the bed. The NT builds houses and hands them over empty: $818M through its
 *      housing agencies, nine furniture contracts, all office chairs. The channel we are
 *      looking for often does not exist, and that absence is the argument.
 *   4. The seller is the lever. Every Indigenous procurement instrument tests the entity that
 *      SELLS. Goods does not pass. The community organisations do.
 *
 * Nothing in this file is modelled demand, and nothing is a projection.
 */

export type Researched = 'done' | 'pending';

export interface Jurisdiction {
  id: string;
  name: string;
  status: Researched;
  /** How many of our communities sit here. Counted from the communities table, 16 Sep 2026. */
  communities: number;
  /** Q1. Who holds the money for remote housing. */
  buyer: string | null;
  /** Q2. The threshold below which somebody can simply buy. THE number. */
  directPurchase: { limitAud: number; beds: number; rule: string } | null;
  /** Q3. What obliges or permits a preference for an Aboriginal supplier. */
  preference: string | null;
  /** Q4. Which register or certification that jurisdiction recognises. */
  register: string | null;
  /** Q5. Where opportunities are published. */
  portal: string | null;
  /** Q6. The best door, named where we have a name. */
  door: string | null;
  note: string;
}

/**
 * $750 a bed. Used to turn every threshold into a number of beds, because that is the only
 * form in which a procurement rule is worth reading.
 */
const BED_PRICE = 750;
const beds = (limit: number) => Math.floor(limit / BED_PRICE);

export const JURISDICTIONS: readonly Jurisdiction[] = [
  {
    id: 'nt',
    name: 'Northern Territory',
    status: 'done',
    communities: 17,
    buyer: 'Department of Housing, Local Government and Community Development leads remote housing; the Department of Logistics and Infrastructure runs construction procurement. Both were created or renamed in September 2024.',
    directPurchase: {
      limitAud: 50_000,
      beds: beds(50_000),
      rule: 'Tier 1, since 1 October 2025: one quote from a Territory business, or direct purchase from one, with no tender. Tier 2 reaches $200,000 on three quotes, two of them Territory businesses.',
    },
    preference: 'Under Our Community. Our Future. Our Homes., procurement is prioritised in order: local community-based Aboriginal Business Enterprises by select tender, then regional ABEs, then open tender. The program requires 40 per cent Aboriginal employment rising to 48, and is running at 33.',
    register: 'NT Indigenous Business Network is the recognised primary certifying body, at 51 per cent. The housing program itself accepts 50 per cent, and 25 per cent for an incorporated joint venture.',
    portal: 'Quotations and Tenders Online, tendersonline.nt.gov.au. Every award record publicly flags Territory Enterprise and Aboriginal Enterprise.',
    door: 'Tom Harris, Territory Procurement Champion, procurement.champion@nt.gov.au, appointed 1 November 2025 to find barriers to participation.',
    note: 'The strongest jurisdiction and the one we know. $4 billion over ten years, 343 homes still to be tendered, 1,508 bedrooms already built and empty.',
  },
  {
    id: 'qld',
    name: 'Queensland',
    status: 'pending',
    communities: 9,
    buyer: null,
    directPurchase: null,
    preference: 'Buy Queensland weights local benefit in evaluation and the Queensland Indigenous Procurement Policy targets three per cent of addressable spend. Thresholds not yet verified.',
    register: null,
    portal: null,
    door: null,
    note: 'SEVEN of our nine Queensland communities are Aboriginal Shire Councils: Aurukun, Cherbourg, Doomadgee, Kowanyama, Woorabinda, Yarrabah, plus Palm Island through PICC and the Torres Strait through TSIRC. They are local governments that are themselves Aboriginal organisations, so they are the buyer and the Aboriginal entity at the same time. That is a different shape from the NT and probably the easiest sale in the country. Not yet researched.',
  },
  {
    id: 'sa',
    name: 'South Australia',
    status: 'pending',
    communities: 2,
    buyer: null,
    directPurchase: null,
    preference: 'Aboriginal businesses can reportedly be directly engaged up to $550,000, with a minimum 20 per cent tender evaluation weighting for economic contribution to the state. The figure needs verifying against the instrument that sets it.',
    register: null,
    portal: null,
    door: null,
    note: 'Ceduna and Port Augusta. If the $550,000 direct-engagement figure holds it is by far the most permissive in the country, at 733 beds with no tender. Research in progress.',
  },
  {
    id: 'wa',
    name: 'Western Australia',
    status: 'pending',
    communities: 2,
    buyer: null,
    directPurchase: null,
    preference: null,
    register: null,
    portal: null,
    door: null,
    note: 'Kalgoorlie and Kununurra. Kalgoorlie is where the Ninga Mia footage was shot, which is the clearest picture we hold of what happens when bedding fails. Research in progress.',
  },
];

// ---------------------------------------------------------------------------

export interface CommunityRoute {
  community: string;
  state: string;
  /** The organisation we already work with there. */
  partner: string | null;
  /**
   * Whether that partner is known to hold government contracts, which is what decides whether
   * they can be the seller. Sourced from the NT awarded-contracts workbook where it says so.
   */
  holdsGovtContracts: 'yes' | 'unknown';
  contractEvidence: string | null;
  /** What we hold on the ground there today. */
  weHave: string | null;
}

/**
 * Our communities, against the question the model asks: is the organisation we already work
 * with here able to be the seller?
 *
 * The NT answers come from the awarded-contracts workbook. Everywhere else is `unknown`, and
 * says so, because a community partner is not the same thing as a government supplier and
 * assuming otherwise is how the last three hours nearly went wrong.
 */
export const COMMUNITY_ROUTES: readonly CommunityRoute[] = [
  { community: 'Tennant Creek', state: 'NT', partner: 'Wilya Janta, with Julalikari Council Aboriginal Corporation as the procurement contact', holdsGovtContracts: 'yes', contractEvidence: 'Julalikari holds 11 NT contracts worth $6.25M including housing refurbishment and tenancy management. An Aboriginal-owned Tennant Creek firm, Dexter Barnes Electrical, already supplies washing machines to the NT Government.', weHave: 'Nine washing machines, 160 beds, and the deepest relationship we have.' },
  { community: 'Maningrida', state: 'NT', partner: 'Homeland Schools Co.', holdsGovtContracts: 'yes', contractEvidence: 'Bawinanga Aboriginal Corporation holds 15 NT contracts worth $26.6M including Room to Breathe at Maningrida.', weHave: 'Eight washing machines, 40 beds pressed in our own facility, and a paid buyer in the Homeland School Company.' },
  { community: 'Utopia Homelands', state: 'NT', partner: 'Oonchiumpa, with Urapuntja Aboriginal Corporation as the procurement contact', holdsGovtContracts: 'unknown', contractEvidence: null, weHave: '147 beds, bought by Centrecorp. The community organisation has never been the buyer here.' },
  { community: 'Alice Springs', state: 'NT', partner: 'Oonchiumpa', holdsGovtContracts: 'unknown', contractEvidence: 'Tangentyere Council, also in Alice Springs, holds 20 NT contracts worth $23M. MacDonnell Regional Council holds 18 worth $35M.', weHave: 'One washing machine, and the facility submission with Oonchiumpa pending a federal decision.' },
  { community: "Galiwin'ku", state: 'NT', partner: 'East Arnhem Regional Council', holdsGovtContracts: 'yes', contractEvidence: 'Bukmak Constructions, a subsidiary of ALPA, is building 87 dwellings there for $51.5M and holds remote housing maintenance. Galiwinku is the single largest place in the federal bed-adjacent contract record at $58.9M.', weHave: 'Nothing yet. The largest single opportunity in the record.' },
  { community: 'Gunbalanya', state: 'NT', partner: 'Bawinanga Aboriginal Corp', holdsGovtContracts: 'yes', contractEvidence: 'Binjari holds $3.5M of remote community housing upgrade work at Gunbalanya.', weHave: 'Nothing yet.' },
  { community: 'Ngukurr', state: 'NT', partner: 'Roper Gulf Regional Council', holdsGovtContracts: 'yes', contractEvidence: 'Binjari holds $9.4M for Ngukurr and Rittarangu housing, plus three separate upgrade programs. Roper Gulf Regional Council itself holds $22.2M of federal contracts.', weHave: 'Nothing yet.' },
  { community: 'Borroloola', state: 'NT', partner: 'Roper Gulf Regional Council', holdsGovtContracts: 'yes', contractEvidence: 'Binjari holds five Borroloola contracts including HomeBuild NT duplexes and town camp upgrades.', weHave: 'Nothing yet.' },
  { community: 'Yuendumu', state: 'NT', partner: 'Central Desert Regional Council', holdsGovtContracts: 'yes', contractEvidence: 'Central Desert Regional Council holds a remote housing first-response maintenance period contract covering Yuendumu and nine other communities.', weHave: 'Nothing yet.' },
  { community: 'Lajamanu', state: 'NT', partner: 'Central Desert Regional Council', holdsGovtContracts: 'yes', contractEvidence: 'Same council, same period contract.', weHave: 'Nothing yet.' },
  { community: 'Wadeye', state: 'NT', partner: 'Thamarrurr Development Corp', holdsGovtContracts: 'unknown', contractEvidence: 'Wadeye is $16M in the federal bed-adjacent record. Household furniture for a Wadeye house was bought at Tier 2 quote from JAPE Furniture.', weHave: 'Nothing yet.' },
  { community: 'Ramingining', state: 'NT', partner: 'East Arnhem Regional Council', holdsGovtContracts: 'yes', contractEvidence: 'ALPA holds Room to Breathe at Ramingining. Bukmak holds the aerodrome maintenance.', weHave: 'Nothing yet.' },
  { community: 'Groote Archipelago', state: 'NT', partner: 'WHSAC', holdsGovtContracts: 'unknown', contractEvidence: 'Groote Eylandt is on the DLI forward plan as a Tier 5 housing procurement advertising around February 2027. Anindilyakwa Land Council uses two local Indigenous construction companies.', weHave: 'Nothing yet, and the $1.7M signal rests on a single old email.' },
  { community: 'Palm Island', state: 'QLD', partner: 'PICC', holdsGovtContracts: 'unknown', contractEvidence: 'Palm Island Aboriginal Shire Council is an active Goods relationship and a council in its own right.', weHave: 'Five washing machines, 85 beds, the Backing the Future youth pilot.' },
  { community: 'Kalgoorlie', state: 'WA', partner: 'The Community Shed', holdsGovtContracts: 'unknown', contractEvidence: null, weHave: '20 beds, and the Ninga Mia footage.' },
  { community: 'Kununurra', state: 'WA', partner: null, holdsGovtContracts: 'unknown', contractEvidence: null, weHave: 'An Elder clearance gate that is still open.' },
];

/** What the model still cannot answer anywhere, and it is the same gap in every jurisdiction. */
export const MODEL_GAPS: readonly string[] = [
  'No procurement officer is named in any contract record in any jurisdiction. Buyer names are free text with no contact fields. Finding the person takes a phone call, every time.',
  'Nothing anywhere covers helping a community organisation answer a buyer: a price, a lead time, an invoice, a delivery. That is the step between holding stock and being a supplier, and no tooling, document or programme in either repository touches it.',
  'We do not know whether our partner organisations want to be sellers. Every route in this file is possible. None of them has been agreed to by anybody.',
];

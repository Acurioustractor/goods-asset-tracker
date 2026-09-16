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
    status: 'done',
    communities: 9,
    buyer: 'Department of Housing and Public Works owns, builds and maintains social housing in discrete communities. The Queensland term of art is Aboriginal and Torres Strait Islander Local Government Areas, ATSILGAs, and searching for "remote Indigenous housing" misses most of it.',
    directPurchase: {
      limitAud: 500_000,
      beds: beds(500_000),
      rule: 'Two doors. A STATE agency can directly engage an Aboriginal Shire Council up to $500,000 including GST with no quotes, under the QPP 2026 diverse-supplier limited offer method. And the COUNCIL itself, buying with its own money under the Local Government Regulation, needs no quotes at all below $21,900 ex GST, which is 29 beds, three written quotes to $292,000, and can skip quotes or tenders at ANY value by resolving to adopt a quote or tender consideration plan under section 230.',
    },
    preference: 'The Queensland Procurement Policy 2026 defines an Aboriginal and Torres Strait Islander business as including "Queensland Indigenous local councils", and exempts those councils from the directory registration every other Indigenous business must hold. All seven of our councils plus the Torres Strait Island Regional Council are on the named list. A council is therefore the buyer and the Indigenous supplier in one body, and spend with it counts toward the three per cent target.',
    register: 'Supply Nation, the Queensland Indigenous Business Network\u2019s Indigenous Business Gateway, or ORIC, as determined by the Director-General and changed on 1 July 2026 to address black cladding. Indigenous local councils need none of them. An Indigenous NOT-FOR-PROFIT qualifies on a BOARD test: an incorporated association or public company limited by guarantee that can demonstrate 50 per cent of directors are of Aboriginal or Torres Strait Islander descent.',
    portal: 'QTenders for the state. Councils largely run their own, through VendorPanel, with approved contractor lists and preferred supplier registers.',
    door: 'The councils themselves. Torres Strait Island Regional Council applies a Local Benefits Test with a 15 per cent evaluation weighting and says it especially encourages Indigenous and locally based suppliers.',
    note: 'Structurally the best of the four, and the only one that writes the answer into policy. The easiest sale in the country is a council buying 29 beds with no quote requirement at all, and the largest is a state agency engaging a council for $500,000 with none either.',
  },
  {
    id: 'sa',
    name: 'South Australia',
    status: 'done',
    communities: 2,
    buyer: 'Department for Housing and Urban Development sets policy; the SA Housing Trust, renamed from the SA Housing Authority, owns and runs the housing. Both names are live in the contract record.',
    directPurchase: {
      limitAud: 550_000,
      beds: beds(550_000),
      rule: 'A public authority may directly engage an eligible Aboriginal business for procurements valued up to and including $550,000 including GST. One written quote and a value-for-money note. The instrument names the APY Lands explicitly: "This includes but is not limited to contracts delivered in APY lands."',
    },
    preference: 'No set-aside and no standalone Aboriginal procurement policy. The lever is the $550,000 direct engagement, plus SAIPP clause 4.3, which MANDATES South Australian manufactured products for public housing construction and maintenance above $55,000, forbids specifications that obstruct South Australian supply, and requires any brand name to be followed by "or equivalent". The Industry Advocate monitors compliance.',
    register: 'Eligibility is 50 per cent Aboriginal ownership, not Supply Nation\u2019s 51, and a 50/50 joint venture qualifies where management and financial decisions sit with the Aboriginal partner. Registered charities operating as a business are explicitly inside the definition. Listed on the Office of the Industry Advocate\u2019s SA Aboriginal Business Directory; Supply Nation is recognised but is not the SA register.',
    portal: 'SA Tenders and Contracts, tenders.sa.gov.au, with awards mirrored at contracts.sa.gov.au.',
    door: 'John Chapman OAM, Industry Advocate, oia@sa.gov.au, (08) 8429 2700. Deputy is Phillip Dowsett. The office runs Meet the Buyer and Ready to Tender sessions.',
    note: 'Ceduna and Port Augusta today, and the APY Lands is the real prize. 733 beds in a single direct engagement, no tender, is the most permissive threshold in the country. Two windows are open now: Treasury\u2019s stated 2026-27 target is to establish an Aboriginal procurement policy, so it is being drafted this financial year; and the SA Housing Trust\u2019s $1.012 billion maintenance contract carries a named-brand Electrolux appliances schedule against a clause that requires "or equivalent".',
  },
  {
    id: 'wa',
    name: 'Western Australia',
    status: 'done',
    communities: 2,
    buyer: 'Department of Housing and Works, which commenced 1 July 2025 and took remote Aboriginal community housing out of the Department of Communities.',
    directPurchase: {
      // No cap. Recorded as the open-advertisement threshold so the number means something,
      // and the rule text below is what actually governs it.
      limitAud: 250_000,
      beds: 0,
      rule: 'Rule C4.2 of the Western Australian Procurement Rules: the minimum competitive requirements do not apply when purchasing from a Registered Aboriginal Business. THERE IS NO DOLLAR CAP. The agency documents how value for money was demonstrated, and that is the whole test. It can be used even where the goods are available on a whole-of-government Common Use Arrangement. Without the exception the bands are $50,000 direct sourcing, $250,000 open advertisement.',
    },
    preference: 'Targets are set on the NUMBER of contracts, not value: 5 per cent from 2026-27. Each purchase above $50,000 from a registered Aboriginal business under a panel counts as a separate contract toward the target, so an agency has a reason to want several bed orders. In 2024-25 the state placed $442 million and beat the target at 6.82 per cent, but the Auditor General found only 30 of 130 entities met their own, and that 52 per cent of Aboriginal contracts were works against 25 per cent sector-wide. Goods supply is the under-represented category, which is ours.',
    register: 'Aboriginal Business Directory WA or Supply Nation Indigenous Business Direct, and nothing else. Both are free. Supply Nation Registered accepts not-for-profits and Aboriginal corporations at 50 per cent owned; NIAA is tightening to 51 with transitional arrangements to 30 June 2027.',
    portal: 'Tenders WA. Contracts of $50,000 or more must be published there; below that is invisible.',
    door: 'MaintenanceContractReview@dohw.wa.gov.au takes questions today. Morrgul, an Aboriginal-owned Kimberley not-for-profit, delivers the Aboriginal Procurement Advisory Service for Goldfields-Esperance, info@morrgul.com.au.',
    note: 'The strongest lever in the country, and the clearest date. The head maintenance contract RFT is in market September to November 2026, which is now, for contracts starting July 2028, with a stated objective of increasing Aboriginal community controlled participation. David Michael is both Minister for Finance, who owns the Aboriginal Procurement Policy, and regional minister for Goldfields-Esperance, where Ninga Mia sits. One office, one conversation.',
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

/**
 * THE WA FINDING THAT MAY UNDO AN EARLIER CONCLUSION, and it needs checking before anyone
 * relies on it.
 *
 * Everywhere else, the Indigenous procurement instruments test OWNERSHIP of the entity that
 * sells, which Goods fails, because orders are invoiced by A Curious Tractor Pty Ltd.
 *
 * The Aboriginal Business Directory WA does not test ownership for an incorporated Aboriginal
 * organisation. It tests the BOARD: "Have a Board or management committee comprised of at
 * least 50% Aboriginal members", plus "Aboriginal representation in the management and
 * operations". Goods on Country Ltd has 100 per cent Indigenous directors.
 *
 * And that register is one of the two that unlock Rule C4.2, which has no dollar cap.
 *
 * WHAT IS NOT ESTABLISHED, and it is most of it: whether the second limb about management and
 * operations is satisfied when the employees are not Aboriginal; whether WA business
 * registration, which the directory requires, is held or obtainable; and whether the charity
 * could be the selling entity at all, given orders currently go through A Curious Tractor.
 *
 * This is a question to put to the Industry Capability Network, who administer the directory.
 * It is not a finding, and nobody should act on it as one.
 */
export const WA_BOARD_TEST = {
  rule: 'Incorporated Aboriginal organisations must have a board or management committee comprised of at least 50 per cent Aboriginal members, and Aboriginal representation in management and operations.',
  whyItMatters: 'It is a board test, not an ownership test, and Goods on Country Ltd has 100 per cent Indigenous directors. It is one of the two registers that unlock Rule C4.2, which has no dollar cap. QUEENSLAND SAYS IT MORE PLAINLY STILL: an Indigenous not-for-profit qualifies if it is "an incorporated association or a public company limited by guarantee" that "can demonstrate 50% of the board of directors are of Aboriginal or Torres Strait Islander descent". Goods on Country Ltd is a public company limited by guarantee with 100 per cent Indigenous directors. Two jurisdictions now test the board and not ownership.',
  unresolved: [
    'Whether the management and operations limb is met, given Ben and Nic are the employees.',
    'Whether WA business registration, which the directory requires, is held or obtainable.',
    'Whether the charity could be the selling entity, given orders are invoiced by A Curious Tractor Pty Ltd today.',
  ],
  ask: 'Put it to the Industry Capability Network, who administer the directory.',
} as const;

/** Queensland specifics, which are the strongest material in the model. */
export const QLD_NOTES: readonly { title: string; detail: string }[] = [
  {
    title: 'The policy names the councils',
    detail: 'QPP 2026: "Aboriginal and Torres Strait Islander business include: Indigenous-owned businesses, Indigenous not-for-profit organisations, Queensland Indigenous local councils. All, except Queensland Indigenous local councils, must be registered on at least one recognised Indigenous business directory." Aurukun, Cherbourg, Doomadgee, Kowanyama, Palm Island, Torres Strait Island Regional, Woorabinda and Yarrabah are all on the named list.',
  },
  {
    title: 'Twenty-nine beds with no quotes at all',
    detail: 'Under the Local Government Regulation a council may buy directly below $21,900 excluding GST, with no quote requirement in the Regulation. At $750 that is 29 beds. Thresholds rose on 12 December 2025 and now index each 1 July, so many council websites still print the old numbers.',
  },
  {
    title: 'And no ceiling, by resolution',
    detail: 'Section 230 lets a council enter a contract of any size with no quotes or tenders if it resolves to prepare a quote or tender consideration plan and adopts one. The plan states objectives, how they are measured, alternatives considered and a risk analysis. There is no dollar limit on the exception. Section 235 also allows a sole-supplier resolution.',
  },
  {
    title: 'Nobody buys beds here either',
    detail: 'Of 142 rows in the FY2026 departmental disclosure matching bed, bedding, mattress, whitegood, washing machine, laundry, furniture, fridge or appliance, every one was commercial office furniture, garden beds, or laundry works. The same absence as the NT. The state door is a line to create, and the live doors are the councils and the health services.',
  },
  {
    title: 'A council-owned company is a different question',
    detail: 'Palm Island Community Company is not named in the council limb of the definition. It would have to qualify as an Indigenous-owned business at 50 per cent ownership or an Indigenous not-for-profit at 50 per cent board, AND be on a recognised directory. Unresolved, and it matters because PICC is our Palm Island relationship.',
  },
];

/**
 * SA specifics worth carrying, because they do not fit the six-question shape and are the
 * strongest material in any jurisdiction so far.
 */
export const SA_NOTES: readonly { title: string; detail: string }[] = [
  {
    title: 'The washing machine is written into the funding standard',
    detail: 'The Commonwealth remote housing schedule defines its target as the "acceptable standard of housing", which requires working facilities for washing clothes or bedding. SA must allocate a meaningful proportion to Aboriginal organisations and report the proportion.',
  },
  {
    title: 'Nganampa Health Council wrote the standard',
    detail: 'The Aboriginal community controlled health service for the APY Lands runs the UPK environmental health programme, and the original 1987 UPK report is where the healthy living practices come from: washing people, washing clothes and bedding. The whole national definition descends from it. The most natural Aboriginal-controlled partner in the APY Lands for both our products, and they defined the problem before we existed.',
  },
  {
    title: 'There is no panel in the way',
    detail: 'SA has no across-government contract for furniture, whitegoods or appliances. A household goods purchase is an ordinary procurement, so it sits fully inside the $550,000 rule. Appliances are currently bought inside the maintenance head contracts instead.',
  },
  {
    title: 'A new furnishing buyer appeared this year',
    detail: '100 APY Lands houses moved to the Department for Education on 1 April 2026. An unencumbered buyer with no incumbent supply arrangement.',
  },
  {
    title: 'Who holds the maintenance',
    detail: 'The $1.012 billion Head Contractors for Maintenance Services contract runs to 2028 with an option to 2030, across about 35,000 properties. RTC Facilities Maintenance holds Contract Area 06, Western Country and Far North, which is the remote one. Birubi Australia is the only Aboriginal-owned firm identifiable on the SA Housing Trust pre-qualified builders list.',
  },
];

/** What the model still cannot answer anywhere, and it is the same gap in every jurisdiction. */
export const MODEL_GAPS: readonly string[] = [
  'No procurement officer is named in any contract record in any jurisdiction. Buyer names are free text with no contact fields. Finding the person takes a phone call, every time.',
  'Nothing anywhere covers helping a community organisation answer a buyer: a price, a lead time, an invoice, a delivery. That is the step between holding stock and being a supplier, and no tooling, document or programme in either repository touches it.',
  'We do not know whether our partner organisations want to be sellers. Every route in this file is possible. None of them has been agreed to by anybody.',
];

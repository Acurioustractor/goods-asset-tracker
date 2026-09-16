/**
 * Snow Foundation and Goods on Country: what we built together, and what comes next.
 *
 * Ben, 16 September 2026: an interactive report in the shape of /pitch, focused entirely on
 * the partnership. The trips, the things done together, how the money was given, what Goods
 * is now because of it, and how the two organisations keep going at rheumatic heart disease
 * through Indigenous leadership.
 *
 * THE RULES THIS FILE ENCODES, each of them learned the hard way:
 *
 * 1. CATALYTIC CAPITAL, NEVER A GRADUATION STORY. Snow is current, not historical: the tenth
 *    invoice was paid in May 2026. Nothing here says grants were right "then". The guard in
 *    funder-moments.guards.test.ts now reads this file too.
 *
 * 2. DOLLAR FIGURES ARE ALLOWED HERE, and only here. The no-figures ruling covers PUBLIC
 *    funder surfaces. This page is password gated (see proxy.ts) and is written TO Snow about
 *    their own money, so it carries numbers. Do not copy these onto /pitch.
 *
 * 3. THE GOODS-ONLY FIGURE IS THE ONE THAT GOES TO SNOW. $493,129.79 is everything Snow has
 *    paid this ledger; $35,200 of it is INV-0092, a (Con)nected Drug Court invoice. What Snow
 *    gave GOODS is $457,929.79 inc-GST across nine invoices. Both are inc-GST, so the pair is
 *    like for like. See the note above GRANTS_RECEIVED in grants-received.ts.
 *
 * 4. HEALTH STAKES FIRST. Sally Grimsley-Ballard, 20 May 2026, reviewing our own landing page:
 *    "A cold audience needs that chain explained immediately and plainly, before the product,
 *    before the manufacturing story." Chapter 1 is the chain. The product comes after it.
 *
 * 5. NO HEALTH OUTCOME IS CLAIMED. The scabies to RHD pathway is the why. claims-ledger.ts
 *    carries the anti-claim, and two metrics were deleted from the impact model when the only
 *    honest version of them would have implied a prevented case. To an RHD
 *    funder asking for "evidence-based and culturally safe programs", refusing the claim is
 *    the argument, so chapter 7 says it out loud instead of hiding it.
 *
 * 6. WE DO NOT SPEAK FOR SNOW. A full sweep of the mailbox found no Snow person has ever put
 *    the loan or impact-investment pathway in writing. Every Snow intention on this page is a
 *    quote with a date, or it is absent.
 *
 * 7. RECYCLING IS NOT THE DOOR. Snow's published exclusions name "Environmental causes". The
 *    20kg a bed is here because it lowers the landed cost of a bed and keeps the feedstock
 *    local. It is an economics line.
 *
 * 8. NAMES AND WORDS COME FROM THE REGISTRY BY SLUG. Same default-deny as
 *    funder-moments: unknown slug, wrong tier or a quote that is not approved renders nothing.
 */

import { BED } from './model-placemat';
import { PLASTIC_KG_PER_BED } from './products';

/** Password-gated, and written to the funder about their own money. Figures are allowed. */
export const SNOW_REPORT_IS_GATED = true;

/**
 * What Snow has given Goods, reconciled 16 September 2026 against the live invoice list.
 * Both figures are the sum of `amount_paid`, so both are INC-GST. Name the basis every time.
 */
export const SNOW_MONEY = {
  goodsOnlyIncGstAud: 457_929.79,
  goodsOnlyExGstAud: 416_299.81,
  /** Everything Snow has paid this ledger, including one invoice that is not Goods. */
  allPaidIncGstAud: 493_129.79,
  goodsInvoices: 9,
  firstGoodsInvoice: 'INV-0166, 3 October 2024, paid 24 October 2024',
  latestInvoice: 'INV-0321, $132,000, paid 22 May 2026',
  outstandingAud: 0,
  /**
   * The share of all philanthropy Goods has received. Denominator is GRANTS_RECEIVED
   * ($772,788) less the same $35,200, so the two sides share a basis.
   */
  shareOfAllPhilanthropyPct: 62,
  basisNote:
    'Inc-GST, cash received, from the live Xero invoice list. The Goods-only figure excludes INV-0092 ($35,200, 1 October 2023), which is a (Con)nected Drug Court invoice and not Goods. Confirmed against the Snow milestone ledger, which itemises the same nine invoices.',
} as const;

// ---------------------------------------------------------------------------

export type TogetherKind = 'money' | 'country' | 'room' | 'door' | 'voice' | 'report';

export interface TogetherMoment {
  /** ISO-ish, sortable. Day precision where the record has it. */
  when: string;
  /** What a reader sees on the marker. */
  label: string;
  kind: TogetherKind;
  title: string;
  detail: string;
  /** Who was physically there, where the record names them. */
  who?: string;
  place?: string;
  image?: { src: string; alt: string };
  /** Where this is recorded, so nothing here is unsourced. */
  source: string;
}

export const TOGETHER_KINDS: Record<TogetherKind, { label: string; blurb: string; colour: string }> = {
  country: { label: 'On Country', blurb: 'Trips taken together, and the work done while there.', colour: '#A8643F' },
  money: { label: 'Money', blurb: 'Commitments, invoices and the agreements behind them.', colour: '#5E7A4C' },
  room: { label: 'In the room', blurb: 'Events where Snow put this work in front of other people.', colour: '#C45C3E' },
  door: { label: 'Doors opened', blurb: 'Introductions made, in both directions.', colour: '#5E7D9A' },
  voice: { label: 'Telling it', blurb: 'Snow writing and publishing about this work in their own channels.', colour: '#BBA255' },
  report: { label: 'Accounting for it', blurb: 'Proposals, reports and the reckoning that goes with the money.', colour: '#8B7D6B' },
};

/**
 * Reconstructed 16 September 2026 from a full read-only sweep of the mailbox (roughly 45
 * searches, in:anywhere) cross-checked against the Notion milestone ledger and the live Xero
 * invoice list. Around 64 distinct engagements since March 2024; this is the spine of them,
 * every one with a date and a source. Where the record does not name who was there, `who` is
 * left off.
 */
export const TOGETHER: readonly TogetherMoment[] = [
  {
    when: '2024-08-13', label: 'Aug 2024', kind: 'door',
    title: 'Sally asks for something to take to the Board',
    detail: 'Sally Grimsley-Ballard asks for an update on what was then called the Remote Mattress Project, for Board consideration. Nic writes it: the advisory group, the candidate communities, the phases.',
    who: 'Sally Grimsley-Ballard, Nicholas Marchesi',
    source: 'Mailbox, 13 and 14 August 2024',
  },
  {
    when: '2024-08-27', label: 'Aug 2024', kind: 'door',
    title: 'A recommendation goes to the Snow Board',
    detail: 'Sally confirms she is putting a recommendation to support this to the Board, suggests adding an Elder to the advisory group, and offers to connect us to Children’s Ground in Alice Springs.',
    who: 'Sally Grimsley-Ballard',
    source: 'Mailbox, 27 August 2024',
  },
  {
    when: '2024-10-02', label: 'Oct 2024', kind: 'money',
    title: 'Snow goes first',
    detail: 'Georgina Byron commits $25,000 now and $25,000 in four to six weeks, before there is a product, a register, a charity, a board or a customer. The condition is deliberately informal: "assuming all going well, I won’t define ‘going well’, trust you to know that!"',
    who: 'Georgina Byron AM',
    source: 'Mailbox, 2 October 2024. Grant reference 2024/OC0014',
  },
  {
    when: '2024-10-03', label: 'Oct 2024', kind: 'money',
    title: 'The first Goods invoice',
    detail: 'INV-0166, $27,500 including GST, "Goods. Bedding Project - Phase 1 Support". Paid 24 October 2024. Every Goods invoice to Snow since has been paid, and nothing is outstanding.',
    source: 'Xero, invoice list for The Snow Foundation',
  },
  {
    when: '2024-11-15', label: 'Nov 2024', kind: 'country',
    title: 'Tennant Creek, the first trip together',
    detail: 'Sally Grimsley-Ballard and Georgina Byron travel to Tennant Creek with Nic and Ben, including the Healthy Homes forum at Anyinginyi Health Corporation. The first time the funder and the work are in the same place.',
    who: 'Georgina Byron AM, Sally Grimsley-Ballard, Nicholas Marchesi, Benjamin Knight',
    place: 'Tennant Creek, Warumungu Country',
    source: 'Notion Q&A write-ups; mailbox, November 2024',
  },
  {
    when: '2024-12-17', label: 'Dec 2024', kind: 'country',
    title: 'Palm Island, 85 beds over a weekend',
    detail: 'A build weekend on Bwgcolman. The end of year update goes to Georgina and Sally with the asset register and a thank you video made by the people who built them.',
    place: 'Palm Island, Bwgcolman',
    source: 'Mailbox, 17 and 18 December 2024',
  },
  {
    when: '2024-12-22', label: 'Dec 2024', kind: 'voice',
    title: 'Snow writes about the beds in their own newsletter',
    detail: 'Lucy McKee drafts a Snow social post and a newsletter feature. Snow supplies their logos for the Goods site. The first time this work is told in Snow’s own voice.',
    source: 'Mailbox, 25 November to 22 December 2024',
  },
  {
    when: '2025-02-04', label: 'Feb 2025', kind: 'door',
    title: 'Snow forwards the QBE opportunity',
    detail: 'Sally sends through the QBE impact grants. Everything that became the Catalysing Impact application starts in this email.',
    who: 'Sally Grimsley-Ballard',
    source: 'Mailbox, 3 and 4 February 2025',
  },
  {
    when: '2025-02-05', label: 'Feb 2025', kind: 'money',
    title: 'A third commitment, and a question about scope',
    detail: 'Sally approves a further $25,000 "to continue progressing the Greate Beds strategy and implementation", and says plainly that it changes the scope from the original direction and needs more discussion. Support and due diligence in the same paragraph.',
    who: 'Sally Grimsley-Ballard',
    source: 'Mailbox, 5 February 2025',
  },
  {
    when: '2025-03-03', label: 'Mar 2025', kind: 'report',
    title: 'Two strategy sessions, run together',
    detail: 'An online strategy workshop with Sally and Jimyong Um, then a second session where Nic sends a recut of the thinking. Snow inside the model with us.',
    source: 'Mailbox, 3 and 13 March 2025',
  },
  {
    when: '2025-04-03', label: 'Apr 2025', kind: 'country',
    title: 'The Deadly Heart Trek, Tennant Creek',
    detail: 'Georgina Byron and Sally Grimsley-Ballard come to Tennant Creek and stand in the problem themselves. Snow is the Trek’s founding philanthropic partner, providing project management, logistics, community engagement, funding and communications.',
    who: 'Georgina Byron AM, Sally Grimsley-Ballard',
    place: 'Tennant Creek, Warumungu Country',
    image: { src: '/images/media-pack/snow-tennant-creek-april-2025.jpg', alt: 'Tennant Creek, April 2025' },
    source: 'Mailbox, March and April 2025; funder-moments.ts',
  },
  {
    when: '2025-05-27', label: 'May 2025', kind: 'report',
    title: 'Risk, resilience and reward',
    // Her sentence carries the retired word, the same one that retired a Georgina quote in
    // the registry. So this is her question in our words, and the line says so, because an
    // altered sentence inside quotation marks is the thing to avoid.
    detail: 'Sally sends a question set to answer before the Board discussion, and a lens from a conversation with Georgie: what reframing would we do if the community were the ones solving these challenges. That is her question put in our words. Her own sentence used a term we have since retired.',
    who: 'Sally Grimsley-Ballard',
    source: 'Mailbox, 27 May 2025',
  },
  {
    when: '2025-06-02', label: 'Jun 2025', kind: 'money',
    title: 'The partnership agreement',
    detail: 'A signed letter from Georgina Byron: a further $100,000 for FY25, taking the year to $175,000. It carries the sentence that describes how Snow works: a Grant is "part of a trusting relationship", with "no surprises", and "please continue updating us, Zoom, face to face, WhatsApp or phone, we enjoy this and often find it more beneficial than written reports".',
    who: 'Georgina Byron AM',
    source: 'Signed agreement, 2 June 2025',
  },
  {
    when: '2025-06-10', label: 'Jun 2025', kind: 'voice',
    title: '"Walking Together on Country"',
    detail: 'Snow publishes Georgina and Sally’s account of the NT trip, naming Goods alongside Wilya Janta, Orange Sky and Children’s Ground.',
    source: 'Snow Foundation, June 2025 newsletter',
  },
  {
    when: '2025-06-29', label: 'Jun 2025', kind: 'money',
    title: 'Snow buys a washing machine',
    detail: 'INV-0240. Not a grant, a purchase: an Indestructible Washing Machine v1, plus upgrades to four Speed Queen machines. The funder becomes a customer, which is a different kind of vote.',
    source: 'Xero, INV-0240',
  },
  {
    when: '2025-08-08', label: 'Aug 2025', kind: 'country',
    title: 'Deadly Heart Trek, Katherine and Big Rivers',
    detail: 'Over 800 children screened and 15 new diagnoses. Beds delivered alongside the screening to Katherine West, Barunga and the RHD medical team, and 90 more to Tennant Creek. A Basket Bed is what children lie on to watch the Take Heart Songlines film.',
    place: 'Katherine and Big Rivers',
    image: { src: '/images/media-pack/deadly-heart-trek-aug-2025.jpg', alt: 'Deadly Heart Trek, August 2025' },
    source: 'Mailbox, August 2025; Snow Deadly Heart Trek report, 11 September 2025',
  },
  {
    when: '2025-10-14', label: 'Oct 2025', kind: 'door',
    title: 'Oonchiumpa meets Snow',
    detail: 'In Sydney around the container launch, Ben introduces Kristy Bloomfield and Tanya Turner of Oonchiumpa to Sally. Kristy is now a director of Goods on Country.',
    who: 'Kristy Bloomfield, Tanya Turner, Sally Grimsley-Ballard',
    source: 'Mailbox, 14 to 22 October 2025',
  },
  {
    when: '2025-10-24', label: 'Oct 2025', kind: 'country',
    title: 'The Maningrida laundromat relaunches',
    detail: 'Work that came directly out of a Snow conversation in June. The Bawinanga general manager thanks "Nicholas and Sally" jointly, which is the right way round: it was a shared piece of work.',
    place: 'Maningrida',
    source: 'Mailbox, 17 to 24 October 2025',
  },
  {
    when: '2025-11-28', label: 'Nov 2025', kind: 'report',
    title: 'Snow changes what it will require',
    detail: 'Snow is forming a First Nations advisory group, and tells us that all future grants will require First Nations leadership, and that they will review all Snow Foundation partners. A clear statement of where the foundation is going.',
    source: 'Meeting record, 28 November 2025',
  },
  {
    when: '2026-01-20', label: 'Jan 2026', kind: 'report',
    title: 'The First Nations principles, shared in draft',
    detail: 'Sally sends the draft Snow Foundation First Nations Principles before they are published, "for consideration in how we approach further grants with Goods in an authentic way". A funder showing its working.',
    who: 'Sally Grimsley-Ballard',
    source: 'Mailbox, 20 January 2026',
  },
  {
    when: '2026-01-23', label: 'Jan 2026', kind: 'report',
    title: 'Four things Snow wanted us to answer',
    detail: 'Reviewing the next proposal, Sally asks for the risks to be fleshed out against "concerns that have been raised to date by us": waste, demand for the plant, payment first, and key learnings. She also asks that the Do No Harm principle and dynamic consent be carried explicitly.',
    who: 'Sally Grimsley-Ballard',
    source: 'Mailbox, 23 January 2026',
  },
  {
    when: '2026-03-25', label: 'Mar 2026', kind: 'room',
    title: 'Parliament House, and a bed on the floor of it',
    detail: 'The launch of the Parliamentary Friends for Ending Rheumatic Heart Disease, hosted by Snow with NACCHO and the RHD Alliance. A Stretch Bed is in the room. Georgina Byron and Dr Dawn Casey call it "a significant milestone in the national effort to end rheumatic heart disease".',
    who: 'Georgina Byron AM, Dr Dawn Casey',
    place: 'Parliament House, Canberra',
    image: { src: '/images/media-pack/parliament-house-event-mar-2025.jpg', alt: 'Parliamentary Friends for Ending Rheumatic Heart Disease, Canberra, March 2026' },
    source: 'Mailbox, March and April 2026',
  },
  {
    when: '2026-05-19', label: 'May 2026', kind: 'money',
    title: 'The FY26 agreement',
    detail: 'Georgina sends the successful grant letter and the letter agreement herself, cc Sally: "We are so pleased to support Goods on Country / A Curious Tractor." The tenth invoice, INV-0321, is paid three days later.',
    who: 'Georgina Byron AM',
    source: 'Mailbox, 19 May 2026; Xero, INV-0321 paid 22 May 2026',
  },
  {
    when: '2026-05-25', label: 'May 2026', kind: 'room',
    title: 'Canberra Airport',
    detail: 'Sally organises a Stretch Bed display with Capital Airport Group, Snow supplies the RHD key messages, and a display bed already sits in Georgie’s office. Snow then reviews our own landing page and tells us the health stakes have to come first.',
    who: 'Sally Grimsley-Ballard',
    place: 'Canberra Airport',
    image: { src: '/images/media-pack/canberra-airport-display-may-2025.jpg', alt: 'Goods display at Canberra Airport, May 2026' },
    source: 'Mailbox, 15 to 21 May 2026',
  },
  {
    when: '2026-07-08', label: 'Jul 2026', kind: 'country',
    title: 'Sally goes back to Tennant Creek',
    detail: 'Her own trip. The partnership has reached the point where the funder visits Country without us organising it.',
    who: 'Sally Grimsley-Ballard',
    place: 'Tennant Creek, Warumungu Country',
    image: { src: '/images/media-pack/sally-georgina-tennant-creek-jul-2025.jpg', alt: 'Georgina Byron AM and Sally Grimsley-Ballard with community Elders in Tennant Creek' },
    source: 'Mailbox, 25 to 26 June 2026',
  },
  {
    when: '2026-07-22', label: 'Jul 2026', kind: 'door',
    title: 'Snow introduces us to Coolamon',
    detail: 'Sally connects Goods on Country to Coolamon Community. The introductions have not stopped: Children’s Ground, Richard Cassidy, No Coincidence Media, Moonshine Agency, and the QBE program itself all came this way.',
    who: 'Sally Grimsley-Ballard',
    source: 'Mailbox, 22 July to 5 August 2026',
  },
  {
    when: '2026-09-09', label: 'Sep 2026', kind: 'room',
    title: 'Philanthropy Australia, Brisbane',
    detail: 'Snow hosts an RHD breakfast session with Georgie opening on a fifteen year story. Two washing machines are on site. Snow asks permission to use our photograph, which is the right way round and worth saying.',
    place: 'Brisbane',
    source: 'Meeting record, 2 September 2026',
  },
  {
    when: '2026-09-16', label: 'Sep 2026', kind: 'report',
    title: 'Where the conversation is now',
    detail: 'A check in about what comes next: an impact snapshot, and the decision routed through Snow’s advisory committee.',
    source: 'Meeting record, 16 September 2026',
  },
];

// ---------------------------------------------------------------------------

export interface BecauseOf {
  id: string;
  value: number;
  unit?: string;
  headline: string;
  detail: string;
  /** What the repo can actually stand behind. Never dress an estimate as a count. */
  status: 'verified' | 'modelled' | 'estimate' | 'future';
}

/**
 * What Goods is now. The honest answer to "what did the money do", including the parts that
 * are not finished. `status` is not decoration: it is the difference between a count and a
 * hope, and an RHD funder is exactly the reader who should see which is which.
 */
export const BECAUSE_OF: readonly BecauseOf[] = [
  { id: 'beds', value: 540, unit: 'beds', headline: 'Beds in communities', status: 'verified', detail: 'Every one tagged and trackable in a register a funder can scan. Snow money paid for the visits, the design from V1 to V4, and the first runs.' },
  { id: 'communities', value: 11, unit: 'communities', headline: 'Communities served', status: 'verified', detail: 'Tennant Creek, Palm Island, Maningrida, Utopia Homelands, Katherine and Barunga among them.' },
  { id: 'washers', value: 23, unit: 'machines', headline: 'Washing machines in community', status: 'verified', detail: 'Pakkimjalki Kari, named in Warumungu by Elder Dianne Stokes. Snow bought one of them outright.' },
  { id: 'voices', value: 38, unit: 'voices', headline: 'Consent-cleared voices', status: 'verified', detail: 'People who have agreed, by name, to their words being used outside the organisation. A default-deny allowlist: if a name is not on it, nothing of theirs renders.' },
  { id: 'trade', value: 320, unit: 'beds', headline: 'Beds bought and paid for', status: 'verified', detail: 'Four buyers, real invoices. The unit price has moved from $370 to $800 across them, which is a price model finding its floor.' },
  { id: 'plastic', value: PLASTIC_KG_PER_BED, unit: 'kg per bed', headline: 'Plastic kept out of the dump', status: 'modelled', detail: 'A design and specification figure. Nothing has been across a weighbridge. It matters here because it lowers the landed cost of a bed and keeps the feedstock local.' },
  { id: 'fte', value: 2, unit: 'FTE', headline: 'Paid roles', status: 'verified', detail: 'Two, and we say two. Employment hours beyond that are modelled and community employment share is an estimate, so neither is presented as a count.' },
  { id: 'owned', value: 0, unit: 'sites', headline: 'Community-owned production sites', status: 'future', detail: 'Zero, and this is the number we print against ourselves. Ownership is a pathway. The containerised plant is built to move to community operation and then ownership, and the Alice Springs facility with Oonchiumpa is in a federal submission with a decision pending.' },
];

// ---------------------------------------------------------------------------

export interface Alignment {
  id: string;
  snowSays: string;
  snowSource: string;
  goodsHas: string;
  /** Honest self-assessment against the funder's own stated priority. */
  strength: 'strong' | 'partial' | 'not-yet';
}

/**
 * Snow's published priorities against what Goods can actually evidence. Written from Snow's
 * own material, and deliberately including the two where the answer is weak. A funder who
 * reads their own strategy back with the gaps marked trusts the parts that are strong.
 */
export const ALIGNMENT: readonly Alignment[] = [
  {
    id: 'first-nations-leadership',
    snowSays: 'Prioritise and promote First Nations leadership across all aspects of the RHD sector, including representation in governance structures. All future grants will require First Nations leadership.',
    snowSource: 'RHD Statement of Intent, principle one; and the November 2025 position on future grants',
    goodsHas: 'Goods on Country Ltd is a registered charity with deductible gift recipient status and a board of 100% Indigenous directors: Kristy Bloomfield, Audrey Deemal and Jeremy Donovan. The ABN is public and checkable. The board handover is in progress and no chair has been appointed yet. We would rather you heard that here.',
    strength: 'strong',
  },
  {
    id: 'community-ownership',
    snowSays: 'Ensuring community ownership and leadership, principles reflected in our strategy.',
    snowSource: 'Georgina Byron AM, 2024 Year in Review',
    goodsHas: 'The money flow is the answer: customers pay the community organisation directly, and after costs the community decides whether it becomes more beds, paid local work, or making their own. Community ownership of a production site has not happened. Zero sites, printed as zero.',
    strength: 'partial',
  },
  {
    id: 'rhd',
    snowSays: 'We are dedicated to ending rheumatic heart disease, focusing on community leadership, advocacy, and the broader social determinants for health equity.',
    snowSource: 'Snow Foundation, 2024 Year in Review',
    goodsHas: 'Goods is already named in Snow’s own annual report as an RHD partner. We hold the line that the bed addresses the conditions the scabies pathway depends on, and we do not claim a health outcome. Two metrics were deleted from our own impact model when the only honest version of them would have implied a prevented case.',
    strength: 'strong',
  },
  {
    id: 'capacity',
    snowSays: 'Invest in educational training and resources, building greater capacity, knowledge, and ownership of RHD within communities. Education enables communities to set self-determined priorities.',
    snowSource: 'RHD Statement of Intent, principle four',
    goodsHas: 'Training sits inside the price of a bed by design, alongside customer connections, contracts, logistics and product development. Real instances: thirty young people on the Palm Island build, Ebony and Jahvan Oui hosted at the Sydney factory, Katrina Bloomfield doing train-the-trainer. There is no curriculum, no completion count and no accreditation. This is the weakest of the strong areas and the most fixable.',
    strength: 'partial',
  },
  {
    id: 'employment',
    snowSays: 'Education and Employment: employment pathways, life skills, scholarships.',
    snowSource: 'Snow Foundation grant themes',
    goodsHas: 'Two paid roles today. Cultural consultation is paid at university-equivalent rates. On a community-owned site about $329 of every bed would stay in community. The last figure is modelled. Nothing of it is banked.',
    strength: 'partial',
  },
  {
    id: 'environment',
    snowSays: 'We do not accept applications for initiatives that are focused on environmental causes.',
    snowSource: 'Snow Foundation grant exclusions',
    goodsHas: 'So we are not pitching it. Twenty kilograms of plastic a bed is here because it lowers the landed cost of a bed in a remote community and keeps the feedstock local, which is an economics argument. It is not a reason for Snow to fund this.',
    strength: 'not-yet',
  },
];

// ---------------------------------------------------------------------------

/** What is not finished. Named by us, before anyone asks. */
export const NOT_FINISHED: readonly { title: string; detail: string }[] = [
  {
    title: 'Reporting has run behind the relationship',
    detail: 'Snow has said plainly that they often find a call more useful than a written report, and we have leaned on that. The FY26 operational acquittal is owed and we are not going to describe it as anything else.',
  },
  {
    title: 'Ownership is still a pathway',
    detail: 'Zero community-owned sites. The plant is built to transfer and the Alice Springs facility with Oonchiumpa is in a federal submission, A decision is pending, and a legal transfer takes its own time.',
  },
  {
    title: 'The health claim stays unclaimed',
    detail: 'We can show beds off the floor and washable bedding in houses. We cannot show a prevented case of rheumatic heart disease, and we will not imply one. That needs a clinical partner and a method.',
  },
  {
    title: 'The four questions Snow asked in January',
    detail: 'Waste, demand for the plant, payment first, and key learnings. They were the right questions. Demand is the one that has moved: 320 beds bought and paid for by four buyers is the only demand evidence we will stand behind, and it replaces every projected number we used to carry.',
  },
];

/** Bed economics, read from the price model so this page cannot drift from the placemat. */
export const BED_HERE = {
  priceAud: BED.priceAud,
  makeAud: BED.makeAud,
  contributionAud: BED.contributionAud,
} as const;

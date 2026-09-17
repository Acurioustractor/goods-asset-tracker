/**
 * Snow Foundation and Goods on Country: what we built together and what comes next.
 *
 * Ben, 16 September 2026: an interactive report in the shape of /pitch, focused entirely on
 * the partnership. The trips, the things done together, how the money was given, what Goods
 * is now because of it and how the two organisations keep going at rheumatic heart disease
 * through Indigenous leadership.
 *
 * THE RULES THIS FILE ENCODES, each of them learned the hard way:
 *
 * 1. CATALYTIC CAPITAL, NEVER A GRADUATION STORY. Snow is current, not historical: the tenth
 *    invoice was paid in May 2026. Nothing here says grants were right "then". The guard in
 *    funder-moments.guards.test.ts now reads this file too.
 *
 * 2. DOLLAR FIGURES ARE ALLOWED HERE and only here. The no-figures ruling covers PUBLIC
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
 *    carries the anti-claim and two metrics were deleted from the impact model when the only
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

import { CANONICAL_ASSETS } from './asset-canonical';
import { PAID_INVOICES } from './paid-trade';
import { BED, RAISE } from './model-placemat';
import { QBE_CLOSES } from './qbe-form';
import { PLASTIC_KG_PER_BED } from './products';

/** Password-gated and written to the funder about their own money. Figures are allowed. */
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
  country: { label: 'On Country', blurb: 'Trips taken together and the work done while there.', colour: '#A8643F' },
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
    detail: 'Sally confirms she is putting a recommendation to support this to the Board, suggests adding an Elder to the advisory group and offers to connect us to Children’s Ground in Alice Springs.',
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
    detail: 'INV-0166, $27,500 including GST, "Goods. Bedding Project - Phase 1 Support". Paid 24 October 2024. Every Goods invoice to Snow since has been paid and nothing is outstanding.',
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
    title: 'A third commitment and a question about scope',
    detail: 'Sally approves a further $25,000 "to continue progressing the Greate Beds strategy and implementation" and says plainly that it changes the scope from the original direction and needs more discussion. Support and due diligence in the same paragraph.',
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
    // the registry. So this is her question in our words and the line says so, because an
    // altered sentence inside quotation marks is the thing to avoid.
    detail: 'Sally sends a question set to answer before the Board discussion and a lens from a conversation with Georgie: what reframing would we do if the community were the ones solving these challenges. That is her question put in our words. Her own sentence used a term we have since retired.',
    who: 'Sally Grimsley-Ballard',
    source: 'Mailbox, 27 May 2025',
  },
  {
    when: '2025-06-02', label: 'Jun 2025', kind: 'money',
    title: 'The partnership agreement',
    detail: 'A signed letter from Georgina Byron: a further $100,000 for FY25, taking the year to $175,000. It carries the sentence that describes how Snow works: a Grant is "part of a trusting relationship", with "no surprises" and "please continue updating us, Zoom, face to face, WhatsApp or phone, we enjoy this and often find it more beneficial than written reports".',
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
    detail: 'Over 800 children screened and 15 new diagnoses. Beds delivered alongside the screening to Katherine West, Barunga and the RHD medical team and 90 more to Tennant Creek. A Basket Bed is what children lie on to watch the Take Heart Songlines film.',
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
    detail: 'Snow is forming a First Nations advisory group and tells us that all future grants will require First Nations leadership and that they will review all Snow Foundation partners. A clear statement of where the foundation is going.',
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
    detail: 'Reviewing the next proposal, Sally asks for the risks to be fleshed out against "concerns that have been raised to date by us": waste, demand for the plant, payment first and key learnings. She also asks that the Do No Harm principle and dynamic consent be carried explicitly.',
    who: 'Sally Grimsley-Ballard',
    source: 'Mailbox, 23 January 2026',
  },
  {
    when: '2026-03-25', label: 'Mar 2026', kind: 'room',
    title: 'Parliament House and a bed on the floor of it',
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
    detail: 'Sally organises a Stretch Bed display with Capital Airport Group, Snow supplies the RHD key messages and a display bed already sits in Georgie’s office. Snow then reviews our own landing page and tells us the health stakes have to come first.',
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
    detail: 'Sally connects Goods on Country to Coolamon Community. The introductions have not stopped: Children’s Ground, Richard Cassidy, No Coincidence Media, Moonshine Agency and the QBE program itself all came this way.',
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
    detail: 'A check in about what comes next: an impact snapshot and the decision routed through Snow’s advisory committee.',
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
 * hope and an RHD funder is exactly the reader who should see which is which.
 */
export const BECAUSE_OF: readonly BecauseOf[] = [
  { id: 'beds', value: 540, unit: 'beds', headline: 'Beds in communities', status: 'verified', detail: 'Every one tagged and trackable in a register a funder can scan. Snow money paid for the visits, the design from V1 to V4 and the first runs.' },
  { id: 'communities', value: 11, unit: 'communities', headline: 'Communities served', status: 'verified', detail: 'Tennant Creek, Palm Island, Maningrida, Utopia Homelands, Katherine and Barunga among them.' },
  { id: 'washers', value: 23, unit: 'machines', headline: 'Washing machines in community', status: 'verified', detail: 'Pakkimjalki Kari, named in Warumungu by Elder Dianne Stokes. Snow bought one of them outright.' },
  { id: 'voices', value: 38, unit: 'voices', headline: 'Consent-cleared voices', status: 'verified', detail: 'People who have agreed, by name, to their words being used outside the organisation. A default-deny allowlist: if a name is not on it, nothing of theirs renders.' },
  { id: 'trade', value: 320, unit: 'beds', headline: 'Beds bought and paid for', status: 'verified', detail: 'Four buyers, real invoices. The unit price has moved from $370 to $800 across them, which is a price model finding its floor.' },
  { id: 'plastic', value: PLASTIC_KG_PER_BED, unit: 'kg per bed', headline: 'Plastic kept out of the dump', status: 'modelled', detail: 'A design and specification figure. Nothing has been across a weighbridge. It matters here because it lowers the landed cost of a bed and keeps the feedstock local.' },
  { id: 'fte', value: 2, unit: 'FTE', headline: 'Paid roles', status: 'verified', detail: 'Two and we say two. Employment hours beyond that are modelled and community employment share is an estimate, so neither is presented as a count.' },
  { id: 'owned', value: 0, unit: 'sites', headline: 'Community-owned production sites', status: 'future', detail: 'Zero and this is the number we print against ourselves. Ownership is a pathway. The containerised plant is built to move to community operation and then ownership and Oonchiumpa now hold a four-year federal offer for the Alice Springs facility, dated 12 August 2026 and not yet executed.' },
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
 * own material and deliberately including the two where the answer is weak. A funder who
 * reads their own strategy back with the gaps marked trusts the parts that are strong.
 */
/**
 * Order matters here. Ben, 16 September: lead on employment and Indigenous ownership. So
 * First Nations leadership sits first because it is both the strongest row and the thing
 * Snow said in November 2025 would gate all future grants, then the two rows about work and
 * ownership, then the rest. The environment row stays last and stays honest.
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
    id: 'employment',
    snowSays: 'Education and Employment: employment pathways, life skills, scholarships.',
    snowSource: 'Snow Foundation grant themes',
    goodsHas: 'Two paid roles today. Cultural consultation is paid at university-equivalent rates. On a community-owned site about $329 of every bed would stay in community. The last figure is modelled. Nothing of it is banked.',
    strength: 'partial',
  },
  {
    id: 'community-ownership',
    snowSays: 'Ensuring community ownership and leadership, principles reflected in our strategy.',
    snowSource: 'Georgina Byron AM, 2024 Year in Review',
    goodsHas: 'The money flow is the answer: customers pay the community organisation directly and after costs the community decides whether it becomes more beds, paid local work, or making their own. Community ownership of a production site has not happened. Zero sites, printed as zero.',
    strength: 'partial',
  },
  {
    id: 'capacity',
    snowSays: 'Invest in educational training and resources, building greater capacity, knowledge and ownership of RHD within communities. Education enables communities to set self-determined priorities.',
    snowSource: 'RHD Statement of Intent, principle four',
    goodsHas: 'Training sits inside the price of a bed by design, alongside customer connections, contracts, logistics and product development. Real instances: thirty young people on the Palm Island build, Ebony and Jahvan Oui hosted at the Sydney factory, Katrina Bloomfield doing train-the-trainer. There is no curriculum, no completion count and no accreditation. This is the weakest of the strong areas and the most fixable.',
    strength: 'partial',
  },
  {
    id: 'rhd',
    snowSays: 'We are dedicated to ending rheumatic heart disease, focusing on community leadership, advocacy and the broader social determinants for health equity.',
    snowSource: 'Snow Foundation, 2024 Year in Review',
    goodsHas: 'Goods is already named in Snow’s own annual report as an RHD partner. We hold the line that the bed addresses the conditions the scabies pathway depends on and we do not claim a health outcome. Two metrics were deleted from our own impact model when the only honest version of them would have implied a prevented case.',
    strength: 'strong',
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
    detail: 'Snow has said plainly that they often find a call more useful than a written report and we have leaned on that. The FY26 operational acquittal is owed and we are not going to describe it as anything else.',
  },
  {
    title: 'Ownership is still a pathway',
    detail: 'Zero community-owned sites. The plant is built to transfer and Oonchiumpa hold a four-year federal offer for the Alice Springs facility that is not yet executed. A legal transfer takes its own time after that.',
  },
  {
    title: 'The health claim stays unclaimed',
    detail: 'We can show beds off the floor and washable bedding in houses. We cannot show a prevented case of rheumatic heart disease and we will not imply one. That needs a clinical partner and a method.',
  },
  {
    title: 'The four questions Snow asked in January',
    detail: 'Waste, demand for the plant, payment first and key learnings. They were the right questions. Demand is the one that has moved: 320 beds bought and paid for by four buyers is the only demand evidence we will stand behind and it replaces every projected number we used to carry.',
  },
];

/** Bed economics, read from the price model so this page cannot drift from the placemat. */
export const BED_HERE = {
  priceAud: BED.priceAud,
  makeAud: BED.makeAud,
  contributionAud: BED.contributionAud,
} as const;

/**
 * THE CROSSOVER, AND THE SHAPE WE ARE WORKING TOWARDS.
 *
 * Ben, 17 September 2026: show how as the given came down the bought went up, and how we want
 * to model that for the next five to ten years, held by the Goods on Country Indigenous board
 * and the community members behind the charity.
 *
 * WHAT IS MEASURED AND WHAT IS NOT. The bought side is exact: every paid invoice, by the year
 * the money landed. The given side is NOT published as a series here, because Snow's nine
 * invoices are not held one by one in this repo and inventing a declining line would be the
 * same sin as the withdrawn demand figures. So the chart carries the side we can prove and the
 * words carry the direction, and the direction is named as intent.
 *
 * NO TEN-YEAR NUMBER APPEARS ANYWHERE HERE. Ben's standing rule on big numbers: say where it
 * goes if it works, then say nobody is promising ten-year numbers. That is exactly what the
 * closing line does.
 */
export const TRADE_BY_YEAR: readonly { year: string; invoices: number; beds: number; aud: number }[] = (() => {
  const by = new Map<string, { year: string; invoices: number; beds: number; aud: number }>();
  for (const i of PAID_INVOICES) {
    const year = i.fullyPaidOn.slice(0, 4);
    const row = by.get(year) ?? { year, invoices: 0, beds: 0, aud: 0 };
    row.invoices += 1;
    row.beds += i.beds;
    row.aud += i.totalPaidInclGstAud;
    by.set(year, row);
  }
  return [...by.values()].sort((a, b) => a.year.localeCompare(b.year));
})();

export const THE_NEXT_TEN = {
  heading: 'The shape, for the next five to ten years',
  body:
    'One line comes down and the other goes up. Philanthropy carried the whole of the first eleven months and it still carries most of what this work costs. The buying is what has to take its place, until the beds pay for the making and the making is not ours to hold.',
  holder:
    'What holds it while that happens is the charity, and the charity is a board of Indigenous directors with the community organisations themselves behind it. That is the difference between an enterprise that is transferred and one that is only talked about being transferred.',
  ceiling:
    'Everything above this line is money that cleared, in the year it cleared. Everything below it is modelled capacity, and it says so on itself: push the slider and the numbers move, because they are what the making could carry rather than what anyone has ordered.',
  forward:
    'What changes the shape is communities adding their own facilities. Each one makes beds locally, sells them locally and keeps what it makes, so the line that matters is not our capacity but theirs.',
} as const;

/**
 * THE BRIDGE: WHAT THE ORDER OF THE LEDGER LEADS TO.
 *
 * Ben, 17 September 2026: think about progress, then build on the way we are finding more
 * buyers, and let that lead into the development of the charity, the Indigenous leadership and
 * governance, and what it is for, which is community-led enterprise, capacity and ownership.
 *
 * So this is the hinge between chapter two and chapter three, and it is made of three facts that
 * are all in the invoice record: the money came before the trade, the trade is now four
 * different KINDS of buyer rather than four customers, and the price rose while they kept
 * buying. The charity is the answer to the question those three raise, which is who ends up
 * holding the making.
 *
 * Nothing here claims ownership has moved. It has not, and the model block says so twice.
 */
export const PROGRESS_BRIDGE = {
  heading: 'What the order is actually telling you',
  progress:
    'Given first, bought after. That is the shape of the table above and it is the shape of the last two years.',
  buyers:
    'And the buying is not one customer repeated. It is four kinds of buyer: a philanthropic trust buying for a community, an Aboriginal community controlled health service buying bedding as health hardware out of its own budget, a school company buying for its homelands, and a national research centre buying for the communities it works with. Each one is a different door into the same market, and each is a door we can knock on again.',
  price: `The price went ${[...new Set(PAID_INVOICES.map((i) => i.bedUnitPriceAud))].sort((a, b) => a - b).map((x) => `$${x}`).join(', ')} across those buyers and they kept buying, which is the only demand signal worth anything.`,
  charity:
    'That is what leads to the charity. A bed a community organisation sells and keeps the whole price of needs somewhere for the making to end up, and it cannot be us. Goods on Country Ltd is a DGR1 charity with a board of Indigenous directors, and it exists to do the part the trade cannot do on its own: hold the enterprise in community hands, build the capacity to run it, and carry the transfer of the making itself.',
  forward: 'Who holds it, and what it is for, is the next chapter.',
} as const;

/**
 * THE COMMUNITY-LED MODEL, IN THE ORDER IT HAPPENS.
 *
 * Ben, 17 September 2026: after the directors, talk more about the community-led model, the
 * model with communities, and the communities we are already working with.
 *
 * WHAT IS CLAIMED HERE AND WHAT IS NOT. Steps one to three happen today and there are paid
 * invoices behind them. Step four has never happened: no site is community owned, and it is
 * marked as the thing it is. The ownership line is a pathway everywhere on this page and it
 * does not get promoted here because it sits next to a board photograph.
 */
export const COMMUNITY_MODEL: readonly { step: string; title: string; body: string; state: 'now' | 'future' }[] = [
  {
    step: '01', state: 'now',
    title: 'The organisation holds the stock',
    body: 'Beds go to a community organisation we already work with. They hold them and they decide which households get one. We do not run a waiting list and we do not means test anybody.',
  },
  {
    step: '02', state: 'now',
    title: 'They sell, and they keep the whole price',
    body: `A bed is $${BED.priceAud}. When the organisation sells one the full $${BED.priceAud} stays with them. The money does not come to us and then go to them. It never comes to us.`,
  },
  {
    step: '03', state: 'now',
    title: 'They decide what happens next',
    body: 'After costs it is theirs to spend: more beds, paid local work, or making something of their own. The build days are paid work and the training sits inside the price of the bed rather than beside it as a line item.',
  },
  {
    step: '04', state: 'future',
    title: 'They own the making',
    body: 'The containerised plant is built to move to community operation and then to community ownership, on the Supply Nation 51 per cent path. No site has passed this point. Zero is the honest number and it is the one we print against ourselves.',
  },
];

/**
 * THE TWO LANES OF MONEY, ON ONE TIME AXIS.
 *
 * Ben, 17 September 2026: the map and its year scrubber were boring, and what was missing was
 * impact and growth. This is the growth, drawn from dated rows rather than asserted: every
 * payment that put a bed in a house, split by whether it was given or paid by a buyer.
 *
 * GIVEN comes from the dated money moments in TOGETHER, which are Snow's. BOUGHT comes from
 * PAID_INVOICES, by the date each invoice was fully paid, not the date it was issued, because a
 * bed is bought when the money lands.
 *
 * The gap between the first given dot and the first bought dot is eleven months. That gap is
 * the whole catalytic argument and nobody has to write it down.
 */
export interface MoneyEventData {
  on: string;
  label: string;
  detail: string;
  kind: 'given' | 'bought';
  /** Inc-GST, where the row is an invoice we can name to the cent. */
  amountAud?: number;
  reference?: string;
}

export const MONEY_EVENTS: readonly MoneyEventData[] = [
  ...TOGETHER.filter((m) => m.kind === 'money').map((m) => ({
    on: m.when,
    label: m.title,
    detail: m.detail,
    kind: 'given' as const,
  })),
  ...PAID_INVOICES.map((i) => ({
    on: i.fullyPaidOn,
    label: `${i.buyer} paid for ${i.beds} beds`,
    detail: `${i.beds} beds at $${i.bedUnitPriceAud} each, for ${i.forPlace}.`,
    kind: 'bought' as const,
    amountAud: i.totalPaidInclGstAud,
    reference: i.invoiceNumber,
  })),
];

/** The eleven months, computed rather than typed, so the sentence cannot go stale. */
export const MONTHS_BEFORE_FIRST_SALE = (() => {
  const given = MONEY_EVENTS.filter((e) => e.kind === 'given').map((e) => e.on).sort();
  const bought = MONEY_EVENTS.filter((e) => e.kind === 'bought').map((e) => e.on).sort();
  if (!given.length || !bought.length) return 0;
  const m = (iso: string) => Number(iso.slice(0, 4)) * 12 + Number(iso.slice(5, 7));
  return m(bought[0]) - m(given[0]);
})();

/**
 * THE ARC, AS THINGS WE MADE.
 *
 * Ben, 17 September 2026: chapter one should be the clear story. Basket Bed, then the washing
 * machine, then the Stretch Bed, then the production facility, then the R&D on the next
 * machine and it should say that none of it happens without flexible money.
 *
 * THE ARGUMENT, AND WHY IT IS HONEST. Two of these five were discontinued or given away. The
 * Basket Bed was our first product and its plans are now free to download. The price of a bed
 * moved twice as the work around it came inside the price. A grant tied to a deliverable
 * punishes all three of those moves; untied money pays for them. That is the case for how Snow
 * gave and it is made of things that happened rather than adjectives.
 *
 * "Catalytic" is Georgina's word and she says it herself in the opening. Our own word for it
 * here is flexible, because the voice guard bans the other one as our framing and it is right
 * to.
 *
 * Counts come from CANONICAL_ASSETS so the arc cannot drift from the register.
 */
export interface ArcStage {
  id: string;
  what: string;
  when: string;
  /** The chip. `now` is live, `given-away` is retired on purpose, `next` is not built. */
  state: 'given-away' | 'in-community' | 'now' | 'commissioning' | 'next';
  stateLabel?: string;
  body: string;
  /** The one number that proves it, where the register holds one. */
  figure?: { value: string; label: string };
  /**
   * The photograph. Ben, 17 September: put related images here. Every one is a real frame from
   * the archive with people or the plant in it. The next machine has none on purpose, because
   * it does not exist and a picture of the current one standing in for it would be a lie.
   */
  photo?: { src: string; alt: string };
}

export const THE_ARC: readonly ArcStage[] = [
  {
    id: 'basket-bed',
    what: 'The Basket Bed',
    when: 'The first prototype, through 2024',
    state: 'given-away',
    stateLabel: 'Open source now',
    body: 'Collapsible baskets, zip ties and a topper. It got people off the floor while we learned what a bed has to survive out here. Eighty-five of them were built on Palm Island over a weekend in December 2024. We have stopped selling it and the plans are free to download, which is the right end for a design that has been overtaken.',
    figure: { value: String(CANONICAL_ASSETS.basketBedsDeployed), label: 'in homes' },
    photo: { src: '/images/community/palm-island/woman-new-bed-home.jpg', alt: 'A Basket Bed at home on Palm Island' },
  },
  {
    id: 'washing-machine',
    what: 'Pakkimjalki Kari',
    when: 'Named in Tennant Creek, bought by Snow in June 2025',
    state: 'in-community',
    stateLabel: 'Prototype, in community',
    body: 'Elder Dianne Stokes named the machine in Warumungu. A Speed Queen base, chosen because it can be repaired, in an enclosure we make. One Alice Springs supplier sells about three million dollars of machines a year into remote communities and most are in a tip within months, so the whole design question is repair. Snow bought one on 29 June 2025. It is still a prototype and it is not for sale.',
    figure: { value: String(CANONICAL_ASSETS.washersInCommunity), label: 'in community' },
    photo: { src: '/images/product/washing-machine-installed.jpg', alt: 'A machine installed in community' },
  },
  {
    id: 'stretch-bed',
    what: 'The Stretch Bed',
    when: 'First paid order September 2025',
    state: 'now',
    stateLabel: 'The one we sell',
    body: 'Two galvanised poles threaded through the canvas and into crossed legs pressed from recycled plastic. The canvas is structural, so the bed does not stand without it and twenty kilograms of plastic stays out of a tip for every one. Centrecorp bought the first sixty at $370 and came back for a hundred and seven. The price is $750 now because freight and the paid local work came inside it rather than beside it.',
    figure: { value: String(CANONICAL_ASSETS.stretchBedsDeployed), label: 'in homes' },
    photo: { src: '/images/community/alice-springs/stretch-bed-two-generations.jpg', alt: 'Two generations on a Stretch Bed' },
  },
  {
    id: 'facility',
    what: 'The production facility',
    when: 'Maningrida run, August 2025',
    state: 'commissioning',
    body: 'Forty beds for Maningrida went through our own shredder, heat press and router, were shipped flat packed and were built at Gamardi by young people from the community. Production moving on Country is not a plan we are describing. It has happened once and we know what it cost. The containerised plant is built to move to community operation and then ownership.',
    figure: { value: '40', label: 'beds pressed in house' },
    photo: { src: '/images/process/container-factory.jpg', alt: 'The containerised factory' },
  },
  {
    id: 'next-machine',
    what: 'The next machine',
    when: 'In development now',
    state: 'next',
    stateLabel: 'Not built yet',
    body: 'Cheaper and smaller, without losing the durability. That is the aim, because the machine has to compete with what a family can already buy in town and it has to reach a lot more houses than twenty-three. The drum is a Speed Queen and it stays, because it can be repaired anywhere. What we build around it, the enclosure, the controller and the plumbing, is where the cost and the size have to come out.',
  },
];

/**
 * The sentence the arc is for. It is the only place on this page we describe how Snow gave
 * rather than what they gave and it is deliberately made of the two awkward facts: a product
 * we stopped selling and a price that went up.
 */
export const WHY_FLEXIBLE =
  'None of that was a deliverable in a grant agreement. A product we stopped selling, a design we gave away, a price that moved twice and a machine still in prototype after two years: money tied to an output punishes every one of those and money given on trust pays for them. That is what Snow bought and it is why there is a fourth and fifth thing on this list at all.';

/**
 * THE ASK WITH A DATE ON IT and it is not the money.
 *
 * The Catalysing Impact application closes at noon on 25 September 2026 and asks for evidence
 * of funder engagement. The Social Impact Hub, who run the programme with the QBE Foundation,
 * wrote to funders about exactly that on 1 April 2026 and that letter is the whole reason
 * this ask exists. It sits in the repo at public/qbe/funder-letter.pdf and the quoted line
 * below is theirs, verbatim and dash-free so the voice guard reads it as a quote.
 *
 * WHAT IT IS NOT: a commitment of money and not a way around the advisory committee. What the
 * programme counts is a letter acknowledging alignment and an ongoing relationship, which is
 * also what our note of the 16 September check-in records as sufficient.
 *
 * The Snow-side facts here are attributed to the record they came from and dated, because the
 * guard in this file's test suite will not let this page assert an intention for Snow.
 */
export const THE_LETTER = {
  by: 'about 21 September 2026',
  closes: QBE_CLOSES,
  programme: 'Catalysing Impact, run by the Social Impact Hub with the QBE Foundation',
  qbeAskAud: RAISE.qbeAud,
  qbeFor: RAISE.qbeFor,
  cohort: 'Ten enterprises were selected into the programme. The grant is competitive and the Hub says in writing that it is neither automatic nor guaranteed.',
  forms: 'An expression of interest, a letter of intent, a term sheet or a funding agreement all count as evidence.',
  sihQuote: 'They are requested to share this evidence of investor engagement as part of their application for grant funding.',
  sihSource: 'Adam Long, Director of Funding for Impact, Social Impact Hub, in a letter to funders dated 1 April 2026',
  sihLetterHref: '/qbe/funder-letter.pdf',
  enough: 'Our note of the 16 September check-in records that a broad letter acknowledging alignment with the Snow Foundation strategy and an ongoing relationship would be sufficient and that the decision goes through your advisory committee.',
  verify: 'Jay Boolkin at the Social Impact Hub is the contact named on that letter, so none of this has to be taken on our word.',
} as const;

// ---------------------------------------------------------------------------
// FILMS AND PHOTOGRAPHS
//
// Ben, 16 September 2026, on the first cut of this report: the rheumatic heart disease
// explainer goes. Snow have been at RHD since 2011 and it is their own strategy; explaining
// it back to them is the wrong move. Sally's "explain the chain plainly" note was written
// about a cold airport audience, not about the foundation that wrote the strategy.
//
// What goes in its place is what we are doing: the making, the work in it and Indigenous
// ownership. Those are the things Snow cannot see from a report line.

export interface Film {
  src: string;
  poster: string;
  title: string;
  /** Why this film is in a report to Snow, in one line. */
  why: string;
  /** The story it carries, two or three sentences. */
  story: string;
  /** Registry slug plus a fragment, when a person speaks in it. Default-deny, as ever. */
  voice?: { slug: string; contains: string };
  place: string;
}

export const FILMS: readonly Film[] = [
  {
    src: '/video/partners/oonchiumpa/karen-liddle-on-beds.mp4',
    poster: '/video/partners/oonchiumpa/karen-liddle-on-beds-poster.jpg',
    title: 'Karen Liddle, on starting Oonchiumpa',
    why: 'The clearest statement of Indigenous enterprise in the whole archive and it is hers.',
    story:
      'Karen co-founded Oonchiumpa, an Aboriginal community-controlled organisation in Alice Springs. She describes starting a business as something you tell the women around you to go and do. Oonchiumpa is now the partner in the Alice Springs facility submission and Kristy Bloomfield, who directs it, sits on the Goods on Country board.',
    voice: { slug: 'karen-liddle', contains: 'start your own business' },
    place: 'Mparntwe / Alice Springs, Arrernte Country',
  },
  {
    src: '/video/partners/oonchiumpa/mykel-building-the-bed.mp4',
    poster: '/video/partners/oonchiumpa/mykel-building-the-bed-poster.jpg',
    title: 'Mykel, building the bed',
    why: 'What a job looks like when it is the first one, said by the person doing it.',
    story:
      'Mykel built beds on the Utopia trip. The line that matters for an employment conversation is not a statistic, it is him saying he would come back and do it every day. This is the whole of what paid local work means at the point where it starts.',
    voice: { slug: 'mykel', contains: 'rocking up every day' },
    place: 'Utopia Homelands',
  },
  {
    src: '/video/maningrida/gamardi-drone.mp4',
    poster: '/video/maningrida/gamardi-drone-poster.jpg',
    title: 'Gamardi, Maningrida',
    why: 'Where the beds were pressed in our own facility, which is the proof the factory path works.',
    story:
      'Forty Stretch Beds for Maningrida were pressed in house, so the claim that production can move is not a projection. Eight washing machines are in community there. Country with nobody in frame, so it carries no consent question of its own.',
    place: 'Maningrida, Arnhem Land',
  },

];

export interface WallSet {
  label: string;
  note?: string;
  dir: string;
  files: readonly { file: string; alt: string; caption?: string }[];
}

/**
 * The photographs. Everything here already sits in `v2/public/`, which is a public repo, so
 * each one has passed the consent gate before it was committed. Nothing is added to this list
 * that is not already on disk.
 *
 * THE THIN SET IS THE SNOW ONE and the page says so on the set itself. Five frames of Snow
 * and Goods in the same place is what the archive holds and padding it with pictures of beds
 * would hide that.
 * More were asked for on 16 September.
 */
export const WALLS: readonly WallSet[] = [
  {
    label: 'Snow and Goods, in the same place',
    note: 'Five frames. This is the whole of what the archive holds and it is the thinnest set on the page.',
    dir: '/images/media-pack/',
    files: [
      { file: 'snow-tennant-creek-april-2025.jpg', alt: 'Tennant Creek, April 2025', caption: 'Tennant Creek, April 2025' },
      { file: 'sally-georgina-tennant-creek-jul-2025.jpg', alt: 'Georgina Byron AM and Sally Grimsley-Ballard with community Elders in Tennant Creek', caption: 'Georgina in the Wilya Janta shirt, Sally in the Deadly Heart Trek shirt, with Elders at Tennant Creek' },
      { file: 'deadly-heart-trek-aug-2025.jpg', alt: 'Deadly Heart Trek team, August 2025', caption: 'The Deadly Heart Trek, August 2025' },
      { file: 'parliament-house-event-mar-2025.jpg', alt: 'Parliamentary Friends for Ending Rheumatic Heart Disease, Canberra', caption: 'Parliament House, March 2026, with NACCHO and the RHD Alliance' },
      { file: 'canberra-airport-display-may-2025.jpg', alt: 'Goods display at Canberra Airport', caption: 'Canberra Airport, May 2026, organised by Sally with Capital Airport Group' },
    ],
  },
  {
    label: 'Alice Springs and Oonchiumpa',
    dir: '/images/community/alice-springs/',
    files: [
      { file: 'oonchiumpa-team-red-bed.jpg', alt: 'The Oonchiumpa team with a red Stretch Bed' },
      { file: 'oonchiumpa-office-joy.jpg', alt: 'In the Oonchiumpa office' },
      { file: 'stretch-bed-two-generations.jpg', alt: 'Two generations on a Stretch Bed' },
      { file: 'stretch-bed-kids-pile.jpg', alt: 'Kids piled on a Stretch Bed' },
      { file: 'frame-build-camp.jpg', alt: 'Building frames at camp' },
      { file: 'bush-camp-fire.jpg', alt: 'Bush camp' },
      { file: 'atnarpa-portrait.jpg', alt: 'Atnarpa' },
    ],
  },
  {
    label: 'The making and the work in it',
    note: 'The facility: shred, press, cut, assemble. This is what an employment conversation is actually about.',
    dir: '/images/process/',
    files: [
      { file: 'container-factory.jpg', alt: 'The containerised factory' },
      { file: 'shredder-granulator.jpg', alt: 'The shredder and granulator' },
      { file: 'shredded-plastic-tubs.jpg', alt: 'Shredded plastic in tubs' },
      { file: 'heat-press-full.jpg', alt: 'The heat press' },
      { file: 'pressed-sheets-stacked.jpg', alt: 'Pressed sheets stacked' },
      { file: 'cnc-cutting-closeup.jpg', alt: 'The CNC router cutting leg panels' },
      { file: 'cut-legs-stored.jpg', alt: 'Cut legs stored' },
      { file: 'parts-rack-sorted.jpg', alt: 'Parts rack, sorted' },
      { file: 'workstation-container.jpg', alt: 'The workstation container' },
      { file: 'facility-full-site.jpg', alt: 'The full facility site' },
      { file: 'joey-portrait.jpg', alt: 'At the facility' },
      { file: 'offcuts-weighed.jpg', alt: 'Offcuts weighed' },
    ],
  },
  {
    label: 'Maningrida',
    note: 'Forty beds pressed in our own facility, then built on Country.',
    dir: '/images/community/maningrida/',
    files: [
      { file: 'gamardi-build-day-wide.jpg', alt: 'Gamardi build day' },
      { file: 'unrolling-canvas-with-elder.jpg', alt: 'Unrolling canvas with an Elder' },
      { file: 'tensioning-canvas.jpg', alt: 'Tensioning the canvas' },
      { file: 'men-over-finished-bed.jpg', alt: 'Over a finished bed' },
      { file: 'kids-carrying-orange-bed.jpg', alt: 'Kids carrying an orange bed' },
      { file: 'group-beside-washer.jpg', alt: 'Beside a washing machine' },
      { file: 'washer-lid-dusk.jpg', alt: 'Washing machine at dusk' },
      { file: 'whole-run-at-sunset.jpg', alt: 'The whole run at sunset' },
    ],
  },
  {
    label: 'Palm Island',
    note: 'The Backing the Future pilot: twenty-five beds, three community sessions, thirty young people on the build.',
    dir: '/images/community/palm-island/',
    files: [
      { file: 'panel-carry-aug-2025.jpg', alt: 'Carrying panels, August 2025' },
      { file: 'crate-build-shed.jpg', alt: 'Building in the shed' },
      { file: 'crate-build-lawn.jpg', alt: 'Building on the lawn' },
      { file: 'two-men-thumbs-up.jpg', alt: 'Thumbs up' },
      { file: 'naidoc-nan-kids-bed.jpg', alt: 'NAIDOC, with kids and a bed' },
      { file: 'woman-new-bed-home.jpg', alt: 'A new bed at home' },
      { file: 'family-dogs-new-bed.jpg', alt: 'Family and dogs on a new bed' },
      { file: 'kids-unroll-topper.jpg', alt: 'Kids unrolling a topper' },
    ],
  },
];

/**
 * The Alice Springs opportunity, which is the forward half of the Indigenous ownership story
 * and the thing Snow is actually being invited into. Oonchiumpa operate it, employ young
 * people and keep leading that place. Every claim here is labelled: the submission is real,
 * the decision is not made and nothing is owned yet.
 */
export const OONCHIUMPA_NEXT = {
  partner: 'Oonchiumpa Consultancy and Services',
  place: 'Mparntwe / Alice Springs, Arrernte Country',
  what: 'A second production facility, operated by Oonchiumpa.',
  steps: [
    { title: 'Operate it', detail: 'Oonchiumpa run the facility. Not hosted by them, run by them.', state: 'proposed' as const },
    { title: 'Employ young people', detail: 'Young people in Alice Springs building beds for money, with training that travels home. Katrina Bloomfield has already done train-the-trainer at the Queensland facility.', state: 'proposed' as const },
    { title: 'Build the enterprise', detail: 'Customers pay Oonchiumpa directly. After costs they decide what happens next: more beds, more paid work, or making something of their own.', state: 'proposed' as const },
    { title: 'Own it', detail: 'On the Supply Nation 51% First Nations ownership path. No site has passed this point.', state: 'future' as const },
  ],
  status:
    'The decision came. On 12 August 2026 the department wrote to Oonchiumpa offering $1,695,000 excluding GST over four years to 30 June 2030, with Lhere Artepe support letters already signed. The letter says plainly that it is not a grant agreement: nothing is executed and no money has moved. The money would be Oonchiumpa\u2019s to hold and spend and we disclose it in our own applications without ever counting it as ours.',
  connection:
    'Kristy Bloomfield directs Oonchiumpa and is a director of Goods on Country. Sally met Kristy and Tanya Turner through an introduction we made in Sydney in October 2025.',
} as const;

/**
 * The hero mosaic pool. Drawn from WALLS so there is one list of photographs on this page and
 * the hero cannot drift from the archive below it. Every frame carries a caption because the
 * hero names what you are pointing at and an uncaptioned photograph of a community is not
 * something to put at the top of a funder report.
 *
 * Snow frames sort first: the mosaic opens on the two years we were in the same places.
 */
export function heroFrames(): { src: string; alt: string; caption: string }[] {
  const out: { src: string; alt: string; caption: string }[] = [];
  for (const w of WALLS) {
    for (const f of w.files) {
      out.push({ src: w.dir + f.file, alt: f.alt, caption: f.caption ?? `${f.alt}. ${w.label}.` });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// THE ARC, AS PLACES
//
// Ben, 16 September 2026: a series of drone shots from different places, more voices,
// especially about Indigenous knowledge and Country and a map that grows underneath.
//
// The first cut ran one aerial behind four beats and the words said Tennant Creek while the
// caption said Maningrida. A beat now owns its place, its footage and its voice together.
// There are three community aerials in the archive, so there are three place beats plus a
// closing one that hands over to the map.

export interface PlaceBeatData {
  id: string;
  place: string;
  when: string;
  title: string;
  body: string;
  film: { src: string; poster: string; alt: string };
  /**
   * Registry slugs plus a fragment each. Default-deny: an unresolved one renders nothing and the
   * beat runs without it.
   *
   * Ben, 17 September 2026: more people and more quotes on each stop. The people have to belong
   * to the stop, which is how the Maningrida beat was caught carrying Gary, whose registry
   * community is Mount Isa. A Mount Isa voice under an Arnhem Land aerial is the kind of error a
   * funder is right never to forgive, so every beat now takes its voices from the people the
   * registry places there.
   */
  voices?: readonly { slug: string; contains: string }[];
  /** Frames from that same place, shown small under the words. Existence is guarded. */
  photos?: readonly { src: string; alt: string }[];
  /**
   * Draw the map of every place over this beat's footage. Ben, 17 September: the closing beat
   * says "every dot on the map below", so the map belongs on it rather than in a box underneath.
   */
  showMap?: boolean;
}

export const PLACE_BEATS: readonly PlaceBeatData[] = [
  {
    id: 'kalgoorlie',
    place: 'Ninga Mia, Kalgoorlie, Wongatha Country',
    when: 'Why any of this',
    title: 'The mattresses end up here.',
    body: 'A community dump outside Kalgoorlie. One Alice Springs supplier sells about three million dollars of washing machines a year into remote communities and most are in a tip within months. The same is true of the bedding. This is the problem the bed was drawn against and it is an economics problem before it is anything else.',
    film: { src: '/video/kalgoorlie/ninga-mia-drone.mp4', poster: '/video/kalgoorlie/ninga-mia-drone-poster.jpg', alt: 'Ninga Mia, Kalgoorlie, from the air' },
    voices: [
      { slug: 'gloria-turner', contains: "I can't wash my mattress" },
    ],
    photos: [
      { src: '/images/community/kalgoorlie/dump-site-dawn.jpg', alt: 'The dump at dawn' },
      { src: '/images/community/kalgoorlie/mattress-decayed.jpg', alt: 'A decayed mattress' },
      { src: '/images/community/kalgoorlie/camp-visit.jpg', alt: 'At the camp, Ninga Mia' },
      { src: '/images/community/kalgoorlie/delivery-truck.jpg', alt: 'The delivery truck at Ninga Mia' },
    ],
  },
  {
    id: 'tennant-creek',
    place: 'Tingkkarli / Lake Mary Ann, Tennant Creek, Warumungu Country',
    when: 'October 2024',
    title: 'Snow goes first and then comes to Country.',
    body: 'Georgina commits $25,000 and another $25,000 to follow, before there is a product, a register, a charity, a board or a customer. Six weeks later she and Sally are at the Healthy Homes forum at Anyinginyi Health Corporation. Dianne Stokes received a bed here and asked for twenty more within a fortnight, then named the washing machine Pakkimjalki Kari in Warumungu.',
    film: { src: '/video/tennant-creek/tingkkarli-drone.mp4', poster: '/video/tennant-creek/tingkkarli-drone-poster.jpg', alt: 'Tingkkarli, Lake Mary Ann, north of Tennant Creek, from the air' },
    voices: [
      { slug: 'dianne-stokes', contains: 'It means something that really makes me happy' },
      { slug: 'patricia-frank', contains: 'right there at home' },
      { slug: 'cliff-plummer', contains: 'If I had two of those beds' },
    ],
    photos: [
      { src: '/images/community/tennant-creek/waterhole-group.jpg', alt: 'At the waterhole' },
      { src: '/images/community/tennant-creek/wilya-janta-golden-hour.jpg', alt: 'Wilya Janta at golden hour' },
      { src: '/images/media-pack/snow-tennant-creek-april-2025.jpg', alt: 'Tennant Creek, April 2025' },
    ],
  },
  {
    id: 'maningrida',
    place: 'Gamardi, Maningrida, Arnhem Land',
    when: '2025',
    title: 'The making moves.',
    body: 'Forty Stretch Beds for Maningrida were pressed in our own facility: shredded, heat pressed, routed and shipped. Eight washing machines are in community here. This is the difference between saying production could move on Country and having moved it.',
    film: { src: '/video/maningrida/gamardi-drone.mp4', poster: '/video/maningrida/gamardi-drone-poster.jpg', alt: 'Gamardi, Maningrida, Arnhem Land, from the air' },
    voices: [
      { slug: 'tehmineh-mason', contains: 'fresh and ready for school' },
      { slug: 'eric-pascoe', contains: 'like funeral or ceremony' },
    ],
    photos: [
      { src: '/images/community/maningrida/gamardi-build-day-wide.jpg', alt: 'Gamardi build day' },
      { src: '/images/community/maningrida/unrolling-canvas-with-elder.jpg', alt: 'Unrolling canvas with an Elder' },
      { src: '/images/community/maningrida/men-over-finished-bed.jpg', alt: 'Over a finished bed' },
      { src: '/images/community/maningrida/kids-carrying-orange-bed.jpg', alt: 'Kids carrying an orange bed' },
    ],
  },
  {
    id: 'everywhere',
    place: 'Tingkkarli, Tennant Creek, where it started. Eleven communities now.',
    when: 'Now',
    title: 'Not only here.',
    body: 'Five hundred and forty beds across eleven communities, twenty-three washing machines and a charity held by Indigenous directors. Every dot on this map arrived after somebody was willing to go first.',
    film: { src: '/video/tennant-creek/tingkkarli-drone.mp4', poster: '/video/tennant-creek/tingkkarli-drone-poster.jpg', alt: 'Tingkkarli, Tennant Creek, from the air' },
    showMap: true,
  },
];

export interface MapPlaceData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  since: string;
  beds: number;
  /**
   * Machines in community at that place. Ben, 17 September: the scrub should show the
   * infrastructure changing, not only the beds. Held to WASHER_PLACES and to canon by the
   * guard, so the two lists cannot drift apart.
   */
  washers: number;
  note: string;
}

/**
 * The places, in the order the work reached them. Coordinates come from communityLocations so
 * this map and the one on /pitch put a place in the same spot. Bed counts are the register's.
 *
 * `since` is when the work first reached a place, which is a different question from when a
 * funder's money arrived and it is the one the map is answering.
 */
export const MAP_PLACES: readonly MapPlaceData[] = [
  { id: 'tennant-creek', name: 'Tennant Creek', lat: -19.648, lng: 134.192, since: '2024-10', beds: 160, washers: 9, note: 'Where Snow came six weeks after the first invoice. Dianne Stokes asked for twenty more beds within a fortnight of receiving one.' },
  { id: 'palm-island', name: 'Palm Island', lat: -18.744, lng: 146.581, since: '2024-12', beds: 85, washers: 5, note: 'Eighty-five beds built over a weekend on Bwgcolman, then the Backing the Future youth pilot with thirty young people on the build.' },
  { id: 'maningrida', name: 'Maningrida', lat: -12.053, lng: 134.226, since: '2025-08', beds: 40, washers: 8, note: 'Forty beds pressed in our own facility before they were built on Country. Eight washing machines in community.' },
  { id: 'katherine', name: 'Katherine', lat: -14.465, lng: 132.264, since: '2025-08', beds: 30, washers: 0, note: 'Beds travelling with the Deadly Heart Trek, alongside heart screening for over eight hundred children.' },
  { id: 'utopia', name: 'Utopia Homelands', lat: -22.235, lng: 134.741, since: '2026-05', beds: 147, washers: 0, note: 'Eighty-seven beds over two days with Oonchiumpa and the Utopia Council, a bed under thirty-six households.' },
  { id: 'alice-springs', name: 'Mparntwe / Alice Springs', lat: -23.698, lng: 133.881, since: '2026-06', beds: 20, washers: 1, note: 'Where Oonchiumpa would operate the second facility. A four-year federal offer to Oonchiumpa is on the table, dated 12 August 2026 and not yet executed.' },
];

// ---------------------------------------------------------------------------
// WHO IS BUYING, AND THE MACHINES THAT REPORT
//
// Ben, 16 September 2026 and it is also the main thing Sally asked for and the deliverable
// the QBE volunteer team is working on: map the buyers and the routes to market.
//
// THE RULE THAT GOVERNS THIS WHOLE SECTION. The "who has asked" bed figures were withdrawn as
// made up (Ben, 15 September): Utopia 150, Maningrida 65, Palm Island 40, Tennant Creek 20 and
// 3, Groote 500, NPY 200 to 350. None of them are printed here or anywhere. The ONLY demand
// record is the paid trade, so this section is built entirely from invoices that were issued
// and paid and it says so.

export interface BuyerRoute {
  id: string;
  buyer: string;
  /** The route to market this buyer is an instance of. Jay Boolkin's framing, 4 Sep 2026. */
  route: string;
  beds: number;
  firstPrice: number;
  latestPrice: number;
  forPlace: string;
  invoices: string;
  what: string;
}

/**
 * Four buyers, five invoices, 320 beds. Written by hand from PAID_INVOICES, because the route
 * to market is a judgement about what each buyer is an example of and a judgement does not
 * belong in a reduce(). The numbers are held to PAID_INVOICES by the guard.
 */
export const BUYERS: readonly BuyerRoute[] = [
  {
    id: 'centrecorp', buyer: 'Centrecorp Foundation', route: 'Philanthropic trust buying for a community',
    beds: 167, firstPrice: 370, latestPrice: 560, forPlace: 'Utopia Homelands',
    invoices: 'INV-0259 and INV-0291, paid September 2025 and February 2026',
    what: 'The first repeat buyer. They came back at a higher price for nearly twice the volume, which is the only kind of demand signal worth anything. They buy beds; they have never given a grant and the footer says so.',
  },
  {
    id: 'malala', buyer: "Mala'la Health Service Aboriginal Corporation", route: 'Aboriginal community controlled health service',
    beds: 13, firstPrice: 380, latestPrice: 380, forPlace: 'Maningrida',
    invoices: 'INV-0283, paid November 2025',
    what: 'An ACCHO buying bedding as health hardware out of its own budget. Small and the most strategically interesting line in the book: it is a health service acting on the housing end of the pathway.',
  },
  {
    id: 'homeland-school', buyer: 'Homeland School Company', route: 'School',
    beds: 40, firstPrice: 750, latestPrice: 750, forPlace: 'Maningrida homelands',
    invoices: 'INV-0303, paid July 2026',
    what: 'A school buying beds for homelands families, at the full $750, plus two washing machines. These are the forty pressed in our own facility.',
  },
  {
    id: 'alive', buyer: 'ALIVE National Centre', route: 'Research programme buying for the communities it works with',
    beds: 100, firstPrice: 800, latestPrice: 800, forPlace: 'Communities in the Gathering the Parts programme',
    invoices: 'INV-0342, paid August 2026',
    what: 'The largest single order and the highest price paid. A national research centre bought a hundred beds at $800 in August 2026.',
  },
];

/**
 * The price ladder. The point a funder should take from it: the unit price has more than
 * doubled across four buyers and they kept buying. Read from BUYERS so it cannot drift.
 */
export const PRICE_LADDER = [370, 380, 560, 750, 800] as const;

export const BUYER_TOTALS = {
  beds: BUYERS.reduce((n, b) => n + b.beds, 0),
  buyers: BUYERS.length,
  invoices: 5,
  netOfGstAud: 247_770,
  inclGstAud: 273_966,
  basis: 'Net of GST is the revenue and EBITDA basis; inc-GST is what landed in the bank. Name the basis every time.',
} as const;

/** What is honestly not known about demand, said before anyone asks. */
export const DEMAND_GAPS: readonly string[] = [
  'Every projected demand figure Goods used to carry was withdrawn in September 2026 as unevidenced. Nothing has replaced them and nothing here is a forecast.',
  'No individual has ever bought a bed at $750 with their own money. Every bed in the book was bought by an organisation for a community, which is a different market with a different question attached.',
  'Whether $750 holds once freight is inside it is still being worked out. Goods absorbs $100 of freight and $100 of facilitation out of its own share today.',
  'A QBE volunteer team is running a market demand assessment across five priority regions, reporting in the week of 19 October 2026. It is the first independent look at any of this.',
];

export interface WasherPlace {
  place: string;
  inCommunity: number;
  note: string;
}

/**
 * How the fleet got to twenty three and who has them.
 *
 * Canon is 23, per Ben's ruling of 21 July 2026 as amended 16 September. The register carries
 * more deployed rows than that and canon already says why: ten are stale and pending restatus
 * to retired. Repeating that here, instead of quietly publishing the larger number, is the
 * whole point of having a canon.
 */
export const WASHER_PLACES: readonly WasherPlace[] = [
  { place: 'Tennant Creek', inCommunity: 9, note: 'Where it started. Dianne Stokes named the machine Pakkimjalki Kari in Warumungu. Julalikari Council Aboriginal Corporation holds two.' },
  { place: 'Maningrida', inCommunity: 8, note: 'Six in community plus two bought by the Homeland School Company on INV-0303.' },
  { place: 'Palm Island', inCommunity: 5, note: 'Alongside the Backing the Future youth pilot.' },
  { place: 'Alice Springs', inCommunity: 1, note: 'With the Oonchiumpa relationship.' },
];

/**
 * What the machines actually report. Read from the live fleet tables on 16 September 2026 and
 * written down with its date. It is not queried at render time, because a funder report that
 * changes its own figures between two readings of it has stopped being a report.
 *
 * Controller identity is reconciled first, using the aliases Ben reviewed on 14 May 2026, so a
 * machine that has had two controller ids is not counted twice. After that reconciliation
 * nothing is unresolved.
 */
export const WASHER_TELEMETRY = {
  readAt: '2026-09-16',
  reporting: 10,
  totalCycles: 2_330,
  totalKwh: 3_546,
  source: 'daily_machine_rollups, reconciled against the asset register through the reviewed controller aliases in src/lib/fleet/identity.ts',
  flagship: {
    assetId: 'GB0-113',
    where: "Norm's house, Tennant Creek",
    cycles: 951,
    kwh: 2_611,
    from: '17 November 2025',
    to: '16 September 2026',
  },
  /** Said plainly, because a funder will work it out anyway. */
  honest: [
    'Only ten machines report at all. The rest have no controller fitted, so the fleet is measured where it is instrumented and estimated nowhere else.',
    'Three controllers reported and then went silent. One did 550 cycles before it stopped in March 2026 and has not been seen since. They sit on the register as under investigation, which is what they are.',
    'Ten register rows still read deployed that canon does not count, pending restatus. The public figure is 23 and stays 23 until the register catches up.',
  ],
} as const;

/** Where the machine goes next. Intent, labelled as intent. */
export const WASHER_NEXT: readonly { title: string; detail: string }[] = [
  { title: 'Cheaper, smaller and still durable', detail: 'The aim for the next version, in that order. It has to compete with what a family can already buy in town, or it stays a machine that arrives only when a funder pays for it. Ben, 17 September 2026.' },
  { title: 'Parts that can be replaced in community', detail: 'The drum is a Speed Queen and it stays, because it can be repaired anywhere. What we build around it, the enclosure, the controller and the plumbing, is where the cost and the size have to come out.' },
  { title: 'Measured against the laundry it replaces', detail: 'A commercial remote laundry is the comparison nobody has costed properly. The cycles and kilowatt hours above are the beginning of that number.' },
];

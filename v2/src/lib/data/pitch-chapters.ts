/**
 * The words the pitch page prints that the deck settled on 15 September 2026 and no other
 * module holds: the four gates with their money lines (S17), the request detail (S18), the
 * four measures with today, plan and label (S14), the origin (S04), the board headline (S05)
 * and the close (S19). Everything with a figure points at the module the figure lives in.
 * Deck copy: deliverables/deck-master (Notion 3d1ebcf981cf817598d8f15ee4f89c32), 15 Sep 14:50.
 */

import { ORGANISATION } from './organisation';
import { CANONICAL_ASSETS } from './asset-canonical';
import { BED, RAISE, aud, dollars } from './model-placemat';
import { PLASTIC_KG_PER_BED } from './products';
import { PAID_AUD, PAID_BEDS } from './story-questions';

export const CHAPTERS_UPDATED = '2026-09-15';

export type MeasureLabel = 'verified' | 'estimate' | 'modelled' | 'target';

/** S17. Four gates; nothing moves until the one before it is settled. */
export interface Gate {
  id: string;
  title: string;
  detail: string;
  money: string;
}

export const GATES4: readonly Gate[] = [
  {
    id: 'agree',
    title: 'Agree with each community',
    detail: 'Each of the four community organisations signs an agreement: who owns the beds, who is paid, who decides.',
    money: 'No money moves yet.',
  },
  {
    id: 'cost',
    title: 'Cost each facility',
    detail: 'Site, power, shed, freight. One quote per facility. QBE and the community say yes before anything is bought.',
    money: `QBE's ${dollars(RAISE.qbeAud / 2)} a facility is released here.`,
  },
  {
    id: 'confirm',
    title: 'Confirm beds and buyers',
    detail: `The first ${RAISE.bedsYearOne} beds are paid for. Who buys and who gets a bed is agreed with each organisation before a bed ships.`,
    money: `Philanthropy's ${dollars(RAISE.bedsShownAud)} buys the beds.`,
  },
  {
    id: 'run',
    title: 'Build, run, review',
    detail: 'Facilities open. Six months of making. We publish the numbers and decide with each community whether to add the next.',
    money: 'Every sale stays with the community organisation.',
  },
];

export const GATES_HEADLINE = 'Four gates. Nothing moves until the one before it is settled.';
export const GATES_FOOTER = 'Proposed sequence. A gate is settled when the agreement, the quote, the buyers or the numbers are in hand, in that order.';

/**
 * S18. One facility running the whole chain: collect, shred, press, make, sell. From the
 * finance worktree's community-economics PATHWAYS "The whole chain" (450 beds' material a
 * year): earns $337,500, runs $79,333. Modelled; no facility has run yet.
 */
export const FACILITY_ECONOMICS = {
  earnsAYearAud: 337_500,
  runsAYearAud: 79_333,
  basis: 'modelled' as const,
  source: 'goods-finance-wt v2/src/lib/data/community-economics.ts, PATHWAYS "The whole chain", 450 beds of material a year.',
};

export const REQUEST_DETAIL = {
  headline: `QBE Foundation: ${aud(RAISE.qbeAud)} for two production facilities.`,
  status: 'Asked of QBE Foundation Catalysing Impact Stage 2. Nothing signed.',
  scope: `Two community production facilities, ${aud(RAISE.qbeAud / 2)} each.`,
  explainer: `A facility is the whole chain: collect plastic, shred it, press the sheets, make the beds, sell them. Run at full pace it earns about ${aud(FACILITY_ECONOMICS.earnsAYearAud)} a year and costs about ${aud(FACILITY_ECONOMICS.runsAYearAud)} to run, so it carries itself after set-up. Modelled.`,
  buys: {
    title: 'What the money buys',
    line: 'Container, press, shredder, tooling, site set-up, freight and training for local makers. Bought after the community agrees and the quote is in.',
  },
  notBuys: {
    title: 'What it does not buy',
    line: `Beds. Philanthropy buys the first ${RAISE.bedsYearOne}. QBE money never buys stock, and no community sale repays it.`,
  },
  where: {
    title: 'Where',
    line: 'Palm Island and Maningrida are the working choices. Neither has agreed. A facility goes where a community is ready and asks.',
  },
  footer: `${aud(RAISE.qbeAud / 2)} a facility is a planning allowance. Nothing in the raise is signed. Alice Springs is a third facility under Oonchiumpa's own Commonwealth offer, outside this request.`,
} as const;

/** S14. Four things we count, and how far each is counted today. */
export interface Measure {
  id: 'enterprise' | 'work' | 'recycling' | 'health';
  area: string;
  title: string;
  today: { value: number; unit: string; line: string; label: MeasureLabel };
  plan: { value: number; unit: string; line: string; label: MeasureLabel };
  counted: string;
}

const HOURS_ESTIMATE = 2_080;
const HOURS_PLAN = RAISE.bedsYearOne * 2;
const KG_TODAY = CANONICAL_ASSETS.stretchBedsDeployed * PLASTIC_KG_PER_BED;
const KG_PLAN = RAISE.bedsYearOne * PLASTIC_KG_PER_BED;

export const MEASURES: readonly Measure[] = [
  {
    id: 'enterprise',
    area: 'Enterprise',
    title: 'Beds paid for, and enterprises trading',
    today: { value: PAID_BEDS, unit: 'beds', line: `${PAID_BEDS} beds and 11 washing machines paid for, ${aud(PAID_AUD)} including GST.`, label: 'verified' },
    plan: { value: RAISE.bedsYearOne, unit: 'beds', line: `${RAISE.bedsYearOne} beds as community stock, four organisations selling.`, label: 'target' },
    counted: 'Settled invoices in Xero. The organisation\'s own sales record. Community enterprises trading today: 0.',
  },
  {
    id: 'work',
    area: 'Paid work',
    title: 'Paid hours of making',
    today: { value: HOURS_ESTIMATE, unit: 'hours', line: `${HOURS_ESTIMATE.toLocaleString('en-AU')} hours by Goods staff over six months.`, label: 'estimate' },
    plan: { value: HOURS_PLAN, unit: 'hours', line: `${HOURS_PLAN} paid hours a year for ${RAISE.bedsYearOne} beds at two hours a bed.`, label: 'modelled' },
    counted: 'Ben\'s estimate today: eight hours a day, five days a week, six months, two people. The daily production log and wages paid from here.',
  },
  {
    id: 'recycling',
    area: 'Recycling',
    title: 'Plastic kept out of landfill',
    today: { value: KG_TODAY, unit: 'kg', line: `${KG_TODAY.toLocaleString('en-AU')} kg design mass in ${CANONICAL_ASSETS.stretchBedsDeployed} Stretch Beds. Weighed: 0 kg.`, label: 'modelled' },
    plan: { value: KG_PLAN, unit: 'kg', line: `${(KG_PLAN / 1000).toLocaleString('en-AU')} tonnes for ${RAISE.bedsYearOne} beds at ${PLASTIC_KG_PER_BED} kg a bed.`, label: 'modelled' },
    counted: 'Shred weighed in and parts weighed out, every batch.',
  },
  {
    id: 'health',
    area: 'Health and daily life',
    title: 'Beds in homes, and follow-ups done',
    today: { value: CANONICAL_ASSETS.bedsDeployed, unit: 'beds', line: `${CANONICAL_ASSETS.bedsDeployed} beds in homes across ${CANONICAL_ASSETS.communitiesServed} communities. Follow-ups done: 0.`, label: 'verified' },
    plan: { value: 50, unit: 'beds followed up', line: '50 beds followed up at delivery, six weeks and three months.', label: 'target' },
    counted: 'The register. Consented follow-up visits. Clinical outcomes need their own study.',
  },
];

export const MEASURES_HEADLINE = 'Four things we count, and how far each is counted today.';
export const MEASURES_FOOTER = 'One of four measures is verified today. The first year is what makes the other three measurable. Every figure carries its label: verified, estimate, modelled or target.';

/**
 * S04. Where Goods on Country started. The studio's own words, copied from the A Curious
 * Tractor site (act-regenerative-studio: src/app/layout.tsx, src/app/method/page.tsx,
 * src/data/projects.ts, 15 Sep 2026). Stills and the small hero loops are copied into
 * public/images/act and public/video/act; the field-videos folder on the ACT site is not in
 * git, so the loops travel with this repo.
 */
export interface OriginProject {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  /** What this project handed Goods on Country. */
  gives: string;
  image: { src: string; alt: string };
  /** A short muted loop for the collage tile, with its poster. */
  loop?: { src: string; poster: string };
  url?: string;
}

export const ORIGIN = {
  kicker: 'A Curious Tractor, where Goods on Country started',
  headline: 'Goods on Country began as an experiment. It is now a DGR1 charity with a 100% Indigenous board.',
  studio: 'A regenerative innovation studio stewarding a farm on Jinibara Country. Places, story systems, and public works you can step into.',
  body: 'A Curious Tractor is the studio Ben Knight and Nic Marchesi run. Goods on Country came out of its loop. In August 2026 the products, the making and the sales moved into the charity trading as Goods on Country, under an Indigenous board. A Curious Tractor keeps doing the research and development.',
  promise: 'Shared promise: we build with communities and design to hand over the keys.',
  loopIntro: 'ACT uses Listen, Curiosity, Action, Art as a working loop for regenerative innovation. We listen deeply, stay curious, build with people, and translate learning into art that can travel further.',
  loop: [
    { title: 'Listen', line: 'Start with place, people, and histories that are often ignored. Deep listening comes before design.' },
    { title: 'Curiosity', line: 'Ask better questions, test assumptions, and let emerging insight shape the next move.' },
    { title: 'Action', line: 'Build useful things with communities. Prototype carefully and stay accountable.' },
    { title: 'Art', line: 'Translate learning into culture, meaning, and public pressure. Art returns the loop back to listening.' },
  ],
  headerLoop: { src: '/video/act/harvest-field-notes-dji-0021-hero.mp4', poster: '/video/act/harvest-field-notes-dji-0021-hero.jpg', alt: 'The Harvest from the air' },
  projects: [
    {
      slug: 'the-harvest',
      title: 'The Harvest',
      tagline: 'Where people grow food, share meals, and belong',
      description: 'At The Harvest, neighbours gather to grow food, cook seasonal meals together, and tend therapeutic gardens that hold space for healing. Belonging is built slowly here, through shared work and good conversation.',
      gives: 'Where A Curious Tractor gathers people around food and shared work.',
      image: { src: '/images/act/harvest-witta-aerial.jpg', alt: 'The Harvest from the air, sheds and paddocks' },
      loop: { src: '/video/act/harvest-field-notes-dji-0021-hero.mp4', poster: '/video/act/harvest-field-notes-dji-0021-hero.jpg' },
      url: 'https://theharvestwitta.com.au',
    },
    {
      slug: 'empathy-ledger',
      title: 'Empathy Ledger',
      tagline: 'Stories kept on community\'s terms',
      description: 'Built with Elders and First Nations technologists, Empathy Ledger is a consent-first storytelling platform grounded in Indigenous data sovereignty and OCAP principles. Communities decide what is shared, how, and with whom.',
      gives: 'Every Goods story and quote lives here, with consent held per person.',
      image: { src: '/images/act/empathy-ledger-elder-trip.jpg', alt: 'Elders on the water during an Empathy Ledger trip' },
      loop: { src: '/video/act/empathy-ledger-elder-trip-hero.mp4', poster: '/video/act/empathy-ledger-elder-trip-hero.jpg' },
      url: 'https://empathy-ledger-v2.vercel.app',
    },
    {
      slug: 'justicehub',
      title: 'JusticeHub',
      tagline: 'Communities have the cure for locking up kids',
      description: 'Across Australia, grassroots programs are keeping First Nations young people out of detention and on Country, yet the money still flows to cells. JusticeHub documents what works and connects families to it in one search.',
      gives: 'The same open, hand-over approach Goods takes with the Basket Bed plans.',
      image: { src: '/images/act/justicehub-container.jpg', alt: 'The CONTAINED shipping container, a cell you can step into' },
      loop: { src: '/video/act/justicehub-container-hero.mp4', poster: '/video/act/justicehub-container-hero.jpg' },
      url: 'https://justicehub.com.au',
    },
    {
      slug: 'gold-phone',
      title: 'Gold.Phone',
      tagline: 'A payphone reborn for community stories',
      description: 'Gold.Phone is a remodelled payphone given a second life as a place to leave a story, a thought, or a message for the community. Pick up the handset and the past meets the present.',
      gives: 'The art practice that shapes how Goods tells its story.',
      image: { src: 'https://tednluwflfhxyucgwigh.supabase.co/storage/v1/object/public/photos/community/9c6a44ab-a19d-4868-8d82-18fa79edab6c.png', alt: 'The Gold.Phone, a payphone rebuilt in gold' },
    },
    {
      slug: 'the-confessional',
      title: 'The Confessional',
      tagline: 'A room built for the truth we carry',
      description: 'Most people rarely get a moment to say what weighs on them out loud. The Confessional builds that moment: a designed space and a careful ritual where people name hard truths on their own terms.',
      gives: 'Listening before designing, which is where the beds came from.',
      image: { src: '/images/act/the-confessional-trailer.jpg', alt: 'A frame from the Confessions to Philanthropy trailer' },
    },
    {
      slug: 'black-cockatoo-valley',
      title: 'Black Cockatoo Valley',
      tagline: 'Stewardship and restoration on Jinibara Country',
      description: 'On Jinibara Country, Black Cockatoo Valley is given back the time it needs: land under restoration, conservation taken seriously, and residencies that let cultural practice and new ways of working take root. The valley is the ground that makes the projects possible.',
      gives: 'The ground the studio stands on, and the patience the beds were designed with.',
      image: { src: '/images/act/black-cockatoo-valley-farm-aerial.jpg', alt: 'Black Cockatoo Valley farm from the air' },
    },
  ] satisfies readonly OriginProject[],
  logo: { act: '/images/act/act-mark-white.png', goods: '/brand/goods/logos/svg/goods-on-country-grounded-mono-white.svg' },
  graduated: 'A Curious Tractor graduated Goods on Country in August 2026.',
} as const;

/** S05. */
export const GOVERNANCE = {
  headline: 'Local decisions. Shared capability.',
  line: 'Goods on Country is a DGR1 charity led by 100% Indigenous Directors.',
  boardNote: 'The board carries responsibility for purpose, assets and organisational decisions.',
  staff: [
    { name: 'Nicholas Marchesi', role: 'Co-founder and project lead', line: 'Product development, manufacturing and community relationships.' },
    { name: 'Benjamin Knight', role: 'Co-founder, story and technology', line: 'Evidence, storytelling, systems and partnerships.' },
  ],
  communities: 'Community organisations lead their enterprises and decide how to use their sales income. Goods is developing shared support in production, buying, design, training, finance and communications.',
  members: `${ORGANISATION.membership.line} ${ORGANISATION.membership.why} ${ORGANISATION.membership.state}`,
} as const;

/** S12. Who buys from a community organisation. */
/** Washing machines per buyer are from the paid invoices (demand-and-buyers.ts, finance branch): INV-0303 carries Homeland School Company's two; the other three buyers' invoices carry none. */
export const BUYERS = {
  headline: `${PAID_BEDS} beds and 11 washing machines, bought and paid for.`,
  who: 'Health services, schools, housing programs, research programs and families. The organisation holds the stock, invoices the customer and keeps the whole $750.',
  rows: [
    { buyer: 'Centrecorp Foundation', beds: 167, washers: 0, line: 'Two orders for the Utopia homelands. Oonchiumpa held the build. 147 are in households and 20 are made and waiting.' },
    { buyer: 'ALIVE National Centre', beds: 100, washers: 0, line: 'Paid in full before one bed was made, for Gathering the Parts.' },
    { buyer: 'Homeland School Company, Maningrida', beds: 40, washers: 2, line: 'The first full run off our own press, assembled at Gamardi.' },
    { buyer: "Mala'la Health Service, Maningrida", beds: 13, washers: 0, line: 'Bought the year before, so two organisations in one place hold Goods stock.' },
  ],
  brings: 'Goods on Country brings the customer connections, the contracts and the freight.',
} as const;

/** S19. */
export const CLOSE = {
  headline: `The first ${RAISE.bedsYearOne} beds get people off the floor. The next ${RAISE.bedsYearOne} are made in community.`,
  invitation: 'Help buy the first beds, and build the two facilities that make every bed after.',
  photo: { src: '/images/community/maningrida/kids-carrying-orange-bed.jpg', alt: 'Two young people carrying an orange Stretch Bed at Gamardi', place: 'Gamardi · Maningrida homelands' },
} as const;

/** The people whose cleared quotes the page prints deterministically, by slide. */
export const VOICES_BY_CHAPTER = {
  products: ['Dianne Stokes'],
  maningrida: ['Tehmineh Mason'],
  utopia: ['Mykel', 'Karen Liddle', 'Dorrie Jones'],
} as const;

/**
 * S16, QBE door only. The year's ask line by line, keyed to the funding lines in grants.ts for
 * the funder's name and status. Adds to RAISE.totalAud ($749,750) and the bed lots to
 * RAISE.bedsAud; pitch-chapters.raise.test.ts holds both. Tim Fairfax counts year one only.
 */
export const RAISE_BREAKDOWN = [
  { line: 'qbe', buys: 'Two community production facilities', aud: RAISE.qbeAud },
  { line: 'tff', buys: '133 beds, year one of three', aud: 100_000 },
  { line: 'bmd', buys: '133 beds', aud: 99_750 },
  { line: 'snow', buys: '133 beds', aud: 100_000 },
  { line: 'sefa', buys: 'First-year running cost, repaid from beds sold', aud: RAISE.loanAud },
] as const;

/** The $750 bed, in the order the bar draws it. */
export const BED_SPLIT = [
  { id: 'making', label: 'Making', aud: BED.makeAud, colour: '#BBA255' },
  { id: 'freight', label: 'Freight', aud: BED.freightAud, colour: '#A8643F' },
  { id: 'facilitation', label: 'Facilitation', aud: BED.facilitationAud, colour: '#C45C3E' },
  { id: 'goods', label: 'Carries the organisation', aud: BED.contributionAud, colour: '#5E7A4C' },
] as const;

/** Every string this module prints, for the tells gate and the guards. */
export function everyChapterString(): string[] {
  const out: string[] = [GATES_HEADLINE, GATES_FOOTER, MEASURES_HEADLINE, MEASURES_FOOTER, ORIGIN.headline, ORIGIN.body, ORIGIN.studio, ORIGIN.promise, ORIGIN.loopIntro, ORIGIN.graduated, GOVERNANCE.headline, GOVERNANCE.line, GOVERNANCE.boardNote, GOVERNANCE.communities, BUYERS.headline, BUYERS.who, BUYERS.brings, CLOSE.headline, CLOSE.invitation];
  for (const g of GATES4) out.push(g.title, g.detail, g.money);
  for (const m of MEASURES) out.push(m.title, m.today.line, m.plan.line, m.counted);
  for (const p of ORIGIN.projects) out.push(p.title, p.tagline, p.description, p.gives);
  for (const l of ORIGIN.loop) out.push(l.title, l.line);
  for (const s of GOVERNANCE.staff) out.push(s.role, s.line);
  out.push(GOVERNANCE.members);
  for (const r of BUYERS.rows) out.push(r.line);
  out.push(REQUEST_DETAIL.headline, REQUEST_DETAIL.status, REQUEST_DETAIL.scope, REQUEST_DETAIL.explainer, REQUEST_DETAIL.buys.line, REQUEST_DETAIL.notBuys.line, REQUEST_DETAIL.where.line, REQUEST_DETAIL.footer);
  return out;
}

/**
 * THE END OF THE ROAD: every word and every figure in the closing four sections
 * of /pitch/road, in one typed place.
 *
 * Why this file exists. The ending used to live as five hardcoded sections in
 * page.tsx: an accounting taxonomy (equipment / measured run / working capital /
 * fixed-block cover) laid out as five equal tiles, with no person in it. Ten
 * screens of road open with somebody saying something, then the money arrives
 * and everybody vanishes. Ben, 2026-07-31: "the main part are fine all the way
 * up until the financial and ask part where it gets shit."
 *
 * Rules this file keeps, each of which was broken by the version it replaces:
 *  - Locked strings are IMPORTED, never retyped. ASK_HEADLINE.line, STAGE_RULE,
 *    NORTH_STAR and the 338 defence all have exactly one home.
 *  - Every money figure carries a real Solidity label. Not 'open', not 'framing',
 *    not 'target, not awarded' — those are not members of the vocabulary.
 *  - Each figure appears ONCE. $400K used to appear four times across three
 *    sections; it now appears only inside ASK_HEADLINE.line.
 *  - No dollar figure is attached to a named community's own pathway. We hold
 *    costings for Oonchiumpa and Utopia. Neither has been put to them, so
 *    neither goes on a public page first. The four asks are shown at four
 *    SIZES, and the money sits in THE_BUY_LIST, which is our ask, not theirs.
 *  - No bed count as a threshold anywhere (ruling I).
 *
 * Sources: canon.ts + asset-canonical.ts (figures), ask-surface.ts (the locked
 * raise answer), cost-story.ts (Solidity), community-pathways.ts (the four
 * pathways), storyteller-registry.ts (every quote, verbatim).
 */
import type { Solidity } from './cost-story';

// ---------------------------------------------------------------------------
// Voices. Every quote below was read verbatim out of storyteller-registry.ts on
// 2026-07-31. All are tier 'external' with status 'primary' or 'approved', and
// none appears in any road stop's voiceNames, so nobody speaks twice on the page.
//
// NEVER add a quote here that is not in the registry. A fabricated Elder quote
// was caught in a homepage mock on 2026-07-26; that is the failure mode.
export interface EndingVoice {
  text: string;
  name: string;
  attribution: string;
  portrait: string | null;
  status: 'primary' | 'approved';
  source: string;
}

export const VOICE_ONE_BED: EndingVoice = {
  text: 'Anything from a Holden car to a fridge or a washing machine or TV, it just costs more, you know, in these remote communities and especially the fridges and the washing machine ... they always broke down. But it costs people a lot more if they\'re not buying the right material ... when you go in a remote community, there\'s not much job ... they leaning on very small income.',
  name: 'Jimmy Frank',
  attribution: 'Jimmy Frank, Traditional Owner and Cultural Liaison, Tennant Creek',
  portrait: '/images/people/jimmy-frank.jpg',
  status: 'approved',
  source: 'storyteller-registry.ts, Jimmy Frank, quote 5 (the poverty premium)',
};

export const VOICE_FOUR_ASKS: EndingVoice = {
  text: 'We\'re given the opportunity to be consulted with, but you\'re never given the opportunity... it\'s rare that you\'re consulted with and then told, Hey.',
  name: 'Tanya Turner',
  attribution: 'Tanya Turner, Oonchiumpa Consultancy leadership, Alice Springs',
  portrait: null,
  status: 'approved',
  source: 'storyteller-registry.ts, Tanya Turner, quote 1 (consultation without decision power)',
};

export const VOICE_THE_LETTER: EndingVoice = {
  text: 'That\'s where we talk about allies, right? It\'s about letting Aboriginal people lead, but being an ally on the side.',
  name: 'Tanya Turner',
  attribution: 'Tanya Turner, Oonchiumpa Consultancy leadership, Alice Springs',
  portrait: null,
  status: 'primary',
  source: 'storyteller-registry.ts, Tanya Turner, quote 2 (the posture partners must hold)',
};

// ---------------------------------------------------------------------------
// Section 1: one bed, plainly.
export interface LadderRow {
  figure: string;
  line: string;
  label: Solidity;
}
export interface LadderColumn {
  column: string;
  rows: LadderRow[];
  foot: string;
}

export const BED_LADDER: LadderColumn[] = [
  {
    column: 'Buy the legs finished',
    rows: [
      { figure: 'about $685', line: 'What making it and moving it costs today.', label: 'verified' },
      { figure: 'about $65', line: 'What stays with Goods.', label: 'workpaper' },
    ],
    foot: 'Today\'s method. About 137 of the 177 Stretch Beds deployed were made this way.',
  },
  {
    column: 'Press the legs ourselves',
    rows: [
      { figure: 'about $426', line: 'What the same bed costs.', label: 'modelled' },
      { figure: 'about $324', line: 'What stays then. Five times what stays today.', label: 'modelled' },
    ],
    foot: 'Built from part prices we can put in front of you. Not yet measured across a full run.',
  },
];

/**
 * The 8.6x ratio. THE DENOMINATOR IS $40, NOT $55, and getting this wrong is how
 * a funder breaks the page with a calculator: $344.05 / $55 is 6.3, not 8.6.
 * cost-model-scenarios.json prices the leg element at raw_low 40.00 with
 * index_low 8.6, and holds raw_hdpe_cost_per_bed_no_delivery = 40.00 against
 * raw_hdpe_cost_per_bed_with_delivery = 55.00. The ratio is against raw shred
 * before delivery. Do not join the two figures with a "so".
 */
export const LEG_RATIO = {
  legCost: '$344.05',
  rawShred: 'about $40',
  landed: 'about $55',
  ratio: '8.6 times',
  copy:
    'Why the legs. The recycled plastic legs are $344.05 of the bed, close to half of it. The raw shred inside them is about $40 at $2 a kilo, or about $55 once it is delivered. So we pay 8.6 times the raw cost of the plastic to have somebody else press it. Pressing them ourselves is the one part of the bed we can change.',
  label: 'verified' as Solidity,
  source: 'cost-model-scenarios.json idiot_index, leg element: raw_low 40.00, current 344.05, index 8.6',
};

export const THE_RUNNING_COST = {
  copy:
    'Before anybody makes a bed, about $109,500 a year runs Goods: the shed, the books, and the driving and flying it takes to be in community. At $65 a bed you cannot get there from here. At $324 you can see how you would. How many beds that takes depends on who pays the person running the line. That is the biggest thing we have not settled, and we have not settled it.',
  label: 'workpaper' as Solidity,
};

export const THE_TRADING = {
  copy:
    'The business already trades. Goods-only revenue last financial year was $713,827. Our accountant helped us pull that out of the books and has not signed a letter for it, so we call it a workpaper.',
  label: 'workpaper' as Solidity,
};

// ---------------------------------------------------------------------------
// Section 2: the stopwatch.
//
// The old section rendered ASK_BLOCKS directly and leaked three internal strings
// to a public surface: 'The SEFA-shaped job.', 'B2B payment cycle' and
// '(ruling P, 2026-07-25)'. It also ran block.fundsWhat.split('.')[0], which cut
// at the decimal inside $109.5K and printed "12-18 months of the $109." to
// funders. These rows are written for reading, and the amounts are the same.
export interface BuyRow {
  n: string;
  name: string;
  amount: string | null;
  label: Solidity | null;
  sentence: string;
  low: number | null;
  high: number | null;
}

export const THE_BUY_LIST: BuyRow[] = [
  {
    n: '01',
    name: 'Equipment, quoted gross',
    amount: '$112,000 to $222,000',
    label: 'modelled',
    sentence:
      'A press line, a shredder, a CNC router and the benches around them. We have already put $110,046 of our own into the gear, most of it bought second hand, and we can show bills for about $43,700 of it so far.',
    low: 112000,
    high: 222000,
  },
  {
    n: '02',
    name: 'The measured run',
    amount: '$60,000 to $80,000',
    label: 'target',
    sentence:
      'Fifty beds pressed at production rate, with labour, power, material yield and time all measured.',
    low: 60000,
    high: 80000,
  },
  {
    n: '03',
    name: 'Working capital',
    amount: null,
    label: null,
    sentence:
      'We do not know what this needs. We will after the run. The line stays empty until then.',
    low: null,
    high: null,
  },
  {
    n: '04',
    name: 'Cover while volume climbs',
    amount: '$110,000 to $165,000',
    label: 'workpaper',
    sentence:
      'Twelve to eighteen months of the $109,500 a year it costs to keep the doors open, while bed numbers climb.',
    low: 110000,
    high: 165000,
  },
  {
    n: '05',
    name: 'Upkeep, and scoping the first site',
    amount: '$5,000 to $8,000 a year',
    label: 'modelled',
    sentence:
      'Three to five percent of equipment value a year to keep the machines running, plus scoping the first On Country site later.',
    low: 5000,
    high: 8000,
  },
];

/** Computed, never typed. A funder asked "how much do they need?" could not
 *  answer from the old page: five lines were given and never summed. */
export const BUY_LIST_TOTAL = {
  low: THE_BUY_LIST.reduce((sum, row) => sum + (row.low ?? 0), 0),
  high: THE_BUY_LIST.reduce((sum, row) => sum + (row.high ?? 0), 0),
};

export const STOPWATCH_NO_VOICE =
  'Nobody from community speaks on this screen. No cleared voice on our record talks about machines at this scale, and we would rather say that than borrow a quote about something else.';

/** deck.ts ask-slide script. It has never reached a public surface, and it is
 *  the sentence that buys the rest of the page its credibility. */
export const STOPWATCH_COMMITMENT =
  'If that number comes back worse than we think, you will hear it from us.';

// ---------------------------------------------------------------------------
// Section 3: four communities, four sizes.
//
// NO DOLLAR FIGURE APPEARS IN THIS SECTION, deliberately. We hold a full costing
// for Oonchiumpa and a module price for Utopia. Neither has been put to the
// community it describes, so neither goes on a public funder page first. The
// four asks differ by the SIZE of the thing asked for, which is the point, and
// the money lives in THE_BUY_LIST where it is ours rather than theirs.
//
// Palm Island's field is 'Where this sits', not 'Asked for': community-pathways.ts
// records evidenceState 'not-assessed' and "Existing Goods relationships must not
// be treated as a request". Writing their listening step as their ask would put
// a request in the mouth of a community that has not been approached.
export interface PathwayAsk {
  id: string;
  place: string;
  country: string;
  size: string;
  field: 'Asked for' | 'Where this sits';
  body: string;
  whatWeCanSay: string;
  whoseCall: string;
  ground: 'cream' | 'warm' | 'dark';
}

export const PATHWAY_ASKS: PathwayAsk[] = [
  {
    id: 'utopia',
    place: 'Utopia Homelands',
    country: 'Urapuntja, NT',
    size: 'One machine',
    field: 'Asked for',
    body:
      'Asked what they would want to own first, Urapuntja said a shredder. One machine, so plastic collected around the homelands becomes clean flake on Country, with young people doing the work.',
    whatWeCanSay:
      'A shredder we can price. What it needs around it, power, a pad, somewhere to stand and somebody to run it, we have not sized with Urapuntja, and none of our numbers have gone to them.',
    whoseCall: 'Jane Wilson and Urapuntja Aboriginal Corporation.',
    ground: 'cream',
  },
  {
    id: 'oonchiumpa',
    place: 'Oonchiumpa',
    country: 'Alice Springs, NT',
    size: 'The whole line',
    field: 'Asked for',
    body:
      'The whole thing. Shredding, pressing, CNC, training and operating support, run by Oonchiumpa, with the records and the photos kept by Oonchiumpa. Young people have already built Stretch Beds behind their office and kept the first one each.',
    whatWeCanSay:
      'We have costed a full build. Oonchiumpa has not seen that number yet, so they get it before anybody else does. They have also applied for federal money for this. It is not secured, and it sits outside the QBE match.',
    whoseCall: 'Oonchiumpa Consultancy and Services, Aboriginal owned and led.',
    ground: 'dark',
  },
  {
    id: 'tennant-creek',
    place: 'Tennant Creek',
    country: 'Warumungu Country, NT',
    size: 'The shed they already have',
    field: 'Asked for',
    body:
      'To work through the shed they already have. There is a two-stage proposal on the record from February and a relationship going back years, built around plastic recycling as a local enterprise out of Our Community Shed.',
    whatWeCanSay:
      'What we have not done is go back and check that it still holds. The reconnection email is written and has not been sent. Until it is, what the Shed wants now is theirs to say and not ours to print.',
    whoseCall: 'Michelle Bates and the Our Community Shed committee.',
    ground: 'cream',
  },
  {
    id: 'palm-island',
    place: 'Palm Island',
    country: 'Manbarra Country, QLD',
    size: 'A conversation',
    field: 'Where this sits',
    body:
      'Nothing has been asked for, because nobody has been asked. We have a Council-led introduction and no confirmed contacts. The first move is a listening conversation, on Council\'s terms and timing.',
    whatWeCanSay:
      'Our own model prices this at $0, and $0 is the wrong answer. Sitting down, listening and writing back what we heard takes real time and real money. It is the most common first step and the one nobody funds.',
    whoseCall: 'Palm Island Aboriginal Shire Council, then community.',
    ground: 'warm',
  },
];

/** Where the first site goes is not ours alone to settle, and four named
 *  communities are reading. State the process, never the outcome. */
export const FIRST_SITE_RULE =
  'Where the first site goes is not settled, and it is not ours alone to settle. The first measured run happens on the gear we already own, because the risk of a first attempt is ours to carry. What moves to Country is the version that already works, at the size that community asked for.';

// ---------------------------------------------------------------------------
// Section 4: the letter.
export const LETTER_LINES = [
  { n: '01', label: 'Amount', detail: 'How much.' },
  { n: '02', label: 'Instrument', detail: 'A grant, or repayable capital.' },
  { n: '03', label: 'Funder legal name', detail: 'The entity that would sign it.' },
  { n: '04', label: 'A person we can ring', detail: 'Somebody at your end who can verify it.' },
] as const;

/** Plain text of the four lines, so a reader can copy them straight into their
 *  own draft rather than reverse-engineering a letter from a web page. */
export const LETTER_PLAIN_TEXT = [
  'Amount:',
  'Instrument (grant or repayable capital):',
  'Funder legal name:',
  'Contact who can verify this (name, role, phone, email):',
  '',
  'This commitment may remain subject to board or credit approval.',
].join('\n');

export interface Door {
  verb: string;
  entity: string;
  body: string;
  match: string;
}

export const DOORS: Door[] = [
  {
    verb: 'Give',
    entity: 'The Butterfly Movement Ltd (DGR)',
    body:
      'A gift to the charity. Butterfly has been DGR endorsed since January 2012, and we are confirming the receipting mechanics before we promise you a deductible receipt, so ask us where that is up to before you write the amount. It pays for the parts of the work that carry no margin: sitting down at Palm Island, training the people who will run the machines, and keeping the doors open while bed numbers climb. It never buys a share of the company.',
    match: 'Counts toward the QBE match.',
  },
  {
    verb: 'Lend',
    entity: 'A Curious Tractor Pty Ltd, selling as Goods.',
    body:
      'Repayable capital buys the press line and bridges the months between making beds and being paid for them. Rate, term and repayment are agreed with you in writing. No return is promised before the run is measured.',
    match: 'Counts toward the match. QBE prefers this form.',
  },
  {
    verb: 'Buy beds',
    entity: 'A Curious Tractor Pty Ltd, selling as Goods.',
    body:
      '$750 a bed. An order is a community asking for beds and getting them, and Goods getting paid for making them. That is trading revenue.',
    match: 'Outside the QBE match.',
  },
];

/** canon.ts entity-operating-now records that Goods still trades through a sole
 *  trader while the migration runs. Two of the three doors name the company, so
 *  the page says which entity signs is an open question rather than implying the
 *  migration is finished. */
export const DOORS_NOTE =
  'Goods trades through a sole trader today and is migrating to A Curious Tractor Pty Ltd. Which entity signs is one of the things a first call settles.';

export const CLOSING_TAIL = 'Nothing is signed yet. That is where this starts.';

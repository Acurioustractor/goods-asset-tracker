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
  text: 'We\'re given the opportunity to be consulted with, but you\'re never given the opportunity... it\'s rare that you\'re consulted with and then told, Hey, we are here to listen and learn, to grow this together.',
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
      { figure: 'about $685', line: 'What it costs to make one and put it on a truck.', label: 'verified' },
      { figure: 'about $65', line: 'What stays with Goods.', label: 'workpaper' },
    ],
    foot: 'This is how we make them today. About 137 of the 177 Stretch Beds in communities were made this way.',
  },
  {
    column: 'Press the legs ourselves',
    rows: [
      { figure: 'about $426', line: 'What the same bed costs.', label: 'modelled' },
      { figure: 'about $324', line: 'What stays then. Five times what stays today.', label: 'modelled' },
    ],
    foot: 'Built up from part prices we can show you. Nobody has timed and costed a full run of them yet.',
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
    'The recycled plastic legs cost $344.05, close to half the bed. The plastic inside them is about $40 of shred at $2 a kilo, about $55 by the time it reaches us. We pay 8.6 times the raw cost, that $40, for somebody else to press it into legs. Pressing them ourselves is the one part of the bed we can change.',
  label: 'verified' as Solidity,
  source: 'cost-model-scenarios.json idiot_index, leg element: raw_low 40.00, current 344.05, index 8.6',
};

export const THE_RUNNING_COST = {
  copy:
    'Before anybody makes a bed, about $109,500 a year runs Goods: the shed, the books, and the driving and flying it takes to be in community. At $65 a bed you cannot get there from here. At $324 you can see how you would. How many beds that takes depends on who pays the person running the line, and that is not settled.',
  label: 'workpaper' as Solidity,
};

export const THE_TRADING = {
  copy:
    'Money already comes in the door. The Goods side of the books took $713,827 last financial year. Our accountant helped us pull that figure out and has not signed a letter saying it is right, so we call it a workpaper and not a fact.',
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
    name: 'The machines',
    amount: '$112,000 to $222,000',
    label: 'modelled',
    sentence:
      'A press line, a shredder, a CNC router and the benches around them. This band is what a new set costs at market. The price list further up is what one of each actually cost us, mostly bought second hand. We have already put $110,046 of our own into the gear and we can show bills for about $43,700 of that so far, with nothing taken off this line for it.',
    low: 112000,
    high: 222000,
  },
  {
    n: '02',
    name: 'Fifty beds, timed and costed',
    amount: '$60,000 to $80,000',
    label: 'target',
    sentence:
      'Fifty beds pressed one after another at full pace, with the hours, the power, the plastic used and the plastic wasted all written down as we go. Most of that figure is the labour and machine time nobody has been paid for yet. The beds themselves go to communities that have ordered them.',
    low: 60000,
    high: 80000,
  },
  {
    n: '03',
    name: 'The gap between making beds and getting paid',
    amount: null,
    label: null,
    sentence:
      'Beds get built months before the invoice gets paid, and that gap ties up cash. We do not know how much until we have run the fifty. The line stays empty until then.',
    low: null,
    high: null,
  },
  {
    n: '04',
    name: 'The months before the beds pay for it',
    amount: '$110,000 to $165,000',
    label: 'workpaper',
    sentence:
      'Twelve to eighteen months of the $109,500 a year it takes to run Goods, while bed numbers climb.',
    low: 110000,
    high: 165000,
  },
  {
    n: '05',
    name: 'Servicing, and a first look at a site On Country',
    amount: '$5,000 to $8,000 a year',
    label: 'modelled',
    sentence:
      'Parts and servicing every year, once the machines are running. Plus the time and travel to work out what a first site On Country would need.',
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
//
// CLEARED TO BE NAMED (ruling S, Ben, 2026-07-31): all four communities have said
// yes to appearing here with what each asked for. That clearance is about being
// NAMED and nothing else. It does not price anybody, it does not turn Palm
// Island's listening step into a request, and it does not make Tennant Creek's
// unsent email sent. The guards below stay for exactly that reason.
//
// ⚠ The evidence for each yes is not yet pointed at from this repo, the same gap
// the Maningrida photo clearance carried. When Ben names the form each one took,
// add a `clearance` reference per community here so a future session can verify
// rather than trust. Until then this rests on a dated ruling, not on a record.
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
      'Asked what they would want to own first, Urapuntja said a shredder. One machine, so the plastic collected around the homelands becomes clean flake on Country, with young people doing the work. The next step is to scope it together.',
    whatWeCanSay:
      'We are working toward a first modular setup built around a shredder. The site, power and operating plan still need to be worked through with Urapuntja. No funding is secured yet.',
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
      'The whole thing. Shredding, pressing, cutting the legs, training and the support to keep it running, all of it run by Oonchiumpa, with the records and the photos staying with Oonchiumpa. Young people have already built Stretch Beds behind their office and kept the first one each.',
    whatWeCanSay:
      'We are working toward a complete community-led production facility. Oonchiumpa has submitted a federal funding application and is waiting on the outcome. No funding is secured yet.',
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
      'To work through the shed they already have. A two-stage proposal went to them in February, and the relationship goes back years, built around turning local plastic into local work out of Our Community Shed.',
    whatWeCanSay:
      'We are working toward using the existing shed for local recycling and production. The earlier proposal now needs to be confirmed with Our Community Shed. No funding is secured yet.',
    whoseCall: 'Michelle Bates and the Our Community Shed committee.',
    ground: 'cream',
  },
  {
    id: 'palm-island',
    place: 'Palm Island',
    country: 'Manbarra Country, QLD',
    size: 'Recycling and production',
    field: 'Where this sits',
    body:
      'Palm Island is redesigning its refuse facility. That creates an opportunity to include recycling and local production as part of the new facility, shaped with the Council and community.',
    whatWeCanSay:
      'We are working toward making recycled-plastic production part of the wider refuse-facility redevelopment. The scope has not been agreed and no funding is secured yet.',
    whoseCall: 'Palm Island Aboriginal Shire Council, then community.',
    ground: 'warm',
  },
];

/** Where the first site goes is not ours alone to settle, and four named
 *  communities are reading. State the process, never the outcome. */
export const FIRST_SITE_RULE =
  'Where the first facility goes will be decided with communities. Goods will keep producing beds at the farm and The Harvest while each community chooses what it wants to build and own.';

// ---------------------------------------------------------------------------
// Section 4: the letter.
export const LETTER_LINES = [
  { n: '01', label: 'Amount', detail: 'How much.' },
  { n: '02', label: 'Grant or loan', detail: 'A grant, or a loan we pay back.' },
  { n: '03', label: 'The legal name', detail: 'The name that would go on the paperwork.' },
  { n: '04', label: 'A person we can ring', detail: 'Somebody at your end who can confirm it is real.' },
] as const;

/** Plain text of the four lines, so a reader can copy them straight into their
 *  own draft rather than reverse-engineering a letter from a web page. */
export const LETTER_PLAIN_TEXT = [
  'Amount:',
  'Grant, or a loan we pay back:',
  'The legal name that would sign this:',
  'Someone who can confirm this (name, role, phone, email):',
  '',
  'This can still be subject to your board or credit approval.',
].join('\n');

export interface Door {
  verb: string;
  entity: string;
  /** What the money does. Verbs and objects, never the name of an instrument. */
  does: string;
  /** The straight answer to "what comes back", including when nothing does. */
  returns: string;
  match: string;
}

export const DOORS: Door[] = [
  {
    verb: 'Give',
    entity: 'The Butterfly Movement Ltd, the charity',
    does:
      'Pays for the work no bed sale covers: sitting down and listening before anything is built, training the people who will run the machines, and keeping the doors open while bed numbers climb. It never buys a share of the company.',
    // Ruling J: the DGR endorsement is verified since Jan 2012, but whose name goes on the
    // receipt is still open, and a wrong deductibility claim is an ATO problem rather than a
    // copy problem. Say the open part in words a person would use.
    returns:
      'No money comes back. Butterfly has been endorsed to receive tax deductible gifts since January 2012. We are still working out how the receipt actually gets issued, so ask us where that is up to before you write the amount.',
    match: 'Counts toward the QBE match.',
  },
  {
    verb: 'Lend',
    entity: 'A Curious Tractor Pty Ltd, selling as Goods.',
    does:
      'Buys the press, the shredder and the machine that cuts the legs, and covers the gap between building beds and getting paid for them. They are the same machines a community can take one at a time.',
    returns:
      'Your money back, out of bed sales, on terms agreed with you: the rate, the term and when repayment starts. Nobody has agreed those terms yet, and we will not promise a return until the repayment plan is clear.',
    match: 'Counts toward the QBE match. It is the form QBE would rather see.',
  },
  {
    verb: 'Buy beds',
    entity: 'A Curious Tractor Pty Ltd, selling as Goods.',
    does: '$750 a bed. A community asks for beds, we make them, and they arrive.',
    returns: 'Beds in community, and an invoice. Money we earn rather than money we are given.',
    match: 'Outside the QBE match.',
  },
];

/** canon.ts entity-operating-now records that Goods still trades through a sole
 *  trader while the migration runs. Two of the three doors name the company, so
 *  the page says which entity signs is an open question rather than implying the
 *  migration is finished. */
export const DOORS_NOTE =
  'Goods sells through a sole trader today and is moving into A Curious Tractor Pty Ltd. Which name signs your paperwork is one of the things a first call sorts out.';

export const ASK_INTRO = {
  headline: 'What we need from you fits on one page.',
  body:
    'One page on your letterhead saying how much, in what form, the legal name that would sign it, and somebody we can ring. That page is what QBE counts as match, and it is the whole request today. The money itself follows, in whichever of the three forms below suits you, on terms we write together.',
};

export interface AskRow {
  label: string;
  value: string;
  supporting?: string;
}

/** Was five rows of scaffolding around one request, restating $400K three times.
 *  Two rows. The raise sentence itself is rendered separately, at display size,
 *  because it is the sentence a program officer repeats to their board. */
export const ASK_STATUS_ROWS: AskRow[] = [
  { label: 'Signed today', value: '$0', supporting: 'Nobody has signed anything yet.' },
  {
    label: 'What the match is',
    value: 'QBE Catalysing Impact, Stage 2',
    supporting:
      'They can say no. It is an application, not a cheque waiting for us. Grants run from about $150,000 to $400,000 and come out of one pool shared across ten enterprises, so the size is theirs to set. What the work costs is built from the bottom, line by line.',
  },
];

export const ASK_BELIEVABILITY =
  'The record is what there is to look at. Beds are in community and people sleep on them. We already sell beds and get paid for them. The machines were bought with our own money before we asked for yours, and we can show bills for part of that, not all of it.';

export const ASK_NEXT_STEP = {
  sentence:
    'The smallest step is fifteen minutes on the phone. Commitments need to be signed before we submit the QBE application, and the earlier they are in place, the stronger the application will be.',
  primary: { label: 'Ask for a fifteen minute call', href: '/contact' },
  secondary: { label: 'Every figure, with its source', href: '/register' },
};

export const CLOSING_TAIL = 'Nothing is signed yet. That is where this starts.';

// ---------------------------------------------------------------------------
// THE CHAIN: what supporting a community with assets and production costs.
//
// Ben, 2026-07-31: "backed by our simple financial model for supporting
// communities with assets and production." The model has existed in
// cost-model-scenarios.json since 2026-07-25 (capex_modules, ruling D: the
// object is INFRASTRUCTURE, not "a plant") and had never reached a public
// surface. The four named pathways carry no price, deliberately, which left the
// obvious question unanswered: so what does any of this cost?
//
// THIS SECTION IS GENERIC AND MUST STAY GENERIC. No community is named in it.
// It sits BEFORE #four-asks so the menu is met on its own terms and the four
// asks read as choices from it. That ordering is not cosmetic: rows 01 and 02
// add to $24,800-39,300, which is the exact internal Utopia figure, and running
// this section AFTER a screen naming Urapuntja's shredder would let a reader
// price a named community's pathway by adding two numbers.
export interface ChainStep {
  n: string;
  label: string;
  needs: string;
  /** Must equal the `needs` of the following step, letter for letter. The guard
   *  asserts it, so the picture cannot drift away from the model. */
  produces: string;
  amount: string;
  grade: 'evidenced' | 'estimate';
  label_status: Solidity;
  sentence: string;
}

export const CHAIN_INTRO = {
  eyebrow: 'What each step costs',
  headline: 'A community can own one machine, or the whole line.',
  body:
    'Each step makes exactly what the next step needs. Collect and you have sorted plastic in cages. Shred and you have flake. Press and you have leg kits. Assemble and you have beds. A community can take the first step and stop there. Underneath all five sits the same base: a container, power and a pad, and where a partner already has those, the lines come out of it.',
};

export const THE_CHAIN: ChainStep[] = [
  {
    n: '01',
    label: 'Collection and sorting',
    needs: 'Plastic already in the community',
    produces: 'Sorted HDPE in cages',
    amount: '$5,000 to $19,500',
    grade: 'estimate',
    label_status: 'modelled',
    sentence:
      'Cages at a drop-off point, bulka bags, scales and a sorting bench. The band is wide because of one item, a baler, and it may not be needed at all: rigid plastic is normally caged and carted rather than baled. Nobody has put that question to a supplier yet, and the answer closes most of the gap.',
  },
  {
    n: '02',
    label: 'Shredding',
    needs: 'Sorted HDPE in cages',
    produces: 'HDPE flake',
    amount: '$19,800',
    grade: 'evidenced',
    label_status: 'workpaper',
    sentence:
      'One machine, priced as one machine, with nothing split up to get there. We own one and it runs. The invoice for it is not in the books our accountant works from, so we call it a workpaper until we can put the bill in front of you.',
  },
  {
    n: '03',
    label: 'Pressing, cutting and finishing',
    needs: 'HDPE flake',
    produces: 'Finished leg kits',
    amount: '$32,780',
    grade: 'evidenced',
    label_status: 'verified',
    sentence:
      'Hot press, cold press and the machine that cuts the legs arrived on one bill, so pressing and cutting are priced together. The dearest step to buy and the dearest to run, which is one reason a community might want to start earlier in the chain.',
  },
  {
    n: '04',
    label: 'Assembly and workshop',
    needs: 'Finished leg kits',
    produces: 'Finished beds',
    amount: '$6,387',
    grade: 'evidenced',
    label_status: 'verified',
    sentence:
      'Benches, drills and hand tools, on two bills. The smallest number on this list, and the step where young people are already doing the work.',
  },
  {
    n: '05',
    label: 'Sales and delivery',
    needs: 'Finished beds',
    produces: 'Beds in community',
    amount: '$0',
    grade: 'evidenced',
    label_status: 'verified',
    sentence:
      'This one really is nothing. There is no machine to buy, and freight already sits inside the price of a bed, so it is not counted twice.',
  },
];

export const SITE_BASE = {
  label: 'Site base',
  amount: '$31,800 to $64,000',
  label_status: 'modelled' as Solidity,
  sentence:
    'None of the five steps runs on bare ground. A container to work in, a container to store in, power, a pad, wiring, ventilation and safety gear. The same list stands whether a community runs one step or all five. We hold a bill for one line in it, the crane; the rest is priced off what these things sell for in Australia today. Where a partner already has the shed, the power or the pad, those lines come out and the base gets smaller. It does not disappear, and how much comes out is that partner\'s answer to give, not ours.',
  lines: [
    { item: '40ft shipping container', amount: '$13,000 to $16,000', grade: 'estimate' },
    { item: '20ft shipping container', amount: '$6,000 to $10,000', grade: 'estimate' },
    { item: 'Diesel generator, sized for the press line', amount: '$6,600 to $20,000', grade: 'estimate' },
    { item: 'Crane and transport to place them', amount: '$1,200 to $2,500', grade: 'evidenced' },
    { item: 'Wiring, switchboard and three phase power', amount: '$3,000 to $8,000', grade: 'estimate' },
    { item: 'Ventilation and fume extraction', amount: '$1,000 to $3,000', grade: 'estimate' },
    { item: 'Site prep, pad and levelling', amount: '$500 to $3,000', grade: 'estimate' },
    { item: 'Safety gear and startup consumables', amount: '$500 to $1,500', grade: 'estimate' },
  ],
};

export const SITE_OPERATING = {
  floorAmount: '$35,000 a year',
  poolAmount: '$44,333 a year',
  totalAmount: '$79,333 a year',
  label_status: 'modelled' as Solidity,
  floorSentence:
    'The moment anybody works on a site, three bills start whether a machine runs that day or not: the books get done, the site is insured, the yard is paid for. About $35,000 a year. This is site money. It is not what it costs to run Goods. Two different bills.',
  // The wage of the person running the line is NOT in either figure, and saying so
  // is what stops a reader dividing $79,333 by the $324-a-bed figure two screens
  // up and reconstructing a bed threshold that ruling I retired.
  poolSentence:
    'Then each step costs something to run on top of that: servicing, consumables and the space it takes up. Running all five adds about $44,333 a year, and pressing carries the biggest share, because that is where the machines and the space are. Neither figure pays anybody to run the line. Who pays that person is the biggest thing we have not settled, and it changes this picture more than anything else on the page.',
  reconciliationSentence:
    '$35,000 and $44,333 come to $79,333. That is what we model bed sales alone carrying at a site, per year. It is the number we split into steps, and the steps add back to it exactly.',
};

/** Two grades, said in words a person uses, and the honest status of the whole
 *  structure. The JSON says of itself: "PROPOSED STRUCTURE, not agreed as a
 *  workbook shape... Reassembling these into modules is an ALLOCATION of an
 *  evidenced total, not new evidence. No figure here is a quote." */
export const CHAIN_HONESTY =
  'These are our own numbers for our own gear at the farm, mostly bought second hand; splitting one total into five steps is arithmetic on what we already had, not new evidence. Nothing here is a quote for a site in a community, and no community has been quoted from it.';

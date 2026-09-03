/**
 * THE QBE STORY: the long-form piece behind the deck, as data.
 *
 * `/sites/qbe/story` tells the whole thing in one read: the problem, the road, the bed, the loop,
 * who buys, the three kinds of money, how the grant is catalytic, where it goes if it works, who
 * decides, the entity, the measured run, what changes, the calendar, what is honest to say, and the
 * questions people keep asking. The deck is cut FROM this page (see DECK_MAP), so the page is the
 * longer version and the slides are its residue.
 *
 * Voice rule (Ben, 3 Sep 2026): the prose here is lifted from the QBE page Ben edits in Notion,
 * which was written from the 2 September call in the founders' words. Repo vocabulary stays in the
 * modules. Say beds, sell, plant, margin, washers, snowball, trust, rules, books. Figures are read
 * from `raise-stack.ts`, `community-loop.ts`, `bed-ratio.ts` and `canon.ts`; `qbe-story.guards.test.ts`
 * fails the build if a figure typed here disagrees with them, or if a banned term reaches prose.
 *
 * Source: deliverables/qbe-stage2/qbe-stage2-application-2026-09-03.md (the repo copy of the Notion
 * page "QBE final Phase - Simple and clean", 3d0ebcf981cf806b918fceff46528300).
 */
import { CANONICAL_ASSETS } from './asset-canonical';
import { BED_PRICE_AUD, KIT_COST_AUD, PRESSED_COST_AUD, STAYS_PRESSED_AUD, POOL, FACILITY_BAND } from './community-loop';
import { PROGRAM, QBE_ASK, KEY_DATES, lineById } from './raise-stack';
import { SCALE_ROWS } from './bed-ratio';
import type { Solidity } from './cost-story';

// ---------------------------------------------------------------------------
// The chapters, in reading order

export type StoryChapterId =
  | 'crux'
  | 'problem'
  | 'road'
  | 'bed'
  | 'loop'
  | 'buyers'
  | 'money'
  | 'catalytic'
  | 'snowball'
  | 'decides'
  | 'entity'
  | 'measured'
  | 'impact'
  | 'calendar'
  | 'honest'
  | 'faq'
  | 'deck';

export type StoryPart = 'the-story' | 'the-model' | 'the-money' | 'the-proof' | 'the-questions';

export const STORY_PARTS: { id: StoryPart; label: string }[] = [
  { id: 'the-story', label: 'The story' },
  { id: 'the-model', label: 'The model' },
  { id: 'the-money', label: 'The money' },
  { id: 'the-proof', label: 'The proof' },
  { id: 'the-questions', label: 'The questions' },
];

export interface StoryChapter {
  id: StoryChapterId;
  part: StoryPart;
  /** Short enough for the contents bar. */
  label: string;
  /** The mono line above the heading. */
  kicker: string;
  title: string;
  /** Pencil frame ids this chapter feeds, so the deck is cut from here and not the other way. */
  deckSlides: string[];
  /** The Zoho form questions this chapter answers, if any. */
  formQuestions: string[];
}

export const STORY_CHAPTERS: readonly StoryChapter[] = [
  { id: 'crux', part: 'the-story', label: 'The crux', kicker: 'If you read nothing else', title: 'We buy beds. Communities sell them. The money stays with them and builds the next thing.', deckSlides: ['01 cgjeR', '11 o35by'], formQuestions: ['Q6'] },
  { id: 'problem', part: 'the-story', label: 'The problem', kicker: 'The problem the model answers', title: 'Remote communities import the goods and export the value.', deckSlides: ['02 cJl95'], formQuestions: [] },
  { id: 'road', part: 'the-story', label: 'The road', kicker: 'Seven places that changed the work', title: 'Delivery was the easy part.', deckSlides: ['03 tWgC6', '04 h7RSm'], formQuestions: ['Q10'] },
  { id: 'bed', part: 'the-model', label: 'One bed', kicker: 'The unit: one bed, four things, any amount', title: 'Every dollar buys beds, so any amount reads the same way.', deckSlides: ['10C mX9er', '04 h7RSm'], formQuestions: ['Q5', 'Q6', 'Q7'] },
  { id: 'loop', part: 'the-model', label: 'The loop', kicker: 'One catalyst, five loops a community controls', title: 'The funder puts money in once. From there it is theirs.', deckSlides: ['08 BzO2h', '08C JCreO', '09 slq40', '10 W9ttl'], formQuestions: ['Q6'] },
  { id: 'buyers', part: 'the-model', label: 'Who buys', kicker: 'The question we get asked most', title: 'Where are they selling?', deckSlides: ['10A hJgxH'], formQuestions: ['Q18', 'Q19'] },
  { id: 'money', part: 'the-money', label: 'Three jobs', kicker: 'Capital with three jobs', title: 'Three kinds of money, and each does one job.', deckSlides: ['10 (from 08B Lnlxh)'], formQuestions: ['Q14', 'Q18'] },
  { id: 'catalytic', part: 'the-money', label: 'Catalytic', kicker: 'How the grant is catalytic', title: "What QBE's money starts, in order.", deckSlides: ['Appendix: the chain', '12'], formQuestions: ['Q18'] },
  { id: 'snowball', part: 'the-money', label: 'The snowball', kicker: 'Where it goes if it works', title: 'Five plants, twenty beds a week each.', deckSlides: ['09B u09Eoy'], formQuestions: [] },
  { id: 'decides', part: 'the-proof', label: 'Who decides', kicker: 'Who decides what', title: 'Three layers. Local decisions stay local.', deckSlides: ['07 LhlJr', 'MODEL 06'], formQuestions: ['Q19', 'Q22'] },
  { id: 'entity', part: 'the-proof', label: 'The entity', kicker: 'The entity, and how the money moves', title: 'Everything Goods sits in Goods on Country.', deckSlides: ['07 LhlJr (footer)'], formQuestions: ['Q1', 'Q2', 'Q3', 'Q8'] },
  { id: 'measured', part: 'the-proof', label: 'The measured run', kicker: 'The four gates and the measured run', title: 'One number carries the plan and nobody has earned it.', deckSlides: ['05 mvrUQ', '10A Judwf'], formQuestions: ['Q19'] },
  { id: 'impact', part: 'the-proof', label: 'What changes', kicker: 'What changes, and how we know', title: 'Numbers prove scale. Voices prove meaning.', deckSlides: ['09C qD5SQ', '06 hBFFe'], formQuestions: ['Q10', 'Q11', 'Q12'] },
  { id: 'calendar', part: 'the-proof', label: 'The calendar', kicker: 'Three applications inside fourteen days', title: 'One strategy, three cuts.', deckSlides: [], formQuestions: [] },
  { id: 'honest', part: 'the-questions', label: 'What is honest', kicker: 'What is honest to say, and what is not', title: 'Every figure carries its label.', deckSlides: ['09C qD5SQ (footer)'], formQuestions: ['Q12', 'Q21'] },
  { id: 'faq', part: 'the-questions', label: 'Questions', kicker: 'Questions people ask', title: 'What we get asked, and what we say.', deckSlides: [], formQuestions: [] },
  { id: 'deck', part: 'the-questions', label: 'To the deck', kicker: 'From this page to the deck', title: 'Each drawing is a slide. The copy on the slide is the copy here.', deckSlides: [], formQuestions: ['Q23'] },
];

export function storyChapter(id: StoryChapterId): StoryChapter {
  const found = STORY_CHAPTERS.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown story chapter: ${id}`);
  return found;
}

// ---------------------------------------------------------------------------
// The crux, in the founders' words (Notion page, 3 Sep 2026)

export const CRUX: readonly string[] = [
  'We buy beds. Communities sell them. The money stays with them and builds the next thing.',
  `One thousand Stretch Beds at $${BED_PRICE_AUD} is $${PROGRAM.costAud.toLocaleString('en-AU')}.`,
  `Five communities, ${POOL.beds} beds each. Each community decides how many go to families who need a bed tonight and how many are sold. Every bed sold puts up to $${BED_PRICE_AUD} in the community's hands. Sell the lot and that is $${POOL.costAud.toLocaleString('en-AU')}, enough to start on a production plant. With a plant a bed costs about $${PRESSED_COST_AUD} to make against $${KIT_COST_AUD} to buy in, so the next thousand carry a real margin. Then the same again with washing machines.`,
  'Where it goes if it works: five plants, twenty beds a week each, about 5,000 beds a year, around $1 million a year in margin that communities reinvest. That is the direction. We are not promising ten-year numbers. Communities build the muscle to run an enterprise, and where it branches from there is their call.',
  `We are asking QBE for $${QBE_ASK.recommended.aud.toLocaleString('en-AU')}. That buys ${QBE_ASK.recommended.beds} beds. It is a straight ratio: every bed is $${BED_PRICE_AUD} and every bed does the same four things, so $${QBE_ASK.smaller.aud.toLocaleString('en-AU')} is ${QBE_ASK.smaller.beds} beds and $${PROGRAM.costAud.toLocaleString('en-AU')} is the full thousand. QBE's beds go in first, into the first two communities. The rest of the thousand comes from the funders who have already asked us to apply, Tim Fairfax, Brian M. Davis, Snow, Minderoo and Dusseldorp, and from the 100 beds ALIVE has already paid for.`,
  'We see this as catalytic community investing. We are trusting communities to take the beds, sell them and build their own future with the money. The funder acts once. After that the money goes round inside the community.',
  'The question we get asked most is where they are selling. Mparntwe (Alice Springs) first, with Oonchiumpa, who have already built and delivered beds with their young people. Buyers are already paying: ALIVE bought 100 beds up front, Centrecorp has 130 on quote and there are more than 200 requests each in Tennant Creek and Mparntwe.',
  'The rules on sales money, resale and who holds the beds are being agreed with each community now.',
];

// ---------------------------------------------------------------------------
// The problem, four figures and one finding

export interface ProblemFigure {
  value: string;
  text: string;
  source: string;
}

export const PROBLEM_FIGURES: readonly ProblemFigure[] = [
  { value: '51.3%', text: 'of First Nations households in very remote NT needed at least one extra bedroom in 2021.', source: 'ABS 2021 Census' },
  { value: '3.1%', text: 'of employed First Nations people in the NT managed their own business in 2021, the lowest share of any jurisdiction.', source: 'ABS 2021 Census' },
  { value: '38.1%', text: 'First Nations employment in very remote Australia in 2022 to 23, against 68.0% in major cities.', source: 'AIHW' },
  { value: '275,190 t', text: 'of waste the NT sent to landfill in 2023 to 24. 12.7% was recycled.', source: 'NT Government waste report 2023 to 24' },
];

export const PROBLEM_INTRO =
  'The current supply system brings products in, creates little local work or ownership, and the used plastic still goes to landfill.';

export const PROBLEM_VOICES =
  'Twenty-three of the twenty-nine people whose Empathy Ledger interviews were analysed in July described the broken supply chain without being asked about it: freight, price, products that fail.';

export const PROBLEM_ROAD = `The beds have reached Kalgoorlie, Palm Island, Tennant Creek, the Utopia homelands, Maningrida, Mparntwe. Each delivery showed the work still to do on repair, washing and local access. The Basket Bed taught what had to become simpler and stronger. Elder Dianne Stokes named the washing machine Pakkimjalki Kari in Warumungu. The Stretch Bed combined years of feedback into a washable, repairable design whose recycled-plastic frames can be made closer to community. The next bed should be made on Country. That is the whole ambition, and the model is how the making and the decisions move there.`;

// ---------------------------------------------------------------------------
// The loop: two of the five steps have already happened

export interface ProofRun {
  place: string;
  photo: string;
  alt: string;
  body: string;
  /** What the run proves. */
  proves: string;
}

export const PROOF_RUNS: readonly ProofRun[] = [
  {
    place: 'Maningrida',
    photo: '/images/community/maningrida/gamardi-build-day-wide.jpg',
    alt: 'Build day at Gamardi, Maningrida. Forty Stretch Beds pressed at the farm, sent north, and assembled by young people with Homeland School Company.',
    body: 'In Maningrida, Homeland School Company asked for beds and washing machines for homeland families. We pressed the plastic at the farm, packed forty kits, sent them north, and young people put every bed together in community. Those forty are the only beds we have pressed ourselves; the other 137 Stretch Beds used kits from Defy Design.',
    proves: 'Maningrida is the proof we can make them.',
  },
  {
    place: 'Mparntwe',
    photo: '/images/community/alice-springs/oonchiumpa-team-red-bed.jpg',
    alt: 'The Oonchiumpa team in Alice Springs. Young people built Stretch Beds from flat-pack over two days out the back of the Oonchiumpa office, kept one each, and loaded the rest for the homelands.',
    body: 'In Mparntwe, Oonchiumpa picked the young people, ran two days of building out the back of the office, chose which households got beds and who drove them out to the homelands. Some of the young people were paid for the work. Centrecorp Foundation paid for the materials. Sixteen beds stayed in town.',
    proves: 'Oonchiumpa is the proof of the work, and why the first pool goes there once Kristy has seen it.',
  },
];

export const SPEED_NOTE =
  'A thousand beds in a quarter is eight times our biggest run. Kits can move that fast if Defy can. Our own press cannot yet, and that is what the first fifty beds will tell us.';

export const FOUR_TRUE =
  'Four things have to be true before any of this is real in a place. Someone is buying the sold beds, and we can name them. The rules are signed: who gets beds, who sells, who is paid, where the money goes. Someone runs the work, somewhere, and gets paid to. And the cost of a locally made bed has been measured.';

// ---------------------------------------------------------------------------
// Who buys: the question every room asks

export interface Buyer {
  who: string;
  what: string;
  status: string;
  label: Solidity;
  source: string;
}

const alive = lineById('alive');

export const BUYERS: readonly Buyer[] = [
  {
    who: alive.funder,
    what: `${alive.beds} beds, $${(alive.amountAud ?? 0).toLocaleString('en-AU')} ex GST, bought up front.`,
    status: 'paid',
    label: 'verified',
    source: alive.source,
  },
  {
    who: 'Centrecorp Foundation',
    what: '130 beds on quote (QU-0014), deferred pending community feedback.',
    status: 'quote open',
    label: 'verified',
    source: 'Xero quote QU-0014, May 2026; raise-stack.ts',
  },
  {
    who: 'Tennant Creek',
    what: 'More than 200 requests for beds.',
    status: 'requests',
    label: 'workpaper',
    source: 'Ben, QBE page, 3 Sep 2026',
  },
  {
    who: 'Mparntwe (Alice Springs)',
    what: 'More than 200 requests for beds. The first pool is proposed here, with Oonchiumpa, once they have seen and agreed the design.',
    status: 'requests',
    label: 'workpaper',
    source: 'Ben, QBE page, 3 Sep 2026',
  },
];

/** Three ways to back the work, from deck frame 10A. Who pays, and what each kind of money does. */
export const THREE_DOORS: readonly { who: string; does: string }[] = [
  { who: 'Philanthropy', does: 'Lowers the price of a bed, so a community pool can give some and sell some.' },
  { who: 'Government and business', does: 'Buy beds. ALIVE did, up front. Centrecorp has a quote open.' },
  { who: 'Impact investors and lenders', does: 'Invest in production once a locally made bed has a measured cost. Repaid from what Goods on Country makes on buyer orders.' },
];

export const WHO_SELLS =
  'Each community sells its own pool under its own rules, to whoever it chooses: families, local organisations, the health service, a buyer like Centrecorp. Who is buying the sold beds is the first of the four gates, and it is named per place before any bed moves.';

// ---------------------------------------------------------------------------
// Where it goes if it works: the snowball, as Ben says it

export const SNOWBALL = {
  plants: 5,
  bedsPerWeekPerPlant: 20,
  weeksPerYear: 50,
  /** The figure Ben uses out loud: "around $200 in the community's hands". The model says about $324. */
  marginPerBedProseAud: 200,
  marginPerBedModelAud: STAYS_PRESSED_AUD,
  label: 'target' as Solidity,
  direction:
    'Five plants, twenty beds a week each, about 5,000 beds a year, around $1 million a year in margin that communities reinvest. That is the direction.',
  honesty: 'We are not promising ten-year numbers. Communities build the muscle to run an enterprise, and where it branches from there is their call.',
} as const;

export const SNOWBALL_BEDS_PER_YEAR = SNOWBALL.plants * SNOWBALL.bedsPerWeekPerPlant * SNOWBALL.weeksPerYear;
export const SNOWBALL_MARGIN_PER_YEAR_AUD = SNOWBALL_BEDS_PER_YEAR * SNOWBALL.marginPerBedProseAud;

/** The four steps of the snowball, from the 2 September call. */
export const SNOWBALL_STEPS: readonly { title: string; body: string }[] = [
  { title: 'We buy beds', body: `${POOL.beds} beds into a community, at $${BED_PRICE_AUD} each.` },
  { title: 'The community sells them', body: `Up to $${POOL.costAud.toLocaleString('en-AU')} stays in the community if all ${POOL.beds} sell. Less when beds are given.` },
  { title: 'They start on a plant', body: `A full plant is ${FACILITY_BAND.publicPrice}. One pool sold in full reaches the bottom of that range.` },
  { title: 'The next thousand carry a margin', body: `About $${PRESSED_COST_AUD} to make against $${KIT_COST_AUD} to buy in. Then the same again with washing machines.` },
];

// ---------------------------------------------------------------------------
// The measured run (Part 1.9)

export const MEASURED_RUN = {
  claim: `We say a bed pressed locally costs about $${PRESSED_COST_AUD} against $${KIT_COST_AUD} for a kit. The part prices are real invoices and the forty Maningrida beds came off our press. Nobody has made fifty in a row at working pace and kept the receipts.`,
  counts: [
    'Kilos of plastic and what it cost',
    'Press time and power',
    'CNC hours (we think about 3.5 a bed, and we think that is where the cost hides)',
    'Operator hours kept separate from founder time',
    'Scrap, freight, and what breaks',
  ],
  test: `If it comes in at $${PRESSED_COST_AUD} or under, the model is right. If it comes in over, we publish it anyway and redo the maths in the open.`,
  open: 'The fifty should be a real order for a real community, so one run is the measurement and the delivery. Ben picks the community. Nic sets the window once the equipment is ready.',
  photo: '/images/process/factory-panorama.jpg',
  alt: 'The production facility at the farm, Witta. Shred, heat, press, CNC cut, assemble. Forty beds have come off this press for Maningrida; fifty at production rate, timed and costed, is the measured run.',
} as const;

// ---------------------------------------------------------------------------
// What changes, and how we know (Q10, slide 09C)

export interface OutcomeBucket {
  title: string;
  counted: string;
  body: string;
}

export const OUTCOMES: readonly OutcomeBucket[] = [
  { title: 'A bed off the ground', counted: 'per bed and per washer', body: `Washable and repairable, in homes where ${PROBLEM_FIGURES[0].value} of very remote NT First Nations households need another bedroom.` },
  { title: 'Paid local work', counted: 'in hours and roles', body: 'Assembly, delivery, repair and recycling. Counted in hours and roles, never promised in headcounts.' },
  { title: 'Local enterprise and control', counted: 'at month six', body: 'A community partner holds a pool, sets the rules, keeps the sales money. Tested at month six: keys, payroll, who invoices, half of production. Partial counts as no.' },
  { title: 'Plastic kept in use', counted: 'in kilograms per batch', body: 'About 20kg of recycled plastic in every frame. A design figure today, weighed batch by batch in the measured run.' },
];

export const HOW_WE_KNOW: readonly { title: string; body: string }[] = [
  { title: 'The register', body: `${CANONICAL_ASSETS.bedsDeployed} beds across ${CANONICAL_ASSETS.communitiesServed} communities, a record per unit, and every published count comes from it.` },
  { title: 'The voices', body: 'Empathy Ledger interviews, theme-coded and consented quote by quote. Twenty-nine substantive interviews analysed in July 2026 into 191 verbatim quotes on thirteen themes; thirty-seven people cleared to speak externally.' },
  { title: 'The measured run', body: 'Fifty beds at production rate: hours, energy, plastic used and wasted, cost per bed.' },
  { title: 'The month-six test', body: 'Four questions with yes or no answers. Partial counts as no. The test that lets the ownership claim fail.' },
];

export const IMPACT_RULE = 'No number without a voice, and no voice reduced to a number.';
export const HEALTH_RULE =
  'We do not claim health outcomes. Scabies and rheumatic heart disease are the reason the hardware matters; the beds are washable and off the ground because of them, and that is where the claim stops.';

export const MONTH_SIX_QUESTIONS: readonly string[] = [
  'Who holds the keys to the site?',
  'Who runs the payroll for the local work?',
  'Who invoices the buyer?',
  'Is at least half of production done locally?',
];

// ---------------------------------------------------------------------------
// What is honest to say (Part 1.10). Each rule is enforced somewhere; the page says so.

export interface HonestRule {
  rule: string;
  enforcedBy: string;
}

export const HONEST_RULES: readonly HonestRule[] = [
  { rule: `$${PROGRAM.costAud.toLocaleString('en-AU')} is only ever the cost of the beds. Never sales, never income, never community income.`, enforcedBy: 'raise-stack.guards' },
  { rule: 'Nothing is signed today. It is derived from status and stated first. A line is signed only when a letter names the amount, the instrument, the legal name and a person Social Impact Hub can call.', enforcedBy: 'raise-stack.guards' },
  { rule: `QBE is discretionary and sits on top of signed external paper. It does not match, double, trigger or guarantee anything. $${QBE_ASK.recommended.aud.toLocaleString('en-AU')} is the ask and the top of the range; $${QBE_ASK.smaller.aud.toLocaleString('en-AU')} is the smaller amount.`, enforcedBy: 'ruling V; raise-stack.guards' },
  { rule: 'No community is named beside a price or a pool until it has seen the design. Four communities may be named with what each asked for; nobody has asked for 200 beds.', enforcedBy: 'ruling S; road-ending.guards; qbe-story.guards' },
  { rule: `The pressed cost of about $${PRESSED_COST_AUD} and the local margin of about $${STAYS_PRESSED_AUD} are modelled until the measured run.`, enforcedBy: 'canon.ts labels; community-loop.guards' },
  { rule: 'Plastic is 20kg a bed, a workpaper figure, never 25kg or 45kg.', enforcedBy: 'ruling T; bed-ratio.guards' },
  { rule: 'Scabies to rheumatic heart disease is the reason the hardware matters. It is never claimed as an outcome.', enforcedBy: 'CONTEXT.md; check:community-copy' },
  { rule: 'Ownership is a pathway. The 51% supplier test is never implied as met from board composition alone.', enforcedBy: 'ownership-test.ts' },
  { rule: 'The products are designed in community. The other phrase is retired.', enforcedBy: 'check:voice' },
  { rule: 'Forty beds were pressed at the farm for Maningrida. Any surface that says none were is wrong.', enforcedBy: 'check:qbe-guardrails' },
];

// ---------------------------------------------------------------------------
// The calendar (dates from raise-stack KEY_DATES and the invitation emails)

export interface CalendarEvent {
  date: string;
  when: string;
  what: string;
  big?: boolean;
}

export const CALENDAR: readonly CalendarEvent[] = [
  { date: KEY_DATES.checkIn, when: 'Thu 3 Sep', what: 'Final cohort check-in with Social Impact Hub, 2pm Sydney. Ben with Eloise on Butterfly\'s books.' },
  { date: '2026-09-09', when: '7 to 11 Sep', what: 'Philanthropy Australia conference, Brisbane. Miranda from Brian M. Davis sees a bed.' },
  { date: '2026-09-14', when: 'Mon 14 Sep', what: 'Butterfly Movement AGM, tentative. Directors resign and are reappointed.' },
  { date: KEY_DATES.qbeClose, when: 'Fri 25 Sep, 12pm', what: 'QBE Stage 2 form closes. Brian M. Davis application closes the same day.', big: true },
  { date: KEY_DATES.qbeReview, when: 'Wed 7 Oct', what: 'QBE application review meeting, 9:45 Sydney, booked.' },
  { date: KEY_DATES.tfffClose, when: 'Fri 9 Oct, 5pm', what: 'Tim Fairfax Family Foundation application closes.' },
  { date: KEY_DATES.qbeOutcomes, when: 'Fri 23 Oct', what: 'QBE conditional outcomes.' },
  { date: KEY_DATES.qbePreconditions, when: 'Fri 13 Nov', what: 'QBE deadline to meet any pre-conditions.', big: true },
  { date: '2026-11-19', when: 'Thu 19 Nov', what: 'Brian M. Davis board decides.' },
  { date: '2026-11-26', when: 'Late Nov', what: 'Tim Fairfax board decides (date unconfirmed).' },
];

export const CALENDAR_FAULT =
  'Both foundation boards decide after QBE\'s 13 November pre-condition date. The question for Social Impact Hub is whether written invitations with callable contacts count as conditional commitments, and whether the pre-condition window can extend to those board dates.';

// ---------------------------------------------------------------------------
// From this page to the deck (Part 5)

export interface DeckMapRow {
  slide: string;
  carries: string;
  source: string;
}

export const DECK_MAP: readonly DeckMapRow[] = [
  { slide: '07 Governance before capital', carries: 'Three layers, status strip, applicant footer after Jay', source: 'Who decides, and the who-decides drawing' },
  { slide: '08 First capital becomes local choice', carries: `The catalyst row; $${PROGRAM.costAud.toLocaleString('en-AU')} as the cost of the beds only`, source: 'The loop, top of the loop drawing' },
  { slide: '08C The loop, in one drawing', carries: 'Five steps, the return arrow, four gates', source: 'The loop drawing' },
  { slide: '09 One pool, three uses', carries: 'Give some, sell some, decide again; no dollar figure', source: 'The loop' },
  { slide: '09C What changes, and how we know', carries: 'Four things that change, four instruments, the labels', source: 'What changes; what is honest' },
  { slide: '10 Capital with three jobs', carries: 'Bed money, organisation money, borrowed money, the measured cost, nothing signed', source: 'Three jobs, and the three-jobs drawing' },
  { slide: '10C One bed, four things, any amount', carries: 'The unit card and the scale table', source: 'One bed, and the unit drawing' },
  { slide: '11 The first pool builds the next capability', carries: 'The four steps; Oonchiumpa named only once Kristy has seen the pool', source: 'The loop; who buys' },
  { slide: '12 Back the first pool', carries: `The decision: $${QBE_ASK.recommended.aud.toLocaleString('en-AU')} buys ${QBE_ASK.recommended.beds} beds; $${QBE_ASK.smaller.aud.toLocaleString('en-AU')} is ${QBE_ASK.smaller.beds}; three invitations in hand, nothing signed`, source: 'The crux; catalytic' },
  { slide: 'Appendix: the chain', carries: 'Five links with a condition on every link, for the review meeting', source: 'Catalytic, and the chain drawing' },
];

// ---------------------------------------------------------------------------
// Figures the page prints in prose, read once here so the guards can compare

export const STORY_FIGURES = {
  bedPriceAud: BED_PRICE_AUD,
  programCostAud: PROGRAM.costAud,
  programBeds: PROGRAM.beds,
  poolBeds: POOL.beds,
  poolCostAud: POOL.costAud,
  kitCostAud: KIT_COST_AUD,
  pressedCostAud: PRESSED_COST_AUD,
  askAud: QBE_ASK.recommended.aud,
  askBeds: QBE_ASK.recommended.beds,
  smallerAud: QBE_ASK.smaller.aud,
  smallerBeds: QBE_ASK.smaller.beds,
  bedsDeployed: CANONICAL_ASSETS.bedsDeployed,
  communities: CANONICAL_ASSETS.communitiesServed,
  scaleRows: SCALE_ROWS,
} as const;

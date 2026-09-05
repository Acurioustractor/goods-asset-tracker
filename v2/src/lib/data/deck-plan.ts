/**
 * THE TWELVE-SLIDE DECK, planned from the story of the model and shaped by the QBE form.
 *
 * Ben, 4 Sep 2026: "how do we go from this long write-up to a 12 slide deck aligning to these
 * key areas specifically and reviewing the current plan for the deck?" The form has twenty-five
 * questions; nine of them are the narrative ones a deck can carry (Q2, Q5, Q6, Q7, Q8, Q10, Q14,
 * Q18, Q19). Each slide below names the question it answers, the chapter of `/sites/qbe/story` it
 * is cut from, the drawing it carries, and the Pencil frame that exists today with its verdict from
 * `deliverables/deck-review-2026-09.md`.
 *
 * Ben's six asks for the deck, and where each lands:
 *  1. who has said they will support the ask  -> slide 10 (SUPPORTERS_OF_THE_ASK)
 *  2. a few loan options like SEFA             -> slide 10, third column (LENDERS, OTHER_LENDER_OPTIONS)
 *  3. the buying story, every buyer who paid   -> slide 4 (BUYING_STORY)
 *  4. governance and the board, clearly        -> slide 9 (the who-decides drawing)
 *  5. the costs and the model, simply          -> slides 6 and 7 (the unit, the loop)
 *  6. flexible on the thousand, and plan B     -> slides 6, 11 and 12 (the scale table, PLAN_B, the ask)
 *
 * This replaces DECK_MAP in qbe-story.ts as the plan the rebuild (map #236, ticket #244) works
 * from. The guards assert twelve slides, every narrative question covered, and every drawing id real.
 */
import type { StoryChapterId } from './qbe-story';

export type SlideStatus = 'keep' | 'fix' | 'rebuild' | 'new';

export interface DeckSlide12 {
  n: number;
  /** A conclusion, one idea. */
  title: string;
  /** What we say on it, in one line. */
  says: string;
  /** What the slide carries: a drawing, a photo, a table, a list. */
  carries: string;
  /** The form questions it answers. */
  answers: string[];
  /** The chapter of the story it is cut from. */
  chapter: StoryChapterId;
  /** The drawing id in lib/diagrams, or null for a photograph or a list. */
  drawing: string | null;
  /** The Pencil frame that exists today, or null if the slide is new. */
  frame: string | null;
  status: SlideStatus;
  note: string;
}

export const DECK_PLAN: readonly DeckSlide12[] = [
  {
    n: 1,
    title: 'The first money buys beds for a community.',
    says: 'The community sells them, and the money stays there to build the next thing.',
    carries: 'The crux line over the Stretch Bed on Country. Goods on Country.',
    answers: ['Q6'],
    chapter: 'crux',
    drawing: null,
    frame: 'QiRll',
    status: 'fix',
    note: 'The cover instance keeps; the statement becomes the crux line (Ben, 4 Sep). Two stacked instances go.',
  },
  {
    n: 2,
    title: 'Remote communities import the goods and export the value.',
    says: 'Crowded homes, few local businesses, low employment, plastic to landfill. Four figures, sourced.',
    carries: 'The four problem figures with their sources.',
    answers: ['Q6'],
    chapter: 'problem',
    drawing: null,
    frame: 'Yzth3',
    status: 'fix',
    note: 'The original 02 is gone; rescue this copy into the row. Date ranges without dashes.',
  },
  {
    n: 3,
    title: 'Delivery was the easy part.',
    says: 'Seven places in two years taught us what the model now carries.',
    carries: 'The six-step road with Gloria at Ninga Mia, Dr Boe Remenyi, Palm Island, Tennant Creek, Witta, Oonchiumpa.',
    answers: ['Q10'],
    chapter: 'road',
    drawing: null,
    frame: 'tWgC6',
    status: 'fix',
    note: 'Spell the doctor as the registry has it and label her a practitioner.',
  },
  {
    n: 4,
    title: 'Buyers are already paying.',
    says: '540 beds in eleven communities, and four organisations have bought beds on invoices, not promises.',
    carries: 'The buying story: Centrecorp, Homeland School Company, Mala\'la Health Service, ALIVE, with dates and counts; the two towns with requests; the map of where the beds are.',
    answers: ['Q10', 'Q14', 'Q19'],
    chapter: 'buyers',
    drawing: 'who-buys',
    frame: 'F9P5e',
    status: 'new',
    note: 'Built from the 03.1 map frame and the who-buys drawing. This is the slide the question "where are they selling?" is answered on.',
  },
  {
    n: 5,
    title: 'The making already works.',
    says: 'Forty beds pressed at our plant and built by young people at Gamardi. The next fifty get timed and costed.',
    carries: 'The four stages of the plant, the Gamardi photograph, the film link, the measured run in one line.',
    answers: ['Q19', 'Q6'],
    chapter: 'measured',
    drawing: null,
    frame: 'mvrUQ',
    status: 'fix',
    note: 'Merges 05 and 06. The quote from the film goes verbatim from the captions or not at all.',
  },
  {
    n: 6,
    title: 'One bed, four things, any amount.',
    says: 'Every dollar buys beds at $750, and every bed does the same four things, so any amount reads the same way.',
    carries: 'The unit card and the scale table: $150,000, $250,000, $400,000, $750,000.',
    answers: ['Q5', 'Q6', 'Q7'],
    chapter: 'bed',
    drawing: 'the-unit',
    frame: 'mX9er',
    status: 'keep',
    note: 'This is the costs and the model in the simplest form we have, and the flexibility on the thousand in one table.',
  },
  {
    n: 7,
    title: 'One catalyst starts five loops a community controls.',
    says: 'The funder acts once. Each community decides what is given, what is sold, who is paid and what comes next.',
    carries: 'The loop drawing: catalyst row, five steps, the return arrow, the four gates.',
    answers: ['Q6', 'Q8'],
    chapter: 'loop',
    drawing: 'the-loop',
    frame: 'JCreO',
    status: 'keep',
    note: 'Already matches the module. The snowball (where it goes if it works) is an optional appendix, Ben\'s call.',
  },
  {
    n: 8,
    title: 'Numbers prove scale. Voices prove meaning.',
    says: 'Four things change and each is counted; the register, the voices, the measured run and the month-six test are how we know.',
    carries: 'The four outcomes and the four instruments, with the labels every figure carries.',
    answers: ['Q10', 'Q11', 'Q12'],
    chapter: 'impact',
    drawing: null,
    frame: 'qD5SQ',
    status: 'keep',
    note: 'The health rule stays on the slide: scabies to RHD is the reason, never the outcome.',
  },
  {
    n: 9,
    title: 'One home for the work. Local decisions stay local.',
    says: 'The Butterfly Movement Ltd, trading as Goods on Country, an Indigenous-led board, five independent community partners.',
    carries: 'The who-decides drawing (three layers and the month-six test) with the entity line and the directors beneath.',
    answers: ['Q2', 'Q3', 'Q4', 'Q19', 'Q22'],
    chapter: 'decides',
    drawing: 'who-decides',
    frame: 'LhlJr',
    status: 'rebuild',
    note: 'Merges 07 and the entity drawing. The applicant footer waits on the entity answer.',
  },
  {
    n: 10,
    title: 'Three kinds of money, and who has said yes so far.',
    says: 'Bed money, organisation money and plant money each do one job. Three foundations have asked us to apply. Nothing is signed.',
    carries: 'The three-jobs drawing with every line by name and status; the lenders and the other options in the third column.',
    answers: ['Q14', 'Q16', 'Q18'],
    chapter: 'money',
    drawing: 'three-jobs',
    frame: 'Lnlxh',
    status: 'rebuild',
    note: 'Rebuilt from 08B. Names are fine here: the form asks for them in Q14 and Q16.',
  },
  {
    n: 11,
    title: 'What the first beds start, and what happens without them.',
    says: 'QBE\'s beds go in first and give the lenders a measured cost. Without QBE the other beds still go in, the run happens later, and the plants wait.',
    carries: 'The chain drawing on the left; plan B on the right: the count without QBE, the floor ALIVE already paid for, the year it costs.',
    answers: ['Q7', 'Q18'],
    chapter: 'catalytic',
    drawing: 'the-chain',
    frame: null,
    status: 'new',
    note: 'The flexibility slide. Every figure on it is derived in raise-stack.ts and PLAN_B.',
  },
  {
    n: 12,
    title: 'Back the first pool.',
    says: '$400,000 buys 533 beds. $250,000 buys 333. Every other funder\'s dollar buys beds at the same ratio.',
    carries: 'The ask, the smaller amount, the three invitations in hand, nothing signed, the crux line.',
    answers: ['Q5', 'Q7'],
    chapter: 'crux',
    drawing: null,
    frame: 'o35by',
    status: 'fix',
    note: 'The frame holds its content twice; keep one. Consider the crux line as the closing statement.',
  },
];

/** Optional frames after the twelve, for the review meeting and not the read-through. */
export const DECK_APPENDICES: readonly { title: string; chapter: StoryChapterId; drawing: string | null; frame: string | null; note: string }[] = [
  { title: 'Where it goes if it works', chapter: 'snowball', drawing: 'the-snowball', frame: 'u09Eoy', note: 'Rebuilt from 09B if Ben wants the snowball in the deck.' },
  { title: 'Three ways to back the work', chapter: 'buyers', drawing: null, frame: 'lORiY', note: 'The partner menu, de-duplicated and un-nested from frame 10.' },
  { title: 'The calendar', chapter: 'calendar', drawing: 'the-calendar', frame: null, note: 'Working copy only. For the 7 October review meeting.' },
];

/** The narrative questions on the form that a deck can carry. The guards assert each is answered. */
export const FORM_NARRATIVE_QUESTIONS = ['Q2', 'Q5', 'Q6', 'Q7', 'Q8', 'Q10', 'Q14', 'Q18', 'Q19'] as const;

export function slidesAnswering(q: string): DeckSlide12[] {
  return DECK_PLAN.filter((s) => s.answers.includes(q));
}

/**
 * THE QBE FORM, question by question: what each one is really testing, what we hold, and the gap.
 *
 * Ben, 4 Sep 2026: go through the sections one by one and make sure everything is aligned, the
 * artefacts, the long read and the deck. This module is that audit, typed so it cannot drift.
 *
 * Twenty-five questions. Nine are narrative and a deck slide can carry them; eight are uploads;
 * the rest are compliance or declarations. Every row names:
 *   - what the assessor is actually testing, which is rarely what the question says;
 *   - what we hold today, and where;
 *   - the gap, and the one person who can close it;
 *   - the attachment slot, if the answer is a file;
 *   - the deck slide and the story chapter that carry it, so one answer never has two homes.
 *
 * The program's own weighting, from Jay Boolkin on the 2 September call: the Steering Committee
 * wants to see that corporate philanthropy brought other capital in; capital of any kind reads
 * better than philanthropy alone; more than one-to-one is what they want to see; and the further
 * from the ceiling the ask sits, the more likely it is to land. Q5, Q14 and Q18 carry most of the
 * decision. Ruling V still holds: we never say the grant matches, doubles or guarantees anything,
 * so leverage is answered as a sequence with a condition on every link, never as a multiplier.
 *
 * Source: the form itself (Zoho, closes Fri 25 Sep 12pm AEST), the drafted answers in
 * deliverables/qbe-stage2/qbe-stage2-application-2026-09-03.md, and raise-stack.ts.
 */
import { KEY_DATES, QBE_ASK, SIGNED_TOTAL_AUD } from './raise-stack';
import type { StoryChapterId } from './qbe-story';

export type AnswerState =
  /** Drafted, sourced, and nothing external is waiting on it. */
  | 'ready'
  /** Drafted, but the wording changes if the entity answer changes. */
  | 'ready-subject-to-entity'
  /** A person has to write, decide or confirm something. */
  | 'needs-ben'
  | 'needs-eloise'
  | 'needs-nic'
  /** Cannot be finished until something outside this form is fixed. */
  | 'blocked';

export type AnswerKind = 'narrative' | 'upload' | 'compliance' | 'declaration' | 'number';

export interface FormQuestion {
  /** Q1, Q1b, Q2 … as the form numbers them; Q1 asks two things. */
  id: string;
  /** The question, short enough to scan. */
  asks: string;
  kind: AnswerKind;
  /** What the assessor is testing. The mentor's read, not the form's words. */
  reallyTesting: string;
  state: AnswerState;
  /** What exists today, and where. */
  weHold: string;
  /** What is missing. Empty when the answer is finished. */
  gap: string;
  /** The one person who closes it. */
  owner: 'Ben' | 'Eloise' | 'Nic' | 'Social Impact Hub' | 'done';
  /** Upload slot, when the answer is a file. */
  attachment?: string;
  /** The deck slide that carries it, if any. */
  slide?: number;
  /** The story chapter that answers it. */
  chapter?: StoryChapterId;
  /** Where an assessor pushes back, and what we say. Only where there is real pressure. */
  pressure?: string;
  /**
   * An answer can be finished and still be improvable. This is the move that would make it
   * land harder, and it is deliberately not a `gap`: the form can be submitted without it.
   */
  improvedBy?: string;
}

export const FORM_QUESTIONS: readonly FormQuestion[] = [
  {
    id: 'Q1',
    asks: 'Enterprise name and contact person',
    kind: 'compliance',
    reallyTesting: 'Who signs, and who they ring. The name here must be the entity that banks the money.',
    state: 'needs-ben',
    weHold: 'Goods on Country, a business name of The Butterfly Movement Ltd. Nic has been the cohort contact since March.',
    gap: 'Who signs the form, and their phone and email. Not held on the working page on purpose.',
    owner: 'Ben',
  },
  {
    id: 'Q1b',
    asks: 'Every entity related to the enterprise, with legal name and ABN',
    kind: 'compliance',
    reallyTesting: 'Anti-money-laundering, and whether we can describe our own structure without hedging. Four entities looks like risk unless the line through them is dated and simple.',
    state: 'ready-subject-to-entity',
    weHold: 'Four entities with ABNs: The Butterfly Movement Ltd (applicant), A Curious Tractor Pty Ltd (cohort entrant, historic maker), Nicholas Marchesi sole trader (historic trading vehicle), A Kind Tractor Ltd (dormant, listed for completeness).',
    gap: 'Confirmation that the applicant may be Butterfly rather than the cohort entrant.',
    owner: 'Social Impact Hub',
    slide: 9,
    chapter: 'entity',
  },
  {
    id: 'Q2',
    asks: 'Which entity applies, how the entities connect, how funds flow, why the grant sits there',
    kind: 'narrative',
    reallyTesting: 'Can the money leak somewhere we did not intend. They want one direction and one set of books.',
    state: 'ready-subject-to-entity',
    weHold: 'Funds flow one way: grants land in the charity and never pass through the company or the sole trader. Every co-funder has invited or is considering the charity. The conflict of interest was minuted on 20 July.',
    gap: 'The same answer as Q1b. The fallback route is drafted and is weaker, and says so.',
    owner: 'Social Impact Hub',
    slide: 9,
    chapter: 'entity',
    pressure: 'Why did the cohort entrant change? Because the whole model moved into the charity on 28 August, and the money was already landing there.',
  },
  {
    id: 'Q3',
    asks: 'A structure or ownership diagram',
    kind: 'upload',
    reallyTesting: 'Whether the words in Q2 survive being drawn.',
    state: 'ready',
    weHold: 'The entity drawing, rendered from the modules, downloads as PNG from the story page.',
    gap: '',
    owner: 'done',
    attachment: 'Q3 · one PNG',
    slide: 9,
    chapter: 'entity',
  },
  {
    id: 'Q4',
    asks: 'Full names of all directors across every entity',
    kind: 'compliance',
    reallyTesting: 'A run against the ASIC banned and disqualified register. Nothing else.',
    state: 'needs-eloise',
    weHold: 'Butterfly: Kristy Bloomfield, Audrey Deemal, Jeremy Donovan. A Curious Tractor: Benjamin Knight, Nicholas Marchesi.',
    gap: 'The current ASIC extract for each entity, including A Kind Tractor. One name in the site data, Alexandra Savas, has no register source and must not go on the form.',
    owner: 'Eloise',
    slide: 9,
  },
  {
    id: 'Q5',
    asks: 'How much are you requesting',
    kind: 'number',
    reallyTesting: 'Whether the number is proportionate. It is one pool across ten enterprises, and the form says the catalytic effect is a core criterion.',
    state: 'ready',
    weHold: `${QBE_ASK.recommended.aud.toLocaleString('en-AU')}, which is ${QBE_ASK.recommended.beds} beds (ruling Y, Ben, 3 September).`,
    gap: '',
    owner: 'done',
    slide: 12,
    chapter: 'bed',
    pressure: 'The ask is the ceiling and 36% of the pool, against a program read that says the further from the ceiling the more likely it lands. The mitigation is Q7: the smaller amount has to be genuinely good, not a bluff.',
  },
  {
    id: 'Q6',
    asks: 'Proposed use of funds, and the impact beyond unlocking capital',
    kind: 'narrative',
    reallyTesting: 'Two things at once: what the money does on its own, and what it starts. Most applicants answer only the second.',
    state: 'ready',
    weHold: `Every dollar buys beds at the canonical price. ${QBE_ASK.recommended.beds} beds is the first two pools and a start on the third, and the four things one bed does scale with it. The first fifty go through our own press and get costed.`,
    gap: '',
    owner: 'done',
    slide: 6,
    chapter: 'bed',
  },
  {
    id: 'Q7',
    asks: 'If the full amount were not available, what smaller amount and what would it achieve',
    kind: 'narrative',
    reallyTesting: 'Whether the program can fund you at half and still get a result. With ten organisations sharing a pool, most answers here are the one that gets funded.',
    state: 'ready',
    weHold: `${QBE_ASK.smaller.aud.toLocaleString('en-AU')} buys ${QBE_ASK.smaller.beds} beds: the first community's pool whole, and a start on the second. The community still sets its mix, the money still stays local, and the measured run still happens.`,
    gap: '',
    owner: 'done',
    slide: 12,
    chapter: 'bed',
    pressure: 'This is the highest-value answer on the form for us, because the ask is at the ceiling. It must read as a real plan, not a concession.',
  },
  {
    id: 'Q8',
    asks: 'How the funded activity interacts with related entities',
    kind: 'narrative',
    reallyTesting: 'Related-party risk. Does a founder or a related company benefit from the grant.',
    state: 'ready-subject-to-entity',
    weHold: 'All funded activity sits in the applicant. The press, shredder and CNC router are being transferred in; until that completes they are used under an inter-entity arrangement and no payment flows to a related entity. Community partners and the kit supplier are not related entities.',
    gap: 'The inter-entity agreement is not signed. Named, not hidden.',
    owner: 'Social Impact Hub',
    chapter: 'entity',
  },
  {
    id: 'Q9',
    asks: 'A document outlining the expected impact of the new funds',
    kind: 'upload',
    reallyTesting: 'Whether the impact case exists as a thing you already use, or was written for this form.',
    state: 'needs-ben',
    weHold: 'The public model page, which prints one chapter per page. Nothing new has to be written.',
    gap: 'Print it to PDF once Ben has read it aloud.',
    owner: 'Ben',
    attachment: 'Q9 · the model page as PDF',
    chapter: 'crux',
  },
  {
    id: 'Q10',
    asks: 'Impact to date, and how you measure it',
    kind: 'narrative',
    reallyTesting: 'Track record and method. Numbers alone read as anecdote; method alone reads as theory.',
    state: 'ready',
    weHold: 'Two years, 540 beds across eleven communities, 22 washers, both runs described. The register counts units; Empathy Ledger holds consented voices; every figure carries a label.',
    gap: '',
    owner: 'done',
    slide: 8,
    chapter: 'impact',
  },
  {
    id: 'Q11',
    asks: 'Existing impact measurement materials',
    kind: 'upload',
    reallyTesting: 'Same test as Q9. Do these artefacts predate the application.',
    state: 'needs-ben',
    weHold: 'The voice-led impact model, the register summary, the two case studies, the public impact page.',
    gap: 'Four exports.',
    owner: 'Ben',
    attachment: 'Q11 · four PDFs',
    chapter: 'impact',
  },
  {
    id: 'Q12',
    asks: 'If a document above cannot be provided, explain why',
    kind: 'narrative',
    reallyTesting: 'Honesty about what you do not have. A confident gap reads better than a padded framework.',
    state: 'ready',
    weHold: 'We hold no board-adopted theory of change and no independent evaluation. What we hold instead is the register, the consented interview corpus, the claims discipline and two written case studies. The outcomes framework is one of the things the first pool produces.',
    gap: '',
    owner: 'done',
    chapter: 'honest',
  },
  {
    id: 'Q13',
    asks: 'Legal action, criminal proceedings, compliance or regulatory enforcement',
    kind: 'compliance',
    reallyTesting: 'Disclosure. A yes is survivable; an undisclosed yes is not.',
    state: 'needs-ben',
    weHold: 'Nothing in the record meets the description. A 2024 information request to the dormant entity is a request, not an action.',
    gap: 'Confirm with every director of every entity before ticking no.',
    owner: 'Ben',
  },
  {
    id: 'Q14',
    asks: 'Amounts committed or conditionally committed by other funders',
    kind: 'narrative',
    reallyTesting: 'The core criterion, in evidence form. Not what you hope for: what is on paper, from whom, in what instrument, into which entity.',
    state: 'ready',
    weHold: `Nothing signed, stated first. Three written invitations to apply for named amounts with callable contacts, one paid purchase order, two lenders in conversation, and a related grant disclosed and not counted.`,
    gap: '',
    owner: 'done',
    improvedBy: 'One signed letter would change this answer more than any rewrite, because it is the one the program weights most. The shortest path is a one-page note subject to board, naming the amount, the instrument, the legal name and a person who can be rung.',
    slide: 10,
    chapter: 'money',
    pressure: `${SIGNED_TOTAL_AUD === 0 ? 'Nothing is signed' : 'Signed paper exists'} and the program prioritises capital that is already committed. We answer with instruments and dates, and we never round an invitation up into a commitment.`,
  },
  {
    id: 'Q15',
    asks: 'Evidence of investor or funder commitment',
    kind: 'upload',
    reallyTesting: 'Whether Q14 is true. They read the emails.',
    state: 'needs-ben',
    weHold: 'Two invitation emails, the paid invoice and its remittance, the open quote.',
    gap: 'A fifth file if a letter lands before the close. Also worth chasing: the award letter for a grant won in July that has no paper in the record.',
    owner: 'Ben',
    attachment: 'Q15 · up to five files',
    slide: 10,
  },
  {
    id: 'Q16',
    asks: 'Contact details of the other funders',
    kind: 'compliance',
    reallyTesting: 'They will ring these people. Warm contacts validate; cold ones do damage.',
    state: 'needs-ben',
    weHold: 'Five named contacts across the invitations and the pipeline.',
    gap: 'Emails and phone numbers, and a heads-up to each before the form goes in.',
    owner: 'Ben',
    slide: 10,
  },
  {
    id: 'Q17',
    asks: 'May we contact them',
    kind: 'compliance',
    reallyTesting: 'Confidence. A no here undermines Q14.',
    state: 'ready',
    weHold: 'Yes.',
    gap: '',
    owner: 'done',
  },
  {
    id: 'Q18',
    asks: 'How the funding would be catalytic within your overall funding strategy',
    kind: 'narrative',
    reallyTesting: 'The decision question. What would not happen the same way without them, and why.',
    state: 'ready',
    weHold: 'A chain with a condition on every link: the first beds go in, the first fifty are costed, the lenders get a measured number, the invited foundations buy the rest at the same ratio, and buyers are already paying. Never described as matching or doubling.',
    gap: '',
    owner: 'done',
    slide: 11,
    chapter: 'catalytic',
    pressure: 'Why can the foundations not go first? None of them is sized to be first, and the pool a community sells has to exist before a lender can read it. That is the honest answer and it is on the slide.',
  },
  {
    id: 'Q19',
    asks: 'Readiness to maximise impact: governance, team, financial systems',
    kind: 'narrative',
    reallyTesting: 'Absorption. Can you spend it well and fast without breaking.',
    state: 'ready',
    weHold: 'A charity since 2012 with a clean balance sheet and three directors; a live register with a record per bed; every published number computed from one source and checked automatically; kits available so the first pool can be ordered within thirty days. Two founders and no hires is stated as the limit it is, and so is the operator at the first site.',
    gap: '',
    owner: 'done',
    improvedBy: 'The next two roles, a general manager and someone on sales, are funded from the money that runs the organisation and start when the work triggers them. Saying when they start is stronger than saying they are needed.',
    slide: 5,
    chapter: 'measured',
    pressure: 'Who runs the line, and who pays them? Open, and it is the biggest single dial in the model. It is one of the four gates and it is agreed per place before beds move.',
  },
  {
    id: 'Q20',
    asks: 'Profit and loss, balance sheet, cashflow',
    kind: 'upload',
    reallyTesting: 'Solvency, and whether the numbers in the story reconcile to books.',
    state: 'needs-eloise',
    weHold: "The applicant's own statements are small and clean. The Goods carve-out from the historic books exists as a labelled workpaper.",
    gap: "Butterfly's three statements, audited if ready, plus the related company's statements and a one-page cover note saying what each file is.",
    owner: 'Eloise',
    attachment: 'Q20 · five files',
  },
  {
    id: 'Q21',
    asks: 'If a financial document cannot be provided, explain why',
    kind: 'narrative',
    reallyTesting: 'Whether you understand your own books well enough to name what is wrong with them.',
    state: 'ready',
    weHold: 'Two things said plainly: materials were booked as operating expenses so there is no cost of goods sold line and no gross margin on paper; and the sole trader balance sheet carries an individual\'s whole financial life, not the Goods activity.',
    gap: '',
    owner: 'done',
    chapter: 'honest',
    pressure: 'This is the answer that makes the modelled per-bed cost credible rather than convenient: we say the books cannot show it yet, and the first thing the money buys is the run that measures it.',
  },
  {
    id: 'Q22',
    asks: 'Governance documents',
    kind: 'upload',
    reallyTesting: 'That the entity is set up to hold impact, and the ownership check for anti-money-laundering.',
    state: 'needs-eloise',
    weHold: 'Constitution, charity registration and deductible gift endorsement, the June and July resolutions and minutes, the member register.',
    gap: 'The files themselves. A company limited by guarantee has members, not shareholders, so the member register replaces the shareholders agreement and we say so.',
    owner: 'Eloise',
    attachment: 'Q22 · five files',
    slide: 9,
  },
  {
    id: 'Q23',
    asks: 'Materials used in raising capital',
    kind: 'upload',
    reallyTesting: 'Whether the deck you show funders is the same story as this form. It is also walked through at the review meeting.',
    state: 'needs-ben',
    weHold: 'The twelve-slide deck, once rebuilt, the model page as PDF, and the financial model.',
    gap: 'The deck. It has to work presented, not only read.',
    owner: 'Ben',
    attachment: 'Q23 · deck, model page, financial model',
    slide: 1,
    chapter: 'deck',
  },
  {
    id: 'Q24',
    asks: 'Solvency declaration',
    kind: 'declaration',
    reallyTesting: 'A personal declaration by a person, about the applicant entity.',
    state: 'needs-ben',
    weHold: "The applicant's position is small and clean.",
    gap: 'Sign only after the financial answers are on the form as written, so nothing declared is contradicted by a file attached.',
    owner: 'Ben',
  },
  {
    id: 'Q25',
    asks: 'Truth and accuracy declaration',
    kind: 'declaration',
    reallyTesting: 'Everything on the form and in every file attached to it, declared by a person. The risk is not the narrative, it is a figure in an attachment that contradicts a figure in an answer.',
    state: 'needs-ben',
    weHold: 'Every figure in the answers is read from a guarded module, and the attachments are exports of the same surfaces.',
    gap: 'Sign last, after the financial answers and the attachments are both final, so nothing declared is contradicted by a file.',
    owner: 'Ben',
  },
];

/** The five that decide the outcome, in the program's own weighting. */
export const DECISIVE_QUESTIONS = ['Q5', 'Q6', 'Q7', 'Q14', 'Q18'] as const;

/** Upload slots, so the attachment run is one list rather than a hunt through the form. */
export const ATTACHMENT_SLOTS = FORM_QUESTIONS.filter((q) => q.attachment).map((q) => ({
  id: q.id,
  slot: q.attachment as string,
  owner: q.owner,
  ready: q.state === 'ready',
}));

export const OPEN_QUESTIONS = FORM_QUESTIONS.filter((q) => q.state !== 'ready');

export function questionsFor(owner: FormQuestion['owner']): FormQuestion[] {
  return FORM_QUESTIONS.filter((q) => q.owner === owner);
}

export function questionsForSlide(n: number): FormQuestion[] {
  return FORM_QUESTIONS.filter((q) => q.slide === n);
}

/** The order things have to happen in before the form can be submitted. */
export interface FormStep {
  when: string;
  what: string;
  owner: FormQuestion['owner'];
  unblocks: string[];
}

export const CRITICAL_PATH: readonly FormStep[] = [
  {
    when: 'This week',
    what: 'The entity answer from the program: can the charity apply, given the cohort entrant was the company. Two of the highest-weighted answers have two versions until it lands.',
    owner: 'Social Impact Hub',
    unblocks: ['Q1b', 'Q2', 'Q8'],
  },
  {
    when: 'This week',
    what: 'Read the crux and the answers aloud, and strike anything you would not say. Everything downstream is written in that voice.',
    owner: 'Ben',
    unblocks: ['Q6', 'Q9', 'Q18', 'Q23'],
  },
  {
    when: 'This week',
    what: 'One signed letter. A one-page note subject to board, naming the amount, the instrument, the legal name and a person the program can call. It moves the answer the program weights most.',
    owner: 'Ben',
    unblocks: ['Q14', 'Q15'],
  },
  {
    when: 'This week',
    what: "The three statements for the applicant, the related company's accounts, and the cover note. The accountant's letter is the standing blocker and question four for the program decides how much of it this form needs.",
    owner: 'Eloise',
    unblocks: ['Q20', 'Q21', 'Q22', 'Q4'],
  },
  {
    when: 'Next week',
    what: 'Rebuild the deck to the twelve slides, export it, and print the model page. Both are attachments and the deck is walked through at the review meeting.',
    owner: 'Ben',
    unblocks: ['Q9', 'Q11', 'Q23'],
  },
  {
    when: `Before ${KEY_DATES.qbeClose}`,
    what: 'Contact details for every funder named, each given a heads-up that the program may ring. Then the declarations, signed last.',
    owner: 'Ben',
    unblocks: ['Q16', 'Q24', 'Q25'],
  },
];

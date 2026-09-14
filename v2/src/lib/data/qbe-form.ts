/**
 * THE QBE FORM, question by question, as it stands on 13 September 2026.
 *
 * Twenty-five questions in twenty-one groups, the way the Notion opportunity record groups them
 * (QBE Foundation / Stage 2, 392ebcf981cf8189a85cfbdda8d38f1c, edited 13 September). State,
 * owner, slides and files are that record's. What each question is really testing is the
 * mentor's read from the 4 September audit (qbe-form.ts on feat/qbe-story). The answers
 * themselves are the text in deliverables/master/sources/qbe-answers-2026-09-10.md, revised
 * 12 September for the flat-pack route, sliced by heading at build time; nothing is retyped.
 *
 * Closes Friday 25 September 2026, 12pm AEST. Applicant: The Butterfly Movement Ltd, trading as
 * Goods on Country (ruling AA, 5 September).
 */

export type FormState = 'written' | 'ready-pending-check' | 'document-owed' | 'person' | 'blocked';

export const FORM_STATE_LABEL: Record<FormState, string> = {
  written: 'Written and checker-clean',
  'ready-pending-check': 'Ready, pending a check',
  'document-owed': 'A document is owed',
  person: 'Only a person can answer',
  blocked: 'Blocked',
};

export interface FormGroup {
  id: string;
  /** The form numbers in this group. */
  questions: string[];
  asks: string;
  /** What the assessor is testing. The mentor's read, not the form's words. */
  reallyTesting: string;
  state: FormState;
  owner: string;
  /** Deck slides that carry it, S01 to S19. */
  slides: string[];
  /** Files the answer needs, as the opportunity record lists them. */
  files: string[];
  /** Where it stands, as the opportunity record says it. */
  stands?: string;
  /** Heading in qbe-answers-2026-09-10.md whose text is the answer, when one exists. */
  answerKey?: string;
  /** True when the answer text is a draft, not a written answer. */
  answerIsDraft?: boolean;
}

export const FORM_GROUPS: readonly FormGroup[] = [
  {
    id: 'Q1-Q2',
    questions: ['Q1', 'Q2'],
    asks: 'Legal entities, identifiers, applicant and funding flows',
    reallyTesting: 'Who signs and who they ring. Whether we can describe our own structure without hedging. Whether money can leak somewhere we did not intend: they want one direction and one set of books.',
    state: 'ready-pending-check',
    owner: 'Ben',
    slides: ['S05'],
    files: ['Structure and funding-flow PDF, one page, draft', 'Butterfly registry extract', 'A Curious Tractor registry extract'],
    stands: 'Ben ruled on 12 September that future grants, trade, wages and assets belong in Butterfly, intended to be renamed Goods on Country. The ruling is decided; legal rename and transfer completion are not yet evidenced. Keep historical sole-trader dealings separately disclosed and use current registered particulars until filings are accepted.',
  },
  {
    id: 'Q3',
    questions: ['Q3'],
    asks: 'A structure or ownership diagram',
    reallyTesting: 'Whether the words in Q2 survive being drawn.',
    state: 'document-owed',
    owner: 'Ben',
    slides: ['S05'],
    files: ['Goods-structure-and-funding-flow.pdf, one page, working draft'],
    stands: 'A draft diagram exists. Confirm control, every related entity and the transfers, then correct the diagram against the records. A diagram is not proof of an appointment.',
  },
  {
    id: 'Q4',
    questions: ['Q4'],
    asks: 'Full names of all directors across every entity',
    reallyTesting: 'A run against the ASIC banned and disqualified register. Nothing else.',
    state: 'document-owed',
    owner: 'Ben',
    slides: ['S05'],
    files: ['Director and control records for every related entity'],
    stands: 'Butterfly’s three directors are settled, stated by Ben as a director. A Curious Tractor’s director and ownership records still need assembling.',
  },
  {
    id: 'Q5',
    questions: ['Q5'],
    asks: 'How much are you requesting',
    reallyTesting: 'Whether the number is proportionate. It is one pool across ten enterprises, and the form says the catalytic effect is a core criterion.',
    state: 'written',
    owner: 'Written',
    slides: ['S18'],
    files: [],
    answerKey: 'Q5',
  },
  {
    id: 'Q6',
    questions: ['Q6'],
    asks: 'Proposed use of funds, and the impact beyond unlocking capital',
    reallyTesting: 'Two things at once: what the money does on its own, and what it starts. Most applicants answer only the second.',
    state: 'written',
    owner: 'Written',
    slides: ['S18', 'S09', 'S17'],
    files: [],
    stands: 'Rewritten 11 September against the siting ruling. In place of a demand test is a four-part readiness test: beds already delivered, the community organisation has asked in its own words, somebody local wants to run it, and people there have cleared quotes. Palm Island and Maningrida both pass all four. Alice Springs is named as a third site, approved through Oonchiumpa and outside this request.',
    answerKey: 'Q6',
  },
  {
    id: 'Q7',
    questions: ['Q7'],
    asks: 'If the full amount were not available, what smaller amount and what would it achieve',
    reallyTesting: 'Whether the program can fund you at half and still get a result. With ten organisations sharing a pool, most answers here are the one that gets funded.',
    state: 'written',
    owner: 'Written',
    slides: ['S18'],
    files: [],
    stands: 'Rewritten 11 September. The case for Palm Island first is 131 beds already deployed, a council, a community and PICC that have each asked, and seven cleared voices, more than anywhere else we work.',
    answerKey: 'Q7',
  },
  {
    id: 'Q8',
    questions: ['Q8'],
    asks: 'How the funded activity interacts with related entities',
    reallyTesting: 'Related-party risk. Does a founder or a related company benefit from the grant.',
    state: 'written',
    owner: 'Board, 14 September',
    slides: ['S05'],
    files: ['Board minute of Kristy Bloomfield’s declaration', 'Oonchiumpa’s matching minute', 'Standard Ledger FY26 carve-out documentation'],
    stands: 'The answer describes declaration and recusal at both boards. Obtain the actual conflict and decision records and confirm the meeting date before asserting this happened. The intended 14 September meeting is not evidence of a completed resolution.',
    answerKey: 'Q8',
  },
  {
    id: 'Q9',
    questions: ['Q9'],
    asks: 'A document outlining the expected impact of the new funds',
    reallyTesting: 'Whether the impact case exists as a thing you already use, or was written for this form.',
    state: 'written',
    owner: 'Written',
    slides: ['S14'],
    files: ['What $300,000 produces, about two pages, export to PDF'],
    answerKey: 'Q9',
  },
  {
    id: 'Q10',
    questions: ['Q10'],
    asks: 'Impact to date, and how you measure it',
    reallyTesting: 'Track record and method. Numbers alone read as anecdote; method alone reads as theory.',
    state: 'written',
    owner: 'Written',
    slides: ['S08', 'S10', 'S11', 'S14'],
    files: ['Dated register extract', 'Delivery and feedback records', 'Consented story evidence'],
    stands: 'Rewritten 11 September and checker-clean. The Centrecorp reconciliation is done and the answer reports it: 167 bought, 147 deployed, 20 waiting, every bed traced to a batch.',
    answerKey: 'Q10',
  },
  {
    id: 'Q11',
    questions: ['Q11'],
    asks: 'Existing impact measurement materials',
    reallyTesting: 'Same test as Q9. Do these artefacts predate the application.',
    state: 'written',
    owner: 'Written',
    slides: ['S14'],
    files: ['The asset register, dated extract', 'The consented story registry', 'The production log, uploaded blank and labelled blank'],
    stands: 'Written 11 September. Three records already run and all three go up. One of four measures is counted and the other three print with that ceiling. The four-question household count, done by a paid local person, is proposed and labelled proposed.',
    answerKey: 'Q11',
  },
  {
    id: 'Q12',
    questions: ['Q12'],
    asks: 'If a document above cannot be provided, explain why',
    reallyTesting: 'Honesty about what you do not have. A confident gap reads better than a padded framework.',
    state: 'blocked',
    owner: 'Ben',
    slides: [],
    files: ['A written explanation of the genuine retrieval gap'],
    stands: 'Explain only genuine retrieval gaps. A Curious Tractor’s constitution is not Butterfly’s and cannot stand in for it. This is the only item blocking two questions, because Q22 needs the same document.',
  },
  {
    id: 'Q13',
    questions: ['Q13'],
    asks: 'Legal action, criminal proceedings, compliance or regulatory enforcement',
    reallyTesting: 'Disclosure. A yes is survivable; an undisclosed yes is not.',
    state: 'person',
    owner: 'Ben',
    slides: [],
    files: [],
    stands: 'The applicant answers this. Do not infer it from a search and do not pre-tick it.',
  },
  {
    id: 'Q14-Q15',
    questions: ['Q14', 'Q15'],
    asks: 'Amounts committed or conditionally committed by other funders, with original evidence',
    reallyTesting: 'The core criterion, in evidence form. Not what you hope for: what is on paper, from whom, in what instrument, into which entity. They read the emails.',
    state: 'document-owed',
    owner: 'Ben',
    slides: ['S16'],
    files: ['Private bundle of original funder correspondence', 'Status schedule with conditions, recipient and dates'],
    stands: 'The bundle exists. Refresh the conditions, the recipient and the dates, and describe letters accurately. An invitation is not an award. Both Commonwealth $150,000 tranches relate to Alice Springs, outside the two QBE sites; one is approved per director statement, the second likely. Neither releases QBE capital into beds.',
  },
  {
    id: 'Q16-Q17',
    questions: ['Q16', 'Q17'],
    asks: 'Contact details of the other funders, and permission to contact them',
    reallyTesting: 'They will ring these people. Warm contacts validate; cold ones do damage.',
    state: 'person',
    owner: 'Ben',
    slides: [],
    files: ['Private contact schedule'],
    stands: 'The schedule is prepared and contact details stay private. The applicant gives permission to contact, and there is no committed funder yet to name.',
  },
  {
    id: 'Q18',
    questions: ['Q18'],
    asks: 'How the funding would be catalytic within your overall funding strategy',
    reallyTesting: 'The decision question. What would not happen the same way without them, and why.',
    state: 'written',
    owner: 'Written',
    slides: ['S16', 'S18'],
    files: ['Brian M. Davis budget template, sheet INSTRUCTIONS cell B16'],
    stands: 'The timing question remains one to confirm with QBE. Brian M. Davis’s proposed $100,000 project must cover its complete scope and satisfy their payment condition; an invitation or another funder’s conditional outcome must not be assumed to do so. Ben ruled on 14 September that facilitation sits inside the price of a bed, so the phrase “the beds and the youth facilitation” and the Brian M. Davis budget split are re-cut before submission.',
    answerKey: 'Q18',
  },
  {
    id: 'Q19',
    questions: ['Q19'],
    asks: 'Readiness to maximise impact: governance, team, financial systems',
    reallyTesting: 'Absorption. Can you spend it well and fast without breaking.',
    state: 'document-owed',
    owner: 'Nic',
    slides: ['S09', 'S10', 'S11', 'S13', 'S17'],
    files: ['Site agreement or letter per plant', 'Quote basis per plant', 'Cash milestone schedule'],
    stands: 'Six things are outstanding and every one is a document. A site letter and a quote basis for each plant and a cash milestone schedule, all Nic. Kristy’s related-party minute. Butterfly’s constitution and the applicant’s current management cashflow, both Eloise. Neither community has agreed to a build, and neither should be told they are in a grant application before Ben has spoken to them.',
    answerKey: 'Q19',
    answerIsDraft: true,
  },
  {
    id: 'Q20-Q21',
    questions: ['Q20', 'Q21'],
    asks: 'Profit and loss, balance sheet and cashflow, or why a document cannot be provided',
    reallyTesting: 'Solvency, whether the numbers in the story reconcile to books, and whether you understand your own books well enough to name what is wrong with them.',
    state: 'document-owed',
    owner: 'Eloise',
    slides: ['S15'],
    files: ['Butterfly-FY26-unaudited-financial-statements.pdf, ten pages', 'Current management cashflow', 'Reconciled opening balances'],
    stands: 'The FY26 set is found and audit is not required. What is missing is current management cashflow for the entity and reconciled opening balances. A programme forecast is not entity cashflow.',
  },
  {
    id: 'Q22',
    questions: ['Q22'],
    asks: 'Governance documents',
    reallyTesting: 'That the entity is set up to hold impact, and the ownership check for anti-money-laundering.',
    state: 'document-owed',
    owner: 'Ben',
    slides: ['S05', 'S18'],
    files: ['Butterfly constitution', 'Board, delegation and conflict records', 'Registry and control extracts'],
    stands: 'The constitution is unlocated and Q12 explains that. Assemble the control, delegation and conflict records. Community ownership stays a pathway until rights and transfers are evidenced.',
  },
  {
    id: 'Q23',
    questions: ['Q23'],
    asks: 'Materials used in raising capital',
    reallyTesting: 'Whether the deck you show funders is the same story as this form. It is also walked through at the review meeting.',
    state: 'written',
    owner: 'Written',
    slides: ['S01', 'S13', 'S15', 'S16', 'S17', 'S18'],
    files: ['Goods-on-Country-QBE-deck.pdf, 19 slides, 4.7MB', 'Goods-financial-plan.xlsx', 'Goods-on-Country-the-model.pdf', 'Goods-on-Country-money-map.pdf'],
    stands: 'The 10 September export check covered four files and a 19-slide deck with the $300,000 request. It predates the latest route and entity decisions. Final accepted slides and attachments still require reconciliation and export checking.',
    answerKey: 'Q23',
  },
  {
    id: 'Q24',
    questions: ['Q24'],
    asks: 'Solvency declaration',
    reallyTesting: 'A personal declaration by a person, about the applicant entity.',
    state: 'person',
    owner: 'Ben',
    slides: [],
    files: [],
    stands: 'The authorised applicant assesses the ability to pay debts as they fall due, on current information. An old balance or a forecast does not establish it, and it must not be pre-ticked.',
  },
  {
    id: 'Q25',
    questions: ['Q25'],
    asks: 'Truth and accuracy declaration',
    reallyTesting: 'Everything on the form and in every file attached to it, declared by a person. The risk is a figure in an attachment that contradicts a figure in an answer.',
    state: 'person',
    owner: 'Ben',
    slides: [],
    files: [],
    stands: 'The applicant confirms the final application and its attachments after checking them. It is the last thing done.',
  },
];

/** The five that decide the outcome, in the program’s own weighting. */
export const DECISIVE_QUESTIONS = ['Q5', 'Q6', 'Q7', 'Q14', 'Q18'] as const;

/** What is left, and who owns it, in the order it unblocks the most (opportunity record, 13 September). */
export const FORM_WORK_LEFT: readonly { what: string; who: string; unblocks: string }[] = [
  { what: 'Obtain evidence, recipient, conditions and cash timing for the Alice Springs tranches', who: 'Ben', unblocks: 'Q14 and Q15 must describe the separate funding accurately' },
  { what: 'Butterfly’s constitution', who: 'Eloise', unblocks: 'Q12 and Q22 together' },
  { what: 'Site letter and quote basis for each plant, and a cash milestone schedule', who: 'Nic', unblocks: 'Q19' },
  { what: 'Current management cashflow and reconciled opening balances', who: 'Eloise', unblocks: 'Q20 and Q21' },
  { what: 'Kristy Bloomfield’s related-party minutes; confirm the board meeting and actual decision date', who: 'Ben', unblocks: 'Q8 and Q22' },
  { what: 'Correct the structure diagram against the transfer records', who: 'Ben', unblocks: 'Q3 and Q4' },
  { what: 'Refresh the funder bundle: conditions, recipient, dates', who: 'Ben', unblocks: 'Q14 and Q15' },
  { what: 'Pick which consented records attach', who: 'Ben', unblocks: 'Q11' },
  { what: 'Read the current balance, then assess solvency', who: 'Ben', unblocks: 'Q24' },
  { what: 'The four declarations, last', who: 'Ben', unblocks: 'Q13, Q16, Q17, Q25' },
];

export const QBE_CLOSES = 'Friday 25 September 2026, 12pm AEST';
export const QBE_KEY_DATES: readonly { when: string; what: string }[] = [
  { when: '25 September', what: 'This application and the Brian M. Davis application both close' },
  { when: '6 and 7 October', what: 'QBE interviews' },
  { when: '23 October', what: 'QBE conditional outcomes' },
  { when: '13 November', what: 'QBE preconditions to be met' },
  { when: '19 November', what: 'Brian M. Davis board decides' },
  { when: 'Late November', what: 'Tim Fairfax Family Foundation decides' },
];

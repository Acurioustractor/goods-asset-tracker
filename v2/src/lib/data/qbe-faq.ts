/**
 * QUESTIONS PEOPLE ASK US: the living FAQ behind the story of the model.
 *
 * Every room asks a version of the same twenty questions, and "where are they selling?" is asked
 * in all of them. This file is where an answer lives once, in our words, with who asked it, when,
 * and where the answer comes from. Add a question the day it is asked; mark it `open` until there
 * is an answer we would say out loud; the page renders open ones as open.
 *
 * Two surfaces read it. The public page shows the question, the answer and the status, and it
 * skips any entry marked `working` (it names a funder, a person or a decision that is ours to make
 * first). An entry may carry a `publicAnswer` when the working answer names someone the public one
 * should not. The gated working copy shows everything, with who asked and the source.
 *
 * Rules, enforced by qbe-story.guards.test.ts:
 *  - every entry has a source, and an `answered` entry has an answer;
 *  - the answer never types a figure that disagrees with the modules;
 *  - repo vocabulary stays out (no "proof block", "stack", "governed pool", "traceability");
 *  - the cost of the beds is only ever a cost;
 *  - a community is never named in the same sentence as a dollar figure;
 *  - nothing on the public surface names a foundation, a lender or a person by first name.
 *
 * Source for the seeded answers: the QBE page Ben edits (repo copy at
 * deliverables/qbe-stage2/qbe-stage2-application-2026-09-03.md) and the 2 September call.
 */
import type { StoryAudience, StoryChapterId } from './qbe-story';
import { BED_PRICE_AUD, KIT_COST_AUD, PRESSED_COST_AUD, POOL, FACILITY_BAND, STAYS_KIT_AUD, STAYS_PRESSED_AUD } from './community-loop';
import { PROGRAM, QBE_ASK, THE_BLOCK } from './raise-stack';
import { CANONICAL_ASSETS } from './asset-canonical';

export type FaqStatus = 'answered' | 'partly' | 'open';

export interface FaqEntry {
  id: string;
  question: string;
  /** In our words. Empty only while `status` is `open`. */
  answer: string;
  /** The answer the public page shows instead, when the working one names someone it should not. */
  publicAnswer?: string;
  /** Working copy only: it names a funder, a person, or a decision that is ours to make first. */
  working?: boolean;
  status: FaqStatus;
  /** Who asks it, by role, never by name. Working copy only. */
  askedBy: string;
  /** When it was first logged, ISO date. */
  asked: string;
  chapter: StoryChapterId;
  /** Working copy only. */
  source: string;
}

const aud = (n: number) => `$${n.toLocaleString('en-AU')}`;

export const FAQ: readonly FaqEntry[] = [
  {
    id: 'where-selling',
    question: 'Where are they selling? Who actually buys the beds?',
    answer: `Mparntwe first, with Oonchiumpa, who have already built and delivered beds with their young people. Buyers are already paying. ALIVE National Centre bought 100 beds up front. Centrecorp has 130 on quote. There are more than 200 requests each in Tennant Creek and Mparntwe. Each community sells its own pool under its own rules, to families, local organisations, the health service or a buyer like Centrecorp. Who is buying the sold beds is the first of our four gates, and we name it per place before any bed moves.`,
    status: 'partly',
    askedBy: 'Every room: the program team, foundation program leads, our advisory committee',
    asked: '2026-09-02',
    chapter: 'buyers',
    source: 'QBE page, the crux and Q18; raise-stack.ts alive line; QU-0014',
  },
  {
    id: 'is-750k-income',
    question: `Is ${aud(PROGRAM.costAud)} the income?`,
    answer: `No. ${aud(PROGRAM.costAud)} is the cost of ${PROGRAM.beds.toLocaleString('en-AU')} beds at ${aud(BED_PRICE_AUD)} each. Sales money only exists for the beds a community chooses to sell, and none of it is income until the rules with that community are agreed.`,
    status: 'answered',
    askedBy: 'A foundation program lead, and our own deck until 2 September',
    asked: '2026-09-02',
    chapter: 'money',
    source: 'raise-stack.ts PROGRAM; QBE page 1.4',
  },
  {
    id: 'what-money-buys',
    question: 'What does the money actually buy?',
    answer: `Beds. Every dollar buys beds at ${aud(BED_PRICE_AUD)} each, and every bed does the same four things, so any amount reads the same way. ${aud(POOL.costAud)} is one community's pool of ${POOL.beds}. ${aud(PROGRAM.costAud)} is the whole thousand across five communities. The first fifty beds go through our own press and get costed properly, so the cost of a locally made bed becomes a measured number.`,
    status: 'answered',
    askedBy: 'Everyone, in one form or another',
    asked: '2026-09-03',
    chapter: 'bed',
    source: 'bed-ratio.ts; raise-stack.ts PROGRAM',
  },
  {
    id: 'what-qbe-buys',
    question: "What does QBE's money actually buy?",
    answer: `Beds. ${aud(QBE_ASK.recommended.aud)} is ${QBE_ASK.recommended.beds} beds at ${aud(BED_PRICE_AUD)}: the first two communities' pools of ${POOL.beds} each and a start on the third. The first fifty go through our own press and get costed properly, so the cost of a locally made bed becomes a measured number. ${aud(QBE_ASK.smaller.aud)} is ${QBE_ASK.smaller.beds} beds: the first community's pool, whole, and a start on the second.`,
    working: true,
    status: 'answered',
    askedBy: 'The program team, form Q5 to Q7',
    asked: '2026-09-03',
    chapter: 'bed',
    source: 'raise-stack.ts QBE_ASK; QBE page Q5, Q6, Q7',
  },
  {
    id: 'why-not-give',
    question: 'Why not just give the beds away?',
    answer: `Because then the beds are a delivery and the lenders have nothing to read. We are trusting communities to take the beds, sell what they decide to sell, and build their own future with the money. The funder acts once. After that the money goes round inside the community. Some beds still go to families who need one tonight; that mix is the community's call.`,
    status: 'answered',
    askedBy: 'A foundation board member, by way of a program lead',
    asked: '2026-09-02',
    chapter: 'loop',
    source: 'QBE page, the crux and Q18',
  },
  {
    id: 'cost-to-make',
    question: 'What does it cost to make a bed?',
    answer: `A bought-in kit costs about ${aud(KIT_COST_AUD)} delivered, so ${aud(BED_PRICE_AUD)} leaves about ${aud(STAYS_KIT_AUD)} on a bed. With the legs pressed locally we say about ${aud(PRESSED_COST_AUD)}, which leaves about ${aud(STAYS_PRESSED_AUD)}. The part prices are real invoices and forty beds came off our press for Maningrida, but nobody has made fifty in a row at working pace and kept the receipts. That is the measured run, and it comes with the first pool. Freight is the biggest single line in a bed's cost, which is our argument for making near community.`,
    status: 'partly',
    askedBy: 'Lenders, and every investor conversation since July',
    asked: '2026-07-25',
    chapter: 'measured',
    source: 'canon.ts marginal-buykit, marginal-factory; QBE page 1.9; pitch-chrome.ts opener',
  },
  {
    id: 'what-150k-does',
    question: `What does a community do with ${aud(POOL.costAud)}?`,
    answer: `Whatever it decides. More beds, a shredder, a press, the washer. A full plant is ${FACILITY_BAND.publicPrice}, so one pool sold in full gets to the bottom of that range and no further. The next pool, or a buyer's order, carries it the rest of the way. And that is only if all ${POOL.beds} sell; give some away and there is less.`,
    status: 'answered',
    askedBy: 'A foundation, on a call on 2 September',
    asked: '2026-09-02',
    chapter: 'loop',
    source: 'community-loop.ts; QBE page 1.3',
  },
  {
    id: 'who-owns-making',
    question: 'Who ends up owning the making?',
    answer: `Ownership is a pathway, and we say so on every page. We hold the products, the IP, the contracts and the equipment today, under an Indigenous-led board. Each community holds its pool and its decisions. Six months into a site we ask four questions: who holds the keys, who runs the payroll, who invoices the buyer, is at least half the production local. Partial counts as no. Until the answers are yes, we do not claim ownership has moved.`,
    status: 'answered',
    askedBy: 'Investors and our advisory committee',
    asked: '2026-07-26',
    chapter: 'decides',
    source: 'ownership-test.ts; QBE page 1.6',
  },
  {
    id: 'sells-none',
    question: 'What if a community sells none of its beds?',
    answer: `Then every bed meets a need and there is no sales money. That is a real outcome and it is the community's call. The loop does not start there, and we would not push it. What we do first is agree the rules, so that choice is made on purpose and everyone knows what follows from it.`,
    status: 'answered',
    askedBy: 'A foundation program lead',
    asked: '2026-09-02',
    chapter: 'loop',
    source: 'QBE page 1.2 and 1.3; community-loop.ts POOL_SCENARIOS',
  },
  {
    id: 'anything-signed',
    question: 'Is anything signed?',
    answer: `No. What we hold is three written invitations to apply for named amounts, each from a person the funder can call, and a paid purchase order that proves demand. We say that first, every time.`,
    status: 'answered',
    askedBy: 'The program team, form Q14',
    asked: '2026-08-01',
    chapter: 'money',
    source: 'raise-stack.ts SIGNED_TOTAL_AUD; QBE page Q14',
  },
  {
    id: 'where-money-lands',
    question: 'Which organisation does the money go to?',
    answer: `Goods on Country, which is a business name of The Butterfly Movement Ltd, a registered charity since 2012 with deductible gift status. Since 28 August 2026 everything we do sits there: the products, the IP, the contracts, the making, the sales, the money and the evidence. A Curious Tractor, the company we started and made the first beds through, is moving its assets across. Community partners are independent organisations with their own boards, never part of the charity.`,
    status: 'answered',
    askedBy: 'Every funder',
    asked: '2026-09-02',
    chapter: 'entity',
    source: 'raise-stack.ts ENTITY_ROUTE; QBE page 1.7',
  },
  {
    id: 'which-entity',
    question: 'Which entity applies to QBE and receives the grant?',
    answer: `Our recommendation is The Butterfly Movement Ltd, trading as Goods on Country. Everything we do sits there since 28 August, and every funder's money already lands there. A Curious Tractor entered the cohort in March and is the historic maker, moving its assets across. If the program says the cohort entrant must apply, A Curious Tractor applies and the answer rests on the agreement between the two, which is not yet signed. That is weaker, and we say so.`,
    working: true,
    status: 'open',
    askedBy: 'The program team, form Q1, Q2, Q8; asked of Social Impact Hub on 3 September',
    asked: '2026-09-02',
    chapter: 'entity',
    source: 'raise-stack.ts ENTITY_ROUTE; QBE page 1.7',
  },
  {
    id: 'how-fast',
    question: 'How fast can a thousand beds move?',
    answer: `Kits are available from Defy Design, so the first pool can be ordered within thirty days of the money landing. The first beds move as soon as the first community has signed its rules, and we would not skip that. A thousand beds in a quarter is eight times our biggest run. Kits can move that fast if Defy can. Our own press cannot yet, and that is what the first fifty beds will tell us. So the pools go one community at a time.`,
    status: 'answered',
    askedBy: 'The program team, form Q19',
    asked: '2026-09-03',
    chapter: 'measured',
    source: 'QBE page Q19; community-loop.ts TIMELINE_TARGETS',
  },
  {
    id: 'how-catalytic',
    question: 'How is a grant catalytic if it does not match anything?',
    answer: `The first grant buys the first beds, and the first beds are what starts everything else. The first community gets its pool, sells what it decides to sell, and the money stays there. The first fifty of those beds go through our press and get costed, so for the first time there is a measured cost for a locally made bed. That number is what the lenders have asked for and nobody has had. Three foundations have already asked us to apply; their beds make up the rest of the thousand. Once the cost is measured, SEFA and White Box can write the plant finance they cannot write against a modelled number. We never say a grant matches, doubles or guarantees anything.`,
    publicAnswer: `The first grant buys the first beds, and the first beds are what starts everything else. The first community gets its pool, sells what it decides to sell, and the money stays there. The first fifty of those beds go through our press and get costed, so for the first time there is a measured cost for a locally made bed. That number is what the lenders have asked for and nobody has had. Three foundations have already asked us to apply; their beds make up the rest of the thousand. Once the cost is measured, the lenders we are talking to can write the plant finance they cannot write against a modelled number. We never say a grant matches, doubles or guarantees anything.`,
    status: 'answered',
    askedBy: 'The program team, form Q18',
    asked: '2026-09-03',
    chapter: 'catalytic',
    source: 'raise-stack.ts QBE_ASK.leverageChain; QBE page 1.5 and Q18',
  },
  {
    id: 'measure-impact',
    question: 'How do you measure impact?',
    answer: `Two ways, kept separate. Numbers prove scale: our register counts every bed, washer, community and kilo of plastic, and every figure we publish carries a label. Voices prove meaning: Empathy Ledger holds consented interviews with people where the beds went, twenty-nine of them analysed in July into 191 quotes on thirteen themes. The indicators are the four things one bed does: a bed off the ground, paid local work in hours, local control tested at month six, and plastic kept in use in kilos. We do not claim health outcomes.`,
    status: 'answered',
    askedBy: 'The program team, form Q10 to Q12',
    asked: '2026-09-03',
    chapter: 'impact',
    source: 'QBE page Q10; voice-impact-model.ts',
  },
  {
    id: 'washing-machines',
    question: 'What about the washing machines?',
    answer: `Pakkimjalki Kari, named in Warumungu by Elder Dianne Stokes. A one-button machine on a Speed Queen base, at prototype stage and in several communities. It is the next product after the beds: once a community is making and selling beds, the same again with washers. It is not for sale yet; there is a register-interest form.`,
    status: 'answered',
    askedBy: 'Community partners and press',
    asked: '2026-07-11',
    chapter: 'snowball',
    source: 'products.ts; QBE page, the crux',
  },
  {
    id: 'who-runs-the-line',
    question: 'Who runs the line at a site, and who pays them?',
    answer: `Open, and it is the biggest single dial in our model. A site has a floor cost the day anyone works there, and the wage of whoever runs the line is the part no pool covers on its own. It is one of the four gates: an operator and a place, named, with someone paying them. The answer will be different at each site and it is agreed in the rules before the beds move.`,
    status: 'open',
    askedBy: 'The financial model sessions; the two of us between ourselves',
    asked: '2026-07-25',
    chapter: 'measured',
    source: 'community-loop.ts LOOP_GATES and SITE_FLOOR; road-ending.ts',
  },
  {
    id: 'why-200',
    question: `Why ${POOL.beds} beds per community?`,
    answer: `Because ${POOL.beds} beds sold at ${aud(BED_PRICE_AUD)} is ${aud(POOL.costAud)}, which is enough to start on a plant. It is the smallest pool that gets a community to the bottom of the plant range on its own. It is a design number, and a community that wants fewer, or more, sets that in its rules.`,
    status: 'answered',
    askedBy: 'A foundation, on a call on 2 September',
    asked: '2026-09-02',
    chapter: 'loop',
    source: 'community-loop.ts POOL and FACILITY_BAND',
  },
  {
    id: 'money-back',
    question: 'Does any of the money come back to the funder?',
    answer: `No. The funder acts once, and after that the money goes round inside the community. The only money that is repaid is the plant finance, and that comes back to the lender out of what we make on buyer orders. Never out of a community's pool. Nobody is buying shares.`,
    status: 'answered',
    askedBy: 'Foundation program leads',
    asked: '2026-09-02',
    chapter: 'money',
    source: 'QBE page 1.4; raise-stack.ts',
  },
  {
    id: 'if-cost-over',
    question: `What happens if the measured cost comes in over ${aud(PRESSED_COST_AUD)}?`,
    answer: `We publish it anyway and redo the maths in the open. The first fifty beds get counted properly: kilos of plastic and what it cost, press time and power, CNC hours, operator hours kept separate from founder time, scrap, freight, what breaks. If it comes in under, the model is right. If it comes in over, the model changes and every page changes with it.`,
    status: 'answered',
    askedBy: 'The two of us, of ourselves',
    asked: '2026-09-03',
    chapter: 'measured',
    source: 'QBE page 1.9',
  },
  {
    id: 'health-claim',
    question: 'Is this a health program?',
    answer: `No. Scabies and rheumatic heart disease are the reason the hardware matters. The beds are washable and off the ground because of them. That is where our claim stops. We count beds, hours, control and plastic, and we do not claim health outcomes.`,
    status: 'answered',
    askedBy: 'Health funders and press',
    asked: '2026-07-11',
    chapter: 'impact',
    source: 'CONTEXT.md; QBE page Q10',
  },
  {
    id: 'who-gets-a-bed',
    question: 'Who decides who gets a bed?',
    answer: `The community, under rules it agrees before any bed moves: who gets beds, who sells, who is paid, where the money goes. Oonchiumpa did exactly this in Mparntwe. They picked the young people, chose which households got beds and who drove them out to the homelands.`,
    status: 'answered',
    askedBy: 'Foundation program leads',
    asked: '2026-09-02',
    chapter: 'decides',
    source: 'QBE page 1.3 and 1.6',
  },
  {
    id: 'what-goods-keeps',
    question: 'What does Goods on Country get out of it?',
    answer: `Our margin on buyer orders, which is what repays any plant finance, and the money that runs the organisation, which we raise separately. ${THE_BLOCK.line} Bed money never funds this. Tim Fairfax invited The Butterfly Movement to apply for three years of that support, and Katie Norman said the reason is the resilience of organisations doing good work.`,
    publicAnswer: `Our margin on buyer orders, which is what repays any plant finance, and the money that runs the organisation, which we raise separately. ${THE_BLOCK.line} Bed money never funds this, and we say which is which.`,
    status: 'answered',
    askedBy: 'A foundation, 31 August',
    asked: '2026-08-31',
    chapter: 'money',
    source: 'raise-stack.ts THE_BLOCK and tfff line',
  },
  {
    id: 'track-record',
    question: 'What have you actually delivered?',
    answer: `${CANONICAL_ASSETS.bedsDeployed} beds across ${CANONICAL_ASSETS.communitiesServed} communities in two years, and ${CANONICAL_ASSETS.washersInCommunity} washing machines in community. Forty beds pressed at our own facility and assembled at Gamardi by young people with Homeland School Company. Two days of building with Oonchiumpa in Mparntwe. A paying buyer who paid for 100 beds up front. Every bed is a row in our live register.`,
    status: 'answered',
    askedBy: 'The program team, form Q10',
    asked: '2026-09-03',
    chapter: 'road',
    source: 'asset-canonical.ts; QBE page Q10',
  },
  {
    id: 'open-questions',
    question: 'What are the biggest open questions right now?',
    answer: `Whether The Butterfly Movement can be the applicant (the program team). Whether the three-year foundation invitation runs the organisation or buys beds (ours to decide; the recommendation is the organisation). Which community is named against the first pool, and only once it has seen the design. Who runs the line at the first site and who pays them. And the accountant's letter, which cannot be signed until the historic books have a cost of goods sold line.`,
    working: true,
    status: 'open',
    askedBy: 'This page',
    asked: '2026-09-04',
    chapter: 'faq',
    source: 'raise-stack.ts JAY_QUESTIONS and BEN_DECISIONS; QBE page Part 4',
  },
];

/** The entries a surface shows, with the answer that surface may print. */
export function faqFor(audience: StoryAudience): FaqEntry[] {
  if (audience === 'working') return [...FAQ];
  return FAQ.filter((f) => !f.working).map((f) => (f.publicAnswer ? { ...f, answer: f.publicAnswer } : f));
}

export function faqForChapter(chapter: StoryChapterId): FaqEntry[] {
  return FAQ.filter((f) => f.chapter === chapter);
}

export const FAQ_OPEN_COUNT = FAQ.filter((f) => f.status !== 'answered').length;

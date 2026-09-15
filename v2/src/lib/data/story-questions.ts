/**
 * QUESTIONS PEOPLE ASK US, rewritten to the September rulings.
 *
 * The questions are the ones every room asks, logged on the story branch (qbe-faq.ts, 2 to 4
 * September 2026) with who asks them. The answers there told the 1,000-bed, five-pool model; the
 * rulings of 11 to 14 September replaced it (400 beds, four community organisations, QBE
 * A$300,000 for two facilities, the price model, Centrecorp delivered, demand as acts). Every
 * answer here was re-read against those rulings on 14 September; `since` says what changed.
 * Ben reads these aloud before they ship. Public surface only: no foundation, lender or person
 * is named, and buyers are named by type.
 */

import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { BED, RAISE, aud, audRange } from '@/lib/data/model-placemat';
import type { ChapterId } from '@/lib/data/story-spine';

export type QuestionStatus = 'answered' | 'partly' | 'open';

export interface StoryQuestion {
  id: string;
  question: string;
  /** In our words. Empty only while `status` is `open`. */
  answer: string;
  status: QuestionStatus;
  /** Who asks it, by role. Names stay out. */
  askedBy: string;
  /** When it was first logged, ISO date. */
  asked: string;
  chapter: ChapterId;
  source: string;
  /** What changed on 14 September against the story branch's answer. */
  since?: string;
}

/** Paid trade as at 11 September 2026: five invoices, four buyers (demand-and-buyers.ts, finance branch). */
export const PAID_BEDS = 320;
export const PAID_BUYERS = 4;
/** The invoiced total behind those beds, A$ (demand-and-buyers.ts on the finance branch; pin to it when that branch lands). */
export const PAID_AUD = 273_966;

export const QUESTIONS: readonly StoryQuestion[] = [
  {
    id: 'where-selling',
    question: 'Where are they selling? Who actually buys the beds?',
    answer: `The places that buy beds for people: health services, schools and housing providers. Four organisations have already paid for ${PAID_BEDS} beds on invoice: a national research centre, a foundation buying for the Utopia homelands, a homeland school company and a health service. Each community organisation sells its beds under its own rules, to whoever it chooses, and the buyer pays the community organisation. We do not add requests together into a demand number. We say what people have done.`,
    status: 'partly',
    askedBy: 'Every room: the program team, foundation program leads, our advisory committee',
    asked: '2026-09-02',
    chapter: 'trade',
    source: 'demand-and-buyers.ts (finance branch), read 14 September; deck master S12; ruling of 11 September that demand is presented as acts',
    since: 'Rewritten. Buyers by type. Centrecorp is delivered (ruling AC), so the quote line is gone. No demand total.',
  },
  {
    id: 'is-the-raise-income',
    question: `Is ${aud(RAISE.totalShownAud)} the income?`,
    answer: `No. It is the raise: QBE ${aud(RAISE.qbeAud)} for two production facilities, and ${aud(RAISE.bedsShownAud)} of bed money for the first ${RAISE.bedsYearOne} beds, three grants each buying 133 beds at $750 with the support and the freight inside the price, and a loan of ${aud(RAISE.loanAud)} for the first-year running cost, repaid from the beds Goods on Country sells. Sales money belongs to the community organisation that sells the bed, and none of it is income to Goods on Country.`,
    status: 'answered',
    askedBy: 'A foundation program lead, and our own deck until 2 September',
    asked: '2026-09-02',
    chapter: 'money',
    source: 'model-placemat.ts RAISE; VISUAL-DECISION-RECORD-2026-09-14 item 6',
    since: 'Replaced the $750,000 question. The loan went back inside the ask on 15 September 2026.',
  },
  {
    id: 'what-money-buys',
    question: 'What does the money actually buy?',
    answer: `Three things, kept apart. A loan of ${aud(RAISE.loanAud)} carries the first-year running cost and is repaid from the beds Goods on Country sells. QBE’s ${aud(RAISE.qbeAud)} buys two community production facilities, ${aud(RAISE.qbeAud / RAISE.facilities)} each as a planning allowance; no site has been quoted. The other ${aud(RAISE.bedsShownAud)} buys the first ${RAISE.bedsYearOne} beds at The Harvest Plant, ${RAISE.bedsEach} for each of ${RAISE.communityOrganisations} community organisations: three grants, each 133 beds at $750. The work around every bed and the freight sit inside the price of a bed. The beds are the community organisations’ to sell.`,
    status: 'answered',
    askedBy: 'Everyone, in one form or another',
    asked: '2026-09-03',
    chapter: 'money',
    source: 'Deck master S15 and S18; the eight lines; Ben, 14 September, facilitation inside the bed price',
    since: 'Rewritten from the any-amount-buys-beds answer. Facilitation folded into the bed price on 14 September.',
  },
  {
    id: 'what-qbe-buys',
    question: 'What does QBE’s money actually buy?',
    answer: `Two proposed production facilities, where communities are ready. Palm Island and Maningrida first; Tennant Creek, Mount Isa and others as options. ${aud(RAISE.qbeAud / RAISE.facilities)} per site is a planning allowance; no site has been quoted. Sites, costs, approvals and agreements are still to settle, and we say so.`,
    status: 'answered',
    askedBy: 'The program team, form Q5 to Q7',
    asked: '2026-09-03',
    chapter: 'money',
    source: 'Deck master S18; DECISIONS.md AD',
    since: 'Rewritten. It bought beds on 3 September; it buys facilities now.',
  },
  {
    id: 'why-not-give',
    question: 'Why not just give the beds away?',
    answer: 'Because then the beds are a delivery and nothing starts. We are trusting community organisations to take the beds, sell what they decide to sell, and build their own future with the money. The funder acts once. After that the money goes round inside the community. Some beds still go to families who need one tonight; that mix is the community’s call.',
    status: 'answered',
    askedBy: 'A foundation board member, by way of a program lead',
    asked: '2026-09-02',
    chapter: 'trade',
    source: 'QBE page, the crux and Q18',
    since: 'Kept. The sentence about lenders dropped.',
  },
  {
    id: 'cost-to-make',
    question: 'What does it cost to make a bed?',
    answer: `About ${aud(BED.makeAud)} on the flat-pack route: tab sheets pressed at The Harvest Plant, leg panels bought in, kits dispatched flat and assembled in community. A bed sells for ${aud(BED.priceAud)} and nothing is added to it: Goods on Country absorbs ${aud(BED.freightAud)} of freight and ${aud(BED.facilitationAud)} of facilitation out of its share, and ${aud(BED.contributionAud)} reaches the organisation. When a community organisation sells a bed, the customer pays it directly and the money stays there. The ${aud(BED.makeAud)} is provisional until the bought leg-panel yield is confirmed, and nobody has made fifty in a row at working pace and kept the receipts. That is the measured run.`,
    status: 'partly',
    askedBy: 'Lenders, and every investor conversation since July',
    asked: '2026-07-25',
    chapter: 'make',
    source: 'the-year-and-the-raise.ts (finance branch) BED_MAKE_AUD; Ben, 12 September, the flat-pack route',
    since: 'Rewritten to the price model and the flat-pack route.',
  },
  {
    id: 'what-org-does-with-money',
    question: 'What does a community organisation do with the money?',
    answer: 'Whatever it decides, after costs. More beds, paid local work, or making their own. Where a community is ready, a production facility comes to them, and then the next thing they choose to make. The money never comes back to Goods on Country.',
    status: 'answered',
    askedBy: 'A foundation, on a call on 2 September',
    asked: '2026-09-02',
    chapter: 'trade',
    source: 'The eight lines; VISUAL-DECISION-RECORD-2026-09-14',
    since: 'Replaced the one-pool-of-200 answer.',
  },
  {
    id: 'who-owns-making',
    question: 'Who ends up owning the making?',
    answer: 'Ownership is a pathway, and we say so on every page. Goods on Country holds the products, the IP, the contracts and the equipment today, under an Indigenous-led board. Each community organisation holds its beds, its sales money and its decisions. Six months into a site we ask four questions: who holds the keys, who runs the payroll, who invoices the buyer, and whether the community decides what gets made and who works on it. Partial counts as no. Until the answers are yes, we do not claim ownership has moved.',
    status: 'answered',
    askedBy: 'Investors and our advisory committee',
    asked: '2026-07-26',
    chapter: 'method',
    source: 'ownership-test.ts; QBE page 1.6',
    since: 'Kept. Pool became beds and sales money.',
  },
  {
    id: 'sells-none',
    question: 'What if a community sells none of its beds?',
    answer: 'Then every bed meets a need and there is no sales money. That is a real outcome and it is the community organisation’s call. The trade does not start there, and we would not push it. What we do first is agree the rules, so that choice is made on purpose and everyone knows what follows from it.',
    status: 'answered',
    askedBy: 'A foundation program lead',
    asked: '2026-09-02',
    chapter: 'trade',
    source: 'QBE page 1.2 and 1.3',
    since: 'Kept.',
  },
  {
    id: 'anything-signed',
    question: 'Is anything signed?',
    answer: `No. The raise is asked and nothing is secured. What is real is the paid trade, ${PAID_BEDS} beds on invoice from four buyers, and ${CANONICAL_ASSETS.bedsDeployed} beds already in community. We say that first, every time.`,
    status: 'answered',
    askedBy: 'The program team, form Q14',
    asked: '2026-08-01',
    chapter: 'money',
    source: 'model-placemat.ts RAISE.signedAud; demand-and-buyers.ts; asset-canonical.ts',
    since: 'Rewritten. The three invitations to apply are not printed on the public page.',
  },
  {
    id: 'where-money-lands',
    question: 'Which organisation does the money go to?',
    answer: 'The Butterfly Movement Ltd, the registered charity behind the work since 2012, with deductible gift status. It trades as Goods on Country and is taking that as its name. Everything sits there: the products, the IP, the contracts, the making, the sales, the money and the evidence. Community partners are independent organisations with their own boards, never part of the charity, and buyer receipts stay with them.',
    status: 'answered',
    askedBy: 'Every funder',
    asked: '2026-09-02',
    chapter: 'method',
    source: 'DECISIONS.md X and AA; Ben, 12 September, one entity',
    since: 'Rewritten to the one-entity ruling.',
  },
  {
    id: 'which-entity',
    question: 'Which entity applies to QBE and receives the grant?',
    answer: 'The Butterfly Movement Ltd, trading as Goods on Country, applies and receives. Ruled 5 September. A Curious Tractor, the company the first beds were made through, is disclosed as a related entity; it does the research and development.',
    status: 'answered',
    askedBy: 'The program team, form Q1, Q2 and Q8',
    asked: '2026-09-02',
    chapter: 'money',
    source: 'DECISIONS.md AA',
    since: 'Was open; ruled 5 September.',
  },
  {
    id: 'how-fast',
    question: `How fast can ${RAISE.bedsYearOne} beds move?`,
    answer: 'As fast as each community organisation agrees its rules. The Harvest Plant makes the first 400 on the flat-pack route, tab sheets pressed at the plant, legs bought in, kits dispatched flat and assembled in community, which is how the forty Maningrida beds were made. We would not move a bed before the rules are agreed.',
    status: 'answered',
    askedBy: 'The program team, form Q19',
    asked: '2026-09-03',
    chapter: 'make',
    source: 'Ben, 12 September, the flat-pack route; deck master S10',
    since: 'Rewritten from a thousand beds to 400. No capacity figure until the Capacity tab is opened.',
  },
  {
    id: 'how-catalytic',
    question: 'How is a grant catalytic if it does not match anything?',
    answer: `The first money starts a trade that keeps going without it. The first ${RAISE.bedsYearOne} beds go to ${RAISE.communityOrganisations} community organisations, they sell them, the buyer pays them, and the money stays there to pay for the next thing. QBE’s money starts the two facilities that move the making closer. We never say a grant matches, doubles or guarantees anything.`,
    status: 'answered',
    askedBy: 'The program team, form Q18',
    asked: '2026-09-03',
    chapter: 'money',
    source: 'Deck master S15 and S18; the eight lines',
    since: 'Rewritten. Foundations and lenders dropped from the public answer.',
  },
  {
    id: 'measure-impact',
    question: 'How do you measure impact?',
    answer: 'Two ways, kept separate. Numbers prove scale: our register counts every bed, washing machine, community and kilo of plastic, and every figure we publish carries a label. Voices prove meaning: Empathy Ledger holds consented interviews with people where the beds went. What we will measure is enterprise, paid work, recycling, and health and daily life: sales and repeat buyers, paid hours and wages, verified plastic used, beds in use and checked at six and twelve months. We do not claim health outcomes.',
    status: 'answered',
    askedBy: 'The program team, form Q10 to Q12',
    asked: '2026-09-03',
    chapter: 'evidence',
    source: 'Deck master S14; voice-impact-model.ts; VISUAL-DECISION-RECORD-2026-09-14 panels',
    since: 'Rewritten to the four measures. The interview counts are not printed until re-read at source.',
  },
  {
    id: 'washing-machines',
    question: 'What about the washing machines?',
    answer: 'Pakkimjalki Kari, named in Warumungu by Elder Dianne Stokes. A one-button machine on a Speed Queen base, at prototype stage and in several communities. It is the next thing after the beds, where a community chooses it. It is not for sale yet; there is a register-interest form.',
    status: 'answered',
    askedBy: 'Community partners and press',
    asked: '2026-07-11',
    chapter: 'trade',
    source: 'products.ts; the eight lines',
    since: 'Kept.',
  },
  {
    id: 'who-runs-the-line',
    question: 'Who runs the line at a site, and who pays them?',
    answer: 'Open, and it is the biggest single dial in our model. A site has a floor cost the day anyone works there, and the wage of whoever runs the line is the part no bed sale covers on its own. An operator and a place, named, with someone paying them, is agreed in the rules before a facility is established.',
    status: 'open',
    askedBy: 'The financial model sessions; the two of us between ourselves',
    asked: '2026-07-25',
    chapter: 'evidence',
    source: 'community-loop.ts; deck master S17',
    since: 'Kept, still open.',
  },
  {
    id: 'why-100',
    question: `Why ${RAISE.bedsEach} beds per community organisation?`,
    answer: '',
    status: 'open',
    askedBy: 'This page, 14 September',
    asked: '2026-09-14',
    chapter: 'trade',
    source: 'The eight lines',
    since: 'New. The reason in one line is Ben’s to write.',
  },
  {
    id: 'money-back',
    question: 'Does any of the money come back to the funder?',
    answer: 'No. The funder acts once, and after that the money goes round inside the community. Nobody is buying shares: The Butterfly Movement Ltd is a company limited by guarantee and has none. If a facility is ever financed with a loan, it is repaid from what Goods on Country is paid for making, never out of a community organisation’s sales money.',
    status: 'answered',
    askedBy: 'Foundation program leads',
    asked: '2026-09-02',
    chapter: 'money',
    source: 'Ben, 12 September, no shares; deck master S15',
    since: 'Rewritten. Shares have no home in a company limited by guarantee.',
  },
  {
    id: 'if-cost-over',
    question: `What happens if the cost to make comes in over ${aud(BED.makeAud)}?`,
    answer: 'We publish it anyway and redo the maths in the open. The first fifty beds get counted properly: kilos of plastic and what it cost, press time and power, CNC hours, operator hours kept separate from founder time, scrap, freight, what breaks. If it comes in under, the model is right. If it comes in over, the model changes and every page changes with it.',
    status: 'answered',
    askedBy: 'The two of us, of ourselves',
    asked: '2026-09-03',
    chapter: 'make',
    source: 'QBE page 1.9',
    since: 'Kept; the figure moved to the price model.',
  },
  {
    id: 'health-claim',
    question: 'Is this a health program?',
    answer: 'No. Scabies and rheumatic heart disease are the reason the hardware matters. The beds are washable and off the ground because of them. That is where our claim stops. We count beds in use, paid hours, plastic and sales, and we do not claim health outcomes.',
    status: 'answered',
    askedBy: 'Health funders and press',
    asked: '2026-07-11',
    chapter: 'evidence',
    source: 'CONTEXT.md; QBE page Q10',
    since: 'Kept.',
  },
  {
    id: 'who-gets-a-bed',
    question: 'Who decides who gets a bed?',
    answer: 'The community organisation, under rules it agrees before any bed moves: who gets beds, who sells, who is paid, where the money goes. Oonchiumpa did exactly this in Mparntwe. They picked the young people, chose which households got beds and who drove them out to the homelands.',
    status: 'answered',
    askedBy: 'Foundation program leads',
    asked: '2026-09-02',
    chapter: 'trade',
    source: 'QBE page 1.3 and 1.6',
    since: 'Kept.',
  },
  {
    id: 'what-goods-keeps',
    question: 'What does Goods on Country get out of it?',
    answer: 'What it is paid for making the first stock, and the money that runs the organisation, which we raise separately and say which is which. Sales money never funds it: the buyer pays the community organisation, not Goods on Country.',
    status: 'answered',
    askedBy: 'A foundation, 31 August',
    asked: '2026-08-31',
    chapter: 'money',
    source: 'Deck master S15',
    since: 'Rewritten. No foundation is named.',
  },
  {
    id: 'track-record',
    question: 'What have you actually delivered?',
    answer: `${CANONICAL_ASSETS.bedsDeployed} beds across ${CANONICAL_ASSETS.communitiesServed} communities in two years, and ${CANONICAL_ASSETS.washersInCommunity} washing machines in community. Forty beds pressed at The Harvest Plant and assembled at Gamardi by young people with Homeland School Company. Two days of building with Oonchiumpa in Mparntwe. Four buyers who have paid for ${PAID_BEDS} beds on invoice. Every bed is a row in our live register.`,
    status: 'answered',
    askedBy: 'The program team, form Q10',
    asked: '2026-09-03',
    chapter: 'road',
    source: 'asset-canonical.ts; demand-and-buyers.ts (finance branch)',
    since: 'Kept; the paid trade line updated.',
  },
  {
    id: 'open-questions',
    question: 'What are the biggest open questions right now?',
    answer: 'Which communities are ready for the two facilities, and on what terms. The measured cost of a locally made bed, which the first fifty will give us. Who runs the line at the first site and who pays them. And the rules with each community organisation, agreed before any bed moves.',
    status: 'open',
    askedBy: 'This page',
    asked: '2026-09-04',
    chapter: 'close',
    source: 'VISUAL-DECISION-RECORD-2026-09-14; deck master S17',
    since: 'Rewritten. Internal items stay off the public page.',
  },
];

export const QUESTIONS_OPEN_COUNT = QUESTIONS.filter((q) => q.status !== 'answered').length;

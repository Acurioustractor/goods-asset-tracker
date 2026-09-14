/**
 * THE QBE DECK, nineteen slides, as the deck master in Notion states them on 14 September 2026
 * (QBE deck master // story, slides, visuals & application alignment, 3d1ebcf981cf817598d8f15ee4f89c32).
 * `job`, `say` and `visual` are the master’s table; `currentTitle` and `note` are the slide-by-slide
 * review. The frames live in v2/public/strategy/Goods Final Deck.pen, board BEXfI, exported to
 * PDF on 10 September. Slides are cut from the story chapters (story-spine.ts), never the other
 * way round.
 */

export interface DeckSlide {
  id: string;
  name: string;
  job: string;
  /** Say it simply: the one line the slide has to land. */
  say: string;
  visual: string;
  currentTitle: string;
  note?: string;
  voices?: string;
  /** Where the slide's content lives on /pitch (anchor), reviewed 14 September. */
  home: string;
}

export const DECK_UPDATED = '2026-09-14';
export const DECK_FILE = 'v2/public/strategy/Goods Final Deck.pen · board BEXfI · PDF export 10 September 2026';

export const DECK: readonly DeckSlide[] = [
  { id: 'S01', name: 'Cover', job: 'Open the proposition', say: 'Growing community-led manufacturing and economic ownership.', visual: 'One strong real photograph. No diagram.', currentTitle: 'Growing community-led manufacturing and economic ownership.', note: 'Open with one proposition: beds are the first product; local enterprise and ownership are the longer path. Keep the Gamardi photograph.', home: '#crux' },
  { id: 'S02', name: 'The problem', job: 'Name the broken system', say: 'Remote communities import useful goods and export too much of the value.', visual: 'Remote landscape or discarded product photograph.', currentTitle: 'Remote communities import the goods and export the value.', note: 'Name the practical failure: distance, freight, early failure, difficult repair and waste left on Country. Keep the Ninga Mia photograph.', home: '#problem' },
  { id: 'S03', name: 'Why it matters', job: 'Show the cost', say: 'One broken supply system creates pressure across health, housing, waste and local work.', visual: 'Four verified figures only. No outcome claims.', currentTitle: 'One broken system. Four consequences.', note: 'Evidence only. The four figures describe context across waste, health, employment and enterprise. They do not claim Goods caused an outcome.', home: '#problem' },
  { id: 'S04', name: 'How Goods works', job: 'Explain the method', say: 'Listen, make something useful, test it on Country, improve it and keep supporting it.', visual: 'The Goods method and the Goods on Country production facility at The Harvest.', currentTitle: 'How useful products become a local service system.', note: 'Explain the operating method once. If the drawing is too dense, reduce it to the five verbs and one line about The Harvest.', home: '#people' },
  { id: 'S05', name: 'Who holds the work', job: 'Establish authority', say: 'Local decisions guide the work. Goods provides shared capability.', visual: 'Approved portraits and names only.', currentTitle: 'Local decisions. Shared capability.', note: 'Establish who carries organisational responsibility and who leads each community enterprise. Keep the ownership claim as a pathway. No generated people.', home: '#people' },
  { id: 'S06', name: 'The road here', job: 'Show relationship-led learning', say: 'Each place changed the product and the way the work is done.', visual: 'Existing community photographs and approved quotes.', currentTitle: 'Six places. Six voices. Each one changed the work.', voices: 'Gloria Turner, Linda Turner, Alfred Johnson, Dorrie Jones, Tehmineh Mason and Karen Liddle, approved wording only.', home: '#road' },
  { id: 'S07', name: 'What we make', job: 'Show the products', say: 'Start with beds. Build the capability to make other useful products.', visual: 'Stretch Bed leads. Other products remain clearly labelled.', currentTitle: 'What we make now and what comes next.', note: 'Stretch Bed is current. Pakkimjalki Kari is a prototype. Refrigerator is future and not yet built.', home: '#make' },
  { id: 'S08', name: 'Where the work has travelled', job: 'Show reach and evidence', say: 'The work has travelled across Country, while production currently sits at The Harvest.', visual: 'Current Country-led map and reconciled evidence band.', currentTitle: 'The work has travelled a long way.', note: 'Every number and place must remain tied to the reconciled evidence.', home: '#map' },
  { id: 'S09', name: 'One facility, four steps', job: 'Show how first stock is made', say: 'Waste plastic becomes a durable bed through one compact, teachable production line.', visual: 'Four real process photographs: sort and shred; heat, press and cool; CNC and finish; assemble, test and pack.', currentTitle: 'Plastic becomes useful parts here.', home: '#facility' },
  { id: 'S10', name: 'Maningrida', job: 'Show assembly on Country', say: 'Flat-packed parts can travel and become useful beds through local hands.', visual: 'Existing Maningrida photographs, quote, film callout and QR.', currentTitle: '40 Stretch Beds. Made at The Harvest. Assembled at Gamardi.', voices: 'Tehmineh Mason’s approved quote can support the spoken presentation.', home: '#maningrida' },
  { id: 'S11', name: 'Utopia Homelands', job: 'Show trade and feedback', say: 'A purchase moved through local hands, reached homes and created the next conversation.', visual: 'May 2026 Stretch Bed photograph and approved story links. No bed quantity until reconciled.', currentTitle: 'The work moved through local hands.', voices: 'Mykel, Karen Liddle and Dorrie Jones, approved wording only.', home: '#road' },
  { id: 'S12', name: 'Buyers', job: 'Show demand', say: 'Health, housing and other institutions can buy useful goods through community organisations.', visual: 'Separate paid demand from future conversations.', currentTitle: 'Utopia · beds delivered through local relationships.', note: 'The title does not yet match the slide’s job. Final sweep: rename it around institutional demand after the buyer evidence is checked.', home: '#money' },
  { id: 'S13', name: 'The whole model', job: 'Explain the system once', say: 'The Harvest makes first stock. The community trades it. Buyers pay the community organisation. Receipts stay local. The community chooses what comes next.', visual: 'Use the existing whole-model placemat. No second model and no generic flowchart.', currentTitle: 'A practical local service system, built through trade.', home: '#model' },
  { id: 'S14', name: 'What we will evidence', job: 'Define measurement', say: 'Track enterprise, paid work, recycling, and health and daily life.', visual: 'Four quiet evidence areas. Describe measures, not promised outcomes.', currentTitle: 'What we will measure, not what we assume.', home: '#measure' },
  { id: 'S15', name: 'Three money flows', job: 'Keep the money honest', say: 'First stock funds the beds and their facilitation together. QBE funds proposed facilities. Buyer receipts stay with the community organisation.', visual: 'Three distinct flows. Never show community receipts as Goods revenue or debt repayment.', currentTitle: 'Keep each dollar in its own lane.', home: '#money' },
  { id: 'S16', name: 'Capital has different jobs', job: 'Show the capital stack', say: 'Give each source one job and state its real status.', visual: 'Existing capital-jobs drawing. Label every source secured, received, invited, proposed or conversation.', currentTitle: 'Each source has a job and a status.', home: '#money' },
  { id: 'S17', name: 'Proposed sequence', job: 'Show the gates', say: 'Agree, cost, confirm, establish, test, review and decide.', visual: 'Five decision gates. No definite dates or promised locations.', currentTitle: 'Agree, cost, test, review. Then decide the next step.', home: '#measure' },
  { id: 'S18', name: 'The QBE request', job: 'Make one clear ask', say: 'AUD 300,000 for two proposed production facilities.', visual: 'AUD 150,000 per site is a planning allowance, not a quote. Sites, costs and agreements remain to settle. First stock and its facilitation are funded together, as one line.', currentTitle: 'QBE Foundation: AUD 300,000 for two proposed production facilities.', home: '#money' },
  { id: 'S19', name: 'Close', job: 'Land the proposition', say: 'The next community starts smarter because the learning travels.', visual: 'One strong real photograph. Minimal text.', currentTitle: 'The next community starts smarter.', home: '#close' },
];

/** The three decisions the deck master still lists as open. */
export const DECK_OPEN: readonly string[] = [
  'Reconcile the Utopia bed quantity before restoring a number to S11.',
  'Confirm facility sites, quotes, approvals and agreements before naming any place or commitment in S17 or S18.',
];

/** Closed 14 September 2026: Ben ruled S16 prints one job and one status per source (grants.ts FUNDING_LINES), the conservative labels proposed, invited, conversation, approved to a partner. */
export const DECK_CLOSED: readonly string[] = ['S16 statuses and instruments confirmed per source, 14 September 2026.'];

import { getStoryteller } from './storyteller-registry';

export const controlRoomUpdated = '13 July 2026';

/**
 * One consolidated review surface for the investor story spine, built
 * around the 5-movement narrative ("Sit down and ask us") locked in
 * Notion, not the older 6-slide deck structure in pitch-photo-review.ts.
 */

export interface DiagramRef {
  /** e.g. "14-the-loop" -> generated-images/goods-illustrations/story-spine/14-the-loop.png */
  file: string;
  title: string;
  status: 'drafted' | 'needed';
}

export interface MovementSpec {
  id: string;
  number: number;
  title: string;
  beat: string;
  /** Storyteller registry names carrying this movement, in display order. */
  voiceNames: string[];
  /** Other cleared voices worth trying in this slot, for the swap picker. */
  suggestedNames: string[];
  diagram?: DiagramRef;
  video?: { label: string; href: string; note: string };
}

export const movements: MovementSpec[] = [
  {
    id: 'listening',
    number: 1,
    title: 'The Listening',
    beat: 'Two people show up in Kalgoorlie with prototypes and no pitch. The communities set the method before a single bed lands.',
    voiceNames: ['Gloria Turner', 'Gary'],
    suggestedNames: ['Alfred Johnson', 'Jason', 'Chloe'],
  },
  {
    id: 'question',
    number: 2,
    title: 'The Question',
    beat: 'What the market never asked. The diagnosis comes from community, sharper than any deck.',
    voiceNames: ['Linda Turner', 'Alfred Johnson', 'Daniel Patrick Noble', 'Carmelita & Colette'],
    suggestedNames: ['Ivy', 'Mark'],
    diagram: { file: '13-price-tags', title: 'The two price tags', status: 'drafted' },
  },
  {
    id: 'proof',
    number: 3,
    title: 'The Proof',
    beat: 'Communities assess the bed like the experts they are, and their feedback physically changes the product.',
    voiceNames: ['Gloria Turner', 'Melissa Jackson', 'Alfred Johnson', 'Fred Campbell'],
    suggestedNames: ['Cliff Plummer', 'Chloe', 'Tracy McCartney'],
    diagram: { file: '09-moulded-by-community', title: 'Moulded by community', status: 'drafted' },
  },
  {
    id: 'reversal',
    number: 4,
    title: 'The Reversal',
    beat: "It was never a delivery program. It is the community's project, and the record proves it.",
    voiceNames: ['Dianne Stokes', 'Norman Frank'],
    suggestedNames: ['Patricia Frank'],
    diagram: { file: '15-consent', title: 'Consent, held by the storyteller', status: 'drafted' },
  },
  {
    id: 'handover',
    number: 5,
    title: 'The Handover',
    beat: 'The ending communities wrote themselves, on tape, since 2024. The investment keeps a promise already made.',
    voiceNames: ['Gary', 'Gloria Turner', 'Mykel', 'Xavier', 'Patricia Frank'],
    suggestedNames: ['Kristy Bloomfield', 'Karen Liddle', 'Fred Campbell'],
    diagram: { file: '10-handover-curve', title: 'The handover curve', status: 'drafted' },
    video: {
      label: "Mykel, in his own voice",
      href: '/field-notes/utopia-may-2026',
      note: 'Captured at his house, putting the bed together. Already live and public.',
    },
  },
];

export const communityThemes = [
  { community: 'Mt Isa', carries: 'Movement 1: the method', voices: 'Gary', line: '"Sitting down on the grass, on the dirt, with the fire, that\'s our consultation."' },
  { community: 'Palm Island', carries: 'Movement 2: the diagnosis', voices: 'Alfred Johnson, Ivy, Carmelita & Colette, Daniel Patrick Noble, Jason, Mark', line: 'Freight, cost of living, "sometimes people would rather go without."' },
  { community: 'Kalgoorlie (Ninga Mia)', carries: 'Movement 3: the proof', voices: 'Gloria Turner, Chloe, Tracy McCartney', line: 'Communities assessing the product like experts, not performing gratitude.' },
  { community: 'Tennant Creek', carries: 'Movements 3-5: authorship + the reversal', voices: 'Dianne Stokes, Norman Frank, Linda Turner, Patricia Frank, Jimmy Frank, Annie Morrison, Brian Russell, Melissa Jackson, Risilda Hogan, Cliff Plummer', line: 'The birthplace. Naming, independent approach, "we\'ve never been asked."' },
  { community: 'Utopia / Alice Springs (Oonchiumpa)', carries: 'Movement 5: the handover, made real', voices: 'Mykel, Xavier, Fred Campbell, Karen Liddle, Katrina Bloomfield, Kristy Bloomfield, Shayne Bloomfield, Dorrie Jones, Ray Nelson', line: 'Paid roles already stood up, a plant-ownership conversation already open.' },
  { community: 'Katherine', carries: 'Thin coverage', voices: 'Heather Mundo', line: 'Product fit and community pride; one voice, no practitioner layer yet.' },
  { community: 'Darwin / NT-wide', carries: 'Cuts across every movement', voices: 'Wayne Glenn, Dr Boe Remenyi', line: 'The practitioner credibility layer, not place-specific.' },
];

export const allDiagrams: DiagramRef[] = [
  { file: '14-the-loop', title: 'The Goods loop (opener)', status: 'drafted' },
  { file: '13-price-tags', title: 'The two price tags', status: 'drafted' },
  { file: '09-moulded-by-community', title: 'Moulded by community', status: 'drafted' },
  { file: '11-every-claim-has-a-name', title: 'Every claim has a name', status: 'drafted' },
  { file: '15-consent', title: 'Consent, held by the storyteller', status: 'drafted' },
  { file: '10-handover-curve', title: 'The handover curve', status: 'drafted' },
  { file: '12-investment-bridge-v2', title: 'The investment bridge', status: 'drafted' },
  { file: '03-exploded-view', title: 'Exploded view (what\'s in the box)', status: 'drafted' },
  { file: '01-plastic-loop', title: 'The plastic loop', status: 'drafted' },
  { file: '02a-assembly-step1', title: 'Assembly, step 1: thread pole', status: 'drafted' },
  { file: '02b-assembly-step2', title: 'Assembly, step 2: into the leg', status: 'drafted' },
  { file: '02c-assembly-step3', title: 'Assembly, step 3: tension', status: 'drafted' },
  { file: '04-plant-workflow', title: 'On-country plant workflow', status: 'drafted' },
  { file: '05-off-the-ground', title: 'Off the ground', status: 'drafted' },
  { file: '06-keys-handover', title: 'Ownership handover (keys)', status: 'drafted' },
  { file: '07-delivery-journey', title: 'Community delivery journey', status: 'drafted' },
  { file: '08-washer-before-after', title: 'Washing machine before/after', status: 'drafted' },
  { file: '16-nine-communities', title: 'Nine communities, one line', status: 'drafted' },
];

export function resolveVoice(name: string) {
  return getStoryteller(name);
}

export const spine = {
  workingTitle: 'Sit down and ask us',
  protagonist: 'The relationship: the slow transfer of power from two founders to the communities who were never asked. Ben and Nic appear only as the ones being taught.',
  oneLine: 'We know what we need. Sit down and ask us, make it with us, and leave the making with us.',
  creditRule: 'Every proof point is a three-beat chain: they said, it changed, it returned. Community is the subject of the first and last beat; the organisation only appears in the middle, as the verb.',
};

/** Design receipts: named feedback that physically changed the product. Carries Movement 3. */
export const designReceipts = [
  { change: 'Norman Frank asked for three more beds in maroon', result: 'His colour request became a design feature.' },
  { change: 'Basket Bed to Stretch Bed', result: 'Washable, movable, repairable, multi-application, each step driven by real community feedback.' },
  { change: "Bed height", result: "Set by elders' knees and mobility." },
  { change: 'Dirty beds observed in Tennant Creek, no washer access (Dianne Stokes specifically lacked one)', result: 'Pulled the washing-machine line forward.' },
];

export const investmentBridge = {
  whyInvest: [
    "Demand is proven by community behaviour, not surveys. Dianne received one bed and came back for twenty, offering to pay for them herself.",
    'The product was de-risked by two years of design led by community, on country. Every design change traces to a named person\'s request.',
    "The workforce and the ownership path already exist. Oonchiumpa is 100% Aboriginal-owned, paid roles are already stood up, and they have asked about owning a plant of their own.",
    'The story infrastructure is investable in itself. Empathy Ledger consent architecture means every claim is auditable back to a consenting voice.',
    'The exit is the point. Success looks like communities owning production and Goods becoming unnecessary.',
  ],
  whatItBuys: [
    { item: 'Beds delivered to date', figure: '556 across 9 communities' },
    { item: 'Washing machines in community', figure: '18' },
    { item: 'Plastic diverted', figure: '3,860 kg (Stretch only)' },
    { item: 'Revenue (Goods carve-out, accountant-signed)', figure: 'AU$713,827' },
    { item: 'Current ask', figure: 'AU$400K (QBE, signed by 31 Aug 2026) on top of SEFA $300K + Snow $100K + Centrecorp $75K' },
  ],
  perFunder: [
    { funder: 'QBE / catalytic', note: 'Funds the Stage 2 production circuit: the machinery of handover.' },
    { funder: 'SEFA / debt', note: 'Working capital against the community-validated order pipeline.' },
    { funder: 'Snow / philanthropic partnership', note: 'The RHD health chain and the storytelling infrastructure, deepening the longest listening relationship.' },
    { funder: 'Centrecorp / place-based', note: 'Central Australia production with Oonchiumpa, beds and jobs on the same country the funding comes from.' },
  ],
  closingLine: 'The funding buys the middle of the sentence, so communities can own the end of it.',
};

/**
 * The model, built as a loop. Chapter 13 of the pitch pins a stage and builds the placemat's
 * circle one station at a time as the reader scrolls: each station snaps onto the ring, the arc
 * that feeds it draws in, the raise clips onto the station it pays for, and the centre of the ring
 * shows the photograph (or the figure) for that moment. The last step closes the loop on the
 * placemat's centre words.
 *
 * Every word and figure is read from model-placemat.ts, so the loop and the sheet never disagree.
 * Kit drawings are the vector pieces of 14 September 2026 (design/brand/goods-diagrams/models/kit),
 * copied to /public/images/model/kit. Photographs are from the Media Room starred set and carry
 * their starred number. model-walkthrough.guards.test.ts holds files, figures and labels.
 */

import { BED, FLOWS, PANELS, RAISE, SHEET, STATIONS, dollars, type StationId } from './model-placemat';

export type LoopLine = 'goods' | 'sage' | 'future';
export type LoopStationId = Exclude<StationId, 'act'>;

export interface LoopPiece {
  src: string;
  w: number;
  h: number;
}

export interface LoopStation {
  id: LoopStationId;
  kicker: string;
  title: string;
  /** Degrees clockwise from the top of the ring. */
  angle: number;
  piece?: LoopPiece;
  /** Not yet: drawn dashed, and the community decides. */
  proposed?: boolean;
  /** Raise money that clips onto this station. */
  tag?: string;
}

export interface LoopArc {
  from: LoopStationId;
  to: LoopStationId;
  kind: LoopLine;
  label: string;
}

export type LoopCentre =
  | { kind: 'photo'; src: string; alt: string; starred: number }
  | { kind: 'figure'; big: string; small: string; tone: 'ink' | 'sage' | 'future' }
  | { kind: 'disc'; words: string };

export interface LoopStep {
  id: string;
  kicker: string;
  title: string;
  lines: readonly string[];
  /** Stations that snap in on this step. */
  adds: readonly LoopStationId[];
  /** Arcs that draw in on this step, as from>to. */
  arcs: readonly `${LoopStationId}>${LoopStationId}`[];
  centre: LoopCentre;
  money?: readonly { label: string; amount: string; line: string }[];
  /** The four things we count snap into the corners. */
  counts?: boolean;
  whole?: boolean;
}

const kit = (name: string, w: number, h: number): LoopPiece => ({ src: `/images/model/kit/${name}.svg`, w, h });
const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const flowLabel = (from: StationId, to: StationId) => FLOWS.find((f) => f.from === from && f.to === to)?.label ?? '';

export const LOOP_STATIONS: readonly LoopStation[] = [
  { id: 'harvest', kicker: '01 · Make', title: STATIONS.harvest.title, angle: 0, piece: kit('container-plant', 1233, 480), tag: `Beds ${dollars(RAISE.bedsShownAud)} · Loan ${dollars(RAISE.loanAud)}` },
  { id: 'orgs', kicker: '02 · Hold', title: STATIONS.orgs.title, angle: 52, piece: kit('ring', 518, 488) },
  { id: 'buyers', kicker: '03 · Sell', title: STATIONS.buyers.title, angle: 103 },
  { id: 'money', kicker: '04 · Paid', title: STATIONS.money.title, angle: 154 },
  { id: 'decide', kicker: '05 · Decide', title: STATIONS.decide.title, angle: 206, piece: kit('fork', 168, 125) },
  { id: 'facility', kicker: '06 · Make locally', title: STATIONS.facility.title, angle: 257, piece: kit('container-empty-dashed', 1207, 427), proposed: true, tag: `QBE ${dollars(RAISE.qbeAud)}` },
  { id: 'next', kicker: '07 · Next', title: STATIONS.next.title, angle: 308, piece: kit('washing-machine', 555, 722), proposed: true },
];

export const LOOP_ARCS: readonly LoopArc[] = [
  { from: 'harvest', to: 'orgs', kind: 'goods', label: flowLabel('harvest', 'orgs') },
  { from: 'orgs', to: 'buyers', kind: 'goods', label: flowLabel('orgs', 'buyers') },
  { from: 'buyers', to: 'money', kind: 'sage', label: flowLabel('buyers', 'money') },
  { from: 'money', to: 'decide', kind: 'sage', label: flowLabel('money', 'decide') },
  { from: 'decide', to: 'facility', kind: 'future', label: flowLabel('decide', 'facility') },
  { from: 'facility', to: 'next', kind: 'future', label: flowLabel('facility', 'next') },
];

export const LOOP_STEPS: readonly LoopStep[] = [
  {
    id: 'raise',
    kicker: 'The raise · nothing signed',
    title: `Asked ${dollars(RAISE.totalShownAud)}.`,
    lines: ['Watch where each part of it goes as the loop builds.'],
    adds: [],
    arcs: [],
    centre: { kind: 'figure', big: dollars(RAISE.totalShownAud), small: 'asked, nothing signed', tone: 'ink' },
    money: [
      { label: 'QBE', amount: dollars(RAISE.qbeAud), line: RAISE.qbeFor },
      { label: 'Beds', amount: dollars(RAISE.bedsShownAud), line: `Three grants, each 133 beds at ${dollars(BED.priceAud)}` },
      { label: 'Loan', amount: dollars(RAISE.loanAud), line: RAISE.loanFor.replace(/\.$/, '') },
    ],
  },
  {
    id: 'make',
    kicker: '01 · Make',
    title: `${STATIONS.harvest.title}.`,
    lines: [sentence(STATIONS.harvest.line), `${PANELS.find((p) => p.id === 'recycling')!.line} One bed sells for ${dollars(BED.priceAud)}, and nothing is added to it.`],
    adds: ['harvest'],
    arcs: [],
    centre: { kind: 'photo', src: '/images/process/factory-panorama.jpg', alt: 'The Goods on Country production facility, doors open', starred: 61 },
  },
  {
    id: 'hold',
    kicker: '02 · Hold',
    title: `${STATIONS.orgs.title}.`,
    lines: [STATIONS.orgs.line],
    adds: ['orgs'],
    arcs: ['harvest>orgs'],
    centre: { kind: 'photo', src: '/images/community/alice-springs/oonchiumpa-team-red-bed.jpg', alt: 'The Oonchiumpa team with a Stretch Bed, Alice Springs', starred: 28 },
  },
  {
    id: 'sell',
    kicker: '03 · Sell',
    title: `${STATIONS.buyers.title}.`,
    lines: [STATIONS.buyers.line],
    adds: ['buyers'],
    arcs: ['orgs>buyers'],
    centre: { kind: 'photo', src: '/images/stories/utopia/09-offground.jpg', alt: 'A Stretch Bed in use, up off the ground, Utopia Homelands', starred: 69 },
  },
  {
    id: 'paid',
    kicker: '04 · Paid',
    title: STATIONS.money.title,
    lines: [STATIONS.money.line],
    adds: ['money'],
    arcs: ['buyers>money'],
    centre: { kind: 'figure', big: dollars(BED.priceAud), small: 'a bed, and the whole price stays with the community organisation', tone: 'sage' },
  },
  {
    id: 'decide',
    kicker: '05 · Decide',
    title: STATIONS.decide.title,
    lines: [STATIONS.decide.line],
    adds: ['decide'],
    arcs: ['money>decide'],
    centre: { kind: 'photo', src: '/images/community/unplaced/rec-assembly-05-pole-sleeve.jpg', alt: 'Threading a pole through the canvas sleeve of a Stretch Bed, Maningrida', starred: 42 },
  },
  {
    id: 'facility',
    kicker: '06 · Make locally',
    title: STATIONS.facility.title,
    lines: [STATIONS.facility.line, `Then ${flowLabel('facility', 'buyers')}.`],
    adds: ['facility'],
    arcs: ['decide>facility'],
    centre: { kind: 'figure', big: 'Not yet', small: 'dashed means the community decides', tone: 'future' },
  },
  {
    id: 'next',
    kicker: '07 · What comes next',
    title: STATIONS.next.title,
    lines: [STATIONS.next.line, `${STATIONS.act.title} ${STATIONS.act.line}`],
    adds: ['next'],
    arcs: ['facility>next'],
    centre: { kind: 'photo', src: '/images/product/washing-machine.jpg', alt: 'The Pakkimjalki Kari washing machine', starred: 64 },
  },
  {
    id: 'count',
    kicker: 'What we count',
    title: 'Four things we count.',
    lines: PANELS.map((p) => `${p.title}: ${p.line}`),
    adds: [],
    arcs: [],
    centre: { kind: 'figure', big: '4', small: 'things we count', tone: 'ink' },
    counts: true,
  },
  {
    id: 'whole',
    kicker: 'The loop',
    title: `${SHEET.centre}.`,
    lines: [`${SHEET.support.title}: ${SHEET.support.items.join(', ')}.`],
    adds: [],
    arcs: [],
    centre: { kind: 'disc', words: SHEET.centre },
    counts: true,
    whole: true,
  },
];

export const LOOP_COUNTS = PANELS.map((p) => ({ id: p.id, title: p.title, line: p.line }));

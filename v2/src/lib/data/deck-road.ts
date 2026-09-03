/**
 * THE DECK, on the road spine, built from current facts.
 *
 * ⚠ NO LONGER RENDERED ANYWHERE (ruling U, Ben 2026-07-31). `/pitch/road` is now the scrolling
 * long-form page in `v2/src/app/pitch/road/page.tsx`, and `deck-road-client.tsx`, the slide shell
 * that was this module's only consumer, is deleted. Ruling R named this deck THE deck; ruling U
 * supersedes that on FORM while keeping its content decisions.
 *
 * KEPT ON PURPOSE rather than deleted, for two reasons. `deck-road.guards.test.ts` asserts this
 * against `road-spine.ts`, and `story-road.spine.test.ts` asserts the story surface against the
 * same spine, so the two live surfaces still agree transitively through these guards. And the
 * slide sequence is the argument in its most compressed form, which is what a PDF pipeline would
 * need if one is wanted again. Do not wire it to a route without a ruling.
 *
 * Commissioned 2026-07-26 to be THE deck. Three full decks were live (`/deck`, `/pitch/deck`,
 * `/pitch/simple`) and two undated decisions disagreed about which was canonical, so rather than
 * pick a winner among three that were each built on a different spine, this is one built on the
 * spine that was actually ruled (C and F): the road.
 *
 * ---------------------------------------------------------------------------
 * THE TWO RULES THAT SHAPE EVERY SLIDE
 * ---------------------------------------------------------------------------
 * THE ROAD LEADS, THE MODEL FOLLOWS. Slides 1 to 8 are the road. The model, the economics and the
 * ask are slides 9 to 12, and they arrive as what the road produced. Every failed deck led with
 * the framework and hung proof off it, which invites a funder to compare your framework to better
 * frameworks. Walked down the road they cannot, because nobody else has been on it.
 *
 * NO FIGURE IS TYPED HERE. Every number resolves through `canonFact()` or `CANONICAL_ASSETS` at
 * module load, so a figure cannot drift from canon and cannot be "improved" for a slide. Each one
 * carries its own claim label from canon, so a modelled number is visibly modelled. A guard fails
 * if a bare number appears in slide prose.
 *
 * ---------------------------------------------------------------------------
 * THE CLAIM CEILING, WHICH IS NOT NEGOTIABLE
 * ---------------------------------------------------------------------------
 * Ownership is a PATHWAY, never claimed complete, and `ownershipClaimLine()` derives the sentence
 * rather than letting this file assert one. scabies to RHD is the WHY, never a claimed health
 * outcome. $0 signed is stated plainly on the ask slide. No bed number is a threshold and no
 * payback period is a promise. Voices are checked against `cleared-voices.ts` by the guards.
 *
 * Invariants: `deck-road.guards.test.ts`.
 */

import { canonFact } from './canon';
import { SUPPLY_FACTS } from './supply-context';
import { CANONICAL_ASSETS } from './asset-canonical';
import { ROAD_STOPS, THE_GAP, type StopId } from './road-spine';
import { ownershipClaimLine } from './ownership-test';
import { PUBLIC_STAGES } from './pathway-stages';

/** Resolve a canon fact to a display string plus its claim label. Never hand-format a figure. */
export interface Figure {
  value: string;
  label: string;
  /** From canon: verified, workpaper, modelled, target, future. Rendered as a badge. */
  claim: string;
  canonId: string;
}

function fig(id: string, format?: (v: number | string) => string): Figure {
  const f = canonFact(id);
  return {
    value: format ? format(f.value) : String(f.value),
    label: f.label,
    claim: f.claimLabel,
    canonId: f.id,
  };
}

const aud = (v: number | string) => `$${Number(v).toLocaleString()}`;

/**
 * A figure resolved from supply-context.ts (the verified NT waste + overcrowding facts)
 * rather than canon. Same never-type-a-figure rule, different source of truth: the guards
 * verify `supply:` figures against SUPPLY_FACTS the way canon figures verify against canon.
 */
function supplyFig(id: string): Figure {
  const f = SUPPLY_FACTS.find((x) => x.id === id);
  if (!f) throw new Error(`Unknown supply fact "${id}".`);
  return { value: f.value, label: f.label, claim: f.solidity, canonId: `supply:${f.id}` };
}

/**
 * A figure DERIVED from canon rather than stored in it. `from` names the canon ids it is computed
 * from, so the guards can recompute it and fail if canon moves underneath. Never type a derived
 * number: state the arithmetic.
 */
export interface DerivedFigure extends Figure {
  from: string[];
}

function stays(marginalId: string, label: string): DerivedFigure {
  const price = Number(canonFact('stretch-price').value);
  const marginal = canonFact(marginalId);
  return {
    value: aud(price - Number(marginal.value)),
    label,
    claim: marginal.claimLabel,
    canonId: `derived:${marginalId}`,
    from: ['stretch-price', marginalId],
  };
}

/** What stays per bed, both paths, computed from canon. The gap between them is the case. */
export const STAYS_BUY_KIT = stays('marginal-buykit', 'Stays per bed, buying legs finished');
export const STAYS_PRESSED = stays('marginal-factory', 'Stays per bed, pressing in-house');

// ---------------------------------------------------------------------------
// Slides
// ---------------------------------------------------------------------------

export type SlideKind = 'opening' | 'stop' | 'gap' | 'model' | 'economics' | 'ask' | 'close';

export interface Slide {
  n: number;
  kind: SlideKind;
  /** Stop slides only. Links the slide to the shared spine. */
  stopId?: StopId;
  eyebrow: string;
  headline: string;
  body: string;
  /** Figures resolved from canon. Never typed. */
  figures?: Figure[];
  /** The one thing the presenter must not say on this slide. */
  neverSay?: string;
}

const stopSlides: Slide[] = ROAD_STOPS.map((stop, i) => ({
  n: i + 2,
  kind: 'stop' as const,
  stopId: stop.id,
  eyebrow: stop.place,
  headline: stop.taught,
  body: stop.what,
  neverSay:
    stop.id === 'maningrida'
      ? 'Never say the per-bed cost is measured. The capability is proven; the cost at a sustained rate is not.'
      : undefined,
}));

export const DECK_ROAD: Slide[] = [
  {
    n: 1,
    kind: 'opening',
    eyebrow: 'Goods',
    headline: 'The goal was never a bigger Goods.',
    body: 'It is a community that can collect the plastic, make the goods, and come to own the making. What follows is the road that produced that sentence, in the order it happened.',
    neverSay: 'Never open with a dollar figure.',
  },
  ...stopSlides,
  {
    n: 9,
    kind: 'gap',
    eyebrow: 'The gap',
    headline: THE_GAP.taught,
    body: 'Seven places, two years, and a product that works. What has not happened anywhere is the transfer. And the need is not abstract: the Census counts 2,761 very remote NT households short at least a bedroom, half of all of them. Two years of this work has delivered 540 beds. This is the honest position, and it is the reason for the ask.',
    figures: [
      fig('communities-served'),
      fig('beds-deployed'),
      fig('plastic-kg', (v) => `${Number(v).toLocaleString()}kg`),
      supplyFig('nt-overcrowding-very-remote'),
    ],
    neverSay:
      'Never present the gap as failure. It is the thing the money is for, and stating it plainly is what makes the rest credible.',
  },
  {
    n: 10,
    kind: 'model',
    eyebrow: 'What the road produced',
    headline: 'Six stages, and a basket a community picks from.',
    body: `${PUBLIC_STAGES.map((s) => s.label).join(', ')}. A community begins anywhere, moves at its own pace, and chooses how much support it wants. The object is infrastructure that scales from a single shredder up to a full facility, and of four live pathways only one has asked for the whole thing.`,
    neverSay:
      'Never say the stages were designed. They are the residue of the road, not a frame imposed on it.',
  },
  {
    n: 11,
    kind: 'economics',
    eyebrow: 'The economics',
    headline: 'We pay 8.6 times the raw material cost to buy legs finished.',
    body: 'That ratio is the whole investment case. Buying legs finished, most of the sale price leaves with the supplier. Pressing them ourselves, roughly five times as much stays. The capability is proven: forty beds were pressed and assembled end to end. What is not measured is the per-bed cost at a sustained rate, and the first thing this money buys is the run that measures it. Feedstock will never be the constraint: the NT recycled 4,933 tonnes of plastic last year, and one bed\'s legs take about 20kg of it.',
    figures: [
      fig('stretch-price', aud),
      STAYS_BUY_KIT,
      STAYS_PRESSED,
      fig('save-per-bed', aud),
      supplyFig('plastic-per-bed'),
    ],
    neverSay:
      'Never present a modelled cost as measured, and never put a bed number in front of anyone as a threshold.',
  },
  {
    n: 12,
    kind: 'ask',
    eyebrow: 'The ask',
    headline: 'Production pays for itself. The wraparound does not, and should not.',
    body: 'That separation is the credibility, not a caveat. Production is carried by bed sales and the evidence is here. The employment and youth work is grant funded by design, because that is the right money for it. Told as one blended number, neither is believable.',
    figures: [fig('signed-lois'), fig('revenue-carveout', aud)],
    neverSay:
      'Never call the revenue carve-out signed. It is a workpaper prepared with the accountant, and no signed document exists.',
  },
  {
    n: 13,
    kind: 'close',
    eyebrow: 'Where ownership actually stands',
    headline: 'Ownership is a pathway, and here is how you can check it.',
    body: `${ownershipClaimLine(new Date().toISOString().slice(0, 10))} The month-6 test is four binary checkpoints where partial counts as no: keys, payroll, invoice, decision. Oonchiumpa is the first site that will be testable, and month 6 of its delivery is the first date this pitch can be checked against.`,
    neverSay:
      'Never claim ownership is complete anywhere, in any tense. It has not happened at any site.',
  },
];

/** Every figure on the deck, for the drift and claim-label guards. */
export function deckFigures(): Figure[] {
  return DECK_ROAD.flatMap((s) => s.figures ?? []);
}

/** Everything the deck SAYS. Excludes neverSay, which is a list of prohibitions. */
export function deckAssertions(): string[] {
  return DECK_ROAD.flatMap((s) => [s.eyebrow, s.headline, s.body]);
}

/**
 * Every string, including the prohibitions, for the VOICE guards.
 *
 * Claim guards must use `deckAssertions()` instead: `neverSay` necessarily contains the words of
 * the claims it forbids, so checking it for forbidden words flags the field that enforces the rule.
 */
export function deckProse(): string[] {
  return [...deckAssertions(), ...DECK_ROAD.flatMap((s) => (s.neverSay ? [s.neverSay] : []))];
}

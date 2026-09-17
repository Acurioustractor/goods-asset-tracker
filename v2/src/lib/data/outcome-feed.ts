import { CANON, canonFact, type CanonFact } from './canon';

/**
 * WHAT GOODS CAN TELL EMPATHY LEDGER, and what it must not.
 *
 * Ben, 17 September 2026, after pointing out I had been reading the wrong consent table: the two
 * systems should connect. Empathy Ledger holds the impact model (`outcomes`, 61 rows, with
 * claim_label, outcome_level from output through to impact, evidence via related_story_ids, and
 * cultural_protocols_followed, elder_involvement, language_use, on_country_component and
 * traditional_knowledge_transmitted). Goods holds the measured figures, in canon.ts, each with a
 * source, an asAt, an owner, and a drift script that fails when it stops being true.
 *
 * Four of the 61 outcomes are Goods-scoped and three of the four carry a null current_value while
 * Goods has had a measured figure all along. That is the gap worth closing.
 *
 * ------------------------------------------------------------------------------------------
 * THE RULE THAT MAKES THIS SAFE: ONLY GREEN FACTS CROSS
 * ------------------------------------------------------------------------------------------
 *
 * canon.ts grades every fact GREEN (public-safe), AMBER (internal or management) or RED
 * (recipient and storyteller data, never to external models, never auto-published). A pipe that
 * writes into another database is auto-publishing. So only green crosses, and `assertFeedable`
 * throws on anything else. Trusting the next
 * person to remember is how this kind of pipe fails.
 *
 * That single rule already stops the tempting mistake here. `cleared-voices` is 38 and it is RED,
 * so it can never be pushed, which is correct for a second reason below.
 *
 * ------------------------------------------------------------------------------------------
 * THE HARDER RULE: THE SAME WORD IS NOT THE SAME MEASURE
 * ------------------------------------------------------------------------------------------
 *
 * Most of these outcomes look like they match a Goods number and do not. Writing the near-miss in
 * is worse than leaving the null, because a null is visibly missing and a wrong figure is not.
 * This is the register-versus-invoice distinction from community-canonical.ts, in another system.
 *
 *   "1,000 beds in inventory for commercial supply" against beds-deployed, 540.
 *   Deployed into a community is not held in inventory for sale. They are different measures and
 *   they are not supposed to tie. NOT FED.
 *
 *   "Community voices captured with consent", 27, against cleared-voices, 38.
 *   Empathy Ledger counts distinct storytellers with a transcript in the Goods organisation.
 *   Goods counts voices Ben cleared for EXTERNAL use. A person can be in one and not the other in
 *   both directions. NOT FED, and RED as well.
 *
 * What Goods can honestly answer is narrower than it first looks, and the second half of this
 * file is the part that matters: five verified figures Empathy Ledger has no outcome for at all.
 */

export type FeedVerdict = 'feeds' | 'different-measure' | 'not-green';

export interface OutcomeFeed {
  /** The Empathy Ledger `outcomes.id`, read 17 September 2026. */
  outcomeId: string;
  outcomeTitle: string;
  verdict: FeedVerdict;
  /** The canon fact id that answers it, when one honestly does. */
  canonId?: string;
  /** A literal, for a figure that is true and is an absence, with no canon fact behind it. */
  literalValue?: number;
  /** Written into `outcomes.measurement_method` so the reader can check it. */
  method?: string;
  /** Why not, in the reader's words, when the verdict is not `feeds`. */
  why?: string;
}

export const OUTCOME_FEEDS: readonly OutcomeFeed[] = [
  {
    outcomeId: '529f07fd-df32-4cf6-859f-b96458aa4d99',
    outcomeTitle: 'On-country facilities communities own and operate',
    verdict: 'feeds',
    literalValue: 0,
    method:
      'Zero. Community ownership is a pathway and is never claimed complete (Goods standing rule). The Alice Springs plant runs, and no facility is yet owned and operated by the community it sits in. Recorded as a measured zero so the outcome reads as not-yet, and never as unmeasured.',
  },
  {
    outcomeId: 'f5e13709-3599-42e2-9954-56a3f63fe912',
    outcomeTitle: '$210K investment or repayable finance secured in 2026',
    verdict: 'not-green',
    canonId: 'signed-lois',
    why:
      'The only Goods basis is canon fact signed-lois, which is AMBER: internal and management pipeline tracking. The guard caught this after it was first written as a feed. A derived zero carries the amber information anyway, because "nothing secured" is exactly the management fact the grade is protecting, so holding the value is the same decision as holding the fact.',
  },
  {
    outcomeId: 'dd387d2a-dab2-480f-83b9-60e560014c9d',
    outcomeTitle: '1,000 beds in inventory for sustainable commercial supply',
    verdict: 'different-measure',
    why:
      'Goods measures beds DEPLOYED into communities (canon beds-deployed, 540), never beds held in inventory for sale. Writing 540 here would answer a different question with a real-looking number.',
  },
  {
    outcomeId: '4fd110ff-76dd-43a1-b584-a2ff130942f9',
    outcomeTitle: 'Community voices captured with consent',
    verdict: 'not-green',
    why:
      'canon cleared-voices is RED, so it never crosses a system boundary. It also counts something else: voices cleared for external use, against Empathy Ledger counting distinct storytellers with a transcript in the Goods organisation. Empathy Ledger recomputes this one itself; its own measurement_method already says so.',
  },
];

/**
 * Verified Goods figures Empathy Ledger has no outcome for.
 *
 * Every one is green, carries a source and an asAt, and is guarded: check-asset-drift.mjs fails
 * when the register stops agreeing with it. An impact model that cannot see them is measuring the
 * work with its eyes half shut.
 */
export const PROPOSED_OUTCOMES: readonly { canonId: string; indicator: string; level: string; unit: string }[] = [
  { canonId: 'beds-deployed', indicator: 'Beds deployed into community', level: 'output', unit: 'beds' },
  { canonId: 'stretch-beds-deployed', indicator: 'Stretch Beds deployed into community', level: 'output', unit: 'beds' },
  { canonId: 'washers-in-community', indicator: 'Washing machines in community', level: 'output', unit: 'machines' },
  { canonId: 'communities-served', indicator: 'Communities with Goods assets', level: 'output', unit: 'communities' },
  { canonId: 'plastic-kg', indicator: 'Recycled HDPE diverted from landfill', level: 'short_term', unit: 'kg' },
];

/**
 * The gate. It throws, because a pipe that returns false and skips a row quietly is how a
 * red fact reaches a system nobody expected it in.
 */
export function assertFeedable(fact: CanonFact): void {
  if (fact.dataClass !== 'green') {
    throw new Error(
      `canon fact "${fact.id}" is ${fact.dataClass}, and only green facts cross into another system. ` +
        'Amber is internal, red is recipient and storyteller data.',
    );
  }
}

export interface FeedValue {
  outcomeId: string;
  value: number;
  method: string;
  asAt: string;
  source: string;
}

/** Resolve every feed that should actually be written, with the provenance to write beside it. */
export function resolveFeeds(): FeedValue[] {
  const out: FeedValue[] = [];
  for (const f of OUTCOME_FEEDS) {
    if (f.verdict !== 'feeds') continue;
    const fact = f.canonId ? canonFact(f.canonId) : null;
    if (fact) assertFeedable(fact);
    const value = f.literalValue ?? (typeof fact?.value === 'number' ? fact.value : null);
    if (value === null) continue;
    out.push({
      outcomeId: f.outcomeId,
      value,
      method: f.method ?? '',
      asAt: fact?.asAt ?? new Date().toISOString().slice(0, 10),
      source: fact ? `Goods canon.ts fact "${fact.id}". ${fact.source}` : 'Goods canon.ts',
    });
  }
  return out;
}

/** Every proposed outcome, with the canon fact resolved and the green gate applied. */
export function resolveProposed() {
  return PROPOSED_OUTCOMES.map((p) => {
    const fact = canonFact(p.canonId);
    assertFeedable(fact);
    return { ...p, fact };
  });
}

/** Green facts with a number, for anyone building the next pipe. */
export function greenNumericFacts(): CanonFact[] {
  return CANON.filter((f) => f.dataClass === 'green' && typeof f.value === 'number');
}

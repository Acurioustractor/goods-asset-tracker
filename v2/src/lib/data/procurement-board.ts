/**
 * ONE ROW PER OPPORTUNITY, so the whole thing can be sorted, filtered and argued with.
 *
 * Ben, 16 September 2026: one place in the admin to play with all of this, tables and insights,
 * like a social media dashboard but for procurement, covering communities, population, the size
 * of the problem, procurement, organisations, and then ideas for engagement.
 *
 * The unit is a COMMUNITY, because that is the only key all five sources share:
 *   - communities and partner organisations, from the live v2 table
 *   - crowding, from ABS Census 2021 via data/community-intel.json
 *   - federal contract value in that place, from data/procurement-buyers.json
 *   - who builds and maintains there, from data/nt-housing-contractors.json
 *   - the jurisdiction rules, from procurement-model.ts
 *
 * WHAT IS DELIBERATELY NOT HERE. No demand figure, modelled or otherwise. No opportunity value
 * in dollars. Contract values in this file are what a GOVERNMENT has spent in a place on
 * housing-adjacent work; they are a measure of where money and obligation already are, and they
 * are never a bed order. The moment this file starts multiplying households by anything it has
 * become the thing Ben withdrew on 15 September.
 *
 * The score is an ORDERING. Nobody should read it as a valuation. It ranks where to spend the
 * next phone call using
 * four things we can actually stand behind: how crowded the place is, how easy that jurisdiction
 * makes a purchase, whether a route through a known organisation exists, and whether we are
 * already there. Every component is shown on the row so the ranking can be disagreed with.
 */

import { placeKey, resolvePlace } from './place-registry';
import { JURISDICTIONS, COMMUNITY_ROUTES } from './procurement-model';

export interface Opportunity {
  community: string;
  /** The place-registry token, or null when the registry has never seen this name. */
  placeId: string | null;
  state: string;
  /** ABS Census 2021 households needing one or more extra bedrooms. Null where not held. */
  crowdedPct: number | null;
  personsPerDwelling: number | null;
  /** The organisation we already work with, if any. */
  partner: string | null;
  /** Whether that organisation is known to hold government contracts. */
  routeExists: boolean;
  routeEvidence: string | null;
  /** What Goods already has on the ground. */
  presence: string | null;
  /** Government housing-adjacent contract value recorded in that place. Never a bed order. */
  govtSpendAud: number | null;
  /** How many beds can be bought there with no tender, from the jurisdiction rules. */
  bedsNoTender: number | null;
  noTenderRule: string | null;
  /** The ordering score, 0 to 100, with its parts exposed. */
  score: number;
  parts: { need: number; ease: number; route: number; presence: number };
  /** What to actually do next, derived from the row. */
  move: string;
}

interface IntelRow {
  community: string; state: string | null;
  overcrowdedPct: number | null; personsPerDwelling: number | null;
}
interface BuyerPlace { community: string; valueAud: number; topBuyer: string | null }

/**
 * Join on the place token, falling back to the comparison key when the registry has never seen
 * the string. Before 17 September 2026 this file carried its own normaliser, the fourth in the
 * repo, and "Galiwinku" and "Galiwin'ku" were two different communities to it.
 */
const joinKey = (s: string) => resolvePlace(s)?.id ?? placeKey(s);

/**
 * Built on the server from the three JSON pulls plus the hand-written routes. Everything is
 * matched through the place registry, so a row that fails to match is a place nobody has mapped.
 * A spelling difference can no longer cause it, and an unmatched row carries nulls.
 */
export function buildOpportunities(
  intel: IntelRow[],
  places: BuyerPlace[],
): Opportunity[] {
  const byName = new Map<string, IntelRow>();
  for (const i of intel) byName.set(joinKey(i.community), i);
  const spendByName = new Map<string, BuyerPlace>();
  for (const p of places) spendByName.set(joinKey(p.community), p);

  const jur = new Map(JURISDICTIONS.map((j) => [j.name, j]));
  const stateToJur: Record<string, string> = {
    NT: 'Northern Territory', QLD: 'Queensland', SA: 'South Australia', WA: 'Western Australia',
  };

  const rows: Opportunity[] = COMMUNITY_ROUTES.map((r) => {
    const i = byName.get(joinKey(r.community));
    const spend = spendByName.get(joinKey(r.community));
    const j = jur.get(stateToJur[r.state] ?? '');
    const dp = j?.directPurchase ?? null;

    const crowdedPct = i?.overcrowdedPct ?? null;
    const routeExists = r.holdsGovtContracts === 'yes';

    // NEED. Crowding, scaled so 64 per cent, the worst we hold, reaches full marks.
    const need = crowdedPct === null ? 12 : Math.min(40, Math.round((crowdedPct / 64) * 40));
    // EASE. An uncapped rule scores full; otherwise beds-with-no-tender on a log scale, because
    // the difference between 29 and 66 beds matters more than between 666 and 733.
    const ease = dp === null ? 0
      : dp.beds === 0 ? 25
      : Math.min(25, Math.round((Math.log10(Math.max(dp.beds, 1)) / Math.log10(733)) * 25));
    const route = routeExists ? 20 : 0;
    const presence = r.weHave && !/^Nothing yet/i.test(r.weHave) ? 15 : 0;

    return {
      community: r.community,
      placeId: resolvePlace(r.community)?.id ?? null,
      state: r.state,
      crowdedPct,
      personsPerDwelling: i?.personsPerDwelling ?? null,
      partner: r.partner,
      routeExists,
      routeEvidence: r.contractEvidence,
      presence: r.weHave,
      govtSpendAud: spend?.valueAud ?? null,
      bedsNoTender: dp ? (dp.beds === 0 ? null : dp.beds) : null,
      noTenderRule: dp?.rule ?? null,
      score: need + ease + route + presence,
      parts: { need, ease, route, presence },
      move: nextMove(r.state, routeExists, presence > 0, dp?.beds ?? null),
    };
  });

  return rows.sort((a, b) => b.score - a.score);
}

/** The next call to make, derived from what the row actually says. */
function nextMove(state: string, routeExists: boolean, weAreThere: boolean, bedsNoTender: number | null): string {
  if (state === 'QLD') {
    return weAreThere
      ? 'The council is itself an Aboriginal and Torres Strait Islander business under QPP 2026 and needs no directory registration. Ask them to buy 29 beds, which is under the no-quote threshold entirely.'
      : 'Named on the QPP 2026 Indigenous local council list. A state agency can engage them for $500,000 with no quotes, and they can buy 29 beds themselves with none either. No relationship yet.';
  }
  if (state === 'WA') {
    return 'Rule C4.2 has no dollar cap for a Registered Aboriginal Business. The head maintenance RFT is in market now for contracts starting July 2028, and the inbox takes questions today.';
  }
  if (state === 'SA') {
    return 'A public authority can directly engage an eligible Aboriginal business up to $550,000, and the instrument names the APY Lands. Nganampa Health Council wrote the healthy living practices we keep quoting.';
  }
  if (routeExists && weAreThere) {
    return 'The organisation here already holds government contracts and already holds our product. This is the shortest line in the model: ask whether they will hold stock and sell it.';
  }
  if (routeExists) {
    return 'The organisation here already holds government contracts, which means the route exists. We have nothing on the ground, so the first move is a relationship. An invoice comes later.';
  }
  if (bedsNoTender) {
    return `Nothing known about whether the partner here can sell. Worth establishing, because ${bedsNoTender} beds can be bought in this jurisdiction with no tender.`;
  }
  return 'No route established and no jurisdiction rule to lean on yet.';
}

/** The filters the board offers, defined once so the UI and the counts agree. */
export const BOARD_FILTERS = [
  { id: 'all', label: 'Everything' },
  { id: 'here', label: 'Where we already are' },
  { id: 'route', label: 'Route exists' },
  { id: 'crowded', label: 'Most crowded' },
  { id: 'nothing', label: 'Nothing there yet' },
] as const;

export type BoardFilter = (typeof BOARD_FILTERS)[number]['id'];

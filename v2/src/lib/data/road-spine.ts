/**
 * THE ROAD - the single definition of the narrative spine.
 *
 * Rulings C and F (2026-07-25) made the road the spine, superseding five competing narrative
 * spines that were live at once. Seven stops and the gap. Voices lead each stop, because each
 * stop is a person saying something. The model arrives near the END, as what the road produced.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS FILE EXISTS
 * ---------------------------------------------------------------------------
 * The road was defined in three places and about to be a fourth: as prose in `/STRATEGY.md` §2,
 * as `story-road.ts` on the story branch, and inside `deck.ts`. The story-road handoff named a
 * shared spine module as the cleaner answer and said it was not done only because `deck.ts` was
 * under concurrent edit at the time.
 *
 * A narrative spine defined three times is how five spines happened in the first place. So this
 * is the one definition. `story-road.ts` and `deck.ts` should both import from here and keep
 * their own LENGTH and PRESENTATION: the story page is the long read, the deck is the short one,
 * and they are the same road at different lengths.
 *
 * ---------------------------------------------------------------------------
 * TWO RULES THAT ARE STRUCTURAL, NOT STYLISTIC
 * ---------------------------------------------------------------------------
 * 1. MONEY NEVER GETS ITS OWN SECTION. Every dead deck bolted money blocks onto story stops, and
 *    those slides migrated on every rebuild (8-9-11 in one version, the middle in another, the end
 *    in a third). A block with no home moves. A lesson taught by a place cannot move. So money
 *    enters at Palm Island and the economics land at Maningrida, because that is where those
 *    lessons were actually learned.
 *
 * 2. TENNANT CREEK CARRIES TWO STOPS, deliberately. It taught two different things and it is
 *    where the deepest relationship is.
 *
 * Every name here is checked against `cleared-voices.ts` by `road-spine.guards.test.ts`. A name
 * that is not on the allowlist must never reach this file.
 */

export type StopId =
  | 'kalgoorlie'
  | 'tennant-creek'
  | 'the-machine'
  | 'palm-island'
  | 'utopia'
  | 'maningrida'
  | 'oonchiumpa';

export interface RoadStop {
  id: StopId;
  /** Where it happened. */
  place: string;
  /** The person whose stop this is. MUST be cleared in cleared-voices.ts. */
  voice: string | null;
  /** What this stop taught. The reason it cannot be moved. */
  taught: string;
  /** One line of what happened, in the room. */
  what: string;
}

export const ROAD_STOPS: RoadStop[] = [
  {
    id: 'kalgoorlie',
    place: 'Kalgoorlie',
    voice: 'Gloria Turner',
    taught: 'The bed disappeared',
    what: 'The first bed went together outside the tent, and it was gone when the team came back. It was inside, with four women sleeping on it. Gloria Turner was the first person to use a Goods bed.',
  },
  {
    id: 'tennant-creek',
    place: 'Tennant Creek',
    voice: 'Linda Turner',
    taught: 'Who gets asked',
    what: 'The people who live with the problem were not the people being asked to design for it.',
  },
  {
    id: 'the-machine',
    place: 'Tennant Creek',
    voice: 'Dianne Stokes',
    taught: 'A machine with a name',
    what: 'Pakkimjalki Kari, named in Warumungu by an Elder. A product named by the people who use it is a different object from one named by the people who sell it.',
  },
  {
    id: 'palm-island',
    place: 'Palm Island',
    voice: 'Alfred Johnson',
    taught: 'Money enters here',
    what: 'What it costs, who pays and who decides arrived as one question, from the community rather than from a funder.',
  },
  {
    id: 'utopia',
    place: 'Utopia Homelands',
    voice: 'Dorrie Jones',
    taught: 'Arrival is not the ending',
    what: 'Beds delivered family by family across the homelands. Delivery is where most programs stop, and it is where the actual question starts.',
  },
  {
    id: 'maningrida',
    place: 'Maningrida and the farm',
    voice: 'Fred Campbell',
    taught: 'Economics land here',
    what: 'Forty beds pressed and assembled end to end. The capability is proven. What it costs per bed at a sustained rate is not yet measured.',
  },
  {
    id: 'oonchiumpa',
    place: 'Oonchiumpa, Alice Springs',
    voice: 'Karen Liddle',
    taught: 'The first transfer',
    what: 'The only pathway that has asked for a whole facility, and the first site where ownership will be testable rather than asserted.',
  },
];

/**
 * The gap is where the model and the ask arrive. It is not a stop, because nobody taught it:
 * it is what is true after all seven.
 */
export const THE_GAP = {
  taught: 'Nobody owns the making',
  /** Figures are pulled from canon at render time. This is the shape of the sentence, not the numbers. */
  line: 'Eleven communities. Two years. Nobody owns the making.',
} as const;

export const SPINE_RULES = [
  'The model arrives near the end, as what the road produced. Never at the front.',
  'Money never gets its own section. It enters at Palm Island and lands at Maningrida.',
  'Voices lead each stop, because each stop is a person saying something.',
] as const;

export function roadStop(id: StopId): RoadStop {
  const found = ROAD_STOPS.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown road stop "${id}".`);
  return found;
}

/** Every named voice on the road, for the consent guard. */
export function roadVoices(): string[] {
  return ROAD_STOPS.map((s) => s.voice).filter((v): v is string => v !== null);
}

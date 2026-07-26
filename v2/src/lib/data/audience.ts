/**
 * THE AUDIENCE MODEL - who we are talking to, and what each of them came for.
 *
 * This layer did not exist anywhere in the system before 2026-07-26. There were no personas, no
 * segments, and no mapping of who lands where, which is why surfaces were built one at a time
 * without a shared idea of who they serve. The result is a repeated failure with one shape:
 *
 *   EVERY DEAD ARTIFACT WE HAVE BUILT LED WITH THE WRONG THING FOR ITS READER.
 *
 * A deck that opened with the framework rather than the road. A community conversation that
 * arrived with a facility proposal instead of a yarn. A product page that put impact ahead of the
 * lead time, for a procurement officer who needed the lead time. Each was good work aimed at
 * nobody in particular.
 *
 * ---------------------------------------------------------------------------
 * THE ONE RULE
 * ---------------------------------------------------------------------------
 * Lead with the thing that audience came for, then earn the rest. `leadWith` on every record is
 * that rule made concrete, and it is the field to check first when a surface is not landing.
 *
 * ---------------------------------------------------------------------------
 * WHY `mustNeverSee` IS NOT A STYLE NOTE
 * ---------------------------------------------------------------------------
 * Each entry is a real failure that has occurred or would end a relationship. Showing a community
 * their own photo before they cleared it is a harm to a person, not a branding error. Presenting a
 * modelled figure to a funder as though it were measured is how credibility goes at once and for
 * good. These are constraints with teeth, so they are data rather than prose in a style guide.
 *
 * ---------------------------------------------------------------------------
 * DOORS
 * ---------------------------------------------------------------------------
 * Three doors, three different legal entities, and they are NOT interchangeable: donations to the
 * DGR charity, orders and repayable finance to the trading company. Equity is not sold and gifts
 * never fund the company. The doors themselves are defined once in `ask-surface.ts` as
 * `ENTITY_DOORS` and imported here, so an audience can point at a door but can never restate what
 * a door is.
 *
 * The picture this serves: `/STRATEGY.md` §8, which describes the three artifacts each audience
 * reads. Invariants: `audience.guards.test.ts`. (Drafted in `/FOUNDATION.md` §4, since folded into
 * STRATEGY and archived to `_archive/2026-07-26/`. THIS FILE is the source now, not that draft.)
 */

import { ENTITY_DOORS, type EntityDoor } from './ask-surface';

export const AUDIENCE_RULE =
  'Lead with the thing that audience came for, then earn the rest.';

// ---------------------------------------------------------------------------
// Doors
// ---------------------------------------------------------------------------

export type DoorId = 'donate' | 'buy' | 'invest';

/** Maps a door id onto the verb used in `ENTITY_DOORS`. The doors stay defined in one place. */
const DOOR_VERBS: Record<DoorId, string> = {
  donate: 'Donate',
  buy: 'Buy / Order',
  invest: 'Invest (repayable)',
};

export function entityDoor(door: DoorId): EntityDoor {
  const verb = DOOR_VERBS[door];
  const found = ENTITY_DOORS.find((d) => d.verb === verb);
  if (!found) {
    throw new Error(
      `Door "${door}" maps to verb "${verb}", which is not in ENTITY_DOORS. The doors are defined in ask-surface.ts and must not be restated here.`,
    );
  }
  return found;
}

// ---------------------------------------------------------------------------
// The six audiences
// ---------------------------------------------------------------------------

export type AudienceId =
  | 'community'
  | 'funder'
  | 'buyer'
  | 'supporter'
  | 'partner'
  | 'internal';

export interface Audience {
  id: AudienceId;
  label: string;
  /** Who they are, in one line. */
  who: string;
  /** What they believe on arrival, which is usually wrong and always the thing to work with. */
  arrivesBelieving: string;
  /** The rule, applied. What this reader came for and what must therefore come first. */
  leadWith: string;
  needsToSee: string[];
  /** Constraints with teeth. Each one is a real failure, not a preference. */
  mustNeverSee: string[];
  /** One action. If a surface offers this audience two, it is serving two audiences. */
  nextAction: string;
  /** Which of the three money doors, if any. Internal and partner audiences have none. */
  door: DoorId | null;
  /** Surfaces that serve them. Routes where they exist. */
  servedBy: string[];
  /** Anything unresolved that changes how we treat this audience. */
  open?: string;
}

export const AUDIENCES: Audience[] = [
  {
    id: 'community',
    label: 'Community',
    who: 'A community deciding whether to work with us at all.',
    arrivesBelieving:
      'That we are another outside organisation arriving with a program it has already designed.',
    leadWith: 'A yarn, with nothing proposed.',
    needsToSee: [
      'That other communities set the agenda and it stuck.',
      'That we will say what something costs without being asked twice.',
      'That there is a version of this that starts small.',
    ],
    mustNeverSee: [
      'A facility proposal before a yarn.',
      'The cost model as a spreadsheet. It is presented as the questions it came from, and the answers belong to the community.',
      'Their own photo, story or name used before they cleared it.',
      'The words "co-design". The products are designed in community, led by community.',
    ],
    nextAction: 'A yarn, with nothing proposed.',
    door: null,
    servedBy: ['/pathways', '/field-notes', 'a person they already know'],
  },
  {
    id: 'funder',
    label: 'Funders and concessional lenders',
    who: 'Grantmakers, foundations and lenders deciding whether to put money in.',
    arrivesBelieving:
      'Either that this is charity with a business attached, or a business with charity attached. Usually looking for the seam.',
    leadWith: 'The road. The model arrives near the end, as what the road produced.',
    needsToSee: [
      'The road first, then the model as what the road produced, not a framework with proof hung off it.',
      'The two pots separated: production pays for itself, the wraparound is grant funded by design, and the separation is the credibility.',
      'The unmeasured things named before they find them.',
      '$0 signed, stated plainly and first.',
    ],
    mustNeverSee: [
      'A bed number as a threshold.',
      'A payback period as a promise.',
      'Any modelled figure presented as though it came off a measured run.',
      'The charity board presented as though it satisfies the 51% supplier ownership test. That ends the relationship.',
    ],
    nextAction:
      'A letter naming amount, instrument, funder legal name and a callable contact. A fortnight of work, not a facility agreement.',
    door: 'invest',
    servedBy: ['/pitch/deck', '/pitch/funder-pathways', '/export'],
    open: 'What SIH will accept as match paper is unanswered, and it is worth more than the rest of the sequencing put together.',
  },
  {
    id: 'buyer',
    label: 'Buyers and procurement',
    who: 'Health services, government, NGOs and community organisations buying beds.',
    arrivesBelieving: 'That they are buying furniture.',
    leadWith: 'Specification, price, lead time, freight, warranty, and who fixes it.',
    needsToSee: [
      'The specification and the price.',
      'Lead time, freight and warranty, and who fixes it when it breaks.',
      'Then, and only then, that buying it here also builds the making.',
    ],
    mustNeverSee: [
      'The impact story ahead of the spec. A procurement buyer who cannot find the lead time does not stay for the mission.',
      'A claim that the beds are made by a community-owned entity. Ownership is a pathway and no site has passed the month-6 test.',
    ],
    nextAction: 'An order, or a quote.',
    door: 'buy',
    servedBy: ['/shop', '/shop/stretch-bed-single', '/products'],
    open: 'The 51% ownership gate blocks the procurement lane most of the time. The direction to test, not yet a decision, is that the community production entity is the seller with Goods. as its supplier.',
  },
  {
    id: 'supporter',
    label: 'Supporters and donors',
    who: 'Individuals who want the work to continue.',
    arrivesBelieving: 'That a small gift will not matter.',
    leadWith: 'One face, one voice, one place.',
    needsToSee: [
      'One face, one voice, one place.',
      'A specific thing their money did.',
    ],
    mustNeverSee: [
      'Aggregate impact language in place of a person.',
      'A deductibility claim before the receipting mechanics are confirmed. A wrong deductibility claim is an ATO problem, not a copy problem.',
    ],
    nextAction: 'Donate, or join the list.',
    door: 'donate',
    servedBy: ['/story', '/story/road', '/field-notes'],
  },
  {
    id: 'partner',
    label: 'Delivery partners',
    who: 'Oonchiumpa, Our Community Shed, Councils, corporations and training providers.',
    arrivesBelieving: 'That they are being asked to host something.',
    leadWith: 'Which of the nine modules is theirs, and which is ours.',
    needsToSee: [
      'Exactly which modules are theirs and which are ours.',
      'What happens at Transfer, and who holds what afterwards.',
      'The module basket priced, rather than a facility quote.',
    ],
    mustNeverSee: [
      'A scope that leaves Transfer undefined.',
      'A number that assumes a whole site when they are taking one module.',
    ],
    nextAction: 'Agree scope and roles in writing.',
    door: null,
    servedBy: ['/pathways', '/admin/pathways'],
  },
  {
    id: 'internal',
    label: 'Board and team',
    who: 'The audience most often forgotten, and the one that decides whether the others are served well.',
    arrivesBelieving: 'That the current version of a document is the one they last read.',
    leadWith: 'Which file wins.',
    needsToSee: [
      'Which file is authoritative, and in what order.',
      'What is open, what is blocked, and on whom.',
      'What a ruling superseded, and when.',
    ],
    mustNeverSee: [
      'A figure typed by hand instead of read from canon, which is a bug even when it is correct today.',
      'A ruling recorded with no sweep list, which is a ruling that will silently rot.',
    ],
    nextAction: 'Read /STRATEGY.md, then /DECISIONS.md.',
    door: null,
    servedBy: ['/STRATEGY.md', '/DECISIONS.md', '/CONTEXT.md'],
  },
];

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export function audience(id: AudienceId): Audience {
  const found = AUDIENCES.find((a) => a.id === id);
  if (!found) throw new Error(`Unknown audience "${id}".`);
  return found;
}

/** Audiences that reach a money door, and which one. */
export function audiencesWithDoor(): { audience: Audience; door: EntityDoor }[] {
  return AUDIENCES.filter((a) => a.door !== null).map((a) => ({
    audience: a,
    door: entityDoor(a.door as DoorId),
  }));
}

/**
 * Every prose string in the model, for the VOICE guards (em dashes, banned words).
 * Kept as a function so a new field cannot quietly escape the checks.
 */
export function audienceProse(): string[] {
  return [...audienceAssertions(), ...AUDIENCES.flatMap((a) => a.mustNeverSee)];
}

/**
 * Everything the model ASSERTS, which is everything except the prohibitions.
 *
 * The distinction is not pedantry. `mustNeverSee` is a list of claims we refuse to make, so it
 * necessarily contains the words those claims use: "a claim that the beds are made by a
 * community-owned entity" is a prohibition, not a claim. A guard that checks "we never say
 * community-owned" must read this list, not `audienceProse()`, or it will flag the very field
 * that enforces it.
 *
 * The same applies to any SURFACE rendering these. A `mustNeverSee` string is only true alongside
 * its label, and must never be rendered as a standalone sentence.
 */
export function audienceAssertions(): string[] {
  return [
    AUDIENCE_RULE,
    ...AUDIENCES.flatMap((a) => [
      a.label,
      a.who,
      a.arrivesBelieving,
      a.leadWith,
      a.nextAction,
      ...a.needsToSee,
      ...(a.open ? [a.open] : []),
    ]),
  ];
}

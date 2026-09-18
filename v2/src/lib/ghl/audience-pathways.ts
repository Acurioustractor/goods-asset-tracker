/**
 * The eight audience pathways: where a person enters, what they get, what moves
 * them to the next stage, and who owns it.
 *
 * ── Why this file exists ─────────────────────────────────────────────────────
 * On 17 September 2026 the machine was proved end to end: a form submission
 * becomes a contact, canonical tags, a conversation thread, a card on the right
 * board, an acknowledgement to the person and an email to the team. What it
 * could not answer was the next question: and then what. Every lane stopped at
 * the acknowledgement, and the four things you need to run a campaign on a lane
 * (the door, the thing owed, the trigger, the person) lived in a plan document,
 * a GHL dashboard and somebody's memory.
 *
 * So they live here, typed, with guards in ./audience-pathways.test.ts that fail
 * when a door disappears, a board id goes stale, a new audience arrives with no
 * pathway, or a step quietly loses its owner.
 *
 * ── Not to be confused with ──────────────────────────────────────────────────
 * `lib/data/community-pathways.ts` is the per-COMMUNITY engagement ladder
 * (Utopia, Tennant Creek, Palm Island) rendered at /admin/pathways. This file is
 * the per-AUDIENCE comms pathway. A community appears in both and they are
 * different objects: one is a place and its next phase, the other is a lane and
 * its promises.
 *
 * ── The rule that shapes it (R9) ─────────────────────────────────────────────
 * `lane:community` is out of the machine, not out of communication. Three
 * classes of message, and only the third is banned on that lane:
 *   answer    they wrote to us, a reply is owed, fast, from a named person
 *   service   about a thing they already hold, refusable per object
 *   broadcast we decided to tell a group something. Off by default here.
 * Automation on the community line points INWARD: it nags Goods, never them.
 *
 * ── What is a fact and what is a plan ────────────────────────────────────────
 * `state` is what is true today, not what should be true. `gap` says what is
 * missing. Nothing in here claims a step works because it is written down.
 * Live counts behind the segments: `npm run audit:audiences`.
 */

import { AUDIENCE_SEGMENTS, SMART_LISTS } from './smart-lists';
import { INQUIRY_ROUTES, type RoutableSubject } from './inquiry-routing';

// ============================================================================
// Shape
// ============================================================================

/** The eight lanes. Ben, 17 September 2026. */
export type PathwayAudience =
  | 'buyer'
  | 'procurement'
  | 'funder'
  | 'community'
  | 'recycler'
  | 'supplier'
  | 'media'
  | 'supporter';

/** Who is on the hook. Answered by Ben, 17 September 2026. */
export type OwnerId = 'ben' | 'nic' | 'unassigned';

export const OWNERS: Record<OwnerId, { name: string; email: string; note: string }> = {
  ben: {
    name: 'Ben Knight',
    email: 'benjamin@act.place',
    note: 'Seven of the eight lanes. Replies go out under his name to hi@act.place.',
  },
  nic: {
    name: 'Nicholas Marchesi',
    email: 'nicholas@act.place',
    note: 'Supply: BOM, plant, vendors.',
  },
  unassigned: {
    name: 'Nobody',
    email: '',
    note: 'A lane with no owner is a room with nobody in it. The guard fails on this.',
  },
};

/**
 * The three classes from R9. `none` means the person receives nothing at this
 * stage, which is a finding rather than a design choice wherever it appears.
 */
export type MessageClass = 'answer' | 'service' | 'broadcast' | 'none';

/** What is true today. */
export type StepState =
  /** Published, switched on, and seen to work. */
  | 'live'
  /** The code and the GHL object both exist and it is switched off. */
  | 'built-off'
  /** A person does it by hand. Nothing automated. */
  | 'manual'
  /** Nothing exists. */
  | 'missing';

export interface PathwayEntry {
  /** The door in the person's words. */
  door: string;
  /** The file that receives it, relative to v2/src/app. Null when it is not a website door. */
  handler: string | null;
  /** The contact-form subject, when it is one. Ties the door to INQUIRY_ROUTES. */
  subject?: RoutableSubject | 'Media Pack Request' | 'General Inquiry';
  /** Canonical tags stamped. Namespaced, or the two flat tags the live workflows trigger on. */
  tags: string[];
  state: StepState;
  note?: string;
}

export interface PathwayStep {
  /** Stable id, used in URLs and in the campaign work that builds on this. */
  id: string;
  /** Where they are, in plain words. */
  name: string;
  /** The board and stage, or the system of record when there is no board. */
  where: string;
  /** What the person receives here. "Nothing" is a legitimate and damning answer. */
  theyGet: string;
  messageClass: MessageClass;
  /** What moves them to the next step. The trigger, not the hope. */
  advance: string;
  state: StepState;
  /** Required whenever state is not 'live'. The guard enforces it. */
  gap?: string;
}

export type PathwayReadiness = 'live' | 'partial' | 'not-started';

export interface AudiencePathway {
  audience: PathwayAudience;
  name: string;
  /** Who they are, in one line. */
  whoTheyAre: string;
  owner: OwnerId;
  /** The reply commitment. Null when the lane has no inbound to reply to. */
  clock: string | null;
  /** AUDIENCE_SEGMENTS ids this lane owns. Every segment is owned by exactly one lane. */
  segmentIds: string[];
  /** SMART_LISTS ids this lane owns. Same rule. */
  smartListIds: string[];
  /** The GHL board, when the lane has one. */
  board: { pipelineId: string; boardName: string } | null;
  /** True when the people here sit on lane:community, so broadcast is off (R9). */
  communityLine: boolean;
  entries: PathwayEntry[];
  steps: PathwayStep[];
  readiness: PathwayReadiness;
  /** The one thing to do next on this lane. */
  nextMove: string;
}

// ============================================================================
// The eight
// ============================================================================

const BUYERS_BOARD = { pipelineId: 'FjMyJM3YzWQFmKqR9fur', boardName: 'GOODS - Buyers' };
const FUNDING_BOARD = { pipelineId: 'JvBFYpVpyKsw899lkFgj', boardName: 'GOODS - Funding' };
const COMMUNITY_BOARD = { pipelineId: '0m9teeEQFiq6I7GB5xiP', boardName: 'GOODS - Community' };

export const AUDIENCE_PATHWAYS: AudiencePathway[] = [
  // ──────────────────────────────────────────────────────────────────────────
  {
    audience: 'buyer',
    name: 'Buyers',
    whoTheyAre:
      'Organisations with a budget now: health services, land councils, stores, shires, corporates. Plus the one person buying a single bed online.',
    owner: 'ben',
    clock: 'Two business days, reply to hi@act.place, signed by Ben.',
    segmentIds: ['buyer'],
    smartListIds: ['washer-interest'],
    board: BUYERS_BOARD,
    communityLine: false,
    entries: [
      {
        door: 'Order beds for your community, at /beds',
        handler: 'api/contact/route.ts',
        subject: 'Bulk Order Inquiry',
        tags: ['role:buyer', 'interest:bulk-order', 'act-inquiry', 'project:act-gd', 'source:website'],
        state: 'live',
        note: 'Tags read back from the GHL API on 17 September 2026, not assumed.',
      },
      {
        door: 'Buy one Stretch Bed online, at /shop/stretch-bed-single',
        handler: 'api/webhooks/stripe/route.ts',
        tags: ['role:buyer', 'interest:beds'],
        state: 'live',
        note:
          'The confirmation is built and sent from the webhook through GHL Conversations. It used ' +
          'to rely on the New Order Notification workflow, which has been a draft since February, ' +
          'so somebody paid, read "Confirmation sent to you" on the success page, and heard nothing.',
      },
      {
        door: 'Registers interest in a washing machine',
        handler: 'api/partnership/route.ts',
        tags: ['role:buyer', 'interest:washer'],
        state: 'live',
        note:
          'Posts to the partnership route, not the contact route, and the washer-interest branch ' +
          'there opens a card on GOODS - Buyers. Pakkimjalki Kari is prototype stage: register ' +
          'interest only, never for sale.',
      },
      {
        door: 'Rings 0422 883 943',
        handler: null,
        tags: [],
        state: 'manual',
      },
    ],
    steps: [
      {
        id: 'buyer-enquiry',
        name: 'Enquiry landed',
        where: 'GOODS - Buyers, stage Outreach Queued',
        theyGet: 'A reply that asks for the three things a quote needs, within a minute of the form.',
        messageClass: 'answer',
        advance:
          'They send how many, which community and when, and a human quotes the beds and the freight as one figure.',
        state: 'live',
        gap:
          'Bulk Order Inquiry has its own reply now. Five of the seven branches still fall through to the generic letter: capital, community, media, partner and general.',
      },
      {
        id: 'buyer-quoted',
        name: 'Quoted',
        where: 'GOODS - Buyers, moved by hand',
        theyGet: 'A delivered price for their place.',
        messageClass: 'answer',
        advance: 'They accept and raise a purchase order, or ask for a variation.',
        state: 'manual',
        gap:
          'There is no quote artefact anywhere in the app. Every quote so far was written by hand in Xero, which is also why the Centrecorp paper trail says "Weave Bed v2.3" for what are Stretch Beds.',
      },
      {
        id: 'buyer-ordered',
        name: 'Ordered',
        where: 'GOODS - Buyers, invoiced by A Curious Tractor Pty Ltd',
        theyGet: 'A confirmation naming the order, what the bed is made of and who to ring. A sponsor gets where it is going and their own words read back.',
        messageClass: 'answer',
        advance: 'Payment, then the beds are made.',
        state: 'manual',
        gap: 'Orders are invoiced by A Curious Tractor Pty Ltd for now (Ben, 16 September 2026), which is the same fact that shuts every Indigenous procurement instrument. See the procurement lane.',
      },
      {
        id: 'buyer-delivered',
        name: 'Delivered',
        where: 'The asset register, one row per bed',
        theyGet: 'The beds, and a QR on each one.',
        messageClass: 'service',
        advance:
          'Somebody in the community scans the QR and claims the bed, which moves the relationship from the buyer to the people using it.',
        state: 'manual',
        gap: 'Nobody has ever claimed a bed: 0 rows in user_assets. Today the buyer relationship ends at the invoice.',
      },
      {
        id: 'buyer-repeat',
        name: 'Asked again',
        where: 'Nowhere',
        theyGet: 'Nothing.',
        messageClass: 'none',
        advance: 'Nothing. A person remembers, or they do not.',
        state: 'missing',
        gap:
          '320 beds sold to four buyers and not one of them has been asked for a second order by anything other than somebody remembering to ring. This is the cheapest revenue in the account and there is no trigger on it.',
      },
    ],
    readiness: 'partial',
    nextMove:
      'Publish New Order Notification. The code already triggers it and the workflow is off, so a buyer who pays online hears nothing at all.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    audience: 'procurement',
    name: 'Procurement',
    whoTheyAre:
      'Government and institutional buyers reached through an Indigenous procurement instrument. Not a website door: a person writing to a person.',
    owner: 'ben',
    clock: null,
    segmentIds: [],
    smartListIds: [],
    board: BUYERS_BOARD,
    communityLine: false,
    entries: [
      {
        door: 'We approach them: Tom Harris (NT Procurement Champion), John Chapman OAM (SA Industry Advocate), Morrgul in the Kimberley, the Industry Capability Network for the WA board test',
        handler: null,
        tags: ['role:buyer'],
        state: 'missing',
        note: 'Four doors named by the procurement session. None has been approached.',
      },
      {
        door: 'A community organisation holding stock answers a buyer of its own',
        handler: null,
        tags: ['role:partner'],
        state: 'missing',
        note: 'Crosses into the community lane. This is the route every instrument actually allows.',
      },
    ],
    steps: [
      {
        id: 'procurement-instrument',
        name: 'The instrument is known',
        where: '/admin/procurement',
        theyGet: 'Nothing. This step is internal.',
        messageClass: 'none',
        advance: 'A named person is approached under a named rule.',
        state: 'live',
        gap: undefined,
      },
      {
        id: 'procurement-door',
        name: 'The door is approached',
        where: 'GOODS - Buyers',
        theyGet: 'A letter from a person, about their own rule.',
        messageClass: 'answer',
        advance: 'They confirm the route, or they name the barrier.',
        state: 'missing',
        gap: 'None of the four doors has been approached.',
      },
      {
        id: 'procurement-seller',
        name: 'The seller qualifies',
        where: 'The selling entity, not the board',
        theyGet: 'Nothing. This is a question about us.',
        messageClass: 'none',
        advance:
          'A community organisation agrees to be the seller, or WA turns out to test the board rather than ownership.',
        state: 'missing',
        gap:
          'Every instrument tests the entity that SELLS, and orders are invoiced by A Curious Tractor Pty Ltd, so every channel is shut to Goods as constituted. The WA register may test the board instead, which Goods on Country would pass with 100 per cent Indigenous directors. That is a question for the Industry Capability Network, not a finding.',
      },
      {
        id: 'procurement-order',
        name: 'Ordered under the rule',
        where: 'GOODS - Buyers, with the instrument named on the card',
        theyGet: 'A quote that cites the rule that lets them buy without a tender.',
        messageClass: 'answer',
        advance: 'Delivery, then the same rule again next year.',
        state: 'missing',
        gap: 'There is no instrument field on the opportunity, so the board cannot be read as "which rule let this one through".',
      },
    ],
    readiness: 'not-started',
    nextMove:
      'Two calls, in this order: the Industry Capability Network on the WA board test, and one partner organisation on whether it wants to be a seller at all. Every route in the model is possible and nobody has agreed to any of them.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    audience: 'funder',
    name: 'Funders',
    whoTheyAre:
      'Foundations, philanthropists and impact capital. 99 contacts carry role:funder and the board holds 68 opportunities worth $3.66M.',
    owner: 'ben',
    clock: 'Two business days.',
    segmentIds: ['funder-active', 'funder-prospect'],
    smartListIds: [],
    board: FUNDING_BOARD,
    communityLine: false,
    entries: [
      {
        door: 'Fund a facility, from /pitch',
        handler: 'api/contact/route.ts',
        subject: 'Facility Funding Inquiry',
        tags: ['role:funder', 'interest:capital', 'act-inquiry', 'project:act-gd'],
        state: 'live',
        note:
          'Gets its own reply now, which is also what took the unsubscribe footer off this lane. ' +
          'A funder who arrives through any other subject still gets the generic letter and can ' +
          'still opt out of Goods email entirely by clicking it.',
      },
      {
        door: 'We apply: QBE, Brian M. Davis, TFFF, SEFA, Snow',
        handler: null,
        tags: ['role:funder'],
        state: 'manual',
        note: 'The judgement lives in Notion. The board is the record of where each one stands.',
      },
    ],
    steps: [
      {
        id: 'funder-identified',
        name: 'Identified',
        where: 'GOODS - Funding, stage Identified',
        theyGet: 'A reply that says what a facility is, then the numbers within two business days.',
        messageClass: 'answer',
        advance: 'A conversation, then an ask with evidence behind it.',
        state: 'live',
        gap:
          'A funder who arrives through a subject other than Facility Funding still gets the generic letter, which carries an unsubscribe link. Clicking it stops all Goods email and nothing warns anybody.',
      },
      {
        id: 'funder-asked',
        name: 'Asked',
        where: 'GOODS - Funding, stages Cultivating and Ask made',
        theyGet: 'The ask, with the impact report as the proof under it.',
        messageClass: 'answer',
        advance: 'They commit, they decline, or they go quiet.',
        state: 'manual',
        gap: 'Nothing marks an ask as having gone quiet, so a stalled ask looks the same as a live one.',
      },
      {
        id: 'funder-committed',
        name: 'Committed',
        where: 'GOODS - Funding, stage Committed',
        theyGet: 'A thank you, and then silence.',
        messageClass: 'answer',
        advance: 'Nothing today.',
        state: 'missing',
        gap:
          'This is the gap on this lane. Nothing happens between Committed and the next ask: no stewardship cadence, no impact note, no renewal trigger. The leads already exist, the follow-through does not.',
      },
      {
        id: 'funder-stewarded',
        name: 'Stewarded',
        where: 'GOODS - Funding, stages Delivering and Stewarding',
        theyGet: 'A quarterly note showing what the money bought, in beds and in places.',
        messageClass: 'broadcast',
        advance: 'The renewal ask, on the anniversary of the first one.',
        state: 'missing',
        gap: 'The funder-impact report template exists. No cadence sends it, and no funder is on a list.',
      },
    ],
    readiness: 'partial',
    nextMove:
      'Build the stewardship cadence on funder-active: a quarterly impact note tied to what the money bought, then a renewal trigger a year on. It is the only lane where the leads exist and the follow-through does not.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    audience: 'community',
    name: 'Communities',
    whoTheyAre:
      'The relationship line. 86 contacts carry lane:community: people holding beds and washing machines, storytellers, and the organisations Goods delivers with.',
    owner: 'ben',
    clock: 'Same day for an answer. A request raises a task with a 24 hour clock.',
    segmentIds: ['partner'],
    smartListIds: [
      'community-line',
      'storytellers',
      'bed-recipients-consented',
      'bed-owners-claimed',
      'washer-owners',
      'support-recent',
    ],
    board: COMMUNITY_BOARD,
    communityLine: true,
    entries: [
      {
        door: 'Bring this to my community, from /pitch',
        handler: 'api/contact/route.ts',
        subject: 'Community Interest',
        tags: ['role:community', 'interest:community', 'act-inquiry'],
        state: 'live',
        note:
          'Gets its own reply, which promises a call inside two business days, or asks for a number ' +
          'when the form did not carry one. Deliberately NOT lane:community. Anyone can press this ' +
          'button, and auto-laning a council officer would both dilute the community line and ' +
          'silence somebody who never asked to be silenced. A human confirms the lane.',
      },
      {
        door: 'Sell beds in your community, at /sell-beds',
        handler: 'api/contact/route.ts',
        subject: 'Partnership Inquiry',
        tags: ['role:partner', 'act-inquiry'],
        state: 'live',
        note:
          'Gets the partnership reply, which names the four things the word means here and asks ' +
          'which is closest, rather than guessing and answering a question they did not ask.',
      },
      {
        door: 'Partnership or capital enquiry, from the partner form',
        handler: 'api/partnership/route.ts',
        tags: ['role:partner', 'act-inquiry'],
        state: 'live',
        note:
          'The capital path branches away to GOODS - Funding, because somebody asking about a ' +
          'ticket size is a funder. Everything else lands on the relationship board. The same ' +
          'subject decides the board and the reply, so the card and the email cannot disagree ' +
          'about what this person is.',
      },
      {
        door: 'Put up an idea, at /community/ideas/new',
        handler: 'api/community/ideas/route.ts',
        tags: ['role:community', 'lane:community'],
        state: 'live',
        note:
          'Found silent on 17 September: it wrote the row and told nobody, and the only process ' +
          'was a line in the operations guide saying to review ideas weekly. It raises a task now. ' +
          'Nobody has used it yet: 0 rows.',
      },
      {
        door: 'Something is wrong with my bed, at /support',
        handler: 'api/support/route.ts',
        tags: ['role:community', 'interest:support', 'lane:community', 'act-inquiry'],
        state: 'live',
        note:
          'Sends its own reply, naming the asset, with the phone first when the ticket is urgent. ' +
          'It deliberately no longer carries project-goods, so the generic acknowledgement does ' +
          'not also fire: two emails about one broken bed, the second contradicting the first. ' +
          'Branch on interest: BEFORE role:. Support and community interest both produce ' +
          'role:community, so a role-first branch sends a broken bed the same letter as a ' +
          'community putting its hand up.',
      },
      {
        door: 'Tell the story of this bed',
        handler: 'api/bed/[id]/story/route.ts',
        tags: ['role:storyteller', 'lane:community'],
        state: 'live',
        note:
          'No automatic acknowledgement on purpose: "someone will get back to you" is the wrong thing to say to a person who just told you something. A human replies, and the inbox email is what makes that possible.',
      },
      {
        door: 'Scan the QR on the bed, at /claim/[asset_id]',
        handler: 'api/claim/[asset_id]/route.ts',
        tags: ['role:community', 'lane:community'],
        state: 'built-off',
        note:
          'The door that fits the place: scan, phone number, no email, no app. It creates the contact and raises no task, unlike requests and messages. Nobody has ever used it.',
      },
      {
        door: 'A message or a parts request, in /my-items or /portal',
        handler: 'api/user/requests/route.ts',
        tags: ['role:community', 'lane:community'],
        state: 'live',
        note: 'Raises a GHL task against a named person with a 24 hour clock. 0 messages and 0 requests so far.',
      },
    ],
    steps: [
      {
        id: 'community-invitation',
        name: 'Invitation',
        where: 'GOODS - Community, stage Invitation',
        theyGet: 'A reply that puts the decision with them, and a call inside two business days.',
        messageClass: 'answer',
        advance: 'The community says what it wants, and who is paid to do it.',
        state: 'live',
        gap:
          'The call is the promise, and it is Ben\u2019s to keep. Nothing in the system tracks whether ' +
          'it happened: no task, no clock, no list of who is still waiting to be rung.',
      },
      {
        id: 'community-holding',
        name: 'Holding something',
        where: 'The asset register, and the promise ledger that does not exist yet',
        theyGet:
          'A reply that names their bed and says what happens next, then service messages about the thing they hold: the part is on the truck, here are the plans you asked for. Refusable per object.',
        messageClass: 'service',
        advance: 'They ask for something, or a check-in finds a problem.',
        state: 'built-off',
        gap:
          'The channel exists and has never been used: 0 claimed assets, 0 messages, 0 requests, 7 profiles against 86 lane:community contacts. Nobody has been walked through the QR.',
      },
      {
        id: 'community-seller',
        name: 'Becoming the seller',
        where: 'GOODS - Community, human paced',
        theyGet: 'Stock they own, and a buyer of their own.',
        messageClass: 'service',
        advance: 'They answer a buyer with a price, a lead time, an invoice and a delivery.',
        state: 'missing',
        gap:
          'Nothing anywhere covers helping a community organisation answer a buyer. That is the step between holding stock and being a supplier, and no tooling in either repo touches it. It is also the only route that passes an Indigenous procurement instrument.',
      },
      {
        id: 'community-promises',
        name: 'Promises kept',
        where: 'The Community record, visible to the community',
        theyGet: 'What we said we would do, by when, and whether we did it.',
        messageClass: 'service',
        advance: 'Nothing. This is the list Goods should be judged against.',
        state: 'missing',
        gap:
          'The promise ledger is the first thing lost between sessions and staff. It needs the Community custom object, which needs the other three projects to agree the two object slots first.',
      },
    ],
    readiness: 'partial',
    nextMove:
      'The claim flow is the last community inbound that tells nobody: api/claim/[asset_id] creates the contact and stops, while requests and messages both raise a task with a clock. Same three lines. Then walk one community through the QR on a bed they already have, and watch where it breaks before doing it anywhere else.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    audience: 'recycler',
    name: 'Recyclers',
    whoTheyAre:
      'Whoever holds the waste and resource recovery contract in the places Goods already works. The feedstock end of the loop.',
    owner: 'ben',
    clock: null,
    segmentIds: [],
    smartListIds: [],
    board: null,
    communityLine: false,
    entries: [],
    steps: [
      {
        id: 'recycler-who',
        name: 'Find who holds the contract',
        where: 'Nowhere yet',
        theyGet: 'Nothing.',
        messageClass: 'none',
        advance: 'A named output per place: who holds the waste contract in each community Goods is in.',
        state: 'missing',
        gap:
          'est_plastic_waste_tpa is null in all 1,543 rows of goods_communities. This is the one dimension asked for that the data cannot answer.',
      },
      {
        id: 'recycler-approach',
        name: 'Approach',
        where: 'Nowhere yet',
        theyGet: 'Nothing.',
        messageClass: 'none',
        advance: 'A conversation about what happens to the HDPE today.',
        state: 'missing',
        gap: 'No door, no list, no contact carries a recycler role.',
      },
      {
        id: 'recycler-feedstock',
        name: 'Feedstock agreed',
        where: 'Nowhere yet',
        theyGet: 'A use for waste they are currently paying to bury.',
        messageClass: 'none',
        advance: '20kg of HDPE per bed, sourced in the place the bed is going.',
        state: 'missing',
        gap: 'Nothing here is built. This lane is research until there is something true to say.',
      },
    ],
    readiness: 'not-started',
    nextMove:
      'One named output per place, starting with the four we are already in. Building the door before the data would repeat the mistake of goods_procurement_entities, 4,551 proximity-matched rows that put a Newcastle youth arts co-op in the pipeline.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    audience: 'supplier',
    name: 'Suppliers',
    whoTheyAre:
      'Component and plant suppliers: HDPE, steel, canvas, fasteners, heat press, shredder. 36 contacts carry role:supplier.',
    owner: 'nic',
    clock: null,
    segmentIds: ['supplier', 'vendor'],
    smartListIds: [],
    board: null,
    communityLine: false,
    entries: [
      {
        door: 'We approach them. There is no website door and there does not need to be.',
        handler: null,
        tags: ['role:supplier'],
        state: 'manual',
      },
    ],
    steps: [
      {
        id: 'supplier-quoted',
        name: 'Quoted',
        where: 'supplier-quotes.ts, price, MOQ and lead time per line',
        theyGet: 'A request for a price on a known quantity.',
        messageClass: 'answer',
        advance: 'The quote lands in the bill of materials.',
        state: 'manual',
        gap: 'Quotes are chased one at a time. Nothing tells anybody when a quoted price is old enough to be wrong.',
      },
      {
        id: 'supplier-forecast',
        name: 'Forecast',
        where: 'Nowhere',
        theyGet: 'Nothing.',
        messageClass: 'none',
        advance: 'A volume forecast is what earns volume pricing, and none has been sent.',
        state: 'missing',
        gap:
          '36 suppliers, no forecast, no cadence. The supply-partner brief exists as a report template and nothing sends it.',
      },
      {
        id: 'supplier-vendors',
        name: 'Service vendors',
        where: 'role:vendor',
        theyGet: 'Nothing.',
        messageClass: 'none',
        advance: 'Somebody tags a vendor.',
        state: 'missing',
        gap:
          'role:vendor is on 0 contacts, and the flat goods-vendor it replaced was also on 0. Nothing has ever tagged a freight, print, tooling or IoT vendor, so the audience cannot be anything but empty.',
      },
    ],
    readiness: 'partial',
    nextMove:
      'Run the supplier and vendor sweep so role:vendor stops being empty, then send the volume forecast. It is the cheapest thing on this list that moves a real cost.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    audience: 'media',
    name: 'Media',
    whoTheyAre: 'Journalists and outlets who have asked for the media pack or covered Goods.',
    owner: 'ben',
    clock: 'Same day. A journalist has a deadline and no patience for two business days.',
    segmentIds: ['media'],
    smartListIds: [],
    board: null,
    communityLine: false,
    entries: [
      {
        door: 'Media pack request, at /press',
        handler: 'api/contact/route.ts',
        subject: 'Media Pack Request',
        tags: ['role:media', 'interest:media-pack', 'act-inquiry'],
        state: 'built-off',
        note:
          'The contact and the tags are right. The Goods media form submission workflow sends the journalist nothing, and it triggers on Contact Created, so a journalist already in the account never fires it at all.',
      },
    ],
    steps: [
      {
        id: 'media-asked',
        name: 'Asked for the pack',
        where: 'role:media, no board',
        theyGet: 'The pack, in the first two lines, with the consent line on the photographs.',
        messageClass: 'answer',
        advance: 'They ask for a person in a place, and that is the community decision, not ours.',
        state: 'live',
      },
      {
        id: 'media-pitched',
        name: 'Pitched a story',
        where: 'By hand',
        theyGet: 'A person, a place and an object, not an announcement.',
        messageClass: 'broadcast',
        advance: 'They take it, or they keep the contact for later.',
        state: 'manual',
        gap: 'No media list has ever been sent anything. 20 is the soft cap for a reason: this is a pitch, not a blast.',
      },
      {
        id: 'media-covered',
        name: 'Covered',
        where: '/press, the coverage list',
        theyGet: 'The next story before anyone else gets it.',
        messageClass: 'broadcast',
        advance: 'Nothing today.',
        state: 'missing',
        gap: 'Coverage is recorded on the public page and not tied back to the journalist who wrote it.',
      },
    ],
    readiness: 'partial',
    nextMove:
      'Fix or rename the media workflow. A journalist who asks for the pack currently receives nothing, and the trigger means a known journalist never fires it twice.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    audience: 'supporter',
    name: 'Supporters',
    whoTheyAre:
      'The 164 people who ticked the consent box for the newsletter, some of them up to nine months ago, none of whom has ever heard from Goods.',
    owner: 'ben',
    clock: null,
    segmentIds: ['supporter'],
    smartListIds: [],
    board: null,
    communityLine: false,
    entries: [
      {
        door: 'Site feedback, from the widget',
        handler: 'api/feedback/route.ts',
        tags: ['role:supporter', 'interest:feedback', 'act-inquiry', 'project-goods'],
        state: 'live',
        note:
          'Threads into Conversations rather than the team inbox, and stamps the acknowledgement ' +
          'tag, so the person does get a reply. Three have arrived.',
      },
      {
        door: 'Newsletter sign up',
        handler: 'api/newsletter/route.ts',
        tags: ['comms:goods-newsletter', 'role:supporter', 'project:act-gd'],
        state: 'live',
        note:
          'comms:goods-newsletter is the ONLY send-trigger tag and it is minted in one place, behind explicit consent. No acknowledgement on purpose: a subscriber is not waiting on a reply.',
      },
    ],
    steps: [
      {
        id: 'supporter-consented',
        name: 'Consented',
        where: 'comms:goods-newsletter, 164 contacts',
        theyGet: 'Nothing, by ruling.',
        messageClass: 'none',
        advance: 'Something worth sending.',
        state: 'live',
        gap: 'Ben ruled on 17 September 2026 that nothing goes to this list until there is something worth sending. The hold is the decision, not a gap in the build.',
      },
      {
        id: 'supporter-first-send',
        name: 'The first send',
        where: 'A warmed dedicated sending domain',
        theyGet: 'A re-introduction, with an easy way out.',
        messageClass: 'broadcast',
        advance: 'They stay, or they leave cleanly.',
        state: 'missing',
        gap:
          'send.goodsoncountry.com does not exist yet. goodsoncountry.com itself is locked with v=spf1 -all and p=reject and cannot send, and GHL sends from ghl.act.place. Sending a cold 164 from a cold domain is how you start in spam and stay there.',
      },
      {
        id: 'supporter-ongoing',
        name: 'Ongoing',
        where: 'The newsletter',
        theyGet: 'One face, one voice, one place. Warm, story first.',
        messageClass: 'broadcast',
        advance: 'They give, they buy a bed, or they tell somebody.',
        state: 'missing',
        gap: 'No cadence, no calendar, no second issue planned. The ledger-story skill drafts the unit this is built from.',
      },
    ],
    readiness: 'not-started',
    nextMove:
      'Set up and warm send.goodsoncountry.com in the background so it is ready the day there is something worth sending. The domain work is not the send, and it takes weeks.',
  },
];

// ============================================================================
// Reading it
// ============================================================================

export function pathwayFor(audience: PathwayAudience): AudiencePathway {
  const found = AUDIENCE_PATHWAYS.find((p) => p.audience === audience);
  if (!found) throw new Error(`No pathway for audience ${audience}`);
  return found;
}

/** Every step with something missing, newest lane first. The work list. */
export function pathwayGaps(): { audience: PathwayAudience; step: PathwayStep }[] {
  return AUDIENCE_PATHWAYS.flatMap((p) =>
    p.steps.filter((s) => s.state !== 'live' && s.gap).map((step) => ({ audience: p.audience, step })),
  );
}

/** Lanes with nobody on the hook. Should always be empty. */
export function unownedPathways(): AudiencePathway[] {
  return AUDIENCE_PATHWAYS.filter((p) => p.owner === 'unassigned');
}

/** The segment ids every lane claims, for the guard that checks the set is complete. */
export function claimedSegmentIds(): string[] {
  return AUDIENCE_PATHWAYS.flatMap((p) => p.segmentIds);
}

export function claimedSmartListIds(): string[] {
  return AUDIENCE_PATHWAYS.flatMap((p) => p.smartListIds);
}

/** Known audience and smart-list ids, so the guard reads the live definitions rather than a copy. */
export const ALL_SEGMENT_IDS = AUDIENCE_SEGMENTS.map((s) => s.id);
export const ALL_SMART_LIST_IDS = SMART_LISTS.map((l) => l.id);

/** The routed contact-form subjects, so a door cannot exist with no lane. */
export const ROUTED_SUBJECTS = Object.keys(INQUIRY_ROUTES) as RoutableSubject[];

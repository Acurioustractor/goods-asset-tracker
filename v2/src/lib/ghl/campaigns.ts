/**
 * The campaigns that hang off the eight lanes.
 *
 * A pathway step says what moves a person to the next stage. A campaign is the thing that does
 * the moving: the trigger it fires on, who it reaches, what it says, and whether it is switched
 * on. One file, so that "build a comms piece" is filling in a record rather than remembering a
 * dashboard.
 *
 * ── The constraint that shapes every broadcast in here ───────────────────────
 * The tag contract's golden rule is that an identity tag never triggers a send, and only `comms:`
 * does. `MINTED_COMMS_TAGS` is the complete list of send-triggers this codebase can produce and
 * it has exactly one entry: `comms:goods-newsletter`, held by Ben's 17 September ruling.
 *
 * So today there is no tag that can carry a message to the 99 funders, the 84 buyers or the 36
 * suppliers as a group. Not a missing feature: a consent decision nobody has made. Either those
 * people opt in through a path that mints a new `comms:` tag, or a person writes to them one at
 * a time. Every broadcast below is `not-built` for that reason and says so, and the guard stops
 * one being marked live against a tag nothing mints.
 *
 * ── Four kinds, and the reason the fourth exists ─────────────────────────────
 * `reply` and `service` are owed to somebody who acted. `broadcast` is us deciding to tell a
 * group something, and it is off on the community line (R9). `outreach` is a named person writing
 * to a named person, tracked here so the lane is not empty but never automated. `inward` is the
 * automation that nags Goods: the task with a clock, the reminder that a place has not been rung
 * in six weeks. On the community line, inward is the only kind the machine may run.
 */

import { AUDIENCE_PATHWAYS, OWNERS, type OwnerId, type PathwayAudience } from './audience-pathways';
import { MINTED_COMMS_TAGS } from './canonical-tags';

export type CampaignKind = 'reply' | 'service' | 'broadcast' | 'outreach' | 'inward';

/** Who receives it. `goods` means the automation points inward and nobody outside hears it. */
export type Recipient = 'the person' | 'goods';

/**
 * GHL owns every send (Ben, 17 September). `person` means a human writes it themselves. There is
 * deliberately no app-side channel: the Resend follow-up cron was removed so the path could not be
 * quietly rebuilt.
 */
export type CampaignChannel = 'ghl-email' | 'ghl-sms' | 'ghl-task' | 'person';

export type CampaignStatus =
  /** Published in GHL and firing. */
  | 'live'
  /** The GHL object exists and is switched off. */
  | 'built-off'
  /** The copy is written and nothing is built. */
  | 'drafted'
  /** Nothing exists. */
  | 'not-built';

export interface Campaign {
  id: string;
  name: string;
  /** The lane. Must be one of the eight. */
  audience: PathwayAudience;
  /** The pathway step it moves someone off. Must exist on that lane. */
  stepId: string;
  kind: CampaignKind;
  recipient: Recipient;
  channel: CampaignChannel;
  /** What fires it, in the words of the dashboard that would run it. */
  trigger: string;
  /** The audience segment it reaches, when it reaches a group. Must be claimed by that lane. */
  segmentId?: string;
  /** The `comms:` enrolment tag a broadcast fires on. Required for broadcast. */
  sendTrigger?: string;
  /** Why we are allowed to send this. Required for anything the person receives. */
  consentBasis?: string;
  cadence: string;
  owner: OwnerId;
  status: CampaignStatus;
  /** What it says, in enough detail to write it from. Not the copy itself. */
  brief: string;
  /** What has to happen before it can go live. Required when status is not live. */
  blockedOn?: string;
}

export const CAMPAIGNS: Campaign[] = [
  // ── Buyer ─────────────────────────────────────────────────────────────────
  {
    id: 'buyer-acknowledge',
    name: 'Ordering beds: the reply that starts the quote',
    audience: 'buyer',
    stepId: 'buyer-enquiry',
    kind: 'reply',
    recipient: 'the person',
    channel: 'ghl-email',
    trigger: 'Contact tag added project-goods, branch 2 of Goods Inquiry to Acknowledge: interest:bulk-order',
    consentBasis: 'They wrote to us. A reply is owed.',
    cadence: 'Once, within a minute of the form.',
    owner: 'ben',
    status: 'drafted',
    brief:
      'Answers the four things a buyer asks before they can act: price per bed, lead time, freight to their place, and who invoices. Then asks for the three numbers that unblock a quote: how many beds, which community, and when they need them. Signed by Ben, replies to hi@act.place, two business days.',
    blockedOn:
      'Written in the 17 September branch note and not built in GHL. Roll it out with the support branch first and watch a week of real enquiries before adding the other five.',
  },
  {
    id: 'buyer-order-confirmation',
    name: 'Somebody paid: tell them what happens now',
    audience: 'buyer',
    stepId: 'buyer-ordered',
    kind: 'reply',
    recipient: 'the person',
    channel: 'ghl-email',
    trigger: 'Stripe payment, then the confirmation is built and sent from the webhook',
    consentBasis: 'They bought something. This is about their order.',
    cadence: 'Once per order.',
    owner: 'ben',
    status: 'live',
    brief:
      'What they bought, what the bed is made of, that tracking follows when it ships, and the QR on the bed. A sponsor gets a different one: where the bed is going, their dedication read back, and the QR link when it lands. Sent from code through GHL Conversations rather than a workflow, because the GHL API cannot publish a workflow and New Order Notification sat as a draft from February while people paid. The copy is in lib/comms/order-confirmation.ts and guarded.',
  },
  {
    id: 'buyer-reorder',
    name: 'Ask the four buyers again',
    audience: 'buyer',
    stepId: 'buyer-repeat',
    kind: 'broadcast',
    recipient: 'the person',
    channel: 'ghl-email',
    trigger: 'Twelve months after delivery, or when the register shows a place at capacity',
    segmentId: 'buyer',
    sendTrigger: 'comms:goods-buyer-update',
    consentBasis: 'None today. See blockedOn.',
    cadence: 'Annual, per buyer, on the anniversary of their delivery.',
    owner: 'ben',
    status: 'not-built',
    brief:
      'What their last order did, in beds and in the place: how many are still in use, what the register says. Then the question: same again, or more this time. 320 beds went to four buyers and none of them has ever been asked a second time by anything but a person remembering.',
    blockedOn:
      'comms:goods-buyer-update does not exist and nothing mints it. role:buyer is an identity tag and never triggers a send. Either buyers opt in through a consent path, or Ben sends four emails by hand, which for four buyers is the right answer.',
  },

  // ── Procurement ───────────────────────────────────────────────────────────
  {
    id: 'procurement-approach',
    name: 'The four doors, one letter each',
    audience: 'procurement',
    stepId: 'procurement-door',
    kind: 'outreach',
    recipient: 'the person',
    channel: 'person',
    trigger: 'Ben writes it. There is no automation here and there should not be.',
    consentBasis: 'A named person writing to a public officer about their own rule.',
    cadence: 'Four letters, once.',
    owner: 'ben',
    status: 'not-built',
    brief:
      'One letter each to Tom Harris, John Chapman OAM, Morrgul and the Industry Capability Network. The argument is in the government’s own record: $817,871,353 across 1,394 NT housing contracts, nine of them mention furniture, and not one buys a bed for a remote house. The ask differs per door, and the WA one is a question about the board test, not a pitch.',
    blockedOn: 'None of the four has been approached. This is a writing task, not a build task.',
  },

  // ── Funder ────────────────────────────────────────────────────────────────
  {
    id: 'funder-acknowledge',
    name: 'Funding a facility: the reply',
    audience: 'funder',
    stepId: 'funder-identified',
    kind: 'reply',
    recipient: 'the person',
    channel: 'ghl-email',
    trigger: 'Contact tag added project-goods, branch 3: interest:capital',
    consentBasis: 'They wrote to us.',
    cadence: 'Once, within a minute.',
    owner: 'ben',
    status: 'drafted',
    brief:
      'What a facility is and is not, what their money would buy, and the one question back: who else should be on the call. Written in the 17 September branch note.',
    blockedOn: 'Branch 3 not built in GHL. Third in the rollout order, after support and bulk order.',
  },
  {
    id: 'funder-unsubscribe-alarm',
    name: 'A funder just unsubscribed, and nobody knows',
    audience: 'funder',
    stepId: 'funder-identified',
    kind: 'inward',
    recipient: 'goods',
    channel: 'ghl-task',
    trigger: 'Contact with role:funder sets Do Not Contact or unsubscribes',
    cadence: 'Per event.',
    owner: 'ben',
    status: 'not-built',
    brief:
      'Raise a task on Ben the moment a funder opts out, with the email that preceded it. The generic acknowledgement carries an unsubscribe link, so a funder who clicks it stops receiving Goods email entirely and the only trace is a suppression flag nobody opens.',
    blockedOn: 'Nothing watches the suppression state. One workflow, one task, no email to anybody outside.',
  },
  {
    id: 'funder-stewardship',
    name: 'The quarterly note: what the money bought',
    audience: 'funder',
    stepId: 'funder-stewarded',
    kind: 'broadcast',
    recipient: 'the person',
    channel: 'ghl-email',
    trigger: 'Quarterly, to funders at Committed and beyond',
    segmentId: 'funder-active',
    sendTrigger: 'comms:goods-funder-update',
    consentBasis: 'None today. See blockedOn.',
    cadence: 'Quarterly, then a renewal ask on the anniversary.',
    owner: 'ben',
    status: 'not-built',
    brief:
      'One place, one number, one voice. What their money turned into: beds made, where they went, who is making them. The funder-impact report template is the body; this is the covering note that makes somebody read it. Never a graduation story: philanthropy here is the capital that bought the option.',
    blockedOn:
      'Two things. comms:goods-funder-update does not exist, and nothing produces the quarterly note yet. The 99 funders are on no list at all, so the first one can be sent by hand to the committed few while the enrolment path is built.',
  },

  // ── Community ─────────────────────────────────────────────────────────────
  {
    id: 'community-inbound-task',
    name: 'Somebody wrote in: put it in front of a human',
    audience: 'community',
    stepId: 'community-invitation',
    kind: 'inward',
    recipient: 'goods',
    channel: 'ghl-task',
    trigger: 'A portal message or a parts request, through ghl.raiseCommunityInbound',
    cadence: 'Per inbound, 24 hour clock.',
    owner: 'ben',
    status: 'live',
    brief:
      'The automation that points inward. It nags Goods, never the community. This is the one part of the community side that is switched on.',
  },
  {
    id: 'support-acknowledge',
    name: 'Something is broken: the reply that offers the phone',
    audience: 'community',
    stepId: 'community-holding',
    kind: 'service',
    recipient: 'the person',
    channel: 'ghl-email',
    trigger: 'A support ticket with an email address, sent from the route itself',
    consentBasis: 'They reported a fault on a thing they hold.',
    cadence: 'Once, immediately.',
    owner: 'ben',
    status: 'live',
    brief:
      'Names the asset and what the register says it is, then what happens next and the two business day commitment. An urgent ticket gets the phone first, 0422 883 943, because a bed that is not safe to sleep on is not a two-day problem. The route no longer stamps project-goods, so the generic acknowledgement does not also fire. Copy in lib/comms/support-reply.ts, guarded.',
  },
  {
    id: 'community-acknowledge',
    name: 'Bring this to my community: the reply',
    audience: 'community',
    stepId: 'community-invitation',
    kind: 'reply',
    recipient: 'the person',
    channel: 'ghl-email',
    trigger: 'Contact tag added project-goods, branch 4: interest:community',
    consentBasis: 'They wrote to us.',
    cadence: 'Once.',
    owner: 'ben',
    status: 'drafted',
    brief:
      'Names the person who will ring, says nothing gets made until the community decides what it wants and who is paid, and asks what is already happening there. Never promises a facility.',
    blockedOn: 'Branch 4 not built in GHL.',
  },
  {
    id: 'community-relationship-nag',
    name: 'The weekly list: who has not been rung',
    audience: 'community',
    stepId: 'community-promises',
    kind: 'inward',
    recipient: 'goods',
    channel: 'ghl-task',
    trigger: 'Weekly, per relationship holder',
    cadence: 'Weekly.',
    owner: 'ben',
    status: 'not-built',
    brief:
      'One relationship holder per community, their list in front of them each week: who has not been contacted in six weeks, what was promised and by when, what is still open. The list Goods should be judged against, pointed at Goods.',
    blockedOn:
      'Needs the promise ledger, which needs the Community custom object, which needs the other three ACT projects to agree the two object slots. The draft note to them is written and not sent.',
  },

  // ── Recycler ──────────────────────────────────────────────────────────────
  {
    id: 'recycler-research',
    name: 'Find who holds the waste contract',
    audience: 'recycler',
    stepId: 'recycler-who',
    kind: 'outreach',
    recipient: 'the person',
    channel: 'person',
    trigger: 'Nothing. This is a research task before it is a comms task.',
    consentBasis: 'One named person writing to one organisation about their own contract. Not a list send.',
    cadence: 'Once per place.',
    owner: 'ben',
    status: 'not-built',
    brief:
      'Four places first, the ones Goods is already in. Who holds the waste and resource recovery contract, what happens to HDPE there now, and what it costs them. A named output per place, then a conversation.',
    blockedOn:
      'est_plastic_waste_tpa is null in all 1,543 rows. There is nothing to say to a recycler yet and no list to say it to.',
  },

  // ── Supplier ──────────────────────────────────────────────────────────────
  {
    id: 'supplier-forecast',
    name: 'The volume forecast',
    audience: 'supplier',
    stepId: 'supplier-forecast',
    kind: 'broadcast',
    recipient: 'the person',
    channel: 'ghl-email',
    trigger: 'Twice a year, against the production plan',
    segmentId: 'supplier',
    sendTrigger: 'comms:goods-supplier-forecast',
    consentBasis: 'None today. See blockedOn.',
    cadence: 'Half-yearly.',
    owner: 'nic',
    status: 'not-built',
    brief:
      'What Goods expects to buy in the next six months, per line: HDPE, steel, canvas, fasteners. A forecast is what earns volume pricing, and a supplier who can see the run is a supplier who holds stock for it.',
    blockedOn:
      'comms:goods-supplier-forecast does not exist. With 36 suppliers this is small enough to send by hand, and doing it once by hand is how you find out whether it is worth automating.',
  },

  // ── Media ─────────────────────────────────────────────────────────────────
  {
    id: 'media-pack-reply',
    name: 'They asked for the pack: send the pack',
    audience: 'media',
    stepId: 'media-asked',
    kind: 'reply',
    recipient: 'the person',
    channel: 'ghl-email',
    trigger: 'Contact tag added project-goods, branch 5: role:media',
    consentBasis: 'They asked for it.',
    cadence: 'Once, immediately.',
    owner: 'ben',
    status: 'built-off',
    brief:
      'Breaks the two-day pattern the other way: what they asked for is a link, so the link goes straight back. goodsoncountry.com/press, the phone number, and an offer of a person in a place to talk to.',
    blockedOn:
      'The Goods media form submission workflow exists and sends the journalist nothing. It also triggers on Contact Created, so a journalist already in the account never fires it. Fix it or rename it, but do not leave it looking like it works.',
  },
  {
    id: 'media-pitch',
    name: 'Pitch one story to one journalist',
    audience: 'media',
    stepId: 'media-pitched',
    kind: 'outreach',
    recipient: 'the person',
    channel: 'person',
    trigger: 'A story exists: a person, a place and an object.',
    consentBasis: 'A pitch to a named journalist who covers this round. One at a time, never a list.',
    cadence: 'When there is something true to say.',
    owner: 'ben',
    status: 'not-built',
    brief:
      'Never an announcement. One person, one place, one object, and what changed. The soft cap on the media audience is 20 for a reason: this is a pitch to a named journalist, not a list send.',
    blockedOn: 'No list has ever been sent anything. Start with the journalists who have already covered Goods.',
  },

  // ── Supporter ─────────────────────────────────────────────────────────────
  {
    id: 'supporter-reintroduction',
    name: 'Newsletter one: the re-introduction',
    audience: 'supporter',
    stepId: 'supporter-first-send',
    kind: 'broadcast',
    recipient: 'the person',
    channel: 'ghl-email',
    trigger: 'Once, when there is something worth sending',
    segmentId: 'supporter',
    sendTrigger: 'comms:goods-newsletter',
    consentBasis: 'Explicit newsletter consent, captured at sign-up. The only enrolment this codebase mints.',
    cadence: 'Once, then monthly.',
    owner: 'ben',
    status: 'not-built',
    brief:
      'These 164 people said yes up to nine months ago and have never heard from Goods. Say that plainly, say what happened since, and make leaving easy and obvious. One face, one voice, one place. No dollar figures.',
    blockedOn:
      'Two things, in order. Ben ruled the list waits until there is something worth sending. And send.goodsoncountry.com does not exist: goodsoncountry.com is locked v=spf1 -all with p=reject and cannot send, GHL sends from ghl.act.place, and a cold 164 from a cold domain starts in spam and stays there. The domain takes weeks and can be warmed while the story is found.',
  },
  {
    id: 'supporter-newsletter',
    name: 'The monthly ledger post',
    audience: 'supporter',
    stepId: 'supporter-ongoing',
    kind: 'broadcast',
    recipient: 'the person',
    channel: 'ghl-email',
    trigger: 'Monthly, from the ledger-story unit',
    segmentId: 'supporter',
    sendTrigger: 'comms:goods-newsletter',
    consentBasis: 'Same enrolment as the re-introduction.',
    cadence: 'Monthly.',
    owner: 'ben',
    status: 'not-built',
    brief:
      'One face, one voice, one place, drafted from the ledger-story skill and grounded before it goes. The story comes from Empathy Ledger and the consent tier decides whether it can be used at all.',
    blockedOn: 'Nothing sends until the re-introduction has gone and the domain is warm.',
  },
];

// ============================================================================
// Reading it
// ============================================================================

export function campaignsFor(audience: PathwayAudience): Campaign[] {
  return CAMPAIGNS.filter((c) => c.audience === audience);
}

/** What could be switched on now, with no dependency: drafted or built and off. */
export function readyToSwitchOn(): Campaign[] {
  return CAMPAIGNS.filter((c) => c.status === 'drafted' || c.status === 'built-off');
}

/** Broadcasts waiting on a consent enrolment that nothing mints. */
export function blockedOnConsent(): Campaign[] {
  return CAMPAIGNS.filter(
    (c) => c.kind === 'broadcast' && c.sendTrigger && !MINTED_COMMS_TAGS.includes(c.sendTrigger),
  );
}

export function ownerOf(campaign: Campaign): string {
  return OWNERS[campaign.owner].name;
}

/** Every step id that exists, for the guard that checks a campaign attaches to a real one. */
export function knownStepIds(): Set<string> {
  return new Set(AUDIENCE_PATHWAYS.flatMap((p) => p.steps.map((s) => s.id)));
}

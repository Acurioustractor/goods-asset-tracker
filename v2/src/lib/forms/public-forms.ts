/**
 * Every form a member of the public can fill in, and what happens when they do.
 *
 * ── Why a registry rather than a list in a test ──────────────────────────────
 * Two guards already checked entry points, and both kept their own hand-written
 * list of files. That is the same shape as the admin sidebar array that let fifteen
 * routes go unreachable: the list cannot know about a form nobody added to it. On
 * 17 September a sweep of every `<form>` in the app found `/community/ideas/new`,
 * live and linked from the public community page, writing a row that told nobody
 * and appearing in neither guard.
 *
 * So the guard beside this file does not read a list. It reads the filesystem: any
 * file outside the internal surfaces that renders a form and posts to `/api/` must
 * appear here with two answers. What does the person get, and how does a human find
 * out. A form that answers "nothing" to both cannot ship.
 *
 * ── The two answers ─────────────────────────────────────────────────────────
 * `theyGet` is the promise to the person. `acknowledgement` means the route stamps
 * `project-goods` and the published GHL workflow replies. `a human reply` means we
 * deliberately do not automate it, which on the community line is often the right
 * call. `nothing` needs a reason and is never allowed alongside a silent `goodsHears`.
 *
 * `goodsHears` is how the message reaches a person here: the durable inbox email,
 * a GHL task with a clock, or the Conversations thread.
 */

import type { PathwayAudience } from '@/lib/ghl/audience-pathways';

export type TheyGet =
  /** The published GHL workflow replies, one generic message for every door. */
  | 'acknowledgement'
  /** This route sends its own message, written for this lane and tested. */
  | 'its own reply'
  /** Deliberately no automation: a person writes back. */
  | 'a human reply'
  | 'nothing';
export type GoodsHears =
  /** The durable outbox emails hi@act.place. */
  | 'inbox email'
  /** A GHL task with a clock, against a named person. */
  | 'ghl task'
  /** The message threads into the contact's Conversations inbox. */
  | 'ghl conversation'
  /** A GitHub issue, which is where site feedback goes. */
  | 'github issue'
  | 'nothing';

export interface PublicForm {
  /** The file that renders it, relative to v2/src. */
  file: string;
  /** What a person would call it. */
  name: string;
  /** The API route that receives it, relative to v2/src/app. */
  handler: string;
  /** The lane it belongs to, so a form cannot exist outside the pathways. */
  audience: PathwayAudience;
  /**
   * The contact-form subject this form always posts, when it posts exactly one. It is what lets
   * the guard check a form against its actual branch rather than against the whole route.
   */
  subject?: string;
  theyGet: TheyGet;
  goodsHears: GoodsHears;
  /** Required whenever either answer is 'nothing'. */
  why?: string;
}

export const PUBLIC_FORMS: PublicForm[] = [
  {
    file: 'app/contact/page.tsx',
    name: 'Contact form',
    handler: 'api/contact/route.ts',
    audience: 'buyer',
    theyGet: 'acknowledgement',
    goodsHears: 'inbox email',
    why:
      'Every subject falls through to the generic acknowledgement except Bulk Order Inquiry, which gets its own reply asking for the three numbers that unblock a quote. The other five branches are written and not switched on yet: support and bulk order go first, then a week of real enquiries, then the rest.',
  },
  {
    file: 'components/contact/contact-goods-button.tsx',
    name: 'Contact Goods button, on the pitch and the doors',
    handler: 'api/contact/route.ts',
    audience: 'buyer',
    theyGet: 'acknowledgement',
    goodsHears: 'inbox email',
    why:
      'Every subject falls through to the generic acknowledgement except Bulk Order Inquiry, which gets its own reply asking for the three numbers that unblock a quote. The other five branches are written and not switched on yet: support and bulk order go first, then a week of real enquiries, then the rest.',
  },
  {
    file: 'components/contact/enquiry-form.tsx',
    name: 'Enquiry form',
    handler: 'api/contact/route.ts',
    audience: 'buyer',
    theyGet: 'acknowledgement',
    goodsHears: 'inbox email',
    why:
      'Every subject falls through to the generic acknowledgement except Bulk Order Inquiry, which gets its own reply asking for the three numbers that unblock a quote. The other five branches are written and not switched on yet: support and bulk order go first, then a week of real enquiries, then the rest.',
  },
  {
    file: 'app/press/_components/press-contact-form.tsx',
    name: 'Media pack request',
    handler: 'api/contact/route.ts',
    audience: 'media',
    subject: 'Media Pack Request',
    theyGet: 'its own reply',
    goodsHears: 'inbox email',
    why:
      'Sends the pack itself, with the line about which photographs are cleared. No two day ' +
      'promise: what they asked for is in the email. The GHL media workflow stays a draft and ' +
      'can be deleted, and it would never have fired for a journalist already in the account ' +
      'because it triggers on Contact Created.',
  },
  {
    file: 'components/partnership-form.tsx',
    name: 'Partnership and capital enquiry',
    handler: 'api/partnership/route.ts',
    audience: 'community',
    theyGet: 'acknowledgement',
    goodsHears: 'inbox email',
  },
  {
    file: 'components/washer-interest-form.tsx',
    name: 'Washing machine, register interest',
    handler: 'api/partnership/route.ts',
    audience: 'buyer',
    theyGet: 'acknowledgement',
    goodsHears: 'inbox email',
  },
  {
    file: 'app/support/page.tsx',
    name: 'Something is wrong with my bed',
    handler: 'api/support/route.ts',
    audience: 'community',
    theyGet: 'its own reply',
    goodsHears: 'inbox email',
    why:
      'Names the asset, says what happens next, and leads with the phone when the ticket is ' +
      'urgent. It no longer stamps project-goods, so the generic acknowledgement does not also ' +
      'fire and tell them to wait two days.',
  },
  {
    file: 'app/bed/[id]/story-modal.tsx',
    name: 'Tell the story of this bed',
    handler: 'api/bed/[id]/story/route.ts',
    audience: 'community',
    theyGet: 'a human reply',
    goodsHears: 'inbox email',
    why:
      'No automatic acknowledgement on purpose. "Someone will get back to you" is the wrong thing ' +
      'to say to a person who has just told you something. A human replies.',
  },
  {
    file: 'components/feedback/feedback-widget.tsx',
    name: 'Site feedback',
    handler: 'api/feedback/route.ts',
    audience: 'supporter',
    theyGet: 'acknowledgement',
    goodsHears: 'github issue',
    why:
      'The content goes to a GitHub issue, and threads into Conversations as well when the person ' +
      'left an email. It used to answer 500 and lose the message when the GitHub token was ' +
      'missing; the row is written first now, so the feedback survives either way.',
  },
  {
    file: 'components/layout/newsletter-form.tsx',
    name: 'Newsletter, in the footer',
    handler: 'api/newsletter/route.ts',
    audience: 'supporter',
    theyGet: 'nothing',
    goodsHears: 'ghl conversation',
    why:
      'The consent gate works and the enrolment is recorded, and then nothing happens: both ' +
      'Newsletter Signup workflows in GHL are drafts. A person ticks the box, sees a success ' +
      'message and never hears from Goods. Ben holds the 164 deliberately, but the welcome is a ' +
      'different message from the newsletter and its absence is not deliberate.',
  },
  {
    file: 'components/newsletter-signup.tsx',
    name: 'Newsletter, inline',
    handler: 'api/newsletter/route.ts',
    audience: 'supporter',
    theyGet: 'nothing',
    goodsHears: 'ghl conversation',
    why: 'Same as the footer form: the welcome workflow is a draft.',
  },
  {
    file: 'app/canberra/follow-form.tsx',
    name: 'Follow along, Canberra',
    handler: 'api/newsletter/route.ts',
    audience: 'supporter',
    theyGet: 'nothing',
    goodsHears: 'ghl conversation',
    why: 'Same as the footer form: the welcome workflow is a draft.',
  },
  {
    file: 'app/sponsor/NewsletterCapture.tsx',
    name: 'Sponsor page capture',
    handler: 'api/newsletter/route.ts',
    audience: 'supporter',
    theyGet: 'nothing',
    goodsHears: 'ghl conversation',
    why: 'Same as the footer form: the welcome workflow is a draft.',
  },
  {
    file: 'components/stories/trip-story.tsx',
    name: 'Follow the trip stories',
    handler: 'api/newsletter/route.ts',
    audience: 'supporter',
    theyGet: 'nothing',
    goodsHears: 'ghl conversation',
    why: 'Same as the footer form: the welcome workflow is a draft.',
  },
  {
    file: 'app/community/ideas/new/page.tsx',
    name: 'Put up an idea',
    handler: 'api/community/ideas/route.ts',
    audience: 'community',
    theyGet: 'a human reply',
    goodsHears: 'ghl task',
    why:
      'Found silent on 17 September: it wrote a row and told nobody, and the only process was a ' +
      'line in the operations guide saying to review ideas weekly. It now raises a task. The ' +
      'person gets no automatic reply because they are on the community line.',
  },
];

export function formsForHandler(handler: string): PublicForm[] {
  return PUBLIC_FORMS.filter((f) => f.handler === handler);
}

export function silentForms(): PublicForm[] {
  return PUBLIC_FORMS.filter((f) => f.theyGet === 'nothing');
}

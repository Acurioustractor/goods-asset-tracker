import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Every public entry point puts the message in front of a human.
 *
 * Audited 17 September 2026. Of eight public entry points, one was complete.
 * A support ticket wrote a Supabase row, an alerts row and a GHL contact, and
 * then stopped: no tags, so the published acknowledgement never fired; no
 * conversation thread; no email to the team. A person reported a broken bed and
 * the only trace a human could see was a row in a table nobody opens.
 *
 * Nothing failed. There is no error when a route simply does not call a thing,
 * which is why this test reads source and asserts the calls are there.
 *
 * `project-goods` is the tag the live "Goods Inquiry → Acknowledge" workflow
 * triggers on. A route that stamps it gets the person an automatic reply.
 */

const API = path.join(__dirname, '../../app/api');

interface EntryPoint {
  route: string;
  /** Stamps the tags the acknowledgement workflow triggers on. */
  acknowledges: boolean;
  /** Emails the team inbox through the durable outbox. */
  inbox: boolean;
  /** Why, when something is deliberately off. */
  why?: string;
}

const ENTRY_POINTS: EntryPoint[] = [
  { route: 'contact/route.ts', acknowledges: true, inbox: true },
  { route: 'partnership/route.ts', acknowledges: true, inbox: true },
  {
    route: 'support/route.ts',
    acknowledges: false,
    inbox: true,
    why:
      'It sends its own reply instead. The generic acknowledgement says somebody will get back ' +
      'to you within a couple of business days, which is the wrong sentence for a bed that is ' +
      'not safe to sleep on tonight. Stamping project-goods as well would send two emails.',
  },
  {
    route: 'bed/[id]/story/route.ts',
    acknowledges: false,
    inbox: true,
    why:
      'A story submitter is on the community line and the generic acknowledgement ' +
      'copy ("someone will get back to you") is the wrong thing to say to them. ' +
      'A human replies. The inbox email is what makes that possible.',
  },
  {
    route: 'newsletter/route.ts',
    acknowledges: false,
    inbox: false,
    why: 'A subscriber is not waiting on a reply. Its own workflow handles the welcome.',
  },
  {
    route: 'feedback/route.ts',
    acknowledges: true,
    inbox: false,
    why: 'Feedback threads into Conversations. Whether it should also email the inbox is open.',
  },
];

function read(rel: string): string {
  return fs.readFileSync(path.join(API, rel), 'utf8');
}

describe('every public entry point reaches a human', () => {
  for (const ep of ENTRY_POINTS) {
    describe(ep.route, () => {
      const src = read(ep.route);

      it(ep.acknowledges ? 'stamps the acknowledgement tags' : 'deliberately does not acknowledge', () => {
        // Directly, or through acknowledgeOrReply, which stamps it for every subject that has no
        // written branch of its own. Either way the person is answered.
        const stamps = src.includes("'project-goods'") || src.includes('acknowledgeOrReply');
        expect(
          stamps,
          ep.acknowledges
            ? `${ep.route} does not stamp project-goods, so the person gets no reply`
            : `${ep.route} now stamps project-goods. If that is intended, update this test. Reason it was off: ${ep.why}`,
        ).toBe(ep.acknowledges);
      });

      it(ep.inbox ? 'emails the team inbox' : 'deliberately does not email the inbox', () => {
        const delivers = src.includes('sendSubmissionToInbox');
        expect(
          delivers,
          ep.inbox
            ? `${ep.route} does not call sendSubmissionToInbox, so nobody is told`
            : `${ep.route} now emails the inbox. If intended, update this test. Reason it was off: ${ep.why}`,
        ).toBe(ep.inbox);
      });

      it('stamps the delivery result, so the retry cron does not re-send forever', () => {
        // Found by an end-to-end test on 17 Sep: the support route recorded a
        // receipt and sent the email but never wrote the outcome back. A row
        // left `pending` is re-delivered by api/cron/contact-delivery every ten
        // minutes, so recording a send without recording its result mails the
        // same thing over and over. Nothing errors; the inbox just fills up.
        if (!ep.inbox) return;
        expect(
          src.includes('updateContactSubmission'),
          `${ep.route} calls sendSubmissionToInbox but never updateContactSubmission, ` +
            'so its rows stay pending and the retry cron re-sends them every ten minutes',
        ).toBe(true);
      });

      it('writes a durable receipt before any integration call', () => {
        // The outbox row is what a failed GHL or email call is retried from.
        // A route without one loses the message when an integration is down.
        if (!ep.inbox) return;
        expect(src.includes('recordContactSubmission'), `${ep.route} has no durable receipt`).toBe(
          true,
        );
      });
    });
  }

  it('every entry point with a reason states it', () => {
    for (const ep of ENTRY_POINTS) {
      if (!ep.acknowledges || !ep.inbox) {
        expect(ep.why, `${ep.route} turns something off and gives no reason`).toBeTruthy();
      }
    }
  });
});

/**
 * The invariant that arrived with the code-sent replies: a route may stamp the acknowledgement
 * tag, or send its own reply, and never both. Both is two emails to one person, and the second
 * one contradicts the first.
 */
describe('one reply per person', () => {
  const ROUTES = ENTRY_POINTS.map((e) => e.route);

  for (const route of ROUTES) {
    it(`${route} does not both acknowledge and reply`, () => {
      const src = read(route);
      // Both, in the same route, only holds when the choice is made by acknowledgeOrReply, which
      // does one or the other and is unit tested for exactly that. A route doing both itself is
      // two emails to one person.
      const stampsDirectly = src.includes("'project-goods'");
      const repliesDirectly = src.includes('sendTransactionalReply');
      expect(
        stampsDirectly && repliesDirectly,
        `${route} stamps the acknowledgement tag AND sends its own reply. If that is meant to be ` +
          'per subject, call acknowledgeOrReply instead: it cannot do both to one person.',
      ).toBe(false);
    });
  }
});

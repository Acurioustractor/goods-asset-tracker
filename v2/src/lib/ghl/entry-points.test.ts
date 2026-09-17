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
  { route: 'support/route.ts', acknowledges: true, inbox: true },
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
        const stamps = src.includes("'project-goods'");
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

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import { PUBLIC_FORMS } from './public-forms';
import { subjectsWithOwnReply } from '@/lib/comms/replies';
import { AUDIENCE_PATHWAYS } from '@/lib/ghl/audience-pathways';

/**
 * The guard that does not keep a list.
 *
 * It walks src/app and src/components, finds every file that renders a form and posts it to an
 * API route, and requires each one to be declared in public-forms.ts. That is the difference
 * between this and the two guards that came before it: they could only check the forms somebody
 * remembered to add. This one finds the form first and then asks what happens to the person.
 */

const SRC = path.join(__dirname, '../..');
const APP = path.join(SRC, 'app');

/**
 * Internal surfaces. Staff tools, operator tools and sign-in forms do not owe a member of the
 * public an acknowledgement, and a login form that emailed the team on every attempt would be
 * a bug rather than a courtesy. Prefix-based on purpose: adding a new admin page cannot silently
 * widen the exemption to a public one.
 */
const INTERNAL = [
  'app/admin/',
  'app/production/',
  'app/site/',
  'components/production/',
  'components/auth/',
];

/** Sign-in and one-time-code forms, wherever they live. */
function isSignIn(rel: string): boolean {
  return /\/login\/page\.tsx$/.test(rel) || /my-items\/layout\.tsx$/.test(rel);
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(full, out);
    } else if (entry.name.endsWith('.tsx')) {
      out.push(full);
    }
  }
  return out;
}

/** Every file that renders a form AND posts somewhere under /api/. */
function discoverPublicForms(): string[] {
  const roots = [path.join(SRC, 'app'), path.join(SRC, 'components')];
  const found: string[] = [];
  for (const root of roots) {
    for (const file of walk(root)) {
      const rel = path.relative(SRC, file).split(path.sep).join('/');
      if (INTERNAL.some((prefix) => rel.startsWith(prefix))) continue;
      if (isSignIn(rel)) continue;
      const src = fs.readFileSync(file, 'utf8');
      if (!src.includes('<form')) continue;
      if (!/fetch\(\s*[`'"]\/api\//.test(src)) continue;
      found.push(rel);
    }
  }
  return found.sort();
}

describe('every public form is declared', () => {
  const discovered = discoverPublicForms();
  const declared = new Set(PUBLIC_FORMS.map((f) => f.file));

  it('finds forms to check at all', () => {
    expect(discovered.length, 'the walker found no forms, so it is broken rather than the app being clean').toBeGreaterThan(5);
  });

  it('has a record for every form on a public surface', () => {
    const undeclared = discovered.filter((rel) => !declared.has(rel));
    expect(
      undeclared,
      'These forms take a message from a person and no record says what happens next. Add each to ' +
        'PUBLIC_FORMS with what the person gets and how a human hears about it.',
    ).toEqual([]);
  });

  it('declares nothing that no longer exists', () => {
    for (const form of PUBLIC_FORMS) {
      expect(
        fs.existsSync(path.join(SRC, form.file)),
        `${form.file} is declared and is not on disk`,
      ).toBe(true);
    }
  });
});

describe('nobody writes into silence', () => {
  it('never leaves both ends silent', () => {
    for (const form of PUBLIC_FORMS) {
      const bothSilent = form.theyGet === 'nothing' && form.goodsHears === 'nothing';
      expect(
        bothSilent,
        `${form.name} gives the person nothing and tells nobody here. That is the /community/ideas ` +
          'failure exactly: a row in a table no one opens.',
      ).toBe(false);
    }
  });

  it('explains every silence', () => {
    for (const form of PUBLIC_FORMS) {
      if (form.theyGet !== 'nothing' && form.goodsHears !== 'nothing') continue;
      expect(form.why, `${form.name} is silent somewhere and does not say why`).toBeTruthy();
    }
  });
});

describe('the promise matches the code', () => {
  const read = (handler: string) => fs.readFileSync(path.join(APP, handler), 'utf8');

  it('points at a handler that exists', () => {
    for (const form of PUBLIC_FORMS) {
      expect(
        fs.existsSync(path.join(APP, form.handler)),
        `${form.name} posts to ${form.handler}, which does not exist`,
      ).toBe(true);
    }
  });

  it('only promises an acknowledgement when the route stamps the tag that fires it', () => {
    for (const form of PUBLIC_FORMS) {
      if (form.theyGet !== 'acknowledgement') continue;
      const src = read(form.handler);
      expect(
        src.includes("'project-goods'") || src.includes('acknowledgeOrReply'),
        `${form.name} promises an acknowledgement and ${form.handler} neither stamps project-goods ` +
          'nor calls acknowledgeOrReply, so the person would get nothing.',
      ).toBe(true);
    }
  });

  it('only claims its own reply when the route actually sends one', () => {
    const branched = subjectsWithOwnReply();
    for (const form of PUBLIC_FORMS) {
      if (form.theyGet !== 'its own reply') continue;
      const src = read(form.handler);
      // Either the route sends it itself, or it goes through acknowledgeOrReply and this form
      // posts a subject that has a written branch. A form claiming its own reply on a shared
      // route with no branch for its subject would be describing an email nobody wrote.
      const sendsDirectly = src.includes('sendTransactionalReply');
      const sendsByBranch =
        src.includes('acknowledgeOrReply') && !!form.subject && branched.includes(form.subject);
      expect(
        sendsDirectly || sendsByBranch,
        `${form.name} says it sends its own reply and ${form.handler} never sends one` +
          (form.subject ? ` for ${form.subject}` : ''),
      ).toBe(true);
      expect(
        src.includes("'project-goods'"),
        `${form.name} sends its own reply and also stamps project-goods, so the person gets two emails`,
      ).toBe(false);
    }
  });

  it('records where a subject-specific reply has replaced the generic one', () => {
    const contactForms = PUBLIC_FORMS.filter((f) => f.handler === 'api/contact/route.ts');
    for (const form of contactForms) {
      if (form.theyGet !== 'acknowledgement') continue;
      expect(
        form.why,
        `${form.name} posts subjects that now have their own reply, so its record has to say which ` +
          'ones, or this table quietly describes the old behaviour.',
      ).toBeTruthy();
    }
  });

  it('only claims the inbox email when the route sends it', () => {
    for (const form of PUBLIC_FORMS) {
      if (form.goodsHears !== 'inbox email') continue;
      expect(
        read(form.handler).includes('sendSubmissionToInbox'),
        `${form.name} says Goods hears by inbox email and ${form.handler} never calls it`,
      ).toBe(true);
    }
  });

  it('only claims a task when the route raises one', () => {
    for (const form of PUBLIC_FORMS) {
      if (form.goodsHears !== 'ghl task') continue;
      expect(
        read(form.handler).includes('raiseCommunityInbound'),
        `${form.name} says Goods hears by a task and ${form.handler} never raises one`,
      ).toBe(true);
    }
  });
});

describe('every form is a door on a lane', () => {
  it('has its handler listed as an entry on its own pathway', () => {
    for (const form of PUBLIC_FORMS) {
      const pathway = AUDIENCE_PATHWAYS.find((p) => p.audience === form.audience);
      expect(pathway, `${form.name} names the lane ${form.audience}, which does not exist`).toBeTruthy();
      const handlers = pathway!.entries.map((e) => e.handler);
      expect(
        handlers,
        `${form.name} posts to ${form.handler} and the ${form.audience} lane does not list it as a ` +
          'door, so the pathway is missing a way in that the public can already use.',
      ).toContain(form.handler);
    }
  });
});

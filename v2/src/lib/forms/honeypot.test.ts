import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import { honeypotValue } from './honeypot';

/**
 * A honeypot fails silently in both directions. If the hidden field is missing
 * from a form, the guard never fires and nobody notices. If the value is never
 * sent, same. So the useful test is structural: every form that posts to a
 * guarded endpoint must render the field AND send it.
 */

const ROOT = path.join(__dirname, '../../..');

/** Forms that post to an endpoint carrying guardContactSubmission. */
const GUARDED_FORMS = [
  'src/app/contact/page.tsx',
  'src/components/contact/contact-goods-button.tsx',
  'src/app/press/_components/press-contact-form.tsx',
  'src/components/washer-interest-form.tsx',
  'src/components/partnership-form.tsx',
  'src/components/feedback/feedback-widget.tsx',
  'src/app/support/page.tsx',
  'src/app/canberra/follow-form.tsx',
  'src/app/sponsor/NewsletterCapture.tsx',
  'src/components/newsletter-signup.tsx',
  'src/components/layout/newsletter-form.tsx',
  'src/app/bed/[id]/story-modal.tsx',
];

/** Routes that must carry the guard. */
const GUARDED_ROUTES = [
  'src/app/api/contact/route.ts',
  'src/app/api/partnership/route.ts',
  'src/app/api/feedback/route.ts',
  'src/app/api/support/route.ts',
  'src/app/api/newsletter/route.ts',
  'src/app/api/bed/[id]/story/route.ts',
];

describe('honeypotValue', () => {
  const makeEvent = (value?: string) => ({
    currentTarget: {
      elements: {
        namedItem: (name: string) =>
          name === '_companyWebsite' && value !== undefined ? { value } : null,
      },
    },
  });

  it('returns undefined when a person leaves it alone', () => {
    expect(honeypotValue(makeEvent(''))).toBeUndefined();
    expect(honeypotValue(makeEvent('   '))).toBeUndefined();
  });

  it('returns the value a bot typed', () => {
    expect(honeypotValue(makeEvent('http://spam.example'))).toBe('http://spam.example');
  });

  it('survives a form with no honeypot field', () => {
    expect(honeypotValue(makeEvent(undefined))).toBeUndefined();
  });

  it('survives a null currentTarget', () => {
    expect(honeypotValue({ currentTarget: null })).toBeUndefined();
  });
});

describe('every guarded form renders and sends the honeypot', () => {
  for (const rel of GUARDED_FORMS) {
    it(rel, () => {
      const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
      // Renders the hidden input.
      expect(src, `${rel} is missing the hidden _companyWebsite input`).toContain(
        'name="_companyWebsite"',
      );
      // Sends it: either through the helper, a FormData read, or an explicit key.
      const sends =
        src.includes('honeypotValue(') ||
        src.includes("get('_companyWebsite')") ||
        src.includes("namedItem('_companyWebsite')");
      expect(sends, `${rel} renders the honeypot but never sends it`).toBe(true);
    });
  }
});

describe('every public write endpoint calls the guard', () => {
  for (const rel of GUARDED_ROUTES) {
    it(rel, () => {
      const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
      expect(src, `${rel} does not call guardContactSubmission`).toContain(
        'guardContactSubmission(',
      );
      expect(src, `${rel} does not handle a honeypot hit`).toContain("'honeypot'");
    });
  }
});

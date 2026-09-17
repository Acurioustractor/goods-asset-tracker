import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * No placeholder phone number ships in a tel: link.
 *
 * Found 17 September 2026: `/portal`, `/portal/layout` and `/portal/ask-goods`
 * all published `tel:+61400000000` as "Call Ben". 0400 000 000 is not a real
 * number. The audience least able to absorb a dead end, people in community
 * tapping "call us" on the portal, was the audience getting one.
 *
 * Nothing catches this at build or type level: a tel: href is just a string.
 */

const APP = path.join(__dirname, '../../app');

/** Numbers that are obviously not real. Add to this rather than removing the test. */
const PLACEHOLDERS = [
  '400000000', // 0400 000 000
  '412345678', // 0412 345 678
  '123456789',
  '000000000',
  '111111111',
  '1234567890',
  '5551234',   // the US film convention, in case a snippet is pasted in
];

function tsxFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) tsxFiles(full, acc);
    else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      if (!entry.name.includes('.test.')) acc.push(full);
    }
  }
  return acc;
}

const TEL = /tel:\+?[0-9 ()-]{6,}/g;

describe('no placeholder phone number is published', () => {
  const offenders: string[] = [];

  for (const file of tsxFiles(APP)) {
    const src = fs.readFileSync(file, 'utf8');
    for (const link of src.match(TEL) ?? []) {
      const digits = link.replace(/\D/g, '');
      for (const bad of PLACEHOLDERS) {
        if (digits.endsWith(bad)) {
          offenders.push(`${path.relative(APP, file)}  ${link}`);
        }
      }
    }
  }

  it('finds tel: links to check at all', () => {
    // If this ever hits zero the regex has stopped matching and the test above
    // is passing for the wrong reason.
    const total = tsxFiles(APP).reduce(
      (n, f) => n + (fs.readFileSync(f, 'utf8').match(TEL) ?? []).length,
      0,
    );
    expect(total).toBeGreaterThan(0);
  });

  it('publishes no placeholder numbers', () => {
    expect(
      offenders,
      `These tel: links use a placeholder number:\n  ${offenders.join('\n  ')}\n` +
        'Someone tapping that reaches nothing. Use a real number or remove the link.',
    ).toEqual([]);
  });
});

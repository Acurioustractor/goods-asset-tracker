/**
 * Guards for deck.ts, the slide content rendered publicly by /pitch/deck.
 *
 * This file exists because deck.ts had no guard at all while its sibling
 * road-ending.ts had twenty. A ~600-line rebuild landed uncommitted in a working
 * tree, was committed unreviewed because /pitch/road could not compile without
 * it, and a read of it on 2026-08-01 found five defects that had reached a
 * public preview. Every assertion below is one of them.
 *
 * /pitch/* is NOT password-gated. src/proxy.ts protects /my-items, /community,
 * /production, /impact, /insiders and /investors. The pitch routes are open web,
 * so anything in this file is publication.
 *
 * check:voice cannot catch most of this: its regex breaks on strings containing
 * embedded double quotes (which is how the retired bed-threshold sentence hid
 * inside a chip value), and its term list has no rule for several banned words.
 */

import { describe, it, expect } from 'vitest';
import { deckSlides } from './deck';

/** Every string a viewer can see. `note` and `script` are excluded deliberately:
 *  no public renderer reads `note` (verified against deck-public.tsx and
 *  pitch/road/page.tsx), and it is where retired history is allowed to live. */
const PUBLIC_STRINGS: { where: string; text: string }[] = deckSlides.flatMap((s) => [
  { where: `${s.id}.headline`, text: s.headline ?? '' },
  { where: `${s.id}.body`, text: s.body ?? '' },
  { where: `${s.id}.eyebrow`, text: s.eyebrow ?? '' },
  { where: `${s.id}.place`, text: s.place ?? '' },
  ...(s.chips ?? []).flatMap((c, i) => [
    { where: `${s.id}.chips[${i}].label`, text: c.label },
    { where: `${s.id}.chips[${i}].value`, text: c.value },
  ]),
  ...(s.steps ?? []).map((step, i) => ({ where: `${s.id}.steps[${i}]`, text: step })),
]);

describe('deck.ts: no bed number is offered as a threshold', () => {
  it('publishes no "= N beds" conversion and no beds-per-year rate', () => {
    // STRATEGY.md: "no bed number goes in front of anyone until the measured run
    // happens" and "Never said in either room: a bed number as a threshold."
    // The economics slide chipped "$79,333/yr = 234 beds", "= 381", "= 529".
    // The dollar blocks are the honest way to say the same thing.
    for (const { where, text } of PUBLIC_STRINGS) {
      expect(text, `${where}: "${text}"`).not.toMatch(/=\s*\d[\d,]*\s*beds?\b/i);
      // Allows words between the count and the rate, because the live defect read
      // "234 bed SALES a year" and a tighter pattern walked straight past it.
      // Deliberately does not fire on delivered totals ("540 beds delivered to 11
      // communities") or on unit prices ("$750 a bed"), both of which are canon.
      expect(text, `${where}: "${text}"`).not.toMatch(
        /\b\d[\d,]*\s+bed\w*\b[^.]{0,24}?\b(a|per)\s+(year|yr|annum)\b/i,
      );
    }
  });

  it('does not print the retired 75-to-100 sentence, even inside a "retired" chip', () => {
    // Ruling I kept it as an INTERNAL estimate. It was chipped under a
    // "Retired - do not use" label, which publishes it: labelling a sentence
    // retired does not unprint it from a funder's screen.
    for (const { where, text } of PUBLIC_STRINGS) {
      expect(text, `${where}: "${text}"`).not.toMatch(/75\s*(to|-|–)\s*100/);
    }
  });
});

describe('deck.ts: no unsourced QBE date', () => {
  it('never prints 14 September as the QBE application date', () => {
    // canon.ts signed-lois, verbatim: "Do NOT write '14 Sep' as the application
    // date: that is the Butterfly AGM, a different thing, and no firmer QBE date
    // is sourced." Ruling T struck it from ask-surface.ts on 2026-07-31; the
    // same diff that added this chip had deleted the comment warning against it.
    for (const { where, text } of PUBLIC_STRINGS) {
      expect(text, `${where}: "${text}"`).not.toMatch(/14\s*(Sep|September)/i);
    }
  });
});

describe('deck.ts: every photo can actually ship', () => {
  it('references no gitignored directory', () => {
    // /images/_drafts/ is ignored by .gitignore:218, so a slide pointing there
    // renders a 404 in production. /pitch/deck reads slide.photo directly and
    // has no override path, so it fails hardest there.
    // A path you can `ls` may still not ship: check `git ls-files`, never `ls`.
    for (const slide of deckSlides) {
      for (const path of [slide.photo, slide.inlineVideo?.poster]) {
        if (!path) continue;
        expect(path, `${slide.id} points at an ignored directory`).not.toMatch(
          /\/_drafts\/|\/starred-images\//,
        );
      }
    }
  });

  it('every slide has a photo and a non-empty alt', () => {
    for (const slide of deckSlides) {
      expect(slide.photo, `${slide.id} has no photo`).toBeTruthy();
      expect(slide.photoAlt?.trim(), `${slide.id} has no alt text`).toBeTruthy();
    }
  });
});

describe('deck.ts: status labels match canon', () => {
  it('the 8.6x leg ratio is labelled modelled, never verified', () => {
    // canon.ts regraded save-per-bed verified -> modelled on 2026-07-31 (ruling
    // T). The chip kept saying Verified, which is the sweep this catches.
    const ratioChips = deckSlides
      .flatMap((s) => (s.chips ?? []).map((c) => ({ id: s.id, ...c })))
      .filter((c) => /8\.6/.test(c.value) || /8\.6/.test(c.label));
    expect(ratioChips.length, 'the 8.6x ratio chip has gone missing').toBeGreaterThan(0);
    for (const chip of ratioChips) {
      expect(chip.label.toLowerCase(), `${chip.id}: "${chip.label}"`).not.toContain('verified');
    }
  });

  it('the 8.6x ratio names its divisor, so it cannot be checked against the wrong one', () => {
    // $344.05 / $40 raw shred = 8.6. Against the $55 landed figure it is 6.3,
    // and a funder with a calculator breaks the page. Same defect road-ending
    // guards at its own copy.
    const ratioChips = deckSlides
      .flatMap((s) => s.chips ?? [])
      .filter((c) => /8\.6/.test(c.value));
    for (const chip of ratioChips) {
      expect(chip.value, `"${chip.value}" must name the $40 raw-shred divisor`).toMatch(/\$?40/);
    }
  });
});

describe('deck.ts: the standing claim ceilings', () => {
  it('never claims ownership as complete, or a health or justice outcome', () => {
    for (const { where, text } of PUBLIC_STRINGS) {
      expect(text, where).not.toMatch(/community[- ]owned (facility|plant|factory)\b/i);
      expect(text, where).not.toMatch(/\bnow owns\b|\balready owns\b|handover complete/i);
      expect(text, where).not.toMatch(/\b(cured|eliminated|eradicated)\b.*\b(scabies|RHD)\b/i);
    }
  });

  it('never says co-design, accountant-signed, or zero beds pressed in-house', () => {
    for (const { where, text } of PUBLIC_STRINGS) {
      const t = text.toLowerCase();
      expect(t, where).not.toContain('co-design');
      // "not accountant-signed" is the correct honest form and must survive.
      if (t.includes('accountant-signed')) {
        expect(t, `${where}: must be a negation`).toMatch(/not accountant-signed/);
      }
      expect(t, where).not.toContain('zero beds pressed');
    }
  });

  it('has no em dash and no curly quote in any public string', () => {
    for (const { where, text } of PUBLIC_STRINGS) {
      expect(text, `${where}: "${text}"`).not.toMatch(/—/);
      expect(text, `${where}: "${text}"`).not.toMatch(/[‘’“”]/);
    }
  });
});

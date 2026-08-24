/**
 * Guards for the homepage data module.
 *
 * The homepage is the most-read surface on the site, so its copy lives in
 * home.ts as data and these tests hold the lines that must never drift:
 * consent, canon figures, the locked stage model, the road spine, the
 * audience-model doors, and the gitignored-media trap (a photo you can
 * `ls` may still not ship).
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

import {
  HOME_HERO,
  HOME_PROVENANCE,
  HOME_STORY_COMPACT,
  HOME_FEATURE_COPY,
  HOME_BED_SECTION,
  HOME_FACILITY_SECTION,
  HOME_VOICES,
  HOME_ROAD,
  HOME_DOORS,
  homeVoiceQuote,
} from './home';
import { isClearedForExternal } from './cleared-voices';
import { canonValue } from './canon';
import { PLASTIC_KG_PER_BED } from './products';
import { PUBLIC_STAGES } from './pathway-stages';
import { ROAD_STOPS, THE_GAP } from './road-spine';

const PUBLIC_DIR = join(__dirname, '../../../public');

const allImages = [
  HOME_HERO.image,
  HOME_BED_SECTION.image,
  HOME_FACILITY_SECTION.image,
  ...HOME_VOICES.cards.map((c) => c.image),
];

describe('homepage guards', () => {
  it('every named voice is cleared for external use', () => {
    for (const card of HOME_VOICES.cards) {
      expect(isClearedForExternal(card.name), `${card.name} is not on the external clearance list`).toBe(true);
    }
  });

  it('every voice card resolves a real curated quote (never invented here)', () => {
    for (const card of HOME_VOICES.cards) {
      expect(homeVoiceQuote(card).length).toBeGreaterThan(10);
    }
  });

  it('the price on the page is the canon stretch-price', () => {
    const price = canonValue('stretch-price');
    expect(HOME_BED_SECTION.price).toBe(price);
    expect(HOME_BED_SECTION.buyCta.label).toContain(`$${price}`);
    expect(HOME_DOORS[0].body).toContain(`$${price}`);
  });

  it('plastic figure comes from the product constant', () => {
    expect(HOME_PROVENANCE[1]).toBe(`${PLASTIC_KG_PER_BED}kg of HDPE per bed`);
    expect(HOME_BED_SECTION.body).toContain(`${PLASTIC_KG_PER_BED}kg`);
  });

  it('the stage chips are the locked six-stage model, not a local list', () => {
    expect(HOME_FACILITY_SECTION.stages).toBe(PUBLIC_STAGES);
    expect(HOME_FACILITY_SECTION.stages).toHaveLength(6);
  });

  it('the road band is the road spine: lessons, with the gap', () => {
    expect(HOME_ROAD.stops).toBe(ROAD_STOPS);
    expect(HOME_ROAD.gapLine).toBe(THE_GAP.line);
  });

  it('the forty-beds claim stays consistent with the spine (factory path is PROVEN)', () => {
    const maningrida = ROAD_STOPS.find((s) => s.id === 'maningrida');
    expect(maningrida?.what).toContain('Forty beds pressed');
    expect(HOME_PROVENANCE[0]).toBe('40 beds pressed end to end');
    expect(HOME_FACILITY_SECTION.body).toContain('Forty beds pressed');
  });

  it('every photo ships: exists under public/, never a starred-images path', () => {
    for (const src of allImages) {
      expect(src.startsWith('/images/'), `${src} must live under public/images`).toBe(true);
      expect(src).not.toContain('starred-images');
      expect(existsSync(join(PUBLIC_DIR, src)), `${src} not found in public/`).toBe(true);
    }
  });

  it('the feature-film claim stays consistent with the register', () => {
    expect(HOME_FEATURE_COPY.caption).toContain('Forty beds');
  });

  it('four doors, one per audience next-action, each pointing at its front door', () => {
    expect(HOME_DOORS).toHaveLength(4);
    const hrefs = HOME_DOORS.map((d) => d.cta.href);
    expect(hrefs).toContain('/shop/stretch-bed-single'); // buyer
    expect(hrefs).toContain('/sponsor'); // supporter
    expect(hrefs).toContain('/contact'); // community
    expect(hrefs).toContain('/pitch/road'); // funder
  });

  it('the community door proposes nothing and carries no price; the funder door no figures', () => {
    const community = HOME_DOORS.find((d) => d.cta.href === '/contact');
    expect(community?.body).not.toMatch(/\$\s?\d/);
    expect(community?.body).not.toMatch(/facility proposal|cost model/i);
    const funder = HOME_DOORS.find((d) => d.cta.href === '/pitch/road');
    expect(funder?.body).not.toMatch(/\$\s?\d/);
  });

  it('ownership is a pathway, never claimed complete', () => {
    const prose = [
      HOME_STORY_COMPACT.line,
      HOME_FACILITY_SECTION.title,
      HOME_FACILITY_SECTION.body,
      HOME_ROAD.title,
      ...HOME_DOORS.map((d) => d.body),
    ].join(' ');
    expect(prose).not.toMatch(/community[- ]owned factory|now owns the making|ownership complete/i);
  });
});

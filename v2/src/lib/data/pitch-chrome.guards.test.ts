import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { deckSlides } from './deck';
import { AUDIENCES } from './audience';
import {
  DEFAULT_PACK,
  OPENER_BANNED,
  OPENER_LINES,
  PITCH_APPENDICES,
  PITCH_CHAPTERS,
  PITCH_PACKS,
  PITCH_PANELS,
  audienceForPack,
  panelsForPack,
  resolvePack,
} from './pitch-chrome';

describe('pitch panels mirror the deck rather than duplicating it', () => {
  it('has no duplicate panel ids', () => {
    const ids = PITCH_PANELS.map((panel) => panel.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every panel sits in a declared chapter', () => {
    const chapters = new Set(PITCH_CHAPTERS.map((chapter) => chapter.id));
    for (const panel of PITCH_PANELS) {
      expect(chapters.has(panel.chapter), `${panel.id} has an undeclared chapter`).toBe(true);
    }
  });

  /**
   * The one that matters. `page.tsx` renders a section per road stop straight from `deckSlides`,
   * plus the product slide after Palm Island. If a stop is added, removed or reordered in the deck
   * and this list is not updated, the nav would quietly omit it and slide mode would skip it. This
   * fails first instead.
   */
  it('the places chapter matches the deck source, in deck order', () => {
    // Two panels are page-level components rather than deck slides: the zoomable bed image and
    // the production-facility experience. They joined PITCH_PANELS on 2026-08-06 so the pack
    // filter and slide mode can see them (before that they leaked into every pack). They have
    // no deck row to mirror, so the deck-order assertion names and skips them.
    const PAGE_LEVEL_PANELS = new Set(['bed-in-detail', 'the-farm']);
    const fromDeck = deckSlides
      .filter((slide) => slide.kind === 'stop' || slide.id === 'the-stretch-bed')
      .map((slide) => slide.id);
    const fromPanels = PITCH_PANELS.filter(
      (panel) => panel.chapter === 'the-places' && !PAGE_LEVEL_PANELS.has(panel.id),
    ).map((panel) => panel.id);
    expect(fromPanels).toEqual(fromDeck);
  });
});

describe('packs cut the deck without breaking the audience model', () => {
  it('the funder pack is the deck as written, every panel', () => {
    expect(panelsForPack('funder')).toEqual(PITCH_PANELS);
  });

  it('every cut is shorter than the funder deck and keeps reading order', () => {
    for (const pack of PITCH_PACKS.filter((entry) => entry.id !== 'funder')) {
      const panels = panelsForPack(pack.id);
      expect(panels.length).toBeGreaterThan(0);
      expect(panels.length).toBeLessThan(PITCH_PANELS.length);
      const order = panels.map((panel) => PITCH_PANELS.indexOf(panel));
      expect(order).toEqual([...order].sort((a, b) => a - b));
    }
  });

  it('every pack names a real audience record', () => {
    for (const pack of PITCH_PACKS) {
      expect(audienceForPack(pack.id).id).toBe(pack.audience);
    }
  });

  /**
   * Not a preference. `buyer.mustNeverSee` forbids the impact story ahead of the specification and
   * `community.mustNeverSee` forbids arriving with a proposal instead of a yarn. This page opens
   * with the story and is a proposal throughout, so a pack for either audience would ship a known
   * relationship-ending failure. Their front doors are `/shop` and a conversation.
   */
  it('refuses to cut this page for buyers or communities', () => {
    const served = PITCH_PACKS.map((pack) => pack.audience);
    expect(served).not.toContain('buyer');
    expect(served).not.toContain('community');
  });

  it('the non-funder cuts carry no funding ask', () => {
    for (const packId of ['supporter', 'press'] as const) {
      const ids = panelsForPack(packId).map((panel) => panel.id);
      expect(ids, `${packId} must not carry the ask`).not.toContain('four-asks');
    }
  });

  it('an unknown or missing ?for= falls back to the deck as written', () => {
    expect(resolvePack(undefined)).toBe(DEFAULT_PACK);
    expect(resolvePack('investor')).toBe(DEFAULT_PACK);
    expect(resolvePack('')).toBe(DEFAULT_PACK);
    expect(resolvePack(['press', 'funder'])).toBe('press');
    expect(DEFAULT_PACK).toBe('funder');
  });

  it('the audiences the packs name actually exist in the audience model', () => {
    const known = new Set(AUDIENCES.map((entry) => entry.id));
    for (const pack of PITCH_PACKS) expect(known.has(pack.audience)).toBe(true);
  });
});

describe('the supporting surfaces are appendices, not front doors', () => {
  it('every appendix names the question it answers', () => {
    for (const appendix of PITCH_APPENDICES) {
      expect(appendix.href.startsWith('/pitch/')).toBe(true);
      expect(appendix.answers.length).toBeGreaterThan(20);
    }
  });

  it('the deck itself is never listed as its own appendix', () => {
    expect(PITCH_APPENDICES.map((entry) => entry.href)).not.toContain('/pitch/road');
  });

  /**
   * The exact drift that happened. `pitch-surface-notice.tsx` hardcoded `/pitch/funder-pathways`
   * as the canonical funder surface while ruling R, `audience.ts` and `next.config` all said
   * `/pitch/road`, so every supporting page signposted funders away from the front door. It now
   * reads `audience('funder').frontDoor`. This asserts it still does.
   */
  it('the surface notice derives the front door instead of hardcoding one', () => {
    const source = readFileSync(
      new URL('../../components/pitch/pitch-surface-notice.tsx', import.meta.url),
      'utf8',
    );
    const code = source.replace(/\/\*\*[\s\S]*?\*\//g, '');
    expect(code).toContain("audience('funder').frontDoor");
    expect(code.match(/'\/pitch\/funder-pathways'/)).toBeNull();
  });

  it('the funder front door is the deck', () => {
    const funder = AUDIENCES.find((entry) => entry.id === 'funder');
    expect(funder?.frontDoor).toBe('/pitch/road');
  });
});

describe('the opener is the highest-risk prose in the system', () => {
  it('is five lines', () => {
    expect(OPENER_LINES).toHaveLength(5);
  });

  it('contains none of the banned phrases', () => {
    const text = OPENER_LINES.join(' ').toLowerCase();
    for (const phrase of OPENER_BANNED) {
      expect(text, `opener must not contain "${phrase}"`).not.toContain(phrase);
    }
  });

  /**
   * The per-site annual running cost has four live answers and break-even moves from two sites to
   * five across them. No site count may appear as settled until that is resolved.
   * See `deliverables/GOC-site-cost-decision.md`.
   */
  it('states no site count as settled', () => {
    const text = OPENER_LINES.join(' ').toLowerCase();
    for (const claim of ['two sites', 'three sites', 'four sites', 'five sites']) {
      expect(text).not.toContain(claim);
    }
  });

  it('says nothing is signed, because that comes plainly and first', () => {
    const text = OPENER_LINES.join(' ').toLowerCase();
    expect(text).toContain('signed');
  });

  it('uses no em-dashes', () => {
    for (const line of OPENER_LINES) expect(line).not.toContain('—');
  });
});

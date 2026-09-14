import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { deckSlides } from './deck';
import { DECK } from './deck-master';
import { BED_PIECES, PITCH_SECTIONS, ROAD_OVERRIDES } from './pitch-road';

const pub = (p: string) => join(process.cwd(), 'public', p);

describe('pitch road overrides', () => {
  it('every override names a real deck stop', () => {
    const stops = new Set(deckSlides.filter((s) => s.kind === 'stop').map((s) => s.id));
    for (const id of Object.keys(ROAD_OVERRIDES)) expect(stops.has(id), id).toBe(true);
  });

  it('every photograph, poster and film file exists under public', () => {
    for (const [id, o] of Object.entries(ROAD_OVERRIDES)) {
      if (o.photo) expect(existsSync(pub(o.photo.src)), `${id} photo`).toBe(true);
      for (const g of o.gallery ?? []) expect(existsSync(pub(g.src)), `${id} ${g.src}`).toBe(true);
      if (o.film) {
        expect(existsSync(pub(o.film.src)), `${id} film`).toBe(true);
        expect(existsSync(pub(o.film.poster)), `${id} poster`).toBe(true);
      }
    }
    for (const p of BED_PIECES) expect(existsSync(pub(p.src)), p.src).toBe(true);
  });

  it('every photograph has alt text and the Harvest is never Witta', () => {
    const all = [...Object.values(ROAD_OVERRIDES).flatMap((o) => [o.photo, ...(o.gallery ?? [])]), ...BED_PIECES].filter(Boolean) as { alt: string }[];
    for (const p of all) {
      expect(p.alt.length).toBeGreaterThan(8);
      expect(p.alt).not.toMatch(/witta/i);
    }
  });
});

describe('the deck is captured on the pitch', () => {
  it('every one of the nineteen slides has a home that is a pitch section', () => {
    const ids = new Set(PITCH_SECTIONS.map((s) => `#${s.id}`));
    expect(DECK).toHaveLength(19);
    for (const s of DECK) expect(ids.has(s.home), `${s.id} → ${s.home}`).toBe(true);
  });

  it('section ids are unique', () => {
    expect(new Set(PITCH_SECTIONS.map((s) => s.id)).size).toBe(PITCH_SECTIONS.length);
  });
});

import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { SNOW_CHAPTERS, SNOW_MENU_TILES } from './snow-chapters';

describe('the Snow report menu', () => {
  it('gives every chapter a tile and every tile a chapter', () => {
    const ids = SNOW_CHAPTERS.map((c) => c.id);
    expect(Object.keys(SNOW_MENU_TILES).sort()).toEqual([...ids].sort());
  });
  it('uses only images that are on disk', () => {
    for (const [id, tile] of Object.entries(SNOW_MENU_TILES)) {
      expect(existsSync(path.join(process.cwd(), 'public', tile.src)), `${id}: ${tile.src}`).toBe(true);
    }
  });
  it('keeps chapter ids unique', () => {
    const ids = SNOW_CHAPTERS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

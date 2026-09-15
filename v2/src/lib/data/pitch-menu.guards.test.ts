import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { PITCH_MENU_TILES } from './pitch-menu';

describe('the pitch menu', () => {
  it('uses only images that are on disk', () => {
    for (const [id, tile] of Object.entries(PITCH_MENU_TILES)) {
      expect(existsSync(path.join(process.cwd(), 'public', tile.src)), `${id}: ${tile.src}`).toBe(true);
    }
  });
  it('shows a drawing only from the model folder (the kit or the rendered sheet)', () => {
    for (const [id, tile] of Object.entries(PITCH_MENU_TILES)) {
      if (tile.drawing) expect(tile.src.startsWith('/images/model/'), id).toBe(true);
    }
  });
});

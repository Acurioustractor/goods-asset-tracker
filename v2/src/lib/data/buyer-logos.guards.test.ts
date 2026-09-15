import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BUYER_LOGOS } from './buyer-logos';
import { BUYERS } from './pitch-chapters';

describe('buyer logos', () => {
  it('every paid buyer has a logo, and every logo file ships in public/', () => {
    for (const row of BUYERS.rows) {
      const logo = BUYER_LOGOS[row.buyer];
      expect(logo, row.buyer).toBeDefined();
      expect(existsSync(join(process.cwd(), 'public', logo.src)), logo.src).toBe(true);
    }
  });
});

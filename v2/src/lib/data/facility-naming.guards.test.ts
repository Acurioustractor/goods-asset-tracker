import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Ben, 16 September 2026: the beds are pressed at the Goods on Country facility in Queensland.
 * No page or data module says "the farm", "The Harvest Plant" or names Witta for the making. The
 * Harvest is A Curious Tractor's own place and may still be named as that (pitch-chapters ORIGIN). Route and panel ids that
 * still carry the old word (stop-6-maningrida-and-the-farm, the-farm) are keys, and one image
 * filename carries it; none of them is shown.
 */

const ROOTS = ['src/app', 'src/lib/data'];
const BANNED = /\bwitta\b|\bthe farm\b|farm-made|farm production|farm facility|farm plant|harvest plant|(at|in|from) the harvest\b/i;
const KEYS = /stop-6-maningrida-and-the-farm|["']the-farm["']|harvest-witta-aerial\.jpg|At The Harvest, neighbours/g;

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.ts$/.test(name)) yield full;
  }
}

describe('the making is named as the Goods on Country facility in Queensland', () => {
  it('never says the farm or Witta on a page or in a data module', () => {
    const hits: string[] = [];
    for (const root of ROOTS) {
      for (const file of walk(join(process.cwd(), root))) {
        readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
          if (BANNED.test(line.replace(KEYS, ''))) hits.push(`${relative(process.cwd(), file)}:${i + 1}`);
        });
      }
    }
    expect(hits).toEqual([]);
  });
});

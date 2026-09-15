import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { HARVEST_CONTAINER_DRAWING } from '@/lib/model/harvest-container-drawing';
import { AUSTRALIA_OUTLINE } from './australia-outline';
import { PEOPLE_PORTRAIT_FILES } from './people-portraits';

const root = process.cwd();
const pub = (...p: string[]) => path.join(root, 'public', ...p);

/**
 * On Vercel the server cannot read public/ (next.config.ts keeps it out of function bundles). On
 * 15 September 2026 that silently removed the drone film, the map's outline and the placemat drawing
 * from the live /pitch, and every storyteller portrait from the community pages, while all of them
 * worked locally. These guards hold the code copies to their files and keep public pages off the disk.
 */
describe('public assets the server needs', () => {
  it('carries the Australia outline the map draws, matching the SVG in public/', () => {
    const svg = readFileSync(pub('images', 'maps', 'australia-outline.svg'), 'utf8');
    const inner = (svg.match(/<g[^>]*>([\s\S]*)<\/g>/)?.[1] ?? svg.match(/<path[^>]*\/>/)?.[0] ?? '').trim();
    expect(AUSTRALIA_OUTLINE.length).toBeGreaterThan(1000);
    expect(AUSTRALIA_OUTLINE).toBe(inner);
  });

  it('carries the container drawing the placemat draws, matching the SVG in public/', () => {
    const svg = readFileSync(pub('images', 'model', 'harvest-container.svg'), 'utf8');
    expect(HARVEST_CONTAINER_DRAWING.length).toBeGreaterThan(1000);
    expect(HARVEST_CONTAINER_DRAWING).toBe((svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1] ?? '').trim());
  });

  it('ships the drone cut and its poster that chapter 2 always plays', () => {
    for (const f of ['ninga-mia-drone.mp4', 'ninga-mia-drone-poster.jpg']) expect(existsSync(pub('video', 'kalgoorlie', f)), f).toBe(true);
  });

  it('lists every portrait in public/images/people/', () => {
    const files = readdirSync(pub('images', 'people')).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
    expect([...PEOPLE_PORTRAIT_FILES]).toEqual(files);
  });

  it('keeps public pages from reading public/ off the disk', () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const full = path.join(dir, name);
        if (statSync(full).isDirectory()) {
          if (!['admin', 'api'].includes(name)) walk(full);
        } else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) {
          const src = readFileSync(full, 'utf8');
          if (/process\.cwd\(\),\s*['"]public['"]/.test(src)) offenders.push(path.relative(root, full));
        }
      }
    };
    walk(path.join(root, 'src', 'app'));
    walk(path.join(root, 'src', 'components'));
    expect(offenders).toEqual([]);
  });
});

/**
 * The road is one spine at two lengths.
 *
 * `deck.ts` carries the compressed slide, `story-road.ts` carries the history. Both
 * are the road from `/DECISIONS.md` ruling C, so a stop added to one and not the
 * other means the two public surfaces are telling different stories about where the
 * work has been. That is the failure ruling C exists to prevent: five spines were
 * live at once, and nothing was checking.
 *
 * DONE 2026-07-26: `road-spine.ts` landed on main as that shared definition, so this test now
 * asserts against IT rather than against `deck.ts`. Three things improve.
 *
 * It is UNCONDITIONAL. The old version could not assert anything until the deck grew a road, so
 * it reported instead of checking. The spine is on main now, so divergence fails immediately.
 *
 * It no longer imports `deck.ts`, which was both a type error once the two SlideKind unions
 * diverged and a standing merge risk while the deck is under edit in another session.
 *
 * And it no longer needs to compare the story to the deck at all: `deck-road.guards.test.ts`
 * asserts the deck against the same spine, so the two surfaces agree transitively. That is the
 * shared-spine design doing its job rather than two surfaces watching each other.
 */

import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROAD_STOPS } from './road-spine';
import { storyStops, storyStopIds, storyGaps, storyOpening } from './story-road';
import { isClearedForExternal } from './cleared-voices';

const storyRoadStopIds = storyStops.filter((s) => s.kind === 'stop').map((s) => s.id);

/**
 * Story ids carry their position and full title (`stop-3-the-machine-with-a-name`); spine ids are
 * the bare slug (`the-machine`). Strip the ordinal and require the spine id as the prefix, which
 * still catches a reorder, an addition or a drop.
 */
const storyIdToSpineSlug = (id: string) => id.replace(/^stop-\d+-/, '');

describe('the road spine', () => {
  it('matches the canonical spine stop-for-stop, in order', () => {
    const spineIds = ROAD_STOPS.map((s) => s.id);
    const storySlugs = storyRoadStopIds.map(storyIdToSpineSlug);

    expect(storySlugs).toHaveLength(spineIds.length);
    storySlugs.forEach((slug, i) => {
      expect(slug, `story stop ${i + 1} is "${slug}", spine says "${spineIds[i]}"`).toMatch(
        new RegExp(`^${spineIds[i]}`),
      );
    });
  });

  it('carries the same places as the spine, so neither can quietly gain or lose one', () => {
    expect(storyRoadStopIds).toHaveLength(ROAD_STOPS.length);
  });

  it('has seven stops, because ruling C says the road has seven', () => {
    // This one is unconditional: it is a fact about the road, not about the deck.
    expect(storyRoadStopIds).toHaveLength(7);
  });

  it('puts the model AFTER every place stop, never before', () => {
    const ids = storyStopIds();
    const lastStop = Math.max(...storyRoadStopIds.map((id) => ids.indexOf(id)));
    const model = ids.indexOf('model');
    // Ruling C: the model is what the road produced. Leading with the framework
    // invites a funder to compare your framework to better frameworks.
    expect(model).toBeGreaterThan(lastStop);
  });

  it('puts the economics after the model, and the money after the economics', () => {
    const ids = storyStopIds();
    expect(ids.indexOf('economics')).toBeGreaterThan(ids.indexOf('model'));
    expect(ids.indexOf('money')).toBeGreaterThan(ids.indexOf('economics'));
    expect(ids.indexOf('closing')).toBe(ids.length - 1);
  });
});

/**
 * Only what a reader actually sees. Editorial `note` fields are excluded on purpose:
 * they carry warnings that quote the banned strings in order to forbid them, and a
 * guard that cannot tell a warning from a violation punishes the documentation.
 */
const publicText = storyStops
  .flatMap((s) => [s.headline, ...s.chapters, ...(s.figures ?? []).map((f) => `${f.value} ${f.label}`)])
  .join(' ')
  .toLowerCase();

describe('claim hygiene', () => {
  it('never labels the revenue carve-out as signed or audited', () => {
    // `/DECISIONS.md` ruling H. The figure is right; the adjective was not.
    // The page must not ASSERT it is signed; saying it is NOT signed is the fix,
    // so match on the affirmative claim rather than the bare word.
    expect(publicText).not.toMatch(/(is|was) accountant-signed/);
    expect(publicText).not.toMatch(/(is|was) an audited/);
    expect(publicText).toContain('not accountant-signed');
  });

  it('carries a claims status on every figure', () => {
    for (const stop of storyStops) {
      for (const figure of stop.figures ?? []) {
        expect(figure.claim, `${stop.id}: ${figure.label}`).toBeTruthy();
      }
    }
  });

  it('does not restate modelled economics as verified', () => {
    const economics = storyStops.find((s) => s.id === 'economics');
    const modelled = economics?.figures?.filter((f) => f.value.includes('425.74') || f.value.includes('420.74'));
    expect(modelled).toHaveLength(2);
    for (const f of modelled ?? []) expect(f.claim).toBe('modelled');
  });

  it('never reinstates the retired beds-per-year figure', () => {
    // It divided $329/bed into rentPerYear, a RENT figure read as an operating cost.
    expect(publicText).not.toMatch(/75\s*(-|to)\s*100 beds/);
  });

  it('never claims a health outcome', () => {
    // Claim ceiling: scabies-to-RHD is the WHY, never a claimed outcome.
    expect(publicText).not.toMatch(/reduced (rheumatic|scabies|hospitalisation)/);
  });
});

describe('voice consent', () => {
  it('names only voices that exist in the external clearance list', () => {
    const named = storyStops.flatMap((s) => s.voiceNames ?? []);
    expect(named.length).toBeGreaterThan(0);
    for (const name of named) {
      expect(isClearedForExternal(name), `${name} is not in cleared-voices.ts`).toBe(true);
    }
  });

  it('never gives Xavier a first-person quote', () => {
    // He is narratedBy Fred Campbell in the registry. A borrowed quote would read
    // cleaner and would be a fabrication.
    const named = storyStops.flatMap((s) => s.voiceNames ?? []);
    expect(named).not.toContain('Xavier');
  });
});

describe('media exists on disk', () => {
  // A path typed correctly and pointing at nothing renders a broken poster in
  // production and nowhere else. Check it here, where it is cheap.
  //
  // This doubles as a GITIGNORE guard, which is the failure it actually caught.
  // CI runs on a fresh checkout, so "exists on disk" there means "tracked by
  // git". Locally an ignored file is present and every check passes; in CI it is
  // absent and this fails. `v2/.gitignore:45` ignores `public/video/*.mp4`, which
  // matches only the top level, so partner subdirectories are tracked and the
  // top-level cuts are not. That distinction is invisible without this test.
  const publicDir = resolve(__dirname, '../../../public');
  const localPath = (p: string) => resolve(publicDir, p.replace(/^\//, ''));

  it('has every stop photo and gallery image on disk', () => {
    for (const stop of storyStops) {
      const images = [stop.photo, ...(stop.gallery ?? [])].filter(Boolean) as { src: string }[];
      for (const img of images) {
        expect(existsSync(localPath(img.src)), `${stop.id}: ${img.src}`).toBe(true);
      }
    }
  });

  it('has the opening image on disk', () => {
    expect(existsSync(localPath(storyOpening.photo.src))).toBe(true);
  });

  it('has every local video and its poster on disk', () => {
    for (const stop of storyStops) {
      for (const v of stop.videos ?? []) {
        if (v.kind !== 'local') continue;
        expect(existsSync(localPath(v.src)), `${stop.id}: ${v.src}`).toBe(true);
        expect(existsSync(localPath(v.poster)), `${stop.id}: ${v.poster}`).toBe(true);
      }
    }
  });
});

describe('media gaps', () => {
  it('surfaces missing media rather than hiding it', () => {
    // A gap that renders is a gap somebody can close. A silent fallback is not.
    const gaps = storyGaps();
    expect(gaps.length).toBeGreaterThan(0);
    for (const gap of gaps) {
      expect(gap.reason, `${gap.stopId} gap has no reason`).toBeTruthy();
      expect(gap.wanted).toBeTruthy();
    }
  });

  it('keeps repo paths, file names and consent tiers out of gap text', () => {
    // Gap markers render on ?review=1, which is a URL anyone can guess. Editorial
    // state belongs in `note`, which never reaches the DOM.
    for (const gap of storyGaps()) {
      const text = `${gap.wanted} ${gap.reason}`;
      expect(text, `${gap.stopId}`).not.toMatch(/v2\/|\.tsx?\b|public\/images|\.mjs\b/);
      expect(text, `${gap.stopId}`).not.toMatch(/tier ["'`]?(hold|pending|internal)/i);
      expect(text, `${gap.stopId}`).not.toMatch(/ruling [A-Z]\b/);
    }
  });

  it('leaves the photo null on any stop that declares a photo gap', () => {
    for (const stop of storyStops) {
      if ((stop.gaps ?? []).some((g) => g.slot === 'photo')) {
        expect(stop.photo, `${stop.id} declares a photo gap but has a photo`).toBeNull();
      }
    }
  });
});

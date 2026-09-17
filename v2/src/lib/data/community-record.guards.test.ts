/**
 * Guards for community-record.ts.
 *
 * The join is the risk. Every assertion below is a way the join can be silently wrong while
 * every individual module stays correct and its own guards stay green.
 */

import { describe, it, expect } from 'vitest';
import { resolvePlace } from './place-registry';
import {
  communityRecord,
  allCommunityIds,
  communityIdForPathway,
  pathwayForCommunity,
  isPublishable,
  withStorytellers,
  PATHWAY_TO_COMMUNITY,
} from './community-record';
import { COMMUNITY_BED_CANON, communityCanonTotals } from './community-canonical';
import { COMMUNITY_PATHWAYS, MODULES } from './community-pathways';
import { SITE_OWNERSHIP_TESTS } from './ownership-test';
import { WASHERS_IN_COMMUNITY_BY_COMMUNITY } from './asset-canonical';

const AS_OF = '2026-08-02';

describe('the join resolves', () => {
  it('every pathway resolves to a community id that exists somewhere', () => {
    for (const pathway of COMMUNITY_PATHWAYS) {
      const id = communityIdForPathway(pathway.id);
      expect(
        allCommunityIds().includes(id),
        `pathway '${pathway.id}' maps to community '${id}', which no module knows. Add it to ` +
          `PATHWAY_TO_COMMUNITY or fix the id.`,
      ).toBe(true);
    }
  });

  it('Oonchiumpa reaches Alice Springs assets, which a naive id join drops', () => {
    // The specific failure PATHWAY_TO_COMMUNITY exists for. Oonchiumpa is the site closest to a
    // handover and its beds are counted under alice-springs.
    const record = communityRecord('alice-springs', { asOf: AS_OF });
    expect(record).not.toBeNull();
    expect(record!.assets).not.toBeNull();
    expect(record!.assets!.value.beds).toBe(16);
    expect(record!.stage, 'Oonchiumpa pathway did not attach to alice-springs').not.toBeNull();
    expect(record!.handover, 'the Oonchiumpa handover test did not attach').not.toBeNull();
  });

  it('every exception in PATHWAY_TO_COMMUNITY is still needed', () => {
    // An exception that has become an identity mapping is dead weight that hides the real ones.
    for (const [pathwayId, communityId] of Object.entries(PATHWAY_TO_COMMUNITY)) {
      expect(
        pathwayId,
        `PATHWAY_TO_COMMUNITY maps '${pathwayId}' to itself. Delete the entry.`,
      ).not.toBe(communityId);
      expect(
        COMMUNITY_PATHWAYS.some((p) => p.id === pathwayId),
        `PATHWAY_TO_COMMUNITY has '${pathwayId}', which is not a pathway.`,
      ).toBe(true);
    }
  });

  it('every ownership-test site attaches to the record for its community', () => {
    for (const site of SITE_OWNERSHIP_TESTS) {
      const id = communityIdForPathway(site.pathwayId);
      const record = communityRecord(id, { asOf: AS_OF });
      expect(record?.handover, `no handover on '${id}' for site '${site.siteName}'`).toBeTruthy();
    }
  });
});

describe('the numbers are the canon numbers, not new ones', () => {
  it('bed counts match community-canonical exactly', () => {
    for (const canon of COMMUNITY_BED_CANON) {
      const record = communityRecord(canon.id, { asOf: AS_OF });
      expect(record!.assets!.value.basketBeds).toBe(canon.basketBeds);
      expect(record!.assets!.value.stretchBeds).toBe(canon.stretchBeds);
      expect(record!.assets!.value.beds).toBe(canon.basketBeds + canon.stretchBeds);
    }
  });

  it('summing every record reproduces the canonical totals', () => {
    // If the join drops or double-counts a community this fails, and no other guard would.
    const totals = communityCanonTotals();
    const summed = allCommunityIds()
      .map((id) => communityRecord(id, { asOf: AS_OF })!)
      .filter((r) => r.assets)
      .reduce(
        (acc, r) => ({
          beds: acc.beds + r.assets!.value.beds,
          washers: acc.washers + r.assets!.value.washers,
        }),
        { beds: 0, washers: 0 },
      );
    expect(summed.beds).toBe(totals.beds);
    expect(summed.washers).toBe(totals.washersInCommunity);
  });

  it('washer counts come from the curated map and are never derived', () => {
    for (const [id, count] of Object.entries(WASHERS_IN_COMMUNITY_BY_COMMUNITY)) {
      const record = communityRecord(id, { asOf: AS_OF });
      if (!record?.assets) continue;
      expect(record.assets.value.washers).toBe(count);
    }
  });

  it('a community with no washer entry reads 0, not undefined', () => {
    const record = communityRecord('kalgoorlie', { asOf: AS_OF });
    expect(record!.assets!.value.washers).toBe(0);
  });
});

describe('consent travels with the value', () => {
  it('nothing unconfirmed is ever publishable', () => {
    // The whole point of the file. If this inverts, a proposal a community has not seen becomes
    // renderable on an open page by a surface that filters correctly.
    for (const id of allCommunityIds()) {
      const record = communityRecord(id, { asOf: AS_OF })!;
      if (record.stage) expect(isPublishable(record.stage)).toBe(false);
      if (record.modules) expect(isPublishable(record.modules)).toBe(false);
      if (record.nextDecision) expect(isPublishable(record.nextDecision)).toBe(false);
      if (record.handover) expect(isPublishable(record.handover)).toBe(false);
    }
  });

  it('the handover test is internal at every site', () => {
    // SOVEREIGNTY_GATE: the community controls what is published about the site.
    for (const site of SITE_OWNERSHIP_TESTS) {
      const record = communityRecord(communityIdForPathway(site.pathwayId), { asOf: AS_OF })!;
      expect(record.handover!.consent).toBe('internal');
    }
  });

  it('asset counts are cleared, because delivered goods propose nothing', () => {
    const record = communityRecord('utopia', { asOf: AS_OF })!;
    expect(record.assets!.consent).toBe('cleared');
    expect(isPublishable(record.assets!)).toBe(true);
  });

  it('storytellers start at zero and only a cleared count attaches', () => {
    const record = communityRecord('utopia', { asOf: AS_OF })!;
    expect(record.storytellers.value.count).toBe(0);
    const attached = withStorytellers(record, 4);
    expect(attached.storytellers.value.count).toBe(4);
    expect(attached.storytellers.consent).toBe('cleared');
  });
});

describe('the module menu is a menu', () => {
  it('every pathway record carries all nine modules, asked-for or not', () => {
    // A surface must be able to show what was NOT chosen. Filtering to the chosen ones here
    // would rebuild the program model the module model replaced.
    for (const pathway of COMMUNITY_PATHWAYS) {
      const record = communityRecord(communityIdForPathway(pathway.id), { asOf: AS_OF })!;
      expect(record.modules!.value).toHaveLength(MODULES.length);
      expect(record.modules!.value.map((m) => m.id)).toEqual(MODULES.map((m) => m.id));
    }
  });

  it('a module the community never raised reads not-assessed, never later', () => {
    // 'later' is something a community said. Defaulting to it would put words in their mouth.
    for (const pathway of COMMUNITY_PATHWAYS) {
      const record = communityRecord(communityIdForPathway(pathway.id), { asOf: AS_OF })!;
      for (const module of record.modules!.value) {
        const raised = pathway.modules.find((m) => m.id === module.id);
        if (!raised) expect(module.state).toBe('not-assessed');
      }
    }
  });
});

describe('absence is reported as absence', () => {
  it('a delivered community with no pathway returns assets and null pathway fields', () => {
    const record = communityRecord('kalgoorlie', { asOf: AS_OF })!;
    expect(record.assets).not.toBeNull();
    expect(pathwayForCommunity('kalgoorlie')).toBeUndefined();
    expect(record.stage).toBeNull();
    expect(record.modules).toBeNull();
    expect(record.handover).toBeNull();
  });

  it('an unknown id returns null rather than an empty record', () => {
    expect(communityRecord('not-a-community', { asOf: AS_OF })).toBeNull();
  });

  it('omitting asOf returns a null handover rather than guessing at today', () => {
    // A public surface must be able to build a record without inventing a date, because a build
    // that reaches for today's date stops being reproducible.
    const record = communityRecord('alice-springs')!;
    expect(record.assets).not.toBeNull();
    expect(record.handover).toBeNull();
  });

  it('every /communities/[slug] page id resolves to a record with publishable assets', async () => {
    // The page runs on communityLocations ids and the register runs on canon ids. When one
    // drifts (utopia-homelands vs utopia), communityRecord() returns null and the page falls
    // back to multiplying every bed by 20kg — the overstatement this module exists to fix,
    // invisible to every module-level guard because the join itself is what broke.
    const { communityLocations } = await import('./content');
    for (const c of communityLocations) {
      const record = communityRecord(c.id, { asOf: AS_OF });
      expect(record, `communityRecord('${c.id}') must not be null`).not.toBeNull();
      expect(record!.assets, `communityRecord('${c.id}').assets must exist`).not.toBeNull();
    }
  });

  it('is pure: the same asOf gives the same answer', () => {
    const a = communityRecord('utopia', { asOf: AS_OF });
    const b = communityRecord('utopia', { asOf: AS_OF });
    expect(a).toEqual(b);
  });
});

/**
 * Added 17 September 2026. The module's own comment records the Utopia id mismatch, which made
 * communityRecord return null for the community it was written to fix. The same bug was found
 * again that day in the other direction: canon keys Mt Isa as `mount-isa` and the live communities
 * table calls it `mt-isa`, so the admin drill page got null for a community with beds in it.
 *
 * Both sides fold through the place registry now. These guards are what stop the third one.
 */
describe('every canon community resolves, whatever it is spelled', () => {
  const LIVE_IDS = [
    'alice-springs', 'ampilatwatja', 'angurugu', 'aurukun', 'borroloola', 'canberra', 'ceduna',
    'cherbourg', 'darwin', 'doomadgee', 'galiwinku', 'groote-archipelago', 'gunbalanya',
    'kalgoorlie', 'katherine', 'kowanyama', 'kununurra', 'lajamanu', 'maningrida', 'mt-isa',
    'mutitjulu', 'ngukurr', 'palm-island', 'port-augusta', 'ramingining', 'tennant-creek',
    'torres-strait', 'umbakumba', 'utopia', 'wadeye', 'woorabinda', 'yarrabah', 'yuendumu',
  ];

  it('every canon community id is a place the registry knows', () => {
    for (const id of allCommunityIds()) {
      expect(resolvePlace(id)?.id, `canon id "${id}" resolves to nothing`).toBeTruthy();
    }
  });

  it('a canon community is reachable by the id the live table uses', () => {
    for (const id of allCommunityIds()) {
      const live = resolvePlace(id)?.id;
      if (!live || !LIVE_IDS.includes(live)) continue;
      expect(communityRecord(live), `communityRecord("${live}") is null and canon holds "${id}"`).not.toBeNull();
    }
  });

  it('Mt Isa, the one that was broken, resolves from both spellings to the same record', () => {
    const a = communityRecord('mt-isa');
    const b = communityRecord('mount-isa');
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    expect(a?.assets?.value.beds).toBe(b?.assets?.value.beds);
  });

  it('Utopia, the one the module was written for, still resolves from both', () => {
    expect(communityRecord('utopia')?.assets?.value.beds).toBe(communityRecord('utopia-homelands')?.assets?.value.beds);
  });
});

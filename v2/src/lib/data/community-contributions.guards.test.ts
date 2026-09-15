/**
 * Made with community names what people did for Goods. Each guard here stops a
 * way that could put a false or unconsented claim about a person on the pitch.
 */
import { describe, expect, it } from 'vitest';
import { isClearedForExternal } from '@/lib/data/cleared-voices';
import { CONTRIBUTIONS, CONTRIBUTIONS_CONFIRMED, communityVoices } from '@/lib/data/community-contributions';
import { getStoryteller } from '@/lib/data/storyteller-registry';

describe('made with community', () => {
  it('names nobody in CONTRIBUTIONS who is not an external-tier, cleared voice', () => {
    for (const name of Object.keys(CONTRIBUTIONS)) {
      expect(getStoryteller(name)?.tier, name).toBe('external');
      expect(isClearedForExternal(name), name).toBe(true);
    }
  });

  it('shows only cleared voices, and every quote is verbatim from the registry', () => {
    for (const v of communityVoices()) {
      expect(isClearedForExternal(v.name), v.name).toBe(true);
      if (v.quote) {
        const record = getStoryteller(v.name)!;
        expect(record.quotes.some((q) => q.text === v.quote!.text && (q.status === 'primary' || q.status === 'approved')), v.name).toBe(true);
      }
    }
  });

  it('never gives a narrated young person words of their own', () => {
    for (const v of communityVoices()) {
      if (getStoryteller(v.name)?.narratedBy) expect(v.quote, v.name).toBeNull();
    }
  });

  it('uses a portrait only where the registry holds one', () => {
    for (const v of communityVoices()) expect(v.portrait).toBe(getStoryteller(v.name)?.portrait ?? null);
  });

  // Flipping CONTRIBUTIONS_CONFIRMED is Ben's decision. This fails the day it is
  // flipped so the commit that flips it has to say who confirmed and when.
  it('is still a draft, so the section stays out of production builds', () => {
    expect(CONTRIBUTIONS_CONFIRMED).toBe(false);
  });
});

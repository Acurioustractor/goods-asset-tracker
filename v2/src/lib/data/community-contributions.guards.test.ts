/**
 * The listening map puts named people, their words and their faces at the end of
 * the pitch. Each guard stops a way that could put an unconsented or false thing
 * about a person on it.
 */
import { describe, expect, it } from 'vitest';
import { isClearedForExternal } from '@/lib/data/cleared-voices';
import { listeningPlaces, listeningVoices, readContributions } from '@/lib/data/community-contributions';
import { communityLocations } from '@/lib/data/content';
import { getStoryteller } from '@/lib/data/storyteller-registry';

describe('listening map', () => {
  const file = readContributions();
  const voices = listeningVoices();

  it('carries no roles: the settings file holds only place and photo choices', () => {
    for (const [name, s] of Object.entries(file.people)) {
      expect(Object.keys(s).every((k) => k === 'place' || k === 'showPhoto' || k === 'photoFocus'), name).toBe(true);
    }
  });

  it('only cleared, external-tier voices appear or are set', () => {
    for (const v of voices) expect(isClearedForExternal(v.name), v.name).toBe(true);
    for (const name of Object.keys(file.people)) expect(getStoryteller(name)?.tier, name).toBe('external');
  });

  it('every quote is an approved line from the registry, verbatim', () => {
    for (const v of voices) {
      if (!v.quote) continue;
      expect(getStoryteller(v.name)!.quotes.some((q) => q.text === v.quote!.text && (q.status === 'primary' || q.status === 'approved')), v.name).toBe(true);
    }
  });

  it('never gives a narrated young person words of their own', () => {
    for (const v of voices) if (getStoryteller(v.name)?.narratedBy) expect(v.quote, v.name).toBeNull();
  });

  it('shows a portrait only where the registry holds one, and never when hidden', () => {
    for (const v of voices) {
      if (v.photoHidden) expect(v.portrait, v.name).toBeNull();
      else expect(v.portrait, v.name).toBe(getStoryteller(v.name)?.portrait ?? null);
    }
  });

  it('a place moved by hand is a real place on the map', () => {
    const names = communityLocations.map((l) => l.name);
    for (const [name, s] of Object.entries(file.people)) if (s.place) expect(names, name).toContain(s.place);
  });

  it('places what the community asked for only in Goods\' own agreed words', () => {
    for (const p of listeningPlaces(communityLocations, voices)) if (p.asked) expect(p.asked.source).toMatch(/road-ending\.ts|case-studies\.ts/);
  });

  it('a confirmed set says who confirmed it and when', () => {
    if (file.confirmed) {
      expect(file.confirmedBy).toBeTruthy();
      expect(file.confirmedAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
    } else {
      expect(file.confirmedBy).toBeNull();
    }
  });
});

// The listening map: the closing surprise on /pitch.
//
// Places first, people in their own words, and what the community asked for in
// Goods' own agreed wording (road-ending.ts PATHWAY_ASKS, and the Maningrida case
// study). It deliberately assigns NO roles: an earlier draft labelled people
// "asked", "backed", "built", which read as though they worked for Goods. Nothing
// here says what a person did for anyone. It says where they are and what they said.
//
// Two things about a person are set by hand in v2/data/community-contributions.json:
// which place they are shown under, and how their photo is framed or whether it is
// shown. Any change there is a change about a person: set `confirmed` back to false
// in the same commit. Until it is true the section renders only in development.
//
// Voices come only from storyteller-registry.ts at tier 'external', with their
// approved or primary quote, verbatim. Portraits only where the registry holds one.

// Imported, not read from disk: a runtime file read works locally and finds nothing
// on Vercel, where the server bundle does not carry v2/data (see pitch-content.tsx).
import contributions from '../../../data/community-contributions.json';
import { CASE_STUDIES } from '@/lib/data/case-studies';
import type { CommunityLocation } from '@/lib/data/content';
import { PATHWAY_ASKS } from '@/lib/data/road-ending';
import { STORYTELLER_REGISTRY, getStoryteller, type StorytellerRecord } from '@/lib/data/storyteller-registry';

/** photoFocus is a CSS object-position, for a portrait with more than one person in it. */
export interface PersonSetting { place?: string; showPhoto?: boolean; photoFocus?: string }
export interface ContributionsFile {
  confirmed: boolean;
  confirmedBy: string | null;
  confirmedAt: string | null;
  updatedAt: string;
  people: Record<string, PersonSetting>;
}

export function readContributions(): ContributionsFile {
  return contributions as ContributionsFile;
}

export function contributionsConfirmed(): boolean {
  return readContributions().confirmed === true;
}

/** One place name per registry community string, matching the live map's names. */
export function placeOf(community: string): string | null {
  const c = community.toLowerCase();
  const known: [RegExp, string][] = [
    [/utopia|arlparra|urapuntja/, 'Utopia Homelands'], [/tennant/, 'Tennant Creek'], [/palm/, 'Palm Island'],
    [/maningrida|gamardi/, 'Maningrida'], [/kalgoorlie/, 'Kalgoorlie'], [/alice/, 'Alice Springs'],
    [/mount isa/, 'Mount Isa'], [/darwin/, 'Darwin'], [/katherine/, 'Katherine'], [/kununurra/, 'Kununurra'],
  ];
  return known.find(([re]) => re.test(c))?.[1] ?? null;
}

export interface ListeningVoice {
  name: string;
  role: string;
  community: string;
  place: string | null;
  portrait: string | null;
  photoFocus: string | null;
  quote: { text: string; context: string } | null;
  young: boolean;
  placeMoved: boolean;
  photoHidden: boolean;
}

export interface ListeningPlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  beds: number;
  voices: string[];
  country: string | null;
  asked: { field: string; size: string; body: string; standing: string; whoseCall: string; source: string } | null;
}

function toVoice(r: StorytellerRecord, settings: Record<string, PersonSetting>): ListeningVoice {
  const quotes = r.quotes.filter((q) => q.status === 'primary' || q.status === 'approved');
  const quote = quotes.find((q) => q.status === 'primary') ?? quotes[0] ?? null;
  const s = settings[r.name] ?? {};
  return {
    name: r.name,
    role: r.role,
    community: r.community,
    place: s.place ?? placeOf(r.community),
    portrait: s.showPhoto === false ? null : r.portrait,
    photoFocus: s.photoFocus ?? null,
    // A young person whose story is told by someone else is never given words of their own.
    quote: r.narratedBy ? null : quote ? { text: quote.text, context: quote.context ?? '' } : null,
    young: /young|youth/i.test(r.role) || /young person/i.test(r.notes ?? ''),
    placeMoved: Boolean(s.place),
    photoHidden: s.showPhoto === false,
  };
}

export function listeningVoices(): ListeningVoice[] {
  const { people } = readContributions();
  return STORYTELLER_REGISTRY.filter((r) => r.tier === 'external').map((r) => toVoice(r, people));
}

/** What the community asked for, in Goods' own agreed words. Alice Springs is where Oonchiumpa is. */
function askedFor(place: string): ListeningPlace['asked'] {
  const ask = PATHWAY_ASKS.find((a) => a.place === place || (a.id === 'oonchiumpa' && place === 'Alice Springs'));
  if (ask) return { field: ask.field, size: ask.size, body: ask.body, standing: ask.whatWeCanSay, whoseCall: ask.whoseCall, source: 'road-ending.ts PATHWAY_ASKS' };
  const study = CASE_STUDIES.find((c) => c.place === place);
  // The partner is named only where the case study has cleared the name for a public page.
  if (study) return { field: 'Asked for', size: study.title, body: study.standfirst, standing: study.momentum[0] ?? study.steps[study.steps.length - 1]?.body ?? '', whoseCall: study.partner.nameCleared ? study.partner.name : study.partner.role, source: 'case-studies.ts' };
  return null;
}

/** Places with voices or a recorded ask. Projected onto the map in the client, where the map's projection lives. */
export function listeningPlaces(locations: CommunityLocation[], voices: ListeningVoice[]): ListeningPlace[] {
  return locations
    .map((l) => ({
      id: l.id, name: l.name, lat: l.lat, lng: l.lng, beds: l.bedsDelivered,
      voices: voices.filter((v) => v.place === l.name).map((v) => v.name),
      country: PATHWAY_ASKS.find((a) => a.place === l.name || (a.id === 'oonchiumpa' && l.name === 'Alice Springs'))?.country ?? CASE_STUDIES.find((c) => c.place === l.name)?.country ?? null,
      asked: askedFor(l.name),
    }))
    .filter((p) => p.voices.length > 0 || p.asked);
}

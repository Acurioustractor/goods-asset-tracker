// Resolves a funder URL-map entry to a fully-fledged voice record:
// photo, name, location, verified pull quote, and the recommended URL.
//
// Used by /funders/[slug] to feature the right storyteller for the right
// funder type at the top of the brief, instead of a one-size-fits-all gallery.

import { quotes, journeyStories } from '@/lib/data/content';
import type { FunderUrlEntry, StorytellerKey } from '@/lib/data/funder-url-map';
import { FUNDER_URL_MAP } from '@/lib/data/funder-url-map';

export interface ResolvedFunderVoice {
  /** Storyteller key, also serves as photo filename slug */
  id: StorytellerKey;
  /** Public-facing name */
  name: string;
  /** "Community" or "Role, Community" */
  location: string;
  /** Photo path under /v2/public/images/people/ */
  photo: string;
  /** Photo alt text */
  photoAlt: string;
  /** Verified pull quote */
  quote: string;
  /** Context line under the quote (e.g. "On the freight tax") */
  quoteContext: string;
}

export interface ResolvedFunderRecommendation {
  entry: FunderUrlEntry;
  voice: ResolvedFunderVoice | null;
  /** Absolute or relative URL to send to this funder type */
  primaryUrl: string;
  /** Optional secondary follow-up URL */
  secondaryUrl?: string;
}

// Maps a StorytellerKey to a content.ts quote `author` and a default photo.
// Pull quote is sourced from the verified quotes array; when multiple match,
// pick the one whose theme is most resonant for the speaker.
const STORYTELLER_TO_AUTHOR: Record<StorytellerKey, { author: string; preferTheme?: string; photo: string; location: string }> = {
  'dianne-stokes': { author: 'Dianne Stokes', preferTheme: 'co-design', photo: '/images/people/dianne-stokes.jpg', location: 'Elder, Tennant Creek' },
  'norman-frank': { author: 'Norman Frank', preferTheme: 'community-need', photo: '/images/people/norman-frank.jpg', location: 'Elder, Tennant Creek' },
  'linda-turner': { author: 'Linda Turner', preferTheme: 'co-design', photo: '/images/people/linda-turner.jpg', location: 'Tennant Creek' },
  'patricia-frank': { author: 'Patricia Frank', preferTheme: 'washing-machine', photo: '/images/people/patricia-frank.jpg', location: 'Tennant Creek' },
  'cliff-plummer': { author: 'Cliff Plummer', preferTheme: 'health', photo: '/images/people/cliff-plummer.jpg', location: 'Tennant Creek' },
  'ivy': { author: 'Ivy', preferTheme: 'community-need', photo: '/images/people/ivy.jpg', location: 'Palm Island' },
  'alfred-johnson': { author: 'Alfred Johnson', preferTheme: 'dignity', photo: '/images/people/alfred-johnson.jpg', location: 'Palm Island' },
  'brian-russell': { author: 'Brian Russell', preferTheme: 'health', photo: '/images/people/brian-russell.jpg', location: 'Tennant Creek' },
  'zelda-hogan': { author: 'Zelda Hogan', preferTheme: 'health', photo: '/images/people/zelda-hogan.jpg', location: 'Tennant Creek' },
  'jessica-allardyce': { author: 'Jessica Allardyce', preferTheme: 'health', photo: '/images/people/jessica-allardyce.jpg', location: 'Miwatj Health, East Arnhem' },
};

function resolveVoice(key: StorytellerKey): ResolvedFunderVoice | null {
  const directory = STORYTELLER_TO_AUTHOR[key];
  if (!directory) return null;

  const verified = quotes.filter((q) => q.author === directory.author && q.verified);
  if (verified.length === 0) {
    // Fall back to journey stories pull quote
    const journey = journeyStories.find((j) => j.person === directory.author);
    if (!journey) return null;
    return {
      id: key,
      name: directory.author,
      location: directory.location,
      photo: directory.photo,
      photoAlt: `${directory.author}, ${directory.location}`,
      quote: journey.pullQuote,
      quoteContext: journey.location,
    };
  }

  // Prefer the themed quote if available, else first verified
  const preferred = directory.preferTheme
    ? verified.find((q) => q.theme === directory.preferTheme)
    : undefined;
  const chosen = preferred ?? verified[0];

  return {
    id: key,
    name: directory.author,
    location: directory.location,
    photo: directory.photo,
    photoAlt: `${directory.author}, ${directory.location}`,
    quote: chosen.text,
    quoteContext: chosen.context,
  };
}

/**
 * Resolve a funder's URL map entry into the renderable bundle.
 * Returns null if the funder is not in FUNDER_URL_MAP.
 */
export function getFunderRecommendation(
  urlMapKey: string,
  host = 'https://www.goodsoncountry.com'
): ResolvedFunderRecommendation | null {
  const entry = FUNDER_URL_MAP[urlMapKey];
  if (!entry) return null;

  const voice = entry.recommendedVoice ? resolveVoice(entry.recommendedVoice) : null;

  const toAbsolute = (path: string | undefined) => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${host}${path}`;
    return path;
  };

  return {
    entry,
    voice,
    primaryUrl: toAbsolute(entry.primaryUrl) ?? '',
    secondaryUrl: toAbsolute(entry.secondaryUrl),
  };
}

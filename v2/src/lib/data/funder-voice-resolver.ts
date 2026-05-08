// Resolves a funder URL-map entry to a fully-fledged voice record:
// photo, name, location, verified pull quote, and the recommended URL.
//
// EL-led: a quote is only included when the recommended storyteller has
// at least one consent-clean Goods story in Empathy Ledger. If EL says the
// storyteller's consent state is Pending review or Withdrawn, the voice
// section returns with quote = "" and consentVerified = false; the funder
// page should hide the quote block in that case.

import { quotes, journeyStories } from '@/lib/data/content';
import type { FunderUrlEntry, StorytellerKey } from '@/lib/data/funder-url-map';
import { FUNDER_URL_MAP } from '@/lib/data/funder-url-map';
import { fetchELStorytellers } from '@/lib/empathy-ledger/featured-voices';

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
  /** Verified pull quote (empty string if EL consent is not yet verified) */
  quote: string;
  /** Context line under the quote (e.g. "On the freight tax") */
  quoteContext: string;
  /** True when this storyteller has at least one consent-clean Goods story in EL. */
  consentVerified: boolean;
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

function resolveVoice(key: StorytellerKey, consentVerified: boolean): ResolvedFunderVoice | null {
  const directory = STORYTELLER_TO_AUTHOR[key];
  if (!directory) return null;

  // If EL consent is not verified, return the photo + name + role
  // but blank the quote — the funder page should hide the quote block.
  if (!consentVerified) {
    return {
      id: key,
      name: directory.author,
      location: directory.location,
      photo: directory.photo,
      photoAlt: `${directory.author}, ${directory.location}`,
      quote: '',
      quoteContext: '',
      consentVerified: false,
    };
  }

  const verified = quotes.filter((q) => q.author === directory.author && q.verified);
  if (verified.length === 0) {
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
      consentVerified: true,
    };
  }

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
    consentVerified: true,
  };
}

/**
 * Resolve a funder's URL map entry into the renderable bundle.
 * Async because we check EL Supabase for the recommended storyteller's
 * consent state before deciding whether to surface their quote.
 *
 * Returns null if the funder is not in FUNDER_URL_MAP.
 */
export async function getFunderRecommendation(
  urlMapKey: string,
  host = 'https://www.goodsoncountry.com'
): Promise<ResolvedFunderRecommendation | null> {
  const entry = FUNDER_URL_MAP[urlMapKey];
  if (!entry) return null;

  let consentVerified = false;
  if (entry.recommendedVoice) {
    const directory = STORYTELLER_TO_AUTHOR[entry.recommendedVoice];
    if (directory) {
      const elVoices = await fetchELStorytellers();
      if (elVoices) {
        consentVerified = elVoices.some((v) =>
          (v.storyteller.display_name ?? '').toLowerCase() === directory.author.toLowerCase()
        );
      }
    }
  }

  const voice = entry.recommendedVoice ? resolveVoice(entry.recommendedVoice, consentVerified) : null;

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

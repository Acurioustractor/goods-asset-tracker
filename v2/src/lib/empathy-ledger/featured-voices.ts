// Server helper: returns featured storyteller voices for the /brand page,
// pulling live from Empathy Ledger with consent filtering, falling back to
// local content.ts data when EL is disabled or returns empty.
//
// Used by v2/src/app/brand/page.tsx. ISR cached at 5 minutes via the EL client.
// EL is hosted at empathy-ledger-v2.vercel.app (NOT on goodsoncountry.com);
// see v2/src/lib/empathy-ledger/client.ts for the EMPATHY_LEDGER_API_URL.

import { empathyLedger } from './client';
import { quotes, journeyStories } from '@/lib/data/content';

export interface FeaturedVoice {
  /** Stable ID. Maps to journeyStories slug or EL story ID. */
  id: string;
  /** Public-facing name as the storyteller wants to be credited. */
  name: string;
  /** "Community" or "Role, Community" */
  location: string;
  /** Local photo path. Always points to v2/public/images/people/. */
  photo: string;
  /** Photo alt text */
  photoAlt: string;
  /** True if EL has a fresh, consent-verified story for this voice. */
  liveFromEL: boolean;
}

export interface PullQuote {
  text: string;
  author: string;
  context: string;
  /** True if this quote came from a live EL pull. */
  liveFromEL: boolean;
}

// Canonical map of storyteller name → local photo + display location.
// Add entries here when a new storyteller is on file.
const VOICE_DIRECTORY: Record<
  string,
  { id: string; photo: string; location: string }
> = {
  'Dianne Stokes': { id: 'dianne-stokes', photo: '/images/people/dianne-stokes.jpg', location: 'Elder, Tennant Creek' },
  'Norman Frank': { id: 'norman-frank', photo: '/images/people/norman-frank.jpg', location: 'Elder, Tennant Creek' },
  'Norman Frank Jupurrurla': { id: 'norman-frank', photo: '/images/people/norman-frank.jpg', location: 'Elder, Tennant Creek' },
  'Linda Turner': { id: 'linda-turner', photo: '/images/people/linda-turner.jpg', location: 'Tennant Creek' },
  'Patricia Frank': { id: 'patricia-frank', photo: '/images/people/patricia-frank.jpg', location: 'Tennant Creek' },
  'Cliff Plummer': { id: 'cliff-plummer', photo: '/images/people/cliff-plummer.jpg', location: 'Tennant Creek' },
  'Brian Russell': { id: 'brian-russell', photo: '/images/people/brian-russell.jpg', location: 'Tennant Creek' },
  Ivy: { id: 'ivy', photo: '/images/people/ivy.jpg', location: 'Palm Island' },
  'Alfred Johnson': { id: 'alfred-johnson', photo: '/images/people/alfred-johnson.jpg', location: 'Palm Island' },
};

const HERO_QUOTE_AUTHORS = ['Linda Turner', 'Ivy', 'Cliff Plummer'] as const;

const FALLBACK_VOICES: FeaturedVoice[] = [
  { id: 'dianne-stokes', name: 'Dianne Stokes', location: 'Elder, Tennant Creek', photo: '/images/people/dianne-stokes.jpg', photoAlt: 'Dianne Stokes, Elder, Tennant Creek', liveFromEL: false },
  { id: 'linda-turner', name: 'Linda Turner', location: 'Tennant Creek', photo: '/images/people/linda-turner.jpg', photoAlt: 'Linda Turner, Tennant Creek', liveFromEL: false },
  { id: 'norman-frank', name: 'Norman Frank', location: 'Elder, Tennant Creek', photo: '/images/people/norman-frank.jpg', photoAlt: 'Norman Frank, Elder, Tennant Creek', liveFromEL: false },
  { id: 'patricia-frank', name: 'Patricia Frank', location: 'Tennant Creek', photo: '/images/people/patricia-frank.jpg', photoAlt: 'Patricia Frank, Tennant Creek', liveFromEL: false },
  { id: 'cliff-plummer', name: 'Cliff Plummer', location: 'Tennant Creek', photo: '/images/people/cliff-plummer.jpg', photoAlt: 'Cliff Plummer, Tennant Creek', liveFromEL: false },
  { id: 'ivy', name: 'Ivy', location: 'Palm Island', photo: '/images/people/ivy.jpg', photoAlt: 'Ivy, Palm Island', liveFromEL: false },
  { id: 'alfred-johnson', name: 'Alfred Johnson', location: 'Palm Island', photo: '/images/people/alfred-johnson.jpg', photoAlt: 'Alfred Johnson, Palm Island', liveFromEL: false },
  { id: 'brian-russell', name: 'Brian Russell', location: 'Tennant Creek', photo: '/images/people/brian-russell.jpg', photoAlt: 'Brian Russell, Tennant Creek', liveFromEL: false },
];

/**
 * Pull featured storyteller voices for the /brand page.
 * Tries EL first (consent-verified, current). Falls back to local on failure.
 *
 * @param limit max number of voices to return (default 8)
 */
export async function getFeaturedVoices(limit = 8): Promise<FeaturedVoice[]> {
  try {
    const stories = await empathyLedger.getStories({ limit: 20 });

    if (stories.length === 0) {
      return FALLBACK_VOICES.slice(0, limit);
    }

    // Build a deduped list of unique storytellers with photo lookup.
    const seen = new Set<string>();
    const voices: FeaturedVoice[] = [];

    for (const story of stories) {
      const name = story.storytellerName ?? story.authorName;
      if (!name || seen.has(name)) continue;

      const directory = VOICE_DIRECTORY[name];
      if (!directory) continue; // Skip storytellers without a local photo on file

      seen.add(name);
      voices.push({
        id: directory.id,
        name,
        location: directory.location,
        photo: directory.photo,
        photoAlt: `${name}, ${directory.location}`,
        liveFromEL: true,
      });

      if (voices.length >= limit) break;
    }

    // If EL didn't yield enough mapped voices, top up with fallback (no duplicates)
    if (voices.length < limit) {
      for (const fallback of FALLBACK_VOICES) {
        if (voices.length >= limit) break;
        if (!seen.has(fallback.name)) {
          seen.add(fallback.name);
          voices.push(fallback);
        }
      }
    }

    return voices;
  } catch (err) {
    console.error('[featured-voices] EL pull failed, using fallback:', err);
    return FALLBACK_VOICES.slice(0, limit);
  }
}

/**
 * Three pull quotes for the brand-page hero band.
 * Always uses verified content.ts quotes (single source of truth for direct
 * quotations) to avoid risk of EL summary text being treated as a verbatim quote.
 * The `liveFromEL` flag tracks whether the storyteller is also represented
 * in a current EL syndicated story.
 */
export async function getHeroQuotes(): Promise<PullQuote[]> {
  let liveAuthors: Set<string> = new Set();

  try {
    const stories = await empathyLedger.getStories({ limit: 20 });
    liveAuthors = new Set(
      stories
        .map((s) => s.storytellerName ?? s.authorName)
        .filter((n): n is string => Boolean(n))
    );
  } catch {
    // Ignore — fall back to non-EL-flagged quotes
  }

  return HERO_QUOTE_AUTHORS.map((author) => {
    const q = quotes.find((entry) => entry.author === author && entry.verified);
    if (!q) return null;
    return {
      text: q.text,
      author: q.author,
      context: q.context,
      liveFromEL: liveAuthors.has(author),
    };
  }).filter((q): q is PullQuote => q !== null);
}

/**
 * Six pre-written narrative arcs from journeyStories (always from content.ts).
 * Returns the list with a flag if the storyteller has an active EL story.
 */
export async function getJourneyNarratives(): Promise<
  Array<{
    id: string;
    title: string;
    person: string;
    location: string;
    pullQuote: string;
    liveFromEL: boolean;
  }>
> {
  let liveAuthors: Set<string> = new Set();

  try {
    const stories = await empathyLedger.getStories({ limit: 20 });
    liveAuthors = new Set(
      stories
        .map((s) => s.storytellerName ?? s.authorName)
        .filter((n): n is string => Boolean(n))
    );
  } catch {
    // Ignore
  }

  return journeyStories.map((j) => ({
    id: j.id,
    title: j.title,
    person: j.person,
    location: j.location,
    pullQuote: j.pullQuote,
    liveFromEL: liveAuthors.has(j.person),
  }));
}

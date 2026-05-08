// Server helper: returns featured storyteller voices for the /brand page.
//
// EL-led architecture (2026-05-08): Empathy Ledger is canonical for
// storyteller and consent state. We query EL Supabase directly for Goods
// stories with syndication_enabled, consent_not_withdrawn, not_archived,
// then join to the storytellers table for profile + photo.
//
// Local content.ts FALLBACK_VOICES is used only when EL is unreachable.
// The hardcoded VOICE_DIRECTORY is gone; EL drives the gallery.
//
// Photo URL resolution:
//   1. EL profile_image_url (if present and non-empty)
//   2. Local /images/people/{name-slug}.jpg (if file exists; we don't
//      fs-check at request time — the client handles broken image src)
//   3. Empty string (the page renders the alt text instead)
//
// Used by v2/src/app/brand/page.tsx and v2/src/app/api/press-kit/route.ts.
// ISR cached at 5 minutes via the calling page.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { quotes, journeyStories } from '@/lib/data/content';

export interface FeaturedVoice {
  /** Stable ID. EL storyteller UUID when sourced from EL, name-slug otherwise. */
  id: string;
  /** Public-facing name. */
  name: string;
  /** "Community" or "Role, Community" */
  location: string;
  /** Photo URL: EL profile_image_url, or local fallback path. */
  photo: string;
  /** Photo alt text */
  photoAlt: string;
  /** True if the row came from a live EL pull with consent verified. */
  liveFromEL: boolean;
  /** True if EL marks the storyteller as an Elder. */
  isElder?: boolean;
  /** Number of consent-clean Goods stories on this person in EL. */
  storyCount?: number;
}

export interface PullQuote {
  text: string;
  author: string;
  context: string;
  /** True if the speaker has at least one consent-clean EL story for Goods. */
  liveFromEL: boolean;
}

// ---- EL Supabase client (lazy, server-only) -------------------------------

let _elClient: SupabaseClient | null = null;
function elClient(): SupabaseClient | null {
  if (_elClient) return _elClient;
  const url = process.env.EMPATHY_LEDGER_SUPABASE_URL;
  const key = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
  if (!url || !key) return null;
  _elClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _elClient;
}

const GOODS_PROJECT_ID =
  process.env.EMPATHY_LEDGER_PROJECT_ID || '6bd47c8a-e676-456f-aa25-ddcbb5a31047';

// ---- Local fallback (only used on EL outage) ------------------------------

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const LOCAL_PHOTO_BY_NAME: Record<string, string> = {
  'Dianne Stokes': '/images/people/dianne-stokes.jpg',
  'Norman Frank': '/images/people/norman-frank.jpg',
  'Norman Frank Jupurrurla': '/images/people/norman-frank.jpg',
  'Linda Turner': '/images/people/linda-turner.jpg',
  'Patricia Frank': '/images/people/patricia-frank.jpg',
  'Cliff Plummer': '/images/people/cliff-plummer.jpg',
  'Brian Russell': '/images/people/brian-russell.jpg',
  Ivy: '/images/people/ivy.jpg',
  'Alfred Johnson': '/images/people/alfred-johnson.jpg',
};

const FALLBACK_VOICES: FeaturedVoice[] = [
  { id: 'dianne-stokes', name: 'Dianne Stokes', location: 'Elder, Tennant Creek', photo: '/images/people/dianne-stokes.jpg', photoAlt: 'Dianne Stokes, Elder, Tennant Creek', liveFromEL: false, isElder: true },
  { id: 'cliff-plummer', name: 'Cliff Plummer', location: 'Tennant Creek', photo: '/images/people/cliff-plummer.jpg', photoAlt: 'Cliff Plummer, Tennant Creek', liveFromEL: false },
  { id: 'fred-campbell', name: 'Fred Campbell', location: 'Alice Springs', photo: '', photoAlt: 'Fred Campbell, Alice Springs (portrait pending)', liveFromEL: false },
];

// ---- EL query: Goods storytellers with consent-clean stories --------------

interface ELStoryRow {
  id: string;
  title: string | null;
  storyteller_id: string | null;
  story_image_url: string | null;
  location: string | null;
  themes: unknown;
  published_at: string | null;
}

interface ELStorytellerRow {
  id: string;
  display_name: string | null;
  location: string | null;
  bio: string | null;
  is_elder: boolean | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  profile_image_url: string | null;
  cultural_background: string | null;
  tags: unknown;
}

interface ELStorytellerVoice {
  storyteller: ELStorytellerRow;
  stories: ELStoryRow[];
}

/**
 * Query EL Supabase for Goods storytellers with consent-clean stories.
 * Returns null on any failure (caller falls back to local).
 */
async function fetchELStorytellers(): Promise<ELStorytellerVoice[] | null> {
  const client = elClient();
  if (!client) return null;

  try {
    const { data: stories, error: storiesErr } = await client
      .from('stories')
      .select('id,title,storyteller_id,story_image_url,location,themes,published_at')
      .eq('project_id', GOODS_PROJECT_ID)
      .eq('syndication_enabled', true)
      .is('consent_withdrawn_at', null)
      .eq('is_archived', false)
      .not('storyteller_id', 'is', null)
      .order('published_at', { ascending: false, nullsFirst: false });

    if (storiesErr) {
      console.error('[featured-voices] EL stories query failed:', storiesErr.message);
      return null;
    }
    if (!stories || stories.length === 0) return [];

    const storytellerIds = [
      ...new Set((stories as ELStoryRow[]).map((s) => s.storyteller_id).filter((id): id is string => Boolean(id))),
    ];
    if (storytellerIds.length === 0) return [];

    const { data: storytellers, error: stErr } = await client
      .from('storytellers')
      .select('id,display_name,location,bio,is_elder,is_featured,is_active,profile_image_url,cultural_background,tags')
      .in('id', storytellerIds);

    if (stErr) {
      console.error('[featured-voices] EL storytellers query failed:', stErr.message);
      return null;
    }

    const tellerById = new Map<string, ELStorytellerRow>();
    for (const t of (storytellers ?? []) as ELStorytellerRow[]) tellerById.set(t.id, t);

    const grouped = new Map<string, ELStorytellerVoice>();
    for (const s of stories as ELStoryRow[]) {
      const sid = s.storyteller_id;
      if (!sid) continue;
      const teller = tellerById.get(sid);
      if (!teller || teller.is_active === false) continue;
      // Skip non-person organisational records (heuristic: contains "Team" or "Organization")
      if (teller.display_name && /\bteam|organization|organisation\b/i.test(teller.display_name)) {
        continue;
      }
      if (!grouped.has(sid)) grouped.set(sid, { storyteller: teller, stories: [] });
      grouped.get(sid)!.stories.push(s);
    }

    return Array.from(grouped.values());
  } catch (err) {
    console.error('[featured-voices] EL pull threw:', err);
    return null;
  }
}

function shortLocation(loc: string | null): string {
  if (!loc) return '';
  // EL stores "Tennant Creek, Northern Territory, Australia"; we want the first part
  return loc.split(',')[0].trim();
}

function elToFeaturedVoice(v: ELStorytellerVoice): FeaturedVoice {
  const t = v.storyteller;
  const name = t.display_name ?? '';
  const community = shortLocation(t.location);
  const role = t.is_elder ? `Elder, ${community}` : community;

  // Photo resolution: EL first, local by-name fallback, empty string
  const photo =
    (t.profile_image_url && t.profile_image_url.trim()) ||
    LOCAL_PHOTO_BY_NAME[name] ||
    '';

  return {
    id: t.id,
    name,
    location: role,
    photo,
    photoAlt: `${name}${role ? `, ${role}` : ''}`,
    liveFromEL: true,
    isElder: !!t.is_elder,
    storyCount: v.stories.length,
  };
}

// ---- Public API -----------------------------------------------------------

/**
 * Featured storyteller voices for the /brand page and press kit.
 *
 * EL-led: returns only storytellers with consent-clean Goods stories in EL.
 * If EL is unreachable, returns the local FALLBACK_VOICES list (3 entries
 * matching the EL audit on 2026-05-08: Dianne, Cliff, Fred).
 *
 * @param limit max number of voices to return (default 8)
 */
export async function getFeaturedVoices(limit = 8): Promise<FeaturedVoice[]> {
  const elVoices = await fetchELStorytellers();
  if (elVoices === null) {
    return FALLBACK_VOICES.slice(0, limit);
  }
  if (elVoices.length === 0) {
    return FALLBACK_VOICES.slice(0, limit);
  }

  const sorted = [...elVoices].sort((a, b) => {
    const af = a.storyteller.is_featured ? 1 : 0;
    const bf = b.storyteller.is_featured ? 1 : 0;
    if (af !== bf) return bf - af;
    return b.stories.length - a.stories.length;
  });

  return sorted.slice(0, limit).map(elToFeaturedVoice);
}

/**
 * Three pull quotes for the brand-page hero band.
 *
 * Quotes themselves come from content.ts (verbatim text we've editorially
 * curated and verified). The liveFromEL flag indicates whether the speaker
 * also has a current consent-clean story in EL — when false, we should
 * not publish the quote externally without re-confirming consent.
 */
export async function getHeroQuotes(): Promise<PullQuote[]> {
  const heroAuthors = ['Dianne Stokes', 'Cliff Plummer', 'Fred Campbell'] as const;
  const elVoices = await fetchELStorytellers();
  const liveAuthors = new Set<string>();
  if (elVoices) {
    for (const v of elVoices) {
      if (v.storyteller.display_name) liveAuthors.add(v.storyteller.display_name);
    }
  }

  const result: PullQuote[] = [];
  for (const author of heroAuthors) {
    const q = quotes.find((entry) => entry.author === author && entry.verified);
    if (q) {
      result.push({
        text: q.text,
        author: q.author,
        context: q.context,
        liveFromEL: liveAuthors.has(author),
      });
    }
  }
  return result;
}

/**
 * Six pre-written narrative arcs from journeyStories (always from content.ts).
 * Returns the list with a flag if the storyteller has a consent-clean EL story.
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
  const elVoices = await fetchELStorytellers();
  const liveAuthors = new Set<string>();
  if (elVoices) {
    for (const v of elVoices) {
      if (v.storyteller.display_name) liveAuthors.add(v.storyteller.display_name);
    }
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

// Re-export for tests / internal use
export { fetchELStorytellers, nameToSlug };

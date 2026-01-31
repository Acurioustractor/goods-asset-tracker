/**
 * Media map — single source of truth for all image/video paths.
 *
 * Resolution order:
 * 1. Empathy Ledger content placements (if EL is enabled and has media assigned)
 * 2. Local file paths defined below (drop files into /public/images/<category>/)
 * 3. Placeholder shown by MediaSlot component
 *
 * To add a photo locally:
 * 1. Drop the file into /public/images/<category>/
 * 2. Update the path here
 * 3. Every page using that slot will pick it up automatically
 *
 * To add a photo via Empathy Ledger:
 * 1. Upload to EL media library
 * 2. Assign to the slot via EL Media Manager (or API)
 * 3. It will automatically appear on the site within 5 minutes (ISR cache)
 *
 * File naming convention:
 *   /public/images/product/stretch-bed-hero.jpg
 *   /public/images/product/greate-bed.jpg
 *   /public/images/product/washing-machine.jpg
 *   /public/images/process/01-source.jpg
 *   /public/images/process/02-process.jpg
 *   /public/images/process/03-cut.jpg
 *   /public/images/process/04-build.jpg
 *   /public/images/process/05-weave.jpg
 *   /public/images/process/06-deliver.jpg
 *   /public/images/community/tennant-creek.jpg
 *   /public/images/community/palm-island.jpg
 *   /public/images/community/alice-springs.jpg
 *   /public/images/community/townsville.jpg
 *   /public/images/people/zelda-hogan.jpg
 *   /public/images/people/brian-russell.jpg
 *   /public/images/people/ivy.jpg
 *   /public/images/people/dianne-stokes.jpg
 *   /public/images/people/linda-turner.jpg
 *   /public/images/people/patricia-frank.jpg
 *   /public/images/pitch/production-plant.jpg
 *   /public/images/pitch/community-closing.jpg
 */

import { empathyLedger } from '@/lib/empathy-ledger';
import type { ContentPlacement } from '@/lib/empathy-ledger';

// ---------- Local fallback map ----------
// Set a path to undefined to show the placeholder, or a string to show the image.
// All paths are relative to /public/

export const media = {
  // --- Products ---
  product: {
    stretchBedHero: undefined as string | undefined,
    // stretchBedHero: '/images/product/stretch-bed-hero.jpg',
    greateBed: undefined as string | undefined,
    washingMachine: undefined as string | undefined,
  },

  // --- Process steps (photo or video URL) ---
  process: {
    source: undefined as string | undefined,
    process: undefined as string | undefined,
    cut: undefined as string | undefined,
    build: undefined as string | undefined,
    weave: undefined as string | undefined,
    deliver: undefined as string | undefined,
  },

  // --- Process step videos (embed URLs) ---
  processVideo: {
    source: undefined as string | undefined,
    process: undefined as string | undefined,
    cut: undefined as string | undefined,
    build: undefined as string | undefined,
    weave: undefined as string | undefined,
    deliver: undefined as string | undefined,
  },

  // --- Community landscapes ---
  community: {
    tennantCreek: '/images/community/tennant-creek.jpg',
    palmIsland: undefined as string | undefined,
    aliceSprings: undefined as string | undefined,
    townsville: undefined as string | undefined,
  },

  // --- People portraits / context shots ---
  people: {
    zeldaHogan: undefined as string | undefined,
    brianRussell: undefined as string | undefined,
    ivy: undefined as string | undefined,
    dianneStokes: undefined as string | undefined,
    lindaTurner: undefined as string | undefined,
    patriciaFrank: undefined as string | undefined,
    alfredJohnson: undefined as string | undefined,
    normFrank: undefined as string | undefined,
    cliffPlummer: undefined as string | undefined,
  },

  // --- Pitch-specific ---
  pitch: {
    productionPlant: undefined as string | undefined,
    communityClosing: undefined as string | undefined,
  },

  // --- Homepage hero (already has a real URL) ---
  hero: {
    home: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg',
  },
} as const;

// ---------- Empathy Ledger integration ----------

// Cache for EL placements (populated once per request via ISR)
let _placementsCache: Record<string, ContentPlacement> | null = null;
let _placementsCacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute in-memory cache (EL API also caches 5 min via ISR)

/**
 * Fetch all placements from Empathy Ledger.
 * Cached in-memory for the current server request cycle.
 */
async function getELPlacements(): Promise<Record<string, ContentPlacement>> {
  const now = Date.now();
  if (_placementsCache && now - _placementsCacheTime < CACHE_TTL) {
    return _placementsCache;
  }

  try {
    const placements = await empathyLedger.getPlacements({ includeEmpty: false });
    _placementsCache = placements;
    _placementsCacheTime = now;
    return placements;
  } catch {
    return {};
  }
}

/**
 * Get a media URL for a slot.
 * Resolution: EL placement → local media map → undefined (placeholder)
 *
 * @param slotKey - dot-notation key matching content_placements.slot_key
 *                  e.g., 'product.stretchBedHero', 'process.source'
 * @param localFallback - optional local path from the media map
 */
export async function getMediaUrl(
  slotKey: string,
  localFallback?: string
): Promise<string | undefined> {
  // Try Empathy Ledger first
  if (empathyLedger.isEnabled()) {
    const placements = await getELPlacements();
    const placement = placements[slotKey];
    if (placement?.media?.url) {
      return placement.media.url;
    }
  }

  // Fall back to local
  return localFallback;
}

/**
 * Resolve all media for a page in a single batch call.
 * Pass an object of { displayKey: { slotKey, localFallback } }
 * Returns { displayKey: url | undefined }
 */
export async function resolveMedia<T extends Record<string, { slot: string; local?: string }>>(
  slots: T
): Promise<Record<keyof T, string | undefined>> {
  const placements = empathyLedger.isEnabled() ? await getELPlacements() : {};

  const result = {} as Record<keyof T, string | undefined>;
  for (const [key, { slot, local }] of Object.entries(slots)) {
    result[key as keyof T] = placements[slot]?.media?.url ?? local;
  }
  return result;
}

// ---------- Static helper maps (for non-async contexts) ----------

// Map process step keys to media paths (static local fallback)
export const processStepMedia: Record<string, { photo?: string; video?: string }> = {
  source: { photo: media.process.source, video: media.processVideo.source },
  process: { photo: media.process.process, video: media.processVideo.process },
  cut: { photo: media.process.cut, video: media.processVideo.cut },
  build: { photo: media.process.build, video: media.processVideo.build },
  weave: { photo: media.process.weave, video: media.processVideo.weave },
  deliver: { photo: media.process.deliver, video: media.processVideo.deliver },
};

// Map journey story IDs to people photos
export const storyPersonMedia: Record<string, string | undefined> = {
  'zelda-tin-shed': media.people.zeldaHogan,
  'brian-health': media.people.brianRussell,
  'ivy-floor-to-bed': media.people.ivy,
  'dianne-codesigner': media.people.dianneStokes,
  'linda-never-asked': media.people.lindaTurner,
  'patricia-washing-machine': media.people.patriciaFrank,
};

// Map community partnership IDs to landscape photos
export const communityMedia: Record<string, string | undefined> = {
  'tennant-creek': media.community.tennantCreek,
  'alice-springs': media.community.aliceSprings,
  'palm-island': media.community.palmIsland,
  'townsville': media.community.townsville,
};

/**
 * Async version of processStepMedia that checks EL first.
 * Use in server components where await is available.
 */
export async function getProcessStepMedia(): Promise<Record<string, { photo?: string; video?: string }>> {
  const resolved = await resolveMedia({
    'source.photo': { slot: 'process.source', local: media.process.source },
    'source.video': { slot: 'processVideo.source', local: media.processVideo.source },
    'process.photo': { slot: 'process.process', local: media.process.process },
    'process.video': { slot: 'processVideo.process', local: media.processVideo.process },
    'cut.photo': { slot: 'process.cut', local: media.process.cut },
    'cut.video': { slot: 'processVideo.cut', local: media.processVideo.cut },
    'build.photo': { slot: 'process.build', local: media.process.build },
    'build.video': { slot: 'processVideo.build', local: media.processVideo.build },
    'weave.photo': { slot: 'process.weave', local: media.process.weave },
    'weave.video': { slot: 'processVideo.weave', local: media.processVideo.weave },
    'deliver.photo': { slot: 'process.deliver', local: media.process.deliver },
    'deliver.video': { slot: 'processVideo.deliver', local: media.processVideo.deliver },
  });

  return {
    source: { photo: resolved['source.photo'], video: resolved['source.video'] },
    process: { photo: resolved['process.photo'], video: resolved['process.video'] },
    cut: { photo: resolved['cut.photo'], video: resolved['cut.video'] },
    build: { photo: resolved['build.photo'], video: resolved['build.video'] },
    weave: { photo: resolved['weave.photo'], video: resolved['weave.video'] },
    deliver: { photo: resolved['deliver.photo'], video: resolved['deliver.video'] },
  };
}

/**
 * Async version of storyPersonMedia that checks EL first.
 */
export async function getStoryPersonMedia(): Promise<Record<string, string | undefined>> {
  return resolveMedia({
    'zelda-tin-shed': { slot: 'people.zeldaHogan', local: media.people.zeldaHogan },
    'brian-health': { slot: 'people.brianRussell', local: media.people.brianRussell },
    'ivy-floor-to-bed': { slot: 'people.ivy', local: media.people.ivy },
    'dianne-codesigner': { slot: 'people.dianneStokes', local: media.people.dianneStokes },
    'linda-never-asked': { slot: 'people.lindaTurner', local: media.people.lindaTurner },
    'patricia-washing-machine': { slot: 'people.patriciaFrank', local: media.people.patriciaFrank },
  });
}

/**
 * Async version of communityMedia that checks EL first.
 */
export async function getCommunityMedia(): Promise<Record<string, string | undefined>> {
  return resolveMedia({
    'tennant-creek': { slot: 'community.tennantCreek', local: media.community.tennantCreek },
    'alice-springs': { slot: 'community.aliceSprings', local: media.community.aliceSprings },
    'palm-island': { slot: 'community.palmIsland', local: media.community.palmIsland },
    'townsville': { slot: 'community.townsville', local: media.community.townsville },
  });
}

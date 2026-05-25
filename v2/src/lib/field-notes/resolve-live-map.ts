// Server-side resolver for `live-map` blocks in trip stories.
//
// Goal: the heatpost map must reflect what the QR-tagged asset register
// actually says, not stale hand-curated numbers. Every bed is scanned
// into a home through /bed/{unique_id}; the `assets` table is canonical.
//
// What this does:
//   1. Walks blocks for any `live-map` kind.
//   2. Pulls `community + status` from the `assets` table via the
//      service-role key (the public/anon read can't see all rows).
//   3. Counts `deployed` + `allocated` per community as the "in-home or
//      en-route" total. Excludes `ready` (still in stock), `requested`,
//      `retired`, `under_investigation`, `demo`.
//   4. Merges those counts onto each entry in `communityLocations`,
//      keeping coordinates / descriptions / tooltipDirection from the
//      static config but overriding `bedsDelivered`.
//   5. Returns the story with each `live-map` block carrying a populated
//      `locations` array. The renderer prefers that over the static one.
//
// Communities found in `assets` that have no `communityLocations` entry
// (Kalgoorlie, Mount Isa, Canberra, Darwin, Mutitjulu in the current
// register) are skipped; they need coordinates + a description to land
// on the map cleanly. Add them to `communityLocations` first.

import { createClient } from '@supabase/supabase-js';
import { communityLocations, type CommunityLocation } from '@/lib/data/content';
import type { TripStory } from '@/lib/data/trip-stories';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const COUNTABLE_STATUSES = new Set(['deployed', 'allocated']);

interface AssetRow {
  community: string | null;
  status: string | null;
}

async function fetchCounts(): Promise<Map<string, number>> {
  if (!URL || !KEY) return new Map();
  try {
    const supabase = createClient(URL, KEY, {
      auth: { persistSession: false },
    });
    const { data, error } = await supabase
      .from('assets')
      .select('community, status')
      .limit(5000);
    if (error || !data) return new Map();
    const counts = new Map<string, number>();
    for (const row of data as AssetRow[]) {
      const community = row.community?.trim();
      const status = row.status?.trim();
      if (!community || !status) continue;
      if (community === 'Pending Delivery') continue;
      if (!COUNTABLE_STATUSES.has(status)) continue;
      counts.set(community, (counts.get(community) ?? 0) + 1);
    }
    return counts;
  } catch {
    return new Map();
  }
}

function mergeLocations(counts: Map<string, number>): CommunityLocation[] {
  return communityLocations.map((loc) => {
    // Hand-curated entries stay static (e.g. Mount Isa, Kalgoorlie where
    // the user has set the on-ground number ahead of full QR registration).
    if (loc.staticBedCount) return loc;
    const live = counts.get(loc.name);
    if (live === undefined) return loc;
    return { ...loc, bedsDelivered: live };
  });
}

export async function resolveLiveMapCounts(
  story: TripStory,
): Promise<TripStory> {
  const hasLiveMap = story.blocks.some((b) => b.kind === 'live-map');
  if (!hasLiveMap) return story;
  const counts = await fetchCounts();
  const merged = mergeLocations(counts);
  return {
    ...story,
    blocks: story.blocks.map((b) => {
      if (b.kind !== 'live-map') return b;
      return { ...b, locations: merged };
    }),
  };
}

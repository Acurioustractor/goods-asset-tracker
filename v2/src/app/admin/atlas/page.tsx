import { createServiceClient } from '@/lib/supabase/server';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import AtlasClient, { type AtlasCommunity } from './atlas-client';
import { getPeopleInMediaByEntity } from '@/lib/data/media-links';

export const dynamic = 'force-dynamic';

/**
 * Goods Atlas — full-screen map dashboard. Server side assembles one payload
 * per community (counts, split, signals, people, facility, MEDIA, VOICES)
 * from the live register + community-os columns + content_items + the
 * storytellers table; the client renders the map and drill panel.
 */
export default async function AtlasPage() {
  const supabase = createServiceClient();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [commRes, rollupRes, assetsRes, signalsRes, mediaRes, voicesRes] = await Promise.all([
    supabase
      .from('communities')
      .select('id, name, traditional_name, state, status, lat, lng, facility_interest, facility_notes, key_people, procurement_contacts'),
    supabase.from('community_rollup').select('id, deployed_beds, deployed_machines, ready_beds, allocated_beds, open_demand_qty'),
    supabase.from('assets').select('unique_id, community_id, product, status, quantity').eq('status', 'deployed'),
    supabase.from('bed_signals').select('asset_id, created_at').gte('created_at', thirtyDaysAgo),
    supabase
      .from('content_items')
      .select('id, community_id, url, poster_url, media_type, consent_tier')
      .not('community_id', 'is', null)
      .neq('consent_tier', 'red'),
    supabase.from('storytellers').select('id, community_id, display_name, is_elder, portrait:content_items(url)'),
  ]);

  const rollup = new Map((rollupRes.data || []).map((r) => [r.id as string, r]));
  const split = new Map<string, { basket: number; stretch: number; washers: number }>();
  const assetCommunity = new Map<string, string>();
  for (const a of assetsRes.data || []) {
    if (!a.community_id) continue;
    assetCommunity.set(a.unique_id as string, a.community_id as string);
    const s = split.get(a.community_id as string) || { basket: 0, stretch: 0, washers: 0 };
    const q = (a.quantity as number) || 1;
    if (a.product === 'Basket Bed') s.basket += q;
    else if (a.product === 'Stretch Bed') s.stretch += q;
    else if (a.product === 'Washing Machine') s.washers += q;
    split.set(a.community_id as string, s);
  }
  const signals = new Map<string, number>();
  for (const sig of signalsRes.data || []) {
    const cid = assetCommunity.get(sig.asset_id as string);
    if (cid) signals.set(cid, (signals.get(cid) || 0) + 1);
  }

  // Media per community: up to 8 photo thumbs + counts (photos / videos)
  const media = new Map<string, { photos: string[]; photoCount: number; videoCount: number }>();
  for (const m of mediaRes.data || []) {
    const cid = m.community_id as string;
    const entry = media.get(cid) || { photos: [], photoCount: 0, videoCount: 0 };
    if (m.media_type === 'video') {
      entry.videoCount += 1;
    } else {
      entry.photoCount += 1;
      const thumb = (m.poster_url as string) || (m.url as string);
      if (entry.photos.length < 8 && thumb) entry.photos.push(thumb);
    }
    media.set(cid, entry);
  }

  // Voices per community from the storytellers table (portrait via content_items join)
  const voices = new Map<string, AtlasCommunity['voices']>();
  for (const v of voicesRes.data || []) {
    if (!v.community_id) continue;
    const list = voices.get(v.community_id as string) || [];
    const portrait = Array.isArray(v.portrait)
      ? ((v.portrait[0] as { url?: string } | undefined)?.url ?? null)
      : ((v.portrait as { url?: string } | null)?.url ?? null);
    list.push({ name: v.display_name as string, elder: Boolean(v.is_elder), portrait });
    voices.set(v.community_id as string, list);
  }

  // People tagged (media_links person picker) on media that also belongs to each
  // community — the read-back for the Media Room's per-item person tagging.
  const peopleInMediaMap = await getPeopleInMediaByEntity(supabase, 'community');

  const communities: AtlasCommunity[] = (commRes.data || [])
    .filter((c) => c.lat != null && c.lng != null)
    .map((c) => {
      const r = rollup.get(c.id as string);
      const sp = split.get(c.id as string) || { basket: 0, stretch: 0, washers: 0 };
      const md = media.get(c.id as string) || { photos: [], photoCount: 0, videoCount: 0 };
      return {
        id: c.id as string,
        name: c.name as string,
        traditionalName: (c.traditional_name as string) || null,
        state: c.state as string,
        status: c.status as string,
        lat: c.lat as number,
        lng: c.lng as number,
        beds: (r?.deployed_beds as number) || 0,
        basket: sp.basket,
        stretch: sp.stretch,
        washers: sp.washers,
        signals30d: signals.get(c.id as string) || 0,
        outstanding: ((r?.ready_beds as number) || 0) + ((r?.allocated_beds as number) || 0),
        demand: (r?.open_demand_qty as number) || 0,
        facilityInterest: (c.facility_interest as string) || null,
        facilityNotes: (c.facility_notes as string) || null,
        keyPeople: (c.key_people as AtlasCommunity['keyPeople']) || [],
        procurement: (c.procurement_contacts as AtlasCommunity['procurement']) || [],
        photos: md.photos,
        photoCount: md.photoCount,
        videoCount: md.videoCount,
        voices: voices.get(c.id as string) || [],
        peopleInMedia: peopleInMediaMap.get(c.id as string) || [],
      };
    });

  const canon = {
    beds: CANONICAL_ASSETS.bedsDeployed,
    stretch: CANONICAL_ASSETS.stretchBedsDeployed,
    washers: CANONICAL_ASSETS.washersInCommunity,
    communities: CANONICAL_ASSETS.communitiesServed,
    plasticKg: CANONICAL_ASSETS.plasticKg,
  };

  return <AtlasClient communities={communities} canon={canon} />;
}

import 'server-only';
import { createServiceClient } from '@/lib/supabase/server';
import { CANONICAL_ASSETS, WASHERS_IN_COMMUNITY_BY_COMMUNITY } from '@/lib/data/asset-canonical';
import { computeModel, DEFAULTS } from '@/lib/cost-model/engine';

/**
 * Data behind the three deck map views (/admin/maps/deployed, /ask, /need).
 *
 * Everything here is live from the Goods register (project cwsyhpiuepvdjtxaozwf)
 * except two things that cannot be derived from it:
 *   1. per-community washers, which come from Ben's 22 ruling in
 *      asset-canonical.ts because 10 register rows are stale (see CONTEXT.md);
 *   2. the handover band, a Modelled figure quoted from ask-surface.ts:205.
 * Nothing is estimated here. If a figure is missing it renders as missing.
 */

export interface MapPlace {
  id: string;
  name: string;
  state: string | null;
  status: string;
  lat: number;
  lng: number;
}

export interface DeployedPlace extends MapPlace {
  beds: number;
  basket: number;
  stretch: number;
  washers: number;
}

export interface AskPlace extends MapPlace {
  interest: string;
  notes: string | null;
  beds: number;
}

export interface NeedPlace extends MapPlace {
  beds: number;
  wanted: number;
}

async function loadPlaces() {
  const supabase = createServiceClient();
  const [commRes, rollupRes, assetsRes] = await Promise.all([
    supabase.from('communities').select('id, name, state, status, lat, lng, facility_interest, facility_notes'),
    supabase.from('community_rollup').select('id, deployed_beds, open_demand_qty'),
    supabase.from('assets').select('community_id, product, quantity').eq('status', 'deployed'),
  ]);

  const rollup = new Map((rollupRes.data || []).map((r) => [r.id as string, r]));
  const split = new Map<string, { basket: number; stretch: number }>();
  for (const a of assetsRes.data || []) {
    if (!a.community_id) continue;
    const s = split.get(a.community_id as string) || { basket: 0, stretch: 0 };
    const q = (a.quantity as number) || 1;
    if (a.product === 'Basket Bed') s.basket += q;
    else if (a.product === 'Stretch Bed') s.stretch += q;
    split.set(a.community_id as string, s);
  }

  const places = (commRes.data || [])
    .filter((c) => c.lat != null && c.lng != null)
    .map((c) => {
      const id = c.id as string;
      const r = rollup.get(id);
      const sp = split.get(id) || { basket: 0, stretch: 0 };
      return {
        id,
        name: c.name as string,
        state: (c.state as string) || null,
        status: c.status as string,
        lat: c.lat as number,
        lng: c.lng as number,
        beds: (r?.deployed_beds as number) || 0,
        basket: sp.basket,
        stretch: sp.stretch,
        // Canon ruling, not the register: 10 `deployed` washer rows are stale.
        washers: WASHERS_IN_COMMUNITY_BY_COMMUNITY[id] ?? 0,
        wanted: (r?.open_demand_qty as number) || 0,
        facilityInterest: (c.facility_interest as string) || null,
        facilityNotes: (c.facility_notes as string) || null,
      };
    });

  return places;
}

/** VIEW 1 — what is already in community. */
export async function getDeployedMap() {
  const places = await loadPlaces();
  const deployed: DeployedPlace[] = places
    .filter((p) => p.beds > 0 || p.washers > 0)
    .map(({ id, name, state, status, lat, lng, beds, basket, stretch, washers }) => ({
      id,
      name,
      state,
      status,
      lat,
      lng,
      beds,
      basket,
      stretch,
      washers,
    }))
    .sort((a, b) => b.beds - a.beds);

  const washerSum = deployed.reduce((t, p) => t + p.washers, 0);
  return {
    places: deployed,
    canon: CANONICAL_ASSETS,
    /** True when the dots on the map add up to the number in the header. */
    washersReconcile: washerSum === CANONICAL_ASSETS.washersInCommunity,
    washerSum,
  };
}

/** VIEW 2 — who has asked about a production facility of their own. Interest only. */
export async function getAskMap() {
  const places = await loadPlaces();
  const asked: AskPlace[] = places
    .filter((p) => p.facilityInterest)
    .map(({ id, name, state, status, lat, lng, beds, facilityInterest, facilityNotes }) => ({
      id,
      name,
      state,
      status,
      lat,
      lng,
      beds,
      interest: facilityInterest as string,
      notes: facilityNotes,
    }))
    .sort((a, b) => b.beds - a.beds);

  const context: MapPlace[] = places
    .filter((p) => !p.facilityInterest && (p.beds > 0 || p.washers > 0))
    .map(({ id, name, state, status, lat, lng }) => ({ id, name, state, status, lat, lng }));

  return { asked, context };
}

/** VIEW 3 — asked-for facilities laid over recorded bed demand. Modelled. */
export async function getNeedMap() {
  const places = await loadPlaces();
  const model = computeModel(DEFAULTS);
  const withDemand: NeedPlace[] = places
    .filter((p) => p.wanted > 0)
    .map(({ id, name, state, status, lat, lng, beds, wanted }) => ({ id, name, state, status, lat, lng, beds, wanted }))
    .sort((a, b) => b.wanted - a.wanted);

  const askedIds = new Set(places.filter((p) => p.facilityInterest).map((p) => p.id));
  const wantedTotal = withDemand.reduce((t, p) => t + p.wanted, 0);

  return {
    places: withDemand,
    askedIds,
    wantedTotal,
    /** Derived, not typed in: fixed block / contribution per bed on the pressed path. */
    breakEvenBedsPerYear: Number.isFinite(model.breakevenFactory) ? model.breakevenFactory : null,
    /** Modelled band quoted from src/lib/data/ask-surface.ts:205 (Ben, 2026-07-21). */
    handoverBedsPerSite: { low: 75, high: 100 },
  };
}

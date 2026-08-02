/**
 * The operational summary Goods publishes about a community.
 *
 * This is the whole of what Empathy Ledger is allowed to know about production.
 * EL renders it under the Production Facility Support service; it never gets a
 * connection to the Goods database, never sees a shift row, never sees an
 * operator's name, and never sees a photo or a voice note. Widening this shape
 * is a deliberate act, not a side effect of adding a column.
 *
 * The rule the shape encodes: counts and status travel, people do not.
 */
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { elIdForCommunity } from '@/lib/community/seam';

export interface OperationsSummary {
  communityId: string;
  elCommunityId: string;
  /** null when the community has no production site of its own yet. */
  site: {
    id: string;
    name: string;
    kind: string;
    status: string;
    commissionedOn: string | null;
  } | null;
  production: {
    /** Shifts logged in the window. A proxy for "is the line running". */
    shiftsLast30Days: number;
    bedsAssembledLast30Days: number;
    sheetsProducedLast30Days: number;
    plasticShreddedKgLast30Days: number;
    lastShiftDate: string | null;
    /** From the newest inventory snapshot: beds the current stock could make. */
    bedsPossibleNow: number | null;
    inventoryAsAt: string | null;
  };
  /** Equipment the community has flagged. Text is included; the reporter is not. */
  needs: {
    openMaintenanceRequests: number;
    lineStopped: boolean;
    summary: string[];
  };
  generatedAt: string;
}

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Goods Supabase credentials are not configured');
  return createServiceClient(url, key, { auth: { persistSession: false } });
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

/**
 * Reads with the service role because this runs unauthenticated on behalf of
 * EL. That is safe only because the returned shape is fixed and person-free —
 * see the file comment. Do not add a field here without re-reading it.
 */
export async function getOperationsSummary(communityId: string): Promise<OperationsSummary | null> {
  const elCommunityId = elIdForCommunity(communityId);
  if (!elCommunityId) return null;

  const supabase = serviceClient();
  const since = daysAgo(30);

  const { data: sites } = await supabase
    .from('production_sites')
    .select('id, name, kind, status, commissioned_on')
    .eq('community_id', communityId)
    .neq('status', 'retired')
    .order('status')
    .limit(1);

  const site = sites?.[0] ?? null;

  const empty: OperationsSummary = {
    communityId,
    elCommunityId,
    site: null,
    production: {
      shiftsLast30Days: 0,
      bedsAssembledLast30Days: 0,
      sheetsProducedLast30Days: 0,
      plasticShreddedKgLast30Days: 0,
      lastShiftDate: null,
      bedsPossibleNow: null,
      inventoryAsAt: null,
    },
    needs: { openMaintenanceRequests: 0, lineStopped: false, summary: [] },
    generatedAt: new Date().toISOString(),
  };

  if (!site) return empty;

  const [shiftsRes, lastShiftRes, inventoryRes, maintenanceRes] = await Promise.all([
    supabase
      .from('production_shifts')
      .select('sheets_produced, plastic_shredded_kg, beds_assembled')
      .eq('site_id', site.id)
      .gte('shift_date', since),
    supabase
      .from('production_shifts')
      .select('shift_date')
      .eq('site_id', site.id)
      .order('shift_date', { ascending: false })
      .limit(1),
    supabase
      .from('production_inventory')
      .select('beds_possible, snapshot_date')
      .eq('site_id', site.id)
      .order('snapshot_date', { ascending: false })
      .limit(1),
    supabase
      .from('site_maintenance_requests')
      .select('equipment, severity')
      .eq('site_id', site.id)
      .eq('status', 'open'),
  ]);

  const shifts = shiftsRes.data ?? [];
  const inventory = inventoryRes.data?.[0] ?? null;
  const maintenance = maintenanceRes.data ?? [];

  const sum = (key: 'sheets_produced' | 'plastic_shredded_kg' | 'beds_assembled') =>
    shifts.reduce((total, row) => total + (Number(row[key]) || 0), 0);

  return {
    communityId,
    elCommunityId,
    site: {
      id: site.id as string,
      name: site.name as string,
      kind: site.kind as string,
      status: site.status as string,
      commissionedOn: (site.commissioned_on as string | null) ?? null,
    },
    production: {
      shiftsLast30Days: shifts.length,
      bedsAssembledLast30Days: sum('beds_assembled'),
      sheetsProducedLast30Days: sum('sheets_produced'),
      plasticShreddedKgLast30Days: sum('plastic_shredded_kg'),
      lastShiftDate: (lastShiftRes.data?.[0]?.shift_date as string | null) ?? null,
      bedsPossibleNow: inventory ? Number(inventory.beds_possible) : null,
      inventoryAsAt: (inventory?.snapshot_date as string | null) ?? null,
    },
    needs: {
      openMaintenanceRequests: maintenance.length,
      lineStopped: maintenance.some((m) => m.severity === 'stopped'),
      summary: maintenance.map((m) => `${m.equipment} (${m.severity})`),
    },
    generatedAt: new Date().toISOString(),
  };
}

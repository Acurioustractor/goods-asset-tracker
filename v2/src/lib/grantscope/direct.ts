/**
 * GRANTSCOPE, READ DIRECTLY FROM THE DATABASE.
 *
 * `client.ts` (kept, unchanged) calls a Grantscope HTTP API at /api/goods-workspace/data. On
 * 17 September 2026 that route could not be reached from here at all, for two separate reasons:
 * GRANTSCOPE_API_URL is set to civicgraph.vercel.app, which 404s on every path, and the real host
 * civicgraph.app sits behind Vercel's Security Checkpoint, which answers a server-to-server
 * request with a bot challenge rather than JSON. Neither is fixable from this repo, and between
 * them they are why grantscope has felt like a locked room.
 *
 * The data itself was never locked. It lives in the ACT infrastructure Supabase, which Goods
 * already holds credentials for: 609,631 entities, 2,986,463 relationships, 291,264 GrantConnect
 * awards, and 26,809 grant opportunities of which 26,785 already carry a `goods_relevance_score`
 * that nothing in this repo had ever read. The top of that list is a Western Cape Communities
 * Trust grant called "Whitegoods and Household Goods", open, scored 100.
 *
 * THE JOIN IS THE ABN. Grantscope keys every entity `AU-ABN-<abn>` in `gs_id`, and the same id
 * already sits on every row of the procurement register. No mapping table is needed or wanted.
 * (`crm_contacts.grantscope_id` exists for this and is populated on 0 of 135 contacts — the field
 * was added and never filled.)
 *
 * READ-ONLY, DELIBERATELY. This is another team's database. Nothing here writes, and every
 * function is server-only so the key never reaches a browser. Failures return empty rather than
 * throwing: grantscope being down should dim a panel, never take out an admin page.
 */

import 'server-only';

const URL_BASE = (process.env.ACT_INFRA_SUPABASE_URL ?? '').replace(/\/$/, '');
const KEY = process.env.ACT_INFRA_SUPABASE_KEY ?? '';

export const grantscopeDirectConfigured = Boolean(URL_BASE && KEY);

export interface GrantOpportunity {
  id: string;
  name: string;
  provider: string | null;
  amountMin: number | null;
  amountMax: number | null;
  closesAt: string | null;
  status: string | null;
  goodsRelevance: number | null;
  dgrRequired: boolean | null;
  acceptsCharity: boolean | null;
  url: string | null;
}

export interface GrantscopeEntity {
  gsId: string;
  canonicalName: string;
  abn: string | null;
  state: string | null;
  entityType: string | null;
  communityControlled: boolean | null;
  communityControlledTier: string | null;
  supplyNationCertified: boolean | null;
  latestRevenue: number | null;
}

async function gs<T>(path: string): Promise<T[]> {
  if (!grantscopeDirectConfigured) return [];
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/${path}`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      // Grantscope changes on someone else's schedule, not per page view.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json: unknown = await res.json();
    return Array.isArray(json) ? (json as T[]) : [];
  } catch {
    return [];
  }
}

/** Grantscope ids are ABN-shaped. This one line is the whole integration. */
export const gsIdForAbn = (abn: string) => `AU-ABN-${abn.replace(/\s/g, '')}`;

interface RawOpportunity {
  id: string;
  name: string;
  provider: string | null;
  amount_min: number | null;
  amount_max: number | null;
  closes_at: string | null;
  status: string | null;
  goods_relevance_score: number | null;
  dgr_required: boolean | null;
  accepts_charity: boolean | null;
  url: string | null;
}

const OPPORTUNITY_FIELDS =
  'id,name,provider,amount_min,amount_max,closes_at,status,goods_relevance_score,dgr_required,accepts_charity,url';

const toOpportunity = (r: RawOpportunity): GrantOpportunity => ({
  id: r.id,
  name: r.name,
  provider: r.provider,
  amountMin: r.amount_min,
  amountMax: r.amount_max,
  closesAt: r.closes_at,
  status: r.status,
  goodsRelevance: r.goods_relevance_score,
  dgrRequired: r.dgr_required,
  acceptsCharity: r.accepts_charity,
  url: r.url,
});

interface RawEntity {
  gs_id: string;
  canonical_name: string;
  abn: string | null;
  state: string | null;
  entity_type: string | null;
  is_community_controlled: boolean | null;
  community_controlled_tier: string | null;
  is_supply_nation_certified: boolean | null;
  latest_revenue: number | null;
}

const ENTITY_FIELDS =
  'gs_id,canonical_name,abn,state,entity_type,is_community_controlled,community_controlled_tier,is_supply_nation_certified,latest_revenue';

const toEntity = (r: RawEntity): GrantscopeEntity => ({
  gsId: r.gs_id,
  canonicalName: r.canonical_name,
  abn: r.abn,
  state: r.state,
  entityType: r.entity_type,
  communityControlled: r.is_community_controlled,
  communityControlledTier: r.community_controlled_tier,
  supplyNationCertified: r.is_supply_nation_certified,
  latestRevenue: r.latest_revenue,
});

/**
 * Opportunities worth a human's attention: scored for Goods, and not already closed.
 *
 * Filtered on `status` rather than `closes_at`, because a great many rows have no close date —
 * an ongoing program has no deadline, and excluding them would hide the Aboriginals Benefit
 * Account, which is up to $1M and always open. A missing date is not a missing opportunity.
 */
export async function goodsOpportunities(minScore = 70, limit = 60): Promise<GrantOpportunity[]> {
  const rows = await gs<RawOpportunity>(
    `grant_opportunities?select=${OPPORTUNITY_FIELDS}` +
      `&goods_relevance_score=gte.${minScore}` +
      `&status=in.(open,ongoing,upcoming)` +
      `&order=goods_relevance_score.desc&limit=${limit}`,
  );
  return rows.map(toOpportunity);
}

/** One organisation by ABN. Null when grantscope has never seen it. */
export async function entityByAbn(abn: string): Promise<GrantscopeEntity | null> {
  const rows = await gs<RawEntity>(
    `gs_entities?select=${ENTITY_FIELDS}&gs_id=eq.${gsIdForAbn(abn)}&limit=1`,
  );
  return rows[0] ? toEntity(rows[0]) : null;
}

/** Several organisations at once, keyed by the ABN you asked with. */
export async function entitiesByAbn(abns: string[]): Promise<Map<string, GrantscopeEntity>> {
  const ids = [...new Set(abns.filter(Boolean).map(gsIdForAbn))];
  if (!ids.length) return new Map();
  const rows = await gs<RawEntity>(`gs_entities?select=${ENTITY_FIELDS}&gs_id=in.(${ids.join(',')})`);
  const out = new Map<string, GrantscopeEntity>();
  for (const r of rows) {
    if (r.abn) out.set(r.abn, toEntity(r));
  }
  return out;
}

/**
 * Grantscope / CivicGraph API client
 *
 * Fetches Goods workspace data from the Grantscope platform.
 * Used by admin pages to pull buyer targets, capital pipeline,
 * community intelligence, and lifecycle data.
 */

const GRANTSCOPE_BASE_URL =
  process.env.GRANTSCOPE_API_URL ||
  process.env.NEXT_PUBLIC_GRANTSCOPE_URL ||
  'https://civicgraph.vercel.app';

const GRANTSCOPE_SECRET =
  process.env.GRANTSCOPE_SYNC_SECRET ||
  process.env.GOODS_GRANTSCOPE_SYNC_SECRET ||
  '';

type Section = 'all' | 'communities' | 'deployment' | 'buyers' | 'capital' | 'partners' | 'lifecycle' | 'nt-sweep' | 'summary';

interface FetchOptions {
  section?: Section;
  states?: string[];
  limit?: number;
}

async function fetchGoodsWorkspace<T = unknown>(options: FetchOptions = {}): Promise<T | null> {
  const { section = 'all', states, limit } = options;

  const params = new URLSearchParams();
  params.set('section', section);
  if (states?.length) params.set('states', states.join(','));
  if (limit) params.set('limit', String(limit));

  const url = `${GRANTSCOPE_BASE_URL}/api/goods-workspace/data?${params}`;

  try {
    const res = await fetch(url, {
      headers: {
        ...(GRANTSCOPE_SECRET ? { 'x-grantscope-secret': GRANTSCOPE_SECRET } : {}),
      },
      next: { revalidate: 300 }, // Cache 5 minutes
    });

    if (!res.ok) {
      console.warn(`[grantscope] ${res.status} from ${section}:`, await res.text().catch(() => ''));
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.warn('[grantscope] Fetch failed:', error instanceof Error ? error.message : error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Typed fetchers
// ---------------------------------------------------------------------------

export interface GranstcopeSummary {
  orgName: string;
  workspaceTitle: string;
  thesis: {
    headline: string;
    summary: string;
    pillars: { title: string; detail: string }[];
    currentStats: { label: string; value: string; detail: string }[];
  };
  topMoves: { title: string; detail: string }[];
  communityCount: number;
  buyerCount: number;
  capitalCount: number;
  partnerCount: number;
}

export interface GrantscopeBuyerTarget {
  id: string;
  name: string;
  state: string | null;
  role: string;
  relationshipStatus: 'active' | 'warm' | 'prospect';
  remoteFootprint: string;
  productFit: string;
  procurementPath: string;
  contactSurface: string;
  nextAction: string;
  orderSignal: string | null;
  buyerPlausibilityScore: number;
  reasons: string[];
  website: string | null;
  ntCommunityReach: number;
}

export interface GrantscopeCapitalTarget {
  id: string;
  name: string;
  sourceKind: 'foundation' | 'grant';
  instrumentType: string;
  relationshipStatus: 'active' | 'warm' | 'prospect';
  contactSurface: string;
  nextAction: string;
  capitalFitScore: number;
  amountSignal: string;
  reasons: string[];
  thematicFocus: string[];
  deadline: string | null;
  url: string | null;
}

export interface GrantscopeCommunityProof {
  id: string;
  community: string;
  state: string;
  postcode: string;
  regionLabel: string;
  totalAssets: number;
  bedsDelivered: number;
  washersDelivered: number;
  demandBeds: number;
  demandWashers: number;
  needLeverageScore: number;
  needReasons: string[];
  proofLine: string;
  story: string;
  keyPartnerNames: string[];
  knownBuyer: string | null;
}

export async function getGrantscopeSummary() {
  return fetchGoodsWorkspace<GranstcopeSummary>({ section: 'summary' });
}

export async function getGrantscopeBuyers(states?: string[]) {
  const data = await fetchGoodsWorkspace<{ buyers: GrantscopeBuyerTarget[]; count: number }>({
    section: 'buyers',
    states,
  });
  return data?.buyers || [];
}

export async function getGrantscopeCapital() {
  const data = await fetchGoodsWorkspace<{ capital: GrantscopeCapitalTarget[]; count: number }>({
    section: 'capital',
  });
  return data?.capital || [];
}

export async function getGrantscopeCommunities(states?: string[], limit?: number) {
  const data = await fetchGoodsWorkspace<{ communities: GrantscopeCommunityProof[]; count: number }>({
    section: 'communities',
    states,
    limit,
  });
  return data?.communities || [];
}

export async function getGrantscopeAll() {
  return fetchGoodsWorkspace({ section: 'all' });
}

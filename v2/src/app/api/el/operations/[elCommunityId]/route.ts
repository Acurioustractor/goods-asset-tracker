/**
 * The read-only Goods operations adapter, for Empathy Ledger.
 *
 * EL renders this under the community's Production Facility Support service and
 * links onward into the Goods portal for anything operational. This endpoint is
 * the entire surface: EL gets no database connection, no credentials and no
 * table access. If EL needs a new fact, it is added to OperationsSummary on
 * purpose, with the person-free rule re-read.
 *
 * Keyed by the EL community uuid rather than the Goods slug, because EL should
 * never have to know Goods' slugs — that is what the seam is for.
 *
 * Auth is a shared bearer token. Without EL_OPERATIONS_TOKEN set, the route
 * refuses to serve rather than defaulting open: production data leaking to the
 * anonymous web is exactly the defect this branch fixes elsewhere.
 */
import { NextResponse } from 'next/server';
import { communityIdForEl } from '@/lib/community/seam';
import { getOperationsSummary } from '@/lib/sites/operations-summary';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ elCommunityId: string }> },
) {
  const expected = process.env.EL_OPERATIONS_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { error: 'Operations adapter is not configured' },
      { status: 503 },
    );
  }

  const presented = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  if (presented !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { elCommunityId } = await params;
  const communityId = communityIdForEl(elCommunityId);
  if (!communityId) {
    return NextResponse.json(
      {
        error: 'Unknown community',
        detail:
          'This Empathy Ledger community is not paired with a Goods community. Add it to COMMUNITY_SEAM; check:community-seam reports the gap on every build.',
      },
      { status: 404 },
    );
  }

  try {
    const summary = await getOperationsSummary(communityId);
    if (!summary) return NextResponse.json({ error: 'Unknown community' }, { status: 404 });
    return NextResponse.json(summary, {
      headers: { 'Cache-Control': 'private, max-age=60' },
    });
  } catch (error) {
    console.error('[el/operations] failed:', error);
    return NextResponse.json({ error: 'Failed to build operations summary' }, { status: 500 });
  }
}

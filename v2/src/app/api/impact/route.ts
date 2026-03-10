import { NextResponse } from 'next/server';
import { fetchImpactData } from '@/lib/data/impact-fetcher';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const snapshot = await fetchImpactData();

    return NextResponse.json(snapshot, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('[Impact API] Failed to fetch impact data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch impact data' },
      { status: 500 },
    );
  }
}

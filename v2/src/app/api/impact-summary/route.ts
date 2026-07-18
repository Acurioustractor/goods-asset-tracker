import { NextResponse } from 'next/server';
import { getCanonicalAssetRollup } from '@/lib/data/impact-fetcher';

export const dynamic = 'force-dynamic';

// Public, read-only impact numbers — safe to expose cross-origin so external
// surfaces (e.g. Empathy Ledger's impact / theory-of-change display) can read
// the CURRENT figures instead of keeping a stale local copy.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Canonical asset summary — the single live source for Goods deployment
 * numbers. Backed by getCanonicalAssetRollup() (status='deployed', summed by
 * quantity, Stretch/Basket split, plastic = Stretch beds only). Consumers
 * (Empathy Ledger TOC, partners, anyone) should FETCH this, never hardcode the
 * numbers — that is how they drift. Short-cached so it is always near-live.
 */
export async function GET() {
  try {
    const a = await getCanonicalAssetRollup();
    const body = {
      source: 'goodsoncountry.com — canonical asset register (status=deployed)',
      generatedAt: new Date().toISOString(),
      beds: {
        deployed: a.bedsDeployed,
        stretch: a.stretchBedsDeployed,
        basket: a.basketBedsDeployed,
      },
      washers: {
        inCommunity: a.washersInCommunity,
      },
      communitiesServed: a.communitiesServed,
      plasticDivertedKg: a.plasticKg,
      // MODELLED: ~2.5 people per household per bed.
      livesImpactedModelled: Math.round(a.bedsDeployed * 2.5),
      notes: {
        plastic: 'Stretch beds only (recycled HDPE). Basket beds are not a plastic-diversion product.',
        washers: '18 washing machines in community (curated, Ben-confirmed; supersedes the raw register row count).',
        basis: "status='deployed', summed by quantity; excludes pipeline/requested placeholders.",
      },
    };
    return NextResponse.json(body, {
      headers: {
        ...CORS,
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('[impact-summary] failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset summary' },
      { status: 500, headers: CORS },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Empathy Ledger syndication sync cron — runs daily.
 *
 * Ensures all Goods project stories have syndication_enabled = true.
 * Skips stories with consent_withdrawn_at or is_archived.
 *
 * Project structure in EL:
 * - Goods project ID: 6bd47c8a-e676-456f-aa25-ddcbb5a31047 (slug: "goods")
 * - The public API `projectCode=goods-on-country` aggregates across related projects
 *   (PICC, BG Fit, etc) — but only Goods-project stories should be auto-syndicated
 * - BG Fit stories (tagged spinifex/boxing/youth-justice) are a SEPARATE project
 * - Community stories in PICC/other projects need manual syndication review
 */

const GOODS_PROJECT_ID = '6bd47c8a-e676-456f-aa25-ddcbb5a31047';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
  const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;

  if (!EL_URL || !EL_KEY) {
    return NextResponse.json({ error: 'EL Supabase credentials not configured' }, { status: 500 });
  }

  try {
    // 1. Fetch all Goods project stories that are NOT syndicated
    const fetchUrl = `${EL_URL}/rest/v1/stories?project_id=eq.${GOODS_PROJECT_ID}&syndication_enabled=eq.false&is_archived=eq.false&consent_withdrawn_at=is.null&select=id,title`;
    const fetchRes = await fetch(fetchUrl, {
      headers: {
        'apikey': EL_KEY,
        'Authorization': `Bearer ${EL_KEY}`,
      },
    });

    if (!fetchRes.ok) {
      const err = await fetchRes.text();
      return NextResponse.json({ error: `EL fetch failed: ${err}` }, { status: 500 });
    }

    const unsyndicated = await fetchRes.json();

    if (!unsyndicated || unsyndicated.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All Goods stories already syndicated',
        checked: true,
        enabled: 0,
      });
    }

    // 2. Enable syndication for each
    const ids = unsyndicated.map((s: { id: string }) => s.id);
    const updateUrl = `${EL_URL}/rest/v1/stories?id=in.(${ids.join(',')})`;
    const updateRes = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'apikey': EL_KEY,
        'Authorization': `Bearer ${EL_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ syndication_enabled: true }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      return NextResponse.json({ error: `EL update failed: ${err}` }, { status: 500 });
    }

    const titles = unsyndicated.map((s: { title: string }) => s.title);

    return NextResponse.json({
      success: true,
      enabled: ids.length,
      stories: titles,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('EL sync cron error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

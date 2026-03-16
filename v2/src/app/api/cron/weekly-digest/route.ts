import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Weekly digest cron — runs every Monday at 8am AEST.
 *
 * Compiles a summary of:
 * 1. New/changed assets (deployments, replacements)
 * 2. Fleet machine activity (usage_logs from last 7 days)
 * 3. Pipeline changes (new requests, status changes)
 * 4. Grantscope intelligence (new matches, if available)
 *
 * Sends via GHL contact note + optional email workflow.
 * Secured via CRON_SECRET header (Vercel cron sets this automatically).
 */

type DigestSection = {
  title: string;
  items: string[];
  emoji: string;
};

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();
  const sections: DigestSection[] = [];
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekAgoISO = weekAgo.toISOString();

  try {
    // ── 1. ASSET ACTIVITY ──
    const { data: recentAssets } = await supabase
      .from('assets')
      .select('unique_id, product, community, status, created_at, updated_at')
      .or(`created_at.gte.${weekAgoISO},updated_at.gte.${weekAgoISO}`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (recentAssets?.length) {
      const newAssets = recentAssets.filter(
        (a) => a.created_at && new Date(a.created_at) >= weekAgo,
      );
      const updatedAssets = recentAssets.filter(
        (a) =>
          a.updated_at &&
          new Date(a.updated_at) >= weekAgo &&
          (!a.created_at || new Date(a.created_at) < weekAgo),
      );

      const items: string[] = [];
      if (newAssets.length) {
        items.push(`${newAssets.length} new asset(s) registered`);
        // Group by community
        const byCommunity: Record<string, number> = {};
        for (const a of newAssets) {
          const key = a.community || 'Unknown';
          byCommunity[key] = (byCommunity[key] || 0) + 1;
        }
        for (const [community, count] of Object.entries(byCommunity)) {
          items.push(`  → ${community}: ${count}`);
        }
      }
      if (updatedAssets.length) {
        items.push(`${updatedAssets.length} asset(s) updated`);
      }

      if (items.length) {
        sections.push({ title: 'Asset Activity', items, emoji: '📦' });
      }
    }

    // ── 2. FLEET ACTIVITY (washing machines) ──
    const { data: usageLogs } = await supabase
      .from('usage_logs')
      .select('machine_id, cycle_type, energy_kwh, created_at')
      .gte('created_at', weekAgoISO)
      .order('created_at', { ascending: false });

    if (usageLogs?.length) {
      const uniqueMachines = new Set(usageLogs.map((l) => l.machine_id));
      const totalEnergy = usageLogs.reduce((sum, l) => sum + (l.energy_kwh || 0), 0);

      sections.push({
        title: 'Fleet Activity',
        emoji: '🫧',
        items: [
          `${usageLogs.length} wash cycle(s) across ${uniqueMachines.size} machine(s)`,
          `Total energy: ${totalEnergy.toFixed(2)} kWh`,
          ...Array.from(uniqueMachines)
            .slice(0, 5)
            .map((id) => {
              const cycles = usageLogs.filter((l) => l.machine_id === id);
              return `  → ${id}: ${cycles.length} cycle(s)`;
            }),
        ],
      });
    }

    // ── 3. PIPELINE / REQUESTS ──
    const { data: pipelineItems } = await supabase
      .from('assets')
      .select('unique_id, product, community, status, partner_name, created_at')
      .eq('type', 'pipeline')
      .gte('created_at', weekAgoISO)
      .order('created_at', { ascending: false })
      .limit(10);

    if (pipelineItems?.length) {
      sections.push({
        title: 'Pipeline',
        emoji: '📋',
        items: pipelineItems.map(
          (p) =>
            `${p.unique_id}: ${p.product} for ${p.community || 'TBD'}${p.partner_name ? ` (via ${p.partner_name})` : ''} — ${p.status}`,
        ),
      });
    }

    // ── 4. EMPATHY LEDGER STORIES ──
    const { data: recentStories } = await supabase
      .from('stories')
      .select('id, title, storyteller_name, community, created_at')
      .gte('created_at', weekAgoISO)
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentStories?.length) {
      sections.push({
        title: 'New Stories',
        emoji: '📖',
        items: recentStories.map(
          (s) =>
            `"${s.title}" by ${s.storyteller_name || 'Anonymous'}${s.community ? ` (${s.community})` : ''}`,
        ),
      });
    }

    // ── 5. GRANTSCOPE INTELLIGENCE (if configured) ──
    const grantscopeUrl = process.env.GRANTSCOPE_WORKSPACE_URL;
    if (grantscopeUrl) {
      try {
        const gsResponse = await fetch(`${grantscopeUrl}/api/goods-workspace/data`, {
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(10000),
        });

        if (gsResponse.ok) {
          const gsData = await gsResponse.json();
          const items: string[] = [];

          if (gsData.summary?.newMatchesThisWeek) {
            items.push(`${gsData.summary.newMatchesThisWeek} new grant match(es)`);
          }
          if (gsData.summary?.topBuyers?.length) {
            items.push(
              `Top buyers: ${gsData.summary.topBuyers.slice(0, 3).map((b: { name: string }) => b.name).join(', ')}`,
            );
          }
          if (gsData.summary?.topCapital?.length) {
            items.push(
              `Top capital: ${gsData.summary.topCapital.slice(0, 3).map((c: { name: string }) => c.name).join(', ')}`,
            );
          }

          if (items.length) {
            sections.push({ title: 'Grantscope Intelligence', emoji: '🔍', items });
          }
        }
      } catch {
        // Grantscope not available — skip silently
      }
    }

    // ── COMPOSE DIGEST ──
    if (!sections.length) {
      return NextResponse.json({
        message: 'No activity this week',
        digest: null,
        sentAt: now.toISOString(),
      });
    }

    const weekLabel = `${weekAgo.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} – ${now.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}`;

    const digestText = [
      `Goods on Country — Weekly Digest`,
      weekLabel,
      '',
      ...sections.flatMap((s) => [`${s.emoji} ${s.title}`, ...s.items, '']),
      '---',
      'Generated by Goods on Country weekly digest cron',
    ].join('\n');

    // ── SEND DIGEST ──
    // Option 1: GHL — create/update a digest contact and add note
    const digestEmail = process.env.DIGEST_EMAIL || process.env.ADMIN_EMAILS?.split(',')[0];

    if (digestEmail) {
      const { ghl } = await import('@/lib/ghl');

      if (ghl.isEnabled()) {
        // Import dynamically to avoid circular deps at module level
        await ghl.createOrderContact({
          email: digestEmail,
          name: 'Goods Weekly Digest',
          orderNumber: `DIGEST-${now.toISOString().slice(0, 10)}`,
          totalCents: 0,
          isSponsorship: false,
          productTypes: [],
        }).catch(() => null);
      }

      // Log the digest
      ghl.logEvent('weekly-digest', {
        sections: sections.length,
        weekLabel,
        recipientEmail: digestEmail,
      });
    }

    // Option 2: Resend email (if configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && digestEmail) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Goods on Country <digest@goodsoncountry.com>',
            to: digestEmail,
            subject: `Goods Weekly Digest — ${weekLabel}`,
            text: digestText,
          }),
        });
      } catch (emailError) {
        console.error('[Digest] Email send failed:', emailError);
      }
    }

    return NextResponse.json({
      message: 'Weekly digest compiled',
      sections: sections.length,
      weekLabel,
      digest: digestText,
      sentTo: digestEmail || null,
      sentAt: now.toISOString(),
    });
  } catch (error) {
    console.error('[Weekly Digest] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Digest failed' },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { ghl } from '@/lib/ghl';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * SMS dispatch cron — runs daily at 8am AEST (22:00 UTC).
 *
 * Reads bed_signals where signal_type IN (reminder, check_in), scheduled_for <= now(),
 * sent_at IS NULL, and contact looks like a phone number.
 * Sends each one via GHL outbound SMS (Conversations API), stamps sent_at.
 *
 * Bearer-secured via CRON_SECRET when called by Vercel; GET without secret is a dry-run
 * (counts what would send, doesn't actually send or stamp).
 *
 * Cost: ~AU$0.05 per 160-char segment on AU mobile. Each reminder is one segment.
 */

const MESSAGE_TEMPLATES: Record<string, (productNoun: string, assetId: string) => string> = {
  '3mo-check': (noun, id) =>
    `G'day from Goods on Country — checking in on your ${noun} (${id}). How's it going? Reply here, no app needed. STOP to opt out.`,
  '6mo-wash': (noun, id) =>
    `Reminder from Goods on Country — about time to wash the canvas on your ${noun} (${id}). Slide the poles out, cold/warm water, line dry. Any issues? Reply here. STOP to opt out.`,
  '1yr-check': (noun, id) =>
    `It's been a year with your ${noun} (${id}). How's it going? Goods on Country would love a quick reply if there's anything we should know. STOP to opt out.`,
};

function buildMessage(row: {
  asset_id: string;
  signal_value: string | null;
  payload: Record<string, unknown> | null;
}): string {
  const noun = (row.payload?.product_noun as string) || 'bed';
  const template = MESSAGE_TEMPLATES[row.signal_value || ''] || ((n, id) =>
    `Hi from Goods on Country — checking in on your ${n} (${id}). Reply with anything we should know. STOP to opt out.`);
  return template(noun, row.asset_id);
}

function looksLikePhone(value: string | null | undefined): boolean {
  if (!value) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const dryRun = !isCron;

  const supabase = createServiceClient();
  const now = new Date().toISOString();

  const { data: rows, error } = await supabase
    .from('bed_signals')
    .select('id, asset_id, signal_type, signal_value, payload, contact, scheduled_for, created_at')
    .in('signal_type', ['reminder', 'check_in'])
    .lte('scheduled_for', now)
    .is('sent_at', null)
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const dueRows = rows || [];
  const sendable = dueRows.filter((r) => looksLikePhone(r.contact as string));
  const skipped = dueRows.filter((r) => !looksLikePhone(r.contact as string));

  const results: { id: string; asset: string; phone: string; ok: boolean; reason?: string }[] = [];

  if (!dryRun) {
    for (const row of sendable) {
      const message = buildMessage({
        asset_id: row.asset_id,
        signal_value: row.signal_value,
        payload: (row.payload as Record<string, unknown> | null) || {},
      });

      const send = await ghl.sendSms({
        phone: row.contact as string,
        message,
        assetId: row.asset_id,
        tags: ['bed-reminder', `signal-${row.signal_value || 'unknown'}`],
      });

      if (send.success) {
        await supabase
          .from('bed_signals')
          .update({ sent_at: new Date().toISOString() })
          .eq('id', row.id);
      }

      results.push({
        id: row.id,
        asset: row.asset_id,
        phone: (row.contact as string).slice(-4),
        ok: !!send.success,
        reason: send.error,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    due: dueRows.length,
    sendable: sendable.length,
    skipped: skipped.length,
    sent: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results: dryRun ? sendable.map((r) => ({ id: r.id, asset: r.asset_id, phone: (r.contact as string).slice(-4) })) : results,
  });
}

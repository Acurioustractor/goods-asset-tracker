import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ghl } from '@/lib/ghl';
import { findSmartList, estimateSegments, estimateCostCents } from '@/lib/ghl/smart-lists';

export const runtime = 'nodejs';
export const maxDuration = 60; // Vercel — allow up to 60s for a batch dispatch

/**
 * Dispatch a single SMS to every contact matching a smart-list tag.
 *
 * Guardrails:
 *   - Admin auth required.
 *   - Hard cap of 250 recipients per call (route refuses larger).
 *   - SmartList.hardCap is enforced when listId is supplied.
 *   - dryRun=true returns the cost estimate + recipient summary without sending.
 *   - 250ms delay between sends to respect GHL's rate limit.
 */
export async function POST(request: NextRequest) {
  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const isAdmin =
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin' ||
    process.env.ADMIN_EMAILS?.split(',').includes(user.email || '');
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let body: {
    listId?: string;
    customTag?: string;
    message?: string;
    dryRun?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const message = (body.message || '').trim();
  if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  if (message.length > 480) {
    return NextResponse.json({ error: 'Message must be 480 characters or less (3 segments max)' }, { status: 400 });
  }

  // Resolve target tag + cap
  let tag: string;
  let hardCap = 250;
  if (body.listId) {
    const list = findSmartList(body.listId);
    if (!list) return NextResponse.json({ error: 'Unknown smart list' }, { status: 404 });
    tag = list.tag;
    hardCap = list.hardCap;
  } else if (body.customTag) {
    tag = body.customTag;
  } else {
    return NextResponse.json({ error: 'listId or customTag required' }, { status: 400 });
  }

  if (!ghl.isEnabled()) {
    return NextResponse.json({ error: 'GHL is not enabled — dispatch skipped' }, { status: 503 });
  }

  const contacts = await ghl.findContactsByTag(tag, 250);
  const phoneContacts = contacts.filter((c) => c.phone && c.phone.length > 5);

  if (phoneContacts.length > hardCap) {
    return NextResponse.json(
      {
        error: `Recipient count ${phoneContacts.length} exceeds hard cap of ${hardCap} for this list. Refusing to send.`,
      },
      { status: 400 },
    );
  }

  const segments = estimateSegments(message);
  const estimatedCostCents = estimateCostCents(message, phoneContacts.length);

  if (body.dryRun) {
    return NextResponse.json({
      dryRun: true,
      tag,
      recipientCount: phoneContacts.length,
      segments,
      estimatedCostCents,
      sample: phoneContacts.slice(0, 10).map((c) => ({
        name: c.contactName || [c.firstName, c.lastName].filter(Boolean).join(' ') || null,
        phone: c.phone ? c.phone.replace(/(\+?\d{2})\d{4}(\d{3})/, '$1****$2') : null,
      })),
    });
  }

  // Actually send. 250ms between sends to stay under GHL's rate limits.
  const results: Array<{ phone: string; success: boolean; error?: string }> = [];
  for (const contact of phoneContacts) {
    const phone = contact.phone as string;
    const result = await ghl.sendSms({
      phone,
      message,
      contactName: contact.contactName || null,
      tags: [tag, 'goods-reach-out'],
    });
    results.push({
      phone: phone.replace(/(\+?\d{2})\d{4}(\d{3})/, '$1****$2'),
      success: !!result.success,
      error: result.error,
    });
    // Throttle
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.length - successCount;

  return NextResponse.json({
    dryRun: false,
    tag,
    recipientCount: phoneContacts.length,
    successCount,
    failCount,
    segments,
    estimatedCostCents,
    results,
  });
}

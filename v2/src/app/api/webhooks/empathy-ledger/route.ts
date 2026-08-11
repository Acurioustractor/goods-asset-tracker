import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { revalidateTag } from 'next/cache';
import { EMPATHY_LEDGER_CACHE_TAG } from '@/lib/empathy-ledger/client';

export const dynamic = 'force-dynamic';

/**
 * Receive withdrawal and publication events from Empathy Ledger.
 *
 * This site reads Empathy Ledger with a 300 second revalidate window and holds 27
 * grants across 18 people. So when one of them withdrew consent, their work stayed
 * visible here for up to five minutes. Not long, and entirely avoidable.
 *
 * Context, measured on the Empathy Ledger side 2026-07-30: it had made two webhook
 * attempts in its entire life, both consent.revoked, both failed, because every
 * configured URL pointed at a domain that did not resolve or an endpoint that did
 * not exist. Four consent revocations had happened and not one reached a
 * destination. Its sender was verified working. Nothing anywhere was listening.
 *
 * What this does: verifies the HMAC signature, then drops the whole Empathy Ledger
 * cache tag. Blunt deliberately. Mapping each event to the exact pages it touches
 * would put a second copy of "which pages show which content" in this file, and it
 * would go stale the first time a page is added. One tag cannot go stale.
 *
 * Fails CLOSED. A missing or wrong signature is refused even though refusing means
 * a withdrawal might not land, because the alternative is that anyone who learns
 * this URL can flush the cache at will and, worse, that we act on unverified claims
 * about what a person decided.
 */

const CACHE_AFFECTING_EVENTS = new Set([
  // What Empathy Ledger actually sends, per its published contract.
  //
  // Verified against the live endpoint 2026-08-08: a real `content_revoked`
  // returned 202 revalidated:false — heard, deliberately not acted on. The
  // sender counts any 2xx as delivered and shows the storyteller "this site has
  // taken it down", so a withdrawal was being reported as landed while this
  // site kept serving the copy for its full 300 second window. The dotted names
  // below were written against an earlier draft and are kept so nothing that
  // used to work stops.
  'content_revoked',
  'content_updated',
  'consent_approved',
  'consent_denied',
  'consent.revoked',
  'consent.granted',
  'content.updated',
  'content.unpublished',
  'gallery.updated',
  'gallery.photos.added',
  'gallery.photos.removed',
  'storyteller.linked',
  'storyteller.unlinked',
  'webhook.test',
]);

function signatureMatches(raw: string, header: string, secret: string): boolean {
  // Empathy Ledger sends a BARE lowercase hex digest; this expected a `sha256=`
  // prefix, which is the GitHub convention and not theirs. Accept either: same
  // HMAC over the same raw bytes, the same proof written two ways.
  const digest = createHmac('sha256', secret).update(raw).digest('hex');
  const expected = header.startsWith('sha256=') ? `sha256=${digest}` : digest;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  // timingSafeEqual throws when lengths differ, so compare lengths first.
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const secret = process.env.EMPATHY_LEDGER_WEBHOOK_SECRET;
  if (!secret) {
    // Refusing is the honest answer. A receiver with no secret cannot tell an
    // Empathy Ledger event from anyone else's POST, and accepting anyway would make
    // this endpoint look like it works while trusting whatever arrives.
    console.error('[webhooks/empathy-ledger] EMPATHY_LEDGER_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook receiver is not configured' }, { status: 503 });
  }

  const raw = await request.text();
  // Empathy Ledger's canonical header is X-Empathy-Ledger-Signature. This read
  // only x-webhook-signature, so every real withdrawal was refused 401 before
  // the signature was even compared.
  const provided =
    request.headers.get('x-empathy-ledger-signature') ??
    request.headers.get('x-webhook-signature');

  if (!provided) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }
  if (!signatureMatches(raw, provided, secret)) {
    console.warn('[webhooks/empathy-ledger] rejected a request with a bad signature');
    return NextResponse.json({ error: 'Bad signature' }, { status: 401 });
  }

  let event: string | null = null;
  try {
    event = (JSON.parse(raw) as { event?: string }).event ?? null;
  } catch {
    return NextResponse.json({ error: 'Body is not JSON' }, { status: 400 });
  }
  if (!event) {
    return NextResponse.json({ error: 'No event in payload' }, { status: 400 });
  }

  if (!CACHE_AFFECTING_EVENTS.has(event)) {
    // 202 rather than 200, so the sender's log distinguishes "handled" from
    // "heard and deliberately not acted on".
    return NextResponse.json({ received: true, event, revalidated: false }, { status: 202 });
  }

  // Next 16 requires a cache profile alongside the tag. expire: 0 means drop it
  // now rather than at the end of some window, which is the whole point: a person
  // withdrew, and every extra second is a second their story is still shown.
  revalidateTag(EMPATHY_LEDGER_CACHE_TAG, { expire: 0 });
  console.log(`[webhooks/empathy-ledger] ${event} → revalidated ${EMPATHY_LEDGER_CACHE_TAG}`);

  return NextResponse.json({
    received: true,
    event,
    revalidated: true,
    tag: EMPATHY_LEDGER_CACHE_TAG,
  });
}

/** A GET so the endpoint's existence can be checked without sending an event. */
export async function GET() {
  return NextResponse.json({
    receiver: 'empathy-ledger',
    configured: !!process.env.EMPATHY_LEDGER_WEBHOOK_SECRET,
    signatureRequired: true,
  });
}

// Content system — Empathy Ledger media for the media library, fetched
// client-side after first paint so the page no longer blocks on the paged EL API.
//
// SECURITY: middleware guards /admin PAGES, not /api/admin/* routes, so this
// route MUST self-authorise. requireAdmin() enforces the admin session.

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { buildElItems } from '@/app/admin/media-library/curation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;
  const { items, elMissing, roster } = await buildElItems();
  return NextResponse.json({ items, elMissing, roster });
}

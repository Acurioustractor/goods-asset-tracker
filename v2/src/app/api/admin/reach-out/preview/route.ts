import { NextRequest, NextResponse } from 'next/server';
import { ghl } from '@/lib/ghl';
import { findSmartList } from '@/lib/ghl/smart-lists';
import { requireAdmin } from '@/lib/auth/admin';

export const runtime = 'nodejs';

/**
 * Preview a smart list — returns the count + sample of contacts that would
 * receive a message. Admin-only (with local-dev bypass).
 */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  const listId = request.nextUrl.searchParams.get('listId');
  const customTag = request.nextUrl.searchParams.get('tag');

  let tag: string;
  if (listId) {
    const list = findSmartList(listId);
    if (!list) return NextResponse.json({ error: 'Unknown smart list' }, { status: 404 });
    tag = list.tag;
  } else if (customTag) {
    tag = customTag;
  } else {
    return NextResponse.json({ error: 'listId or tag required' }, { status: 400 });
  }

  if (!ghl.isEnabled()) {
    return NextResponse.json({
      enabled: false,
      tag,
      count: 0,
      withPhone: 0,
      sample: [],
    });
  }

  const contacts = await ghl.findContactsByTag(tag, 250);
  const withPhone = contacts.filter((c) => c.phone && c.phone.length > 5).length;
  const sample = contacts.slice(0, 10).map((c) => ({
    id: c.id,
    name: c.contactName || [c.firstName, c.lastName].filter(Boolean).join(' ') || null,
    phone: c.phone ? c.phone.replace(/(\+?\d{2})\d{4}(\d{3})/, '$1****$2') : null,
    email: c.email,
  }));

  return NextResponse.json({
    enabled: true,
    tag,
    count: contacts.length,
    withPhone,
    sample,
  });
}

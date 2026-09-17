import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';
import { PLACES } from '@/lib/data/place-registry';

/**
 * THE THINGS, for ⌘K.
 *
 * Ben, 17 September 2026: fewer routes, and a concrete way to find something that means
 * something and is connected to the actual data.
 *
 * Route names were never that. Nobody looks for "Communities"; they look for Tennant Creek, or
 * Dianne Stokes, or GB0-WM-TC-JUL, or the invoice a bed went out on. The palette searched 85 page
 * titles, so finding one bed meant knowing which page listed beds, going there, and searching
 * again. This returns the records themselves, and the palette puts them above the routes.
 *
 * Counts on 17 September: 608 assets, 34 communities, 135 contacts, 32 storytellers, 108 places.
 * About 900 rows, which is small enough to send once and search in the browser, and far cheaper
 * than a round trip per keystroke.
 *
 * CONSENT. This is behind the admin gate, and it returns names that /admin/people and
 * /admin/voices already show to the same reader. It carries no quote, no story and no tier, so a
 * gated voice cannot be published from here. A storyteller is labelled as one, which is the
 * useful thing: you can see the person is a voice before you act on the contact.
 */

export const dynamic = 'force-dynamic';

export interface SearchRecord {
  kind: 'community' | 'person' | 'storyteller' | 'asset' | 'place' | 'org';
  label: string;
  sub: string;
  href: string;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const sb = createServiceClient();
  const [communities, contacts, tellers, assets] = await Promise.all([
    sb.from('communities').select('id,name,state,status').order('name'),
    sb.from('crm_contacts').select('id,name,organization,storyteller_id').order('name'),
    sb.from('storytellers').select('slug,display_name,community_id'),
    sb.from('assets').select('unique_id,display_name,product,community,status').limit(1000),
  ]);

  const out: SearchRecord[] = [];

  for (const c of communities.data ?? []) {
    out.push({ kind: 'community', label: c.name, sub: [c.state, c.status].filter(Boolean).join(' · '), href: `/admin/communities/${c.id}` });
  }
  for (const t of tellers.data ?? []) {
    out.push({ kind: 'storyteller', label: t.display_name, sub: `voice${t.community_id ? ` · ${t.community_id}` : ''}`, href: '/admin/voices' });
  }
  const tellerNames = new Set((tellers.data ?? []).map((t) => t.display_name.toLowerCase()));
  for (const p of contacts.data ?? []) {
    if (!p.name || tellerNames.has(p.name.toLowerCase())) continue;
    out.push({ kind: 'person', label: p.name, sub: p.organization ?? 'contact', href: '/admin/people' });
  }
  for (const a of assets.data ?? []) {
    if (!a.unique_id) continue;
    out.push({
      kind: 'asset',
      label: a.unique_id,
      sub: [a.display_name, a.product, a.community, a.status].filter(Boolean).join(' · '),
      href: `/admin/assets/${encodeURIComponent(a.unique_id)}`,
    });
  }
  // Places the registry knows and the communities table does not. Naming them is the point: a
  // contract mentions Gapuwiyak long before we have a page for it.
  const known = new Set((communities.data ?? []).map((c) => c.name.toLowerCase()));
  for (const p of PLACES) {
    if (p.kind === 'sentinel' || known.has(p.name.toLowerCase())) continue;
    out.push({ kind: 'place', label: p.name, sub: `${p.kind}${p.state ? ` · ${p.state}` : ''} · no page yet`, href: '/admin/procurement?q=' + encodeURIComponent(p.name) });
  }

  return NextResponse.json({ records: out, readAt: new Date().toISOString().slice(0, 10) });
}

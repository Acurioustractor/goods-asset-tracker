import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Bed owners — derived "who is connected to this bed?" view.
 *
 * Resolves across four sources without requiring a new mapping table:
 *   1. Stripe orders  (order_items.asset_id → orders.customer_*)
 *   2. QR claims      (user_assets.profile_id → profiles.phone/email)
 *   3. Support tickets (tickets.asset_id → user_contact, user_name)
 *   4. Story submissions (compassion_content.asset_id → created_by)
 *
 * Each source produces a `BedOwnerLink`. `resolveBedOwners()` returns them
 * grouped by best-effort identity (phone preferred, else email, else name)
 * with the most authoritative source ranked first.
 *
 * This is intentionally read-only and computed on demand — no migration
 * required. When we're ready, we can materialise this into a `bed_owners`
 * table and have writers upsert into it.
 */

export type BedOwnerSource = 'purchase' | 'claim' | 'support' | 'story';

export interface BedOwnerLink {
  source: BedOwnerSource;
  assetId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  ghlContactId: string | null;
  /** Anything source-specific worth surfacing in the admin UI */
  detail: string | null;
  /** When this link was first established (purchase date / claim date / etc.) */
  linkedAt: string | null;
}

export interface BedOwnerGroup {
  /** Canonical identity key — phone if present, else email, else lowercased name */
  identityKey: string;
  primaryName: string | null;
  primaryEmail: string | null;
  primaryPhone: string | null;
  links: BedOwnerLink[];
  /** Most authoritative source seen, in this order: purchase > claim > support > story */
  primarySource: BedOwnerSource;
}

const SOURCE_RANK: Record<BedOwnerSource, number> = {
  purchase: 0,
  claim: 1,
  support: 2,
  story: 3,
};

function looksLikeEmail(value: string | null | undefined): value is string {
  return !!value && value.includes('@') && value.includes('.');
}

function looksLikePhone(value: string | null | undefined): value is string {
  if (!value) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 8;
}

function identityKeyFor(link: BedOwnerLink): string {
  if (link.phone) return `p:${link.phone.replace(/\D/g, '')}`;
  if (link.email) return `e:${link.email.toLowerCase().trim()}`;
  if (link.name) return `n:${link.name.toLowerCase().trim()}`;
  return `unknown:${link.source}`;
}

type OrderJoin = {
  customer_email: string | null;
  customer_phone: string | null;
  customer_name: string | null;
  is_sponsorship: boolean;
  sponsored_community: string | null;
  paid_at: string | null;
};

async function loadOrderOwners(supabase: SupabaseClient, assetId: string): Promise<BedOwnerLink[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('asset_id, product_name, orders ( customer_email, customer_phone, customer_name, is_sponsorship, sponsored_community, paid_at )')
    .eq('asset_id', assetId);
  if (error || !data) return [];
  const links: BedOwnerLink[] = [];
  // Supabase types the embedded relation as an array even on 1:1 joins; pluck the first row.
  const rows = data as unknown as Array<{
    asset_id: string;
    product_name: string;
    orders: OrderJoin | OrderJoin[] | null;
  }>;
  for (const row of rows) {
    const order: OrderJoin | null = Array.isArray(row.orders) ? row.orders[0] ?? null : row.orders;
    if (!order) continue;
    const detailParts: string[] = ['Bought via Stripe'];
    if (order.is_sponsorship) {
      detailParts.push(
        order.sponsored_community
          ? `Sponsored → ${order.sponsored_community}`
          : 'Sponsorship',
      );
    }
    links.push({
      source: 'purchase',
      assetId: row.asset_id,
      name: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone,
      ghlContactId: null,
      detail: detailParts.join(' · '),
      linkedAt: order.paid_at,
    });
  }
  return links;
}

type ProfileJoin = { phone: string | null; email: string | null; display_name: string | null };

async function loadClaimOwners(supabase: SupabaseClient, assetId: string): Promise<BedOwnerLink[]> {
  const { data, error } = await supabase
    .from('user_assets')
    .select('asset_id, claimed_at, claim_status, profiles ( phone, email, display_name )')
    .eq('asset_id', assetId)
    .eq('claim_status', 'active');
  if (error || !data) return [];
  const rows = data as unknown as Array<{
    asset_id: string;
    claimed_at: string;
    claim_status: string;
    profiles: ProfileJoin | ProfileJoin[] | null;
  }>;
  const links: BedOwnerLink[] = [];
  for (const row of rows) {
    const profile: ProfileJoin | null = Array.isArray(row.profiles) ? row.profiles[0] ?? null : row.profiles;
    if (!profile) continue;
    links.push({
      source: 'claim' as const,
      assetId: row.asset_id,
      name: profile.display_name || null,
      email: profile.email || null,
      phone: profile.phone || null,
      ghlContactId: null,
      detail: 'Claimed via QR scan',
      linkedAt: row.claimed_at,
    });
  }
  return links;
}

async function loadTicketContacts(supabase: SupabaseClient, assetId: string): Promise<BedOwnerLink[]> {
  const { data, error } = await supabase
    .from('tickets')
    .select('asset_id, user_name, user_contact, category, created_at')
    .eq('asset_id', assetId);
  if (error || !data) return [];
  return (data as Array<{
    asset_id: string;
    user_name: string | null;
    user_contact: string | null;
    category: string | null;
    created_at: string;
  }>)
    .filter((r) => r.user_contact && r.user_contact !== 'no-contact-provided')
    .map((r) => ({
      source: 'support' as const,
      assetId: r.asset_id,
      name: r.user_name,
      email: looksLikeEmail(r.user_contact) ? r.user_contact : null,
      phone: looksLikePhone(r.user_contact) && !looksLikeEmail(r.user_contact) ? r.user_contact : null,
      ghlContactId: null,
      detail: r.category ? `Ticket (${r.category})` : 'Support ticket',
      linkedAt: r.created_at,
    }));
}

async function loadStoryContacts(supabase: SupabaseClient, assetId: string): Promise<BedOwnerLink[]> {
  const { data, error } = await supabase
    .from('compassion_content')
    .select('asset_id, created_by, content_type, created_at')
    .eq('asset_id', assetId);
  if (error || !data) return [];
  return (data as Array<{
    asset_id: string;
    created_by: string | null;
    content_type: string | null;
    created_at: string;
  }>)
    .filter((r) => r.created_by)
    .map((r) => {
      const value = r.created_by as string;
      return {
        source: 'story' as const,
        assetId: r.asset_id,
        name: looksLikeEmail(value) || looksLikePhone(value) ? null : value,
        email: looksLikeEmail(value) ? value : null,
        phone: looksLikePhone(value) && !looksLikeEmail(value) ? value : null,
        ghlContactId: null,
        detail: r.content_type ? `Shared a ${r.content_type}` : 'Shared a story',
        linkedAt: r.created_at,
      };
    });
}

/**
 * Resolve every known link for a single bed, grouped by identity.
 * Empty array = bed has no recipient on record yet.
 */
export async function resolveBedOwners(
  supabase: SupabaseClient,
  assetId: string,
): Promise<BedOwnerGroup[]> {
  const [orders, claims, tickets, stories] = await Promise.all([
    loadOrderOwners(supabase, assetId),
    loadClaimOwners(supabase, assetId),
    loadTicketContacts(supabase, assetId),
    loadStoryContacts(supabase, assetId),
  ]);
  const allLinks: BedOwnerLink[] = [...orders, ...claims, ...tickets, ...stories];
  if (allLinks.length === 0) return [];

  const byIdentity = new Map<string, BedOwnerLink[]>();
  for (const link of allLinks) {
    const key = identityKeyFor(link);
    const bucket = byIdentity.get(key) ?? [];
    bucket.push(link);
    byIdentity.set(key, bucket);
  }

  const groups: BedOwnerGroup[] = [];
  for (const [key, links] of byIdentity.entries()) {
    links.sort((a, b) => SOURCE_RANK[a.source] - SOURCE_RANK[b.source]);
    const primary = links[0];
    groups.push({
      identityKey: key,
      primaryName: links.map((l) => l.name).find(Boolean) ?? null,
      primaryEmail: links.map((l) => l.email).find(Boolean) ?? null,
      primaryPhone: links.map((l) => l.phone).find(Boolean) ?? null,
      links,
      primarySource: primary.source,
    });
  }

  groups.sort((a, b) => SOURCE_RANK[a.primarySource] - SOURCE_RANK[b.primarySource]);
  return groups;
}

/**
 * One-shot summary for a list view: returns the primary owner name + source for each bed.
 * Call this in admin tables (avoid N+1 by chunking asset ids before invoking).
 */
export async function resolvePrimaryOwners(
  supabase: SupabaseClient,
  assetIds: string[],
): Promise<Map<string, { name: string | null; source: BedOwnerSource } | null>> {
  if (assetIds.length === 0) return new Map();
  const map = new Map<string, { name: string | null; source: BedOwnerSource } | null>();
  await Promise.all(
    assetIds.map(async (id) => {
      const groups = await resolveBedOwners(supabase, id);
      map.set(id, groups[0] ? { name: groups[0].primaryName, source: groups[0].primarySource } : null);
    }),
  );
  return map;
}

export const BED_OWNER_SOURCE_LABEL: Record<BedOwnerSource, string> = {
  purchase: 'Buyer',
  claim: 'Recipient',
  support: 'Support contact',
  story: 'Story sharer',
};

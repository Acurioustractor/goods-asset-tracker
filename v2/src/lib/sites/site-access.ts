/**
 * Who is signed in, and which production sites they may open.
 *
 * The database enforces this too — can_access_site()/can_write_site() back
 * every RLS policy on the production tables. This module exists so a page can
 * ask the question before rendering, rather than rendering a shell and getting
 * an empty list back. The DB is the guard; this is the wayfinding.
 */
import { createClient } from '@/lib/supabase/server';

export type MemberRole = 'operator' | 'lead' | 'viewer';

export interface SiteAccess {
  siteId: string;
  siteName: string;
  communityId: string | null;
  communityName: string | null;
  /** 'staff' when access comes from being Goods team rather than membership. */
  role: MemberRole | 'staff';
  canWrite: boolean;
}

export interface Viewer {
  profileId: string;
  displayName: string | null;
  isGoodsStaff: boolean;
  sites: SiteAccess[];
}

/**
 * Returns null when nobody is signed in. Never throws for an anonymous caller:
 * the community portal's front door is a phone login, not an error page.
 */
export async function getViewer(): Promise<Viewer | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, is_goods_staff')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) return null;

  // RLS already limits production_sites to what this viewer may see, so the
  // unfiltered select IS the access list.
  const { data: sites } = await supabase
    .from('production_sites')
    .select('id, name, status, community_id, communities(id, name)')
    .neq('status', 'retired')
    .order('name');

  const { data: memberships } = await supabase
    .from('community_members')
    .select('community_id, role, status')
    .eq('profile_id', user.id)
    .eq('status', 'active');

  const roleByCommunity = new Map<string, MemberRole>(
    (memberships ?? []).map((m) => [m.community_id as string, m.role as MemberRole]),
  );

  const access: SiteAccess[] = (sites ?? []).map((s) => {
    const community = Array.isArray(s.communities) ? s.communities[0] : s.communities;
    const membershipRole = s.community_id ? roleByCommunity.get(s.community_id) : undefined;
    const role: MemberRole | 'staff' = membershipRole ?? 'staff';
    return {
      siteId: s.id as string,
      siteName: s.name as string,
      communityId: (s.community_id as string | null) ?? null,
      communityName: (community as { name?: string } | null)?.name ?? null,
      role,
      canWrite: role === 'staff' || role === 'operator' || role === 'lead',
    };
  });

  return {
    profileId: profile.id as string,
    displayName: (profile.display_name as string | null) ?? null,
    isGoodsStaff: Boolean(profile.is_goods_staff),
    sites: access,
  };
}

/** The one site a community portal opens on, given a community slug. */
export function siteForCommunity(viewer: Viewer, communityId: string): SiteAccess | undefined {
  return viewer.sites.find((s) => s.communityId === communityId);
}

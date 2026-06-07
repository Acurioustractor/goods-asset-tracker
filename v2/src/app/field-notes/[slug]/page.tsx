import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTripStory, tripStories } from '@/lib/data/trip-stories';
import { TripStory } from '@/components/stories/trip-story';
import { resolveGalleryBlocks } from '@/lib/field-notes/resolve-gallery';
import { resolveLiveMapCounts } from '@/lib/field-notes/resolve-live-map';
import { getStoryOverrides, applyOverrides } from '@/lib/field-notes/overrides';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering: the page uses cookies() via createClient() to
// check for admin preview. With generateStaticParams declared, Next.js
// otherwise classifies the route as SSG and throws DYNAMIC_SERVER_USAGE
// when cookies() is called at request time. Galleries also need fresh EL
// data per request anyway, so static caching here is the wrong default.
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

interface AdminUserShape {
  email?: string | null;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}

function isAdminUser(user: AdminUserShape | null): boolean {
  if (!user) return false;
  if ((user.app_metadata as { role?: string })?.role === 'admin') return true;
  if ((user.user_metadata as { role?: string })?.role === 'admin') return true;
  const allow = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return allow.includes(user.email || '');
}

// Static params: only PUBLISHED stories get pre-rendered. Unlisted stories
// (soft-launch / under review) render dynamically per request so the EL
// resolver always returns the latest gallery photos and videos. Internal-only
// stories also fall back to dynamic rendering, which lets admin previewing
// work for any in-progress story without exposing it to the public.
export function generateStaticParams() {
  return tripStories.filter((s) => s.published).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = getTripStory(slug);
  if (!story) {
    return { title: 'Not found', robots: { index: false, follow: false } };
  }
  // Unpublished stories never get indexed even when admins preview them.
  const indexable = story.published;
  return {
    title: story.title,
    description: story.summary,
    robots: indexable ? undefined : { index: false, follow: false },
    openGraph: { title: story.title, description: story.summary, type: 'article', images: [story.image] },
  };
}

export default async function FieldNotePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const story = getTripStory(slug);
  if (!story) notFound();

  // Preview access: any signed-in user, or local dev — matches the
  // existing /admin route pattern in src/proxy.ts. ADMIN_EMAILS role is
  // checked separately only to flag the truly elevated bits (none here).
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLocalDev = process.env.NODE_ENV !== 'production';
  const canPreview = !!user || isLocalDev;
  const isAdmin = isAdminUser(user as AdminUserShape | null);
  void isAdmin; // reserved for future elevated controls

  // Public viewer + story not yet published AND not soft-launched (unlisted)
  // → 404. Unlisted stories are URL-accessible by anyone with the link, but
  // remain hidden from every listing surface and noindex (see metadata above).
  if (!story.published && !story.unlisted && !canPreview) notFound();

  // Preview viewer with query param "?public=1" → render exactly as the
  // public sees it. Published stories default to public-clean mode, even in
  // local dev, so release pages do not show internal consent/admin markers.
  // Admin/dev users can force the editing view with "?internal=1".
  const asPublic = sp.public === '1' || sp.public === 'true';
  const asInternal = sp.internal === '1' || sp.internal === 'true';
  const internal = canPreview && !asPublic && (!story.published || asInternal);

  // Two-pass override application:
  //   1. Apply overrides BEFORE resolution so hardcoded paths win for
  //      masthead/immersive/bleedquote/close media — these blocks have
  //      direct media.image fields the swap UI writes to.
  //   2. Run the EL resolver to fill el-gallery / el-video-gallery items
  //      and resolve fromTag media refs.
  //   3. Apply overrides AGAIN so post-resolution slot overrides (e.g.
  //      pinning a specific video into an el-video-gallery limit:1 slot)
  //      take precedence over EL tag matches.
  const overrides = getStoryOverrides(slug);
  const preResolved = applyOverrides(story, overrides);
  // Diagnostic guards: wrap each resolver in try/catch so a single
  // failing fetch returns the unresolved story instead of crashing
  // the whole route. The original error gets logged.
  let resolved = preResolved;
  try {
    resolved = await resolveGalleryBlocks(preResolved, { internal });
  } catch (err) {
    console.error('[field-notes] resolveGalleryBlocks failed:', err);
  }
  let withLiveMap = resolved;
  try {
    withLiveMap = await resolveLiveMapCounts(resolved);
  } catch (err) {
    console.error('[field-notes] resolveLiveMapCounts failed:', err);
  }
  const final = applyOverrides(withLiveMap, overrides);
  return <TripStory story={final} internal={internal} />;
}

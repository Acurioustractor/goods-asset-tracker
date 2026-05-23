import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTripStory, tripStories } from '@/lib/data/trip-stories';
import { TripStory } from '@/components/stories/trip-story';
import { resolveGalleryBlocks } from '@/lib/field-notes/resolve-gallery';
import { createClient } from '@/lib/supabase/server';

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

// Static params: only PUBLISHED stories get pre-rendered. Unpublished stories
// fall back to dynamic rendering, which lets admin previewing work for any
// in-progress story without exposing it to the public.
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
    openGraph: { title: story.title, description: story.summary, type: 'article' },
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

  // Public viewer + story not yet published → 404. No leakage.
  if (!story.published && !canPreview) notFound();

  // Preview viewer with query param "?public=1" → render exactly as the
  // public sees it. Useful for sanity-checking before flipping published:true.
  const asPublic = sp.public === '1' || sp.public === 'true';
  const internal = canPreview && !asPublic;

  const resolved = await resolveGalleryBlocks(story, { internal });
  return <TripStory story={resolved} internal={internal} />;
}

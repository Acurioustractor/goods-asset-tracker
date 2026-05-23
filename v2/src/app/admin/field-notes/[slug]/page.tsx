import { redirect } from 'next/navigation';
import { tripStories } from '@/lib/data/trip-stories';

// The field-notes experience lives on the public route at /field-notes/[slug]
// as a full-bleed scrollytelling page. Admins are auto-detected via the auth
// cookie and get internal preview (consent-pending content + unpublished
// stories visible). This admin route is now just a redirect for old links.

export function generateStaticParams() {
  return tripStories.map((s) => ({ slug: s.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function FieldNoteAdminRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/field-notes/${slug}`);
}

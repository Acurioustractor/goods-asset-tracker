import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Media & Partner Pack',
  description: 'Everything funders and partners need: project overview, team bios, key stats, photos, videos, brand assets, and key links.',
};

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return children;
}

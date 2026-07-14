import type { Metadata } from 'next';

// Investor/pitch material: reachable by link, but never indexed. Several of
// these pages carry funding asks and storyteller consent working views that
// have no business in search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PitchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

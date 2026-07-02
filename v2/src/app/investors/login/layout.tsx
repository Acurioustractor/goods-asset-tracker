import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investor access',
  robots: { index: false, follow: false },
};

export default function InvestorsLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

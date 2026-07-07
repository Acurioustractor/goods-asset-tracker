import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investor Deck',
  description:
    'Goods on Country investor deck — recycled-plastic beds pressed On Country, built so community owns the factory. Catalytic capital that converts into community ownership.',
  robots: { index: false, follow: false },
};

export default function DeckLayout({ children }: { children: React.ReactNode }) {
  return children;
}

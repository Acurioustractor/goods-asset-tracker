import type { Metadata } from 'next';
import { QuoteCardsClient } from './quote-cards-client';

export const metadata: Metadata = {
  title: 'Quote cards · Goods admin',
  description:
    'Build portrait + quote thumbnails from the storyteller registry. Filter by community, turn, theme and consent tier; focus any card to screenshot.',
  robots: { index: false, follow: false },
};

export default function QuoteCardsPage() {
  return <QuoteCardsClient />;
}

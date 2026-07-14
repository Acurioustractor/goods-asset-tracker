import { DeckClient } from './deck-builder-client';

export const metadata = {
  title: 'Deck builder | Goods admin',
  description:
    'Edit the investor deck in place: copy, voices and presenter scripts. The public deck at /pitch/deck renders the committed version.',
};

export default function DeckBuilderPage() {
  return <DeckClient />;
}

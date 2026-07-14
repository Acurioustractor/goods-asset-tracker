import { DeckClient } from './deck-client';

export const metadata = {
  title: 'The deck | Goods on Country pitch',
  description:
    'The whole aligned investor deck on one screen: edit any slide in place, then hit Present to open the main deck.',
};

export default function PitchDeckPage() {
  return <DeckClient />;
}

import type { Metadata } from 'next';
import { QbeStory } from './qbe-story';

/**
 * The working copy of the story of the model, behind the investors gate with /sites/qbe. Same
 * chapters as the public /pitch/model, plus the deck map, the form map, every funder line by name,
 * who asked each question, and what is still open.
 */
export const metadata: Metadata = {
  title: { absolute: 'The whole story, working copy | Goods on Country for QBE' },
  description: 'We buy beds. Communities sell them. The money stays with them and builds the next thing. The working copy, with the deck map, the form map and every line by name.',
  robots: { index: false, follow: false },
};

export default function QbeStoryWorkingPage() {
  return <QbeStory audience="working" />;
}

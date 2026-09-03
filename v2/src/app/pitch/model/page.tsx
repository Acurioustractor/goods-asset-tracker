import type { Metadata } from 'next';
import { QbeStory } from '@/app/sites/qbe/story/qbe-story';

/**
 * The model, in full, for anyone. An appendix of /pitch/road (PITCH_APPENDICES). First person,
 * no internal notes: no form questions, no deck frames, no named foundation or lender, no open
 * decision, no calendar. The pitch layout keeps it out of search results, reachable by link.
 */
export const metadata: Metadata = {
  title: { absolute: 'The model, in full | Goods on Country' },
  description: 'We buy beds. Communities sell them. The money stays with them and builds the next thing. How it works, drawn, with the numbers and the questions people ask us.',
};

export default function ModelPage() {
  return <QbeStory audience="public" />;
}

import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). /story was
// 1,178 lines of prose hardcoded in JSX, which put it outside every prose
// guard in the repo. /story/road tells the same history from guarded data
// (story-road.ts) with consent-gated voices. Old links keep working.
export default function StoryRedirectPage() {
  permanentRedirect('/story/road');
}

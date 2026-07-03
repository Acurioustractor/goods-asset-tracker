/**
 * Community OS — consented, published records for the site.
 * Reads a COMMITTED snapshot (community-os-published.json): no runtime Notion
 * token, no env vars, no connector, nothing to redeploy to see. The snapshot is
 * refreshed from Notion by scripts/sync-community-os.mjs (the "Community OS sync"
 * GitHub Action) or by hand. Consent gate still applies at sync time.
 */
import publishedData from '@/lib/data/community-os-published.json';

export interface PublishedCommunity {
  id: string; name: string; state: string | null; bedsDeployed: number | null;
  washingMachines: number | null; relationshipStage: string | null;
  provesOrTests: string | null; storytellers: string | null; notionUrl: string;
}
export interface PublishedStory {
  id: string; title: string; storyteller: string | null; type: string | null; notionUrl: string;
}
interface PublishedData { generatedAt?: string; communities?: PublishedCommunity[]; stories?: PublishedStory[]; }

const data = publishedData as unknown as PublishedData;
export async function getPublishedCommunities(): Promise<PublishedCommunity[]> { return data.communities ?? []; }
export async function getPublishedStories(): Promise<PublishedStory[]> { return data.stories ?? []; }

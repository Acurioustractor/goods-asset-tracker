/**
 * Community OS — read consented, published community records from the Notion hub.
 *
 * Notion (the "Goods Community OS" hub) is the source of truth. This module reads
 * ONLY rows that are explicitly cleared for the public web:
 *   - `Publish to site` checkbox is checked, AND
 *   - `Consent status` = "Cleared for public".
 * Everything else stays private. This mirrors our OCAP / data-sovereignty practice:
 * nothing about a community reaches the site unless a person has cleared it.
 *
 * Safe by default. If ENABLE_COMMUNITY_OS !== 'true', or the Notion token / database
 * id are not set, this returns [] and callers fall back to existing local data.
 * It never throws to the caller, so it cannot break a page render.
 *
 * One-time setup: see v2/COMMUNITY-OS.md.
 */

export interface PublishedCommunity {
  id: string;
  name: string;
  state: string | null;
  bedsDeployed: number | null;
  washingMachines: number | null;
  relationshipStage: string | null;
  provesOrTests: string | null;
  storytellers: string | null;
  notionUrl: string;
}

const NOTION_VERSION = '2022-06-28';

/** True only when the integration is switched on AND fully configured. */
export function communityOsEnabled(): boolean {
  return (
    process.env.ENABLE_COMMUNITY_OS === 'true' &&
    Boolean(process.env.NOTION_TOKEN) &&
    Boolean(process.env.NOTION_COMMUNITIES_DB_ID)
  );
}

/**
 * Fetch communities that have been consented and published in the Notion hub.
 * Returns [] when disabled, unconfigured, or on any error.
 */
export async function getPublishedCommunities(): Promise<PublishedCommunity[]> {
  if (!communityOsEnabled()) return [];

  try {
    const res = await fetch(
      `https://api.notion.com/v1/databases/${process.env.NOTION_COMMUNITIES_DB_ID}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            and: [
              { property: 'Publish to site', checkbox: { equals: true } },
              { property: 'Consent status', select: { equals: 'Cleared for public' } },
            ],
          },
          sorts: [{ property: 'Beds deployed', direction: 'descending' }],
        }),
        // Notion is the source of truth; refresh hourly.
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) return [];
    const data = await res.json();
    return ((data.results as unknown[]) ?? [])
      .map(mapRow)
      .filter((c): c is PublishedCommunity => c !== null);
  } catch {
    return [];
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(page: any): PublishedCommunity | null {
  const p = page?.properties;
  if (!p) return null;
  const name = plain(p['Community']?.title);
  if (!name) return null;
  return {
    id: String(page.id),
    name,
    state: p['State']?.select?.name ?? null,
    bedsDeployed: typeof p['Beds deployed']?.number === 'number' ? p['Beds deployed'].number : null,
    washingMachines:
      typeof p['Washing machines']?.number === 'number' ? p['Washing machines'].number : null,
    relationshipStage: p['Relationship stage']?.select?.name ?? null,
    provesOrTests: plain(p['What this place proves or tests']?.rich_text) || null,
    storytellers: plain(p['Storytellers documented']?.rich_text) || null,
    notionUrl: String(page.url ?? ''),
  };
}

function plain(rich: any): string {
  if (!Array.isArray(rich)) return '';
  return rich.map((r: any) => r?.plain_text ?? '').join('').trim();
}

/**
 * Published, consent-cleared stories from the Notion Stories & Media database.
 * Same consent gate: `Publish to site` checked AND `Consent status` = "Cleared for public".
 * Returns [] when disabled or unconfigured. Never throws.
 */
export interface PublishedStory {
  id: string;
  title: string;
  storyteller: string | null;
  type: string | null;
  notionUrl: string;
}

export function storiesEnabled(): boolean {
  return (
    process.env.ENABLE_COMMUNITY_OS === 'true' &&
    Boolean(process.env.NOTION_TOKEN) &&
    Boolean(process.env.NOTION_STORIES_DB_ID)
  );
}

export async function getPublishedStories(): Promise<PublishedStory[]> {
  if (!storiesEnabled()) return [];
  try {
    const res = await fetch(
      `https://api.notion.com/v1/databases/${process.env.NOTION_STORIES_DB_ID}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            and: [
              { property: 'Publish to site', checkbox: { equals: true } },
              { property: 'Consent status', select: { equals: 'Cleared for public' } },
            ],
          },
        }),
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return ((data.results as unknown[]) ?? [])
      .map(mapStoryRow)
      .filter((s): s is PublishedStory => s !== null);
  } catch {
    return [];
  }
}

function mapStoryRow(page: any): PublishedStory | null {
  const p = page?.properties;
  if (!p) return null;
  const title = plain(p['Story / Media']?.title);
  if (!title) return null;
  return {
    id: String(page.id),
    title,
    storyteller: plain(p['Storyteller']?.rich_text) || null,
    type: p['Type']?.select?.name ?? null,
    notionUrl: String(page.url ?? ''),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

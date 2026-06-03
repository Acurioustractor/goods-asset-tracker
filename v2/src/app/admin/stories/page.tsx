import { empathyLedger } from '@/lib/empathy-ledger/client';
import { getCuratedQuotes } from '@/lib/data/curated-quotes';
import { StoriesDashboard } from './stories-dashboard';
import type { SyndicationStoryteller } from '@/lib/empathy-ledger/types';

export const dynamic = 'force-dynamic';

// Storyteller rows that represent system accounts / team rollups, not real
// community storytellers. Filtered out of public + admin grids alike.
const NON_PERSON_NAMES = new Set([
  'Accounts ACT',
  'ACT Production Team',
  'Nicholas Marchesi',
  'E2E Super Admin',
  'PICC Community Hub Team',
  "PICC Women's Healing Service Team",
  "PICC Women's Shelter Team",
  'YPA Team',
]);

function isRealStoryteller(st: SyndicationStoryteller): boolean {
  if (NON_PERSON_NAMES.has(st.name)) return false;
  if (/\bteam\b/i.test(st.name)) return false;
  if (/\b(admin|account)\b/i.test(st.name) && !/^[A-Z][a-z]+ [A-Z]/.test(st.name)) return false;
  return true;
}

export default async function StoriesPage() {
  const [rawStorytellers, projectStories, galleries, uncategorizedPhotos] = await Promise.all([
    empathyLedger.getProjectStorytellers({ limit: 50 }).catch(() => []),
    empathyLedger.getProjectStories({ limit: 50 }).catch(() => []),
    empathyLedger.getProjectGalleries().catch(() => []),
    empathyLedger.getProjectMedia({ limit: 60 }).catch(() => []),
  ]);

  // Enrich storytellers with cross-project quotes, then apply curated overrides
  const enriched = await empathyLedger.enrichStorytellersWithQuotes(rawStorytellers);
  const storytellers = enriched
    .filter(isRealStoryteller)
    .map((st) => {
      const curated = getCuratedQuotes(st.name);
      if (!curated || curated.length === 0) return st;
      return {
        ...st,
        quotes: curated.map((q) => ({
          text: q.text,
          context: q.context,
          impactScore: null,
        })),
      };
    });

  // Build storyteller name lookup for author resolution
  const storytellerNames: Record<string, string> = {};
  for (const st of storytellers) {
    storytellerNames[st.id] = st.name;
  }

  // Split stories
  const videoStories = projectStories.filter((s) => s.videoLink);
  const textStories = projectStories.filter((s) => !s.videoLink);

  // Pre-resolve all author names (server-side)
  const resolvedAuthors: Record<string, string> = {};
  for (const story of projectStories) {
    let authorName = story.storytellerName || story.authorName;
    if ((!authorName || authorName === 'Unknown' || authorName === 'NONE') && story.storytellerId) {
      authorName = storytellerNames[story.storytellerId] || authorName;
    }
    // Try to extract name from title pattern "Community Voices — Name" or "Title — Name"
    if (!authorName || authorName === 'Unknown' || authorName === 'NONE') {
      const titleMatch = story.title.match(/—\s*(.+)$/);
      if (titleMatch) {
        authorName = titleMatch[1].trim();
      }
    }
    resolvedAuthors[story.id] = authorName || 'Goods on Country';
  }

  return (
    <StoriesDashboard
      storytellers={storytellers}
      videoStories={videoStories}
      textStories={textStories}
      galleries={galleries}
      uncategorizedPhotos={uncategorizedPhotos}
      resolvedAuthors={resolvedAuthors}
    />
  );
}

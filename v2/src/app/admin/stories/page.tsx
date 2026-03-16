import { empathyLedger } from '@/lib/empathy-ledger/client';
import { curatedQuotes } from '@/lib/data/curated-quotes';
import { StoriesDashboard } from './stories-dashboard';

export const dynamic = 'force-dynamic';

export default async function StoriesPage() {
  const [rawStorytellers, projectStories, galleries, uncategorizedPhotos] = await Promise.all([
    empathyLedger.getProjectStorytellers({ limit: 50 }).catch(() => []),
    empathyLedger.getProjectStories({ limit: 50 }).catch(() => []),
    empathyLedger.getProjectGalleries().catch(() => []),
    empathyLedger.getProjectMedia({ limit: 60 }).catch(() => []),
  ]);

  // Enrich storytellers with cross-project quotes, then apply curated overrides
  const enriched = await empathyLedger.enrichStorytellersWithQuotes(rawStorytellers);
  const storytellers = enriched.map((st) => {
    const curated = curatedQuotes[st.name];
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

// Site content — the "what's live on the site" review surface. One list of every
// published page/post: story posts (field notes + Empathy Ledger stories), partner
// pages, and the core public pages. Each row opens the LIVE page in a new tab so you
// can review what's actually published. This is the one thing the other Story
// surfaces didn't cover ("how do I review all posts on the site").

import Link from 'next/link';
import { tripStories } from '@/lib/data/trip-stories';
import { PARTNERS } from '@/lib/data/partners';
import { empathyLedger } from '@/lib/empathy-ledger';

export const dynamic = 'force-dynamic';

type Status = 'Live' | 'Draft';
interface Entry {
  title: string;
  url: string;
  status: Status;
  meta?: string;
}

// The main public pages of the site (confirmed routes under src/app). Live links,
// so you can eyeball each one. Add/remove as pages come and go.
const CORE_PAGES: { title: string; url: string }[] = [
  { title: 'Home', url: '/' },
  { title: 'Our story', url: '/story' },
  { title: 'Mission', url: '/mission' },
  { title: 'Impact', url: '/impact' },
  { title: 'Process', url: '/process' },
  { title: 'Community', url: '/community' },
  { title: 'Get involved', url: '/get-involved' },
  { title: 'Gallery', url: '/gallery' },
  { title: 'Shop', url: '/shop' },
  { title: 'Press', url: '/press' },
  { title: 'About', url: '/about' },
  { title: 'Contact', url: '/contact' },
  { title: 'Investors (gated)', url: '/investors' },
  { title: 'Field notes index', url: '/field-notes' },
  { title: 'Stories index', url: '/stories' },
];

async function getElStories(): Promise<Entry[]> {
  try {
    const stories = await empathyLedger.getGoodsStories({ limit: 100 });
    return stories.map((s) => ({
      title: s.title || 'Untitled story',
      url: `/stories/${s.id}`,
      status: 'Live' as Status,
    }));
  } catch {
    return [];
  }
}

function StatusBadge({ status }: { status: Status }) {
  const cls =
    status === 'Live'
      ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300'
      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300';
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>{status}</span>;
}

function Section({ title, blurb, entries }: { title: string; blurb: string; entries: Entry[] }) {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title} <span className="ml-1 font-normal text-muted-foreground/70">({entries.length})</span>
      </h2>
      <p className="mb-2 text-xs text-muted-foreground">{blurb}</p>
      <div className="divide-y divide-border rounded-lg border border-border">
        {entries.length === 0 && <p className="px-3 py-4 text-sm text-muted-foreground">None yet.</p>}
        {entries.map((e) => (
          <div key={e.url + e.title} className="flex items-center gap-3 px-3 py-2">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-foreground">{e.title}</div>
              {e.meta && <div className="truncate text-xs text-muted-foreground">{e.meta}</div>}
              <div className="truncate text-[11px] text-muted-foreground/70">{e.url}</div>
            </div>
            <StatusBadge status={e.status} />
            <Link
              href={e.url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:border-foreground"
            >
              View ↗
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function SiteContentPage() {
  const fieldNotes: Entry[] = tripStories.map((s) => ({
    title: s.title,
    url: `/field-notes/${s.slug}`,
    status: s.published ? 'Live' : 'Draft',
    meta: s.dateline,
  }));

  const partners: Entry[] = Object.values(PARTNERS).map((p) => ({
    title: p.name,
    url: `/partners/${p.slug}`,
    status: 'Live' as Status,
  }));
  // Oonchiumpa has a dedicated /partners/oonchiumpa route but isn't in the PARTNERS
  // record — include it so the list matches what's actually live.
  if (!partners.some((p) => p.url === '/partners/oonchiumpa')) {
    partners.push({ title: 'Oonchiumpa', url: '/partners/oonchiumpa', status: 'Live' });
  }

  const stories = await getElStories();
  const core: Entry[] = CORE_PAGES.map((p) => ({ title: p.title, url: p.url, status: 'Live' as Status }));

  const total = fieldNotes.length + stories.length + partners.length + core.length;
  const drafts = fieldNotes.filter((e) => e.status === 'Draft').length;

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Site content</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Everything published on the public site, in one place — story posts, partner pages and the
          core pages. Click <span className="font-medium text-foreground">View ↗</span> to open the
          live page in a new tab and review it.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {total} entries · {drafts} draft{drafts === 1 ? '' : 's'} · {stories.length} Empathy Ledger{' '}
          {stories.length === 1 ? 'story' : 'stories'}
        </p>
      </header>

      <Section
        title="Field notes"
        blurb="Long-form trip stories at /field-notes. Drafts are written but not yet public."
        entries={fieldNotes}
      />
      <Section
        title="Stories (Empathy Ledger)"
        blurb="Community stories published through Empathy Ledger, shown on /stories."
        entries={stories}
      />
      <Section
        title="Partner pages"
        blurb="Dedicated partner story pages at /partners/[slug]."
        entries={partners}
      />
      <Section title="Core pages" blurb="The main public pages of the site." entries={core} />
    </div>
  );
}

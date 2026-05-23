import Link from 'next/link';
import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/server';
import { tripStories } from '@/lib/data/trip-stories';
import type { TripBlock } from '@/lib/data/trip-stories';
import { getGoodsStorytellers, slugify } from '@/lib/storytellers';
import { CreateStorytellerForm } from './create-form';

export const metadata: Metadata = {
  title: 'New storyteller · Goods admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

async function fetchCommunities(): Promise<string[]> {
  const supabase = createServiceClient();
  const { data } = await supabase.from('communities').select('name').order('name');
  return (data || []).map((c) => c.name as string).filter(Boolean);
}

interface VoiceMention {
  who: string;
  community?: string;
  storySlug: string;
  storyTitle: string;
}

// Scan every trip story for named voices: voices.cards[].who + read.pulls[].src
// (parsed) + bleedquote (skip — no speaker field). Returns deduped name list.
function scanTripVoices(): VoiceMention[] {
  const out: VoiceMention[] = [];
  const seen = new Set<string>();
  for (const story of tripStories) {
    for (const block of story.blocks as TripBlock[]) {
      if (block.kind === 'voices') {
        for (const c of block.cards) {
          if (!c.who || c.who.toLowerCase().includes('elder')) continue;
          const key = c.who.toLowerCase().trim();
          if (seen.has(key)) continue;
          seen.add(key);
          out.push({ who: c.who, community: c.community, storySlug: story.slug, storyTitle: story.title });
        }
      } else if (block.kind === 'read' && 'pulls' in block && block.pulls) {
        for (const p of block.pulls) {
          const who = p.src.split(/\s*·\s*/)[0]?.trim();
          if (!who || who.toLowerCase().includes('team note') || who.toLowerCase().includes('goods')) continue;
          const key = who.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          out.push({ who, storySlug: story.slug, storyTitle: story.title });
        }
      }
    }
  }
  return out;
}

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function asString(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function NewStorytellerPage({ searchParams }: Props) {
  const communities = await fetchCommunities();
  const sp = await searchParams;
  const prefill = {
    displayName: asString(sp.name),
    community: asString(sp.community),
    bio: asString(sp.bio),
    consentSource: asString(sp.consentSource),
    location: asString(sp.location),
  };

  // Gap analysis: trip voices mentioned in stories but NOT yet in EL.
  const [mentions, existing] = await Promise.all([
    Promise.resolve(scanTripVoices()),
    getGoodsStorytellers().catch(() => []),
  ]);
  const existingSlugs = new Set(existing.map((s) => slugify(s.displayName)));
  const gaps = mentions.filter((m) => !existingSlugs.has(slugify(m.who)));

  return (
    <div className="max-w-3xl space-y-6 pb-16">
      <header>
        <p className="text-xs">
          <Link href="/admin/el-storytellers" className="text-blue-700 hover:underline">
            ← back to storytellers
          </Link>
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Add a storyteller to Empathy Ledger</h1>
        <p className="mt-1 text-sm text-gray-500 max-w-prose">
          Creates a new EL storyteller scoped to the Goods organisation. Defaults to
          <code className="mx-1 rounded bg-gray-100 px-1 py-0.5">is_active=false</code> and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5">content_status=draft</code> so nothing
          surfaces publicly until you verify consent and flip the flags in EL. After saving, the
          form stays open so you can keep adding — community + consent source persist.
        </p>
        <p className="mt-2 max-w-prose rounded border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
          Capture consent per{' '}
          <code className="rounded bg-white px-1 py-0.5">wiki/articles/brand-comms/CONSENT_PROCESS.md</code>{' '}
          before publishing. For young people (under 18), capture family/guardian consent and
          appropriate cultural facilitation (e.g. Oonchiumpa for Mykel) before flipping
          <code className="mx-1 rounded bg-white px-1 py-0.5">has_explicit_consent</code> to true.
        </p>
      </header>

      {gaps.length > 0 && (
        <section className="rounded-lg border border-blue-200 bg-blue-50/60 p-4">
          <h2 className="text-sm font-semibold text-blue-900">
            Trip voices mentioned but not yet in EL ({gaps.length})
          </h2>
          <p className="mt-1 text-xs text-blue-800">
            Click any name to pre-fill the form. Saves a typing round.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {gaps.map((g, i) => {
              const params = new URLSearchParams({ name: g.who });
              if (g.community) params.set('community', g.community);
              if (g.community === 'Utopia Homelands' || g.community === 'Ampilatwatja') {
                params.set('consentSource', 'oonchiumpa');
              }
              return (
                <Link
                  key={i}
                  href={`/admin/el-storytellers/new?${params.toString()}`}
                  className="rounded-full border border-blue-300 bg-white px-3 py-1 text-xs font-medium text-blue-800 hover:bg-blue-100"
                  title={`From ${g.storyTitle}`}
                >
                  + {g.who}{g.community ? ` · ${g.community}` : ''}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <CreateStorytellerForm communities={communities} prefill={prefill} />
    </div>
  );
}

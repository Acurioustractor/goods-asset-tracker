'use client';

// PITCH COCKPIT client — tabs over the assembled pitch data. See page.tsx for
// where every piece of data comes from (all imported from sources of truth).

import { useMemo, useState } from 'react';
import { QUOTE_TOPICS, type DeckSlide, type QuoteTopic } from '@/lib/data/pitch-cockpit';

// ── serialized shapes (kept in sync with page.tsx) ──────────────────────────

interface CockpitQuote { text: string; context: string; status: 'primary' | 'approved' | 'hold' | 'retired'; note: string | null; topics: QuoteTopic[] }
interface CockpitCurated { text: string; context: string; topics: QuoteTopic[] }
export interface CockpitStoryteller {
  slug: string; name: string; role: string; community: string; tier: string;
  practitioner: boolean; narratedBy: string | null; turns: string | null;
  portrait: string | null; notes: string | null;
  quotes: CockpitQuote[]; curated: CockpitCurated[];
  provenance: string; release: string | null; recordingDates: string[];
}
interface MediaItem { src: string; full: string; title: string; type: 'image' | 'video'; area: string; rating: number | null; canonSlot?: string | null; starred?: boolean }
export interface CockpitData {
  deckPlan: DeckSlide[];
  deckSlideFiles: string[];
  storytellers: CockpitStoryteller[];
  provenanceAsOf: string;
  media: { starred: MediaItem[]; videos: MediaItem[]; totalLocal: number };
  ask: {
    headline: string; match: string; matchGate: string;
    buckets: { name: string; amount: string; what: string; label: string }[];
    modelledEconomics: { item: string; figure: string; label: string }[];
  };
  direction: { headline: string; points: string[] };
  supporters: {
    totalReceived: number;
    received: { source: string; amount: number; when: string }[];
    receivables: { source: string; amount: number; notes: string }[];
    totalReceivables: number;
  };
  prospects: { group: string; targets: { name: string; status: string; priority: string; amountSignal: string | null; instrument: string | null; nextAction: string; contactName: string | null }[] }[];
  advisory: { name: string; organisation: string; role: string }[];
  canon: { id: string; label: string; value: number | string; unit: string | null; domain: string; claimLabel: string; asAt: string; source: string; definition: string }[];
  gemini: { keyPresent: boolean; model: string };
  drawings: { file: string; set: string }[];
}

const TABS = ['Deck plan', 'Storytellers', 'Media', 'The ask', 'Drawings', 'Numbers & align'] as const;

const money = (n: number) => `$${n.toLocaleString()}`;

const tierBadge: Record<string, string> = {
  external: 'bg-green-100 text-green-800',
  website: 'bg-primary/10 text-primary',
  funder: 'bg-amber-100 text-amber-800',
  hold: 'bg-red-100 text-red-800',
  pending: 'bg-muted text-foreground',
  internal: 'bg-muted text-muted-foreground',
};
const statusBadge: Record<string, string> = {
  primary: 'bg-green-100 text-green-800',
  approved: 'bg-primary/10 text-primary',
  hold: 'bg-red-100 text-red-800',
};

export function CockpitClient({ data }: { data: CockpitData }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Deck plan');
  return (
    <div className="p-6">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-bold">Pitch cockpit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The whole pitch on one page: the deck slide by slide, every choosable cleared quote, the
          starred media, the ask and everyone around it, the drawings, and the numbers with their
          Notion alignment block. Present from <a className="underline" href="/pitch/simple">/pitch/simple</a>.
        </p>
      </header>
      <nav className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === t ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}>
            {t}
          </button>
        ))}
      </nav>
      {tab === 'Deck plan' && <DeckPlanTab data={data} />}
      {tab === 'Storytellers' && <StorytellersTab data={data} />}
      {tab === 'Media' && <MediaTab data={data} />}
      {tab === 'The ask' && <AskTab data={data} />}
      {tab === 'Drawings' && <DrawingsTab data={data} />}
      {tab === 'Numbers & align' && <NumbersTab data={data} />}
    </div>
  );
}

// ── 1 · Deck plan ────────────────────────────────────────────────────────────

function DeckPlanTab({ data }: { data: CockpitData }) {
  const fileFor = (n: number) => data.deckSlideFiles.find((f) => f.startsWith(`goods-slide-${String(n).padStart(2, '0')}-`));
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        14 slides, one idea each, ask on 11 after proof has earned it. Source of truth:{' '}
        <code className="text-xs">v2/public/deck-slides/slides-source.html</code>, re-rendered with{' '}
        <code className="text-xs">node scripts/render-deck.mjs</code>.
      </p>
      {data.deckPlan.map((s) => {
        const file = fileFor(s.n);
        return (
          <div key={s.id} className="flex gap-4 rounded-lg border p-4">
            <div className="w-56 flex-none">
              {file ? (
                <a href={`/deck-slides/${file}`} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/deck-slides/${file}`} alt={s.name} className="rounded border" />
                </a>
              ) : (
                <div className="flex h-28 items-center justify-center rounded border text-xs text-muted-foreground">not rendered</div>
              )}
              <div className="mt-1 text-center text-xs text-muted-foreground">slide {s.n}</div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold">{s.n}. {s.name}</h3>
              <p className="mt-1 text-sm"><span className="font-medium text-muted-foreground">Why this slide: </span>{s.why}</p>
              <p className="mt-1 text-sm"><span className="font-medium text-muted-foreground">What we say: </span>{s.talkTrack}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded bg-muted px-2 py-0.5">{s.visual}</span>
                {s.illustration && <span className="rounded bg-amber-50 px-2 py-0.5 text-amber-800">drawn: {s.illustration}</span>}
                {s.voices.map((v) => <span key={v} className="rounded bg-accent/10 px-2 py-0.5 text-accent">{v}</span>)}
                {s.visualNotes && <span className="text-muted-foreground">{s.visualNotes}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 2 · Storytellers ─────────────────────────────────────────────────────────

function StorytellersTab({ data }: { data: CockpitData }) {
  const [topic, setTopic] = useState<QuoteTopic | 'all'>('all');
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const model = useMemo(() => {
    const communities = new Map<string, number>();
    const topics = new Map<string, number>();
    const tiers = new Map<string, number>();
    let quoteCount = 0;
    for (const s of data.storytellers) {
      communities.set(s.community, (communities.get(s.community) ?? 0) + 1);
      tiers.set(s.tier, (tiers.get(s.tier) ?? 0) + 1);
      for (const qu of [...s.quotes, ...s.curated]) {
        quoteCount += 1;
        for (const t of qu.topics) topics.set(t, (topics.get(t) ?? 0) + 1);
      }
    }
    return { communities: [...communities.entries()].sort((a, b) => b[1] - a[1]), topics, tiers, quoteCount };
  }, [data.storytellers]);

  const impactLines = useMemo(() => {
    const out: { name: string; community: string; text: string; topics: QuoteTopic[] }[] = [];
    for (const s of data.storytellers) {
      if (s.tier !== 'external') continue;
      for (const qu of s.quotes) {
        if (qu.status !== 'hold' && qu.topics.some((t) => t === 'health' || t === 'demand')) {
          out.push({ name: s.name, community: s.community, text: qu.text, topics: qu.topics });
        }
      }
    }
    return out.slice(0, 8);
  }, [data.storytellers]);

  const shown = data.storytellers.filter((s) => {
    if (q && !`${s.name} ${s.community} ${s.role}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (topic === 'all') return true;
    return [...s.quotes, ...s.curated].some((qu) => qu.topics.includes(topic));
  });

  return (
    <div>
      {/* The storyteller model, at the top */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">The model</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {data.storytellers.length} voices in the registry · {model.quoteCount} choosable lines ·
            consent tiers: {[...model.tiers.entries()].map(([t, n]) => `${t} ${n}`).join(' · ')}.
            External claims use tier <b>external</b> only. Provenance as of {data.provenanceAsOf}.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">Locations</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {model.communities.map(([c, n]) => `${c} (${n})`).join(' · ')}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">Main themes</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {QUOTE_TOPICS.map((t) => `${t} ${model.topics.get(t) ?? 0}`).join(' · ')}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-lg border p-4">
        <h3 className="text-sm font-semibold">Impact signals from the stories (cleared, non-hold)</h3>
        <ul className="mt-2 grid gap-2 text-sm md:grid-cols-2">
          {impactLines.map((l, i) => (
            <li key={i} className="rounded bg-muted/40 p-2">
              &ldquo;{l.text}&rdquo; <span className="text-xs text-muted-foreground">· {l.name}, {l.community}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name / community / role"
          className="rounded border px-3 py-1.5 text-sm" />
        <button onClick={() => setTopic('all')} className={`rounded-full px-3 py-1 text-xs ${topic === 'all' ? 'bg-foreground text-background' : 'bg-muted'}`}>all topics</button>
        {QUOTE_TOPICS.map((t) => (
          <button key={t} onClick={() => setTopic(t)} className={`rounded-full px-3 py-1 text-xs ${topic === t ? 'bg-foreground text-background' : 'bg-muted'}`}>{t}</button>
        ))}
      </div>

      {/* Storyteller cards */}
      <div className="space-y-3">
        {shown.map((s) => (
          <div key={s.slug} className="rounded-lg border">
            <button onClick={() => setOpen(open === s.slug ? null : s.slug)} className="flex w-full items-center gap-3 p-3 text-left">
              {s.portrait ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.portrait} alt={s.name} className="h-12 w-12 flex-none rounded-full object-cover" />
              ) : (
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">no photo</div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{s.name}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${tierBadge[s.tier] ?? 'bg-muted'}`}>{s.tier}</span>
                  {s.practitioner && <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[11px] text-purple-700">practitioner</span>}
                  {s.narratedBy && <span className="text-[11px] text-muted-foreground">told by {s.narratedBy}</span>}
                </div>
                <div className="text-xs text-muted-foreground">{s.role} · {s.community} · {s.provenance}{s.release ? ` · ${s.release}` : ''}</div>
              </div>
              <span className="text-xs text-muted-foreground">{s.quotes.length + s.curated.length} lines {open === s.slug ? '▾' : '▸'}</span>
            </button>
            {open === s.slug && (
              <div className="border-t p-3">
                {s.quotes.length > 0 && (
                  <div className="space-y-2">
                    {s.quotes.map((qu, i) => (
                      <div key={i} className={`rounded p-2 text-sm ${qu.status === 'hold' ? 'bg-red-50' : 'bg-muted/40'}`}>
                        &ldquo;{qu.text}&rdquo;
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                          <span className={`rounded px-1.5 py-0.5 font-medium ${statusBadge[qu.status]}`}>{qu.status}</span>
                          <span className="text-muted-foreground">{qu.context}</span>
                          {qu.topics.map((t) => <span key={t} className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-800">{t}</span>)}
                          {qu.note && <span className="text-muted-foreground">· {qu.note}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {s.curated.length > 0 && (
                  <div className="mt-3">
                    <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">More from the transcript (curated-quotes.ts)</div>
                    <div className="space-y-2">
                      {s.curated.map((qu, i) => (
                        <div key={i} className="rounded bg-muted/25 p-2 text-sm">
                          &ldquo;{qu.text}&rdquo;
                          <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                            <span className="text-muted-foreground">{qu.context}</span>
                            {qu.topics.map((t) => <span key={t} className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-800">{t}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {s.recordingDates.length > 0 && (
                  <div className="mt-2 text-[11px] text-muted-foreground">Recorded: {s.recordingDates.join(', ')}</div>
                )}
                {s.notes && <div className="mt-1 text-[11px] text-muted-foreground">{s.notes}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 3 · Media ────────────────────────────────────────────────────────────────

function MediaTab({ data }: { data: CockpitData }) {
  const [show, setShow] = useState<'starred' | 'videos'>('starred');
  const items = show === 'starred' ? data.media.starred : data.media.videos;
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <button onClick={() => setShow('starred')} className={`rounded-full px-3 py-1 ${show === 'starred' ? 'bg-foreground text-background' : 'bg-muted'}`}>
          Starred photos ({data.media.starred.length})
        </button>
        <button onClick={() => setShow('videos')} className={`rounded-full px-3 py-1 ${show === 'videos' ? 'bg-foreground text-background' : 'bg-muted'}`}>
          All videos ({data.media.videos.length})
        </button>
        <span className="text-xs text-muted-foreground">
          {data.media.totalLocal} local items indexed. Star / rate / tag in the{' '}
          <a className="underline" href="/admin/media-library">media library</a> — stars show up here and are the
          swap pool for deck visuals (slide 2 photo breather first).
        </span>
      </div>
      {items.length === 0 && <p className="text-sm text-muted-foreground">Nothing here yet — star items in the media library.</p>}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((m, i) => (
          <a key={i} href={m.full} target="_blank" rel="noreferrer" className="group relative block overflow-hidden rounded border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.src} alt={m.title} className="aspect-square w-full object-cover transition group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 bg-black/55 p-1 text-[10px] text-white">
              {m.type === 'video' && '▶ '} {m.title} {m.starred && '★'}{m.canonSlot ? ` · slot: ${m.canonSlot}` : ''}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── 4 · The ask ──────────────────────────────────────────────────────────────

function AskTab({ data }: { data: CockpitData }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-semibold">{data.ask.headline}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{data.ask.match}</p>
        <p className="mt-1 text-sm text-muted-foreground">{data.ask.matchGate}</p>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          {data.ask.buckets.map((b) => (
            <div key={b.name} className="rounded border p-3">
              <div className="font-semibold">{b.name} <span className="text-sm font-normal text-muted-foreground">{b.amount}</span></div>
              <p className="mt-1 text-xs">{b.what}</p>
              <span className="mt-1 inline-block rounded bg-amber-50 px-1.5 py-0.5 text-[11px] text-amber-800">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-semibold">The modelled economics behind the ask</h3>
        <table className="mt-2 w-full text-sm">
          <tbody>
            {data.ask.modelledEconomics.map((r) => (
              <tr key={r.item} className="border-t">
                <td className="py-1.5 pr-2">{r.item}</td>
                <td className="py-1.5 pr-2 font-medium">{r.figure}</td>
                <td className="py-1.5 text-xs text-muted-foreground">{r.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">Everyone who has supported so far — {money(data.supporters.totalReceived)} received</h3>
          <table className="mt-2 w-full text-sm">
            <tbody>
              {data.supporters.received.map((r) => (
                <tr key={r.source} className="border-t">
                  <td className="py-1.5 pr-2">{r.source}</td>
                  <td className="py-1.5 pr-2 font-medium">{money(r.amount)}</td>
                  <td className="py-1.5 text-xs text-muted-foreground">{r.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className="mt-4 text-sm font-semibold">Receivables — {money(data.supporters.totalReceivables)}</h4>
          <table className="mt-2 w-full text-sm">
            <tbody>
              {data.supporters.receivables.map((r) => (
                <tr key={r.source} className="border-t">
                  <td className="py-1.5 pr-2">{r.source}</td>
                  <td className="py-1.5 pr-2 font-medium">{money(r.amount)}</td>
                  <td className="py-1.5 text-xs text-muted-foreground">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Advisory board ({data.advisory.length})</h3>
            <ul className="mt-2 grid gap-1 text-sm md:grid-cols-2">
              {data.advisory.map((m) => (
                <li key={m.name}><span className="font-medium">{m.name}</span> <span className="text-xs text-muted-foreground">· {m.organisation} · {m.role}</span></li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold">{data.direction.headline}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {data.direction.points.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-semibold">Everyone we could ask (outreach-targets.ts)</h3>
        {data.prospects.map((g) => (
          <div key={g.group} className="mt-3">
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{g.group}</h4>
            <table className="mt-1 w-full text-sm">
              <tbody>
                {g.targets.map((t) => (
                  <tr key={t.name} className="border-t">
                    <td className="py-1.5 pr-2 font-medium">{t.name}</td>
                    <td className="py-1.5 pr-2 text-xs">{t.status} · {t.priority}{t.instrument ? ` · ${t.instrument}` : ''}</td>
                    <td className="py-1.5 pr-2 text-xs">{t.amountSignal ?? ''}</td>
                    <td className="py-1.5 text-xs text-muted-foreground">{t.nextAction}{t.contactName ? ` (${t.contactName})` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 5 · Drawings ─────────────────────────────────────────────────────────────

function DrawingsTab({ data }: { data: CockpitData }) {
  return (
    <div className="space-y-4">
      <div className={`rounded-lg border p-4 ${data.gemini.keyPresent ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'}`}>
        <h3 className="text-sm font-semibold">
          Gemini image generation · {data.gemini.model} · {data.gemini.keyPresent ? 'API key configured' : 'API key NOT in v2/.env.local'}
        </h3>
        <p className="mt-1 text-xs">
          {data.gemini.keyPresent
            ? 'Ready. One run regenerates or extends the set:'
            : 'The key lives in ~/.claude.json (mcpServers.gemini-image.env.GEMINI_API_KEY). Add it to v2/.env.local as GEMINI_API_KEY=... to enable, then:'}
        </p>
        <pre className="mt-2 overflow-x-auto rounded bg-black/80 p-2 text-xs text-green-200">python3 scripts/gen_goods_illustration.py --all --outdir v2/public/images/brand/generated{'\n'}python3 scripts/gen_goods_illustration.py --name flywheel --transparent   # one scene, no background</pre>
        <p className="mt-2 text-xs text-muted-foreground">
          Rules (locked, do not regress): always attach goods-styleref-speckle.png · dense clay-brown terrazzo speckle for
          recycled plastic · no text baked into images (labels go on via the overlay) · X-trestle drawn true. Full story:
          wiki/outputs/2026-07-18-goods-drawing-system.md.
        </p>
      </div>
      {['generated 2026-07-18 (locked speckle hand)', 'reference set (style anchors)'].map((set) => (
        <div key={set}>
          <h3 className="mb-2 text-sm font-semibold">{set}</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {data.drawings.filter((d) => d.set === set).map((d) => (
              <a key={d.file} href={d.file} target="_blank" rel="noreferrer" className="block overflow-hidden rounded border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.file} alt={d.file} className="aspect-video w-full bg-[#FBF8F1] object-contain" loading="lazy" />
                <div className="truncate p-1 text-[10px] text-muted-foreground">{d.file.split('/').pop()}</div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 6 · Numbers & align ──────────────────────────────────────────────────────

function NumbersTab({ data }: { data: CockpitData }) {
  const [copied, setCopied] = useState<string | null>(null);

  const notionMd = useMemo(() => {
    const lines = [
      `# Goods canon numbers — aligned ${new Date().toISOString().slice(0, 10)}`,
      '',
      'Single source of truth: `v2/src/lib/data/canon.ts` (asset figures auto-guarded against the live register by `npm run check:drift`). Paste this table over any stale Notion figures.',
      '',
      '| Fact | Value | Label | As at | Definition |',
      '| --- | --- | --- | --- | --- |',
      ...data.canon.map((f) => `| ${f.label} | ${typeof f.value === 'number' ? f.value.toLocaleString() : f.value}${f.unit ? ` ${f.unit}` : ''} | ${f.claimLabel} | ${f.asAt} | ${f.definition.replace(/\|/g, '/')} |`),
    ];
    return lines.join('\n');
  }, [data.canon]);

  const copy = async (what: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(what);
    setTimeout(() => setCopied(null), 1500);
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(data.canon, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `goods-canon-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={download} className="rounded bg-foreground px-3 py-1.5 text-sm text-background">Download canon backup (JSON)</button>
        <button onClick={() => copy('notion', notionMd)} className="rounded bg-muted px-3 py-1.5 text-sm">
          {copied === 'notion' ? 'Copied ✓' : 'Copy Notion alignment block (markdown)'}
        </button>
        <span className="self-center text-xs text-muted-foreground">
          Repo backup: <code>design/canon-numbers.json</code> (regenerate: <code>node scripts/canon-numbers.mjs</code>) ·
          drift gates: <code>npm run check:drift</code>
        </span>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-left text-xs uppercase tracking-wide">
              <th className="p-2">Fact</th><th className="p-2">Value</th><th className="p-2">Label</th><th className="p-2">Domain</th><th className="p-2">As at</th><th className="p-2">Definition</th>
            </tr>
          </thead>
          <tbody>
            {data.canon.map((f) => (
              <tr key={f.id} className="border-t align-top">
                <td className="p-2 font-medium">{f.label}<div className="text-[10px] font-normal text-muted-foreground">{f.id}</div></td>
                <td className="p-2 whitespace-nowrap font-semibold">{typeof f.value === 'number' ? f.value.toLocaleString() : f.value}{f.unit ? ` ${f.unit}` : ''}</td>
                <td className="p-2"><span className={`rounded px-1.5 py-0.5 text-[11px] ${f.claimLabel === 'verified' ? 'bg-green-100 text-green-800' : f.claimLabel === 'modelled' ? 'bg-amber-100 text-amber-800' : 'bg-muted text-foreground'}`}>{f.claimLabel}</span></td>
                <td className="p-2 text-xs">{f.domain}</td>
                <td className="p-2 text-xs whitespace-nowrap">{f.asAt}</td>
                <td className="p-2 text-xs text-muted-foreground">{f.definition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

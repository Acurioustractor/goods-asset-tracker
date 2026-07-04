'use client';

import { useEffect, useMemo, useState } from 'react';

export interface CommunityBundle {
  id: string;
  name: string;
  traditional_name: string | null;
  state: string | null;
  status: string | null;
  region: string | null;
  partner: string | null;
  storytellers: { display_name: string; is_elder: boolean; portrait_url: string | null }[];
  quotes: { id: string; text: string; context: string | null; storyteller: string | null }[];
  media: { id: string; url: string; poster_url: string | null; media_type: string }[];
}

function proxied(url: string): string {
  if (/empathyledger\.com|yvnuayzslukamizrlhwb\.supabase\.co/.test(url)) {
    return `/api/media-proxy?src=${encodeURIComponent(url)}`;
  }
  return url;
}
function initials(name: string): string {
  return name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

const STATUS_CLS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-800',
  testing: 'bg-amber-100 text-amber-800',
  exploring: 'bg-sky-100 text-sky-800',
  prospect: 'bg-gray-100 text-gray-600',
  administrative: 'bg-gray-100 text-gray-500',
};

function Thumb({ url, poster, kind }: { url: string; poster: string | null; kind: string }) {
  const [broken, setBroken] = useState(false);
  const src = kind === 'video' ? poster : url;
  if (!src || broken) {
    return <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">{kind === 'video' ? '▶ video' : 'no preview'}</div>;
  }
  return (
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={proxied(src)} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken(true)} className="aspect-square w-full rounded-lg object-cover bg-gray-100" />
      {kind === 'video' && <span className="absolute inset-0 flex items-center justify-center text-white text-lg drop-shadow">▶</span>}
    </div>
  );
}

function Face({ name, url }: { name: string; url: string | null }) {
  const [broken, setBroken] = useState(false);
  if (url && !broken) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={proxied(url)} alt={name} title={name} referrerPolicy="no-referrer" onError={() => setBroken(true)} className="h-8 w-8 rounded-full object-cover bg-gray-100 ring-2 ring-white" />;
  }
  return <span title={name} className="h-8 w-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-semibold ring-2 ring-white">{initials(name)}</span>;
}

export default function CommunityStoriesClient({ communities }: { communities: CommunityBundle[] }) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [q, setQ] = useState('');
  const [withStoriesOnly, setWithStoriesOnly] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  const count = (c: CommunityBundle) => c.storytellers.length + c.quotes.length + c.media.length;

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return communities.filter((c) => {
      if (withStoriesOnly && count(c) === 0) return false;
      if (!needle) return true;
      return (
        c.name.toLowerCase().includes(needle) ||
        (c.traditional_name ?? '').toLowerCase().includes(needle) ||
        (c.state ?? '').toLowerCase().includes(needle)
      );
    });
  }, [communities, q, withStoriesOnly]);

  const open = communities.find((c) => c.id === openId) ?? null;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenId(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const StatusBadge = ({ s }: { s: string | null }) =>
    s ? <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_CLS[s] ?? 'bg-gray-100 text-gray-600'}`}>{s}</span> : null;

  const stats = (c: CommunityBundle) => (
    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
      <span>{c.storytellers.length} storyteller{c.storytellers.length === 1 ? '' : 's'}</span>
      <span>{c.quotes.length} quote{c.quotes.length === 1 ? '' : 's'}</span>
      <span>{c.media.length} media</span>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
          <button onClick={() => setView('grid')} className={`px-3 py-1.5 text-sm ${view === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Grid</button>
          <button onClick={() => setView('list')} className={`px-3 py-1.5 text-sm border-l border-gray-300 ${view === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>List</button>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={withStoriesOnly} onChange={(e) => setWithStoriesOnly(e.target.checked)} />
          With content only
        </label>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search community, Country, state…"
          className="flex-1 min-w-[14rem] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <span className="text-sm text-gray-500 whitespace-nowrap">{filtered.length} shown</span>
      </div>

      {filtered.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No communities match. Untick &ldquo;with content only&rdquo; to see every place, including coverage gaps.
        </p>
      )}

      {view === 'grid' && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <button key={c.id} onClick={() => setOpenId(c.id)} className="group text-left rounded-2xl border border-gray-200 bg-white p-4 hover:border-orange-400 hover:shadow-sm transition">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900">{c.name}</div>
                  {c.traditional_name && <div className="text-xs text-gray-500 italic">{c.traditional_name}</div>}
                </div>
                <StatusBadge s={c.status} />
              </div>
              <div className="mt-1 text-xs text-gray-400">{[c.state, c.region].filter(Boolean).join(' · ')}</div>
              <div className="mt-3">{stats(c)}</div>
              {c.media.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  {c.media.slice(0, 4).map((m) => <Thumb key={m.id} url={m.url} poster={m.poster_url} kind={m.media_type} />)}
                </div>
              )}
              {c.storytellers.length > 0 && (
                <div className="mt-3 flex -space-x-2">
                  {c.storytellers.slice(0, 6).map((s, i) => <Face key={i} name={s.display_name} url={s.portrait_url} />)}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {view === 'list' && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-2 text-left">Community</th>
                <th className="px-4 py-2 text-left">State</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Storytellers</th>
                <th className="px-4 py-2 text-right">Quotes</th>
                <th className="px-4 py-2 text-right">Media</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} onClick={() => setOpenId(c.id)} className="cursor-pointer hover:bg-orange-50/50">
                  <td className="px-4 py-2.5"><span className="font-medium text-gray-900">{c.name}</span>{c.traditional_name && <span className="text-gray-400 italic"> · {c.traditional_name}</span>}</td>
                  <td className="px-4 py-2.5 text-gray-600">{c.state ?? '—'}</td>
                  <td className="px-4 py-2.5"><StatusBadge s={c.status} /></td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-gray-700">{c.storytellers.length}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-gray-700">{c.quotes.length}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-gray-700">{c.media.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8" onClick={() => setOpenId(null)}>
          <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenId(null)} className="absolute right-3 top-3 rounded-full bg-gray-100 hover:bg-gray-200 w-8 h-8 text-gray-600" aria-label="Close">✕</button>
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-gray-900">{open.name}</h2>
                  {open.traditional_name && <div className="text-sm text-gray-500 italic">{open.traditional_name}</div>}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <StatusBadge s={open.status} />
                    {[open.state, open.region].filter(Boolean).join(' · ') && <span>{[open.state, open.region].filter(Boolean).join(' · ')}</span>}
                    {open.partner && <span>partner: {open.partner}</span>}
                    <a href={`/admin/communities/${open.id}`} className="text-orange-700 hover:underline">Ops & beds ↗</a>
                  </div>
                </div>
              </div>

              {count(open) === 0 && (
                <p className="mt-5 rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                  No stories, quotes or media tagged to this community yet. A coverage gap.
                </p>
              )}

              {open.storytellers.length > 0 && (
                <div className="mt-5">
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 mb-2">Storytellers</div>
                  <div className="flex flex-wrap gap-3">
                    {open.storytellers.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Face name={s.display_name} url={s.portrait_url} />
                        <span className="text-sm text-gray-700">{s.display_name}{s.is_elder && <span className="ml-1 text-purple-700 text-xs">Elder</span>}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {open.quotes.length > 0 && (
                <div className="mt-5">
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 mb-2">Quotes</div>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {open.quotes.map((quote) => (
                      <blockquote key={quote.id} className="text-sm text-gray-700">
                        <span className="italic">“{quote.text}”</span>
                        <cite className="mt-0.5 block text-[11px] not-italic text-gray-400">{quote.storyteller ?? 'Unattributed'}{quote.context ? ` · ${quote.context}` : ''}</cite>
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}

              {open.media.length > 0 && (
                <div className="mt-5">
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 mb-2">Media ({open.media.length})</div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-72 overflow-y-auto">
                    {open.media.map((m) => <Thumb key={m.id} url={m.url} poster={m.poster_url} kind={m.media_type} />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

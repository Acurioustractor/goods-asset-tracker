'use client';

import { useEffect, useMemo, useState } from 'react';
import type { GoodsStorytellerProfile } from '@/lib/empathy-ledger/client';
import { StorytellerAvatar } from '@/components/storyteller-avatar';

function StatusPill({ status, isPublic }: { status: string; isPublic: boolean }) {
  const cleared = status === 'published' && isPublic;
  const cls = cleared
    ? 'bg-emerald-100 text-emerald-700'
    : status === 'published'
    ? 'bg-amber-100 text-amber-800'
    : 'bg-muted text-muted-foreground';
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>{cleared ? 'published · public' : status}</span>;
}

export default function StorytellersClient({
  profiles,
  elAppBase,
}: {
  profiles: GoodsStorytellerProfile[];
  elAppBase: string;
}) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return profiles;
    return profiles.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        (p.location ?? '').toLowerCase().includes(needle) ||
        p.themes.some((t) => t.toLowerCase().includes(needle)),
    );
  }, [profiles, q]);

  const open = profiles.find((p) => p.id === openId) ?? null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenId(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const editUrl = (id: string) => `${elAppBase.replace(/\/$/, '')}/admin/storytellers/${id}/edit`;

  return (
    <div>
      {/* controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-1.5 text-sm ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 text-sm border-l border-border ${view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}
          >
            List
          </button>
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, location, theme…"
          className="flex-1 min-w-[14rem] rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap">{filtered.length} storyteller{filtered.length === 1 ? '' : 's'}</span>
      </div>

      {filtered.length === 0 && (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No Goods storytellers match. (Storytellers here are EL people with at least one Goods-project story.)
        </p>
      )}

      {/* GRID */}
      {view === 'grid' && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setOpenId(p.id)}
              className="group text-left rounded-2xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition"
            >
              <div className="flex flex-col items-center text-center">
                <StorytellerAvatar src={p.portraitUrl} name={p.name} size={88} />
                <div className="mt-3 font-semibold text-foreground leading-tight">{p.name}</div>
                {p.isElder && <span className="mt-1 rounded-full bg-purple-100 text-purple-800 px-2 py-0.5 text-[10px] font-medium">Elder</span>}
                {p.location && <div className="mt-1 text-xs text-muted-foreground">{p.location}</div>}
                <div className="mt-2 text-xs text-muted-foreground">
                  {p.storyCount} stor{p.storyCount === 1 ? 'y' : 'ies'}
                  {p.publishedCount > 0 && <span className="text-emerald-700"> · {p.publishedCount} public</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* LIST */}
      {view === 'list' && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">Storyteller</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Stories</th>
                <th className="px-4 py-2 text-left">Themes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setOpenId(p.id)}
                  className="cursor-pointer hover:bg-orange-50/50"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <StorytellerAvatar src={p.portraitUrl} name={p.name} size={36} />
                      <span className="font-medium text-foreground">{p.name}</span>
                      {p.isElder && <span className="rounded-full bg-purple-100 text-purple-800 px-1.5 py-0.5 text-[9px] font-medium">Elder</span>}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{p.location ?? '—'}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {p.storyCount}{p.publishedCount > 0 && <span className="text-emerald-700"> ({p.publishedCount} public)</span>}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{p.themes.slice(0, 3).join(', ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8"
          onClick={() => setOpenId(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-card shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenId(null)}
              className="absolute right-3 top-3 rounded-full bg-muted hover:bg-muted/70 w-8 h-8 text-muted-foreground"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="p-6">
              <div className="flex items-start gap-4">
                <StorytellerAvatar src={open.portraitUrl} name={open.name} size={72} />
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2 flex-wrap">
                    {open.name}
                    {open.isElder && <span className="rounded-full bg-purple-100 text-purple-800 px-2 py-0.5 text-[10px] font-medium">Elder</span>}
                  </h2>
                  {open.location && <div className="text-sm text-muted-foreground mt-0.5">{open.location}</div>}
                  <div className="text-xs text-muted-foreground mt-1">
                    {open.storyCount} Goods stor{open.storyCount === 1 ? 'y' : 'ies'}
                    {open.publishedCount > 0 && <span className="text-emerald-700"> · {open.publishedCount} published public</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <a href={editUrl(open.id)} target="_blank" rel="noreferrer" className="text-orange-700 hover:underline">Edit in EL ↗</a>
                    <a href={`/storytellers/${open.slug}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">/storytellers/{open.slug} ↗</a>
                  </div>
                </div>
              </div>

              {open.bio && <p className="mt-4 text-sm text-foreground leading-relaxed">{open.bio}</p>}

              {open.themes.length > 0 && (
                <div className="mt-4">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">Themes</div>
                  <div className="flex flex-wrap gap-1.5">
                    {open.themes.map((t) => (
                      <span key={t} className="rounded-full bg-muted text-foreground px-2 py-0.5 text-xs">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Goods stories</div>
                <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
                  {open.stories.map((st) => (
                    <div key={st.id} className="rounded-xl border border-border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-medium text-sm text-foreground">{st.title}</div>
                        <StatusPill status={st.status} isPublic={st.isPublic} />
                      </div>
                      {st.excerpt && <p className="mt-1.5 text-sm text-muted-foreground italic leading-relaxed">“{st.excerpt}”</p>}
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        {st.location && <span>📍 {st.location}</span>}
                        {st.hasTranscript && <span className="text-muted-foreground">📝 transcript</span>}
                        {st.themes.slice(0, 4).map((t) => (
                          <span key={t} className="rounded bg-muted px-1.5 py-0.5">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

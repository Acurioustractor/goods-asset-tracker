'use client';

import { useEffect, useMemo, useState } from 'react';

export interface QuoteRow {
  id: string;
  text: string;
  context: string | null;
  source: string | null;
  consent_tier: string | null;
  storyteller: { display_name: string; slug: string | null; is_elder: boolean; portrait: { url: string } | null } | null;
  community: { name: string } | null;
}

function initials(name: string): string {
  return name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

// EL media URLs won't render in a browser <img>; route them through the proxy.
function proxied(url: string): string {
  if (/empathyledger\.com|yvnuayzslukamizrlhwb\.supabase\.co/.test(url)) {
    return `/api/media-proxy?src=${encodeURIComponent(url)}`;
  }
  return url;
}

function Avatar({ url, name, size }: { url: string | null; name: string; size: number }) {
  const [broken, setBroken] = useState(false);
  if (url && !broken) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={proxied(url)}
        alt={name}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className="rounded-full object-cover bg-muted"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials(name)}
    </div>
  );
}

function TierBadge({ tier }: { tier: string | null }) {
  const cls =
    tier === 'public' ? 'bg-emerald-100 text-emerald-700' : tier === 'gated' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700';
  const label = tier === 'public' ? 'public' : tier === 'gated' ? 'cleared · gated' : 'RED';
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>{label}</span>;
}

export default function QuotesClient({ quotes }: { quotes: QuoteRow[] }) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [community, setCommunity] = useState<string>('all');
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const communities = useMemo(() => {
    const c = new Map<string, number>();
    for (const x of quotes) {
      const name = x.community?.name;
      if (name) c.set(name, (c.get(name) ?? 0) + 1);
    }
    return [...c.entries()].sort((a, b) => b[1] - a[1]);
  }, [quotes]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return quotes.filter((x) => {
      if (community !== 'all' && x.community?.name !== community) return false;
      if (!needle) return true;
      return (
        x.text.toLowerCase().includes(needle) ||
        (x.context ?? '').toLowerCase().includes(needle) ||
        (x.storyteller?.display_name ?? '').toLowerCase().includes(needle) ||
        (x.community?.name ?? '').toLowerCase().includes(needle)
      );
    });
  }, [quotes, community, q]);

  const open = quotes.find((x) => x.id === openId) ?? null;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenId(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1 text-xs font-medium transition ${active ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border hover:bg-muted'}`;

  const attribution = (x: QuoteRow) => (
    <div className="flex items-center gap-2">
      <Avatar url={x.storyteller?.portrait?.url ?? null} name={x.storyteller?.display_name ?? '?'} size={28} />
      <span className="text-sm text-foreground">
        {x.storyteller?.display_name ?? 'Unattributed'}
        {x.storyteller?.is_elder && <span className="ml-1 text-purple-700 text-xs">Elder</span>}
        {x.community?.name && <span className="text-muted-foreground"> · {x.community.name}</span>}
      </span>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <button className={chip(community === 'all')} onClick={() => setCommunity('all')}>
          All <span className="opacity-60">{quotes.length}</span>
        </button>
        {communities.map(([name, n]) => (
          <button key={name} className={chip(community === name)} onClick={() => setCommunity(name)}>
            {name} <span className="opacity-60">{n}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          <button onClick={() => setView('grid')} className={`px-3 py-1.5 text-sm ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}>Grid</button>
          <button onClick={() => setView('list')} className={`px-3 py-1.5 text-sm border-l border-border ${view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}>List</button>
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search quote, person, community…"
          className="flex-1 min-w-[14rem] rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap">{filtered.length} quote{filtered.length === 1 ? '' : 's'}</span>
      </div>

      {filtered.length === 0 && (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No quotes match.</p>
      )}

      {view === 'grid' && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((x) => (
            <button
              key={x.id}
              onClick={() => setOpenId(x.id)}
              className="group flex flex-col text-left rounded-2xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-sm transition"
            >
              <blockquote className="flex-1 text-[15px] leading-relaxed text-foreground">
                <span className="text-muted-foreground/50 text-xl leading-none">“</span>
                {x.text.length > 220 ? x.text.slice(0, 220).trimEnd() + '…' : x.text}
              </blockquote>
              <div className="mt-4 flex items-center justify-between gap-2">
                {attribution(x)}
                <TierBadge tier={x.consent_tier} />
              </div>
            </button>
          ))}
        </div>
      )}

      {view === 'list' && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">Quote</th>
                <th className="px-4 py-2 text-left">Person</th>
                <th className="px-4 py-2 text-left">Community</th>
                <th className="px-4 py-2 text-left">Consent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((x) => (
                <tr key={x.id} onClick={() => setOpenId(x.id)} className="cursor-pointer hover:bg-orange-50/50">
                  <td className="px-4 py-2.5 text-foreground max-w-md"><span className="line-clamp-2">{x.text}</span></td>
                  <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">{x.storyteller?.display_name ?? '—'}</td>
                  <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">{x.community?.name ?? '—'}</td>
                  <td className="px-4 py-2.5"><TierBadge tier={x.consent_tier} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8" onClick={() => setOpenId(null)}>
          <div className="relative w-full max-w-xl rounded-2xl bg-card shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenId(null)} className="absolute right-3 top-3 rounded-full bg-muted hover:bg-muted/70 w-8 h-8 text-muted-foreground" aria-label="Close">✕</button>
            <div className="p-6">
              <blockquote className="text-xl leading-relaxed text-foreground">
                <span className="text-muted-foreground/50 text-2xl leading-none">“</span>{open.text}<span className="text-muted-foreground/50 text-2xl leading-none">”</span>
              </blockquote>
              {open.context && <div className="mt-3 text-sm text-muted-foreground">{open.context}</div>}
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <Avatar url={open.storyteller?.portrait?.url ?? null} name={open.storyteller?.display_name ?? '?'} size={44} />
                <div className="min-w-0">
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    {open.storyteller?.display_name ?? 'Unattributed'}
                    {open.storyteller?.is_elder && <span className="rounded-full bg-purple-100 text-purple-800 px-2 py-0.5 text-[10px] font-medium">Elder</span>}
                  </div>
                  {open.community?.name && <div className="text-sm text-muted-foreground">{open.community.name}</div>}
                </div>
                <div className="ml-auto"><TierBadge tier={open.consent_tier} /></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                {open.source && <span>source: {open.source}</span>}
                {open.storyteller?.slug && (
                  <a href={`/storytellers/${open.storyteller.slug}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">/storytellers/{open.storyteller.slug} ↗</a>
                )}
                <a href="/admin/el-storytellers" className="text-muted-foreground hover:text-orange-700 hover:underline">Storytellers ↗</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

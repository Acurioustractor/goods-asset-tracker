'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PERSON_TYPES, personTypeLabel, type Person, type PersonType } from '@/lib/people';

function initials(name: string): string {
  return name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

// EL media URLs won't render in a browser <img>, so route them through our
// same-origin proxy. Local /paths and other hosts pass through untouched.
function proxied(url: string): string {
  if (/empathyledger\.com|yvnuayzslukamizrlhwb\.supabase\.co/.test(url)) {
    return `/api/media-proxy?src=${encodeURIComponent(url)}`;
  }
  return url;
}

const TYPE_CLS: Record<PersonType, string> = {
  funder: 'bg-emerald-100 text-emerald-800',
  capital: 'bg-primary/15 text-primary',
  government: 'bg-muted text-muted-foreground',
  buyer: 'bg-accent/20 text-accent-foreground',
  partner: 'bg-primary/10 text-primary',
  health: 'bg-accent/15 text-accent-foreground',
  corporate: 'bg-muted text-muted-foreground',
  advisor: 'bg-primary/10 text-primary',
  board: 'bg-accent/20 text-accent-foreground',
  staff: 'bg-muted text-muted-foreground',
};

function aud(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

function Avatar({ p, size }: { p: Person; size: number }) {
  const [broken, setBroken] = useState(false);
  const shape = p.isOrg ? 'rounded-lg' : 'rounded-full';
  if (p.photo && !broken) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={proxied(p.photo)}
        alt={p.name}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className={`${shape} object-cover bg-muted`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`${shape} ${p.isOrg ? 'bg-muted text-muted-foreground' : 'bg-primary/15 text-primary'} flex items-center justify-center font-semibold`}
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {initials(p.name)}
    </div>
  );
}

function TypeBadge({ t }: { t: PersonType }) {
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TYPE_CLS[t]}`}>{personTypeLabel(t)}</span>;
}

const WARMTH: Record<string, { dot: string; label: string }> = {
  hot: { dot: 'bg-emerald-500', label: 'Hot' },
  warm: { dot: 'bg-primary', label: 'Warm' },
  steady: { dot: 'bg-accent', label: 'Steady' },
  cool: { dot: 'bg-muted-foreground/40', label: 'Cool' },
  cold: { dot: 'bg-rose-400', label: 'Cold' },
};

function StagePill({ ghl }: { ghl: NonNullable<Person['ghl']> }) {
  const w = WARMTH[ghl.warmth] ?? WARMTH.cool;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground"
      title={`Live GHL: ${ghl.stage} · ${w.label}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${w.dot}`} />
      {ghl.stage}
    </span>
  );
}

// Curated-override editor: photo, bio, featured. Writes to people_overrides.
function EditPanel({ person, onSaved }: { person: Person; onSaved: () => void }) {
  const [photo, setPhoto] = useState(person.photo ?? '');
  const [bio, setBio] = useState(person.notes ?? '');
  const [featured, setFeatured] = useState(!!person.featured);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch('/api/admin/person-override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person_id: person.id, photo_url: photo.trim() || null, bio: bio.trim() || null, featured }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || 'save failed');
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-border bg-muted p-4 space-y-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Curated overrides</div>
      <label className="block">
        <span className="text-xs text-muted-foreground">Photo URL</span>
        <input
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          placeholder="https://… or /images/people/name.jpg"
          className="mt-1 w-full rounded-lg border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </label>
      <label className="block">
        <span className="text-xs text-muted-foreground">Bio / description</span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Featured (pin to top of its type)
      </label>
      {err && <p className="text-xs text-rose-600">{err}</p>}
      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default function PeopleClient({ people, counts }: { people: Person[]; counts: Record<string, number> }) {
  const router = useRouter();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [type, setType] = useState<PersonType | 'all'>('all');
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return people.filter((p) => {
      if (type !== 'all' && p.type !== type) return false;
      if (!needle) return true;
      return (
        p.name.toLowerCase().includes(needle) ||
        (p.org ?? '').toLowerCase().includes(needle) ||
        (p.role ?? '').toLowerCase().includes(needle) ||
        (p.location ?? '').toLowerCase().includes(needle)
      );
    });
  }, [people, type, q]);

  const open = people.find((p) => p.id === openId) ?? null;
  useEffect(() => { setEditing(false); }, [openId]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenId(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1 text-xs font-medium transition ${active ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border hover:bg-muted'}`;

  return (
    <div>
      {/* type filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button className={chip(type === 'all')} onClick={() => setType('all')}>
          All <span className="opacity-60">{people.length}</span>
        </button>
        {PERSON_TYPES.filter((t) => counts[t.key]).map((t) => (
          <button key={t.key} className={chip(type === t.key)} onClick={() => setType(t.key)} title={t.blurb}>
            {t.label} <span className="opacity-60">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      {/* controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          <button onClick={() => setView('grid')} className={`px-3 py-1.5 text-sm ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}>Grid</button>
          <button onClick={() => setView('list')} className={`px-3 py-1.5 text-sm border-l border-border ${view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}>List</button>
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, org, role, location…"
          className="flex-1 min-w-[14rem] rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap">{filtered.length} shown</span>
      </div>

      {filtered.length === 0 && (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No one matches that filter.</p>
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
                <Avatar p={p} size={72} />
                <div className="mt-3 font-semibold text-foreground leading-tight">
                  {p.featured && <span title="Featured" className="text-primary">★ </span>}{p.name}
                </div>
                {p.org && <div className="mt-0.5 text-xs text-muted-foreground leading-tight">{p.org}</div>}
                {p.role && <div className="mt-0.5 text-[11px] text-muted-foreground leading-tight">{p.role}</div>}
                <div className="mt-2"><TypeBadge t={p.type} /></div>
                {p.ghl && <div className="mt-1.5"><StagePill ghl={p.ghl} /></div>}
                {p.amount != null && (
                  <div className="mt-1.5 text-xs font-semibold text-emerald-700">
                    {aud(p.amount)}{p.status ? <span className="font-normal text-muted-foreground"> · {p.status}</span> : null}
                  </div>
                )}
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
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Org</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Stage (live)</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} onClick={() => setOpenId(p.id)} className="cursor-pointer hover:bg-primary/5">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <Avatar p={p} size={32} />
                      <span className="font-medium text-foreground">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{p.org ?? '—'}</td>
                  <td className="px-4 py-2.5"><TypeBadge t={p.type} /></td>
                  <td className="px-4 py-2.5">{p.ghl ? <StagePill ghl={p.ghl} /> : <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{p.role ?? '—'}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-emerald-700 font-medium">{p.amount != null ? aud(p.amount) : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8" onClick={() => setOpenId(null)}>
          <div className="relative w-full max-w-2xl rounded-2xl bg-card shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="absolute right-3 top-3 flex items-center gap-2">
              <button
                onClick={() => setEditing((v) => !v)}
                className={`rounded-full px-3 h-8 text-xs font-medium ${editing ? 'bg-primary/15 text-primary' : 'bg-muted hover:bg-muted/70 text-muted-foreground'}`}
              >
                {editing ? 'Editing' : 'Edit'}
              </button>
              <button onClick={() => setOpenId(null)} className="rounded-full bg-muted hover:bg-muted/70 w-8 h-8 text-muted-foreground" aria-label="Close">✕</button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <Avatar p={open} size={72} />
                <div className="min-w-0">
                  <h2 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
                    {open.featured && <span title="Featured" className="text-primary">★</span>}
                    {open.name}
                  </h2>
                  {open.org && <div className="text-sm text-muted-foreground mt-0.5">{open.org}</div>}
                  {open.role && <div className="text-sm text-muted-foreground">{open.role}</div>}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <TypeBadge t={open.type} />
                    {open.ghl && <StagePill ghl={open.ghl} />}
                    {open.location && <span className="text-xs text-muted-foreground">📍 {open.location}</span>}
                    {open.amount != null && (
                      <span className="text-xs font-semibold text-emerald-700">{aud(open.amount)}{open.status ? ` · ${open.status}` : ''}</span>
                    )}
                  </div>
                  {open.ghl && (
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Live pipeline: <span className="font-medium text-foreground">{open.ghl.stage}</span>
                      {open.ghl.value > 0 && <> · {aud(open.ghl.value)}</>} · {open.ghl.status}
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-3 text-xs">
                    {open.email && <a href={`mailto:${open.email}`} className="text-primary hover:underline">{open.email}</a>}
                    {open.website && <a href={open.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">website ↗</a>}
                  </div>
                </div>
              </div>

              {editing && <EditPanel person={open} onSaved={() => { setEditing(false); router.refresh(); }} />}

              {!editing && open.notes && <p className="mt-4 text-sm text-foreground leading-relaxed">{open.notes}</p>}

              {open.contacts.length > 0 && (
                <div className="mt-4">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">Contacts</div>
                  <div className="space-y-1">
                    {open.contacts.map((c, i) => (
                      <div key={i} className="text-sm text-foreground">
                        <span className="font-medium">{c.name}</span>
                        {c.role && <span className="text-muted-foreground"> · {c.role}</span>}
                        {c.email && <a href={`mailto:${c.email}`} className="ml-2 text-primary hover:underline">{c.email}</a>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {open.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {open.tags.map((t, i) => (
                    <span key={i} className="rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-xs">{t}</span>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-4 text-xs">
                <a href="/admin/deals" className="text-muted-foreground hover:text-primary hover:underline">Deals board ↗</a>
                <a href="/admin/funders" className="text-muted-foreground hover:text-primary hover:underline">Funder reports ↗</a>
                <a href="/admin/loi-tracker" className="text-muted-foreground hover:text-primary hover:underline">LOI tracker ↗</a>
                <span className="ml-auto text-muted-foreground">from {open.sources.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

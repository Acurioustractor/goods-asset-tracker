'use client';

import { useEffect, useMemo, useState } from 'react';
import { PERSON_TYPES, personTypeLabel, type Person, type PersonType } from '@/lib/people';

function initials(name: string): string {
  return name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

const TYPE_CLS: Record<PersonType, string> = {
  funder: 'bg-emerald-100 text-emerald-800',
  capital: 'bg-teal-100 text-teal-800',
  government: 'bg-sky-100 text-sky-800',
  partner: 'bg-orange-100 text-orange-800',
  health: 'bg-rose-100 text-rose-800',
  corporate: 'bg-indigo-100 text-indigo-800',
  advisor: 'bg-amber-100 text-amber-800',
  board: 'bg-purple-100 text-purple-800',
  staff: 'bg-gray-200 text-gray-700',
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
        src={p.photo}
        alt={p.name}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className={`${shape} object-cover bg-gray-100`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`${shape} ${p.isOrg ? 'bg-gray-100 text-gray-500' : 'bg-orange-100 text-orange-700'} flex items-center justify-center font-semibold`}
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
  warm: { dot: 'bg-amber-500', label: 'Warm' },
  steady: { dot: 'bg-sky-500', label: 'Steady' },
  cool: { dot: 'bg-gray-400', label: 'Cool' },
  cold: { dot: 'bg-rose-400', label: 'Cold' },
};

function StagePill({ ghl }: { ghl: NonNullable<Person['ghl']> }) {
  const w = WARMTH[ghl.warmth] ?? WARMTH.cool;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700"
      title={`Live GHL: ${ghl.stage} · ${w.label}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${w.dot}`} />
      {ghl.stage}
    </span>
  );
}

export default function PeopleClient({ people, counts }: { people: Person[]; counts: Record<string, number> }) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [type, setType] = useState<PersonType | 'all'>('all');
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

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
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenId(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1 text-xs font-medium transition ${active ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`;

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
        <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
          <button onClick={() => setView('grid')} className={`px-3 py-1.5 text-sm ${view === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Grid</button>
          <button onClick={() => setView('list')} className={`px-3 py-1.5 text-sm border-l border-gray-300 ${view === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>List</button>
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, org, role, location…"
          className="flex-1 min-w-[14rem] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <span className="text-sm text-gray-500 whitespace-nowrap">{filtered.length} shown</span>
      </div>

      {filtered.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">No one matches that filter.</p>
      )}

      {/* GRID */}
      {view === 'grid' && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setOpenId(p.id)}
              className="group text-left rounded-2xl border border-gray-200 bg-white p-4 hover:border-orange-400 hover:shadow-sm transition"
            >
              <div className="flex flex-col items-center text-center">
                <Avatar p={p} size={72} />
                <div className="mt-3 font-semibold text-gray-900 leading-tight">{p.name}</div>
                {p.org && <div className="mt-0.5 text-xs text-gray-500 leading-tight">{p.org}</div>}
                {p.role && <div className="mt-0.5 text-[11px] text-gray-400 leading-tight">{p.role}</div>}
                <div className="mt-2"><TypeBadge t={p.type} /></div>
                {p.ghl && <div className="mt-1.5"><StagePill ghl={p.ghl} /></div>}
                {p.amount != null && (
                  <div className="mt-1.5 text-xs font-semibold text-emerald-700">
                    {aud(p.amount)}{p.status ? <span className="font-normal text-gray-400"> · {p.status}</span> : null}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* LIST */}
      {view === 'list' && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Org</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Stage (live)</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} onClick={() => setOpenId(p.id)} className="cursor-pointer hover:bg-orange-50/50">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <Avatar p={p} size={32} />
                      <span className="font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{p.org ?? '—'}</td>
                  <td className="px-4 py-2.5"><TypeBadge t={p.type} /></td>
                  <td className="px-4 py-2.5">{p.ghl ? <StagePill ghl={p.ghl} /> : <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{p.role ?? '—'}</td>
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
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenId(null)} className="absolute right-3 top-3 rounded-full bg-gray-100 hover:bg-gray-200 w-8 h-8 text-gray-600" aria-label="Close">✕</button>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <Avatar p={open} size={72} />
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-gray-900">{open.name}</h2>
                  {open.org && <div className="text-sm text-gray-600 mt-0.5">{open.org}</div>}
                  {open.role && <div className="text-sm text-gray-500">{open.role}</div>}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <TypeBadge t={open.type} />
                    {open.ghl && <StagePill ghl={open.ghl} />}
                    {open.location && <span className="text-xs text-gray-500">📍 {open.location}</span>}
                    {open.amount != null && (
                      <span className="text-xs font-semibold text-emerald-700">{aud(open.amount)}{open.status ? ` · ${open.status}` : ''}</span>
                    )}
                  </div>
                  {open.ghl && (
                    <div className="mt-1 text-[11px] text-gray-500">
                      Live pipeline: <span className="font-medium text-gray-700">{open.ghl.stage}</span>
                      {open.ghl.value > 0 && <> · {aud(open.ghl.value)}</>} · {open.ghl.status}
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-3 text-xs">
                    {open.email && <a href={`mailto:${open.email}`} className="text-orange-700 hover:underline">{open.email}</a>}
                    {open.website && <a href={open.website} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">website ↗</a>}
                  </div>
                </div>
              </div>

              {open.notes && <p className="mt-4 text-sm text-gray-700 leading-relaxed">{open.notes}</p>}

              {open.contacts.length > 0 && (
                <div className="mt-4">
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 mb-1.5">Contacts</div>
                  <div className="space-y-1">
                    {open.contacts.map((c, i) => (
                      <div key={i} className="text-sm text-gray-700">
                        <span className="font-medium">{c.name}</span>
                        {c.role && <span className="text-gray-500"> · {c.role}</span>}
                        {c.email && <a href={`mailto:${c.email}`} className="ml-2 text-orange-700 hover:underline">{c.email}</a>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {open.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {open.tags.map((t, i) => (
                    <span key={i} className="rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-xs">{t}</span>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-4 text-xs">
                <a href="/admin/deals" className="text-gray-600 hover:text-orange-700 hover:underline">Deals board ↗</a>
                <a href="/admin/funders" className="text-gray-600 hover:text-orange-700 hover:underline">Funder reports ↗</a>
                <a href="/admin/loi-tracker" className="text-gray-600 hover:text-orange-700 hover:underline">LOI tracker ↗</a>
                <span className="ml-auto text-gray-300">from {open.sources.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

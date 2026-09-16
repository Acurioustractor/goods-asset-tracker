'use client';

/**
 * A filterable list of organisations to ring.
 *
 * Ben, 17 September 2026: a filterable list of organisations that buy things. All the orgs that
 * support, and are in, communities, that we can start talking to about where they buy whitegoods
 * and beds.
 *
 * So the whole component is one search box, a row of type filters, and a list. No scoring, no
 * ranking model, no opportunity value. The only judgement it makes is sort order, and that is
 * just contract size.
 */

import { useMemo, useState } from 'react';

export interface Org {
  name: string;
  kind: string;
  state: string;
  place: string;
  known: boolean;
  note: string;
  sources: string[];
  govtContractValueAud: number;
  govtContractCount: number;
  /** True when the only source is the shared graph, which is proximity-matched. */
  proximityOnly?: boolean;
  /** community | contractor. Community organisations are what this list is for. */
  group?: 'community' | 'contractor';
}

const KIND_LABEL: Record<string, string> = {
  council: 'Council',
  health_service: 'Health service',
  housing_provider: 'Housing and services',
  store: 'Store',
  land_council: 'Land council',
  community_org: 'Community org',
  builder: 'Builder or maintainer',
  supplier: 'Supplier',
  royalty: 'Royalty or trust',
  education: 'School',
  government: 'Government',
  aged_care: 'Aged care',
};

const money = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${n.toLocaleString('en-AU')}`);

export function OrgList({ orgs }: { orgs: Org[] }) {
  const [q, setQ] = useState('');
  const [kinds, setKinds] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [onlyKnown, setOnlyKnown] = useState(false);
  const [onlyEvidence, setOnlyEvidence] = useState(false);

  const allKinds = useMemo(() => {
    const c = new Map<string, number>();
    for (const o of orgs) c.set(o.kind, (c.get(o.kind) ?? 0) + 1);
    return [...c.entries()].sort((a, b) => b[1] - a[1]);
  }, [orgs]);
  const allStates = useMemo(() => [...new Set(orgs.map((o) => o.state).filter(Boolean))].sort(), [orgs]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return orgs.filter((o) => {
      if (onlyKnown && !o.known) return false;
      if (onlyEvidence && o.govtContractValueAud <= 0) return false;
      if (kinds.length > 0 && !kinds.includes(o.kind)) return false;
      if (states.length > 0 && !states.includes(o.state)) return false;
      if (needle && !`${o.name} ${o.place} ${o.note}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [orgs, q, kinds, states, onlyKnown, onlyEvidence]);

  const toggle = (set: (fn: (p: string[]) => string[]) => void, v: string) =>
    set((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a name, a place, anything"
          aria-label="Search organisations"
          className="w-full rounded-lg border px-3 py-2 text-sm sm:w-80"
          style={{ borderColor: '#D8CFC4' }}
        />
        <label className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#6A5E54' }}>
          <input type="checkbox" checked={onlyKnown} onChange={(e) => setOnlyKnown(e.target.checked)} />
          We already know them
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#6A5E54' }}>
          <input type="checkbox" checked={onlyEvidence} onChange={(e) => setOnlyEvidence(e.target.checked)} />
          Holds government contracts
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {allKinds.map(([k, n]) => (
          <button
            key={k}
            type="button"
            onClick={() => toggle(setKinds, k)}
            aria-pressed={kinds.includes(k)}
            className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors motion-reduce:transition-none"
            style={kinds.includes(k)
              ? { backgroundColor: '#2E2E2E', borderColor: '#2E2E2E', color: '#FFF' }
              : { borderColor: '#D8CFC4', color: '#6A5E54' }}
          >
            {KIND_LABEL[k] ?? k} <span className="opacity-60">{n}</span>
          </button>
        ))}
        <span className="mx-1 h-4 w-px self-center" style={{ backgroundColor: '#D8CFC4' }} />
        {allStates.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => toggle(setStates, s)}
            aria-pressed={states.includes(s)}
            className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors motion-reduce:transition-none"
            style={states.includes(s)
              ? { backgroundColor: '#C45C3E', borderColor: '#C45C3E', color: '#FFF' }
              : { borderColor: '#D8CFC4', color: '#6A5E54' }}
          >
            {s}
          </button>
        ))}
        {(kinds.length > 0 || states.length > 0 || q || onlyKnown || onlyEvidence) && (
          <button
            type="button"
            onClick={() => { setKinds([]); setStates([]); setQ(''); setOnlyKnown(false); setOnlyEvidence(false); }}
            className="px-2 text-xs underline"
            style={{ color: '#6A5E54' }}
          >
            clear
          </button>
        )}
      </div>

      <p className="mt-3 text-xs" style={{ color: '#6A5E54' }}>
        {shown.length} of {orgs.length} organisations
      </p>

      <ul className="mt-4 space-y-2">
        {shown.map((o) => (
          <li key={o.name} className="rounded-lg border p-4" style={{ borderColor: o.known ? '#8B9D77' : '#E8DED4' }}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold leading-snug">
                  {o.name}
                  {o.known && (
                    <span className="ml-2 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide" style={{ backgroundColor: '#E6EDDD', color: '#4F6138' }}>
                      we know them
                    </span>
                  )}
                  {o.proximityOnly && (
                    <span
                      className="ml-2 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
                      style={{ backgroundColor: '#F5EBD8', color: '#8A6A2F' }}
                      title="Only source is the shared graph, which matches organisations to communities on postcode. Check before acting."
                    >
                      proximity only
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide" style={{ color: '#A99C8F' }}>
                  {KIND_LABEL[o.kind] ?? o.kind}
                  {o.state ? ` · ${o.state}` : ''}
                  {o.place ? ` · ${o.place}` : ''}
                </p>
              </div>
              {o.govtContractValueAud > 0 && (
                <div className="shrink-0 text-right">
                  <p className="font-display text-lg leading-none">{money(o.govtContractValueAud)}</p>
                  <p className="text-[10px] uppercase tracking-wide" style={{ color: '#A99C8F' }}>
                    {o.govtContractCount} contract{o.govtContractCount === 1 ? '' : 's'}
                  </p>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: '#2E2E2E99' }}>{o.note}</p>
          </li>
        ))}
      </ul>

      {shown.length === 0 && <p className="mt-8 text-sm" style={{ color: '#6A5E54' }}>Nothing matches. Clear a filter.</p>}
    </div>
  );
}

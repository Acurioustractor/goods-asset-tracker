'use client';

import { useMemo, useState } from 'react';
import type { OutreachTarget } from '@/lib/data/outreach-targets';
import { CATEGORY_LABELS, COMMUNITY_LABELS } from '@/lib/data/outreach-targets';

const EVIDENCE_LABELS: Record<string, string> = {
  real_contactable: 'Real, contactable',
  needs_call: 'Needs a call',
  dropped: 'Dropped',
};

const EVIDENCE_COLORS: Record<string, string> = {
  real_contactable: 'bg-green-100 text-green-800',
  needs_call: 'bg-amber-100 text-amber-800',
  dropped: 'bg-neutral-200 text-neutral-500',
};

const CONTACT_LABELS: Record<string, string> = {
  not_contacted: 'Not contacted',
  contacted: 'Contacted',
  responded: 'Responded',
  open: 'Open',
  dead: 'Dead',
};

type Lens = 'community' | 'type' | 'status';

export function FundingBoard({ targets }: { targets: OutreachTarget[] }) {
  const [lens, setLens] = useState<Lens>('community');
  const [community, setCommunity] = useState('all');
  const [category, setCategory] = useState('all');
  const [contactStatus, setContactStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [showDropped, setShowDropped] = useState(false);

  const communities = useMemo(
    () => Object.keys(COMMUNITY_LABELS).filter(id => targets.some(t => t.communities?.includes(id))),
    [targets]
  );
  const categories = useMemo(() => [...new Set(targets.map(t => t.category))].sort(), [targets]);
  const contactStatuses = useMemo(
    () => [...new Set(targets.map(t => t.contactStatus).filter(Boolean))] as string[],
    [targets]
  );

  const rows = targets.filter(t => {
    if (!showDropped && t.evidenceTier === 'dropped') return false;
    if (community !== 'all' && !t.communities?.includes(community)) return false;
    if (category !== 'all' && t.category !== category) return false;
    if (contactStatus !== 'all' && t.contactStatus !== contactStatus) return false;
    if (query && !`${t.name} ${t.notes ?? ''} ${t.amountSignal ?? ''}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  // Group rows by the active lens, so the same table reorganises instead of becoming a new page.
  const grouped = useMemo(() => {
    const groups = new Map<string, OutreachTarget[]>();
    for (const t of rows) {
      const keys =
        lens === 'community'
          ? (t.communities?.length ? t.communities.map(c => COMMUNITY_LABELS[c] ?? c) : ['Unlinked to a community'])
          : lens === 'type'
            ? [CATEGORY_LABELS[t.category] ?? t.category]
            : [CONTACT_LABELS[t.contactStatus ?? 'not_contacted']];
      for (const k of keys) {
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k)!.push(t);
      }
    }
    return [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [rows, lens]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex rounded-lg border overflow-hidden">
          {(['community', 'type', 'status'] as Lens[]).map(l => (
            <button
              key={l}
              onClick={() => setLens(l)}
              className={`px-3 py-2 text-sm capitalize ${lens === l ? 'bg-foreground text-background' : 'bg-background'}`}
            >
              By {l}
            </button>
          ))}
        </div>
        <label>
          Community
          <select className="ml-2 rounded-lg border bg-background p-2" value={community} onChange={e => setCommunity(e.target.value)}>
            <option value="all">All communities</option>
            {communities.map(id => (
              <option key={id} value={id}>{COMMUNITY_LABELS[id]}</option>
            ))}
          </select>
        </label>
        <label>
          Type
          <select className="ml-2 rounded-lg border bg-background p-2" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="all">All types</option>
            {categories.map(c => (
              <option key={c} value={c}>{CATEGORY_LABELS[c] ?? c}</option>
            ))}
          </select>
        </label>
        <label>
          Contact status
          <select className="ml-2 rounded-lg border bg-background p-2" value={contactStatus} onChange={e => setContactStatus(e.target.value)}>
            <option value="all">All statuses</option>
            {contactStatuses.map(s => (
              <option key={s} value={s}>{CONTACT_LABELS[s] ?? s}</option>
            ))}
          </select>
        </label>
        <label className="grow min-w-[200px]">
          Search
          <input
            className="mt-0 ml-2 block w-full rounded-lg border bg-background p-2"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Name, notes, amount"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showDropped} onChange={e => setShowDropped(e.target.checked)} />
          Show dropped (researched, ruled out)
        </label>
      </div>

      <p aria-live="polite" className="text-sm text-muted-foreground">
        {rows.length} of {targets.length} records shown, grouped by {lens}.
      </p>

      <div className="space-y-8">
        {grouped.map(([group, items]) => (
          <div key={group}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {group} <span className="font-normal normal-case">({items.length})</span>
            </h3>
            <div className="overflow-auto rounded-lg border">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-muted">
                  <tr>
                    {['Org', 'Type', 'Communities', 'Evidence', 'Amount / signal', 'Contact', 'Next action'].map(h => (
                      <th className="p-2" key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map(t => (
                    <tr key={t.id} className="border-t align-top">
                      <td className="p-2 font-medium">{t.name}</td>
                      <td className="p-2">{CATEGORY_LABELS[t.category] ?? t.category}</td>
                      <td className="p-2">{t.communities?.map(c => COMMUNITY_LABELS[c] ?? c).join(', ') ?? '—'}</td>
                      <td className="p-2">
                        {t.evidenceTier ? (
                          <span className={`rounded px-2 py-0.5 text-xs ${EVIDENCE_COLORS[t.evidenceTier]}`}>
                            {EVIDENCE_LABELS[t.evidenceTier]}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-2">{t.amountSignal ?? '—'}</td>
                      <td className="p-2">
                        {t.contactEmail ? (
                          <a className="underline" href={`mailto:${t.contactEmail}`}>{t.contactEmail}</a>
                        ) : (
                          t.contactName ?? '—'
                        )}
                        {t.contactStatus && (
                          <div className="text-xs text-muted-foreground">{CONTACT_LABELS[t.contactStatus]}</div>
                        )}
                      </td>
                      <td className="p-2">{t.nextAction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {grouped.length === 0 && <p className="p-6 text-center text-muted-foreground">No records match these filters.</p>}
      </div>
    </div>
  );
}

'use client';

/**
 * THE PROCUREMENT DESK. One dataset, one filter, many lenses.
 *
 * Ben, 17 September 2026, after four separate pages and then a first dashboard that was really
 * four lists: build the whole thing in Pencil and bring it back into the admin. The Pencil file
 * is design/Goods Dashboard.pen, frame "Desk Overview".
 *
 * Four things that design fixed, and they are the reason this file looks the way it does:
 *   1. The table was carrying the page. There are now two charts and a dated timeline above it,
 *      so the shape of the problem is visible before a single row is read.
 *   2. The blocker read like a paragraph of legal advice. It is one sentence and three cards:
 *      the seller that fails, the seller that passes, and the one still open.
 *   3. No column sorting. Every header sorts now.
 *   4. The rail was five controls in a thin column. It carries saved views and record counts.
 *
 * Filter state stays in the URL, so a link lands somebody exactly where you were standing.
 *
 * On TanStack Table: it is installed at v9, whose API is atoms, stores and registered features.
 * Four in-memory tables of a few hundred rows do not earn that, so sorting is the small hook
 * below. If a table here ever needs virtualisation or grouping, revisit it.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Command } from 'cmdk';
import {
  Search, X, LayoutGrid, Users, Zap, Hourglass, MapPin, Building2, Map, Calendar, FileText,
  Download, Lock, ArrowUp, ArrowDown, ChevronsUpDown, Check as CheckIcon,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Drawer, DrawerContent } from '@/components/ui/sheet-drawer';
import { Badge } from '@/components/ui/badge';
import type { Org } from '@/components/partners/org-list';
import type { Opportunity } from '@/lib/data/procurement-board';
import type { Opening } from '@/lib/data/procurement-openings';
import { OPENING_KINDS } from '@/lib/data/procurement-openings';
import type { Jurisdiction } from '@/lib/data/procurement-model';
import { isNotAPlace, resolvePlace } from '@/lib/data/place-registry';

export interface IntelRow {
  community: string;
  state: string | null;
  population: number | null;
  populationReliable: boolean;
  households: number | null;
  personsPerDwelling: number | null;
  overcrowdedPct: number | null;
}

export interface ReadCounts {
  contracts: number;
  ntHousingAgencyValueAud: number;
  ntHousingAgencyFurnitureContracts: number;
  expiries: number;
}

export interface DashboardData {
  orgs: Org[];
  places: Opportunity[];
  openings: readonly Opening[];
  jurisdictions: readonly Jurisdiction[];
  intel: IntelRow[];
  read: ReadCounts;
}

type Row =
  | { kind: 'org'; org: Org }
  | { kind: 'place'; place: Opportunity }
  | { kind: 'opening'; opening: Opening };

const money = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${n.toLocaleString('en-AU')}`);
const STATES = ['NT', 'QLD', 'SA', 'WA'] as const;
const BED_PRICE = 750;

const SHORT_STATE: Record<string, string> = {
  'Northern Territory': 'NT',
  Queensland: 'QLD',
  'South Australia': 'SA',
  'Western Australia': 'WA',
};

/**
 * Saved views. Each one is a whole question, written as the query string that answers it.
 * They are the difference between a filter bar and a desk you sit down at.
 */
const SAVED_VIEWS = [
  { id: 'all', label: 'Everything', icon: LayoutGrid, params: '' },
  { id: 'sellers', label: 'Community sellers', icon: Users, params: 'view=orgs' },
  { id: 'notender', label: 'No tender needed', icon: Zap, params: 'view=rules' },
  { id: 'expiring', label: 'Openings ahead', icon: Hourglass, params: 'view=when' },
  { id: 'present', label: 'Where we already are', icon: MapPin, params: 'view=orgs&known=1' },
] as const;

/** Sorting, small enough to read in one sitting. */
type Dir = 'asc' | 'desc';
function useSort<T>(rows: T[], initial: { key: string; dir: Dir }, accessors: Record<string, (r: T) => string | number | null>) {
  const [sort, setSort] = useState(initial);
  const sorted = useMemo(() => {
    const get = accessors[sort.key];
    if (!get) return rows;
    const sign = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = get(a);
      const y = get(b);
      if (x === null || x === undefined) return 1;
      if (y === null || y === undefined) return -1;
      if (typeof x === 'number' && typeof y === 'number') return (x - y) * sign;
      return String(x).localeCompare(String(y)) * sign;
    });
    // accessors is a literal rebuilt each render; the rows and sort are what matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, sort]);
  const toggle = (key: string) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }));
  return { sorted, sort, toggle };
}

function SortHead({ label, k, sort, toggle, right, className }: { label: string; k: string; sort: { key: string; dir: Dir }; toggle: (k: string) => void; right?: boolean; className?: string }) {
  const on = sort.key === k;
  const Icon = on ? (sort.dir === 'asc' ? ArrowUp : ArrowDown) : ChevronsUpDown;
  return (
    <TableHead className={[right ? 'text-right' : '', className ?? ''].filter(Boolean).join(' ') || undefined}>
      <button
        type="button"
        onClick={() => toggle(k)}
        aria-label={`Sort by ${label}`}
        className={`inline-flex items-center gap-1 ${right ? 'flex-row-reverse' : ''} ${on ? 'text-foreground' : ''}`}
      >
        {label}
        <Icon className={`h-3 w-3 ${on ? 'text-goods-terracotta' : 'opacity-40'}`} />
      </button>
    </TableHead>
  );
}

export function ProcurementDashboard({ data }: { data: DashboardData }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState<Row | null>(null);
  const [palette, setPalette] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const set = useCallback((key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [params, pathname, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Cmd-K belongs to the admin sidebar's own "Jump anywhere". This palette searches the
      // records on this page, so it takes "/", and only when nothing else has the caret.
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setPalette(true);
      }
      if (e.key === 'Escape') setPalette(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const tab = params.get('view') ?? 'orgs';
  const q = params.get('q') ?? '';
  const states = (params.get('state') ?? '').split(',').filter(Boolean);
  const known = params.get('known') === '1';
  const routed = params.get('route') === '1';
  const crowded = params.get('crowded') === '1';
  const withContractors = params.get('all') === '1';

  const toggleState = (s: string) =>
    set('state', (states.includes(s) ? states.filter((x) => x !== s) : [...states, s]).join(','));

  const matchesText = useCallback((hay: string) => !q || hay.toLowerCase().includes(q.toLowerCase()), [q]);

  const orgs = useMemo(() => data.orgs.filter((o) => {
    if (!withContractors && o.group === 'contractor') return false;
    if (known && !o.known) return false;
    if (routed && o.govtContractValueAud <= 0) return false;
    if (states.length && o.state && !states.includes(o.state)) return false;
    return matchesText(`${o.name} ${o.place} ${o.note}`);
  }), [data.orgs, known, routed, states, matchesText, withContractors]);

  const places = useMemo(() => data.places.filter((p) => {
    if (known && p.parts.presence === 0) return false;
    if (routed && !p.routeExists) return false;
    if (crowded && (p.crowdedPct ?? 0) < 50) return false;
    if (states.length && !states.includes(p.state)) return false;
    return matchesText(`${p.community} ${p.partner ?? ''} ${p.move}`);
  }), [data.places, known, routed, crowded, states, matchesText]);

  const openings = useMemo(() => data.openings.filter((o) => {
    if (states.length && !states.includes(o.jurisdiction)) return false;
    return matchesText(`${o.title} ${o.what} ${o.jurisdiction}`);
  }), [data.openings, states, matchesText]);

  const jurisdictions = useMemo(
    () => data.jurisdictions.filter((j) => !states.length || states.includes(SHORT_STATE[j.name] ?? '')),
    [data.jurisdictions, states],
  );

  const intel = useMemo(
    () => data.intel
      .filter((r) => r.overcrowdedPct !== null)
      .filter((r) => !states.length || (r.state && states.includes(r.state)))
      .filter((r) => matchesText(r.community))
      .sort((a, b) => (b.overcrowdedPct ?? 0) - (a.overcrowdedPct ?? 0)),
    [data.intel, states, matchesText],
  );

  const anyFilter = Boolean(q || states.length || known || routed || crowded || withContractors);
  const community = orgs.filter((o) => o.group === 'community');
  const contractors = orgs.length - community.length;
  const badlyCrowded = intel.filter((r) => (r.overcrowdedPct ?? 0) >= 50).length;
  const nowOpen = openings.filter((o) => o.kind === 'in-market' || o.kind === 'standing').length;

  const metrics = [
    { k: 'Organisations mapped', v: String(orgs.length), sub: withContractors ? `${community.length} community-controlled` : `of ${data.orgs.length} mapped, contractors hidden`, fill: data.orgs.length ? orgs.length / data.orgs.length : 0, c: 'var(--goods-sage)' },
    { k: 'Communities with census', v: String(intel.length), sub: `${badlyCrowded} over half overcrowded`, fill: intel.length ? badlyCrowded / intel.length : 0, c: 'var(--goods-clay)' },
    { k: 'Openings dated', v: String(openings.length), sub: `${nowOpen} you can act on today`, fill: openings.length ? nowOpen / openings.length : 0, c: 'var(--goods-teal)' },
    { k: 'NT housing spend read', v: money(data.read.ntHousingAgencyValueAud), sub: `${data.read.ntHousingAgencyFurnitureContracts} furniture contracts in it`, fill: 0.01, c: 'var(--goods-gold)' },
    { k: 'Beds bought for a remote house', v: '0', sub: `across ${data.read.contracts.toLocaleString('en-AU')} contracts`, fill: 0, c: 'var(--goods-terracotta)', loud: true },
  ];

  const exportCsv = () => {
    const rows: string[][] = tab === 'orgs'
      ? [['Organisation', 'Kind', 'Place', 'State', 'Govt contracts', 'What we know'],
        ...orgs.map((o) => [o.name, o.kind.replace(/_/g, ' '), o.place, o.state, String(o.govtContractValueAud), o.note])]
      : tab === 'places'
        ? [['Community', 'State', 'Overcrowded %', 'Govt spend', 'Next move'],
          ...places.map((p) => [p.community, p.state, String(p.crowdedPct ?? ''), String(p.govtSpendAud ?? ''), p.move])]
        : tab === 'when'
          ? [['When', 'Title', 'Jurisdiction', 'What', 'Source'],
            ...openings.map((o) => [o.whenLabel, o.title, o.jurisdiction, o.what, o.source])]
          : [['Jurisdiction', 'Beds with no tender', 'Rule', 'Door'],
            ...jurisdictions.map((j) => [j.name, j.directPurchase ? (j.directPurchase.beds || 'no cap').toString() : '', j.directPurchase?.rule ?? '', j.door ?? ''])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `goods-procurement-${tab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-0 lg:grid-cols-[216px_minmax(0,1fr)]">
      {/* ── Rail ───────────────────────────────────────────────────────────── */}
      <aside className="space-y-5 border-b pb-6 lg:sticky lg:top-0 lg:self-start lg:border-b-0 lg:border-r lg:py-6 lg:pr-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            ref={searchRef}
            value={q}
            onChange={(e) => set('q', e.target.value)}
            placeholder="Find an org or place"
            aria-label="Search"
            className="w-full rounded-lg border bg-muted py-2 pl-8 pr-9 text-xs"
          />
          <kbd className="pointer-events-none absolute right-2 top-2 rounded border bg-background px-1.5 py-0.5 text-[9px] text-muted-foreground">/</kbd>
        </label>

        <Facet label="Views">
          {SAVED_VIEWS.map((v) => {
            const on = v.params === '' ? !params.toString() : params.toString() === v.params;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => router.replace(v.params ? `${pathname}?${v.params}` : pathname, { scroll: false })}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs ${on ? 'bg-muted font-semibold' : 'text-foreground/80'}`}
              >
                <v.icon className={`h-3.5 w-3.5 ${on ? 'text-goods-terracotta' : 'text-muted-foreground'}`} />
                {v.label}
              </button>
            );
          })}
        </Facet>

        <Facet label="Records">
          {([
            { id: 'orgs', label: 'Organisations', icon: Building2, n: orgs.length },
            { id: 'places', label: 'Communities', icon: Map, n: places.length },
            { id: 'when', label: 'Openings', icon: Calendar, n: openings.length },
            { id: 'rules', label: 'Rules', icon: FileText, n: jurisdictions.length },
          ] as const).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => set('view', r.id === 'orgs' ? null : r.id)}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs ${tab === r.id ? 'bg-muted font-semibold' : 'text-foreground/80'}`}
            >
              <r.icon className={`h-3.5 w-3.5 ${tab === r.id ? 'text-goods-terracotta' : 'text-muted-foreground'}`} />
              <span className="flex-1">{r.label}</span>
              <span className="tabular-nums text-muted-foreground">{r.n}</span>
            </button>
          ))}
        </Facet>

        <Facet label="Narrow to">
          <div className="space-y-1.5 px-2">
            <Check on={known} onChange={(v) => set('known', v ? '1' : null)} label="We already know them" />
            <Check on={routed} onChange={(v) => set('route', v ? '1' : null)} label="Holds government contracts" />
            <Check on={crowded} onChange={(v) => set('crowded', v ? '1' : null)} label="50%+ overcrowded" />
            <Check on={withContractors} onChange={(v) => set('all', v ? '1' : null)} label="Include general contractors" />
          </div>
        </Facet>

        {anyFilter && (
          <button
            type="button"
            onClick={() => router.replace(pathname, { scroll: false })}
            className="inline-flex items-center gap-1 px-2 text-xs text-muted-foreground underline"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}

        <div className="border-t px-2 pt-3 text-[10px] leading-relaxed text-muted-foreground">
          <p>Read 17 Sep 2026</p>
          <p>AusTender · NT contracts workbook · ABS Census 2021 table I16 · grantscope</p>
          <p className="mt-2">Filters live in the address bar, so this view can be sent to someone and it will land where you are. Press / to search the records.</p>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <div className="min-w-0 space-y-4 lg:py-6 lg:pl-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl leading-tight">Who can buy a bed, and how</h2>
            <p className="text-xs text-muted-foreground">Every organisation, place, rule and opening we have read, in one desk.</p>
          </div>
          <div className="flex items-center rounded-lg border p-[3px]">
            <button
              type="button"
              onClick={() => set('state', null)}
              className={`rounded-md px-3 py-1.5 text-xs ${states.length === 0 ? 'bg-foreground font-semibold text-background' : 'text-muted-foreground'}`}
            >
              All
            </button>
            {STATES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleState(s)}
                aria-pressed={states.includes(s)}
                className={`rounded-md px-3 py-1.5 text-xs ${states.includes(s) ? 'bg-foreground font-semibold text-background' : 'text-muted-foreground'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs">
            <Download className="h-3.5 w-3.5" /> Export list
          </button>
        </div>

        {/* Metrics */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map((m) => (
            <div key={m.k} className="rounded-xl border bg-card p-3.5" style={m.loud ? { borderColor: 'var(--goods-terracotta)' } : undefined}>
              <p className="text-[10px] font-semibold leading-snug text-muted-foreground">{m.k}</p>
              <p className="mt-1.5 font-display text-3xl leading-none" style={m.loud ? { color: 'var(--goods-terracotta)' } : undefined}>{m.v}</p>
              <div className="mt-2 h-1 w-full rounded-full bg-muted">
                {m.fill > 0 && <div className="h-1 rounded-full" style={{ width: `${Math.max(3, m.fill * 100)}%`, backgroundColor: m.c }} />}
              </div>
              <p className="mt-1.5 text-[10px] leading-snug text-muted-foreground">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* The blocker, in one sentence and three cards */}
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 shrink-0 text-goods-terracotta" />
            <p className="flex-1 text-sm font-semibold">Every Indigenous procurement rule tests the entity that sells. The buyer is never the test.</p>
          </div>
          <div className="mt-3 grid gap-2.5 md:grid-cols-3">
            {[
              { mark: '✕', c: 'var(--goods-terracotta)', n: 'A Curious Tractor Pty Ltd', s: 'Invoices the beds today. It is not Indigenous-owned, so it fails Supply Nation, the federal IPP and the NT Aboriginal Business register.' },
              { mark: '✓', c: 'var(--goods-sage)', n: 'A community organisation', s: 'Passes in all four jurisdictions. Bawinanga, Thamarrurr and Roper Gulf already hold government contracts in their own name.' },
              { mark: '?', c: 'var(--goods-gold)', n: 'Goods on Country Ltd', s: 'Queensland and Western Australia test the composition of the board. 100% Indigenous directors may already satisfy both. The question is with the Industry Capability Network.' },
            ].map((t) => (
              <div key={t.n} className="rounded-lg bg-muted/60 p-3" style={{ borderLeft: `3px solid ${t.c}` }}>
                <p className="flex items-center gap-2 text-xs font-semibold">
                  <span style={{ color: t.c }}>{t.mark}</span> {t.n}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{t.s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Two charts */}
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs font-semibold">Beds you can sell before a tender is required</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
              Each jurisdiction&rsquo;s direct-buy ceiling for an Indigenous supplier, divided by ${BED_PRICE}.
            </p>
            <div className="mt-3 space-y-2.5">
              {jurisdictions.filter((j) => j.directPurchase).slice().sort((a, b) => (b.directPurchase!.beds || 1e9) - (a.directPurchase!.beds || 1e9)).map((j) => {
                const beds = j.directPurchase!.beds;
                const pct = beds === 0 ? 100 : Math.max(4, (beds / 800) * 100);
                const short = SHORT_STATE[j.name] ?? j.name;
                const colour = { NT: 'var(--goods-clay)', QLD: 'var(--goods-gold)', SA: 'var(--goods-sage)', WA: 'var(--goods-teal)' }[short] ?? 'var(--goods-clay)';
                return (
                  <button key={j.id} type="button" onClick={() => set('view', 'rules')} className="block w-full text-left">
                    <div className="flex items-center gap-2">
                      <span className="w-8 shrink-0 text-xs font-semibold">{short}</span>
                      <span className="h-4 min-w-[70px] flex-1 rounded-sm bg-muted">
                        <span className="block h-4 rounded-sm" style={{ width: `${pct}%`, backgroundColor: colour }} />
                      </span>
                      <span className="w-16 shrink-0 text-right text-xs font-semibold tabular-nums">{beds === 0 ? 'no cap' : `${beds} beds`}</span>
                    </div>
                    <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{shortRule(short)}</p>
                  </button>
                );
              })}
              {jurisdictions.length === 0 && <p className="py-4 text-xs text-muted-foreground">No jurisdiction matches that filter.</p>}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs font-semibold">Where the crowding is worst</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
              Share of dwellings needing at least one more bedroom. ABS Census 2021, Indigenous Profile table I16, per Indigenous Location.
            </p>
            <div className="mt-3 space-y-1.5">
              {intel.slice(0, 8).map((r) => (
                <div key={r.community} className="flex items-center gap-2.5">
                  <span className="flex w-28 shrink-0 items-baseline gap-1.5 truncate text-xs">
                    {r.community}
                    <span className="text-[9px] font-semibold text-muted-foreground">{r.state}</span>
                  </span>
                  <span className="h-3.5 min-w-[70px] flex-1 rounded-sm bg-muted">
                    <span className="block h-3.5 rounded-sm" style={{ width: `${r.overcrowdedPct}%`, backgroundColor: 'var(--goods-clay)' }} />
                  </span>
                  <span className="w-11 shrink-0 text-right text-[11px] font-semibold tabular-nums">{(r.overcrowdedPct ?? 0).toFixed(1)}%</span>
                  <span className="hidden w-24 shrink-0 text-[10px] text-muted-foreground xl:block">
                    {r.personsPerDwelling ? `${r.personsPerDwelling.toFixed(2)} per dwelling` : 'not held'}
                  </span>
                </div>
              ))}
              {intel.length === 0 && <p className="py-4 text-xs text-muted-foreground">No community matches that filter.</p>}
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
              Population is not shown here. The source returns a default of 150 for the Queensland and South Australian
              rows, nine of eighteen repeat it, and a figure that wrong belongs on the record and nowhere near a ranking.
            </p>
          </div>
        </div>

        {/* Openings on a timeline */}
        <OpeningsTimeline openings={openings} onPick={(o) => setOpen({ kind: 'opening', opening: o })} />

        {/* The four lenses */}
        <Tabs value={tab} onValueChange={(v) => set('view', v === 'orgs' ? null : v)}>
          <TabsList>
            <TabsTrigger value="orgs">Organisations <Badge variant="secondary">{orgs.length}</Badge></TabsTrigger>
            <TabsTrigger value="places">Communities <Badge variant="secondary">{places.length}</Badge></TabsTrigger>
            <TabsTrigger value="when">Openings <Badge variant="secondary">{openings.length}</Badge></TabsTrigger>
            <TabsTrigger value="rules">Rules <Badge variant="secondary">{jurisdictions.length}</Badge></TabsTrigger>
          </TabsList>

          <TabsContent value="orgs">
            <OrgTable orgs={orgs} onPick={(o) => setOpen({ kind: 'org', org: o })} />
            <p className="px-1 py-2.5 text-[11px] text-muted-foreground">
              Showing {orgs.length} of {data.orgs.length}.{' '}
              {withContractors
                ? `${contractors} of them are general contractors.`
                : `${data.orgs.filter((o) => o.group === 'contractor').length} general contractors are hidden.`}{' '}
              Nothing here says an organisation buys beds. It says they hold contracts, or serve a community, or we already know them.
            </p>
          </TabsContent>

          <TabsContent value="places">
            <PlaceTable places={places} onPick={(p) => setOpen({ kind: 'place', place: p })} />
          </TabsContent>

          <TabsContent value="when">
            <OpeningTable openings={openings} onPick={(o) => setOpen({ kind: 'opening', opening: o })} />
          </TabsContent>

          <TabsContent value="rules">
            <div className="grid gap-4 sm:grid-cols-2">
              {jurisdictions.map((j) => (
                <div key={j.id} className="rounded-xl border bg-card p-5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-lg leading-snug">{j.name}</p>
                    <Badge variant={j.status === 'done' ? 'secondary' : 'outline'}>{j.status === 'done' ? 'researched' : 'pending'}</Badge>
                  </div>
                  {j.directPurchase && (
                    <p className="mt-3 font-display text-2xl leading-none">
                      {j.directPurchase.beds > 0 ? `${j.directPurchase.beds} beds` : 'No cap'}
                      <span className="ml-2 align-middle text-[11px] font-normal text-muted-foreground">with no tender</span>
                    </p>
                  )}
                  {j.directPurchase && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{j.directPurchase.rule}</p>}
                  {j.door && <p className="mt-3 text-xs leading-relaxed"><span className="font-semibold">The door. </span>{j.door}</p>}
                </div>
              ))}
            </div>
            <Empty n={jurisdictions.length} />
          </TabsContent>
        </Tabs>
      </div>

      {/* ⌘K */}
      {palette && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 p-6 pt-[12vh]" onClick={() => setPalette(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl overflow-hidden rounded-xl border bg-popover shadow-xl">
            <Command label="Find a record">
              <Command.Input autoFocus placeholder="Find an organisation, community or opening" className="w-full border-b bg-transparent px-4 py-3 text-sm outline-none" />
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">Nothing matches.</Command.Empty>
                <Command.Group heading="Organisations" className="px-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground">
                  {data.orgs.slice(0, 200).map((o) => (
                    <Command.Item key={`o-${o.name}`} value={`${o.name} ${o.place}`} onSelect={() => { setOpen({ kind: 'org', org: o }); setPalette(false); }} className="cursor-pointer rounded-md px-3 py-2 text-sm text-foreground data-[selected=true]:bg-muted">
                      {o.name} <span className="text-xs text-muted-foreground">{o.place}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group heading="Communities" className="px-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground">
                  {data.places.map((p) => (
                    <Command.Item key={`p-${p.community}`} value={`${p.community} ${p.state}`} onSelect={() => { setOpen({ kind: 'place', place: p }); setPalette(false); }} className="cursor-pointer rounded-md px-3 py-2 text-sm text-foreground data-[selected=true]:bg-muted">
                      {p.community} <span className="text-xs text-muted-foreground">{p.state}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group heading="Openings" className="px-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground">
                  {data.openings.map((o) => (
                    <Command.Item key={`w-${o.id}`} value={`${o.title} ${o.jurisdiction}`} onSelect={() => { setOpen({ kind: 'opening', opening: o }); setPalette(false); }} className="cursor-pointer rounded-md px-3 py-2 text-sm text-foreground data-[selected=true]:bg-muted">
                      {o.title} <span className="text-xs text-muted-foreground">{o.whenLabel}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}

      <Drawer open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        {open && (
          <DrawerContent title={open.kind === 'org' ? open.org.name : open.kind === 'place' ? open.place.community : open.opening.title}>
            {open.kind === 'org' && <OrgDetail o={open.org} />}
            {open.kind === 'place' && <PlaceDetail p={open.place} />}
            {open.kind === 'opening' && <OpeningDetail o={open.opening} />}
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}

/**
 * A place column that says what kind of place it is.
 *
 * Nearly half the org list carried a region, a whole jurisdiction or a building in the place
 * field, and the table printed them as if somebody lived there. Miwatj Health serves East Arnhem,
 * which is a region; nobody delivers a bed to it. The registry knows the difference, so the table
 * can show it.
 */
function PlaceCell({ raw }: { raw: string }) {
  if (!raw) return <span>not recorded</span>;
  // The NT workbook puts fragments of contract titles in its place column, truncated at 30
  // characters. Those are declared non-places in the registry, so say so instead of printing
  // "Panel Contract for Repairs, Ma" where a community should be.
  if (isNotAPlace(raw)) return <span className="italic opacity-60">no place given</span>;
  const place = resolvePlace(raw);
  if (!place) return <span>{raw}</span>;
  const qualifier =
    place.kind === 'region' ? 'region'
    : place.kind === 'jurisdiction' ? 'whole jurisdiction'
    : place.kind === 'facility' ? 'building'
    : null;
  return (
    <span>
      {place.name}
      {qualifier && <span className="ml-1.5 text-[9px] uppercase tracking-wide opacity-70">{qualifier}</span>}
    </span>
  );
}

/** One line per jurisdiction, short enough to sit under a bar. */
function shortRule(short: string) {
  return {
    NT: '$50,000 to a Territory Aboriginal Business Enterprise, no tender',
    QLD: '$500,000 state-side, or $21,900 council-side with no quotes at all',
    SA: 'One written quote to $550,000, APY Lands named in the instrument',
    WA: 'Registered Aboriginal Business, any value, value for money documented',
  }[short] ?? '';
}

/**
 * The timeline. Months since the first opening drive the offset, so the spacing is the real
 * distance between two dates and the eye can read the gap.
 */
function OpeningsTimeline({ openings, onPick }: { openings: Opening[]; onPick: (o: Opening) => void }) {
  const sorted = [...openings].sort((a, b) => a.when.localeCompare(b.when));
  if (sorted.length === 0) return null;
  const months = (w: string) => {
    const [y, m] = w.split('-').map(Number);
    return y * 12 + m;
  };
  const first = months(sorted[0].when);
  const last = months(sorted[sorted.length - 1].when);
  const span = Math.max(1, last - first);
  const ticks = [...new Set(sorted.map((o) => o.when.slice(0, 4)))];

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold">{sorted.length} openings, dated</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
            They come from published forward plans, standing rules and contract end dates. There is no live tender feed to have.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {Object.entries(OPENING_KINDS).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: v.colour }} />
              {v.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 flex gap-3">
        <div className="w-64 shrink-0" />
        <div className="relative h-3 flex-1">
          {ticks.map((y) => (
            <span key={y} className="absolute top-0 text-[9px] font-semibold text-muted-foreground" style={{ left: `${((months(`${y}-01`) - first) / span) * 100}%` }}>{y}</span>
          ))}
        </div>
      </div>

      <div className="mt-1 space-y-1.5">
        {sorted.map((o) => {
          const pos = ((months(o.when) - first) / span) * 100;
          return (
            <button key={o.id} type="button" onClick={() => onPick(o)} className="flex w-full items-center gap-3 rounded-md py-1 text-left hover:bg-muted/50">
              <span className="w-64 shrink-0">
                <span className="block truncate text-[11px] font-semibold">{o.title}</span>
                <span className="block truncate text-[10px] text-muted-foreground">{o.whenLabel}</span>
              </span>
              <span className="relative h-5 flex-1">
                <span className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-muted" />
                <span
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card"
                  style={{ left: `${Math.min(99, Math.max(1, pos))}%`, backgroundColor: OPENING_KINDS[o.kind].colour }}
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OrgTable({ orgs, onPick }: { orgs: Org[]; onPick: (o: Org) => void }) {
  const { sorted, sort, toggle } = useSort(orgs, { key: 'value', dir: 'desc' }, {
    name: (o) => o.name,
    kind: (o) => o.kind,
    place: (o) => o.place || 'zzz',
    state: (o) => o.state || 'zzz',
    value: (o) => o.govtContractValueAud,
  });
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <SortHead label="Organisation" k="name" sort={sort} toggle={toggle} className="w-[24%] min-w-[210px]" />
            <SortHead label="Kind" k="kind" sort={sort} toggle={toggle} />
            <SortHead label="Place" k="place" sort={sort} toggle={toggle} />
            <SortHead label="State" k="state" sort={sort} toggle={toggle} />
            <SortHead label="Govt contracts" k="value" sort={sort} toggle={toggle} right />
            <TableHead className="normal-case">What we know</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((o) => (
            <TableRow key={o.name} onClick={() => onPick(o)} className="cursor-pointer">
              <TableCell>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: o.group === 'community' ? 'var(--goods-sage)' : 'var(--goods-grid)' }} />
                  <span className="font-medium">{o.name}</span>
                </span>
                {o.proximityOnly && <Badge className="mt-1" variant="outline" title="Only source is the proximity-matched shared graph">proximity only</Badge>}
              </TableCell>
              <TableCell><Badge variant="secondary">{o.kind.replace(/_/g, ' ')}</Badge></TableCell>
              <TableCell className="text-muted-foreground"><PlaceCell raw={o.place} /></TableCell>
              <TableCell className="text-muted-foreground">{o.state || 'not recorded'}</TableCell>
              <TableCell className="text-right font-semibold tabular-nums">{o.govtContractValueAud > 0 ? money(o.govtContractValueAud) : 'none'}</TableCell>
              <TableCell className="w-[30%] text-[11px] leading-snug text-muted-foreground"><span className="line-clamp-2">{o.note}</span></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Empty n={sorted.length} />
    </>
  );
}

function PlaceTable({ places, onPick }: { places: Opportunity[]; onPick: (p: Opportunity) => void }) {
  const { sorted, sort, toggle } = useSort(places, { key: 'score', dir: 'desc' }, {
    community: (p) => p.community,
    state: (p) => p.state,
    crowded: (p) => p.crowdedPct,
    spend: (p) => p.govtSpendAud,
    beds: (p) => p.bedsNoTender,
    score: (p) => p.score,
  });
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <SortHead label="Community" k="community" sort={sort} toggle={toggle} />
            <SortHead label="State" k="state" sort={sort} toggle={toggle} />
            <SortHead label="Crowded" k="crowded" sort={sort} toggle={toggle} right />
            <SortHead label="Govt spend" k="spend" sort={sort} toggle={toggle} right />
            <SortHead label="No tender" k="beds" sort={sort} toggle={toggle} right />
            <TableHead className="normal-case">Next move</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((p) => (
            <TableRow key={p.community} onClick={() => onPick(p)} className="cursor-pointer">
              <TableCell>
                <span className="font-medium">{p.community}</span>
                <span className="block text-xs text-muted-foreground">{p.partner ?? 'no partner recorded'}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">{p.state}</TableCell>
              <TableCell className="text-right tabular-nums">{p.crowdedPct === null ? 'not held' : `${p.crowdedPct.toFixed(0)}%`}</TableCell>
              <TableCell className="text-right tabular-nums">{p.govtSpendAud ? money(p.govtSpendAud) : 'not held'}</TableCell>
              <TableCell className="text-right tabular-nums">{p.bedsNoTender ? `${p.bedsNoTender} beds` : p.state === 'WA' ? 'no cap' : 'not held'}</TableCell>
              <TableCell className="w-[28%] text-[11px] leading-snug text-muted-foreground"><span className="line-clamp-2">{p.move}</span></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Empty n={sorted.length} />
    </>
  );
}

function OpeningTable({ openings, onPick }: { openings: Opening[]; onPick: (o: Opening) => void }) {
  const { sorted, sort, toggle } = useSort(openings, { key: 'when', dir: 'asc' }, {
    when: (o) => o.when,
    title: (o) => o.title,
    where: (o) => o.jurisdiction,
    kind: (o) => o.kind,
  });
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <SortHead label="When" k="when" sort={sort} toggle={toggle} />
            <SortHead label="Kind" k="kind" sort={sort} toggle={toggle} />
            <SortHead label="What" k="title" sort={sort} toggle={toggle} />
            <SortHead label="Where" k="where" sort={sort} toggle={toggle} />
            <TableHead className="normal-case">Next action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((o) => (
            <TableRow key={o.id} onClick={() => onPick(o)} className="cursor-pointer">
              <TableCell className="whitespace-nowrap font-medium">{o.whenLabel}</TableCell>
              <TableCell>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: OPENING_KINDS[o.kind].colour }} />
                  {OPENING_KINDS[o.kind].label}
                </span>
              </TableCell>
              <TableCell>{o.title}</TableCell>
              <TableCell className="text-muted-foreground">{o.jurisdiction}</TableCell>
              <TableCell className="w-[28%] text-[11px] leading-snug text-muted-foreground"><span className="line-clamp-2">{o.action ?? 'none recorded'}</span></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Empty n={sorted.length} />
    </>
  );
}

const Facet = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="mb-1.5 px-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
    <div className="space-y-0.5">{children}</div>
  </div>
);

const Check = ({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label className="flex items-start gap-2 text-xs leading-snug">
    <span className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border ${on ? 'border-goods-terracotta bg-goods-terracotta' : ''}`}>
      {on && <CheckIcon className="h-2.5 w-2.5 text-goods-cream" />}
    </span>
    <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
    <span>{label}</span>
  </label>
);

const Empty = ({ n }: { n: number }) =>
  n === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">Nothing matches. Clear a filter.</p> : null;

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="mt-1 text-sm leading-relaxed">{children}</p>
  </div>
);

function OrgDetail({ o }: { o: Org }) {
  return (
    <div className="space-y-4">
      <Field label="What we know">{o.note}</Field>
      <Field label="Type and place">{[o.kind.replace(/_/g, ' '), o.state, o.place].filter(Boolean).join(' · ') || 'not recorded'}</Field>
      {o.govtContractValueAud > 0 && (
        <Field label="Government contracts">{money(o.govtContractValueAud)} across {o.govtContractCount} award{o.govtContractCount === 1 ? '' : 's'}</Field>
      )}
      <Field label="Where this came from">{o.sources.join(', ')}</Field>
      {o.proximityOnly && (
        <p className="rounded-lg p-3 text-xs leading-relaxed" style={{ backgroundColor: '#F5EBD8', color: '#8A6A2F' }}>
          The only source is the shared graph, which matches organisations to communities on postcode with no ABN or
          name resolution. This is a real organisation. Whether it belongs to the community beside it is unchecked.
        </p>
      )}
    </div>
  );
}

function PlaceDetail({ p }: { p: Opportunity }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg p-4" style={{ backgroundColor: '#F6E4DE' }}>
        <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9A4023' }}>The next move</p>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: '#7A3418' }}>{p.move}</p>
      </div>
      <Field label="What we hold here">{p.presence ?? 'Nothing recorded.'}</Field>
      {p.partner && <Field label="The organisation here">{p.partner}</Field>}
      {p.routeEvidence && <Field label="Why a route exists">{p.routeEvidence}</Field>}
      {p.crowdedPct !== null && (
        <Field label="Overcrowding">
          {p.crowdedPct.toFixed(0)}% of households need one or more extra bedrooms
          {p.personsPerDwelling ? `, at ${p.personsPerDwelling.toFixed(1)} people per dwelling` : ''}. ABS Census 2021,
          table I16, Canadian National Occupancy Standard.
        </Field>
      )}
      {p.noTenderRule && <Field label="The rule here">{p.noTenderRule}</Field>}
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Government spend is what a government has already spent in this place on housing-adjacent work. It is never a
        bed order, and no demand figure appears anywhere on this page.
      </p>
    </div>
  );
}

function OpeningDetail({ o }: { o: Opening }) {
  return (
    <div className="space-y-4">
      <Field label="When">{o.whenLabel}</Field>
      <Field label="Kind">{OPENING_KINDS[o.kind].label}. {OPENING_KINDS[o.kind].blurb}</Field>
      <Field label="What">{o.what}</Field>
      {o.action && (
        <div className="rounded-lg p-4" style={{ backgroundColor: '#F6E4DE' }}>
          <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9A4023' }}>What to do</p>
          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: '#7A3418' }}>{o.action}</p>
        </div>
      )}
      <Field label="Source">{o.source}</Field>
    </div>
  );
}

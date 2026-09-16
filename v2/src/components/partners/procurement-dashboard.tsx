'use client';

/**
 * ONE FILTER BAR, FOUR VIEWS OF THE SAME QUESTION.
 *
 * Ben, 17 September 2026, having been shown four separate procurement pages: one place to play
 * with all of it, like a CRM or campaign dashboard. He chose shadcn, and chose to replace the
 * four pages. A fifth was the other option and he turned it down.
 *
 * The CRM pattern is one dataset, many lenses, shareable state. So:
 *   - Filter state lives in the URL. Every view answers the SAME question, and a link lands
 *     somebody exactly where you were standing.
 *   - The metric row recomputes against the filter, so filtering asks a question instead of
 *     hiding rows.
 *   - Every row opens a drawer. Nothing is truncated into a tooltip.
 *   - A row that rests on a weak source says so ON the row. That is the difference between a
 *     dashboard you act on and one you stop trusting in a month.
 */

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Drawer, DrawerContent } from '@/components/ui/sheet-drawer';
import { Badge } from '@/components/ui/badge';
import type { Org } from '@/components/partners/org-list';
import type { Opportunity } from '@/lib/data/procurement-board';
import type { Opening } from '@/lib/data/procurement-openings';
import type { Jurisdiction } from '@/lib/data/procurement-model';

export interface DashboardData {
  orgs: Org[];
  places: Opportunity[];
  openings: readonly Opening[];
  jurisdictions: readonly Jurisdiction[];
}

type Row =
  | { kind: 'org'; org: Org }
  | { kind: 'place'; place: Opportunity }
  | { kind: 'opening'; opening: Opening };

const money = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${n.toLocaleString('en-AU')}`);
const STATES = ['NT', 'QLD', 'SA', 'WA'] as const;

export function ProcurementDashboard({ data }: { data: DashboardData }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState<Row | null>(null);

  // URL is the state. One helper, used by every control.
  const set = useCallback((key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [params, pathname, router]);

  const tab = params.get('view') ?? 'orgs';
  const q = params.get('q') ?? '';
  const states = (params.get('state') ?? '').split(',').filter(Boolean);
  const known = params.get('known') === '1';
  const routed = params.get('route') === '1';
  const crowded = params.get('crowded') === '1';

  const toggleState = (s: string) =>
    set('state', (states.includes(s) ? states.filter((x) => x !== s) : [...states, s]).join(','));

  const matchesText = useCallback(
    (hay: string) => !q || hay.toLowerCase().includes(q.toLowerCase()),
    [q],
  );

  const orgs = useMemo(() => data.orgs.filter((o) => {
    if (known && !o.known) return false;
    if (routed && o.govtContractValueAud <= 0) return false;
    if (states.length && o.state && !states.includes(o.state)) return false;
    return matchesText(`${o.name} ${o.place} ${o.note}`);
  }), [data.orgs, known, routed, states, matchesText]);

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
    () => data.jurisdictions.filter((j) => !states.length || states.includes(j.name.split(' ').map((w) => w[0]).join('').toUpperCase()) || states.includes(shortState(j.name))),
    [data.jurisdictions, states],
  );

  const anyFilter = Boolean(q || states.length || known || routed || crowded);

  const metrics = [
    { k: 'Organisations', v: orgs.length, sub: `${orgs.filter((o) => o.known).length} we know` },
    { k: 'Communities', v: places.length, sub: `${places.filter((p) => p.routeExists).length} with a route` },
    { k: 'Openings', v: openings.length, sub: `${openings.filter((o) => o.kind === 'in-market' || o.kind === 'standing').length} actionable now` },
    { k: 'Contract value', v: money(orgs.reduce((n, o) => n + o.govtContractValueAud, 0)), sub: 'already spent, never a bed order' },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)]">
      {/* Filter rail */}
      <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
        <div>
          <label className="relative block">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => set('q', e.target.value)}
              placeholder="Search everything"
              aria-label="Search"
              className="w-full rounded-lg border bg-background py-2 pl-8 pr-2 text-sm"
            />
          </label>
        </div>

        <Facet label="State">
          <div className="flex flex-wrap gap-1.5">
            {STATES.map((s) => (
              <Chip key={s} on={states.includes(s)} onClick={() => toggleState(s)}>{s}</Chip>
            ))}
          </div>
        </Facet>

        <Facet label="Narrow to">
          <div className="space-y-1.5">
            <Check on={known} onChange={(v) => set('known', v ? '1' : null)} label="We already know them" />
            <Check on={routed} onChange={(v) => set('route', v ? '1' : null)} label="Holds government contracts" />
            <Check on={crowded} onChange={(v) => set('crowded', v ? '1' : null)} label="50%+ overcrowded" />
          </div>
        </Facet>

        {anyFilter && (
          <button
            type="button"
            onClick={() => router.replace(pathname, { scroll: false })}
            className="inline-flex items-center gap-1 text-xs underline text-muted-foreground"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Filters live in the address bar, so this view can be sent to someone and it will land where you are.
        </p>
      </aside>

      <div className="min-w-0">
        {/* Metrics, recomputed against the filter */}
        <div className="grid gap-3 sm:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.k} className="rounded-lg border p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{m.k}</p>
              <p className="mt-1 font-display text-2xl leading-none">{m.v}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{m.sub}</p>
            </div>
          ))}
        </div>

        <Tabs value={tab} onValueChange={(v) => set('view', v === 'orgs' ? null : v)} className="mt-6">
          <TabsList>
            <TabsTrigger value="orgs">Organisations <Badge variant="secondary">{orgs.length}</Badge></TabsTrigger>
            <TabsTrigger value="places">Communities <Badge variant="secondary">{places.length}</Badge></TabsTrigger>
            <TabsTrigger value="when">Openings <Badge variant="secondary">{openings.length}</Badge></TabsTrigger>
            <TabsTrigger value="rules">Rules <Badge variant="secondary">{jurisdictions.length}</Badge></TabsTrigger>
          </TabsList>

          <TabsContent value="orgs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Contracts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orgs.map((o) => (
                  <TableRow key={o.name} onClick={() => setOpen({ kind: 'org', org: o })} className="cursor-pointer">
                    <TableCell>
                      <span className="font-medium">{o.name}</span>
                      {o.known && <Badge className="ml-2" variant="secondary">known</Badge>}
                      {o.proximityOnly && <Badge className="ml-2" variant="outline" title="Only source is the proximity-matched shared graph">proximity only</Badge>}
                      <span className="block text-xs text-muted-foreground">{[o.state, o.place].filter(Boolean).join(' · ') || 'place not recorded'}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{o.kind.replace(/_/g, ' ')}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {o.govtContractValueAud > 0 ? money(o.govtContractValueAud) : 'none'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Empty n={orgs.length} />
          </TabsContent>

          <TabsContent value="places">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Community</TableHead>
                  <TableHead className="text-right">Crowded</TableHead>
                  <TableHead className="text-right">Govt spend</TableHead>
                  <TableHead className="text-right">No tender</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {places.map((p) => (
                  <TableRow key={p.community} onClick={() => setOpen({ kind: 'place', place: p })} className="cursor-pointer">
                    <TableCell>
                      <span className="font-medium">{p.community}</span>
                      <span className="block text-xs text-muted-foreground">{p.partner ?? 'no partner recorded'}</span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{p.crowdedPct === null ? 'not held' : `${p.crowdedPct.toFixed(0)}%`}</TableCell>
                    <TableCell className="text-right tabular-nums">{p.govtSpendAud ? money(p.govtSpendAud) : 'not held'}</TableCell>
                    <TableCell className="text-right tabular-nums">{p.bedsNoTender ? `${p.bedsNoTender} beds` : p.state === 'WA' ? 'no cap' : 'not held'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Empty n={places.length} />
          </TabsContent>

          <TabsContent value="when">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>What</TableHead>
                  <TableHead>Where</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...openings].sort((a, b) => a.when.localeCompare(b.when)).map((o) => (
                  <TableRow key={o.id} onClick={() => setOpen({ kind: 'opening', opening: o })} className="cursor-pointer">
                    <TableCell className="whitespace-nowrap font-medium">{o.whenLabel}</TableCell>
                    <TableCell>{o.title}</TableCell>
                    <TableCell className="text-muted-foreground">{o.jurisdiction}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Empty n={openings.length} />
          </TabsContent>

          <TabsContent value="rules">
            <div className="grid gap-4 sm:grid-cols-2">
              {jurisdictions.map((j) => (
                <div key={j.id} className="rounded-lg border p-5">
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

      {/* Detail drawer */}
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

function shortState(name: string) {
  return { 'Northern Territory': 'NT', Queensland: 'QLD', 'South Australia': 'SA', 'Western Australia': 'WA' }[name] ?? '';
}

const Facet = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
    {children}
  </div>
);

const Chip = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={on}
    className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors motion-reduce:transition-none ${on ? 'border-foreground bg-foreground text-background' : 'text-muted-foreground'}`}
  >
    {children}
  </button>
);

const Check = ({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label className="flex items-start gap-2 text-xs leading-snug">
    <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} className="mt-0.5" />
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

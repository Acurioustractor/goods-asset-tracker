'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check, ChevronDown, ExternalLink, Pencil, QrCode } from 'lucide-react';

export type AssetRow = {
  unique_id: string;
  name: string | null;
  product: string | null;
  community: string | null;
  place: string | null;
  status: string | null;
  supply_date: string | null;
  qr_url: string | null;
  partner_name: string | null;
  notes: string | null;
  quantity: number;
  photo_count: number;
  batch: string | null;
  last_telemetry: string | null;
};

const STATUS_COLOR: Record<string, string> = {
  deployed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  ready: 'bg-amber-100 text-amber-800 border-amber-200',
  allocated: 'bg-blue-100 text-blue-800 border-blue-200',
  requested: 'bg-violet-100 text-violet-800 border-violet-200',
  demo: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  under_investigation: 'bg-red-100 text-red-800 border-red-200',
  retired: 'bg-gray-100 text-gray-700 border-gray-200',
};

export function AssetTable({ rows }: { rows: AssetRow[] }) {
  const [q, setQ] = useState('');
  const [product, setProduct] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [community, setCommunity] = useState<string>('');
  const [batch, setBatch] = useState<string>('');
  const [showRetired, setShowRetired] = useState(false);

  const products = useMemo(() => uniq(rows.map((r) => r.product)), [rows]);
  const statuses = useMemo(() => uniq(rows.map((r) => r.status)), [rows]);
  const communities = useMemo(() => uniq(rows.map((r) => r.community)), [rows]);
  const batches = useMemo(() => uniq(rows.map((r) => r.batch)), [rows]);

  const retiredCount = useMemo(() => rows.filter((r) => r.status === 'retired').length, [rows]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return rows.filter((r) => {
      // Hide retired by default unless toggled on OR explicitly filtered to "retired"
      if (!showRetired && status !== 'retired' && r.status === 'retired') return false;
      if (product && r.product !== product) return false;
      if (status && (r.status || 'deployed') !== status) return false;
      if (community && r.community !== community) return false;
      if (batch && r.batch !== batch) return false;
      if (ql) {
        const hay = [r.unique_id, r.name, r.notes, r.partner_name, r.place]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      return true;
    });
  }, [rows, q, product, status, community, batch, showRetired]);

  function reset() {
    setQ('');
    setProduct('');
    setStatus('');
    setCommunity('');
    setBatch('');
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-6">
        <Input
          placeholder="Search ID, name, notes, partner..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="lg:col-span-2"
        />
        <FilterSelect value={product} onChange={setProduct} options={products} placeholder="All products" />
        <FilterSelect value={status} onChange={setStatus} options={statuses} placeholder="All statuses" />
        <FilterSelect value={community} onChange={setCommunity} options={communities} placeholder="All communities" />
        <FilterSelect value={batch} onChange={setBatch} options={batches} placeholder="All batches" />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div>
          Showing <span className="font-bold text-gray-900">{filtered.length.toLocaleString()}</span> of {rows.length.toLocaleString()}
          {!showRetired && retiredCount > 0 && (
            <span className="ml-2 text-gray-400">
              ({retiredCount} retired hidden)
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              checked={showRetired}
              onChange={(e) => setShowRetired(e.target.checked)}
              className="h-3.5 w-3.5"
            />
            <span>Show retired</span>
          </label>
          <button
            type="button"
            onClick={reset}
            className="rounded border border-gray-200 px-2 py-1 hover:bg-gray-50"
          >
            Reset filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <Th>ID</Th>
              <Th>Product</Th>
              <Th>Status</Th>
              <Th>Community</Th>
              <Th>Name / Recipient</Th>
              <Th>Supplied</Th>
              <Th>Batch</Th>
              <Th>Telemetry</Th>
              <Th className="text-right pr-4">Links</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.slice(0, 400).map((r) => (
              <tr key={r.unique_id} className="hover:bg-gray-50">
                <Td className="font-mono text-xs">
                  <Link
                    href={`/admin/assets/${encodeURIComponent(r.unique_id)}`}
                    className="text-blue-700 hover:underline"
                  >
                    {r.unique_id}
                  </Link>
                </Td>
                <Td>{r.product}</Td>
                <Td>
                  <Badge
                    variant="outline"
                    className={`capitalize ${STATUS_COLOR[r.status || 'deployed'] || ''}`}
                  >
                    {(r.status || 'deployed').replace(/_/g, ' ')}
                  </Badge>
                </Td>
                <Td>
                  {r.community ? (
                    <span>{r.community}{r.place ? <span className="text-gray-400"> · {r.place}</span> : null}</span>
                  ) : (
                    <span className="text-gray-400">--</span>
                  )}
                </Td>
                <Td className="max-w-[18ch] truncate" title={r.name || ''}>
                  {r.name || <span className="text-gray-400">--</span>}
                </Td>
                <Td className="whitespace-nowrap text-xs text-gray-500">
                  {r.supply_date ? new Date(r.supply_date).toLocaleDateString('en-AU') : '--'}
                </Td>
                <Td className="font-mono text-xs">{r.batch || '--'}</Td>
                <Td><TelemetryDot product={r.product} lastSeen={r.last_telemetry} /></Td>
                <Td className="pr-4">
                  <div className="flex justify-end gap-1.5">
                    <Link
                      href={`/admin/assets/${encodeURIComponent(r.unique_id)}`}
                      className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700 hover:bg-blue-100"
                      title="Edit this asset"
                    >
                      <Pencil className="h-3 w-3" /> edit
                    </Link>
                    <Link
                      href={`/bed/${r.unique_id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-600 hover:bg-gray-50"
                      title="Open public bed page"
                    >
                      <ExternalLink className="h-3 w-3" /> page
                    </Link>
                    {r.qr_url && (
                      <a
                        href={r.qr_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-600 hover:bg-gray-50"
                        title={r.qr_url}
                      >
                        <QrCode className="h-3 w-3" /> qr
                      </a>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 400 && (
          <div className="border-t bg-gray-50 px-4 py-2 text-xs text-gray-500">
            Showing first 400 rows. Narrow filters to see the rest.
          </div>
        )}
      </div>
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2 text-left font-semibold ${className}`}>{children}</th>;
}
function Td({
  children,
  className = '',
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <td className={`px-3 py-2 align-middle ${className}`} title={title}>
      {children}
    </td>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const showFilter = options.length > 8;
  const filtered = showFilter && filter
    ? options.filter((o) => o.toLowerCase().includes(filter.toLowerCase()))
    : options;

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-white px-3 text-sm shadow-xs hover:bg-gray-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
      >
        <span className={value ? 'text-gray-900 truncate' : 'text-gray-500 truncate'}>
          {value || placeholder}
        </span>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          {showFilter && (
            <div className="border-b border-gray-100 p-1">
              <input
                autoFocus
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter..."
                className="h-7 w-full rounded border border-transparent bg-gray-50 px-2 text-xs outline-none focus:border-gray-300"
              />
            </div>
          )}
          <ul className="max-h-60 overflow-y-auto py-1 text-sm">
            <li>
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setOpen(false);
                  setFilter('');
                }}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-gray-50 ${
                  value === '' ? 'font-medium text-gray-900' : 'text-gray-600'
                }`}
              >
                <span>{placeholder}</span>
                {value === '' && <Check className="h-3.5 w-3.5 text-gray-500" />}
              </button>
            </li>
            {filtered.map((o) => (
              <li key={o}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o);
                    setOpen(false);
                    setFilter('');
                  }}
                  className={`flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-gray-50 ${
                    value === o ? 'font-medium text-gray-900' : 'text-gray-700'
                  }`}
                >
                  <span className="truncate pr-2">{o}</span>
                  {value === o && <Check className="h-3.5 w-3.5 shrink-0 text-gray-500" />}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-xs text-gray-400">No matches</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function uniq(arr: (string | null | undefined)[]): string[] {
  const s = new Set<string>();
  for (const x of arr) if (x) s.add(x);
  return [...s].sort();
}

function TelemetryDot({ product, lastSeen }: { product: string | null; lastSeen: string | null }) {
  const isMachine = /machine/i.test(product || '');
  if (!isMachine) return <span className="text-xs text-gray-300">--</span>;

  if (!lastSeen) {
    return (
      <span className="inline-flex items-center gap-1.5" title="Never reported telemetry">
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300 ring-2 ring-gray-100" />
        <span className="text-xs text-gray-500">never</span>
      </span>
    );
  }

  const last = new Date(lastSeen);
  const days = Math.floor((Date.now() - last.getTime()) / (24 * 60 * 60 * 1000));
  let color = 'bg-gray-300 ring-gray-100';
  let label = `${days}d`;
  if (days <= 7) color = 'bg-emerald-500 ring-emerald-100';
  else if (days <= 30) color = 'bg-amber-500 ring-amber-100';
  else color = 'bg-red-500 ring-red-100';

  return (
    <span
      className="inline-flex items-center gap-1.5"
      title={`Last telemetry ${last.toLocaleDateString('en-AU')} (${days} days ago)`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ring-2 ${color}`} />
      <span className="text-xs text-gray-700">{label}</span>
    </span>
  );
}

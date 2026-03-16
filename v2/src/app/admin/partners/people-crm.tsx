'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UnifiedContact } from './page';
import type { ContactRole } from '@/lib/types/database';
import 'leaflet/dist/leaflet.css';

// ---------------------------------------------------------------------------
// Role config
// ---------------------------------------------------------------------------

const ROLE_CONFIG: Record<ContactRole, { label: string; color: string; bg: string }> = {
  storyteller:     { label: 'Storyteller',       color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  partner:         { label: 'Partner',           color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
  supplier:        { label: 'Supplier',          color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  staff:           { label: 'Staff',             color: 'text-green-700',  bg: 'bg-green-50 border-green-200' },
  advisory:        { label: 'Advisory',          color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200' },
  supporter:       { label: 'Supporter',         color: 'text-pink-700',   bg: 'bg-pink-50 border-pink-200' },
  inquiry:         { label: 'Inquiry',           color: 'text-gray-600',   bg: 'bg-gray-50 border-gray-200' },
  buyer:           { label: 'Buyer',             color: 'text-cyan-700',   bg: 'bg-cyan-50 border-cyan-200' },
  funder:          { label: 'Funder',            color: 'text-emerald-700',bg: 'bg-emerald-50 border-emerald-200' },
  community_leader:{ label: 'Community Leader',  color: 'text-red-700',    bg: 'bg-red-50 border-red-200' },
  philanthropy:    { label: 'Philanthropy',      color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
  procurement:     { label: 'Procurement',       color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  community_rep:   { label: 'Community Rep',     color: 'text-rose-700',   bg: 'bg-rose-50 border-rose-200' },
  government:      { label: 'Government',        color: 'text-slate-700',  bg: 'bg-slate-100 border-slate-300' },
  health:          { label: 'Health',            color: 'text-teal-700',   bg: 'bg-teal-50 border-teal-200' },
  manufacturing:   { label: 'Manufacturing',     color: 'text-stone-700',  bg: 'bg-stone-100 border-stone-300' },
};

const SOURCE_LABELS: Record<string, string> = {
  crm: 'CRM',
  empathy_ledger: 'Empathy Ledger',
  grantscope: 'Grantscope',
  compendium: 'Compendium',
};

const SOURCE_DOT: Record<string, string> = {
  crm: 'bg-violet-500',
  empathy_ledger: 'bg-orange-500',
  grantscope: 'bg-sky-500',
  compendium: 'bg-stone-400',
};

type SortKey = 'name' | 'source' | 'role';
type ViewMode = 'cards' | 'table' | 'list' | 'map';

// ---------------------------------------------------------------------------
// Known location coordinates for Australian communities/cities
// ---------------------------------------------------------------------------

const LOCATION_COORDS: Record<string, [number, number]> = {
  // NT
  'tennant creek': [-19.6502, 134.1914],
  'alice springs': [-23.6980, 133.8807],
  'darwin': [-12.4634, 130.8456],
  'katherine': [-14.4524, 132.2717],
  'ali curung': [-21.0167, 134.3667],
  'elliott': [-17.5492, 133.5467],
  'ti tree': [-22.1200, 133.4200],
  'yuendumu': [-22.2544, 131.7992],
  'lajamanu': [-18.3314, 130.6360],
  'warlpiri': [-19.5, 131.5],
  'canteen creek': [-20.6333, 135.5667],
  // QLD
  'brisbane': [-27.4705, 153.0260],
  'palm island': [-18.7333, 146.5833],
  'cairns': [-16.9186, 145.7781],
  'townsville': [-19.2590, 146.8169],
  'doomadgee': [-17.9333, 138.8333],
  // NSW
  'sydney': [-33.8688, 151.2093],
  'kempsey': [-31.0833, 152.8333],
  // ACT
  'canberra': [-35.2809, 149.1300],
  // WA
  'kalgoorlie': [-30.7490, 121.4660],
  'perth': [-31.9505, 115.8605],
  // SA
  'adelaide': [-34.9285, 138.6007],
  'npy lands': [-26.5, 131.0],
  // VIC
  'melbourne': [-37.8136, 144.9631],
  // TAS
  'hobart': [-42.8821, 147.3272],
};

function geocodeLocation(location: string | null): [number, number] | null {
  if (!location) return null;
  const lower = location.toLowerCase();

  // Direct match
  for (const [key, coords] of Object.entries(LOCATION_COORDS)) {
    if (lower.includes(key)) return coords;
  }

  // State-level fallback
  if (lower.includes(', nt') || lower.includes('northern territory')) return LOCATION_COORDS['alice springs'];
  if (lower.includes(', qld') || lower.includes('queensland')) return LOCATION_COORDS['brisbane'];
  if (lower.includes(', nsw') || lower.includes('new south wales')) return LOCATION_COORDS['sydney'];
  if (lower.includes(', wa') || lower.includes('western australia')) return LOCATION_COORDS['perth'];
  if (lower.includes(', sa') || lower.includes('south australia')) return LOCATION_COORDS['adelaide'];
  if (lower.includes(', vic') || lower.includes('victoria')) return LOCATION_COORDS['melbourne'];
  if (lower.includes(', act')) return LOCATION_COORDS['canberra'];
  if (lower.includes(', tas') || lower.includes('tasmania')) return LOCATION_COORDS['hobart'];

  return null;
}

// ---------------------------------------------------------------------------
// Icons for view toggle
// ---------------------------------------------------------------------------

function CardsIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  );
}

function TableIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18M3 6h18M3 18h18" />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function MapIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Role tag
// ---------------------------------------------------------------------------

function RoleTag({ role, compact }: { role: ContactRole; compact?: boolean }) {
  const config = ROLE_CONFIG[role];
  if (!config) return null;
  return (
    <span className={`inline-flex items-center rounded font-medium border ${config.bg} ${config.color} ${
      compact ? 'px-1.5 py-0 text-[10px]' : 'px-2 py-0.5 text-[11px]'
    }`}>
      {config.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

function Avatar({ contact, size = 'md' }: { contact: UnifiedContact; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  if (contact.avatarUrl) {
    return (
      <img
        src={contact.avatarUrl}
        alt={contact.name}
        className={`${dim} rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow-sm`}
      />
    );
  }

  return (
    <div className={`${dim} rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 text-gray-500 font-semibold ${textSize}`}>
      {contact.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Source label
// ---------------------------------------------------------------------------

function SourceDot({ source }: { source: string }) {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <span className={`w-2 h-2 rounded-full ${SOURCE_DOT[source] || 'bg-gray-300'}`} />
      <span className="text-[10px] text-gray-400">{SOURCE_LABELS[source]?.split(' ')[0] || source}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Expanded detail panel (shared across views)
// ---------------------------------------------------------------------------

function ExpandedDetail({ contact }: { contact: UnifiedContact }) {
  const c = contact;
  return (
    <div className="space-y-3 border-t border-gray-100 pt-3 mt-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
        {c.email && (
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Email</span>
            <p className="text-gray-700">{c.email}</p>
          </div>
        )}
        {c.phone && (
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Phone</span>
            <p className="text-gray-700">{c.phone}</p>
          </div>
        )}
        {c.website && (
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Website</span>
            <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm block truncate">
              {c.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
        {c.location && (
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Location</span>
            <p className="text-gray-700">{c.location}</p>
          </div>
        )}
      </div>

      {c.bio && <p className="text-sm text-gray-600 leading-relaxed">{c.bio}</p>}

      {c.quotes && c.quotes.length > 0 && (
        <div className="space-y-1.5">
          {c.quotes.map((q, i) => (
            <blockquote key={i} className="text-sm text-gray-500 italic pl-3 border-l-2 border-orange-200">
              &ldquo;{q}&rdquo;
            </blockquote>
          ))}
        </div>
      )}

      {c.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {c.tags.map((t) => (
            <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
          ))}
        </div>
      )}

      {(c.nextAction || c.contactSurface) && (
        <div className="text-sm space-y-1 bg-blue-50 rounded-md px-3 py-2">
          {c.nextAction && <p className="text-blue-700 font-medium">Next: {c.nextAction}</p>}
          {c.contactSurface && <p className="text-blue-600">Contact via: {c.contactSurface}</p>}
        </div>
      )}

      <p className="text-[10px] text-gray-400">
        {c.source === 'crm' ? 'Full CRM record' : 'Read-only — import to CRM to edit'}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contact wrapper — handles CRM link vs expand behaviour
// ---------------------------------------------------------------------------

function ContactWrapper({
  contact,
  isExpanded,
  onToggle,
  children,
  className,
}: {
  contact: UnifiedContact;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  if (contact.source === 'crm' && !isExpanded) {
    return (
      <Link href={`/admin/partners/${encodeURIComponent(contact.id)}`} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <div className={`${className} cursor-pointer`} onClick={onToggle}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CARDS VIEW
// ---------------------------------------------------------------------------

function CardsView({
  contacts,
  expandedId,
  onToggle,
}: {
  contacts: UnifiedContact[];
  expandedId: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {contacts.map((c) => {
        const isExpanded = expandedId === c.id;
        return (
          <ContactWrapper
            key={c.id}
            contact={c}
            isExpanded={isExpanded}
            onToggle={() => onToggle(c.id)}
            className={`block rounded-xl border bg-white transition-all ${
              isExpanded ? 'shadow-md border-gray-200' : 'shadow-sm border-gray-100 hover:shadow-md hover:border-gray-200'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <Avatar contact={c} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm text-gray-900 leading-tight">{c.name}</h3>
                    {c.isElder && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Elder</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {[c.jobTitle, c.organization, c.location].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <SourceDot source={c.source} />
              </div>

              <div className="flex flex-wrap gap-1 mt-2.5 ml-[52px]">
                {c.roles.map((r) => <RoleTag key={r} role={r} />)}
              </div>

              {!isExpanded && c.quotes?.[0] && (
                <p className="text-xs text-gray-400 italic mt-2 ml-[52px] line-clamp-1">
                  &ldquo;{c.quotes[0]}&rdquo;
                </p>
              )}
              {!isExpanded && !c.quotes?.[0] && c.nextAction && (
                <p className="text-xs text-blue-500 mt-2 ml-[52px]">Next: {c.nextAction}</p>
              )}

              {isExpanded && (
                <div className="ml-[52px]">
                  <ExpandedDetail contact={c} />
                </div>
              )}
            </div>
          </ContactWrapper>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LIST VIEW — compact rows, more density
// ---------------------------------------------------------------------------

function ListView({
  contacts,
  expandedId,
  onToggle,
}: {
  contacts: UnifiedContact[];
  expandedId: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-0.5">
      {contacts.map((c) => {
        const isExpanded = expandedId === c.id;
        return (
          <ContactWrapper
            key={c.id}
            contact={c}
            isExpanded={isExpanded}
            onToggle={() => onToggle(c.id)}
            className={`block rounded-lg transition-all ${
              isExpanded
                ? 'bg-white shadow-sm border border-gray-200 mb-1'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="px-3 py-2">
              <div className="flex items-center gap-3">
                <Avatar contact={c} size="sm" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm text-gray-900">{c.name}</span>
                    {c.isElder && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-1 py-0 rounded">Elder</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {[c.jobTitle, c.organization].filter(Boolean).join(' · ')}
                  </p>
                </div>

                <div className="hidden sm:flex flex-wrap gap-1 flex-shrink-0 max-w-[240px] justify-end">
                  {c.roles.slice(0, 3).map((r) => <RoleTag key={r} role={r} compact />)}
                  {c.roles.length > 3 && (
                    <span className="text-[10px] text-gray-400">+{c.roles.length - 3}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    c.relationshipStatus === 'active' ? 'bg-green-500' :
                    c.relationshipStatus === 'warm' ? 'bg-yellow-500' :
                    c.relationshipStatus === 'prospect' ? 'bg-blue-500' :
                    'bg-gray-300'
                  }`} />
                  <span className="text-[10px] text-gray-400 w-16 text-right hidden md:inline">
                    {SOURCE_LABELS[c.source]?.split(' ')[0] || c.source}
                  </span>
                  {c.source !== 'crm' && (
                    <svg className={`w-3.5 h-3.5 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  {c.source === 'crm' && (
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="ml-11 mt-1">
                  <ExpandedDetail contact={c} />
                </div>
              )}
            </div>
          </ContactWrapper>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TABLE VIEW — spreadsheet-like
// ---------------------------------------------------------------------------

function TableView({
  contacts,
  expandedId,
  onToggle,
}: {
  contacts: UnifiedContact[];
  expandedId: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Name</th>
            <th className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wider text-gray-500 font-semibold hidden md:table-cell">Organization</th>
            <th className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wider text-gray-500 font-semibold hidden lg:table-cell">Location</th>
            <th className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Roles</th>
            <th className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wider text-gray-500 font-semibold hidden sm:table-cell">Source</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => {
            const isExpanded = expandedId === c.id;
            return (
              <ContactWrapper
                key={c.id}
                contact={c}
                isExpanded={isExpanded}
                onToggle={() => onToggle(c.id)}
                className={`table-row border-b border-gray-100 transition-colors ${
                  isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
              >
                {/* Name cell */}
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar contact={c} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-gray-900 truncate">{c.name}</span>
                        {c.isElder && (
                          <span className="text-[9px] font-bold uppercase text-amber-600 bg-amber-50 px-1 rounded">Elder</span>
                        )}
                      </div>
                      {c.jobTitle && (
                        <p className="text-xs text-gray-400 truncate">{c.jobTitle}</p>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-2 ml-[42px]">
                      <ExpandedDetail contact={c} />
                    </div>
                  )}
                </td>

                {/* Org */}
                <td className="px-4 py-2.5 text-gray-600 hidden md:table-cell">
                  <span className="truncate block max-w-[180px]">{c.organization || '—'}</span>
                </td>

                {/* Location */}
                <td className="px-4 py-2.5 text-gray-500 hidden lg:table-cell">
                  <span className="truncate block max-w-[150px]">{c.location || '—'}</span>
                </td>

                {/* Roles */}
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-0.5">
                    {c.roles.slice(0, 2).map((r) => <RoleTag key={r} role={r} compact />)}
                    {c.roles.length > 2 && (
                      <span className="text-[10px] text-gray-400 self-center ml-0.5">+{c.roles.length - 2}</span>
                    )}
                  </div>
                </td>

                {/* Source */}
                <td className="px-4 py-2.5 hidden sm:table-cell">
                  <SourceDot source={c.source} />
                </td>

                {/* Arrow */}
                <td className="px-2 py-2.5">
                  {c.source === 'crm' ? (
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  ) : (
                    <svg className={`w-3.5 h-3.5 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </td>
              </ContactWrapper>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAP VIEW — Leaflet map with contact pins
// ---------------------------------------------------------------------------

function MapView({
  contacts,
  expandedId,
  onToggle,
}: {
  contacts: UnifiedContact[];
  expandedId: string | null;
  onToggle: (id: string) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [L, setL] = useState<any>(null);

  // Group contacts by geocoded location
  const locationGroups = useMemo(() => {
    const groups: Record<string, { coords: [number, number]; contacts: UnifiedContact[]; label: string }> = {};
    for (const c of contacts) {
      const coords = geocodeLocation(c.location);
      if (!coords) continue;
      const key = `${coords[0]},${coords[1]}`;
      if (!groups[key]) {
        // Extract the city/community name
        const label = c.location?.split(',')[0]?.trim() || 'Unknown';
        groups[key] = { coords, contacts: [], label };
      }
      groups[key].contacts.push(c);
    }
    return groups;
  }, [contacts]);

  const unmappedCount = contacts.filter((c) => !geocodeLocation(c.location)).length;

  // Load leaflet dynamically
  useEffect(() => {
    import('leaflet').then((mod) => {
      setL(mod.default ? mod : mod);
    });
  }, []);

  useEffect(() => {
    if (!L || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView([-23.5, 134.5], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 16,
    }).addTo(map);

    // Add markers for each location group
    Object.values(locationGroups).forEach(({ coords, contacts: groupContacts, label }) => {
      const count = groupContacts.length;
      const size = count > 10 ? 44 : count > 5 ? 38 : 32;

      const icon = L.divIcon({
        className: 'people-marker',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: #1e293b;
            border: 2.5px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: ${size > 38 ? '14px' : '12px'};
            cursor: pointer;
            font-family: system-ui, sans-serif;
          ">${count}</div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const rolesSummary: Record<string, number> = {};
      groupContacts.forEach((c) => c.roles.forEach((r) => {
        const label = ROLE_CONFIG[r]?.label || r;
        rolesSummary[label] = (rolesSummary[label] || 0) + 1;
      }));

      const rolesHtml = Object.entries(rolesSummary)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([role, n]) => `<span style="background:#f1f5f9;padding:1px 6px;border-radius:4px;font-size:10px;color:#475569;">${role} ${n}</span>`)
        .join(' ');

      const peopleHtml = groupContacts
        .slice(0, 6)
        .map((c) => {
          const initials = c.name.split(' ').map(w => w[0]).join('').slice(0, 2);
          const avatar = c.avatarUrl
            ? `<img src="${c.avatarUrl}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;" />`
            : `<div style="width:22px;height:22px;border-radius:50%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;color:#64748b;">${initials}</div>`;
          return `<div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#334155;">${avatar}${c.name}</div>`;
        })
        .join('');

      const moreHtml = groupContacts.length > 6
        ? `<p style="font-size:10px;color:#94a3b8;margin:4px 0 0;">+${groupContacts.length - 6} more</p>`
        : '';

      const popup = L.popup({ maxWidth: 280, className: 'people-popup' }).setContent(`
        <div style="font-family:system-ui,sans-serif;">
          <h3 style="margin:0 0 2px;font-size:15px;font-weight:700;">${label}</h3>
          <p style="margin:0 0 8px;font-size:11px;color:#94a3b8;">${count} contact${count !== 1 ? 's' : ''}</p>
          <div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:8px;">${rolesHtml}</div>
          <div style="display:flex;flex-direction:column;gap:4px;">${peopleHtml}</div>
          ${moreHtml}
        </div>
      `);

      L.marker(coords, { icon }).addTo(map).bindPopup(popup);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [L, locationGroups]);

  return (
    <div className="space-y-3">
      <div
        ref={mapRef}
        className="w-full h-[550px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
      />
      {unmappedCount > 0 && (
        <p className="text-xs text-gray-400 text-center">
          {unmappedCount} contact{unmappedCount !== 1 ? 's' : ''} without a mappable location
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main CRM view
// ---------------------------------------------------------------------------

export function PeopleCRM({ contacts }: { contacts: UnifiedContact[] }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<ContactRole | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of contacts) {
      for (const r of c.roles) {
        counts[r] = (counts[r] || 0) + 1;
      }
    }
    return counts;
  }, [contacts]);

  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of contacts) {
      counts[c.source] = (counts[c.source] || 0) + 1;
    }
    return counts;
  }, [contacts]);

  const filtered = useMemo(() => {
    const result = contacts.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          c.name.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.organization?.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q) ||
          c.jobTitle?.toLowerCase().includes(q) ||
          c.bio?.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.roles.some((r) => (ROLE_CONFIG[r]?.label || r).toLowerCase().includes(q));
        if (!match) return false;
      }
      if (roleFilter !== 'all' && !c.roles.includes(roleFilter)) return false;
      if (sourceFilter !== 'all' && c.source !== sourceFilter) return false;
      return true;
    });

    return [...result].sort((a, b) => {
      switch (sortKey) {
        case 'source':
          return a.source.localeCompare(b.source) || a.name.localeCompare(b.name);
        case 'role':
          return (a.roles[0] || '').localeCompare(b.roles[0] || '') || a.name.localeCompare(b.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [contacts, search, roleFilter, sourceFilter, sortKey]);

  const hasFilters = search || roleFilter !== 'all' || sourceFilter !== 'all';

  const clearFilters = () => {
    setSearch('');
    setRoleFilter('all');
    setSourceFilter('all');
  };

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const kpiRoles: ContactRole[] = [
    'storyteller', 'partner', 'advisory', 'buyer', 'funder',
    'government', 'health', 'manufacturing', 'supporter',
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">People</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {contacts.length} contacts across {Object.keys(sourceCounts).length} sources
          </p>
        </div>
        <Link href="/admin/partners/new">
          <Button size="sm">+ Add Contact</Button>
        </Link>
      </div>

      {/* Search + view toggle + sort */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Input
            placeholder="Search people, orgs, roles, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm rounded-lg"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
          {([
            { mode: 'cards' as ViewMode, Icon: CardsIcon, label: 'Cards' },
            { mode: 'list' as ViewMode, Icon: ListIcon, label: 'List' },
            { mode: 'table' as ViewMode, Icon: TableIcon, label: 'Table' },
            { mode: 'map' as ViewMode, Icon: MapIcon, label: 'Map' },
          ]).map(({ mode, Icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              title={label}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === mode
                  ? 'bg-gray-900 shadow-sm'
                  : 'hover:bg-gray-200'
              }`}
            >
              <Icon active={viewMode === mode} />
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-gray-400 mr-1">Sort</span>
          {(['name', 'source', 'role'] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className={`px-2 py-1 rounded-md capitalize transition-colors ${
                sortKey === key
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Role + source filter chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setRoleFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
            roleFilter === 'all'
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          All {contacts.length}
        </button>
        {kpiRoles
          .filter((r) => roleCounts[r])
          .map((role) => {
            const config = ROLE_CONFIG[role];
            return (
              <button
                key={role}
                onClick={() => setRoleFilter(roleFilter === role ? 'all' : role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  roleFilter === role
                    ? `${config.bg} ${config.color} shadow-sm`
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {config.label} {roleCounts[role]}
              </button>
            );
          })}

        <span className="w-px h-6 bg-gray-200 self-center mx-1" />

        {Object.entries(sourceCounts).map(([source, count]) => (
          <button
            key={source}
            onClick={() => setSourceFilter(sourceFilter === source ? 'all' : source)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
              sourceFilter === source
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${sourceFilter === source ? 'bg-white' : (SOURCE_DOT[source] || 'bg-gray-300')}`} />
            {SOURCE_LABELS[source] || source} {count}
          </button>
        ))}
      </div>

      {/* Filter summary */}
      {hasFilters && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Showing {filtered.length} of {contacts.length}</span>
          <button onClick={clearFilters} className="text-blue-500 hover:underline">Clear filters</button>
        </div>
      )}

      {/* Content area */}
      {viewMode === 'cards' && (
        <CardsView contacts={filtered} expandedId={expandedId} onToggle={handleToggle} />
      )}
      {viewMode === 'list' && (
        <ListView contacts={filtered} expandedId={expandedId} onToggle={handleToggle} />
      )}
      {viewMode === 'table' && (
        <TableView contacts={filtered} expandedId={expandedId} onToggle={handleToggle} />
      )}
      {viewMode === 'map' && (
        <MapView contacts={filtered} expandedId={expandedId} onToggle={handleToggle} />
      )}

      {filtered.length === 0 && viewMode !== 'map' && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No contacts match your filters.</p>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-blue-500 mt-2 hover:underline">
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Engagement network ("People we engage with") — the relationship CRM behind
 * /admin/people. DISTINCT from storytellers (EL community members with Goods
 * stories, at /admin/el-storytellers).
 *
 * v1 aggregates the real, typed in-repo sources into one unified Person model:
 *   - team.ts               -> staff (founders, cleared photos)
 *   - compendium.advisoryBoard -> advisors
 *   - compendium.communityPartners -> community / health / corporate / gov partners
 *   - compendium.funding    -> funders / capital lenders / government programs (deduped)
 *   - BUTTERFLY_BOARD (curated) -> Butterfly Movement governance
 *
 * Live GHL pipeline stage/warmth overlay is a documented fast-follow — see
 * wiki output 2026-07-04 people-page-research. This layer is pure + synchronous
 * so the page renders instantly and never depends on the GHL token.
 *
 * Consent: only staff carry a photo here. Everyone else falls back to an
 * initials avatar; org records use org initials. Never expose an Elder's face
 * or quote without Ben's clearance.
 */

import { team } from './data/team';
import { advisoryBoard, communityPartners, funding } from './data/compendium';

export type PersonType =
  | 'funder'
  | 'capital'
  | 'government'
  | 'partner'
  | 'health'
  | 'corporate'
  | 'advisor'
  | 'board'
  | 'staff';

export const PERSON_TYPES: { key: PersonType; label: string; blurb: string }[] = [
  { key: 'funder', label: 'Funders', blurb: 'Foundations & philanthropy' },
  { key: 'capital', label: 'Capital / Lenders', blurb: 'Repayable finance' },
  { key: 'government', label: 'Government', blurb: 'Grant programs' },
  { key: 'partner', label: 'Community partners', blurb: 'Delivery & community' },
  { key: 'health', label: 'Health partners', blurb: 'Clinical & health services' },
  { key: 'corporate', label: 'Corporate / Mfg', blurb: 'Manufacturing & logistics' },
  { key: 'advisor', label: 'Advisors', blurb: 'Advisory group' },
  { key: 'board', label: 'Board', blurb: 'Butterfly Movement governance' },
  { key: 'staff', label: 'Team', blurb: 'Goods staff' },
];

const TYPE_LABEL: Record<PersonType, string> = Object.fromEntries(
  PERSON_TYPES.map((t) => [t.key, t.label]),
) as Record<PersonType, string>;
export function personTypeLabel(t: PersonType): string {
  return TYPE_LABEL[t] ?? t;
}

export interface PersonContact {
  name: string;
  role: string | null;
  email: string | null;
}
export interface Person {
  id: string;
  name: string;
  org: string | null;
  role: string | null;
  type: PersonType;
  isOrg: boolean;
  email: string | null;
  location: string | null;
  website: string | null;
  photo: string | null;
  amount: number | null;
  status: string | null;
  notes: string | null;
  contacts: PersonContact[];
  tags: string[];
  sources: string[];
}

function slug(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function normName(s: string): string {
  // Drop honorifics/suffixes so the same person from two sources dedupes.
  return s
    .toLowerCase()
    .replace(/\b(oam|am|dr|mr|mrs|ms|prof|jupurrurla)\b\.?/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Funder source name -> which lane it sits in.
const CAPITAL_RE = /sefa|lendforgood|metro finance|white ?box|first nations finance|cefc|\bnab\b|commbank|commonwealth bank|tripple|social impact loan|impact investment/i;
const GOV_RE = /real innovation|dewr|sedi|social enterprise development|invest nt|advanced manufacturing|grantconnect|federal grant|nt government|state grant|government/i;
function classifyFunder(source: string, program?: string): PersonType {
  const hay = `${source} ${program ?? ''}`;
  if (CAPITAL_RE.test(hay)) return 'capital';
  if (GOV_RE.test(hay)) return 'government';
  return 'funder';
}

function partnerType(cat: string): PersonType {
  switch (cat) {
    case 'manufacturing':
      return 'corporate';
    case 'government':
      return 'government';
    case 'health':
      return 'health';
    default:
      return 'partner';
  }
}

// Curated Butterfly Movement governance (from 2026-07-04 people-page research +
// [[butterfly-movement-charity]]). Not in a single in-repo file yet.
const BUTTERFLY_BOARD: { name: string; org: string; role: string }[] = [
  { name: 'Kristy Bloomfield', org: 'Butterfly Movement Ltd / Oonchiumpa', role: 'Director' },
  { name: 'Audrey Deemal', org: 'Butterfly Movement Ltd', role: 'Director' },
  { name: 'Alexandra Savas', org: 'A Curious Tractor / Butterfly Movement', role: 'Director' },
];

const STATUS_RANK: Record<string, number> = { received: 4, receivable: 3, pending: 2, pipeline: 1 };

export function getEngagementPeople(): Person[] {
  const out: Person[] = [];
  const seen = new Set<string>(); // dedupe individuals across staff/board/advisor

  const addPerson = (p: Person) => {
    const key = p.isOrg ? `org:${normName(p.name)}` : `p:${normName(p.name)}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(p);
  };

  // 1. Staff (cleared photos)
  for (const m of team) {
    addPerson({
      id: `staff-${m.id}`,
      name: m.name,
      org: 'Goods on Country',
      role: m.role,
      type: 'staff',
      isOrg: false,
      email: m.email ?? null,
      location: null,
      website: m.linkedin ?? null,
      photo: m.image ?? null,
      amount: null,
      status: null,
      notes: m.bio ?? null,
      contacts: [],
      tags: [],
      sources: ['team.ts'],
    });
  }

  // 2. Board (curated)
  for (const b of BUTTERFLY_BOARD) {
    addPerson({
      id: `board-${slug(b.name)}`,
      name: b.name,
      org: b.org,
      role: b.role,
      type: 'board',
      isOrg: false,
      email: null,
      location: null,
      website: null,
      photo: null,
      amount: null,
      status: null,
      notes: null,
      contacts: [],
      tags: [],
      sources: ['people-page-research 2026-07-04'],
    });
  }

  // 3. Advisors
  for (const a of advisoryBoard) {
    addPerson({
      id: `advisor-${a.id}`,
      name: a.name,
      org: a.organisation || null,
      role: a.role,
      type: 'advisor',
      isOrg: false,
      email: a.email ?? null,
      location: null,
      website: null,
      photo: null,
      amount: null,
      status: null,
      notes: null,
      contacts: [],
      tags: [],
      sources: ['compendium.advisoryBoard'],
    });
  }

  // 4. Funders / capital / government (org records, deduped across grant rows)
  const funderGroups = new Map<string, typeof funding>();
  for (const f of funding) {
    const base = f.source.replace(/\s*\((?:round|r)\s*\d+\)/i, '').replace(/\s*\(.*?\)\s*$/, '').trim();
    const key = normName(base);
    if (!funderGroups.has(key)) funderGroups.set(key, []);
    funderGroups.get(key)!.push({ ...f, source: base });
  }
  for (const [, rows] of funderGroups) {
    const name = rows[0].source;
    const total = rows.reduce((n, r) => n + (r.amount || 0), 0);
    const best = rows.slice().sort((a, b) => (STATUS_RANK[b.status] ?? 0) - (STATUS_RANK[a.status] ?? 0))[0];
    const contactRow = rows.find((r) => r.contact);
    const noteBits = rows
      .map((r) => [r.program, r.when].filter(Boolean).join(' · '))
      .filter(Boolean);
    addPerson({
      id: `funder-${slug(name)}`,
      name,
      org: null,
      role: null,
      type: classifyFunder(name, rows.map((r) => r.program).filter(Boolean).join(' ')),
      isOrg: true,
      email: contactRow?.contactEmail ?? null,
      location: null,
      website: null,
      photo: null,
      amount: total || null,
      status: best?.status ?? null,
      notes: rows.map((r) => r.notes).filter(Boolean).join(' — ') || null,
      contacts: contactRow?.contact
        ? [{ name: contactRow.contact, role: null, email: contactRow.contactEmail ?? null }]
        : [],
      tags: noteBits.slice(0, 3),
      sources: ['compendium.funding'],
    });
  }

  // 5. Community / health / corporate / government partners (org records)
  for (const p of communityPartners) {
    addPerson({
      id: `partner-${p.id}`,
      name: p.name,
      org: null,
      role: null,
      type: partnerType(p.category),
      isOrg: true,
      email: p.contacts?.find((c) => c.email)?.email ?? null,
      location: p.location ?? null,
      website: p.website ?? null,
      photo: null,
      amount: null,
      status: null,
      notes: p.description ?? null,
      contacts: (p.contacts ?? []).map((c) => ({ name: c.name, role: c.role ?? null, email: c.email ?? null })),
      tags: p.keyFacts?.slice(0, 2) ?? [],
      sources: ['compendium.communityPartners'],
    });
  }

  // Sort: people/orgs with money first within a stable type order, then name.
  const typeOrder = PERSON_TYPES.map((t) => t.key);
  out.sort(
    (a, b) =>
      typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type) ||
      (b.amount ?? 0) - (a.amount ?? 0) ||
      a.name.localeCompare(b.name),
  );
  return out;
}

export function typeCounts(people: Person[]): Record<string, number> {
  const c: Record<string, number> = {};
  for (const p of people) c[p.type] = (c[p.type] ?? 0) + 1;
  return c;
}

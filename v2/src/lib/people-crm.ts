/**
 * crm_contacts -> Person[] adapter for /admin/people.
 *
 * The crm_contacts table (seeded 2026-07-19 from 21 in-repo sources + Gmail
 * last-contact sweep) is the person hub. This adapter replaces the runtime
 * aggregation in lib/people.ts as the primary source; the aggregation stays
 * as the fallback when the table is unreachable or empty.
 *
 * Storyteller-only rows are excluded here: storytellers live on
 * /admin/el-storytellers and the storyteller registry remains the
 * voice/consent authority.
 */

import { createServiceClient } from '@/lib/supabase/server';
import type { Person, PersonType } from './people';

interface CrmRow {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  organization: string | null;
  job_title: string | null;
  location: string | null;
  roles: string[] | null;
  status: string | null;
  relationship_status: string | null;
  last_contact_date: string | null;
  bio: string | null;
  tags: string[] | null;
  website: string | null;
  is_elder: boolean | null;
  metadata: Record<string, unknown> | null;
}

// Role priority: first hit wins the Person type lane.
const ROLE_TO_TYPE: [string, PersonType][] = [
  ['staff', 'staff'],
  ['funder', 'funder'],
  ['philanthropy', 'funder'],
  ['government', 'government'],
  ['buyer', 'buyer'],
  ['procurement', 'buyer'],
  ['health', 'health'],
  ['manufacturing', 'corporate'],
  ['supplier', 'corporate'],
  ['advisory', 'advisor'],
  ['community_leader', 'partner'],
  ['partner', 'partner'],
  ['supporter', 'partner'],
];

function typeFor(roles: string[]): PersonType {
  for (const [role, type] of ROLE_TO_TYPE) {
    if (roles.includes(role)) return type;
  }
  return 'partner';
}

// Rows that represent an organisation rather than a person (pending the ORG
// layer split; see wiki/investor/03-partners-people.md data-quality queue).
function looksLikeOrg(r: CrmRow): boolean {
  if (r.organization && r.name.trim() === r.organization.trim()) return true;
  return /foundation|council|corporation|company|centre|laundromat|homelands?$|studios|housing|fund$|whsac|picc|envirobank|forum/i.test(
    r.name,
  );
}

export async function getCrmPeople(): Promise<Person[] | null> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('crm_contacts')
      .select(
        'id, name, email, avatar_url, organization, job_title, location, roles, status, relationship_status, last_contact_date, bio, tags, website, is_elder, metadata',
      )
      .order('name');
    if (error || !data || data.length === 0) return null;

    const people: Person[] = [];
    for (const r of data as CrmRow[]) {
      const roles = r.roles ?? [];
      // Storyteller-only rows belong to /admin/el-storytellers.
      if (roles.length > 0 && roles.every((x) => x === 'storyteller')) continue;

      const stage =
        typeof r.metadata?.pipeline_stage === 'string'
          ? (r.metadata.pipeline_stage as string)
          : null;
      people.push({
        id: `crm-${r.id}`,
        name: r.name,
        org: r.organization,
        role: r.job_title,
        type: typeFor(roles),
        isOrg: looksLikeOrg(r),
        email: r.email,
        location: r.location,
        website: r.website,
        photo: r.avatar_url,
        amount: null,
        status: stage ?? r.relationship_status ?? r.status,
        notes: r.bio,
        contacts: [],
        tags: [
          ...(r.is_elder ? ['Elder'] : []),
          ...roles.filter((x) => x !== 'storyteller'),
          ...(r.last_contact_date
            ? [`last contact ${r.last_contact_date.slice(0, 10)}`]
            : []),
        ],
        sources: ['crm_contacts'],
      });
    }
    return people.length > 0 ? people : null;
  } catch {
    return null;
  }
}

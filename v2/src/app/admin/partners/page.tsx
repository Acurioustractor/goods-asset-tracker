import { getContacts } from './actions';
import { empathyLedger } from '@/lib/empathy-ledger/client';
import {
  getGrantscopeBuyers,
  getGrantscopeCapital,
} from '@/lib/grantscope/client';
import {
  advisoryBoard,
  communityPartners,
  communityVoices,
} from '@/lib/data/compendium';
import type { PartnerCategory } from '@/lib/data/compendium';
import { PeopleCRM } from './people-crm';
import type { ContactRole, RelationshipStatus } from '@/lib/types/database';

export const dynamic = 'force-dynamic';

// Unified contact shape for the CRM view
export interface UnifiedContact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  organization: string | null;
  jobTitle: string | null;
  location: string | null;
  roles: ContactRole[];
  relationshipStatus: RelationshipStatus;
  isElder: boolean;
  bio: string | null;
  tags: string[];
  source: 'crm' | 'empathy_ledger' | 'grantscope' | 'compendium';
  sourceId: string | null;
  website: string | null;
  // Extra context
  quotes?: string[];
  themes?: string[];
  transcriptCount?: number;
  nextAction?: string;
  contactSurface?: string;
}

export default async function PeoplePage() {
  // Fetch all sources in parallel
  const [crmContacts, elStorytellers, gsBuyers, gsCapital] = await Promise.all([
    getContacts().catch(() => []),
    empathyLedger.getProjectStorytellers({ limit: 100 }).catch(() => []),
    getGrantscopeBuyers().catch(() => []),
    getGrantscopeCapital().catch(() => []),
  ]);

  // Track which external IDs are already in CRM to avoid duplicates
  const linkedElIds = new Set(crmContacts.filter((c) => c.empathy_ledger_id).map((c) => c.empathy_ledger_id));
  const linkedGsIds = new Set(crmContacts.filter((c) => c.grantscope_id).map((c) => c.grantscope_id));
  const linkedCompIds = new Set(crmContacts.filter((c) => c.compendium_partner_id).map((c) => c.compendium_partner_id));

  const unified: UnifiedContact[] = [];

  // 1. CRM contacts (primary source)
  for (const c of crmContacts) {
    unified.push({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      avatarUrl: c.avatar_url,
      organization: c.organization,
      jobTitle: c.job_title,
      location: c.location,
      roles: c.roles as ContactRole[],
      relationshipStatus: c.relationship_status as RelationshipStatus,
      isElder: c.is_elder,
      bio: c.bio,
      tags: c.tags,
      source: 'crm',
      sourceId: c.id,
      website: c.website,
    });
  }

  // 2. EL storytellers not yet in CRM
  for (const st of elStorytellers) {
    if (linkedElIds.has(st.id)) continue;
    unified.push({
      id: `el-${st.id}`,
      name: st.name,
      email: null,
      phone: null,
      avatarUrl: st.avatarUrl,
      organization: null,
      jobTitle: null,
      location: st.location,
      roles: ['storyteller'],
      relationshipStatus: 'active',
      isElder: st.isElder,
      bio: st.bio,
      tags: st.themes.map((t) => t.displayName),
      source: 'empathy_ledger',
      sourceId: st.id,
      website: null,
      quotes: st.quotes.slice(0, 3).map((q) => q.text),
      themes: st.themes.map((t) => t.displayName),
      transcriptCount: st.transcriptCount,
    });
  }

  // 3. Grantscope buyer targets not yet in CRM
  for (const b of gsBuyers) {
    if (linkedGsIds.has(b.id)) continue;
    unified.push({
      id: `gs-buyer-${b.id}`,
      name: b.name,
      email: null,
      phone: null,
      avatarUrl: null,
      organization: b.name,
      jobTitle: b.role,
      location: b.state,
      roles: ['buyer'],
      relationshipStatus: b.relationshipStatus as RelationshipStatus,
      isElder: false,
      bio: b.productFit,
      tags: [`${b.remoteFootprint} remote footprint`, b.procurementPath],
      source: 'grantscope',
      sourceId: b.id,
      website: b.website,
      nextAction: b.nextAction,
      contactSurface: b.contactSurface,
    });
  }

  // 4. Grantscope capital targets
  for (const c of gsCapital) {
    if (linkedGsIds.has(c.id)) continue;
    unified.push({
      id: `gs-capital-${c.id}`,
      name: c.name,
      email: null,
      phone: null,
      avatarUrl: null,
      organization: c.name,
      jobTitle: c.instrumentType,
      location: null,
      roles: ['funder'],
      relationshipStatus: c.relationshipStatus as RelationshipStatus,
      isElder: false,
      bio: c.amountSignal,
      tags: c.thematicFocus,
      source: 'grantscope',
      sourceId: c.id,
      website: c.url,
      nextAction: c.nextAction,
      contactSurface: c.contactSurface,
    });
  }

  // Helper: map partner category to richer roles
  const categoryRoles: Record<PartnerCategory, ContactRole[]> = {
    core: ['partner', 'community_rep'],
    health: ['partner', 'health'],
    manufacturing: ['partner', 'manufacturing'],
    government: ['partner', 'government', 'procurement'],
    strategic: ['partner', 'philanthropy'],
    future: ['partner'],
  };

  // 5. Advisory board members
  for (const ab of advisoryBoard) {
    const exists = unified.some(
      (u) => u.name.toLowerCase() === ab.name.toLowerCase()
    );
    if (exists) {
      // Enrich existing entry with advisory role
      const existing = unified.find(
        (u) => u.name.toLowerCase() === ab.name.toLowerCase()
      );
      if (existing && !existing.roles.includes('advisory')) {
        existing.roles.push('advisory');
      }
      if (existing && ab.email && !existing.email) {
        existing.email = ab.email;
      }
      continue;
    }

    unified.push({
      id: `advisory-${ab.id}`,
      name: ab.name,
      email: ab.email || null,
      phone: null,
      avatarUrl: null,
      organization: ab.organisation,
      jobTitle: ab.role,
      location: null,
      roles: ['advisory'],
      relationshipStatus: 'active',
      isElder: false,
      bio: null,
      tags: ['Advisory Committee'],
      source: 'compendium',
      sourceId: ab.id,
      website: null,
    });
  }

  // 6. Compendium partners — extract individual contacts
  for (const p of communityPartners) {
    if (linkedCompIds.has(p.id)) continue;
    const roles = categoryRoles[p.category] || ['partner'];
    if (p.contacts) {
      for (const contact of p.contacts) {
        const exists = unified.some(
          (u) => u.name.toLowerCase() === contact.name.toLowerCase()
        );
        if (exists) {
          // Enrich existing with partner roles
          const existing = unified.find(
            (u) => u.name.toLowerCase() === contact.name.toLowerCase()
          );
          if (existing) {
            for (const r of roles) {
              if (!existing.roles.includes(r)) existing.roles.push(r);
            }
            if (!existing.organization) existing.organization = p.name;
          }
          continue;
        }

        unified.push({
          id: `comp-${p.id}-${contact.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: contact.name,
          email: contact.email || null,
          phone: null,
          avatarUrl: null,
          organization: p.name,
          jobTitle: contact.role || null,
          location: p.location || null,
          roles,
          relationshipStatus: 'active',
          isElder: false,
          bio: p.description,
          tags: [p.category],
          source: 'compendium',
          sourceId: p.id,
          website: p.website || null,
        });
      }
    } else {
      const exists = unified.some(
        (u) => u.name.toLowerCase() === p.name.toLowerCase()
      );
      if (exists) continue;

      unified.push({
        id: `comp-${p.id}`,
        name: p.name,
        email: null,
        phone: null,
        avatarUrl: null,
        organization: null,
        jobTitle: null,
        location: p.location || null,
        roles,
        relationshipStatus: 'active',
        isElder: false,
        bio: p.description,
        tags: [p.category],
        source: 'compendium',
        sourceId: p.id,
        website: p.website || null,
      });
    }
  }

  // 7. Compendium voices not already represented
  for (const v of communityVoices) {
    const exists = unified.some(
      (u) => u.name.toLowerCase() === v.name.toLowerCase()
    );
    if (exists) continue;

    unified.push({
      id: `voice-${v.id}`,
      name: v.name,
      email: null,
      phone: null,
      avatarUrl: null,
      organization: null,
      jobTitle: v.role || null,
      location: `${v.community}, ${v.state}`,
      roles: ['storyteller', 'community_rep'],
      relationshipStatus: 'active',
      isElder: false,
      bio: null,
      tags: [v.community],
      source: 'compendium',
      sourceId: v.id,
      website: null,
      quotes: v.quotes.slice(0, 2),
    });
  }

  // Sort: CRM first, then by name
  unified.sort((a, b) => {
    if (a.source === 'crm' && b.source !== 'crm') return -1;
    if (b.source === 'crm' && a.source !== 'crm') return 1;
    return a.name.localeCompare(b.name);
  });

  return <PeopleCRM contacts={unified} />;
}

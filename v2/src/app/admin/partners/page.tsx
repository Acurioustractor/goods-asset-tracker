import { getContacts } from './actions';
import { empathyLedger } from '@/lib/empathy-ledger/client';
import {
  getGrantscopeBuyers,
  getGrantscopeCapital,
} from '@/lib/grantscope/client';
import { ghl, type GHLContact } from '@/lib/ghl';
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
  source: 'ghl' | 'crm' | 'empathy_ledger' | 'grantscope' | 'compendium';
  sourceId: string | null;
  website: string | null;
  // Extra context
  quotes?: string[];
  themes?: string[];
  transcriptCount?: number;
  nextAction?: string;
  contactSurface?: string;
}

// Map GHL tags → CRM contact roles
function mapGHLTagsToRoles(tags: string[]): ContactRole[] {
  const roles: ContactRole[] = [];
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));

  if (tagSet.has('goods-customer') || tagSet.has('goods-sponsor')) roles.push('supporter');
  if (tagSet.has('goods-partner-lead') || tagSet.has('goods-partner') || tagSet.has('partner')) roles.push('partner');
  if (tagSet.has('goods-media')) roles.push('inquiry');
  if (tagSet.has('goods-newsletter') || tagSet.has('goods-nurture')) roles.push('supporter');
  if (tagSet.has('goods-recipient') || tagSet.has('goods-claimed-bed') || tagSet.has('goods-claimed-washer')) roles.push('community_rep');
  if (tagSet.has('goods-funder') || tagSet.has('funder')) roles.push('funder');
  if (tagSet.has('goods-advisory')) roles.push('advisory');
  if (tagSet.has('goods-community')) roles.push('community_rep');
  if (tagSet.has('storyteller') || tagSet.has('empathy ledger') || tagSet.has('empathy-ledger')) roles.push('storyteller');
  if (tagSet.has('government')) roles.push('government');
  if (tagSet.has('goods-hot') || tagSet.has('goods-warm')) roles.push('buyer');

  // Deduplicate
  const defaulted = roles.length > 0 ? roles : (['inquiry'] as ContactRole[]);
  return [...new Set(defaulted)] as ContactRole[];
}

// Map GHL contact type to relationship status
function mapGHLTypeToStatus(type: string | null): RelationshipStatus {
  switch (type) {
    case 'customer': return 'active';
    case 'lead': return 'prospect';
    default: return 'prospect';
  }
}

export default async function PeoplePage() {
  // Fetch all sources in parallel
  const [crmContacts, ghlContacts, elStorytellers, gsBuyers, gsCapital] = await Promise.all([
    getContacts().catch(() => []),
    ghl.getContacts({ goodsOnly: true }).catch(() => []),
    empathyLedger.getProjectStorytellers({ limit: 100 }).catch(() => []),
    getGrantscopeBuyers().catch(() => []),
    getGrantscopeCapital().catch(() => []),
  ]);

  // Track which external IDs are already in CRM to avoid duplicates
  const linkedElIds = new Set(crmContacts.filter((c) => c.empathy_ledger_id).map((c) => c.empathy_ledger_id));
  const linkedGsIds = new Set(crmContacts.filter((c) => c.grantscope_id).map((c) => c.grantscope_id));
  const linkedCompIds = new Set(crmContacts.filter((c) => c.compendium_partner_id).map((c) => c.compendium_partner_id));

  // Track GHL emails/phones for dedup against other sources
  const ghlEmails = new Set(ghlContacts.map((c) => c.email?.toLowerCase()).filter(Boolean));
  const ghlPhones = new Set(ghlContacts.map((c) => c.phone).filter(Boolean));

  const unified: UnifiedContact[] = [];

  // 0. GHL contacts (primary live source)
  for (const c of ghlContacts) {
    const name = c.contactName ||
      [c.firstName, c.lastName].filter(Boolean).join(' ') ||
      c.email ||
      'Unknown';

    unified.push({
      id: `ghl-${c.id}`,
      name,
      email: c.email,
      phone: c.phone,
      avatarUrl: c.profilePhoto,
      organization: c.companyName,
      jobTitle: null,
      location: [c.city, c.state].filter(Boolean).join(', ') || null,
      roles: mapGHLTagsToRoles(c.tags),
      relationshipStatus: mapGHLTypeToStatus(c.type),
      isElder: false,
      bio: null,
      tags: c.tags,
      source: 'ghl',
      sourceId: c.id,
      website: c.website,
    });
  }

  // 1. CRM contacts (skip if already in GHL by email/phone)
  for (const c of crmContacts) {
    if (c.email && ghlEmails.has(c.email.toLowerCase())) continue;
    if (c.phone && ghlPhones.has(c.phone)) continue;

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

  // Sort: GHL first, then CRM, then by name
  const sourceOrder: Record<string, number> = { ghl: 0, crm: 1, empathy_ledger: 2, grantscope: 3, compendium: 4 };
  unified.sort((a, b) => {
    const aOrder = sourceOrder[a.source] ?? 5;
    const bOrder = sourceOrder[b.source] ?? 5;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.name.localeCompare(b.name);
  });

  return <PeopleCRM contacts={unified} />;
}

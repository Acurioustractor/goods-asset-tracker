import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';
import { ghl } from '@/lib/ghl';
import { allTargets } from '@/lib/data/outreach-targets';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type MinimalCrmContact = {
  id: string;
  name: string | null;
  email: string | null;
  organization: string | null;
  grantscope_id: string | null;
};

type MinimalGhlContact = Awaited<ReturnType<typeof ghl.getContacts>>[number];

function normalizeText(value?: string | null) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function buildTargetKeys(target: (typeof allTargets)[number]) {
  return {
    orgName: normalizeText(target.name),
    contactName: normalizeText(target.contactName),
    email: String(target.contactEmail || '').trim().toLowerCase(),
  };
}

function crmMatchesTarget(contact: MinimalCrmContact, target: (typeof allTargets)[number]) {
  if (contact.grantscope_id === target.id) return 'grantscope_id';

  const keys = buildTargetKeys(target);
  const crmEmail = String(contact.email || '').trim().toLowerCase();
  const crmName = normalizeText(contact.name);
  const crmOrg = normalizeText(contact.organization);

  if (keys.email && crmEmail === keys.email) return 'email';
  if (keys.orgName && crmOrg === keys.orgName) return 'organization';
  if (keys.contactName && crmName === keys.contactName) return 'contact';
  if (keys.orgName && crmName === keys.orgName) return 'name';
  return null;
}

function ghlMatchesTarget(contact: MinimalGhlContact, target: (typeof allTargets)[number]) {
  const keys = buildTargetKeys(target);
  const ghlEmail = String(contact.email || '').trim().toLowerCase();
  const ghlName = normalizeText(contact.contactName || [contact.firstName, contact.lastName].filter(Boolean).join(' '));
  const ghlCompany = normalizeText(contact.companyName);

  if (keys.email && ghlEmail === keys.email) return 'email';
  if (keys.orgName && ghlCompany === keys.orgName) return 'organization';
  if (keys.contactName && ghlName === keys.contactName) return 'contact';
  if (keys.orgName && ghlName === keys.orgName) return 'name';
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const guard = await requireAdmin(request);
    if (guard) return guard;

    const supabase = createServiceClient();
    const [crmRes, ghlContacts] = await Promise.all([
      supabase
        .from('crm_contacts')
        .select('id, name, email, organization, grantscope_id')
        .order('updated_at', { ascending: false }),
      ghl.getContacts({ goodsOnly: true }).catch(() => []),
    ]);

    if (crmRes.error) {
      return NextResponse.json({ error: crmRes.error.message }, { status: 500 });
    }

    const crmContacts = (crmRes.data || []) as MinimalCrmContact[];

    const statuses = allTargets.map((target) => {
      const crmMatches = crmContacts
        .map((contact) => ({ contact, basis: crmMatchesTarget(contact, target) }))
        .filter((entry) => entry.basis);

      const ghlMatches = ghlContacts
        .map((contact) => ({ contact, basis: ghlMatchesTarget(contact, target) }))
        .filter((entry) => entry.basis);

      const crmLinked = crmMatches.some((entry) => entry.contact.grantscope_id === target.id);
      const state = ghlMatches.length > 0 ? 'in_ghl' : crmMatches.length > 0 ? 'crm_only' : 'unworked';

      return {
        targetId: target.id,
        state,
        crmMatched: crmMatches.length > 0,
        ghlMatched: ghlMatches.length > 0,
        grantscopeLinked: crmLinked,
        crmContactId: crmMatches[0]?.contact.id || null,
        crmContactName: crmMatches[0]?.contact.name || crmMatches[0]?.contact.organization || null,
        ghlContactId: ghlMatches[0]?.contact.id || null,
        crmMatchBasis: crmMatches[0]?.basis || null,
        ghlMatchBasis: ghlMatches[0]?.basis || null,
      };
    });

    const summary = {
      totalTargets: statuses.length,
      inGhl: statuses.filter((status) => status.state === 'in_ghl').length,
      crmOnly: statuses.filter((status) => status.state === 'crm_only').length,
      unworked: statuses.filter((status) => status.state === 'unworked').length,
      grantscopeLinked: statuses.filter((status) => status.grantscopeLinked).length,
      ghlEnabled: ghl.isEnabled(),
    };

    return NextResponse.json({
      statuses,
      summary,
    });
  } catch (error) {
    console.error('Discovery intake status error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load intake status' },
      { status: 500 },
    );
  }
}

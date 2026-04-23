import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { allTargets } from '@/lib/data/outreach-targets';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

type MinimalCrmContact = {
  id: string;
  name: string | null;
  email: string | null;
  organization: string | null;
  grantscope_id: string | null;
  metadata: Record<string, unknown> | null;
};

function normalizeText(value?: string | null) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function buildTargetKeys(target: (typeof allTargets)[number]) {
  return {
    email: String(target.contactEmail || '').trim().toLowerCase(),
    contactName: normalizeText(target.contactName),
    orgName: normalizeText(target.name),
  };
}

function getMatchBasis(contact: MinimalCrmContact, target: (typeof allTargets)[number]) {
  const keys = buildTargetKeys(target);
  const crmEmail = String(contact.email || '').trim().toLowerCase();
  const crmName = normalizeText(contact.name);
  const crmOrg = normalizeText(contact.organization);

  if (keys.email && crmEmail === keys.email) return 'email' as const;
  if (keys.contactName && crmName === keys.contactName) return 'contact' as const;
  if (keys.orgName && crmOrg === keys.orgName) return 'organization' as const;
  if (keys.orgName && crmName === keys.orgName) return 'name' as const;
  return null;
}

function displayContactLabel(contact: MinimalCrmContact) {
  return contact.name || contact.organization || contact.email || contact.id;
}

function strongestBasis(
  basisGroups: Record<'email' | 'contact' | 'organization' | 'name', Array<(typeof allTargets)[number]>>
) {
  if (basisGroups.email.length > 0) return 'email' as const;
  if (basisGroups.contact.length > 0) return 'contact' as const;
  if (basisGroups.organization.length > 0) return 'organization' as const;
  if (basisGroups.name.length > 0) return 'name' as const;
  return null;
}

export async function POST() {
  try {
    const generatedAt = new Date().toISOString();
    const userSupabase = await createClient();
    const {
      data: { user },
    } = await userSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin =
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin' ||
      process.env.ADMIN_EMAILS?.split(',').includes(user.email || '');

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('crm_contacts')
      .select('id, name, email, organization, grantscope_id, metadata')
      .is('grantscope_id', null)
      .order('updated_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const allContacts = (data || []) as MinimalCrmContact[];
    const reviewedContacts = allContacts.filter(
      (contact) => contact.metadata?.identity_backfill_reviewed === true
    );
    const contacts = allContacts.filter(
      (contact) => contact.metadata?.identity_backfill_reviewed !== true
    );
    const summary = {
      scanned: contacts.length,
      updated: 0,
      ambiguous: 0,
      unmatched: 0,
      reviewed: reviewedContacts.length,
    };
    const details: Array<{
      contactId: string;
      contactLabel: string;
      contactEmail?: string | null;
      contactOrganization?: string | null;
      targetId?: string;
      targetName?: string;
      basis?: string;
      reviewBasis?: 'email' | 'contact' | 'organization' | 'name' | null;
      reviewedAt?: string | null;
      candidateTargets?: Array<{ id: string; name: string }>;
      candidateTargetNames?: string[];
      status: 'updated' | 'ambiguous' | 'unmatched' | 'reviewed';
    }> = [];

    for (const contact of reviewedContacts) {
      details.push({
        contactId: contact.id,
        contactLabel: displayContactLabel(contact),
        contactEmail: contact.email,
        contactOrganization: contact.organization,
        reviewedAt: typeof contact.metadata?.identity_backfill_reviewed_at === 'string'
          ? contact.metadata.identity_backfill_reviewed_at
          : null,
        status: 'reviewed',
      });
    }

    for (const contact of contacts) {
      const basisGroups: Record<'email' | 'contact' | 'organization' | 'name', Array<(typeof allTargets)[number]>> = {
        email: [],
        contact: [],
        organization: [],
        name: [],
      };

      for (const target of allTargets) {
        const basis = getMatchBasis(contact, target);
        if (basis) {
          basisGroups[basis].push(target);
        }
      }

      const preferredBasis =
        (basisGroups.email.length === 1 && 'email') ||
        (basisGroups.contact.length === 1 && 'contact') ||
        null;

      if (!preferredBasis) {
        const reviewBasis = strongestBasis(basisGroups);
        const ambiguous =
          basisGroups.email.length > 1 ||
          basisGroups.contact.length > 1 ||
          basisGroups.organization.length >= 1 ||
          basisGroups.name.length >= 1;

        if (ambiguous) {
          const candidateTargets = [
            ...basisGroups.email,
            ...basisGroups.contact,
            ...basisGroups.organization,
            ...basisGroups.name,
          ].map((target) => ({ id: target.id, name: target.name }));

          summary.ambiguous++;
          details.push({
            contactId: contact.id,
            contactLabel: displayContactLabel(contact),
            contactEmail: contact.email,
            contactOrganization: contact.organization,
            reviewBasis,
            candidateTargets: Array.from(
              new Map(candidateTargets.map((target) => [target.id, target])).values()
            ).slice(0, 5),
            candidateTargetNames: Array.from(
              new Set(candidateTargets.map((target) => target.name))
            ).slice(0, 5),
            status: 'ambiguous',
          });
        } else {
          summary.unmatched++;
          details.push({
            contactId: contact.id,
            contactLabel: displayContactLabel(contact),
            contactEmail: contact.email,
            contactOrganization: contact.organization,
            reviewBasis,
            status: 'unmatched',
          });
        }
        continue;
      }

      const target = basisGroups[preferredBasis][0];
      const { error: updateError } = await supabase
        .from('crm_contacts')
        .update({
          grantscope_id: target.id,
          metadata: {
            outreach_target_id: target.id,
            outreach_category: target.category,
            outreach_priority: target.priority,
            identity_backfilled: true,
            identity_match_basis: preferredBasis,
          },
        })
        .eq('id', contact.id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      summary.updated++;
      details.push({
        contactId: contact.id,
        contactLabel: displayContactLabel(contact),
        contactEmail: contact.email,
        contactOrganization: contact.organization,
        targetId: target.id,
        targetName: target.name,
        basis: preferredBasis,
        status: 'updated',
      });
    }

    return NextResponse.json({
      success: true,
      generatedAt,
      summary,
      details,
    });
  } catch (error) {
    console.error('Backfill outreach target identities error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to backfill outreach target identities' },
      { status: 500 },
    );
  }
}

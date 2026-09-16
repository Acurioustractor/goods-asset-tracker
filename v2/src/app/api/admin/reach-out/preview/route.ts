import { NextRequest, NextResponse } from 'next/server';
import { ghl, fetchOpportunitiesForPipelines } from '@/lib/ghl';
import { findSmartList, findAudienceSegment, isSuppressed } from '@/lib/ghl/smart-lists';
import { STAGE_TO_RUNG } from '@/lib/data/loi-pipeline';
import { requireAdmin } from '@/lib/auth/admin';

export const runtime = 'nodejs';

/**
 * Preview a smart list or audience segment — returns the live size so the
 * reach-out picker can show counts + cap warnings. Admin-only (local-dev bypass).
 *
 * - `?segmentId=` → an AUDIENCE_SEGMENT (email-campaign segment). Tag segments
 *   resolve to a contact count; pipeline-stage segments resolve to a live count
 *   of open opportunities at the matching LOI rungs.
 * - `?listId=` / `?tag=` → an SMS SmartList / custom tag (legacy behaviour).
 */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  // ── Audience segment (GHL email campaign) ──────────────────────────────
  const segmentId = request.nextUrl.searchParams.get('segmentId');
  if (segmentId) {
    const segment = findAudienceSegment(segmentId);
    if (!segment) return NextResponse.json({ error: 'Unknown audience segment' }, { status: 404 });

    if (!ghl.isEnabled()) {
      return NextResponse.json({
        enabled: false,
        segmentId,
        kind: segment.source.kind,
        count: 0,
        softCap: segment.softCap,
        hardCap: segment.hardCap,
      });
    }

    if (segment.source.kind === 'tag') {
      const raw = await ghl.findContactsByTag(segment.source.tag, 250);
      // 109 contacts carry comms:do-not-contact. Nothing used to exclude them, so
      // the count in the picker was larger than the audience you may actually
      // contact. Filter here as well as in the GHL recipe, so the two agree.
      const contacts = raw.filter((c) => !isSuppressed(c.tags));
      const suppressed = raw.length - contacts.length;
      const withEmail = contacts.filter((c) => c.email && c.email.includes('@')).length;
      return NextResponse.json({
        enabled: true,
        segmentId,
        kind: 'tag',
        unit: 'contacts',
        count: contacts.length,
        suppressed,
        readiness: segment.readiness,
        blockedOn: segment.blockedOn ?? null,
        withEmail,
        softCap: segment.softCap,
        hardCap: segment.hardCap,
        sample: contacts.slice(0, 10).map((c) => ({
          name: c.contactName || [c.firstName, c.lastName].filter(Boolean).join(' ') || null,
          email: c.email,
        })),
      });
    }

    // pipeline-stage: count open opps at the matching rungs (live from GHL).
    const { ok, opportunities } = await fetchOpportunitiesForPipelines([segment.source.pipelineId]);
    const rungs = new Set(segment.source.rungs);
    const matched = opportunities.filter(
      (o) =>
        o.status !== 'lost' &&
        o.status !== 'abandoned' &&
        rungs.has(STAGE_TO_RUNG[o.stageId]),
    );
    return NextResponse.json({
      enabled: ok,
      segmentId,
      kind: 'pipeline-stage',
      unit: 'opportunities',
      count: matched.length,
      softCap: segment.softCap,
      hardCap: segment.hardCap,
      sample: matched
        .slice(0, 10)
        .map((o) => ({ name: o.name, value: o.monetaryValue, contactName: o.contactName ?? null })),
    });
  }

  const listId = request.nextUrl.searchParams.get('listId');
  const customTag = request.nextUrl.searchParams.get('tag');

  let tag: string;
  if (listId) {
    const list = findSmartList(listId);
    if (!list) return NextResponse.json({ error: 'Unknown smart list' }, { status: 404 });
    tag = list.tag;
  } else if (customTag) {
    tag = customTag;
  } else {
    return NextResponse.json({ error: 'listId or tag required' }, { status: 400 });
  }

  if (!ghl.isEnabled()) {
    return NextResponse.json({
      enabled: false,
      tag,
      count: 0,
      withPhone: 0,
      sample: [],
    });
  }

  const rawList = await ghl.findContactsByTag(tag, 250);
  const contacts = rawList.filter((c) => !isSuppressed(c.tags));
  const suppressed = rawList.length - contacts.length;
  const withPhone = contacts.filter((c) => c.phone && c.phone.length > 5).length;
  const sample = contacts.slice(0, 10).map((c) => ({
    id: c.id,
    name: c.contactName || [c.firstName, c.lastName].filter(Boolean).join(' ') || null,
    phone: c.phone ? c.phone.replace(/(\+?\d{2})\d{4}(\d{3})/, '$1****$2') : null,
    email: c.email,
  }));

  const list = listId ? findSmartList(listId) : undefined;
  return NextResponse.json({
    enabled: true,
    tag,
    count: contacts.length,
    suppressed,
    readiness: list?.readiness ?? null,
    blockedOn: list?.blockedOn ?? null,
    withPhone,
    sample,
  });
}

// Admin: PITCH COCKPIT — the one page that holds the whole pitch together.
// Deck plan (slide by slide, with the why) · storyteller model with every
// choosable quote tagged by topic and tied to its transcript · starred media ·
// the ask with supporters, prospects, advisory and the new direction · the
// drawing system · canon numbers with backup + Notion alignment.
// Everything is imported from its source of truth; nothing is re-typed here.

import fs from 'fs';
import path from 'path';
import { STORYTELLER_REGISTRY } from '@/lib/data/storyteller-registry';
import { getProvenance, provenanceLabel, releaseStateLabel, PROVENANCE_ASOF } from '@/lib/data/transcript-provenance';
import { curatedQuotes } from '@/lib/data/curated-quotes';
import { CANON } from '@/lib/data/canon';
import { fundingHistory } from '@/lib/data/grant-content';
import {
  philanthropyActive, philanthropyPipeline, impactFinance, aboriginalTrusts,
  philanthropyProspects, governmentPrograms, healthBuyers,
} from '@/lib/data/outreach-targets';
import { advisoryBoard } from '@/lib/data/compendium';
import { DECK_PLAN, ASK_REVIEW, DIRECTION, quoteTopics } from '@/lib/data/pitch-cockpit';
import { buildLocalItems } from '../media-library/curation';
import { CockpitClient, type CockpitData } from './cockpit-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** Normalise EL display names (double spaces etc.) to match registry names. */
const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

function listPng(dir: string): string[] {
  try {
    return fs.readdirSync(path.join(process.cwd(), 'public', dir)).filter((f) => /\.(png|jpg|svg)$/i.test(f)).sort();
  } catch {
    return [];
  }
}

export default async function PitchCockpitPage() {
  const { items } = await buildLocalItems();

  const curatedByNorm = new Map(Object.entries(curatedQuotes).map(([k, v]) => [norm(k), v]));

  const storytellers = STORYTELLER_REGISTRY.map((r) => {
    const prov = getProvenance(r.name);
    const curated = (curatedByNorm.get(norm(r.name)) ?? []).map((q) => ({
      text: q.text,
      context: q.context ?? '',
      topics: quoteTopics(q.text),
    }));
    return {
      slug: r.slug,
      name: r.name,
      role: r.role,
      community: r.community,
      tier: r.tier,
      practitioner: !!r.practitioner,
      narratedBy: r.narratedBy ?? null,
      turns: r.turns ?? null,
      portrait: r.portrait,
      notes: r.notes ?? null,
      quotes: r.quotes.map((q) => ({
        text: q.text,
        context: q.context,
        status: q.status,
        note: q.note ?? null,
        topics: quoteTopics(q.text),
      })),
      curated,
      provenance: provenanceLabel(prov),
      release: prov.releaseState ? releaseStateLabel(prov.releaseState) : null,
      recordingDates: prov.recordingDates ?? [],
    };
  });

  const deckSlides = listPng('deck-slides').filter((f) => /^goods-slide-\d{2}-/.test(f));
  const drawings = [
    ...listPng('images/brand/generated').map((f) => ({ file: `/images/brand/generated/${f}`, set: 'generated 2026-07-18 (locked speckle hand)' })),
    ...listPng('images/brand').filter((f) => f.startsWith('goods-ill-') || f.startsWith('goods-styleref')).map((f) => ({ file: `/images/brand/${f}`, set: 'reference set (style anchors)' })),
  ];

  const data: CockpitData = {
    deckPlan: DECK_PLAN,
    deckSlideFiles: deckSlides,
    storytellers,
    provenanceAsOf: PROVENANCE_ASOF,
    media: {
      starred: items.filter((i) => i.starred && !i.archived).map((i) => ({
        src: i.src, full: i.full, title: i.title, type: i.mediaType ?? 'image', area: i.area, rating: i.rating ?? null, canonSlot: i.canonSlot ?? null,
      })),
      videos: items.filter((i) => i.mediaType === 'video' && !i.archived).map((i) => ({
        src: i.poster ?? i.src, full: i.full, title: i.title, type: 'video' as const, area: i.area, rating: i.rating ?? null, starred: !!i.starred,
      })),
      totalLocal: items.length,
    },
    ask: ASK_REVIEW,
    direction: DIRECTION,
    supporters: {
      totalReceived: fundingHistory.totalReceived,
      received: fundingHistory.received,
      receivables: fundingHistory.receivables,
      totalReceivables: fundingHistory.totalReceivables,
    },
    prospects: [
      { group: 'Philanthropy — active', targets: philanthropyActive },
      { group: 'Philanthropy — pipeline', targets: philanthropyPipeline },
      { group: 'Impact finance (match spine)', targets: impactFinance },
      { group: 'Aboriginal trusts', targets: aboriginalTrusts },
      { group: 'Philanthropy — prospects', targets: philanthropyProspects },
      { group: 'Government programs', targets: governmentPrograms },
      { group: 'Health buyers', targets: healthBuyers },
    ].map((g) => ({
      group: g.group,
      targets: g.targets.map((t) => ({
        name: t.name, status: t.status, priority: t.priority,
        amountSignal: t.amountSignal ?? null, instrument: t.instrument ?? null,
        nextAction: t.nextAction, contactName: t.contactName ?? null,
      })),
    })),
    advisory: advisoryBoard.map((m) => ({ name: m.name, organisation: m.organisation, role: m.role })),
    canon: CANON.map((f) => ({
      id: f.id, label: f.label, value: f.value, unit: f.unit ?? null,
      domain: f.domain, claimLabel: f.claimLabel, asAt: f.asAt, source: f.source, definition: f.definition,
    })),
    gemini: {
      keyPresent: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
      model: 'gemini-3-pro-image-preview',
    },
    drawings,
  };

  return <CockpitClient data={data} />;
}

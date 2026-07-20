/**
 * Live GHL overlay for the People CRM (server-only).
 *
 * Fetches the 3 Goods pipelines read-only, matches opportunities to the
 * aggregated people by name, and attaches a live stage + warmth band. Kept out
 * of lib/people.ts so no GHL/server code reaches the client bundle.
 *
 * Resilient by design: if GHL is disabled, unreachable, times out, or matches
 * nothing, the page renders the pure in-repo list unchanged (ghlOk=false).
 */

import { getEngagementPeople, PERSON_TYPES, type Person, type PersonGhl, type Warmth } from './people';
import { getCrmPeople } from './people-crm';
import { fetchOpportunitiesForPipelines, type GoodsOpportunity } from './ghl';
import { GOODS_PIPELINES, STAGE_TO_RUNG, type LoiRung } from './data/loi-pipeline';
import { createServiceClient } from './supabase/server';

interface OverrideRow {
  person_id: string;
  photo_url: string | null;
  bio: string | null;
  featured: boolean;
  hidden: boolean;
}

// Curated display overrides from public.people_overrides (service-role only).
// Optional: any failure (missing env/table) leaves the aggregated list intact.
async function fetchOverrides(): Promise<Map<string, OverrideRow>> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('people_overrides')
      .select('person_id, photo_url, bio, featured, hidden');
    if (error || !data) return new Map();
    return new Map((data as OverrideRow[]).map((r) => [r.person_id, r]));
  } catch {
    return new Map();
  }
}

// Live GHL stageId -> human stage name (from loi-pipeline.ts stage comments).
const STAGE_NAMES: Record<string, string> = {
  // Buyer Pipeline
  'e5220eb2-be40-4e79-9571-6acae12285c7': 'Outreach Queued',
  '1fd317ec-f8f1-4837-b324-e48c22956cdd': 'First Contact',
  '8da22920-c295-4358-be58-c4c69f372890': 'In Conversation',
  'c3e5e7c5-c5cf-4541-86ef-6eaf256aac54': 'Qualified',
  '27085dfa-23bf-4e6d-90ea-483bf44ab5b6': 'Scoped',
  'e23847c3-5f74-4da6-a907-6c3d6d45008c': 'Proposed',
  'a5222f0c-380b-4866-8cef-80cbae08189c': 'Negotiating',
  '809f1a7a-0082-40fc-8e78-b51bde71a741': 'Committed',
  'dc6cf017-325a-4040-beb1-76f2cffba02c': 'In Delivery',
  '80be941e-86b6-41d1-857f-7865f66692f7': 'Delivered',
  '835065e8-c952-4cfe-9228-5e8625d100ae': 'Invoiced',
  '0100d504-3108-415c-82fd-85a66192ef1c': 'Paid',
  // Supporter Journey
  'cf8d31d2-73be-4119-b56b-7b0334254197': 'Identified',
  'a84114da-8888-4357-a2df-01b29f37209d': 'Qualified',
  '524aca71-287d-4eeb-a53a-66ff3a7aede5': 'Cultivating',
  'a23b26b4-ace3-4199-8a14-b65ed888aa52': 'Ask made',
  'c6369cf9-80f6-4680-9249-acc1c861022d': 'Committed',
  '15b7b876-16e3-4c57-84e6-7c09d703888e': 'Delivering',
  '3e38f65b-a515-4e32-9fc9-57ea1531edc6': 'Stewarding',
  'ff90ea45-2196-4a7a-a311-8f27c3c7cda6': 'Renewing',
  // Demand Register
  '0c5ed787-2015-4af0-b2ad-a916e40879db': 'Signal',
  '02502aa3-9a0d-4ddd-b1f0-c1e836838426': 'Buyer Matched',
  '13958a71-9f0e-468a-afc0-663c53d4220c': 'Converted',
};

const RUNG_RANK: Record<LoiRung, number> = { target: 1, signed: 2, contract: 3, cash: 4 };

function warmthFor(rung: LoiRung | undefined, status: string, capitalStatus?: string): Warmth {
  if (status === 'lost' || status === 'abandoned') return 'cold';
  if (status === 'won' || rung === 'cash' || rung === 'contract') return 'hot';
  if (rung === 'signed') return 'warm';
  if (capitalStatus === 'Verbal yes' || capitalStatus === 'Signed LOI') return 'warm';
  if (rung === 'target') return 'steady';
  return 'cool';
}

function norm(s: string | null | undefined): string {
  return (s ?? '')
    .toLowerCase()
    .replace(/\b(oam|am|dr|mr|mrs|ms|prof|foundation|the|ltd|pty|inc|consultancy|company|council|trust|fund)\b\.?/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function ghlFromOpp(o: GoodsOpportunity): PersonGhl {
  const rung = STAGE_TO_RUNG[o.stageId];
  const stage = STAGE_NAMES[o.stageId] || o.capitalStatus || (rung ? rung : 'In pipeline');
  return {
    stage,
    rung: rung ?? 'target',
    warmth: warmthFor(rung, o.status, o.capitalStatus),
    value: o.monetaryValue || 0,
    status: o.status,
  };
}

export interface PeopleWithGhl {
  people: Person[];
  ghlOk: boolean;
  matched: number;
}

export async function getEngagementPeopleWithGhl(): Promise<PeopleWithGhl> {
  // crm_contacts is the person hub; the static aggregation is the fallback
  // when the table is unreachable or empty. Curated overrides apply either way.
  const overrides = await fetchOverrides();
  let people = (await getCrmPeople()) ?? getEngagementPeople();
  if (overrides.size > 0) {
    people = people
      .filter((p) => !overrides.get(p.id)?.hidden)
      .map((p) => {
        const o = overrides.get(p.id);
        if (!o) return p;
        return {
          ...p,
          photo: o.photo_url ?? p.photo,
          notes: o.bio ?? p.notes,
          featured: !!o.featured,
          edited: true,
        };
      });
    // Re-sort so featured pins rise to the top of their type group.
    const ti = (t: Person['type']) => PERSON_TYPES.findIndex((x) => x.key === t);
    people.sort(
      (a, b) =>
        ti(a.type) - ti(b.type) ||
        (a.featured === b.featured ? 0 : a.featured ? -1 : 1) ||
        (b.amount ?? 0) - (a.amount ?? 0) ||
        a.name.localeCompare(b.name),
    );
  }

  let opportunities: GoodsOpportunity[] = [];
  let ghlOk = false;
  try {
    const res = await Promise.race([
      fetchOpportunitiesForPipelines(GOODS_PIPELINES.map((p) => p.id)),
      new Promise<{ ok: boolean; opportunities: GoodsOpportunity[] }>((resolve) =>
        setTimeout(() => resolve({ ok: false, opportunities: [] }), 9000),
      ),
    ]);
    ghlOk = res.ok;
    opportunities = res.opportunities;
  } catch {
    ghlOk = false;
  }

  if (!ghlOk || opportunities.length === 0) return { people, ghlOk, matched: 0 };

  // Index opps by normalised name and contact name; keep the furthest-along one
  // per key (so a funder's Committed opp wins over an old Identified duplicate).
  const byKey = new Map<string, GoodsOpportunity>();
  const better = (a: GoodsOpportunity, b: GoodsOpportunity) => {
    const ra = RUNG_RANK[STAGE_TO_RUNG[a.stageId] ?? 'target'] ?? 0;
    const rb = RUNG_RANK[STAGE_TO_RUNG[b.stageId] ?? 'target'] ?? 0;
    return ra !== rb ? (ra > rb ? a : b) : (a.monetaryValue >= b.monetaryValue ? a : b);
  };
  const put = (key: string, o: GoodsOpportunity) => {
    if (!key || key.length < 3) return;
    const cur = byKey.get(key);
    byKey.set(key, cur ? better(cur, o) : o);
  };
  for (const o of opportunities) {
    put(norm(o.name), o);
    if (o.contactName) put(norm(o.contactName), o);
  }

  const keys = [...byKey.keys()];
  const findOpp = (p: Person): GoodsOpportunity | null => {
    const cands = [p.name, p.org].map(norm).filter((c) => c.length >= 3);
    for (const c of cands) {
      const exact = byKey.get(c);
      if (exact) return exact;
    }
    // fuzzy: one normalised string fully contains the other (word-safe-ish),
    // only for reasonably specific names to avoid over-matching.
    for (const c of cands) {
      if (c.length < 5) continue;
      for (const k of keys) {
        if (k === c || k.startsWith(c + ' ') || c.startsWith(k + ' ') || k.includes(' ' + c + ' ') || c.includes(' ' + k + ' ')) {
          return byKey.get(k)!;
        }
      }
    }
    return null;
  };

  let matched = 0;
  const overlaid = people.map((p) => {
    const opp = findOpp(p);
    if (!opp) return p;
    matched++;
    return { ...p, ghl: ghlFromOpp(opp) };
  });

  return { people: overlaid, ghlOk, matched };
}

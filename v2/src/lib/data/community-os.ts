/**
 * Community OS overlay — facility interest, key people, procurement contacts.
 *
 * TEMPORARY code-side store: mirrors the columns staged in
 * scripts/migrations/2026-07-19-community-os-columns.sql. Once Ben applies that
 * migration, move these values into `communities` and read them live (this file
 * then becomes the seed script input). Notion mirror: the "Goods Community OS"
 * hub (Communities DB 8c940ea1...); GHL holds the comms/pipeline layer.
 *
 * RULES: every facilityInterest stage needs evidence in the note, with a claim
 * label. Unknown = null, shown as "not yet assessed" — never guessed. People
 * listed only where the relationship is documented (registry, register rows,
 * partner records, the 2026-05-14 washer reconciliation).
 */

export type FacilityInterest = 'interested' | 'exploring' | 'committed' | 'progressing';

export interface CommunityPerson {
  name: string;
  role: string;
  org?: string;
  /** Slug in storyteller-registry when this person is a registered voice. */
  storytellerSlug?: string;
  /** procurement = orders/buying contact for this community. */
  procurement?: boolean;
  note?: string;
}

export interface CommunityOsProfile {
  communityId: string;
  facilityInterest: FacilityInterest | null;
  /** Evidence for the stage, with claim label. */
  facilityNote?: string;
  people: CommunityPerson[];
}

export const COMMUNITY_OS: Record<string, CommunityOsProfile> = {
  'alice-springs': {
    communityId: 'alice-springs',
    facilityInterest: 'interested',
    facilityNote:
      'Observed: Mykel — "Yeah, I\'ll be rocking up every day to make them." (cleared quote, deck turn 4). Interest in making work is voiced; no facility commitment exists.',
    people: [
      { name: 'Karen Liddle', role: 'Chair', org: 'Oonchiumpa', storytellerSlug: 'karen-liddle', note: 'Cleared video: karen-liddle-on-beds.mp4' },
      { name: 'Kristy Bloomfield', role: 'Lead', org: 'Oonchiumpa', note: 'Real Innovation Fund lead; quote leads only, no transcript yet' },
      { name: 'Mykel', role: 'Storyteller, builder', storytellerSlug: 'mykel', note: 'Cleared build video: mykel-building-the-bed.mp4' },
    ],
  },
  'tennant-creek': {
    communityId: 'tennant-creek',
    facilityInterest: null,
    people: [
      { name: 'Dianne Stokes', role: 'Elder, named Pakkimjalki Kari', storytellerSlug: 'dianne-stokes', note: 'Washer GB0-WM-DSS; 5 EL transcripts' },
      { name: 'Norman Frank', role: 'Storyteller', org: 'Wilya Janta', storytellerSlug: 'norman-frank', note: 'Washer GB0-113' },
      { name: 'Jimmy Frank', role: 'Community member (nephew of Norman)', note: 'Washer GB0-132; CNC contact in the Feb ops guide' },
      { name: 'Simon Quilty', role: 'Partner', org: 'Wilya Janta', note: 'Dec 2025 bush-camp washer trip; 9 recipient names still to backfill' },
      { name: 'Julalikari Council Aboriginal Corporation', role: 'Partner org', procurement: true, note: '2 washers Jul 2026 (GB0-WM-TC-JUL); recipients to confirm' },
      { name: 'Tennant Creek youth centre', role: 'Recipient org', note: '1 Stretch Bed Jul 2026 (GB0-160-1); Ben follow-up open' },
    ],
  },
  'palm-island': {
    communityId: 'palm-island',
    facilityInterest: null,
    people: [
      { name: 'PICC', role: 'Partner org', procurement: true, note: 'Palm Island Community Company; $436,700 in the Xero ACT-GD cut' },
      { name: 'Mislam Sam', role: 'Recipient (Klub Cuta)', note: 'Washer GB0-147' },
    ],
  },
  maningrida: {
    communityId: 'maningrida',
    facilityInterest: null,
    facilityNote: 'Jul 2026 beds were made at the farm facility and delivered with Homeland School Company; no community-facility conversation recorded yet.',
    people: [
      { name: 'Homeland School Company', role: 'Partner org', procurement: true, note: 'Jul 2026 delivery: 40 beds + 2 washers (INV-0303)' },
      { name: 'BHAC laundromat', role: 'Partner org', note: '4 re-skinned machines (not Goods hardware)' },
    ],
  },
  utopia: {
    communityId: 'utopia',
    facilityInterest: null,
    people: [
      { name: 'Urapuntja Aboriginal Corporation', role: 'Partner org', procurement: true },
      { name: 'Margaret', role: 'Storyteller (video in system)', note: 'PENDING: not in code registry under this name — resolve spelling/EL record, then link details (Ben, 2026-07-19)' },
    ],
  },
  kununurra: {
    communityId: 'kununurra',
    facilityInterest: null,
    people: [
      { name: "Aunty Jean O'Reera", role: 'Recipient', note: '2 Stretch Beds Jul 2026 (GB0-158). Story content consent-held; delivery counting separate.' },
    ],
  },
  katherine: {
    communityId: 'katherine',
    facilityInterest: null,
    people: [{ name: 'Nic (delivery)', role: 'Internal', note: '1 Stretch Bed Jul 2026 (GB0-159-1); recipient details to confirm' }],
  },
  kalgoorlie: {
    communityId: 'kalgoorlie',
    facilityInterest: null,
    people: [{ name: 'Tracy McCartney', role: 'Storyteller', storytellerSlug: 'tracy-mccartney' }],
  },
  darwin: {
    communityId: 'darwin',
    facilityInterest: null,
    people: [{ name: 'Red Dust Studios', role: 'Recipient org', note: 'Washer GB0-WM-RD' }],
  },
};

export const FACILITY_LABEL: Record<FacilityInterest, string> = {
  interested: 'Interested',
  exploring: 'Exploring',
  committed: 'Committed',
  progressing: 'Progressing',
};

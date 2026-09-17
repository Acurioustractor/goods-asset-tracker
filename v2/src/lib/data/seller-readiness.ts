/**
 * SELLER READINESS.
 *
 * Every legal no-tender procurement pathway (see procurement-model.ts) tests the entity that
 * SELLS. Goods, as constituted (A Curious Tractor Pty Ltd), fails that test almost everywhere.
 * The community organisations we already work with pass it. Nobody has asked them if they want
 * the job. This is the tracker for that one question, built 17 Sep 2026.
 */

export type SellerQualification = 'yes' | 'maybe' | 'no';

export interface SellerReadiness {
  id: string;
  organisation: string;
  qualifies: SellerQualification;
  qualifiesNote: string;
  asked: boolean;
  askedNote: string;
  whatTheyNeed: string;
}

export const SELLER_READINESS: SellerReadiness[] = [
  {
    id: 'julalikari',
    organisation: 'Julalikari Council Aboriginal Corporation',
    qualifies: 'yes',
    qualifiesNote: 'Already holds NT government contracts in its own name — passes the seller test everywhere it applies.',
    asked: false,
    askedNote: 'Not asked. Already a repeat buyer of washers — the warmest relationship to start with.',
    whatTheyNeed: 'A price sheet, lead time, invoice template, delivery plan.',
  },
  {
    id: 'homeland-school-company',
    organisation: 'Homeland School Company',
    qualifies: 'yes',
    qualifiesNote: 'Same test as Julalikari; no government contracts on record yet, but the legal form qualifies.',
    asked: false,
    askedNote: 'Not asked.',
    whatTheyNeed: 'A price sheet, lead time, invoice template, delivery plan.',
  },
  {
    id: 'malala-health',
    organisation: "Mala'la Health Service Aboriginal Corporation",
    qualifies: 'maybe',
    qualifiesNote: 'Likely qualifies as a community organisation seller; not individually confirmed against any register.',
    asked: false,
    askedNote: 'Not asked.',
    whatTheyNeed: 'Confirm eligibility first, then the same kit.',
  },
  {
    id: 'goods-on-country-ltd',
    organisation: 'Goods on Country Ltd',
    qualifies: 'maybe',
    qualifiesNote: 'WA and QLD test the board composition, not ownership — 100% Indigenous directors may already satisfy both. Unresolved.',
    asked: false,
    askedNote: 'Question is with the Industry Capability Network, not yet put.',
    whatTheyNeed: 'A ruling, not a kit.',
  },
  {
    id: 'act-current-seller',
    organisation: 'A Curious Tractor Pty Ltd (current seller of record)',
    qualifies: 'no',
    qualifiesNote: 'Fails Supply Nation, the federal IPP, and the NT Aboriginal Business register — not Indigenous-owned.',
    asked: false,
    askedNote: 'N/A — this is the entity to move away from as seller, not a candidate.',
    whatTheyNeed: '',
  },
];

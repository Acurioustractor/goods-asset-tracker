/**
 * PLACE EVIDENCE — assembling the evidence-health read for one community.
 *
 * `place-decision.ts` defines the six states. This file decides which one each fact is in, and it
 * introduces no new truth: every row reads a module that already owns the fact and is already
 * guarded. Where a fact has no owner, the row says so rather than leaving the reader to assume.
 *
 * Three rules from `GRANTSCOPE.md` shape almost every line here.
 *
 * **"Missing authority stays missing. Never convert absence into zero or 'not required'."**
 * So a community with no agreement on file gets an `unavailable` row that names what is absent,
 * never a blank and never a zero.
 *
 * **"A CRM stage is internal coordination unless supported by an authority/request artifact."**
 * So a CRM deal never produces a row saying a request exists. The row is "a current authorised
 * request", and a deal on its own leaves it `unavailable` with the deal named as the reason
 * somebody might have thought otherwise. This is the one that would have gone wrong quietly.
 *
 * **"Quarantine conflicts; do not average them away."**
 * The contract records four place reads with live contradictions. They are carried here verbatim
 * so a reader of the page meets the conflict rather than a number that has resolved it. The
 * contract calls them "examples of the method, not permanent truth", so each is dated and cites
 * where it came from; when one is ruled, its entry goes.
 */

import { COMMUNITY_BED_CANON } from './community-canonical';
import { COMMUNITY_NEED, COMMUNITY_NEED_GAPS, NEED_SOURCE } from './community-need';
import { expansionTargets } from './expansion-targets';
import type { EvidenceRow } from './place-decision';

/** When the population research sweep behind `expansion-targets.ts` was run. */
const EXPANSION_SWEEP_AS_AT = '2026-03';

/** Census night. The figure is old and correct, which is why these rows are stale and not partial. */
const CENSUS_AS_AT = '2021-08-10';

/** When the contract's four place reads were written. They are dated because they will be ruled. */
const GRANTSCOPE_PLACE_READS_AS_AT = '2026-09';

/**
 * Contradictions `GRANTSCOPE.md` records against named places, carried so the page shows the
 * conflict instead of a resolved number. Remove an entry when the conflict is ruled, not before.
 */
const RECORDED_CONFLICTS: Record<string, { fact: string; note: string }[]> = {
  utopia: [
    {
      fact: 'What counts as a bed delivered to Utopia',
      note:
        'Three definitions are live: 147 canonical Stretch Beds, 107 paid Weave Beds on INV-0291, ' +
        'and 68 unlinked lifecycle rows. All three are preserved until a person rules.',
    },
  ],
  'tennant-creek': [
    {
      fact: 'Tennant Creek deployment history',
      note:
        'Paid Basket Bed and washer history is real. Voided future-bed invoices and pre-2010 ' +
        'deployment dates are quarantined and are in no total.',
    },
  ],
  'palm-island': [
    {
      fact: 'Palm Island product trade',
      note:
        'Paid travel and video work is not product trade. A voided bed invoice contradicts the ' +
        'delivery record and both are held.',
    },
  ],
};

export interface PlaceEvidenceInput {
  /** `communities.id` slug. */
  communityId: string;
  /** Rows in `community_demand` for this community. */
  demandRows: number;
  /** Rows in `crm_deals` linked to this community. */
  crmDealRows: number;
  /** Rows in the asset register matching this community. */
  registerRows: number;
}

export function placeEvidence(input: PlaceEvidenceInput): EvidenceRow[] {
  const { communityId, demandRows, crmDealRows, registerRows } = input;
  const rows: EvidenceRow[] = [];

  // ── What was delivered ────────────────────────────────────────────────────
  const canon = COMMUNITY_BED_CANON.find((c) => c.id === communityId);
  if (canon) {
    rows.push({
      fact: 'Beds delivered and recorded',
      state: 'verified',
      source: `community-canonical.ts, asserted against the live register by check:register. ${canon.ruling}`,
    });
  } else if (registerRows > 0) {
    rows.push({
      fact: 'Beds delivered and recorded',
      state: 'partial',
      source: `Asset register, ${registerRows} rows`,
      note: 'No canonical per-community count is settled for this place, so the register rows are unruled.',
    });
  } else {
    rows.push({
      fact: 'Beds delivered and recorded',
      state: 'unavailable',
      source: '—',
      note: 'Nothing in the register names this community.',
    });
  }

  // ── Measured need ─────────────────────────────────────────────────────────
  const need = COMMUNITY_NEED.find((n) => n.communityId === communityId);
  const needGap = COMMUNITY_NEED_GAPS.find((g) => g.communityId === communityId);
  if (need) {
    rows.push({
      fact: 'Overcrowding, the measure that sizes the setting',
      state: 'stale',
      source: NEED_SOURCE,
      asAt: CENSUS_AS_AT,
      note: need.caveat,
    });
  } else if (needGap) {
    rows.push({
      fact: 'Overcrowding, the measure that sizes the setting',
      state: 'unavailable',
      source: '—',
      note: needGap.reason,
    });
  } else {
    rows.push({
      fact: 'Overcrowding, the measure that sizes the setting',
      state: 'unavailable',
      source: '—',
      note: 'This community is not in the ABS ILOC extract and no honest mapping has been made.',
    });
  }

  // ── Population ────────────────────────────────────────────────────────────
  const expansion = expansionTargets.find(
    (t) => t.community.toLowerCase().includes(communityId.replace(/-/g, ' ')),
  );
  if (expansion) {
    rows.push({
      fact: 'Population and the body that runs housing procurement',
      state: 'stale',
      source: `expansion-targets.ts, community research sweep. ${expansion.housingBody}`,
      asAt: EXPANSION_SWEEP_AS_AT,
    });
  } else {
    rows.push({
      fact: 'Population and the body that runs housing procurement',
      state: 'unavailable',
      source: '—',
      note: 'Not covered by the March 2026 research sweep.',
    });
  }

  // ── What has been asked for ───────────────────────────────────────────────
  rows.push(
    demandRows > 0
      ? {
          fact: 'A recorded ask',
          state: 'partial',
          source: `community_demand, ${demandRows} ${demandRows === 1 ? 'row' : 'rows'}`,
          note: 'Recorded demand is what somebody told us they want. It is not an order.',
        }
      : {
          fact: 'A recorded ask',
          state: 'unavailable',
          source: '—',
          note: 'Nothing recorded against this community.',
        },
  );

  // ── Authority, and an authorised request ──────────────────────────────────
  // Both stay unresolved until an artifact or a human review establishes them. A CRM deal is
  // named here precisely because it is the thing most likely to be mistaken for one.
  rows.push({
    fact: 'Who holds authority here',
    state: 'unavailable',
    source: '—',
    note: 'No authority artifact is on file. Absence stays absence.',
  });

  rows.push({
    fact: 'A current authorised request',
    state: 'unavailable',
    source: '—',
    note:
      crmDealRows > 0
        ? `${crmDealRows} CRM ${crmDealRows === 1 ? 'deal is' : 'deals are'} linked here. A stage is ` +
          'internal coordination and does not establish a request.'
        : 'Nothing authorised, and no CRM record either.',
  });

  // ── Contradictions the contract records against this place ────────────────
  for (const c of RECORDED_CONFLICTS[communityId] ?? []) {
    rows.push({
      fact: c.fact,
      state: 'conflicted',
      source: 'GRANTSCOPE.md, four current place reads',
      asAt: GRANTSCOPE_PLACE_READS_AS_AT,
      note: c.note,
    });
  }

  return rows;
}

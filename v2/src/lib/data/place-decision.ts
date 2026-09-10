/**
 * PLACE DECISION READ — the three things `/admin/communities/[id]` does not yet say.
 *
 * `GRANTSCOPE.md` specifies six questions every place-level surface must answer. The admin
 * community page already answers three of them: what was requested, what actually happened, and
 * what the CRM holds. This module carries the other three, and the reason it is code rather than
 * a column in a table is that each one has a rule that a table cannot enforce.
 *
 * ---------------------------------------------------------------------------
 * 1. A CRM STAGE IS INTERNAL COORDINATION
 * ---------------------------------------------------------------------------
 * The contract: "A CRM stage is internal coordination unless supported by an authority/request
 * artifact." Today the page renders `pipeline_stage` and `amount_cents` in a table headed
 * "CRM Deals", beside documented demand and the asset register. Nothing on the page says that a
 * stage is our own note to ourselves. A reader who scans three tables and sees "Proposal sent"
 * next to 147 delivered beds has been told something nobody meant to say.
 *
 * The notice is a constant so it cannot be softened one page at a time, and the guard asserts the
 * words that carry the meaning are still in it.
 *
 * ---------------------------------------------------------------------------
 * 2. EVIDENCE HEALTH IS SIX STATES, AND NEVER A SCORE
 * ---------------------------------------------------------------------------
 * The contract names the six: verified, partial, conflicted, stale, unavailable, awaiting human
 * review. It then says, twice, that the output is "a decision read, not a readiness score,
 * pipeline stage or progress bar".
 *
 * So this module deliberately exposes no aggregate. There is no percentage, no count of greens, no
 * "4 of 6 verified". The moment those exist someone sorts by them and the sort is a ranking of
 * communities by how well we happen to have documented them, which is a fact about our filing.
 *
 * Two of the six are easy to collapse and must not be. `stale` is about freshness and says nothing
 * about truth: a 2021 Census figure is old and correct. `unavailable` means no source exists, and
 * the contract is explicit that "missing authority stays missing, never convert absence into zero".
 *
 * ---------------------------------------------------------------------------
 * 3. CONFIDENCE ATTACHES TO A CLAIM, NEVER TO A PLACE
 * ---------------------------------------------------------------------------
 * Ben asked for a confidence level against each community. A confidence against one named claim
 * ("Tennant Creek will take 100 beds in FY27") is a judgement worth recording. The same value as a
 * bare community attribute is a readiness score wearing a different hat, and it will be sorted,
 * filtered and eventually shown to somebody as a ranking of communities.
 *
 * The type makes the wrong version unbuildable: there is no confidence without a claim string, and
 * a claim carries who set it and on what basis. The guard asserts a community cannot hold two
 * confidences for the same claim, so a stale judgement is replaced rather than accumulated.
 */

/** The six states from GRANTSCOPE.md, in its own words. Freshness and truth are separate. */
export type EvidenceState =
  | 'verified'
  | 'partial'
  | 'conflicted'
  | 'stale'
  | 'unavailable'
  | 'awaiting-review';

export const EVIDENCE_STATE_MEANING: Record<EvidenceState, string> = {
  verified: 'Read from the source directly.',
  partial: 'Some of it exists. What is missing is named beside it.',
  conflicted: 'Two sources disagree. Both are preserved until a human rules.',
  stale: 'True at a date. Freshness, which says nothing about whether it is still correct.',
  unavailable: 'No source exists. Absence stays absence and never becomes zero.',
  'awaiting-review': 'A person has to look before this can be used.',
};

/** One fact on a place, with where it came from and how far it can be defended. */
export interface EvidenceRow {
  /** What the fact is, in the words a reader would use. */
  fact: string;
  state: EvidenceState;
  /** The module, table or document that owns it. */
  source: string;
  /** When the source was true, for `stale` and for anything dated. */
  asAt?: string;
  /** Required for `conflicted` and `unavailable`: what disagrees, or what is absent. */
  note?: string;
}

/**
 * The notice that must appear on any surface rendering a CRM stage beside delivery or demand.
 * Constant so it cannot be reworded softer on one page.
 */
export const CRM_COORDINATION_NOTICE =
  'These rows are internal coordination. A stage is our own note to ourselves, not a community ' +
  'decision, not consent and not an order. Nothing here becomes a request until an authority or ' +
  'request artifact exists beside it.';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * A judgement about one named claim. There is deliberately no confidence field on a community:
 * the claim is the subject, and the community is one of its attributes.
 */
export interface ClaimConfidence {
  /** Stable id for the claim, so a later judgement replaces rather than accumulates. */
  claimId: string;
  /** The claim in full, as a sentence somebody could argue with. */
  claim: string;
  communityId: string;
  confidence: ConfidenceLevel;
  /** The person who made the judgement. A judgement without a name is an opinion nobody holds. */
  setBy: string;
  setOn: string;
  /** Why. What would have to change for this to move. */
  basis: string;
}

/** A concrete human action nobody has done yet. */
export interface OpenAction {
  id: string;
  communityId: string;
  /** What has to happen, as an instruction. */
  action: string;
  /**
   * Who holds it. `null` is allowed and is rendered as unheld, because the contract asks who
   * SHOULD hold it and an empty string would read as answered.
   */
  holder: string | null;
  /** ISO date, when there is a real one. Never invented to fill the column. */
  due?: string;
  opened: string;
  /** What it is waiting on, when the holder cannot move without something else. */
  blockedBy?: string;
}

export interface PlaceDecisionRead {
  communityId: string;
  evidence: EvidenceRow[];
  confidences: ClaimConfidence[];
  openActions: OpenAction[];
}

/**
 * The read for one place. Every argument is passed in by the caller from the module that owns it,
 * so this file introduces no new truth of its own.
 */
export function placeDecisionRead(
  communityId: string,
  evidence: EvidenceRow[],
  confidences: ClaimConfidence[],
  openActions: OpenAction[],
): PlaceDecisionRead {
  return {
    communityId,
    evidence,
    confidences: confidences.filter((c) => c.communityId === communityId),
    openActions: openActions.filter((a) => a.communityId === communityId),
  };
}

/**
 * Rows whose state means a person has to do something before the fact can be used in front of a
 * funder. Deliberately a filter and not a count: it returns the rows so they can be read, and
 * offers no number to sort communities by.
 */
export function needsAPerson(evidence: EvidenceRow[]): EvidenceRow[] {
  return evidence.filter(
    (r) => r.state === 'conflicted' || r.state === 'unavailable' || r.state === 'awaiting-review',
  );
}

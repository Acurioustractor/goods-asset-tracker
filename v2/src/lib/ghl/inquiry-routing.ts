/**
 * Which board a front-door enquiry lands on.
 *
 * Before this existed, every contact-form subject produced one GHL contact with
 * a tag and nothing else. No opportunity, no card, no stage. A procurement
 * officer with a budget and someone asking about their community sat in the same
 * undifferentiated contact list, and the only way to tell them apart was to go
 * looking for a tag. Four good boards existed and the front door wrote to none
 * of them.
 *
 * The three strategic pipeline env vars made it worse rather than better: on
 * 17 September 2026 GHL_PIPELINE_STRATEGIC_BUYER, _CAPITAL and _PARTNER all held
 * the same id (GOODS - Buyers), and all three stage vars held the same stage, so
 * funders and community partners were being filed onto the commercial board.
 *
 * Ids are hardcoded here on purpose. They are stable GHL ids for one account,
 * they already live in this repo (loi-pipeline.ts, scripts/ghl-all-pipelines-audit.mjs),
 * and env indirection is what let the three vars drift to the same value without
 * anyone noticing. A wrong id here fails a test; a wrong id in Vercel fails
 * silently in production.
 */

import { GOODS_PIPELINES } from '@/lib/data/loi-pipeline';

/** The contact-form subjects that route to a board. Must match CONTACT_SUBJECTS. */
export type RoutableSubject =
  | 'Bulk Order Inquiry'
  | 'Facility Funding Inquiry'
  | 'Community Interest'
  | 'Partnership Inquiry';

export interface InquiryRoute {
  /** Live GHL pipeline id. */
  pipelineId: string;
  /** Live GHL stage id: the first stage of that board. */
  stageId: string;
  /** For logs and for the note written on the contact. */
  boardName: string;
  stageName: string;
  /** Why this door lands here. Read this before changing a mapping. */
  why: string;
}

/**
 * Subject to board. Every one lands on the FIRST stage of its board, because an
 * enquiry is the beginning of a conversation and nothing more. A human moves it.
 */
export const INQUIRY_ROUTES: Record<RoutableSubject, InquiryRoute> = {
  'Bulk Order Inquiry': {
    pipelineId: 'FjMyJM3YzWQFmKqR9fur',
    stageId: 'e5220eb2-be40-4e79-9571-6acae12285c7',
    boardName: 'GOODS - Buyers',
    stageName: 'Outreach Queued',
    why: 'Somebody with a budget asking for beds. Commercial from the first touch.',
  },
  'Facility Funding Inquiry': {
    pipelineId: 'JvBFYpVpyKsw899lkFgj',
    stageId: 'cf8d31d2-73be-4119-b56b-7b0334254197',
    boardName: 'GOODS - Funding',
    stageName: 'Identified',
    why: 'Capital behind a facility, whether a grant or something recoverable.',
  },
  'Community Interest': {
    pipelineId: '0m9teeEQFiq6I7GB5xiP',
    stageId: '8ac0d9af-d7fb-4a70-8da1-5ccabbdec32d',
    boardName: 'GOODS - Community',
    stageName: 'Invitation',
    why:
      'A place putting its hand up. Invitation is the right first stage: nothing gets made ' +
      'until that community decides it wants it, who gets paid and what comes next.',
  },
  'Partnership Inquiry': {
    pipelineId: '0m9teeEQFiq6I7GB5xiP',
    stageId: '8ac0d9af-d7fb-4a70-8da1-5ccabbdec32d',
    boardName: 'GOODS - Community',
    stageName: 'Invitation',
    why:
      'The broad subject, and the one the pitch page used to point at. It lands on the ' +
      'relationship board rather than the commercial one, so a partner is never assumed ' +
      'to be a sale. A human re-routes it if it turns out to be a buyer or a funder.',
  },
};

/** The board for a subject, or null when that subject is not routed (General, Media, LGANT). */
export function routeForSubject(subject: string): InquiryRoute | null {
  return (INQUIRY_ROUTES as Record<string, InquiryRoute | undefined>)[subject] ?? null;
}

/** Every pipeline id referenced above, for the test that checks they are real. */
export function routedPipelineIds(): string[] {
  return Array.from(new Set(Object.values(INQUIRY_ROUTES).map((r) => r.pipelineId)));
}

/** True when the id is one of the Goods boards this repo knows about. */
export function isKnownGoodsPipeline(id: string): boolean {
  return GOODS_PIPELINES.some((p) => p.id === id);
}

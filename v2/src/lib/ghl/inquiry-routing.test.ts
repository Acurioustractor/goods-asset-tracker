import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import {
  INQUIRY_ROUTES,
  routeForSubject,
  routedPipelineIds,
  isKnownGoodsPipeline,
} from './inquiry-routing';
import { GOODS_PIPELINES } from '@/lib/data/loi-pipeline';

/**
 * A wrong pipeline id does not throw. GHL accepts the call or rejects it in a
 * catch we swallow on purpose, and the card quietly never appears. So the id has
 * to be checked here, where being wrong is loud.
 *
 * The specific failure this guards against: on 17 September 2026
 * GHL_PIPELINE_STRATEGIC_BUYER, _CAPITAL and _PARTNER all held the same value,
 * so funders and community partners were filed onto the commercial board. Three
 * variables drifted to one value and nothing noticed for months.
 */

describe('every routed door points at a real Goods board', () => {
  for (const [subject, route] of Object.entries(INQUIRY_ROUTES)) {
    it(`${subject} -> ${route.boardName}`, () => {
      expect(
        isKnownGoodsPipeline(route.pipelineId),
        `${subject} points at ${route.pipelineId}, which is not a Goods board in loi-pipeline.ts`,
      ).toBe(true);

      const board = GOODS_PIPELINES.find((p) => p.id === route.pipelineId);
      expect(board?.name, `${subject}: boardName does not match the pipeline id`).toBe(
        route.boardName,
      );

      // A stage id is a uuid. A pipeline id is not. Mixing them up puts the card
      // on the board's default stage and looks like it worked.
      expect(route.stageId, `${subject}: stageId is not a uuid`).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
      expect(route.why.length, `${subject}: needs a reason, not a blank`).toBeGreaterThan(20);
    });
  }
});

describe('the doors do not all collapse onto one board', () => {
  it('routes to more than one pipeline', () => {
    expect(
      routedPipelineIds().length,
      'every door points at the same board, which is the bug this file exists to prevent',
    ).toBeGreaterThan(1);
  });

  it('the commercial door and the funding door are different boards', () => {
    expect(INQUIRY_ROUTES['Bulk Order Inquiry'].pipelineId).not.toBe(
      INQUIRY_ROUTES['Facility Funding Inquiry'].pipelineId,
    );
  });

  it('no two boards share a stage id', () => {
    const byBoard = new Map<string, string>();
    for (const route of Object.values(INQUIRY_ROUTES)) {
      const seen = byBoard.get(route.stageId);
      if (seen && seen !== route.pipelineId) {
        throw new Error(`stage ${route.stageId} is claimed by two different boards`);
      }
      byBoard.set(route.stageId, route.pipelineId);
    }
    expect(byBoard.size).toBeGreaterThan(1);
  });
});

describe('routeForSubject', () => {
  it('routes the three doors on the pitch page', () => {
    expect(routeForSubject('Bulk Order Inquiry')?.boardName).toBe('GOODS - Buyers');
    expect(routeForSubject('Facility Funding Inquiry')?.boardName).toBe('GOODS - Funding');
    expect(routeForSubject('Community Interest')?.boardName).toBe('GOODS - Community');
  });

  it('does not route the subjects that should stay off the boards', () => {
    // A general enquiry is not yet anything. A media request is a job, not a
    // relationship. LGANT is a place signal handled separately.
    expect(routeForSubject('General Inquiry')).toBeNull();
    expect(routeForSubject('Media Pack Request')).toBeNull();
    expect(routeForSubject('LGANT 2026: place put forward')).toBeNull();
  });

  it('every routed subject is one the contact route accepts', () => {
    const src = fs.readFileSync(
      path.join(__dirname, '../../app/api/contact/route.ts'),
      'utf8',
    );
    for (const subject of Object.keys(INQUIRY_ROUTES)) {
      expect(
        src.includes(`'${subject}'`),
        `${subject} is routed but is not in CONTACT_SUBJECTS, so it can never arrive`,
      ).toBe(true);
    }
  });
});

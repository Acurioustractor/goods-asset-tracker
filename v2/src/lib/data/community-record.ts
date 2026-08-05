/**
 * ONE RECORD PER COMMUNITY — the join across the five modules that each hold a piece.
 *
 * Nothing here is new truth. Every value is read from a module that already owns it and is
 * already guarded: bed counts from community-canonical.ts (asserted against the live register
 * by check:register), washers from asset-canonical.ts, stage and modules from
 * community-pathways.ts, the handover test from ownership-test.ts. This file adds exactly two
 * things, and they are the reason it exists.
 *
 * ---------------------------------------------------------------------------
 * 1. THE JOIN
 * ---------------------------------------------------------------------------
 * Answering "what is true about Utopia" meant reading five modules and knowing which id each
 * one keys on. Nothing in the system answered it in one call, so every surface assembled its
 * own subset by hand and the subsets disagreed. /communities/[slug] showed beds and no washers.
 * /pathways/[id] showed modules and no assets. Neither showed the handover test, which is the
 * one thing that says whether ownership has actually moved.
 *
 * ---------------------------------------------------------------------------
 * 2. CONSENT AS A PROPERTY OF THE FIELD, NOT OF THE URL
 * ---------------------------------------------------------------------------
 * Every field carries a ConsentState. This is the part that matters.
 *
 * Today the boundary between what a community has agreed to and what we merely think is held
 * by WHICH PAGE a value happens to be rendered on: /pathways is noindexed because it renders
 * items marked "Confirm together", and /communities is public because it does not. That is a
 * convention, not a mechanism. Nothing fails if an unconfirmed value is rendered on the public
 * page. The only thing standing between a community and a proposal about themselves they have
 * never seen is that the two pages import different modules.
 *
 * So the state travels with the value:
 *
 *   'cleared'          Canon, drift-guarded, and safe on an open page. Counts of things that
 *                      were actually delivered. A community's own asset count is theirs and it
 *                      is not a proposal.
 *   'confirm-together' We believe it; they have not confirmed it. Next decision, next phase,
 *                      module states, anything with a price. NEVER on an open surface.
 *                      audience.ts community.mustNeverSee: "A facility proposal before a yarn."
 *   'internal'         Ours to hold, not theirs to be shown as a claim about them. The handover
 *                      test result is here: it is a test WE run on OURSELVES about whether we
 *                      have let go, and SOVEREIGNTY_GATE says the community controls what is
 *                      published about the site.
 *
 * A surface then filters by consent instead of hand-picking fields, and the public/private
 * split becomes one line rather than two page templates that must be kept in step.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE DELIBERATELY DOES NOT DO
 * ---------------------------------------------------------------------------
 * No fetching. Empathy Ledger storytellers are resolved per request, are consent-filtered
 * through cleared-voices.ts at the point of use, and can fail. Putting an await in here would
 * make every caller async to read a bed count that has been frozen in canon for weeks. The
 * caller resolves storytellers and passes them to `withStorytellers`, which is the only place
 * they attach.
 *
 * No ordering of communities into a progression. There is no beds-then-washers-then-facility
 * ladder and building one here would rebuild the facility model that ruling D replaced.
 * `pathway-stages.ts` STAGE_RULE is load-bearing: communities begin anywhere and move at their
 * own pace. `modules` is a menu, and the record reports which ones they asked for.
 */

import { COMMUNITY_BED_CANON } from './community-canonical';
import { WASHERS_IN_COMMUNITY_BY_COMMUNITY } from './asset-canonical';
import { PLASTIC_KG_PER_BED } from './products';
import { COMMUNITY_PATHWAYS, MODULES } from './community-pathways';
import type { CommunityPathway, ModuleState } from './community-pathways';
import type { PublicStage } from './pathway-stages';
import { publicStageFor } from './pathway-stages';
import {
  SITE_OWNERSHIP_TESTS,
  siteTestState,
  passedCheckpoints,
  OWNERSHIP_CHECKPOINTS,
} from './ownership-test';
import type { SiteTestState, CheckpointId } from './ownership-test';

// ---------------------------------------------------------------------------
// Consent
// ---------------------------------------------------------------------------

export type ConsentState = 'cleared' | 'confirm-together' | 'internal';

/** A value plus what may be done with it. `source` names the module that owns it, so a wrong
 *  number is traced to one file rather than hunted across surfaces. */
export interface Held<T> {
  value: T;
  consent: ConsentState;
  source: string;
}

const held = <T>(value: T, consent: ConsentState, source: string): Held<T> => ({
  value,
  consent,
  source,
});

/** The only filter a surface should need. Public pages pass 'cleared'. */
export function isPublishable<T>(field: Held<T>): boolean {
  return field.consent === 'cleared';
}

// ---------------------------------------------------------------------------
// The id problem, stated rather than assumed
// ---------------------------------------------------------------------------

/**
 * Pathway ids and community ids are NOT the same namespace, and the one that differs is the
 * one that matters most: `oonchiumpa` is the pathway, `alice-springs` is where its beds are
 * counted (community-canonical: "1 Basket / 15 Stretch (Oonchiumpa)"). Joining on id alone
 * silently drops Oonchiumpa's assets, and Oonchiumpa is the site closest to a handover.
 *
 * Every other pathway shares its community id. This map holds only the exceptions, and the
 * guards assert that every pathway resolves to a real community through it.
 */
export const PATHWAY_TO_COMMUNITY: Record<string, string> = {
  oonchiumpa: 'alice-springs',
};

/**
 * /communities/[slug] runs on communityLocations ids (content.ts), and one of the four differs
 * from the canon id: the page says `utopia-homelands`, the register says `utopia`. That single
 * mismatch made communityRecord() return null for Utopia, so the page fell back to the
 * every-bed-is-HDPE arithmetic — 2,940kg — which is the precise overstatement this module
 * exists to fix, at the precise community it was fixed for. Resolved here rather than in the
 * page so every caller gets the same aliasing.
 */
export const COMMUNITY_ID_FOR_SLUG: Record<string, string> = {
  'utopia-homelands': 'utopia',
};

export function communityIdForPathway(pathwayId: string): string {
  return PATHWAY_TO_COMMUNITY[pathwayId] ?? pathwayId;
}

export function pathwayForCommunity(communityId: string): CommunityPathway | undefined {
  return COMMUNITY_PATHWAYS.find(
    (p) => communityIdForPathway(p.id) === communityId,
  );
}

// ---------------------------------------------------------------------------
// The record
// ---------------------------------------------------------------------------

export interface CommunityAssets {
  basketBeds: number;
  stretchBeds: number;
  beds: number;
  /** Curated, never row-derived. Stale `deployed` rows are a known register condition. */
  washers: number;
  /** Modelled at PLASTIC_KG_PER_BED per bed. Never presented as measured. */
  plasticKg: number;
  /** The ruling that settled the bed counts, cited verbatim by the drift judge. */
  ruling: string;
}

export interface CommunityModuleAsk {
  id: string;
  label: string;
  what: string;
  state: ModuleState;
}

export interface CommunityHandover {
  state: SiteTestState;
  passed: CheckpointId[];
  ofTotal: number;
  note: string;
}

export interface CommunityRecord {
  id: string;
  name: string;
  /** Present for every community with delivered assets; absent for a pathway-only relationship. */
  assets: Held<CommunityAssets> | null;
  /** Where they are on the six public stages. Absent when there is no pathway record. */
  stage: Held<{ id: PublicStage; label: string }> | null;
  /** The menu, with what they have asked for. Not a plan; not ordered. */
  modules: Held<CommunityModuleAsk[]> | null;
  /** What we think happens next, and what it is not. Unconfirmed by definition. */
  nextDecision: Held<string> | null;
  /** The month-6 test, which we run on ourselves. */
  handover: Held<CommunityHandover> | null;
  /** Attached by the caller. Empty until `withStorytellers` runs. */
  storytellers: Held<{ count: number }>;
}

/**
 * Assemble everything known about one community.
 *
 * Returns null only when the id matches nothing at all. A community with delivered beds and no
 * pathway record is legitimate and common (Kalgoorlie, Katherine): those fields come back null
 * rather than empty, so a surface can tell "no pathway" from "a pathway with nothing in it".
 */
export function communityRecord(
  communityId: string,
  // `asOf` is optional, and omitting it returns a null `handover` rather than a guessed one.
  // The month-6 test is the only time-dependent field here, and a public surface never shows it.
  // Making the date optional means a page that does not need it cannot accidentally become
  // non-deterministic at build time by reaching for today's date to satisfy a signature.
  opts: { asOf?: string } = {},
): CommunityRecord | null {
  communityId = COMMUNITY_ID_FOR_SLUG[communityId] ?? communityId;
  const canon = COMMUNITY_BED_CANON.find((c) => c.id === communityId);
  const pathway = pathwayForCommunity(communityId);
  if (!canon && !pathway) return null;

  const name = canon?.registerName ?? pathway?.name ?? communityId;

  let assets: Held<CommunityAssets> | null = null;
  if (canon) {
    const beds = canon.basketBeds + canon.stretchBeds;
    assets = held(
      {
        basketBeds: canon.basketBeds,
        stretchBeds: canon.stretchBeds,
        beds,
        washers: WASHERS_IN_COMMUNITY_BY_COMMUNITY[communityId] ?? 0,
        plasticKg: canon.stretchBeds * PLASTIC_KG_PER_BED,
        ruling: canon.ruling,
      },
      // Cleared: what was delivered to a community is theirs, it is guarded against the live
      // register, and it proposes nothing.
      'cleared',
      'community-canonical.ts + asset-canonical.ts',
    );
  }

  let stage: Held<{ id: PublicStage; label: string }> | null = null;
  let modules: Held<CommunityModuleAsk[]> | null = null;
  let nextDecision: Held<string> | null = null;

  if (pathway) {
    const publicStage = publicStageFor(pathway.stage);
    stage = held(
      { id: publicStage.id, label: publicStage.label },
      // Where a relationship sits is a shared fact, but it is read as a commitment, so it stays
      // behind confirmation until the community has seen it stated this way.
      'confirm-together',
      'community-pathways.ts',
    );

    modules = held(
      MODULES.map((m) => {
        const asked = pathway.modules.find((pm) => pm.id === m.id);
        return {
          id: m.id,
          label: m.label,
          what: m.what,
          state: asked?.state ?? ('not-assessed' as ModuleState),
        };
      }),
      'confirm-together',
      'pathway-stages.ts + community-pathways.ts',
    );

    nextDecision = held(pathway.nextDecision, 'confirm-together', 'community-pathways.ts');
  }

  let handover: Held<CommunityHandover> | null = null;
  const site = SITE_OWNERSHIP_TESTS.find(
    (s) => communityIdForPathway(s.pathwayId) === communityId,
  );
  if (site && opts.asOf) {
    handover = held(
      {
        state: siteTestState(site, opts.asOf),
        passed: passedCheckpoints(site),
        ofTotal: OWNERSHIP_CHECKPOINTS.length,
        note: site.note,
      },
      // Internal: SOVEREIGNTY_GATE gives the community control over what is published about the
      // site, and this is a judgement about whether WE have let go. It is not ours to publish
      // as a statement about them.
      'internal',
      'ownership-test.ts',
    );
  }

  return {
    id: communityId,
    name,
    assets,
    stage,
    modules,
    nextDecision,
    handover,
    storytellers: held({ count: 0 }, 'cleared', 'not resolved; call withStorytellers'),
  };
}

/**
 * Attach the storyteller count the caller resolved.
 *
 * Separate because Empathy Ledger is fetched per request and consent-filtered through
 * cleared-voices.ts at the point of use. The count is only ever of voices that already passed
 * that filter, which is why it lands 'cleared'. Passing an unfiltered count here would launder
 * an uncleared voice into a public number.
 */
export function withStorytellers(record: CommunityRecord, clearedCount: number): CommunityRecord {
  return {
    ...record,
    storytellers: held({ count: clearedCount }, 'cleared', 'empathy ledger via cleared-voices.ts'),
  };
}

/** Every community the system knows about, by either route. */
export function allCommunityIds(): string[] {
  const ids = new Set<string>(COMMUNITY_BED_CANON.map((c) => c.id));
  for (const p of COMMUNITY_PATHWAYS) ids.add(communityIdForPathway(p.id));
  return [...ids].sort();
}

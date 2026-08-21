/**
 * WHICH MODULE EACH PORTAL SCREEN IS.
 *
 * `partner.leadWith` in audience.ts is "which of the nine modules is theirs, and which is
 * ours". Until 2026-08-21 the four /portal surfaces never named a module at all: the portal
 * opened on "G'day, partner / Your enterprise support system. What do you need?" and the
 * sub-pages on "Where We're Heading", "Our Story" and "Walk Together". All four were standing
 * `rewrite` verdicts in route-audience.ts for the same reason.
 *
 * This file is the fix's spine. It maps each portal screen onto one of the nine modules in
 * pathway-stages.ts, so the label a partner reads is the same label the pathway, the community
 * record and the deck use. Guards in portal-modules.guards.test.ts hold the two in step.
 *
 * WHAT THIS FILE DELIBERATELY DOES NOT SAY: which modules are theirs and which are ours for
 * any particular partner. That is decided with each community (MODULE_RULE) and written into
 * their agreement; a public, community-less portal that asserted a split would be inventing
 * one. What the portal can honestly say is the menu, the fact that the split is agreed and
 * written down, and what happens at Transfer — which is `partner.mustNeverSee` #1 ("a scope
 * that leaves Transfer undefined") answered rather than dodged.
 */
import { MODULES, OPERATING_STEPS, MODULE_RULE, type ModuleId } from './pathway-stages';

export interface PortalModuleFocus {
  /** Route, exactly as it appears in route-audience.ts. */
  route: string;
  /** Which of the nine this screen is. */
  module: ModuleId;
  /** What the screen does, said in module terms rather than product terms. */
  does: string;
}

export const PORTAL_MODULE_FOCUS: PortalModuleFocus[] = [
  {
    route: '/portal/projects',
    module: 'systems',
    does: 'Run the steps, meetings and milestones for the modules your community has taken on.',
  },
  {
    route: '/portal/our-story',
    module: 'story',
    does: 'Build the community-approved evidence — photos, quotes, outcomes — that your reports are made of.',
  },
  {
    route: '/portal/goals',
    module: 'enterprise',
    does: 'Set where the enterprise is heading, including the ownership destination you are walking towards.',
  },
  {
    route: '/portal/ask-goods',
    module: 'skills',
    does: 'Ask anything about production, maintenance or the enterprise and get the answer without waiting on a visit.',
  },
];

export function moduleFocusFor(route: string): PortalModuleFocus | undefined {
  return PORTAL_MODULE_FOCUS.find((f) => f.route === route);
}

/** The module definition behind a focus, with its 1-of-9 position for display. */
export function moduleDetail(id: ModuleId) {
  const index = MODULES.findIndex((m) => m.id === id);
  return { ...MODULES[index], position: index + 1, total: MODULES.length };
}

/**
 * What happens at Transfer, taken from the operating step rather than restated, so the portal
 * and the pathway cannot drift into two different definitions of the word.
 */
export const TRANSFER_NOTE =
  OPERATING_STEPS.find((s) => s.id === 'transfer')!.note;

/** The one sentence every portal surface carries about whose module is whose. */
export const WHOSE_MODULE_RULE =
  'Which modules are yours and which are ours is decided with your community and written into your agreement, along with what happens at Transfer.';

export { MODULE_RULE };

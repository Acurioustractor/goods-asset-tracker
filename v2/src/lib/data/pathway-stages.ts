/**
 * THE SINGLE SOURCE OF TRUTH for the six stages and the nine modules.
 *
 * Locked by Ben 2026-07-25 after three competing models were found live at once:
 *   - Notion business plan:            Listen / Shape / Resource / Deliver / Transfer / Grow  (6)
 *   - /pitch/funder-pathways:          Yarn / Shape / Price / Agree / Deliver / Grow          (6)
 *   - community-pathways.ts:           listen / map / choose / approve / fund / deliver / learn (7)
 *
 * The ruling: "Yarn" is truer to the room than "Listen". "Price" reads transactional on a
 * public surface, so the money stage is "Resource". "Transfer" stays, because it is the word
 * that carries the handover, and the handover is the centre of the whole story.
 *
 * The gap this file closes: the operating model previously had NO transfer step. The thing the
 * entire pitch centres on - the plant that belongs to the people sleeping on the beds - was not
 * tracked anywhere in the system. It is now step 7.
 *
 * Any surface showing stages or modules imports from here. Do not redefine them locally.
 */

// ---------------------------------------------------------------------------
// The six public stages - what a funder or community sees
// ---------------------------------------------------------------------------

export type PublicStage = 'yarn' | 'shape' | 'resource' | 'deliver' | 'transfer' | 'grow';

export interface PublicStageDef {
  id: PublicStage;
  label: string;
  /** What happens, in one line, in the room. */
  line: string;
  /** What the community holds at the end of this stage. */
  holds: string;
}

export const PUBLIC_STAGES: PublicStageDef[] = [
  {
    id: 'yarn',
    label: 'Yarn',
    line: 'Community names what would be useful, and what is already strong.',
    holds: 'The agenda',
  },
  {
    id: 'shape',
    label: 'Shape',
    line: 'Choose together only the modules the community actually wants.',
    holds: 'The design',
  },
  {
    id: 'resource',
    label: 'Resource',
    line: 'Price every asset, service and running cost. Confirm roles, contracts and the intended owner.',
    holds: 'The terms',
  },
  {
    id: 'deliver',
    label: 'Deliver',
    line: 'Install, train, make locally, and solve the problems that show up.',
    holds: 'The making',
  },
  {
    id: 'transfer',
    label: 'Transfer',
    line: 'Customers, contracts, revenue, knowledge and decisions move to the agreed owner.',
    holds: 'The enterprise',
  },
  {
    id: 'grow',
    label: 'Grow',
    line: 'Community-approved evidence and surplus strengthen what comes next.',
    holds: 'The story and the surplus',
  },
];

/** Communities can begin anywhere, move at their own pace, and choose how much support they want. */
export const STAGE_RULE =
  'Communities can begin anywhere, move at their own pace, and choose how much support they want.';

// ---------------------------------------------------------------------------
// The nine modules - the capability menu a community selects from
// ---------------------------------------------------------------------------

export type ModuleId =
  | 'products'
  | 'equipment'
  | 'place'
  | 'skills'
  | 'people'
  | 'systems'
  | 'enterprise'
  | 'money'
  | 'story';

export interface ModuleDef {
  id: ModuleId;
  label: string;
  what: string;
}

/**
 * Nine, not eight. The Notion plan said "nine modules" over an eight-row table for four days.
 * Money is the ninth: the repayable loan and the site capital are things a community selects,
 * and naming it makes the third money lane visible inside the board instead of hidden behind it.
 */
export const MODULES: ModuleDef[] = [
  { id: 'products', label: 'Products', what: 'Beds and other proven Goods products' },
  { id: 'equipment', label: 'Equipment', what: 'Shredders, presses, tools and machinery' },
  { id: 'place', label: 'Place', what: 'Workshop, shed or complete production facility' },
  { id: 'skills', label: 'Skills', what: 'Installation, production, maintenance and enterprise training' },
  { id: 'people', label: 'People', what: 'Local operators, mentors and specialist support' },
  { id: 'systems', label: 'Systems', what: 'Suppliers, quality control, logistics and administration' },
  { id: 'enterprise', label: 'Enterprise', what: 'Customers, contracts, revenue, governance and ownership' },
  {
    id: 'money',
    label: 'Money',
    what: 'Repayable loans that bridge orders, working capital, and the site capital that finishes the transfer',
  },
  { id: 'story', label: 'Story + evidence', what: 'Community-approved media, outcomes and learning' },
];

export const MODULE_RULE =
  'Every pathway begins with what is already strong. The modules, pace, partners and ownership destination are decided with each community.';

// ---------------------------------------------------------------------------
// The operating steps - how a pathway is actually tracked day to day
// ---------------------------------------------------------------------------

export type PathwayStage =
  | 'listen'
  | 'map'
  | 'choose'
  | 'approve'
  | 'fund'
  | 'deliver'
  | 'transfer'
  | 'learn';

export interface OperatingStepDef {
  id: PathwayStage;
  label: string;
  note: string;
  /** Which of the six public stages this step rolls up to. */
  publicStage: PublicStage;
}

export const OPERATING_STEPS: OperatingStepDef[] = [
  {
    id: 'listen',
    label: 'Listen',
    note: 'Community invitation, priorities and authority',
    publicStage: 'yarn',
  },
  {
    id: 'map',
    label: 'Map what exists',
    note: 'People, assets, skills, facilities and constraints',
    publicStage: 'yarn',
  },
  {
    id: 'choose',
    label: 'Choose modules',
    note: 'Community selects the support it wants',
    publicStage: 'shape',
  },
  {
    id: 'approve',
    label: 'Community approval',
    note: 'Ownership, roles, media and decision rights',
    publicStage: 'shape',
  },
  {
    id: 'fund',
    label: 'Price and fund',
    note: 'Transparent scope, budget and funding request',
    publicStage: 'resource',
  },
  {
    id: 'deliver',
    label: 'Deliver',
    note: 'Training, equipment, activity and local support',
    publicStage: 'deliver',
  },
  {
    id: 'transfer',
    label: 'Move capability and control',
    note: 'Customers, contracts, revenue, knowledge and decisions move toward the agreed owner',
    publicStage: 'transfer',
  },
  {
    id: 'learn',
    label: 'Review and adapt',
    note: 'Community review, evidence and next choice',
    publicStage: 'grow',
  },
];

/** Back-compat alias: four pages import PATHWAY_STAGES as the operating step list. */
export const PATHWAY_STAGES = OPERATING_STEPS;

export function publicStageFor(step: PathwayStage): PublicStageDef {
  const match = OPERATING_STEPS.find((s) => s.id === step);
  const target = match ? match.publicStage : 'yarn';
  return PUBLIC_STAGES.find((s) => s.id === target) ?? PUBLIC_STAGES[0];
}

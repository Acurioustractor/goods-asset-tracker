// Made with community: who asked for Goods, who shaped it, who backed it, who
// built it, and who leads what comes next. The closing surprise on /pitch.
//
// WHO DID WHAT IS A CLAIM ABOUT A PERSON. Every row below was drafted on
// 2026-09-15 from the person's own registry role and notes, then left for Ben to
// confirm. Until CONTRIBUTIONS_CONFIRMED is true the section renders only in
// development: a production build shows nothing. That is deliberate. A draft
// reading of what somebody did must never reach a funder as fact.
//
// Voices come only from storyteller-registry.ts at tier 'external', with their
// approved or primary quote, verbatim. Portraits only where the registry holds
// one. Nobody not on the cleared list can appear, and a young person with no
// words of their own is never given a quote.

import { MEASURES } from '@/lib/data/pitch-chapters';
import { STORYTELLER_REGISTRY, type StorytellerRecord } from '@/lib/data/storyteller-registry';

/** Flip only after Ben has read every row below and said they are right. */
export const CONTRIBUTIONS_CONFIRMED = false;

export type Stage = 'yarn' | 'shape' | 'resource' | 'deliver' | 'transfer' | 'grow';
export type Contribution = 'asked' | 'designed' | 'backed' | 'built' | 'used' | 'leading';

export const STAGES: readonly { id: Stage; label: string; line: string }[] = [
  { id: 'yarn', label: 'Yarn', line: 'Community names the need' },
  { id: 'shape', label: 'Shape', line: 'Community holds the design' },
  { id: 'resource', label: 'Resource', line: 'Relationships and support' },
  { id: 'deliver', label: 'Deliver', line: 'Built, delivered, used' },
  { id: 'transfer', label: 'Transfer', line: 'Hands change' },
  { id: 'grow', label: 'Grow', line: 'Where it goes next' },
];

export const CONTRIBUTION_COLOUR: Record<Contribution, string> = {
  asked: '#b5553a', designed: '#8a5a1f', backed: '#5f7a5a', built: '#2f6e7a', used: '#7a7363', leading: '#6b3a8b',
};

interface Row { stage: Stage; did: Contribution; basis: string }

/** Draft 2026-09-15. `basis` is the registry fact the reading rests on. Anyone not listed is read as "used". */
export const CONTRIBUTIONS: Record<string, Row> = {
  'Norman Frank': { stage: 'yarn', did: 'asked', basis: 'Called requesting 3 beds in maroon after his daughter tried one' },
  'Tehmineh Mason': { stage: 'yarn', did: 'asked', basis: 'Homeland School Company reached out: beds for young people, a washer in the school' },
  'Dianne Stokes': { stage: 'shape', did: 'designed', basis: 'Designed and named both products; came back asking for 20' },
  'Kristy Bloomfield': { stage: 'resource', did: 'backed', basis: 'Oonchiumpa co-founder, Traditional Owner' },
  'Karen Liddle': { stage: 'resource', did: 'backed', basis: 'Oonchiumpa co-founder' },
  'Tanya Turner': { stage: 'resource', did: 'backed', basis: 'Oonchiumpa Consultancy leadership' },
  'Katrina Bloomfield': { stage: 'resource', did: 'backed', basis: 'Oonchiumpa family' },
  'Shayne Bloomfield': { stage: 'resource', did: 'backed', basis: 'Oonchiumpa family; firsthand Maningrida delivery account' },
  'Fred Campbell': { stage: 'resource', did: 'backed', basis: 'Youth Case Worker, Oonchiumpa' },
  'Dr Boe Remenyi': { stage: 'resource', did: 'backed', basis: 'Paediatric Cardiologist' },
  'Cliff Plummer': { stage: 'resource', did: 'backed', basis: 'Health Practitioner' },
  'Wayne Glenn': { stage: 'resource', did: 'backed', basis: 'Practitioner, Red Dust' },
  Chloe: { stage: 'resource', did: 'backed', basis: 'Support Worker, Kalgoorlie' },
  'Tracy McCartney': { stage: 'resource', did: 'backed', basis: 'Support Worker, Kalgoorlie' },
  Gary: { stage: 'resource', did: 'backed', basis: "Men's group leader" },
  'Eric Pascoe': { stage: 'deliver', did: 'built', basis: 'Learned the build at Maningrida with the young people' },
  Mykel: { stage: 'deliver', did: 'built', basis: 'Young maker' },
  Xavier: { stage: 'deliver', did: 'built', basis: 'Young maker' },
  'Jahvan Oui': { stage: 'transfer', did: 'leading', basis: 'Future manufacturing lead, Palm Island; wants to run his own factory' },
};

/** Which of the pitch's own measures a person's cleared words speak to. A reading of the words, shown as such. */
const MEASURE_CUES: Record<string, RegExp> = {
  health: /\b(bed|beds|sleep\w*|comfort\w*|comfy|mattress|floor|ground|blanket|wash\w*)\b/i,
  work: /\b(make|making|made|build\w*|built|work\w*|job|skills?|pack)\b/i,
  recycling: /\b(plastic|recycl\w*|shred\w*|waste)\b/i,
  enterprise: /\b(decid\w*|own\w*|control|business|factory|sell\w*)\b/i,
};

export interface CommunityVoice {
  name: string;
  role: string;
  community: string;
  stage: Stage;
  did: Contribution;
  basis: string;
  portrait: string | null;
  quote: { text: string; context: string } | null;
  measures: string[];
  young: boolean;
}

function toVoice(r: StorytellerRecord): CommunityVoice {
  const quotes = r.quotes.filter((q) => q.status === 'primary' || q.status === 'approved');
  const quote = quotes.find((q) => q.status === 'primary') ?? quotes[0] ?? null;
  const row = CONTRIBUTIONS[r.name] ?? { stage: 'deliver' as const, did: 'used' as const, basis: 'Received or used the goods; tells us what works' };
  const words = quotes.map((q) => q.text).join(' ');
  const young = /young|youth/i.test(r.role) || /young person/i.test(r.notes ?? '');
  return {
    name: r.name,
    role: r.role,
    community: r.community,
    ...row,
    portrait: r.portrait,
    // A young person narrated by someone else is never given words of their own.
    quote: r.narratedBy ? null : quote ? { text: quote.text, context: quote.context } : null,
    measures: MEASURES.filter((m) => MEASURE_CUES[m.id]?.test(words)).map((m) => m.id),
    young,
  };
}

export function communityVoices(): CommunityVoice[] {
  return STORYTELLER_REGISTRY.filter((r) => r.tier === 'external').map(toVoice);
}

export function measuresForVisual() {
  return MEASURES.map((m) => ({ id: m.id, area: m.area, title: m.title }));
}

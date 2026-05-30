// Story atoms — the repeatable, canonical content blocks that any
// field-notes story can drop in by reference. Edit once, every story
// (Utopia, Tennant Creek, Palm Island, future trips) updates together.
//
// Voice + tone rules (wiki/articles/brand-comms/01-voice-and-tone.md):
//   - No em dashes anywhere.
//   - Sentence case for headings.
//   - Verified numbers only. Source noted.
//   - Lead with impact, not charity.
//
// All copy below has been written to obey those rules.

import { STRETCH_BED } from './products';

// ─── Atom 1: Goods bed facts (aliased from products.ts) ─────────────────
// Used by `kind: 'goods-facts'` blocks. Re-using the canonical product
// data means specs only ever live in one place.

export const goodsBedStats: { value: string; label: string }[] = [
  { value: STRETCH_BED.specs.weight, label: 'flat-packs, one person can carry it' },
  { value: STRETCH_BED.specs.loadCapacity, label: 'load capacity, rated' },
  { value: STRETCH_BED.specs.assemblyTime.replace(/^~?/, '~'), label: 'to assemble, no tools' },
  { value: STRETCH_BED.specs.plasticDiverted.split(' ')[0], label: 'of plastic kept out of landfill, per bed' },
  { value: '400+', label: 'beds in homes since 2023' },
];

export const goodsBedStatsLead = 'One bed, in numbers';

// ─── Atom 2: Health framings (pick one per story) ──────────────────────
// Different framings for different storytelling angles. Each is verifiable
// to a public source. Set `focus` in the block to pick the framing that
// fits the scene.

export interface HealthFraming {
  focus: string;
  heading: string;
  paragraphs: string[];
  pull?: { quote: string; src: string };
}

export const healthFramings: Record<string, HealthFraming> = {
  'rhd-prevention': {
    focus: 'rhd-prevention',
    heading: 'Why a bed is health hardware',
    paragraphs: [
      'A bed is not a comfort upgrade. Sleeping on cold ground is tied to chest infections and to skin conditions like scabies, which can lead to Rheumatic Heart Disease. Getting families up off the floor, onto a surface that can be washed, is one of the simplest pieces of health hardware there is.',
      'People asked, unprompted, whether they could wash it. That is the feature that matters most, and the answer is yes.',
    ],
    pull: {
      quote: '"Something as simple as a good bed makes a huge difference. It improves their health, helps with mobility, and gives them dignity."',
      src: 'Chloe · Support worker, Kalgoorlie · cleared voice',
    },
  },
  'sleep-and-skin': {
    focus: 'sleep-and-skin',
    heading: 'Off the ground means warmer, drier, cleaner',
    paragraphs: [
      'In remote communities, beds are scarce and what does arrive often does not last. Mattresses end up on floors, soaked, infested, or thrown out within months. The result is whole families sleeping on the ground.',
      'Sleeping off the ground means warmer at night, drier in the wet, and a sleeping surface that can be hosed, scrubbed, and put back into service.',
    ],
  },
  'washing-machine-cycle': {
    focus: 'washing-machine-cycle',
    heading: 'The dumping cycle, broken',
    paragraphs: [
      'One Alice Springs provider sells roughly $3 million a year of washing machines into remote communities. Most end up in landfill within months, not built for the conditions.',
      'A washable bed and a tougher machine, designed alongside the people using them, breaks that cycle at the design stage instead of at the dump.',
    ],
  },
};

// ─── Atom 3: Problem statement (universal Goods framing) ───────────────
// One paragraph that anchors every story. Sets the scale of the problem
// without victimising. Editorially neutral so the rest of the story can be
// place-specific without re-establishing context.

export const problemStatement = {
  heading: 'The problem we work on',
  paragraphs: [
    'Across remote Indigenous Australia, families sleep on the floor because beds are scarce, expensive, or do not survive the conditions. Imported furniture is shipped 3,000 km, lasts months, ends up in a dump.',
    'Goods on Country builds beds and washing machines that are washable, repairable, made from waste plastic the community already has, and can be assembled in five minutes by one person. The design happens in community with Elders and On-Country teams. The production plant is built to move into community ownership.',
  ],
};

// ─── Atom 9: Production plant facts ────────────────────────────────────
// Recurring across every funder report + every field-notes story. Edit
// here when the plant status changes; every story picks up the new copy
// on next page load.

export const productionPlantFacts = {
  heading: 'The production plant',
  paragraphs: [
    'Containerised, modular, designed to move. Plastic shredder, pellet and sheet press, computer-controlled router. Full deployment capacity: 30 beds per week. Each bed uses 20 kg of locally-collected waste plastic that fits in a 25 L tub.',
    'The plant is roughly 85% complete. Final assembly and community siting decisions are in progress. The same infrastructure produces washing machine components and is expected to expand to fridges in the next year.',
  ],
  highlights: [
    { value: '30 beds/wk', label: 'capacity at full deployment' },
    { value: '20 kg', label: 'plastic per bed, locally sourced' },
    { value: '~85%', label: 'complete; siting and final assembly in progress' },
    { value: 'multi-product', label: 'beds, washing machines, fridges to come' },
  ],
};

// ─── Atom 4: Live map (data shape only; the renderer does the query) ───
// The `live-map` block kind passes an optional scope down to the map
// renderer. When scope.community is set, the map zooms to that community
// and the legend is filtered. The actual counts come from
// communityLocations in content.ts, which is updated by /admin/assets
// data + manual updates. Phase 2 will switch this to a live Supabase
// query at request time.

export interface LiveMapScope {
  community?: string;
}

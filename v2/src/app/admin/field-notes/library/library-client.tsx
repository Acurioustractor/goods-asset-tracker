'use client';

import { useState } from 'react';

type BlockCategory = 'atom' | 'bespoke' | 'structural';

interface BlockSpec {
  kind: string;
  category: BlockCategory;
  label: string;
  description: string;
  whenToUse: string;
  contentSource: string;
  snippet: string;
}

const SPECS: BlockSpec[] = [
  // ─── Atom blocks ─────────────────────────────────────────────────
  {
    kind: 'problem-statement',
    category: 'atom',
    label: 'Problem statement',
    description: 'Universal Goods framing: remote NT, waste, housing, no cold supply chain.',
    whenToUse: 'After the masthead. Sets context once so the rest of the story can be place-specific.',
    contentSource: 'story-atoms.ts → problemStatement',
    snippet: `{ kind: 'problem-statement' },`,
  },
  {
    kind: 'goods-facts',
    category: 'atom',
    label: 'Goods bed facts',
    description: 'Stretch Bed specs: 26kg, 200kg capacity, 5min assembly, 20kg HDPE, etc.',
    whenToUse: 'After a scene that demonstrates one of the specs. Lead overridable per story.',
    contentSource: 'products.ts → STRETCH_BED.specs (aliased)',
    snippet: `{
  kind: 'goods-facts',
  // lead: 'Custom lead text (optional, defaults to "One bed, in numbers")',
  links: [
    { label: 'See the Stretch Bed', href: '/shop/stretch-bed-single' },
  ],
},`,
  },
  {
    kind: 'health-facts',
    category: 'atom',
    label: 'Health framing',
    description: 'Why a bed is health hardware. Three named angles: rhd-prevention, sleep-and-skin, washing-machine-cycle.',
    whenToUse: 'After a scene where health came up (someone slept on the floor, asked about washing, mentioned scabies/RHD).',
    contentSource: 'story-atoms.ts → healthFramings[focus]',
    snippet: `{ kind: 'health-facts', focus: 'rhd-prevention' },
// alternatives:
//   focus: 'sleep-and-skin'         // off the ground = warmer, drier, cleaner
//   focus: 'washing-machine-cycle'  // the $3M/yr dumping cycle in Alice`,
  },
  {
    kind: 'production-plant-facts',
    category: 'atom',
    label: 'Production plant facts',
    description: 'The containerised plant: capacity, components, status, community-ownership pathway.',
    whenToUse: 'When the story brushes against scale, manufacturing, or community ownership of the means of production.',
    contentSource: 'story-atoms.ts → productionPlantFacts',
    snippet: `{ kind: 'production-plant-facts' },`,
  },
  {
    kind: 'live-map',
    category: 'atom',
    label: 'Live map',
    description: 'All Goods bed deployments on the map. Optional community scope filters to one place.',
    whenToUse: 'Near the end of the story, after the personal beats. Anchors the trip in the wider deployment pattern.',
    contentSource: 'communityLocations (manually-curated; phase 2 = live Supabase query)',
    snippet: `{
  kind: 'live-map',
  // scope: { community: 'Utopia Homelands' },  // optional — filters to one
  caveat: 'Optional caveat text under the map.',
  links: [
    { label: 'Browse all communities', href: '/communities' },
  ],
},`,
  },
  // ─── Bespoke blocks ──────────────────────────────────────────────
  {
    kind: 'masthead',
    category: 'bespoke',
    label: 'Masthead (cover)',
    description: 'Full-bleed opening: kicker + title + standfirst + dateline + hero image.',
    whenToUse: 'Always the first block. The anchor image and the one sentence that sets the emotional centre.',
    contentSource: 'Hand-written per trip',
    snippet: `{
  kind: 'masthead',
  kicker: 'Field notes',
  title: 'The young people built the beds. One of them wanted to keep building.',
  standfirst: 'It started in Alice Springs, with young people making beds out of recycled plastic, and ended on the homelands at Utopia.',
  dateline: 'Alice Springs and Utopia Homelands, NT · 21–22 May 2026',
  media: { image: '/images/stories/utopia/01-hero.jpg' },
},`,
  },
  {
    kind: 'immersive',
    category: 'bespoke',
    label: 'Immersive scene',
    description: 'Full-bleed background image (or looping video) + actmark + title + standfirst.',
    whenToUse: 'Chapter breaks. Marks a shift in time, place, or perspective.',
    contentSource: 'Hand-written per trip',
    snippet: `{
  kind: 'immersive',
  actmark: 'Act two · the road',
  title: 'From town to the homelands',
  standfirst: 'We loaded the beds and drove out to Utopia, onto Anmatyerr and Alyawarr Country.',
  media: {
    image: '/images/stories/utopia/01-hero.jpg',
    // videoDesktop: '/video/utopia/road-desktop.mp4',  // optional loop
    // videoMobile: '/video/utopia/road-mobile.mp4',
  },
},`,
  },
  {
    kind: 'read',
    category: 'bespoke',
    label: 'Read (prose)',
    description: 'Standard text block: optional tag + heading + paragraphs + optional pullquotes.',
    whenToUse: 'The narrative beats between scenes. Where the real writing lives.',
    contentSource: 'Hand-written per trip',
    snippet: `{
  kind: 'read',
  tag: 'Optional eyebrow',
  heading: 'Optional subhead',
  paragraphs: [
    'First paragraph. Verbatim quotes in body OK, attribute inline.',
    'Second paragraph.',
  ],
  pulls: [
    { quote: '"Verbatim quote."', src: 'Name · Role, Community · cleared voice' },
  ],
},`,
  },
  {
    kind: 'bleedquote',
    category: 'bespoke',
    label: 'Bleed quote',
    description: 'Full-bleed image with one big quote overlaid. Use sparingly: max 1-2 per story.',
    whenToUse: 'The single quote that changes how the reader thinks about the work.',
    contentSource: 'Hand-written per trip',
    snippet: `{
  kind: 'bleedquote',
  text: 'Waste into rest. A morning into a trade.',
  media: { image: '/images/stories/utopia/05-waste.jpg' },
},`,
  },
  {
    kind: 'stats',
    category: 'bespoke',
    label: 'Stats grid (one-off)',
    description: 'Hand-authored numbers grid. Prefer goods-facts atom for bed specs; use this for trip-specific counts.',
    whenToUse: 'When the story has trip-specific numbers worth highlighting (e.g. "8 beds at outstation A").',
    contentSource: 'Hand-written per trip',
    snippet: `{
  kind: 'stats',
  lead: 'This trip, in numbers',
  items: [
    { value: '87', label: 'beds transferred to community' },
    { value: '1.7t', label: 'recycled plastic placed in homes' },
  ],
},`,
  },
  {
    kind: 'voices',
    category: 'bespoke',
    label: 'Voices grid',
    description: 'Chorus of quote cards. consent: pending hides from public route until cleared.',
    whenToUse: 'After the main narrative. The chorus that backs up the lead voices.',
    contentSource: 'Hand-written per trip; consent state per card',
    snippet: `{
  kind: 'voices',
  heading: 'What people told us',
  sub: 'Trip quotes are held as consent pending until confirmed.',
  cards: [
    {
      quote: '"This one\\'s better, I reckon."',
      who: 'Johnny',
      community: 'Utopia Homelands',
      consent: 'pending',
    },
    // Once cleared, also set storytellerSlug to auto-link to /storytellers/[slug]
    {
      quote: '"It is more better than laying around on the floors."',
      who: 'Ivy',
      community: 'Palm Island',
      consent: 'cleared',
      storytellerSlug: 'ivy-johnson',
    },
  ],
},`,
  },
  {
    kind: 'videos',
    category: 'bespoke',
    label: 'Videos grid (internal-only)',
    description: 'On-camera testimonials. Always internal-only until consent captured.',
    whenToUse: 'When you have 1-3 short edited videos from the trip. Always pending consent.',
    contentSource: 'Hand-written per trip; files in /public/video/<slug>/',
    snippet: `{
  kind: 'videos',
  heading: 'Hear it from them',
  sub: 'Consent pending. Internal preview only.',
  items: [
    {
      title: 'Mykel · Alice Springs',
      caption: 'On building the bed he slept in that night.',
      poster: '/images/stories/utopia/02-arrive.jpg',
      src: '/video/utopia/alice-youth-desktop.mp4',
    },
  ],
},`,
  },
  {
    kind: 'pathways',
    category: 'bespoke',
    label: 'Pathways (CTAs)',
    description: 'Three closing CTAs for three audiences (supporters, funders, partners).',
    whenToUse: 'Near the end. The "what to do" beat after the story.',
    contentSource: 'Hand-written per trip — adjust framing per audience',
    snippet: `{
  kind: 'pathways',
  heading: 'Three ways to be part of it',
  sub: 'One piece of work, three ways in.',
  cards: [
    { who: 'Supporters', title: 'Put a bed in a home', body: 'Fund a Stretch Bed and follow where it goes.' },
    { who: 'Funders',    title: 'Move the making to Country', body: 'Back the plant + community-ownership transfer.' },
    { who: 'Partners',   title: 'Build it with your community', body: 'Bring the making to your homelands.' },
  ],
  link: { label: 'Read the wider story', href: 'https://www.goodsoncountry.com' },
},`,
  },
  {
    kind: 'close',
    category: 'bespoke',
    label: 'Close (final image)',
    description: 'Full-bleed centred title over a hero image. The mic-drop.',
    whenToUse: 'After the last narrative beat, before pathways.',
    contentSource: 'Hand-written per trip',
    snippet: `{
  kind: 'close',
  title: 'This is the first thing he built. It is not the last we will build together.',
  media: { image: '/images/stories/utopia/11-close.jpg' },
},`,
  },
  // ─── Structural blocks ──────────────────────────────────────────
  {
    kind: 'portal',
    category: 'structural',
    label: 'Portal ("this is Goods")',
    description: 'Self-aware footer: links to OTHER field notes (auto-excludes this one) + 5-6 site anchors.',
    whenToUse: 'Always the last block. Turns the story into an entry to the whole project.',
    contentSource: 'Anchors hand-written per story; other field-notes auto-pulled',
    snippet: `{
  kind: 'portal',
  heading: 'This story is one piece of the project',
  sub: 'A few ways in. Each is a different way to learn the work or take part.',
  anchors: [
    { label: 'Where the beds have gone (map)', href: '/communities' },
    { label: 'How we got here (origin story)', href: '/story' },
    { label: 'The model and impact', href: '/impact' },
    { label: 'The Stretch Bed', href: '/shop/stretch-bed-single' },
    { label: 'Talk to us', href: '/contact' },
  ],
},`,
  },
];

const CATEGORY_LABELS: Record<BlockCategory, string> = {
  atom: 'Atom blocks (universal, edit-once)',
  bespoke: 'Bespoke blocks (hand-written per trip)',
  structural: 'Structural blocks (self-aware)',
};

const CATEGORY_COLOURS: Record<BlockCategory, string> = {
  atom: 'border-emerald-300 bg-emerald-50/30',
  bespoke: 'border-blue-300 bg-blue-50/30',
  structural: 'border-amber-300 bg-amber-50/30',
};

export function LibraryClient() {
  const [filter, setFilter] = useState<BlockCategory | 'all'>('all');
  const [copiedKind, setCopiedKind] = useState<string | null>(null);

  const filtered = filter === 'all' ? SPECS : SPECS.filter((s) => s.category === filter);

  async function copySnippet(spec: BlockSpec) {
    try {
      await navigator.clipboard.writeText(spec.snippet);
      setCopiedKind(spec.kind);
      setTimeout(() => setCopiedKind(null), 1500);
    } catch {
      alert('Copy failed — select the snippet text manually.');
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex flex-wrap gap-2 text-xs">
        {(['all', 'atom', 'bespoke', 'structural'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={`rounded-full border px-3 py-1.5 font-medium transition ${
              filter === t
                ? 'border-stone-900 bg-stone-900 text-white'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
            }`}
          >
            {t === 'all' ? `All (${SPECS.length})` : `${CATEGORY_LABELS[t]} (${SPECS.filter((s) => s.category === t).length})`}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid gap-4">
        {filtered.map((spec) => (
          <div key={spec.kind} className={`rounded-xl border-2 ${CATEGORY_COLOURS[spec.category]} p-5`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold">
                  {spec.label}
                  <code className="ml-2 text-xs font-mono font-normal text-amber-700">kind: &apos;{spec.kind}&apos;</code>
                </h2>
                <p className="mt-1 text-sm text-stone-700">{spec.description}</p>
              </div>
              <button
                type="button"
                onClick={() => copySnippet(spec)}
                className="shrink-0 rounded-md bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-700"
              >
                {copiedKind === spec.kind ? '✓ Copied!' : 'Copy snippet'}
              </button>
            </div>

            <dl className="mt-3 grid gap-1 text-xs sm:grid-cols-2">
              <div>
                <dt className="font-medium text-stone-500">When to use</dt>
                <dd className="text-stone-700">{spec.whenToUse}</dd>
              </div>
              <div>
                <dt className="font-medium text-stone-500">Content source</dt>
                <dd className="text-stone-700">{spec.contentSource}</dd>
              </div>
            </dl>

            <pre className="mt-3 overflow-x-auto rounded-md bg-stone-900 p-3 text-[11px] leading-relaxed text-amber-50">
              <code>{spec.snippet}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

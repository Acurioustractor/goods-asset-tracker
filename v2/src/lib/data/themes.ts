// The 10 canonical "main thematics" for Goods media. Every image/video is
// organised under one primary theme. A theme binds an asset to the investment
// point it proves and the story beat it carries (see
// wiki/outputs/2026-07-03-thematic-media-system.md).
//
// Theme is derived, not a schema column: an explicit `theme:<id>` tag in
// content_items.tags wins; otherwise it is inferred from the canon slot group,
// then the folder (area). Tag an item `theme:<id>` in the media library to
// override the inference.

export interface Theme {
  id: string;
  name: string;
  blurb: string;
  /** The investment argument this theme proves to a funder. */
  investment: string;
  /** The story beat this theme carries. */
  story: string;
}

export const THEMES: Theme[] = [
  { id: 'product',          name: 'The Product',                       blurb: 'The Stretch Bed and the wider range. Hero shots, detail, X-trestle assembly, no-tools setup.', investment: 'The flagship product stands up: X-trestle tension, ~5min no tools, 200kg, 10+ year life.', story: 'The Product, the Stretch Bed.' },
  { id: 'plastic-to-plant', name: 'Plastic to Plant',                  blurb: 'The circular material loop. Community-collected HDPE shredded and pressed into bed components On Country.', investment: 'A real plastic-to-product loop: 20kg HDPE diverted per bed, collected and pressed On Country.', story: 'The Build, the on-Country recycling plant.' },
  { id: 'manufacturing',    name: 'On-Country Manufacturing',          blurb: 'The making located On Country. Container plant, CNC cutting, assembly, QC, the deployment circuit.', investment: 'The production plant is real and largely paid: press capex done, ~30 beds/week, mobile system.', story: 'The Build in practice, young people make the beds.' },
  { id: 'rest-health',      name: 'Rest & Health',                     blurb: 'Beds and washing machines as health hardware, not furniture. Off-the-ground washable sleep, clean bedding.', investment: 'A multi-product platform: the same facility makes washing machines (Pakkimjalki Kari).', story: 'Why a washing machine is a health intervention.' },
  { id: 'dignity',          name: 'Dignity, Safety & Belonging',       blurb: 'A bed as safety, belonging and dignity. Overcrowding, family, cultural gatherings. A need, not charity.', investment: 'Proof of delivery at scale and real demand pull, framed as dignity not charity.', story: 'Before and after, the change is the point.' },
  { id: 'community-design', name: 'Community-Led Design & Self-Determination', blurb: 'Designed in community with the people who use it, from naming and testing to who holds the story and the data.', investment: 'Locally led governance: Aboriginal-owned lead partners, a 51% ownership path.', story: 'The connectors, local teams lead the deliveries.' },
  { id: 'jobs-ownership',   name: 'Jobs & Community Ownership',        blurb: 'Real paid jobs On Country, young people building the product, the arc toward community-owned enterprise.', investment: 'Community ownership is the endgame: the plant is built to transfer. The recoverable-grant thesis.', story: 'The Model, commerce not charity, the ownership handover.' },
  { id: 'cost-curve',       name: 'The Freight Tax & Cost Curve',      blurb: 'The economics through-line. The remoteness freight premium, and the cost-down as production in-sources On Country.', investment: 'Unit economics work and THE ASK ($400K by 31 Aug, 1:1 match).', story: 'The Problem, the freight tax.' },
  { id: 'storytellers',     name: 'Storytellers & Voices',            blurb: 'Consent-cleared portraits, interviews and quotes. Community members, Elders, health workers, funders.', investment: 'Real unmet demand pull: a named consent-cleared community member with their bed.', story: 'The Voice, community members name the need.' },
  { id: 'communities',      name: 'Communities & Country',            blurb: 'Place-based media grouped by community and Country, and the surrounding landscape.', investment: 'Proof of delivery at scale: hundreds of beds across eleven communities, every unit QR-tracked.', story: 'This is working, the live map.' },
];

export const THEME_IDS = THEMES.map((t) => t.id);
const THEME_BY_ID = new Map(THEMES.map((t) => [t.id, t]));
export const themeName = (id: string | null | undefined): string | undefined =>
  (id ? THEME_BY_ID.get(id)?.name : undefined);

// Folder (content_items.area) -> theme. Unmapped areas (brand, hero, media-pack,
// pitch, qbe, program, root, video) fall through to null and can be tagged manually.
const AREA_TO_THEME: Record<string, string> = {
  product: 'product',
  'stretch-bed': 'product',
  process: 'manufacturing',
  build: 'manufacturing',
  plant: 'manufacturing',
  recycling: 'plastic-to-plant',
  plastic: 'plastic-to-plant',
  people: 'storytellers',
  stories: 'storytellers',
  washing: 'rest-health',
  cost: 'cost-curve',
  utopia: 'communities',
  community: 'communities',
  communities: 'communities',
  partners: 'community-design',
};

// Canon slot key -> theme, by prefix/substring (canon-slots.json keys).
function themeForSlot(slot: string): string | null {
  const s = slot.toLowerCase();
  if (s.startsWith('storyteller') || s.includes('testimony') || s.includes('listening')) return 'storytellers';
  if (s.startsWith('product') || s.includes('assembly') || s.includes('kids-building')) return 'product';
  if (s.includes('plant') || s.includes('press') || s.includes('shred') || s.includes('feedstock') || s.includes('pressed') || s.includes('loop')) return 'plastic-to-plant';
  if (s.includes('build')) return 'manufacturing';
  if (s.includes('washing') || s.includes('health')) return 'rest-health';
  if (s.includes('cost') || s.includes('breakeven') || s.includes('sankey') || s.includes('where-750') || s.includes('freight')) return 'cost-curve';
  if (s.includes('ownership') || s.includes('governance') || s.includes('jobs')) return 'jobs-ownership';
  if (s.includes('community') || s.includes('map') || s.includes('delivery') || s.includes('region')) return 'communities';
  return null;
}

/** Resolve an item's primary theme: explicit theme:<id> tag > canon slot > folder. */
export function themeForItem(opts: { area?: string | null; canonSlot?: string | null; tags?: string[] | null }): string | null {
  const tag = (opts.tags ?? []).find((t) => t.startsWith('theme:'));
  if (tag) {
    const id = tag.slice('theme:'.length);
    if (THEME_BY_ID.has(id)) return id;
  }
  if (opts.canonSlot) {
    const bySlot = themeForSlot(opts.canonSlot);
    if (bySlot) return bySlot;
  }
  if (opts.area && AREA_TO_THEME[opts.area]) return AREA_TO_THEME[opts.area];
  return null;
}

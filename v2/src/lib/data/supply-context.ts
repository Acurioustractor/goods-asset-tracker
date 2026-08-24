/**
 * SUPPLY CONTEXT — the verified NT waste + overcrowding facts, typed.
 *
 * Why this exists: these figures were verified against primary sources on
 * 2026-08-24 (research/nt-plastics-overcrowding-facts-2026-08-24.md holds the
 * full provenance trail) and they belong on pitch and website surfaces. A
 * surface must never quote the markdown; it reads this module, so the figure,
 * its honesty label and its source travel together and the retired-figures
 * guard can police the banned derivatives.
 *
 * The story these facts are allowed to tell (and the only one):
 *   feedstock will never be the constraint; community-owned making is.
 * Never lead with tonnage. Never derive a beds-possible headline from supply —
 * the demand ceiling (2,761 very-remote overcrowded households) is thousands,
 * not hundreds of thousands, and the 109,600-bed genre of claim is banned.
 *
 * Placement per rulings C+F: these land inside existing road stops (the machine
 * with a name; the gap), never as a section of their own.
 */

import type { Solidity } from './cost-story';
import { CANONICAL_ASSETS } from './asset-canonical';

/** Ben ruling 2026-08-24 (DECISIONS.md T). Workpaper until the measured run weighs it. */
export const PLASTIC_KG_PER_BED = 20;

/** Derived: one tonne of clean usable HDPE ≈ this many leg-sets. Workpaper. */
export const LEG_SETS_PER_TONNE = Math.floor(1000 / PLASTIC_KG_PER_BED);

export interface SupplyFact {
  id: string;
  label: string;
  value: string;
  solidity: Solidity;
  /** One plain sentence a surface may render beside the value. */
  means: string;
  watchOut?: string;
  source: string;
  sourceUrl: string;
  asAt: string; // date the source speaks to (not the date we read it)
}

export const SUPPLY_FACTS: SupplyFact[] = [
  {
    id: 'nt-plastics-recycled',
    label: 'Plastics recycled in the NT, 2023-24',
    value: '4,933 tonnes',
    solidity: 'verified',
    means: 'The NT recycled 4,933 tonnes of plastic in a year — 8% of everything recycled in the Territory.',
    watchOut:
      'This is plastic RECYCLED, not collected — more again sits in the 275,190t landfill stream. Usable HDPE/PP after sorting is a fraction of it. One sentence, then move on: supply is not the constraint.',
    source: 'WRINT/AEAS, Economic Contribution of the Waste and Recycling Industry to the NT Economy 2023-24, §6 Material Flow Analysis',
    sourceUrl: 'https://dtbar.nt.gov.au/media/docs/industries/waste-and-recycling/wrint-ec-report-nov-2024.pdf',
    asAt: '2024-06-30',
  },
  {
    id: 'nt-waste-to-landfill',
    label: 'NT waste to landfill, 2023-24',
    value: '275,190 tonnes (56.4% of 487,580t processed)',
    solidity: 'verified',
    means: 'More than half of everything the NT waste industry handles still goes to landfill.',
    source: 'WRINT/AEAS report, §6 Material Flow Analysis',
    sourceUrl: 'https://dtbar.nt.gov.au/media/docs/industries/waste-and-recycling/wrint-ec-report-nov-2024.pdf',
    asAt: '2024-06-30',
  },
  {
    id: 'nt-cds-plastic',
    label: 'Plastic drink containers returned via NT CDS, 2023-24',
    value: '~530 tonnes',
    solidity: 'verified',
    means: '100 million containers came back through the deposit scheme in a year; the PET share is about 530 tonnes.',
    watchOut:
      'The circulated "~800t/yr" figure is UNSUPPORTED and retired — the NT EPA annual report gives 5,299t returned with PET at 10% by weight. Never quote 800t.',
    source: 'NT EPA, Environment Protection (Beverage Containers and Plastic Bags) Act — Annual Report 2023-24, p.7',
    sourceUrl: 'https://ntepa.nt.gov.au/_media/container-deposit/pdf/reports/annual/annual-report-2023-24-environment-protection-act-2011.PDF',
    asAt: '2024-06-30',
  },
  {
    id: 'nt-overcrowding-very-remote',
    label: 'Very remote NT: First Nations households needing at least one more bedroom',
    value: '2,761 households — 51.3%',
    solidity: 'verified',
    means: 'In very remote NT, half of all First Nations households — 2,761 of 5,377 — need at least one more bedroom.',
    watchOut:
      'ABS measures "requiring one or more extra bedrooms" (CNOS) — the standard overcrowding proxy. Say "overcrowded" with that footnote available. This is the demand-side fact; it, not tonnage, sizes the work.',
    source: 'ABS Census 2021, Aboriginal and Torres Strait Islander QuickStats, Very Remote Australia (NT)',
    sourceUrl: 'https://www.abs.gov.au/census/find-census-data/quickstats/2021/IQSRA74',
    asAt: '2021-08-10',
  },
  {
    id: 'nt-overcrowding-statewide',
    label: 'NT-wide: First Nations households needing at least one more bedroom',
    value: '4,385 households — 28.7%',
    solidity: 'verified',
    means: 'Across the whole NT, 4,385 First Nations households need at least one more bedroom.',
    source: 'ABS Census 2021, Aboriginal and Torres Strait Islander QuickStats, Northern Territory',
    sourceUrl: 'https://www.abs.gov.au/census/find-census-data/quickstats/2021/IQS7',
    asAt: '2021-08-10',
  },
  {
    id: 'nt-appropriately-housed',
    label: 'First Nations people in appropriately sized housing, NT',
    value: '43.4% — the lowest of any jurisdiction',
    solidity: 'verified',
    means: 'Fewer than half of First Nations people in the NT live in appropriately sized housing — the lowest result in the country, against 81.4% nationally.',
    source: 'ABS, Housing Statistics for Aboriginal and Torres Strait Islander Peoples, 2021, Graph 15',
    sourceUrl: 'https://www.abs.gov.au/statistics/people/aboriginal-and-torres-strait-islander-peoples/housing-statistics-aboriginal-and-torres-strait-islander-peoples/2021',
    asAt: '2021-08-10',
  },
  {
    id: 'nt-remote-communities',
    label: 'Remote communities and homelands served with essential services',
    value: '72 communities · 79 outstations · ~500 homelands',
    solidity: 'verified',
    means: 'Essential services reach 72 remote communities and 79 outstations (~39,000 customers); about 500 homelands hold 2,400 homes and 10,000 people.',
    source: 'Power and Water Corporation, IES Annual Report 2023-24; NT DHLGCD Homeland Services',
    sourceUrl: 'https://www.powerwater.com.au/__data/assets/pdf_file/0031/376654/PWC_IES-Annual-Report_23-24.pdf',
    asAt: '2024-06-30',
  },
  {
    id: 'plastic-per-bed',
    label: 'Recycled HDPE in one Stretch Bed',
    value: `${PLASTIC_KG_PER_BED}kg`,
    solidity: 'workpaper',
    means: `A Stretch Bed's pressed legs carry about ${PLASTIC_KG_PER_BED}kg of recycled HDPE — one tonne of clean plastic is roughly ${LEG_SETS_PER_TONNE} beds' legs.`,
    watchOut:
      'Ben ruling 2026-08-24 (DECISIONS.md T); Envirobank\'s ~25kg retired. Workpaper until the measured run weighs batches per run. Never 45kg/bed or anything derived from it.',
    source: 'Product spec; Ben ruling 2026-08-24; canon plastic-kg derivation',
    sourceUrl: 'https://github.com/Acurioustractor/goods-asset-tracker/blob/main/DECISIONS.md',
    asAt: '2026-08-24',
  },
];

/**
 * The one paragraph the facts earn, for pitch and website use. The road leads;
 * this lands inside a stop, never as an opener, and never before a person.
 */
export const SUPPLY_PARAGRAPH =
  `The NT recycled 4,933 tonnes of plastic last year, and more again went to landfill. ` +
  `A Stretch Bed's pressed legs take about ${PLASTIC_KG_PER_BED}kg of it, so one tonne of clean plastic ` +
  `is roughly ${LEG_SETS_PER_TONNE} beds' legs — and the Census counts 2,761 very remote NT households ` +
  `short at least a bedroom. Feedstock will never be the constraint. What the money buys is the part ` +
  `that is: a community that can collect the plastic, make the goods, and come to own the making.`;

/** Sanity anchor: canon's diverted-kg figure must stay derivable from the ruling. */
export const EXPECTED_PLASTIC_KG_DIVERTED = CANONICAL_ASSETS.stretchBedsDeployed * PLASTIC_KG_PER_BED;

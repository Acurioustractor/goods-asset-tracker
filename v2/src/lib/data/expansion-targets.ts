/**
 * Priority remote community expansion targets, NT and QLD.
 * Sourced from the community research sweep (March 2026).
 *
 * Each entry is a community we have actively researched for housing need,
 * population, current housing programs, and the housing body that runs procurement.
 *
 * Used by:
 *   - /admin/communities (operator dashboard)
 *   - /funders/[slug]/communities (funder due-diligence page)
 */

export interface ExpansionTarget {
  community: string;
  state: 'NT' | 'QLD' | 'WA' | 'SA';
  pop: number;
  priority: number;
  reason: string;
  housingBody: string;
}

export const expansionTargets: ExpansionTarget[] = [
  { community: 'Wadeye (Port Keats)', state: 'NT', pop: 2600, priority: 1, reason: 'Worst overcrowding in Australia. 150 homes short. Houses with up to 26 people.', housingBody: 'Thamarrurr Development Corp' },
  { community: 'Yarrabah', state: 'QLD', pop: 2500, priority: 2, reason: '7 new homes building now. 97% Indigenous.', housingBody: 'Yarrabah Aboriginal Shire Council' },
  { community: "Galiwin'ku (Elcho Island)", state: 'NT', pop: 2200, priority: 3, reason: 'Largest NE Arnhem community. Receiving new homes under OFOH.', housingBody: 'East Arnhem Regional Council' },
  { community: 'Aurukun', state: 'QLD', pop: 1370, priority: 4, reason: 'Lowest median income on Cape York ($13,520/yr). Housing plan active.', housingBody: 'Aurukun Aboriginal Shire Council' },
  { community: 'Torres Strait (via TSIRC)', state: 'QLD', pop: 4000, priority: 5, reason: '14 islands, modular housing strategy, CEQ stores already on the ground.', housingBody: 'Torres Strait Island Regional Council' },
  { community: 'Gunbalanya (Oenpelli)', state: 'NT', pop: 1200, priority: 6, reason: '$26.5M tender: 24 new homes plus 18 upgrades.', housingBody: 'Bawinanga Aboriginal Corp' },
  { community: 'Doomadgee', state: 'QLD', pop: 1400, priority: 7, reason: 'Housing plan underway.', housingBody: 'Doomadgee Aboriginal Shire Council' },
  { community: 'Borroloola', state: 'NT', pop: 900, priority: 8, reason: '31 of 38 new homes just completed. Beds needed.', housingBody: 'Roper Gulf Regional Council' },
  { community: 'Groote Archipelago', state: 'NT', pop: 1500, priority: 9, reason: '800 beds and 300 washers requested.', housingBody: 'Anindilyakwa Housing Aboriginal Corp' },
  { community: 'Ngukurr', state: 'NT', pop: 1100, priority: 10, reason: 'Part of housing class action communities.', housingBody: 'Roper Gulf Regional Council' },
  { community: 'Ramingining', state: 'NT', pop: 870, priority: 11, reason: 'New homes under OFOH.', housingBody: 'East Arnhem Regional Council' },
  { community: 'Kowanyama', state: 'QLD', pop: 1100, priority: 12, reason: '4 new homes plus housing plan.', housingBody: 'Kowanyama Aboriginal Shire Council' },
  { community: 'Woorabinda', state: 'QLD', pop: 1000, priority: 13, reason: '91.6% Indigenous. Only DOGIT community in Central QLD.', housingBody: 'Woorabinda Aboriginal Shire Council' },
  { community: 'Cherbourg', state: 'QLD', pop: 1500, priority: 14, reason: 'Overcrowding action plan underway.', housingBody: 'Cherbourg Aboriginal Shire Council' },
  { community: 'Lajamanu', state: 'NT', pop: 600, priority: 15, reason: 'New homes under OFOH.', housingBody: 'Central Desert Regional Council' },
  { community: 'Yuendumu', state: 'NT', pop: 800, priority: 16, reason: 'Central Desert Regional Council area.', housingBody: 'Central Desert Regional Council' },
];

export function getExpansionTargetTotals() {
  const totalPopulation = expansionTargets.reduce((s, t) => s + t.pop, 0);
  const states = Array.from(new Set(expansionTargets.map((t) => t.state))).sort();
  const housingBodies = Array.from(new Set(expansionTargets.map((t) => t.housingBody)));
  return {
    count: expansionTargets.length,
    totalPopulation,
    states,
    housingBodies: housingBodies.length,
  };
}

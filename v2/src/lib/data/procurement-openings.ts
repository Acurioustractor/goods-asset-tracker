/**
 * EVERY CONCRETE OPENING WE KNOW OF, WITH A DATE ON IT.
 *
 * Ben, 17 September 2026: where do I see all the procurement opportunities?
 *
 * The honest answer was nowhere. The reason belongs at the top of the page, where nobody has to
 * discover it later.
 *
 * THERE IS NO LIVE TENDER FEED, AND WE CANNOT BUILD ONE TODAY.
 *   - The AusTender OCDS API exposes AWARDED contracts only. Its date types are
 *     contractPublished, contractLastModified, contractStart and contractEnd. Open approaches to
 *     market live on the website. The feed does not carry them.
 *   - `state_tenders` in the shared graph is 199,679 Queensland rows out of 199,719, and its
 *     rows are mostly notices, with no supplier or value on them.
 *   - Every sa.gov.au domain returns 403 to automated fetching, and several nt.gov.au and
 *     qld.gov.au ones do too.
 *   So the portals have to be watched by a person: tendersonline.nt.gov.au, tenders.sa.gov.au,
 *   Tenders WA, QTenders, and VendorPanel for the Queensland councils.
 *
 * WHAT IS HERE INSTEAD is better than a feed for deciding what to do this week: dated openings
 * from the research, and computed contract expiries from the NT workbook. A re-tender is the
 * moment a supplier can get onto a list, and an expiry is when a re-tender starts.
 */

export type OpeningKind = 'in-market' | 'forward' | 'expiry' | 'policy' | 'standing';

export interface Opening {
  id: string;
  kind: OpeningKind;
  /** YYYY-MM, sortable. When the thing happens or opens. */
  when: string;
  whenLabel: string;
  jurisdiction: string;
  title: string;
  what: string;
  /** The single next action, where one exists. */
  action: string | null;
  source: string;
}

export const OPENING_KINDS: Record<OpeningKind, { label: string; blurb: string; colour: string }> = {
  'in-market': { label: 'In market now', blurb: 'Open or opening within weeks.', colour: '#C45C3E' },
  forward: { label: 'On a forward plan', blurb: 'Published as coming, with an estimated date.', colour: '#BBA255' },
  expiry: { label: 'Contract expiring', blurb: 'A re-tender is when a new supplier can get on the list.', colour: '#5E7D9A' },
  policy: { label: 'Policy window', blurb: 'A rule is being written and can still be shaped.', colour: '#8B7D6B' },
  standing: { label: 'Open any time', blurb: 'A rule that permits a purchase today, with no event to wait for.', colour: '#5E7A4C' },
};

/**
 * Hand-written from the jurisdiction research, each with its source. Sorted by date on render.
 * Nothing speculative: every row is a published date, a published rule, or a stated plan.
 */
export const OPENINGS: readonly Opening[] = [
  {
    id: 'wa-maintenance-rft',
    kind: 'in-market', when: '2026-09', whenLabel: 'September to November 2026',
    jurisdiction: 'WA',
    title: 'Head maintenance contract, request for tender',
    what: 'In market right now, for contracts starting July 2028, covering 111 remote and town-based communities. The review behind it explicitly explored increasing the participation of Aboriginal community controlled organisations, Aboriginal businesses and local community members, and opening the door for communities to opt in to delivering some or all maintenance.',
    action: 'MaintenanceContractReview@dohw.wa.gov.au takes questions today. This is the largest single opening in the model and the only one with a live inbox.',
    source: 'WA Department of Housing and Works maintenance contract review',
  },
  {
    id: 'qld-council-buy',
    kind: 'standing', when: '2026-09', whenLabel: 'Today, any council',
    jurisdiction: 'QLD',
    title: 'An Aboriginal Shire Council can buy 29 beds with no quotes at all',
    what: 'Under the Local Government Regulation a council may buy directly below $21,900 excluding GST. No quote requirement, no tender, no directory registration, because QPP 2026 names Queensland Indigenous local councils as Aboriginal and Torres Strait Islander businesses in their own right. Every Queensland community we work in is on that list.',
    action: 'The shortest path to a sale anywhere in the model. It needs a conversation. No process stands in the way.',
    source: 'Local Government Regulation 2012 s 223A-E and QPP 2026',
  },
  {
    id: 'sa-direct',
    kind: 'standing', when: '2026-09', whenLabel: 'Today, any public authority',
    jurisdiction: 'SA',
    title: 'Direct engagement of an eligible Aboriginal business up to $550,000',
    what: 'One written quote and a value-for-money note. 733 beds. The instrument names the APY Lands in its own text, and SA has no across-government contract for furniture or whitegoods standing in the way.',
    action: 'Nganampa Health Council is the natural partner: they run the UPK programme and the 1987 UPK report is where the healthy living practices come from.',
    source: 'SAIPP Procedural Guidelines s3.7 and s4.6, effective 1 January 2023',
  },
  {
    id: 'nt-galiwinku',
    kind: 'forward', when: '2026-10', whenLabel: 'Tender committal estimated October 2026',
    jurisdiction: 'NT',
    title: 'Galiwinku construction, demolition, refurbishment and upgrades',
    what: 'On the DLI housing infrastructure forward procurement plan as a Tier 5 procurement over 36 months. Galiwinku is the largest place in the federal bed-adjacent contract record at $58.9 million, is 64 per cent overcrowded, and Bukmak is already building 87 dwellings there.',
    action: 'procurementadvice.dli@nt.gov.au. A bed sits outside a construction scope, so the move is Bukmak. The department is the wrong door here.',
    source: 'DLI housing infrastructure procurement plan, accurate as at August 2026',
  },
  {
    id: 'sa-policy',
    kind: 'policy', when: '2026-12', whenLabel: 'This financial year',
    jurisdiction: 'SA',
    title: 'South Australia is writing an Aboriginal procurement policy',
    what: 'Treasury’s stated 2026-27 target is to establish an Aboriginal procurement policy to support the procurement strategy. SA currently runs Aboriginal procurement through the industry participation policy and has no standalone one, so this is being drafted now.',
    action: 'John Chapman OAM, Industry Advocate, oia@sa.gov.au. A reason to be in the room while the rule is being written, which beats arriving after it.',
    source: 'SA Budget Paper 4 Volume 4, Treasury and Finance sub-programme 4.2',
  },
  {
    id: 'nt-groote',
    kind: 'forward', when: '2027-02', whenLabel: 'Advertising estimated February 2027',
    jurisdiction: 'NT',
    title: 'Groote Eylandt construction, demolition, refurbishment and upgrades',
    what: 'Tier 5 over 36 months, with committal estimated April 2027. The Anindilyakwa Land Council uses two local Indigenous construction companies and plans up to 100 new houses.',
    action: 'Our Groote signal rests on a single email from May 2025. The relationship is the thing to fix first.',
    source: 'DLI housing infrastructure procurement plan',
  },
  {
    id: 'sa-hcms',
    kind: 'expiry', when: '2028-06', whenLabel: 'Initial term ends June 2028',
    jurisdiction: 'SA',
    title: 'The $1.012 billion SA housing maintenance contract',
    what: 'Head Contractors for Maintenance Services, about 35,000 properties, with a two-year option to 2030. RTC Facilities Maintenance holds Contract Area 06, Western Country and Far North. It carries a named-brand Electrolux appliances schedule, against a clause that mandates South Australian manufactured products in public housing maintenance and requires "or equivalent" after any brand.',
    action: 'The contract went through a review whose terms of reference included considering alternative delivery models. The "or equivalent" clause is the lever, and it works before the re-tender.',
    source: 'SA contract record SAHA049515 and SAIPP Procedural Guidelines s4.3',
  },
  {
    id: 'nt-bedding',
    kind: 'expiry', when: '2029-06', whenLabel: 'Re-tenders around mid 2029',
    jurisdiction: 'NT',
    title: 'The NT foam mattresses, bedding and linen period contract',
    what: '$4,539,279 over 36 months, awarded 4 June 2026 to a Darwin firm that is a Territory enterprise but not an Aboriginal one. Nine other firms bid and the list is public. It sits with Corrections instead of Housing, and it is the only bedding period contract in the Territory.',
    action: 'Too far out to act on, and the right thing to be ready for. The published bidder list is also a map of who to partner with.',
    source: 'Quotations and Tenders Online, tender NTG25-0134',
  },
];

/** A contract that ends is a contract that gets re-let. Computed from the NT workbook. */
export interface Expiry {
  expires: string;
  awarded: string;
  valueAud: number;
  contractor: string;
  territoryEnterprise: boolean;
  what: string;
  months: number;
}

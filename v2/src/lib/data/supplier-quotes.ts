// Supplier quotes and pricing data
// Consolidated from Xero invoices, email quotes, and compendium data

export interface SupplierQuote {
  id: string;
  supplier: string;
  contact: string;
  email: string;
  component: string;
  description: string;
  unitPrice: number;
  currency: 'AUD';
  moq: number; // minimum order quantity
  leadTimeDays: number;
  validUntil: string | null;
  status: 'active' | 'expired' | 'pending' | 'historical';
  notes: string;
  xeroInvoice: string | null;
}

export const supplierQuotes: SupplierQuote[] = [
  // Defy Design — HDPE panels (legs, end caps)
  {
    id: 'defy-hdpe-panels-2026',
    supplier: 'Defy Design',
    contact: 'Sam Davies',
    email: 'sam@defydesign.org',
    component: 'HDPE Plastic Kit (legs, cut & finished)',
    description: 'Recycled 19mm Jungle-mix HDPE plastic kit, cut and finished. Excludes assembly and hardware.',
    unitPrice: 344.05,
    currency: 'AUD',
    moq: 50,
    leadTimeDays: 21,
    validUntil: '2026-06-30',
    status: 'active',
    notes: 'Current primary supplier. Sydney-based. $344.05/bed VERIFIED ex invoice INV-1602 ("107 Beds", 92 @ $344.05) + INV-1732 ("50 Beds"). Assembly billed separately ~$55.95/bed; freight Sydney→Alice ~$874/shipment. Beds from pre-paid sheets cost only $121/bed (cut+finish labour). Training Ebony + Jahvan for on-country production (target cost well below this).',
    xeroInvoice: 'INV-1602',
  },
  {
    id: 'defy-hdpe-sheets-2026',
    supplier: 'Defy Design',
    contact: 'Sam Davies',
    email: 'sam@defydesign.org',
    component: 'HDPE Sheet (raw material)',
    description: 'Recycled HDPE sheet stock, 1200×600×18mm, for CNC routing into custom components.',
    unitPrice: 35,
    currency: 'AUD',
    moq: 20,
    leadTimeDays: 14,
    validUntil: '2026-06-30',
    status: 'active',
    notes: 'Base material for future product expansion (wall panels, shelving, table tops).',
    xeroInvoice: null,
  },
  {
    id: 'defy-production-training-2025',
    supplier: 'Defy Design',
    contact: 'Sam Davies',
    email: 'sam@defydesign.org',
    component: 'Production Training Package',
    description: 'On-site training for community operators: shredding, pressing, CNC routing, QC.',
    unitPrice: 6000,
    currency: 'AUD',
    moq: 1,
    leadTimeDays: 30,
    validUntil: null,
    status: 'active',
    notes: 'Per-session pricing. Jahvan visited Sydney factory Aug 2025. Ongoing training relationship.',
    xeroInvoice: null,
  },

  // DNA Steel Direct — galvanised steel poles (gal pipe)
  {
    id: 'dna-steel-poles-2026',
    supplier: 'DNA Steel Direct',
    contact: 'DNA Steel Direct',
    email: 'sales@dnasteeldirect.com.au',
    component: 'Galvanised Steel (gal pipe, per bed)',
    description: '26.9mm OD × 2.6mm wall galvanised pipe, cut to 2 poles per bed.',
    unitPrice: 27,
    currency: 'AUD',
    moq: 100,
    leadTimeDays: 7,
    validUntil: '2026-12-31',
    status: 'active',
    notes: 'Alice Springs based (08 8953 7355). Local supplier — key for NT procurement preference. $27/bed for the gal pipe per the canonical Notion BOM "BOM - StretchBed v2". Real supplier (confirmed by Ben 2026-05-28); invoices live in Notion + grant records, NOT the ACT-GD Xero mirror.',
    xeroInvoice: null,
  },

  // Centre Canvas — sleeping surface
  {
    id: 'centre-canvas-2026',
    supplier: 'Centre Canvas',
    contact: 'Wayne',
    email: '',
    component: 'Canvas Sleeping Surface',
    description: 'Heavy-duty Australian canvas stretcher covers with pole sleeves. Fully washable, quick-drying.',
    unitPrice: 93.5,
    currency: 'AUD',
    moq: 50,
    leadTimeDays: 14,
    validUntil: '2026-12-31',
    status: 'active',
    notes: 'Alice Springs based (Wayne, 4 Smith St, 08 8952 2453). Custom sewn to spec. $93.50/bed per the canonical Notion BOM "BOM - StretchBed v2". Real supplier (confirmed by Ben 2026-05-28). One Xero invoice exists ("Canvas stretcher covers" $10,285, INV ADG 6524337) but is mis-tagged ACT-IN; the same Xero contact is also polluted with Canva software-subscription lines (contact-name collision). Most canvas invoicing lives in Notion.',
    xeroInvoice: 'ADG 6524337',
  },

  // End caps
  {
    id: 'endcaps-27mm-2026',
    supplier: 'Hardware Supplier',
    contact: '',
    email: '',
    component: 'Round Ribbed End Caps (27mm)',
    description: 'Tube end caps for steel poles. 4 per bed.',
    unitPrice: 0.80,
    currency: 'AUD',
    moq: 500,
    leadTimeDays: 5,
    validUntil: null,
    status: 'active',
    notes: 'Generic hardware item. Multiple suppliers available.',
    xeroInvoice: null,
  },

  // Envirobank — future HDPE supply
  {
    id: 'envirobank-hdpe-2026',
    supplier: 'Envirobank',
    contact: 'Marty Taylor / Narelle Anderson',
    email: '',
    component: 'Recycled HDPE (bulk)',
    description: 'Bulk recycled HDPE pellets/flakes for on-country processing.',
    unitPrice: 0.80,
    currency: 'AUD',
    moq: 1000, // kg
    leadTimeDays: 21,
    validUntil: null,
    status: 'pending',
    notes: 'Active discussions Feb 2026. Alternative/supplementary HDPE source for when on-country processing starts.',
    xeroInvoice: null,
  },
];

export const WEBSITE_PRICE = 750; // Unified website price (2026-05-26). Institutional/retail collapsed to one.

// Direct materials per bed (bought-in BOM), reconciled to ACTUAL invoices 2026-05-28:
//   HDPE plastic kit $344.05/bed — verified ex Defy invoices INV-1602 ("107 Beds")
//     + INV-1732 ("50 Beds"): "kits in 19mm Jungle recycled plastic, cut & finished,
//     excl. assembly & hardware." The old $45 was an aspirational on-country-from-waste
//     figure, NOT what we pay. On-country production targets bring this down with volume.
//   Steel (gal pipe) $27/bed — DNA Steel Direct, Alice Springs (Notion BOM).
//   Canvas $93.50/bed — Centre Canvas, Alice Springs (Notion BOM).
// THIS IS NOT THE FULLY-LOADED COST — see fullyLoadedCostPerBed below (adds assembly
// ~$55.95/bed ex Defy, hardware, freight Sydney→Alice ~$874/shipment, and overhead).
export const stretchBedBOM = [
  { component: 'HDPE Plastic Kit (legs, cut & finished)', qty: 1, unitCost: 344.05, supplier: 'Defy Manufacturing' },
  { component: 'Galvanised Steel (gal pipe)', qty: 1, unitCost: 27, supplier: 'DNA Steel Direct' },
  { component: 'Canvas Sleeping Surface', qty: 1, unitCost: 93.5, supplier: 'Centre Canvas' },
  { component: 'Round Ribbed End Caps (27mm)', qty: 4, unitCost: 0.80, supplier: 'Hardware Supplier' },
] as const;

// Direct materials only: $344.05 + $27 + $93.50 + $3.20 = $467.75
export const stretchBedDirectMaterials = stretchBedBOM.reduce((sum, item) => sum + item.qty * item.unitCost, 0);

/**
 * Fully-loaded production cost per bed at current low volume (~100 units).
 * The direct-materials BOM above is a SUBSET. The remainder is the HDPE leg
 * production at the Sunshine Coast facility (plastic shredding / pressing / CNC),
 * facility labour (Joseph Kirmos ~$4,500/mo), freight, fuel and overhead.
 *
 * Source: FRRR Community Led Climate Solutions application ("Total production
 * cost: $550–650 at 100 units") + financial-model Day 4 unit economics
 * (2026-05-12: $550/bed at ~15/mo today → $479 at 1,500/yr → $351 at 5,000/yr
 * → $270 at Vision 2030). Aligns with the public "/pitch" $600 figure.
 *
 * USE THIS, not direct materials, for any margin claim.
 */
export const fullyLoadedCostPerBed = 600;

/** @deprecated materials-only alias — kept for back-compat. Do NOT use for margin. */
export const stretchBedCOGS = stretchBedDirectMaterials;

export const supplierSummary = {
  totalSuppliers: 4, // Defy, DNA Steel, Centre Canvas, Hardware
  localSuppliers: 2, // DNA Steel + Centre Canvas (Alice Springs)
  directMaterialsPerBed: stretchBedDirectMaterials, // $168.70 (bought-in BOM)
  fullyLoadedCostPerBed,                            // $600 (true production cost @ ~100 units)
  cogsPerBed: fullyLoadedCostPerBed,                // margin maths run off fully-loaded cost
  // Honest margin at the $750 website price uses fully-loaded cost, NOT materials.
  marginAtInstitutional: WEBSITE_PRICE - fullyLoadedCostPerBed, // $150
  marginAtRetail: WEBSITE_PRICE - fullyLoadedCostPerBed,
  marginPct: Math.round(((WEBSITE_PRICE - fullyLoadedCostPerBed) / WEBSITE_PRICE) * 100), // 20%
};

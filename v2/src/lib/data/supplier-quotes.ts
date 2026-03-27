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
    component: 'HDPE Bed Legs (pair)',
    description: 'Recycled HDPE plastic panels, pressed and CNC routed. Leg pairs for Stretch Bed.',
    unitPrice: 45,
    currency: 'AUD',
    moq: 50,
    leadTimeDays: 21,
    validUntil: '2026-06-30',
    status: 'active',
    notes: 'Current primary supplier. Sydney-based. Training Ebony + Jahvan for on-country production.',
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

  // DNA Steel Direct — galvanised steel poles
  {
    id: 'dna-steel-poles-2026',
    supplier: 'DNA Steel Direct',
    contact: 'DNA Steel',
    email: '',
    component: 'Galvanised Steel Pole',
    description: '26.9mm OD × 2.6mm wall, 1950mm length. Galvanised finish.',
    unitPrice: 18,
    currency: 'AUD',
    moq: 100,
    leadTimeDays: 7,
    validUntil: '2026-12-31',
    status: 'active',
    notes: 'Alice Springs based. 2 poles per bed. Local supplier — key for NT procurement preference.',
    xeroInvoice: null,
  },

  // Centre Canvas — sleeping surface
  {
    id: 'centre-canvas-2026',
    supplier: 'Centre Canvas',
    contact: 'Centre Canvas',
    email: '',
    component: 'Canvas Sleeping Surface',
    description: 'Heavy-duty Australian canvas with pole sleeves. Fully washable, quick-drying.',
    unitPrice: 65,
    currency: 'AUD',
    moq: 50,
    leadTimeDays: 14,
    validUntil: '2026-12-31',
    status: 'active',
    notes: 'Alice Springs based. Custom sewn to spec. Key local supplier.',
    xeroInvoice: null,
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

// BOM (Bill of Materials) for one Stretch Bed
export const stretchBedBOM = [
  { component: 'HDPE Bed Legs (pair)', qty: 1, unitCost: 45, supplier: 'Defy Design' },
  { component: 'Galvanised Steel Pole', qty: 2, unitCost: 18, supplier: 'DNA Steel Direct' },
  { component: 'Canvas Sleeping Surface', qty: 1, unitCost: 65, supplier: 'Centre Canvas' },
  { component: 'Round Ribbed End Caps (27mm)', qty: 4, unitCost: 0.80, supplier: 'Hardware Supplier' },
] as const;

export const stretchBedCOGS = stretchBedBOM.reduce((sum, item) => sum + item.qty * item.unitCost, 0);
// = $45 + $36 + $65 + $3.20 = $149.20

export const supplierSummary = {
  totalSuppliers: 4, // Defy, DNA Steel, Centre Canvas, Hardware
  localSuppliers: 2, // DNA Steel + Centre Canvas (Alice Springs)
  cogsPerBed: stretchBedCOGS,
  marginAtInstitutional: 560 - stretchBedCOGS, // ~$411
  marginAtRetail: 600 - stretchBedCOGS, // ~$451
  marginPct: Math.round(((560 - stretchBedCOGS) / 560) * 100), // ~73%
};

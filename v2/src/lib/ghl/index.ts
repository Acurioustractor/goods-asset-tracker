/**
 * GoHighLevel CRM Integration
 *
 * Server-side integration with GHL for:
 * - Contact creation/update on orders
 * - Support ticket triage
 * - Partnership inquiry management
 * - Workflow triggers
 */

// Configuration from environment
const GHL_API_KEY = process.env.GHL_API_KEY || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';
const GHL_BASE_URL = 'https://services.leadconnectorhq.com';
const GHL_DEFAULT_PIPELINE_NAME = process.env.GHL_PIPELINE_STRATEGIC_DEFAULT_NAME || '';
const GHL_DEFAULT_STAGE_NAME = process.env.GHL_STAGE_STRATEGIC_DEFAULT_STAGE_NAME || '';

// Feature flag
const GHL_ENABLED = process.env.GHL_ENABLED === 'true' && !!GHL_API_KEY && !!GHL_LOCATION_ID;

// Custom field IDs (configure in GHL dashboard)
const CUSTOM_FIELDS = {
  assetId: process.env.GHL_FIELD_ASSET_ID || '',
  productType: process.env.GHL_FIELD_PRODUCT_TYPE || '',
  community: process.env.GHL_FIELD_COMMUNITY || '',
  orderNumber: process.env.GHL_FIELD_ORDER_NUMBER || '',
  orderTotal: process.env.GHL_FIELD_ORDER_TOTAL || '',
  message: process.env.GHL_FIELD_MESSAGE || '',
  // Project Designation is a SHARED dropdown across ACT projects. Goods contact
  // handlers stamp "Goods" so the contact rolls up under the Goods program in
  // cross-project reports. Other projects (Empathy Ledger, JusticeHub) set
  // their own value via their own entry points.
  projectDesignation: process.env.GHL_FIELD_PROJECT_DESIGNATION || '',
};

// Helper: inject the Goods project designation into a customFields map.
// Used by every Goods-specific contact creation path so any contact that
// touched a Goods entry point is identifiable as a Goods contact in GHL.
function withGoodsProject(customFields: Record<string, string>): Record<string, string> {
  if (CUSTOM_FIELDS.projectDesignation) {
    customFields[CUSTOM_FIELDS.projectDesignation] = 'Goods';
  }
  return customFields;
}

// Workflow IDs (configure in GHL dashboard).
//
// SCALING MODEL (May 2026, decided 2026-05-22):
// - newOrder stays as a dedicated retail-orders workflow (separate from the router).
// - Every other Goods event (sponsorship, support, claim, partnership, message,
//   request, plus all event-source signups like Parliament House, Canberra Airport,
//   future pop-ups) routes through ONE Smart Router workflow that branches on
//   the `goods-*` tag attached to the contact.
// - New event = new tag value passed from the form + new Smart Router branch
//   added in the GHL dashboard. **Zero code change. Zero env-var change. Zero
//   deploy.** This is the "code does identify-and-tag, GHL decides what to send"
//   pattern. See wiki/outputs/2026-05-18-ghl-workflow-alignment.md.
const WORKFLOWS = {
  newOrder: process.env.GHL_WORKFLOW_NEW_ORDER || '',
  smartRouter: process.env.GHL_WORKFLOW_SMART_ROUTER || '',
};

// Fire the Smart Router for any non-retail Goods event. The router branches
// internally on the contact's `goods-*` tag(s). Returns true if the workflow
// was triggered (or simulated when GHL is disabled), false if no router is
// wired yet — in which case the contact still gets created/updated with the
// right tags, so a Smart List dispatch still works.
async function fireSmartRouter(contactId: string): Promise<boolean> {
  if (!WORKFLOWS.smartRouter) return false;
  // Small delay so custom fields propagate before the router reads them.
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return triggerWorkflow(WORKFLOWS.smartRouter, contactId);
}

const STRATEGIC_PIPELINES: Record<StrategicTargetType, StrategicPipelineConfig> = {
  buyer: {
    pipelineId: process.env.GHL_PIPELINE_STRATEGIC_BUYER || '',
    stageId: process.env.GHL_STAGE_STRATEGIC_BUYER_NEW || '',
    pipelineName: process.env.GHL_PIPELINE_STRATEGIC_BUYER_NAME || GHL_DEFAULT_PIPELINE_NAME || 'Goods',
    stageName: process.env.GHL_STAGE_STRATEGIC_BUYER_NEW_NAME || GHL_DEFAULT_STAGE_NAME || 'New Lead',
    label: 'Goods Sales',
    stageLabel: 'New buyer lead',
  },
  capital: {
    pipelineId: process.env.GHL_PIPELINE_STRATEGIC_CAPITAL || '',
    stageId: process.env.GHL_STAGE_STRATEGIC_CAPITAL_NEW || '',
    pipelineName: process.env.GHL_PIPELINE_STRATEGIC_CAPITAL_NAME || GHL_DEFAULT_PIPELINE_NAME || 'Goods',
    stageName: process.env.GHL_STAGE_STRATEGIC_CAPITAL_NEW_NAME || GHL_DEFAULT_STAGE_NAME || 'New Lead',
    label: 'Capital / Philanthropy',
    stageLabel: 'Research and warm intro',
  },
  partner: {
    pipelineId: process.env.GHL_PIPELINE_STRATEGIC_PARTNER || '',
    stageId: process.env.GHL_STAGE_STRATEGIC_PARTNER_NEW || '',
    pipelineName: process.env.GHL_PIPELINE_STRATEGIC_PARTNER_NAME || GHL_DEFAULT_PIPELINE_NAME || 'Goods',
    stageName: process.env.GHL_STAGE_STRATEGIC_PARTNER_NEW_NAME || GHL_DEFAULT_STAGE_NAME || 'New Lead',
    label: 'Community Partnerships',
    stageLabel: 'Community partner discovery',
  },
};

/**
 * Per-asset tag — tagging is N:M, so a contact who owns 3 beds gets 3 tags
 * (goods-asset-gb0-156-1, ...). This is the canonical bidirectional link:
 * given any asset id, GHL can list contacts; given any contact, GHL lists assets.
 *
 * Tags lowercase + hyphen-safe so GHL normalises them consistently.
 */
export function tagForAsset(assetId: string): string {
  return `goods-asset-${assetId.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;
}

/**
 * Format product type slug to human-readable name
 */
function formatProductType(slug: string): string {
  const productNames: Record<string, string> = {
    'stretch_bed': 'Stretch Bed',
    'stretch-bed-single': 'Stretch Bed',
    'basket_bed': 'Basket Bed',
    'basket-bed-single': 'Basket Bed',
    'basket-bed-double': 'Basket Bed (Double)',
    'washing_machine': 'Washing Machine',
    'washing-machine': 'Washing Machine',
  };

  return productNames[slug] || slug.split(/[-_]/).map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// ============================================================================
// TAGS — All tags use `goods-` prefix for GHL smart list filtering
//
// SMART LIST SEGMENTS:
//
// 1. SUPPORTERS (bought/sponsored)
//    goods-customer, goods-sponsor
//
// 2. COMMUNITY (recipients who received goods)
//    goods-recipient, goods-bed-owner, goods-washer-owner
//
// 3. NEWSLETTER (opted in to updates)
//    goods-newsletter + source tags (goods-src-footer, goods-src-parliament-house, etc.)
//
// 4. PARTNERS & STAKEHOLDERS
//    goods-partner-lead, goods-media, goods-strategic-target
//
// 5. PRODUCT OWNERS (claimed via QR)
//    goods-claimed-bed, goods-claimed-washer
//
// 6. SUPPORT (reported issues)
//    goods-support-request
//
// 7. PIPELINE (strategic targets from Grantscope)
//    goods-strategic-target, goods-buyer-target, goods-capital-target, goods-partner-target
//
// ============================================================================
const TAGS = {
  // --- Supporters (purchased or sponsored) ---
  customer: 'goods-customer',
  sponsor: 'goods-sponsor',

  // --- Product type (what they bought/own) ---
  bedOwner: 'goods-bed-owner',
  washerOwner: 'goods-washer-owner',

  // --- Partners & stakeholders ---
  partnerLead: 'goods-partner-lead',
  mediaRequest: 'goods-media',

  // --- Support ---
  supportRequest: 'goods-support-request',

  // --- Newsletter ---
  newsletter: 'goods-newsletter',

  // --- Community recipients ---
  recipient: 'goods-recipient',
  claimedBed: 'goods-claimed-bed',
  claimedWasher: 'goods-claimed-washer',

  // --- In-app user actions (so the Smart Router has stable branch keys) ---
  userMessage: 'goods-user-message',
  userRequest: 'goods-user-request',
};

interface GHLResponse {
  success: boolean;
  contact?: {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
  };
  opportunity?: {
    id: string;
    pipelineId?: string;
    pipelineStageId?: string;
  };
  opportunityCreated?: boolean;
  pipelineConfigured?: boolean;
  error?: string;
  simulated?: boolean;
}

interface ContactData {
  email?: string;
  name?: string;
  phone?: string;
  companyName?: string;
  tags?: string[];
  customFields?: Record<string, string>;
  source?: string;
}

interface OrderContactData {
  email: string;
  name?: string;
  phone?: string;
  orderNumber: string;
  totalCents: number;
  isSponsorship: boolean;
  sponsoredCommunity?: string;
  sponsorMessage?: string;
  productTypes: string[];
}

interface SupportTicketData {
  assetId: string;
  userName?: string;
  userContact: string; // phone or email
  issueDescription: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  category?: string;
  community?: string;
  productType?: string;
  assetConditionStatus?: 'Good' | 'Needs Repair' | 'Damaged' | 'Missing' | 'Replaced';
  serviceability?: 'fully_usable' | 'limited_use' | 'unsafe' | 'not_usable';
  failureCause?:
    | 'wear'
    | 'rust'
    | 'mould'
    | 'frame_damage'
    | 'fabric_damage'
    | 'electrical_fault'
    | 'water_fault'
    | 'freight_damage'
    | 'unknown';
  outcomeWanted?: 'repair' | 'replace' | 'pickup' | 'assessment' | 'dispose';
  oldItemDisposition?: 'still_in_use' | 'stored' | 'awaiting_pickup' | 'dumped' | 'returned' | 'unknown';
  safetyRisk?: boolean;
  issueObservedAt?: string;
}

interface PartnershipInquiryData {
  organizationName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  partnershipType: string;
  message?: string;
  /** foundation | corporate | buyer | investor | community | other */
  partnerSegment?: string;
  /** under-25k | 25-100k | 100-500k | 500k-plus | loan | exploring */
  fundingTier?: string;
  /** now | this-year | future */
  timeline?: string;
}

interface RecipientClaimData {
  phone: string;
  name?: string;
  assetId: string;
  productType: string;
  community: string;
}

interface UserMessageData {
  phone: string;
  name?: string;
  assetId?: string;
  message: string;
  community?: string;
}

interface UserRequestData {
  phone: string;
  name?: string;
  assetId?: string;
  requestType: string;
  description?: string;
  community?: string;
  productType?: string;
}

interface StrategicTargetContactData {
  organizationName: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  targetType: 'buyer' | 'capital' | 'partner';
  regionFocus?: string;
  relationshipStatus?: string;
  nextAction?: string;
  contactSurface?: string;
  whyPlausible?: string;
  sourceUrl?: string;
  communityFocusName?: string;
  communityFocusPostcode?: string;
  communityFocusState?: string;
  suggestedPipelineLabel?: string;
  suggestedStageLabel?: string;
  sourceOrgName: string;
  sourceOrgAbn?: string;
  sourceEntityGsId?: string;
  sourceIdentityName?: string;
  tags?: string[];
}

type StrategicTargetType = StrategicTargetContactData['targetType'];

type StrategicPipelineConfig = {
  pipelineId: string;
  stageId: string;
  pipelineName: string;
  stageName: string;
  label: string;
  stageLabel: string;
};

type GhlPipelineStage = {
  id?: string;
  _id?: string;
  name?: string;
  label?: string;
};

type GhlPipeline = {
  id?: string;
  _id?: string;
  name?: string;
  label?: string;
  stages?: GhlPipelineStage[];
  pipelineStages?: GhlPipelineStage[];
};

function cleanString(value?: string | null): string | undefined {
  const trimmed = String(value || '').trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Make authenticated request to GHL API
 */
async function ghlRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(`${GHL_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${GHL_API_KEY}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GHL API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Read Goods opportunities across the given GHL pipelines (LeadConnector).
 * Resilient: returns [] if GHL is disabled or a pipeline errors, so callers
 * (e.g. /admin/loi-tracker) degrade gracefully rather than crashing.
 */
interface GhlOpportunityRawCustomField {
  id?: string;
  fieldValue?: unknown;
  fieldValueString?: string;
  fieldValueNumber?: number;
}

interface GhlOpportunityRaw {
  id?: string;
  name?: string;
  pipelineId?: string;
  pipelineStageId?: string;
  monetaryValue?: number;
  status?: string;
  contact?: { name?: string };
  contactName?: string;
  customFields?: GhlOpportunityRawCustomField[];
}

/**
 * Goods opportunity money-alignment custom fields (opportunity model, location
 * agzsSZWg…). Created 2026-06-01 as "Layer A"; backfilled 2026-06-01. These let
 * GHL carry the grant/commercial split + the QBE-match flags + the Xero
 * reconciliation key, while Xero stays the money source of truth. See memory
 * [[ghl-money-alignment]] + wiki/outputs/2026-06-01-ghl-money-alignment-fields-and-rules.md.
 */
export const GOODS_OPP_FIELD_IDS = {
  fundingType: 'UCFe9cyjk3sVKwtInfSG', // Grant | Philanthropic | Commercial sale | Community contribution | Demand signal | Other
  matchEligible: '6tSoVICqtrTGQAzpPHn1', // Yes | No | TBC
  capitalStatus: 'QbfHdeNpz2JiMe5iRESS', // Signal | Ask made | Verbal yes | Signed LOI | Contracted | Invoiced | Paid
  amountBasis: 'LM1U3fVHJNB4KwvuK9ZF', // Estimate | Quote | Invoiced | Xero-actual
  xeroContactId: 'e1GTAmBc3HLwxNiRVZjS',
  xeroInvoiceNo: 'YFy6JM5tGjl4J4B5cHSV',
  actualPaidAud: 'R4QAmlXhi6gRRPrfuuz5',
  impactReportType: 'cdUjGPCdGPgZyCW9WAO9', // Board pack | Stewardship | Acquittal | Buyer proof pack | Supporter update | Supplier brief
  impactReportDue: '9iODTRxhs6DKH96grYDj',
  impactReportStatus: 'eiOuDxJ6mWqy8YZdbbVn', // Needed | Drafting | Evidence review | Consent review | Approved | Sent | Accepted
  impactReportUrl: 'Zv78LLA646iLsD3N1aM9',
  notionReportPageUrl: 'nPFdTTIjb72O7MnTStii',
  storyConsentStatus: 'q7FXLNPdnIdIaTwUHPHf', // Not needed | Needed | Pending | Approved | Cannot use
  evidencePackStatus: 'P9g0CpLcu8SzHpeSTfGV', // Missing | Partial | Complete | Source conflict
  lastImpactReportSent: '4BRnVjD9GVIlLoIdAVMb',
  nextReportingAction: 'YaSYTXhXiqTXo18WfPDI',
} as const;

export type GoodsFundingType =
  | 'Grant'
  | 'Philanthropic'
  | 'Commercial sale'
  | 'Community contribution'
  | 'Demand signal'
  | 'Other';
export type GoodsMatchEligible = 'Yes' | 'No' | 'TBC';
export type GoodsCapitalStatus =
  | 'Signal'
  | 'Ask made'
  | 'Verbal yes'
  | 'Signed LOI'
  | 'Contracted'
  | 'Invoiced'
  | 'Paid';

export interface GoodsOpportunity {
  id: string;
  name: string;
  pipelineId: string;
  stageId: string;
  monetaryValue: number;
  status: string; // open | won | lost | abandoned
  contactName?: string;
  // Money-alignment custom fields (undefined when not yet classified).
  fundingType?: GoodsFundingType;
  matchEligible?: GoodsMatchEligible;
  capitalStatus?: GoodsCapitalStatus;
  amountBasis?: string;
  /** Xero-verified cash actually received, AUD. null when not yet synced (Layer B). */
  actualPaid: number | null;
  xeroInvoiceNo?: string;
}

/** Pull a single opportunity custom-field value, tolerant of GHL's string/number shapes. */
function readOppCustomField(
  customFields: GhlOpportunityRawCustomField[] | undefined,
  fieldId: string,
): string | undefined {
  const match = customFields?.find((cf) => cf.id === fieldId);
  if (!match) return undefined;
  const raw =
    match.fieldValueString ??
    (typeof match.fieldValueNumber === 'number' ? String(match.fieldValueNumber) : undefined) ??
    (match.fieldValue != null ? String(match.fieldValue) : undefined);
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

export async function fetchOpportunitiesForPipelines(
  pipelineIds: string[],
): Promise<{ ok: boolean; opportunities: GoodsOpportunity[] }> {
  if (!GHL_ENABLED) return { ok: false, opportunities: [] };
  const all: GoodsOpportunity[] = [];
  let anyOk = false;
  for (const pid of pipelineIds) {
    try {
      const res = await ghlRequest<{ opportunities?: GhlOpportunityRaw[] }>(
        `/opportunities/search?location_id=${GHL_LOCATION_ID}&pipeline_id=${pid}&limit=100`,
      );
      anyOk = true;
      for (const o of res.opportunities || []) {
        const cf = o.customFields;
        const actualPaidRaw = readOppCustomField(cf, GOODS_OPP_FIELD_IDS.actualPaidAud);
        const actualPaidNum = actualPaidRaw != null ? Number(actualPaidRaw) : NaN;
        all.push({
          id: String(o.id ?? ''),
          name: String(o.name ?? 'Untitled'),
          pipelineId: String(o.pipelineId ?? pid),
          stageId: String(o.pipelineStageId ?? ''),
          monetaryValue: Number(o.monetaryValue ?? 0),
          status: String(o.status ?? 'open'),
          contactName: o.contact?.name ?? o.contactName ?? undefined,
          fundingType: readOppCustomField(cf, GOODS_OPP_FIELD_IDS.fundingType) as
            | GoodsFundingType
            | undefined,
          matchEligible: readOppCustomField(cf, GOODS_OPP_FIELD_IDS.matchEligible) as
            | GoodsMatchEligible
            | undefined,
          capitalStatus: readOppCustomField(cf, GOODS_OPP_FIELD_IDS.capitalStatus) as
            | GoodsCapitalStatus
            | undefined,
          amountBasis: readOppCustomField(cf, GOODS_OPP_FIELD_IDS.amountBasis),
          actualPaid: Number.isFinite(actualPaidNum) ? actualPaidNum : null,
          xeroInvoiceNo: readOppCustomField(cf, GOODS_OPP_FIELD_IDS.xeroInvoiceNo),
        });
      }
    } catch {
      // skip this pipeline; the page renders what it could fetch
    }
  }
  return { ok: anyOk, opportunities: all };
}

/**
 * Find contact by email or phone
 */
async function findContact(emailOrPhone: string): Promise<{ id: string } | null> {
  try {
    const isEmail = emailOrPhone.includes('@');
    const query = isEmail ? `email=${encodeURIComponent(emailOrPhone)}` : `phone=${encodeURIComponent(emailOrPhone)}`;

    const response = await ghlRequest<{ contacts: Array<{ id: string }> }>(
      `/contacts/search/duplicate?locationId=${GHL_LOCATION_ID}&${query}`
    );

    return response.contacts?.[0] || null;
  } catch (error) {
    console.error('[GHL] Error finding contact:', error);
    return null;
  }
}

/**
 * Create or update a contact in GHL
 */
async function createOrUpdateContact(data: ContactData): Promise<GHLResponse> {
  const email = cleanString(data.email);
  const phone = cleanString(data.phone);
  const companyName = cleanString(data.companyName);
  const name = cleanString(data.name) || companyName;

  console.log('[GHL] createOrUpdateContact called', {
    enabled: GHL_ENABLED,
    hasApiKey: !!GHL_API_KEY,
    hasLocationId: !!GHL_LOCATION_ID,
    envEnabled: process.env.GHL_ENABLED,
    email,
    phone,
  });

  if (!GHL_ENABLED) {
    console.log('[GHL] Disabled - would create contact:', email || phone || companyName || name);
    return { success: true, simulated: true };
  }

  try {
    // Try to find existing contact
    const duplicateKey = phone || email;
    console.log('[GHL] Searching for existing contact:', duplicateKey || '(none)');
    const existingContact = duplicateKey ? await findContact(duplicateKey) : null;
    console.log('[GHL] Existing contact search result:', existingContact ? `Found: ${existingContact.id}` : 'Not found');

    const contactData: Record<string, unknown> = {
      locationId: GHL_LOCATION_ID,
      ...(email ? { email } : {}),
      ...(name ? { name } : {}),
      ...(phone ? { phone } : {}),
      ...(companyName ? { companyName } : {}),
      tags: data.tags || [],
      source: data.source || 'Goods on Country Website',
    };

    // Add custom fields if configured (GHL expects array of {id, value} objects)
    if (data.customFields && Object.keys(data.customFields).length > 0) {
      contactData.customFields = Object.entries(data.customFields).map(([id, value]) => ({
        id,
        value,
      }));
    }

    let response;
    if (existingContact) {
      // Update existing contact
      console.log('[GHL] Updating existing contact:', existingContact.id);
      response = await ghlRequest<{ contact: { id: string } }>(
        `/contacts/${existingContact.id}`,
        'PUT',
        contactData
      );
      console.log('[GHL] Contact updated successfully:', response.contact.id);
    } else {
      // Create new contact
      console.log('[GHL] Creating new contact with data:', { email, phone, companyName, name });
      response = await ghlRequest<{ contact: { id: string } }>(
        '/contacts/',
        'POST',
        contactData
      );
      console.log('[GHL] Contact created successfully:', response.contact.id);
    }

    return { success: true, contact: response.contact };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[GHL] Error creating/updating contact:', message);
    return { success: false, error: message };
  }
}

/**
 * Trigger a workflow for a contact
 */
async function triggerWorkflow(workflowId: string, contactId: string): Promise<boolean> {
  if (!GHL_ENABLED || !workflowId) {
    return false;
  }

  try {
    await ghlRequest(
      `/contacts/${contactId}/workflow/${workflowId}`,
      'POST'
    );
    return true;
  } catch (error) {
    console.error('[GHL] Error triggering workflow:', error);
    return false;
  }
}

/**
 * Add a note to a contact
 */
async function addContactNote(contactId: string, note: string): Promise<boolean> {
  if (!GHL_ENABLED) {
    return true;
  }

  try {
    await ghlRequest(`/contacts/${contactId}/notes`, 'POST', { body: note });
    return true;
  } catch (error) {
    console.error('[GHL] Error adding note:', error);
    return false;
  }
}

async function addContactTags(contactId: string, tags: string[]): Promise<boolean> {
  if (!GHL_ENABLED) {
    return true;
  }
  if (!tags.length) return true;

  try {
    await ghlRequest(`/contacts/${contactId}/tags`, 'POST', { tags });
    return true;
  } catch (error) {
    console.error('[GHL] Error adding tags:', error);
    return false;
  }
}

let strategicPipelinesCache: GhlPipeline[] | null = null;

function normalizeGhlName(value?: string | null) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

async function loadStrategicPipelines() {
  if (strategicPipelinesCache) {
    return strategicPipelinesCache;
  }

  const response = await ghlRequest<{ pipelines?: GhlPipeline[] } | GhlPipeline[]>(
    `/opportunities/pipelines?locationId=${encodeURIComponent(GHL_LOCATION_ID)}`
  );

  const pipelines = Array.isArray(response)
    ? response
    : Array.isArray(response?.pipelines)
      ? response.pipelines
      : [];

  strategicPipelinesCache = pipelines;
  return pipelines;
}

async function resolveStrategicPipelineConfig(targetType: StrategicTargetType) {
  const config = STRATEGIC_PIPELINES[targetType];
  if (config.pipelineId && config.stageId) {
    return config;
  }

  if (!GHL_ENABLED) {
    return config.pipelineName && config.stageName ? config : null;
  }

  const pipelines = await loadStrategicPipelines();
  const pipeline = pipelines.find((candidate) => {
    const candidateName = normalizeGhlName(candidate.name || candidate.label);
    return candidateName === normalizeGhlName(config.pipelineName);
  });

  if (!pipeline) {
    return null;
  }

  const stages = Array.isArray(pipeline.stages)
    ? pipeline.stages
    : Array.isArray(pipeline.pipelineStages)
      ? pipeline.pipelineStages
      : [];

  const stage = stages.find((candidate) => {
    const candidateName = normalizeGhlName(candidate.name || candidate.label);
    return candidateName === normalizeGhlName(config.stageName);
  });

  if (!stage) {
    return null;
  }

  return {
    ...config,
    pipelineId: pipeline.id || pipeline._id || config.pipelineId,
    stageId: stage.id || stage._id || config.stageId,
  };
}

async function createStrategicOpportunity(params: {
  contactId: string;
  organizationName: string;
  targetType: StrategicTargetType;
  communityFocusName?: string;
  communityFocusPostcode?: string;
  communityFocusState?: string;
  nextAction?: string;
  whyPlausible?: string;
  suggestedPipelineLabel?: string;
  suggestedStageLabel?: string;
}) {
  const config = await resolveStrategicPipelineConfig(params.targetType);
  if (!config) {
    return {
      opportunity: null,
      opportunityCreated: false,
      pipelineConfigured: false,
      simulated: false,
    };
  }

  const pipelineLabel = params.suggestedPipelineLabel || config.label;
  const stageLabel = params.suggestedStageLabel || config.stageLabel;
  const locationLabel = [params.communityFocusName, params.communityFocusState].filter(Boolean).join(' · ');
  const opportunityName = [params.organizationName, pipelineLabel, locationLabel || undefined]
    .filter(Boolean)
    .join(' — ');
  const description = [
    params.communityFocusName ? `Community focus: ${params.communityFocusName}` : undefined,
    params.communityFocusPostcode ? `Postcode: ${params.communityFocusPostcode}` : undefined,
    params.communityFocusState ? `State: ${params.communityFocusState}` : undefined,
    params.nextAction ? `Next action: ${params.nextAction}` : undefined,
    params.whyPlausible ? `Why plausible: ${params.whyPlausible}` : undefined,
  ]
    .filter(Boolean)
    .join('\n');

  if (!GHL_ENABLED) {
    return {
      opportunity: {
        id: `sim-${params.targetType}-${params.contactId}`,
        pipelineId: config.pipelineId,
        pipelineStageId: config.stageId,
      },
      opportunityCreated: true,
      pipelineConfigured: true,
      simulated: true,
    };
  }

  const response = await ghlRequest<{ opportunity?: { id: string; pipelineId?: string; pipelineStageId?: string } }>(
    '/opportunities/upsert',
    'POST',
    {
      locationId: GHL_LOCATION_ID,
      contactId: params.contactId,
      pipelineId: config.pipelineId,
      pipelineStageId: config.stageId,
      name: opportunityName,
      status: 'open',
      source: 'GrantScope Goods Workspace',
      description,
      stageName: stageLabel,
    }
  );

  return {
    opportunity: response?.opportunity || null,
    opportunityCreated: Boolean(response?.opportunity?.id),
    pipelineConfigured: true,
    simulated: false,
  };
}

// ============================================================================
// PUBLIC API
// ============================================================================

// ============================================================================
// GHL Contact List Types (for admin CRM)
// ============================================================================

export interface GHLContact {
  id: string;
  firstName: string | null;
  lastName: string | null;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  companyName: string | null;
  tags: string[];
  source: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  dateAdded: string;
  dateUpdated: string;
  type: string | null;
  website: string | null;
  profilePhoto: string | null;
  customFields: Array<{ id: string; value: string; field_key?: string }>;
}

export interface GHLTag {
  id: string;
  name: string;
  locationId: string;
}

/**
 * Fetch all contacts from GHL with pagination.
 * Optionally filter to only goods-tagged contacts.
 */
async function fetchAllGHLContacts(opts?: { goodsOnly?: boolean }): Promise<GHLContact[]> {
  if (!GHL_ENABLED) return [];

  const allContacts: GHLContact[] = [];
  let startAfterId: string | undefined;
  let startAfter: number | undefined;
  let page = 0;
  const maxPages = 20; // Safety limit (20 × 100 = 2000 contacts max)

  try {
    while (page < maxPages) {
      let url = `/contacts/?locationId=${GHL_LOCATION_ID}&limit=100`;
      if (startAfterId && startAfter) {
        url += `&startAfter=${startAfter}&startAfterId=${startAfterId}`;
      }

      const response = await ghlRequest<{
        contacts: GHLContact[];
        meta: {
          total: number;
          startAfterId?: string;
          startAfter?: number;
          nextPage?: number;
        };
      }>(url);

      const contacts = response.contacts || [];
      if (contacts.length === 0) break;

      if (opts?.goodsOnly) {
        allContacts.push(
          ...contacts.filter((c) =>
            c.tags?.some((t) => t.startsWith('goods-'))
          )
        );
      } else {
        allContacts.push(...contacts);
      }

      // Check for next page
      if (!response.meta?.startAfterId || !response.meta?.nextPage) break;
      startAfterId = response.meta.startAfterId;
      startAfter = response.meta.startAfter;
      page++;
    }
  } catch (error) {
    console.error('[GHL] Error fetching contacts:', error);
  }

  return allContacts;
}

export interface GHLConversationSummary {
  id: string;
  contactId: string;
  /** Slim preview from the conversations list — covers SMS, email, WhatsApp, Live Chat */
  lastMessageBody: string | null;
  lastMessageType: string | null;
  lastMessageDate: string | null;
  lastMessageDirection: 'inbound' | 'outbound' | null;
  unreadCount: number;
}

/**
 * Pull the most recent conversations for a contact. One API call returns
 * last-message previews across all channels (SMS, WhatsApp, email, live chat),
 * which is exactly what we need to surface a "Recent messages" inline panel
 * without fetching full message threads.
 */
async function fetchRecentConversations(
  contactId: string,
  limit: number = 5,
): Promise<GHLConversationSummary[]> {
  if (!GHL_ENABLED) return [];
  try {
    const response = await ghlRequest<{
      conversations?: Array<{
        id?: string;
        contactId?: string;
        lastMessageBody?: string | null;
        lastMessageType?: string | null;
        lastMessageDate?: string | null;
        lastMessageDirection?: string | null;
        unreadCount?: number;
      }>;
    }>(
      `/conversations/search?locationId=${encodeURIComponent(GHL_LOCATION_ID)}&contactId=${encodeURIComponent(contactId)}&limit=${limit}`,
    );
    const conversations = response.conversations || [];
    return conversations
      .filter((c) => c.id && c.contactId)
      .map((c) => ({
        id: c.id as string,
        contactId: c.contactId as string,
        lastMessageBody: c.lastMessageBody || null,
        lastMessageType: c.lastMessageType || null,
        lastMessageDate: c.lastMessageDate || null,
        lastMessageDirection:
          c.lastMessageDirection === 'inbound' || c.lastMessageDirection === 'outbound'
            ? c.lastMessageDirection
            : null,
        unreadCount: c.unreadCount || 0,
      }));
  } catch (error) {
    console.error('[GHL] Error fetching conversations for contact:', contactId, error);
    return [];
  }
}

/**
 * Search contacts by a single tag value (e.g. "goods-asset-gb0-156-1").
 * Returns the slim contact records — caller can re-fetch full details if needed.
 *
 * Powers the reverse "which contacts are linked to this bed?" lookup that the
 * OwnersBlock uses to surface GHL-only people (e.g. someone who only WhatsApped
 * in via the support number and never claimed the bed).
 */
async function searchContactsByTag(tag: string, limit: number = 25): Promise<GHLContact[]> {
  if (!GHL_ENABLED) return [];
  try {
    const response = await ghlRequest<{ contacts?: GHLContact[] }>(
      '/contacts/search',
      'POST',
      {
        locationId: GHL_LOCATION_ID,
        pageLimit: limit,
        filters: [
          {
            field: 'tags',
            operator: 'contains',
            value: tag,
          },
        ],
      },
    );
    return response.contacts || [];
  } catch (error) {
    console.error('[GHL] Error searching contacts by tag:', tag, error);
    return [];
  }
}

/**
 * Fetch all tags from the GHL location
 */
async function fetchGHLTags(): Promise<GHLTag[]> {
  if (!GHL_ENABLED) return [];

  try {
    const response = await ghlRequest<{ tags: GHLTag[] }>(
      `/locations/${GHL_LOCATION_ID}/tags`
    );
    return response.tags || [];
  } catch (error) {
    console.error('[GHL] Error fetching tags:', error);
    return [];
  }
}

/**
 * Delete a tag by ID
 */
async function deleteGHLTag(tagId: string): Promise<boolean> {
  if (!GHL_ENABLED) return false;

  try {
    await ghlRequest(`/locations/${GHL_LOCATION_ID}/tags/${tagId}`, 'DELETE');
    return true;
  } catch (error) {
    console.error('[GHL] Error deleting tag:', tagId, error);
    return false;
  }
}

export const ghl = {
  /**
   * Check if GHL integration is enabled
   */
  isEnabled(): boolean {
    return GHL_ENABLED;
  },

  /**
   * Send an outbound SMS via the GHL Conversations API.
   * Finds or creates the contact by phone, then POSTs /conversations/messages with type=SMS.
   * Returns { success, messageId? } so callers can stamp sent_at.
   *
   * Cost: ~AU$0.05 per 160-char segment on AU mobile (Twilio rates via GHL).
   * Inbound replies to your GHL number are free; only outbound is metered.
   */
  async sendSms(opts: {
    phone: string;
    message: string;
    contactName?: string | null;
    tags?: string[];
    assetId?: string | null;
  }): Promise<GHLResponse & { messageId?: string }> {
    const phone = cleanString(opts.phone);
    const message = cleanString(opts.message);

    if (!phone || !message) {
      return { success: false, error: 'Phone and message are required' };
    }

    if (!GHL_ENABLED) {
      console.log('[GHL] Disabled — would send SMS:', { phone, message });
      return { success: true, simulated: true };
    }

    try {
      // Ensure contact exists (creates if not, returns id either way)
      const upsert = await createOrUpdateContact({
        phone,
        name: opts.contactName || undefined,
        tags: [
          'goods-bed-scan',
          ...(opts.assetId ? [tagForAsset(opts.assetId)] : []),
          ...(opts.tags || []),
        ],
        customFields: withGoodsProject({}),
        source: opts.assetId ? `Bed scan ${opts.assetId}` : 'Bed scan reminder',
      });
      const contactId = upsert.contact?.id;
      if (!contactId) {
        return { success: false, error: 'Could not resolve contact id' };
      }

      const response = await ghlRequest<{ messageId?: string; conversationId?: string }>(
        '/conversations/messages',
        'POST',
        {
          type: 'SMS',
          contactId,
          message,
        },
      );
      return { success: true, contact: { id: contactId }, messageId: response.messageId };
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('[GHL] sendSms error:', errMsg);
      return { success: false, error: errMsg };
    }
  },

  /**
   * Log an inbound Email into the contact's GHL Conversations thread so website
   * form inquiries appear in the Conversations inbox and the team can reply
   * in-thread (replies go out via the native GHL email channel). type=Email
   * requires emailFrom + emailTo but NOT a conversationProviderId (unlike the
   * Custom type). Returns the conversationId GHL created/found.
   */
  async addInboundEmail(opts: {
    contactId: string;
    fromEmail: string;
    subject: string;
    html: string;
    text?: string;
    toEmail?: string;
  }): Promise<{ success: boolean; conversationId?: string }> {
    if (!GHL_ENABLED) {
      console.log('[GHL] Disabled — would log inbound email:', opts.subject);
      return { success: true };
    }
    if (!opts.contactId || !cleanString(opts.fromEmail)) {
      return { success: false };
    }
    try {
      const res = await ghlRequest<{ conversationId?: string }>(
        '/conversations/messages/inbound',
        'POST',
        {
          type: 'Email',
          contactId: opts.contactId,
          emailFrom: opts.fromEmail,
          emailTo: opts.toEmail || 'hi@act.place',
          subject: opts.subject,
          html: opts.html,
          message: opts.text || opts.subject,
        },
      );
      return { success: true, conversationId: res.conversationId };
    } catch (error) {
      console.error('[GHL] addInboundEmail error:', error instanceof Error ? error.message : error);
      return { success: false };
    }
  },

  /**
   * Create/update contact from an order
   */
  async createOrderContact(data: OrderContactData): Promise<GHLResponse> {
    const tags = [TAGS.customer];

    // Add product-specific tags
    for (const productType of data.productTypes) {
      if (productType.includes('bed')) {
        tags.push(TAGS.bedOwner);
      }
      if (productType.includes('washing')) {
        tags.push(TAGS.washerOwner);
      }
    }

    // Add sponsor tag if sponsorship
    if (data.isSponsorship) {
      tags.push(TAGS.sponsor);
    }

    const customFields: Record<string, string> = {};
    if (CUSTOM_FIELDS.orderNumber) {
      customFields[CUSTOM_FIELDS.orderNumber] = data.orderNumber;
    }
    if (CUSTOM_FIELDS.orderTotal) {
      customFields[CUSTOM_FIELDS.orderTotal] = (data.totalCents / 100).toFixed(2);
    }
    if (CUSTOM_FIELDS.productType && data.productTypes.length > 0) {
      customFields[CUSTOM_FIELDS.productType] = data.productTypes.map(formatProductType).join(', ');
    }
    if (data.sponsoredCommunity && CUSTOM_FIELDS.community) {
      customFields[CUSTOM_FIELDS.community] = data.sponsoredCommunity;
    }
    if (data.sponsorMessage && CUSTOM_FIELDS.message) {
      customFields[CUSTOM_FIELDS.message] = data.sponsorMessage;
    }
    withGoodsProject(customFields);

    const result = await createOrUpdateContact({
      email: data.email,
      name: data.name,
      phone: data.phone,
      tags,
      customFields,
      source: data.isSponsorship ? 'Goods Sponsorship' : 'Goods Order',
    });

    // Retail orders fire a dedicated workflow; sponsorships go via the Smart
    // Router (branches on goods-sponsor). See the scaling-model note in WORKFLOWS.
    if (result.success && result.contact?.id) {
      if (data.isSponsorship) {
        await fireSmartRouter(result.contact.id);
      } else if (WORKFLOWS.newOrder) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await triggerWorkflow(WORKFLOWS.newOrder, result.contact.id);
      }
    }

    return result;
  },

  /**
   * Create/update contact from a support ticket (QR scan)
   */
  async createSupportTicketContact(data: SupportTicketData): Promise<GHLResponse> {
    const isEmail = data.userContact.includes('@');
    const isUrgent = data.priority === 'High' || data.priority === 'Urgent';

    // Tagging is how the Smart Router decides what to do. `goods-urgent` lets a
    // nested branch fire an immediate SMS to on-call; absence routes to the
    // standard ack email.
    const tags = [TAGS.supportRequest, tagForAsset(data.assetId)];
    if (isUrgent) tags.push('goods-urgent');

    const result = await createOrUpdateContact({
      email: isEmail ? data.userContact : '',
      phone: isEmail ? undefined : data.userContact,
      name: data.userName,
      tags,
      customFields: withGoodsProject({
        ...(CUSTOM_FIELDS.assetId && { [CUSTOM_FIELDS.assetId]: data.assetId }),
        ...(CUSTOM_FIELDS.community && data.community && { [CUSTOM_FIELDS.community]: data.community }),
        ...(CUSTOM_FIELDS.productType && data.productType && { [CUSTOM_FIELDS.productType]: data.productType }),
      }),
      source: 'QR Code Support Request',
    });

    // Add the ticket details as a note
    if (result.success && result.contact?.id) {
      const noteText = `
📋 Support Ticket
Asset: ${data.assetId}
Priority: ${data.priority}
Category: ${data.category || 'General'}
${data.assetConditionStatus ? `Condition: ${data.assetConditionStatus}` : ''}
${data.serviceability ? `Serviceability: ${data.serviceability}` : ''}
${data.failureCause ? `Failure cause: ${data.failureCause}` : ''}
${data.outcomeWanted ? `Outcome wanted: ${data.outcomeWanted}` : ''}
${data.oldItemDisposition ? `Old item disposition: ${data.oldItemDisposition}` : ''}
${typeof data.safetyRisk === 'boolean' ? `Safety risk: ${data.safetyRisk ? 'yes' : 'no'}` : ''}
${data.issueObservedAt ? `Observed at: ${data.issueObservedAt}` : ''}
Issue: ${data.issueDescription}
Submitted: ${new Date().toLocaleString('en-AU')}
      `.trim();

      await addContactNote(result.contact.id, noteText);

      // Smart Router branches on goods-support-request (and nested goods-urgent).
      await fireSmartRouter(result.contact.id);
    }

    return result;
  },

  /**
   * Create contact from partnership inquiry
   */
  async createPartnershipContact(data: PartnershipInquiryData): Promise<GHLResponse> {
    const isMedia = data.partnershipType === 'Media Pack Request';
    const customFields: Record<string, string> = {};
    if (CUSTOM_FIELDS.message && data.message) {
      customFields[CUSTOM_FIELDS.message] = data.message;
    }
    withGoodsProject(customFields);

    // Build segment/tier/timeline tags so Smart Router can route by
    // partner type (foundation, corporate, buyer, investor, community)
    // and by ticket size (under-25k, 25-100k, 100-500k, 500k+, loan).
    const segmentTags: string[] = [];
    if (data.partnerSegment) {
      segmentTags.push(`goods-segment-${data.partnerSegment}`);
    }
    if (data.fundingTier) {
      segmentTags.push(`goods-tier-${data.fundingTier}`);
    }
    if (data.timeline) {
      segmentTags.push(`goods-timeline-${data.timeline}`);
    }

    const result = await createOrUpdateContact({
      email: data.contactEmail,
      phone: data.contactPhone,
      name: data.contactName,
      companyName: data.organizationName,
      tags: isMedia
        ? [TAGS.mediaRequest]
        : [TAGS.partnerLead, ...segmentTags],
      customFields,
      source: isMedia ? 'Website Contact: Media Pack Request' : 'Partnership Inquiry',
    });

    // Add inquiry details as a note
    if (result.success && result.contact?.id) {
      const noteLines = [
        '🤝 Partnership Inquiry',
        `Organization: ${data.organizationName}`,
        `Type: ${data.partnershipType}`,
        data.partnerSegment ? `Segment: ${data.partnerSegment}` : null,
        data.fundingTier ? `Ticket size: ${data.fundingTier}` : null,
        data.timeline ? `Timeline: ${data.timeline}` : null,
        `Message: ${data.message || 'No message provided'}`,
        `Submitted: ${new Date().toLocaleString('en-AU')}`,
      ].filter(Boolean);
      const noteText = noteLines.join('\n');

      await addContactNote(result.contact.id, noteText);

      // Smart Router branches on goods-partner-lead OR goods-media,
      // and can now sub-branch on goods-segment-*, goods-tier-*, goods-timeline-*.
      await fireSmartRouter(result.contact.id);
    }

    return result;
  },

  /**
   * Create/update a strategic buyer, capital, or partner target from CivicGraph.
   */
  async createStrategicTargetContact(data: StrategicTargetContactData): Promise<GHLResponse> {
    const tags = [
      'goods',
      'goods-strategic-target',
      `goods-${data.targetType}-target`,
      ...(data.relationshipStatus ? [`goods-${data.relationshipStatus}`] : []),
      ...(data.tags || []),
    ];

    const result = await createOrUpdateContact({
      email: data.contactEmail,
      phone: data.contactPhone,
      name: data.contactName || data.organizationName,
      companyName: data.organizationName,
      tags,
      customFields: withGoodsProject({}),
      source: 'GrantScope Goods Workspace',
    });

    if (result.success && result.contact?.id) {
      const noteText = `
🎯 Goods Strategic Target
Target type: ${data.targetType}
Organisation: ${data.organizationName}
Source identity: ${data.sourceIdentityName || data.sourceOrgName}${data.sourceOrgAbn ? ` (ABN ${data.sourceOrgAbn})` : ''}
${data.sourceEntityGsId ? `Source graph entity: ${data.sourceEntityGsId}` : ''}
${data.communityFocusName ? `Community focus: ${data.communityFocusName}` : ''}
${data.communityFocusPostcode ? `Community postcode: ${data.communityFocusPostcode}` : ''}
${data.communityFocusState ? `Community state: ${data.communityFocusState}` : ''}
${data.regionFocus ? `Region focus: ${data.regionFocus}` : ''}
${data.relationshipStatus ? `Relationship status: ${data.relationshipStatus}` : ''}
${data.contactSurface ? `Contact surface: ${data.contactSurface}` : ''}
${data.nextAction ? `Next action: ${data.nextAction}` : ''}
${data.whyPlausible ? `Why plausible: ${data.whyPlausible}` : ''}
${data.suggestedPipelineLabel ? `Suggested pipeline: ${data.suggestedPipelineLabel}` : ''}
${data.suggestedStageLabel ? `Suggested stage: ${data.suggestedStageLabel}` : ''}
${data.sourceUrl ? `Source URL: ${data.sourceUrl}` : ''}
Synced: ${new Date().toLocaleString('en-AU')}
      `.trim();

      await addContactNote(result.contact.id, noteText);

      try {
        const opportunityResult = await createStrategicOpportunity({
          contactId: result.contact.id,
          organizationName: data.organizationName,
          targetType: data.targetType,
          communityFocusName: data.communityFocusName,
          communityFocusPostcode: data.communityFocusPostcode,
          communityFocusState: data.communityFocusState,
          nextAction: data.nextAction,
          whyPlausible: data.whyPlausible,
          suggestedPipelineLabel: data.suggestedPipelineLabel,
          suggestedStageLabel: data.suggestedStageLabel,
        });

        return {
          ...result,
          opportunity: opportunityResult.opportunity || undefined,
          opportunityCreated: opportunityResult.opportunityCreated,
          pipelineConfigured: opportunityResult.pipelineConfigured,
          simulated: result.simulated || opportunityResult.simulated,
        };
      } catch (error) {
        console.error('[GHL] Error creating strategic opportunity:', error);
        return {
          ...result,
          opportunityCreated: false,
          pipelineConfigured: Boolean(await resolveStrategicPipelineConfig(data.targetType)),
        };
      }
    }

    return result;
  },

  /**
   * Append a free-form note to a contact (timeline entry visible in GHL).
   * Use when a feedback/story/pulse event needs context attached to the customer record.
   */
  async addNote(contactId: string, note: string): Promise<boolean> {
    return addContactNote(contactId, note);
  },

  /** Add one or more tags to an existing contact (idempotent in GHL). */
  async addTags(contactId: string, tags: string[]): Promise<boolean> {
    return addContactTags(contactId, tags);
  },

  /**
   * Add contact to newsletter. Accepts email, phone, or both — at least one
   * required. Phone-only signups (e.g. airport QR scans where someone gave a
   * number not an email) get the same goods-newsletter + goods-src-<tag>
   * tagging as email signups; the Smart Router branches on the source tag, not
   * the channel.
   *
   * Per the Option B scaling decision (2026-05-22), this method does NOT
   * carry event-specific copy or workflow IDs. All event acknowledgements
   * (Parliament House, Canberra Airport, future pop-ups) are configured as
   * Smart Router branches in the GHL dashboard, keyed on the
   * `goods-src-<tag>` tag. Adding a new event = pass a new `tag` value from
   * the form + add a Smart Router branch. Zero code change.
   *
   * Backward-compatible: the legacy positional signature
   * `addToNewsletter(email, name?, tag?)` still works.
   */
  async addToNewsletter(
    optsOrEmail: { email?: string; phone?: string; name?: string; tag?: string } | string,
    name?: string,
    tag?: string,
  ): Promise<GHLResponse> {
    const opts = typeof optsOrEmail === 'string'
      ? { email: optsOrEmail, name, tag }
      : optsOrEmail;

    const email = cleanString(opts.email);
    const phone = cleanString(opts.phone);
    const sourceTag = opts.tag;

    if (!email && !phone) {
      return { success: false, error: 'Email or phone is required' };
    }

    const tags = [TAGS.newsletter];
    if (sourceTag) tags.push(`goods-src-${sourceTag}`);

    const result = await createOrUpdateContact({
      email,
      phone,
      name: opts.name,
      tags,
      customFields: withGoodsProject({}),
      source: sourceTag ? `Newsletter Signup (${sourceTag})` : 'Newsletter Signup',
    });

    if (result.success && result.contact?.id) {
      await fireSmartRouter(result.contact.id);
    }

    return result;
  },

  /**
   * Create/update contact from a general inquiry (not a newsletter signup)
   */
  async createInquiryContact(
    email: string,
    name?: string,
    tags?: string[],
    opts?: { phone?: string; companyName?: string; message?: string; source?: string },
  ): Promise<GHLResponse> {
    const customFields = withGoodsProject({});
    // Stash the inquiry text in the shared `message` field so it is mergeable
    // into the internal-notification email body. GHL Notes are NOT mergeable;
    // standard fields (phone, companyName) and custom fields are.
    if (CUSTOM_FIELDS.message && opts?.message) {
      customFields[CUSTOM_FIELDS.message] = opts.message;
    }
    return createOrUpdateContact({
      email,
      name,
      phone: opts?.phone,
      companyName: opts?.companyName,
      tags: ['goods-inquiry', ...(tags || [])],
      customFields,
      // Source encodes the specific form (e.g. "Website Contact: General
      // Inquiry") so {{contact.source}} on the opportunity shows which form it
      // came from. Falls back to the generic value for non-form callers.
      source: opts?.source || 'Website Inquiry',
    });
  },

  // ==========================================================================
  // USER ACCOUNT METHODS (for claim flow, messages, requests)
  // ==========================================================================

  /**
   * Create/update contact when a recipient claims their bed/washer
   */
  async createRecipientContact(data: RecipientClaimData): Promise<GHLResponse> {
    const isBed = data.productType.toLowerCase().includes('bed');
    const isWasher = data.productType.toLowerCase().includes('wash') ||
                     data.productType.toLowerCase().includes('machine');

    const tags = [TAGS.recipient, tagForAsset(data.assetId)];
    if (isBed) tags.push(TAGS.claimedBed);
    if (isWasher) tags.push(TAGS.claimedWasher);

    const customFields: Record<string, string> = {};
    if (CUSTOM_FIELDS.assetId) {
      customFields[CUSTOM_FIELDS.assetId] = data.assetId;
    }
    if (CUSTOM_FIELDS.productType) {
      customFields[CUSTOM_FIELDS.productType] = data.productType;
    }
    if (CUSTOM_FIELDS.community) {
      customFields[CUSTOM_FIELDS.community] = data.community;
    }
    withGoodsProject(customFields);

    const result = await createOrUpdateContact({
      email: '', // Phone-based users may not have email
      phone: data.phone,
      name: data.name,
      tags,
      customFields,
      source: 'QR Code Claim',
    });

    // Add claim details as a note
    if (result.success && result.contact?.id) {
      const noteText = `
🛏️ Asset Claimed
Asset ID: ${data.assetId}
Product: ${data.productType}
Community: ${data.community}
Claimed: ${new Date().toLocaleString('en-AU')}
      `.trim();

      await addContactNote(result.contact.id, noteText);

      // Smart Router branches on goods-recipient.
      await fireSmartRouter(result.contact.id);
    }

    return result;
  },

  /**
   * Update existing contact with additional claim (user claims another item)
   */
  async updateContactWithClaim(
    phone: string,
    assetId: string,
    productType: string,
    community: string
  ): Promise<GHLResponse> {
    const isBed = productType.toLowerCase().includes('bed');
    const isWasher = productType.toLowerCase().includes('wash') ||
                     productType.toLowerCase().includes('machine');

    const tags: string[] = [tagForAsset(assetId)];
    if (isBed) tags.push(TAGS.claimedBed);
    if (isWasher) tags.push(TAGS.claimedWasher);

    const result = await createOrUpdateContact({
      email: '',
      phone,
      tags,
      customFields: withGoodsProject({}),
      source: 'QR Code Claim',
    });

    // Add claim as a note
    if (result.success && result.contact?.id) {
      const noteText = `
🛏️ Additional Asset Claimed
Asset ID: ${assetId}
Product: ${productType}
Community: ${community}
Claimed: ${new Date().toLocaleString('en-AU')}
      `.trim();

      await addContactNote(result.contact.id, noteText);
    }

    return result;
  },

  /**
   * Log an inbound message from a user
   */
  async logInboundMessage(data: UserMessageData): Promise<GHLResponse> {
    const tags = [TAGS.userMessage];
    if (data.assetId) tags.push(tagForAsset(data.assetId));

    const result = await createOrUpdateContact({
      email: '',
      phone: data.phone,
      name: data.name,
      tags,
      customFields: withGoodsProject({}),
      source: 'User Message',
    });

    if (result.success && result.contact?.id) {
      const noteText = `
User Message
${data.assetId ? `Asset: ${data.assetId}` : ''}
${data.community ? `Community: ${data.community}` : ''}
Message: ${data.message}
Sent: ${new Date().toLocaleString('en-AU')}
      `.trim();

      await addContactNote(result.contact.id, noteText);

      // Smart Router branches on goods-user-message.
      await fireSmartRouter(result.contact.id);
    }

    return result;
  },

  /**
   * Log a user request (blanket, pillow, parts, etc.)
   */
  async logUserRequest(data: UserRequestData): Promise<GHLResponse> {
    const tags = [TAGS.userRequest];
    if (data.assetId) tags.push(tagForAsset(data.assetId));
    // Request-type tag lets the Smart Router branch on what's being asked for
    // (blanket, pillow, parts, etc.) without code changes.
    if (data.requestType) {
      tags.push(`goods-user-request-${data.requestType.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`);
    }

    const result = await createOrUpdateContact({
      email: '',
      phone: data.phone,
      name: data.name,
      tags,
      customFields: withGoodsProject({}),
      source: 'User Request',
    });

    if (result.success && result.contact?.id) {
      const noteText = `
User Request
Type: ${data.requestType}
${data.assetId ? `Asset: ${data.assetId}` : ''}
${data.productType ? `Product: ${data.productType}` : ''}
${data.community ? `Community: ${data.community}` : ''}
${data.description ? `Details: ${data.description}` : ''}
Submitted: ${new Date().toLocaleString('en-AU')}
      `.trim();

      await addContactNote(result.contact.id, noteText);

      // Smart Router branches on goods-user-request (+ optional sub-tag).
      await fireSmartRouter(result.contact.id);
    }

    return result;
  },

  /**
   * Log event when GHL is disabled (for debugging)
   */
  logEvent(eventType: string, data: Record<string, unknown>): void {
    console.log('[GHL Event]', {
      type: eventType,
      timestamp: new Date().toISOString(),
      enabled: GHL_ENABLED,
      data,
    });
  },

  /**
   * Fetch all contacts (optionally goods-tagged only)
   */
  async getContacts(opts?: { goodsOnly?: boolean }): Promise<GHLContact[]> {
    return fetchAllGHLContacts(opts);
  },

  /**
   * Reverse lookup: which GHL contacts are linked to a given bed/machine?
   * Returns contacts tagged with the per-asset tag (goods-asset-{slug}).
   * Use this in admin views to surface people who exist in GHL but not in our v2 DB
   * (e.g. someone who messaged the support number without claiming via QR).
   */
  async findContactsByAssetId(assetId: string, limit: number = 25): Promise<GHLContact[]> {
    return searchContactsByTag(tagForAsset(assetId), limit);
  },

  /**
   * Generic tag-based contact search. Used by the admin reach-out tool to
   * preview / dispatch to curated smart lists.
   */
  async findContactsByTag(tag: string, limit: number = 250): Promise<GHLContact[]> {
    return searchContactsByTag(tag, limit);
  },

  /**
   * Recent SMS / WhatsApp / email previews for a single contact.
   * One API call, last-message bodies inline — meant for an admin "Recent messages"
   * teaser, not a full thread viewer (use the GHL deep link for that).
   */
  async getRecentConversations(contactId: string, limit: number = 5): Promise<GHLConversationSummary[]> {
    return fetchRecentConversations(contactId, limit);
  },

  /**
   * Fetch all tags for the location
   */
  async getTags(): Promise<GHLTag[]> {
    return fetchGHLTags();
  },

  /**
   * Delete a tag by ID (for cleanup)
   */
  async deleteTag(tagId: string): Promise<boolean> {
    return deleteGHLTag(tagId);
  },
};

export default ghl;

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
};

// Workflow IDs (configure in GHL dashboard)
const WORKFLOWS = {
  newOrder: process.env.GHL_WORKFLOW_NEW_ORDER || '',
  newSponsor: process.env.GHL_WORKFLOW_NEW_SPONSOR || '',
  newPartnership: process.env.GHL_WORKFLOW_NEW_PARTNERSHIP || '',
  supportTicket: process.env.GHL_WORKFLOW_SUPPORT_TICKET || '',
  highPriorityTicket: process.env.GHL_WORKFLOW_HIGH_PRIORITY || '',
  // User account workflows
  newClaim: process.env.GHL_WORKFLOW_NEW_CLAIM || '',
  userMessage: process.env.GHL_WORKFLOW_USER_MESSAGE || '',
  userRequest: process.env.GHL_WORKFLOW_USER_REQUEST || '',
  // Event-specific workflows
  parliamentHouse: process.env.GHL_WORKFLOW_PARLIAMENT_HOUSE || '',
};

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

export const ghl = {
  /**
   * Check if GHL integration is enabled
   */
  isEnabled(): boolean {
    return GHL_ENABLED;
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

    const result = await createOrUpdateContact({
      email: data.email,
      name: data.name,
      phone: data.phone,
      tags,
      customFields,
      source: data.isSponsorship ? 'Goods Sponsorship' : 'Goods Order',
    });

    // Trigger appropriate workflow
    if (result.success && result.contact?.id) {
      const workflowId = data.isSponsorship ? WORKFLOWS.newSponsor : WORKFLOWS.newOrder;
      if (workflowId) {
        // Small delay to ensure custom fields are propagated in GHL before workflow runs
        await new Promise(resolve => setTimeout(resolve, 2000));
        await triggerWorkflow(workflowId, result.contact.id);
      }
    }

    return result;
  },

  /**
   * Create/update contact from a support ticket (QR scan)
   */
  async createSupportTicketContact(data: SupportTicketData): Promise<GHLResponse> {
    const isEmail = data.userContact.includes('@');

    const result = await createOrUpdateContact({
      email: isEmail ? data.userContact : '',
      phone: isEmail ? undefined : data.userContact,
      name: data.userName,
      tags: [TAGS.supportRequest],
      customFields: {
        ...(CUSTOM_FIELDS.assetId && { [CUSTOM_FIELDS.assetId]: data.assetId }),
        ...(CUSTOM_FIELDS.community && data.community && { [CUSTOM_FIELDS.community]: data.community }),
        ...(CUSTOM_FIELDS.productType && data.productType && { [CUSTOM_FIELDS.productType]: data.productType }),
      },
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

      // Trigger appropriate workflow
      const workflowId = ['High', 'Urgent'].includes(data.priority)
        ? WORKFLOWS.highPriorityTicket
        : WORKFLOWS.supportTicket;

      if (workflowId) {
        await triggerWorkflow(workflowId, result.contact.id);
      }
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

    const result = await createOrUpdateContact({
      email: data.contactEmail,
      phone: data.contactPhone,
      name: data.contactName,
      companyName: data.organizationName,
      tags: isMedia ? [TAGS.mediaRequest] : [TAGS.partnerLead],
      customFields,
      source: isMedia ? 'Media Pack Request' : 'Partnership Inquiry',
    });

    // Add inquiry details as a note
    if (result.success && result.contact?.id) {
      const noteText = `
🤝 Partnership Inquiry
Organization: ${data.organizationName}
Type: ${data.partnershipType}
Message: ${data.message || 'No message provided'}
Submitted: ${new Date().toLocaleString('en-AU')}
      `.trim();

      await addContactNote(result.contact.id, noteText);

      // Trigger workflow
      if (WORKFLOWS.newPartnership) {
        await triggerWorkflow(WORKFLOWS.newPartnership, result.contact.id);
      }
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
   * Add contact to newsletter
   */
  async addToNewsletter(email: string, name?: string, tag?: string): Promise<GHLResponse> {
    const tags = [TAGS.newsletter];
    if (tag) tags.push(`goods-src-${tag}`);
    const result = await createOrUpdateContact({
      email,
      name,
      tags,
      source: tag ? `Newsletter Signup (${tag})` : 'Newsletter Signup',
    });

    // Trigger event-specific workflows
    if (result.success && result.contact?.id) {
      if (tag === 'parliament-house-demo' && WORKFLOWS.parliamentHouse) {
        await triggerWorkflow(WORKFLOWS.parliamentHouse, result.contact.id);
      }
    }

    return result;
  },

  /**
   * Create/update contact from a general inquiry (not a newsletter signup)
   */
  async createInquiryContact(email: string, name?: string, tags?: string[]): Promise<GHLResponse> {
    return createOrUpdateContact({
      email,
      name,
      tags: ['goods-inquiry', ...(tags || [])],
      source: 'Website Inquiry',
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

    const tags = [TAGS.recipient];
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

      // Trigger claim workflow
      if (WORKFLOWS.newClaim) {
        await triggerWorkflow(WORKFLOWS.newClaim, result.contact.id);
      }
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

    const tags: string[] = [];
    if (isBed) tags.push(TAGS.claimedBed);
    if (isWasher) tags.push(TAGS.claimedWasher);

    const result = await createOrUpdateContact({
      email: '',
      phone,
      tags,
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
    const result = await createOrUpdateContact({
      email: '',
      phone: data.phone,
      name: data.name,
      source: 'User Message',
    });

    if (result.success && result.contact?.id) {
      const noteText = `
💬 User Message
${data.assetId ? `Asset: ${data.assetId}` : ''}
${data.community ? `Community: ${data.community}` : ''}
Message: ${data.message}
Sent: ${new Date().toLocaleString('en-AU')}
      `.trim();

      await addContactNote(result.contact.id, noteText);

      // Trigger message workflow
      if (WORKFLOWS.userMessage) {
        await triggerWorkflow(WORKFLOWS.userMessage, result.contact.id);
      }
    }

    return result;
  },

  /**
   * Log a user request (blanket, pillow, parts, etc.)
   */
  async logUserRequest(data: UserRequestData): Promise<GHLResponse> {
    const result = await createOrUpdateContact({
      email: '',
      phone: data.phone,
      name: data.name,
      source: 'User Request',
    });

    if (result.success && result.contact?.id) {
      const noteText = `
📋 User Request
Type: ${data.requestType}
${data.assetId ? `Asset: ${data.assetId}` : ''}
${data.productType ? `Product: ${data.productType}` : ''}
${data.community ? `Community: ${data.community}` : ''}
${data.description ? `Details: ${data.description}` : ''}
Submitted: ${new Date().toLocaleString('en-AU')}
      `.trim();

      await addContactNote(result.contact.id, noteText);

      // Trigger request workflow
      if (WORKFLOWS.userRequest) {
        await triggerWorkflow(WORKFLOWS.userRequest, result.contact.id);
      }
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
};

export default ghl;

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

// Feature flag
const GHL_ENABLED = process.env.GHL_ENABLED === 'true' && !!GHL_API_KEY && !!GHL_LOCATION_ID;

// Custom field IDs (configure in GHL dashboard)
const CUSTOM_FIELDS = {
  assetId: process.env.GHL_FIELD_ASSET_ID || '',
  productType: process.env.GHL_FIELD_PRODUCT_TYPE || '',
  community: process.env.GHL_FIELD_COMMUNITY || '',
  orderNumber: process.env.GHL_FIELD_ORDER_NUMBER || '',
  orderTotal: process.env.GHL_FIELD_ORDER_TOTAL || '',
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
};

// Tags
const TAGS = {
  customer: 'goods-customer',
  sponsor: 'goods-sponsor',
  bedOwner: 'bed-owner',
  washerOwner: 'washer-owner',
  partnerLead: 'goods-partner-lead',
  mediaRequest: 'goods-media',
  supportRequest: 'support-request',
  newsletter: 'goods-newsletter',
  // User account tags
  recipient: 'goods-recipient',
  claimedBed: 'claimed-bed',
  claimedWasher: 'claimed-washer',
};

interface GHLResponse {
  success: boolean;
  contact?: {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
  };
  error?: string;
  simulated?: boolean;
}

interface ContactData {
  email: string;
  name?: string;
  phone?: string;
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
  if (!GHL_ENABLED) {
    console.log('[GHL] Disabled - would create contact:', data.email);
    return { success: true, simulated: true };
  }

  try {
    // Try to find existing contact
    const existingContact = await findContact(data.email);

    const contactData: Record<string, unknown> = {
      locationId: GHL_LOCATION_ID,
      email: data.email,
      name: data.name,
      phone: data.phone,
      tags: data.tags || [],
      source: data.source || 'Goods on Country Website',
    };

    // Add custom fields if configured
    if (data.customFields && Object.keys(data.customFields).length > 0) {
      contactData.customField = data.customFields;
    }

    let response;
    if (existingContact) {
      // Update existing contact
      response = await ghlRequest<{ contact: { id: string } }>(
        `/contacts/${existingContact.id}`,
        'PUT',
        contactData
      );
    } else {
      // Create new contact
      response = await ghlRequest<{ contact: { id: string } }>(
        '/contacts/',
        'POST',
        contactData
      );
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
    const result = await createOrUpdateContact({
      email: data.contactEmail,
      phone: data.contactPhone,
      name: data.contactName,
      tags: isMedia ? [TAGS.mediaRequest] : [TAGS.partnerLead],
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
   * Add contact to newsletter
   */
  async addToNewsletter(email: string, name?: string): Promise<GHLResponse> {
    return createOrUpdateContact({
      email,
      name,
      tags: [TAGS.newsletter],
      source: 'Newsletter Signup',
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

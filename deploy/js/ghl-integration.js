// ============================================================================
// GO HIGH LEVEL INTEGRATION MODULE
// ============================================================================
// This module handles all communication with Go High Level for:
// - Creating/updating contacts when users claim items
// - Sending messages and requests to GHL
// - Triggering workflows
// ============================================================================

const GHL = {
  // ============================================================================
  // CONFIGURATION - Update these when your GHL number is approved
  // ============================================================================
  config: {
    apiKey: '',           // Your GHL API Key
    locationId: '',       // Your GHL Location ID
    baseUrl: 'https://services.leadconnectorhq.com',

    // Set to true when ready to enable GHL integration
    enabled: false,

    // Custom field IDs in GHL (map these to your GHL custom fields)
    customFields: {
      assetId: '',        // Custom field for Asset ID
      product: '',        // Custom field for Product type
      community: '',      // Custom field for Community
      claimedAt: ''       // Custom field for Claim date
    },

    // Tag IDs to apply in GHL
    tags: {
      bedOwner: 'bed-owner',
      washerOwner: 'washer-owner',
      newClaim: 'new-claim'
    },

    // Pipeline/workflow IDs
    workflows: {
      newClaim: '',       // Workflow to trigger on new claim
      newRequest: '',     // Workflow to trigger on new request
      newMessage: ''      // Workflow to trigger on new message
    }
  },

  // ============================================================================
  // INITIALIZE
  // ============================================================================
  init(config = {}) {
    Object.assign(this.config, config);

    // Check if we have minimum required config
    if (this.config.apiKey && this.config.locationId) {
      this.config.enabled = true;
      console.log('GHL Integration enabled');
    } else {
      console.log('GHL Integration disabled - missing API key or location ID');
    }
  },

  // ============================================================================
  // API HELPER
  // ============================================================================
  async apiRequest(endpoint, method = 'GET', body = null) {
    if (!this.config.enabled) {
      console.log('GHL disabled, skipping:', endpoint);
      return { success: false, reason: 'disabled' };
    }

    try {
      const options = {
        method,
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        }
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.config.baseUrl}${endpoint}`, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GHL API Error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GHL API Error:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================================================================
  // CONTACT MANAGEMENT
  // ============================================================================

  // Find contact by phone number
  async findContactByPhone(phone) {
    const response = await this.apiRequest(
      `/contacts/search/duplicate?locationId=${this.config.locationId}&phone=${encodeURIComponent(phone)}`
    );
    return response.contact || null;
  },

  // Create or update contact when user claims an item
  async createOrUpdateContact(userData, assetData) {
    if (!this.config.enabled) {
      console.log('GHL disabled - would create contact:', userData.phone);
      return { success: true, simulated: true };
    }

    try {
      // Try to find existing contact
      let contact = await this.findContactByPhone(userData.phone);

      const isBed = assetData.product?.toLowerCase().includes('bed');
      const isWasher = assetData.product?.toLowerCase().includes('washing');

      const contactData = {
        locationId: this.config.locationId,
        phone: userData.phone,
        name: userData.display_name || assetData.name || 'User',
        tags: [
          this.config.tags.newClaim,
          isBed ? this.config.tags.bedOwner : '',
          isWasher ? this.config.tags.washerOwner : ''
        ].filter(Boolean),
        customField: {}
      };

      // Add custom fields if configured
      if (this.config.customFields.assetId) {
        contactData.customField[this.config.customFields.assetId] = assetData.unique_id;
      }
      if (this.config.customFields.product) {
        contactData.customField[this.config.customFields.product] = assetData.product;
      }
      if (this.config.customFields.community) {
        contactData.customField[this.config.customFields.community] = assetData.community;
      }
      if (this.config.customFields.claimedAt) {
        contactData.customField[this.config.customFields.claimedAt] = new Date().toISOString();
      }

      let response;
      if (contact) {
        // Update existing contact
        response = await this.apiRequest(
          `/contacts/${contact.id}`,
          'PUT',
          contactData
        );
      } else {
        // Create new contact
        response = await this.apiRequest(
          '/contacts/',
          'POST',
          contactData
        );
      }

      // Trigger new claim workflow if configured
      if (this.config.workflows.newClaim && response.contact?.id) {
        await this.triggerWorkflow(this.config.workflows.newClaim, response.contact.id);
      }

      return { success: true, contact: response.contact };
    } catch (error) {
      console.error('Error creating/updating GHL contact:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================================================================
  // MESSAGING
  // ============================================================================

  // Send a message to GHL (creates conversation)
  async sendMessage(contactPhone, message, assetId = null) {
    if (!this.config.enabled) {
      console.log('GHL disabled - would send message to:', contactPhone);
      return { success: true, simulated: true };
    }

    try {
      // Find or create contact
      let contact = await this.findContactByPhone(contactPhone);

      if (!contact) {
        // Create minimal contact
        const createResponse = await this.apiRequest('/contacts/', 'POST', {
          locationId: this.config.locationId,
          phone: contactPhone
        });
        contact = createResponse.contact;
      }

      if (!contact?.id) {
        throw new Error('Could not find or create contact');
      }

      // Create conversation message
      const response = await this.apiRequest(
        `/conversations/messages`,
        'POST',
        {
          type: 'SMS',
          contactId: contact.id,
          message: message,
          // Note: This creates an inbound message in GHL from the user
          direction: 'inbound'
        }
      );

      // Trigger message workflow if configured
      if (this.config.workflows.newMessage) {
        await this.triggerWorkflow(this.config.workflows.newMessage, contact.id);
      }

      return { success: true, message: response };
    } catch (error) {
      console.error('Error sending message to GHL:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================================================================
  // REQUESTS
  // ============================================================================

  // Log a user request in GHL
  async logRequest(contactPhone, requestType, assetId, details = '') {
    if (!this.config.enabled) {
      console.log('GHL disabled - would log request:', requestType);
      return { success: true, simulated: true };
    }

    try {
      // Find contact
      let contact = await this.findContactByPhone(contactPhone);

      if (!contact) {
        console.warn('Contact not found for request:', contactPhone);
        return { success: false, error: 'Contact not found' };
      }

      // Format request as a note/task in GHL
      const requestLabels = {
        'blanket': 'Blanket Request',
        'pillow': 'Pillow Request',
        'parts': 'Parts Request',
        'checkin': 'Check-in Request',
        'pickup': 'Pickup Request',
        'other': 'Other Request'
      };

      const noteText = `
📦 ${requestLabels[requestType] || 'Request'}
Asset: ${assetId}
Details: ${details || 'None provided'}
Submitted: ${new Date().toLocaleString('en-AU')}
      `.trim();

      // Add as a note to the contact
      await this.apiRequest(
        `/contacts/${contact.id}/notes`,
        'POST',
        {
          body: noteText
        }
      );

      // Also send as a message for visibility
      await this.apiRequest(
        `/conversations/messages`,
        'POST',
        {
          type: 'SMS',
          contactId: contact.id,
          message: noteText,
          direction: 'inbound'
        }
      );

      // Trigger request workflow if configured
      if (this.config.workflows.newRequest) {
        await this.triggerWorkflow(this.config.workflows.newRequest, contact.id);
      }

      return { success: true };
    } catch (error) {
      console.error('Error logging request to GHL:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================================================================
  // WORKFLOWS
  // ============================================================================

  async triggerWorkflow(workflowId, contactId) {
    if (!workflowId) return { success: false, reason: 'No workflow ID' };

    try {
      const response = await this.apiRequest(
        `/contacts/${contactId}/workflow/${workflowId}`,
        'POST'
      );
      return { success: true, response };
    } catch (error) {
      console.error('Error triggering workflow:', error);
      return { success: false, error: error.message };
    }
  },

  // ============================================================================
  // EVENT LOGGING (for debugging/fallback)
  // ============================================================================

  // Log events locally when GHL is disabled
  logEvent(eventType, data) {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      data
    };

    console.log('GHL Event:', event);

    // Could store in localStorage for debugging
    try {
      const events = JSON.parse(localStorage.getItem('ghl_events') || '[]');
      events.push(event);
      // Keep last 50 events
      if (events.length > 50) events.shift();
      localStorage.setItem('ghl_events', JSON.stringify(events));
    } catch (e) {
      // Ignore storage errors
    }

    return event;
  }
};

// Export for use in other files
window.GHL = GHL;

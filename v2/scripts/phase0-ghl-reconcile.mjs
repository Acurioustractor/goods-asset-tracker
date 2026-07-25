/**
 * Phase 0: reconcile community/partner communication enrolments in HighLevel.
 *
 * Dry-run by default:
 *   node --env-file=.env.local scripts/phase0-ghl-reconcile.mjs
 *
 * Apply the reviewed changes:
 *   node --env-file=.env.local scripts/phase0-ghl-reconcile.mjs --apply
 *
 * Scope is deliberately explicit. This script does not delete or merge records.
 * It removes unsupported automated-send tags, marks newsletter consent as No
 * pending fresh evidence, preserves identity/relationship tags, and turns the
 * Shed chair role record into the verified Michelle Bates contact.
 */

const APPLY = process.argv.includes('--apply');
const BASE = 'https://services.leadconnectorhq.com';
const API_KEY = process.env.GHL_API_KEY;
const LOCATION_ID = process.env.GHL_LOCATION_ID;

if (!API_KEY || !LOCATION_ID) {
  console.error('Missing GHL_API_KEY or GHL_LOCATION_ID');
  process.exit(1);
}

const HEADERS = {
  Authorization: `Bearer ${API_KEY}`,
  Version: '2021-07-28',
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const TARGETS = [
  {
    email: 'chair@ourshed.org',
    expectedCompany: 'Our Community Shed',
    update: {
      firstName: 'Michelle',
      lastName: 'Bates',
      name: 'Michelle Bates',
      phone: '+61438333131',
      companyName: 'Our Community Shed Inc.',
    },
    addTags: ['project:act-gd', 'role:partner', 'role:community', 'lane:community', 'place:tennant-creek'],
  },
  {
    email: 'secretary@ourshed.org',
    expectedCompany: 'Our Community Shed',
    addTags: ['project:act-gd', 'role:partner', 'role:community', 'lane:community', 'place:tennant-creek'],
  },
  {
    email: 'treasurer@ourshed.org',
    expectedCompany: 'Our Community Shed',
    addTags: ['project:act-gd', 'role:partner', 'role:community', 'lane:community', 'place:tennant-creek'],
  },
  {
    email: 'coordinator@ourshed.org',
    expectedCompany: 'Our Community Shed',
    addTags: ['project:act-gd', 'role:partner', 'role:community', 'lane:community', 'place:tennant-creek'],
    removeTags: ['role:funder', 'philanthropic', 'cultivate'],
  },
  {
    email: 'scarlettsteven@dusseldorp.org.au',
    expectedCompany: 'Dusseldorp Forum',
  },
  {
    email: 'jessicaduffy@dusseldorp.org.au',
    expectedCompany: 'Dusseldorp Forum',
  },
  {
    email: 'margotbeach@dusseldorp.org.au',
    expectedCompany: 'Dusseldorp Forum',
  },
  {
    email: 'rachelfyfe@dusseldorp.org.au',
    expectedCompany: 'Dusseldorp Forum',
  },
  {
    email: 'teya@dusseldorp.org.au',
    expectedCompany: 'Dusseldorp Forum',
  },
  {
    email: 'v.palmer@unimelb.edu.au',
    expectedCompany: 'University of Melbourne',
  },
];

const AUTOMATION_PREFIXES = [
  'comms:',
  'newsletter-stream:',
];

const AUTOMATION_TAGS = new Set([
  'goods-newsletter',
  'campaign-stage:captured-newsletter-nurture',
  'campaign-stage:personal-invite',
  'campaign-stage:future-city-partner',
]);

async function request(method, path, body) {
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: HEADERS,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${method} ${path} failed (${response.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

async function findExactContact(email) {
  const data = await request(
    'GET',
    `/contacts/?locationId=${encodeURIComponent(LOCATION_ID)}&query=${encodeURIComponent(email)}&limit=20`
  );
  return (data.contacts || []).find((contact) => contact.email?.toLowerCase() === email.toLowerCase()) || null;
}

function contactName(contact) {
  return contact.contactName || [contact.firstName, contact.lastName].filter(Boolean).join(' ');
}

function unsupportedTags(tags, target) {
  return [...new Set([
    ...tags.filter((tag) =>
      AUTOMATION_PREFIXES.some((prefix) => tag.startsWith(prefix)) || AUTOMATION_TAGS.has(tag)
    ),
    ...(target.removeTags || []),
  ])];
}

async function main() {
  const customFieldData = await request('GET', `/locations/${LOCATION_ID}/customFields`);
  const customFields = customFieldData.customFields || [];
  const newsletterField = customFields.find((field) => field.fieldKey === 'contact.newsletter_consent');
  const consentSourceField = customFields.find((field) => field.fieldKey === 'contact.consent_source');

  if (!newsletterField || !consentSourceField) {
    throw new Error('Newsletter Consent or Consent Source custom field is missing in HighLevel');
  }

  const report = {
    mode: APPLY ? 'apply' : 'dry-run',
    runAt: new Date().toISOString(),
    changed: [],
    unchanged: [],
    missing: [],
  };

  for (const target of TARGETS) {
    const contact = await findExactContact(target.email);
    if (!contact) {
      report.missing.push({ email: target.email });
      continue;
    }

    if (
      target.expectedCompany &&
      contact.companyName &&
      contact.companyName.toLowerCase() !== target.expectedCompany.toLowerCase()
    ) {
      throw new Error(
        `Company mismatch for ${target.email}: expected ${target.expectedCompany}, found ${contact.companyName}`
      );
    }

    const removeTags = unsupportedTags(contact.tags || [], target);
    const addTags = (target.addTags || []).filter((tag) => !(contact.tags || []).includes(tag));
    const update = {
      ...(target.update || {}),
      customFields: [
        { id: newsletterField.id, value: 'No' },
        {
          id: consentSourceField.id,
          value: 'Phase 0 audit 2026-07-24: prior automated-send enrolment had no source/timestamp evidence; fresh purpose-specific opt-in required.',
        },
      ],
    };

    const summary = {
      id: contact.id,
      email: target.email,
      beforeName: contactName(contact),
      afterName: target.update?.name || contactName(contact),
      removeTags,
      addTags,
      newsletterConsent: 'No pending fresh evidence',
    };

    if (removeTags.length === 0 && addTags.length === 0 && !target.update) {
      report.unchanged.push(summary);
      continue;
    }

    if (APPLY) {
      if (removeTags.length > 0) {
        await request('DELETE', `/contacts/${contact.id}/tags`, { tags: removeTags });
      }
      if (addTags.length > 0) {
        await request('POST', `/contacts/${contact.id}/tags`, { tags: addTags });
      }
      await request('PUT', `/contacts/${contact.id}`, update);
      await request('POST', `/contacts/${contact.id}/notes`, {
        body:
          'Phase 0 consent reconciliation, 24 July 2026. Removed automated communication enrolments that lacked visible consent source and timestamp. Newsletter consent set to No pending a fresh purpose-specific opt-in. Identity and relationship history retained.',
      });
    }

    report.changed.push(summary);
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

import { NextRequest, NextResponse } from 'next/server';

const GHL_API_KEY = process.env.GHL_API_KEY || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';
const GHL_ENABLED = process.env.GHL_ENABLED === 'true' && !!GHL_API_KEY && !!GHL_LOCATION_ID;

const EMAIL_BODY = `Hi {{contact.first_name}},

Great to meet you at Parliament House today.

That Stretch Bed you scanned? It started as recycled plastic collected from remote communities, was pressed into legs, paired with galvanised steel poles and heavy-duty canvas, and assembled right here for the event.

We've delivered 400+ beds across 8 communities — from Palm Island to Tennant Creek to Utopia Homelands. Each one is tracked from manufacture to delivery (you saw how that works when you scanned the QR code).

But beds are just the start. We're also building:

→ Pakkimjalki Kari — a washing machine named in Warumungu language by Elder Dianne Stokes, built to last 10-15 years (not 1-2)

→ On-country manufacturing — community-owned factories that create local jobs and turn waste plastic into essential goods

If any of this resonates — whether you're interested in sponsoring beds, exploring a partnership, or just want to learn more — I'd love to have a quick yarn.

Just reply to this email or visit goodsoncountry.com

Cheers,
Benjamin Knight
Goods on Country
goodsoncountry.com`;

const SMS_BODY = `Hi {{contact.first_name}}, thanks for checking out the Stretch Bed at Parliament House! Every bed diverts 20kg of plastic from landfill and is built to last 10+ years in remote communities. Would love to have a yarn about how you could get involved — reply here or email ben@goodsoncountry.com - Ben, Goods on Country`;

async function ghlRequest(endpoint: string, method: string, body?: Record<string, unknown>) {
  const response = await fetch(`https://services.leadconnectorhq.com${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${GHL_API_KEY}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return response;
}

export async function POST(request: NextRequest) {
  // Simple auth check — require admin key
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (key !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!GHL_ENABLED) {
    return NextResponse.json({ error: 'GHL not enabled' }, { status: 400 });
  }

  const body = await request.json();
  const mode = body.mode as string; // 'preview' | 'send-email' | 'send-sms' | 'send-both'

  // Find all Parliament House contacts
  const searchRes = await ghlRequest(
    `/contacts/?locationId=${GHL_LOCATION_ID}&query=goods-src-parliament-house-demo&limit=100`,
    'GET'
  );
  const searchData = await searchRes.json();
  const allContacts = (searchData.contacts || []) as Array<{
    id: string;
    name?: string;
    firstName?: string;
    email?: string;
    phone?: string;
    tags?: string[];
  }>;

  // Filter to only those with the parliament tag
  const contacts = allContacts.filter((c) =>
    c.tags?.includes('goods-src-parliament-house-demo')
  );

  if (mode === 'preview') {
    return NextResponse.json({
      contactCount: contacts.length,
      contacts: contacts.map((c) => ({
        name: c.name || c.firstName,
        email: c.email,
        phone: c.phone,
        tags: c.tags,
      })),
      emailSubject: 'The bed you just saw — here\'s the full story',
      emailPreview: EMAIL_BODY.substring(0, 200) + '...',
      smsPreview: SMS_BODY,
    });
  }

  const results: Array<{ contact: string; email?: string; sms?: string }> = [];

  for (const contact of contacts) {
    const result: { contact: string; email?: string; sms?: string } = {
      contact: contact.name || contact.email || contact.id,
    };

    // Send email
    if ((mode === 'send-email' || mode === 'send-both') && contact.email) {
      try {
        const emailRes = await ghlRequest('/conversations/messages', 'POST', {
          type: 'Email',
          locationId: GHL_LOCATION_ID,
          contactId: contact.id,
          subject: 'The bed you just saw — here\'s the full story',
          body: EMAIL_BODY.replace('{{contact.first_name}}', contact.firstName || contact.name || 'there'),
          emailFrom: `Benjamin Knight <ben@goodsoncountry.com>`,
        });
        result.email = emailRes.ok ? 'sent' : `error: ${emailRes.status}`;
      } catch (e) {
        result.email = `error: ${e}`;
      }
    }

    // Send SMS
    if ((mode === 'send-sms' || mode === 'send-both') && contact.phone) {
      try {
        const smsRes = await ghlRequest('/conversations/messages', 'POST', {
          type: 'SMS',
          locationId: GHL_LOCATION_ID,
          contactId: contact.id,
          body: SMS_BODY.replace('{{contact.first_name}}', contact.firstName || contact.name || 'there'),
        });
        result.sms = smsRes.ok ? 'sent' : `error: ${smsRes.status}`;
      } catch (e) {
        result.sms = `error: ${e}`;
      }
    }

    results.push(result);
  }

  return NextResponse.json({
    mode,
    sent: results.length,
    results,
  });
}

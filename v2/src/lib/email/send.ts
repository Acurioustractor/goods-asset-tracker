/**
 * Email sending utility with Goods on Country brand templates.
 *
 * Uses Resend API if RESEND_API_KEY is set, otherwise logs only.
 * Adapted from JusticeHub email patterns.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_ENABLED = !!RESEND_API_KEY;
const FROM_ADDRESS = process.env.EMAIL_FROM || 'Goods on Country <hello@goodsoncountry.com>';
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'ben@goodsoncountry.com';

interface SendEmailOptions {
  to: string;
  subject: string;
  body: string; // Plain text body — will be wrapped in brand template
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
  simulated?: boolean;
}

/**
 * Wrap plain text in Goods on Country branded HTML email template
 */
function brandTemplate(body: string, subject: string): string {
  const htmlBody = body
    .split('\n\n')
    .map(p => `<p style="margin: 0 0 16px; line-height: 1.6;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Georgia, 'Times New Roman', serif;">
  <table role="presentation" width="100%" style="background-color: #f9fafb; padding: 32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" style="max-width: 600px; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr>
          <td style="background-color: #1e293b; padding: 24px 32px;">
            <span style="color: #f97316; font-size: 20px; font-weight: bold; font-family: Georgia, serif;">Goods</span>
            <span style="color: white; font-size: 20px; font-weight: bold; font-family: Georgia, serif;"> on Country</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding: 32px; color: #1e293b; font-size: 16px;">
            ${htmlBody}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
            <p style="margin: 0 0 8px;">Goods on Country &mdash; Quality goods for remote communities</p>
            <p style="margin: 0;"><a href="https://www.goodsoncountry.com" style="color: #f97316;">www.goodsoncountry.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Send a single branded email via Resend
 */
export async function sendEmail(opts: SendEmailOptions): Promise<SendEmailResult> {
  if (!EMAIL_ENABLED) {
    console.log('[Email] Disabled — would send:', { to: opts.to, subject: opts.subject });
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: opts.to,
        subject: opts.subject,
        html: brandTemplate(opts.body, opts.subject),
        text: opts.body,
        reply_to: opts.replyTo || REPLY_TO,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Email] Send failed:', errorText);
      return { success: false, error: errorText };
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Email] Send error:', message);
    return { success: false, error: message };
  }
}

/**
 * Send batch emails with rate limiting (300ms between sends)
 */
export async function sendBatchEmail(
  emails: SendEmailOptions[],
): Promise<{ sent: number; failed: number; simulated: boolean }> {
  if (!EMAIL_ENABLED) {
    console.log(`[Email] Disabled — would batch send ${emails.length} email(s)`);
    return { sent: emails.length, failed: 0, simulated: true };
  }

  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    const result = await sendEmail(email);
    if (result.success) {
      sent++;
    } else {
      failed++;
    }
    // Rate limit: 300ms between sends
    if (emails.indexOf(email) < emails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  return { sent, failed, simulated: false };
}

// ── Pre-built email templates ──

export function followupEmail(contactName: string, stage: string): SendEmailOptions & { bodyText: string } {
  const name = contactName || 'there';
  const body = `Hi ${name},

I wanted to follow up on our conversation about Goods on Country. We're building quality furniture for remote Indigenous communities — beds that last 10+ years, made from recycled plastic, right on country.

${stage === 'proposal_sent' ? `I'd love to hear your thoughts on the proposal. Happy to jump on a quick call to discuss any questions.` : ''}
${stage === 'in_discussion' ? `Just checking in to see if you had any further questions. We're ready to move forward whenever you are.` : ''}
${stage === 'contacted' ? `Would be great to chat about how we might work together. What does your schedule look like this week?` : ''}

Warm regards,
Ben Knight
Goods on Country`;

  return {
    to: '', // Caller fills this in
    subject: `Following up — Goods on Country`,
    body,
    bodyText: body,
  };
}

export function staleReEngagementEmail(contactName: string): SendEmailOptions & { bodyText: string } {
  const name = contactName || 'there';
  const body = `Hi ${name},

It's been a while since we last connected. Goods on Country has been making great progress — we've deployed beds across multiple remote communities and our on-country manufacturing is ramping up.

If the timing is better now, I'd love to reconnect and share what we've been up to.

No pressure at all — just wanted to keep the door open.

Warm regards,
Ben Knight
Goods on Country`;

  return {
    to: '',
    subject: `Reconnecting — Goods on Country`,
    body,
    bodyText: body,
  };
}

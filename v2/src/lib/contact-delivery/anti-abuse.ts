import { createHmac } from 'node:crypto';
import { createServiceClient } from '@/lib/supabase/server';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 12;

type ContactGuardResult = {
  allowed: boolean;
  fingerprint?: string;
  reason?: 'honeypot' | 'rate-limit';
};

function clientAddress(request: Request) {
  return (
    request.headers.get('x-vercel-forwarded-for') ||
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    ''
  ).trim();
}

/**
 * Shared, privacy-preserving abuse guard for public message forms. The raw IP
 * is never stored; a server-secret HMAC is retained in the protected outbox so
 * limits work across serverless instances rather than only in process memory.
 */
export async function guardContactSubmission(
  request: Request,
  options: { honeypot?: unknown; identity?: string },
): Promise<ContactGuardResult> {
  if (typeof options.honeypot === 'string' && options.honeypot.trim()) {
    return { allowed: false, reason: 'honeypot' };
  }

  const secret =
    process.env.CONTACT_RATE_LIMIT_SECRET ||
    process.env.CRON_SECRET ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  // Prefer the edge-provided address so rotating fake email addresses does not
  // reset the bucket. Identity is only the fallback for non-edge environments.
  const key = clientAddress(request) || options.identity?.trim().toLowerCase() || '';
  if (!secret || !key) return { allowed: true };

  const fingerprint = createHmac('sha256', secret).update(key).digest('hex');
  try {
    const supabase = createServiceClient();
    const { count, error } = await supabase
      .from('contact_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('payload->>_clientFingerprint', fingerprint)
      .gte('created_at', new Date(Date.now() - WINDOW_MS).toISOString());
    if (error) throw error;
    if ((count || 0) >= MAX_SUBMISSIONS_PER_WINDOW) {
      return { allowed: false, fingerprint, reason: 'rate-limit' };
    }
  } catch (error) {
    // Receipt remains fail-open if the rate-limit query itself is unavailable;
    // the durable outbox and provider-level controls still protect delivery.
    console.error('[Contact delivery] Rate-limit check failed:', error);
  }

  return { allowed: true, fingerprint };
}

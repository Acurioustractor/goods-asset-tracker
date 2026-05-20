import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import { createServiceClient } from '@/lib/supabase/server';

const BOT_UA_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /facebookexternalhit/i,
  /slack/i,
  /whatsapp/i,
  /telegram/i,
  /discord/i,
  /twitter/i,
  /linkedinbot/i,
  /preview/i,        // generic "X-Preview" UA used by iMessage etc.
  /skypeuripreview/i,
  /pinterest/i,
  /embedly/i,
  /vercelbot/i,
  /lighthouse/i,
  /headlesschrome/i,
];

function looksLikeBot(ua: string | null): boolean {
  if (!ua) return true; // no UA = treat as bot
  return BOT_UA_PATTERNS.some((re) => re.test(ua));
}

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.SCAN_IP_HASH_SALT || 'goods-on-country-default-salt';
  return createHash('sha256').update(salt + ip).digest('hex').slice(0, 32);
}

interface LogScanInput {
  unique_id: string;
  isAdmin: boolean;
  adminEmail?: string | null;
}

/**
 * Fire-and-forget scan logger. Never throws — analytics shouldn't ever break
 * the bed page render. If the bed_scans table doesn't exist yet (migration
 * not applied), the insert silently no-ops.
 */
export async function logScan({ unique_id, isAdmin, adminEmail }: LogScanInput): Promise<void> {
  try {
    const h = await headers();
    const ua = h.get('user-agent');
    const referer = h.get('referer');
    // Vercel sets x-forwarded-for; in dev, x-real-ip; fall back to remote-addr.
    const fwd = h.get('x-forwarded-for') || h.get('x-real-ip') || null;
    const ip = fwd ? fwd.split(',')[0].trim() : null;

    const supabase = createServiceClient();
    await supabase.from('bed_scans').insert({
      unique_id,
      user_agent: ua ? ua.slice(0, 500) : null,
      ip_hash: hashIp(ip),
      referer: referer ? referer.slice(0, 500) : null,
      is_bot: looksLikeBot(ua),
      is_admin: isAdmin,
      admin_email: isAdmin ? adminEmail || null : null,
    });
  } catch {
    // Swallow. We never want analytics to surface as a user-facing error.
  }
}

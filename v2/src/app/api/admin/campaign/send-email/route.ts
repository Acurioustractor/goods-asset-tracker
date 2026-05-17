import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { sendEmail } from '@/lib/email/send';

export const runtime = 'nodejs';

/**
 * Admin-only email sending endpoint for campaign compose tab.
 */
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  try {
    const { to, subject, body } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sendEmail({ to, subject, body });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Campaign Email] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send' },
      { status: 500 },
    );
  }
}

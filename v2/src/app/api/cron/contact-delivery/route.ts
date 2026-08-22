import { NextRequest, NextResponse } from 'next/server';
import { retryInboxDeliveries } from '@/lib/contact-delivery';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    return NextResponse.json({ ok: true, ...(await retryInboxDeliveries()) });
  } catch (error) {
    console.error('[contact-delivery cron] failed', error);
    return NextResponse.json({ error: 'Retry job failed' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getPartnerDashboard } from '@/lib/data/partner-dashboards';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { password } = await request.json();

  const partner = getPartnerDashboard(slug);
  if (!partner) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (password === partner.password) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(`partner_${slug}`, password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}

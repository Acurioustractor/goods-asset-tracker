import { NextRequest, NextResponse } from 'next/server';
import { getFunderPage } from '@/lib/data/funder-pages';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { password } = await request.json();

  const funder = getFunderPage(slug);
  if (!funder) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (password === funder.password) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(`funder_${slug}`, password, {
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

import { NextResponse } from 'next/server'

const COOKIE_NAME = 'insiders_auth'
const THIRTY_DAYS = 60 * 60 * 24 * 30

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { password } = body as { password?: string }
  const expected = process.env.INSIDERS_PASSWORD || 'goods2026'

  if (!password || password !== expected) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: THIRTY_DAYS,
    path: '/',
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return response
}

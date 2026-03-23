import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require user authentication (phone-based)
const protectedUserRoutes = ['/my-items', '/community', '/production']

// Routes protected by simple password (cookie-based)
const passwordProtectedRoutes = ['/impact', '/api/impact']
const PASSWORD_COOKIE = 'impact_auth'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Password-protect specific routes via cookie
  const isPasswordProtected = passwordProtectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  if (isPasswordProtected && pathname !== '/impact/login' && pathname !== '/api/impact/auth') {
    const authCookie = request.cookies.get(PASSWORD_COOKIE)?.value
    const expectedPassword = process.env.IMPACT_PASSWORD || 'goods2026'
    if (authCookie !== expectedPassword) {
      const loginUrl = new URL('/impact/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // QR code redirect: /?asset_id=GB0-153-1 → /bed/GB0-153-1
  // Only redirect from the root path (old QR codes encode /?asset_id=X)
  if (pathname === '/') {
    const assetId = request.nextUrl.searchParams.get('asset_id');
    if (assetId) {
      return NextResponse.redirect(new URL(`/bed/${assetId}`, request.url));
    }
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  // Admin auth: protect /admin routes except login and unauthorized pages
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/admin/unauthorized')
  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Check if current path requires user authentication
  const isProtectedUserRoute = protectedUserRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isProtectedUserRoute && !user) {
    // Redirect to phone login with return URL
    const loginUrl = new URL('/auth/phone-login', request.url)
    loginUrl.searchParams.set('from', pathname)

    // If accessing claim page, preserve asset_id
    if (pathname.startsWith('/claim/')) {
      const assetId = pathname.split('/')[2]
      if (assetId) {
        loginUrl.searchParams.set('asset_id', assetId)
      }
    }

    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

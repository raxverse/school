import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/auth', '/login']

const ROLE_ROUTES: Record<string, string> = {
  admin: '/admin',
  teacher: '/teacher',
  student: '/student',
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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

  const { data } = await supabase.auth.getClaims()
  const user = data?.claims
  const pathname = request.nextUrl.pathname

  // Allow public paths
  const isPublicPath = PUBLIC_PATHS.some(p => pathname.startsWith(p))
  if (isPublicPath) {
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.sub)
        .maybeSingle()

      const role = (profileData as { role: string } | null)?.role || 'student'
      const redirectPath = ROLE_ROUTES[role] || '/student'
      if (pathname !== redirectPath) {
        const url = request.nextUrl.clone()
        url.pathname = redirectPath
        return NextResponse.redirect(url)
      }
    }
    return supabaseResponse
  }

  // Not logged in -> redirect to login
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Logged in: check role-based access for protected routes
  const { data: profileData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.sub)
    .maybeSingle()

  const role = (profileData as { role: string } | null)?.role || 'student'

  // Redirect root to role dashboard
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = ROLE_ROUTES[role] || '/student'
    return NextResponse.redirect(url)
  }

  // Check if user is accessing the correct role route
  const roleRoute = ROLE_ROUTES[role] || '/student'
  if (pathname.startsWith('/admin') && role !== 'admin') {
    const url = request.nextUrl.clone()
    url.pathname = roleRoute
    return NextResponse.redirect(url)
  }
  if (pathname.startsWith('/teacher') && role !== 'teacher' && role !== 'admin') {
    const url = request.nextUrl.clone()
    url.pathname = roleRoute
    return NextResponse.redirect(url)
  }
  if (pathname.startsWith('/student') && role !== 'student' && role !== 'admin' && role !== 'teacher') {
    const url = request.nextUrl.clone()
    url.pathname = roleRoute
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isOnboarding = req.nextUrl.pathname.startsWith('/onboarding')

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/auth/signin?callbackUrl=${encodeURIComponent(from)}`, req.url)
      )
    }

    // Redirect to onboarding if not completed
    if (!token.onboardingCompleted && !isOnboarding) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }

    // Redirect to dashboard if trying to access onboarding after completion
    if (token.onboardingCompleted && isOnboarding) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/meal-plans/:path*',
    '/progress/:path*',
    '/settings/:path*',
    '/onboarding/:path*',
    '/auth/:path*',
  ],
}

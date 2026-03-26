// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Define the routes that require a user to be logged in
const protectedRoutes = ['/dashboard', '/admin', '/teacher', '/my-profile'];

// 2. Define the routes that logged-in users shouldn't see (like the login page)
const authRoutes = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // better-auth securely stores the session in a cookie. 
  // We check if that cookie exists. (Note: The exact name might vary slightly 
  // depending on your better-auth config, but it usually contains 'better-auth').
  const sessionCookie = request.cookies.get('better-auth.session_token') || 
                        request.cookies.get('__Secure-better-auth.session_token');

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Scenario A: Unauthenticated user tries to access the Dashboard
  if (isProtectedRoute && !sessionCookie) {
    // Redirect them to the login page, but remember where they were trying to go!
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Scenario B: Logged-in user tries to visit the Login or Register page
  if (isAuthRoute && sessionCookie) {
    // Bounce them straight into the dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Scenario C: Everything is fine, let the request proceed normally
  return NextResponse.next();
}

// 3. The Matcher (Performance Optimization)
// This tells Next.js EXACTLY which URLs should trigger this middleware.
// We exclude static files, images, and API routes so the edge function runs blazingly fast.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
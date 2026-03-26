// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Define the routes that require a user to be logged in
const protectedRoutes = ['/dashboard', '/admin', '/teacher', '/my-profile'];

// 2. Define the routes that logged-in users shouldn't see (like the login page)
const authRoutes = ['/login', '/register', '/forgot-password'];

// FIX: Renamed function from 'middleware' to 'proxy'
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // better-auth securely stores the session in a cookie. 
  const sessionCookie = request.cookies.get('better-auth.session_token') || 
                        request.cookies.get('__Secure-better-auth.session_token');

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Scenario A: Unauthenticated user tries to access the Dashboard
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Scenario B: Logged-in user tries to visit the Login or Register page
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Scenario C: Everything is fine, let the request proceed normally
  return NextResponse.next();
}

// 3. The Matcher (Performance Optimization)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
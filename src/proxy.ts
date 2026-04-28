// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getRouteOwner,
  getDefaultDashboardRoute,
  UserRole,
} from "./lib/authUtils";

const authRoutes = ["/login", "/register", "/forgot-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const routeOwner = getRouteOwner(pathname);
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Scenario A: Unauthenticated user trying to access protected route
  // if (routeOwner !== null && !sessionCookie) {
  //   const loginUrl = new URL("/login", request.url);
  //   loginUrl.searchParams.set("callbackUrl", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  // Scenario B: Logged In User
  if (sessionCookie) {
    let userRole: UserRole | null = null;

    // 👉 1. Fetch the role FIRST if they are on an auth route OR a protected route
    if (isAuthRoute || (routeOwner !== null && routeOwner !== "COMMON")) {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
        const authUrl = `${baseUrl}/api/auth/get-session`;

        const sessionResponse = await fetch(authUrl, {
          headers: { cookie: request.headers.get("cookie") || "" },
        });

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          userRole = sessionData?.user?.role?.toUpperCase() as UserRole;
        }
      } catch (error) {
        console.error("Middleware Auth Fetch Error:", error);
      }
    }

    // 👉 2. The Login Redirect: Send them to their specific home base!
    if (isAuthRoute) {
      const defaultRoute = userRole
        ? getDefaultDashboardRoute(userRole)
        : "/dashboard";
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    }

    // 👉 3. THE VAULT: Security Checks
    if (routeOwner !== null && routeOwner !== "COMMON") {
      // ✨ THE SMART ROUTER EXCEPTION ✨
      // If a Teacher/Admin hits exactly "/dashboard" or "/dashboard/", instantly route
      // them to their actual home. (This handles standard login redirects gracefully).
      if (
        (pathname === "/dashboard" || pathname === "/dashboard/") &&
        userRole &&
        userRole !== "STUDENT"
      ) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole), request.url),
        );
      }

      // 🛑 The Strict Vault Door: If they try to access a deep student route
      // (like /dashboard/my-courses), or roles don't match, SLAM THE DOOR.
      if (!userRole || routeOwner !== userRole) {
        console.warn(
          `[SECURITY] Blocked access to ${pathname}. Expected ${routeOwner}, got ${userRole}`,
        );
        return NextResponse.rewrite(new URL("/404", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

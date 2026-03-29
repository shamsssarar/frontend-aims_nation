// src/lib/authUtils.ts

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN" | "USER";

export function getRouteOwner(pathname: string): UserRole | "COMMON" | null {
  // 1. Common Protected Routes (Everyone logged in can access)
  if (pathname.startsWith("/dashboard/settings")) return "COMMON";

  // 2. Role-Specific Routes
  if (pathname.startsWith("/teacher")) return "TEACHER";
  if (pathname.startsWith("/admin")) return "ADMIN";
  
  // Notice we put /dashboard AFTER /dashboard/settings to prevent conflicts.
  // This covers "/dashboard" and "/dashboard/my-courses" etc.
  if (pathname.startsWith("/dashboard")) return "STUDENT"; 

  // 3. Public Routes (Home, Login, etc.)
  return null; 
}

export function getDefaultDashboardRoute(role: UserRole): string {
  switch (role) {
    case "TEACHER": return "/teacher/dashboard";
    case "ADMIN": return "/admin/dashboard";
    case "STUDENT": 
    default: return "/dashboard";
  }
}
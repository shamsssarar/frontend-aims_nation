"use client";

import {
  Home,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut, authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { title } from "process";

// Our navigation blueprint matching the backend APIs we built
const navItems = [
  // 👉 Universal Links (Everyone sees these)
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    allowedRoles: ["STUDENT", "TEACHER", "ADMIN", "USER"],
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    allowedRoles: ["STUDENT", "TEACHER", "ADMIN", "USER"],
  },

  // 👉 Student Links
  {
    title: "My Courses",
    url: "/dashboard/my-courses",
    icon: BookOpen,
    allowedRoles: ["STUDENT", "USER"],
  },
  {
    title: "My Invoices",
    url: "/dashboard/my-invoices",
    icon: FileText,
    allowedRoles: ["STUDENT", "USER"],
  },

  // 👉 Teacher Links
  {
    title: "My Classes",
    url: "/teacher/dashboard/classes",
    icon: GraduationCap,
    allowedRoles: ["TEACHER"],
  },
  {
    title: "Upload Materials",
    url: "/teacher/dashboard/materials",
    icon: FileText,
    allowedRoles: ["TEACHER"],
  },

  // 👉 Admin Links (The Command Center)
  {
    title: "Manage Courses",
    url: "/admin/dashboard/courses-management",
    icon: BookOpen,
    allowedRoles: ["ADMIN"],
  },
  {
    title: "Financial Hub",
    url: "/admin/dashboard/financials-management",
    icon: FileText,
    allowedRoles: ["ADMIN"],
  },
  {
    title: "Careers (ATS)",
    url: "/admin/dashboard/careers-management",
    icon: Briefcase,
    allowedRoles: ["ADMIN"],
  },
  {
    title: "Teacher Management",
    url: "/admin/dashboard/teachers-management",
    icon: Settings,
    allowedRoles: ["ADMIN"],
  },
  {
    title: "Hire Teacher",
    url: "/admin/dashboard/hire-teacher",
    icon: Briefcase,
    allowedRoles: ["ADMIN"],
  },
  {
    title: "Student Management",
    url: "/admin/dashboard/students-management",
    icon: GraduationCap,
    allowedRoles: ["ADMIN"],
  },
];


export function AppSidebar() {
  const router = useRouter();
  const { data: session } = useSession();
  const { setOpenMobile } = useSidebar();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const userRole = (session?.user as any)?.role?.toUpperCase() || "STUDENT";

  // Only keep the links where the user's role exists in the allowedRoles array
  const filteredItems = navItems.filter((item) =>
    item.allowedRoles.includes(userRole),
  );

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
            A
          </div>
          AiMS Nation
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex flex-col gap-2">
          <div className="px-2 text-sm">
            <p className="font-semibold text-foreground truncate">
              {session?.user?.name || "Loading..."}
            </p>
            <p className="text-xs truncate uppercase font-medium text-primary">
              {userRole}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
          <SidebarMenuButton
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
